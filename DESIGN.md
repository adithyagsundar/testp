---
name: Adithya Gnanasundar
description: A software engineer's portfolio. One confident statement, then the evidence, set on a cool printed handout.
colors:
  handout-paper: "#f5f6f8"
  raised-sheet: "#ffffff"
  ink: "#111318"
  ink-secondary: "#464c57"
  ink-tertiary: "#6a717d"
  hairline-rule: "#d6dae1"
  hairline-rule-strong: "#b9bfc9"
  highlighter: "#ffe24a"
  cobalt: "#1f35e0"
  cobalt-deep: "#1528b8"
  on-cobalt: "#ffffff"
  slate-paper: "#0e1116"
  slate-raised: "#161a21"
  slate-ink: "#eceef2"
  slate-ink-secondary: "#a9b0bc"
  slate-ink-tertiary: "#8a919e"
  slate-rule: "#252b35"
  slate-rule-strong: "#384050"
  cobalt-night: "#9aa8ff"
  cobalt-night-hover: "#c0c8ff"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.4rem + 5.2vw, 5.6rem)"
    fontWeight: 620
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.6rem + 2vw, 3.1rem)"
    fontWeight: 640
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title-lg:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.32rem + 0.9vw, 2.05rem)"
    fontWeight: 640
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.12rem + 0.4vw, 1.42rem)"
    fontWeight: 640
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.32rem + 0.9vw, 2.05rem)"
    fontWeight: 450
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.15vw, 1.08rem)"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "clamp(0.8rem, 0.78rem + 0.1vw, 0.86rem)"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "10px"
  lg: "20px"
  pill: "999px"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "4.5rem"
  s-9: "7rem"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.on-cobalt}"
    rounded: "{rounded.pill}"
    padding: "0.55em 1.05em"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.55em 1.05em"
    height: "44px"
  button-small:
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0.5em 0.95em"
    height: "40px"
  chip:
    backgroundColor: "{colors.handout-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0.3em 0.75em"
  nav-link:
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "0.5em 0.75em"
  cursor-pill:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.handout-paper}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.8rem"
  details-toggle:
    textColor: "{colors.cobalt}"
    typography: "{typography.meta}"
    height: "44px"
  portrait:
    rounded: "{rounded.lg}"
    aspectRatio: "4 / 5"
---

# Design System: Adithya Gnanasundar

## Overview

**Creative North Star: "The Highlighted Handout"**

The site is a quiet, typographic sheet. It makes one confident statement in a large grotesk, then lays out the evidence in hairline-ruled rows. There is no annotation layer, no demo and no instructional copy. Only two things survive from the earlier fieldwork-notation world: the cool printed handout ground, and a single yellow highlighter that marks what is live, current or under the pointer.

The material is a cool, near-white sheet with near-black ink, grey hairlines, one highlighter and cobalt ink kept for links and actions. Dark mode turns the sheet to blue-black slate. The highlighter stays the same yellow and cobalt lightens to periwinkle. Depth is almost absent. Hierarchy comes from type scale, weight and hairlines. The one shadow appears only when something is physically lifted off the sheet.

Motion is smooth and unhurried. Everything settles on critically damped springs, so nothing bounces or wobbles, and every moving value can be interrupted from wherever it is on screen. Entrances share one 1.1s spring. The hero letters come in from a soft blur, headings rise out of a mask, and pointer-driven layers (the letter lift, the dot field, the nav pill, the cursor pill, magnetic buttons) ease toward their targets. A chip that has been thrown is the only thing allowed a little give. Under reduced motion, all of it becomes instant state changes and cross-fades.

**Key Characteristics:**
- One column, one display statement, then ruled rows of evidence.
- Hairline (1px) rules for structure, never boxes with fills.
- The highlighter is the only marker of live, current or hovered state.
- Cobalt means "this does something". Nothing decorative is cobalt.
- Pill-shaped controls that press down to 0.97 scale.
- Critically damped spring motion, with a full fallback for reduced motion.

## Colors

A cool, nearly achromatic handout with two inks that each have one job: highlighter yellow for state and cobalt for action.

