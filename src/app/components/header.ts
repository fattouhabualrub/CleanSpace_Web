import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <nav class="nav" [class.nav--scrolled]="scrolled()">
      <div class="container nav__inner">
        <a class="brand" routerLink="/">
          <span class="brand__mark">✦</span> CleanSpace
        </a>
        <div class="nav__links">
          <a routerLink="/" fragment="features">{{ i18n.t('الميزات', 'Features') }}</a>
          <a routerLink="/" fragment="plans">{{ i18n.t('الأسعار', 'Plans') }}</a>
          <a routerLink="/privacy">{{ i18n.t('الخصوصية', 'Privacy') }}</a>
          <a routerLink="/terms">{{ i18n.t('الشروط', 'Terms') }}</a>
        </div>
        <div class="nav__actions">
          <button class="lang-toggle" (click)="i18n.toggle()">{{ i18n.t('EN', 'عربي') }}</button>
          <a class="btn btn--primary" routerLink="/" fragment="plans">
            {{ i18n.t('حمّل الآن', 'Get the App') }}
          </a>
        </div>
      </div>
    </nav>
  `,
})
export class HeaderComponent {
  i18n = inject(I18n);
  readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }
}
