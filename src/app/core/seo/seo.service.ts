import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { I18n, LANGUAGES, type Lang } from '../../services/i18n';
import { OG_IMAGE_PATH } from '../brand';
import { OG_LOCALE, SEO_COPY } from './seo-copy';
import { PAGE_COPY, isSeoPage } from './page-copy';

/**
 * Emits the head tags for the current locale + URL.
 *
 * The home page uses SEO_COPY; each secondary route has its own title and
 * description in PAGE_COPY, so no two URLs in a locale share a title. The
 * canonical is per-route too: it must point at the URL being served, otherwise
 * /download, /privacy and /terms all canonicalize to the home page and never
 * get indexed.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = inject(I18n);

  private readonly site = environment.siteUrl;

  /**
   * Writes every head tag for `path` (a root-relative path such as '/download',
   * '' for the home page) in the active locale. Safe to call on each navigation:
   * tags are replaced, not appended.
   */
  update(path: string): void {
    const lang = this.i18n.lang();
    const page = path.replace(/^\/+|\/+$/g, '');
    const copy = isSeoPage(page) ? { ...SEO_COPY[lang], ...PAGE_COPY[page][lang] } : SEO_COPY[lang];
    const url = this.pageUrl(lang, path);
    const image = `${this.site}${OG_IMAGE_PATH}`;

    this.title.setTitle(copy.title);

    this.setName('description', copy.description);
    this.setName('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    // Apple's smart app banner — a download-driven site should always carry it.
    this.setName('apple-itunes-app', `app-id=${environment.appStoreId}`);

    this.setProperty('og:type', 'website');
    this.setProperty('og:site_name', 'CleanSpace');
    this.setProperty('og:title', copy.title);
    this.setProperty('og:description', copy.description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', image);
    this.setProperty('og:image:width', '1200');
    this.setProperty('og:image:height', '630');
    this.setProperty('og:image:alt', copy.imageAlt);

    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', copy.title);
    this.setName('twitter:description', copy.description);
    this.setName('twitter:image', image);

    this.setOgLocales(lang);
    this.setCanonical(url);
    this.setAlternates(path);
  }

  /** Absolute URL of `path` in `lang`. '' → https://site/en, '/download' → …/en/download. */
  private pageUrl(lang: Lang, path: string): string {
    const clean = path.replace(/^\/+|\/+$/g, '');
    return clean ? `${this.site}/${lang}/${clean}` : `${this.site}/${lang}`;
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setOgLocales(current: Lang): void {
    this.setProperty('og:locale', OG_LOCALE[current]);
    // updateTag can't express a repeated property, so the alternates are rebuilt.
    this.doc.head
      .querySelectorAll('meta[property="og:locale:alternate"]')
      .forEach((n) => n.remove());
    for (const l of LANGUAGES) {
      if (l.code === current) continue;
      const tag = this.doc.createElement('meta');
      tag.setAttribute('property', 'og:locale:alternate');
      tag.setAttribute('content', OG_LOCALE[l.code]);
      this.doc.head.appendChild(tag);
    }
  }

  /** Self-referencing canonical for the exact URL being served. */
  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /**
   * The full reciprocal hreflang set: every page links to all 21 alternates
   * including itself, plus x-default. Stale nodes are cleared first so they
   * don't accumulate across client-side navigations.
   */
  private setAlternates(path: string): void {
    this.doc.head.querySelectorAll('link[rel="alternate"]').forEach((n) => n.remove());
    const add = (hreflang: string, href: string) => {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      this.doc.head.appendChild(link);
    };
    for (const l of LANGUAGES) add(l.code, this.pageUrl(l.code, path));
    add('x-default', this.pageUrl(environment.defaultLocale as Lang, path));
  }
}
