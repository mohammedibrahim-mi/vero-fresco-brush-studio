import { motion } from "framer-motion";
import founderPhoto from "@/assets/founder.jpg";

/* ── Edit these two values ─────────────────────────────── */
const FOUNDER_LINKEDIN_URL = "https://www.linkedin.com/in/mohammed-ibrahim-a059b914a";
const FOUNDER_PHOTO: string = founderPhoto;
/* ──────────────────────────────────────────────────────── */

function LinkedinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function About() {
  const headline = ["Made", "by"];
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-40">
      <div className="text-center">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          About us
        </motion.p>
        <h2 className="display mx-auto mt-5 max-w-5xl text-[clamp(2.6rem,7vw,6rem)]">
          {headline.map((w, i) => (
            <motion.span
              key={w}
              className="inline-block pr-[0.25em]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease }}
            >
              {w}
            </motion.span>
          ))}
          <motion.span
            className="serif-em text-spectrum inline-block"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            MIV Apps
          </motion.span>
        </h2>
        <motion.p
          className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
        >
          MIV Apps is an independent studio building creative, beautifully crafted apps for Android.
          Vero Fresco is our love letter to artists — a pro-grade painting and drawing studio we
          believe should be free for everyone.
        </motion.p>
      </div>

      <div className="mt-20 flex justify-center [perspective:1200px]">
        <motion.article
          className="group relative w-full max-w-xl rounded-3xl p-px"
          initial={{ opacity: 0, y: 80, rotateX: 18 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.1, ease }}
          whileHover={{ y: -8 }}
        >
          <div className="absolute inset-0 rounded-3xl bg-border transition-opacity group-hover:opacity-0" />
          <div className="absolute inset-0 rounded-3xl bg-spectrum opacity-0 blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative flex flex-col items-center gap-6 rounded-[calc(1.5rem-1px)] bg-card p-10 text-center shadow-soft sm:flex-row sm:text-left">
            <div className="shrink-0 rounded-full bg-spectrum p-[3px]">
              {FOUNDER_PHOTO ? (
                <img src={FOUNDER_PHOTO} alt="Mohammed Ibrahim" width={480} height={480} loading="lazy" className="h-28 w-28 rounded-full border-4 border-card object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-card">
                  <span className="display text-3xl">MI</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="display text-2xl md:text-3xl">Mohammed Ibrahim</h3>
              <p className="eyebrow mt-2">Founder &amp; Developer, MIV Apps</p>
              <p className="mt-4 text-muted-foreground">
                Building tools that put creativity in everyone's pocket.
              </p>
              <a
                href={FOUNDER_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:shadow-glow"
              >
                <LinkedinIcon className="h-4 w-4" />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
