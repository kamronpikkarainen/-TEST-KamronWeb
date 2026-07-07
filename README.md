# Kamron Web — Studio Site

Single-page, scroll-driven site for Kamron Web: a solo web design studio in
Raleigh, NC building premium websites exclusively for Triangle-area local
service businesses. One client per niche, per city, locked for 12 months.

## Run it

```bash
npm install
npm run dev           # local dev server
npm run build         # production build → dist/
npm run preview       # serve the production build
npm run build:single  # everything inlined into one file → dist-single/index.html
```

## Stack

- **React + Vite** — app framework and build
- **React Three Fiber + drei** — the 3D hero (floating GreenEdge browser mockup)
- **GSAP + ScrollTrigger** — every scroll-driven reveal, pin, and scrub
- **Lenis** — smooth scroll, driven by the GSAP ticker
- **Tailwind CSS** — layout and utility styling

## Architecture notes

- **Liquid-glass visual language.** Light silver ground with a blueprint
  grid and prismatic blobs (`src/components/Backdrop.jsx`), frosted
  panels and iridescent edges (`.glass`, `.glass-iridescent` in
  `src/index.css`), and a refractive crystal-and-ring hero sculpture
  (`MeshTransmissionMaterial`).
- **One lighting rig for the whole page.** `src/lib/lighting.js` defines the
  white upper-left key light and cool fill used by the 3D scene; every
  2D gloss/shadow on the page follows the same direction
  (`.key-sheen` in `src/index.css`).
- **Genuine fallbacks.** `src/lib/perf.jsx` detects `prefers-reduced-motion`,
  low-power devices, and missing WebGL. Reduced-motion gets a fully static
  page (default DOM state everywhere is the finished state); low-power gets
  a CSS-only 3D hero. The entire three.js stack is in a lazy chunk that
  never loads unless it will be used.
- **One component per section** under `src/components/`.

## Placeholders to replace before launch

Search the codebase for `PLACEHOLDER`:

- Real GreenEdge performance numbers (Portfolio)
- Before-screenshot of GreenEdge's old site (Portfolio)
- Carolina Climate Elite + AERLUME case studies (Portfolio)
- Real screenshot texture of the live GreenEdge site (hero `screenTexture.js`)
- GreenEdge's locked city on the exclusivity board (Exclusivity)
- Booking/scheduling link (CTA)
- Instagram handle (Footer)
