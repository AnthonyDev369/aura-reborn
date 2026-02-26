"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function QuoteSection() {
  return (
    <section className="py-48 px-6 bg-white/[0.02] border-y border-glassBorder text-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent" />
      <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }}
      >
        <Sparkles className="h-8 w-8 text-accent mx-auto mb-12" suppressHydrationWarning />

        <h2 className="text-4xl md:text-5xl font-serif italic text-text/80 max-w-3xl mx-auto leading-snug tracking-tight">
          "No vestimos el cuerpo, vestimos la memoria que dejas al pasar."
        </h2>
        <p className="font-serif italic text-accent text-2xl mt-12 tracking-widest">
          — Ἰχώρ
        </p>
      </motion.div>
    </section>
  );
}
