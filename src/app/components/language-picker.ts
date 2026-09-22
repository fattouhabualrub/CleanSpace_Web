import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { I18n, Lang } from '../services/i18n';
import { urlWithLang } from '../services/lang-route';

/**
 * 21-language switcher. A transparent full-size native <select> overlays a styled
 * button (flag + endonym), so we get native dropdown UX with our own visible label.
 * Kurdish (ckb) has no emoji flag, so it renders a small inline Kurdistan flag.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-language-picker',
  standalone: true,
  template: `
    <label class="lang-picker" [attr.aria-label]="i18n.t('اللغة', 'Language')">
      @if (i18n.current().code === 'ckb') {
        <span class="lang-picker__flag">
          <svg viewBox="0 0 24 16" class="kflag" aria-hidden="true">
            <rect width="24" height="16" fill="#fff" />
            <rect width="24" height="5.33" fill="#ED2024" />
            <rect width="24" height="5.34" y="10.66" fill="#278E43" />
            <g fill="#FEBD11">
              <circle cx="12" cy="8" r="2.3" />
              <rect x="11.6" y="2.2" width="0.8" height="3.6" />
              <rect x="11.6" y="10.2" width="0.8" height="3.6" />
              <rect x="4" y="7.6" width="3.6" height="0.8" />
              <rect x="16.4" y="7.6" width="3.6" height="0.8" />
              <rect x="6.4" y="3.6" width="0.8" height="3.6" transform="rotate(45 6.8 5.4)" />
              <rect x="17" y="3.6" width="0.8" height="3.6" transform="rotate(-45 17.4 5.4)" />
              <rect x="6.4" y="8.8" width="0.8" height="3.6" transform="rotate(-45 6.8 10.6)" />
              <rect x="17" y="8.8" width="0.8" height="3.6" transform="rotate(45 17.4 10.6)" />
            </g>
          </svg>
        </span>
      } @else {
        <span class="lang-picker__flag">{{ i18n.current().flag }}</span>
      }
      <span class="lang-picker__name">{{ i18n.current().native }}</span>
      <span class="lang-picker__chevron" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </span>
      <select class="lang-picker__select" (change)="onChange($event)">
        @for (l of i18n.languages; track l.code) {
          <option [value]="l.code" [selected]="l.code === i18n.lang()">
            {{ (l.flag ? l.flag + '  ' : '') + l.native }}
          </option>
        }
      </select>
    </label>
  `,
})
export class LanguagePickerComponent {
  i18n = inject(I18n);
  private readonly router = inject(Router);

  onChange(e: Event): void {
    const code = (e.target as HTMLSelectElement).value as Lang;
    this.i18n.setLang(code);
    // On a /<lang>/… page the URL has to follow the picker, or the address bar
    // would keep advertising a language the page no longer shows. Unprefixed
    // pages are left alone.
    const tree = urlWithLang(this.router, code);
    if (tree) void this.router.navigateByUrl(tree, { replaceUrl: true });
  }
}
