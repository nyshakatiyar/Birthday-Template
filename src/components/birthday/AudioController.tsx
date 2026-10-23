import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { birthdayConfig } from "@/content/birthday";

/**
 * AudioController — an optional ambient-music toggle.
 * Sound is always off until the visitor enables it. If the music file is
 * missing (or the feature is disabled in content), the toggle stays hidden —
 * the experience never depends on audio. Ambient music ducks while the
 * personal video plays.
 */
export default function AudioController() {
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const targetVolume = useRef(0);

  // Only offer the toggle when a music file actually exists.
  useEffect(() => {
    if (!birthdayConfig.enableAmbientMusic || !birthdayConfig.ambientMusicUrl) return;
    let cancelled = false;
    fetch(birthdayConfig.ambientMusicUrl, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setAvailable(true);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  // Duck/pause while the personal video plays.
  useEffect(() => {
    if (!available) return;
    const onVideoPlaying = (e: Event) => {
      const playing = Boolean((e as CustomEvent).detail);
      const audio = audioRef.current;
      if (!audio) return;
      if (playing) {
        targetVolume.current = 0.08;
        audio.volume = 0.08;
      } else {
        targetVolume.current = enabled ? 0.6 : 0;
        if (!enabled) {
          audio.pause();
        }
      }
    };
    window.addEventListener("birthday:video-playing", onVideoPlaying);
    return () => window.removeEventListener("birthday:video-playing", onVideoPlaying);
  }, [available, enabled]);

  if (!available) return null;

  const toggle = async () => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(birthdayConfig.ambientMusicUrl);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
    }
    if (enabled) {
      audio.pause();
      setEnabled(false);
    } else {
      try {
        audio.volume = 0;
        await audio.play();
        // Gentle fade-in
        const fade = window.setInterval(() => {
          if (!audioRef.current) return window.clearInterval(fade);
          audioRef.current.volume = Math.min(0.6, audioRef.current.volume + 0.05);
          if (audioRef.current.volume >= 0.6) window.clearInterval(fade);
        }, 120);
        setEnabled(true);
      } catch {
        setEnabled(false);
      }
    }
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      aria-label={enabled ? "Turn ambient music off" : "Turn ambient music on"}
      aria-pressed={enabled}
      className="glass-card fixed bottom-6 right-6 z-40 rounded-full p-3.5 text-foreground transition-colors hover:text-lavender"
    >
      {enabled ? (
        <Volume2 className="h-4 w-4" aria-hidden="true" />
      ) : (
        <VolumeX className="h-4 w-4" aria-hidden="true" />
      )}
    </motion.button>
  );
}
