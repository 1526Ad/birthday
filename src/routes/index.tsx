import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { Instagram, ArrowUpRight, Palette, GraduationCap, Sparkles, Camera, Gamepad2, Utensils, Plane, Brush } from "lucide-react";
import { LoopVideo } from "@/components/LoopVideo";

export const Route = createFileRoute("/")({
  component: Index,
});


const INSTAGRAM = "https://instagram.com/nikkita._02";

const HERO_VIDEO = "https://files.catbox.moe/tcb686.mp4";
const VIDEOS = {
  hero: HERO_VIDEO,
  about: HERO_VIDEO,
  cta: HERO_VIDEO,
};

// ---------- Mobile detection ----------
function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

// ---------- Smooth parallax helpers ----------
function useSmoothScroll() {
  const { scrollY } = useScroll();
  return useSpring(scrollY, { stiffness: 120, damping: 28, mass: 0.35 });
}

// rAF-throttled pointer handler for spotlight hover
function useRafPointer() {
  const raf = useRef(0);
  const pending = useRef<{ el: HTMLElement; x: number; y: number } | null>(null);
  return (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    pending.current = { el, x: e.clientX - r.left, y: e.clientY - r.top };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const p = pending.current;
      if (!p) return;
      p.el.style.setProperty("--mx", `${p.x}px`);
      p.el.style.setProperty("--my", `${p.y}px`);
    });
  };
}

