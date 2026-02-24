"use client";

/**
 * ════════════════════════════════════════════════════════════
 * CHECKOUT FORM - ÍKHOR (Ἰχώρ) 40/40
 * ════════════════════════════════════════════════════════════
 * 
 * Formulario de pago ENTERPRISE en 2 pasos
 * 
 * PASO 1: Datos de envío completos
 * - Nombre completo del destinatario
 * - WhatsApp para notificaciones
 * - Ciudad (cobertura total Ecuador)
 * - Dirección exacta
 * - Direcciones guardadas (autocompletar)
 * 
 * PASO 2: Método de pago multi-opción
 * - Transferencia bancaria (4 bancos)
 * - PayPhone (tarjeta + diferimiento)
 * - PayPal (internacional)
 * - Stripe (próximamente)
 * 
 * FUNCIONALIDADES ENTERPRISE:
 * ✅ Validación en tiempo real
 * ✅ Pre-orden automática (stock = 0)
 * ✅ Cálculo dinámico de días estimados
 * ✅ Actualización de cupo ($1,000 límite)
 * ✅ Email automático
 * ✅ Guardar direcciones
 * ✅ Multi-pago 40/40
 * 
 * DISEÑO ÍKHOR:
 * - Espaciado perfecto
 * - Tipografía Inter + Playfair
 * - Minimalista obsesivo
 * - Sin errores visuales
 * ════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Perfume, ImportSettings, SavedAddress, PaymentMethod } from "@/lib/types";
import { CreditCard, Loader2, Copy, Check, Truck, Lock } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import PayPalButton from "./PayPalButton";


// ─────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────

interface CheckoutProps {
  onComplete: () => void;
  totalCents: number;
  cartItems: Perfume[];
  importSettings: ImportSettings | null;
}

export default function CheckoutForm({ onComplete, totalCents, cartItems, importSettings }: CheckoutProps) {
  
  // ─────────────────────────────────────────────────────────
  // ESTADOS
  // ─────────────────────────────────────────────────────────
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    nombre: "", 
    whatsapp: "", 
    ciudad: "Quito", 
    direccion: "" 
  });

  // Método de pago seleccionado
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transferencia');

  // Direcciones guardadas
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [saveAddress, setSaveAddress] = useState(true);

  // Import settings local
  const [localImportSettings, setLocalImportSettings] = useState<ImportSettings | null>(null);
  
  const totalDollars = (totalCents / 100).toFixed(2);
  // ─────────────────────────────────────────────────────────
  // EFFECT: Cargar direcciones guardadas del usuario
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadAddresses() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });
        
        if (data && data.length > 0) {
          setSavedAddresses(data);
          
          // Autocargar dirección por defecto si existe
          const defaultAddr = data.find(a => a.is_default);
          if (defaultAddr && !formData.nombre) {
            setFormData({
              nombre: defaultAddr.name,
              whatsapp: defaultAddr.whatsapp,
              ciudad: defaultAddr.city,
              direccion: defaultAddr.address
            });
            setSelectedAddressId(defaultAddr.id);
          }
        }
      }
    }
    loadAddresses();
  }, []);

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Seleccionar dirección guardada
  // ─────────────────────────────────────────────────────────
  const handleSelectAddress = (addressId: string) => {
    const address = savedAddresses.find(a => a.id === addressId);
    if (address) {
      setFormData({
        nombre: address.name,
        whatsapp: address.whatsapp,
        ciudad: address.city,
        direccion: address.address
      });
      setSelectedAddressId(addressId);
    }
  };

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Copiar número de cuenta al portapapeles
  // ─────────────────────────────────────────────────────────
 const copyToClipboard = (text: string, bankId: string) => {
  navigator.clipboard.writeText(text);
  setCopiedBank(bankId);
  setTimeout(() => setCopiedBank(null), 2000);
};

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN PRINCIPAL: Finalizar compra
  // ─────────────────────────────────────────────────────────
  const handleFinalize = async () => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Debes iniciar sesión para completar la compra");
        setLoading(false);
        return;
      }

      // Detectar pre-orden
      const hasPreorder = cartItems.some(item => (item.stock || 0) === 0);

      // Calcular días estimados
      let estimatedDays = 23;
      if (importSettings) {
        const method = importSettings.active_method || 'courier';
        if (method === 'courier') {
          estimatedDays = (importSettings.courier_supplier_days_max || 9) + 
                          (importSettings.courier_shipping_days || 7) + 
                          (importSettings.courier_warehouse_days_max || 7);
        } else {
          estimatedDays = (importSettings.viajero_supplier_days_max || 9) + 
                          (importSettings.viajero_shipping_days_max || 20) + 
                          (importSettings.viajero_warehouse_days_max || 7);
        }
      }

      // Crear orden
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user.id,
          customer_name: formData.nombre,
          whatsapp: formData.whatsapp,
          city: formData.ciudad,
          address: formData.direccion,
          total_cents: totalCents,
          status: 'esperando_pago',
          courier: 'Servientrega',
          estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          is_preorder: hasPreorder,
          preorder_estimated_arrival: hasPreorder 
            ? new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            : null,
          payment_method: paymentMethod,
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;
      // ═══════════════════════════════════════════════════
      // PASO 2: ACTUALIZAR CUPO DE COURIER
      // ═══════════════════════════════════════════════════
      
      // Calcular factura (solo costo + envío courier)
      const invoiceTotal = cartItems.reduce((sum, item) => {
        return sum + (item.cost_cents || 0) + (item.shipping_to_courier_cents || 0);
      }, 0);

      // Cargar settings frescos para actualizar cupo
      const { data: freshSettings } = await supabase
        .from("import_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (hasPreorder && freshSettings?.active_method === 'courier' && freshSettings?.id) {
        try {
          const newQuota = (freshSettings.courier_quota_used_cents || 0) + invoiceTotal;
          
          const { error: quotaError } = await supabase
            .from("import_settings")
            .update({ courier_quota_used_cents: newQuota })
            .eq("id", freshSettings.id);
          
          if (quotaError) {
            console.warn("⚠️ No se pudo actualizar cupo:", quotaError);
          }
        } catch (quotaErr) {
          console.warn("⚠️ Error actualizando cupo:", quotaErr);
        }
      }

      // ═══════════════════════════════════════════════════
      // PASO 3: GUARDAR ITEMS DE LA ORDEN
      // ═══════════════════════════════════════════════════
      
      const groupedCart: Record<string, { perfume: Perfume, qty: number }> = {};
      
      cartItems.forEach(item => {
        if (groupedCart[item.id]) {
          groupedCart[item.id].qty++;
        } else {
          groupedCart[item.id] = { perfume: item, qty: 1 };
        }
      });

      const orderItems = Object.values(groupedCart).map(({ perfume, qty }) => ({
        order_id: orderData.id,
        perfume_id: perfume.id,
        perfume_name: perfume.name,
        perfume_price_cents: perfume.price_cents,
        qty: qty
      }));

      const { error: insertError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (insertError) {
        console.error("❌ Error guardando items:", insertError);
        throw insertError;
      }

      // ═══════════════════════════════════════════════════
      // PASO 4: ENVIAR EMAIL DE CONFIRMACIÓN
      // ═══════════════════════════════════════════════════
      try {
        const productsList = Object.values(groupedCart).map(({ perfume, qty }) => ({
          name: perfume.name,
          price: perfume.price_cents / 100,
          qty: qty
        }));

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'order_confirmation',
            orderData: {
              customerEmail: user.email || '',
              customerName: formData.nombre,
              orderId: orderData.id,
              total: totalCents / 100,
              city: formData.ciudad,
              products: productsList
            }
          })
        });
      } catch (emailError) {
        console.error("⚠️ Error enviando email:", emailError);
      }

      // ═══════════════════════════════════════════════════
      // PASO 5: GUARDAR DIRECCIÓN (si checkbox marcado)
      // ═══════════════════════════════════════════════════
      if (saveAddress && user) {
        try {
          await supabase.from("user_addresses").insert([{
            user_id: user.id,
            name: formData.nombre,
            whatsapp: formData.whatsapp,
            city: formData.ciudad,
            address: formData.direccion,
            is_default: savedAddresses.length === 0
          }]);
        } catch (addrError) {
          console.warn("No se pudo guardar dirección:", addrError);
        }
      }

      // ═══════════════════════════════════════════════════
      // PASO 6: LIMPIAR Y COMPLETAR
      // ═══════════════════════════════════════════════════
      setFormData({ nombre: "", whatsapp: "", ciudad: "Quito", direccion: "" });
      setStep(1);
      onComplete();
      
    } catch (e) {
      console.error("❌ Error en checkout:", e);
      alert("Hubo un problema. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────
  // RENDER: Interfaz del Formulario
  // ─────────────────────────────────────────────────────────
  
  return (
    <div className="space-y-8 p-2">
      
      {step === 1 ? (
        // ═══════════════════════════════════════════════════
        // PASO 1: DATOS DE ENVÍO (MEJORADO 40/40)
        // ═══════════════════════════════════════════════════
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          
          {/* Título del Paso */}
          <div className="mb-8">
            <div className="h-1 w-12 bg-accent/30 rounded-full mb-4" />
            <h3 className="text-text font-serif text-2xl tracking-tight mb-2">
              Destino de Envío
            </h3>
            <p className="text-muted text-xs uppercase tracking-widest">
              Completa tus datos para la entrega
            </p>
          </div>
          
          {/* Selector de Direcciones Guardadas */}
          {savedAddresses.length > 0 && (
            <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-3 w-3 text-accent" />
                <p className="text-muted text-[10px] uppercase tracking-widest font-bold">
                  Mis direcciones guardadas
                </p>
              </div>
              <select
                value={selectedAddressId}
                onChange={(e) => handleSelectAddress(e.target.value)}
                className="w-full bg-white border border-glassBorder rounded-xl p-4 text-text cursor-pointer text-sm"
              >
                <option value="">Ingresar nueva dirección</option>
                {savedAddresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.name} - {addr.city} ({addr.address.slice(0, 30)}...)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Campo: Nombre Completo */}
          <div>
            <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
              Nombre Completo
            </label>
            <input 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
              value={formData.nombre}
              placeholder="Ej: María Fernanda García" 
              className="bg-white border-2 border-glassBorder rounded-2xl p-5 text-text w-full outline-none focus:border-accent transition-all placeholder:text-muted/40" 
              autoComplete="name"
            />
          </div>
          
          {/* Campo: WhatsApp */}
          <div>
            <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
              WhatsApp
            </label>
            <input 
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} 
              value={formData.whatsapp}
              placeholder="0987654321" 
              className="bg-white border-2 border-glassBorder rounded-2xl p-5 text-text w-full outline-none focus:border-accent transition-all placeholder:text-muted/40" 
              type="tel"
              autoComplete="tel"
            />
          </div>
          
          {/* Selector de Ciudad */}
          <div>
            <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
              Ciudad
            </label>
            <div className="relative">
              <select 
                onChange={(e) => setFormData({...formData, ciudad: e.target.value})} 
                value={formData.ciudad}
                className="w-full bg-white border-2 border-glassBorder rounded-2xl p-5 text-text outline-none appearance-none cursor-pointer text-sm"
              >
                <optgroup label="Serranía" className="text-black">
                  <option value="Quito">Quito / Valles</option>
                  <option value="Cumbayá">Cumbayá</option>
                  <option value="Tumbaco">Tumbaco</option>
                  <option value="Cuenca">Cuenca</option>
                  <option value="Ambato">Ambato</option>
                  <option value="Riobamba">Riobamba</option>
                  <option value="Loja">Loja</option>
                  <option value="Ibarra">Ibarra</option>
                </optgroup>
                <optgroup label="Costa" className="text-black">
                  <option value="Guayaquil">Guayaquil</option>
                  <option value="Samborondón">Samborondón</option>
                  <option value="Manta">Manta</option>
                  <option value="Salinas">Salinas</option>
                  <option value="Montañita">Montañita</option>
                </optgroup>
                <option value="Otras" className="text-black">Otras ciudades</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted text-[10px]">▼</div>
            </div>
          </div>

          {/* Campo: Dirección */}
          <div>
            <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
              Dirección de Entrega
            </label>
            <input 
              onChange={(e) => setFormData({...formData, direccion: e.target.value})} 
              value={formData.direccion}
              placeholder="Calle principal, número y referencia" 
              className="bg-white border-2 border-glassBorder rounded-2xl p-5 text-text w-full outline-none focus:border-accent transition-all placeholder:text-muted/40" 
              autoComplete="street-address"
            />
          </div>

          {/* Banner de Cobertura */}
          <div className="flex items-center gap-3 p-5 rounded-xl bg-accent/5 border border-accent/20">
            <Truck className="h-5 w-5 text-accent" />
            <p className="text-text text-xs font-bold">
              Cobertura Nacional Ecuador • Servientrega
            </p>
          </div>

          {/* Checkbox: Guardar Dirección */}
          <div className="flex items-center gap-3 p-5 rounded-xl bg-bg border-2 border-glassBorder">
            <input
              type="checkbox"
              id="save-address"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="h-5 w-5 accent-text cursor-pointer"
            />
            <label htmlFor="save-address" className="text-text text-sm cursor-pointer font-medium">
              Guardar esta dirección para futuras compras
            </label>
          </div>

          {/* Botón Siguiente */}
          <button 
            disabled={!formData.nombre || !formData.whatsapp} 
            onClick={() => setStep(2)} 
            className="w-full bg-text text-white font-bold py-6 rounded-full uppercase tracking-widest text-sm disabled:bg-accent disabled:text-white disabled:border-2 disabled:border-text/20 transition-all hover:bg-accent shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
          >
            Continuar al Pago
          </button>
        </div>
        
      ) : (
           // ═══════════════════════════════════════════════════
        // PASO 2: MÉTODOS DE PAGO (PREMIUM 40/40)
        // ═══════════════════════════════════════════════════
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
          
          {/* Título del Paso */}
          <div className="mb-8">
            <div className="h-1 w-12 bg-accent/30 rounded-full mb-4" />
            <h3 className="text-text font-serif text-2xl tracking-tight mb-2">
              Método de Pago
            </h3>
            <p className="text-muted text-xs uppercase tracking-widest">
              Elige cómo prefieres pagar
            </p>
          </div>

          {/* SELECTOR DE MÉTODOS - Mejorado */}
          <div className="grid grid-cols-3 gap-4">
  
  {/* PayPhone */}
  <button
    onClick={() => setPaymentMethod('payphone')}
    className={`p-6 rounded-2xl border-2 text-center transition-all ${
      paymentMethod === 'payphone'
        ? 'border-text bg-text/5 shadow-lg'
        : 'border-glassBorder hover:border-accent hover:shadow-md'
    }`}
  >
    <div className="h-12 w-12 mx-auto mb-3 bg-green-50 rounded-full flex items-center justify-center">
      <span className="text-2xl">💳</span>
    </div>
    <p className="text-text font-bold text-sm mb-2">PayPhone</p>
    <p className="text-muted text-[10px] uppercase mb-2">Tarjeta</p>
    <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-[8px] font-bold uppercase rounded-full">
      Instantáneo
    </span>
  </button>

  {/* PayPal */}
  <button
    onClick={() => setPaymentMethod('paypal')}
    className={`p-6 rounded-2xl border-2 text-center transition-all ${
      paymentMethod === 'paypal'
        ? 'border-text bg-text/5 shadow-lg'
        : 'border-glassBorder hover:border-accent hover:shadow-md'
    }`}
  >
    <div className="h-12 w-12 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center">
      <span className="text-2xl">🌎</span>
    </div>
    <p className="text-text font-bold text-sm mb-2">PayPal</p>
    <p className="text-muted text-[10px] uppercase mb-2">Internacional</p>
    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-[8px] font-bold uppercase rounded-full">
      Seguro
    </span>
  </button>

  {/* Transferencia */}
  <button
    onClick={() => setPaymentMethod('transferencia')}
    className={`p-6 rounded-2xl border-2 text-center transition-all ${
      paymentMethod === 'transferencia'
        ? 'border-text bg-text/5 shadow-lg'
        : 'border-glassBorder hover:border-accent hover:shadow-md'
    }`}
  >
    <div className="h-12 w-12 mx-auto mb-3 bg-accent/10 rounded-full flex items-center justify-center">
      <span className="text-2xl">🏦</span>
    </div>
    <p className="text-text font-bold text-sm mb-2">Transferencia</p>
    <p className="text-muted text-[10px] uppercase mb-2">Banco Directo</p>
    <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-[8px] font-bold uppercase rounded-full">
      2-4 Horas
    </span>
  </button>

  {/* Diferimiento */}
  <button
    onClick={() => setPaymentMethod('diferimiento')}
    className={`p-6 rounded-2xl border-2 text-center transition-all ${
      paymentMethod === 'diferimiento'
        ? 'border-text bg-text/5 shadow-lg'
        : 'border-glassBorder hover:border-accent hover:shadow-md'
    }`}
  >
    <div className="h-12 w-12 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center">
      <span className="text-2xl">💳</span>
    </div>
    <p className="text-text font-bold text-sm mb-2">Diferimiento</p>
    <p className="text-muted text-[10px] uppercase mb-2">Tarjeta 3-12 meses</p>
    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-[8px] font-bold uppercase rounded-full">
      Sin Intereses
    </span>
  </button>

  {/* Takenos */}
  <button
    onClick={() => setPaymentMethod('takenos')}
    className={`p-6 rounded-2xl border-2 text-center transition-all ${
      paymentMethod === 'takenos'
        ? 'border-text bg-text/5 shadow-lg'
        : 'border-glassBorder hover:border-accent hover:shadow-md'
    }`}
  >
    <div className="h-12 w-12 mx-auto mb-3 bg-orange-50 rounded-full flex items-center justify-center">
      <span className="text-2xl">🪙</span>
    </div>
    <p className="text-text font-bold text-sm mb-2">Takenos</p>
    <p className="text-muted text-[10px] uppercase mb-2">Internacional</p>
    <span className="inline-block px-2 py-1 bg-orange-50 text-orange-700 text-[8px] font-bold uppercase rounded-full">
      USD/EUR/USDT
    </span>
  </button>
  
</div>

          {/* CONTENIDO DINÁMICO POR MÉTODO */}
          
{paymentMethod === 'transferencia' && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="space-y-6"
  >
              
              {/* 4 Bancos en Grid Premium */}
              <div>
                <p className="text-text text-sm font-bold mb-4 uppercase tracking-wide">
                  Selecciona tu banco:
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  
                  {/* Banco Pichincha */}
                  <div className="p-6 rounded-2xl bg-white border-2 border-glassBorder hover:border-accent hover:shadow-md transition-all">
                    <p className="text-text font-bold text-base mb-1">🏦 Banco Pichincha</p>
                    <p className="text-muted text-xs mb-4">Cuenta Ahorros</p>
                    <div 
                      className="group cursor-pointer p-4 rounded-xl bg-bg hover:bg-accent/10 transition-all"
                      onClick={() => copyToClipboard("2214794369", "pichincha")}

                      title="Click para copiar"
                    >
                      <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Número de Cuenta</p>
                      <div className="flex justify-between items-center">
                        <p className="text-text font-bold text-base tabular-nums tracking-wider">2214 7943 69</p>
                        {copiedBank === 'pichincha' ? (
  <Check className="h-4 w-4 text-green-600" />
) : (
  <Copy className="h-4 w-4 text-accent group-hover:text-text transition-colors" />
)}

                      </div>
                    </div>
                  </div>

                  {/* Banco Guayaquil */}
                  <div className="p-6 rounded-2xl bg-white border-2 border-glassBorder hover:border-accent hover:shadow-md transition-all">
                    <p className="text-text font-bold text-base mb-1">🏦 Banco Guayaquil</p>
                    <p className="text-muted text-xs mb-4">Cuenta Ahorros</p>
                    <div 
                      className="group cursor-pointer p-4 rounded-xl bg-bg hover:bg-accent/10 transition-all"
                      onClick={() => copyToClipboard("0053992590", "guayaquil")}

                      title="Click para copiar"
                    >
                      <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Número de Cuenta</p>
                      <div className="flex justify-between items-center">
                        <p className="text-text font-bold text-lg tabular-nums tracking-widest">0053 9925 90</p>

                        {copiedBank === 'guayaquil' ? (
  <Check className="h-4 w-4 text-green-600" />
) : (
  <Copy className="h-4 w-4 text-accent group-hover:text-text transition-colors" />
)}

                      </div>
                    </div>
                  </div>

                  {/* Produbanco */}
                  <div className="p-6 rounded-2xl bg-white border-2 border-glassBorder hover:border-accent hover:shadow-md transition-all">
                    <p className="text-text font-bold text-base mb-1">🏦 Produbanco</p>
                    <p className="text-muted text-xs mb-4">Cuenta Ahorros</p>
                    <div 
                      className="group cursor-pointer p-4 rounded-xl bg-bg hover:bg-accent/10 transition-all"
                      onClick={() => copyToClipboard("2214794369", "produbanco")}

                      title="Click para copiar"
                    >
                      <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Número de Cuenta</p>
                      <div className="flex justify-between items-center">
                        <p className="text-text font-bold text-lg tabular-nums tracking-widest">2000 6261 920</p>

                        {copiedBank === 'produbanco' ? (
  <Check className="h-4 w-4 text-green-600" />
) : (
  <Copy className="h-4 w-4 text-accent group-hover:text-text transition-colors" />
)}

                      </div>
                    </div>
                  </div>

                  {/* Banco Internacional */}
                  <div className="p-6 rounded-2xl bg-white border-2 border-glassBorder hover:border-accent hover:shadow-md transition-all">
                    <p className="text-text font-bold text-base mb-1">🏦 Banco Internacional</p>
                    <p className="text-muted text-xs mb-4">Cuenta Ahorros</p>
                    <div 
                      className="group cursor-pointer p-4 rounded-xl bg-bg hover:bg-accent/10 transition-all"
                      onClick={() => copyToClipboard("2214794369", "internacional")}

                      title="Click para copiar"
                    >
                      <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Número de Cuenta</p>
                      <div className="flex justify-between items-center">
                        <p className="text-text font-bold text-lg tabular-nums tracking-widest">1968 1209 70</p>

                        {copiedBank === 'internacional' ? (
  <Check className="h-4 w-4 text-green-600" />
) : (
  <Copy className="h-4 w-4 text-accent group-hover:text-text transition-colors" />
)}

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info del Titular y Monto */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-accent/5 to-bg border border-accent/20">
                <p className="text-muted text-[10px] uppercase tracking-[0.3em] mb-3">
                  Titular de Cuentas
                </p>
                <p className="text-text font-bold text-xl mb-4 tracking-tight">
  A. Barreiro - ÍKHOR
</p>

<div 
  className="group cursor-pointer inline-flex items-center gap-2 p-3 rounded-xl bg-bg hover:bg-accent/10 transition-all"
  onClick={() => copyToClipboard("0706944253", "cedula")}
  title="Click para copiar"
>
  <p className="text-muted text-xs uppercase tracking-widest">
    CI: <span className="text-text font-medium">0706-9442-53</span>
  </p>
  {copiedBank === 'cedula' ? (
    <Check className="h-3 w-3 text-green-600" />
  ) : (
    <Copy className="h-3 w-3 text-accent group-hover:text-text transition-colors" />
  )}
</div>
          
                
                <div className="h-px bg-glassBorder my-6" />
                
                <p className="text-muted text-[10px] uppercase tracking-[0.3em] mb-3">
                  Monto a Transferir
                </p>
                <p className="text-text font-black text-6xl tabular-nums tracking-tight">
                  ${totalDollars}
                </p>
              </div>
              
              <p className="text-center text-muted text-xs uppercase tracking-widest py-4">
                Confirmación manual en 2-4 horas
              </p>
              </motion.div>
)}

          {/* PAYPHONE */}
          {paymentMethod === 'payphone' && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-8 rounded-3xl bg-green-50 border-2 border-green-200">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-green-200">
                <div className="h-14 w-14 bg-green-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  P
                </div>
                <div>
                  <p className="text-text text-lg font-black uppercase tracking-wide">PayPhone</p>
                  <p className="text-green-600 text-xs uppercase tracking-widest font-bold">Pago Instantáneo</p>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-white border border-green-200 mb-6">
                <p className="text-text text-sm font-bold mb-4">Acepta:</p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">Visa</span>
                  <span className="px-4 py-2 bg-orange-50 text-orange-700 text-xs font-bold rounded-xl border border-orange-200">Mastercard</span>
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">Diners</span>
                  <span className="px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-xl border border-green-200">Transferencia</span>
                </div>
                <div className="space-y-2">
                  <p className="text-green-600 text-sm font-bold flex items-center gap-2">
                    <Check className="h-4 w-4" /> Confirmación automática
                  </p>
                  <p className="text-green-600 text-sm font-bold flex items-center gap-2">
                    <Check className="h-4 w-4" /> Diferimiento 3, 6, 9, 12 meses sin intereses
                  </p>
                </div>
              </div>
              
              

              </motion.div>
)}

