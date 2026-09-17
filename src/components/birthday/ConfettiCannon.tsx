import { useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle" | "star";
}

const COLORS = [
  "#6FFF00", // neon lime
  "#FF69B4", // hot pink
  "#FFD700", // radiant gold
  "#00FFFF", // cyan
  "#FFB6C1", // blush pink
  "#EFF4FF", // soft cream
  "#A78BFA", // lavender
];

class ConfettiEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animId: number | null = null;

  init() {
    if (typeof window === "undefined") return;
    if (this.canvas) return;

    const canvas = document.createElement("canvas");
    canvas.id = "birthday-confetti-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resize();

    window.addEventListener("resize", () => this.resize());
  }

  private resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    if (this.ctx) {
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  fire(options?: { count?: number; originX?: number; originY?: number }) {
    this.init();
    if (!this.ctx || !this.canvas) return;

    const count = options?.count ?? 90;
    const originX = options?.originX ?? window.innerWidth / 2;
    const originY = options?.originY ?? window.innerHeight * 0.4;

    const shapes: ("rect" | "circle" | "star")[] = ["rect", "circle", "star"];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 11;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
        vy: Math.sin(angle) * speed - (Math.random() * 5 + 3),
        size: Math.random() * 8 + 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    if (!this.animId) {
      this.animate();
    }
  }

  private animate = () => {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gravity
      p.vx *= 0.985; // air drag
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.007;

      if (p.opacity <= 0 || p.y > window.innerHeight + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        // star
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          ctx.lineTo(
            Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size,
            -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size,
          );
          ctx.lineTo(
            Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2),
            -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2),
          );
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(this.animate);
    } else {
      this.animId = null;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  };
}

export const confetti = new ConfettiEngine();

export function triggerBirthdayCelebration(x?: number, y?: number) {
  confetti.fire({ count: 120, originX: x, originY: y });
}

export function ConfettiCanvas() {
  useEffect(() => {
    confetti.init();
  }, []);
  return null;
}
