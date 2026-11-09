/**
 * A minimal custom cursor (fine pointers only).
 * - A small dot tracks the pointer 1:1.
 * - A ring trails it on a critically damped spring (apple-design: interruptible,
 *   X/Y decomposed, starts from its live position).
 * - Over buttons and nav links the ring morphs to the control's shape, like the
 *   iPadOS pointer, and leans slightly toward the real pointer.
 * - Over a work row it becomes a small "Open" pill; over a chip, "Drag".
 */
import { Spring } from './spring';

type Mode = 'idle' | 'snap' | 'label';

export function initCursor(reduced: boolean) {
  const root = document.documentElement;
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="cursor__ring"><span class="cursor__label"></span></span><span class="cursor__dot"></span>';
  document.body.append(el);
  const ring = el.querySelector<HTMLElement>('.cursor__ring')!;
  const dot = el.querySelector<HTMLElement>('.cursor__dot')!;
  const label = el.querySelector<HTMLElement>('.cursor__label')!;
  root.classList.add('has-cursor');

  const SIZE = 34;
  let px = -100, py = -100;
  let rx = -100, ry = -100, rw = SIZE, rh = SIZE;
  let mode: Mode = 'idle';
  let snapTarget: HTMLElement | null = null;
  let radius = '999px';

  const paintRing = () => {
    ring.style.transform = `translate3d(${(rx - rw / 2).toFixed(2)}px, ${(ry - rh / 2).toFixed(2)}px, 0)`;
    ring.style.width = `${rw.toFixed(2)}px`;
    ring.style.height = `${rh.toFixed(2)}px`;
  };
  const opts = { dampingRatio: 1, response: 0.2 };
  const sizeOpts = { dampingRatio: 1, response: 0.28 };
  const sx = new Spring(px, (v) => { rx = v; paintRing(); }, opts);
  const sy = new Spring(py, (v) => { ry = v; paintRing(); }, opts);
  const sw = new Spring(SIZE, (v) => { rw = v; paintRing(); }, sizeOpts);
  const sh = new Spring(SIZE, (v) => { rh = v; paintRing(); }, sizeOpts);
  const go = (s: Spring, v: number) => (reduced ? s.set(v) : s.to(v));

  const setMode = (m: Mode, text = '') => {
    mode = m;
    el.dataset.mode = m;
    label.textContent = text;
    if (m === 'idle') { go(sw, SIZE); go(sh, SIZE); ring.style.borderRadius = '999px'; }
    if (m === 'label') {
      const w = Math.max(56, label.scrollWidth + 24);
      go(sw, w); go(sh, 30); ring.style.borderRadius = '999px';
    }
  };

  const snapTo = (t: HTMLElement, e: PointerEvent) => {
    const r = t.getBoundingClientRect();
    const pad = 5;
    // Lean a little toward the real pointer so the shape feels attached to the hand
    const lx = (e.clientX - (r.left + r.width / 2)) * 0.12;
    const ly = (e.clientY - (r.top + r.height / 2)) * 0.12;
    go(sx, r.left + r.width / 2 + lx);
    go(sy, r.top + r.height / 2 + ly);
    go(sw, r.width + pad * 2);
    go(sh, r.height + pad * 2);
    const br = parseFloat(getComputedStyle(t).borderRadius) || 8;
    radius = `${Math.min(br + pad, (r.height + pad * 2) / 2)}px`;
    ring.style.borderRadius = radius;
  };

  const SNAP = '.btn, .nav__links a, .nav__theme, .nav__brand, .exp__toggle, .case__back, .case__next a, .res__title a, .res__role a, .pipe__pause';
  const LINK = 'a, button, [role="button"], summary, label';

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    px = e.clientX;
    py = e.clientY;
    el.dataset.visible = '';
    dot.style.transform = `translate3d(${px}px, ${py}px, 0)`;

    const t = e.target as HTMLElement;
    const snap = t.closest<HTMLElement>(SNAP);
    const work = t.closest<HTMLElement>('[data-work]');
    const drag = t.closest<HTMLElement>('[data-drag]');

    if (snap) {
      if (mode !== 'snap' || snapTarget !== snap) { mode = 'snap'; el.dataset.mode = 'snap'; label.textContent = ''; snapTarget = snap; }
      snapTo(snap, e);
      return;
    }
    snapTarget = null;
    if (work) { if (mode !== 'label' || label.textContent !== 'Open') setMode('label', 'Open'); }
    else if (drag) { if (mode !== 'label' || label.textContent !== 'Drag') setMode('label', 'Drag'); }
    else if (mode !== 'idle') setMode('idle');
    el.toggleAttribute('data-link', !!t.closest(LINK) && mode === 'idle');
    go(sx, px);
    go(sy, py);
  }, { passive: true });

  addEventListener('pointerdown', () => el.setAttribute('data-down', ''));
  addEventListener('pointerup', () => el.removeAttribute('data-down'));
  document.documentElement.addEventListener('pointerleave', () => el.removeAttribute('data-visible'));
  addEventListener('blur', () => el.removeAttribute('data-visible'));
  // Scrolling moves content under a still pointer: drop stale snap states
  addEventListener('scroll', () => { if (mode === 'snap') { setMode('idle'); go(sx, px); go(sy, py); } }, { passive: true });
}
