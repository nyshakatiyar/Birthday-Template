import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Film, AlertCircle, Pause } from "lucide-react";
import { mediaConfig } from "@/content/birthday";
import { GhostButton, SectionHeading } from "./shared";

const VIDEO_HEADING = "I HAVE A LITTLE SOMETHING FOR YOU";
const VIDEO_SUB = "So, I wanted to make you something you could keep.";
const ENDED_HEADING = "DID YOU REALLY THINK THAT WAS ALL?";
const ENDED_SUB = "You have no idea how much more I have to say about you.";
const ENDED_CTA = "THERE'S MORE";

/**
 * BirthdayVideo — a premium player for the personal video.
 * The video is never autoplayed with sound; the visitor chooses to play.
 * If the video file is missing or fails, an elegant state is shown and the
 * visitor can still continue to the rest of the experience.
 */
export default function VideoSection({ onContinue }: { onContinue: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "error" | "ended">("idle");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Tell the ambient-audio controller to duck while the video plays.
    window.dispatchEvent(
      new CustomEvent("birthday:video-playing", { detail: playing }),
    );
  }, [playing]);

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setStatus("playing");
      setPlaying(true);
    } catch {
      setStatus("error");
    }
  };

  const handleToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void handlePlay();
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const hasVideo = Boolean(mediaConfig.videoSrc);

  return (
    <section id="video" className="relative px-4 py-24 md:px-10 md:py-32">
      <SectionHeading heading={VIDEO_HEADING} subtitle={VIDEO_SUB} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 shadow-[0_0_70px_oklch(0.55_0.2_293/30%)]">
          <div className="relative aspect-video bg-violet-deep/50">
            {hasVideo && status !== "error" ? (
              <video
                ref={videoRef}
                src={mediaConfig.videoSrc}
                poster={mediaConfig.videoPoster}
                preload="metadata"
                playsInline
                controls={playing}
                className="h-full w-full object-cover"
                onPlay={() => {
                  setPlaying(true);
                  setStatus("playing");
                }}
                onPause={() => setPlaying(false)}
                onEnded={() => {
                  setPlaying(false);
                  setStatus("ended");
                }}
                onError={() => setStatus("error")}
              >
                <track kind="captions" />
              </video>
            ) : (
              <img
                src={mediaConfig.videoPoster}
                alt="Video poster"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )}

            {/* Poster overlay with play button */}
            {hasVideo && status === "idle" && (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Play the birthday video"
                className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-void/40 transition-colors hover:bg-void/25"
              >
                <span className="glass-card flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-110">
                  <Play className="ml-1 h-7 w-7 text-foreground" aria-hidden="true" />
                </span>
                <span className="text-[10px] tracking-[0.35em] text-foreground/90">
                  PRESS PLAY
                </span>
              </button>
            )}

            {/* Paused state */}
            {hasVideo && status !== "idle" && status !== "playing" && status !== "error" && (
              <button
                type="button"
                onClick={handleToggle}
                aria-label="Resume the birthday video"
                className="absolute inset-0 flex items-center justify-center bg-void/50"
              >
                <span className="glass-card flex h-16 w-16 items-center justify-center rounded-full">
                  {status === "ended" ? (
                    <Film className="h-6 w-6 text-foreground" aria-hidden="true" />
                  ) : (
                    <Play className="ml-1 h-6 w-6 text-foreground" aria-hidden="true" />
                  )}
                </span>
              </button>
            )}

            {/* Graceful error state — no broken player */}
            {(!hasVideo || status === "error") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/60 px-8 text-center backdrop-blur-sm">
                {status === "error" ? (
                  <AlertCircle className="h-6 w-6 text-lavender" aria-hidden="true" />
                ) : (
                  <Film className="h-6 w-6 text-lavender" aria-hidden="true" />
                )}
                <p className="max-w-md font-hand text-xl text-lavender md:text-2xl">
                  {mediaConfig.videoHintText}
                </p>
              </div>
            )}
          </div>
        </div>

        {hasVideo && status !== "error" && (
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] tracking-[0.3em] text-muted-foreground">
            <Pause className="h-3 w-3" aria-hidden="true" /> YOUR VIDEO, PAUSED AND READY WHEN YOU ARE
          </p>
        )}
      </motion.div>

      {/* Ending reveal — or a direct path forward if the video is unavailable */}
      <div className="mx-auto mt-20 max-w-xl text-center md:mt-28">
        <AnimatePresence>
          {(status === "ended" || !hasVideo || status === "error") && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-2xl font-medium tracking-wide text-foreground md:text-4xl">
                {ENDED_HEADING}
              </p>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{ENDED_SUB}</p>
              <div className="mt-9">
                <GhostButton onClick={onContinue} ariaLabel="Continue to the love notes">
                  {ENDED_CTA}
                </GhostButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
