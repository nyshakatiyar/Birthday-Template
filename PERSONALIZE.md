# Personalizing "A Universe Called You"

Everything you need to change lives in **one file**:

```
src/content/birthday.ts
```

It is organized and commented so you can edit it top to bottom.

## The 5-minute guide

| What to change | Where |
| --- | --- |
| His name / your name | `birthdayConfig` → `hisName`, `senderName` |
| Intro lines ("eight billion people...") | `introLines` |
| Greeting wording | `greetingCopy` |
| Photographs | Add files to `public/images/memories/`, then fill the `memories` array (image, title, date, caption, description). Leave `image: ""` to keep the elegant placeholder card. Add/remove/reorder entries freely. |
| Gallery heading & captions | `galleryIntro`, `galleryOutro` |
| Your birthday video | Add the file at `public/videos/birthday-video.mp4`. The poster shown before play is `public/images/video-poster.jpg`. The player and "video coming soon" state update automatically. |
| Love notes (20 of them) | `loveNotes` — edit each `title`, `message`, `category`, `style`. Add or remove notes freely; the discovery counter updates itself. |
| The special final note | `finalLoveNote` |
| Automatic pop-ups on/off | `birthdayConfig` → `enableAutomaticLoveNotes` (and cooldown seconds) |
| The final letter | `birthdayLetter` → `body` is an array of strings; each string renders as one paragraph. Replace the bracketed placeholder with your real letter. Signature: `birthdayLetter.signature`. |
| Final scene wording | `finalScene` |
| Ambient music | Add the file at `public/audio/ambient-music.mp3` and set `birthdayConfig` → `enableAmbientMusic` to `true`. Until then the sound toggle stays hidden — no broken controls. |

## Colors & fonts

The cosmic palette and fonts (Cormorant Garamond, DM Sans, Caveat) are defined
as design tokens in `src/styles.css` — the color values live in the `:root`
block. Change them there once and the whole site follows.

## Notes

- Discovery progress ("REASONS I LOVE YOU DISCOVERED") is saved in the
  visitor's browser, so his progress survives a refresh.
- Nothing here needs a database or backend — the site is a beautiful static
  experience you can publish as soon as it's personalized.
