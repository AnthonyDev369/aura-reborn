"use client";
import { CheckCircle2, Clock, Package, Truck, Home } from "lucide-react";

interface TimelineProps {
  status: string;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
}

const ESTADOS = [
  { key: "esperando_pago", label: "Esperando Pago", icon: Clock, color: "text-yellow-500" },
  { key: "confirmado", label: "Pago Confirmado", icon: CheckCircle2, color: "text-blue-500" },
  { key: "preparando", label: "En Preparación", icon: Package, color: "text-purple-500" },
  { key: "enviado", label: "Enviado", icon: Truck, color: "text-accent" },
  { key: "entregado", label: "Entregado", icon: Home, color: "text-green-500" }
];

export default function OrderTimeline({ status, trackingNumber, courier, estimatedDelivery }: TimelineProps) {
  const currentIndex = ESTADOS.findIndex(e => e.key === status);

  return (
    <div className="space-y-6">
      {/* Timeline Visual */}
      <div className="flex items-center justify-between relative">
        {/* Línea de Progreso */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-white/10" />
        <div 
          className="absolute top-5 left-0 h-[2px] bg-accent transition-all duration-1000"
          style={{ width: `${(currentIndex / (ESTADOS.length - 1)) * 100}%` }}
        />

        {/* Estados */}
        {ESTADOS.map((estado, index) => {
          const Icon = estado.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={estado.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  isActive
                    ? `${estado.color} bg-black border-current shadow-[0_0_20px_currentColor]`
                    : "bg-black/50 border-white/10 text-white/20"
                } ${isCurrent ? "scale-125" : ""}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className={`mt-3 text-[9px] uppercase tracking-wider font-bold ${isActive ? "text-white" : "text-white/30"}`}>
                {estado.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Info de Envío */}
      {status === "enviado" && trackingNumber && (
        <div className="mt-8 p-6 rounded-2xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-4 mb-4">
            <Truck className="h-5 w-5 text-accent" />
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Información de Envío</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Courier</p>
              <p className="text-white font-bold">{courier || "Servientrega"}</p>
            </div>
            <div>
              <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Número de Guía</p>
              <p className="text-accent font-bold">{trackingNumber}</p>
            </div>
            {estimatedDelivery && (
              <div className="col-span-2">
                <p className="text-muted text-[10px] uppercase tracking-widest mb-1">Entrega Estimada</p>
                <p className="text-white font-bold">{new Date(estimatedDelivery).toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
