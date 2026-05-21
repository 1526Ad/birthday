import { useEffect, useRef } from "react";

interface LoopVideoProps {
  src: string;
  className?: string;
  fade?: boolean;
  objectFit?: "cover" | "contain" | "fill";
}

export function LoopVideo({ src, className = "", fade = false, objectFit = "cover" }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();

    if (!fade) return;
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
    };
  }, [fade]);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      loop={!fade}
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ objectFit, opacity: fade ? 0 : 1, transition: fade ? undefined : "opacity .4s" }}
    />
  );
}
