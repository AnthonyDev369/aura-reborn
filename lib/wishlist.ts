import { createClient } from "@/lib/supabaseClient";

export async function toggleWishlist(perfumeId: string) {
  const supabase = createClient();
  
  // Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión para guardar favoritos");

  // Verificar si ya existe
  const { data: existing } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("perfume_id", perfumeId)
    .maybeSingle();

  if (existing) {
    // Si existe, elimina
    await supabase.from("wishlist").delete().eq("id", existing.id);
    return false; // Corazón vacío
  } else {
    // Si no existe, añade
    await supabase.from("wishlist").insert({ user_id: user.id, perfume_id: perfumeId });
    return true; // Corazón lleno
  }
}

export async function isInWishlist(perfumeId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("perfume_id", perfumeId)
    .maybeSingle();

  return !!data;
}
