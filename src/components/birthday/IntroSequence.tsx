import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { introLines } from "@/content/birthday";
import { GhostButton, heartPoints } from "./shared";

const LINE_HOLD_MS = 2600; // time each non-final line is on screen
const FINAL_HOLD_MS = 1400; // pause after the final line before the CTA

/**
 * IntroSequence — the cinematic opening.
 *
 * Quiet starfield, then the personal text sequence one statement at a time,
 * ending on "I got you." and the call to action. Clicking the CTA pulls the
 * stars into a heart-shaped constellation before dissolving into the greeting.
 * A discreet Skip control is available at all times.
 */
export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(reduced ? introLines.length - 1 : 0);
  const [showCta, setShowCta] = useState(reduced);
  const [phase, setPhase] = useState<"text" | "converge" | "leaving">("text");

  // Advance through the text sequence.
  useEffect(() => {
    if (reduced || phase !== "text") return;
    if (lineIndex < introLines.length - 1) {
      const t = window.setTimeout(() => setLineIndex((i) => i + 1), LINE_HOLD_MS);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setShowCta(true), FINAL_HOLD_MS);
    return () => window.clearTimeout(t);
  }, [lineIndex, phase, reduced]);

  const finish = () => {
    setPhase("leaving");
    window.setTimeout(onComplete, 700);
  };

  const startConverge = () => {
    if (reduced) {
      finish();
      return;
    }
    setPhase("converge");
    window.setTimeout(finish, 3200);
  };

  const skip = () => {
    if (phase === "converge") return;
    finish();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeOut" } }}
      transition={{ duration: 1.2 }}
      role="dialog"
      aria-label="Introduction"
    >
      {/* Soft dark veil so the starfield shows through */}
      <div className="absolute inset-0 bg-void/50" />

      {/* Converging heart constellation */}
      {phase === "converge" && <HeartConvergence />}

      {/* Text sequence */}
      {phase === "text" && (
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={lineIndex}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className={
                lineIndex === introLines.length - 1
                  ? "font-display text-6xl font-medium italic text-foreground text-glow-lavender md:text-8xl"
                  : "font-display text-2xl font-light text-muted-foreground md:text-4xl"
              }
            >
              {introLines[lineIndex]}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence>
            {showCta && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-14"
              >
                <GhostButton onClick={startConverge}>
                  THERE'S SOMETHING I MADE FOR YOU
                </GhostButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Discreet skip control — available the whole time */}
      {phase !== "converge" && (
        <button
          type="button"
          onClick={skip}
          className="absolute bottom-6 right-6 z-20 rounded-full border border-border px-4 py-1.5 text-[10px] tracking-[0.3em] text-muted-foreground transition-colors hover:border-lavender/50 hover:text-foreground"
        >
          SKIP INTRO
        </button>
      )}
    </motion.div>
  );
}

/** Stars drifting inward into a glowing heart, then a soft bloom of light. */
function HeartConvergence() {
  const dots = useMemo(() => {
    const targets = heartPoints(40, 1);
    return targets.map((t, i) => ({
      id: i,
      // Deterministic-ish starting positions spread across the viewport
      startX: 8 + ((i * 37) % 84),
      startY: 12 + ((i * 53) % 76),
      tx: 50 + t.x * 1.7, // percent of viewport
      ty: 50 + t.y * 1.7,
      size: 1.5 + ((i * 7) % 3) * 0.8,
      delay: (i % 10) * 0.09,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-10" aria-hidden="true">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-lavender"
          style={{
            left: `${d.startX}%`,
            top: `${d.startY}%`,
            width: d.size,
            height: d.size,
            boxShadow: "0 0 10px oklch(0.8 0.12 305 / 90%)",
          }}
          initial={{ opacity: 0.25 }}
          animate={{
            left: `${d.tx}%`,
            top: `${d.ty}%`,
            opacity: 1,
          }}
          transition={{
            duration: 2.2,
            delay: d.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
      {/* Central glow bloom */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "46vmin",
          height: "46vmin",
          background:
            "radial-gradient(closest-side, oklch(0.75 0.16 315 / 55%), oklch(0.6 0.18 300 / 25%) 45%, transparent 72%)",
          filter: "blur(12px)",
        }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: [0, 1, 1], scale: [0.2, 1.05, 1.5] }}
        transition={{ duration: 3, delay: 1.1, ease: "easeOut" }}
      />
    </div>
  );
}
