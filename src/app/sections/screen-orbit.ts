import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { I18n } from '../services/i18n';
import { Shots } from '../core/shots';
import { prefersReducedMotion } from '../directives/motion';

/**
 * "Inside the app" — the screenshots on a slowly turning 3D ring.
 *
 * Drag (or swipe) to spin it; it coasts with the throw and settles back to an
 * idle drift. The spin lives in one rAF loop that only runs while the ring is
 * on screen. Decorative: every frame here is also shown, captioned, in the
 * guided tour, so the ring is hidden from assistive tech.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-screen-orbit',
  template: `
    <div class="orbit" #orbit aria-hidden="true">
      <div class="orbit__ring" #ring [style.--n]="frames.length">
        @for (f of frames; track f; let i = $index) {
          <figure class="orbit__item" [style.--i]="i">
            <img [src]="shots.src(f)" [attr.srcset]="shots.srcset(f, 720)" sizes="(max-width: 700px) 150px, 210px"
                 width="1040" height="2203" loading="lazy" decoding="async" alt="" draggable="false">
          </figure>
        }
      </div>
      <span class="orbit__floor"></span>
    </div>
  `,
})
export class ScreenOrbitComponent {
  readonly i18n = inject(I18n);
  readonly shots = inject(Shots);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly orbit = viewChild.required<ElementRef<HTMLElement>>('orbit');
  private readonly ring = viewChild.required<ElementRef<HTMLElement>>('ring');

  /** Order chosen for visual variety around the ring, not meaning. */
  readonly frames = [
    'categories', 'similar', 'contacts', 'albums', 'widgets',
    'history', 'files', 'live', 'settings', 'blurry', 'collections', 'contact-merge',
  ];

  constructor() {
    afterNextRender(() => this.start());
  }

  private start(): void {
    const win = this.doc.defaultView;
    if (!win || prefersReducedMotion(this.doc)) return;
    const host = this.orbit().nativeElement;
    const ring = this.ring().nativeElement;
    const rtl = this.i18n.isRTL();

    // 12°/s — one full turn every 30 s, so each frame lingers ~2.5 s in front.
    const IDLE = rtl ? 0.012 : -0.012;  // deg per ms of drift
    let angle = 0, velocity = IDLE, raf = 0, last = 0, visible = false;
    let dragging = false, lastX = 0, lastMove = 0;

    const frame = (now: number) => {
      const dt = Math.min(now - (last || now), 48);
      last = now;
      if (!dragging) {
        // Ease any throw back toward the idle drift.
        velocity += (IDLE - velocity) * Math.min(1, dt * 0.0025);
        angle += velocity * dt;
      }
      ring.style.setProperty('--rot', `${angle.toFixed(2)}deg`);
      raf = visible ? win.requestAnimationFrame(frame) : 0;
    };
    const play = () => {
      if (raf) return;
      last = 0;
      raf = win.requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible) play();
    });
    io.observe(host);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastMove = performance.now();
      try { host.setPointerCapture(e.pointerId); } catch { /* synthetic or already-released pointer */ }
      host.classList.add('is-grabbing');
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const delta = dx * 0.22;
      angle += delta;
      velocity = delta / Math.max(now - lastMove, 1);
      lastX = e.clientX;
      lastMove = now;
    };
    const up = () => {
      dragging = false;
      host.classList.remove('is-grabbing');
      velocity = Math.max(-0.4, Math.min(0.4, velocity));
    };
    host.addEventListener('pointerdown', down);
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerup', up);
    host.addEventListener('pointercancel', up);

    this.destroyRef.onDestroy(() => {
      io.disconnect();
      if (raf) win.cancelAnimationFrame(raf);
      host.removeEventListener('pointerdown', down);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerup', up);
      host.removeEventListener('pointercancel', up);
    });
  }
}
