import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { APP_STORE_URL, detectPlatform, type Platform } from '../services/app-links';
import { AppStoreBadgeComponent } from '../components/appstore-badge';
import { StorageBarComponent } from '../components/storage-bar';
import { GoogleAnalyticsService } from '../core/services/google-analytics.service';
import { APP_RATING } from '../core/seo/app-rating';
import { MIN_RATINGS_SHOWN } from '../core/seo/structured-data.service';

/**
 * /download — a smart link for QR codes, bios, and campaigns.
 *
 * On iOS we hand the visitor straight to the App Store. The redirect is
 * fire-and-forget: nothing tells us whether it worked, so we simply arm a timer
 * before leaving and, if the page is still alive when it fires, we surface a
 * manual button. Same if the visitor comes back from the store (bfcache
 * `pageshow`) — we show the button rather than firing the redirect a second time
 * and trapping them in a loop.
 *
 * Everywhere else there is nothing to redirect *to* (the app is iOS-only for
 * now), so we skip the redirect and just show the badge.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-download',
  imports: [RouterLink, AppStoreBadgeComponent, StorageBarComponent],
  template: `
    <section class="section page-top">
      <div class="container container--narrow">
        <div class="dl">
          <img class="dl__icon" src="icon-192.png" width="88" height="88" alt="CleanSpace">
          <h1>{{ i18n.t('حمّل CleanSpace', 'Get CleanSpace') }}</h1>

          <!-- Lede, then the action straight away, then the reason to want it:
               the storage bars are persuasion, so they no longer stand between
               the visitor and the button. -->
          @if (redirecting()) {
            <!-- Optimistic state: the store is (hopefully) opening right now. -->
            <p class="dl__lede" role="status">
              <span class="dl__spinner" aria-hidden="true"></span>
              {{ i18n.t('جارٍ فتح App Store…', 'Opening the App Store…') }}
            </p>
            <p class="dl__hint">
              {{ i18n.t('لحظة واحدة. إن لم يُفتح تلقائياً فسيظهر لك زر.',
                        'One moment. If it does not open on its own, a button will appear.') }}
            </p>
          } @else if (platform() === 'ios') {
            <p class="dl__lede">
              {{ i18n.t('لم يُفتح App Store تلقائياً؟ اضغط الزر أدناه.',
                        'The App Store did not open automatically? Tap the button below.') }}
            </p>
          } @else if (platform() === 'android') {
            <p class="dl__lede">
              {{ i18n.t('CleanSpace متوفر حالياً على iPhone وiPad فقط.',
                        'CleanSpace is currently available on iPhone and iPad only.') }}
            </p>
          } @else {
            <p class="dl__lede">
              {{ i18n.t('CleanSpace تطبيق للجوال. افتح هذه الصفحة من جوالك، أو حمّله من App Store.',
                        'CleanSpace is a mobile app. Open this page on your phone, or grab it from the App Store.') }}
            </p>
          }

          @if (!redirecting()) {
            @if (platform() === 'ios') {
              <a class="btn btn--primary btn--block dl__cta" [href]="APP_STORE_URL" rel="noopener"
                 (click)="analytics.downloadClick('download_page_fallback')">
                <svg class="ico" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" stroke="none" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.51 4.09l-.02-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                {{ i18n.t('افتح App Store', 'Open the App Store') }}
              </a>
            } @else if (platform() === 'desktop') {
              <!-- On a computer the app can't be installed here, so the fastest
                   path is the phone in the visitor's pocket: scan, land on the
                   store. Each locale's code points at its own download page. -->
              <div class="dl__scan">
                <div class="dl__qr">
                  <img class="dl__qr-code" [src]="'qr/' + i18n.lang() + '.svg'" width="144" height="144"
                       [alt]="i18n.t('رمز QR لتحميل CleanSpace', 'QR code to download CleanSpace')">
                  <img class="dl__qr-logo" src="icon-192.png" width="34" height="34" alt="" aria-hidden="true">
                </div>
                <div class="dl__scan-txt">
                  <b>{{ i18n.t('امسح الرمز بكاميرا آيفونك', 'Scan with your iPhone camera') }}</b>
                  <span>{{ i18n.t('سيفتح CleanSpace على App Store مباشرة.', 'It opens CleanSpace on the App Store.') }}</span>
                  <app-appstore-badge placement="download_page_desktop" />
                </div>
              </div>
            } @else {
              <div class="dl__badges">
                <app-appstore-badge placement="download_page_android" />
              </div>
            }
          }

          <!-- The real App Store rating, the same figures the home page shows. -->
          @if (rating.count >= minRatings) {
            <p class="dl__rating" [attr.aria-label]="ratingLabel()">
              <span class="dl__stars" aria-hidden="true" [style.--fill.%]="rating.value * 20">★★★★★</span>
              <b aria-hidden="true">{{ rating.value.toFixed(1) }}</b>
              <span aria-hidden="true">App Store ({{ rating.count }})</span>
            </p>
          }

          <app-storage-bar />

          <p class="dl__foot">
            {{ i18n.t('هل تواجه مشكلة في التحميل؟', 'Trouble downloading?') }}
            <a routerLink="/support">{{ i18n.t('راسل الدعم', 'Contact support') }}</a>
          </p>
        </div>
      </div>
    </section>
  `,
})
export class DownloadPageComponent implements OnInit, OnDestroy {
  i18n = inject(I18n);
  readonly analytics = inject(GoogleAnalyticsService);

  readonly APP_STORE_URL = APP_STORE_URL;
  readonly rating = APP_RATING;
  readonly minRatings = MIN_RATINGS_SHOWN;
  readonly platform = signal<Platform>('desktop');

  ratingLabel(): string {
    return this.i18n
      .t('تقييم {v} من 5 على App Store ({n} تقييم)', 'Rated {v} out of 5 on the App Store ({n} ratings)')
      .replace('{v}', this.rating.value.toFixed(1))
      .replace('{n}', String(this.rating.count));
  }
  private readonly attempting = signal(false);

  /** Only iOS auto-redirects: it's the one platform with a live store link. */
  readonly redirecting = computed(() => this.attempting() && this.platform() === 'ios');

  private timers: number[] = [];
  // `pageshow` also fires on the very first load — only a bfcache restore
  // (persisted) means the visitor is coming *back*, so only that cancels.
  private readonly onPageShow = (e: PageTransitionEvent) => { if (e.persisted) this.giveUp(); };

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const platform = detectPlatform();
    this.platform.set(platform);

    // iOS is the only platform with a live store link, so it's the only one we redirect.
    if (platform !== 'ios') return;
    const target = APP_STORE_URL;

    this.attempting.set(true);
    // Most iOS visitors never see a button — they're handed straight to the store —
    // so without this the page's real conversions would go uncounted. Sent before
    // navigating, and tagged trigger:'auto' so it can be split from real taps.
    // Scans of the desktop QR code arrive with ?ref=qr, so they can be counted apart.
    const viaQr = new URLSearchParams(window.location.search).get('ref') === 'qr';
    this.analytics.downloadClick(viaQr ? 'download_page_qr' : 'download_page_auto', 'auto');
    // Hand off immediately — no delay, no intermediate paint the visitor has to sit
    // through. The "opening…" state below only ever shows if the browser is slow to
    // act on this or ignores it outright.
    window.location.href = target;
    // If we're still here after this, the hand-off didn't take — show the button.
    this.timers.push(window.setTimeout(() => this.giveUp(), 1800));
    // Returning from the store restores this page from bfcache; don't re-fire.
    window.addEventListener('pageshow', this.onPageShow);
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
    if (typeof window !== 'undefined') window.removeEventListener('pageshow', this.onPageShow);
  }

  private giveUp(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.attempting.set(false);
  }
}
