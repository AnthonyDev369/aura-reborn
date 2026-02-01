"use client";

/**
 * ════════════════════════════════════════════════════════════
 * PRODUCT MANAGEMENT - ÍKHOR
 * ════════════════════════════════════════════════════════════
 * 
 * Panel de gestión completa de productos
 * 
 * FUNCIONALIDADES:
 * ✅ Ver todos los productos activos
 * ✅ Editar información básica (nombre, descripción, marca)
 * ✅ Gestionar stock por variante
 * ✅ Marcar variantes como tester
 * ✅ Habilitar/deshabilitar pre-orden
 * ✅ Editar specs (notas olfativas, origen, familia)
 * ✅ Gestionar variantes de tamaño
 * ✅ Subir imágenes
 * ✅ Activar/desactivar productos
 * 
 * DISEÑO ÍKHOR 40/40:
 * - Minimalista extremo
 * - Todo editable inline
 * - Cambios en tiempo real
 * ════════════════════════════════════════════════════════════
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { Package, Edit, Save, X, Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface Perfume {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  ml: number;
  image_url: string | null;
  active: boolean;
  stock: number;
  category: string;
  brand: string | null;
  origin_country: string | null;
  fragrance_family: string | null;
  top_notes: string | null;
  heart_notes: string | null;
  base_notes: string | null;
  concentration: string | null;
  is_preorder_enabled: boolean;
}

interface Variant {
  id: string;
  perfume_id: string;
  size_ml: number;
  price_cents: number;
  cost_cents: number;
  stock: number;
  is_tester: boolean;
  is_default: boolean;
  active: boolean;
  sku: string | null;
}

export default function ProductsPage() {
  const router = useRouter();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [variants, setVariants] = useState<Record<string, Variant[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== "anthonybarreiro369@gmail.com") {
      router.push("/");
      return;
    }

    // Cargar perfumes
    const { data: perfumesData } = await supabase
      .from("perfumes")
      .select("*")
      .order("created_at", { ascending: false });

    if (perfumesData) {
      setPerfumes(perfumesData);
      
      // Cargar variantes de cada perfume
      const variantsMap: Record<string, Variant[]> = {};
      for (const perfume of perfumesData) {
        const { data: variantData } = await supabase
          .from("perfume_variants")
          .select("*")
          .eq("perfume_id", perfume.id)
          .order("size_ml", { ascending: true });
        
        if (variantData) {
          variantsMap[perfume.id] = variantData;
        }
      }
      setVariants(variantsMap);
    }
    
    setLoading(false);
  }

  async function updatePerfume(perfume: Perfume) {
    const supabase = createClient();
    const { error } = await supabase
      .from("perfumes")
      .update(perfume)
      .eq("id", perfume.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Producto actualizado");
      setEditingId(null);
      loadProducts();
    }
  }

  async function updateVariant(variant: Variant) {
    const supabase = createClient();
    const { error } = await supabase
      .from("perfume_variants")
      .update(variant)
      .eq("id", variant.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Variante actualizada");
      loadProducts();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-muted">Cargando productos...</p>
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-bg py-32 px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ════════════════════════════════════════════ */}
        {/* HEADER                                       */}
        {/* ════════════════════════════════════════════ */}
        <div className="mb-16 pb-8 border-b border-glassBorder">
          <div className="h-1 w-12 bg-accent/30 rounded-full mb-4" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-serif text-text mb-4 tracking-tight">
                Gestión de Productos
              </h1>
              <p className="text-muted text-sm uppercase tracking-widest">
                Stock, Variantes y Especificaciones ÍKHOR
              </p>
            </div>
            <button
              onClick={() => router.push("/admin")}
              className="px-6 py-3 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all text-sm uppercase tracking-widest font-bold"
            >
              ← Volver
            </button>
          </div>
          <button
  onClick={async () => {
    try {
      const clipboard = await navigator.clipboard.readText();
      const data = JSON.parse(clipboard);
      const supabase = createClient();
      const { error } = await supabase.from('perfumes').insert([{
        name: data.nombre,
        brand: data.marca,
        price_cents: Math.round(data.precio_ikhor * 100),
        cost_cents: Math.round(data.precio_proveedor * 100),
        ml: data.ml || 100,
        image_url: data.imagen,
        description: data.descripcion,
        active: true,
        stock: 0,
        lead_time_days: 20,
        is_preorder_enabled: true,
        category: 'diseñador_premium',
        shipping_to_courier_cents: 1000,
        shipping_to_ecuador_cents: 1500,
        local_shipping_cents: 700
      }]);
      if (error) alert('Error: ' + error.message);
      else { alert('✅ Producto importado!'); window.location.reload(); }
    } catch (err) { alert('Error: ' + err.message); }
  }}
  className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-text transition-all text-sm uppercase tracking-widest font-bold"
>
  📋 Importar desde Portapapeles
