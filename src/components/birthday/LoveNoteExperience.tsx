import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import {
  loveNotes,
  loveNotesSection,
  notificationTeasers,
  finalLoveNote,
  type LoveNote,
} from "@/content/birthday";
import { GhostButton, SectionHeading, noteStyleMeta, HeartIcon } from "./shared";

const STORAGE_KEY = "auniverse-called-you:discovered-notes";
const AUTO_DISMISS_MS = 12000;
const CHECK_INTERVAL_MS = 8000;

/**
 * LoveNoteExperience — playful, spontaneous love notes in three flavors:
 * floating hearts, corner notifications, and a secret envelope, plus
 * buttons that deliberately reveal a note. Progress is remembered locally.
 */
export default function LoveNoteExperience({
  isQuietSection,
  onOpenLetter,
}: {
  isQuietSection: boolean;
  onOpenLetter: () => void;
}) {
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [openNote, setOpenNote] = useState<LoveNote | null>(null);
  const [notification, setNotification] = useState<{ note: LoveNote; teaser: string } | null>(null);
  const [heartsSpawn, setHeartsSpawn] = useState(0);
  const lastShownAt = useRef(0);
  const teaserIndex = useRef(0);

  // Restore discovery progress from a previous visit.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setDiscovered(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  const undiscovered = useMemo(
    () => loveNotes.filter((n) => !discovered.includes(n.id)),
    [discovered],
  );

  const markDiscovered = useCallback((note: LoveNote) => {
    setDiscovered((prev) => {
      if (prev.includes(note.id)) return prev;
      const next = [...prev, note.id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const pickAndOpen = useCallback(
    (forceNew: boolean) => {
      const pool = forceNew
        ? undiscovered.length > 0
          ? undiscovered
          : loveNotes // revisit gracefully once everything is discovered
        : undiscovered.length > 0
          ? undiscovered
          : loveNotes;
      if (pool.length === 0) {
        setOpenNote(null);
        return;
      }
      const note = pool[Math.floor(Math.random() * pool.length)];
      setOpenNote(note);
      if (!discovered.includes(note.id)) markDiscovered(note);
    },
    [discovered, markDiscovered, undiscovered],
  );

  // Controlled automatic notifications: quiet sections, cooldown,
  // no stacking, never the same note twice until exhausted.
  useEffect(() => {
    if (!notification && !openNote) {
      window.dispatchEvent(new CustomEvent("birthday:love-note-shown", { detail: false }));
    }
    return undefined;
  }, [notification, openNote]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("birthday:love-note-shown", { detail: Boolean(notification || openNote) }));
  }, [notification, openNote]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!loveNotesSection) return;
      if (!loveNotes.length || !undiscovered.length) return;
      if (isQuietSection) return;
      if (openNote || notification) return;
      if (document.hidden) return;
      const now = Date.now();
      const cooldown = 45 * 1000;
      if (now - lastShownAt.current < cooldown) return;
      lastShownAt.current = now;
      const note = undiscovered[Math.floor(Math.random() * undiscovered.length)];
      const teaser =
        notificationTeasers[teaserIndex.current % notificationTeasers.length];
      teaserIndex.current += 1;
      setNotification({ note, teaser });
      window.setTimeout(() => {
        setNotification((n) => (n && n.note.id === note.id ? null : n));
      }, AUTO_DISMISS_MS);
    }, CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [discovered, isQuietSection, notification, openNote, undiscovered]);

  const openFromNotification = () => {
    if (!notification) return;
    setOpenNote(notification.note);
    if (!discovered.includes(notification.note.id)) markDiscovered(notification.note);
    setNotification(null);
  };

  const total = loveNotes.length;
  const count = discovered.length;
  const finalNoteVisible = count >= finalLoveNote.threshold;

  return (
    <section id="notes" className="relative px-4 py-24 md:px-10 md:py-32">
      <SectionHeading
        heading={loveNotesSection.heading}
        subtitle={loveNotesSection.subtitle}
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <GhostButton
            onClick={() => pickAndOpen(true)}
            ariaLabel="Reveal a love note"
          >
            {loveNotesSection.revealButton}
          </GhostButton>
          <GhostButton
            onClick={() => pickAndOpen(true)}
            ariaLabel="Reveal another reminder"
            className="border-lavender/35"
          >
            {loveNotesSection.moreButton}
          </GhostButton>
        </motion.div>

        {/* Discovery counter */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-[11px] tracking-[0.3em] text-muted-foreground"
          aria-live="polite"
        >
          {loveNotesSection.counterLabel}{" "}
          <span className="font-semibold text-lavender">
            {String(count).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </motion.p>

        {/* Graceful empty state */}
        {total === 0 && (
          <p className="text-sm text-muted-foreground">{loveNotesSection.emptyState}</p>
        )}

        {/* Playful interactive elements inside the section */}
        <div className="relative h-56 w-full max-w-xl md:h-64" aria-hidden="false">
          <FloatingHeart
            className="left-[8%] top-6"
            delay={0}
            onClick={() => pickAndOpen(true)}
          />
          <FloatingHeart
            className="right-[14%] top-20"
            delay={1.4}
            onClick={() => pickAndOpen(true)}
            key={`h1-${heartsSpawn}`}
          />
          <SecretEnvelope onClick={() => pickAndOpen(true)} />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-hand absolute bottom-0 left-1/2 w-full -translate-x-1/2 text-center text-lg text-muted-foreground"
          >
            Psst — some notes like to wander. Catch one if you can.
          </motion.p>
        </div>

        {/* The final interruption once enough notes are discovered */}
        <AnimatePresence>
          {finalNoteVisible && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card mt-6 max-w-xl rounded-3xl px-8 py-10"
            >
              <Sparkles className="mx-auto h-5 w-5 text-lavender" aria-hidden="true" />
              <p className="font-display mt-4 text-xl font-medium tracking-[0.2em] text-foreground md:text-2xl">
                {finalLoveNote.heading}
              </p>
              <p className="mt-5 font-display text-lg italic leading-relaxed text-muted-foreground md:text-xl">
                {finalLoveNote.message}
              </p>
              <div className="mt-8">
                <GhostButton onClick={onOpenLetter} ariaLabel="Read the letter">
                  {finalLoveNote.button}
                </GhostButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Note modal */}
      <AnimatePresence>
        {openNote && (
          <NoteModal note={openNote} onClose={() => setOpenNote(null)} />
        )}
      </AnimatePresence>

      {/* Corner notification */}
      <AnimatePresence>
        {notification && (
          <motion.button
            type="button"
            onClick={openFromNotification}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`Open discovered note: ${notification.note.title}`}
            className="glass-card fixed bottom-6 left-6 z-[65] flex max-w-xs items-start gap-3 rounded-2xl px-5 py-4 text-left shadow-[0_0_30px_oklch(0.6_0.2_293/35%)]"
          >
            <HeartIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-glow" />
            <span>
              <span className="block text-[10px] tracking-[0.2em] text-muted-foreground">
                NEW DISCOVERY UNLOCKED
              </span>
              <span className="mt-1 block text-sm leading-snug text-foreground">
                {notification.note.title}
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}

function NoteModal({ note, onClose }: { note: LoveNote; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const style = noteStyleMeta[note.style];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      role="dialog"
      aria-modal="true"
      aria-label={note.title}
    >
      <div
        className="absolute inset-0 bg-void/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card relative z-10 w-full max-w-md rounded-3xl px-8 py-10"
        style={{ boxShadow: `0 0 60px ${style.glow}` }}
      >
        <button
          type="button"
          onClick={onClose}
          ref={closeRef}
          aria-label="Close note"
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-[10px] tracking-[0.35em] text-muted-foreground">
          {note.category.toUpperCase()}
        </p>
        <h3 className={`font-display mt-3 text-2xl font-medium italic md:text-3xl ${style.className}`}>
          {note.title}
        </h3>
        <p className="mt-5 text-base leading-relaxed text-foreground/90 md:text-lg">
          {note.message}
        </p>
        <HeartIcon className="mt-7 h-4 w-4 text-rose-glow/70" />
      </motion.div>
    </motion.div>
  );
}

/** A glowing heart drifting gently through the section, waiting to be caught. */
function FloatingHeart({
  className,
  delay,
  onClick,
}: {
  className: string;
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Catch a floating love note"
      className={`absolute ${className}`}
      animate={{ y: [0, -16, 0, -8, 0], x: [0, 8, 0, -8, 0] }}
      transition={{ duration: 9, delay, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <span className="block text-rose-glow/80 drop-shadow-[0_0_12px_oklch(0.65_0.24_343/60%)]">
        <HeartIcon className="h-7 w-7" />
      </span>
    </motion.button>
  );
}

/** An elegant CSS/SVG envelope hiding a secret note. */
function SecretEnvelope({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Open the secret envelope"
      className="absolute bottom-10 left-[42%]"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <svg viewBox="0 0 64 44" className="h-12 w-16" aria-hidden="true">
        <rect
          x="2"
          y="2"
          width="60"
          height="40"
          rx="5"
          fill="oklch(0.24 0.07 290 / 90%)"
          stroke="oklch(0.72 0.11 295 / 60%)"
          strokeWidth="1.5"
        />
        <path
          d="M3 5 L32 26 L61 5"
          fill="none"
          stroke="oklch(0.827 0.106 308 / 80%)"
          strokeWidth="1.5"
        />
        <circle cx="32" cy="30" r="4" fill="oklch(0.65 0.24 343 / 80%)" />
      </svg>
    </motion.button>
  );
}
