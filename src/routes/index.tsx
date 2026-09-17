import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { Sparkles, PartyPopper, Cake, Heart, MessageSquare } from "lucide-react";
import { LoopVideo } from "@/components/LoopVideo";
import { ConfettiCanvas, triggerBirthdayCelebration } from "@/components/birthday/ConfettiCannon";
import { VirtualCake } from "@/components/birthday/VirtualCake";
import { WishWall } from "@/components/birthday/WishWall";
import { BirthdayAudioPlayer } from "@/components/birthday/BirthdayAudioPlayer";

export const Route = createFileRoute("/")({
  component: Index,
});

const HERO_VIDEO = "/media/nikkita-hero.mp4";
const VIDEO_POSTER = "/media/nikkita-poster.jpg";

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
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  const smooth = useSpring(scrollY, { stiffness: 200, damping: 30, mass: 0.2 });
  return isMobile ? scrollY : smooth;
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
    { label: "Home", href: "#home" },
    { label: "Virtual Cake", href: "#cake" },
    { label: "Guestbook", href: "#guestbook" },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2.5 sm:py-3" : "py-4 sm:py-5"
      }`}
    >
      <div
        className={`mx-auto max-w-6xl px-4 sm:px-6 transition-all duration-500 ${
          scrolled ? "scale-[0.98]" : ""
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-2.5 sm:py-3 ${
            scrolled
              ? "bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl"
              : "bg-transparent"
          }`}
        >
          <a href="#home" className="flex items-center gap-2 text-cream group">
            <span className="font-grotesk uppercase text-base tracking-widest group-hover:text-neon transition">
              Khushi
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon shadow-[0_0_12px_#6FFF00] animate-ping" />
            <span className="font-condiment text-xs text-neon normal-case hidden sm:inline ml-1">
              birthday edition
            </span>
          </a>

          <nav className="hidden sm:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest text-cream/70 hover:text-neon hover:bg-white/5 transition"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerBirthdayCelebration()}
              className="inline-flex items-center gap-1.5 rounded-full bg-neon text-[#010828] px-4 py-1.5 font-grotesk text-[10px] sm:text-[11px] uppercase tracking-widest transition hover:scale-105 font-bold shadow-[0_0_15px_rgba(111,255,0,0.3)]"
              title="Celebrate with Confetti"
            >
              <PartyPopper size={13} />
              <span>Celebrate</span>
            </button>
          </div>
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

  const bio =
    "Happy Birthday to Khushi — celebrating another wonderful chapter filled with smiles, laughter, warm moments, and endless happiness.";

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      <motion.div
        style={{ y: videoY, scale: videoScale, rotate: videoRotate }}
        className="absolute inset-0 will-change-transform"
      >
        <LoopVideo src={HERO_VIDEO} poster={VIDEO_POSTER} className="w-full h-full" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#010828]/50 to-[#010828]" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-36 sm:pt-44 pb-28 text-center flex flex-col items-center"
      >
        {/* Birthday Edition Tag */}
        <motion.div
          variants={stagger}
          custom={0}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-cream/90 border border-neon/30"
        >
          <Sparkles size={12} className="text-neon animate-pulse" />
          <span>Special Birthday Celebration · 2026</span>
        </motion.div>

        {/* Main Birthday Headline */}
        <motion.h1
          variants={stagger}
          custom={1}
          initial="hidden"
          animate="show"
          className="mt-7 font-grotesk uppercase text-cream text-[38px] sm:text-[70px] md:text-[92px] lg:text-[108px] leading-[0.92] tracking-[-0.02em] max-w-5xl"
        >
          HAPPY BIRTHDAY
          <br />
          <span className="font-condiment normal-case text-neon mix-exclusion -tracking-normal">
            Khushi
          </span>
        </motion.h1>

        {/* Cursive Subtitle */}
        <motion.p
          variants={stagger}
          custom={2}
          initial="hidden"
          animate="show"
          className="font-serif-display italic text-cream/80 text-xl sm:text-2xl md:text-3xl mt-2 tracking-wide"
        >
          celebrating another gorgeous year of joy & dreams
        </motion.p>

        {/* Word-by-word Animated Bio */}
        <motion.p
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.025, delayChildren: 0.5 }}
          className="mt-6 font-mono text-[11px] sm:text-sm uppercase text-cream/70 max-w-xl leading-relaxed flex flex-wrap justify-center gap-x-[0.35em] gap-y-1 px-2"
        >
          {bio.split(" ").map((w, i) => {
            const hot = [
              "Happy",
              "Birthday",
              "Khushi",
              "smiles,",
              "laughter,",
              "happiness.",
            ].includes(w);
            return (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className={hot ? "text-neon font-bold" : ""}
              >
                {w}
              </motion.span>
            );
          })}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={stagger}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center justify-center gap-3.5"
        >
          <a
            href="#cake"
            className="inline-flex items-center gap-2 bg-neon text-[#010828] font-grotesk uppercase text-xs sm:text-sm tracking-widest rounded-full px-6 sm:px-7 py-3.5 hover:scale-105 active:scale-95 transition shadow-[0_0_25px_rgba(111,255,0,0.3)] font-semibold"
          >
            <Cake size={16} /> Blow Candles
          </a>

          <button
            onClick={() => triggerBirthdayCelebration()}
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-6 sm:px-7 py-3.5 font-grotesk uppercase text-xs sm:text-sm tracking-widest text-cream hover:text-neon hover:border-neon/40 transition"
          >
            <PartyPopper size={16} className="text-neon" /> Celebrate
          </button>

          <a
            href="#guestbook"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-6 sm:px-7 py-3.5 font-grotesk uppercase text-xs sm:text-sm tracking-widest text-cream hover:text-neon transition"
          >
            <MessageSquare size={15} className="text-neon" /> Leave A Wish
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="bg-space border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-grotesk uppercase text-cream/80 tracking-widest text-sm flex items-center gap-2">
          <span>Happy Birthday Khushi</span>
          <span className="w-1 h-1 rounded-full bg-neon" />
          <span className="text-neon">2026</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
          Made With Love For Khushi
        </div>
      </div>
    </footer>
  );
}

// ---------- Page ----------
function Index() {
  const smoothY = useSmoothScroll();
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const noMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, button, a")) return;
      e.preventDefault();
    };
    const noCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea")) return;
      e.preventDefault();
    };
    const noKeys = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea")) return;
      const k = e.key.toLowerCase();
      if (e.key === "F12") return e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && ["u", "s", "c", "a", "p"].includes(k))
        return e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(k))
        return e.preventDefault();
    };

    document.addEventListener("contextmenu", noMenu);
    document.addEventListener("copy", noCopy);
    document.addEventListener("cut", noCopy);
    document.addEventListener("keydown", noKeys);
    return () => {
      document.removeEventListener("contextmenu", noMenu);
      document.removeEventListener("copy", noCopy);
      document.removeEventListener("cut", noCopy);
      document.removeEventListener("keydown", noKeys);
    };
  }, []);

  return (
    <main ref={containerRef} className="relative bg-space text-cream overflow-x-hidden">
      <div className="texture-overlay" aria-hidden />
      <ConfettiCanvas />
      <BirthdayAudioPlayer />
      <Navbar />
      <Hero y={smoothY} />
      <VirtualCake />
      <WishWall />
      <Footer />
    </main>
  );
}
