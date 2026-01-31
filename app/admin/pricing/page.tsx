"use client";

/**
 * ════════════════════════════════════════════════════════════
 * PRICING CALCULATOR - ÍKHOR
 * ════════════════════════════════════════════════════════════
 * 
 * Calculadora inteligente de precios con FÓRMULA HÍBRIDA
 * 
 * FÓRMULA:
 * Precio = Costo Total × (1 + Margen Base + Bonos)
 * 
 * Margen Base: 20% (mínimo rentable)
 * Bonos: Según categoría + stock
 * 
 * OBJETIVO:
 * - Ser el más barato de Ecuador (40-50% descuento vs competencia)
 * - Nunca perder (mínimo 20% ganancia)
 * - Pricing óptimo 40/40 automático
 * ════════════════════════════════════════════════════════════
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { DollarSign, Save, Calculator, TrendingUp, X } from "lucide-react";

interface Perfume {
  id: string;
  name: string;
  ml: number;
  price_cents: number;
  cost_cents: number;
  shipping_to_courier_cents: number;
  shipping_to_ecuador_cents: number;
  local_shipping_cents: number;
  stock: number;
  category: string;
  subcategory: string | null;
}

// BONOS DE MARGEN POR CATEGORÍA
const CATEGORY_BONUSES: Record<string, number> = {
  'dupe_arabe': 0.10,           // +10%
  'arabe_medio': 0.25,          // +25%
  'arabe_premium': 0.35,        // +35%
  'diseñador_mainstream': 0.20, // +20%
  'diseñador_premium': 0.35,    // +35%
  'nicho_accesible': 0.25,      // +25%
  'ultra_nicho': 0.40           // +40%
};

export default function PricingPage() {
  const router = useRouter();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadPerfumes();
  }, []);

  async function loadPerfumes() {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== "anthonybarreiro369@gmail.com") {
      router.push("/");
      return;
    }

    const { data } = await supabase
      .from("perfumes")
      .select("*")
      .eq("active", true);

    if (data) setPerfumes(data);
    setLoading(false);
  }

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Calcular precio óptimo con FÓRMULA HÍBRIDA
  // ─────────────────────────────────────────────────────────
  function calculateOptimalPrice(perfume: Perfume): number {
    // Costo Total (lo que ocupa el cupo)
    const totalCost = (perfume.cost_cents + 
                      perfume.shipping_to_courier_cents + 
                      perfume.shipping_to_ecuador_cents + 
                      perfume.local_shipping_cents) / 100;

    // Margen base (20% mínimo)
    let margin = 0.20;

    // Bono por categoría
    const categoryBonus = CATEGORY_BONUSES[perfume.category] || 0.25;
    margin += categoryBonus;

    // Bono por stock bajo (escasez)
    if (perfume.stock < 5) {
      margin += 0.10;
    } else if (perfume.stock < 10) {
      margin += 0.05;
    }

    // Calcular precio
    const optimalPrice = totalCost * (1 + margin);

    // Redondeo psicológico (.99)
    return Math.floor(optimalPrice) + 0.99;
  }

  async function applyOptimalPrice(perfume: Perfume) {
    const optimalPrice = calculateOptimalPrice(perfume);
    const confirmed = window.confirm(`¿Aplicar precio óptimo $${optimalPrice.toFixed(2)} a ${perfume.name}?`);
    
    if (!confirmed) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("perfumes")
      .update({ price_cents: Math.round(optimalPrice * 100) })
      .eq("id", perfume.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Precio actualizado");
      loadPerfumes();
    }
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
      alert("Guardado");
      setEditingId(null);
      loadPerfumes();
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center"><p className="text-muted">Cargando...</p></div>;
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
                Calculadora de Precios
              </h1>
              <p className="text-muted text-sm uppercase tracking-widest">
                Sistema de Pricing Inteligente ÍKHOR
              </p>
            </div>
            <button
              onClick={() => router.push("/admin")}
              className="px-6 py-3 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all text-sm uppercase tracking-widest font-bold"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* LISTA DE PERFUMES CON CALCULADORA            */}
        {/* ════════════════════════════════════════════ */}
        <div className="space-y-6">
          {perfumes.map((perfume) => {
            const isEditing = editingId === perfume.id;
            
            // Calcular totales
            const totalCost = (perfume.cost_cents + 
                              perfume.shipping_to_courier_cents + 
                              perfume.shipping_to_ecuador_cents + 
                              perfume.local_shipping_cents) / 100;
            
            const currentPrice = perfume.price_cents / 100;
            const optimalPrice = calculateOptimalPrice(perfume);
            const currentMargin = ((currentPrice - totalCost) / totalCost * 100).toFixed(1);
            const optimalMargin = ((optimalPrice - totalCost) / totalCost * 100).toFixed(1);
            
            // Factura para cupo (solo costo + envío courier)
            const invoiceAmount = (perfume.cost_cents + perfume.shipping_to_courier_cents) / 100;

            return (
              <div key={perfume.id} className="bg-white border border-glassBorder p-8 rounded-3xl">
                
                {/* Header del Perfume */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-text font-serif text-2xl mb-2">{perfume.name}</h3>
                    <p className="text-muted text-sm">{perfume.ml}ml • Stock: {perfume.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted text-xs uppercase tracking-widest mb-1">Precio Actual</p>
                    <p className="text-text font-bold text-3xl">${currentPrice.toFixed(2)}</p>
                    <p className="text-muted text-xs">Margen: {currentMargin}%</p>
                  </div>
                </div>

                {isEditing ? (
                  // MODO EDICIÓN: Campos de Costos
                  <div className="space-y-6 p-6 rounded-xl bg-bg border border-glassBorder">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Costo Proveedor</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={(perfume.cost_cents / 100).toFixed(2)}
                            onChange={(e) => {
                              const updated = {...perfume, cost_cents: Math.round(parseFloat(e.target.value) * 100)};
                              setPerfumes(perfumes.map(p => p.id === perfume.id ? updated : p));
                            }}
                            className="w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Envío a Courier</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={(perfume.shipping_to_courier_cents / 100).toFixed(2)}
                            onChange={(e) => {
                              const updated = {...perfume, shipping_to_courier_cents: Math.round(parseFloat(e.target.value) * 100)};
                              setPerfumes(perfumes.map(p => p.id === perfume.id ? updated : p));
                            }}
                            className="w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Envío a Ecuador</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={(perfume.shipping_to_ecuador_cents / 100).toFixed(2)}
                            onChange={(e) => {
                              const updated = {...perfume, shipping_to_ecuador_cents: Math.round(parseFloat(e.target.value) * 100)};
                              setPerfumes(perfumes.map(p => p.id === perfume.id ? updated : p));
                            }}
                            className="w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Servientrega Local</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={(perfume.local_shipping_cents / 100).toFixed(2)}
                            onChange={(e) => {
                              const updated = {...perfume, local_shipping_cents: Math.round(parseFloat(e.target.value) * 100)};
                              setPerfumes(perfumes.map(p => p.id === perfume.id ? updated : p));
                            }}
                            className="w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selector de Categoría */}
                    <div>
                      <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">Categoría</label>
                      <select
                        value={perfume.category}
                        onChange={(e) => {
                          const updated = {...perfume, category: e.target.value};
                          setPerfumes(perfumes.map(p => p.id === perfume.id ? updated : p));
                        }}
                        className="w-full bg-white border border-glassBorder rounded-xl p-3 text-text cursor-pointer"
                      >
                        <option value="dupe_arabe">Dupe Árabe (Kanra, etc.)</option>
                        <option value="arabe_medio">Árabe Medio</option>
                        <option value="arabe_premium">Árabe Premium (Oud)</option>
                        <option value="diseñador_mainstream">Diseñador Mainstream</option>
                        <option value="diseñador_premium">Diseñador Premium</option>
                        <option value="nicho_accesible">Nicho Accesible</option>
                        <option value="ultra_nicho">Ultra-Nicho</option>
                      </select>
                    </div>
                    {/* CALCULADORA VISUAL */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-bg border border-accent/20">
                      <div className="flex items-center gap-3 mb-4">
                        <Calculator className="h-5 w-5 text-accent" />
                        <h4 className="text-text font-bold uppercase tracking-widest text-sm">Calculadora Automática</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted text-xs mb-1">Costo Total Real:</p>
                          <p className="text-text font-bold text-lg">${totalCost.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted text-xs mb-1">Factura Courier (Cupo):</p>
                          <p className="text-accent font-bold text-lg">${invoiceAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted text-xs mb-1">Punto de Equilibrio:</p>
                          <p className="text-text font-bold">${totalCost.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted text-xs mb-1">Margen Óptimo:</p>
                          <p className="text-text font-bold">{optimalMargin}%</p>
                        </div>
                      </div>

                      <div className="h-1 w-full bg-bg rounded-full my-4" />

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Precio Óptimo 40/40</p>
                          <p className="text-text font-black text-4xl tabular-nums">${optimalPrice.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Ganancia</p>
                          <p className="text-green-600 font-bold text-2xl">${(optimalPrice - totalCost).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => applyOptimalPrice(perfume)}
                        className="flex-1 bg-accent text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-text transition-all uppercase tracking-widest text-sm"
                      >
                        <TrendingUp className="h-4 w-4" /> Aplicar Precio Óptimo
                      </button>
                      <button
                        onClick={() => updatePerfume(perfume)}
                        className="px-8 bg-text text-white font-bold py-3 rounded-xl flex items-center gap-2 hover:bg-accent transition-all"
                      >
                        <Save className="h-4 w-4" /> Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-6 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // MODO VISTA: Resumen
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted text-xs uppercase tracking-widest mb-1">Costo Total</p>
                        <p className="text-text font-bold">${totalCost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted text-xs uppercase tracking-widest mb-1">Factura (Cupo)</p>
                        <p className="text-accent font-bold">${invoiceAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted text-xs uppercase tracking-widest mb-1">Margen Actual</p>
                        <p className="text-text font-bold">{currentMargin}%</p>
                      </div>
                      <div>
                        <p className="text-muted text-xs uppercase tracking-widest mb-1">Categoría</p>
                        <p className="text-text font-medium text-xs capitalize">{perfume.category.replace('_', ' ')}</p>
                      </div>
                    </div>

                    {/* Comparación: Precio Actual vs Óptimo */}
                    {Math.abs(currentPrice - optimalPrice) > 1 && (
                      <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                        <p className="text-yellow-700 text-sm font-bold mb-2">
                          💡 Precio sugerido: ${optimalPrice.toFixed(2)} (margen {optimalMargin}%)
                        </p>
                        <p className="text-yellow-600 text-xs">
                          Diferencia: ${Math.abs(currentPrice - optimalPrice).toFixed(2)} 
                          {currentPrice > optimalPrice ? ' (muy caro)' : ' (muy barato)'}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setEditingId(perfume.id)}
                      className="px-6 py-3 bg-accent/10 border border-accent/30 text-text rounded-xl text-sm flex items-center gap-2 hover:bg-accent hover:text-white transition-all font-bold uppercase tracking-widest"
                    >
                      <DollarSign className="h-4 w-4" /> Editar Costos y Precio
                    </button>
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
