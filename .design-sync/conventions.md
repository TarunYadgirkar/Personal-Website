# Tarun Personal Site DS — conventions

Dark-theme personal-site system: near-black background, warm amber accent, Schibsted Grotesk for text, IBM Plex Mono for labels/metadata.

## Wrap every design in PageRoot

`PageRoot` supplies the dark background (`#0b0e15`), foreground color (`#e7eaf2`), and both font families — the same styling the site's `<body>` gets. Without it, text renders near-white on white and fonts fall back to system-ui.

```jsx
import { PageRoot, SectionHeading, StatusTag, Tags } from window.TarunSiteDS;

<PageRoot>
  <SectionHeading eyebrow="Index / 01" title="Featured work" />
  <StatusTag>Shipped prototype</StatusTag>
  <Tags items={["FPGA", "Embedded ML", "Signal Processing"]} />
</PageRoot>
```

Do not pass `staticMotion` in real UIs — it exists only for static screenshot contexts and freezes all framer-motion animation at its final state.

`MotionProvider` (optional) wraps the tree once to make animations honor the OS reduced-motion preference.

## Styling idiom

The stylesheet is compiled Tailwind output from the site — **only utility classes the site itself uses exist**. Color/typography and the layout classes below are safe; anything else (`bg-gray-800`, `p-4`, `rounded-lg`, arbitrary values) is NOT in the stylesheet — fall back to inline styles when a class isn't listed.

| Family | Classes that exist |
|---|---|
| Text color | `text-fg` #e7eaf2 · `text-fg-muted` #98a1b3 · `text-fg-faint` #7d87a3 · `text-accent` #e2a264 · `text-accent-bright` #edb57c · `text-bg` |
| Background | `bg-bg` #0b0e15 · `bg-surface` #111622 · `bg-accent` · `bg-accent-dim` (14% amber) · `bg-line` |
| Border | `border-t/-b/-l` · `border-line` (8% line) · `border-line-strong` (18%) · `border-accent` |
| Type | `font-mono` (IBM Plex Mono) · `font-medium` · `text-xs/sm/base/lg/xl` |
| Layout | `flex` `flex-col` `flex-wrap` `grid` `items-center/start` `justify-between/center` · `gap-1/2/3/4/5/6/8/16` · `p-5/6/7` `px-2/5/6` `py-4/5/6/8/12/28` · `mt-1…24` `mb-10` · `max-w-xl/2xl/3xl/5xl` · `w-full` `h-10` `h-16` |

CSS custom properties available everywhere under `PageRoot`: `--color-bg`, `--color-fg`, `--color-accent`, `--font-schibsted`, `--font-plex-mono` — prefer `var(--color-accent)` etc. in inline styles for anything not covered by a class.

## Component roles

- `SectionHeading` — section title with a small amber square marker (`title`, optional `id`). No eyebrow labels anywhere in this system; never add small uppercase-tracked labels above headings.
- `StatusTag` — small amber-tinted status chip (`Shipped prototype`, `Research · ongoing`).
- `Tags` — mono tag list (`items: string[]`) for stacks/skills.
- `ExternalLink` — amber mono anchor with ↗, opens new tab.
- `SystemMark` — the site logo mark; `Footer` — the full site footer.
- `Reveal` / `HeroReveal` — scroll-in / mount entrance wrappers; `Pressable` — tap-scale wrapper.
- `SignalTrace` — the signature amber waveform divider (give it an explicit height via `className` like `h-10 w-full` — those two utilities exist).

## Where the truth lives

Read `styles.css` and its imports (`_ds_bundle.css`, `tokens`/fonts) before styling; per-component APIs are in each `components/general/<Name>/<Name>.d.ts` with usage in the matching `.prompt.md`.
