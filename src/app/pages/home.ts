import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { APP_STORE_URL } from '../services/app-links';
import { GoogleAnalyticsService } from '../core/services/google-analytics.service';
import { Shots } from '../core/shots';
import { FAQ } from '../core/content/faq';
import { RevealDirective } from '../directives/reveal';
import { SpotlightDirective } from '../directives/spotlight';
import { ScrollStepDirective } from '../directives/scroll-step';
import { CountUpDirective } from '../directives/count-up';
import { AppStoreBadgeComponent } from '../components/appstore-badge';
import { GooglePlayBadgeComponent } from '../components/googleplay-badge';
import { HeroComponent } from '../sections/hero';
import { SwipeDemoComponent } from '../sections/swipe-demo';
import { ScreenOrbitComponent } from '../sections/screen-orbit';
import { PrivacyPanelComponent } from '../sections/privacy-panel';

interface Feature { icon: string; arT: string; enT: string; arD: string; enD: string; art?: 'vault' | 'compress' | 'history' | 'langs'; tone: string; }
interface Category { key: string; icon: string; ar: string; en: string; arD: string; enD: string; tone: string; wide?: boolean; }
interface Plan {
  arName: string; enName: string;
  /** What the customer pays today. */
  price: string;
  /** Pre-discount price, struck through beside `price` when present. */
  wasPrice?: string;
  arPer: string; enPer: string; featured: boolean; arTag?: string; enTag?: string;
  /** Carries App Store Connect's introductory offer. Only the weekly product has one. */
  trial?: boolean;
}
/** One beat of the sticky scrollytelling tour; `shot` names a file in public/screens. */
interface TourStep { shot: string; icon: string; tone: string; arT: string; enT: string; arD: string; enD: string; }

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  imports: [
    RouterLink, RevealDirective, SpotlightDirective, ScrollStepDirective, CountUpDirective,
    AppStoreBadgeComponent, GooglePlayBadgeComponent,
    HeroComponent, SwipeDemoComponent, ScreenOrbitComponent, PrivacyPanelComponent,
  ],
  template: `
    <!-- Icon sprite: one coherent outline family (24px, 1.8 stroke, currentColor) -->
    <svg class="icon-sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <symbol id="i-dup" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></symbol>
      <symbol id="i-video" viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3"/></symbol>
      <symbol id="i-swipe" viewBox="0 0 24 24"><path d="M8 12H3m0 0 3-3m-3 3 3 3"/><path d="M16 12h5m0 0-3-3m3 3-3 3"/><circle cx="12" cy="12" r="1.3"/></symbol>
      <symbol id="i-contacts" viewBox="0 0 24 24"><circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6"/><path d="M17 13.4A5.5 5.5 0 0 1 20.5 18.5"/></symbol>
      <symbol id="i-files" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h5"/></symbol>
      <symbol id="i-screenshot" viewBox="0 0 24 24"><path d="M7 3v13a1 1 0 0 0 1 1h13"/><path d="M17 21V8a1 1 0 0 0-1-1H3"/></symbol>
      <symbol id="i-vault" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.4" r="1.3"/></symbol>
      <symbol id="i-widget" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></symbol>
      <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.4 3.9 5.6 3.9 9s-1.4 6.6-3.9 9c-2.5-2.4-3.9-5.6-3.9-9S9.5 5.4 12 3Z"/></symbol>
      <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3 5 6v5.5c0 4.3 3 7.3 7 9 4-1.7 7-4.7 7-9V6l-7-3Z"/><path d="M9.2 12.2l1.9 1.9 3.8-3.9"/></symbol>
      <symbol id="i-scan" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></symbol>
      <symbol id="i-review" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></symbol>
      <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 4l1.7 4.6L18.3 10l-4.6 1.7L12 16l-1.7-4.3L5.7 10l4.6-1.4Z"/><path d="M19 4v3M20.5 5.5h-3"/></symbol>
      <symbol id="i-offline" viewBox="0 0 24 24"><path d="M3 3l18 18"/><path d="M5 12.6a10 10 0 0 1 4-2.4"/><path d="M8.7 16.3a5 5 0 0 1 3-1.4"/><path d="M12 20h.01"/><path d="M19 12.6a10 10 0 0 0-3.3-2.2"/></symbol>
      <symbol id="i-noaccount" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M6 20a6 6 0 0 1 10.5-4"/><path d="M4 4l16 16"/></symbol>
      <symbol id="i-notrack" viewBox="0 0 24 24"><path d="M3 3l18 18"/><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2"/><path d="M9.8 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.4 3.3M6.2 6.2A17.4 17.4 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 4-.9"/></symbol>
      <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></symbol>
      <symbol id="i-blur" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" stroke-dasharray="3 3"/><circle cx="12" cy="12" r="3.4"/></symbol>
      <symbol id="i-burst" viewBox="0 0 24 24"><rect x="3.5" y="6" width="12" height="12" rx="2.2"/><path d="M18 8.5v8"/><path d="M20.8 10.2v4.6"/></symbol>
      <symbol id="i-album" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 15.5 8.2 11l4 3.4L15.8 11 21 15.5"/><circle cx="8.6" cy="9.1" r="1.3"/></symbol>
      <symbol id="i-memory" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.6V12l3 1.8"/></symbol>
      <symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M21 20H3"/></symbol>
      <symbol id="i-bell" viewBox="0 0 24 24"><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9Z"/><path d="M13.7 19a2 2 0 0 1-3.4 0"/></symbol>
      <symbol id="i-video-dup" viewBox="0 0 24 24"><rect x="3" y="8" width="11" height="10" rx="2.2"/><path d="M14 11.2l4.2-2.5v8.6L14 14.8"/><path d="M6.5 5h9.2"/></symbol>
      <symbol id="i-file-large" viewBox="0 0 24 24"><path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5Z"/><path d="M4 7.5 12 11l8-3.5"/><path d="M12 11v9"/></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6.5 9.4 17 4 11.6"/></symbol>
      <symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5Z" fill="currentColor" stroke="none"/></symbol>
    </svg>

    <app-hero />

    <!-- ══ Facts ══ — four honest numbers, each with what it actually means.
         No invented ratings or download counts. -->
    <section class="facts" aria-labelledby="facts-title">
      <div class="container">
        <h2 class="facts__title" id="facts-title">
          <span class="kicker" style="--tone: var(--blue)">{{ i18n.t('بالأرقام', 'In numbers') }}</span>
        </h2>
        <ul class="facts__row">
          <li class="fact" style="--tone: var(--blue)" appReveal>
            <span class="fact__ic" aria-hidden="true"><svg class="ico"><use href="#i-scan"/></svg></span>
            <b class="fact__num"><span [appCountUp]="8"></span></b>
            <h3>{{ i18n.t('أنواع من الفوضى يكتشفها', 'kinds of clutter scanned') }}</h3>
            <p>{{ i18n.t('مكرر، متشابه، متتابع، غير واضح، سكرينشوت، فيديوهات كبيرة وأكثر.', 'Duplicates, look-alikes, bursts, blurry shots, screenshots, big videos and more.') }}</p>
            <!-- The eight, as the same icons the category cards use further down. -->
            <span class="fact__viz fact__kinds" aria-hidden="true">
              @for (c of categories; track c.key) {
                <i [style.--c]="c.tone"><svg class="ico"><use [attr.href]="'#i-' + c.icon"/></svg></i>
              }
            </span>
          </li>
          <li class="fact" style="--tone: var(--green)" [appReveal]="80">
            <span class="fact__ic" aria-hidden="true"><svg class="ico"><use href="#i-sparkle"/></svg></span>
            <b class="fact__num"><bdi dir="ltr"><span [appCountUp]="100"></span><small>MB</small></bdi></b>
            <h3>{{ i18n.t('تنظيف مجاني بلا اشتراك', 'free to clean, no subscription') }}</h3>
            <p>{{ i18n.t('احذف أول ١٠٠ ميغابايت مجاناً — بدون أي اشتراك.', 'Delete your first 100 MB for free — no subscription needed.') }}</p>
            <!-- The free allowance as a bar that fills when the card scrolls in. -->
            <span class="fact__viz fact__quota" aria-hidden="true">
              <span class="fact__bar"><i></i></span>
              <span class="fact__ends" dir="ltr"><span>0</span><span>100 MB</span></span>
            </span>
          </li>
          <li class="fact" style="--tone: var(--violet)" [appReveal]="160">
            <span class="fact__ic" aria-hidden="true"><svg class="ico"><use href="#i-globe"/></svg></span>
            <b class="fact__num"><span [appCountUp]="21"></span></b>
            <h3>{{ i18n.t('لغة مدعومة بالكامل', 'fully supported languages') }}</h3>
            <p>{{ i18n.t('واجهة كاملة بلغتك — بما فيها الكردية والعربية والفارسية.', 'A fully localized interface in your language — including Kurdish, Arabic and Persian.') }}</p>
            <span class="fact__viz fact__langs" aria-hidden="true">
              @for (f of flagSample; track f) { <i>{{ f }}</i> }
              <b dir="ltr">+{{ i18n.languages.length - flagSample.length }}</b>
            </span>
          </li>
          <li class="fact" style="--tone: var(--amber)" [appReveal]="240">
            <span class="fact__ic" aria-hidden="true"><svg class="ico"><use href="#i-shield"/></svg></span>
            <b class="fact__num"><span>0</span></b>
            <h3>{{ i18n.t('صورة تغادر جهازك', 'photos uploaded anywhere') }}</h3>
            <p>{{ i18n.t('كل المعالجة على جهازك — لا يُرفع أي شيء إلى أي خادم.', 'Everything runs on-device — nothing is uploaded anywhere.') }}</p>
            <!-- An upload cloud, struck through. -->
            <span class="fact__viz fact__zero" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5A3.75 3.75 0 0 1 17.5 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20v-7m0 0-2.5 2.5M12 13l2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path class="fact__slash" d="M4 4l16 16" fill="none" stroke-width="2.2" stroke-linecap="round"/></svg>
            </span>
          </li>
        </ul>
      </div>
    </section>

    <app-swipe-demo />

    <!-- ══ Guided tour (sticky scrollytelling) ══ -->
    <section class="section tour" id="tour" [style.--tone]="tour[active()].tone">
      <div class="container">
        <div class="head head--split" appReveal>
          <span class="kicker" style="--tone: var(--sky)">{{ i18n.t('جولة إرشادية', 'Guided tour') }}</span>
          <h2 class="h2">{{ i18n.t('مرّر لترى كيف يعمل', 'Scroll to see how it works') }}</h2>
          <p class="lede">{{ i18n.t('لقطات حقيقية من CleanSpace — بلا تجميل.', 'Real screenshots from CleanSpace — nothing staged.') }}</p>
        </div>

        <div class="tour__grid">
          <div class="tour__stage">
            <span class="tour__aura" aria-hidden="true"></span>
            <div class="tour__phone">
              @for (s of tour; track s.shot; let i = $index) {
                <img class="tour__shot" [class.is-active]="i === active()" [class.is-past]="i < active()"
                     [src]="shots.src(s.shot)" [attr.srcset]="shots.srcset(s.shot)" sizes="320px"
                     width="1040" height="2203" loading="lazy" decoding="async"
                     [alt]="i18n.t(s.arT, s.enT)">
              }
            </div>
            <div class="tour__meter" aria-hidden="true">
              <span class="tour__meter-fill" [style.--p]="(active() + 1) / tour.length"></span>
              <b>{{ '0' + (active() + 1) }}</b><span>/ {{ '0' + tour.length }}</span>
            </div>
          </div>

          <ol class="tour__steps">
            @for (s of tour; track s.shot; let i = $index) {
              <li class="tour__step" [class.is-active]="i === active()" [style.--step-tone]="s.tone"
                  [appScrollStep]="i" (stepEnter)="active.set($event)">
                <span class="tour__icon"><svg class="ico" aria-hidden="true"><use [attr.href]="'#i-' + s.icon"/></svg></span>
                <h3>{{ i18n.t(s.arT, s.enT) }}</h3>
                <p>{{ i18n.t(s.arD, s.enD) }}</p>
                <!-- Mobile only: the sticky stage collapses, so each step carries its own frame. -->
                <img class="tour__inline" [src]="shots.src(s.shot)" [attr.srcset]="shots.srcset(s.shot, 720)" sizes="300px"
                     width="1040" height="2203"
                     loading="lazy" decoding="async" alt="">
              </li>
            }
          </ol>
        </div>
      </div>
    </section>

    <!-- ══ What it finds — eight live miniatures ══ -->
    <section class="section section--deep finds cv" id="finds">
      <div class="container">
        <div class="head head--center" appReveal>
          <span class="kicker" style="--tone: var(--rose)">{{ i18n.t('ما الذي يجده', 'What it finds') }}</span>
          <h2 class="h2">{{ i18n.t('ثماني فئات من الفوضى', 'Eight kinds of clutter') }}</h2>
          <p class="lede">{{ i18n.t('فحص واحد يفرز مكتبتك كلها إلى فئات واضحة، كلٌّ منها بحجمها بالميغابايت.', 'One scan sorts your whole library into clear categories, each with its size on disk.') }}</p>
        </div>

        <ul class="clutter">
          @for (c of categories; track c.key; let i = $index) {
            <li class="cl" [class.cl--wide]="c.wide" [attr.data-art]="c.key" [style.--tone]="c.tone"
                [appReveal]="(i % 4) * 70" appSpotlight>
              <div class="cl__art" aria-hidden="true">
                @switch (c.key) {
                  @case ('dup') {
                    <div class="art-dup">
                      <figure class="mini mini--best"><img src="tiles/eiffel.webp" alt=""><span class="mini__best">{{ i18n.t('الأفضل', 'Best') }}</span><span class="mini__size">3.1 MB</span></figure>
                      <figure class="mini mini--del"><img src="tiles/eiffel.webp" alt=""><span class="mini__check"><svg class="ico"><use href="#i-check"/></svg></span><span class="mini__size">3.1 MB</span></figure>
                    </div>
                  }
                  @case ('similar') {
                    <div class="art-sim">
                      <figure class="mini mini--del"><img src="tiles/pyramids2.webp" alt=""><span class="mini__check"><svg class="ico"><use href="#i-check"/></svg></span></figure>
                      <figure class="mini mini--best"><img src="tiles/pyramids.webp" alt=""><span class="mini__best">{{ i18n.t('الأفضل', 'Best') }}</span></figure>
                      <figure class="mini mini--del"><img src="tiles/pyramids3.webp" alt=""><span class="mini__check"><svg class="ico"><use href="#i-check"/></svg></span></figure>
                    </div>
                  }
                  @case ('burst') {
                    <div class="art-burst">
                      @for (n of [0, 1, 2, 3, 4]; track n) {
                        <figure class="mini" [style.--k]="n"><img src="tiles/kid-sea.webp" alt=""></figure>
                      }
                      <span class="art-burst__n">×5</span>
                    </div>
                  }
                  @case ('blur') {
                    <div class="art-blur">
                      <figure class="mini"><img src="tiles/birthday.webp" alt=""></figure>
                      <span class="art-blur__focus"></span>
                    </div>
                  }
                  @case ('shots') {
                    <div class="art-shots">
                      @for (n of [0, 1, 2]; track n) {
                        <span class="art-shots__ph" [style.--k]="n"><i></i><i></i><i></i><i></i></span>
                      }
                    </div>
                  }
                  @case ('video') {
                    <div class="art-video">
                      <figure class="mini mini--wide"><img src="tiles/petra.webp" alt="">
                        <span class="art-video__play"><svg class="ico"><use href="#i-play"/></svg></span>
                        <span class="art-video__bar"><i></i></span>
                        <span class="mini__size">1.2 GB</span>
                      </figure>
                    </div>
                  }
                  @case ('simvideo') {
                    <div class="art-simv">
                      <figure class="mini mini--wide"><img src="tiles/aurora.webp" alt=""><span class="art-video__play"><svg class="ico"><use href="#i-play"/></svg></span><span class="mini__size">0:42</span></figure>
                      <span class="art-simv__eq">≈</span>
                      <figure class="mini mini--wide"><img src="tiles/aurora.webp" alt="" style="object-position: 70% 40%; scale: 1.15"><span class="art-video__play"><svg class="ico"><use href="#i-play"/></svg></span><span class="mini__size">0:40</span></figure>
                    </div>
                  }
                  @case ('files') {
                    <div class="art-files">
                      @for (f of fileRows; track f.ext) {
                        <div class="art-files__row" [style.--w]="f.w" [style.--c]="f.c">
                          <span class="art-files__ext">{{ f.ext }}</span>
                          <span class="art-files__bar"><i></i></span>
                          <span class="art-files__mb">{{ f.mb }}</span>
                        </div>
                      }
                    </div>
                  }
                }
              </div>
              <div class="cl__txt">
                <h3><span class="cl__ic"><svg class="ico" aria-hidden="true"><use [attr.href]="'#i-' + c.icon"/></svg></span>{{ i18n.t(c.ar, c.en) }}</h3>
                <p>{{ i18n.t(c.arD, c.enD) }}</p>
              </div>
            </li>
          }
        </ul>
      </div>
    </section>

    <!-- ══ Features bento ══ -->
    <section class="section cv" id="features">
      <div class="container">
        <div class="head head--split" appReveal>
          <span class="kicker" style="--tone: var(--blue)">{{ i18n.t('المميزات', 'Features') }}</span>
          <h2 class="h2">{{ i18n.t('أكثر بكثير من حذف المكرر', 'Far more than a duplicate finder') }}</h2>
          <p class="lede">{{ i18n.t('أدوات قوية، بواجهة بسيطة، وخصوصية كاملة.', 'Powerful tools, a simple interface, and full privacy.') }}</p>
        </div>

        <div class="bento">
          @for (f of features; track f.enT; let i = $index) {
            <article class="bx" [class.bx--wide]="f.art" [attr.data-art]="f.art" [style.--tone]="f.tone"
                     [appReveal]="(i % 3) * 70" appSpotlight>
              @if (f.art) {
                <div class="bx__art" aria-hidden="true">
                  @switch (f.art) {
                    @case ('vault') {
                      <div class="art-vault">
                        <div class="art-vault__grid">
                          @for (t of vaultTiles; track t) { <img [src]="'tiles/' + t + '.webp'" alt=""> }
                        </div>
                        <span class="art-vault__lock">
                          <span class="art-vault__frame"><i></i><i></i><i></i><i></i></span>
                          <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2.5" fill="currentColor"/><path class="art-vault__shackle" d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
                        </span>
                      </div>
                    }
                    @case ('compress') {
                      <div class="art-comp">
                        <figure class="mini mini--wide"><img src="tiles/maldives.webp" alt=""><span class="art-video__play"><svg class="ico"><use href="#i-play"/></svg></span></figure>
                        <div class="art-comp__bars">
                          <div class="art-comp__row"><span>HEVC 4K</span><span class="art-comp__bar art-comp__bar--before"><i></i></span><b>86 MB</b></div>
                          <div class="art-comp__row"><span>1080p</span><span class="art-comp__bar art-comp__bar--after"><i></i></span><b>31 MB</b></div>
                        </div>
                      </div>
                    }
                    @case ('history') {
                      <div class="art-hist">
                        @for (h of historyBars; track $index) {
                          <span class="art-hist__bar" [style.--h]="h" [style.--k]="$index"></span>
                        }
                      </div>
                    }
                    @case ('langs') {
                      <div class="art-langs" dir="ltr">
                        <div class="art-langs__row">
                          @for (l of langLoopA; track $index) { <span>{{ l }}</span> }
                        </div>
                        <div class="art-langs__row art-langs__row--rev">
                          @for (l of langLoopB; track $index) { <span>{{ l }}</span> }
                        </div>
                      </div>
                    }
                  }
                </div>
              }
              <div class="bx__txt">
                <span class="bx__ic"><svg class="ico" aria-hidden="true"><use [attr.href]="'#i-' + f.icon"/></svg></span>
                <h3>{{ i18n.t(f.arT, f.enT) }}</h3>
                <p>{{ i18n.t(f.arD, f.enD) }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- ══ Inside the app — 3D ring ══ -->
    <section class="section section--deep gallery cv" id="screens" aria-labelledby="gallery-title">
      <div class="container">
        <div class="head head--center" appReveal>
          <span class="kicker" style="--tone: var(--violet)">{{ i18n.t('من داخل التطبيق', 'Inside the app') }}</span>
          <h2 class="h2" id="gallery-title">{{ i18n.t('تصميم بسيط، نتائج واضحة', 'Simple design, clear results') }}</h2>
        </div>
      </div>
      <app-screen-orbit />
    </section>

    <!-- ══ How it works ══ -->
    <section class="section how cv" id="how">
      <div class="container">
        <div class="head head--center" appReveal>
          <span class="kicker" style="--tone: var(--green)">{{ i18n.t('كيف يعمل', 'How it works') }}</span>
          <h2 class="h2">{{ i18n.t('ثلاث خطوات فقط', 'Just three steps') }}</h2>
          <p class="lede">{{ i18n.t('من الفوضى إلى مساحة نظيفة في دقيقة.', 'From clutter to clean space in a minute.') }}</p>
        </div>
        <ol class="steps" appReveal>
          @for (s of steps; track s.enT; let i = $index) {
            <li class="step" [style.--k]="i">
              <span class="step__num" aria-hidden="true">{{ i + 1 }}</span>
              <span class="step__badge"><svg class="ico" aria-hidden="true"><use [attr.href]="'#i-' + s.icon"/></svg></span>
              <h3>{{ i18n.t(s.arT, s.enT) }}</h3>
              <p>{{ i18n.t(s.arD, s.enD) }}</p>
            </li>
          }
        </ol>
      </div>
    </section>

    <!-- ══ Privacy — Control Center with Airplane Mode ══ -->
    <app-privacy-panel />

    <!-- ══ Plans ══ -->
    <section class="section cv" id="plans">
      <div class="container">
        <div class="head head--center" appReveal>
          <span class="kicker" style="--tone: var(--amber)">{{ i18n.t('الأسعار', 'Pricing') }}</span>
          <h2 class="h2">{{ i18n.t('اختر خطتك', 'Choose your plan') }}</h2>
          <p class="lede">{{ i18n.t('ابدأ بـ٧ أيام مجاناً على الخطة الأسبوعية، أو افحص وحرّر أول ١٠٠ ميغابايت بلا أي اشتراك.', 'Start with 7 days free on the weekly plan, or scan and clear your first 100 MB with no subscription at all.') }}</p>
        </div>
        <div class="plans">
          @for (p of plans; track p.enName) {
            <div class="plan" [class.plan--featured]="p.featured" [appReveal]="$index * 90" appSpotlight>
              @if (p.featured) { <div class="plan__badge">{{ i18n.t('الأكثر شيوعًا', 'Most popular') }}</div> }
              <div class="plan__top">
                <div class="plan__name">{{ i18n.t(p.arName, p.enName) }}</div>
                @if (p.trial) {
                  <span class="plan__trial">{{ i18n.t('٧ أيام مجاناً', '7 days free') }}</span>
                } @else if (p.arTag) {
                  <span class="plan__tag">{{ i18n.t(p.arTag, p.enTag!) }}</span>
                }
              </div>
              <div class="plan__price">
                @if (p.wasPrice) {
                  <s class="plan__was" [attr.aria-label]="i18n.t('السعر قبل الخصم', 'Regular price')">{{ p.wasPrice }}</s>
                }
                @if (p.trial) { <small class="plan__then">{{ i18n.t('ثم', 'then') }}</small> }
                <b>{{ p.price }}</b><span>{{ i18n.t(p.arPer, p.enPer) }}</span>
              </div>
              @if (p.trial) {
                <!-- Apple grants an introductory offer once per subscription group per
                     account, so a returning subscriber will not see the trial. Saying so
                     here is what keeps the headline from being a promise we can't keep. -->
                <span class="plan__fine">{{ i18n.t('تجربة واحدة لكل حساب Apple', 'One trial per Apple account') }}</span>
              }
              <ul class="plan__list">
                @for (feat of proFeatures; track feat.en) {
                  <li><svg class="ico" aria-hidden="true"><use href="#i-check"/></svg>{{ i18n.t(feat.ar, feat.en) }}</li>
                }
              </ul>
              <a class="btn plan__cta" [class.btn--primary]="p.featured" [class.btn--ghost]="!p.featured"
                 [href]="APP_STORE_URL"
                 target="_blank"
                 rel="noopener noreferrer"
                 (click)="analytics.downloadClick('plans_' + p.enName.toLowerCase().replace(' ', '_'))">
                {{ p.trial ? i18n.t('جرّبه مجاناً', 'Try it free') : i18n.t('اشترك', 'Subscribe') }}
              </a>
            </div>
          }
        </div>
        <p class="plans__legal">
          {{ i18n.t(
            'الأسعار توضيحية وتُعرض بعملتك داخل التطبيق. خطتا الأسبوع والسنة اشتراكان يتجدّدان تلقائياً ما لم يتم إيقاف التجديد قبل ٢٤ ساعة من نهاية الفترة، أما «مدى الحياة» فهي عملية شراء واحدة بلا تجديد. يُحصَّل المبلغ من حساب Apple، ويمكن إدارة الاشتراك أو إلغاؤه من إعدادات الـ App Store.',
            'Prices are illustrative and shown in your currency inside the app. The weekly and yearly plans are subscriptions that renew automatically unless auto-renew is turned off at least 24 hours before the period ends; Lifetime is a one-time purchase with no renewal. Payment is charged to your Apple account, and you can manage or cancel from your App Store settings.') }}
          {{ i18n.t(
            'تنطبق تجربة الـ٧ أيام المجانية على الخطة الأسبوعية فقط، وهي متاحة مرة واحدة لكل حساب Apple. تتحوّل تلقائياً إلى اشتراك أسبوعي مدفوع ما لم يتم الإلغاء قبل ٢٤ ساعة على الأقل من انتهائها، ويسقط الجزء غير المستخدم منها عند شراء أي اشتراك.',
            'The 7-day free trial applies to the weekly plan only and is available once per Apple account. It converts to a paid weekly subscription unless you cancel at least 24 hours before it ends, and any unused portion is forfeited when you purchase a subscription.') }}
        </p>
      </div>
    </section>

    <!-- ══ Free vs Pro ══ -->
    <section class="section section--deep cv" id="compare">
      <div class="container container--narrow">
        <div class="head head--center" appReveal>
          <span class="kicker" style="--tone: var(--blue)">{{ i18n.t('المقارنة', 'Compare') }}</span>
          <h2 class="h2">{{ i18n.t('المجاني مقابل Pro', 'Free vs Pro') }}</h2>
          <p class="lede">{{ i18n.t('افحص وحلّل مجاناً. افتح التنظيف بلا حدود مع Pro.', 'Scan and analyze for free. Unlock unlimited cleaning with Pro.') }}</p>
        </div>
        <!-- A real table: the rows are tabular data, and the Pro column's tint lives
             on its cells so the highlight can never drift off the ticks. -->
        <table class="compare" appReveal>
          <thead>
            <tr>
              <th scope="col" class="compare__h">{{ i18n.t('الميزة', 'Feature') }}</th>
              <th scope="col" class="compare__h compare__h--free">{{ i18n.t('مجاني', 'Free') }}</th>
              <th scope="col" class="compare__h compare__h--pro">Pro</th>
            </tr>
          </thead>
          <tbody>
            @for (row of compare; track row.en) {
              <tr>
                <th scope="row" class="compare__label">{{ i18n.t(row.ar, row.en) }}</th>
                <td class="compare__cell">
                  @if (row.freeNoteEn) {
                    <span class="compare__cap">{{ i18n.t(row.freeNoteAr!, row.freeNoteEn) }}</span>
                  } @else if (row.free) {
                    <svg class="compare__tick" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-check"/></svg>
                    <span class="sr-only">{{ i18n.t('نعم', 'Yes') }}</span>
                  } @else {
                    <span class="compare__dash" aria-hidden="true"></span>
                    <span class="sr-only">{{ i18n.t('لا', 'No') }}</span>
                  }
                </td>
                <td class="compare__cell compare__cell--pro">
                  <svg class="compare__tick" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-check"/></svg>
                  <span class="sr-only">{{ i18n.t('نعم', 'Yes') }}</span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>

    <!-- ══ FAQ ══ -->
    <section class="section cv" id="faq">
      <div class="container faq-wrap">
        <div class="head faq-wrap__head" appReveal>
          <span class="kicker" style="--tone: var(--sky)">{{ i18n.t('الأسئلة الشائعة', 'FAQ') }}</span>
          <h2 class="h2">{{ i18n.t('أسئلة يطرحها الجميع', 'Questions people ask') }}</h2>
          <a class="btn btn--ghost btn--sm" routerLink="/support">{{ i18n.t('راسلنا', 'Contact us') }}</a>
        </div>
        <div class="faq">
          @for (item of faq; track item.enQ; let i = $index) {
            <details class="faq__item" [appReveal]="i * 50" [open]="i === 0">
              <summary class="faq__q">
                <span>{{ i18n.t(item.arQ, item.enQ) }}</span>
                <span class="faq__mark" aria-hidden="true"></span>
              </summary>
              <div class="faq__a">{{ i18n.t(item.arA, item.enA) }}</div>
            </details>
          }
        </div>
      </div>
    </section>

    <!-- ══ Closing CTA — the kept library, floating around the ask ══ -->
    <section class="section--tight cta cv">
      <div class="container">
        <div class="cta__panel" appReveal>
          <div class="cta__photos" aria-hidden="true">
            @for (p of ctaPhotos; track p.src; let i = $index) {
              <figure class="cta__photo" [class.cta__photo--side]="p.side"
                      [style.--x]="p.x" [style.--y]="p.y" [style.--r.deg]="p.r" [style.--w.px]="p.w" [style.--k]="i">
                <img [src]="'tiles/' + p.src + '.webp'" alt="" loading="lazy" decoding="async">
              </figure>
            }
          </div>
          <div class="cta__body">
            <img class="cta__icon" src="icon-192.png" width="112" height="112" alt="" aria-hidden="true">
            <h2 class="h2">{{ i18n.t('جاهز تستعيد مساحتك؟', 'Ready to reclaim your space?') }}</h2>
            <p class="lede">{{ i18n.t('نزّل CleanSpace وابدأ التنظيف اليوم.', 'Download CleanSpace and start cleaning today.') }}</p>
            <div class="cta__badges">
              <app-appstore-badge placement="home_cta_band" />
              <app-googleplay-badge />
            </div>
            <span class="cta__note">{{ i18n.t('لـ iPhone • iOS 16 وأحدث', 'For iPhone • iOS 16 and later') }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  i18n = inject(I18n);
  readonly shots = inject(Shots);
  readonly analytics = inject(GoogleAnalyticsService);
  readonly APP_STORE_URL = APP_STORE_URL;

  /** Which tour beat the sticky device is showing. */
  readonly active = signal(0);

  /** The eight categories the app's own home screen lists after a scan. */
  readonly categories: Category[] = [
    { key: 'dup', icon: 'dup', tone: 'var(--blue)', wide: true, ar: 'الصور المكررة', en: 'Duplicate photos', arD: 'نسخ متطابقة تماماً — نجمعها ونختار الأفضل تلقائياً.', enD: 'Byte-for-byte copies, grouped with the best one picked for you.' },
    { key: 'similar', icon: 'review', tone: 'var(--violet)', wide: true, ar: 'الصور المتشابهة', en: 'Similar photos', arD: 'لقطات متقاربة لنفس المشهد، مرتّبة في مجموعات.', enD: 'Near-identical shots of the same moment, sorted into groups.' },
    { key: 'burst', icon: 'burst', tone: 'var(--amber)', ar: 'اللقطات المتتابعة', en: 'Burst photos', arD: 'سلاسل الـ Burst الطويلة — احتفظ بواحدة واحذف الباقي.', enD: 'Long burst sequences — keep one, clear the rest.' },
    { key: 'blur', icon: 'blur', tone: 'var(--sky)', ar: 'الصور غير الواضحة', en: 'Blurry photos', arD: 'الصور المهزوزة أو الخارجة عن التركيز.', enD: 'Shaky or out-of-focus shots you meant to delete.' },
    { key: 'shots', icon: 'screenshot', tone: 'var(--pink)', ar: 'السكرينشوت', en: 'Screenshots', arD: 'لقطات الشاشة القديمة التي تراكمت لسنوات.', enD: 'Old screen grabs that piled up over the years.' },
    { key: 'video', icon: 'video', tone: 'var(--green)', ar: 'الفيديوهات الكبيرة', en: 'Large videos', arD: 'أثقل الفيديوهات في مكتبتك، مرتّبة حسب الحجم.', enD: 'Your heaviest videos, sorted biggest first.' },
    { key: 'simvideo', icon: 'video-dup', tone: 'var(--teal)', wide: true, ar: 'الفيديوهات المتشابهة', en: 'Similar videos', arD: 'مقاطع مكررة أو متقاربة تحتل مساحة مضاعفة.', enD: 'Duplicate or near-identical clips taking up double the space.' },
    { key: 'files', icon: 'file-large', tone: 'var(--orange)', wide: true, ar: 'ملفات كبيرة أخرى', en: 'Other large files', arD: 'كل ما تبقّى من ملفات ثقيلة تستحق المراجعة.', enD: 'Everything else that’s heavy enough to be worth a look.' },
  ];

  /** Rows of the "other large files" miniature — file types, not claims. */
  readonly fileRows = [
    { ext: 'MOV', mb: '1.4 GB', w: 0.92, c: 'var(--green)' },
    { ext: 'ZIP', mb: '640 MB', w: 0.58, c: 'var(--orange)' },
    { ext: 'PDF', mb: '212 MB', w: 0.3, c: 'var(--rose)' },
  ];

  /** Sticky tour. Each `shot` must exist as public/screens/<shot>_{ar,en}_{light,dark}.webp. */
  readonly tour: TourStep[] = [
    {
      shot: 'home', icon: 'scan', tone: 'var(--blue)',
      arT: 'افحص مكتبتك كلها', enT: 'Scan your whole library',
      arD: 'فحص واحد يقيس كل صورة وفيديو على جهازك ويخبرك كم غيغابايت يمكن تحريرها — قبل أن تحذف أي شيء.',
      enD: 'One scan measures every photo and video on your device and tells you how many gigabytes you can reclaim — before you delete anything.',
    },
    {
      shot: 'duplicates', icon: 'dup', tone: 'var(--green)',
      arT: 'المكرر مجمّع ومُختار مسبقاً', enT: 'Duplicates, grouped and pre-picked',
      arD: 'كل مجموعة تعرض عدد النسخ وحجمها، مع شارة «الأفضل» على الصورة التي ننصح بالاحتفاظ بها. حدّد الكل بضغطة.',
      enD: 'Every group shows how many copies it holds and what they weigh, with a “Best” badge on the one worth keeping. Select them all in a tap.',
    },
    {
      shot: 'swipe', icon: 'swipe', tone: 'var(--violet)',
      arT: 'راجع بالسحب', enT: 'Review by swiping',
      arD: 'وضع السحب يعرض صورة واحدة في كل مرة: اسحب يميناً للاحتفاظ، يساراً للحذف. كل ما تحذفه يمرّ بسلة مؤقتة أولاً.',
      enD: 'Swipe mode shows one photo at a time: right to keep, left to delete. Everything you remove lands in a trash bin first.',
    },
    {
      shot: 'video', icon: 'video', tone: 'var(--amber)',
      arT: 'اضغط الفيديو دون أن تفقده', enT: 'Compress video without losing it',
      arD: 'نعرض لك كم ستوفّر من كل مقطع قبل الضغط — غالباً عشرات الميغابايت للفيديو الواحد، بنفس المشهد.',
      enD: 'We show what each clip will save before you compress it — often tens of megabytes per video, same footage.',
    },
    {
      shot: 'vault', icon: 'vault', tone: 'var(--pink)',
      arT: 'اخفِ ما هو خاص', enT: 'Hide what’s private',
      arD: 'الخزنة السرية تنقل الصور خارج تطبيق الصور وتقفلها برمز أو Face ID، مشفّرة على جهازك وحده.',
      enD: 'The Secret Vault moves photos out of the Photos app and locks them behind a passcode or Face ID, encrypted on your device alone.',
    },
    {
      shot: 'memories', icon: 'memory', tone: 'var(--sky)',
      arT: 'نظّف ذكرياتك وأنت تتصفّحها', enT: 'Clean your memories as you browse',
      arD: '«في مثل هذا اليوم» تعيد لك صور السنوات الماضية، وتخبرك كم نسخة متشابهة فيها يمكن حذفها فوراً.',
      enD: '“On This Day” brings back photos from past years — and tells you how many look-alikes in them you can clear on the spot.',
    },
  ];

  readonly features: Feature[] = [
    { icon: 'swipe', tone: 'var(--violet)', arT: 'وضع السحب', enT: 'Swipe mode', arD: 'راجع صورك بسرعة — اسحب للاحتفاظ أو الحذف، مع سلة تراجع.', enD: 'Review fast — swipe to keep or delete, with an undo bin.' },
    { icon: 'vault', tone: 'var(--pink)', art: 'vault', arT: 'الخزنة السرية', enT: 'Secret Vault', arD: 'صور محمية برمز أو Face ID ومشفّرة على جهازك.', enD: 'Photos locked with a passcode or Face ID, encrypted on-device.' },
    { icon: 'contacts', tone: 'var(--green)', arT: 'جهات الاتصال والنسخ الاحتياطي', enT: 'Contacts & backup', arD: 'ادمج المكرر، أكمل الناقص، واحتفظ بنسخة قبل أي تعديل.', enD: 'Merge duplicates, complete partial cards, and back up before any change.' },
    { icon: 'files', tone: 'var(--orange)', arT: 'الملفات والوثائق', enT: 'Files & documents', arD: 'افحص أي مجلد في «الملفات» ورتّب PDF والفيديو والصور حسب الحجم.', enD: 'Scan any folder in Files and rank PDFs, videos and images by size.' },
    { icon: 'album', tone: 'var(--sky)', arT: 'ألبومات ومجموعات ذكية', enT: 'Albums & smart collections', arD: 'يجمع صورك في مجموعات كالأشخاص والطبيعة والسفر — واحفظها كألبوم.', enD: 'Groups your photos into collections like People, Nature and Travel — save any as an album.' },
    { icon: 'video', tone: 'var(--amber)', art: 'compress', arT: 'ضغط وتحويل الوسائط', enT: 'Compress & convert', arD: 'صغّر الفيديو، وحوّل الصور الحية إلى صور ثابتة بضغطة.', enD: 'Shrink videos and convert Live Photos into stills in a tap.' },
    { icon: 'memory', tone: 'var(--teal)', arT: 'في مثل هذا اليوم', enT: 'On This Day', arD: 'ذكريات السنوات الماضية، مع اقتراح ما يمكن تنظيفه منها.', enD: 'Memories from past years, with a suggestion of what to clean in them.' },
    { icon: 'chart', tone: 'var(--blue)', art: 'history', arT: 'سجلّ التنظيف', enT: 'Cleaning history', arD: 'تتبّع كل ميغابايت حرّرته، بمخطط لآخر ١٤ يوماً.', enD: 'Track every megabyte you’ve freed, charted over the last 14 days.' },
    { icon: 'widget', tone: 'var(--violet)', arT: 'ويدجت الشاشة الرئيسية', enT: 'Home Screen widgets', arD: 'المساحة والبطارية بنظرة واحدة، بخمس ثيمات ألوان.', enD: 'Storage and battery at a glance, in five colour themes.' },
    { icon: 'bell', tone: 'var(--rose)', arT: 'تذكير بالتنظيف', enT: 'Cleanup reminders', arD: 'تنبيه أسبوعي أو شهري — أو أوقفه تماماً.', enD: 'A weekly or monthly nudge — or none at all.' },
    { icon: 'globe', tone: 'var(--sky)', art: 'langs', arT: 'بـ 21 لغة', enT: 'In 21 languages', arD: 'واجهة كاملة بلغتك — بما فيها الكردية والعربية والفارسية.', enD: 'A fully localized interface in your language — including Kurdish, Arabic and Persian.' },
    { icon: 'shield', tone: 'var(--green)', arT: 'خصوصية كاملة', enT: 'Full privacy', arD: 'كل المعالجة على جهازك — لا يُرفع أي شيء إلى أي خادم.', enD: 'Everything runs on-device — nothing is uploaded anywhere.' },
  ];

  /** Private family moments — exactly what people move into a vault. */
  /** A handful of flags for the languages card — ckb has no emoji flag, so it is skipped here. */
  readonly flagSample = this.i18n.languages.filter((l) => l.flag).slice(0, 6).map((l) => l.flag);

  readonly vaultTiles = ['baby', 'kids-hug', 'friends', 'woman-smile', 'birthday', 'kid-curls'];
  /** The history miniature's 14 days — a shape, not data. */
  readonly historyBars = [0.22, 0.38, 0.3, 0.55, 0.42, 0.18, 0.64, 0.48, 0.7, 0.36, 0.58, 0.82, 0.44, 0.96];

  /** Endonyms, straight from the language list, split over two marquee rows. */
  private readonly endonyms = this.i18n.languages.map((l) => l.native);
  readonly langLoopA = (() => { const a = this.endonyms.slice(0, 11); return [...a, ...a]; })();
  readonly langLoopB = (() => { const b = this.endonyms.slice(11); return [...b, ...b]; })();

  readonly steps = [
    { icon: 'scan', arT: 'افحص', enT: 'Scan', arD: 'يحلّل CleanSpace مكتبتك بالكامل على جهازك — بدون إنترنت.', enD: 'CleanSpace analyzes your whole library on-device — no internet needed.' },
    { icon: 'review', arT: 'راجع', enT: 'Review', arD: 'شاهد المكرر والمتشابه والفيديوهات الكبيرة، وكم مساحة يمكنك تحريرها.', enD: 'See duplicates, look-alikes and large videos — and how much you can reclaim.' },
    { icon: 'sparkle', arT: 'حرّر المساحة', enT: 'Free up space', arD: 'احذف ما لا تحتاجه بضغطة — احتفظ بالأفضل واحذف الباقي.', enD: 'Delete what you don’t need in a tap — keep the best, remove the rest.' },
  ];

  /**
   * The closing collage: the keepers from the hero, arranged around the ask.
   * x/y are % of the panel; `side` photos are dropped on narrow screens.
   */
  readonly ctaPhotos = [
    { src: 'santorini', x: 9, y: 20, r: -9, w: 156, side: false },
    { src: 'kid-curls', x: 19, y: 64, r: 7, w: 128, side: true },
    { src: 'puppy', x: 6, y: 88, r: -5, w: 118, side: false },
    { src: 'burj', x: 27, y: 12, r: 5, w: 96, side: true },
    { src: 'eiffel', x: 91, y: 17, r: 8, w: 146, side: false },
    { src: 'kids-hug', x: 81, y: 58, r: -6, w: 134, side: true },
    { src: 'pyramids', x: 94, y: 86, r: 6, w: 122, side: false },
    { src: 'baby', x: 73, y: 90, r: -8, w: 100, side: true },
  ];

  /**
   * `freeNote*` renders instead of a ✓/— where the free tier is real but capped —
   * a plain ✗ next to "delete duplicates" would understate what Free actually does
   * (FreeQuotaService grants a lifetime 100 MB allowance and 10 vault items).
   */
  readonly compare: { ar: string; en: string; free: boolean; freeNoteAr?: string; freeNoteEn?: string }[] = [
    { ar: 'فحص التخزين وتحليل المكتبة', en: 'Storage scan & library analysis', free: true },
    { ar: 'اكتشاف المكرر والمتشابه', en: 'Find duplicates & look-alikes', free: true },
    { ar: 'حذف المكرر والمتشابه', en: 'Delete duplicates & look-alikes', free: true, freeNoteAr: 'أول ١٠٠ م.ب', freeNoteEn: 'First 100 MB' },
    { ar: 'الخزنة السرية المشفّرة', en: 'Encrypted Secret Vault', free: true, freeNoteAr: '١٠ عناصر', freeNoteEn: '10 items' },
    { ar: 'ضغط الفيديو وتحويل الصور الحية', en: 'Video compression & Live→Still', free: false },
    { ar: 'دمج جهات الاتصال المكررة', en: 'Merge duplicate contacts', free: false },
    { ar: 'تنظيف بلا حدود', en: 'Unlimited cleaning', free: false },
    { ar: 'بدون إعلانات', en: 'No ads', free: false },
    { ar: 'دعم بأولوية', en: 'Priority support', free: false },
  ];

  /** Shared with StructuredDataService so the FAQPage schema cannot drift. */
  readonly faq = FAQ;

  readonly proFeatures = [
    { ar: 'إزالة غير محدودة للمكرر والمتشابه', en: 'Unlimited duplicate & similar removal' },
    { ar: 'ضغط الفيديو وتحويل الصور الحية', en: 'Video compression & Live→Still' },
    { ar: 'الخزنة الخاصة بلا حدود', en: 'Unlimited private vault' },
    { ar: 'بدون إعلانات', en: 'No ads' },
    { ar: 'دعم بأولوية', en: 'Priority support' },
  ];

  // Matches the app's actual StoreKit products: weekly / yearly / lifetime (NO monthly).
  // Prices are illustrative (shown per-currency in the App Store).
  readonly plans: Plan[] = [
    { arName: 'أسبوعي', enName: 'Weekly', price: '$6.99', arPer: '/ أسبوع', enPer: '/ week', featured: true, trial: true },
    { arName: 'سنوي', enName: 'Yearly', price: '$19.99', wasPrice: '$39.99', arPer: '/ سنة', enPer: '/ year', featured: false, arTag: 'خصم ٥٠٪', enTag: '50% off' },
    { arName: 'مدى الحياة', enName: 'Lifetime', price: '$39.99', arPer: 'دفعة واحدة', enPer: 'one-time', featured: false, arTag: 'أفضل قيمة', enTag: 'Best value' },
  ];
}
