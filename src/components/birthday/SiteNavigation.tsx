import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, RotateCcw } from "lucide-react";

const NAV_ITEMS = [
  { id: "greeting", label: "Home" },
  { id: "memories", label: "Our Memories" },
  { id: "video", label: "Your Video" },
  { id: "notes", label: "Love Notes" },
  { id: "letter", label: "Your Letter" },
];

/**
 * SiteNavigation — a discreet floating control for jumping between sections.
 * A quiet pill on desktop, a compact panel on mobile.
 */
export default function SiteNavigation({
  active,
  onNavigate,
  onRestart,
}: {
  active: string;
  onNavigate: (id: string) => void;
  onRestart: () => void;
}) {
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Desktop pill */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Site sections"
        className="glass-card fixed left-1/2 top-5 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-full px-2 py-1.5 md:flex"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(item.id)}
            aria-current={active === item.id ? "true" : undefined}
            className={`rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.14em] transition-colors duration-300 ${
              active === item.id
                ? "bg-primary/25 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onRestart}
          aria-label="Replay the opening"
          title="Replay the opening"
          className="ml-1 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </motion.nav>

      {/* Mobile compact control */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="fixed right-4 top-4 z-40 md:hidden"
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="glass-card rounded-full p-3 text-foreground"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card fixed right-4 top-[68px] z-40 flex w-52 flex-col gap-1 rounded-2xl p-3 md:hidden"
            aria-label="Site sections"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-current={active === item.id ? "true" : undefined}
                className={`rounded-xl px-4 py-2.5 text-left text-sm tracking-wide transition-colors ${
                  active === item.id
                    ? "bg-primary/25 text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onRestart();
              }}
              className="mt-1 rounded-xl px-4 py-2.5 text-left text-sm text-muted-foreground"
            >
              Replay opening
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
