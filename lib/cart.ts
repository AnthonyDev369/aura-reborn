import { createClient } from "@/lib/supabaseClient";
import type { Perfume } from "@/lib/types";

// Añadir al carrito - OPTIMISTA (sin await)
export async function addToCart(perfume: Perfume) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  // Ejecutar en background (sin bloquear UI)
  supabase
    .from("cart_items")
    .select("id, qty")
    .eq("user_id", user.id)
    .eq("perfume_id", perfume.id)
    .maybeSingle()
    .then(({ data: existing }) => {
      if (existing) {
        supabase
          .from("cart_items")
          .update({ qty: existing.qty + 1 })
          .eq("id", existing.id)
          .then(({ error }) => { if (error) console.error(error); });
      } else {
        supabase
          .from("cart_items")
          .insert({ user_id: user.id, perfume_id: perfume.id, qty: 1 })
          .then(({ error }) => { if (error) console.error(error); });
      }
    });
}

// Eliminar del carrito - OPTIMISTA
export async function removeFromCart(perfumeId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  // Ejecutar en background
  supabase
    .from("cart_items")
    .select("id, qty")
    .eq("user_id", user.id)
    .eq("perfume_id", perfumeId)
    .maybeSingle()
    .then(({ data: existing }) => {
      if (!existing) return;
      
      if (existing.qty > 1) {
        supabase
          .from("cart_items")
          .update({ qty: existing.qty - 1 })
          .eq("id", existing.id)
          .then(({ error }) => { if (error) console.error(error); });
      } else {
        supabase
          .from("cart_items")
          .delete()
          .eq("id", existing.id)
          .then(({ error }) => { if (error) console.error(error); });
      }
    });
}

export async function getCart(): Promise<Perfume[]> {
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
}

export async function clearCart() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);
  if (error) throw error;
}
