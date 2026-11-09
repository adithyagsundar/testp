/**
 * Motion layer. Every effect follows apple-design rules:
 * it starts from the live on-screen value, keeps its velocity when
 * retargeted, decomposes 2D motion into independent X/Y springs, and is
 * skipped entirely under prefers-reduced-motion.
 */
import { animate, stagger } from 'motion';
import { Spring, rubberband, velocityFrom } from './spring';

/* ── A batched critically-damped spring field (one rAF for many values) ── */
type Body = { x: number; v: number; t: number };
function springField(count: number, response = 0.35, damping = 0.75, onFrame: (b: Body[]) => void) {
  const k = (2 * Math.PI / response) ** 2;
  const c = (4 * Math.PI * damping) / response;
  const bodies: Body[] = Array.from({ length: count }, () => ({ x: 0, v: 0, t: 0 }));
  let raf = 0;
  let last = 0;
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    let moving = false;
    for (const b of bodies) {
      const a = -k * (b.x - b.t) - c * b.v;
      b.v += a * dt;
      b.x += b.v * dt;
      if (Math.abs(b.v) > 0.01 || Math.abs(b.x - b.t) > 0.01) moving = true;
      else { b.x = b.t; b.v = 0; }
    }
    onFrame(bodies);
    raf = moving ? requestAnimationFrame(tick) : 0;
  };
  return {
    bodies,
    kick() {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    },
  };
}

/* ── 1. Letters lift toward the pointer like a magnetised type tray ───── */
export function splitLetters(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-letters] .hero__w').forEach((el) => {
    if (el.dataset.chars) return;
    el.dataset.chars = "1";
    const text = el.textContent ?? '';
    el.textContent = '';
    for (const ch of text) {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      el.append(s);
    }
  });
}

export function letterField(scope: HTMLElement) {
  const letters = [...scope.querySelectorAll<HTMLElement>('[data-letters] .ch')];
  if (!letters.length) return;
  const R = 180;
  // One critically damped body per letter: a soft lift, no wobble
  const field = springField(letters.length, 0.6, 1, (b) => {
    for (let i = 0; i < letters.length; i++) {
      const y = b[i].x;
      letters[i].style.transform = Math.abs(y) > 0.01 ? `translate3d(0,${y.toFixed(2)}px,0)` : '';
    }
  });
  let centers: { x: number; y: number }[] = [];
  const measure = () => {
    centers = letters.map((l) => {
      const r = l.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  };
  scope.addEventListener('pointerenter', measure);
  addEventListener('resize', () => (centers = []), { passive: true });
  addEventListener('scroll', () => (centers = []), { passive: true });
  scope.addEventListener('pointermove', (e) => {
    if (!centers.length) measure();
    letters.forEach((_, i) => {
      const dx = e.clientX - centers[i].x;
      const dy = e.clientY - centers[i].y;
      const d = Math.hypot(dx, dy);
      const f = Math.max(0, 1 - d / R) ** 2;
      field.bodies[i].t = -10 * f;
    });
    field.kick();
  });
  scope.addEventListener('pointerleave', () => {
    field.bodies.forEach((b) => (b.t = 0));
    field.kick();
  });
}

/* ── 2. Dot field behind the hero: dots part around the pointer ─────────── */
export function dotField(canvas: HTMLCanvasElement, scope: HTMLElement, interactive: boolean) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const GAP = 26;
  const R = 170;
  let dots: { x: number; y: number; ox: number; oy: number }[] = [];
  let color = '';
  let px = -9999, py = -9999;
  let raf = 0;
  let w = 0, h = 0;

  const readColor = () => {
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink-3').trim();
    color = ink || '#6a717d';
  };
  const layout = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) dots.push({ x, y, ox: 0, oy: 0 });
    draw();
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    for (const d of dots) {
      const near = Math.hypot(d.ox, d.oy);
      ctx.globalAlpha = 0.28 + Math.min(0.55, near / 30);
      ctx.beginPath();
      ctx.arc(d.x + d.ox, d.y + d.oy, 1.1 + Math.min(0.9, near / 22), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
  const step = () => {
    let moving = false;
    for (const d of dots) {
      const dx = d.x - px;
      const dy = d.y - py;
      const dist = Math.hypot(dx, dy) || 1;
      const f = Math.max(0, 1 - dist / R) ** 2;
      const tx = (dx / dist) * 22 * f;
      const ty = (dy / dist) * 22 * f;
      d.ox += (tx - d.ox) * 0.07;
      d.oy += (ty - d.oy) * 0.07;
      if (Math.abs(tx - d.ox) > 0.05 || Math.abs(ty - d.oy) > 0.05) moving = true;
    }
    draw();
    raf = moving ? requestAnimationFrame(step) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };

  readColor();
  layout();
  new ResizeObserver(layout).observe(canvas);
  new MutationObserver(() => { readColor(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (!interactive) return;
  scope.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    px = e.clientX - r.left;
    py = e.clientY - r.top;
    kick();
  });
  scope.addEventListener('pointerleave', () => { px = py = -9999; kick(); });
}

/* ── 3. Project preview that follows the pointer and leans with velocity ── */
export function workPeek(section: HTMLElement) {
  const peek = section.querySelector<HTMLElement>('[data-peek]');
  if (!peek) return;
  const card = peek.querySelector<HTMLElement>('.peek__card')!;
  let x = 0, y = 0, r = 0;
  const render = () => (peek.style.transform = `translate3d(${x}px,${y}px,0) rotate(${r}deg)`);
  const sx = new Spring(0, (v) => { x = v; render(); }, { dampingRatio: 1, response: 0.4 });
  const sy = new Spring(0, (v) => { y = v; render(); }, { dampingRatio: 1, response: 0.4 });
  const sr = new Spring(0, (v) => { r = v; render(); }, { dampingRatio: 1, response: 0.5 });
  let visible = false;
  let history: { x: number; t: number }[] = [];
  let settle = 0;

  const target = (cx: number, cy: number) => {
    const w = card.offsetWidth || 160;
    const hgt = card.offsetHeight || 36;
    const left = cx + 18 + w > innerWidth - 12 ? cx - 18 - w : cx + 18;
    const top = Math.min(innerHeight - hgt - 12, cy + 18);
    return { left, top };
  };

  section.querySelectorAll<HTMLElement>('[data-work]').forEach((row) => {
    row.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      const { left, top } = target(e.clientX, e.clientY);
      if (!visible) { sx.set(left); sy.set(top); sr.set(0); } // appear in place, never fly in from a corner
      visible = true;
      peek.setAttribute('data-on', '');
    });
    row.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const { left, top } = target(e.clientX, e.clientY);
      sx.to(left);
      sy.to(top);
      history.push({ x: e.clientX, t: e.timeStamp });
      if (history.length > 6) history.shift();
      const v = velocityFrom(history);
      sr.to(0);
      clearTimeout(settle);
      settle = window.setTimeout(() => sr.to(0), 140);
    });
    row.addEventListener('pointerleave', () => {
      visible = false;
      history = [];
      peek.removeAttribute('data-on');
      sr.to(0);
    });
  });
  addEventListener('scroll', () => { if (visible) { visible = false; peek.removeAttribute('data-on'); } }, { passive: true });
}

