import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { I18n } from '../services/i18n';
import { RevealDirective } from '../directives/reveal';
import { prefersReducedMotion } from '../directives/motion';

interface Photo { id: string; mb: number; date: string }
type Verdict = 'keep' | 'delete';
interface Decision { photo: Photo; verdict: Verdict; emptied: boolean }

/**
 * A working copy of the app's Swipe Mode.
 *
 * Same rules as the real screen: right keeps, left deletes, and nothing is
 * gone until the trash is emptied — so Undo can always bring the last card
 * back until then. Drag, the two round buttons, and the arrow keys all reach
 * the same `decide()`; the drag is tracked with pointer events written straight
 * to the card's style, and only the outcome goes through signals.
 *
 * The photos are free Unsplash frames (public/tiles/lg); the sizes are
 * illustrative, in the range a modern iPhone camera produces.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-swipe-demo',
  imports: [RevealDirective],
  template: `
    <section class="section sw" id="try">
      <div class="container sw__grid">
        <div class="sw__copy" appReveal>
          <span class="kicker" style="--tone: var(--violet)">{{ i18n.t('وضع السحب', 'Swipe mode') }}</span>
          <h2 class="h2">{{ i18n.t('جرّبه هنا مباشرة', 'Try it right here') }}</h2>
          <p class="lede">{{ i18n.t('راجع صورك بسرعة — اسحب للاحتفاظ أو الحذف، مع سلة تراجع.', 'Review fast — swipe to keep or delete, with an undo bin.') }}</p>

          <dl class="sw__stats" aria-live="polite">
            <div class="sw__stat">
              <dt>{{ i18n.t('في سلة المحذوفات', 'in the trash') }}</dt>
              <dd><b>{{ trash().length }}</b><small>{{ trashMb() }} MB</small></dd>
            </div>
            <div class="sw__stat sw__stat--freed">
              <dt>{{ i18n.t('مساحة تم تحريرها', 'Space freed') }}</dt>
              <dd><b>{{ freedMb() }}</b><small>MB</small></dd>
            </div>
          </dl>

          <p class="sw__keys" aria-hidden="true">
            <kbd>←</kbd> {{ i18n.t('حذف', 'Delete') }}
            <span class="sw__keys-sep"></span>
            <kbd>→</kbd> {{ i18n.t('احتفاظ', 'Keep') }}
          </p>
        </div>

        <div class="sw__stage" appReveal>
          <span class="sw__glow" aria-hidden="true"></span>
          <div class="sw__phone">
            <span class="sw__island" aria-hidden="true"></span>
            <div class="sw__screen">
              <header class="sw__bar">
                <svg class="sw__back" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <b>{{ i18n.t('وضع السحب', 'Swipe mode') }}</b>
                <button type="button" class="sw__undo-ic" (click)="undo()" [disabled]="!canUndo()"
                        [attr.aria-label]="i18n.t('تراجع', 'Undo')">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
                </button>
              </header>

              <div class="sw__deck" #deck tabindex="0" role="group"
                   [attr.aria-label]="i18n.t('اسحب يميناً للاحتفاظ، يساراً للحذف', 'Swipe right to keep · left to delete')"
                   (keydown)="onKey($event)">
                @if (done()) {
                  <div class="sw__done">
                    <span class="sw__done-ic" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M20 6.5 9.4 17 4 11.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <b>{{ i18n.t('كل شيء نظيف!', 'All clean!') }}</b>
                    <span>{{ freedMb() + trashMb() }} MB</span>
                    <button type="button" class="btn btn--primary btn--sm" (click)="reset()">{{ i18n.t('ابدأ من جديد', 'Start over') }}</button>
                  </div>
                }
                @for (p of visible(); track p.id; let i = $index) {
                  <figure class="sw__card" [style.--depth]="i" [style.z-index]="10 - i"
                          [class.is-top]="i === 0" [class.from-left]="i === 0 && returning() === 'delete'"
                          [class.from-right]="i === 0 && returning() === 'keep'"
                          (pointerdown)="i === 0 && grab($event)">
                    <img [src]="'tiles/lg/' + p.id + '.webp'" alt="" draggable="false" decoding="async">
                    <span class="sw__size">{{ p.mb }} MB</span>
                    <figcaption>{{ formatDate(p.date) }}</figcaption>
                    @if (i === 0) {
                      <span class="sw__stamp sw__stamp--keep" aria-hidden="true">{{ i18n.t('احتفاظ', 'Keep') }}</span>
                      <span class="sw__stamp sw__stamp--del" aria-hidden="true">{{ i18n.t('حذف', 'Delete') }}</span>
                    }
                  </figure>
                }
              </div>

              <p class="sw__hint">{{ i18n.t('اسحب يميناً للاحتفاظ، يساراً للحذف', 'Swipe right to keep · left to delete') }}</p>

              <div class="sw__trash">
                <span class="sw__trash-n"><b>{{ trash().length }}</b> {{ i18n.t('في سلة المحذوفات', 'in the trash') }}</span>
                <button type="button" class="sw__empty" (click)="emptyTrash()" [disabled]="!trash().length">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ i18n.t('إفراغ السلة', 'Empty Trash') }}
                </button>
              </div>
            </div>
          </div>

          <div class="sw__controls">
            <button type="button" class="sw__btn sw__btn--del" (click)="decide('delete')" [disabled]="done()"
                    [attr.aria-label]="i18n.t('حذف', 'Delete')">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>
            </button>
            <button type="button" class="sw__btn sw__btn--undo" (click)="undo()" [disabled]="!canUndo()"
                    [attr.aria-label]="i18n.t('تراجع', 'Undo')">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
            </button>
            <button type="button" class="sw__btn sw__btn--keep" (click)="decide('keep')" [disabled]="done()"
                    [attr.aria-label]="i18n.t('احتفاظ', 'Keep')">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6.5 9.4 17 4 11.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class SwipeDemoComponent {
  readonly i18n = inject(I18n);
  private readonly doc = inject(DOCUMENT);
  private readonly deckEl = viewChild.required<ElementRef<HTMLElement>>('deck');

  private static readonly PHOTOS: Photo[] = [
    { id: 'kids-hug', mb: 3.8, date: '2026-09-17' },
    { id: 'burj', mb: 2.4, date: '2026-08-02' },
    { id: 'aurora', mb: 4.6, date: '2026-02-11' },
    { id: 'baby', mb: 1.9, date: '2025-11-23' },
    { id: 'colosseum', mb: 2.7, date: '2025-07-04' },
    { id: 'friends', mb: 3.2, date: '2025-06-14' },
    { id: 'wadirum', mb: 2.2, date: '2025-03-28' },
    { id: 'taj', mb: 5.1, date: '2024-12-28' },
  ];

  private readonly index = signal(0);
  private readonly history = signal<Decision[]>([]);
  /** The verdict a card is coming back from after Undo — picks its entrance side. */
  readonly returning = signal<Verdict | null>(null);
  private busy = false;

  readonly visible = computed(() => SwipeDemoComponent.PHOTOS.slice(this.index(), this.index() + 3));
  readonly done = computed(() => this.index() >= SwipeDemoComponent.PHOTOS.length);
  readonly trash = computed(() => this.history().filter((d) => d.verdict === 'delete' && !d.emptied));
  readonly trashMb = computed(() => round1(this.trash().reduce((s, d) => s + d.photo.mb, 0)));
  readonly freedMb = computed(() =>
    round1(this.history().filter((d) => d.emptied).reduce((s, d) => s + d.photo.mb, 0)),
  );
  readonly canUndo = computed(() => {
    const last = this.history().at(-1);
    return !!last && !last.emptied;
  });

  private readonly dateFmt = computed(() => {
    try {
      return new Intl.DateTimeFormat(this.i18n.lang(), { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  });
  formatDate(iso: string): string {
    return this.dateFmt().format(new Date(`${iso}T12:00:00`));
  }

  // ---- Decisions ---------------------------------------------------------------

  decide(verdict: Verdict, card?: HTMLElement): void {
    if (this.busy || this.done()) return;
    const el = card ?? this.topCard();
    const photo = SwipeDemoComponent.PHOTOS[this.index()];
    const commit = () => {
      this.returning.set(null);
      this.history.update((h) => [...h, { photo, verdict, emptied: false }]);
      this.index.update((i) => i + 1);
      this.busy = false;
    };
    if (!el || prefersReducedMotion(this.doc)) {
      commit();
      return;
    }
    this.busy = true;
    const dir = verdict === 'keep' ? 1 : -1;
    const w = el.offsetWidth;
    const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(el.style.transform);
    const y = m ? parseFloat(m[2]) : 0;
    el.classList.remove('is-dragging');
    el.classList.add('is-flying');
    el.style.setProperty('--keep', verdict === 'keep' ? '1' : '0');
    el.style.setProperty('--del', verdict === 'delete' ? '1' : '0');
    el.style.transform = `translate(${dir * w * 1.6}px, ${y + 40}px) rotate(${dir * 28}deg)`;
    el.style.opacity = '0';
    this.deckEl().nativeElement.style.setProperty('--drag', '1');
    setTimeout(() => {
      this.deckEl().nativeElement.style.setProperty('--drag', '0');
      commit();
    }, 360);
  }

  undo(): void {
    if (this.busy || !this.canUndo()) return;
    const last = this.history().at(-1)!;
    this.returning.set(last.verdict);
    this.history.update((h) => h.slice(0, -1));
    this.index.update((i) => i - 1);
  }

  emptyTrash(): void {
    this.history.update((h) => h.map((d) => (d.verdict === 'delete' ? { ...d, emptied: true } : d)));
  }

  reset(): void {
    this.returning.set(null);
    this.history.set([]);
    this.index.set(0);
  }

  onKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') { e.preventDefault(); this.decide('keep'); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); this.decide('delete'); }
    else if ((e.key === 'z' || e.key === 'Z') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); this.undo(); }
  }

  // ---- Drag ------------------------------------------------------------------------

  private topCard(): HTMLElement | null {
    return this.deckEl().nativeElement.querySelector<HTMLElement>('.sw__card.is-top');
  }

  grab(e: PointerEvent): void {
    if (this.busy || e.button > 0) return;
    const card = e.currentTarget as HTMLElement;
    const deck = this.deckEl().nativeElement;
    const x0 = e.clientX, y0 = e.clientY, t0 = performance.now();
    let dx = 0, dy = 0, lastX = x0, lastT = t0, vx = 0;

    try { card.setPointerCapture(e.pointerId); } catch { /* synthetic or already-released pointer */ }
    card.classList.add('is-dragging');
    card.classList.remove('from-left', 'from-right');

    const move = (ev: PointerEvent) => {
      dx = ev.clientX - x0;
      dy = ev.clientY - y0;
      const now = performance.now();
      vx = (ev.clientX - lastX) / Math.max(now - lastT, 1);
      lastX = ev.clientX; lastT = now;
      card.style.transform = `translate(${dx.toFixed(1)}px, ${(dy * 0.35).toFixed(1)}px) rotate(${(dx * 0.06).toFixed(2)}deg)`;
      card.style.setProperty('--keep', Math.max(0, Math.min(1, dx / 110)).toFixed(3));
      card.style.setProperty('--del', Math.max(0, Math.min(1, -dx / 110)).toFixed(3));
      deck.style.setProperty('--drag', Math.min(1, Math.abs(dx) / 160).toFixed(3));
    };
    const up = () => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerup', up);
      card.removeEventListener('pointercancel', up);
      if (dx > 110 || vx > 0.7) this.decide('keep', card);
      else if (dx < -110 || vx < -0.7) this.decide('delete', card);
      else {
        card.classList.remove('is-dragging');
        card.style.transform = '';
        card.style.setProperty('--keep', '0');
        card.style.setProperty('--del', '0');
        deck.style.setProperty('--drag', '0');
      }
    };
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerup', up);
    card.addEventListener('pointercancel', up);
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
