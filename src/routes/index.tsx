import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send, Github, Twitter, ArrowRight } from "lucide-react";
import { LoopVideo } from "@/components/LoopVideo";
import { useScrollY } from "@/hooks/useParallax";

export const Route = createFileRoute("/")({
  component: Index,
});

const VIDEOS = {
  hero: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4",
  about: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4",
  cinema: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4",
  cta: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4",
  work1: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4",
  work2: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4",
  work3: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4",
};

const TELEGRAM = "https://t.me/Darkbhaifan";

function SocialStack({ className = "" }: { className?: string }) {
  const items = [
    { href: TELEGRAM, icon: Send, label: "Telegram" },
    { href: "mailto:hello@rahul.dev", icon: Mail, label: "Email" },
    { href: "https://github.com", icon: Github, label: "GitHub" },
  ];
  return (
    <div className={`liquid-glass rounded-2xl flex flex-col ${className}`}>
      {items.map((it, i) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noreferrer"
          aria-label={it.label}
          className={`flex items-center justify-center w-14 h-14 transition hover:bg-white/10 ${
            i < items.length - 1 ? "border-b border-white/10" : ""
          }`}
        >
          <it.icon size={20} className="text-cream" />
        </a>
      ))}
    </div>
  );
}

function Nav() {
  const links = ["Home", "Work", "About", "Journal", "Contact"];
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-5 sm:px-8 pt-6 flex items-center justify-between max-w-[1831px] mx-auto">
      <div className="font-grotesk text-[15px] sm:text-base uppercase tracking-wider text-cream">
        Rahul<span className="text-neon">.</span>Studio
      </div>
      <nav className="hidden lg:block liquid-glass rounded-[28px] px-[52px] py-[18px]">
        <ul className="flex items-center gap-10">
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className="font-grotesk text-[13px] uppercase tracking-widest text-cream hover:text-neon transition-colors"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a
        href={TELEGRAM}
        target="_blank"
        rel="noreferrer"
        className="hidden sm:inline-flex liquid-glass rounded-full px-5 py-2.5 font-grotesk text-[12px] uppercase tracking-widest text-cream hover:text-neon transition"
      >
        Let's talk
      </a>
    </header>
  );
}

