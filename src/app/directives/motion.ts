/**
 * Shared motion helpers.
 *
 * Every scroll- or pointer-driven effect on the site funnels through here so
 * there is exactly one place that answers "is motion allowed?" and one place
 * that owns the shared rAF scroll loop. Without the shared loop each parallax
 * element would install its own scroll listener; with it, one listener drives
 * all of them.
 */
import { DOCUMENT, inject } from '@angular/core';

/** True when the visitor has asked the OS to reduce motion, or we're on the server. */
export function prefersReducedMotion(doc: Document): boolean {
  const win = doc.defaultView;
  if (!win?.matchMedia) return true;
  return win.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Injectable form, for use inside a directive/component constructor. */
export function injectReducedMotion(): boolean {
  return prefersReducedMotion(inject(DOCUMENT));
}

type Frame = (scrollY: number, viewportH: number) => void;

const subscribers = new Set<Frame>();
let ticking = false;
let installed = false;

function flush(win: Window): void {
  ticking = false;
  const y = win.scrollY;
  const h = win.innerHeight;
  for (const fn of subscribers) fn(y, h);
}

/**
 * Registers `fn` on the shared scroll loop and returns an unsubscribe.
 *
 * The callback is invoked inside requestAnimationFrame, never more than once
 * per frame no matter how many scroll events fired, and always outside Angular
 * — callers must not touch signals from it.
 */
export function onScrollFrame(win: Window, fn: Frame): () => void {
  subscribers.add(fn);

  if (!installed) {
    installed = true;
    const request = () => {
      if (ticking) return;
      ticking = true;
      win.requestAnimationFrame(() => flush(win));
    };
    win.addEventListener('scroll', request, { passive: true });
    win.addEventListener('resize', request, { passive: true });
  }

  // Seed immediately so an element that starts mid-viewport is positioned
  // correctly before the visitor scrolls at all.
  fn(win.scrollY, win.innerHeight);

  return () => {
    subscribers.delete(fn);
  };
}
