import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

/** 'system' follows the OS; the other two are an explicit visitor choice. */
export type ThemePref = 'system' | 'light' | 'dark';
export type Scheme = 'light' | 'dark';

const KEY = 'theme';

/**
 * Light/dark preference.
 *
 * The stylesheet already reacts to `prefers-color-scheme`; this only writes a
 * `data-theme` attribute on <html> when the visitor overrides the OS, and the
 * CSS is ordered so that attribute wins. Storing 'system' rather than resolving
 * it to a fixed value keeps the page following the OS when it changes later.
 *
 * The first paint is handled by an inline script in index.html — by the time
 * this service constructs, Angular has already booted and a wrong theme would
 * have flashed.
 */
@Injectable({ providedIn: 'root' })
export class Theme {
  private readonly doc = inject(DOCUMENT);

  readonly pref = signal<ThemePref>('system');

  /**
   * The OS preference, as a signal. It has to be reactive: the OS can flip while
   * the page is open (macOS auto light/dark at sunset), and a plain matchMedia
   * read inside the computed below would be cached forever — leaving the button
   * showing a sun on a light page and toggling the wrong way.
   */
  private readonly systemDark = signal(false);

  /** What is actually on screen, with 'system' resolved against the OS. */
  readonly scheme = computed<Scheme>(() => {
    const p = this.pref();
    if (p !== 'system') return p;
    return this.systemDark() ? 'dark' : 'light';
  });

  constructor() {
    const saved = this.read();
    if (saved) this.pref.set(saved);

    const mq = this.doc.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    if (mq) {
      this.systemDark.set(mq.matches);
      mq.addEventListener('change', (e) => {
        this.systemDark.set(e.matches);
        this.apply();   // keeps the browser-chrome colour in step
      });
    }

    this.apply();
  }

  /** Flips to the opposite of what is currently displayed. */
  toggle(): void {
    this.set(this.scheme() === 'dark' ? 'light' : 'dark');
  }

  set(pref: ThemePref): void {
    this.pref.set(pref);
    try {
      if (pref === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, pref);
    } catch {
      /* Safari private mode throws on write — the theme still applies. */
    }
    this.apply();
  }

  private read(): ThemePref | null {
    try {
      const v = localStorage.getItem(KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch {
      return null;
    }
  }

  private apply(): void {
    const root = this.doc.documentElement;
    if (!root) return;
    const p = this.pref();
    if (p === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', p);

    this.applyBrowserChrome(p);
  }

  /**
   * The Android URL bar. index.html ships a media-scoped theme-color for each
   * scheme, which covers the 'system' case on its own; an explicit choice needs
   * an unscoped tag placed first, because the browser takes the first tag whose
   * media matches and an unscoped one always matches.
   */
  private applyBrowserChrome(pref: ThemePref): void {
    const id = 'theme-color-override';
    const existing = this.doc.getElementById(id);
    if (pref === 'system') {
      existing?.remove();
      return;
    }
    const meta = (existing as HTMLMetaElement) ?? this.doc.createElement('meta');
    meta.id = id;
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', pref === 'dark' ? '#0F1219' : '#F4F5F2');
    if (!existing) this.doc.head.prepend(meta);
  }
}
