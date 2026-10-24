import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import liveBrush from "@/assets/live-brush.jpg";
import layersImg from "@/assets/layers.jpg";
import animateImg from "@/assets/animate.jpg";
import brushesImg from "@/assets/brushes.jpg";
import symmetryImg from "@/assets/symmetry.jpg";
import paintInsideImg from "@/assets/paint-inside.jpg";
import vectorTrimImg from "@/assets/vector-trim.jpg";
import motionImg from "@/assets/motion-presets.jpg";
import finaleImg from "@/assets/finale.jpg";
import f1 from "@/assets/frame-1.jpg";
import f2 from "@/assets/frame-2.jpg";
import f3 from "@/assets/frame-3.jpg";
import f4 from "@/assets/frame-4.jpg";
import f5 from "@/assets/frame-5.jpg";
import { APK_READY, BrushMark, DownloadButton, SPECTRUM } from "./effects";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const color = (i: number) => SPECTRUM[i] ?? "#318EFF";

/** Runs GSAP setup only when motion is allowed; reverts on unmount. */
function useGsap(scope: RefObject<HTMLElement | null>, setup: () => void) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(MOTION_OK, () => setup());
    }, scope);
    return () => { mm.revert(); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Heading({ eyebrow, children, className = "" }: { eyebrow: string; children: ReactNode; className?: string }) {
  return (
    <Reveal className={`text-center ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mx-auto mt-5 max-w-5xl text-[clamp(2.6rem,7vw,6rem)]">{children}</h2>
    </Reveal>
  );
}

/* 3. Statement */
export function Statement() {
  const ref = useRef<HTMLElement>(null);
  const text = "Expressive brushes. Layers. Animation. A full painting studio in your pocket — and it costs nothing.";
  useGsap(ref, () => {
    gsap.fromTo(".st-word", { opacity: 0.15 }, {
      opacity: 1, stagger: 0.08, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 55%", scrub: true },
    });
  });
  return (
    <section ref={ref} className="mx-auto max-w-6xl px-6 py-40 md:py-56">
      <p className="eyebrow mb-10 text-center">The short version</p>
      <p className="display text-center text-[clamp(2rem,5.4vw,4.75rem)] leading-[1.05]">
        {text.split(" ").map((w, i) => (
          <span key={i} className="st-word inline-block pr-[0.25em]">
            {w === "nothing." ? <span className="serif-em text-spectrum">nothing.</span> : w}
          </span>
        ))}
      </p>
    </section>
  );
}

/* 4. Journey */
const STEPS = [
  { n: "01", t: "Sketch", d: "Capture ideas anywhere with pencils, inks and markers.", img: brushesImg },
  { n: "02", t: "Paint", d: "Live brushes that bloom, blend and smudge like the real thing.", img: liveBrush },
  { n: "03", t: "Animate", d: "Bring drawings to life frame by frame.", img: animateImg },
];
export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current, start: "top top", end: "bottom bottom",
      onUpdate: (s) => setActive(Math.min(2, Math.floor(s.progress * 3))),
    });
    return () => st.kill();
  }, []);
  return (
    <section ref={ref} id="features" className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col justify-center">
            <p className="eyebrow mb-8">The journey</p>
            <ol className="space-y-8">
              {STEPS.map((s, i) => (
                <li key={s.n} className={`transition-all duration-500 ${active === i ? "opacity-100" : "opacity-25"}`}>
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-sm text-muted-foreground">{s.n}</span>
                    <h3 className="display text-[clamp(2.4rem,5vw,4.5rem)]">{s.t}</h3>
                  </div>
                  <p className="ml-10 mt-2 max-w-sm text-muted-foreground">{s.d}</p>
                  <div className="ml-10 mt-4 h-px w-48 overflow-hidden bg-border">
                    <div className="h-full bg-spectrum transition-transform duration-700 origin-left"
                      style={{ transform: `scaleX(${active >= i ? 1 : 0})` }} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative aspect-[4/3] w-full [perspective:1200px] md:aspect-auto md:h-[70vh]">
            {STEPS.map((s, i) => (
              <img key={s.n} src={s.img} alt={s.t} loading="lazy" width={1920} height={1088}
                className="absolute inset-0 h-full w-full rounded-3xl object-cover shadow-soft transition-all duration-700 ease-out"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "rotateY(-6deg) rotateX(3deg) scale(1)" : "rotateY(8deg) scale(0.92)",
                }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 5. Live Brushes */
const BLOOM_COLORS = [color(0), color(4), color(5), color(1)];
function BloomCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const resize = () => { c.width = c.offsetWidth / 2; c.height = c.offsetHeight / 2; };
    resize();
    window.addEventListener("resize", resize);
    const blobs: { x: number; y: number; r: number; life: number; c: string }[] = [];
    let last = 0;
    const move = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < 40) return;
      last = now;
      const rect = c.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      blobs.push({
        x: (e.clientX - rect.left) / 2, y: (e.clientY - rect.top) / 2, r: 4, life: 1,
        c: BLOOM_COLORS[Math.floor(Math.random() * BLOOM_COLORS.length)] ?? color(4),
      });
    };
    window.addEventListener("pointermove", move);
    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.globalCompositeOperation = "multiply";
      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i];
        if (!b) continue;
        b.r += (60 - b.r) * 0.04;
        b.life -= 0.006;
        if (b.life <= 0) { blobs.splice(i, 1); continue; }
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.c + "aa");
        g.addColorStop(0.7, b.c + "55");
        g.addColorStop(1, b.c + "00");
        ctx.globalAlpha = b.life;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full blur-md" aria-hidden />;
}
export function LiveBrushes() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, () => {
    gsap.fromTo(".lb-clip", { clipPath: "inset(28% 30% 28% 30% round 40px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top top", end: "60% bottom", scrub: true },
    });
    gsap.fromTo(".lb-title", { opacity: 0, y: 60 }, {
      opacity: 1, y: 0,
      scrollTrigger: { trigger: ref.current, start: "30% top", end: "60% bottom", scrub: true },
    });
  });
  return (
    <section ref={ref} id="brushes" className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="lb-clip absolute inset-0">
          <img src={liveBrush} alt="Watercolour bloom on textured paper" loading="lazy" width={1920} height={1088}
            className="h-full w-full object-cover" />
          <BloomCanvas />
        </div>
        <div className="lb-title absolute inset-x-0 bottom-[12vh] px-6 text-center">
          <p className="eyebrow">Live brushes</p>
          <h2 className="display mt-4 text-[clamp(3rem,10vw,9rem)]">
            Brushes that <span className="serif-em">breathe.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">Move your cursor — watch the pigment bloom.</p>
        </div>
      </div>
    </section>
  );
}

/* 7. Layers */
const LAYERS = [
  { l: "Light", pos: "0%", y: -90 },
  { l: "Colour", pos: "50%", y: 0 },
  { l: "Sketch", pos: "100%", y: 90 },
];
export function Layers() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, () => {
    gsap.utils.toArray<HTMLElement>(".ly-card").forEach((el, i) => {
      gsap.fromTo(el, { y: 0, rotateX: 0 }, {
        y: LAYERS[i]?.y ?? 0, rotateX: 18, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 70%", end: "center center", scrub: true },
      });
    });
  });
  return (
    <section ref={ref} className="mx-auto max-w-6xl px-6 py-40">
      <Heading eyebrow="Layers">Build depth, <span className="serif-em">layer by layer.</span></Heading>
      <div className="mt-28 flex flex-col items-center [perspective:1400px]">
        {LAYERS.map((ly) => (
          <div key={ly.l} className="ly-card relative w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="aspect-[16/3] w-full bg-no-repeat"
              style={{ backgroundImage: `url(${layersImg})`, backgroundSize: "100% 300%", backgroundPosition: `center ${ly.pos}` }} />
            <span className="glass absolute left-4 top-4 rounded-full border border-border px-3 py-1 text-xs font-medium">{ly.l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 8. Animate (horizontal pinned strip) */
const FRAMES = [f4, f1, f3, f2, f5];
export function Animate() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGsap(ref, () => {
    const t = track.current;
    if (!t || window.innerWidth < 768) return;
    const dist = () => t.scrollWidth - window.innerWidth;
    gsap.to(t, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top top", end: () => "+=" + dist(), pin: true, scrub: true, invalidateOnRefresh: true },
    });
  });
  return (
    <section ref={ref} id="animate" className="relative overflow-x-auto py-24 md:flex md:h-screen md:items-center md:overflow-hidden md:py-0">
      <div ref={track} className="flex w-max items-center gap-6 px-6 md:gap-8 md:px-[6vw]">
        <div className="w-[80vw] shrink-0 md:w-[34vw]">
          <p className="eyebrow">Animate</p>
          <h2 className="display mt-5 text-[clamp(2.6rem,6vw,5.5rem)]">Bring drawings to <span className="serif-em text-spectrum">life.</span></h2>
          <ul className="mt-8 space-y-3 text-muted-foreground">
            {["Frame-by-frame", "Motion paths with a fingertip", "One-tap presets"].map((b) => (
              <li key={b} className="flex items-center gap-3"><BrushMark className="h-3 w-7" />{b}</li>
            ))}
          </ul>
        </div>
        <img src={animateImg} alt="Bird animation onion-skin frames" loading="lazy" width={1920} height={1088}
          className="h-[50vh] w-auto shrink-0 rounded-3xl object-cover shadow-soft md:h-[64vh]" />
        {FRAMES.map((f, i) => (
          <figure key={i} className="relative shrink-0">
            <img src={f} alt={`Animation frame ${i + 1}`} loading="lazy" width={768} height={1024}
              className="h-[50vh] w-auto rounded-2xl border border-border object-cover shadow-soft md:h-[56vh]" />
            <figcaption className="eyebrow mt-3">Frame {String(i + 1).padStart(2, "0")}</figcaption>
          </figure>
        ))}
        <div className="w-[10vw] shrink-0" />
      </div>
    </section>
  );
}

/* 9. Feature grid */
type Feature = { t: string; d: string; img: string };
const FEATURES: Feature[] = [
  { t: "Symmetry", d: "Paint one side, mirror the rest — perfect mandalas in seconds.", img: symmetryImg },
  { t: "Paint Inside", d: "Stay in the lines automatically, no masks required.", img: paintInsideImg },
  { t: "Vector Trim", d: "Snip overlapping vector ends with a single swipe.", img: vectorTrimImg },
  { t: "Motion Presets", d: "Bounce, wiggle, pulse — one tap and it moves.", img: motionImg },
];
function TiltCard({ f }: { f: Feature }) {
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 }), sry = useSpring(ry, { stiffness: 200, damping: 18 });
  return (
    <motion.article
      className="group relative rounded-3xl p-px [perspective:900px]"
      whileHover={{ y: -8 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onPointerLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: srx, rotateY: sry }}
    >
      <div className="absolute inset-0 rounded-3xl bg-border transition-opacity group-hover:opacity-0" />
      <div className="absolute inset-0 rounded-3xl bg-spectrum opacity-0 blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative h-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-card">
        <img src={f.img} alt={f.t} loading="lazy" width={1024} height={1024} className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="p-6">
          <h3 className="display text-2xl">{f.t}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
        </div>
      </div>
    </motion.article>
  );
}
export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-40">
      <Heading eyebrow="Explore features">Small tools. <span className="serif-em">Big magic.</span></Heading>
      <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => <TiltCard key={f.t} f={f} />)}
      </div>
    </section>
  );
}

/* 10. Brush packs */
const PACKS = [
  { t: "Watercolour", c: color(4), n: "Soft washes that bloom and blend" },
  { t: "Oil", c: color(1), n: "Thick, textured strokes" },
  { t: "Ink & Vector", c: color(5), n: "Crisp lines that scale cleanly" },
  { t: "Pastel & Charcoal", c: color(3), n: "Dry, grainy sketching" },
  { t: "Pencil", c: color(0), n: "Light sketches and line work" },
];
export function BrushPacks() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, () => {
    gsap.from(".bp-card", {
      rotateY: -60, rotateZ: -6, y: 80, opacity: 0, stagger: 0.12, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 70%" },
    });
  });
  return (
    <section ref={ref} className="py-40">
      <Heading eyebrow="Brush packs" className="px-6">A lineup for <span className="serif-em">every hand.</span></Heading>
      <div className="mt-20 flex snap-x gap-5 overflow-x-auto px-6 pb-6 [perspective:1200px] md:justify-center">
        {PACKS.map((p, i) => (
          <div key={p.t} className="bp-card relative flex h-80 w-60 shrink-0 snap-center flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft">
            <span className="eyebrow">Pack {String(i + 1).padStart(2, "0")}</span>
            <svg viewBox="0 0 200 80" className="w-full" aria-hidden>
              <path d="M10 55 C 50 5, 90 75, 130 30 S 185 20, 192 40" stroke={p.c} strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.9" />
            </svg>
            <div>
              <h3 className="display text-2xl">{p.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.n}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 12. Finale */
export function Finale() {
  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden">
      <img src={finaleImg} alt="Creative desk with tablet and phone showing artwork" loading="lazy" width={1920} height={1088}
        className="ken-burns absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="relative flex h-full flex-col items-center justify-end px-6 pb-20 text-center">
        <Reveal>
          <h2 className="display text-[clamp(3.2rem,11vw,10rem)]">Creativity is <span className="serif-em text-spectrum">free.</span></h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <DownloadButton size="lg" />
            <a href="#download" className="eyebrow underline-offset-4 hover:underline">How to install</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 13. Download & install */
const INSTALL_STEPS = [
  { t: "Download the APK", d: "Tap the download button on your Android phone or tablet." },
  { t: "Allow the install", d: "If Android asks, allow your browser to install apps. This is normal for apps outside the Play Store." },
  { t: "Open and paint", d: "Open the downloaded file, tap Install, then launch Vero Fresco." },
];
export function Download() {
  return (
    <section id="download" className="mx-auto max-w-6xl px-6 py-40">
      <Heading eyebrow="Download">Get Vero Fresco <span className="serif-em text-spectrum">on Android.</span></Heading>
      <Reveal className="mt-10 flex flex-col items-center gap-3 text-center">
        <DownloadButton size="lg" />
        <p className="text-sm text-muted-foreground">
          {APK_READY ? "Direct download for Android phones and tablets." : "The APK will be available here very soon."}
        </p>
      </Reveal>
      <ol className="mt-20 grid gap-6 md:grid-cols-3">
        {INSTALL_STEPS.map((step, i) => (
          <li key={step.t}>
            <Reveal className="h-full rounded-3xl border border-border bg-card p-8 shadow-soft">
              <span className="font-display text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-3 text-2xl">{step.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.d}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* 14. FAQ */
const FAQS = [
  { q: "Is Vero Fresco free?", a: "Yes. You can download the APK from this page at no cost." },
  { q: "Why isn't it on the Play Store?", a: "For now, Vero Fresco is distributed directly from this website. A Play Store release may come later." },
  { q: "Is it safe to install an APK?", a: "Only download Vero Fresco from this website. Android will ask you to allow installs from your browser — that's the standard prompt for any app installed outside the Play Store." },
  { q: "Which devices does it work on?", a: "Vero Fresco is made for Android phones and tablets." },
  { q: "How do I update?", a: "Download the latest APK from this page and install it over your current version." },
];
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-40">
      <Heading eyebrow="FAQ">Questions, <span className="serif-em">answered.</span></Heading>
      <div className="mt-16 divide-y divide-border border-y border-border">
        {FAQS.map((f, i) => (
          <div key={f.q}>
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-6 py-6 text-left">
              <span className="display text-xl md:text-2xl">{f.q}</span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-2xl text-muted-foreground">+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <p className="pb-6 pr-10 text-muted-foreground">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 15. Footer */
const FOOTER_LINKS: [string, string][] = [
  ["Features", "#features"],
  ["Brushes", "#brushes"],
  ["Animate", "#animate"],
  ["Download", "#download"],
  ["FAQ", "#faq"],
  ["About", "#about"],
];
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="h-px w-full bg-spectrum opacity-70" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row">
        <a href="#top" className="flex items-center gap-2"><BrushMark /><span className="display text-lg">vero fresco</span></a>
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {FOOTER_LINKS.map(([l, h]) => (
            <a key={l} href={h} className="hover:text-foreground">{l}</a>
          ))}
        </nav>
        <p className="text-sm text-muted-foreground">© 2026 Vero Fresco · A product of MIV Apps</p>
      </div>
    </footer>
  );
}