function Hero() {
  const y = useScrollY();
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden rounded-b-[32px]">
      {/* Parallax video */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${y * 0.35}px, 0) scale(${1 + y * 0.0003})` }}
      >
        <LoopVideo src={VIDEOS.hero} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010828]/40 via-transparent to-[#010828]" />
      </div>

      <Nav />

      <div className="relative z-10 max-w-[1831px] mx-auto px-5 sm:px-8 pt-40 sm:pt-48 lg:pt-56 pb-24">
        <div className="relative max-w-[820px] lg:ml-24">
          <h1 className="font-grotesk uppercase text-cream text-[44px] sm:text-[64px] md:text-[80px] lg:text-[96px] leading-[0.95] tracking-tight animate-fade-rise">
            Beyond pixels<br />
            <span className="opacity-90">i build the</span> eternal
          </h1>
          <span className="absolute -top-6 right-0 sm:right-6 lg:-right-10 font-condiment text-neon text-[28px] sm:text-[40px] lg:text-[56px] mix-exclusion opacity-90 -rotate-[4deg] animate-fade-rise-delay">
            portfolio
          </span>
        </div>

        <p className="font-mono text-[13px] sm:text-[14px] uppercase text-cream/80 mt-10 max-w-md leading-relaxed animate-fade-rise-delay">
          I'm <span className="text-neon">Rahul</span> — a designer & maker
          crafting cinematic interfaces, brand systems, and quiet digital worlds.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4 animate-fade-rise-delay-2">
          <a
            href="#work"
            className="inline-flex items-center gap-2 bg-neon text-[#010828] font-grotesk uppercase text-sm tracking-widest rounded-full px-8 py-4 hover:scale-[1.03] transition"
          >
            See the work <ArrowRight size={16} />
          </a>
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="liquid-glass rounded-full px-8 py-4 font-grotesk uppercase text-sm tracking-widest text-cream hover:text-neon transition"
          >
            Telegram →
          </a>
        </div>
      </div>

      {/* Desktop social stack */}
      <div className="hidden lg:block absolute top-32 right-8 z-20">
        <SocialStack />
      </div>
    </section>
  );
}

function About() {
  const y = useScrollY();
  return (
    <section id="about" className="relative w-full overflow-hidden rounded-[32px] mt-6">
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${(y - 600) * 0.15}px, 0)` }}
      >
        <LoopVideo src={VIDEOS.about} className="w-full h-full" />
        <div className="absolute inset-0 bg-[#010828]/40" />
      </div>

      <div className="relative max-w-[1831px] mx-auto px-5 sm:px-8 py-20 sm:py-28 lg:py-36">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          <div className="relative">
            <h2 className="font-grotesk uppercase text-cream text-[40px] sm:text-[54px] lg:text-[68px] leading-[1]">
              Hello!<br />I'm Rahul
            </h2>
            <span className="absolute -bottom-4 right-0 sm:-right-8 font-condiment text-neon text-[42px] sm:text-[58px] mix-exclusion -rotate-[6deg]">
              Rahul
            </span>
          </div>
          <p className="font-mono text-[13px] sm:text-[15px] uppercase text-cream max-w-md leading-relaxed">
            A maker fixed somewhere between code and craft. Exploring distance,
            form, and silence — building digital havens for deep work and
            pure flows.
          </p>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { k: "06", v: "Years crafting" },
            { k: "40+", v: "Shipped projects" },
            { k: "12", v: "Awwwards / mentions" },
          ].map((s) => (
            <div key={s.k} className="liquid-glass rounded-[24px] p-8">
              <div className="font-grotesk text-cream text-[44px] sm:text-[56px] leading-none">
                {s.k}
              </div>
              <div className="font-mono text-[12px] uppercase text-cream/70 mt-3">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  const items = [
    { src: VIDEOS.work1, title: "Aethera UI", score: "8.7" },
    { src: VIDEOS.work2, title: "Orbis Brand", score: "9.0" },
    { src: VIDEOS.work3, title: "Signal OS", score: "8.2" },
  ];
  return (
    <section id="work" className="relative bg-space mt-6 rounded-[32px]">
      <div className="max-w-[1831px] mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 mb-16">
          <h2 className="font-grotesk uppercase text-cream text-[40px] sm:text-[54px] lg:text-[68px] leading-[1]">
            Collection of<br />
            <span className="block ml-12 sm:ml-20 lg:ml-32">
              <span className="font-condiment text-neon normal-case mix-exclusion">Space</span> objects
            </span>
          </h2>
          <a href="#contact" className="group inline-block">
            <div className="flex items-end gap-3">
              <span className="font-grotesk uppercase text-cream text-[36px] sm:text-[52px] leading-none group-hover:text-neon transition">See</span>
              <div className="flex flex-col font-grotesk uppercase text-cream text-[18px] sm:text-[28px] leading-none">
                <span>All</span>
                <span>Projects</span>
              </div>
            </div>
            <div className="bg-neon h-[6px] sm:h-[8px] w-full mt-3 group-hover:h-[12px] transition-all" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <article key={it.title} className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/[0.04] transition group">
              <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden">
                <LoopVideo
                  src={it.src}
                  className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="liquid-glass rounded-[20px] mt-4 px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[11px] uppercase text-cream/70">Rarity score</div>
                  <div className="font-grotesk text-cream text-base mt-1">
                    {it.title} · {it.score}/10
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Open ${it.title}`}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] shadow-lg shadow-purple-500/40 flex items-center justify-center text-cream hover:scale-110 transition"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cinema() {
  const y = useScrollY();
  return (
    <section className="relative w-full overflow-hidden h-[70vh] sm:h-[90vh] mt-6 rounded-[32px]">
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${(y - 2200) * 0.2}px, 0)` }}
      >
        <LoopVideo src={VIDEOS.cinema} fade className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010828] via-transparent to-[#010828]" />
      </div>
      <div className="relative z-10 max-w-[1100px] mx-auto h-full flex flex-col items-center justify-center text-center px-6">
        <p className="font-condiment text-neon text-2xl sm:text-4xl mix-exclusion -rotate-2 mb-6">
          a quiet philosophy
        </p>
        <h3 className="font-serif-display text-cream text-4xl sm:text-6xl md:text-7xl leading-[0.95] tracking-[-0.02em]">
          Beyond <em className="text-cream/60">silence,</em> we build
          <br />
          <em className="text-cream/60">the eternal.</em>
        </h3>
        <p className="font-mono text-[13px] sm:text-sm uppercase text-cream/70 mt-8 max-w-xl leading-relaxed">
          Building platforms for brilliant minds, fearless makers, and thoughtful souls.
          Through the noise, we craft digital havens for deep work and pure flows.
        </p>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="relative w-full overflow-hidden mt-6 rounded-[32px] bg-space">
      <div className="relative">
        <LoopVideo src={VIDEOS.cta} className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#010828] via-[#010828]/40 to-transparent" />
      </div>

      <div className="absolute inset-0 z-10 max-w-[1831px] mx-auto px-6 sm:px-10 lg:pr-[18%] lg:pl-[12%] flex flex-col justify-center items-end text-right">
        <div className="relative">
          <span className="absolute -top-6 sm:-top-10 -left-6 sm:-left-16 font-condiment text-neon text-2xl sm:text-5xl mix-exclusion -rotate-3">
            Go beyond
          </span>
          <h2 className="font-grotesk uppercase text-cream text-[28px] sm:text-[44px] md:text-[56px] leading-[1]">
            <span className="block mb-3 sm:mb-6">Let's build</span>
            something<br />
            quiet, fast,<br />
            <span className="text-neon">and eternal.</span>
          </h2>
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 bg-neon text-[#010828] font-grotesk uppercase text-xs sm:text-sm tracking-widest rounded-full px-6 sm:px-8 py-3 sm:py-4 hover:scale-[1.03] transition"
          >
            Message on Telegram <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className="absolute left-[6%] bottom-[10%] sm:bottom-[14%] z-10">
        <SocialStack />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="max-w-[1831px] mx-auto px-5 sm:px-8 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="font-grotesk uppercase text-cream tracking-wider">
        Rahul<span className="text-neon">.</span>Studio · © {new Date().getFullYear()}
      </div>
      <div className="flex items-center gap-4 font-mono text-[11px] uppercase text-cream/60">
        <a href={TELEGRAM} target="_blank" rel="noreferrer" className="hover:text-neon">Telegram</a>
        <span>·</span>
        <a href="mailto:hello@rahul.dev" className="hover:text-neon">Email</a>
        <span>·</span>
        <span>Built quietly</span>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="relative bg-space min-h-screen text-cream overflow-x-hidden">
      <div className="texture-overlay" aria-hidden />
      <Hero />
      <About />
      <Work />
      <Cinema />
      <CTA />
      <Footer />
    </main>
  );
}
