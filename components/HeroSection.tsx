"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative pt-56 pb-32 px-4 overflow-hidden">
      {/* Blur decorativo de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-accent/[0.08] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block mb-12 px-8 py-2.5 rounded-full border border-accent/30 bg-accent/10 text-[10px] tracking-[0.7em] text-accent uppercase font-black"
        >
          ÍKHOR • 2026
        </motion.div>

        {/* Título Principal */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-[10rem] font-serif mb-12 text-text tracking-tighter leading-[0.85]"
        >
          La esencia <br />
          <span className="text-accent italic">invisible..</span>
        </motion.h1>
      </div>
    </section>
  );
}