/* ── 4. Nav pill that slides between links on springs (x and width) ─────── */
export function navPill(nav: HTMLElement) {
  const pill = nav.querySelector<HTMLElement>('[data-nav-pill]');
  const list = nav.querySelector<HTMLElement>('ul');
  if (!pill || !list) return;
  const links = [...nav.querySelectorAll<HTMLElement>('a')];
  let px = 0, pw = 0;
  const paint = () => {
    pill.style.transform = `translate3d(${px}px,0,0)`;
    pill.style.width = `${Math.max(0, pw)}px`;
  };
  const sx = new Spring(0, (v) => { px = v; paint(); }, { dampingRatio: 1, response: 0.42 });
  const sw = new Spring(0, (v) => { pw = v; paint(); }, { dampingRatio: 1, response: 0.42 });
  let shown = false;
  const moveTo = (a: HTMLElement | null) => {
    if (!a) { pill.removeAttribute('data-on'); shown = false; return; }
    const lr = list.getBoundingClientRect();
    const r = a.getBoundingClientRect();
    const x = r.left - lr.left;
    if (!shown) { sx.set(x); sw.set(r.width); } else { sx.to(x); sw.to(r.width); }
    shown = true;
    pill.setAttribute('data-on', '');
  };
  const current = () => links.find((a) => a.getAttribute('aria-current') === 'true') ?? null;
  links.forEach((a) => {
    a.addEventListener('pointerenter', () => moveTo(a));
    a.addEventListener('focus', () => moveTo(a));
  });
  list.addEventListener('pointerleave', () => moveTo(current()));
  new MutationObserver(() => {
    if (!list.matches(':hover')) moveTo(current());
  }).observe(list, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  addEventListener('resize', () => { shown = false; moveTo(current()); }, { passive: true });
}

/* ── 6. Headings rise out of a mask, word by word (constituents kept) ──── */
export function splitHeadings() {
  const heads = [...document.querySelectorAll<HTMLElement>('[data-split]')];
  heads.forEach((h) => {
    h.setAttribute('aria-label', (h.textContent ?? '').trim().replace(/\s+/g, ' '));
    // Walk text nodes so phrase spans (.pc) survive the split
    const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    nodes.forEach((node) => {
      const parts = (node.textContent ?? '').split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(' '); return; }
        const outer = document.createElement('span');
        outer.className = 'sw';
        outer.setAttribute('aria-hidden', 'true');
        const inner = document.createElement('span');
        inner.className = 'sw__i';
        inner.textContent = part;
        inner.style.transform = 'translateY(110%)';
        outer.append(inner);
        frag.append(outer);
      });
      node.replaceWith(frag);
    });
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const inner = en.target.querySelectorAll<HTMLElement>('.sw__i');
      animate(inner, { transform: ['translateY(110%)', 'translateY(0%)'] }, { type: 'spring', bounce: 0, duration: 1.1, delay: stagger(0.08) });
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  heads.forEach((h) => io.observe(h));
}

