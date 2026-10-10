import { DOCUMENT, Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';
import { prefersReducedMotion } from './motion';

/**
 * Counts a figure up from zero the first time it scrolls into view.
 *
 * The host renders the final value (so the prerendered page, and anyone
 * without JS or with reduced motion, simply reads the number); the count is a
 * browser-only flourish written straight to textContent.
 */
@Directive({
  selector: '[appCountUp]',
  host: { '[textContent]': 'format(to())' },
})
export class CountUpDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);

  readonly to = input.required<number>({ alias: 'appCountUp' });
  readonly decimals = input(0);
  readonly duration = input(1600);

  private obs?: IntersectionObserver;
  private raf = 0;

  constructor() {
    afterNextRender(() => {
      const win = this.doc.defaultView;
      if (!win || typeof IntersectionObserver === 'undefined' || prefersReducedMotion(this.doc)) return;
      const node = this.el.nativeElement;
      const end = this.to();
      if (!end) return;
      node.textContent = this.format(0);
      this.obs = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          this.obs?.disconnect();
          const t0 = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - t0) / this.duration());
            const eased = 1 - Math.pow(2, -10 * t);
            node.textContent = this.format(end * (t === 1 ? 1 : eased));
            if (t < 1) this.raf = win.requestAnimationFrame(tick);
          };
          this.raf = win.requestAnimationFrame(tick);
        },
        { threshold: 0.6 },
      );
      this.obs.observe(node);
    });
  }

  format(v: number): string {
    return v.toFixed(this.decimals());
  }

  ngOnDestroy(): void {
    this.obs?.disconnect();
    if (this.raf) this.doc.defaultView?.cancelAnimationFrame(this.raf);
  }
}
