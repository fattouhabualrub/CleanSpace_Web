import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

export type Lang =
  | 'ar' | 'en' | 'ckb' | 'de' | 'es' | 'fa' | 'fr' | 'hi' | 'id'
  | 'it' | 'ja' | 'ko' | 'nl' | 'pl' | 'pt-BR' | 'ru' | 'tr' | 'ur'
  | 'vi' | 'zh-Hans' | 'zh-Hant';

export interface LangInfo {
  code: Lang;
  /** Endonym — the language's name in itself. */
  native: string;
  /** Emoji flag, or '' for languages we render a custom mark for (ckb). */
  flag: string;
  rtl: boolean;
}

const RTL_LANGS: ReadonlySet<Lang> = new Set<Lang>(['ar', 'ckb', 'fa', 'ur']);

/** Module-level so the router's /:lang matcher can read it without the injector. */
export const LANGUAGES: readonly LangInfo[] = [
  { code: 'ar', native: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'en', native: 'English', flag: '🇬🇧', rtl: false },
  { code: 'ckb', native: 'کوردیی ناوەندی', flag: '', rtl: true },
  { code: 'fa', native: 'فارسی', flag: '🇮🇷', rtl: true },
  { code: 'ur', native: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'tr', native: 'Türkçe', flag: '🇹🇷', rtl: false },
  { code: 'de', native: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'fr', native: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'es', native: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'it', native: 'Italiano', flag: '🇮🇹', rtl: false },
  { code: 'nl', native: 'Nederlands', flag: '🇳🇱', rtl: false },
  { code: 'pt-BR', native: 'Português (BR)', flag: '🇧🇷', rtl: false },
  { code: 'ru', native: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'id', native: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
  { code: 'hi', native: 'हिन्दी', flag: '🇮🇳', rtl: false },
  { code: 'ja', native: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'ko', native: '한국어', flag: '🇰🇷', rtl: false },
  { code: 'vi', native: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
  { code: 'pl', native: 'Polski', flag: '🇵🇱', rtl: false },
  { code: 'zh-Hans', native: '简体中文', flag: '🇨🇳', rtl: false },
  { code: 'zh-Hant', native: '繁體中文', flag: '🇹🇼', rtl: false },
];

@Injectable({ providedIn: 'root' })
export class I18n {
  /** ar & en are authored inline via t(ar, en); the other 19 come from TRANSLATIONS
   *  keyed by the English string, with a graceful fallback to English. */
  readonly languages = LANGUAGES;

  /** English is the default; a saved preference or a /<lang>/ URL overrides it. */
  readonly lang = signal<Lang>('en');
  readonly isRTL = computed(() => RTL_LANGS.has(this.lang()));
  readonly current = computed<LangInfo>(
    () => this.languages.find((l) => l.code === this.lang()) ?? this.languages[1]
  );
  /** Screenshots exist only in ar & en; every other language shows the English shots. */
  readonly shotLang = computed<'ar' | 'en'>(() => (this.lang() === 'ar' ? 'ar' : 'en'));

  private readonly codes = new Set<Lang>(this.languages.map((l) => l.code));

  /** ar & en ship inline; the 19-language dictionary is a lazy chunk loaded
   *  on demand the first time a non-ar/en language is selected. Until then, and as a
   *  fallback for any missing key, t() returns English. */
  private readonly dict = signal<Record<string, Record<string, string>>>({});
  private dictLoading?: Promise<void>;

  /** Injected, not the global: during prerendering there is no global `document`. */
  private readonly doc = inject(DOCUMENT);

  constructor() {
    const saved = (typeof localStorage !== 'undefined'
      ? localStorage.getItem('lang')
      : null) as Lang | null;
    if (saved && this.codes.has(saved)) this.lang.set(saved);
    this.apply();
    if (this.lang() !== 'ar' && this.lang() !== 'en') void this.ensureDict();
  }

  /** Inline bilingual helper: t('عربي', 'english'). English doubles as the dictionary key. */
  t(ar: string, en: string): string {
    const l = this.lang();
    if (l === 'ar') return ar;
    if (l === 'en') return en;
    return this.dict()[l]?.[en] ?? en;
  }

  /**
   * Switches language, resolving once the copy is actually in place. Awaiting it
   * is what lets the prerenderer serialize a fully translated page instead of
   * racing the dictionary chunk.
   */
  setLang(l: Lang): Promise<void> {
    if (!this.codes.has(l)) return Promise.resolve();
    if (l !== 'ar' && l !== 'en') {
      // Load the dictionary first so switching lands directly in the target language.
      return this.ensureDict().then(() => {
        this.lang.set(l);
        this.apply();
      });
    }
    this.lang.set(l);
    this.apply();
    return Promise.resolve();
  }

  private ensureDict(): Promise<void> {
    if (this.dictLoading) return this.dictLoading;
    this.dictLoading = import('./i18n-translations').then((m) => {
      this.dict.set(m.TRANSLATIONS);
    });
    return this.dictLoading;
  }

  /** Kept for back-compat: flips between Arabic and English. */
  toggle(): void {
    this.setLang(this.lang() === 'ar' ? 'en' : 'ar');
  }

  /** Writes lang/dir onto <html>. Runs on the server too, so the prerendered
   *  bytes carry the right direction before a single line of JS executes. */
  private apply(): void {
    const root = this.doc.documentElement;
    if (root) {
      root.lang = this.lang();
      root.dir = this.isRTL() ? 'rtl' : 'ltr';
    }
    if (typeof localStorage !== 'undefined') localStorage.setItem('lang', this.lang());
  }
}