{/* PAYPAL - 40/40 */}
{paymentMethod === 'paypal' && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    {/* Header Premium */}
    <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg">
      <div className="flex items-center gap-5 mb-8 pb-6 border-b border-blue-200">
        <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
          <span className="text-4xl font-black">P</span>
        </div>
        <div>
          <p className="text-text text-2xl font-black uppercase tracking-wide mb-1">
            PayPal
          </p>
          <p className="text-blue-600 text-sm uppercase tracking-widest font-bold">
            Pago Instantáneo • Seguro
          </p>
        </div>
      </div>

      {/* Ventajas */}
      <div className="p-6 rounded-2xl bg-white border border-blue-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-text font-bold text-sm">Protección al Comprador</p>
              <p className="text-muted text-xs">Reembolso garantizado</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-text font-bold text-sm">Tarjetas Internacionales</p>
              <p className="text-muted text-xs">Visa, Mastercard, Amex</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-text font-bold text-sm">Multi-moneda</p>
              <p className="text-muted text-xs">USD, EUR, GBP, etc.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-text font-bold text-sm">Confirmación Instantánea</p>
              <p className="text-muted text-xs">Automático y rápido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón PayPal */}
      <div className="p-8 rounded-3xl bg-white border-2 border-blue-300">
        <div className="mb-6">
          <p className="text-text font-bold text-base mb-2">Pagar con PayPal:</p>
          <p className="text-muted text-sm">
            Serás redirigido a PayPal para completar el pago de forma segura.
          </p>
        </div>
        
        <PayPalButton
          amount={totalDollars}
          onSuccess={(details) => {
            console.log("✅ Pago PayPal exitoso:", details);
            alert("¡Pago confirmado! Procesando tu pedido...");
            handleFinalize();
          }}
          onError={(err) => {
            console.error("❌ Error PayPal:", err);
            alert("Hubo un problema con el pago. Intenta de nuevo.");
          }}
        />
        
        <p className="text-center text-muted text-xs uppercase tracking-widest mt-4">
          Procesado por PayPal • Seguro y Confiable
        </p>
      </div>
    </div>
  </motion.div>
)}



