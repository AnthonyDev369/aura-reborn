"use client";

/**
 * ════════════════════════════════════════════════════════════
 * ACCOUNT PAGE - ÍKHOR
 * ════════════════════════════════════════════════════════════
 * 
 * Panel del cliente donde ve:
 * - Sus datos de cuenta
 * - Historial de pedidos con tracking
 * - Favoritos guardados
 * 
 * Diseño: Minimalista ÍKHOR (blanco + platino)
 * ════════════════════════════════════════════════════════════
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { ShoppingBag, Heart, LogOut, Package, ArrowRight } from "lucide-react";
import OrderTimeline from "@/components/OrderTimeline";
import type { Perfume } from "@/lib/types";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  city: string;
  address: string;
  whatsapp: string;
  total_cents: number;
  status: string;
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
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [favorites, setFavorites] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (ordersData) {
      setOrders(ordersData);
      
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
    esperando_pago: "bg-accent/10 text-text border-accent/30",
    confirmado: "bg-text/5 text-text border-text/20",
    preparando: "bg-accent/15 text-text border-accent/40",
    enviado: "bg-text/10 text-text border-text/30",
    entregado: "bg-text/5 text-text/60 border-text/20"
  };
  return colors[status] || "bg-bg text-text border-glassBorder";
};

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      esperando_pago: "Esperando Pago",
      confirmado: "Confirmado",
      preparando: "Preparando",
      enviado: "Enviado",
      entregado: "Entregado"
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text text-xl font-serif">Cargando...</div>
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-bg py-32 px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ════════════════════════════════════════════ */}
        {/* HEADER                                       */}
        {/* ════════════════════════════════════════════ */}
        <div className="flex justify-between items-center mb-16 pb-8 border-b border-glassBorder">
          <div>
            {/* Barra decorativa */}
            <div className="h-1 w-12 bg-accent/30 rounded-full mb-4" />
            
            <h1 className="text-5xl font-serif text-text mb-4 tracking-tight">Mi Cuenta</h1>
            <p className="text-muted text-sm tracking-wide uppercase">{user?.email}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 rounded-full border border-glassBorder text-text hover:bg-accent hover:text-white hover:border-accent transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest font-bold">Salir</span>
          </button>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* MIS PEDIDOS                                  */}
        {/* ════════════════════════════════════════════ */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <Package className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-serif text-text">Mis Pedidos</h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white border border-glassBorder p-20 rounded-3xl text-center">
              <ShoppingBag className="h-16 w-16 text-accent/30 mx-auto mb-6" />
              <p className="text-muted text-sm uppercase tracking-widest">Aún no has realizado pedidos</p>
              <button
                onClick={() => router.push("/")}
                className="mt-8 px-8 py-4 bg-text text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-accent transition-all"
              >
                Explorar Colección
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-glassBorder p-8 rounded-3xl hover:border-accent transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-text font-bold text-lg mb-2">Orden #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-muted text-xs uppercase tracking-widest">
                        {order.city} • {new Date(order.created_at).toLocaleDateString('es-EC')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-text font-bold text-2xl mb-2">${(order.total_cents / 100).toFixed(2)}</p>
                      <span className={`inline-block px-4 py-1 rounded-full border text-[10px] uppercase tracking-widest font-bold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      {order.is_preorder && (
  <span className="inline-block px-4 py-1 ml-2 rounded-full border text-[10px] uppercase tracking-widest font-bold bg-blue-50 text-blue-700 border-blue-200">
    🕐 PRE-ORDEN
  </span>
)}
                    </div>
                  </div>
                  
                  <OrderTimeline 
                    status={order.status} 
                    trackingNumber={order.tracking_number} 
                    courier={order.courier} 
                    estimatedDelivery={order.estimated_delivery} 
                  />
                  {order.is_preorder && order.preorder_estimated_arrival && (
  <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
    <p className="text-blue-700 text-sm font-bold">
      📦 Pre-orden: Llega aproximadamente el {new Date(order.preorder_estimated_arrival).toLocaleDateString('es-EC', { day: 'numeric', month: 'long' })}
    </p>
  </div>
)}
                  <button 
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)} 
                    className="mt-6 w-full py-3 rounded-xl border border-glassBorder text-text hover:bg-bg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold"
                  >
                    {selectedOrder?.id === order.id ? "Ocultar" : "Ver Detalles"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  {/* Detalles Expandidos de la Orden */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 p-6 rounded-xl bg-bg border border-glassBorder space-y-6">
                      <div className="grid grid-cols-2 gap-6 pb-6 border-b border-glassBorder">
                        <div>
                          <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Cliente</p>
                          <p className="text-text font-medium text-sm">{order.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Ciudad</p>
                          <p className="text-text font-medium text-sm">{order.city}</p>
                        </div>
                      </div>

                      {orderItems[order.id] && orderItems[order.id].length > 0 && (
                        <div>
                          <p className="text-text font-bold text-sm mb-4 uppercase tracking-widest">Productos:</p>
                          <div className="space-y-3">
                            {orderItems[order.id].map((item) => (
                              <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-white border border-glassBorder">
                                <div>
                                  <p className="text-text font-serif text-sm">{item.perfume_name}</p>
                                  <p className="text-muted text-xs">Cantidad: {item.qty}</p>
                                </div>
                                <p className="text-text font-bold text-sm">${(item.perfume_price_cents / 100).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {order.status === 'enviado' && order.tracking_number && (
                        <div className="p-5 rounded-xl bg-accent/10 border border-accent/30">
                          <p className="text-text font-bold text-xs uppercase tracking-widest mb-3">Información de Envío</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted">Courier:</span>
                              <span className="text-text font-bold">{order.courier}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted">Guía:</span>
                              <span className="text-text font-bold">{order.tracking_number}</span>
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

        {/* ════════════════════════════════════════════ */}
        {/* MIS FAVORITOS                                */}
        {/* ════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Heart className="h-6 w-6 text-accent" />
            <h2 className="text-3xl font-serif text-text">Mis Favoritos</h2>
          </div>
          
          {favorites.length === 0 ? (
            <div className="bg-white border border-glassBorder p-20 rounded-3xl text-center">
              <Heart className="h-16 w-16 text-accent/30 mx-auto mb-6" />
              <p className="text-muted text-sm uppercase tracking-widest">No tienes favoritos guardados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {favorites.map((perfume) => (
                <div 
                  key={perfume.id} 
                  onClick={() => router.push("/")} 
                  className="bg-white border border-glassBorder p-6 rounded-3xl cursor-pointer hover:border-accent transition-all"
                >
                  <div className="h-48 bg-bg rounded-xl mb-4 overflow-hidden">
                    {perfume.image_url && (
                      <img 
                        src={perfume.image_url} 
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" 
                      />
                    )}
                  </div>
                  <h3 className="text-text font-serif text-lg mb-2">{perfume.name}</h3>
                  <p className="text-text font-bold">${(perfume.price_cents / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
