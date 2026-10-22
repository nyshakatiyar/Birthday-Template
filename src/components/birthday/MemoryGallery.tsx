import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { galleryIntro, galleryOutro, memories, type Memory } from "@/content/birthday";
import { GhostButton, SectionHeading, SparkIcon } from "./shared";

/**
 * MemoryGallery — an asymmetric, editorial collection of personal memories
 * floating in the cosmic environment. Placeholder cards are shown until the
 * real photographs are added in src/content/birthday.ts.
 */
export default function MemoryGallery({ onContinue }: { onContinue: () => void }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((i) =>
        i === null ? null : (i + dir + memories.length) % memories.length,
      );
    },
    [],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, step]);

  return (
    <section id="memories" className="relative px-4 py-24 md:px-10 md:py-32">
      <SectionHeading heading={galleryIntro.heading} subtitle={galleryIntro.subtitle} />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
        {memories.map((memory, i) => (
          <GalleryCard
            key={memory.id}
            memory={memory}
            index={i}
            onOpen={() => setLightboxIndex(i)}
          />
        ))}
      </div>

      {/* Gallery conclusion — cinematic bridge into the video */}
      <div className="mx-auto mt-28 max-w-xl text-center md:mt-40">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-2xl italic text-muted-foreground md:text-3xl"
        >
          {galleryOutro.line1}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-2xl text-foreground md:text-3xl"
        >
          {galleryOutro.line2}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, delay: 1.7 }}
          className="mt-10"
        >
          <GhostButton onClick={onContinue} ariaLabel="Go to the video">
            {galleryOutro.button}
          </GhostButton>
        </motion.div>
      </div>

      {/* Photo lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <PhotoLightbox
            memory={memories[lightboxIndex]}
            position={lightboxIndex}
            total={memories.length}
            onClose={close}
            onStep={step}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* Layout pattern: an asymmetrical editorial rhythm rather than a uniform grid. */
const LAYOUT = [
  "lg:col-span-2 lg:row-span-2 lg:translate-y-3 rotate-[-0.6deg]",
  "lg:mt-16 rotate-[0.8deg]",
  "lg:mt-6 rotate-[-0.4deg]",
  "lg:col-span-2 rotate-[0.5deg]",
  "lg:mt-10 rotate-[-0.9deg]",
  "lg:mt-2 rotate-[0.6deg]",
  "lg:mt-14 rotate-[0.4deg]",
  "lg:col-span-2 lg:row-span-1 rotate-[-0.5deg]",
  "lg:mt-12 rotate-[0.7deg]",
  "lg:mt-4 rotate-[-0.7deg]",
  "lg:col-span-2 rotate-[0.3deg]",
  "lg:mt-10 rotate-[-0.3deg]",
];

function GalleryCard({
  memory,
  index,
  onOpen,
}: {
  memory: Memory;
  index: number;
  onOpen: () => void;
}) {
  const isPortrait = index % 3 === 0;
  const hasImage = Boolean(memory.image);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open memory: ${memory.title}`}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative block w-full text-left ${LAYOUT[index % LAYOUT.length]}`}
    >
      <div
        className="glass-card overflow-hidden rounded-3xl p-2 transition-shadow duration-500 group-hover:shadow-[0_0_46px_oklch(0.6_0.2_293/40%)]"
      >
        <div
          className={`relative overflow-hidden rounded-[calc(1rem-2px)] bg-violet-deep ${
            isPortrait ? "aspect-[4/5]" : "aspect-[3/2]"
          }`}
        >
          {hasImage ? (
            <img
              src={memory.image}
              alt={memory.title}
              loading="lazy"
              className="h-full w-full object-cover brightness-[0.92] transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-100"
            />
          ) : (
            <PlaceholderPhoto label={memory.title} />
          )}
          {/* Hover veil + caption */}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-void/85 via-void/10 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
              <p className="font-display text-lg italic text-foreground">{memory.caption}</p>
              <Heart className="mt-1.5 h-3.5 w-3.5 text-rose-glow" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-3 px-3 pb-2.5 pt-3">
          <span className="font-hand text-lg text-foreground">{memory.title}</span>
          {memory.date ? (
            <span className="text-[10px] tracking-[0.2em] text-muted-foreground">{memory.date}</span>
          ) : null}
        </div>
      </div>
    </motion.button>
  );
}

/** Elegant placeholder shown until the real photograph is added. */
function PlaceholderPhoto({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-lavender/25 bg-gradient-to-br from-violet-deep/70 via-background/60 to-violet-deep/40">
      <SparkIcon className="animate-star-sparkle h-5 w-5 text-lavender/50" />
      <p className="px-6 text-center text-[11px] tracking-[0.25em] text-muted-foreground/80">
        OUR PHOTO GOES HERE
      </p>
      <p className="font-hand text-base text-muted-foreground/60">{label}</p>
    </div>
  );
}

function PhotoLightbox({
  memory,
  position,
  total,
  onClose,
  onStep,
}: {
  memory: Memory;
  position: number;
  total: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const touchStart = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [captionShown, setCaptionShown] = useState(false);

  useEffect(() => {
    setCaptionShown(false);
    const t = window.setTimeout(() => setCaptionShown(true), 450);
    closeRef.current?.focus();
    return () => window.clearTimeout(t);
  }, [position]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Memory: ${memory.title}`}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(dx) > 48) onStep(dx > 0 ? -1 : 1);
        touchStart.current = null;
      }}
    >
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-void/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.figure
        key={memory.id}
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-h-full w-full max-w-3xl flex-col items-center"
      >
        <div className="max-h-[62vh] w-full overflow-hidden rounded-3xl border border-lavender/20 shadow-[0_0_80px_oklch(0.6_0.2_293/35%)]">
          {memory.image ? (
            <img
              src={memory.image}
              alt={memory.title}
              className="h-full max-h-[62vh] w-full object-contain"
            />
          ) : (
            <div className="flex aspect-[3/2] max-h-[62vh] w-full items-center justify-center bg-violet-deep/60">
              <div className="text-center">
                <SparkIcon className="mx-auto h-6 w-6 text-lavender/60" />
                <p className="mt-3 text-[11px] tracking-[0.3em] text-muted-foreground">
                  OUR PHOTO GOES HERE
                </p>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {captionShown && (
            <motion.figcaption
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-5 max-w-xl text-center"
            >
              <p className="font-display text-2xl text-foreground">{memory.title}</p>
              {memory.date ? (
                <p className="mt-1 text-[10px] tracking-[0.3em] text-muted-foreground">{memory.date}</p>
              ) : null}
              {memory.caption ? (
                <p className="font-hand mt-2 text-lg text-lavender">{memory.caption}</p>
              ) : null}
              {memory.description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{memory.description}</p>
              ) : null}
            </motion.figcaption>
          )}
        </AnimatePresence>
      </motion.figure>

      {/* Controls */}
      <button
        type="button"
        onClick={onClose}
        ref={closeRef}
        aria-label="Close memory viewer"
        className="glass-card absolute right-4 top-4 z-20 rounded-full p-3 text-foreground transition-colors hover:text-lavender md:right-8 md:top-8"
      >
        <X className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onStep(-1)}
        aria-label="Previous memory"
        className="glass-card absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full p-3 text-foreground transition-colors hover:text-lavender md:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => onStep(1)}
        aria-label="Next memory"
        className="glass-card absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full p-3 text-foreground transition-colors hover:text-lavender md:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <p className="absolute bottom-4 z-20 text-[10px] tracking-[0.3em] text-muted-foreground">
        {position + 1} / {total}
      </p>
    </motion.div>
  );
}
