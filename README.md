#  LUMINA — Premium Visual Gallery

> *Where Light Meets Imagination*

A refined, immersive digital art gallery built with pure HTML, CSS, and vanilla JavaScript. LUMINA combines a dark golden-marble aesthetic with fluid animations, cinematic lightbox navigation, and Pinterest-style interaction — all with zero dependencies.

##  Live Preview 
https://coderbird1718.github.io/CodeAlpha_ImageGallery_Lumina/

##  Features

###  Design & Theme

- **Golden Marble Aesthetic** — deep obsidian background with animated gold shimmer gradients, SVG grain noise texture, and diagonal marble veins
- **Cormorant Garamond** display typography paired with Poppins — elegant and distinctive
- **Animated gold gradient** flows continuously across logo, headings, buttons, and borders
- **Glass-morphism navbar** with frosted backdrop blur and gold border

###  Gallery

- **Responsive grid** — 4 → 3 → 2 → 1 columns adapting to screen width (1200 / 900 / 600 / 380px breakpoints)
- **Category filter** — All / Nature / City / Abstract with smooth fade-scale transitions
- **Hover effects** — card lifts, image zooms, gold shimmer border materializes, overlay label fades in
- **Action buttons** appear on hover (always visible on touch devices)
  - **♡ Like** — toggles red heart with pulse animation
  - **Save / Favorite** — Pinterest-style bookmark that turns gold star

###  Lightbox

- **Cinematic image viewer** with gold-veined dark backdrop
- **Slide animation** — images slide left/right on navigation
- **← → Arrow buttons** — circular gold-bordered nav buttons
- **Keyboard navigation** — `←` `→` arrow keys, `Escape` to close
- **Touch swipe** — swipe left/right on mobile to navigate
- **Live counter** — "2 / 8" pill shows position in filtered set
- **Backdrop click** — click outside image to close

###  Interactions & Effects

- **Ripple on touch** — gold ripple burst on card tap (mobile)
- **Ripple on buttons** — like/save buttons emit a ripple on click
- **Heart pulse animation** on like activation
- **Navigation debounce** — prevents animation corruption on rapid clicks
- **Mobile menu** — slides in from right with gold border, closes on outside tap


##  File Structure

```
lumina/
│
├── index.html        # Home page — hero section
├── about.html        # About page
├── gallery.html      # Gallery with filter + grid
│
├── style.css         # All styles (merged + enhanced)
│                       ↳ Variables, navbar, hero, gallery grid,
│                         cards, lightbox, animations, responsive
│
├── main.js           # All interactivity
│                       ↳ Mobile nav, filter, lightbox, like/save,
│                         ripple effects, swipe, keyboard nav
│
└── image/            #All images ( for Nature , City and Abstract)
    
```


| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | CSS3 — custom properties, grid, backdrop-filter, mask-composite |
| Scripting | Vanilla JavaScript (ES6+) — no frameworks, no dependencies |
| Fonts | Google Fonts — Cormorant Garamond + Poppins |
| Icons | Unicode symbols  |

---
