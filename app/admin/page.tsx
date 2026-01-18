"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Package, Edit, Save, X } from "lucide-react";

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

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Order>>({});
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    router.push("/login");
    return;
  }
  
  // SEGURIDAD: Solo permitir acceso al admin (TU EMAIL)
  const ADMIN_EMAIL = "anthonybarreiro369@gmail.com"; // ← Cambia por tu email real
  
  if (user.email !== ADMIN_EMAIL) {
    alert("Acceso denegado. Solo administradores.");
    router.push("/");
    return;
  }
  
  // Cargar todas las órdenes
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (data) setOrders(data);
}

  async function handleUpdate(orderId: string) {
    const supabase = createClient();
    
    const { error } = await supabase
      .from("orders")
      .update(editData)
      .eq("id", orderId);

    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      alert("Orden actualizada exitosamente");
      setEditingId(null);
      loadOrders();
    }
  }

  const startEdit = (order: Order) => {
    setEditingId(order.id);
    setEditData({
      status: order.status,
      tracking_number: order.tracking_number || "",
      courier: order.courier || "Servientrega",
      estimated_delivery: order.estimated_delivery || ""
    });
  };

  return (
    <main className="min-h-screen bg-bg py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 pb-8 border-b border-glassBorder">
          <h1 className="text-5xl font-serif text-white mb-4 tracking-tighter">Panel de Administración</h1>
          <p className="text-muted text-sm uppercase tracking-widest">Gestión de Órdenes</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="glass-panel p-8 rounded-[30px] border border-glassBorder">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-white font-bold text-lg">Orden #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-muted text-xs mt-1">{order.customer_name} • {order.city}</p>
                  <p className="text-muted text-xs">{order.whatsapp}</p>
                </div>
                <p className="text-accent font-black text-2xl">${(order.total_cents / 100).toFixed(2)}</p>
              </div>

              {editingId === order.id ? (
                <div className="space-y-4 p-6 rounded-xl bg-white/[0.02] border border-accent/20">
                  <select 
                    value={editData.status} 
                    onChange={(e) => setEditData({...editData, status: e.target.value})}
                    className="w-full bg-white/5 border border-glassBorder rounded-xl p-3 text-white"
                  >
                    <option value="esperando_pago" className="text-black">Esperando Pago</option>
                    <option value="confirmado" className="text-black">Pago Confirmado</option>
                    <option value="preparando" className="text-black">En Preparación</option>
                    <option value="enviado" className="text-black">Enviado</option>
                    <option value="entregado" className="text-black">Entregado</option>
                  </select>

                  <input
                    placeholder="Número de guía (ej: SERV-123456)"
                    value={editData.tracking_number || ""}
                    onChange={(e) => setEditData({...editData, tracking_number: e.target.value})}
                    className="w-full bg-white/5 border border-glassBorder rounded-xl p-3 text-white"
                  />

                  <input
                    placeholder="Courier (ej: Servientrega)"
                    value={editData.courier || ""}
                    onChange={(e) => setEditData({...editData, courier: e.target.value})}
                    className="w-full bg-white/5 border border-glassBorder rounded-xl p-3 text-white"
                  />

                  <input
                    type="date"
                    value={editData.estimated_delivery || ""}
                    onChange={(e) => setEditData({...editData, estimated_delivery: e.target.value})}
                    className="w-full bg-white/5 border border-glassBorder rounded-xl p-3 text-white"
                  />

                  <div className="flex gap-3">
                    <button onClick={() => handleUpdate(order.id)} className="flex-1 bg-accent text-bg font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                      <Save className="h-4 w-4" /> Guardar
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-6 border border-glassBorder text-white rounded-xl">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-white/60 text-sm">Estado: <span className="text-accent font-bold">{order.status}</span></p>
                  {order.tracking_number && <p className="text-white/60 text-sm">Guía: <span className="text-white">{order.tracking_number}</span></p>}
                  <button onClick={() => startEdit(order)} className="mt-4 px-6 py-2 bg-accent/20 border border-accent/40 text-accent rounded-xl text-sm flex items-center gap-2 hover:bg-accent hover:text-bg transition-all">
                    <Edit className="h-4 w-4" /> Editar Orden
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
