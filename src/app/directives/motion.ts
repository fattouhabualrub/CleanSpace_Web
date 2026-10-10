/**
 * Shared motion helper: the one place that answers "is motion allowed?".
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
