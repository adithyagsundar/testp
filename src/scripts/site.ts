import { animate, stagger } from 'motion';
import { Spring, prefersReducedMotion, finePointer } from './spring';
import { initCursor } from './cursor';
import { splitLetters, letterField, dotField, navPill, splitHeadings, flingChips, heroParallax, portraitTilt, phraseLines, rowGlow } from './effects';

const reduced = prefersReducedMotion();
const fine = finePointer();
const root = document.documentElement;

/* One smooth spring for every entrance: critically damped, unhurried */
const SMOOTH = { type: 'spring' as const, bounce: 0, duration: 1.1 };

/* ── Theme: follows the system until the visitor chooses ─────────────── */
function setTheme(next: 'light' | 'dark') {
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) =>
    b.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`),
  );
}
document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
  btn.setAttribute('aria-label', `Switch to ${root.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    // The new theme grows out of the toggle itself, with no brightness flash
    if (!document.startViewTransition || reduced) return setTheme(next);
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('theme-swap');
    const vt = document.startViewTransition(() => setTheme(next));
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.32, 0.72, 0, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
    vt.finished.finally(() => root.classList.remove('theme-swap'));
  });
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  let saved: string | null = null;
  try { saved = localStorage.getItem('theme'); } catch {}
  if (!saved) root.dataset.theme = e.matches ? 'dark' : 'light';
});

/* ── Nav material + reading progress ─────────────────────────────────── */
const nav = document.querySelector<HTMLElement>('[data-nav]');
const bar = document.querySelector<HTMLElement>('[data-progress]');
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const y = scrollY;
    nav?.toggleAttribute('data-scrolled', y > 8);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    updateTimeline();
  });
}
addEventListener('scroll', onScroll, { passive: true });

/* ── Current section in the nav ──────────────────────────────────────── */
const links = new Map<string, HTMLElement>();
document.querySelectorAll<HTMLElement>('[data-section-link]').forEach((a) => links.set(a.dataset.sectionLink!, a));
if (links.size) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        links.get(en.target.id)?.setAttribute('aria-current', 'true');
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  // Back over the hero, no section is current
  const top = document.getElementById('top');
  if (top) io.observe(top);
}

/* ── Keyboard: 1 top, 2–6 sections. Instant, never animated. ─────────── */
const sectionKeys: Record<string, string> = { '1': 'main', '2': 'work', '3': 'experience', '4': 'research', '5': 'skills', '6': 'contact' };
addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
  const t = e.target as HTMLElement;
  if (t.closest('input, textarea, select, [contenteditable]')) return;
  const id = sectionKeys[e.key];
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) { location.href = `/#${id}`; return; }
  el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
  const h = el.querySelector<HTMLElement>('h2') ?? el.querySelector<HTMLElement>('h1');
  if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  history.replaceState(null, '', `#${id}`);
});

/* ── Hero: letters settle in, softly, once ───────────────────────────── */
splitLetters(document);
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero && !reduced) {
  hero.querySelectorAll<HTMLElement>('.hero__w').forEach((w) => (w.style.opacity = '1'));
  const letters = hero.querySelectorAll<HTMLElement>('.ch');
  animate(letters, { opacity: [0, 1], y: ['0.35em', '0em'], filter: ['blur(6px)', 'blur(0px)'] }, { ...SMOOTH, delay: stagger(0.022) });
  animate(hero.querySelectorAll('[data-hero-in]'), { opacity: [0, 1], y: [12, 0] }, { ...SMOOTH, delay: stagger(0.1, { startDelay: 0.55 }) });
  const field = hero.querySelector<HTMLElement>('[data-field]');
  if (field) animate(field, { opacity: [0, 1] }, { duration: 1.6, ease: 'easeOut', delay: 0.3 });
  // Portrait: unveiled from the bottom edge while the image settles from a slight zoom
  const frame = hero.querySelector<HTMLElement>('[data-portrait-frame]');
  const img = hero.querySelector<HTMLElement>('.portrait__img');
  const portrait = hero.querySelector<HTMLElement>('[data-portrait]');
  if (portrait) portrait.style.opacity = '1';
  if (frame) animate(frame, { clipPath: ['inset(100% 0% 0% 0% round 20px)', 'inset(0% 0% 0% 0% round 20px)'] }, { duration: 1.2, ease: [0.32, 0.72, 0, 1], delay: 0.25 });
  if (img) animate(img, { scale: [1.18, 1.04] }, { duration: 1.6, ease: [0.23, 1, 0.32, 1], delay: 0.25 });
}
const portraitEl = document.querySelector<HTMLElement>('[data-portrait]');
root.classList.remove('intro');

