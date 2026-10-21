import { useEffect, useRef, useState } from "react";

/**
 * CursorGlow — a soft light that trails the cursor on desktop, occasionally
 * leaving tiny fading stars along its path. Disabled on touch devices and
 * for visitors who prefer reduced motion.
 */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let lastStar = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = (time: number) => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${x - 90}px, ${y - 90}px, 0)`;
      }
      // Spawn a tiny star along the path every ~260ms.
      if (Math.hypot(tx - x, ty - y) > 12 && time - lastStar > 260) {
        lastStar = time;
        spawnStar(x, y);
      }
      raf = requestAnimationFrame(loop);
    };

    const spawnStar = (sx: number, sy: number) => {
      const star = document.createElement("span");
      const size = 2 + Math.random() * 3;
      star.style.cssText = `position:fixed;left:${sx + (Math.random() * 26 - 13)}px;top:${
        sy + (Math.random() * 26 - 13)
      }px;width:${size}px;height:${size}px;border-radius:9999px;pointer-events:none;z-index:40;background:oklch(0.87 0.09 305);box-shadow:0 0 8px oklch(0.7 0.15 300);transition:opacity 1.1s ease, transform 1.1s ease;opacity:0.85;`;
      document.body.appendChild(star);
      requestAnimationFrame(() => {
        star.style.opacity = "0";
        star.style.transform = `translateY(-14px) scale(0.4)`;
      });
      window.setTimeout(() => star.remove(), 1300);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 h-[180px] w-[180px] rounded-full"
      style={{
        background:
          "radial-gradient(closest-side, oklch(0.75 0.14 300 / 14%), transparent 70%)",
      }}
    />
  );
}
