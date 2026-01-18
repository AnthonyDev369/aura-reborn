"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { ShoppingBag, Heart, LogOut, Package, ArrowRight } from "lucide-react";
import OrderTimeline from "@/components/OrderTimeline";
import type { Perfume } from "@/lib/types";

interface Order {
  id: string;
  created_at: string;
  total_cents: number;
  status: string;
  customer_name: string;
  city: string;
  address: string;
  whatsapp: string;
  tracking_number?: string;
  courier?: string;
  estimated_delivery?: string;
}

interface OrderItem {
  id: string;
  perfume_name: string;
  perfume_price_cents: number;
  qty: number;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});

  useEffect(() => {
    loadUserData();
  }, []);

async function loadUserData() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    router.push("/login");
    return;
  }
  
  setUser(user);

  // Cargar órdenes
  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ordersData) {
    setOrders(ordersData);
    
    // Cargar items de cada orden
    const itemsMap: Record<string, OrderItem[]> = {};
    for (const order of ordersData) {
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);
      
      if (items) {
        itemsMap[order.id] = items;
      }
    }
    setOrderItems(itemsMap);
  }

  // Cargar favoritos
  const { data: wishlistData } = await supabase
    .from("wishlist")
    .select("perfume_id")
    .eq("user_id", user.id);

  if (wishlistData && wishlistData.length > 0) {
    const perfumeIds = wishlistData.map(w => w.perfume_id);
    const { data: perfumes } = await supabase
      .from("perfumes")
      .select("*")
      .in("id", perfumeIds);
    
    if (perfumes) setFavorites(perfumes);
  }

  setLoading(false);
}

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      esperando_pago: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
      confirmado: "bg-blue-500/10 text-blue-500 border-blue-500/30",
      preparando: "bg-purple-500/10 text-purple-500 border-purple-500/30",
      enviado: "bg-accent/10 text-accent border-accent/30",
      entregado: "bg-green-500/10 text-green-500 border-green-500/30"
    };
    return colors[status] || "bg-white/5 text-white border-white/10";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      esperando_pago: "Esperando Pago",
      confirmado: "Pago Confirmado",
      preparando: "En Preparación",
      enviado: "Enviado",
      entregado: "Entregado"
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-white text-xl font-serif">Cargando tu cuenta...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg py-32 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-16 pb-8 border-b border-glassBorder">
          <div>
            <h1 className="text-5xl font-serif text-white mb-4 tracking-tighter">Mi Cuenta</h1>
            <p className="text-muted text-sm tracking-widest uppercase">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-3 rounded-full border border-glassBorder text-white hover:bg-accent hover:text-bg hover:border-accent transition-all">
            <LogOut className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest font-bold">Cerrar Sesión</span>
          </button>
        </div>

        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <Package className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-serif text-white">Mis Pedidos</h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="glass-panel p-20 rounded-[40px] text-center">
              <ShoppingBag className="h-16 w-16 text-accent/20 mx-auto mb-6" />
              <p className="text-muted text-sm uppercase tracking-widest">Aún no has realizado pedidos</p>
              <button onClick={() => router.push("/")} className="mt-8 px-8 py-4 bg-accent text-bg rounded-full text-xs uppercase tracking-widest font-bold hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all">
                Explorar Colección
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
  <div key={order.id} className="glass-panel p-8 rounded-[30px] border border-glassBorder hover:border-accent/30 transition-all">
    <div className="flex justify-between items-start mb-6">
      <div>
        <p className="text-white font-bold text-lg mb-2">Orden #{order.id.slice(0, 8).toUpperCase()}</p>
        <p className="text-muted text-xs uppercase tracking-widest">{order.city} • {new Date(order.created_at).toLocaleDateString('es-EC')}</p>
      </div>
      <div className="text-right">
        <p className="text-accent font-black text-2xl mb-2">${(order.total_cents / 100).toFixed(2)}</p>
        <span className={`inline-block px-4 py-1 rounded-full border text-[10px] uppercase tracking-widest font-bold ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>
    </div>
    
    <OrderTimeline status={order.status} trackingNumber={order.tracking_number} courier={order.courier} estimatedDelivery={order.estimated_delivery} />
    
    <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)} className="mt-6 w-full py-3 rounded-xl border border-glassBorder text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold">
      {selectedOrder?.id === order.id ? "Ocultar Detalles" : "Ver Detalles Completos"}
      <ArrowRight className="h-4 w-4" />
    </button>
    
    {selectedOrder?.id === order.id && (
      <div className="mt-6 p-6 rounded-xl bg-white/[0.02] border border-glassBorder space-y-6">
        <div className="grid grid-cols-2 gap-6 pb-6 border-b border-glassBorder/30">
          <div>
            <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Cliente</p>
            <p className="text-white font-medium text-sm">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Ciudad</p>
            <p className="text-white font-medium text-sm">{order.city}</p>
          </div>
        </div>

        {orderItems[order.id] && orderItems[order.id].length > 0 && (
          <div>
            <p className="text-white font-bold text-sm mb-4 uppercase tracking-widest">Productos:</p>
            <div className="space-y-3">
              {orderItems[order.id].map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-glassBorder/50">
                  <div>
                    <p className="text-white font-serif text-sm">{item.perfume_name}</p>
                    <p className="text-muted text-xs">Cantidad: {item.qty}</p>
                  </div>
                  <p className="text-accent font-bold text-sm">${(item.perfume_price_cents / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.status === 'enviado' && order.tracking_number && (
          <div className="p-5 rounded-xl bg-accent/5 border border-accent/20">
            <p className="text-accent font-bold text-xs uppercase tracking-widest mb-3">Información de Envío</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Courier:</span>
                <span className="text-white font-bold">{order.courier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Guía:</span>
                <span className="text-accent font-bold">{order.tracking_number}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <Heart className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-serif text-white">Mis Favoritos</h2>
          </div>
          
          {favorites.length === 0 ? (
            <div className="glass-panel p-20 rounded-[40px] text-center">
              <Heart className="h-16 w-16 text-accent/20 mx-auto mb-6" />
              <p className="text-muted text-sm uppercase tracking-widest">No tienes favoritos guardados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {favorites.map((perfume) => (
                <div key={perfume.id} onClick={() => router.push("/")} className="glass-panel p-6 rounded-[30px] cursor-pointer hover:border-accent transition-all">
                  <div className="h-48 bg-white/5 rounded-xl mb-4 overflow-hidden">
                    {perfume.image_url && <img src={perfume.image_url} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />}
                  </div>
                  <h3 className="text-white font-serif text-lg mb-2">{perfume.name}</h3>
                  <p className="text-accent font-bold">${(perfume.price_cents / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
