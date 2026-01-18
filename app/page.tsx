"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Droplets, Sparkles, X, ShoppingBag, MapPin, Info, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import SuccessRitual from "@/components/SuccessRitual";
import { createClient } from "@/lib/supabaseClient";
import { addToCart as addToCartDB, removeFromCart as removeFromCartDB, clearCart } from "@/lib/cart";
import type { Perfume } from "@/lib/types";

export default function HomePage() {
  const [products, setProducts] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Perfume[]>([]);
  const [showToast, setShowToast] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  // --- CONFIGURACIÓN CIUDADES ECUADOR ---
  const [randomCity, setRandomCity] = useState("Quito");
    // Importar función getCart localmente
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
  const citiesEC = ["Quito", "Guayaquil", "Cuenca", "Manta", "Machala", "Ambato", "Riobamba", "Loja", "Ibarra", "Salinas"];

  useEffect(() => {
    const interval = setInterval(() => {
      const city = citiesEC[Math.floor(Math.random() * citiesEC.length)];
      setRandomCity(city);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000); // Se oculta tras 5 seg
    }, 12000); // Aparece cada 12 segundos
    return () => clearInterval(interval);
  }, []);

  // 1. CARGAR DATOS (Supabase + LocalStorage)
  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("perfumes").select("*").eq("active", true);
        if (data) setProducts(data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    fetchProducts();

    // Cargar carrito desde Supabase (solo usuarios logueados)
    async function loadCart() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Usuario logueado: cargar de Supabase
          const cartFromDB = await getCart();
          setCartItems(cartFromDB);
        } else {
          // Usuario no logueado: cargar de localStorage
          const savedCart = localStorage.getItem("aura-cart");
          if (savedCart) setCartItems(JSON.parse(savedCart));
        }
      } catch (e) {
        console.error("Error cargando carrito:", e);
      }
    }
    loadCart();

    setTimeout(() => setShowToast(true), 7000);
  }, []);

  // 2. GUARDAR CARRITO AUTOMÁTICAMENTE
  // 2. GUARDAR CARRITO AUTOMÁTICAMENTE
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("aura-cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

    const addToCart = async (perfume: Perfume) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Usuario logueado: guardar en Supabase
        await addToCartDB(perfume);
      }
      
      // Siempre actualizar estado local
      setCartItems([...cartItems, perfume]);
      setIsCartOpen(true);
      setSelectedPerfume(null);
    } catch (error: any) {
      alert(error.message || "Error al añadir al carrito");
    }
  };
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

