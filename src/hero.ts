/**
 * hero.ts — Typing effect and particle canvas for the hero section.
 */

// ─── Typing Effect ─────────────────────────────────────────────────────────

export class TypingEffect {
  private readonly el: HTMLElement;
  private readonly words: readonly string[];
  private charIndex: number = 0;
  private wordIndex: number = 0;
  private deleting: boolean = false;

  constructor(selector: string, words: readonly string[]) {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`TypingEffect: element not found — "${selector}"`);
    this.el = el;
    this.words = words;
    this.el.classList.add('typing-el');
    this.tick();
  }

  private tick(): void {
    const word = this.words[this.wordIndex];

    if (this.deleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.el.textContent = word.substring(0, this.charIndex);

    let delay = this.deleting ? 55 : 115;

    if (!this.deleting && this.charIndex === word.length) {
      delay = 1800;
      this.deleting = true;
    } else if (this.deleting && this.charIndex === 0) {
      this.deleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      delay = 400;
    }

    setTimeout(() => this.tick(), delay);
  }
}

// ─── Particle ───────────────────────────────────────────────────────────────

class Particle {
  x: number;
  y: number;
  private vx: number;
  private vy: number;
  private radius: number;
  private alpha: number;

  constructor(w: number, h: number) {
    this.x      = Math.random() * w;
    this.y      = Math.random() * h;
    this.vx     = (Math.random() - 0.5) * 0.35;
    this.vy     = (Math.random() - 0.5) * 0.35;
    this.radius = Math.random() * 1.8 + 0.4;
    this.alpha  = Math.random() * 0.55 + 0.15;
  }

  update(w: number, h: number): void {
    this.x = (this.x + this.vx + w) % w;
    this.y = (this.y + this.vy + h) % h;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 160, 255, ${this.alpha})`;
    ctx.fill();
  }
}

// ─── Particle Canvas ────────────────────────────────────────────────────────

export class ParticleCanvas {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    Object.assign(this.canvas.style, {
      position:       'absolute',
      inset:          '0',
      width:          '100%',
      height:         '100%',
      pointerEvents:  'none',
      zIndex:         '0',
    });

    container.style.position = 'relative';
    container.prepend(this.canvas);

    // Ensure hero content sits above canvas
    Array.from(container.children).forEach(child => {
      if (child !== this.canvas) {
        (child as HTMLElement).style.position = 'relative';
        (child as HTMLElement).style.zIndex = '1';
      }
    });

    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    requestAnimationFrame(() => this.animate());
  }

  private resize(): void {
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    const count = Math.max(30, Math.floor((this.canvas.width * this.canvas.height) / 10000));
    this.particles = Array.from({ length: count }, () =>
      new Particle(this.canvas.width, this.canvas.height)
    );
  }

  private animate(): void {
    const { width: w, height: h } = this.canvas;
    this.ctx.clearRect(0, 0, w, h);

    // Draw connecting lines between nearby particles
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(200, 160, 255, ${0.18 * (1 - dist / 90)})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.stroke();
        }
      }
      this.particles[i].update(w, h);
      this.particles[i].draw(this.ctx);
    }

    requestAnimationFrame(() => this.animate());
  }
}
