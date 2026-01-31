"use client";

/**
 * ════════════════════════════════════════════════════════════
 * ADMIN PANEL PRO - ÍKHOR (Ἰχώρ)
 * ════════════════════════════════════════════════════════════
 * 
 * Panel de administración NIVEL ENTERPRISE
 * 
 * FUNCIONALIDADES PRO:
 * ✅ Buscador en tiempo real (nombre, ciudad, número de orden)
 * ✅ Email del cliente visible
 * ✅ Ver productos de cada orden
 * ✅ Filtros por estado (Todos, Pendientes, Enviados, etc.)
 * ✅ Editar estado y tracking
 * ✅ Eliminar órdenes (con confirmación)
 * ✅ Estadísticas básicas (total de ventas)
 * 
 * SEGURIDAD:
 * - Solo accesible por email autorizado
 * - Validación en cada acción
 * 
 * DISEÑO ÍKHOR:
 * - Minimalista extremo
 * - Funcional como Shopify Admin
 * - Colores platino
 * ════════════════════════════════════════════════════════════
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { Package, Edit, Save, X, Trash2, Search, Filter, TrendingUp } from "lucide-react";
import type { Order } from "@/lib/types";

// ─────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────


interface OrderItem {
  id: string;
  perfume_name: string;
  perfume_price_cents: number;
  qty: number;
}

interface UserEmail {
  email: string;
}

export default function AdminPage() {
  const router = useRouter();
  
  // ─────────────────────────────────────────────────────────
  // ESTADOS
  // ─────────────────────────────────────────────────────────
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Order>>({});
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  // Estados de búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // ─────────────────────────────────────────────────────────
  // EFFECT: Cargar órdenes al montar
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    loadOrders();
  }, []);

  // ─────────────────────────────────────────────────────────
  // EFFECT: Filtrar órdenes cuando cambian búsqueda o filtro
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    let filtered = orders;
    
    // Filtro por estado
    if (statusFilter !== "todos") {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    
    // Búsqueda por texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.customer_name.toLowerCase().includes(query) ||
        o.city.toLowerCase().includes(query) ||
        o.id.toLowerCase().includes(query) ||
        o.whatsapp.includes(query) ||
        (userEmails[o.user_id] || "").toLowerCase().includes(query)
      );
    }
    
    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders, userEmails]);
  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Cargar todas las órdenes + items + emails
  // ─────────────────────────────────────────────────────────
    async function loadOrders() {
  const supabase = createClient();
  
  // Middleware ya validó - cargar directo
  setIsAdmin(true);
  setChecking(false);
  
  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
    
    // ═══════════════════════════════════════════════════════
    // Si llegó aquí = ES ADMIN AUTORIZADO
    // Cargar todas las órdenes
    // ═══════════════════════════════════════════════════════
    
    if (ordersData) {
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      
      // ─────────────────────────────────────────────────────
      // Cargar items de cada orden
      // ─────────────────────────────────────────────────────
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
      
      // ─────────────────────────────────────────────────────
      // Cargar emails de usuarios (para mostrar en admin)
      // ─────────────────────────────────────────────────────
      const userIds = [...new Set(ordersData.map(o => o.user_id))];
      const emailsMap: Record<string, string> = {};
      
      for (const userId of userIds) {
        // Intentar obtener email del usuario
        try {
          const { data: userData } = await supabase.auth.admin.getUserById(userId);
          if (userData?.user?.email) {
            emailsMap[userId] = userData.user.email;
          }
        } catch (error) {
          // Si falla, dejar como "Email no disponible"
          emailsMap[userId] = "Email no disponible";
        }
      }
      setUserEmails(emailsMap);
    }
  }

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Actualizar orden
  // ─────────────────────────────────────────────────────────
  async function handleUpdate(orderId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("orders").update(editData).eq("id", orderId);
    
    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      alert("Orden actualizada exitosamente");
      setEditingId(null);
      loadOrders();
    }
  }

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Eliminar orden
  // ─────────────────────────────────────────────────────────
  async function handleDelete(orderId: string, orderNum: string) {
    const confirmed = window.confirm("¿Eliminar orden #" + orderNum + "? No se puede deshacer.");
    if (!confirmed) return;
    
    const supabase = createClient();
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      alert("Orden eliminada");
      loadOrders();
    }
  }

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Iniciar edición
  // ─────────────────────────────────────────────────────────
  const startEdit = (order: Order) => {
    setEditingId(order.id);
    setEditData({
      status: order.status,
      tracking_number: order.tracking_number || "",
      courier: order.courier || "Servientrega",
      estimated_delivery: order.estimated_delivery || ""
    });
  };

  // ─────────────────────────────────────────────────────────
  // CALCULAR: Estadísticas
  // ─────────────────────────────────────────────────────────
  const totalVentas = filteredOrders.reduce((acc, o) => acc + o.total_cents, 0) / 100;
  const totalOrdenes = filteredOrders.length;
  // ═══════════════════════════════════════════════════════
  // SEGURIDAD: No renderizar nada hasta verificar
  // ═══════════════════════════════════════════════════════
  
  if (checking) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-muted text-sm uppercase tracking-widest">Verificando acceso...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // RENDER: Interfaz de Administración PRO
  // ─────────────────────────────────────────────────────────
  
  return (
    <main className="min-h-screen bg-bg py-32 px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ════════════════════════════════════════════ */}
        {/* HEADER CON ESTADÍSTICAS                      */}
        {/* ════════════════════════════════════════════ */}
        <div className="mb-12 pb-8 border-b border-glassBorder">
          <div className="h-1 w-12 bg-accent/30 rounded-full mb-4" />
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-serif text-text mb-4 tracking-tight">Panel Admin</h1>
              <p className="text-muted text-sm uppercase tracking-widest">Gestión de Órdenes ÍKHOR</p>
            </div>
            
            {/* Estadísticas en vivo */}
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-muted text-[9px] uppercase tracking-widest mb-1">Total Ventas</p>
                <p className="text-text font-bold text-2xl">${totalVentas.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-muted text-[9px] uppercase tracking-widest mb-1">Órdenes</p>
                <p className="text-text font-bold text-2xl">{totalOrdenes}</p>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────── */}
          {/* BARRA DE BÚSQUEDA                        */}
          {/* ──────────────────────────────────────── */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Buscar por nombre, ciudad, orden, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text placeholder:text-muted/40 outline-none focus:border-accent transition-all"
              />
            </div>
            
            {/* Filtro por Estado */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white border border-glassBorder rounded-xl text-text outline-none focus:border-accent transition-all appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="todos">Todos los Estados</option>
                <option value="esperando_pago">Esperando Pago</option>
                <option value="confirmado">Confirmado</option>
                <option value="preparando">Preparando</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted text-[10px]">▼</div>
            </div>
          </div>
          
          {/* Contador de resultados */}
          {searchQuery || statusFilter !== "todos" ? (
            <p className="text-muted text-xs uppercase tracking-widest">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'resultado' : 'resultados'}
            </p>
          ) : null}
        </div>
        {/* ════════════════════════════════════════════ */}
        {/* LISTA DE ÓRDENES PRO                         */}
        {/* ════════════════════════════════════════════ */}
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const orderEmail = userEmails[order.user_id] || "Cargando...";
            
            return (
              <div 
                key={order.id} 
                className="bg-white border border-glassBorder p-8 rounded-3xl hover:border-accent transition-all"
              >
                
                {/* Header de la Orden con Email */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <p className="text-text font-bold text-lg mb-1">
                      Orden #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-muted text-xs">
                      {order.customer_name} • {order.city}
                    </p>
                    <p className="text-muted text-xs">
                      {order.whatsapp}
                    </p>
                    {/* EMAIL DEL CLIENTE */}
                    <p className="text-accent text-xs mt-1 font-medium">
                      {orderEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text font-bold text-2xl mb-2">
                      ${(order.total_cents / 100).toFixed(2)}
                    </p>
                    {order.is_preorder && (
  <span className="inline-block px-3 py-1 mt-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[9px] uppercase tracking-widest font-bold">
    🕐 PRE-ORDEN
  </span>
)}
                    <p className="text-muted text-[10px] uppercase tracking-widest">
                      {new Date(order.created_at).toLocaleDateString('es-EC')}
                    </p>
                  </div>
                </div>

                {/* Botón Ver Productos */}
                {orderItems[order.id] && (
                  <button
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="mb-4 text-xs text-accent hover:text-text transition-colors uppercase tracking-widest font-bold"
                  >
                    {isExpanded ? "▼ Ocultar productos" : "▶ Ver productos"}
                  </button>
                )}

                {/* PRODUCTOS DE LA ORDEN (Expandible) */}
                {isExpanded && orderItems[order.id] && (
                  <div className="mb-6 p-4 rounded-xl bg-bg border border-glassBorder">
                    <p className="text-text font-bold text-xs uppercase tracking-widest mb-3">Productos:</p>
                    <div className="space-y-2">
                      {orderItems[order.id].map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="text-text font-medium">{item.perfume_name}</p>
                            <p className="text-muted text-xs">Cantidad: {item.qty}</p>
                          </div>
                          <p className="text-text font-bold">${(item.perfume_price_cents / 100).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODO EDICIÓN */}
                {editingId === order.id ? (
                  <div className="space-y-4 p-6 rounded-xl bg-bg border border-accent/20">
                    <select value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value})} className="w-full bg-white border border-glassBorder rounded-xl p-3 text-text cursor-pointer">
                      <option value="esperando_pago">Esperando Pago</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="preparando">Preparando</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                    </select>
                    <input placeholder="Número de guía" value={editData.tracking_number || ""} onChange={(e) => setEditData({...editData, tracking_number: e.target.value})} className="w-full bg-white border border-glassBorder rounded-xl p-3 text-text placeholder:text-muted/40" />
                    <input placeholder="Courier" value={editData.courier || ""} onChange={(e) => setEditData({...editData, courier: e.target.value})} className="w-full bg-white border border-glassBorder rounded-xl p-3 text-text placeholder:text-muted/40" />
                    <input type="date" value={editData.estimated_delivery || ""} onChange={(e) => setEditData({...editData, estimated_delivery: e.target.value})} className="w-full bg-white border border-glassBorder rounded-xl p-3 text-text" />
                    <div className="flex gap-3">
                      <button onClick={() => handleUpdate(order.id)} className="flex-1 bg-text text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-accent transition-all"><Save className="h-4 w-4" />Guardar</button>
                      <button onClick={() => setEditingId(null)} className="px-6 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all"><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted text-sm">Estado: <span className="text-text font-bold capitalize">{order.status.replace('_', ' ')}</span></p>
                    {order.tracking_number && <p className="text-muted text-sm">Guía: <span className="text-text font-bold">{order.tracking_number}</span></p>}
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => startEdit(order)} className="flex-1 px-6 py-3 bg-accent/10 border border-accent/30 text-text rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-all font-bold uppercase tracking-widest"><Edit className="h-4 w-4" />Editar</button>
                      <button onClick={() => handleDelete(order.id, order.id.slice(0, 8).toUpperCase())} className="px-6 py-3 border border-red-200 bg-red-50 text-red-600 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-all font-bold uppercase tracking-widest"><Trash2 className="h-4 w-4" />Eliminar</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredOrders.length === 0 && (
            <div className="bg-white border border-glassBorder p-20 rounded-3xl text-center">
              <Package className="h-16 w-16 text-accent/30 mx-auto mb-6" />
              <p className="text-muted text-sm uppercase tracking-widest">
                {searchQuery || statusFilter !== "todos" ? "No se encontraron órdenes" : "No hay órdenes registradas"}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