{/* DIFERIMIENTO CON TARJETA */}
{paymentMethod === 'diferimiento' && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-lg"
  >
    <div className="flex items-center gap-5 mb-8 pb-6 border-b border-blue-200">
      <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
        <span className="text-4xl">💳</span>
      </div>
      <div>
        <p className="text-text text-xl font-black uppercase tracking-wide mb-1">Diferimiento</p>
        <p className="text-blue-600 text-sm uppercase tracking-widest font-bold">3, 6, 9 o 12 Meses Sin Intereses</p>
      </div>
    </div>
    
    <div className="p-6 rounded-2xl bg-white border border-blue-200 mb-6">
      <div className="space-y-3">
        <p className="text-blue-700 text-sm font-bold flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" /> Diferimiento según tu banco emisor
        </p>
        <p className="text-blue-700 text-sm font-bold flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" /> 3, 6, 9 o 12 meses sin intereses
        </p>
        <p className="text-blue-700 text-sm font-bold flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" /> Confirmación instantánea
        </p>
      </div>
    </div>
    
    <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-200">
      <p className="text-yellow-700 text-sm">
        ℹ️ <strong>Próximamente:</strong> Diferimiento directo con tarjeta. Por ahora usa transferencia bancaria.
      </p>
    </div>
  </motion.div>
)}


