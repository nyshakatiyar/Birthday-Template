import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { greetingCopy } from "@/content/birthday";
import { GhostButton, SparkIcon } from "./shared";

/**
 * BirthdayGreeting — the first major reveal after the intro.
 * A calm composition with generous negative space and a soft glow on his name.
 */
export default function Greeting({ onExplore }: { onExplore: () => void }) {
  return (
    <section
      id="greeting"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center"
    >
      {/* Subtle heart constellation accent */}
      <HeartAccent />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-[11px] font-medium tracking-[0.4em] text-primary/80"
      >
        {greetingCopy.intro}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="font-display mt-3 text-5xl font-medium tracking-wide text-foreground text-glow-lavender md:text-8xl"
      >
        {greetingCopy.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 max-w-xl font-display text-xl italic text-lavender md:text-2xl"
      >
        {greetingCopy.welcome}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="font-hand mt-6 max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl"
      >
        {greetingCopy.playful}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.1 }}
        className="mt-12"
      >
        <GhostButton onClick={onExplore} ariaLabel="Scroll to our memories">
          {greetingCopy.exploreButton}
        </GhostButton>
      </motion.div>

      <motion.button
        type="button"
        onClick={onExplore}
        aria-label="Scroll down to our memories"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.6 }}
        className="group absolute bottom-10 flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="text-[10px] tracking-[0.35em]">{greetingCopy.more}</span>
        <ChevronDown className="animate-arrow-nudge h-4 w-4" />
      </motion.button>
    </section>
  );
}

/** A faint heart of tiny stars floating in the background of the greeting. */
function HeartAccent() {
  const pts: { x: number; y: number; d: number }[] = [];
  const N = 26;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push({
      x: Math.round(x * 4.2 * 100) / 100,
      y: Math.round(-y * 4.2 * 100) / 100,
      d: Math.round((i / N) * 2 * 1000) / 1000,
    });
  }
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 2, delay: 1.4 }}
    >
      <svg viewBox="-80 -80 160 160" className="h-[62vmin] w-[62vmin]">
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i % 4 === 0 ? 1.4 : 0.9}
            fill="oklch(0.85 0.1 305)"
            className="animate-star-sparkle"
            style={{ animationDelay: `${p.d}s`, transformOrigin: "center" }}
          />
        ))}
        <SparkIcon className="hidden" />
      </svg>
    </motion.div>
  );
}
