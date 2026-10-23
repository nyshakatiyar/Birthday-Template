import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { LoveNoteStyle } from "@/content/birthday";

/** Shared helpers for the birthday experience. */

/** Points along a heart curve (parametric heart), t from 0..2π. */
export function heartPoints(count: number, scale = 1): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    // Round to 2 decimals so server and client render identical attributes.
    points.push({
      x: Math.round(x * scale * 100) / 100,
      y: Math.round(-y * scale * 100) / 100,
    });
  }
  return points;
}

export const noteStyleMeta: Record<LoveNoteStyle, { label: string; className: string; glow: string }> = {
  romantic: {
    label: "romantic",
    className: "text-rose-glow",
    glow: "oklch(0.65 0.24 343 / 30%)",
  },
  funny: {
    label: "funny",
    className: "text-lavender",
    glow: "oklch(0.827 0.106 308 / 30%)",
  },
  sweet: {
    label: "sweet",
    className: "text-rose-glow",
    glow: "oklch(0.65 0.24 343 / 30%)",
  },
  compliment: {
    label: "compliment",
    className: "text-lavender",
    glow: "oklch(0.827 0.106 308 / 30%)",
  },
  memory: {
    label: "memory",
    className: "text-primary",
    glow: "oklch(0.606 0.25 292 / 30%)",
  },
  encouraging: {
    label: "encouraging",
    className: "text-primary",
    glow: "oklch(0.606 0.25 292 / 30%)",
  },
};

/** Elegant shared heading treatment for the main sections. */
export function SectionHeading({
  eyebrow,
  heading,
  subtitle,
}: {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
      {eyebrow ? (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 text-[11px] font-medium tracking-[0.35em] text-primary/80"
        >
          {eyebrow}
        </motion.p>
      ) : null}
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-3xl font-medium tracking-[0.18em] text-foreground text-glow-soft md:text-5xl"
      >
        {heading}
      </motion.h2>
      {subtitle ? (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </div>
  );
}

/** Primary ghost button used across the experience. */
export function GhostButton({
  children,
  onClick,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/[0.06] px-8 py-3.5 text-[12px] font-medium tracking-[0.25em] text-foreground shadow-[0_0_24px_oklch(0.6_0.2_293/25%)] backdrop-blur-sm transition-colors duration-300 hover:border-lavender/70 hover:bg-primary/[0.14] hover:shadow-[0_0_40px_oklch(0.65_0.2_295/45%)] ${className}`}
    >
      <SparkIcon className="h-3.5 w-3.5 shrink-0 text-lavender transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
      {children}
    </motion.button>
  );
}

export function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2c.6 4.9 2.9 8.3 7.5 9.5-4.6 1.2-6.9 4.6-7.5 9.5-.6-4.9-2.9-8.3-7.5-9.5C9.1 10.3 11.4 6.9 12 2Z" />
    </svg>
  );
}

export function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35Z" />
    </svg>
  );
}
