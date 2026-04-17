/**
 * scroll.ts — Scroll-reveal, back-to-top button, scroll-progress bar,
 *             and animated counter utilities.
 */
import type { CounterConfig } from './types';

// ─── Scroll Reveal ──────────────────────────────────────────────────────────

export class ScrollReveal {
  private readonly observer: IntersectionObserver;

  constructor(selector: string) {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll<HTMLElement>(selector).forEach(el => {
      el.classList.add('reveal-hidden');
      this.observer.observe(el);
    });
  }
}

// ─── Back-to-Top Button ─────────────────────────────────────────────────────

export class BackToTop {
  private readonly btn: HTMLButtonElement;

  constructor() {
    this.btn = document.createElement('button');
    this.btn.id = 'back-to-top';
    this.btn.setAttribute('aria-label', 'Back to top');
    this.btn.innerHTML = '&#8679;';   // ↑
    document.body.appendChild(this.btn);

    this.btn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );

    window.addEventListener(
      'scroll',
      () => this.btn.classList.toggle('visible', window.scrollY > 400),
      { passive: true }
    );
  }
}

// ─── Scroll-Progress Bar ────────────────────────────────────────────────────

export class ScrollProgress {
  private readonly bar: HTMLDivElement;

  constructor() {
    this.bar = document.createElement('div');
    this.bar.id = 'scroll-progress';
    document.body.prepend(this.bar);

    window.addEventListener('scroll', () => this.update(), { passive: true });
  }

  private update(): void {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    this.bar.style.width = `${pct}%`;
  }
}

// ─── Animated Counter ───────────────────────────────────────────────────────

export class CounterAnimation {
  constructor(configs: CounterConfig[]) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cfg = configs.find(c => c.element === entry.target);
            if (cfg) {
              this.animateCounter(cfg);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    configs.forEach(cfg => observer.observe(cfg.element));
  }

  private animateCounter(cfg: CounterConfig): void {
    const start     = 0;
    const startTime = performance.now();

    const step = (now: number): void => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / cfg.duration, 1);
      // ease-out cubic
      const ease     = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(start + (cfg.target - start) * ease);
      cfg.element.textContent = current.toLocaleString() + cfg.suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}
