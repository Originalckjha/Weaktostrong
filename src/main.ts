/**
 * main.ts — Entry point. Boots all modules after DOM is ready.
 */
import { ThemeManager }                                   from './theme';
import { TypingEffect, ParticleCanvas }                   from './hero';
import { StickyNav }                                      from './nav';
import { ScrollReveal, BackToTop, ScrollProgress,
         CounterAnimation }                               from './scroll';
import { LiveClock, FooterWave, SocialHoverEffect,
         FooterGradientPulse, updateCopyrightYear }       from './footer';
import { BiometricRealtimeFeed }                          from './biometric';
import type { CounterConfig }                             from './types';

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Theme (sets CSS custom properties immediately) ──────────────────
  new ThemeManager();

  // ── 2. Scroll progress bar (inject before first paint) ─────────────────
  new ScrollProgress();

  // ── 3. Navbar shrink on scroll ─────────────────────────────────────────
  new StickyNav('nav.navbar');

  // ── 4. Hero: particle canvas + typing effect ───────────────────────────
  const heroSection = document.querySelector<HTMLElement>('.s1');
  if (heroSection) {
    new ParticleCanvas(heroSection);
  }

  const heroTitle = document.querySelector<HTMLElement>('#hero-title');
  if (heroTitle) {
    new TypingEffect('#hero-title', [
      'Weaktostrong',
      'Web Design',
      'Content Writing',
      'Advertising',
      'Your Growth',
    ] as const);
  }

  // ── 5. Scroll-reveal for sections ──────────────────────────────────────
  new ScrollReveal('.reveal');

  // ── 6. Back-to-top button ──────────────────────────────────────────────
  new BackToTop();

  // ── 7. Animated counters (About section) ──────────────────────────────
  const counterEls = document.querySelectorAll<HTMLElement>('[data-counter]');
  const counterConfigs: CounterConfig[] = Array.from(counterEls).map(el => ({
    element:  el,
    target:   parseInt(el.dataset['counter'] ?? '0', 10),
    duration: 1800,
    suffix:   el.dataset['suffix'] ?? '',
  }));
  if (counterConfigs.length > 0) {
    new CounterAnimation(counterConfigs);
  }

  // ── 8. Footer: wave, gradient pulse, live clock, social glows ─────────
  const footer = document.querySelector<HTMLElement>('footer');
  if (footer) {
    new FooterWave().inject(footer);
    new FooterGradientPulse('footer');
  }

  new LiveClock('#footer-clock');
  new SocialHoverEffect('.social-icons a');
  updateCopyrightYear('#copyright');

  // ── 9. Biometric real-time feed (ZKTeco N9) ────────────────────────────
  if (document.getElementById('biometric-feed')) {
    new BiometricRealtimeFeed('biometric-feed', {
      model:    'ZKTeco N9',
      ip:       '192.168.1.201',
      serial:   'BKF2309140042',
      firmware: 'Ver 6.60 Apr 12 2023',
    });
  }

});
