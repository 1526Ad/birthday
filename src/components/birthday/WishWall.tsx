import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Heart,
  Sparkles,
  MessageSquareHeart,
  User,
  Cake,
  Star,
  Gift,
  PartyPopper,
  Sun,
  Smile,
  type LucideIcon,
} from "lucide-react";
import { triggerBirthdayCelebration } from "./ConfettiCannon";

interface Wish {
  id: string;
  name: string;
  message: string;
  iconId: string;
  date: string;
}

const STAMP_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  cake: Cake,
  sparkles: Sparkles,
  star: Star,
  gift: Gift,
  celebrate: PartyPopper,
  sun: Sun,
  smile: Smile,
};

const DEFAULT_WISHES: Wish[] = [
  {
    id: "w-1",
    name: "ZAHER",
    message:
      "Happy Birthday Khushi! Wishing you a fantastic year ahead filled with good health, success, and endless reasons to smile.",
    iconId: "heart",
    date: "Special Delivery",
  },
  {
    id: "w-2",
    name: "BROKEN HEART",
    message:
      "Wishing you the happiest birthday Khushi! May your smile never fade and may all your dreams turn into reality.",
    iconId: "sparkles",
    date: "Warmest Regards",
  },
  {
    id: "w-3",
    name: "ADARSH",
    message:
      "Happy Birthday Khushi! Keep shining bright, achieving great things, and spreading your wonderful positive energy everywhere.",
    iconId: "star",
    date: "Birthday Morning",
  },
  {
    id: "w-4",
    name: "SHNWAZ",
    message:
      "Happy Birthday Khushi! May this year bring you immense peace, boundless laughter, and all the joy you truly deserve.",
    iconId: "cake",
    date: "Always",
  },
];

const STAMP_LIST = [
  { id: "heart", icon: Heart },
  { id: "cake", icon: Cake },
  { id: "sparkles", icon: Sparkles },
  { id: "star", icon: Star },
  { id: "gift", icon: Gift },
  { id: "celebrate", icon: PartyPopper },
  { id: "sun", icon: Sun },
  { id: "smile", icon: Smile },
];

export function WishWall() {
  const [wishes, setWishes] = useState<Wish[]>(DEFAULT_WISHES);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedIconId, setSelectedIconId] = useState("cake");
  const [submitted, setSubmitted] = useState(false);

  // Filter out any accidental test wish like "hpyyy"
  const sanitizeWishes = (list: Wish[]) => {
    return list.filter((w) => !w.message.toLowerCase().includes("hpyyy"));
  };

  // Fetch wishes from shared server API
  const fetchSharedWishes = useCallback(async () => {
    try {
      const res = await fetch("/api/wishes");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const clean = sanitizeWishes(data);
          setWishes(clean);
          localStorage.setItem("khushi_birthday_wishes_shared", JSON.stringify(clean));
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    // Local storage fallback
    try {
      const saved = localStorage.getItem("khushi_birthday_wishes_shared");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes(sanitizeWishes(parsed));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // Clear any old local cache containing the test wish
    try {
      localStorage.removeItem("nikkita_birthday_wishes");
      localStorage.removeItem("khushi_birthday_wishes");
      localStorage.removeItem("khushi_birthday_wishes_v2");
      localStorage.removeItem("khushi_birthday_wishes_v4");
    } catch {
      // ignore
    }

    fetchSharedWishes();

    // Poll every 5s so anyone opening on their phone/browser sees new wishes in real-time
    const interval = setInterval(fetchSharedWishes, 5000);
    return () => clearInterval(interval);
  }, [fetchSharedWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      iconId: selectedIconId,
      date: "Just now",
    };

    // Optimistic UI update
    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem("khushi_birthday_wishes_shared", JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Save to shared server endpoint
    try {
      await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWish),
      });
    } catch {
      // ignore
    }

    setName("");
    setMessage("");
    setSubmitted(true);
    triggerBirthdayCelebration();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="guestbook" className="relative w-full py-24 sm:py-36 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16">
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-neon mb-4">
            02 — Birthday Guestbook
          </p>
          <h2 className="font-grotesk uppercase text-cream text-[32px] sm:text-[56px] lg:text-[72px] leading-tight">
            Wishes &{" "}
            <span className="font-condiment normal-case text-neon mix-exclusion">Love Notes</span>
          </h2>
          <p className="mt-3 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-cream/60 max-w-lg mx-auto">
            Leave a warm birthday message for Khushi. All wishes are shared live for everyone!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neon">
                <MessageSquareHeart size={18} />
              </div>
              <div>
                <h3 className="font-grotesk uppercase text-cream text-lg tracking-wider">
                  Write A Wish
                </h3>
                <p className="font-mono text-[10px] uppercase text-cream/40">
                  Visible to everyone celebrating Khushi
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-cream/70 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40"
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ZAHER, ADARSH, A Friend..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-cream font-mono placeholder:text-cream/30 focus:outline-none focus:border-neon transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-cream/70 mb-2">
                  Pick An Icon Stamp
                </label>
                <div className="flex flex-wrap gap-2">
                  {STAMP_LIST.map(({ id, icon: IconComponent }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedIconId(id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                        selectedIconId === id
                          ? "bg-neon/20 border border-neon text-neon scale-110 shadow-[0_0_12px_rgba(111,255,0,0.3)]"
                          : "bg-white/[0.03] border border-white/10 text-cream/60 hover:text-cream hover:bg-white/10"
                      }`}
                      title={id}
                    >
                      <IconComponent size={18} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-cream/70 mb-2">
                  Your Birthday Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write something sweet, cheerful, or memorable..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-sm text-cream font-mono placeholder:text-cream/30 focus:outline-none focus:border-neon transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-neon text-[#010828] font-grotesk uppercase text-xs tracking-widest rounded-2xl py-3.5 font-bold hover:scale-[1.02] active:scale-98 transition shadow-[0_0_20px_rgba(111,255,0,0.25)]"
              >
                <Send size={15} />
                Send Birthday Wish
              </button>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-neon font-mono text-[11px] justify-center pt-2"
                  >
                    <Sparkles size={13} />
                    Wish published live for everyone to see!
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Wishes List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {wishes.map((w) => {
                const IconComponent = STAMP_ICONS[w.iconId] || Cake;
                return (
                  <motion.div
                    key={w.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="glass-card rounded-2xl p-5 flex flex-col justify-between group hover:border-neon/30 transition relative"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/30 flex items-center justify-center text-neon">
                            <IconComponent size={16} />
                          </div>
                          <div>
                            <div className="font-grotesk uppercase text-cream text-sm tracking-wider">
                              {w.name}
                            </div>
                            <div className="font-mono text-[9px] uppercase tracking-widest text-cream/40">
                              {w.date}
                            </div>
                          </div>
                        </div>

                        <Heart
                          size={14}
                          className="text-cream/30 group-hover:text-neon transition-colors"
                        />
                      </div>
                      <p className="font-mono text-[11px] sm:text-[12px] text-cream/80 leading-relaxed">
                        "{w.message}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-cream/30 font-mono text-[8px] uppercase tracking-widest">
                      <span className="inline-flex items-center gap-1">
                        <Star size={10} className="text-neon/70" /> Birthday Note
                      </span>
                      <span className="text-neon/80 font-bold">Khushi</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
