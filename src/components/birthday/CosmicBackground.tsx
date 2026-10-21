import { useEffect, useRef } from "react";

/**
 * CosmicBackground — fixed, layered deep-space environment.
 *
 * CSS layers: near-black base + violet/pink nebula clouds + soft radial light.
 * Canvas layer: a restrained starfield that slowly twinkles and drifts, with
 * a tiny mouse parallax. Pauses when the tab is hidden and renders a static
 * field when the visitor prefers reduced motion.
 */
export default function CosmicBackground({ dimmed = false }: { dimmed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimRef = useRef(dimmed);
  dimRef.current = dimmed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    interface Star {
      x: number; // 0..1 relative
      y: number;
      r: number;
      base: number; // base alpha
      speed: number; // twinkle speed
      phase: number;
      depth: number; // parallax depth 0..1
      hue: number; // 0 = lavender-white, 1 = pink
    }

    let stars: Star[] = [];
    let raf = 0;
    let running = true;
    let mx = 0.5;
    let my = 0.5; // smoothed mouse position 0..1
    let tmx = 0.5;
    let tmy = 0.5;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(Math.floor((w * h) / 9000), 260);
      stars = Array.from({ length: density }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.3 + 0.3,
        base: Math.random() * 0.5 + 0.15,
        speed: Math.random() * 0.9 + 0.25,
        phase: Math.random() * Math.PI * 2,
        depth: Math.random(),
        hue: Math.random() < 0.18 ? 1 : 0,
      }));
    };

    const draw = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const dim = dimRef.current ? 0.45 : 1;
      mx += (tmx - mx) * 0.03;
      my += (tmy - my) * 0.03;
      const parX = (mx - 0.5) * 14;
      const parY = (my - 0.5) * 14;

      for (const s of stars) {
        const tw = reducedMotion ? 1 : 0.55 + 0.45 * Math.sin(time * 0.001 * s.speed + s.phase);
        const alpha = s.base * tw * dim;
        if (alpha < 0.02) continue;
        const px = s.x * w + parX * (0.3 + s.depth) + (reducedMotion ? 0 : Math.sin(time * 0.00007 + s.phase) * 4);
        const py = s.y * h + parY * (0.3 + s.depth);
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle =
          s.hue === 1
            ? `oklch(0.82 0.13 330 / ${alpha})`
            : `oklch(0.9 0.05 300 / ${alpha})`;
        ctx.fill();
        if (s.r > 1.1) {
          ctx.beginPath();
          ctx.arc(px, py, s.r * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `oklch(0.8 0.1 300 / ${alpha * 0.08})`;
          ctx.fill();
        }
      }
    };

    const loop = (time: number) => {
      if (running) draw(time);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      running = !document.hidden;
    };
    const onMouse = (e: MouseEvent) => {
      tmx = e.clientX / window.innerWidth;
      tmy = e.clientY / window.innerHeight;
    };

    build();
    if (reducedMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
      window.addEventListener("mousemove", onMouse, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("resize", build);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base deep gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, oklch(0.16 0.05 288) 0%, oklch(0.117 0.026 285) 55%, oklch(0.09 0.02 285) 100%)",
        }}
      />
      {/* Nebula clouds */}
      <div
        className="animate-nebula absolute -left-[15%] top-[-20%] h-[70vmax] w-[70vmax] rounded-full opacity-[0.55]"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.28 0.09 290 / 55%), transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="animate-nebula absolute -right-[20%] top-[30%] h-[65vmax] w-[65vmax] rounded-full opacity-[0.4]"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.35 0.12 320 / 40%), transparent 70%)",
          filter: "blur(40px)",
          animationDelay: "-12s",
        }}
      />
      <div
        className="animate-nebula absolute bottom-[-25%] left-[25%] h-[55vmax] w-[55vmax] rounded-full opacity-[0.3]"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.3 0.1 340 / 35%), transparent 70%)",
          filter: "blur(50px)",
          animationDelay: "-6s",
        }}
      />
      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Dimming veil for the quiet, intimate sections */}
      <div
        className="absolute inset-0 bg-background transition-opacity duration-[1500ms]"
        style={{ opacity: dimmed ? 0.45 : 0 }}
      />
    </div>
  );
}
