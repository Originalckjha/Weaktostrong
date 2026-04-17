import type { ColorTheme } from './types';

/**
 * ThemeManager — applies a colour theme via CSS custom properties on :root.
 * All other modules read var(--color-*) so swapping theme updates the whole page.
 */
export class ThemeManager {
  private readonly root: HTMLElement = document.documentElement;

  private readonly theme: ColorTheme = {
    primary:        '#7c3aed',                                               // violet
    accent:         '#f59e0b',                                               // amber
    dark:           '#0f0a1e',                                               // near-black purple
    light:          '#f3e8ff',                                               // lavender tint
    heroGradient:   'linear-gradient(135deg, #0f0a1e 0%, #3b0764 55%, #7c3aed 100%)',
    footerGradient: 'linear-gradient(160deg, #0f0a1e 0%, #1e0a3c 40%, #3b0764 100%)',
  };

  constructor() {
    this.applyTheme();
  }

  private applyTheme(): void {
    const t = this.theme;
    const props: Record<string, string> = {
      '--color-primary':        t.primary,
      '--color-accent':         t.accent,
      '--color-dark':           t.dark,
      '--color-light':          t.light,
      '--gradient-hero':        t.heroGradient,
      '--gradient-footer':      t.footerGradient,
      '--color-primary-hover':  '#6d28d9',
      '--color-accent-hover':   '#d97706',
      '--shadow-glow':          `0 0 20px ${t.primary}66`,
    };
    for (const [prop, value] of Object.entries(props)) {
      this.root.style.setProperty(prop, value);
    }
  }
}
