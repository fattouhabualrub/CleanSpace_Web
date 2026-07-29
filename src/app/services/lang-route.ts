import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { I18n, LANGUAGES, type Lang } from './i18n';

/** Lower-cased URL segment → canonical language code ('pt-br' → 'pt-BR'). */
const BY_CODE = new Map<string, Lang>(LANGUAGES.map((l) => [l.code.toLowerCase(), l.code]));

/** The canonical code for a URL segment, or null if it isn't a language at all. */
export function toLangCode(segment: string | undefined | null): Lang | null {
  return (segment && BY_CODE.get(segment.toLowerCase())) || null;
}

/**
 * Rebuilds a URL with `lang` as its first segment, preserving query and fragment.
 *
 * Built from segments rather than by gluing strings together: '/en' + '/' would
 * give '/en/', whose trailing empty segment no child route can consume, and the
 * failed match would come straight back here — a redirect loop on the home page.
 */
function prefixed(router: Router, lang: Lang, url: string): UrlTree {
  const tree = router.parseUrl(url);
  const segments = (tree.root.children['primary']?.segments ?? [])
    .map((s) => s.path)
    .filter((p) => p.length > 0);
  // A language segment here means we already prefixed once; dropping it keeps us
  // from prefixing twice and looping.
  if (toLangCode(segments[0])) segments.shift();
  return router.createUrlTree([`/${lang}`, ...segments], {
    queryParams: tree.queryParams,
    fragment: tree.fragment ?? undefined,
  });
}

/**
 * The one language gate for the whole site.
 *
 * On a /<lang>/… URL it applies that language — the URL always wins over the
 * saved preference. On anything else the first segment isn't a language, so the
 * URL is unprefixed: it gets rewritten to /<active lang>/… within the same
 * navigation, which costs no extra history entry. Every URL therefore ends up
 * carrying its language, which is what makes per-locale canonicals and hreflang
 * meaningful.
 */
export const langGuard: CanActivateFn = (route, state) => {
  const code = toLangCode(route.params['lang']);
  // Awaited so the route activates only once the copy for that language is in
  // place — the prerenderer then serializes a fully translated page.
  if (code) return inject(I18n).setLang(code).then(() => true);
  return prefixed(inject(Router), inject(I18n).lang(), state.url);
};

/**
 * Rewrites the language segment of the current URL, used when the picker changes
 * the language. Returns null when the URL carries no language prefix.
 */
export function urlWithLang(router: Router, code: Lang): UrlTree | null {
  const tree = router.parseUrl(router.url);
  const first = tree.root.children['primary']?.segments[0];
  if (!first || !toLangCode(first.path)) return null;
  return prefixed(router, code, router.url);
}
