"use client";

/**
 * ════════════════════════════════════════════════════════════
 * IMPORT SETTINGS - ÍKHOR
 * ════════════════════════════════════════════════════════════
 * 
 * Panel de gestión de cupos de importación y métodos de envío
 * 
 * FUNCIONALIDADES:
 * - Ver cupo usado vs límite ($X / $1,000)
 * - Cambiar método (Courier ↔ Viajero)
 * - Editar tiempos de entrega
 * - Auto-cambio cuando se alcanza límite
 * - Cálculo automático de días estimados
 * 
 * ESTRATEGIA DE NEGOCIO:
 * - $0-$1,000: Courier (rápido, 17-23 días)
 * - $1,000+: Viajero (lento, 25-30 días)
 * - Futuro: Métodos personalizados
 * ════════════════════════════════════════════════════════════
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { Package, TrendingUp, Clock, Truck, Save, RefreshCw } from "lucide-react";

interface ImportSettings {
  id: string;
  active_method: string;
  courier_quota_limit_cents: number;
  courier_quota_used_cents: number;
  courier_supplier_days_min: number;
  courier_supplier_days_max: number;
  courier_shipping_days: number;
  courier_warehouse_days_min: number;
  courier_warehouse_days_max: number;
  viajero_supplier_days_min: number;
  viajero_supplier_days_max: number;
  viajero_shipping_days_min: number;
  viajero_shipping_days_max: number;
  viajero_warehouse_days_min: number;
  viajero_warehouse_days_max: number;
  auto_switch_to_viajero: boolean;
}

export default function ImportSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<ImportSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const supabase = createClient();
    
    // Verificar admin (middleware ya validó, pero doble check)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== "anthonybarreiro369@gmail.com") {
      router.push("/");
      return;
    }

    const { data, error } = await supabase
  .from("import_settings")
  .select("*")
  .limit(1)
  .maybeSingle();

if (error) {
  console.error("Error cargando settings:", error);
}

    if (data) {
      setSettings(data);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!settings) return;
    
    setSaving(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from("import_settings")
      .update(settings)
      .eq("id", settings.id);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("Configuración guardada exitosamente");
    }
    setSaving(false);
  }

  async function switchMethod(method: string) {
    if (!settings) return;
    setSettings({ ...settings, active_method: method });
  }

  // Cálculos
  const quotaLimit = settings?.courier_quota_limit_cents || 100000;
  const quotaUsed = settings?.courier_quota_used_cents || 0;
  const quotaPercent = (quotaUsed / quotaLimit) * 100;
  const quotaRemaining = quotaLimit - quotaUsed;

  const courierTotalDays = (settings?.courier_supplier_days_max || 9) + 
                           (settings?.courier_shipping_days || 7) + 
                           (settings?.courier_warehouse_days_max || 7);
  
  const viajeroTotalDays = (settings?.viajero_supplier_days_max || 9) + 
                           (settings?.viajero_shipping_days_max || 20) + 
                           (settings?.viajero_warehouse_days_max || 7);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-muted">Cargando configuración...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-muted">Error al cargar configuración</p>
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-bg py-32 px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ════════════════════════════════════════════ */}
        {/* HEADER                                       */}
        {/* ════════════════════════════════════════════ */}
        <div className="flex justify-between items-center mb-16 pb-8 border-b border-glassBorder">
          <div>
            <div className="h-1 w-12 bg-accent/30 rounded-full mb-4" />
            <h1 className="text-5xl font-serif text-text mb-4 tracking-tight">Gestión de Importación</h1>
            <p className="text-muted text-sm uppercase tracking-widest">Configuración de Cupos y Métodos</p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="px-6 py-3 border border-glassBorder text-text rounded-xl hover:bg-bg transition-all text-sm uppercase tracking-widest font-bold"
          >
            ← Volver a Órdenes
          </button>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* PANEL DE CUPO ACTUAL                         */}
        {/* ════════════════════════════════════════════ */}
        <div className="bg-white border border-glassBorder p-8 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-serif text-text">Estado del Cupo Courier</h2>
          </div>

          {/* Barra de Progreso */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Cupo Utilizado</p>
                <p className="text-text font-bold text-3xl tabular-nums">
                  ${(quotaUsed / 100).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Límite ÍKHOR</p>
                <p className="text-text font-bold text-3xl tabular-nums">
                  ${(quotaLimit / 100).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Barra Visual */}
            <div className="h-4 bg-bg rounded-full overflow-hidden border border-glassBorder">
              <div 
                className={`h-full transition-all duration-1000 ${
                  quotaPercent >= 90 ? 'bg-red-500' : 
                  quotaPercent >= 70 ? 'bg-yellow-500' : 
                  'bg-text'
                }`}
                style={{ width: `${Math.min(quotaPercent, 100)}%` }}
              />
            </div>

            <div className="flex justify-between mt-2">
              <p className="text-muted text-xs">{quotaPercent.toFixed(1)}% usado</p>
              <p className={`text-xs font-bold ${quotaRemaining < 20000 ? 'text-red-600' : 'text-text'}`}>
                ${(quotaRemaining / 100).toFixed(2)} restantes
              </p>
            </div>
          </div>

          {/* Alerta si cerca del límite */}
          {quotaPercent >= 80 && (
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
              <p className="text-yellow-700 text-sm font-bold">
                ⚠️ Estás cerca del límite. Considera cambiar a Viajero pronto.
              </p>
            </div>
          )}

          {/* Alerta si excedió límite */}
          {quotaPercent >= 100 && settings.active_method === 'courier' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-red-700 text-sm font-bold mb-3">
                🚨 Límite alcanzado. Cambiando automáticamente a Viajero.
              </p>
              <button
                onClick={() => switchMethod('viajero')}
                className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs"
              >
                ACTIVAR VIAJERO AHORA
              </button>
            </div>
          )}
        </div>
        {/* ════════════════════════════════════════════ */}
        {/* SELECTOR DE MÉTODO                           */}
        {/* ════════════════════════════════════════════ */}
        <div className="bg-white border border-glassBorder p-8 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-serif text-text">Método de Importación Activo</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Opción COURIER */}
            <button
              onClick={() => switchMethod('courier')}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                settings.active_method === 'courier'
                  ? 'border-text bg-text/5'
                  : 'border-glassBorder hover:border-accent'
              }`}
            >
              <p className="text-text font-bold text-lg mb-2">📦 Courier</p>
              <p className="text-muted text-xs mb-3">Rápido • Cupo limitado</p>
              <p className="text-text font-bold">~{courierTotalDays} días</p>
              <p className="text-[10px] text-muted uppercase tracking-widest mt-2">Hasta $1,000/año</p>
            </button>

            {/* Opción VIAJERO */}
            <button
              onClick={() => switchMethod('viajero')}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                settings.active_method === 'viajero'
                  ? 'border-text bg-text/5'
                  : 'border-glassBorder hover:border-accent'
              }`}
            >
              <p className="text-text font-bold text-lg mb-2">✈️ Viajero</p>
              <p className="text-muted text-xs mb-3">Más lento • Sin límite</p>
              <p className="text-text font-bold">~{viajeroTotalDays} días</p>
              <p className="text-[10px] text-muted uppercase tracking-widest mt-2">Ilimitado</p>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* CONFIGURACIÓN DE TIEMPOS - COURIER           */}
        {/* ════════════════════════════════════════════ */}
        <div className="bg-white border border-glassBorder p-8 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-serif text-text">Tiempos de Entrega - Courier</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-muted text-[10px] uppercase tracking-widest mb-3">Proveedor → Bodega Courier</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={settings.courier_supplier_days_min}
                  onChange={(e) => setSettings({...settings, courier_supplier_days_min: parseInt(e.target.value)})}
                  className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
                />
                <span className="self-center text-muted">a</span>
                <input
                  type="number"
                  value={settings.courier_supplier_days_max}
                  onChange={(e) => setSettings({...settings, courier_supplier_days_max: parseInt(e.target.value)})}
                  className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
                />
              </div>
              <p className="text-[9px] text-muted text-center mt-1">días hábiles</p>
            </div>

            <div>
              <p className="text-muted text-[10px] uppercase tracking-widest mb-3">Courier → Ecuador</p>
              <input
                type="number"
                value={settings.courier_shipping_days}
                onChange={(e) => setSettings({...settings, courier_shipping_days: parseInt(e.target.value)})}
                className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
              />
              <p className="text-[9px] text-muted text-center mt-1">días hábiles</p>
            </div>

            <div>
              <p className="text-muted text-[10px] uppercase tracking-widest mb-3">Bodega → Cliente (Servientrega)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={settings.courier_warehouse_days_min}
                  onChange={(e) => setSettings({...settings, courier_warehouse_days_min: parseInt(e.target.value)})}
                  className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
                />
                <span className="self-center text-muted">a</span>
                <input
                  type="number"
                  value={settings.courier_warehouse_days_max}
                  onChange={(e) => setSettings({...settings, courier_warehouse_days_max: parseInt(e.target.value)})}
                  className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
                />
              </div>
              <p className="text-[9px] text-muted text-center mt-1">días hábiles</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-bg border border-glassBorder">
            <p className="text-text font-bold text-sm mb-1">Total Estimado (Courier):</p>
            <p className="text-text text-2xl font-bold">{courierTotalDays - 3} a {courierTotalDays} días hábiles</p>
          </div>
        </div>
        {/* ════════════════════════════════════════════ */}
        {/* CONFIGURACIÓN DE TIEMPOS - VIAJERO           */}
        {/* ════════════════════════════════════════════ */}
        <div className="bg-white border border-glassBorder p-8 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-serif text-text">Tiempos de Entrega - Viajero</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-muted text-[10px] uppercase tracking-widest mb-3">Proveedor → Viajero</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={settings.viajero_supplier_days_min}
                  onChange={(e) => setSettings({...settings, viajero_supplier_days_min: parseInt(e.target.value)})}
                  className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
                />
                <span className="self-center text-muted">a</span>
                <input
                  type="number"
                  value={settings.viajero_supplier_days_max}
                  onChange={(e) => setSettings({...settings, viajero_supplier_days_max: parseInt(e.target.value)})}
                  className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
                />
              </div>
              <p className="text-[9px] text-muted text-center mt-1">días hábiles</p>
            </div>

            <div>
              <p className="text-muted text-[10px] uppercase tracking-widest mb-3">Viajero → Ecuador</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={settings.viajero_shipping_days_min}
                  onChange={(e) => setSettings({...settings, viajero_shipping_days_min: parseInt(e.target.value)})}
                  className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
                />
                <span className="self-center text-muted">a</span>
                <input
                  type="number"
                  value={settings.viajero_shipping_days_max}
                  onChange={(e) => setSettings({...settings, viajero_shipping_days_max: parseInt(e.target.value)})}
                  className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
                />
              </div>
              <p className="text-[9px] text-muted text-center mt-1">días hábiles</p>
            </div>

            <div>
              <p className="text-muted text-[10px] uppercase tracking-widest mb-3">Bodega → Cliente</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={settings.viajero_warehouse_days_min}
                  onChange={(e) => setSettings({...settings, viajero_warehouse_days_min: parseInt(e.target.value)})}
                  className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
                />
                <span className="self-center text-muted">a</span>
                <input
                  type="number"
                  value={settings.viajero_warehouse_days_max}
                  onChange={(e) => setSettings({...settings, viajero_warehouse_days_max: parseInt(e.target.value)})}
                  className="w-full bg-bg border border-glassBorder rounded-xl p-3 text-text text-center"
                />
              </div>
              <p className="text-[9px] text-muted text-center mt-1">días hábiles</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-bg border border-glassBorder">
            <p className="text-text font-bold text-sm mb-1">Total Estimado (Viajero):</p>
            <p className="text-text text-2xl font-bold">
              {(settings.viajero_supplier_days_min || 7) + (settings.viajero_shipping_days_min || 10) + (settings.viajero_warehouse_days_min || 3)} a {viajeroTotalDays} días hábiles
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════ */}
        {/* BOTÓN GUARDAR CAMBIOS                        */}
        {/* ════════════════════════════════════════════ */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-text text-white font-bold py-5 rounded-full flex items-center justify-center gap-3 uppercase tracking-widest text-sm hover:bg-accent transition-all disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                Guardar Configuración
              </>
            )}
          </button>
        </div>

        {/* Info adicional */}
        <p className="text-center text-muted text-xs mt-6 uppercase tracking-widest">
          Los cambios afectarán todas las nuevas pre-órdenes
        </p>
      </div>
    </main>
  );
}