/* ── 6b. Phrase-structure underlines: brackets that draw under constituents ── */
const SVG = 'http://www.w3.org/2000/svg';
export function phraseLines(root: HTMLElement, opts: { animate: boolean; delay?: number }) {
  const constituents = [...root.querySelectorAll<HTMLElement>('.pc')];
  if (!constituents.length) return;
  const svg = document.createElementNS(SVG, 'svg');
  svg.classList.add('parse');
  svg.setAttribute('aria-hidden', 'true');
  root.append(svg);
  let drawn = false;

  const draw = (animateIn: boolean) => {
    svg.replaceChildren();
    const base = root.getBoundingClientRect();
    constituents.forEach((pc, i) => {
      const words = [...pc.querySelectorAll<HTMLElement>('.hero__w, .sw')];
      const boxes = (words.length ? words : [pc]).map((w) => w.getBoundingClientRect());
      // Group word boxes into visual lines, so a phrase that wraps gets one bracket per line
      const lines: DOMRect[][] = [];
      boxes.forEach((b) => {
        const line = lines.find((l) => Math.abs(l[0].top - b.top) < b.height * 0.5);
        if (line) line.push(b); else lines.push([b]);
      });
      const g = document.createElementNS(SVG, 'g');
      g.dataset.i = String(i);
      lines.forEach((line, li) => {
        const x1 = Math.min(...line.map((b) => b.left)) - base.left + 2;
        const x2 = Math.max(...line.map((b) => b.right)) - base.left - 2;
        const y = Math.max(...line.map((b) => b.bottom)) - base.top + 5;
        const path = document.createElementNS(SVG, 'path');
        const open = li === 0 ? `M${x1},${y - 5} V${y}` : `M${x1},${y}`;
        const close = li === lines.length - 1 ? ` V${y - 5}` : '';
        path.setAttribute('d', `${open} H${x2}${close}`);
        path.setAttribute('pathLength', '1');
        g.append(path);
        if (li === 0) {
          // The label sits in a notch cut into the bracket line, so it adds no height
          const notch = document.createElementNS(SVG, 'rect');
          notch.setAttribute('x', String(x1 + 6));
          notch.setAttribute('y', String(y - 6));
          notch.setAttribute('height', '12');
          notch.setAttribute('rx', '2');
          const t = document.createElementNS(SVG, 'text');
          t.textContent = pc.dataset.cat ?? '';
          t.setAttribute('x', String(x1 + 10));
          t.setAttribute('y', String(y + 3.5));
          g.append(notch, t);
        }
      });
      svg.append(g);
      g.querySelectorAll('text').forEach((t) => {
        const w = (t as SVGTextElement).getComputedTextLength();
        (t.previousSibling as SVGRectElement).setAttribute('width', String(w + 8));
      });
      if (animateIn) {
        const d = (opts.delay ?? 0) + i * 160;
        g.querySelectorAll('path').forEach((p, k) =>
          p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900, delay: d + k * 120, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' }),
        );
        g.querySelectorAll('text, rect').forEach((t) =>
          t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: d + 300, easing: 'ease-out', fill: 'both' }),
        );
      }
    });
    drawn = true;
  };

  // Hovering a phrase darkens its bracket
  constituents.forEach((pc, i) => {
    pc.addEventListener('pointerenter', () => svg.querySelector(`g[data-i="${i}"]`)?.classList.add('on'));
    pc.addEventListener('pointerleave', () => svg.querySelector(`g[data-i="${i}"]`)?.classList.remove('on'));
  });

  const start = () => {
    if (!opts.animate) return draw(false);
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      draw(true);
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(root);
  };
  document.fonts.ready.then(start);
  let raf = 0;
  new ResizeObserver(() => {
    if (!drawn) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => draw(false));
  }).observe(root);
}

