# Nikkita Kashyap — Portfolio

A cinematic, dark-themed personal portfolio for **Nikkita Kashyap** — art sketcher, graduate, and quiet creator. Built with a video-first hero, glassmorphism UI, and buttery parallax scrolling.

---

## ✨ Features

- 🎬 **Cinematic hero** with looping background video and smooth fade transitions
- 🪟 **Liquid glass UI** — frosted cards, neon accents, spotlight hover effects
- 🌊 **Advanced parallax** — multi-layered scroll transforms on every section
- 📱 **Mobile-perfect** — raw-scroll parallax on phones for zero lag
- 🎨 **Custom typography** — Instrument Serif, Inter, Anton, Condiment
- 🔒 **Copy/source protection** — disabled right-click, text selection, and devtools shortcuts
- ⚡ **Optimized video delivery** — locally hosted 720p H.264 with poster fallback
- 🧠 **Sections** — Hero, About, Interests (Cooking, Travelling, Gaming, Self Makeup, Photography, Art Sketching), Contact

---

## 🛠️ Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7)
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript
- **Deploy:** Cloudflare Workers (edge)

---

## 🚀 Getting Started

```bash
# install dependencies
bun install

# start dev server
bun dev

# build for production
bun run build
```

Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

---

## 📁 Project Structure

```
src/
├── components/
│   └── LoopVideo.tsx      # optimized video with IntersectionObserver + fade loop
├── hooks/
│   └── useParallax.ts     # spring-smoothed scroll + mobile-raw fallback
├── routes/
│   ├── __root.tsx         # root layout + SEO metadata
│   └── index.tsx          # single-page portfolio
└── styles.css             # tailwind + design tokens

public/
└── media/
    ├── nikkita-hero.mp4   # 5.2MB optimized background video
    └── nikkita-poster.jpg # poster frame for instant paint
```

---

## 🎨 Design System

- **Palette:** deep space navy `#010828`, neon accent, glass whites
- **Motion:** spring-based parallax with word-by-word text reveals
- **Layout:** full-bleed video backgrounds with glass-morphism content cards

---

## 📜 License

© 2026 · Nikkita. All rights reserved.

Built with ❤️ on [Lovable](https://lovable.dev).
