import {
  DOCUMENT,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { prefersReducedMotion } from './motion';

/**
 * Pointer-driven 3D tilt for the hero device.
 *
 * Tracks the pointer across the host's *parent* box — a bigger target than the
 * phone itself, so the tilt responds before the cursor is literally on the
 * image — and exposes the rotation as `--rx` / `--ry`. Attaches only for fine
 * pointers: on touch there is no hover state to read, and a tilt that latches
 * on first tap looks broken.
 */
@Directive({ selector: '[appTilt]', host: { class: 'tilt' } })
export class TiltDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);

  /** Maximum rotation in degrees at the far edge of the tracked box. */
  readonly max = input<number | string>(7, { alias: 'appTilt' });

  private area?: HTMLElement;

  private readonly onMove = (e: PointerEvent) => {
    const box = this.area!.getBoundingClientRect();
    const dx = (e.clientX - (box.left + box.width / 2)) / (box.width / 2);
    const dy = (e.clientY - (box.top + box.height / 2)) / (box.height / 2);
    const m = Number(this.max()) || 0;
    const node = this.el.nativeElement;
    node.style.setProperty('--ry', `${(dx * m).toFixed(2)}deg`);
    node.style.setProperty('--rx', `${(-dy * m).toFixed(2)}deg`);
  };

  private readonly onLeave = () => {
    const node = this.el.nativeElement;
    node.style.setProperty('--ry', '0deg');
    node.style.setProperty('--rx', '0deg');
  };

  ngOnInit(): void {
    // During prerendering `defaultView` exists but carries no matchMedia, so the
    // capability is tested rather than the environment.
    const win = this.doc.defaultView;
    if (typeof win?.matchMedia !== 'function') return;
    if (!win.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (prefersReducedMotion(this.doc)) return;

    this.area = this.el.nativeElement.parentElement ?? this.el.nativeElement;
    this.zone.runOutsideAngular(() => {
      this.area!.addEventListener('pointermove', this.onMove, { passive: true });
      this.area!.addEventListener('pointerleave', this.onLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    this.area?.removeEventListener('pointermove', this.onMove);
    this.area?.removeEventListener('pointerleave', this.onLeave);
  }
}