### Primary
- **Cobalt Ink** (cobalt; hover cobalt-deep): links, the primary button, the skip link, the experience "Details" toggle, the text caret and the focus ring. In dark mode it becomes **Periwinkle Cobalt** (cobalt-night / cobalt-night-hover), and text on cobalt flips to slate-paper.

### Secondary
- **Highlighter Yellow** (highlighter): the marker of live and current state. It sweeps under a work title on hover, fills the three hero highlight dots (each ringed with a 1px ink line), fills the current-role dot on the experience timeline, draws the 2px reading-progress bar under the nav, and colours text selection. Text on it is always ink (#111318), in both themes.

### Neutral
- **Handout Paper** (handout-paper) / **Slate** (slate-paper): page ground, and the resting fill of chips and timeline dots.
- **Raised Sheet** (raised-sheet / slate-raised): a chip while it is grabbed.
- **Ink** (ink / slate-ink): headlines, titles, body text, the timeline's progress fill and the cursor pill's fill.
- **Ink Secondary** (ink-secondary / slate-ink-secondary): the hero sub line, work descriptions, roles, case-study prose, nav links at rest and highlight links.
- **Ink Tertiary** (ink-tertiary / slate-ink-tertiary): meta lines, stacks, dates, skill-row labels and the hero dot field.
- **Hairline** (hairline-rule / slate-rule): row dividers, the footer rule, chip borders, the timeline rail and the nav pill's inset edge.
- **Hairline Strong** (hairline-rule-strong / slate-rule-strong): resting button borders, chip borders on hover and the scrollbar thumb.
- Translucent tokens: scrim `rgb(17 19 24 / 0.04)` (dark: `rgb(255 255 255 / 0.03)`) for the nav pill and hover wash; nav material `rgb(245 246 248 / 0.72)` (dark: `rgb(14 17 22 / 0.7)`).

### Accessibility overrides
- **prefers-contrast: more** darkens ink-secondary to #2b3038, ink-tertiary to #3c424c and the hairline to #8e95a1, and makes the nav opaque. In dark mode it lifts them to #d3d7de, #c0c5ce and #6b7382.
- **prefers-reduced-transparency: reduce** makes the nav material solid paper.

### Named Rules
**The Highlighter Rule.** Yellow means live, current or hovered, and nothing else. Never use it as a decorative fill, section background or brand wash. Text on it is always ink.

**The Cobalt Rule.** Cobalt is for actions and links only. If you can't click it, it isn't cobalt. Headings, titles and emphasis stay ink, and whole-row links keep their title in ink.

## Typography

**Display Font:** Bricolage Grotesque Variable with the optical-size axis on (`font-optical-sizing: auto`), falling back to system-ui.
**Body Font:** Bricolage Grotesque Variable, same stack.
**Label/Mono Font:** none. The site ships one face, Bricolage Grotesque Variable, including the dev-only TODO badge.

**Character:** One lively, ink-trap grotesk does everything. Heavy fractional weights (620–650) carry statements and titles, and the optical-size axis keeps the large display cuts tight and the small meta text open.

### Hierarchy
- **Display** (620, clamp 2.6–5.6rem, 1.02, -0.03em, max 15ch): the hero statement only. Contact's closing line and case-study titles use a sibling size (clamp 2.4–4.8/5rem, -0.035em, line-height 0.98–1).
- **Headline** (640, step 3, 1.02, -0.03em): section h2s, revealed word by word from a mask.
- **Title Large** (640, step 2, -0.025em): work titles and the case study's "next project" link (620 there).
- **Title** (640, step 1, 1.2, -0.01em): h3s such as experience orgs and research titles. The hero sub line uses step 1 at 400, 1.45, ink-secondary, max 38ch.
- **Lede** (450, step 2, 1.35, -0.015em, max 40ch): the opening line of a case study.
- **Body** (400, step 0, 1.6): prose, capped at a 68ch measure.
- **Meta** (step −1, ink-tertiary): context lines, stacks, dates, skill labels and highlight links. Dates use tabular figures.
- The scale is fluid: five clamp steps (−1 … 3) running from about 0.8rem to 3.1rem, plus the display clamp.

### Named Rules
**The One Face Rule.** Every line of content is set in Bricolage Grotesque. Hierarchy comes from size, weight (400 / 520–560 / 600 / 620–650) and ink tone, never from a second family.

## Layout

There is one centred column of `min(1180px, 100% - 2 × gutter)`, with a fluid gutter of clamp 1.25–3rem. The hero is a single column over a faint dot field: the statement (max 15ch), a one-line sub (max 38ch, 1.5rem below), pill actions (2rem below, 0.75rem gaps) and three highlight links (3rem below). It pads clamp 3–6.5rem above and clamp 4–7rem below.

Sections pad 4.5rem above and 2rem below, and each opens with its heading alone, 2rem above the content. Content is a stack of hairline-ruled rows separated by top borders, with a closing bottom border on the last row, rather than gaps or cards. Work rows are a two-column grid (`1fr auto`): title, description and stack on the left, and context and date right-aligned. Below 640px the context moves above the title on one line. Skills use an 11rem label column that collapses below 640px. Experience hangs off a 2px timeline rail inset 2.25rem. Case studies run the title (max 16ch), a lede (max 40ch), an auto-fit facts grid (min 14rem columns) and a 68ch body.

The spacing rhythm is a single nine-step scale (0.25 → 7rem). The sticky nav is 4.25rem tall, anchors scroll with a 5.5rem scroll padding, and hides its section links below 880px. Contact closes the page with 7rem of bottom padding.

## Elevation & Depth

The sheet is flat. Structure comes from hairlines and tone, and the sheet uses exactly one shadow, which belongs to a chip while it is grabbed. The cursor pill is a solid ink fill with no shadow. Chrome uses material, not shadow. The nav is transparent at the top of the page, turns into blurred translucent paper (18px blur, 170% saturate) once content scrolls under it, and fades into the page through an 18px gradient edge instead of a divider line. The hero's dot field sits behind the content, masked by a radial fade toward the upper right.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 1px 2px rgb(17 19 24 / 0.06), 0 8px 24px -8px rgb(17 19 24 / 0.14)`; dark `0 1px 2px rgb(0 0 0 / 0.4), 0 10px 30px -10px rgb(0 0 0 / 0.6)`): a grabbed chip.

### Named Rules
**The Lifted-Only Rule.** Surfaces at rest have no shadow. A shadow means "this is in your hand right now".

## Shapes

Controls are pills (999px): buttons, chips, nav links, the nav pill, the theme toggle and the cursor pill. Status marks are circles: highlight dots and timeline dots. The hero portrait is the only large rounded surface (20px corners, 4:5). The skip link and dev badge use 6px. The highlighter mark is a flat band 0.3em tall sitting at 88% of the line, so it reads as a marker stroke under the words rather than a box. Lines are 1px hairlines everywhere. The experience timeline rail is the only 2px line, and the reading-progress bar is 2px of highlighter. The focus ring is 2px cobalt, offset 3px with 4px corners. A whole work row takes the ring at 4px offset with 10px corners. Icons are authored line drawings on a 24px grid with a 1.75 stroke and round caps.

## Components

### Buttons
Tactile, rounded and quiet unless they are the action.
- **Shape:** full pill (999px), minimum 44px tall, padding 0.55em 1.05em, weight 600, icons at 1.05em.
- **Primary:** cobalt fill, on-cobalt text. Each surface has one primary: Resume in the hero and nav, email in Contact.
- **Secondary:** transparent with a strong-hairline border and ink text. On hover the border goes to ink.
- **Small:** the nav's Resume button, 40px tall at meta size.
- **Hover / Focus:** hover only on fine pointers (primary deepens to cobalt-deep). Focus uses the global 2px cobalt ring.
- **Press:** `scale(0.97)` with a 100ms transition. The theme toggle presses to 0.94.
- **Magnetic:** on fine pointers, action buttons drift up to 6px horizontally and 4px vertically toward the pointer on critically damped springs (response 0.5s), and settle back on leave.
- **Copy-email morph:** the label swaps to "Copied" through a 3px blur bridge with a 4px vertical slide (240–280ms).

### Chips
- **Style:** paper fill, hairline border, pill, meta size, weight 520. On hover the border goes to strong hairline.
- **State:** on fine pointers they can be grabbed. A grabbed chip turns raised-sheet with an ink border and the Lift shadow. It follows the pointer 1:1 for 60px, then resists through a rubberband (constant 0.55), tilts up to 6° with velocity, and springs home on release (damping 0.8, response 0.55s, carrying 30% of the throw velocity).

### Cards / Containers
- No cards. Every list is a stack of hairline-ruled rows.
- **Work row:** the whole row is one link. On hover the highlighter sweeps under the title from 0 to 100% over 520ms on the ease-out curve, and an up-right arrow fades in from 4px down-left (420ms). On touch the arrow is always visible. The description sits in ink-secondary (max 60ch), the stack is meta text joined with middots, and the context and date sit at the right in ink-tertiary.
- **Research row:** an ink title with a small arrow when a paper link exists, the venue at 560, then status, year and role in meta tones.
- **Experience entry:** timeline dot (0.9rem circle, 2px ink border, paper fill, highlighter fill for the current role), org title, role line and summary. A cobalt "Details" toggle with a rotating chevron opens a grid-rows drawer (320ms drawer curve). The rail fills with ink as you scroll.

### Navigation
- Sticky, with the name as plain text at weight 650 (no logo tile).
- Links are ink-secondary pills (weight 520) that turn ink on hover or when current. A scrim pill with a hairline inset slides between them on critically damped springs (response 0.42s) for both position and width. Without JS the current link gets the scrim directly.
- A 44px circular theme toggle swaps the sun and moon icons with rotate, scale and blur. The new theme grows as a circle from the toggle over 700ms on the drawer curve. A 2px highlighter progress bar runs along the bottom edge.

### Hero
- The statement splits into letters that settle in from 0.35em below and blur(6px) to sharp, staggered 22ms, on the shared 1.1s no-bounce spring. The sub line, actions and highlights follow at 100ms intervals from 0.55s.
- On fine pointers, letters within 180px of the pointer lift up to 10px on a critically damped field (response 0.6s). It is a lift only, with no rotation.
- **Dot field:** a 26px grid of ink-tertiary dots at 28% opacity. Within 170px of the pointer, dots part up to 22px, grow and darken, easing at a 0.07 lerp per frame. It fades in over 1.6s.
- On scroll, the statement drifts down 60px and fades to 40%, and the field fades out across the hero's height.
- **Highlight links:** three meta-size ink-secondary links, each led by a 0.38rem highlighter dot. They turn ink on hover.

### Cursor Pill (signature)
- On fine pointers over a work row, a small ink pill reading "Open →" appears in place beside the cursor (fading in from 0.8 scale). It follows on critically damped springs (response 0.4s) and leans up to 5° with horizontal velocity before settling level. It hides on scroll and never flies in from a corner.

### Motion grammar
- **Entrances:** one spring for everything (no bounce, 1.1s). Rows reveal from 24px below at 80ms intervals as they enter the viewport. Headings rise word by word from a mask at 80ms intervals.
- **Springs** are parameterised as damping ratio and response time in seconds. The default is critically damped (1.0 / 0.4s). Retargeting keeps the current position and velocity, and 2D motion splits into independent X and Y springs.
- **Curves** for CSS transitions: ease-out `cubic-bezier(0.23, 1, 0.32, 1)` for state changes, and drawer `cubic-bezier(0.32, 0.72, 0, 1)` for disclosures, the theme reveal and 420ms view transitions. Colour changes run 160–200ms ease.
- **Reduced motion:** the motion layer is skipped. Reveals show at full opacity, the dot field is removed, the theme swaps instantly, view transitions take 1ms and the drawer only cross-fades.

### Portrait

- The hero's right column holds the headshot in a 4:5 frame with 20px corners and the Lift shadow. On mobile (860px and below) it shrinks to 9rem and sits above the headline.
- On load it is unveiled from the bottom edge (a clip-path inset, 1.2s, drawer curve) while the image settles from scale 1.18 to 1.04. On fine pointers it tilts toward the cursor (up to 8 degrees; rotateX and rotateY on separate critically damped springs, response 0.6).

### Phrase-structure underlines

- The site's one linguistics motif. Thin bracket lines (1.25px, ink-3 at 55%) sit under the constituents of three lines only: the hero headline ([NP Adithya] [V builds] [NP backends, pipelines, and infrastructure.]), "Selected work" ([Adj] [N]) and "Let's build something." ([VP] [NP]).
- Each bracket has end ticks. A phrase that wraps gets one bracket per line. The category label (10px, 600, tracked) sits in a paper-coloured notch cut into the line, so it adds no height.
- The brackets draw left to right with stroke-dashoffset (900ms ease-out, 160ms between constituents) once the text has settled. Hovering a phrase darkens its bracket to ink. Under reduced motion they are drawn static.
- Never add labels beyond simple phrase categories, and never put the motif on more than a few display lines.

### Polish motion

- The nav hides when scrolling down past 480px and returns on any upward scroll (translateY on the drawer curve, 520ms).
- Work row dividers draw in from the left on reveal (scaleX, 1.2s ease-out). A soft highlighter radial glow (16%) follows the pointer within a hovered row.
- Timeline dots fill from the centre as the drawn rail reaches them.
- Skill chips cascade in (opacity, scale 0.92 to 1, 35ms stagger).
- The portrait image drifts 40px inside its frame across the hero's scroll.
- Anchor links scroll smoothly; keyboard shortcuts stay instant.

### Cursor

- On fine pointers only, the native cursor is replaced by a 6px ink dot that tracks the pointer 1:1, plus a 34px ring (1.5px, ink at 45%) that trails it on a critically damped spring (response 0.2s, with X and Y on separate springs).
- Over buttons, nav links, the theme toggle and text links that act as controls, the ring morphs to the control's own box (+5px, matching its radius) and leans 12% toward the real pointer, as the iPadOS pointer does. The dot hides while it is snapped.
- Over a work row the ring becomes a solid ink pill reading "Open"; over a skill chip it reads "Drag". Pressing scales the ring to 0.85.
- Touch devices and reduced-motion users keep the native cursor behaviour (under reduced motion, positions set without springs).

### Scroll-linked motion

- Scroll-linked motion is progressive enhancement through CSS scroll timelines (`animation-timeline: view()` / `scroll(root)`), so it runs on the compositor. It applies only when supported and motion is allowed.
- Section headings drift ±28px across their pass through the viewport.
- Work rows focus around the middle of the screen: about 0.25 opacity and +18px on entry, full in the middle band, easing to 0.55 on exit.
- Research and skill rows rise 36px in as they enter. Where scroll timelines are unsupported, these rows use the JS reveal instead.
- "Let's build something." grows from 0.88 scale as it enters.
- The portrait recedes (scale 0.9, opacity 0.35, +40px) over the first 90vh of scroll.

## Do's and Don'ts

### Do:
- **Do** lead with one display statement and let hairline-ruled rows carry the evidence.
- **Do** use the highlighter only for live, current or hovered state, with ink text on top.
- **Do** keep cobalt for links and actions, with one cobalt primary button per surface.
- **Do** separate content with 1px hairlines and keep surfaces at rest flat.
- **Do** move values on critically damped, interruptible springs that start from the on-screen value, and provide an instant or cross-fade path under reduced motion.
- **Do** keep touch targets at 44px minimum and press feedback at scale 0.97.
- **Do** gate hover effects behind `(hover: hover) and (pointer: fine)`.

### Don't:
- **Don't** add eyebrow kickers or small uppercase labels above headings. Headings stand alone.
- **Don't** introduce a second typeface for content. Bricolage Grotesque sets every line of content.
- **Don't** use yellow as decoration or cobalt for anything that isn't clickable.
- **Don't** build card grids of identical tiles. Use ruled rows.
- **Don't** add shadows to surfaces at rest, or hard offset shadows anywhere.
- **Don't** ship visible TODO or evidence placeholders to production. The dashed TODO badge renders only in dev with `PUBLIC_SHOW_TODO=true`.
- **Don't** use cream or warm paper. The ground is a cool handout grey or blue-black slate.
- **Don't** add bounce or wobble. Only a thrown chip may overshoot, and only gently.