// ---------- Navbar ----------
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const links = [
    { label: "About", href: "#about" },
    { label: "Interests", href: "#stack" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto max-w-6xl px-4 sm:px-6 transition-all duration-500 ${
          scrolled ? "scale-[0.98]" : ""
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-3 ${
            scrolled
              ? "bg-black/60 backdrop-blur-xl border border-white/10"
              : "bg-transparent"
          }`}
        >
          <a href="#" className="flex items-center gap-2 text-cream">
            <span className="font-grotesk uppercase text-base tracking-widest">Nikkita</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon shadow-[0_0_12px_#6FFF00]" />
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-widest text-cream/70 hover:text-neon hover:bg-white/5 transition"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-neon text-[#010828] px-4 sm:px-5 py-2 font-grotesk text-[11px] uppercase tracking-widest hover:scale-[1.03] transition"
          >
            <Instagram size={14} />
            <span>@nikkita._02</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}

// ---------- Hero ----------
function Hero({ y }: { y: MotionValue<number> }) {
  const isMobile = useIsMobile();
  const videoY = useTransform(y, (v) => v * (isMobile ? 0.25 : 0.45));
  const videoScale = useTransform(y, [0, 900], isMobile ? [1.02, 1.12] : [1.05, 1.25]);
  const videoRotate = useTransform(y, [0, 900], isMobile ? [0, 0] : [0, -2]);
  const contentY = useTransform(y, (v) => v * (isMobile ? -0.1 : -0.22));
  const contentOpacity = useTransform(y, [0, 500], [1, 0]);
  const contentScale = useTransform(y, [0, 500], [1, 0.94]);

  const stagger = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    }),
  } satisfies import("framer-motion").Variants;

  const bio = "I'm Nikkita — an artist who sketches quiet worlds, chases sunsets, plays hard and cooks softer.";

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      <motion.div
        style={{ y: videoY, scale: videoScale, rotate: videoRotate }}
        className="absolute inset-0 will-change-transform"
      >
        <LoopVideo src={VIDEOS.hero} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#010828]/40 to-[#010828]" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-36 sm:pt-44 pb-24 text-center flex flex-col items-center"
      >
        <motion.div
          variants={stagger}
          custom={0}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-cream/80"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
          Artist · Dreamer · 2026
        </motion.div>

        <motion.h1
          variants={stagger}
          custom={1}
          initial="hidden"
          animate="show"
          className="mt-8 font-grotesk uppercase text-cream text-[38px] sm:text-[72px] md:text-[96px] lg:text-[112px] leading-[0.92] tracking-[-0.02em] max-w-5xl"
        >
          Nikkita<br />
          <span className="font-condiment normal-case text-neon mix-exclusion -tracking-normal">
            sketching
          </span>{" "}
          quiet worlds
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.025, delayChildren: 0.5 }}
          className="mt-7 font-mono text-[11px] sm:text-sm uppercase text-cream/70 max-w-xl leading-relaxed flex flex-wrap justify-center gap-x-[0.35em] gap-y-1 px-2"
        >
          {bio.split(" ").map((w, i) => {
            const hot = ["Nikkita", "sketches", "sunsets,", "cooks"].includes(w);
            return (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
                className={hot ? "text-neon" : ""}
              >
                {w}
              </motion.span>
            );
          })}
        </motion.p>

        <motion.div
          variants={stagger}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#about"
            className="inline-flex items-center gap-2 bg-neon text-[#010828] font-grotesk uppercase text-xs sm:text-sm tracking-widest rounded-full px-6 sm:px-7 py-3.5 hover:scale-[1.03] transition"
          >
            About me <ArrowUpRight size={16} />
          </a>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-6 sm:px-7 py-3.5 font-grotesk uppercase text-xs sm:text-sm tracking-widest text-cream hover:text-neon transition"
          >
            <Instagram size={14} /> @nikkita._02
          </a>
        </motion.div>

        <motion.div
          variants={stagger}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-20 sm:mt-24 w-full max-w-3xl"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40 mb-5">
            A few of my loves
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-3 font-grotesk uppercase text-sm sm:text-base text-cream/40">
            {["Sketching", "Cooking", "Travel", "Gaming", "Makeup", "Photography"].map(
              (t) => (
                <span key={t} className="hover:text-cream transition-colors">
                  {t}
                </span>
              ),
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-cream/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ---------- About ----------
function About({ y }: { y: MotionValue<number> }) {
  const isMobile = useIsMobile();
  const videoY = useTransform(y, [400, 2000], isMobile ? [80, -80] : [200, -200]);
  const videoScale = useTransform(y, [400, 2000], isMobile ? [1.1, 1] : [1.2, 1]);
  const videoRotate = useTransform(y, [400, 2000], isMobile ? [0, 0] : [2, -2]);
  const headingY = useTransform(y, [400, 1600], isMobile ? [30, -15] : [80, -40]);
  const onMove = useRafPointer();

  const intro = "I'm Nikkita Kashyap — an artist, a graduate, and a quiet overthinker who finds calm in a sketchbook.";
  const words = intro.split(" ");

  const pillars = [
    { icon: Palette, k: "Art & Sketching", v: "Pencil, ink, portraits — a language for feelings I can't quite say." },
    { icon: GraduationCap, k: "Graduate", v: "Curious mind, still learning. School ended, growing didn't." },
    { icon: Sparkles, k: "Introvert · Overthinker", v: "Small circle, loud thoughts, soft heart. Recharging beats crowds." },
  ];

  return (
    <section id="about" className="relative w-full overflow-hidden py-24 sm:py-44">
      <motion.div
        style={{ y: videoY, scale: videoScale, rotate: videoRotate }}
        className="absolute inset-0 -top-32 -bottom-32 will-change-transform"
      >
        <LoopVideo src={VIDEOS.about} className="w-full h-full opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010828] via-[#010828]/70 to-[#010828]" />
      </motion.div>

      <motion.div style={{ y: headingY }} className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-neon mb-6"
        >
          01 — About
        </motion.p>

        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ staggerChildren: 0.04 }}
          className="font-grotesk uppercase text-cream text-[28px] sm:text-[52px] lg:text-[68px] leading-[1.05] max-w-5xl flex flex-wrap gap-x-[0.28em] gap-y-1"
        >
          {words.map((w, i) => {
            const accent = ["Nikkita", "Kashyap", "artist,", "overthinker", "sketchbook."].includes(w);
            return (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
                  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
                className={accent ? "text-neon" : ""}
              >
                {w}
              </motion.span>
            );
          })}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mt-12 sm:mt-20">
          {pillars.map((p, i) => (
            <motion.div
              key={p.k}
              onMouseMove={onMove}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
              className="glass-card rounded-3xl p-6 sm:p-8"
            >
              <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neon">
                <p.icon size={18} />
              </div>
              <div className="font-grotesk uppercase text-cream text-xl sm:text-2xl mt-5">{p.k}</div>
              <div className="font-mono text-[12px] sm:text-[13px] text-cream/60 mt-2 leading-relaxed">{p.v}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ---------- Interests ----------
function Stack({ y }: { y: MotionValue<number> }) {
  const isMobile = useIsMobile();
  const headingY = useTransform(y, [1600, 3200], isMobile ? [20, -20] : [60, -60]);
  const blobY = useTransform(y, [1600, 3400], isMobile ? [-30, 30] : [-80, 80]);
  const blobRotate = useTransform(y, [1600, 3400], [-15, 15]);
  const onMove = useRafPointer();

  const items = [
    {
      icon: Utensils,
      title: "Cooking",
      desc: "Slow kitchens, warm spices, feeding the people I love — my favorite kind of art.",
      tags: ["Home chef", "Baking", "Comfort food"],
    },
    {
      icon: Plane,
      title: "Travelling",
      desc: "Wandering new streets, chasing skies, collecting cities like polaroids in my head.",
      tags: ["Wander", "Mountains", "Sunsets"],
    },
    {
      icon: Gamepad2,
      title: "Gaming",
      desc: "Cozy nights, open worlds, quiet victories. My favorite escape after a long day.",
      tags: ["Chill", "Story", "Adventure"],
    },
    {
      icon: Brush,
      title: "Self Makeup",
      desc: "Face as a canvas — sometimes soft glam, sometimes bold. Always a mood.",
      tags: ["Glam", "Everyday", "Mood"],
    },
    {
      icon: Camera,
      title: "Photography",
      desc: "Framing tiny moments — light on a wall, a stranger's laugh, the sky at 7 PM.",
      tags: ["Portrait", "Street", "Golden hour"],
    },
    {
      icon: Palette,
      title: "Art Sketching",
      desc: "The one I always come back to. Pencils, patience, and pieces of a quiet mind.",
      tags: ["Pencil", "Ink", "Portrait"],
    },
  ];

  const marquee = ["Overthinker", "Introvert", "Artist", "Dreamer", "Soft-hearted", "Curious"];

  return (
    <section id="stack" className="relative bg-space py-24 sm:py-40 overflow-hidden">
      <motion.div
        style={{ y: blobY, rotate: blobRotate }}
        className="pointer-events-none absolute -right-32 top-20 w-[520px] h-[520px] rounded-full bg-neon/10 blur-[120px]"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div style={{ y: headingY }} className="mb-14 sm:mb-20">
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-neon mb-5">
            02 — Interests
          </p>
          <h2 className="font-grotesk uppercase text-cream text-[32px] sm:text-[56px] lg:text-[80px] leading-[0.95] max-w-3xl">
            Little things,{" "}
            <span className="font-condiment normal-case text-neon mix-exclusion">
              big joys
            </span>
            .
          </h2>
          <p className="mt-6 font-mono text-[12px] sm:text-sm uppercase tracking-widest text-cream/50 max-w-xl">
            The tiny universes I run into whenever real life gets too loud.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
          {items.map((it, i) => (
            <motion.article
              key={it.title}
              onMouseMove={onMove}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
              className="glass-card rounded-3xl p-6 sm:p-9 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neon group-hover:bg-neon/10 group-hover:border-neon/30 transition-colors">
                  <it.icon size={20} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-grotesk uppercase text-cream text-xl sm:text-3xl mt-5 sm:mt-7">
                {it.title}
              </h3>
              <p className="font-mono text-[12px] sm:text-[13px] leading-relaxed text-cream/60 mt-3">
                {it.desc}
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-5 sm:mt-7">
                {it.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-cream/70 border border-white/10 rounded-full px-2.5 sm:px-3 py-1 bg-white/[0.02]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 sm:mt-24 relative overflow-hidden border-y border-white/10 py-5">
          <div className="marquee font-grotesk uppercase text-cream/70 text-2xl sm:text-4xl tracking-wide">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="flex items-center gap-16">
                {m}
                <span className="w-2 h-2 rounded-full bg-neon" />
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#010828] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#010828] to-transparent" />
        </div>
      </div>
    </section>
  );
}

// ---------- Contact ----------
function Contact({ y }: { y: MotionValue<number> }) {
  const isMobile = useIsMobile();
  const videoY = useTransform(y, [2200, 4500], isMobile ? [70, -70] : [180, -180]);
  const videoScale = useTransform(y, [2200, 4500], isMobile ? [1.1, 1] : [1.25, 1]);
  const videoRotate = useTransform(y, [2200, 4500], isMobile ? [0, 0] : [-2, 2]);

  return (
    <section id="contact" className="relative w-full overflow-hidden py-32 sm:py-44">
      <motion.div
        style={{ y: videoY, scale: videoScale, rotate: videoRotate }}
        className="absolute inset-0 -top-32 -bottom-32 will-change-transform"
      >
        <LoopVideo src={VIDEOS.cta} className="w-full h-full opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010828] via-[#010828]/50 to-[#010828]" />
      </motion.div>

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-condiment text-neon text-3xl sm:text-5xl mix-exclusion -rotate-2"
        >
          say hi
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
          className="font-grotesk uppercase text-cream text-[40px] sm:text-[72px] lg:text-[96px] leading-[0.95] mt-4"
        >
          Let's be<br />internet friends.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-[12px] sm:text-sm uppercase text-cream/60 mt-8 max-w-xl mx-auto leading-relaxed"
        >
          Slide into my DMs — sketches, sunsets, movie recs, or just a soft hello. I read everything.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-neon text-[#010828] font-grotesk uppercase text-xs sm:text-sm tracking-widest rounded-full px-7 py-4 hover:scale-[1.03] transition"
          >
            <Instagram size={16} /> @nikkita._02
          </a>
        </motion.div>

      </div>
    </section>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="bg-space border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="font-grotesk uppercase text-cream/80 tracking-widest text-sm">
          Nikkita Kashyap<span className="text-neon">.</span> · Artist
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
          © {new Date().getFullYear()} · Sketched softly, shipped quietly.
        </div>
      </div>
    </footer>
  );
}

// ---------- Page ----------
function Index() {
  const smoothY = useSmoothScroll();
  const containerRef = useRef<HTMLElement>(null);

  return (
    <main ref={containerRef} className="relative bg-space text-cream overflow-x-hidden">
      <div className="texture-overlay" aria-hidden />
      <Navbar />
      <Hero y={smoothY} />
      <About y={smoothY} />
      <Stack y={smoothY} />
      <Contact y={smoothY} />
      <Footer />
    </main>
  );
}
