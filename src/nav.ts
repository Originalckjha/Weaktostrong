/**
 * nav.ts — Navbar shrink-on-scroll behaviour.
 */
export class StickyNav {
  private readonly nav: HTMLElement;
  private readonly threshold: number;

  constructor(selector: string, threshold = 60) {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`StickyNav: element not found — "${selector}"`);
    this.nav       = el;
    this.threshold = threshold;
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
  }

  private onScroll(): void {
    const scrolled = window.scrollY > this.threshold;
    this.nav.classList.toggle('nav-scrolled', scrolled);
  }
}