/* ── 6c. A soft highlighter glow follows the pointer across a row ───────── */
export function rowGlow(rows: NodeListOf<HTMLElement>) {
  rows.forEach((row) => {
    row.addEventListener('pointermove', (e) => {
      const r = row.getBoundingClientRect();
      row.style.setProperty('--mx', `${e.clientX - r.left}px`);
      row.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ── 7. Fling a chip: 1:1 drag, tethered by a rubber band, springs home ── */
export function flingChips() {
  document.querySelectorAll<HTMLElement>('[data-drag]').forEach((chip) => {
    let ox = 0, oy = 0, rot = 0;
    const paint = () => (chip.style.transform = ox || oy || rot ? `translate3d(${ox}px,${oy}px,0) rotate(${rot}deg)` : '');
    const sx = new Spring(0, (v) => { ox = v; paint(); });
    const sy = new Spring(0, (v) => { oy = v; paint(); });
    const sr = new Spring(0, (v) => { rot = v; paint(); }, { dampingRatio: 0.6, response: 0.4 });
    let id: number | null = null;
    let startX = 0, startY = 0, baseX = 0, baseY = 0;
    let hx: { x: number; t: number }[] = [];
    let hy: { x: number; t: number }[] = [];
    chip.addEventListener('pointerdown', (e) => {
      if (id !== null || e.button !== 0) return;
      id = e.pointerId;
      sx.stop(); sy.stop(); sr.stop(); // catch it mid-flight from where it is
      baseX = ox; baseY = oy;
      startX = e.clientX; startY = e.clientY;
      hx = [{ x: e.clientX, t: e.timeStamp }];
      hy = [{ x: e.clientY, t: e.timeStamp }];
      chip.setAttribute('data-grabbed', '');
      try { chip.setPointerCapture(e.pointerId); } catch {}
    });
    chip.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      const dx = baseX + e.clientX - startX;
      const dy = baseY + e.clientY - startY;
      // Free for the first 60px, then progressively resisted
      const tether = (d: number) => (Math.abs(d) <= 60 ? d : Math.sign(d) * (60 + rubberband(Math.abs(d) - 60, 300)));
      ox = sx.x = tether(dx);
      oy = sy.x = tether(dy);
      hx.push({ x: e.clientX, t: e.timeStamp });
      hy.push({ x: e.clientY, t: e.timeStamp });
      if (hx.length > 6) { hx.shift(); hy.shift(); }
      rot = sr.x = Math.max(-6, Math.min(6, velocityFrom(hx) * 0.005));
      paint();
    });
    const release = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = null;
      chip.removeAttribute('data-grabbed');
      const vx = velocityFrom(hx);
      const vy = velocityFrom(hy);
      // It was thrown, so a touch of give is earned; kept gentle
      sx.configure({ dampingRatio: 0.8, response: 0.55 });
      sy.configure({ dampingRatio: 0.8, response: 0.55 });
      sx.to(0, vx * 0.3);
      sy.to(0, vy * 0.3);
      sr.to(0);
    };
    chip.addEventListener('pointerup', release);
    chip.addEventListener('pointercancel', release);
  });
}

/* ── 8. Hero recedes as you scroll past it ──────────────────────────────── */
export function heroParallax(hero: HTMLElement) {
  const line = hero.querySelector<HTMLElement>('.hero__h');
  const field = hero.querySelector<HTMLElement>('[data-field]');
  const img = hero.querySelector<HTMLElement>('.portrait__img');
  if (!line) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const h = hero.offsetHeight;
    const p = Math.min(1, Math.max(0, scrollY / h));
    line.style.transform = p ? `translate3d(0,${(p * 60).toFixed(1)}px,0)` : '';
    line.style.opacity = p ? String(1 - p * 0.6) : '';
    if (field) field.style.opacity = String(1 - p);
    if (img) img.style.translate = p ? `0 ${(p * 40).toFixed(1)}px` : '';
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
}

/* ── 9. Portrait tilts toward the pointer: X and Y on separate springs ── */
export function portraitTilt(fig: HTMLElement) {
  const frame = fig.querySelector<HTMLElement>('[data-portrait-frame]');
  if (!frame) return;
  let rx = 0, ry = 0;
  const paint = () => (frame.style.transform = rx || ry ? `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)` : '');
  const sx = new Spring(0, (v) => { rx = v; paint(); }, { dampingRatio: 1, response: 0.6 });
  const sy = new Spring(0, (v) => { ry = v; paint(); }, { dampingRatio: 1, response: 0.6 });
  fig.addEventListener('pointermove', (e) => {
    const r = fig.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    sy.to(px * 8);
    sx.to(-py * 8);
  });
  fig.addEventListener('pointerleave', () => { sx.to(0); sy.to(0); });
}
