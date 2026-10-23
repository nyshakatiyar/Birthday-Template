<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project decisions

- The birthday site is a single-route, scroll-driven experience (`src/routes/index.tsx`); all personal content lives in `src/content/birthday.ts` so it can be personalized without touching components.
- Design tokens (cosmic palette, fonts) are defined in `src/styles.css`; components never hardcode colors.
- Ambient audio is feature-flagged (`enableAmbientMusic`); the sound toggle hides itself when the music file is missing rather than showing a broken control.
- `motion` (Motion for React) is the animation library for this project; decorative effects use CSS/canvas, no 3D libraries.

