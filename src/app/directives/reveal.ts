import { Directive, ElementRef, inject, input, AfterViewInit, OnDestroy } from '@angular/core';

/**
 * Scroll-reveal: fades + slides an element up the first time it enters the viewport.
 * Usage: `appReveal` (no delay) or `[appReveal]="120"` (ms stagger delay).
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective implements AfterViewInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly delay = input<number | string>(0, { alias: 'appReveal' });
  private obs?: IntersectionObserver;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    node.classList.add('reveal');
    const d = Number(this.delay()) || 0;
    if (d) node.style.transitionDelay = `${d}ms`;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('in');
      return;
    }
    this.obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            node.classList.add('in');
            this.obs?.unobserve(node);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    this.obs.observe(node);
  }

  ngOnDestroy(): void {
    this.obs?.disconnect();
  }
}
