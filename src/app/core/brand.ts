/**
 * The product name, in one place.
 *
 * `APP_NAME` matches the App Store listing exactly — Google cross-checks the
 * name in structured data against the store, and visitors searching the store
 * name should land on the site.
 *
 * `APP_SHORT_NAME` is the wordmark: used where a 25-character name would wrap or
 * be truncated — the site name (og:site_name), the footer lockup, and the iOS
 * Home Screen label, which iOS cuts at roughly 12 characters.
 */
export const APP_NAME = 'CleanSpace: Photo Cleaner';
export const APP_SHORT_NAME = 'CleanSpace';

/**
 * Share-card image. The ?v suffix is a cache-buster: Facebook, WhatsApp and X
 * key their preview cache on the URL, so re-cutting the artwork under the same
 * filename would otherwise keep serving the old card. Bump it whenever
 * public/og-image.png is redrawn.
 */
export const OG_IMAGE_PATH = '/og-image.png?v=6';
