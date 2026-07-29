/**
 * Development environment. An empty gaMeasurementId keeps local traffic out of
 * analytics: the gtag.js script is never loaded and no events are sent.
 *
 * siteUrl stays the production host on purpose — canonical/hreflang/JSON-LD must
 * describe the real site even when you're viewing a local build, otherwise a
 * localhost URL could end up in a shared screenshot or a copied tag.
 */
export const environment = {
  production: false,

  siteUrl: 'https://cleaningspace.app',

  appStoreId: '6790139624',
  appStoreUrl: 'https://apps.apple.com/app/id6790139624',

  defaultLocale: 'en',

  gaMeasurementId: '',
};
