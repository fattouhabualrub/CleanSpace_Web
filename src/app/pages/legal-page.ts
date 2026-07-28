import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, startWith, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { I18n } from '../services/i18n';
import { LegalService, LegalDoc } from '../services/legal';

type State = { status: 'loading' } | { status: 'ok'; doc: LegalDoc } | { status: 'error' };

/**
 * Terms & Privacy pages — content is fetched live from the CleanSpace Admin API
 * (single source of truth) for the visitor's current language, re-fetching when
 * the language changes. Route supplies `data.type` = 'terms' | 'privacy'.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-legal-page',
  imports: [RouterLink],
  template: `
    <section class="legal">
      <div class="container legal__wrap">
        <a class="back-link" routerLink="/">‹ {{ i18n.t('الرئيسية', 'Home') }}</a>

        @if (loading()) {
          <div class="legal__loading" role="status" aria-live="polite">
            <span class="legal__spinner" aria-hidden="true"></span>
            {{ i18n.t('جارٍ التحميل…', 'Loading…') }}
          </div>
        } @else if (errored()) {
          <h1>{{ fallbackTitle() }}</h1>
          <p class="legal__note">
            {{ i18n.t('تعذّر تحميل المحتوى حاليًا. يرجى المحاولة لاحقًا.',
                      'This content is unavailable right now. Please try again later.') }}
          </p>
        } @else if (doc(); as d) {
          <h1>{{ d.title || fallbackTitle() }}</h1>
          @if (d.updatedAt) {
            <p class="legal__meta">{{ i18n.t('آخر تحديث', 'Last updated') }}: {{ formatDate(d.updatedAt) }}</p>
          }
          <div class="legal__body" [innerHTML]="d.body"></div>
        }
      </div>
    </section>
  `,
})
export class LegalPageComponent {
  i18n = inject(I18n);
  private legal = inject(LegalService);
  readonly type = (inject(ActivatedRoute).snapshot.data['type'] ?? 'terms') as 'terms' | 'privacy';

  private readonly state = toSignal(
    toObservable(this.i18n.lang).pipe(
      switchMap((loc) =>
        this.legal.get(this.type, loc).pipe(
          map((doc) => ({ status: 'ok', doc }) as State),
          startWith({ status: 'loading' } as State),
          catchError(() => of({ status: 'error' } as State)),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } as State },
  );

  readonly loading = computed(() => this.state().status === 'loading');
  readonly errored = computed(() => this.state().status === 'error');
  readonly doc = computed<LegalDoc | null>(() => {
    const s = this.state();
    return s.status === 'ok' ? s.doc : null;
  });

  fallbackTitle(): string {
    return this.type === 'privacy'
      ? this.i18n.t('سياسة الخصوصية', 'Privacy Policy')
      : this.i18n.t('الشروط والأحكام', 'Terms & Conditions');
  }

  formatDate(iso: string): string {
    const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      return new Date(iso).toLocaleDateString(this.i18n.lang(), opts);
    } catch {
      return new Date(iso).toLocaleDateString('en', opts);
    }
  }
}
