"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { DollarSign, Save, Calculator, TrendingUp, X } from "lucide-react";
import { calculateOptimalPriceCents } from "@/lib/pricing";

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

/**
 * CONFIGURACIÓN DEL NEGOCIO
 * - INCLUDE_LOCAL_SHIPPING_IN_PRICE: tú confirmaste que Servientrega va incluido en el precio final.
 * - CUPO_INCLUDES_ECUADOR_SHIPPING: true solo si tu “cupo/factura” incluye también el envío a Ecuador.
 */
const INCLUDE_LOCAL_SHIPPING_IN_PRICE = true;
const CUPO_INCLUDES_ECUADOR_SHIPPING = false;

// Settings globales de la página (se guardan en localStorage)
const PRICING_SETTINGS_LS_KEY = "ikhor_admin_pricing_settings_v1";

type PricingSettings = {
  markupPercent: number; // markup sobre breakEven
  minProfitUSD: number; // piso de ganancia sobre breakEven
};

const DEFAULT_SETTINGS: PricingSettings = {
  markupPercent: 25,
  minProfitUSD: 4,
};

type OptimalCfg = {
  baseMarginPct: number; // ej 20 => 0.20
  extraMarginPct: number; // ej 5 => 0.05 (se suma al base)
  lowStock5Pct: number; // ej 10 => 0.10
  lowStock10Pct: number; // ej 5 => 0.05
  rounding: "floor99" | "ceil99";
};

function dollarsToCents(value: string): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

function centsToDollars(cents: number): number {
  return (cents || 0) / 100;
}

function safePct(n: number): string {
  if (!Number.isFinite(n)) return "0.0";
  return n.toFixed(1);
}

function clamp(n: number, min: number, max: number) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.min(Math.max(x, min), max);
}

// Redondea hacia ARRIBA al siguiente .99 (garantiza >= x)
function roundUpTo99(x: number) {
  const n = Number(x);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.ceil(n - 0.99) + 0.99;
}

function calcSuggestedByMarkupCents(breakEvenUSD: number, settings: PricingSettings) {
  const be = Number(breakEvenUSD) || 0;
  if (be <= 0) return 0;

  const markupPercent = clamp(settings.markupPercent, 0, 200);
  const minProfitUSD = clamp(settings.minProfitUSD, 0, 999);

  const raw = be * (1 + markupPercent / 100);
  const guarded = Math.max(raw, be + minProfitUSD);
  const finalUSD = roundUpTo99(guarded);

  return Math.round(finalUSD * 100);
}

