import { lazy, Suspense, useEffect, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import heroImg from "@/assets/hero-phone.jpg";
import { BrushMark, DownloadButton, Magnetic } from "./effects";

const HeroScene = lazy(() => import("./HeroScene"));

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links: [string, string][] = [
    ["Features", "#features"],
    ["Brushes", "#brushes"],
    ["Animate", "#animate"],
    ["Download", "#download"],
    ["FAQ", "#faq"],
    ["About", "#about"],
  ];
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className={`glass flex items-center gap-6 rounded-full border border-border shadow-soft transition-all duration-500 ${
          scrolled ? "px-3 py-1.5 md:gap-6" : "px-5 py-2.5 md:gap-10"
        }`}
      >
        <a href="#top" className="flex items-center gap-2 pl-1">
          <BrushMark />
          <span className="display text-base tracking-tight">vero fresco</span>
        </a>
        <ul className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {links.map(([l, h]) => (
            <li key={l}><a href={h} className="transition-colors hover:text-foreground">{l}</a></li>
          ))}
        </ul>
        <a
          href="#download"
          className={`rounded-full bg-foreground font-medium text-background transition-all hover:shadow-glow ${
            scrolled ? "px-4 py-1.5 text-xs" : "px-5 py-2 text-sm"
          }`}
        >
          <span className="hidden sm:inline">Download APK</span>
          <span className="sm:hidden">Download</span>
        </a>
      </nav>
    </header>
  );
}

function canRun3D() {
  if (window.innerWidth < 768) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if ((navigator.hardwareConcurrency ?? 8) < 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function HeroVisual() {
  const [use3D, setUse3D] = useState<boolean | null>(null);
  useEffect(() => setUse3D(canRun3D()), []);
  const img = (
    <img src={heroImg} alt="Android phone with paint ribbons flowing from the screen" width={1920} height={1088}
      className="h-full w-full object-cover" />
  );
  if (use3D === null) return null;
  if (!use3D) return img;
  return <Suspense fallback={img}><HeroScene /></Suspense>;
}

export function Hero({ videoSrc = "" }: { videoSrc?: string }) {
  const [open, setOpen] = useState(false);
  const word = "Vero Fresco".split("");
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col items-center overflow-hidden pt-32">
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          Paint · Draw · Animate
        </motion.p>
        <h1 className="display mt-6 text-[clamp(3.5rem,13vw,10rem)]" aria-label="Vero Fresco">
          {word.map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              initial={{ opacity: 0, filter: "blur(18px)", y: 30 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ delay: 1.7 + i * 0.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3 }}
        >
          The pro painting & drawing app for Android. Made for everyone. <span className="serif-em text-foreground">Download it free.</span>
        </motion.p>
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.45 }}
        >
          <DownloadButton />
          {videoSrc && <Magnetic>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:border-foreground"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[8px] text-background">▶</span>
              Watch the film
            </button>
          </Magnetic>}
        </motion.div>
      </div>

      <div className="relative -mt-6 h-[58vh] w-full max-w-[1400px] md:-mt-16 md:h-[70vh]">
        <ClientOnly fallback={null}>
          <HeroVisual />
        </ClientOnly>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-overlay p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog" aria-modal="true" aria-label="Vero Fresco film"
          >
            <motion.div
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-card shadow-soft"
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <video src={videoSrc || undefined} poster={heroImg} controls autoPlay playsInline className="aspect-video w-full bg-foreground" />
              <button onClick={() => setOpen(false)} aria-label="Close"
                className="glass absolute right-4 top-4 h-10 w-10 rounded-full text-lg">×</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
