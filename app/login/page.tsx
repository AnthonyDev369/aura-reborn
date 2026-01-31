"use client";

/**
 * ════════════════════════════════════════════════════════════
 * ÍKHOR - PÁGINA DE LOGIN
 * ════════════════════════════════════════════════════════════
 * 
 * Funcionalidades:
 * - Inicio de sesión con email + contraseña
 * - Registro de nuevos usuarios
 * - Recuperación de contraseña
 * 
 * Diseño:
 * - Minimalista extremo
 * - Colores ÍKHOR (Platinum Whisper)
 * - Sin errores de botones anidados
 * ════════════════════════════════════════════════════════════
 */

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  
  // Estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Registrar nuevo usuario
  // ─────────────────────────────────────────────────────────
  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Cuenta creada exitosamente");
    }
    setLoading(false);
  };

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Iniciar sesión
  // ─────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────
  // FUNCIÓN: Recuperar contraseña
  // ─────────────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    const userEmail = prompt("Escribe tu correo para recuperar contraseña:");
    if (userEmail) {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: 'http://localhost:3000/reset-password'
      });
      if (error) alert(error.message);
      else alert("Revisa tu correo para restablecer la contraseña");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-bg">
      <div className="w-full max-w-md">
        
        {/* Logo ÍKHOR */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-text mb-2 tracking-tight">ÍKHOR</h1>
          <p className="text-[10px] tracking-[0.5em] text-muted uppercase">Ἰχώρ</p>
        </div>

        {/* Formulario */}
        <div className="h-1 w-12 bg-accent/30 rounded-full mx-auto mb-6" />
        <div className="bg-white border border-glassBorder p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-serif text-text mb-8 text-center tracking-tight">Acceso</h2>

          <div className="space-y-4">
            {/* Campo Email */}
            <input
              className="w-full p-4 rounded-xl bg-bg border border-glassBorder text-text placeholder:text-muted/40 outline-none focus:border-accent transition-all"
              placeholder="correo@ejemplo.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Campo Contraseña */}
            <input
              className="w-full p-4 rounded-xl bg-bg border border-glassBorder text-text placeholder:text-muted/40 outline-none focus:border-accent transition-all"
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Botones de Acción */}
            <div className="flex gap-3 pt-4">
              <button 
                onClick={signIn} 
                disabled={loading}
                className="flex-1 py-4 rounded-xl bg-accent text-white font-bold uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-text"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "ENTRAR"}
              </button>
              <button 
                onClick={signUp} 
                disabled={loading}
                className="flex-1 py-4 rounded-xl border-2 border-glassBorder text-text font-bold uppercase tracking-widest hover:border-accent disabled:opacity-50 transition-all"
              >
                REGISTRARSE
              </button>
            </div>
          </div>

          {/* Recuperar Contraseña - SIN BOTÓN ANIDADO */}
          <div className="mt-6 text-center">
            <span 
              onClick={handleForgotPassword}
              className="text-xs text-accent hover:text-text transition-colors uppercase tracking-widest cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-text/30 text-xs mt-8 tracking-widest">
  ÍKHOR • Ecuador 2026
</p>
      </div>
    </main>
  );
}
