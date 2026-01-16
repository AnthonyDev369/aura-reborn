"use client";
import { useState } from "react";
import { CreditCard, Lock, Loader2, Copy, Check, MessageCircle, Truck } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

interface CheckoutProps {
  onComplete: () => void;
  totalCents: number;
}

export default function CheckoutForm({ onComplete, totalCents }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", whatsapp: "", ciudad: "Quito", direccion: "" });

  const totalDollars = (totalCents / 100).toFixed(2);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.from("orders").insert([{
        customer_name: formData.nombre, whatsapp: formData.whatsapp,
        city: formData.ciudad, address: formData.direccion,
        total_cents: totalCents, status: 'esperando_pago'
      }]);
      // Enlace de WhatsApp para comprobante
      const mensaje = `Hola Aura Reborn, orden confirmada:\n👤 ${formData.nombre}\n📍 ${formData.ciudad}\n💰 $${totalDollars}\n\nEnvío vía: Servientrega/Tramaco.`;
      window.open(`https://wa.me/593900000000?text=${encodeURIComponent(mensaje)}`, "_blank");
      onComplete();
    } catch (e) { onComplete(); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 p-2">
      {step === 1 ? (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
          <h3 className="text-white font-serif text-lg text-center mb-4 tracking-tighter">Destino del Ritual</h3>
          <input onChange={(e) => setFormData({...formData, nombre: e.target.value})} placeholder="Tu nombre" className="bg-white/5 border border-glassBorder rounded-2xl p-5 text-white w-full outline-none focus:border-accent" />
          <input onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} placeholder="Celular (09...)" className="bg-white/5 border border-glassBorder rounded-2xl p-5 text-white w-full outline-none focus:border-accent" />
          
          <div className="relative">
            <select onChange={(e) => setFormData({...formData, ciudad: e.target.value})} className="w-full bg-white/5 border border-glassBorder rounded-2xl p-5 text-white outline-none appearance-none cursor-pointer text-sm">
              <optgroup label="Serranía" className="text-black">
                <option value="Quito">Quito / Valles</option>
                <option value="Cuenca">Cuenca</option>
                <option value="Ambato">Ambato</option>
                <option value="Riobamba">Riobamba</option>
                <option value="Loja">Loja</option>
                <option value="Ibarra">Ibarra</option>
                <option value="Latacunga">Latacunga</option>
                <option value="Tulcán">Tulcán</option>
                <option value="Azogues">Azogues</option>
                <option value="Guaranda">Guaranda</option>
              </optgroup>
              <optgroup label="Costa" className="text-black">
                <option value="Guayaquil">Guayaquil / Samborondón</option>
                <option value="Manta">Manta</option>
                <option value="Portoviejo">Portoviejo</option>
                <option value="Machala">Machala</option>
                <option value="Santo Domingo">Santo Domingo</option>
                <option value="Quevedo">Quevedo</option>
                <option value="Esmeraldas">Esmeraldas</option>
                <option value="Babahoyo">Babahoyo</option>
                <option value="Santa Elena">Salinas / Sta. Elena</option>
              </optgroup>
              <optgroup label="Amazonía y Galápagos" className="text-black">
                <option value="Lago Agrio">Lago Agrio</option>
                <option value="Coca">El Coca</option>
                <option value="Puyo">Puyo</option>
                <option value="Tena">Tena</option>
                <option value="Macas">Macas</option>
                <option value="Zamora">Zamora</option>
                <option value="Galápagos">Islas Galápagos</option>
              </optgroup>
              <option value="Otras" className="text-black">Cualquier otra ciudad (Tramaco/Servientrega)</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-white text-[10px]">▼</div>
          </div>

          <input onChange={(e) => setFormData({...formData, direccion: e.target.value})} placeholder="Dirección o Retiro en oficina Courier" className="bg-white/5 border border-glassBorder rounded-2xl p-5 text-white w-full outline-none focus:border-accent" />

          <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
            <Truck className="h-4 w-4 text-accent" />
            <p className="text-[9px] text-accent uppercase tracking-widest font-bold">Cobertura Total: Servientrega • Tramaco • Cooperativas</p>
          </div>

          <button disabled={!formData.nombre || !formData.whatsapp} onClick={() => setStep(2)} className="w-full bg-accent text-bg font-black py-6 rounded-full uppercase tracking-widest disabled:opacity-20 shadow-[0_20px_40px_rgba(212,175,55,0.2)]">Siguiente</button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <div className="bg-accent/10 border border-accent/30 rounded-[35px] p-8 space-y-6">
            <p className="text-accent text-[9px] uppercase font-black tracking-[0.4em] border-b border-accent/20 pb-4">Pago por Transferencia</p>
            <div className="space-y-5 text-left">
              <div className="group cursor-pointer" onClick={() => copyToClipboard("1234567890")}>
                <p className="text-muted text-[8px] uppercase tracking-widest mb-1">Banco Pichincha (Ahorros)</p>
                <div className="flex justify-between items-center"><p className="text-white font-bold text-base">1234567890</p>{copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-accent/50" />}</div>
              </div>
              <div><p className="text-muted text-[8px] uppercase tracking-widest mb-1">Titular</p><p className="text-white font-bold text-sm uppercase tracking-tighter">AURA REBORN MAISON S.A.</p></div>
              <div className="pt-2"><p className="text-muted text-[8px] uppercase tracking-widest mb-1">Total</p><p className="text-accent font-black text-4xl">${totalDollars}</p></div>
            </div>
          </div>
          <button onClick={handleFinalize} disabled={loading} className="w-full bg-accent text-bg font-black py-6 rounded-full uppercase tracking-[0.4em] shadow-[0_30px_60px_rgba(212,175,55,0.3)] flex items-center justify-center gap-4">
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirmar Ritual"}
          </button>
        </div>
      )}
    </div>
  );
}
