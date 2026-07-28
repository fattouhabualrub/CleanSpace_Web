/**
 * Single source of truth for the store links and for "which store does this
 * visitor need?". Used by the badges, the navbar CTA, and the /download
 * smart-link page.
 */

export const APP_STORE_URL =
  'https://apps.apple.com/jo/app/cleanspace-storage-photos/id6790139624';

export type Platform = 'ios' | 'android' | 'desktop';

/**
 * Best-effort platform sniff from the UA string. Only used to pick which store
 * to offer — never to gate content — so a wrong guess just means the visitor
 * taps a badge instead of being redirected.
 */
export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  // iPadOS 13+ ships a desktop-Safari UA; multi-touch is what gives it away.
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'ios';
  return 'desktop';
}
