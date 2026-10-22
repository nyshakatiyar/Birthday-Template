import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MailOpen } from "lucide-react";
import { birthdayLetter, letterIntro, letterOutro } from "@/content/birthday";
import { GhostButton, SectionHeading, SparkIcon } from "./shared";

/**
 * FinalLetter — the emotional climax. A quiet corner of the universe with a
 * cream paper letter emerging from an elegant envelope.
 */
export default function FinalLetter({ onContinue }: { onContinue: () => void }) {
  const [opened, setOpened] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (opened) {
      window.setTimeout(() => {
        letterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 900);
    }
  }, [opened]);

  return (
    <section id="letter" className="relative px-4 py-24 md:px-10 md:py-36">
      <SectionHeading heading={letterIntro.heading} subtitle={letterIntro.subheading} />

      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <Envelope onOpen={() => setOpened(true)} />
              <div className="mt-10">
                <GhostButton onClick={() => setOpened(true)} ariaLabel="Open your letter">
                  {letterIntro.button}
                </GhostButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              ref={letterRef}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="letter-paper-bg w-full scroll-mt-24 rounded-[1.6rem] px-7 py-12 text-letter-ink shadow-[0_30px_90px_-20px_oklch(0.2_0.05_290/60%)] md:px-14 md:py-16"
            >
              {/* Decorative heading */}
              <div className="flex items-center justify-center gap-3 text-letter-ink/50">
                <span className="h-px w-10 bg-letter-ink/20" aria-hidden="true" />
                <SparkIcon className="h-3.5 w-3.5" />
                <span className="h-px w-10 bg-letter-ink/20" aria-hidden="true" />
              </div>
              <p className="mt-6 text-center text-[11px] font-medium uppercase tracking-[0.35em] text-letter-ink/60">
                {birthdayLetter.title}
              </p>

              <p className="font-display mt-8 text-2xl italic text-letter-ink md:text-3xl">
                {birthdayLetter.greeting}
              </p>

              <div className="font-display mt-7 space-y-6 text-lg leading-[1.9] text-letter-ink md:text-xl">
                {birthdayLetter.body.map((paragraph, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>

              <p className="font-hand mt-12 whitespace-pre-line text-right text-2xl text-letter-ink md:text-3xl">
                {birthdayLetter.signature}
              </p>

              <div className="mt-8 flex items-center justify-center gap-3 text-letter-ink/50">
                <span className="h-px w-10 bg-letter-ink/20" aria-hidden="true" />
                <SparkIcon className="h-3 w-3" />
                <span className="h-px w-10 bg-letter-ink/20" aria-hidden="true" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="mt-12"
            >
              <GhostButton onClick={onContinue} ariaLabel="See the final birthday message">
                {letterOutro.button}
              </GhostButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/** An elegant SVG envelope whose flap opens with a subtle 3D rotation. */
function Envelope({ onOpen }: { onOpen: () => void }) {
  const [open, setOpen] = useState(false);

  const handle = () => {
    setOpen(true);
    window.setTimeout(onOpen, 650);
  };

  return (
    <motion.button
      type="button"
      onClick={handle}
      aria-label="Open the letter"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="relative block"
    >
      <div
        className="relative"
        style={{ perspective: "800px" }}
      >
        {/* Letter peeking out */}
        <motion.div
          className="letter-paper-bg absolute -top-10 left-1/2 h-16 w-52 -translate-x-1/2 rounded-t-lg md:w-72"
          initial={{ y: 30, opacity: 0 }}
          animate={open ? { y: -26, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Envelope pocket */}
        <svg
          viewBox="0 0 260 170"
          className="relative w-64 drop-shadow-[0_0_36px_oklch(0.6_0.2_293/35%)] md:w-80"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="4"
            width="252"
            height="162"
            rx="10"
            fill="oklch(0.22 0.07 290)"
            stroke="oklch(0.72 0.11 295 / 55%)"
            strokeWidth="2"
          />
        </svg>
        {/* Flap with 3D rotation */}
        <div
          className="absolute inset-x-0 top-0 origin-top"
          style={{
            transformStyle: "preserve-3d",
            transform: open ? "rotateX(-165deg)" : "rotateX(0deg)",
            transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <svg viewBox="0 0 260 90" className="w-64 md:w-80" aria-hidden="true">
            <path
              d="M4 8 Q130 96 256 8 L256 4 Q130 80 4 4 Z"
              fill="oklch(0.27 0.08 292)"
              stroke="oklch(0.72 0.11 295 / 55%)"
              strokeWidth="2"
            />
            <path
              d="M4 8 L130 92 L256 8"
              fill="oklch(0.3 0.09 292)"
              stroke="oklch(0.72 0.11 295 / 40%)"
              strokeWidth="1.5"
            />
          </svg>
          <div
            className="absolute left-1/2 top-2 h-7 w-7 -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.65 0.24 343 / 85%), oklch(0.5 0.2 340 / 70%))",
              boxShadow: "0 0 18px oklch(0.65 0.24 343 / 50%)",
            }}
            aria-hidden="true"
          />
        </div>
      </div>
      <span className="mt-6 flex items-center justify-center gap-2 text-[10px] tracking-[0.35em] text-muted-foreground">
        <MailOpen className="h-3.5 w-3.5" aria-hidden="true" />
        {open ? "OPENING..." : "A LETTER, SEALED WITH A STAR"}
      </span>
    </motion.button>
  );
}
