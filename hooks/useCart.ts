"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { addToCart as addToCartDB, removeFromCart as removeFromCartDB, clearCart } from "@/lib/cart";
import type { Perfume } from "@/lib/types";

export function useCart() {
  const [cartItems, setCartItems] = useState<Perfume[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const getCart = async (): Promise<Perfume[]> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: cartData } = await supabase
      .from("cart_items")
      .select("perfume_id")
      .eq("user_id", user.id);

    if (!cartData || cartData.length === 0) return [];

    const perfumeIds = cartData.map((item) => item.perfume_id);
    const { data: perfumes } = await supabase
      .from("perfumes")
      .select("*")
      .in("id", perfumeIds);

    return perfumes || [];
  };

  useEffect(() => {
    async function loadCart() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const cartFromDB = await getCart();
          setCartItems(cartFromDB);
        } else {
          const savedCart = localStorage.getItem("aura-cart");
          if (savedCart) setCartItems(JSON.parse(savedCart));
        }
      } catch (e) {
        console.error("Error cargando carrito:", e);
      }
    }
    loadCart();
  }, []);

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
        await addToCartDB(perfume);
      }

      setCartItems((prev) => [...prev, perfume]);
      setIsCartOpen(true);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al añadir al carrito";
      alert(msg);
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

      setCartItems((prev) => prev.filter((_, i) => i !== index));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al eliminar del carrito";
      alert(msg);
    }
  };

  const removeMultipleFromCart = async (indices: number[]) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const perfumesToRemove = indices.map((i) => cartItems[i]);
        const uniquePerfumeIds = [...new Set(perfumesToRemove.map((p) => p.id))];

        for (const perfumeId of uniquePerfumeIds) {
          await removeFromCartDB(perfumeId);
        }
      }

      setCartItems((prev) => prev.filter((_, i) => !indices.includes(i)));
    } catch (error: unknown) {
      console.error("Error al eliminar:", error);
    }
  };

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

  return {
    cartItems,
    addToCart,
    removeFromCart,
    removeMultipleFromCart,
    handlePurchase,
    isCartOpen,
    setIsCartOpen,
    isSuccessOpen,
    setIsSuccessOpen,
  };
}
