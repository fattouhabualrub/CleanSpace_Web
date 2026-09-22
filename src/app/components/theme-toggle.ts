import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18n } from '../services/i18n';
import { Theme } from '../core/theme';

/**
 * Light/dark switch for the navbar.
 *
 * Shows the scheme it will switch *to*, which is the convention users expect
 * from a single-button toggle: a moon while light is on, a sun while dark is.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button type="button" class="theme-toggle" (click)="theme.toggle()"
            [attr.aria-label]="label()" [attr.title]="label()">
      @if (theme.scheme() === 'dark') {
        <!-- sun: tapping returns to light -->
        <svg class="theme-toggle__ic" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2"/>
          <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8"/>
        </svg>
      } @else {
        <!-- moon: tapping switches to dark -->
        <svg class="theme-toggle__ic" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7Z"/>
        </svg>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  readonly i18n = inject(I18n);
  readonly theme = inject(Theme);

  label(): string {
    return this.theme.scheme() === 'dark'
      ? this.i18n.t('التبديل إلى الوضع الفاتح', 'Switch to light mode')
      : this.i18n.t('التبديل إلى الوضع الداكن', 'Switch to dark mode');
  }
}
