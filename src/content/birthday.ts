/* =============================================================================
   A UNIVERSE CALLED YOU — EDITABLE CONTENT
   =============================================================================
   This is the ONLY file you need to edit to personalize the whole website.
   Everything below is placeholder content: replace the bracketed text and
   placeholder values with your real words, photos, video and letter.

   WHERE TO PUT YOUR FILES
   - Photographs: drop them in  public/images/memories/  (e.g. memory-01.jpg)
   - Birthday video:  public/videos/birthday-video.mp4
   - Video poster (the still shown before play):  public/images/video-poster.jpg
   - Ambient music (optional):  public/audio/ambient-music.mp3
   If a file is missing the site still works — photo slots show elegant
   placeholders, and the sound toggle simply stays hidden.
   ========================================================================== */

/* -----------------------------------------------------------------------------
   1. THE BASICS — names and site-wide settings
   ----------------------------------------------------------------------------- */
export const birthdayConfig = {
  /** His name, as it should appear in "HAPPY BIRTHDAY, ___" */
  hisName: "HIS NAME",

  /** Optional nickname used sparingly (e.g. in the letter signature area). */
  hisNickname: "",

  /** Your name or nickname, used for your signature. */
  senderName: "MY NAME",

  siteTitle: "A Universe Called You",

  /** Set to false to disable the automatic corner love-note notifications. */
  enableAutomaticLoveNotes: true,

  /** Minimum seconds between automatic love-note notifications. */
  automaticNoteCooldownSeconds: 45,

  /** Set to true and add public/audio/ambient-music.mp3 to enable the sound toggle. */
  enableAmbientMusic: false,
  ambientMusicUrl: "/audio/ambient-music.mp3",
};

/* -----------------------------------------------------------------------------
   2. YOUR PERSONAL VIDEO
   ----------------------------------------------------------------------------- */
export const mediaConfig = {
  /** Replace by adding your file at public/videos/birthday-video.mp4 */
  videoSrc: "/videos/birthday-video.mp4",
  /** Still frame shown before play — replace the file at public/images/video-poster.jpg */
  videoPoster: "/images/video-poster.jpg",
  /** If true, shows the graceful "video coming soon" state instead of a broken player. */
  videoHintText:
    "Your birthday video will live right here. Until it's added, this space stays beautiful — and everything else still works.",
};

/* -----------------------------------------------------------------------------
   3. THE INTRO TEXT SEQUENCE
   ----------------------------------------------------------------------------- */
export const introLines = [
  "There are approximately eight billion people in this world.",
  "Billions of stories.",
  "Millions of places.",
  "Countless possible lives.",
  "And somehow...",
  "I got you.",
];

/* -----------------------------------------------------------------------------
   4. OUR MEMORIES — the photo gallery
   Add, remove or reorder entries freely. For each one you can set:
   image (path in public/images/memories/), title, date, caption, description.
   Leave image as "" to keep the placeholder card until you add the photo.
   ----------------------------------------------------------------------------- */
export interface Memory {
  id: string;
  image: string;
  title: string;
  date: string;
  caption: string;
  description: string;
}

export const galleryIntro = {
  heading: "A LITTLE COLLECTION OF US",
  subtitle:
    "If someone asked me to show them my favorite moments, I'd start here.",
};

