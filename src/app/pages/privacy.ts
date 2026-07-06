import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { RevealDirective } from '../directives/reveal';

interface Section { arH: string; enH: string; arP: string[]; enP: string[]; arUl?: string[]; enUl?: string[]; }

@Component({
  selector: 'app-privacy',
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="legal">
      <div class="container legal__wrap">
        <a class="back-link" routerLink="/">‹ {{ i18n.t('الرئيسية', 'Home') }}</a>
        <h1>{{ i18n.t('سياسة الخصوصية', 'Privacy Policy') }}</h1>
        <p class="legal__meta">{{ i18n.t('آخر تحديث: يونيو ٢٠٢٦', 'Last updated: June 2026') }}</p>
        <p class="legal__note">
          {{ i18n.t(
            'نموذج توضيحي — راجِع المحتوى مع مستشار قانوني وعدّل بيانات الشركة قبل النشر.',
            'Template for reference — review with legal counsel and fill in your company details before publishing.') }}
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
export class PrivacyComponent {
  i18n = inject(I18n);

  sections: Section[] = [
    {
      arH: 'نظرة عامة', enH: 'Overview',
      arP: ['خصوصيتك أولوية. CleanSpace مصمّم ليعمل بالكامل على جهازك — صورك ومقاطعك لا تغادر الجهاز ولا تُرفع إلى أي خادم.'],
      enP: ['Your privacy comes first. CleanSpace is designed to run entirely on your device — your photos and videos never leave it and are never uploaded to any server.'],
    },
    {
      arH: 'بيانات لا نجمعها', enH: 'Data we do not collect',
      arP: ['لا نجمع ولا نخزّن ولا نرفع صورك أو فيديوهاتك أو جهات اتصالك. كل التحليل (اكتشاف المكرر/المتشابه، الضغط) يتم محلياً على جهازك.'],
      enP: ['We do not collect, store, or upload your photos, videos, or contacts. All analysis (duplicate/similar detection, compression) happens locally on your device.'],
    },
    {
      arH: 'الأذونات التي نطلبها', enH: 'Permissions we request',
      arP: ['نطلب الأذونات التالية فقط لتشغيل ميزات التطبيق، وتُستخدم محلياً:'],
      enP: ['We request the following permissions solely to power the App’s features, used locally:'],
      arUl: [
        'الصور: لفحص مكتبتك واكتشاف المكرر/المتشابه وضغط الفيديو وحذف ما تختاره.',
        'جهات الاتصال: لاكتشاف جهات الاتصال المكررة ودمجها (عند استخدام تلك الميزة).',
        'Face ID / رمز الدخول: لقفل الخزنة الخاصة على جهازك.',
      ],
      enUl: [
        'Photos: to scan your library, find duplicates/look-alikes, compress videos, and delete what you choose.',
        'Contacts: to find and merge duplicate contacts (when you use that feature).',
        'Face ID / passcode: to lock the private vault on your device.',
      ],
    },
    {
      arH: 'الاشتراكات والدفع', enH: 'Subscriptions & payments',
      arP: ['تتم معالجة المدفوعات والاشتراكات عبر Apple (App Store). نحن لا نطّلع على بيانات بطاقتك أو معلومات الدفع ولا نخزّنها. تُطبَّق سياسة خصوصية Apple على عملية الدفع.'],
      enP: ['Payments and subscriptions are processed by Apple (App Store). We never see or store your card or payment details. Apple’s privacy policy applies to the payment process.'],
    },
    {
      arH: 'مزوّدو الطرف الثالث', enH: 'Third-party providers',
      arP: ['نعتمد على خدمات Apple (مثل App Store وStoreKit وiCloud حسب إعداداتك). لا نشارك بياناتك مع أي معلِنين أو وسطاء بيانات.'],
      enP: ['We rely on Apple services (such as the App Store, StoreKit, and iCloud per your settings). We do not share your data with advertisers or data brokers.'],
    },
    {
      arH: 'الأطفال', enH: 'Children',
      arP: ['التطبيق غير موجّه للأطفال دون ١٣ عاماً، ولا نجمع بياناتهم عن قصد.'],
      enP: ['The App is not directed to children under 13, and we do not knowingly collect their data.'],
    },
    {
      arH: 'الاحتفاظ بالبيانات', enH: 'Data retention',
      arP: ['بما أننا لا نجمع بياناتك الشخصية، لا يوجد ما نحتفظ به على خوادمنا. أي بيانات (كنتائج الفحص أو إعدادات الخزنة) تبقى على جهازك وتُحذف بحذف التطبيق.'],
      enP: ['Because we don’t collect your personal data, there is nothing to retain on our servers. Any data (such as scan results or vault settings) stays on your device and is removed when you delete the App.'],
    },
    {
      arH: 'حقوقك', enH: 'Your rights',
      arP: ['أنت تتحكّم ببياناتك بالكامل: يمكنك سحب أي إذن من إعدادات الجهاز، وحذف بيانات التطبيق في أي وقت بحذف التطبيق.'],
      enP: ['You stay in full control: you can revoke any permission in device Settings and remove all App data at any time by deleting the App.'],
    },
    {
      arH: 'تعديل السياسة', enH: 'Changes to this policy',
      arP: ['قد نُحدّث هذه السياسة، وسننشر النسخة المحدّثة هنا مع تاريخ التحديث.'],
      enP: ['We may update this policy and will post the revised version here with the update date.'],
    },
    {
      arH: 'تواصل معنا', enH: 'Contact',
      arP: ['لأي استفسار حول الخصوصية: ai-platforms@fattouh.me'],
      enP: ['For privacy questions: ai-platforms@fattouh.me'],
    },
  ];
}
