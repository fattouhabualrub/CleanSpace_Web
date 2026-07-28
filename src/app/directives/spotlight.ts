import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Mouse-follow spotlight: tracks the pointer inside the host card and exposes it
 * as --mx/--my CSS vars; `.spot-card::after` paints a soft radial glow there.
 * Listener runs outside Angular (no change detection) and only while hovering.
 */
@Directive({
  selector: '[appSpotlight]',
  host: { class: 'spot-card' },
})
export class SpotlightDirective implements OnInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);
  private onMove = (e: PointerEvent) => {
    const r = this.el.nativeElement.getBoundingClientRect();
    this.el.nativeElement.style.setProperty('--mx', `${e.clientX - r.left}px`);
    this.el.nativeElement.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.el.nativeElement.addEventListener('pointermove', this.onMove, { passive: true });
    });
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('pointermove', this.onMove);
  }
}
