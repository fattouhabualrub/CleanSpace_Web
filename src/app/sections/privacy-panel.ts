import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { RevealDirective } from '../directives/reveal';

/**
 * Privacy, demonstrated rather than claimed.
 *
 * The visual is an iPhone's Control Center over a wallpaper. The visitor can
 * switch on Airplane Mode: Wi-Fi and mobile data go dark, and the CleanSpace
 * tile keeps scanning while the "uploaded" counter stays at zero — the app's
 * "works offline, uploads nothing" promise acted out in one tap.
 *
 * The four promises sit beside it as an iOS Settings grouped list, the same
 * coloured-square vocabulary the app's own Settings screen uses.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-privacy-panel',
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="section pv" id="privacy-highlight">
      <div class="container pv__grid">
        <div class="pv__copy" appReveal>
          <span class="kicker" style="--tone: var(--green)">{{ i18n.t('الخصوصية أولاً', 'Privacy first') }}</span>
          <h2 class="h2">{{ i18n.t('صورك لا تغادر جهازك — أبداً', 'Your photos never leave your device — ever') }}</h2>
          <p class="lede">{{ i18n.t(
            'كل الفحص والمقارنة والحذف يتم محلياً على الـ iPhone بقوة الشريحة نفسها. لا خوادم، لا رفع، لا تتبّع.',
            'All scanning, matching and deleting happen locally on your iPhone, powered by the chip itself. No servers, no uploads, no tracking.') }}</p>

          <ul class="pv__list">
            @for (p of pillars; track p.enT) {
              <li class="pv__row">
                <span class="pv__ic" [style.background]="p.color" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><use [attr.href]="'#i-' + p.icon"/></svg>
                </span>
                <div>
                  <h3>{{ i18n.t(p.arT, p.enT) }}</h3>
                  <p>{{ i18n.t(p.arD, p.enD) }}</p>
                </div>
              </li>
            }
          </ul>

          <a class="pv__link" routerLink="/privacy">
            {{ i18n.t('سياسة الخصوصية', 'Privacy Policy') }}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>

        <div class="pv__stage" appReveal>
          <span class="pv__glow" aria-hidden="true"></span>
          <div class="pv__phone" [class.is-airplane]="airplane()">
            <span class="pv__island" aria-hidden="true"></span>
            <div class="pv__screen">
              <img class="pv__wall" src="tiles/lg/aurora-cc.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">

              <div class="pv__status" aria-hidden="true">
                <span>9:41</span>
                <span class="pv__status-r">
                  @if (airplane()) {
                    <svg class="pv__plane-s" viewBox="0 0 24 24"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5v5.5l-2 1.5V21l3.5-1 3.5 1v-1.5l-2-1.5V13Z" fill="currentColor"/></svg>
                  } @else {
                    <svg viewBox="0 0 24 24"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="19.2" r="1.4" fill="currentColor"/></svg>
                  }
                  <span class="pv__batt"><i></i></span>
                </span>
              </div>

              <div class="pv__cc">
                <!-- Connectivity block: only Airplane Mode is a real control. -->
                <div class="pv__tile pv__conn">
                  <button type="button" class="pv__round pv__round--plane" [class.is-on]="airplane()"
                          [attr.aria-pressed]="airplane()" (click)="toggle()"
                          [attr.aria-label]="i18n.t('وضع الطيران', 'Airplane mode')">
                    <svg viewBox="0 0 24 24"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5v5.5l-2 1.5V21l3.5-1 3.5 1v-1.5l-2-1.5V13Z" fill="currentColor"/></svg>
                  </button>
                  <span class="pv__round pv__round--cell" [class.is-on]="!airplane()" role="img" [attr.aria-label]="i18n.t('بيانات الجوال', 'Mobile data')">
                    <svg viewBox="0 0 24 24"><path d="M5 19v-3M10 19v-6M15 19V9M20 19V5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>
                  </span>
                  <span class="pv__round pv__round--wifi" [class.is-on]="!airplane()" role="img" aria-label="Wi-Fi">
                    <svg viewBox="0 0 24 24"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="19.2" r="1.5" fill="currentColor"/></svg>
                  </span>
                  <span class="pv__round pv__round--bt is-on" role="img" aria-label="Bluetooth">
                    <svg viewBox="0 0 24 24"><path d="M7 7l10 10-5 4V3l5 4L7 17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </span>
                </div>

                <!-- The app, still at work. -->
                <div class="pv__tile pv__app">
                  <img src="icon-192.png" width="40" height="40" alt="">
                  <b>CleanSpace</b>
                  <span class="pv__app-state">
                    @if (airplane()) {
                      <span class="pv__offline">{{ i18n.t('بدون إنترنت', 'Works offline') }}</span>
                    } @else {
                      {{ i18n.t('جارٍ الفحص…', 'Scanning…') }}
                    }
                  </span>
                  <span class="pv__bar"><i></i></span>
                </div>

                <!-- Nothing leaves: the counter that never moves. -->
                <div class="pv__tile pv__zero">
                  <span class="pv__shield" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 3 5 6v5.5c0 4.3 3 7.3 7 9 4-1.7 7-4.7 7-9V6l-7-3Z" fill="currentColor"/><path d="M9.2 12.2l1.9 1.9 3.8-3.9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </span>
                  <b>0</b>
                  <span>{{ i18n.t('صورة تُرفع إلى أي مكان', 'photos uploaded anywhere') }}</span>
                </div>

                <div class="pv__tile pv__mini" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 3h6l-1 6h3l-6 12 1-8H9Z" fill="currentColor"/></svg></div>
                <div class="pv__tile pv__mini" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 9v4l2.5 2M10 3h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
                <div class="pv__tile pv__mini" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 7.5h7M8.5 12h1M12 12h1M15.5 12h0M8.5 16h1M12 16h1M15.5 16h0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
                <div class="pv__tile pv__mini" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v9A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5Z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/></svg></div>
              </div>
            </div>
          </div>
          @if (!touched()) {
            <p class="pv__hint" aria-hidden="true">
              <span class="pv__hint-dot"></span>{{ i18n.t('جرّب: فعّل وضع الطيران', 'Try it: turn on airplane mode') }}
            </p>
          }
        </div>
      </div>
    </section>
  `,
})
export class PrivacyPanelComponent {
  readonly i18n = inject(I18n);

  readonly airplane = signal(false);
  /** Hides the "try it" hint after the first tap. */
  readonly touched = signal(false);

  toggle(): void {
    this.airplane.update((v) => !v);
    this.touched.set(true);
  }

  /** iOS Settings colours: orange for connectivity, grey for account, red for tracking, indigo for locks. */
  readonly pillars = [
    { icon: 'offline', color: '#FF9500', arT: 'بدون إنترنت', enT: 'Works offline', arD: 'يعمل بالكامل بدون اتصال — لا حاجة لشبكة إطلاقاً.', enD: 'Runs entirely offline — no connection ever required.' },
    { icon: 'noaccount', color: '#8E8E93', arT: 'بلا حساب', enT: 'No account', arD: 'لا تسجيل ولا بريد ولا رقم هاتف. حمّل وابدأ فوراً.', enD: 'No sign-up, email or phone number. Just download and go.' },
    { icon: 'notrack', color: '#FF3B30', arT: 'بلا تتبّع ولا إعلانات', enT: 'No tracking, no ads', arD: 'لا نجمع بياناتك ولا نبيعها ولا نعرض إعلانات.', enD: 'We don’t collect, sell your data, or show ads.' },
    { icon: 'lock', color: '#5856D6', arT: 'خزنة مشفّرة', enT: 'Encrypted vault', arD: 'صورك الخاصة محمية بـ Face ID ومشفّرة على جهازك.', enD: 'Private photos are locked with Face ID and encrypted on-device.' },
  ];
}
