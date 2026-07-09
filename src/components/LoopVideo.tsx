import { useEffect, useRef } from "react";

interface LoopVideoProps {
  src: string;
  className?: string;
  fade?: boolean;
  objectFit?: "cover" | "contain" | "fill";
  priority?: boolean;
}

export function LoopVideo({
  src,
  className = "",
  fade = false,
  objectFit = "cover",
  priority = false,
}: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;

    const tryPlay = () => video.play().catch(() => {});

    // Pause when offscreen — huge perf win when multiple videos share the page.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) tryPlay();
          else video.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(video);

    if (priority) tryPlay();

    if (!fade) {
      return () => io.disconnect();
    }

    let raf = 0;
    const FADE = 0.5;
    const tick = () => {
      const d = video.duration;
      const t = video.currentTime;
      if (d && !isNaN(d)) {
        let o = 1;
        if (t < FADE) o = t / FADE;
        else if (d - t < FADE) o = Math.max(0, (d - t) / FADE);
        video.style.opacity = String(o);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        tryPlay();
      }, 100);
    };
    video.addEventListener("ended", onEnded);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("ended", onEnded);
      io.disconnect();
    };
  }, [fade, priority]);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay={priority}
      loop={!fade}
      muted
      playsInline
      preload={priority ? "auto" : "metadata"}
      className={className}
      style={{ objectFit, opacity: fade ? 0 : 1, transition: fade ? undefined : "opacity .4s" }}
    />
  );
}