const removeMultipleFromCart = async (indices: number[]) => {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Eliminar de Supabase si está logueado
    if (user) {
      const perfumesToRemove = indices.map(i => cartItems[i]);
      const uniquePerfumeIds = [...new Set(perfumesToRemove.map(p => p.id))];
      
      for (const perfumeId of uniquePerfumeIds) {
        await removeFromCartDB(perfumeId);
      }
    }
    
    // Eliminar TODOS de una vez del estado local
    const newItems = cartItems.filter((_, i) => !indices.includes(i));
    setCartItems(newItems);
  } catch (error: any) {
    console.error("Error al eliminar:", error);
  }
};
    const handlePurchase = async () => {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Limpiar carrito de Supabase
      await clearCart();
    } else {
      // Limpiar carrito de localStorage
      localStorage.removeItem("aura-cart");
    }
    
    setIsCartOpen(false);
    setIsSuccessOpen(true);
    setCartItems([]); // Vaciar carrito local
  } catch (error) {
    console.error("Error en compra:", error);
    setIsSuccessOpen(true);
  }
};

  return (
    <main className="relative min-h-screen bg-bg selection:bg-accent/30 selection:text-white antialiased">
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[100] origin-left shadow-[0_0_15px_rgba(212,175,55,0.8)]" style={{ scaleX }} />
      <Navbar onOpenCart={() => setIsCartOpen(true)} cartCount={cartItems.length} />
      
      {/* HERO MEJORADO */}
      <section className="relative pt-56 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-accent/[0.03] blur-[160px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block mb-12 px-8 py-2.5 rounded-full border border-accent/20 bg-accent/5 text-[10px] tracking-[0.7em] text-accent uppercase font-black shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]">Aura Reborn • Maison 2026</motion.div>
          <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} className="text-7xl md:text-[10rem] font-serif mb-12 text-white tracking-tighter leading-[0.85]">
            Lujo que respira <br /> <span className="text-accent italic drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]">en la piel.</span>
          </motion.h1>
        </div>
      </section>

      {/* RITUAL MANIFIESTO */}
      <section className="py-48 px-6 bg-white/[0.01] border-y border-glassBorder/30 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.01] to-transparent" />
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Sparkles className="h-8 w-8 text-accent/20 mx-auto mb-12 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-serif italic text-white/70 max-w-3xl mx-auto leading-snug tracking-tight">"No vestimos el cuerpo, vestimos la memoria que dejas al pasar."</h2>
          <p className="font-serif italic text-accent/30 text-2xl mt-12 tracking-widest">— Atelier A. Reborn</p>
        </motion.div>
      </section>

      {/* GRID PRODUCTOS */}
      <section className="px-8 py-40">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[1, 2, 3].map(i => <div key={i} className="glass-panel h-[600px] shimmer rounded-[50px]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {products.map((product, index) => (
                <div key={product.id} onClick={() => setSelectedPerfume(product)} className="cursor-pointer group">
                  <motion.div initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
                    <ProductCard perfume={product} />
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL DETALLE MASTER */}
      <AnimatePresence>
        {selectedPerfume && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-bg/95 backdrop-blur-2xl" onClick={() => setSelectedPerfume(null)} />
            <motion.div initial={{ scale: 0.95, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25 }} className="relative w-full max-w-6xl bg-[rgba(255,255,255,0.02)] border border-glassBorder rounded-[70px] overflow-hidden flex flex-col md:flex-row h-[85vh] shadow-[0_150px_300px_rgba(0,0,0,1)]">
              <button onClick={() => setSelectedPerfume(null)} className="absolute top-12 right-12 p-5 rounded-full bg-white/5 border border-white/10 text-white z-50 hover:bg-accent hover:text-bg transition-all duration-500"><X /></button>
              <div className="w-full md:w-1/2 bg-white/[0.04] flex items-center justify-center relative border-r border-glassBorder/50">
                <img src={selectedPerfume.image_url || ""} className="w-full h-full object-cover opacity-60 scale-105 hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
              </div>
              <div className="flex-1 p-16 md:p-24 flex flex-col justify-center bg-gradient-to-br from-transparent to-accent/[0.02]">
                <div className="flex items-center gap-4 mb-10">
                  <span className="relative h-2.5 w-2.5"><span className="animate-ping absolute h-full w-full rounded-full bg-accent opacity-75"></span><span className="h-2.5 w-2.5 bg-accent rounded-full block"></span></span>
                  <span className="text-[11px] tracking-[0.6em] text-accent font-black uppercase">Obra Maestra • Atelier</span>
                </div>
                <h2 className="text-7xl font-serif text-white mb-8 tracking-tighter leading-none">{selectedPerfume.name}</h2>
                <div className="flex items-center gap-10 mb-16 pb-10 border-b border-glassBorder/50">
                  <span className="text-4xl font-bold text-accent drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">${(selectedPerfume.price_cents / 100).toFixed(2)}</span>
                  <span className="text-muted tracking-[0.3em] uppercase text-xs font-bold">{selectedPerfume.ml}ml • Essence de Parfum</span>
                </div>
                <p className="text-muted text-xl font-light leading-relaxed mb-20 max-w-lg italic">"{selectedPerfume.description || "Una sinfonía olfativa diseñada para trascender."}"</p>
                <button onClick={() => addToCart(selectedPerfume)} className="w-full bg-accent text-bg font-black py-7 rounded-full text-[12px] tracking-[0.5em] uppercase hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-5 group relative overflow-hidden">
                  <span className="relative z-10">Añadir al ritual</span><ShoppingBag className="h-5 w-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

<CartDrawer 
  isOpen={isCartOpen} 
  onClose={() => setIsCartOpen(false)} 
  cartItems={cartItems} 
  onRemove={removeFromCart} 
  onRemoveMultiple={removeMultipleFromCart}
  onAdd={addToCart}
  onComplete={handlePurchase} 
/>
      
            {/* 3. Toast de Prueba Social Localizado */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ x: -150, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: -150, opacity: 0 }}
            className="fixed bottom-12 left-12 z-[300] glass-panel px-10 py-6 flex items-center gap-8 border-accent/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="relative">
              <MapPin className="h-6 w-6 text-accent animate-pulse" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-ping" />
            </div>
            <div className="text-left">
              <p className="text-[13px] text-white font-bold tracking-tight italic">Adquisición reciente en {randomCity}</p>
              <p className="text-[10px] text-accent/60 tracking-[0.4em] uppercase font-black">Aura Reborn Maison</p>
            </div>
            <button onClick={() => setShowToast(false)} className="ml-6 text-muted hover:text-white transition-all transform hover:rotate-90">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-20 text-center opacity-20 border-t border-glassBorder mt-40">
        <p className="text-[10px] tracking-[1em] uppercase font-black text-white">The Art of Scent • Ecuador 2026</p>
      </footer>

    </main>
  );
}
