"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      alert(error.message);
    } else {
      alert("Contraseña actualizada exitosamente");
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-bg">
      <div className="glass-panel p-10 rounded-3xl w-full max-w-md">
        <h1 className="text-4xl font-serif text-white mb-10 text-center">Nueva Contraseña</h1>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/5 border border-glassBorder text-white mb-6"
        />
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-accent text-bg font-black py-4 rounded-xl uppercase tracking-widest"
        >
          {loading ? "..." : "Cambiar Contraseña"}
        </button>
      </div>
    </main>
  );
}
