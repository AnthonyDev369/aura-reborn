"use client";
import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const springConfig = { stiffness: 400, damping: 30 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      x.set(e.clientX - 16);
      y.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveMouse);
    return () => window.removeEventListener("mousemove", moveMouse);
  }, [x, y, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{ x, y }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent/40 pointer-events-none z-[10000] mix-blend-difference hidden md:flex items-center justify-center"
    >
      <div className="w-1 h-1 bg-accent rounded-full" />
    </motion.div>
  );
}
