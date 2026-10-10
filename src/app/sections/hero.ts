import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { Shots } from '../core/shots';
import { AppStoreBadgeComponent } from '../components/appstore-badge';
import { prefersReducedMotion } from '../directives/motion';

/** What the scan decides about a photo — the same three outcomes the app shows. */
type Verdict = 'best' | 'del' | 'blur';

interface Tile {
  src: string;
  kind: Verdict;
  /** Desktop position, % of the scene, measured from the inline-start edge. */
  x: number; y: number;
  /** Phone position, or null to leave the tile out on small screens. */
  m: [number, number] | null;
  /** Width in px at desktop size. */
  w: number;
  /** Resting rotation, degrees. */
  r: number;
  /** Parallax depth — how far the tile drifts with the pointer. */
  d: number;
  /** Size pill, as the app prints it on a thumbnail. */
  size: string;
}

/**
 * The hero: a camera roll spilling over the page, cleaned in front of you.
 *
 * Three beats, mirroring what the app does:
 *  1. On load a scan beam sweeps the clutter and every photo gets the verdict
 *     the app would give it — a blue "Best" badge for the keeper, a rose check
 *     for the copy, a blurred frame for the miss. Pure CSS, keyed off each
 *     tile's horizontal position so the marks land as the beam passes.
 *  2. Scrolling (the hero is pinned) pulls everything marked for deletion into
 *     the "space freed" gauge; the counter climbs to the figure printed on the
 *     phone screen behind it, so the number is the app's own, not invented.
 *  3. What's left is the keepers, straightened — a clean library.
 *
 * The scroll work happens in one rAF-throttled handler that writes transforms
 * straight to the tiles; nothing here touches signals per frame. Under reduced
 * motion the pin is dropped and the scene stays at its scanned still.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-hero',
  imports: [RouterLink, AppStoreBadgeComponent],
  host: { class: 'hx-host' },
  template: `
    <section class="hx" #track>
      <div class="hx__pin" #pin>
        <div class="hx__bg" aria-hidden="true">
          <span class="hx__orb hx__orb--a"></span>
          <span class="hx__orb hx__orb--b"></span>
          <span class="hx__mesh"></span>
        </div>

        <div class="container hx__copy-wrap">
          <div class="hx__copy">
            <span class="kicker hx__in" style="--i:0">{{ i18n.t('منظّف صور يعمل على جهازك', 'On-device photo cleaner') }}</span>
            <h1 class="display hx__title hx__in" style="--i:1">{{ i18n.t('نظّف مساحة آيفونك بضغطة واحدة', 'Clean up your iPhone storage in one tap') }}</h1>
            <p class="lede hx__in" style="--i:2">
              {{ i18n.t(
                'يفحص CleanSpace مكتبتك ويجمع المكرر والمتشابه واللقطات المتتابعة والصور غير الواضحة والسكرينشوت والفيديوهات الكبيرة في مكان واحد — ثم يحذف ما لا تحتاجه بضغطة. كل ذلك على جهازك، بلا رفع ولا حساب.',
                'CleanSpace scans your library and gathers duplicates, look-alikes, bursts, blurry shots, screenshots and oversized videos in one place — then clears what you don’t need in a tap. All on your device. No uploads, no account.') }}
            </p>
            <div class="hx__cta hx__in" style="--i:3">
              <app-appstore-badge placement="hero" />
              <a class="btn btn--ghost btn--lg" routerLink="/" fragment="try">
                {{ i18n.t('شاهده وهو يعمل', 'See it in action') }}
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M12 19l-6-6M12 19l6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
            </div>
            <ul class="hx__trust hx__in" style="--i:4" [attr.aria-label]="i18n.t('لماذا تثق بنا', 'Why trust us')">
              @for (t of trust; track t.en) {
                <li>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6.5 9.4 17 4 11.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ i18n.t(t.ar, t.en) }}
                </li>
              }
            </ul>
          </div>
        </div>

        <div class="hx__scene-wrap" #sceneWrap>
          <div class="hx__scene" #scene [attr.data-run]="run() % 2 ? 'b' : 'a'">
            <!-- The clutter. Decorative: the copy and the phone carry the meaning. -->
            <div class="hx__tiles" aria-hidden="true">
              @for (tile of tiles; track tile.src) {
                <figure class="hx-tile" [attr.data-kind]="tile.kind"
                        [class.hx-tile--desk]="!tile.m"
                        [style.--x]="vx(tile.x)" [style.--y]="tile.y"
                        [style.--mx]="tile.m ? vx(tile.m[0]) : 0" [style.--my]="tile.m ? tile.m[1] : 0"
                        [style.--w.px]="tile.w" [style.--r.deg]="tile.r" [style.--d]="tile.d"
                        [style.--scan-at.ms]="scanAt(tile)">
                  <div class="hx-tile__in">
                    <img [src]="'tiles/' + tile.src + '.webp'" alt="" decoding="async">
                    <span class="hx-tile__size">{{ tile.size }}</span>
                    @if (tile.kind === 'best') {
                      <span class="hx-tile__best">
                        <svg viewBox="0 0 24 24"><path d="M12 2.5l2.4 1.7 2.9-.1.9 2.8 2.3 1.8-.9 2.8.9 2.8-2.3 1.8-.9 2.8-2.9-.1L12 21.5l-2.4-1.7-2.9.1-.9-2.8-2.3-1.8.9-2.8-.9-2.8 2.3-1.8.9-2.8 2.9.1Z" fill="currentColor"/><path d="M8.4 12.2l2.4 2.4 4.8-4.9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        {{ i18n.t('الأفضل', 'Best') }}
                      </span>
                    } @else {
                      <span class="hx-tile__check">
                        <svg viewBox="0 0 24 24"><path d="M19.5 6.8 9.6 16.6 4.8 11.8" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </span>
                    }
                  </div>
                </figure>
              }
            </div>

            <span class="hx__beam" aria-hidden="true"></span>

            <div class="hx__device">
              <span class="hx__halo" aria-hidden="true"></span>
              <img class="hx__phone" [src]="shots.src('home')" width="1040" height="2203" fetchpriority="high" decoding="async"
                   [alt]="i18n.t('شاشة CleanSpace الرئيسية تعرض نتائج الفحص', 'The CleanSpace home screen showing scan results')">
            </div>

            <div class="hx__status" aria-hidden="true">
              <span class="hx__pulse"></span>
              <span class="hx__status-txt">
                <span class="hx__status-a">{{ i18n.t('جارٍ الفحص…', 'Scanning…') }}</span>
                <span class="hx__status-b"><b>{{ shots.homeFigures().duplicates }}</b> {{ i18n.t('صورة مكررة', 'Duplicate photos') }}</span>
              </span>
            </div>

            <div class="hx__gauge" #gauge>
              <svg class="hx__ring" viewBox="0 0 64 64" aria-hidden="true">
                <defs>
                  <linearGradient id="hx-ring-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#6C5CFF"/><stop offset=".6" stop-color="#9B7BFF"/><stop offset="1" stop-color="#38B6FF"/>
                  </linearGradient>
                </defs>
                <circle class="hx__ring-track" cx="32" cy="32" r="26"/>
                <circle class="hx__ring-arc" #arc cx="32" cy="32" r="26" transform="rotate(-90 32 32)"/>
              </svg>
              <span class="hx__gauge-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 4l1.7 4.6L18.3 10l-4.6 1.7L12 16l-1.7-4.3L5.7 10l4.6-1.4Z" fill="currentColor"/></svg>
              </span>
              <span class="hx__gauge-txt">
                <b #freed>0.00 GB</b>
                <span>{{ i18n.t('مساحة تم تحريرها', 'Space freed') }}</span>
              </span>
              <button type="button" class="hx__rescan" (click)="rescan()"
                      [attr.aria-label]="i18n.t('أعد الفحص', 'Scan again')" [attr.title]="i18n.t('أعد الفحص', 'Scan again')">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M20 4v4.6h-4.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>

            <p class="hx__caption" #caption aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M20 6.5 9.4 17 4 11.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ i18n.t('هكذا تبدو مكتبة نظيفة', 'This is what a cleaned-up library looks like') }}
            </p>
          </div>
        </div>

        <div class="hx__cue" #cue aria-hidden="true">
          <span class="hx__mouse"><i></i></span>
          {{ i18n.t('مرّر لتنظّف', 'Scroll to clean up') }}
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  readonly i18n = inject(I18n);
  readonly shots = inject(Shots);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly pin = viewChild.required<ElementRef<HTMLElement>>('pin');
  private readonly sceneWrap = viewChild.required<ElementRef<HTMLElement>>('sceneWrap');
  private readonly scene = viewChild.required<ElementRef<HTMLElement>>('scene');
  private readonly gauge = viewChild.required<ElementRef<HTMLElement>>('gauge');
  private readonly arc = viewChild.required<ElementRef<SVGCircleElement>>('arc');
  private readonly freed = viewChild.required<ElementRef<HTMLElement>>('freed');
  private readonly caption = viewChild.required<ElementRef<HTMLElement>>('caption');
  private readonly cue = viewChild.required<ElementRef<HTMLElement>>('cue');

  /** Bumped by the rescan button; alternates the mark animation's name so it replays. */
  readonly run = signal(0);
  rescan(): void {
    this.run.update((v) => v + 1);
  }

  // Honest trust signals — no invented ratings or download counts.
  readonly trust = [
    { ar: 'خصوصية كاملة', en: 'Full privacy' },
    { ar: 'بدون إنترنت', en: 'Works offline' },
    { ar: 'بلا حساب', en: 'No account' },
    { ar: 'بـ 21 لغة', en: 'In 21 languages' },
  ];

  /**
   * The clutter. Placed so the copy column (inline-start, ~0–46%) stays clear
   * on desktop; pairs mirror the app's own groups — the two whale tails are a
   * duplicate pair, the forest and the lake a look-alike pair.
   */
  readonly tiles: Tile[] = [
    { src: 'whale', kind: 'best', x: 50, y: 19, m: [10, 10], w: 138, r: -8, d: 0.6, size: '233 KB' },
    { src: 'whale2', kind: 'del', x: 58, y: 27, m: [90, 9], w: 120, r: 7, d: 0.95, size: '233 KB' },
    { src: 'forest', kind: 'best', x: 91, y: 19, m: [12, 33], w: 146, r: 6, d: 0.5, size: '2.1 MB' },
    { src: 'lake', kind: 'del', x: 97, y: 36, m: [89, 31], w: 120, r: -5, d: 1, size: '1.9 MB' },
    { src: 'blurhill', kind: 'blur', x: 93, y: 60, m: [7, 55], w: 124, r: 9, d: 0.75, size: '65 KB' },
    { src: 'wave', kind: 'best', x: 92, y: 79, m: [92, 54], w: 150, r: -7, d: 0.6, size: '3.4 MB' },
    { src: 'blursea', kind: 'blur', x: 98, y: 98, m: null, w: 112, r: 5, d: 1.1, size: '59 KB' },
    { src: 'park', kind: 'del', x: 53, y: 90, m: [11, 77], w: 130, r: 6, d: 0.8, size: '13.6 MB' },
    { src: 'beach', kind: 'del', x: 64, y: 99, m: [90, 76], w: 110, r: -9, d: 1, size: '1.8 MB' },
    { src: 'autumn', kind: 'del', x: 5, y: 101, m: [30, 3], w: 120, r: -6, d: 0.7, size: '6.4 MB' },
    { src: 'cascade', kind: 'del', x: 27, y: 104, m: null, w: 114, r: 8, d: 1.1, size: '2.5 MB' },
    { src: 'falls', kind: 'del', x: 41, y: 9, m: [70, 3], w: 104, r: 10, d: 1, size: '2.0 MB' },
    { src: 'blurfield', kind: 'blur', x: 4, y: 11, m: null, w: 114, r: -10, d: 0.9, size: '63 KB' },
    { src: 'amber', kind: 'blur', x: 23, y: 7, m: null, w: 96, r: 6, d: 1.2, size: '23 KB' },
    { src: 'vinyl', kind: 'del', x: 73, y: 8, m: null, w: 106, r: -4, d: 0.85, size: '466 KB' },
    { src: 'blurcloud', kind: 'blur', x: 79, y: 69, m: null, w: 98, r: 12, d: 1.25, size: '73 KB' },
  ];

  private readonly rtl = computed(() => this.i18n.isRTL());

  /** Positions are authored for left-to-right; RTL mirrors them so the copy keeps its clear lane. */
  vx(x: number): number {
    return this.rtl() ? 100 - x : x;
  }

  /** When the beam reaches this tile, in ms after load — the beam travels in reading order. */
  scanAt(tile: Tile): number {
    return Math.round(1150 + tile.x * 16.7);
  }

  constructor() {
    afterNextRender(() => this.start());
  }

  private start(): void {
    const win = this.doc.defaultView;
    if (!win) return;
    if (prefersReducedMotion(this.doc)) {
      // The still shows the finished clean, so the gauge reads full.
      this.freed().nativeElement.textContent = `${this.shots.homeFigures().freed.toFixed(2)} GB`;
      return;
    }

    const desktop = win.matchMedia('(min-width: 960px)');
    const finePointer = win.matchMedia('(hover: hover) and (pointer: fine)');
    const sceneEl = this.scene().nativeElement;
    const tileEls = Array.from(sceneEl.querySelectorAll<HTMLElement>('.hx-tile'));
    const arcEl = this.arc().nativeElement;
    const ringEl = this.gauge().nativeElement.querySelector('.hx__ring') as SVGElement;
    const freedEl = this.freed().nativeElement;
    const captionEl = this.caption().nativeElement;
    const cueEl = this.cue().nativeElement;
    const ARC = 2 * Math.PI * 26;

    interface Body { el: HTMLElement; tile: Tile; cx: number; cy: number; start: number; dist: number }
    let bodies: Body[] = [];
    let keepers: Body[] = [];
    let gx = 0, gy = 0;
    let lastText = '';

    const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    /** Rest positions come from offsetLeft/Top, which ignore transforms — so
     *  measuring mid-flight still yields where a tile started. */
    const measure = () => {
      const s = sceneEl.getBoundingClientRect();
      const g = ringEl.getBoundingClientRect();
      gx = g.left - s.left + g.width / 2;
      gy = g.top - s.top + g.height / 2;

      const visible = tileEls
        .map((el, i) => ({ el, tile: this.tiles[i] }))
        .filter(({ el }) => el.offsetParent !== null && getComputedStyle(el).display !== 'none');

      const all = visible.map(({ el, tile }) => {
        const cx = el.offsetLeft, cy = el.offsetTop;
        return { el, tile, cx, cy, start: 0, dist: Math.hypot(gx - cx, gy - cy) };
      });
      keepers = all.filter((b) => b.tile.kind === 'best');
      bodies = all.filter((b) => b.tile.kind !== 'best').sort((a, b) => a.dist - b.dist);
      const n = bodies.length;
      bodies.forEach((b, i) => (b.start = 0.04 + (i / Math.max(n - 1, 1)) * 0.5));
    };

    const progress = (): number => {
      const isDesk = desktop.matches;
      const trackEl = isDesk ? this.track().nativeElement : this.sceneWrap().nativeElement;
      const pinnedEl = isDesk ? this.pin().nativeElement : sceneEl;
      const r = trackEl.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(pinnedEl).top) || 0;
      const span = r.height - pinnedEl.offsetHeight;
      return span > 0 ? clamp((top - r.top) / span) : 0;
    };

    const render = () => {
      ticking = false;
      const p = progress();
      let sum = 0;

      for (const b of bodies) {
        const q = easeInOut(clamp((p - b.start) / 0.34));
        sum += q;
        if (q === 0) {
          b.el.style.transform = '';
          b.el.style.opacity = '';
          continue;
        }
        // Quadratic curve whose control point sits level with the tile, above the
        // gauge: tiles run along their own edge of the page first, then drop in —
        // which keeps the ones from the copy side out of the headline.
        const u = 1 - q;
        const dx = u * u * b.cx + 2 * u * q * gx + q * q * gx - b.cx;
        const dy = u * u * b.cy + 2 * u * q * b.cy + q * q * gy - b.cy;
        const rot = b.tile.r * (1 - q) + q * 140;
        const sc = 1 - 0.88 * q;
        b.el.style.transform = `translate(-50%, -50%) translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
        b.el.style.opacity = q > 0.82 ? ((1 - q) / 0.18).toFixed(3) : '1';
      }

      // Keepers straighten up once the clutter around them has gone.
      const k = easeInOut(clamp((p - 0.5) / 0.34));
      for (const b of keepers) {
        b.el.style.transform = k
          ? `translate(-50%, -50%) rotate(${(b.tile.r * (1 - k)).toFixed(2)}deg) scale(${(1 + 0.06 * k).toFixed(3)})`
          : '';
        b.el.classList.toggle('is-kept', k > 0.6);
      }

      const f = bodies.length ? sum / bodies.length : 0;
      arcEl.style.strokeDashoffset = (ARC * (1 - f)).toFixed(2);
      const text = `${(this.shots.homeFigures().freed * f).toFixed(2)} GB`;
      if (text !== lastText) {
        freedEl.textContent = text;
        lastText = text;
      }
      sceneEl.classList.toggle('is-clean', f > 0.995);
      captionEl.style.opacity = clamp((p - 0.8) / 0.12).toFixed(3);
      cueEl.style.opacity = (1 - clamp(p / 0.06)).toFixed(3);
      sceneEl.style.setProperty('--hp', p.toFixed(4));
    };

    let ticking = false;
    const request = () => {
      if (ticking) return;
      ticking = true;
      win.requestAnimationFrame(render);
    };
    const remeasure = () => {
      measure();
      request();
    };

    const onPointer = (e: PointerEvent) => {
      const px = (e.clientX / win.innerWidth) * 2 - 1;
      const py = (e.clientY / win.innerHeight) * 2 - 1;
      sceneEl.style.setProperty('--px', px.toFixed(3));
      sceneEl.style.setProperty('--py', py.toFixed(3));
    };

    sceneEl.classList.add('is-live');
    measure();
    render();

    win.addEventListener('scroll', request, { passive: true });
    win.addEventListener('resize', remeasure, { passive: true });
    desktop.addEventListener('change', remeasure);
    const pinEl = this.pin().nativeElement;
    if (finePointer.matches) pinEl.addEventListener('pointermove', onPointer, { passive: true });
    // Images settle the layout late (fonts, the phone frame); measure again once they have.
    win.addEventListener('load', remeasure, { once: true });
    const late = win.setTimeout(remeasure, 1200);

    this.destroyRef.onDestroy(() => {
      win.removeEventListener('scroll', request);
      win.removeEventListener('resize', remeasure);
      desktop.removeEventListener('change', remeasure);
      pinEl.removeEventListener('pointermove', onPointer);
      win.clearTimeout(late);
    });
  }
}
