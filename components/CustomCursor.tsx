"use client";

/**
 * ════════════════════════════════════════════════════════════
 * CUSTOM CURSOR - ÍKHOR 40/40 BUTTER SMOOTH
 * ════════════════════════════════════════════════════════════
 * Cursor ultra-suave (60fps) como Apple/Stripe
 * Sin bounce, solo suavidad pura
 * ════════════════════════════════════════════════════════════
 */

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Actualizar posición real del mouse
    const updatePosition = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Detectar hover
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", updatePosition);

    // Detectar elementos interactivos
    const updateInteractive = () => {
      const elements = document.querySelectorAll(
        "button, a, input, select, textarea, [role='button'], .cursor-pointer"
      );
      
      elements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    updateInteractive();
    const observer = new MutationObserver(updateInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    // Animación SUAVE con requestAnimationFrame
    const animate = () => {
      // Lerp (interpolación) para movimiento suave
      const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
      };

      // Dot: sigue el mouse casi inmediatamente (factor 0.3)
      dotPos.current.x = lerp(dotPos.current.x, mousePos.current.x, 0.2);
      dotPos.current.y = lerp(dotPos.current.y, mousePos.current.y, 0.2);

      // Circle: sigue con delay (factor 0.15 = más lento = elegancia)
      circlePos.current.x = lerp(circlePos.current.x, mousePos.current.x, 0.12);
      circlePos.current.y = lerp(circlePos.current.y, mousePos.current.y, 0.12);

      // Aplicar transformaciones
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 5}px, ${dotPos.current.y - 5}px) scale(${isHovering ? 0 : 1})`;
      }

      if (circleRef.current) {
        const size = isHovering ? 48 : 40;
        circleRef.current.style.transform = `translate(${circlePos.current.x - size/2}px, ${circlePos.current.y - size/2}px)`;
        circleRef.current.style.width = `${size}px`;
        circleRef.current.style.height = `${size}px`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      observer.disconnect();
    };
  }, [isHovering]);

  return (
    <>
      {/* Punto Principal */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transition: 'transform 0.2s ease-out' }}
      />
      
      {/* Círculo Seguidor */}
      <div
        ref={circleRef}
        className={`fixed top-0 left-0 rounded-full border-[2.5px] pointer-events-none z-[9998] ${
          isHovering ? 'border-text bg-text/8' : 'border-accent'
        }`}
        style={{ transition: 'width 0.3s ease-out, height 0.3s ease-out, border-color 0.2s, background-color 0.2s' }}
      />
    </>
  );
}
