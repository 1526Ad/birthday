import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, PartyPopper, Cake } from "lucide-react";
import { triggerBirthdayCelebration } from "./ConfettiCannon";

// Web Audio API harmonic chime for candle blow-out
function playWishChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Pentatonic celebratory ascending chords
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 1.25);
    });
  } catch {
    // AudioContext blocked or unsupported
  }
}

export function VirtualCake() {
  const [blown, setBlown] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const cakeRef = useRef<HTMLDivElement>(null);

  const handleBlowCandles = () => {
    if (blown) return;
    setBlown(true);
    setWishCount((prev) => prev + 1);
    playWishChime();

    if (cakeRef.current) {
      const rect = cakeRef.current.getBoundingClientRect();
      triggerBirthdayCelebration(rect.left + rect.width / 2, rect.top + 60);
    } else {
      triggerBirthdayCelebration();
    }
  };

  const handleRelight = () => {
    setBlown(false);
  };

  return (
    <section id="cake" className="relative w-full py-28 sm:py-36 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon/10 blur-[150px] -z-10" />

      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-neon mb-4"
          >
            <Sparkles size={13} className="animate-spin text-neon" />
            Make A Birthday Wish
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-grotesk uppercase text-cream text-[32px] sm:text-[56px] lg:text-[72px] leading-tight"
          >
            Blow the{" "}
            <span className="font-condiment normal-case text-neon mix-exclusion">Candles</span>
          </motion.h2>

          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cream/60 max-w-md mx-auto mt-3">
            Close your eyes, make your deepest wish, and tap the candles or the button below!
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          {/* Cake Interactive Container */}
          <div
            ref={cakeRef}
            onClick={handleBlowCandles}
            className={`relative cursor-pointer select-none transition-transform duration-300 ${
              !blown ? "hover:scale-105" : ""
            }`}
            title={blown ? "Wish has been made!" : "Click to blow out candles!"}
          >
            <svg
              className="w-72 sm:w-96 h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              viewBox="0 0 400 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Neon Cake Gradients */}
                <linearGradient id="cakeTier1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#131C42" />
                  <stop offset="50%" stopColor="#0B1333" />
                  <stop offset="100%" stopColor="#060C24" />
                </linearGradient>
                <linearGradient id="cakeTier2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E2A5E" />
                  <stop offset="50%" stopColor="#111B3E" />
                  <stop offset="100%" stopColor="#0B1333" />
                </linearGradient>
                <linearGradient id="icingNeon" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6FFF00" />
                  <stop offset="50%" stopColor="#A6FF54" />
                  <stop offset="100%" stopColor="#6FFF00" />
                </linearGradient>
                <linearGradient id="candleGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF69B4" />
                  <stop offset="100%" stopColor="#FFB6C1" />
                </linearGradient>
                <linearGradient id="candleGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6FFF00" />
                  <stop offset="100%" stopColor="#D4FF99" />
                </linearGradient>
                <linearGradient id="candleGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFF2A3" />
                </linearGradient>
                <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Cake Stand */}
              <ellipse cx="200" cy="290" rx="140" ry="16" fill="rgba(255,255,255,0.06)" />
              <path
                d="M175 285 L180 305 L220 305 L225 285 Z"
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
              />
              <rect x="150" y="305" width="100" height="6" rx="3" fill="#6FFF00" opacity="0.6" />

              {/* Bottom Tier */}
              <rect
                x="85"
                y="195"
                width="230"
                height="80"
                rx="18"
                fill="url(#cakeTier1)"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
              />
              {/* Bottom Tier Icing Drippings */}
              <path
                d="M85 208 C105 220, 115 198, 135 214 C155 226, 170 200, 195 218 C215 228, 235 200, 255 216 C275 228, 295 202, 315 208"
                fill="none"
                stroke="url(#icingNeon)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="120" cy="240" r="3" fill="#6FFF00" opacity="0.8" />
              <circle cx="160" cy="250" r="2.5" fill="#FFD700" opacity="0.8" />
              <circle cx="200" cy="245" r="3" fill="#FF69B4" opacity="0.8" />
              <circle cx="240" cy="252" r="2.5" fill="#00FFFF" opacity="0.8" />
              <circle cx="280" cy="240" r="3" fill="#6FFF00" opacity="0.8" />

              {/* Top Tier */}
              <rect
                x="125"
                y="130"
                width="150"
                height="70"
                rx="14"
                fill="url(#cakeTier2)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              {/* Top Tier Icing */}
              <path
                d="M125 140 C145 152, 160 135, 175 148 C195 158, 210 135, 225 146 C245 154, 260 138, 275 140"
                fill="none"
                stroke="url(#icingNeon)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="150" cy="170" r="2.5" fill="#FFD700" opacity="0.9" />
              <circle cx="200" cy="175" r="3" fill="#6FFF00" opacity="0.9" />
              <circle cx="250" cy="168" r="2.5" fill="#FF69B4" opacity="0.9" />

              {/* Candle 1 (Left) */}
              <rect x="155" y="85" width="10" height="48" rx="3" fill="url(#candleGrad1)" />
              <line x1="160" y1="85" x2="160" y2="76" stroke="#FFFFFF" strokeWidth="2" />

              {/* Candle 2 (Center) */}
              <rect x="195" y="75" width="10" height="58" rx="3" fill="url(#candleGrad2)" />
              <line x1="200" y1="75" x2="200" y2="66" stroke="#FFFFFF" strokeWidth="2" />

              {/* Candle 3 (Right) */}
              <rect x="235" y="85" width="10" height="48" rx="3" fill="url(#candleGrad3)" />
              <line x1="240" y1="85" x2="240" y2="76" stroke="#FFFFFF" strokeWidth="2" />

              {/* Flames - Hidden when blown out */}
              {!blown ? (
                <>
                  {/* Left Flame */}
                  <g className="animate-pulse" filter="url(#flameGlow)">
                    <path
                      d="M160 52 C154 62, 154 70, 160 76 C166 70, 166 62, 160 52 Z"
                      fill="#FFD700"
                    />
                    <path
                      d="M160 60 C157 65, 157 71, 160 75 C163 71, 163 65, 160 60 Z"
                      fill="#FF4500"
                    />
                  </g>

                  {/* Center Flame */}
                  <g
                    className="animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                    filter="url(#flameGlow)"
                  >
                    <path
                      d="M200 40 C193 52, 193 60, 200 66 C207 60, 207 52, 200 40 Z"
                      fill="#6FFF00"
                    />
                    <path
                      d="M200 50 C196 56, 196 62, 200 65 C204 62, 204 56, 200 50 Z"
                      fill="#FFFFFF"
                    />
                  </g>

                  {/* Right Flame */}
                  <g
                    className="animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                    filter="url(#flameGlow)"
                  >
                    <path
                      d="M240 52 C234 62, 234 70, 240 76 C246 70, 246 62, 240 52 Z"
                      fill="#FF69B4"
                    />
                    <path
                      d="M240 60 C237 65, 237 71, 240 75 C243 71, 243 65, 240 60 Z"
                      fill="#FFD700"
                    />
                  </g>
                </>
              ) : (
                /* Smoke puffs when blown */
                <g className="animate-fade-rise opacity-70">
                  <path
                    d="M160 70 Q155 58, 162 48 T158 35"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M200 60 Q206 48, 198 38 T204 22"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M240 70 Q245 58, 238 48 T242 35"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              )}
            </svg>

            {/* Tap Hint */}
            {!blown && (
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/70 border border-neon/30 text-neon font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full whitespace-nowrap backdrop-blur-sm pointer-events-none inline-flex items-center gap-1.5"
              >
                <Sparkles size={10} />
                <span>Click to blow out candles</span>
              </motion.div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {!blown ? (
              <button
                onClick={handleBlowCandles}
                className="inline-flex items-center gap-2.5 bg-neon text-[#010828] font-grotesk uppercase text-xs sm:text-sm tracking-widest rounded-full px-8 py-4 font-semibold hover:scale-105 active:scale-95 transition shadow-[0_0_30px_rgba(111,255,0,0.35)]"
              >
                <PartyPopper size={18} />
                Blow The Candles & Make A Wish
              </button>
            ) : (
              <button
                onClick={handleRelight}
                className="inline-flex items-center gap-2 liquid-glass text-cream font-grotesk uppercase text-xs sm:text-sm tracking-widest rounded-full px-7 py-3.5 hover:text-neon hover:border-neon/40 transition"
              >
                <RefreshCw size={16} />
                Relight Candles & Wish Again
              </button>
            )}
          </div>

          {/* Revealed Birthday Wish Card */}
          <AnimatePresence>
            {blown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card rounded-3xl p-7 sm:p-10 mt-10 max-w-2xl text-center border border-neon/30 shadow-[0_0_50px_rgba(111,255,0,0.15)]"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon mb-5">
                  <Sparkles size={22} />
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon mb-2">
                  A Special Wish From SHNWAZ
                </p>

                <h3 className="font-grotesk uppercase text-cream text-2xl sm:text-3xl tracking-wide">
                  Happy Birthday Khushi
                </h3>

                <p className="font-mono text-[12px] sm:text-[13px] text-cream/80 leading-relaxed mt-4 px-2">
                  "Khushi, on your special birthday, I want to wish you all the happiness, laughter,
                  and peace in the world. May your smile never fade, may every dream you hold close
                  come true, and may life always be kind and gentle to you. Happy Birthday!"
                </p>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-cream/50 font-mono text-[10px] tracking-widest uppercase">
                  <span className="text-neon font-bold">From: SHNWAZ</span>
                  <span className="text-neon font-bold">To: Khushi</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
