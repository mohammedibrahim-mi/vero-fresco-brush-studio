import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const SPECTRUM = ["#FE3600", "#FF7B02", "#FAD220", "#81DA42", "#318EFF", "#8B68E8"];

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Lenis smooth scroll wired into GSAP ScrollTrigger. */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let destroyed = false;
    let cleanup = () => {};
    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      const lenis = new Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);
  return null;
}

/** Paint-dot cursor with a fading spectrum trail (desktop, fine pointer only). */
export function PaintCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const ok =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    document.documentElement.classList.add("custom-cursor");
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const pts: { x: number; y: number; life: number; c: string }[] = [];
    let hue = 0;
    let mx = -100, my = -100;
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      hue = (hue + 0.15) % SPECTRUM.length;
      pts.push({ x: mx, y: my, life: 1, c: SPECTRUM[Math.floor(hue)] ?? "#0E0E10" });
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
    };
    window.addEventListener("pointermove", move);
    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        if (!p) continue;
        p.life -= 0.035;
        if (p.life <= 0) { pts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life * 0.55;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 * p.life + 1, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[100] h-full w-full" aria-hidden />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] h-3 w-3 rounded-full bg-foreground mix-blend-multiply"
      />
    </>
  );
}

/** Loader that paints the logo stroke, then wipes away. */
export function PageLoader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setDone(true), reduced ? 200 : 1700);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <svg width="160" height="60" viewBox="0 0 160 60" fill="none" aria-hidden>
              <defs>
                <linearGradient id="ld-g" x1="0" x2="1">
                  {SPECTRUM.map((c, i) => (
                    <stop key={c} offset={i / (SPECTRUM.length - 1)} stopColor={c} />
                  ))}
                </linearGradient>
              </defs>
              <motion.path
                d="M8 40 C 30 8, 52 52, 78 28 S 128 12, 152 30"
                stroke="url(#ld-g)"
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </svg>
            <motion.span
              className="display text-2xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              vero fresco
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15 });
  const sy = useSpring(y, { stiffness: 220, damping: 15 });
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className="inline-block"
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

export function BrushMark({ className = "h-4 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 16" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="bm-g" x1="0" x2="1">
          {SPECTRUM.map((c, i) => (
            <stop key={c} offset={i / (SPECTRUM.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <path d="M3 11 C 10 2, 16 14, 22 7 S 33 3, 37 8" stroke="url(#bm-g)" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export function PlayButton({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <Magnetic>
      <a
        href="#"
        className={`group relative inline-flex items-center gap-3 rounded-full bg-foreground font-medium text-background transition-shadow duration-300 hover:shadow-glow ${
          size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path fill="currentColor" d="M4 2.5v19c0 .6.7 1 1.2.6l10.6-9.5c.4-.3.4-.9 0-1.2L5.2 1.9C4.7 1.5 4 1.9 4 2.5Zm13.6 7.3 2.9 1.6c.6.3.6 1 0 1.3l-2.9 1.6-2.4-2.2 2.4-2.3Z" />
        </svg>
        Get it on Google Play
      </a>
    </Magnetic>
  );
}
