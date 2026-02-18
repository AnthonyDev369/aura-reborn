(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabaseClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://zjqvlmtymbvrxsfigidf.supabase.co") || "";
const supabaseKey = ("TURBOPACK compile-time value", "sb_publishable_jmRhz2dVMfA_XbmUDSQ8Xg_1VwYEPAV") || "";
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl, supabaseKey);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/pricing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/pricing.ts
__turbopack_context__.s([
    "CATEGORY_BONUSES",
    ()=>CATEGORY_BONUSES,
    "calculateOptimalPriceCents",
    ()=>calculateOptimalPriceCents
]);
const CATEGORY_BONUSES = {
    dupe_arabe: 0.10,
    arabe_medio: 0.25,
    arabe_premium: 0.35,
    "diseñador_mainstream": 0.20,
    "diseñador_premium": 0.35,
    nicho_accesible: 0.25,
    ultra_nicho: 0.40
};
function roundTo99(usd, mode) {
    if (!Number.isFinite(usd) || usd <= 0) return 0;
    if (mode === "ceil99") {
        // asegura que el precio NO baje del calculado
        return Math.ceil(usd - 0.99) + 0.99;
    }
    // tu comportamiento actual: floor(x) + 0.99
    return Math.floor(usd) + 0.99;
}
function calculateOptimalPriceCents(perfume, opts = {}) {
    const totalCostUsd = (perfume.cost_cents + perfume.shipping_to_courier_cents + perfume.shipping_to_ecuador_cents + perfume.local_shipping_cents) / 100;
    const baseMargin = Number.isFinite(opts.baseMargin) ? opts.baseMargin : 0.20;
    const categoryBonus = opts.categoryBonusOverride === null || opts.categoryBonusOverride === undefined ? CATEGORY_BONUSES[perfume.category] ?? 0.25 : opts.categoryBonusOverride;
    const lowStockBonus5 = Number.isFinite(opts.lowStockBonus5) ? opts.lowStockBonus5 : 0.10;
    const lowStockBonus10 = Number.isFinite(opts.lowStockBonus10) ? opts.lowStockBonus10 : 0.05;
    let margin = baseMargin + categoryBonus;
    if (perfume.stock < 5) margin += lowStockBonus5;
    else if (perfume.stock < 10) margin += lowStockBonus10;
    const optimalUsd = totalCostUsd * (1 + margin);
    const psychologicalMode = opts.psychologicalMode ?? "floor99";
    const psychologicalUsd = roundTo99(optimalUsd, psychologicalMode);
    return Math.round(psychologicalUsd * 100);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/pricing/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PricingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pricing.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
/**
 * CONFIGURACIÓN DEL NEGOCIO
 * - INCLUDE_LOCAL_SHIPPING_IN_PRICE: tú confirmaste que Servientrega va incluido en el precio final.
 * - CUPO_INCLUDES_ECUADOR_SHIPPING: true solo si tu “cupo/factura” incluye también el envío a Ecuador.
 */ const INCLUDE_LOCAL_SHIPPING_IN_PRICE = true;
const CUPO_INCLUDES_ECUADOR_SHIPPING = false;
// Settings globales de la página (se guardan en localStorage)
const PRICING_SETTINGS_LS_KEY = "ikhor_admin_pricing_settings_v1";
const DEFAULT_SETTINGS = {
    markupPercent: 25,
    minProfitUSD: 4
};
function dollarsToCents(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100);
}
function centsToDollars(cents) {
    return (cents || 0) / 100;
}
function safePct(n) {
    if (!Number.isFinite(n)) return "0.0";
    return n.toFixed(1);
}
function clamp(n, min, max) {
    const x = Number(n);
    if (!Number.isFinite(x)) return min;
    return Math.min(Math.max(x, min), max);
}
// Redondea hacia ARRIBA al siguiente .99 (garantiza >= x)
function roundUpTo99(x) {
    const n = Number(x);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.ceil(n - 0.99) + 0.99;
}
function calcSuggestedByMarkupCents(breakEvenUSD, settings) {
    const be = Number(breakEvenUSD) || 0;
    if (be <= 0) return 0;
    const markupPercent = clamp(settings.markupPercent, 0, 200);
    const minProfitUSD = clamp(settings.minProfitUSD, 0, 999);
    const raw = be * (1 + markupPercent / 100);
    const guarded = Math.max(raw, be + minProfitUSD);
    const finalUSD = roundUpTo99(guarded);
    return Math.round(finalUSD * 100);
}
function PricingPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [perfumes, setPerfumes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [savingId, setSavingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SETTINGS);
    const [optimalCfg, setOptimalCfg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        baseMarginPct: 20,
        extraMarginPct: 0,
        lowStock5Pct: 10,
        lowStock10Pct: 5,
        rounding: "floor99"
    });
    // Load settings (localStorage)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PricingPage.useEffect": ()=>{
            try {
                const raw = localStorage.getItem(PRICING_SETTINGS_LS_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    setSettings({
                        markupPercent: Number(parsed?.markupPercent ?? DEFAULT_SETTINGS.markupPercent),
                        minProfitUSD: Number(parsed?.minProfitUSD ?? DEFAULT_SETTINGS.minProfitUSD)
                    });
                }
            } catch  {
                setSettings(DEFAULT_SETTINGS);
            }
        }
    }["PricingPage.useEffect"], []);
    // Save settings (localStorage)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PricingPage.useEffect": ()=>{
            try {
                localStorage.setItem(PRICING_SETTINGS_LS_KEY, JSON.stringify(settings));
            } catch  {}
        }
    }["PricingPage.useEffect"], [
        settings
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PricingPage.useEffect": ()=>{
            loadPerfumes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["PricingPage.useEffect"], []);
    async function loadPerfumes() {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || user.email !== "anthonybarreiro369@gmail.com") {
                router.push("/");
                return;
            }
            const { data, error } = await supabase.from("perfumes").select("*").eq("active", true);
            if (error) {
                alert("Error cargando perfumes: " + error.message);
                return;
            }
            setPerfumes(data || []);
        } finally{
            setLoading(false);
        }
    }
    async function applyOptimalPrice(perfume) {
        const optimalPriceCents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateOptimalPriceCents"])(perfume, {
            baseMargin: optimalCfg.baseMarginPct / 100 + optimalCfg.extraMarginPct / 100,
            lowStockBonus5: optimalCfg.lowStock5Pct / 100,
            lowStockBonus10: optimalCfg.lowStock10Pct / 100,
            psychologicalMode: optimalCfg.rounding
        });
        const optimalPrice = optimalPriceCents / 100;
        const confirmed = window.confirm(`¿Aplicar precio óptimo $${optimalPrice.toFixed(2)} a ${perfume.name}?`);
        if (!confirmed) return;
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
        setSavingId(perfume.id);
        try {
            const { error } = await supabase.from("perfumes").update({
                price_cents: optimalPriceCents
            }).eq("id", perfume.id);
            if (error) {
                alert("Error: " + error.message);
            } else {
                alert("Precio actualizado");
                await loadPerfumes();
            }
        } finally{
            setSavingId(null);
        }
    }
    async function applyMarkupPrice(perfume, suggestedMarkupPriceCents) {
        const suggested = suggestedMarkupPriceCents / 100;
        const confirmed = window.confirm(`¿Aplicar precio por margen $${suggested.toFixed(2)} a ${perfume.name}?`);
        if (!confirmed) return;
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
        setSavingId(perfume.id);
        try {
            const { error } = await supabase.from("perfumes").update({
                price_cents: suggestedMarkupPriceCents
            }).eq("id", perfume.id);
            if (error) {
                alert("Error: " + error.message);
            } else {
                alert("Precio actualizado");
                await loadPerfumes();
            }
        } finally{
            setSavingId(null);
        }
    }
    // También guarda price_cents (para que puedas poner el precio que quieras)
    async function updatePerfume(perfume) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
        setSavingId(perfume.id);
        try {
            const { error } = await supabase.from("perfumes").update({
                price_cents: perfume.price_cents,
                cost_cents: perfume.cost_cents,
                shipping_to_courier_cents: perfume.shipping_to_courier_cents,
                shipping_to_ecuador_cents: perfume.shipping_to_ecuador_cents,
                local_shipping_cents: perfume.local_shipping_cents,
                category: perfume.category
            }).eq("id", perfume.id);
            if (error) {
                alert("Error: " + error.message);
            } else {
                alert("Guardado");
                setEditingId(null);
                await loadPerfumes();
            }
        } finally{
            setSavingId(null);
        }
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-bg flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-muted",
                children: "Cargando..."
            }, void 0, false, {
                fileName: "[project]/app/admin/pricing/page.tsx",
                lineNumber: 262,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/pricing/page.tsx",
            lineNumber: 261,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-bg py-32 px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-16 pb-8 border-b border-glassBorder",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1 w-12 bg-accent/30 rounded-full mb-4"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/pricing/page.tsx",
                            lineNumber: 274,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-5xl font-serif text-text mb-4 tracking-tight",
                                            children: "Calculadora de Precios"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 278,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted text-sm uppercase tracking-widest",
                                            children: "Sistema de Pricing Inteligente ÍKHOR"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 281,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 277,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push("/admin"),
                                    className: "px-6 py-3 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all text-sm uppercase tracking-widest font-bold",
                                    children: "← Volver"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 286,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/pricing/page.tsx",
                            lineNumber: 276,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8 bg-white border border-glassBorder p-6 rounded-2xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                            className: "h-5 w-5 text-accent"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 297,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-text font-bold uppercase tracking-widest text-sm",
                                            children: "Control global (por margen)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 298,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 296,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                    children: "Markup % (sobre break-even)"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "1",
                                                    min: "0",
                                                    max: "200",
                                                    value: settings.markupPercent,
                                                    onChange: (e)=>setSettings((prev)=>({
                                                                ...prev,
                                                                markupPercent: clamp(Number(e.target.value), 0, 200)
                                                            })),
                                                    className: "w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 308,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 304,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                    children: "Piso ganancia (USD)"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 325,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "1",
                                                    min: "0",
                                                    max: "999",
                                                    value: settings.minProfitUSD,
                                                    onChange: (e)=>setSettings((prev)=>({
                                                                ...prev,
                                                                minProfitUSD: clamp(Number(e.target.value), 0, 999)
                                                            })),
                                                    className: "w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 324,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-end",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSettings(DEFAULT_SETTINGS),
                                                className: "w-full px-6 py-3 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all text-sm uppercase tracking-widest font-bold",
                                                children: "Reset margen"
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/pricing/page.tsx",
                                                lineNumber: 345,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 344,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 303,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted text-xs mt-3",
                                    children: "Esto calcula “Precio sugerido por margen” con redondeo a .99 y te deja aplicarlo por perfume."
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 354,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/pricing/page.tsx",
                            lineNumber: 295,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 bg-white border border-glassBorder p-6 rounded-2xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                            className: "h-5 w-5 text-accent"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 363,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-text font-bold uppercase tracking-widest text-sm",
                                            children: "Óptimo (motor) editable"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 364,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 362,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-5 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                    children: "Base margin %"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 371,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "1",
                                                    value: optimalCfg.baseMarginPct,
                                                    onChange: (e)=>setOptimalCfg((p)=>({
                                                                ...p,
                                                                baseMarginPct: Number(e.target.value)
                                                            })),
                                                    className: "w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 374,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 370,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                    children: "Extra %"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 386,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "1",
                                                    value: optimalCfg.extraMarginPct,
                                                    onChange: (e)=>setOptimalCfg((p)=>({
                                                                ...p,
                                                                extraMarginPct: Number(e.target.value)
                                                            })),
                                                    className: "w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 389,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 385,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                    children: "Stock < 5 %"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 401,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "1",
                                                    value: optimalCfg.lowStock5Pct,
                                                    onChange: (e)=>setOptimalCfg((p)=>({
                                                                ...p,
                                                                lowStock5Pct: Number(e.target.value)
                                                            })),
                                                    className: "w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 404,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 400,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                    children: "Stock < 10 %"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 416,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "1",
                                                    value: optimalCfg.lowStock10Pct,
                                                    onChange: (e)=>setOptimalCfg((p)=>({
                                                                ...p,
                                                                lowStock10Pct: Number(e.target.value)
                                                            })),
                                                    className: "w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 419,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 415,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                    children: "Redondeo"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: optimalCfg.rounding,
                                                    onChange: (e)=>setOptimalCfg((p)=>({
                                                                ...p,
                                                                rounding: e.target.value
                                                            })),
                                                    className: "w-full px-4 py-3 bg-bg border border-glassBorder rounded-xl text-text",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "floor99",
                                                            children: "floor + .99"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 441,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "ceil99",
                                                            children: "ceil a .99"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 442,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 430,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted text-xs mt-3",
                                    children: "“Extra %” te permite subir/bajar el óptimo sin tocar categorías. Los % se aplican como margen (ej 20% = 0.20)."
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 447,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/pricing/page.tsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/pricing/page.tsx",
                    lineNumber: 273,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: perfumes.map((perfume)=>{
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
                        const breakEven = ("TURBOPACK compile-time truthy", 1) ? totalCostReal : "TURBOPACK unreachable";
                        // “Factura/Cupo” (configurable)
                        const invoiceAmount = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : supplierCost + shipCourier;
                        // --- Precios (USD) ---
                        const currentPrice = centsToDollars(perfume.price_cents);
                        // Óptimo (motor) con config editable
                        const optimalPriceCents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateOptimalPriceCents"])(perfume, {
                            baseMargin: optimalCfg.baseMarginPct / 100 + optimalCfg.extraMarginPct / 100,
                            lowStockBonus5: optimalCfg.lowStock5Pct / 100,
                            lowStockBonus10: optimalCfg.lowStock10Pct / 100,
                            psychologicalMode: optimalCfg.rounding
                        });
                        const optimalPrice = optimalPriceCents / 100;
                        // Sugerido por margen editable (global)
                        const suggestedMarkupCents = calcSuggestedByMarkupCents(breakEven, settings);
                        const suggestedMarkupPrice = suggestedMarkupCents / 100;
                        // --- Ganancias (comparación contra breakEven) ---
                        const currentProfit = currentPrice - breakEven;
                        const optimalProfit = optimalPrice - breakEven;
                        const markupProfit = suggestedMarkupPrice - breakEven;
                        const currentGrossMarginPct = currentPrice > 0 ? currentProfit / currentPrice * 100 : 0;
                        const optimalGrossMarginPct = optimalPrice > 0 ? optimalProfit / optimalPrice * 100 : 0;
                        const markupGrossMarginPct = suggestedMarkupPrice > 0 ? markupProfit / suggestedMarkupPrice * 100 : 0;
                        const currentMarkupPct = breakEven > 0 ? currentProfit / breakEven * 100 : 0;
                        const optimalMarkupPct = breakEven > 0 ? optimalProfit / breakEven * 100 : 0;
                        const markupMarkupPct = breakEven > 0 ? markupProfit / breakEven * 100 : 0;
                        const categoryLabel = perfume.category ? perfume.category.replace(/_/g, " ") : "Sin categoría";
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white border border-glassBorder p-8 rounded-3xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-start mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-text font-serif text-2xl mb-2",
                                                    children: perfume.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 514,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-muted text-sm",
                                                    children: [
                                                        perfume.ml,
                                                        "ml • Stock: ",
                                                        perfume.stock,
                                                        " • ",
                                                        categoryLabel
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 515,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 513,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-right",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-muted text-xs uppercase tracking-widest mb-1",
                                                    children: "Precio Actual"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 521,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-text font-bold text-3xl",
                                                    children: [
                                                        "$",
                                                        currentPrice.toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 522,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-muted text-xs",
                                                    children: [
                                                        "Margen: ",
                                                        safePct(currentGrossMarginPct),
                                                        "% • Markup: ",
                                                        safePct(currentMarkupPct),
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 520,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 512,
                                    columnNumber: 17
                                }, this),
                                isEditing ? // MODO EDICIÓN
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6 p-6 rounded-xl bg-bg border border-glassBorder",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                            children: "Precio final (manual)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 535,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted",
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 539,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    step: "0.01",
                                                                    value: currentPrice.toFixed(2),
                                                                    onChange: (e)=>{
                                                                        const updated = {
                                                                            ...perfume,
                                                                            price_cents: dollarsToCents(e.target.value)
                                                                        };
                                                                        setPerfumes((prev)=>prev.map((p)=>p.id === perfume.id ? updated : p));
                                                                    },
                                                                    className: "w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 538,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted text-xs mt-2",
                                                            children: "Aquí pones el precio que tú quieras (se guarda en la BD con “Guardar”)."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 554,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 534,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                            children: "Costo Proveedor"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 560,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted",
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 564,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    step: "0.01",
                                                                    value: supplierCost.toFixed(2),
                                                                    onChange: (e)=>{
                                                                        const updated = {
                                                                            ...perfume,
                                                                            cost_cents: dollarsToCents(e.target.value)
                                                                        };
                                                                        setPerfumes((prev)=>prev.map((p)=>p.id === perfume.id ? updated : p));
                                                                    },
                                                                    className: "w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 565,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 563,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 559,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                            children: "Envío a Courier"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 582,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted",
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 586,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    step: "0.01",
                                                                    value: shipCourier.toFixed(2),
                                                                    onChange: (e)=>{
                                                                        const updated = {
                                                                            ...perfume,
                                                                            shipping_to_courier_cents: dollarsToCents(e.target.value)
                                                                        };
                                                                        setPerfumes((prev)=>prev.map((p)=>p.id === perfume.id ? updated : p));
                                                                    },
                                                                    className: "w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 587,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 585,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 581,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                            children: "Envío a Ecuador"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 604,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted",
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 608,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    step: "0.01",
                                                                    value: shipEcuador.toFixed(2),
                                                                    onChange: (e)=>{
                                                                        const updated = {
                                                                            ...perfume,
                                                                            shipping_to_ecuador_cents: dollarsToCents(e.target.value)
                                                                        };
                                                                        setPerfumes((prev)=>prev.map((p)=>p.id === perfume.id ? updated : p));
                                                                    },
                                                                    className: "w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 609,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 607,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 603,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                            children: "Servientrega Local"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 626,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted",
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 630,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    step: "0.01",
                                                                    value: shipLocal.toFixed(2),
                                                                    onChange: (e)=>{
                                                                        const updated = {
                                                                            ...perfume,
                                                                            local_shipping_cents: dollarsToCents(e.target.value)
                                                                        };
                                                                        setPerfumes((prev)=>prev.map((p)=>p.id === perfume.id ? updated : p));
                                                                    },
                                                                    className: "w-full pl-8 pr-4 py-3 bg-white border border-glassBorder rounded-xl text-text"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 631,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 629,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 625,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 532,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-muted text-[10px] uppercase tracking-widest mb-2 block",
                                                    children: "Categoría"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 650,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: perfume.category || "",
                                                    onChange: (e)=>{
                                                        const updated = {
                                                            ...perfume,
                                                            category: e.target.value
                                                        };
                                                        setPerfumes((prev)=>prev.map((p)=>p.id === perfume.id ? updated : p));
                                                    },
                                                    className: "w-full bg-white border border-glassBorder rounded-xl p-3 text-text cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Seleccionar categoría"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 661,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "dupearabe",
                                                            children: "Dupe Árabe (Kanra, etc.)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 662,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "arabemedio",
                                                            children: "Árabe Medio"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 663,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "arabepremium",
                                                            children: "Árabe Premium (Oud)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 664,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "diseadormainstream",
                                                            children: "Diseñador Mainstream"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 665,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "diseadorpremium",
                                                            children: "Diseñador Premium"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 666,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "nichoaccesible",
                                                            children: "Nicho Accesible"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 667,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "ultranicho",
                                                            children: "Ultra-Nicho"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 668,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 653,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 649,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-bg border border-accent/20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                                            className: "h-5 w-5 text-accent"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 675,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "text-text font-bold uppercase tracking-widest text-sm",
                                                            children: "Calculadora"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 676,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 674,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4 text-sm mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-muted text-xs mb-1",
                                                                    children: "Costo Total Real:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 683,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-text font-bold text-lg",
                                                                    children: [
                                                                        "$",
                                                                        totalCostReal.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 684,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 682,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-muted text-xs mb-1",
                                                                    children: "Factura Courier (Cupo):"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 688,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-accent font-bold text-lg",
                                                                    children: [
                                                                        "$",
                                                                        invoiceAmount.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 689,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 687,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-muted text-xs mb-1",
                                                                    children: "Punto de Equilibrio:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 693,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-text font-bold",
                                                                    children: [
                                                                        "$",
                                                                        breakEven.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 694,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 692,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-muted text-xs mb-1",
                                                                    children: "Óptimo (motor):"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 698,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-text font-bold",
                                                                    children: [
                                                                        safePct(optimalGrossMarginPct),
                                                                        "% (markup ",
                                                                        safePct(optimalMarkupPct),
                                                                        "%)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 699,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 697,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 681,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-1 w-full bg-bg rounded-full my-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 705,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-muted text-[10px] uppercase tracking-widest mb-1",
                                                                    children: "Precio sugerido (Óptimo)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 709,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-text font-black text-4xl tabular-nums",
                                                                    children: [
                                                                        "$",
                                                                        optimalPrice.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 712,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-muted text-xs mt-2",
                                                                    children: [
                                                                        "Ganancia: $",
                                                                        optimalProfit.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 715,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 708,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "md:text-right",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-muted text-[10px] uppercase tracking-widest mb-1",
                                                                    children: "Precio sugerido (Por margen)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 721,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-text font-black text-4xl tabular-nums",
                                                                    children: [
                                                                        "$",
                                                                        suggestedMarkupPrice.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 724,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-muted text-xs mt-2",
                                                                    children: [
                                                                        "Margen: ",
                                                                        safePct(markupGrossMarginPct),
                                                                        "% • Markup:",
                                                                        " ",
                                                                        safePct(markupMarkupPct),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                                    lineNumber: 727,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 720,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 707,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 673,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-3 flex-wrap",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>applyOptimalPrice(perfume),
                                                    disabled: isSaving,
                                                    className: "flex-1 min-w-[240px] bg-accent text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-text transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 742,
                                                            columnNumber: 25
                                                        }, this),
                                                        " Aplicar Precio Óptimo"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 737,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>applyMarkupPrice(perfume, suggestedMarkupCents),
                                                    disabled: isSaving,
                                                    className: "flex-1 min-w-[240px] bg-text text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-accent transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 750,
                                                            columnNumber: 25
                                                        }, this),
                                                        " Aplicar por Margen"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 745,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>updatePerfume(perfume),
                                                    disabled: isSaving,
                                                    className: "px-8 bg-text/90 text-white font-bold py-3 rounded-xl flex items-center gap-2 hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 758,
                                                            columnNumber: 25
                                                        }, this),
                                                        " Guardar"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 753,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setEditingId(null),
                                                    disabled: isSaving,
                                                    className: "px-6 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/pricing/page.tsx",
                                                        lineNumber: 766,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 761,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 736,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 531,
                                    columnNumber: 19
                                }, this) : // MODO VISTA
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-4 gap-4 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted text-xs uppercase tracking-widest mb-1",
                                                            children: "Costo Total Real"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 775,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-text font-bold",
                                                            children: [
                                                                "$",
                                                                totalCostReal.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 778,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 774,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted text-xs uppercase tracking-widest mb-1",
                                                            children: "Factura (Cupo)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 782,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-accent font-bold",
                                                            children: [
                                                                "$",
                                                                invoiceAmount.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 785,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 781,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted text-xs uppercase tracking-widest mb-1",
                                                            children: "Óptimo (motor)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 789,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-text font-bold",
                                                            children: [
                                                                "$",
                                                                optimalPrice.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 792,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 788,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted text-xs uppercase tracking-widest mb-1",
                                                            children: "Por margen"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 796,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-text font-bold",
                                                            children: [
                                                                "$",
                                                                suggestedMarkupPrice.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                                            lineNumber: 799,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 795,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 773,
                                            columnNumber: 21
                                        }, this),
                                        (Math.abs(currentPrice - optimalPrice) > 1 || Math.abs(currentPrice - suggestedMarkupPrice) > 1) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 rounded-xl bg-yellow-50 border border-yellow-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-yellow-700 text-sm font-bold mb-2",
                                                    children: [
                                                        "Sugeridos: Óptimo $",
                                                        optimalPrice.toFixed(2),
                                                        " • Margen $",
                                                        suggestedMarkupPrice.toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 806,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-yellow-600 text-xs",
                                                    children: [
                                                        "Actual: $",
                                                        currentPrice.toFixed(2),
                                                        " • Diferencia vs margen: $",
                                                        Math.abs(currentPrice - suggestedMarkupPrice).toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 810,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 805,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setEditingId(perfume.id),
                                            className: "px-6 py-3 bg-accent/10 border border-accent/30 text-text rounded-xl text-sm flex items-center gap-2 hover:bg-accent hover:text-white transition-all font-bold uppercase tracking-widest",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                                    lineNumber: 821,
                                                    columnNumber: 23
                                                }, this),
                                                " Editar costos y precio"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/pricing/page.tsx",
                                            lineNumber: 817,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/pricing/page.tsx",
                                    lineNumber: 772,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, perfume.id, true, {
                            fileName: "[project]/app/admin/pricing/page.tsx",
                            lineNumber: 510,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/admin/pricing/page.tsx",
                    lineNumber: 457,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/pricing/page.tsx",
            lineNumber: 269,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/admin/pricing/page.tsx",
        lineNumber: 268,
        columnNumber: 5
    }, this);
}
_s(PricingPage, "5UGWmw12gFvAG6gkSqFAhn+aLWg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PricingPage;
var _c;
__turbopack_context__.k.register(_c, "PricingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_7b39e32a._.js.map