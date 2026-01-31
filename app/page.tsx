"use client";

/**
 * ════════════════════════════════════════════════════════════
 * ÍKHOR - PÁGINA PRINCIPAL (HOME)
 * ════════════════════════════════════════════════════════════
 * 
 * Componentes:
 * - Hero: Título principal "La esencia invisible"
 * - Quote: Manifiesto de marca
 * - Grid de Productos: Tarjetas de perfumes
 * - Modal de Detalle: Vista ampliada del producto
 * - Toast: Notificación de ventas recientes
 * 
 * Funcionalidades:
 * - Sistema de carrito persistente (Supabase + localStorage)
 * - Favoritos integrados
 * - Pre-orden automática
 * ════════════════════════════════════════════════════════════
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Droplets, Sparkles, X, ShoppingBag, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import SuccessRitual from "@/components/SuccessRitual";
import { createClient } from "@/lib/supabaseClient";
import { addToCart as addToCartDB, removeFromCart as removeFromCartDB, clearCart } from "@/lib/cart";
import type { Perfume } from "@/lib/types";

export default function HomePage() {
  // ─────────────────────────────────────────────────────────
  // ESTADOS
  // ─────────────────────────────────────────────────────────
  
  // Productos desde Supabase
  const [products, setProducts] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal de detalle del perfume
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  
  // Estados de UI (carrito, éxito)
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  
  // Carrito de compras
  const [cartItems, setCartItems] = useState<Perfume[]>([]);
  
  // Toast de prueba social
  const [showToast, setShowToast] = useState(false);
  const [randomCity, setRandomCity] = useState("Quito");

  // Configuración de importación (para pre-orden)
  const [importSettings, setImportSettings] = useState<any>(null);
  
  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Estado de variantes del perfume seleccionado
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [perfumeVariants, setPerfumeVariants] = useState<any[]>([]);


  // Ciudades de Ecuador para el toast
  const citiesEC = ["Quito", "Riobamba", "Cumbayá", "Tumbaco", "Los Chillos",
  "Guayaquil", "Samborondón", "Vía a la Costa",
  "Cuenca", "Manta", "Salinas", "Montañita",
  "Loja", "Ambato", "Ibarra", "Machala"];

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Obtener carrito desde Supabase
  // ─────────────────────────────────────────────────────────
  const getCart = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: cartItems } = await supabase
      .from("cart_items")
      .select("perfume_id")
      .eq("user_id", user.id);

    if (!cartItems || cartItems.length === 0) return [];

    const perfumeIds = cartItems.map(item => item.perfume_id);
    const { data: perfumes } = await supabase
      .from("perfumes")
      .select("*")
      .in("id", perfumeIds);

    return perfumes || [];
  };
  // ─────────────────────────────────────────────────────────
  // EFFECT: Cambiar ciudad aleatoria para el toast
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const city = citiesEC[Math.floor(Math.random() * citiesEC.length)];
      setRandomCity(city);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // ─────────────────────────────────────────────────────────
  // EFFECT: Cargar productos y carrito al iniciar
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Función para obtener perfumes desde Supabase
    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("perfumes").select("*").eq("active", true);
        if (data) setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();

    // Función para cargar el carrito (Supabase o localStorage)
    async function loadCart() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Usuario logueado: cargar desde Supabase
          const cartFromDB = await getCart();
          setCartItems(cartFromDB);
        } else {
          // Usuario NO logueado: cargar desde localStorage
          const savedCart = localStorage.getItem("aura-cart");
          if (savedCart) setCartItems(JSON.parse(savedCart));
        }
      } catch (e) {
        console.error("Error cargando carrito:", e);
      }
      }
  loadCart();
  
  // Cargar configuración de importación
  async function loadImportSettings() {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("import_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      
      if (data) setImportSettings(data);
    } catch (e) {
      console.error("Error cargando import settings:", e);
    }
  }
  loadImportSettings();

  setTimeout(() => setShowToast(true), 7000);
}, []);




  // ─────────────────────────────────────────────────────────
  // EFFECT: Guardar carrito en localStorage (respaldo)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("aura-cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Añadir producto al carrito
  // ─────────────────────────────────────────────────────────
  const addToCart = async (perfume: Perfume) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Usuario logueado: guardar en Supabase
        await addToCartDB(perfume);
      }
      
      // Actualizar estado local (UI instantánea)
      setCartItems([...cartItems, perfume]);
      setIsCartOpen(true);
      setSelectedPerfume(null);
    } catch (error: any) {
      alert(error.message || "Error al añadir al carrito");
    }
  };

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Eliminar UN item del carrito (para botón -)
  // ─────────────────────────────────────────────────────────
  const removeFromCart = async (index: number) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const perfumeToRemove = cartItems[index];
      
      if (user && perfumeToRemove) {
        await removeFromCartDB(perfumeToRemove.id);
      }
      
      const newItems = cartItems.filter((_, i) => i !== index);
      setCartItems(newItems);
    } catch (error: any) {
      alert(error.message || "Error al eliminar del carrito");
    }
  };

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Eliminar MÚLTIPLES items (para botón basura)
  // ─────────────────────────────────────────────────────────
  const removeMultipleFromCart = async (indices: number[]) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const perfumesToRemove = indices.map(i => cartItems[i]);
        const uniquePerfumeIds = [...new Set(perfumesToRemove.map(p => p.id))];
        
        for (const perfumeId of uniquePerfumeIds) {
          await removeFromCartDB(perfumeId);
        }
      }
      
      const newItems = cartItems.filter((_, i) => !indices.includes(i));
      setCartItems(newItems);
    } catch (error: any) {
      console.error("Error al eliminar:", error);
    }
  };

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Completar compra y limpiar carrito
  // ─────────────────────────────────────────────────────────
  const handlePurchase = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await clearCart();
      } else {
        localStorage.removeItem("aura-cart");
      }
      
      setIsCartOpen(false);
      setIsSuccessOpen(true);
      setCartItems([]);
    } catch (error) {
      console.error("Error en compra:", error);
      setIsSuccessOpen(true);
    }
  };

// Cargar variantes cuando se selecciona un perfume
const loadVariants = async (perfumeId: string) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("perfume_variants")
    .select("*")
    .eq("perfume_id", perfumeId)
    .eq("active", true)
    .order("size_ml", { ascending: true });
  
  if (data && data.length > 0) {
    setPerfumeVariants(data);
    // Seleccionar variante por defecto
    const defaultVariant = data.find(v => v.is_default) || data[0];
    setSelectedVariantId(defaultVariant.id);
  }
};


  // ─────────────────────────────────────────────────────────
  // RENDER: Interfaz de Usuario
  // ─────────────────────────────────────────────────────────
  
  return (
    <main className="relative min-h-screen bg-bg selection:bg-accent/30 selection:text-text antialiased">
      
      {/* Barra de Progreso de Scroll - Superior */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[100] origin-left" 
        style={{ scaleX }} 
      />
      
      {/* Navbar */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} cartCount={cartItems.length} />
      
      {/* ════════════════════════════════════════════════════ */}
      {/* HERO - Sección Principal                            */}
      {/* ════════════════════════════════════════════════════ */}
      <section className="relative pt-56 pb-32 px-4 overflow-hidden">
        {/* Blur decorativo de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-accent/[0.08] blur-[160px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Badge superior */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="inline-block mb-12 px-8 py-2.5 rounded-full border border-accent/30 bg-accent/10 text-[10px] tracking-[0.7em] text-accent uppercase font-black"
          >
            ÍKHOR • 2026
          </motion.div>
          
          {/* Título Principal */}
          <motion.h1 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} 
            className="text-7xl md:text-[10rem] font-serif mb-12 text-text tracking-tighter leading-[0.85]"
          >
            La esencia <br /> 
            <span className="text-accent italic">invisible..</span>
          </motion.h1>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ */}
      {/* QUOTE - Manifiesto de Marca                         */}
      {/* ════════════════════════════════════════════════════ */}
      <section className="py-48 px-6 bg-white/[0.02] border-y border-glassBorder text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent" />
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
        >
          <Sparkles className="h-8 w-8 text-accent mx-auto mb-12" />
          <h2 className="text-4xl md:text-5xl font-serif italic text-text/80 max-w-3xl mx-auto leading-snug tracking-tight">
            "No vestimos el cuerpo, vestimos la memoria que dejas al pasar."
          </h2>
          <p className="font-serif italic text-accent text-2xl mt-12 tracking-widest">
            — Ἰχώρ
          </p>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════ */}
      {/* GRID DE PRODUCTOS                                    */}
      {/* ════════════════════════════════════════════════════ */}
      <section className="px-8 py-40">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className="bg-white/50 h-[600px] rounded-[50px] animate-pulse" 
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {products.map((product, index) => (
                <div 
  key={product.id} 
  onClick={() => {
    setSelectedPerfume(product);
    loadVariants(product.id);
  }} 
  className="cursor-pointer group"
>
                  <motion.div 
                    initial={{ opacity: 0, y: 80 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProductCard perfume={product} />
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* ════════════════════════════════════════════ */}
      {/* MODAL DE PRODUCTO - COMPLETA Y MEJORADA      */}
      {/* ════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedPerfume && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6"
          >
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-text/60 backdrop-blur-2xl" 
              onClick={() => {
                setSelectedPerfume(null);
                setPerfumeVariants([]);
                setSelectedVariantId(null);
              }} 
            />
            
            {/* Modal Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 40 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-5xl bg-white border border-glassBorder rounded-[50px] overflow-hidden flex flex-col md:flex-row max-h-[90vh] shadow-[0_80px_200px_rgba(0,0,0,0.3)]"
            >
              {/* Botón Cerrar */}
              <button 
                onClick={() => {
                  setSelectedPerfume(null);
                  setPerfumeVariants([]);
                  setSelectedVariantId(null);
                }} 
                className="absolute top-6 right-6 md:top-8 md:right-8 p-3 rounded-full bg-bg border border-glassBorder text-text z-50 hover:bg-text hover:text-white transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* COLUMNA IZQUIERDA: Imagen */}
              <div className="w-full md:w-2/5 bg-bg flex items-center justify-center relative border-b md:border-b-0 md:border-r border-glassBorder p-12">
                {selectedPerfume.image_url ? (
                  <img 
                    src={selectedPerfume.image_url} 
                    alt={selectedPerfume.name}
                    className="w-full h-full max-h-96 object-contain opacity-90" 
                  />
                ) : (
                  <Droplets className="h-32 w-32 text-accent/30" />
                )}
              </div>
              {/* COLUMNA DERECHA: Información y Variantes */}
              <div className="flex-1 p-8 md:p-12 flex flex-col overflow-y-auto">
                
                {/* Header con Badge */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-10 bg-accent/30 rounded-full" />
                  <span className="text-[10px] tracking-[0.4em] text-accent uppercase font-bold">
                    Edición Limitada
                  </span>
                </div>
                
                {/* Nombre del Perfume */}
                <h2 className="text-4xl md:text-5xl font-serif text-text mb-3 tracking-tight leading-tight">
                  {selectedPerfume.name}
                </h2>
                
                {/* Marca/Categoría */}
                <p className="text-muted text-sm uppercase tracking-widest mb-8">
                  Eau de Parfum • {selectedPerfume.category?.replace('_', ' ')}
                </p>

                {/* SELECTOR DE TAMAÑOS */}
                {perfumeVariants.length > 0 && (
                  <div className="mb-8">
                    <p className="text-text text-xs uppercase tracking-widest font-bold mb-4">
                      Selecciona Tamaño:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {perfumeVariants.map((variant) => {
                        const isSelected = selectedVariantId === variant.id;
                        const isAvailable = variant.stock > 0;
                        
                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariantId(variant.id)}
                            disabled={!isAvailable && !variant.is_preorder_enabled}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              isSelected
                                ? 'border-text bg-text/5'
                                : 'border-glassBorder hover:border-accent'
                            } ${!isAvailable ? 'opacity-60' : ''}`}
                          >
                            <p className="text-text font-bold text-sm mb-1">
                              {variant.size_ml}ml
                            </p>
                            <p className="text-text font-bold text-lg">
                              ${(variant.price_cents / 100).toFixed(2)}
                            </p>
                            <p className="text-muted text-[10px] uppercase tracking-widest mt-1">
                              {isAvailable 
                                ? `${variant.stock} en stock` 
                                : 'Pre-orden'}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Precio Principal (de la variante seleccionada) */}
                {(() => {
                  const selectedVariant = perfumeVariants.find(v => v.id === selectedVariantId);
                  const displayPrice = selectedVariant 
                    ? (selectedVariant.price_cents / 100).toFixed(2)
                    : (selectedPerfume.price_cents / 100).toFixed(2);
                  
                  return (
                    <div className="mb-8 pb-8 border-b border-glassBorder">
                      <p className="text-muted text-[10px] uppercase tracking-widest mb-2">
                        Precio
                      </p>
                      <p className="text-text font-bold text-4xl tabular-nums">
                        ${displayPrice}
                      </p>
                    </div>
                  );
                })()}

                {/* SPECS TÉCNICAS Y NOTAS OLFATIVAS */}
<div className="mb-8 space-y-6">
  <p className="text-text text-xs uppercase tracking-widest font-bold">
    Especificaciones:
  </p>
  
  {/* Grid de Specs Básicas */}
  <div className="grid grid-cols-2 gap-4 text-sm pb-6 border-b border-glassBorder">
    <div>
      <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Concentración</p>
      <p className="text-text font-medium">{selectedPerfume.concentration || 'Eau de Parfum'}</p>
    </div>
    <div>
      <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Género</p>
      <p className="text-text font-medium">Unisex</p>
    </div>
    {selectedPerfume.brand && (
      <div>
        <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Marca</p>
        <p className="text-text font-medium">{selectedPerfume.brand}</p>
      </div>
    )}
    {selectedPerfume.origin_country && (
      <div>
        <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Origen</p>
        <p className="text-text font-medium">{selectedPerfume.origin_country}</p>
      </div>
    )}
    {(() => {
      const selectedVariant = perfumeVariants.find(v => v.id === selectedVariantId);
      return selectedVariant?.stock !== undefined && (
        <div className="col-span-2">
          <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Disponibilidad</p>
          <p className={`font-bold ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-blue-600'}`}>
            {selectedVariant.stock > 0 
              ? `${selectedVariant.stock} unidades disponibles` 
              : 'Pre-orden disponible'}
          </p>
        </div>
      );
    })()}
  </div>

  {/* PIRÁMIDE OLFATIVA (si tiene notas) */}
  {(selectedPerfume.top_notes || selectedPerfume.heart_notes || selectedPerfume.base_notes) && (
    <div className="space-y-4">
      <p className="text-text text-xs uppercase tracking-widest font-bold">
        Pirámide Olfativa:
      </p>
      
      {selectedPerfume.top_notes && (
        <div className="p-4 rounded-xl bg-bg border border-glassBorder">
          <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Notas de Salida</p>
          <p className="text-text text-sm">{selectedPerfume.top_notes}</p>
        </div>
      )}
      
      {selectedPerfume.heart_notes && (
        <div className="p-4 rounded-xl bg-bg border border-glassBorder">
          <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Notas de Corazón</p>
          <p className="text-text text-sm">{selectedPerfume.heart_notes}</p>
        </div>
      )}
      
      {selectedPerfume.base_notes && (
        <div className="p-4 rounded-xl bg-bg border border-glassBorder">
          <p className="text-muted text-[9px] uppercase tracking-widest mb-2">Notas de Fondo</p>
          <p className="text-text text-sm">{selectedPerfume.base_notes}</p>
        </div>
      )}
    </div>
  )}
</div>

                {/* Descripción */}
                <p className="text-muted text-sm leading-relaxed mb-8 italic">
                  "{selectedPerfume.description || "Una sinfonía olfativa diseñada para trascender."}"
                </p>

                {/* Mensaje de Pre-orden (si la variante seleccionada está agotada) */}
                {(() => {
                  const selectedVariant = perfumeVariants.find(v => v.id === selectedVariantId);
                  const isOutOfStock = selectedVariant && selectedVariant.stock === 0;
                  const canPreorder = selectedVariant?.is_preorder_enabled !== false;
                  
                  if (isOutOfStock && canPreorder) {
                    // Calcular días estimados
                    let estimatedDays = "20-25";
                    if (importSettings) {
                      const method = importSettings.active_method;
                      if (method === 'courier') {
                        const min = (importSettings.courier_supplier_days_min || 7) + 
                                    (importSettings.courier_shipping_days || 7) + 
                                    (importSettings.courier_warehouse_days_min || 3);
                        const max = (importSettings.courier_supplier_days_max || 9) + 
                                    (importSettings.courier_shipping_days || 7) + 
                                    (importSettings.courier_warehouse_days_max || 7);
                        estimatedDays = `${min}-${max}`;
                      } else {
                        const min = (importSettings.viajero_supplier_days_min || 7) + 
                                    (importSettings.viajero_shipping_days_min || 10) + 
                                    (importSettings.viajero_warehouse_days_min || 3);
                        const max = (importSettings.viajero_supplier_days_max || 9) + 
                                    (importSettings.viajero_shipping_days_max || 20) + 
                                    (importSettings.viajero_warehouse_days_max || 7);
                        estimatedDays = `${min}-${max}`;
                      }
                    }

                    return (
                      <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-2">
                          🕐 Pre-orden Disponible
                        </p>
                        <p className="text-blue-600 text-sm">
                          Este producto se pedirá al proveedor. <br />
                          Estimado de llegada: <span className="font-bold">{estimatedDays} días hábiles</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Botón de Compra Dinámico */}
                {(() => {
                  const selectedVariant = perfumeVariants.find(v => v.id === selectedVariantId);
                  const isInStock = selectedVariant ? selectedVariant.stock > 0 : selectedPerfume.stock > 0;
                  const canPreorder = selectedVariant?.is_preorder_enabled !== false;

                  return (
                    <button 
                      onClick={() => addToCart(selectedPerfume)} 
                      disabled={!isInStock && !canPreorder}
                      className={`w-full font-bold py-5 md:py-6 rounded-full text-[11px] tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 group relative overflow-hidden ${
                        isInStock
                          ? 'bg-text text-white hover:bg-accent'
                          : canPreorder
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-muted/20 text-muted cursor-not-allowed'
                      }`}
                    >
                      <span className="relative z-10">
                        {isInStock ? 'AÑADIR AL CARRITO' : canPreorder ? 'PRE-ORDENAR' : 'AGOTADO'}
                      </span>
                      <ShoppingBag className="h-5 w-5 relative z-10" />
                      {(isInStock || canPreorder) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      )}
                    </button>
                  );
                })()}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════ */}
      {/* CARRITO LATERAL                                      */}
      {/* ════════════════════════════════════════════════════ */}
      <CartDrawer 
  isOpen={isCartOpen} 
  onClose={() => setIsCartOpen(false)} 
  cartItems={cartItems} 
  onRemove={removeFromCart} 
  onRemoveMultiple={removeMultipleFromCart}
  onAdd={addToCart}
  importSettings={importSettings}
  onComplete={handlePurchase} 
/>
      
      {/* ════════════════════════════════════════════════════ */}
      {/* MODAL DE ÉXITO                                       */}
      {/* ════════════════════════════════════════════════════ */}
      <SuccessRitual isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      
            {/* ════════════════════════════════════════════════════ */}
      {/* TOAST - Stock Ticker Obsesivo (40/40)               */}
      {/* ════════════════════════════════════════════════════ */}
            <AnimatePresence>
  {showToast && (
    <motion.div 
      initial={{ y: 100, opacity: 0, scale: 0.9 }} 
      animate={{ y: 0, opacity: 1, scale: 1 }} 
      exit={{ y: 100, opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-8 left-8 z-[300] w-80"
    >
      <div className="bg-gradient-to-br from-white via-white to-bg backdrop-blur-xl rounded-2xl border border-glassBorder shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden">
        
        {/* Body Principal (SIN header redundante) */}
        {/* Body Principal */}
<div className="px-6 py-5 relative">
  {/* Marca de agua griega */}
  <div className="absolute top-2 right-4 text-[80px] text-text/[0.02] font-serif leading-none pointer-events-none">
    Ὀ
  </div>
  
  {/* Contenido */}
  <div className="flex items-start justify-between relative z-10">
    <div className="flex-1">
      {/* Barra decorativa */}
      <div className="h-1 w-10 bg-text rounded-full mb-3" />
      
      {/* Título IMPACTANTE */}
      <p className="text-text font-sans text-sm font-black uppercase tracking-[0.15em] mb-2 leading-none">
        VENDIDO
      </p>
      
      {/* Info secundaria */}
      <p className="text-muted text-xs tracking-wide">
        {randomCity} • Hace 2 min
      </p>
    </div>
    
    <button 
      onClick={() => setShowToast(false)} 
      className="text-muted hover:text-text transition-colors ml-4"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
</div>
        
      </div>
    </motion.div>
  )}
</AnimatePresence>

      {/* ════════════════════════════════════════════════════ */}
      {/* FOOTER                                               */}
      {/* ════════════════════════════════════════════════════ */}
      <footer className="py-20 text-center border-t border-glassBorder mt-40">
        <p className="text-[10px] tracking-[1em] uppercase font-black text-text/40">
          ÍKHOR • Ecuador 2026
        </p>
        <p className="text-[8px] tracking-[0.5em] uppercase text-muted mt-2">
          Ἰχώρ
        </p>
      </footer>

    </main>
  );
}
