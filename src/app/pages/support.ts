import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';

/**
 * Support / Contact page. Two direct channels (Message us → info@, Support → support@)
 * plus a contact form. The site is fully static (no backend), so the form composes a
 * pre-filled email via a mailto: link — the message and reply address land in the user's
 * mail client, ready to send. No data leaves the device until they hit send.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-support',
  imports: [RouterLink],
  template: `
    <section class="section" id="main-content">
      <div class="container">
        <a class="back-link" routerLink="/">
          <svg class="ico" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          {{ i18n.t('الصفحة الرئيسية', 'Home') }}
        </a>

        <div class="support">
          <div class="support__intro">
            <span class="eyebrow">{{ i18n.t('تواصل معنا', 'Contact us') }}</span>
            <h1>{{ i18n.t('كيف نقدر نساعدك؟', 'How can we help?') }}</h1>
            <p>
              {{ i18n.t('عندك سؤال، اقتراح، أو مشكلة؟ راسلنا مباشرة أو عبّي النموذج وبنرد عليك بأسرع وقت.',
                        'Have a question, idea, or an issue? Reach us directly or fill in the form and we will get back to you shortly.') }}
            </p>

            <div class="support__cards">
              <a class="support__card" href="mailto:info@cleaningspace.app">
                <span class="support__card-ic" aria-hidden="true">
                  <svg class="ico" width="22" height="22" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                </span>
                <span class="support__card-txt">
                  <b>{{ i18n.t('راسلنا', 'Message us') }}</b>
                  <span dir="ltr">info&#64;cleaningspace.app</span>
                </span>
              </a>
              <a class="support__card" href="mailto:support@cleaningspace.app">
                <span class="support__card-ic" aria-hidden="true">
                  <svg class="ico" width="22" height="22" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
                </span>
                <span class="support__card-txt">
                  <b>{{ i18n.t('الدعم', 'Support') }}</b>
                  <span dir="ltr">support&#64;cleaningspace.app</span>
                </span>
              </a>
            </div>
          </div>

          @if (sent()) {
            <div class="support__form support__form--done">
              <span class="support__done-ic" aria-hidden="true">
                <svg class="ico" width="30" height="30" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
              </span>
              <h3>{{ i18n.t('تم فتح بريدك', 'Your email is ready') }}</h3>
              <p>{{ i18n.t('فتحنا برنامج البريد عندك بالرسالة جاهزة — بس اضغط إرسال. ما وصلك؟ راسلنا على support@cleaningspace.app',
                           'We opened your mail app with the message ready — just press send. If it did not open, email us at support@cleaningspace.app') }}</p>
              <button type="button" class="btn btn--ghost" (click)="sent.set(false)">
                {{ i18n.t('رسالة جديدة', 'New message') }}
              </button>
            </div>
          } @else {
            <form class="support__form" (submit)="onSubmit(emailEl.value, msgEl.value, $event)" novalidate>
              <div class="support__field">
                <label for="s-email">{{ i18n.t('بريدك الإلكتروني', 'Your email') }}</label>
                <input #emailEl id="s-email" type="email" required dir="ltr"
                       [attr.placeholder]="i18n.t('you@example.com', 'you@example.com')" />
              </div>
              <div class="support__field">
                <label for="s-msg">{{ i18n.t('رسالتك', 'Your message') }}</label>
                <textarea #msgEl id="s-msg" required
                          [attr.placeholder]="i18n.t('كيف نقدر نساعدك؟', 'How can we help you?')"></textarea>
              </div>
              <button type="submit" class="btn btn--primary btn--block">
                {{ i18n.t('إرسال', 'Send') }}
              </button>
              <p class="support__hint">
                {{ i18n.t('بيفتح برنامج البريد عندك بالرسالة جاهزة.', 'This opens your mail app with the message ready to send.') }}
              </p>
            </form>
          }
        </div>
      </div>
    </section>
  `,
})
export class SupportPageComponent {
  i18n = inject(I18n);
  readonly sent = signal(false);

  onSubmit(email: string, message: string, e: Event): void {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    const subject = encodeURIComponent('CleanSpace — ' + this.i18n.t('طلب دعم', 'Support request'));
    const body = encodeURIComponent(
      message.trim() + '\n\n— ' + this.i18n.t('من', 'From') + ': ' + email.trim()
    );
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:support@cleaningspace.app?subject=${subject}&body=${body}`;
    }
    this.sent.set(true);
  }
}