export default function PricingPage() {
  const router = useRouter();

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [settings, setSettings] = useState<PricingSettings>(DEFAULT_SETTINGS);

  const [optimalCfg, setOptimalCfg] = useState<OptimalCfg>({
    baseMarginPct: 20,
    extraMarginPct: 0,
    lowStock5Pct: 10,
    lowStock10Pct: 5,
    rounding: "floor99",
  });

  // Load settings (localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRICING_SETTINGS_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({
          markupPercent: Number(parsed?.markupPercent ?? DEFAULT_SETTINGS.markupPercent),
          minProfitUSD: Number(parsed?.minProfitUSD ?? DEFAULT_SETTINGS.minProfitUSD),
        });
      }
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  // Save settings (localStorage)
  useEffect(() => {
    try {
      localStorage.setItem(PRICING_SETTINGS_LS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    loadPerfumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPerfumes() {
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || user.email !== "anthonybarreiro369@gmail.com") {
        router.push("/");
        return;
      }

      const { data, error } = await supabase.from("perfumes").select("*").eq("active", true);

      if (error) {
        alert("Error cargando perfumes: " + error.message);
        return;
      }

      setPerfumes((data as Perfume[]) || []);
    } finally {
      setLoading(false);
    }
  }

  async function applyOptimalPrice(perfume: Perfume) {
    const optimalPriceCents = calculateOptimalPriceCents(perfume, {
      baseMargin: optimalCfg.baseMarginPct / 100 + optimalCfg.extraMarginPct / 100,
      lowStockBonus5: optimalCfg.lowStock5Pct / 100,
      lowStockBonus10: optimalCfg.lowStock10Pct / 100,
      psychologicalMode: optimalCfg.rounding,
    });

    const optimalPrice = optimalPriceCents / 100;

    const confirmed = window.confirm(
      `¿Aplicar precio óptimo $${optimalPrice.toFixed(2)} a ${perfume.name}?`
    );
    if (!confirmed) return;

    const supabase = createClient();
    setSavingId(perfume.id);

    try {
      const { error } = await supabase
        .from("perfumes")
        .update({ price_cents: optimalPriceCents })
        .eq("id", perfume.id);

      if (error) {
        alert("Error: " + error.message);
      } else {
        alert("Precio actualizado");
        await loadPerfumes();
      }
    } finally {
      setSavingId(null);
    }
  }

  async function applyMarkupPrice(perfume: Perfume, suggestedMarkupPriceCents: number) {
    const suggested = suggestedMarkupPriceCents / 100;

    const confirmed = window.confirm(
      `¿Aplicar precio por margen $${suggested.toFixed(2)} a ${perfume.name}?`
    );
    if (!confirmed) return;

    const supabase = createClient();
    setSavingId(perfume.id);

    try {
      const { error } = await supabase
        .from("perfumes")
        .update({ price_cents: suggestedMarkupPriceCents })
        .eq("id", perfume.id);

      if (error) {
        alert("Error: " + error.message);
      } else {
        alert("Precio actualizado");
        await loadPerfumes();
      }
    } finally {
      setSavingId(null);
    }
  }

  // También guarda price_cents (para que puedas poner el precio que quieras)
  async function updatePerfume(perfume: Perfume) {
    const supabase = createClient();
    setSavingId(perfume.id);

    try {
      const { error } = await supabase
        .from("perfumes")
        .update({
          price_cents: perfume.price_cents,
          cost_cents: perfume.cost_cents,
          shipping_to_courier_cents: perfume.shipping_to_courier_cents,
          shipping_to_ecuador_cents: perfume.shipping_to_ecuador_cents,
          local_shipping_cents: perfume.local_shipping_cents,
          category: perfume.category,
        })
        .eq("id", perfume.id);

      if (error) {
        alert("Error: " + error.message);
      } else {
        alert("Guardado");
        setEditingId(null);
        await loadPerfumes();
      }
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-muted">Cargando...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg py-32 px-8">
      <div className="max-w-7xl mx-auto">
        {/* ════════════════════════════════════════════ */}
        {/* HEADER */}
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

          {/* Control global (por margen) */}
          <div className="mt-8 bg-white border border-glassBorder p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-5 w-5 text-accent" />
              <p className="text-text font-bold uppercase tracking-widest text-sm">
                Control global (por margen)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                  Markup % (sobre break-even)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="200"
                  value={settings.markupPercent}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      markupPercent: clamp(Number(e.target.value), 0, 200),
                    }))
                  }
                  className="w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                />
              </div>

              <div>
                <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                  Piso ganancia (USD)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="999"
                  value={settings.minProfitUSD}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      minProfitUSD: clamp(Number(e.target.value), 0, 999),
                    }))
                  }
                  className="w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setSettings(DEFAULT_SETTINGS)}
                  className="w-full px-6 py-3 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all text-sm uppercase tracking-widest font-bold"
                >
                  Reset margen
                </button>
              </div>
            </div>

            <p className="text-muted text-xs mt-3">
              Esto calcula “Precio sugerido por margen” con redondeo a .99 y te deja aplicarlo
              por perfume.
            </p>
          </div>

          {/* Óptimo (motor) editable */}
          <div className="mt-6 bg-white border border-glassBorder p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-5 w-5 text-accent" />
              <p className="text-text font-bold uppercase tracking-widest text-sm">
                Óptimo (motor) editable
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                  Base margin %
                </label>
                <input
                  type="number"
                  step="1"
                  value={optimalCfg.baseMarginPct}
                  onChange={(e) =>
                    setOptimalCfg((p) => ({ ...p, baseMarginPct: Number(e.target.value) }))
                  }
                  className="w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                />
              </div>

              <div>
                <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                  Extra %
                </label>
                <input
                  type="number"
                  step="1"
                  value={optimalCfg.extraMarginPct}
                  onChange={(e) =>
                    setOptimalCfg((p) => ({ ...p, extraMarginPct: Number(e.target.value) }))
                  }
                  className="w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                />
              </div>

              <div>
                <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                  Stock &lt; 5 %
                </label>
                <input
                  type="number"
                  step="1"
                  value={optimalCfg.lowStock5Pct}
                  onChange={(e) =>
                    setOptimalCfg((p) => ({ ...p, lowStock5Pct: Number(e.target.value) }))
                  }
                  className="w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                />
              </div>

              <div>
                <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                  Stock &lt; 10 %
                </label>
                <input
                  type="number"
                  step="1"
                  value={optimalCfg.lowStock10Pct}
                  onChange={(e) =>
                    setOptimalCfg((p) => ({ ...p, lowStock10Pct: Number(e.target.value) }))
                  }
                  className="w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                />
              </div>

              <div>
                <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                  Redondeo
                </label>
                <select
                  value={optimalCfg.rounding}
                  onChange={(e) =>
                    setOptimalCfg((p) => ({ ...p, rounding: e.target.value as OptimalCfg["rounding"] }))
                  }
                  className="w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                >
                  <option value="floor99">floor + .99</option>
                  <option value="ceil99">ceil a .99</option>
                </select>
              </div>
            </div>

            <p className="text-muted text-xs mt-3">
              “Extra %” te permite subir/bajar el óptimo sin tocar categorías. Los % se aplican
              como margen (ej 20% = 0.20).
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* LISTA */}
        {/* ════════════════════════════════════════════ */}
        <div className="space-y-6">
          {perfumes.map((perfume) => {
            const isEditing = editingId === perfume.id;
            const isSaving = savingId === perfume.id;

            // --- Costos (USD) ---
            const supplierCost = centsToDollars(perfume.cost_cents);
            const shipCourier = centsToDollars(perfume.shipping_to_courier_cents);
            const shipEcuador = centsToDollars(perfume.shipping_to_ecuador_cents);
            const shipLocal = centsToDollars(perfume.local_shipping_cents);

            const importCost = supplierCost + shipCourier + shipEcuador;
            const totalCostReal = importCost + shipLocal;

            // Punto de equilibrio (tu regla: incluye Servientrega en el precio final)
            const breakEven = INCLUDE_LOCAL_SHIPPING_IN_PRICE ? totalCostReal : importCost;

            // “Factura/Cupo” (configurable)
            const invoiceAmount = CUPO_INCLUDES_ECUADOR_SHIPPING ? importCost : supplierCost + shipCourier;

            // --- Precios (USD) ---
            const currentPrice = centsToDollars(perfume.price_cents);

            // Óptimo (motor) con config editable
            const optimalPriceCents = calculateOptimalPriceCents(perfume, {
              baseMargin: optimalCfg.baseMarginPct / 100 + optimalCfg.extraMarginPct / 100,
              lowStockBonus5: optimalCfg.lowStock5Pct / 100,
              lowStockBonus10: optimalCfg.lowStock10Pct / 100,
              psychologicalMode: optimalCfg.rounding,
            });
            const optimalPrice = optimalPriceCents / 100;

            // Sugerido por margen editable (global)
            const suggestedMarkupCents = calcSuggestedByMarkupCents(breakEven, settings);
            const suggestedMarkupPrice = suggestedMarkupCents / 100;

            // --- Ganancias (comparación contra breakEven) ---
            const currentProfit = currentPrice - breakEven;
            const optimalProfit = optimalPrice - breakEven;
            const markupProfit = suggestedMarkupPrice - breakEven;

            const currentGrossMarginPct = currentPrice > 0 ? (currentProfit / currentPrice) * 100 : 0;
            const optimalGrossMarginPct = optimalPrice > 0 ? (optimalProfit / optimalPrice) * 100 : 0;
            const markupGrossMarginPct =
              suggestedMarkupPrice > 0 ? (markupProfit / suggestedMarkupPrice) * 100 : 0;

            const currentMarkupPct = breakEven > 0 ? (currentProfit / breakEven) * 100 : 0;
            const optimalMarkupPct = breakEven > 0 ? (optimalProfit / breakEven) * 100 : 0;
            const markupMarkupPct = breakEven > 0 ? (markupProfit / breakEven) * 100 : 0;

            const categoryLabel = perfume.category ? perfume.category.replace(/_/g, " ") : "Sin categoría";

            return (
              <div key={perfume.id} className="bg-white border border-glassBorder p-8 rounded-3xl">
                {/* Header del Perfume */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-text font-serif text-2xl mb-2">{perfume.name}</h3>
                    <p className="text-muted text-sm">
                      {perfume.ml}ml • Stock: {perfume.stock} • {categoryLabel}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-muted text-xs uppercase tracking-widest mb-1">Precio Actual</p>
                    <p className="text-text font-bold text-3xl">${currentPrice.toFixed(2)}</p>
                    <p className="text-muted text-xs">
                      Margen: {safePct(currentGrossMarginPct)}% • Markup: {safePct(currentMarkupPct)}%
                    </p>
                  </div>
                </div>

                {isEditing ? (
                  // MODO EDICIÓN
                  <div className="space-y-6 p-6 rounded-xl bg-bg border border-glassBorder">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Precio final manual */}
                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                          Precio final (manual)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={currentPrice.toFixed(2)}
                            onChange={(e) => {
                              const updated = {
                                ...perfume,
                                price_cents: dollarsToCents(e.target.value),
                              };
                              setPerfumes((prev) => prev.map((p) => (p.id === perfume.id ? updated : p)));
                            }}
                            className="w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                          />
                        </div>
                        <p className="text-muted text-xs mt-2">
                          Aquí pones el precio que tú quieras (se guarda en la BD con “Guardar”).
                        </p>
                      </div>

                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                          Costo Proveedor
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={supplierCost.toFixed(2)}
                            onChange={(e) => {
                              const updated = {
                                ...perfume,
                                cost_cents: dollarsToCents(e.target.value),
                              };
                              setPerfumes((prev) => prev.map((p) => (p.id === perfume.id ? updated : p)));
                            }}
                            className="w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                          Envío a Courier
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={shipCourier.toFixed(2)}
                            onChange={(e) => {
                              const updated = {
                                ...perfume,
                                shipping_to_courier_cents: dollarsToCents(e.target.value),
                              };
                              setPerfumes((prev) => prev.map((p) => (p.id === perfume.id ? updated : p)));
                            }}
                            className="w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                          Envío a Ecuador
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={shipEcuador.toFixed(2)}
                            onChange={(e) => {
                              const updated = {
                                ...perfume,
                                shipping_to_ecuador_cents: dollarsToCents(e.target.value),
                              };
                              setPerfumes((prev) => prev.map((p) => (p.id === perfume.id ? updated : p)));
                            }}
                            className="w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                          Servientrega Local
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={shipLocal.toFixed(2)}
                            onChange={(e) => {
                              const updated = {
                                ...perfume,
                                local_shipping_cents: dollarsToCents(e.target.value),
                              };
                              setPerfumes((prev) => prev.map((p) => (p.id === perfume.id ? updated : p)));
                            }}
                            className="w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="text-muted text-[10px] uppercase tracking-widest mb-2 block">
                        Categoría
                      </label>
                      <select
                        value={perfume.category || ""}
                        onChange={(e) => {
                          const updated = { ...perfume, category: e.target.value };
                          setPerfumes((prev) => prev.map((p) => (p.id === perfume.id ? updated : p)));
                        }}
                        className="w-full bg-white border border-glassBorder rounded-xl p-3 text-text cursor-pointer"
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="dupearabe">Dupe Árabe (Kanra, etc.)</option>
                        <option value="arabemedio">Árabe Medio</option>
                        <option value="arabepremium">Árabe Premium (Oud)</option>
                        <option value="diseadormainstream">Diseñador Mainstream</option>
                        <option value="diseadorpremium">Diseñador Premium</option>
                        <option value="nichoaccesible">Nicho Accesible</option>
                        <option value="ultranicho">Ultra-Nicho</option>
                      </select>
                    </div>

                    {/* CALCULADORA VISUAL */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-bg border border-accent/20">
                      <div className="flex items-center gap-3 mb-4">
                        <Calculator className="h-5 w-5 text-accent" />
                        <h4 className="text-text font-bold uppercase tracking-widest text-sm">
                          Calculadora
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted text-xs mb-1">Costo Total Real:</p>
                          <p className="text-text font-bold text-lg">${totalCostReal.toFixed(2)}</p>
                        </div>

                        <div>
                          <p className="text-muted text-xs mb-1">Factura Courier (Cupo):</p>
                          <p className="text-accent font-bold text-lg">${invoiceAmount.toFixed(2)}</p>
                        </div>

                        <div>
                          <p className="text-muted text-xs mb-1">Punto de Equilibrio:</p>
                          <p className="text-text font-bold">${breakEven.toFixed(2)}</p>
                        </div>

                        <div>
                          <p className="text-muted text-xs mb-1">Óptimo (motor):</p>
                          <p className="text-text font-bold">
                            {safePct(optimalGrossMarginPct)}% (markup {safePct(optimalMarkupPct)}%)
                          </p>
                        </div>
                      </div>

                      <div className="h-1 w-full bg-bg rounded-full my-4" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-muted text-[10px] uppercase tracking-widest mb-1">
                            Precio sugerido (Óptimo)
                          </p>
                          <p className="text-text font-black text-4xl tabular-nums">
                            ${optimalPrice.toFixed(2)}
                          </p>
                          <p className="text-muted text-xs mt-2">
                            Ganancia: ${optimalProfit.toFixed(2)}
                          </p>
                        </div>

                        <div className="md:text-right">
                          <p className="text-muted text-[10px] uppercase tracking-widest mb-1">
                            Precio sugerido (Por margen)
                          </p>
                          <p className="text-text font-black text-4xl tabular-nums">
                            ${suggestedMarkupPrice.toFixed(2)}
                          </p>
                          <p className="text-muted text-xs mt-2">
                            Margen: {safePct(markupGrossMarginPct)}% • Markup:{" "}
                            {safePct(markupMarkupPct)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => applyOptimalPrice(perfume)}
                        disabled={isSaving}
                        className="flex-1 min-w-[240px] bg-accent text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-text transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TrendingUp className="h-4 w-4" /> Aplicar Precio Óptimo
                      </button>

                      <button
                        onClick={() => applyMarkupPrice(perfume, suggestedMarkupCents)}
                        disabled={isSaving}
                        className="flex-1 min-w-[240px] bg-text text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-accent transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Calculator className="h-4 w-4" /> Aplicar por Margen
                      </button>

                      <button
                        onClick={() => updatePerfume(perfume)}
                        disabled={isSaving}
                        className="px-8 bg-text/90 text-white font-bold py-3 rounded-xl flex items-center gap-2 hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="h-4 w-4" /> Guardar
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        disabled={isSaving}
                        className="px-6 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // MODO VISTA
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted text-xs uppercase tracking-widest mb-1">
                          Costo Total Real
                        </p>
                        <p className="text-text font-bold">${totalCostReal.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-muted text-xs uppercase tracking-widest mb-1">
                          Factura (Cupo)
                        </p>
                        <p className="text-accent font-bold">${invoiceAmount.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-muted text-xs uppercase tracking-widest mb-1">
                          Óptimo (motor)
                        </p>
                        <p className="text-text font-bold">${optimalPrice.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-muted text-xs uppercase tracking-widest mb-1">
                          Por margen
                        </p>
                        <p className="text-text font-bold">${suggestedMarkupPrice.toFixed(2)}</p>
                      </div>
                    </div>

                    {(Math.abs(currentPrice - optimalPrice) > 1 ||
                      Math.abs(currentPrice - suggestedMarkupPrice) > 1) && (
                      <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                        <p className="text-yellow-700 text-sm font-bold mb-2">
                          Sugeridos: Óptimo ${optimalPrice.toFixed(2)} • Margen $
                          {suggestedMarkupPrice.toFixed(2)}
                        </p>
                        <p className="text-yellow-600 text-xs">
                          Actual: ${currentPrice.toFixed(2)} • Diferencia vs margen: $
                          {Math.abs(currentPrice - suggestedMarkupPrice).toFixed(2)}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setEditingId(perfume.id)}
                      className="px-6 py-3 bg-accent/10 border border-accent/30 text-text rounded-xl text-sm flex items-center gap-2 hover:bg-accent hover:text-white transition-all font-bold uppercase tracking-widest"
                    >
                      <DollarSign className="h-4 w-4" /> Editar costos y precio
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
