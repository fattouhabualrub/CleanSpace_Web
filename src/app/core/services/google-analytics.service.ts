import { DOCUMENT, DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { I18n } from '../../services/i18n';

/** Parameters accepted by a gtag command (GA4 event/config params). */
export type GtagParams = Record<string, unknown>;

/** The subset of the gtag.js API this app uses. */
type GtagFn = {
  (command: 'js', config: Date): void;
  (command: 'config', targetId: string, params?: GtagParams): void;
  (command: 'event', eventName: string, params?: GtagParams): void;
};

declare global {
  interface Window {
    /** gtag.js command queue. Absent until init() runs (or GA is disabled). */
    dataLayer?: unknown[];
    /** gtag.js entry point. Absent until init() runs (or GA is disabled). */
    gtag?: GtagFn;
  }
}

/**
 * Google Analytics 4.
 *
 * Everything is inert unless we're in a browser *and* a measurement ID is
 * configured, so the server render never touches window/document and local
 * development (empty ID) never loads the script or emits an event.
 *
 * Page views are sent by hand off the router rather than by gtag's automatic
 * tracking — in a single-page app the automatic one fires on the initial load
 * only, and enabling both double-counts the first view.
 */
@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18n = inject(I18n);

  private readonly measurementId = environment.gaMeasurementId;
  private started = false;

  /** Browser + configured. Every public entry point checks this first. */
  private get enabled(): boolean {
    return isPlatformBrowser(this.platformId) && this.measurementId.length > 0;
  }

  /** The window behind the injected document — null on the server. */
  private get window(): (Window & typeof globalThis) | null {
    return this.document.defaultView;
  }

  /**
   * Loads gtag.js, bootstraps the dataLayer, and starts reporting a page_view
   * per router navigation. Safe to call more than once — later calls are no-ops.
   * Does nothing at all when analytics are disabled.
   */
  init(): void {
    const win = this.window;
    if (!this.enabled || this.started || !win) return;
    this.started = true;

    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(this.measurementId)}`;
    this.document.head.appendChild(script);

    win.dataLayer = win.dataLayer ?? [];
    // gtag.js reads its queue as arguments objects, so this shim must not be an
    // arrow function.
    win.gtag = function gtag(): void {
      win.dataLayer?.push(arguments);
    } as GtagFn;

    win.gtag('js', new Date());
    win.gtag('config', this.measurementId, { send_page_view: false });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => this.pageView(e.urlAfterRedirects));
  }

  /**
   * Sends a custom GA4 event, e.g. event('download_click', { store: 'app_store' }).
   * A no-op when analytics are disabled.
   */
  event(action: string, params?: GtagParams): void {
    if (!this.enabled) return;
    this.window?.gtag?.('event', action, params);
  }

  /**
   * The site's primary conversion: someone heading to the App Store.
   *
   * One event name for every route to the store, with `placement` saying which
   * control was used and `trigger` separating a real tap from the /download
   * page's automatic hand-off — so auto-redirects can be included or excluded in
   * GA without needing a second event name.
   */
  downloadClick(placement: string, trigger: 'click' | 'auto' = 'click'): void {
    this.event('download_click', {
      store: 'app_store',
      placement,
      trigger,
      language: this.i18n.lang(),
    });
  }

  private pageView(path: string): void {
    const win = this.window;
    win?.gtag?.('event', 'page_view', {
      page_path: path,
      page_location: win.location.href,
      page_title: this.document.title,
    });
  }
}
