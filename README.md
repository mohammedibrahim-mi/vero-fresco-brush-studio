# Vero Fresco Brush Studio

Build a single-page, premium product landing site for **Vero Fresco** — a free, pro-grade painting & drawing app for **Android** (phones, tablets, stylus). It is our own app, inspired by Adobe Fresco, but must use only original branding (never mention Adobe).

## Design direction
- **Light theme only.** Background warm off-white #FAFAF7, surfaces #FFFFFF, ink #0E0E10, muted text #6B6B70, hairline borders #E7E5E0.
- Signature accent = a "paint spectrum" gradient: linear-gradient(90deg, #FE3600, #FF7B02, #FAD220, #81DA42, #318EFF, #8B68E8). Use it sparingly: text highlights, progress bars, button hover glow, dividers.
- Layout and pacing modelled on cinematic tech launch sites (think terafab.ai): giant centered display headlines, tiny uppercase tracked eyebrow labels, very generous whitespace, full-bleed imagery, pinned scroll-scrubbed sections, big counter numbers, numbered steps, minimal floating pill nav.
- Typography: "Inter Tight" or "Manrope" for display (weights 500–700, tight tracking, sizes up to clamp(3rem, 10vw, 9rem)), Inter for body. Italic serif accent ("Instrument Serif") for 1–2 emphasis words per section, e.g. "*We made it free.*"
- Motion stack: **GSAP + ScrollTrigger**, **Lenis** smooth scroll, **framer-motion** for micro-interactions, **@react-three/fiber + @react-three/drei** for 3D. Respect prefers-reduced-motion (fall back to static images). Mobile responsive, no horizontal scroll.

## Imagery
Generate high-quality images (16:9, photorealistic 3D renders, soft studio light, off-white backgrounds, light theme) for these and save to src/assets:
1. hero-phone.jpg — sleek modern Android phone floating at a 3D angle, screen showing a vibrant painting in progress; ribbons of liquid paint (coral, sunflower yellow, mint, cobalt, violet) erupt from the screen and wrap around it; slim stylus floating beside.
2. live-brush.jpg — macro watercolor bloom on textured paper, cobalt blue and coral pigments feathering, floating water droplets.
3. layers.jpg — exploded 3D view of an illustration of a fox split into floating translucent glass layers (sketch, color fills, highlights), isometric.
4. animate.jpg — cartoon blue bird in flight shown as onion-skin animation frames fanning out in 3D as translucent cards.
5. brushes.jpg — sculptural 3D brush strokes floating in an arc: oil impasto, charcoal, vector ink, glitter, pastel chalk, each a vivid colour.
6. symmetry.jpg (square) — symmetrical mandala painted with mirrored coral/gold/teal strokes and a dashed center guide.
7. paint-inside.jpg, vector-trim.jpg, motion-presets.jpg (square feature cards) in the same style.
8. finale.jpg — wide panoramic shot of a creative desk scene: Android tablet and phone with finished artworks, paint ribbons flowing across the frame.

## Sections (scroll story, in order)
1. **Floating pill nav** (blurred white glass): logo "vero fresco" wordmark with a small spectrum brush-stroke mark, links Features · Brushes · Animate · FAQ, CTA "Get it on Google Play". Shrinks on scroll.
2. **Hero** — eyebrow "PAINT · DRAW · ANIMATE". Huge headline "Vero Fresco" with letters that animate in (staggered blur-to-sharp). Sub: "The pro painting & drawing app for Android. Made for everyone. Free for all." Two buttons: "Get it on Google Play" (solid ink) and "Watch the film" (outline, opens a modal with a video player — use a placeholder <video> with poster hero-phone.jpg and a src prop I can replace). Behind/below the text: an **interactive 3D scene** (R3F) — a stylized phone (rounded box with the hero painting as its screen texture) slowly rotating, surrounded by 5 animated tube-geometry paint ribbons in the spectrum colours that flow along curves (animated shader/dash offset); follows mouse with parallax; on scroll the phone tilts and scales down, ribbons unwind. Fallback to hero-phone.jpg on mobile/low-power.
3. **Statement** — large centered sentence that fills in word-by-word on scroll from grey to ink: "Thousands of brushes. Unlimited layers. Real motion. All in your pocket — and it costs nothing."
4. **The journey (pinned, 3 steps)** like a numbered scale: 01 Sketch — "Capture ideas anywhere with pressure-sensitive pencils." 02 Paint — "Live brushes that bloom, blend and smudge like the real thing." 03 Animate — "Bring drawings to life frame by frame." Left column steps highlight as you scroll; right column crossfades between brushes.jpg, live-brush.jpg, animate.jpg with subtle 3D tilt and scale.
5. **Live Brushes** — full-bleed live-brush.jpg with a clip-path reveal that expands from a small rounded rectangle to full screen on scroll, plus a canvas overlay where watercolor-like blobs bloom where the cursor moves (simple 2D canvas metaballs with blur). Headline "Brushes that *breathe*."
6. **By the numbers** — big counters animating up: "2,000+ brushes", "∞ layers", "<9 ms stylus latency", "₹0 forever". Thin spectrum progress line under each.
7. **Layers** — layers.jpg with the glass layers separating on scroll (split the image area into 3 parallax-offset cards with labels Sketch / Colour / Light). Headline "Build depth, *layer by layer*. No limits."
8. **Animate** — horizontal scroll-pinned strip of animation frames (use animate.jpg plus 5 generated frame cards), headline "Bring drawings to *life*.", bullets: Frame-by-frame, Motion paths with a fingertip, One-tap presets.
9. **Explore features** grid (4 cards, hover lift + tilt + spectrum border glow): Symmetry, Paint Inside, Vector Trim, Motion Presets — each with its image and one-line description.
10. **Brush packs** carousel (like a chip lineup): Watercolour, Oil, Ink & Vector, Pastel & Charcoal, "…and beyond". Cards rotate in on scroll.
11. **Sketch here, finish anywhere** — split comparison "Other apps" vs "Vero Fresco" (paywalled brushes, layer limits, ads vs free, unlimited layers, no ads, cloud sync & PSD export).
12. **Finale** — full-bleed finale.jpg with slow Ken Burns zoom, overlay headline "Creativity is *free*." and Google Play button + QR code placeholder.
13. **FAQ** accordion: Is Vero Fresco free? Is there a layer limit? Which Android devices are supported (Android 9+, S Pen & USI stylus)? Can I export to PSD/PNG/MP4? How do I add brushes?
14. **Footer** minimal: wordmark, links, © 2026 Vero Fresco.

Polish: custom cursor that becomes a small paint dot leaving a fading spectrum trail on desktop; section transitions with soft fade/translate; buttons with magnetic hover; page loader that paints the logo stroke then wipes away. Keep performance good (lazy-load images, dynamic import the 3D canvas).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/80e6b542-9460-451c-88e1-4b52c7ab27d1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
