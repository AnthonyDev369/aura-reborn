// lib/pricing.ts

export const CATEGORY_BONUSES: Record<string, number> = {
  dupe_arabe: 0.10,
  arabe_medio: 0.25,
  arabe_premium: 0.35,
  "diseñador_mainstream": 0.20,
  "diseñador_premium": 0.35,
  nicho_accesible: 0.25,
  ultra_nicho: 0.40,
};

export type OptimalPricingOptions = {
  baseMargin?: number; // default 0.20
  categoryBonusOverride?: number | null; // si lo pones, ignora CATEGORY_BONUSES
  lowStockBonus5?: number; // default 0.10 (stock < 5)
  lowStockBonus10?: number; // default 0.05 (stock < 10)
  psychologicalMode?: "floor99" | "ceil99"; // default floor99 (tu actual)
};

function roundTo99(usd: number, mode: "floor99" | "ceil99") {
  if (!Number.isFinite(usd) || usd <= 0) return 0;

  if (mode === "ceil99") {
    // asegura que el precio NO baje del calculado
    return Math.ceil(usd - 0.99) + 0.99;
  }

  // tu comportamiento actual: floor(x) + 0.99
  return Math.floor(usd) + 0.99;
}

export function calculateOptimalPriceCents(
  perfume: {
    cost_cents: number;
    shipping_to_courier_cents: number;
    shipping_to_ecuador_cents: number;
    local_shipping_cents: number;
    stock: number;
    category: string;
  },
  opts: OptimalPricingOptions = {}
) {
  const totalCostUsd =
    (perfume.cost_cents +
      perfume.shipping_to_courier_cents +
      perfume.shipping_to_ecuador_cents +
      perfume.local_shipping_cents) /
    100;

  const baseMargin = Number.isFinite(opts.baseMargin) ? (opts.baseMargin as number) : 0.20;

  const categoryBonus =
    opts.categoryBonusOverride === null || opts.categoryBonusOverride === undefined
      ? (CATEGORY_BONUSES[perfume.category] ?? 0.25)
      : opts.categoryBonusOverride;

  const lowStockBonus5 = Number.isFinite(opts.lowStockBonus5) ? (opts.lowStockBonus5 as number) : 0.10;
  const lowStockBonus10 = Number.isFinite(opts.lowStockBonus10) ? (opts.lowStockBonus10 as number) : 0.05;

  let margin = baseMargin + categoryBonus;

  if (perfume.stock < 5) margin += lowStockBonus5;
  else if (perfume.stock < 10) margin += lowStockBonus10;

  const optimalUsd = totalCostUsd * (1 + margin);

  const psychologicalMode = opts.psychologicalMode ?? "floor99";
  const psychologicalUsd = roundTo99(optimalUsd, psychologicalMode);

  return Math.round(psychologicalUsd * 100);
}
