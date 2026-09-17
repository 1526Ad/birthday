import { useEffect } from "react";

const AUDIO_SRC_LOCAL = "/media/birthday-music.mp3";
const AUDIO_SRC_REMOTE = "https://litter.catbox.moe/9qzdkm.mp3";

// Global single instance to 100% guarantee no double sound even with StrictMode/fast-refresh
declare global {
  interface Window {
    __singleBirthdayAudio?: HTMLAudioElement;
    __birthdayAudioInitialized?: boolean;
  }
}

export function BirthdayAudioPlayer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // If already initialized once, DO NOT create another audio instance!
    if (window.__birthdayAudioInitialized && window.__singleBirthdayAudio) {
      return;
    }

    // Stop and clean up any old audio if exists
    if (window.__singleBirthdayAudio) {
      window.__singleBirthdayAudio.pause();
      window.__singleBirthdayAudio.src = "";
    }

    const audio = new Audio();
    audio.src = AUDIO_SRC_LOCAL;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.8;
    window.__singleBirthdayAudio = audio;
    window.__birthdayAudioInitialized = true;

    // Fallback to remote url if local fails
    audio.onerror = () => {
      if (audio.src !== AUDIO_SRC_REMOTE) {
        audio.src = AUDIO_SRC_REMOTE;
        audio.load();
      }
    };

    let started = false;

    const playOnce = () => {
      if (started) return;
      audio
        .play()
        .then(() => {
          started = true;
          cleanupListeners();
        })
        .catch(() => {});
    };

    const cleanupListeners = () => {
      window.removeEventListener("click", playOnce);
      window.removeEventListener("touchstart", playOnce);
      window.removeEventListener("keydown", playOnce);
      window.removeEventListener("scroll", playOnce);
      document.removeEventListener("pointerdown", playOnce);
    };

    // Try autoplay
    audio
      .play()
      .then(() => {
        started = true;
      })
      .catch(() => {
        // If browser blocks autoplay, start on FIRST interaction anywhere
        window.addEventListener("click", playOnce, { passive: true, once: true });
        window.addEventListener("touchstart", playOnce, { passive: true, once: true });
        window.addEventListener("keydown", playOnce, { passive: true, once: true });
        window.addEventListener("scroll", playOnce, { passive: true, once: true });
        document.addEventListener("pointerdown", playOnce, { passive: true, once: true });
      });

    return () => {
      // Don't kill audio on fast-refresh, but cleanup listeners
      cleanupListeners();
    };
  }, []);

  // UI button is completely hidden as requested
  return null;
}
