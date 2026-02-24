"use client";

import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import SuccessRitual from "@/components/SuccessRitual";
import HeroSection from "@/components/HeroSection";
import QuoteSection from "@/components/QuoteSection";
import SearchFilters from "@/components/SearchFilters";
import ProductGrid from "@/components/ProductGrid";
import ProductModal from "@/components/ProductModal";
import SocialProofToast from "@/components/SocialProofToast";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useSocialProof } from "@/hooks/useSocialProof";
import { createClient } from "@/lib/supabaseClient";
import type { Perfume, PerfumeVariant } from "@/lib/types";

export default function HomePage() {
  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Modal state
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [perfumeVariants, setPerfumeVariants] = useState<PerfumeVariant[]>([]);

  // Hooks
  const {
    cartItems, isCartOpen, setIsCartOpen, isSuccessOpen, setIsSuccessOpen,
    addToCart, removeFromCart, removeMultipleFromCart, handlePurchase,
  } = useCart();

  const {
    products, filteredProducts, loading,
    searchQuery, setSearchQuery,
    selectedBrand, setSelectedBrand,
    brands, importSettings,
  } = useProducts();

  const { showToast, setShowToast, randomCity } = useSocialProof();

  // Load variants when a product is selected
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
      const defaultVariant = data.find((v: PerfumeVariant) => v.is_default) || data[0];
      setSelectedVariantId(defaultVariant.id);
    }
  };

  const handleProductClick = (product: Perfume) => {
    setSelectedPerfume(product);
    loadVariants(product.id);
  };

  const handleModalClose = () => {
    setSelectedPerfume(null);
    setPerfumeVariants([]);
    setSelectedVariantId(null);
  };

  const handleAddToCart = async (perfume: Perfume) => {
    await addToCart(perfume);
    setSelectedPerfume(null);
  };

  return (
    <main className="relative min-h-screen bg-bg selection:bg-accent/30 selection:text-text antialiased">
      
      {/* Barra de Progreso de Scroll - Superior */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[100] origin-left" 
        style={{ scaleX }} 
      />
      
      <Navbar onOpenCart={() => setIsCartOpen(true)} cartCount={cartItems.length} />
      
      <HeroSection />
      <QuoteSection />
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        brands={brands}
        filteredProductsCount={filteredProducts.length}
      />
      <ProductGrid
        loading={loading}
        products={products}
        filteredProducts={filteredProducts}
        searchQuery={searchQuery}
        selectedBrand={selectedBrand}
        onProductClick={handleProductClick}
        onClearFilters={() => { setSearchQuery(""); setSelectedBrand(null); }}
      />

      <ProductModal
        selectedPerfume={selectedPerfume}
        onClose={handleModalClose}
        perfumeVariants={perfumeVariants}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
        importSettings={importSettings}
        onAddToCart={handleAddToCart}
      />

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
      
      <SuccessRitual isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      
      <SocialProofToast
        showToast={showToast}
        randomCity={randomCity}
        onClose={() => setShowToast(false)}
      />

      <Footer />
    </main>
  );
}
