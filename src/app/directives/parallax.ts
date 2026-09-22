import {
  AfterViewInit,
  DOCUMENT,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  input,
} from '@angular/core';
import { onScrollFrame, prefersReducedMotion } from './motion';

/**
 * Scroll-linked vertical drift.
 *
 * `[appParallax]` is the strength in pixels: the element travels that far over
 * a full viewport of scrolling, positive meaning it lags behind the page.
 * Writes a `--par` custom property rather than `transform` directly, so the
 * stylesheet stays in charge of how the offset is composed with any other
 * transform the element already carries.
 */
@Directive({ selector: '[appParallax]' })
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);

  /** Travel in px across one viewport of scroll. Negative drifts the other way. */
  readonly strength = input<number | string>(40, { alias: 'appParallax' });

  private stop?: () => void;

  ngAfterViewInit(): void {
    const win = this.doc.defaultView;
    if (!win || prefersReducedMotion(this.doc)) return;

    const node = this.el.nativeElement;
    const amount = Number(this.strength()) || 0;

    this.zone.runOutsideAngular(() => {
      this.stop = onScrollFrame(win, (scrollY, viewportH) => {
        const box = node.getBoundingClientRect();
        // Progress is -1 when the element sits a full viewport below the fold
        // and +1 once it has travelled a full viewport above it; 0 is centred.
        const centre = box.top + box.height / 2;
        const progress = (centre - viewportH / 2) / viewportH;
        node.style.setProperty('--par', `${(progress * amount).toFixed(2)}px`);
      });
    });
  }

  ngOnDestroy(): void {
    this.stop?.();
  }
}