{/* TAKENOS - CRIPTO E INTERNACIONAL COMPLETO */}
{paymentMethod === 'takenos' && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    
    {/* Header Principal */}
    <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
      <div className="flex items-center gap-5 mb-6">
        <div className="h-16 w-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
          <span className="text-4xl">🪙</span>
        </div>
        <div>
          <p className="text-text text-xl font-black uppercase tracking-wide mb-1">Takenos</p>
          <p className="text-orange-600 text-sm uppercase tracking-widest font-bold">Pagos Internacionales y Cripto</p>
        </div>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* OPCIÓN 1: LINK DE PAGO RÁPIDO         */}
      {/* ══════════════════════════════════════ */}
      <div className="p-6 rounded-2xl bg-white border-2 border-orange-300 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-text font-bold text-base">Pago Rápido (Recomendado)</p>
        </div>
        
        <p className="text-muted text-sm mb-4 leading-relaxed">
          Paga con <strong>tarjeta Visa/Mastercard</strong>, <strong>transferencia internacional</strong> o <strong>criptomonedas</strong> de forma automática.
        </p>
        
        <a
          href="http://app.takenos.com/pay/d172315f-fb7b-4c8c-8ab9-739508403b74"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-orange-500 text-white font-bold py-4 px-6 rounded-xl text-sm uppercase tracking-widest hover:bg-orange-600 hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-3"
        >
          Ir a Takenos y Pagar
        </a>
        
        <p className="text-center text-muted text-xs">
          ✓ Confirmación automática • Comisión incluida
        </p>
      </div>
      {/* ══════════════════════════════════════ */}
      {/* OPCIÓN 2: TRANSFERENCIA MANUAL         */}
      {/* ══════════════════════════════════════ */}
      <div className="p-6 rounded-2xl bg-white border border-orange-200">
        <p className="text-text font-bold text-base mb-5">O Transfiere Directo:</p>
        
        {/* TRANSFERENCIA USD */}
        <div className="mb-6 p-5 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-blue-700 font-bold text-sm mb-4">💵 Dólares (USD) - ACH/Wire</p>
          
          <div className="space-y-3">
            <div>
              <p className="text-muted text-[9px] uppercase tracking-widest mb-1">Titular</p>
              <p className="text-text font-medium text-sm">Anthony Alexander Barreiro Jaen</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div 
                className="group cursor-pointer p-3 rounded-lg bg-white hover:bg-blue-100 transition-all"
                onClick={() => copyToClipboard("214050593572", "takenos-usd")}
              >
                <p className="text-muted text-[9px] uppercase tracking-widest mb-1">Account Number</p>
                <div className="flex justify-between items-center">
                  <p className="text-text font-bold text-sm">214050593572</p>
                  {copiedBank === 'takenos-usd' ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-blue-600" />
                  )}
                </div>
              </div>
              
              <div 
                className="group cursor-pointer p-3 rounded-lg bg-white hover:bg-blue-100 transition-all"
                onClick={() => copyToClipboard("101019644", "takenos-routing")}
              >
                <p className="text-muted text-[9px] uppercase tracking-widest mb-1">Routing Number</p>
                <div className="flex justify-between items-center">
                  <p className="text-text font-bold text-sm">101019644</p>
                  {copiedBank === 'takenos-routing' ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-muted text-xs">
              Banco: <strong>Lead Bank</strong> • 1801 Main St, Kansas City, MO 64108
            </p>
            <p className="text-muted text-xs">
              Tipo: Personal Checking
            </p>
          </div>
        </div>

        {/* TRANSFERENCIA EUR */}
        <div className="mb-6 p-5 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-blue-700 font-bold text-sm mb-4">💶 Euros (EUR) - SEPA</p>
          
          <div className="space-y-3">
            <div>
              <p className="text-muted text-[9px] uppercase tracking-widest mb-1">Titular</p>
              <p className="text-text font-medium text-sm">Anthony Alexander Barreiro Jaen</p>
            </div>
            
            <div 
              className="group cursor-pointer p-3 rounded-lg bg-white hover:bg-blue-100 transition-all"
              onClick={() => copyToClipboard("MT77CFTE28004000000000005802474", "takenos-iban")}
            >
              <p className="text-muted text-[9px] uppercase tracking-widest mb-1">IBAN</p>
              <div className="flex justify-between items-center">
                <p className="text-text font-bold text-xs break-all">MT77 CFTE 2800 4000 0000 0000 5802 474</p>
                {copiedBank === 'takenos-iban' ? (
                  <Check className="h-3 w-3 text-green-600 flex-shrink-0 ml-2" />
                ) : (
                  <Copy className="h-3 w-3 text-blue-600 flex-shrink-0 ml-2" />
                )}
              </div>
            </div>
            
            <p className="text-muted text-xs">
              BIC/SWIFT: <strong>CFTEMTM1XXX</strong>
            </p>
            <p className="text-muted text-xs">
              Banco: <strong>OPENPAYD Malta</strong> • 137 Spinola Road, St. Julian's, Malta
            </p>
          </div>
        </div>
        {/* WALLETS CRIPTO */}
        <div className="p-5 rounded-xl bg-green-50 border border-green-200">
          <p className="text-green-700 font-bold text-sm mb-4">💎 Criptomonedas (USDT/USDC)</p>
          
          <div 
            className="group cursor-pointer p-4 rounded-lg bg-white hover:bg-green-100 transition-all mb-4"
            onClick={() => copyToClipboard("0x86d6184bED965016ec8f3d2c36A07DDb600b9443", "takenos-wallet")}
          >
            <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Wallet Address</p>
            <div className="flex justify-between items-start gap-3">
              <p className="text-text font-bold text-xs break-all font-mono">
                0x86d6184bED965016ec8f3d2c36A07DDb600b9443
              </p>
              {copiedBank === 'takenos-wallet' ? (
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              ) : (
                <Copy className="h-4 w-4 text-green-600 flex-shrink-0" />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-green-700 text-xs font-bold">Acepta:</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white text-green-700 text-xs font-bold rounded-lg border border-green-200">
                💎 USDT
              </span>
              <span className="px-3 py-1 bg-white text-green-700 text-xs font-bold rounded-lg border border-green-200">
                💎 USDC
              </span>
            </div>
            
            <p className="text-green-700 text-xs font-bold mt-3">Redes soportadas:</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white text-green-700 text-xs font-medium rounded-lg border border-green-200">
                Polygon POS
              </span>
              <span className="px-3 py-1 bg-white text-green-700 text-xs font-medium rounded-lg border border-green-200">
                BNB Smart Chain (BEP20)
              </span>
            </div>
            
            <p className="text-muted text-xs mt-3 italic">
              ⚠️ Envía solo USDT o USDC en estas redes. Otras monedas se perderán.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Banner Final con Total */}
<div className="p-6 rounded-2xl bg-accent/5 border border-accent/20">
  <p className="text-muted text-[10px] uppercase tracking-widest mb-2 text-center">Monto a Pagar</p>
  <p className="text-text font-black text-5xl tabular-nums mb-6 text-center">${totalDollars}</p>
  
  {/* Email Copiable */}
  <div className="mb-6">
    <p className="text-muted text-xs uppercase tracking-widest mb-2">Envía comprobante a:</p>
    <div 
      className="group cursor-pointer p-4 rounded-xl bg-white border border-glassBorder hover:bg-accent/10 transition-all flex items-center justify-between"
      onClick={() => copyToClipboard("anthonybarreiro369@gmail.com", "takenos-email")}
    >
      <p className="text-text font-bold text-sm">anthonybarreiro369@gmail.com</p>
      {copiedBank === 'takenos-email' ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4 text-accent" />
      )}
    </div>
  </div>
  
  {/* Mensaje Pre-escrito Copiable */}
  <div>
    <div className="flex items-center justify-between mb-3">
      <p className="text-muted text-xs uppercase tracking-widest">Mensaje sugerido:</p>
      <button
        onClick={() => {
          const mensaje = `Hola ÍKHOR,\n\nHe realizado el pago de $${totalDollars} vía Takenos.\nAdjunto comprobante de pago.\n\nGracias.`;
          copyToClipboard(mensaje, "takenos-mensaje");
        }}
        className="text-accent hover:text-text text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
      >
        {copiedBank === 'takenos-mensaje' ? (
          <>
            <Check className="h-3 w-3" /> Copiado
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> Copiar Mensaje
          </>
        )}
      </button>
    </div>
    
    <div className="p-4 rounded-xl bg-white border border-glassBorder text-left">
      <p className="text-muted text-sm leading-relaxed">
        Hola ÍKHOR,<br /><br />
        He realizado el pago de <strong className="text-text">${totalDollars}</strong> vía Takenos.<br />
        Adjunto comprobante de pago.<br /><br />
        Gracias.
      </p>
    </div>
  </div>
</div>
  </motion.div>
)}


          {/* Instrucciones Finales */}
          <div className="text-center py-6">
            <p className="text-muted text-xs uppercase tracking-[0.3em] leading-loose">
              Recibirás confirmación por email
            </p>
          </div>

          {/* BOTÓN CONFIRMAR PEDIDO - ÚNICO */}
          <button 
            onClick={handleFinalize} 
            disabled={loading} 
            className="w-full bg-text text-white font-black py-7 rounded-full uppercase tracking-[0.5em] text-sm shadow-[0_30px_60px_rgba(0,0,0,0.2)] flex items-center justify-center gap-4 hover:bg-accent hover:shadow-[0_40px_80px_rgba(0,0,0,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-6 w-6" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span>Confirmar Pedido</span>
                <span className="text-sm font-normal opacity-80">
                  {paymentMethod === 'transferencia' ? '🏦' : paymentMethod === 'payphone' ? '💳' : '🌎'}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