export const memories: Memory[] = [
  {
    id: "memory-01",
    image: "",
    title: "A favorite memory",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-02",
    image: "",
    title: "Another favorite",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-03",
    image: "",
    title: "One more of us",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-04",
    image: "",
    title: "A moment I keep",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-05",
    image: "",
    title: "Us, somewhere",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-06",
    image: "",
    title: "A day worth keeping",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-07",
    image: "",
    title: "A quiet moment",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-08",
    image: "",
    title: "A happy day",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-09",
    image: "",
    title: "Somewhere we laughed",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-10",
    image: "",
    title: "A small adventure",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-11",
    image: "",
    title: "Just us",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
  {
    id: "memory-12",
    image: "",
    title: "One more for the collection",
    date: "",
    caption: "Replace this with my personal caption.",
    description: "",
  },
];

export const galleryOutro = {
  line1: "But photographs can only tell you so much...",
  line2: "There's something I want you to see.",
  button: "PRESS PLAY",
};

/* -----------------------------------------------------------------------------
   5. THE BIRTHDAY GREETING (after the intro)
   ----------------------------------------------------------------------------- */
export const greetingCopy = {
  intro: "HAPPY BIRTHDAY,",
  name: birthdayConfig.hisName,
  welcome: "Welcome to the little universe I made just for you.",
  playful:
    "Made with an unreasonable amount of love, a little bit of code, and an embarrassing amount of thinking about you.",
  more: "There's more waiting for you.",
  exploreButton: "Explore our memories",
};

/* -----------------------------------------------------------------------------
   6. LOVE NOTES — the little surprises
   Add, edit or remove notes freely. Each note has:
   - id: unique string
   - category: short label shown on the card
   - title: the note headline
   - message: the note itself
   - style: romantic | funny | sweet | compliment | memory | encouraging
   The messages below are SAMPLE content — replace them with things that are
   genuinely yours. The site works fine even if you leave some as-is.
   ----------------------------------------------------------------------------- */
export type LoveNoteStyle =
  | "romantic"
  | "funny"
  | "sweet"
  | "compliment"
  | "memory"
  | "encouraging";

export interface LoveNote {
  id: string;
  category: string;
  title: string;
  message: string;
  style: LoveNoteStyle;
}

export const loveNotesSection = {
  heading: "OH, AND ANOTHER THING...",
  subtitle: "There are a few things I forgot to tell you.",
  revealButton: "TELL ME SOMETHING",
  moreButton: "I NEED ANOTHER REMINDER",
  counterLabel: "REASONS I LOVE YOU DISCOVERED:",
  emptyState: "Every single reason is already in your hands. All of them.",
};

export const loveNotes: LoveNote[] = [
  {
    id: "note-01",
    category: "Adoration",
    title: "Something I adore about you",
    message:
      "Replace this with a specific thing I genuinely love about him.",
    style: "romantic",
  },
  {
    id: "note-02",
    category: "Compliment",
    title: "A compliment you've earned",
    message:
      "Replace this with a real compliment only I could give him.",
    style: "compliment",
  },
  {
    id: "note-03",
    category: "Sweet",
    title: "A small sweet thing",
    message:
      "Replace this with a sweet, honest sentence about us.",
    style: "sweet",
  },
  {
    id: "note-04",
    category: "Funny",
    title: "A ridiculous observation",
    message:
      "Replace this with something funny — an inside joke or a silly truth about him.",
    style: "funny",
  },
  {
    id: "note-05",
    category: "Romantic",
    title: "A confession",
    message:
      "Replace this with a romantic confession I'd say out loud only to him.",
    style: "romantic",
  },
  {
    id: "note-06",
    category: "Encouraging",
    title: "A reminder for hard days",
    message:
      "Replace this with the encouragement I want him to hear when things get tough.",
    style: "encouraging",
  },
  {
    id: "note-07",
    category: "Memory",
    title: "A moment I replay",
    message:
      "Replace this with a real memory I keep coming back to.",
    style: "memory",
  },
  {
    id: "note-08",
    category: "Compliment",
    title: "Something you don't notice",
    message:
      "Replace this with something wonderful about him that he probably doesn't see himself.",
    style: "compliment",
  },
  {
    id: "note-09",
    category: "Funny",
    title: "An honest announcement",
    message:
      "Replace this with a funny confession about how much I think about him.",
    style: "funny",
  },
  {
    id: "note-10",
    category: "Sweet",
    title: "A tiny promise",
    message:
      "Replace this with a small promise I intend to keep.",
    style: "sweet",
  },
  {
    id: "note-11",
    category: "Romantic",
    title: "What you feel like",
    message:
      "Replace this with what being with him actually feels like.",
    style: "romantic",
  },
  {
    id: "note-12",
    category: "Encouraging",
    title: "A cheer from your corner",
    message:
      "Replace this with the belief I have in him and his dreams.",
    style: "encouraging",
  },
  {
    id: "note-13",
    category: "Memory",
    title: "A detail I never forgot",
    message:
      "Replace this with a tiny detail from a real moment together.",
    style: "memory",
  },
  {
    id: "note-14",
    category: "Compliment",
    title: "Quality I admire",
    message:
      "Replace this with one of his qualities I genuinely admire.",
    style: "compliment",
  },
  {
    id: "note-15",
    category: "Funny",
    title: "Exhibit A",
    message:
      "Replace this with playful evidence of why he is ridiculous and I love it.",
    style: "funny",
  },
  {
    id: "note-16",
    category: "Sweet",
    title: "A quiet thank you",
    message:
      "Replace this with something I want to thank him for.",
    style: "sweet",
  },
  {
    id: "note-17",
    category: "Romantic",
    title: "The obvious one",
    message:
      "Replace this with the most obvious, undeniable reason I love him.",
    style: "romantic",
  },
  {
    id: "note-18",
    category: "Memory",
    title: "A moment frozen in time",
    message:
      "Replace this with a specific moment I wish I could relive.",
    style: "memory",
  },
  {
    id: "note-19",
    category: "Encouraging",
    title: "For his next chapter",
    message:
      "Replace this with what I hope this birthday year brings him.",
    style: "encouraging",
  },
  {
    id: "note-20",
    category: "Sweet",
    title: "The last small thing",
    message:
      "Replace this with one final small, true thing about us.",
    style: "sweet",
  },
];

/** The special note that bridges into the final letter. */
export const finalLoveNote = {
  heading: "ONE LAST INTERRUPTION.",
  message:
    "I know this entire website is about your birthday, but I think you should know that getting to love you is one of my favorite things.",
  button: "OKAY, NOW READ YOUR LETTER",
  /** Shown when enough notes have been discovered. */
  threshold: 5,
};

/** Automatic notification teasers — shown in the corner before the note opens. */
export const notificationTeasers: string[] = [
  "New discovery unlocked: someone is ridiculously in love with you.",
  "New discovery unlocked: this one comes with a compliment attached.",
  "New discovery unlocked: a reason just appeared.",
  "New discovery unlocked: you might want to sit down for this one.",
];

/* -----------------------------------------------------------------------------
   7. THE FINAL LETTER
   Paste your real letter below. Each string in `body` renders as its own
   paragraph, so press Enter between paragraphs as separate strings.
   ----------------------------------------------------------------------------- */
export const letterIntro = {
  heading: "ONE LAST THING, BEFORE YOU GO.",
  subheading: "I've been wanting to tell you this.",
  button: "OPEN YOUR LETTER",
};

export const birthdayLetter = {
  title: "To my favorite person",
  greeting: "Happy birthday, my love.",
  body: [
    "[PASTE MY PERSONAL BIRTHDAY LETTER HERE]",
  ],
  signature: `With all my love,\n${birthdayConfig.senderName}`,
};

export const letterOutro = {
  button: "FINISHED READING?",
};

/* -----------------------------------------------------------------------------
   8. THE FINAL SCENE
   ----------------------------------------------------------------------------- */
export const finalScene = {
  heading: "HAPPY BIRTHDAY, MY FAVORITE PERSON.",
  line1: "I hope this year is as wonderful as you deserve it to be.",
  line2: "Made with love, just for you.",
  restartButton: "START OUR STORY AGAIN",
};
