import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';
import { LegalPageComponent } from './pages/legal-page';
import { SupportPageComponent } from './pages/support';
import { DownloadPageComponent } from './pages/download';
import { langGuard } from './services/lang-route';

/** Route paths under a language prefix, used for prerendering and the sitemap. */
export const PAGE_PATHS = ['', 'download', 'support', 'privacy', 'terms'] as const;

/**
 * The site's pages. Built fresh per call so the prefixed branch and the bare
 * branch never share route config objects.
 */
const pages = (): Routes => [
  { path: '', component: HomeComponent },
  { path: 'download', component: DownloadPageComponent },
  // Short alias for QR codes / bio links.
  { path: 'get', redirectTo: 'download' },
  { path: 'support', component: SupportPageComponent },
  { path: 'terms', component: LegalPageComponent, data: { type: 'terms' } },
  { path: 'privacy', component: LegalPageComponent, data: { type: 'privacy' } },
];

export const routes: Routes = [
  // /<lang>/… — e.g. /en/download, /ar/download. langGuard applies the language;
  // when the first segment *isn't* a language (a bare /download, /support…) the
  // same guard redirects to the prefixed form, so every URL ends up localized.
  { path: ':lang', canActivate: [langGuard], children: pages() },
  // The bare root has no first segment for :lang to match.
  { path: '', canActivate: [langGuard], children: [{ path: '', component: HomeComponent }] },
  { path: '**', redirectTo: '' },
];
