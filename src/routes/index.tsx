import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";

import CosmicBackground from "@/components/birthday/CosmicBackground";
import CursorGlow from "@/components/birthday/CursorGlow";
import IntroSequence from "@/components/birthday/IntroSequence";
import SiteNavigation from "@/components/birthday/SiteNavigation";
import Greeting from "@/components/birthday/Greeting";
import MemoryGallery from "@/components/birthday/MemoryGallery";
import VideoSection from "@/components/birthday/VideoSection";
import LoveNoteExperience from "@/components/birthday/LoveNoteExperience";
import FinalLetter from "@/components/birthday/FinalLetter";
import FinalScene from "@/components/birthday/FinalScene";
import AudioController from "@/components/birthday/AudioController";
import { birthdayConfig } from "@/content/birthday";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "A Universe Called You — A Birthday Experience",
      },
      {
        name: "description",
        content:
          "An interactive, cinematic birthday universe of memories, love notes and a letter — made for exactly one person.",
      },
      { property: "og:title", content: "A Universe Called You" },
      {
        property: "og:description",
        content:
          "An interactive, cinematic birthday universe of memories, love notes and a letter — made for exactly one person.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SECTION_IDS = ["greeting", "memories", "video", "notes", "letter", "finale"] as const;
type SectionId = (typeof SECTION_IDS)[number];

function Index() {
  const [introDone, setIntroDone] = useState(false);
  const [introMounted, setIntroMounted] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("greeting");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // The intro is a client-only experience (timers, canvas, randomness).
  useEffect(() => {
    setIntroMounted(true);
  }, []);

  // Lock scrolling while the intro plays.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  // Track which section is in view: drives navigation, background mood,
  // and whether automatic love-note popups are allowed.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [introDone]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const restartExperience = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setIntroDone(false);
    setIntroKey((k) => k + 1);
  };

  const quietSection = activeSection === "letter" || activeSection === "finale";

  return (
    <div className="film-grain relative min-h-screen bg-background text-foreground">
      <CosmicBackground dimmed={quietSection} />

      {/* Full experience content. Hidden until the intro completes. */}
      <div
        aria-hidden={!introDone}
        className={`relative z-10 transition-opacity duration-1000 ${
          introDone ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Greeting onExplore={() => scrollToSection("memories")} />
        <MemoryGallery onContinue={() => scrollToSection("video")} />
        <VideoSection onContinue={() => scrollToSection("notes")} />
        <LoveNoteExperience
          isQuietSection={quietSection || activeSection === "video"}
          onOpenLetter={() => scrollToSection("letter")}
        />
        <FinalLetter onContinue={() => scrollToSection("finale")} />
        <FinalScene onRestart={restartExperience} onHome={() => scrollToSection("greeting")} />

        <footer className="relative z-10 pb-10 pt-4 text-center">
          <p className="font-hand text-lg text-muted-foreground">
            {birthdayConfig.siteTitle}
          </p>
        </footer>
      </div>

      {/* Cinematic introduction overlay (client-only) */}
      <AnimatePresence>
        {introMounted && !introDone && (
          <IntroSequence
            key={introKey}
            onComplete={() => setIntroDone(true)}
          />
        )}
      </AnimatePresence>

      {introDone && (
        <>
          <SiteNavigation
            active={activeSection}
            onNavigate={scrollToSection}
            onRestart={restartExperience}
          />
          <AudioController />
        </>
      )}

      <CursorGlow />
    </div>
  );
}