</button>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* LISTA DE PRODUCTOS                           */}
        {/* ════════════════════════════════════════════ */}
        <div className="space-y-8">
          {perfumes.map((perfume) => {
            const isEditing = editingId === perfume.id;
            const isExpanded = expandedId === perfume.id;
            const perfumeVariants = variants[perfume.id] || [];
            const totalStock = perfumeVariants.reduce((sum, v) => sum + (v.stock || 0), 0);

            return (
              <div key={perfume.id} className="bg-white border border-glassBorder p-8 rounded-3xl">
                
                {/* Header del Producto */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-6">
                    {/* Imagen */}
                    <div className="w-24 h-24 bg-bg rounded-xl border border-glassBorder overflow-hidden flex-shrink-0">
                      {perfume.image_url ? (
                        <img src={perfume.image_url} alt={perfume.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-accent/30" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info Básica */}
                    <div>
                      <h3 className="text-text font-serif text-2xl mb-2">{perfume.name}</h3>
                      <p className="text-muted text-sm mb-2">{perfume.brand || 'Sin marca'}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-muted">
                          Stock Total: <span className="text-text font-bold">{totalStock}</span>
                        </span>
                        <span className="text-muted">
                          Variantes: <span className="text-text font-bold">{perfumeVariants.length}</span>
                        </span>
                        <span className={`font-bold ${perfume.active ? 'text-green-600' : 'text-red-600'}`}>
                          {perfume.active ? '● Activo' : '● Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-3">
                    {!isEditing && (
                      <button
                        onClick={() => setEditingId(perfume.id)}
                        className="px-6 py-3 bg-accent/10 border border-accent/30 text-text rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" /> Editar
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : perfume.id)}
                      className="px-6 py-3 border border-glassBorder text-text rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-bg transition-all"
                    >
                      {isExpanded ? '▼ Ocultar' : '▶ Ver'} Variantes
                    </button>
                  </div>
                </div>
                {/* MODO EDICIÓN - Formulario Completo */}
                {isEditing && (
                  <div className="space-y-6 p-6 rounded-xl bg-bg border border-accent/20">
                    
                    {/* Información Básica */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Nombre</label>
                        <input
                          value={perfume.name}
                          onChange={(e) => setPerfumes(perfumes.map(p => p.id === perfume.id ? {...p, name: e.target.value} : p))}
                          className="w-full p-3 bg-white border border-glassBorder rounded-xl text-text"
                        />
                      </div>
                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Marca</label>
                        <input
                          value={perfume.brand || ''}
                          onChange={(e) => setPerfumes(perfumes.map(p => p.id === perfume.id ? {...p, brand: e.target.value} : p))}
                          placeholder="Ej: Chanel, Dior, Tom Ford"
                          className="w-full p-3 bg-white border border-glassBorder rounded-xl text-text placeholder:text-muted/40"
                        />
                      </div>
                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Categoría</label>
                        <select
                          value={perfume.category}
                          onChange={(e) => setPerfumes(perfumes.map(p => p.id === perfume.id ? {...p, category: e.target.value} : p))}
                          className="w-full p-3 bg-white border border-glassBorder rounded-xl text-text cursor-pointer"
                        >
                          <option value="dupe_arabe">Dupe Árabe</option>
                          <option value="arabe_medio">Árabe Medio</option>
                          <option value="arabe_premium">Árabe Premium</option>
                          <option value="diseñador_mainstream">Diseñador Mainstream</option>
                          <option value="diseñador_premium">Diseñador Premium</option>
                          <option value="nicho_accesible">Nicho Accesible</option>
                          <option value="ultra_nicho">Ultra-Nicho</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Origen</label>
                        <input
                          value={perfume.origin_country || ''}
                          onChange={(e) => setPerfumes(perfumes.map(p => p.id === perfume.id ? {...p, origin_country: e.target.value} : p))}
                          placeholder="Ej: Francia, Italia, UAE"
                          className="w-full p-3 bg-white border border-glassBorder rounded-xl text-text placeholder:text-muted/40"
                        />
                      </div>
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Descripción</label>
                      <textarea
                        value={perfume.description || ''}
                        onChange={(e) => setPerfumes(perfumes.map(p => p.id === perfume.id ? {...p, description: e.target.value} : p))}
                        rows={3}
                        className="w-full p-3 bg-white border border-glassBorder rounded-xl text-text resize-none"
                      />
                    </div>

                    {/* Notas Olfativas */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Notas de Salida</label>
                        <input
                          value={perfume.top_notes || ''}
                          onChange={(e) => setPerfumes(perfumes.map(p => p.id === perfume.id ? {...p, top_notes: e.target.value} : p))}
                          placeholder="Ej: Bergamota, Limón"
                          className="w-full p-3 bg-white border border-glassBorder rounded-xl text-text text-sm placeholder:text-muted/40"
                        />
                      </div>
                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Notas de Corazón</label>
                        <input
                          value={perfume.heart_notes || ''}
                          onChange={(e) => setPerfumes(perfumes.map(p => p.id === perfume.id ? {...p, heart_notes: e.target.value} : p))}
                          placeholder="Ej: Rosa, Jazmín"
                          className="w-full p-3 bg-white border border-glassBorder rounded-xl text-text text-sm placeholder:text-muted/40"
                        />
                      </div>
                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Notas de Fondo</label>
                        <input
                          value={perfume.base_notes || ''}
                          onChange={(e) => setPerfumes(perfumes.map(p => p.id === perfume.id ? {...p, base_notes: e.target.value} : p))}
                          placeholder="Ej: Oud, Vainilla"
                          className="w-full p-3 bg-white border border-glassBorder rounded-xl text-text text-sm placeholder:text-muted/40"
                        />
                      </div>
                    </div>

                    {/* Opciones */}
                    <div className="flex items-center gap-6 p-4 rounded-xl bg-white border border-glassBorder">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perfume.active}
                          onChange={(e) => setPerfumes(perfumes.map(p => p.id === perfume.id ? {...p, active: e.target.checked} : p))}
                          className="h-4 w-4 accent-text"
                        />
                        <span className="text-text text-sm font-medium">Producto Activo</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perfume.is_preorder_enabled}
                          onChange={(e) => setPerfumes(perfumes.map(p => p.id === perfume.id ? {...p, is_preorder_enabled: e.target.checked} : p))}
                          className="h-4 w-4 accent-text"
                        />
                        <span className="text-text text-sm font-medium">Permitir Pre-orden</span>
                      </label>
                    </div>

                    {/* Botones Guardar/Cancelar */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => updatePerfume(perfume)}
                        className="flex-1 bg-text text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-accent transition-all uppercase tracking-widest text-sm"
                      >
                        <Save className="h-4 w-4" /> Guardar Cambios
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-6 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                {/* VARIANTES EXPANDIDAS */}
                {isExpanded && perfumeVariants.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="h-5 w-5 text-accent" />
                      <p className="text-text font-bold uppercase tracking-widest text-sm">
                        Gestión de Variantes
                      </p>
                    </div>

                    {/* Lista de Variantes */}
                    {perfumeVariants.map((variant) => (
                      <div key={variant.id} className="p-6 rounded-2xl bg-bg border border-glassBorder">
                        <div className="grid grid-cols-5 gap-4 items-center">
                          
                          {/* Tamaño */}
                          <div>
                            <p className="text-muted text-[10px] uppercase tracking-widest mb-2">Tamaño</p>
                            <p className="text-text font-bold text-lg">{variant.size_ml}ml</p>
                            {variant.is_default && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-accent text-[8px] uppercase tracking-widest rounded">
                                Default
                              </span>
                            )}
                          </div>

                          {/* Precio */}
                          <div>
                            <p className="text-muted text-[10px] uppercase tracking-widest mb-2">Precio</p>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={(variant.price_cents / 100).toFixed(2)}
                                onChange={(e) => {
                                  const updated = {...variant, price_cents: Math.round(parseFloat(e.target.value) * 100)};
                                  setVariants({...variants, [perfume.id]: variants[perfume.id].map(v => v.id === variant.id ? updated : v)});
                                }}
                                className="w-full pl-8 pr-3 py-2 bg-white border border-glassBorder rounded-xl text-text text-sm"
                              />
                            </div>
                          </div>

                          {/* Stock */}
                          <div>
                            <p className="text-muted text-[10px] uppercase tracking-widest mb-2">Stock</p>
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => {
                                const updated = {...variant, stock: parseInt(e.target.value) || 0};
                                setVariants({...variants, [perfume.id]: variants[perfume.id].map(v => v.id === variant.id ? updated : v)});
                              }}
                              className="w-full p-2 bg-white border border-glassBorder rounded-xl text-text text-center font-bold"
                            />
                          </div>

                          {/* Checkboxes */}
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={variant.is_tester}
                                onChange={(e) => {
                                  const updated = {...variant, is_tester: e.target.checked};
                                  setVariants({...variants, [perfume.id]: variants[perfume.id].map(v => v.id === variant.id ? updated : v)});
                                }}
                                className="h-4 w-4 accent-text"
                              />
                              <span className="text-text text-xs font-medium">Es Tester</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={variant.active}
                                onChange={(e) => {
                                  const updated = {...variant, active: e.target.checked};
                                  setVariants({...variants, [perfume.id]: variants[perfume.id].map(v => v.id === variant.id ? updated : v)});
                                }}
                                className="h-4 w-4 accent-text"
                              />
                              <span className="text-text text-xs font-medium">Activa</span>
                            </label>
                          </div>

                          {/* Botón Guardar */}
                          <button
                            onClick={() => updateVariant(variant)}
                            className="px-4 py-2 bg-text text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent transition-all flex items-center justify-center gap-2"
                          >
                            <Save className="h-3 w-3" /> Guardar
                          </button>
                        </div>

                        {/* SKU (si existe) */}
                        {variant.sku && (
                          <div className="mt-3 pt-3 border-t border-glassBorder">
                            <p className="text-muted text-[9px] uppercase tracking-widest">
                              SKU: <span className="text-text font-mono">{variant.sku}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
