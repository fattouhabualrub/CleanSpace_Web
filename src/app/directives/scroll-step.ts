import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
  output,
} from '@angular/core';

/**
 * One step of a scrollytelling sequence.
 *
 * Emits `stepEnter` with its index whenever the step becomes the one closest to
 * the middle of the viewport. The root margin collapses the observation area to
 * a thin band across the screen's centre, which is what makes "the active step
 * is the one you're reading" true in both scroll directions — a plain threshold
 * would hand over on the way in but never hand back on the way out.
 */
@Directive({ selector: '[appScrollStep]' })
export class ScrollStepDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly index = input.required<number>({ alias: 'appScrollStep' });
  readonly stepEnter = output<number>();

  private obs?: IntersectionObserver;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    if (typeof IntersectionObserver === 'undefined') return;

    this.obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) this.stepEnter.emit(this.index());
        }
      },
      // A 1px-tall band at 45% of the viewport height.
      { root: null, rootMargin: '-45% 0px -55% 0px', threshold: 0 },
    );
    this.obs.observe(node);
  }

  ngOnDestroy(): void {
    this.obs?.disconnect();
  }
}
