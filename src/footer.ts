/**
 * footer.ts — Live clock, SVG wave divider, social-icon glow effects,
 *             footer gradient pulse, and dynamic copyright year.
 */

// ─── Live Clock ─────────────────────────────────────────────────────────────

export class LiveClock {
  private readonly el: HTMLElement;
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(selector: string) {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`LiveClock: element not found — "${selector}"`);
    this.el = el;
    this.tick();
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  private tick(): void {
    const now = new Date();
    this.el.textContent = now.toLocaleTimeString('en-IN', {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  destroy(): void {
    if (this.timerId !== null) clearInterval(this.timerId);
  }
}

// ─── Wave Divider ───────────────────────────────────────────────────────────

export class FooterWave {
  inject(footerEl: HTMLElement): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'footer-wave-wrapper';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 1440 80"
           preserveAspectRatio="none"
           class="footer-wave-svg">
        <path
          d="M0,32 C240,72 480,4 720,36 C960,68 1200,8 1440,40 L1440,0 L0,0 Z"
          fill="var(--color-light, #f3e8ff)" />
      </svg>`;
    footerEl.parentElement?.insertBefore(wrapper, footerEl);
  }
}

// ─── Social Icon Hover Glow ─────────────────────────────────────────────────

const SOCIAL_COLORS: readonly string[] = [
  '#ea4335',   // Gmail  – red
  '#25d366',   // WhatsApp – green
  '#e1306c',   // Instagram – pink
  '#6e5494',   // GitHub – purple
  '#1877f2',   // Facebook – blue
];

export class SocialHoverEffect {
  constructor(selector: string) {
    const anchors = document.querySelectorAll<HTMLAnchorElement>(selector);

    anchors.forEach((anchor, i) => {
      const color = SOCIAL_COLORS[i % SOCIAL_COLORS.length];
      anchor.style.transition = 'transform 0.22s ease, filter 0.22s ease';
      anchor.style.display    = 'inline-block';

      anchor.addEventListener('mouseenter', () => {
        anchor.style.filter    = `drop-shadow(0 0 10px ${color})`;
        anchor.style.transform = 'scale(1.25) translateY(-5px)';
      });

      anchor.addEventListener('mouseleave', () => {
        anchor.style.filter    = '';
        anchor.style.transform = '';
      });
    });
  }
}

// ─── Gradient Pulse ──────────────────────────────────────────────────────────

/**
 * Smoothly cycles the footer background between several rich purple/violet tones
 * so the footer never looks static.
 */
export class FooterGradientPulse {
  private readonly footer: HTMLElement;
  private angle: number = 160;
  private hue: number   = 270;      // start at violet
  private frameId: number = 0;

  constructor(selector: string) {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`FooterGradientPulse: element not found — "${selector}"`);
    this.footer = el;
    this.frame();
  }

  private frame(): void {
    this.hue   = (this.hue + 0.08) % 360;           // very slow hue shift
    this.angle = (this.angle + 0.04) % 360;          // slow angle rotation

    const h1 = Math.round(this.hue);
    const h2 = Math.round((this.hue + 30) % 360);
    const h3 = Math.round((this.hue + 55) % 360);

    this.footer.style.background = [
      `linear-gradient(${Math.round(this.angle)}deg,`,
      `  hsl(${h1}, 72%, 8%) 0%,`,
      `  hsl(${h2}, 68%, 14%) 45%,`,
      `  hsl(${h3}, 60%, 20%) 100%)`,
    ].join('');

    this.frameId = requestAnimationFrame(() => this.frame());
  }

  destroy(): void {
    cancelAnimationFrame(this.frameId);
  }
}

// ─── Dynamic Copyright Year ─────────────────────────────────────────────────

export function updateCopyrightYear(selector: string): void {
  const el = document.querySelector<HTMLElement>(selector);
  if (el) el.innerHTML = `&copy; ${new Date().getFullYear()} WEAKTOSTRONG`;
}
