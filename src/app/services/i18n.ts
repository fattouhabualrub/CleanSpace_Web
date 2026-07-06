import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'ar' | 'en';

@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>('ar');
  readonly isRTL = computed(() => this.lang() === 'ar');

  constructor() {
    const saved = (typeof localStorage !== 'undefined'
      ? localStorage.getItem('lang')
      : null) as Lang | null;
    if (saved === 'ar' || saved === 'en') this.lang.set(saved);
    this.apply();
  }

  /** Inline bilingual helper: t('عربي', 'english'). */
  t(ar: string, en: string): string {
    return this.lang() === 'ar' ? ar : en;
  }

  toggle(): void {
    this.lang.set(this.lang() === 'ar' ? 'en' : 'ar');
    this.apply();
  }

  private apply(): void {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = this.lang();
    document.documentElement.dir = this.isRTL() ? 'rtl' : 'ltr';
    if (typeof localStorage !== 'undefined') localStorage.setItem('lang', this.lang());
  }
}
