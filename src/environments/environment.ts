/**
 * Production environment. Swapped for environment.development.ts by the
 * `development` build configuration (see fileReplacements in angular.json).
 */
export const environment = {
  production: true,

  /**
   * Canonical host — the single source of truth for every absolute URL the site
   * emits (canonical, hreflang, og:url, og:image, JSON-LD, sitemap). No scheme-
   * relative or hardcoded hosts anywhere else.
   */
  siteUrl: 'https://cleaningspace.app',

  appStoreId: '6790139624',
  appStoreUrl: 'https://apps.apple.com/app/id6790139624',

  /** Locale used for x-default and for bare URLs with no saved preference. */
  defaultLocale: 'en',

  /**
   * GA4 measurement ID — the CleanSpace web stream.
   * An empty string disables analytics entirely (see environment.development.ts).
   */
  gaMeasurementId: 'G-HN5660C20F',
};