/* ── Reveal on scroll: content is visible without JS ────────────────── */
const scrollTimelines = CSS.supports('animation-timeline: view()') && !reduced;
const revealables = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter((el) => {
  if (scrollTimelines && el.hasAttribute('data-scroll')) { el.style.opacity = '1'; el.setAttribute('data-in', ''); return false; }
  return true;
});
if (reduced) {
  revealables.forEach((el) => { el.style.opacity = '1'; el.setAttribute('data-in', ''); });
} else {
  const queue: HTMLElement[] = [];
  let flush = 0;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        queue.push(en.target as HTMLElement);
      });
      cancelAnimationFrame(flush);
      flush = requestAnimationFrame(() => {
        const batch = queue.splice(0);
        animate(batch, { opacity: [0, 1], y: [24, 0] }, { ...SMOOTH, delay: stagger(0.08) });
        batch.forEach((el, bi) => {
          el.setAttribute('data-in', '');
          const chips = el.querySelectorAll<HTMLElement>('.chip');
          if (chips.length) animate(chips, { opacity: [0, 1], scale: [0.92, 1], y: [6, 0] }, { ...SMOOTH, duration: 0.9, delay: stagger(0.035, { startDelay: 0.12 + bi * 0.08 }) });
        });
      });
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
  );
  revealables.forEach((el) => io.observe(el));
}

/* ── Experience: disclosure + the timeline drawing itself ────────────── */
document.querySelectorAll<HTMLButtonElement>('[data-disclose]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.querySelector('.exp__toggle-label')!.textContent = open ? 'Details' : 'Hide details';
  });
});
const timeline = document.querySelector<HTMLElement>('[data-timeline]');
const fill = document.querySelector<HTMLElement>('[data-timeline-fill]');
function updateTimeline() {
  if (!timeline || !fill || reduced) return;
  const r = timeline.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
  fill.style.setProperty('--fill', p.toFixed(3));
  const lineY = r.top + r.height * p;
  timeline.querySelectorAll<HTMLElement>('.exp__dot').forEach((d) => {
    d.toggleAttribute('data-reached', d.getBoundingClientRect().top + 6 <= lineY);
  });
}
updateTimeline();
onScroll();

/* ── Magnetic actions: drift toward the pointer, critically damped ───── */
if (fine && !reduced) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    let tx = 0, ty = 0;
    const apply = () => (el.style.translate = `${tx}px ${ty}px`);
    const sx = new Spring(0, (v) => { tx = v; apply(); }, { dampingRatio: 1, response: 0.5 });
    const sy = new Spring(0, (v) => { ty = v; apply(); }, { dampingRatio: 1, response: 0.5 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      sx.to(((e.clientX - (r.left + r.width / 2)) / r.width) * 6);
      sy.to(((e.clientY - (r.top + r.height / 2)) / r.height) * 4);
    });
    el.addEventListener('pointerleave', () => { sx.to(0); sy.to(0); });
  });
}

/* ── Copy email ──────────────────────────────────────────────────────── */
const hint = document.querySelector<HTMLElement>('.kbd-hint');
document.querySelectorAll<HTMLButtonElement>('[data-copy-email]').forEach((btn) => {
  let t: number | undefined;
  btn.addEventListener('click', async () => {
    const email = btn.dataset.copyEmail!;
    try {
      await navigator.clipboard.writeText(email);
      btn.setAttribute('data-copied', '');
      if (hint) { hint.hidden = false; hint.textContent = `Copied ${email}`; }
      clearTimeout(t);
      t = window.setTimeout(() => btn.removeAttribute('data-copied'), 1800);
    } catch {
      location.href = `mailto:${email}`;
    }
  });
});

/* ── Custom cursor (mouse/trackpad only) ─────────────────────────────── */
if (fine) initCursor(reduced);

/* ── Motion layer (apple-design) ─────────────────────────────────────── */
if (!reduced) {
  splitHeadings();
  // Phrase-structure underlines: the hero's draw after its letters settle; headings when seen
  document.querySelectorAll<HTMLElement>('[data-parse]').forEach((el) =>
    phraseLines(el, { animate: true, delay: el.closest('[data-hero]') ? 1100 : 450 }),
  );
  if (hero && fine) letterField(hero);
  if (portraitEl && fine) portraitTilt(portraitEl);
  if (fine) rowGlow(document.querySelectorAll<HTMLElement>('[data-work], .exp__item, .res__item, .education, .lex__row, .btn'));
  const field = document.querySelector<HTMLCanvasElement>('[data-field]');
  if (field && hero) dotField(field, hero, fine);
  if (hero) heroParallax(hero);
  const navLinks = document.querySelector<HTMLElement>('[data-nav-links]');
  if (navLinks) navPill(navLinks);
  if (fine) flingChips();
}

if (reduced) {
  document.querySelectorAll<HTMLElement>('[data-parse]').forEach((el) => phraseLines(el, { animate: false }));
  document.querySelectorAll<HTMLElement>('.exp__dot').forEach((d) => d.setAttribute('data-reached', ''));
}
