/** Colour theme definition applied via CSS custom properties. */
export interface ColorTheme {
  primary: string;
  accent: string;
  dark: string;
  light: string;
  heroGradient: string;
  footerGradient: string;
}

/** A single particle for the canvas background. */
export interface ParticleOptions {
  canvasWidth: number;
  canvasHeight: number;
  color: string;
}

/** Configuration for an animated counter element. */
export interface CounterConfig {
  element: HTMLElement;
  target: number;
  duration: number;
  suffix: string;
}
