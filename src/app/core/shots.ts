import { Injectable, computed, inject } from '@angular/core';
import { I18n } from '../services/i18n';
import { Theme } from './theme';
import { SCREEN_VARIANTS } from './screen-variants';

/**
 * Resolves app screenshots for the current language and colour scheme.
 *
 * The phones follow the site's theme, so a light page shows the app in light
 * mode. Reading `Theme.scheme` rather than a media query is deliberate: it
 * already resolves the header toggle's explicit choice over the OS one, which
 * a `prefers-color-scheme` source in a <picture> could not do.
 *
 * Not every language has both captures — SCREEN_VARIANTS says which were
 * built, and anything missing falls back to the first that was.
 */
@Injectable({ providedIn: 'root' })
export class Shots {
  private readonly i18n = inject(I18n);
  private readonly theme = inject(Theme);

  readonly variant = computed(() => {
    const lang = this.i18n.shotLang();
    const built = SCREEN_VARIANTS[lang] ?? ['dark'];
    const wanted = this.theme.scheme();
    const scheme = built.includes(wanted) ? wanted : built[0];
    return { lang, scheme, key: `${lang}-${scheme}` };
  });

  /** A screen name → the frame built by scripts/build-screens.py. */
  src(name: string): string {
    const { lang, scheme } = this.variant();
    return `screens/${name}_${lang}_${scheme}.webp`;
  }

  /**
   * Figures printed on the home-screen capture. All four captures came from
   * different scan runs, so anything that magnifies a number from the frame
   * must follow the exact frame shown, not just its language.
   */
  private static readonly HOME_FIGURES: Record<string, { freed: number; duplicates: number }> = {
    'en-dark': { freed: 2.07, duplicates: 241 },
    'en-light': { freed: 1.53, duplicates: 106 },
    'ar-dark': { freed: 1.53, duplicates: 109 },
    'ar-light': { freed: 1.53, duplicates: 109 },
  };
  readonly homeFigures = computed(
    () => Shots.HOME_FIGURES[this.variant().key] ?? Shots.HOME_FIGURES['en-dark'],
  );
}
