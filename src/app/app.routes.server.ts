import { RenderMode, ServerRoute } from '@angular/ssr';
import { LANGUAGES } from './services/i18n';

/** One `{ lang }` per UI language — the parameter set every prefixed route expands over. */
const langParams = async () => LANGUAGES.map((l) => ({ lang: l.code }));

/**
 * Prerender every page in every language: 17 locales × 5 routes = 85 static
 * files. The site is fixed marketing copy, so there is nothing per-request to
 * compute, and static output is what the LiteSpeed host can serve.
 *
 * The bare root is deliberately *not* prerendered — .htaccess 301s it to the
 * visitor's language, so no crawler should ever be served an unprefixed page.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Client },
  { path: ':lang', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/download', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/support', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/privacy', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/terms', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  // /get is an alias that redirects to /download; nothing to prerender.
  { path: ':lang/get', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];
