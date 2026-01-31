"use client";

/**
 * ════════════════════════════════════════════════════════════
 * ORDER TIMELINE - ÍKHOR
 * ════════════════════════════════════════════════════════════
 * 
 * Timeline visual del estado del pedido (estilo Amazon)
 * 
 * ESTADOS:
 * 1. Esperando Pago (reloj)
 * 2. Pago Confirmado (check)
 * 3. En Preparación (paquete)
 * 4. Enviado (camión)
 * 5. Entregado (casa)
 * 
 * DISEÑO ÍKHOR:
 * - Círculos platino/grises (no colores brillantes)
 * - Línea de progreso sutil
 * - Minimalista extremo
 * - Etiquetas visibles pero discretas
 * ════════════════════════════════════════════════════════════
 */

import { CheckCircle2, Clock, Package, Truck, Home } from "lucide-react";

interface TimelineProps {
  status: string;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
}

// ─────────────────────────────────────────────────────────
// DEFINICIÓN DE ESTADOS (ÍKHOR - Sin colores brillantes)
// ─────────────────────────────────────────────────────────
const ESTADOS = [
  { 
    key: "esperando_pago", 
    label: "Esperando Pago", 
    icon: Clock, 
    activeColor: "text-text bg-text",           // Negro cuando activo
    inactiveColor: "text-muted/30 bg-muted/10"  // Gris cuando inactivo
  },
  { 
    key: "confirmado", 
    label: "Confirmado", 
    icon: CheckCircle2, 
    activeColor: "text-text bg-text",
    inactiveColor: "text-muted/30 bg-muted/10"
  },
  { 
    key: "preparando", 
    label: "Preparando", 
    icon: Package, 
    activeColor: "text-text bg-text",
    inactiveColor: "text-muted/30 bg-muted/10"
  },
  { 
    key: "enviado", 
    label: "Enviado", 
    icon: Truck, 
    activeColor: "text-text bg-text",
    inactiveColor: "text-muted/30 bg-muted/10"
  },
  { 
    key: "entregado", 
    label: "Entregado", 
    icon: Home, 
    activeColor: "text-text bg-text",
    inactiveColor: "text-muted/30 bg-muted/10"
  }
];

export default function OrderTimeline({ status, trackingNumber, courier, estimatedDelivery }: TimelineProps) {
  // Encontrar índice del estado actual
  const currentIndex = ESTADOS.findIndex(e => e.key === status);

  return (
    <div className="space-y-6">
      
      {/* ════════════════════════════════════════════ */}
      {/* TIMELINE VISUAL                              */}
      {/* ════════════════════════════════════════════ */}
      <div className="flex items-center justify-between relative py-4">
        
        {/* Línea de fondo (gris claro) */}
        <div className="absolute top-9 left-0 right-0 h-[2px] bg-glassBorder" />
        
        {/* Línea de progreso (negro, crece según estado) */}
        <div 
          className="absolute top-9 left-0 h-[2px] bg-text transition-all duration-1000"
          style={{ width: `${(currentIndex / (ESTADOS.length - 1)) * 100}%` }}
        />

        {/* Estados (círculos) */}
        {ESTADOS.map((estado, index) => {
          const Icon = estado.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={estado.key} className="relative z-10 flex flex-col items-center">
              {/* Círculo del estado */}
              <div
                className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  isActive
                    ? `${estado.activeColor} border-text shadow-[0_0_20px_rgba(0,0,0,0.15)]`
                    : `${estado.inactiveColor} border-muted/20`
                } ${isCurrent ? "scale-125" : "scale-100"}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-muted/30"}`} />
              </div>
              
              {/* Etiqueta del estado */}
              <p className={`mt-3 text-[9px] uppercase tracking-wider font-bold ${isActive ? "text-text" : "text-muted/40"}`}>
                {estado.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* INFO DE ENVÍO (Solo si está enviado)        */}
      {/* ════════════════════════════════════════════ */}
      {status === "enviado" && trackingNumber && (
        <div className="mt-8 p-6 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-5 w-5 text-accent" />
            <h4 className="text-text font-bold uppercase tracking-widest text-sm">Información de Envío</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Courier</p>
              <p className="text-text font-bold">{courier || "Servientrega"}</p>
            </div>
            <div>
              <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Número de Guía</p>
              <p className="text-text font-bold">{trackingNumber}</p>
            </div>
            {estimatedDelivery && (
              <div className="col-span-2">
                <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Entrega Estimada</p>
                <p className="text-text font-bold">
                  {new Date(estimatedDelivery).toLocaleDateString('es-EC', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
