import { motion } from "motion/react";
import { finalScene } from "@/content/birthday";
import { GhostButton, heartPoints } from "./shared";

/**
 * FinalBirthdayScene — the calm, memorable ending. A delicate heart-shaped
 * constellation forms among the stars beneath the last birthday message.
 */
export default function FinalScene({
  onRestart,
  onHome,
}: {
  onRestart: () => void;
  onHome: () => void;
}) {
  return (
    <section
      id="finale"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      {/* Heart constellation */}
      <HeartConstellation />

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-display max-w-3xl text-4xl font-medium tracking-wide text-foreground text-glow-lavender md:text-6xl"
      >
        {finalScene.heading}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="font-display mt-7 max-w-xl text-xl italic text-lavender md:text-2xl"
      >
        {finalScene.line1}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, delay: 1.1 }}
        className="font-hand mt-5 text-xl text-muted-foreground md:text-2xl"
      >
        {finalScene.line2}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, delay: 1.8 }}
        className="mt-14 flex flex-wrap items-center justify-center gap-4"
      >
        <GhostButton onClick={onRestart} ariaLabel="Replay the experience from the beginning">
          {finalScene.restartButton}
        </GhostButton>
        <button
          type="button"
          onClick={onHome}
          className="rounded-full border border-border px-6 py-3 text-[11px] tracking-[0.25em] text-muted-foreground transition-colors hover:border-lavender/50 hover:text-foreground"
        >
          BACK TO THE BEGINNING
        </button>
      </motion.div>
    </section>
  );
}

/** Small stars drifting into a delicate heart outline as the scene arrives. */
function HeartConstellation() {
  const points = heartPoints(28, 4.4);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
    >
      <svg
        viewBox="-100 -100 200 200"
        className="h-[70vmin] w-[70vmin] translate-y-[18%]"
      >
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i % 5 === 0 ? 2 : 1.2}
            fill="oklch(0.87 0.1 305)"
            style={{ filter: "drop-shadow(0 0 4px oklch(0.8 0.12 305 / 80%))" }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 1,
              delay: 0.8 + (i / points.length) * 2.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
        {/* Faint connecting glow */}
        <motion.ellipse
          cx="0"
          cy="0"
          rx="70"
          ry="62"
          fill="none"
          stroke="oklch(0.7 0.12 300 / 12%)"
          strokeWidth="6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2, delay: 3.4 }}
        />
      </svg>
    </div>
  );
}
