"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Cuenta creada. Confirma tu correo si es necesario.");
    }
    setLoading(false);
  };

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-bg">
      <div className="glass-panel p-10 rounded-3xl w-full max-w-md border border-glassBorder">
        <h1 className="text-4xl font-serif text-white mb-10 text-center tracking-tighter">Acceso Aura</h1>

        <div className="space-y-4">
          <input
            className="w-full p-4 rounded-xl bg-white/5 border border-glassBorder text-white placeholder:text-white/40 outline-none focus:border-accent transition-all"
            placeholder="correo@ejemplo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-white/5 border border-glassBorder text-white placeholder:text-white/40 outline-none focus:border-accent transition-all"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex gap-3 pt-4">
            <button 
              onClick={signIn} 
              disabled={loading}
              className="flex-1 py-4 rounded-xl bg-accent text-bg font-black uppercase tracking-widest disabled:opacity-50 transition-all"
            >
              {loading ? "..." : "Entrar"}
            </button>
            <button 
              onClick={signUp} 
              disabled={loading}
              className="flex-1 py-4 rounded-xl border-2 border-accent/40 text-white font-black uppercase tracking-widest hover:border-accent disabled:opacity-50 transition-all"
            >
              {loading ? "..." : "Registrarse"}
            </button>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-8 tracking-widest">Aura Reborn • Ecuador 2026</p>
      </div>
    </main>
  );
}
