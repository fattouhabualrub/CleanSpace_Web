import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { RevealDirective } from '../directives/reveal';

interface Section { arH: string; enH: string; arP: string[]; enP: string[]; arUl?: string[]; enUl?: string[]; }

@Component({
  selector: 'app-terms',
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="legal">
      <div class="container legal__wrap">
        <a class="back-link" routerLink="/">‹ {{ i18n.t('الرئيسية', 'Home') }}</a>
        <h1>{{ i18n.t('الشروط والأحكام', 'Terms & Conditions') }}</h1>
        <p class="legal__meta">{{ i18n.t('آخر تحديث: يونيو ٢٠٢٦', 'Last updated: June 2026') }}</p>
        <p class="legal__note">
          {{ i18n.t(
            'نموذج توضيحي — راجِع المحتوى مع مستشار قانوني وعدّل اسم الشركة والاختصاص القضائي وبيانات التواصل قبل النشر.',
            'Template for reference — review with legal counsel and fill in your company name, jurisdiction, and contact details before publishing.') }}
        </p>

        @for (s of sections; track s.enH) {
          <div class="legal__section" appReveal>
            <h2>{{ i18n.t(s.arH, s.enH) }}</h2>
            @for (p of (i18n.isRTL() ? s.arP : s.enP); track $index) { <p>{{ p }}</p> }
            @if (s.arUl) {
              <ul>@for (li of (i18n.isRTL() ? s.arUl! : s.enUl!); track $index) { <li>{{ li }}</li> }</ul>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class TermsComponent {
  i18n = inject(I18n);

  sections: Section[] = [
    {
      arH: '١. قبول الشروط', enH: '1. Acceptance of terms',
      arP: ['باستخدامك تطبيق CleanSpace («التطبيق») فإنك توافق على هذه الشروط. إذا لم توافق، يُرجى عدم استخدام التطبيق.'],
      enP: ['By using the CleanSpace app (the “App”) you agree to these Terms. If you do not agree, please do not use the App.'],
    },
    {
      arH: '٢. الخدمة', enH: '2. The service',
      arP: ['CleanSpace أداة لتنظيف مساحة التخزين تعمل على جهازك: تكتشف الصور المكررة والمتشابهة، تضغط الفيديو، وتساعدك في إدارة مكتبتك. تتم كل المعالجة محلياً على جهازك.'],
      enP: ['CleanSpace is an on-device storage cleaner: it finds duplicate and similar photos, compresses videos, and helps you manage your library. All processing happens locally on your device.'],
    },
    {
      arH: '٣. الاشتراكات والدفع', enH: '3. Subscriptions & billing',
      arP: ['يوفّر التطبيق اشتراكات متجدّدة تلقائياً (أسبوعية/شهرية/سنوية) تفتح كل المميزات.'],
      enP: ['The App offers auto-renewable subscriptions (weekly / monthly / yearly) that unlock all features.'],
      arUl: [
        'يُحصَّل المبلغ من حساب Apple الخاص بك عند تأكيد الشراء.',
        'يتجدّد الاشتراك تلقائياً ما لم يتم إيقاف التجديد قبل ٢٤ ساعة على الأقل من نهاية الفترة الحالية.',
        'تتم محاسبتك على التجديد خلال ٢٤ ساعة قبل نهاية الفترة بنفس سعر الخطة.',
        'يمكنك إدارة اشتراكك أو إلغاء التجديد من إعدادات الـ App Store بعد الشراء.',
        'إذا كانت هناك فترة تجريبية مجانية، يسقط أي جزء غير مستخدم منها عند شراء اشتراك.',
      ],
      enUl: [
        'Payment is charged to your Apple account upon purchase confirmation.',
        'The subscription renews automatically unless auto-renew is turned off at least 24 hours before the end of the current period.',
        'Your account is charged for renewal within 24 hours before the period ends, at the plan’s price.',
        'You can manage your subscription or turn off auto-renew in your App Store settings after purchase.',
        'If a free trial is offered, any unused portion is forfeited when you purchase a subscription.',
      ],
    },
    {
      arH: '٤. الاستخدام المسموح', enH: '4. Acceptable use',
      arP: ['توافق على استخدام التطبيق فقط على الأجهزة والحسابات التي تملكها أو لديك صلاحية استخدامها، وعدم إساءة استخدامه أو محاولة تعطيله أو الهندسة العكسية له.'],
      enP: ['You agree to use the App only on devices and accounts you own or are authorized to use, and not to misuse, disrupt, or reverse-engineer it.'],
    },
    {
      arH: '٥. صورك وبياناتك', enH: '5. Your photos & data',
      arP: ['عند حذف عناصر عبر التطبيق فإنها تنتقل إلى ألبوم «المحذوفة مؤخراً» في تطبيق الصور حيث يمكن استعادتها خلال ٣٠ يوماً. أنت المسؤول عن مراجعة اختياراتك قبل الحذف؛ ونوصي بعمل نسخة احتياطية لبياناتك.'],
      enP: ['When you delete items through the App, they go to the “Recently Deleted” album in Photos, where they can be recovered for 30 days. You are responsible for reviewing your selections before deleting; we recommend keeping a backup of your data.'],
    },
    {
      arH: '٦. إخلاء المسؤولية', enH: '6. Disclaimer',
      arP: ['يُقدَّم التطبيق «كما هو» دون أي ضمانات صريحة أو ضمنية. لا نضمن أن يكون خالياً من الأخطاء أو أن يناسب غرضاً معيّناً.'],
      enP: ['The App is provided “as is” without warranties of any kind, express or implied. We do not warrant that it will be error-free or fit for a particular purpose.'],
    },
    {
      arH: '٧. حدود المسؤولية', enH: '7. Limitation of liability',
      arP: ['إلى الحد الذي يسمح به القانون، لا نتحمّل المسؤولية عن أي فقدان للبيانات أو أضرار غير مباشرة أو تبعية ناتجة عن استخدام التطبيق.'],
      enP: ['To the maximum extent permitted by law, we are not liable for any data loss or indirect or consequential damages arising from your use of the App.'],
    },
    {
      arH: '٨. تعديل الشروط', enH: '8. Changes to these terms',
      arP: ['قد نُحدّث هذه الشروط من وقت لآخر. استمرارك في استخدام التطبيق بعد التحديث يعني موافقتك على الشروط المعدّلة.'],
      enP: ['We may update these Terms from time to time. Your continued use of the App after an update means you accept the revised Terms.'],
    },
    {
      arH: '٩. القانون الحاكم', enH: '9. Governing law',
      arP: ['تخضع هذه الشروط لقوانين [الاختصاص القضائي] دون اعتبار لقواعد تنازع القوانين.'],
      enP: ['These Terms are governed by the laws of [your jurisdiction], without regard to conflict-of-law rules.'],
    },
    {
      arH: '١٠. تواصل معنا', enH: '10. Contact',
      arP: ['لأي استفسار حول هذه الشروط: ai-platforms@fattouh.me'],
      enP: ['For questions about these Terms: ai-platforms@fattouh.me'],
    },
  ];
}
