/**
 * A tiny interruptible spring, parameterised the way Apple designs them:
 * dampingRatio (1 = no overshoot) and response (seconds, not a duration).
 * Retargeting keeps the current position and velocity, so motion never jumps.
 */
export interface SpringOpts { dampingRatio?: number; response?: number }

export class Spring {
  x: number;
  v = 0;
  target: number;
  private k: number;
  private c: number;
  private raf = 0;
  private last = 0;
  constructor(initial: number, private onUpdate: (x: number) => void, opts: SpringOpts = {}) {
    this.x = this.target = initial;
    const { dampingRatio = 1, response = 0.4 } = opts;
    this.k = (2 * Math.PI / response) ** 2;
    this.c = (4 * Math.PI * dampingRatio) / response;
  }
  configure({ dampingRatio = 1, response = 0.4 }: SpringOpts) {
    this.k = (2 * Math.PI / response) ** 2;
    this.c = (4 * Math.PI * dampingRatio) / response;
  }
  /** Animate to target, optionally handing off a release velocity (units/s). */
  to(target: number, velocity?: number) {
    this.target = target;
    if (velocity !== undefined) this.v = velocity;
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  }
  /** Jump with no motion (used for keyboard and reduced motion). */
  set(x: number) {
    this.stop();
    this.x = this.target = x;
    this.v = 0;
    this.onUpdate(x);
  }
  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
  private tick = (now: number) => {
    let dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    // Sub-step for stability with stiff springs
    const steps = Math.ceil(dt / (1 / 240));
    dt /= steps;
    for (let i = 0; i < steps; i++) {
      const a = -this.k * (this.x - this.target) - this.c * this.v;
      this.v += a * dt;
      this.x += this.v * dt;
    }
    this.onUpdate(this.x);
    if (Math.abs(this.v) < 0.5 && Math.abs(this.x - this.target) < 0.25) {
      this.x = this.target;
      this.v = 0;
      this.onUpdate(this.x);
      this.raf = 0;
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}

/** Apple's momentum projection (Designing Fluid Interfaces). */
export function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** Velocity (units/s) from a short pointer history. */
export function velocityFrom(history: { x: number; t: number }[]) {
  const now = history[history.length - 1];
  if (!now) return 0;
  let i = history.length - 1;
  while (i > 0 && now.t - history[i - 1].t < 100) i--;
  const first = history[i];
  const dt = (now.t - first.t) / 1000;
  return dt > 0 ? (now.x - first.x) / dt : 0;
}

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
