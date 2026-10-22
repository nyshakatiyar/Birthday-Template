import { describe, it, expect } from "vitest";
import {
  memories,
  loveNotes,
  birthdayLetter,
  birthdayConfig,
  galleryOutro,
  finalLoveNote,
} from "@/content/birthday";

describe("birthday content editability", () => {
  it("has a recipient name placeholder to personalize", () => {
    expect(birthdayConfig.hisName.length).toBeGreaterThan(0);
  });

  it("ships 12 editable memory slots with unique ids", () => {
    expect(memories).toHaveLength(12);
    const ids = memories.map((m) => m.id);
    expect(new Set(ids).size).toBe(12);
  });

  it("ships 20 placeholder love notes with unique ids and a style each", () => {
    expect(loveNotes).toHaveLength(20);
    const ids = loveNotes.map((n) => n.id);
    expect(new Set(ids).size).toBe(20);
    for (const note of loveNotes) {
      expect(note.style).toBeDefined();
      expect(note.message.length).toBeGreaterThan(0);
    }
  });

  it("has a final letter with paragraphs and a signature", () => {
    expect(birthdayLetter.body.length).toBeGreaterThan(0);
    expect(birthdayLetter.signature.length).toBeGreaterThan(0);
  });

  it("gallery outro bridges into the video", () => {
    expect(galleryOutro.button).toBe("PRESS PLAY");
  });

  it("final note unlocks after enough discoveries", () => {
    expect(finalLoveNote.threshold).toBeGreaterThan(0);
    expect(finalLoveNote.threshold).toBeLessThanOrEqual(loveNotes.length);
  });
});
