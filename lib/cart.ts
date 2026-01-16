import { createClient } from "@/lib/supabaseClient";
import type { Perfume } from "@/lib/types";

export async function addToCart(perfume: Perfume) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const { error } = await supabase.from("cart_items").insert({
    user_id: user.id,
    perfume_id: perfume.id,
    qty: 1
  });
  if (error) throw error;
}

export async function removeFromCart(perfumeId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("perfume_id", perfumeId);
  if (error) throw error;
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
