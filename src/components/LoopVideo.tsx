import { useEffect, useRef, useState } from "react";

interface LoopVideoProps {
  src: string;
  className?: string;
  fade?: boolean;
  objectFit?: "cover" | "contain" | "fill";
  priority?: boolean;
  poster?: string;
}

export function LoopVideo({
  src,
  className = "",
  fade = false,
  objectFit = "cover",
  priority = false,
  poster,
}: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(priority);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => video.play().catch(() => {});

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visibleRef.current = e.isIntersecting;
          if (e.isIntersecting) {
            setShouldLoad(true);
            if (video.readyState >= 2) tryPlay();
          } else if (!priority) {
            video.pause();
          }
        }
      },
      { rootMargin: "360px 0px", threshold: 0.01 },
    );
    io.observe(video);

    if (priority) {
      setShouldLoad(true);
      video.load();
      tryPlay();
    }

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

  useEffect(() => {
    const video = ref.current;
    if (!video || !shouldLoad) return;

    const onReady = () => {
      setReady(true);
      if (visibleRef.current || priority) video.play().catch(() => {});
    };
    const onError = () => setReady(false);

    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("canplay", onReady, { once: true });
    video.addEventListener("error", onError);
    video.load();

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", onError);
    };
  }, [priority, shouldLoad, src]);

  return (
    <video
      ref={ref}
      src={shouldLoad ? src : undefined}
      autoPlay={priority}
      loop={!fade}
      muted
      playsInline
      poster={poster}
      preload={priority ? "auto" : "metadata"}
      controls={false}
      disablePictureInPicture
      className={className}
      style={{
        objectFit,
        opacity: fade ? 0 : ready ? 1 : 0,
        transition: fade ? undefined : "opacity .4s ease",
        backgroundImage: poster ? `url(${poster})` : undefined,
        backgroundSize: objectFit,
        backgroundPosition: "center",
      }}
    />
  );
}
