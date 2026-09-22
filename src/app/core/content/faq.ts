/**
 * The FAQ, authored once.
 *
 * It is rendered by the home page AND emitted as FAQPage structured data. Those
 * lived in two files and drifted: the page grew a question the JSON-LD never
 * got, and one answer's title was shortened on only one side. A mismatch
 * between visible copy and structured data is a manual-action risk, so both
 * now read this array and cannot disagree.
 */
export interface FaqItem {
  arQ: string;
  enQ: string;
  arA: string;
  enA: string;
}

export const FAQ: readonly FaqItem[] = [
  {
    arQ: 'هل تُرفع صوري إلى الإنترنت؟',
    enQ: 'Are my photos uploaded to the internet?',
    arA: 'لا. كل الفحص والحذف يتم على جهازك بالكامل، ويعمل التطبيق حتى بدون اتصال. لا نرفع صورك ولا نراها إطلاقاً.',
    enA: 'No. All scanning and deleting happen entirely on your device, and the app works even offline. We never upload or see your photos.',
  },
  {
    arQ: 'ماذا أحصل عليه مجاناً؟',
    enQ: 'What do I get for free?',
    arA: 'الفحص الكامل وتحليل المكتبة واكتشاف المكرر والمتشابه مجاني، إضافة إلى تحرير أول ١٠٠ ميغابايت و١٠ عناصر في الخزنة السرية — بلا اشتراك. بعدها يفتح Pro التنظيف بلا حدود وضغط الفيديو ودمج جهات الاتصال.',
    enA: 'The full scan, library analysis, and finding duplicates & look-alikes are free — plus your first 100 MB of actual cleaning and 10 items in the Secret Vault, with no subscription. Pro then unlocks unlimited cleaning, video compression and contact merging.',
  },
  {
    arQ: 'ما الفرق بين الأسبوعي والسنوي ومدى الحياة؟',
    enQ: 'What’s the difference between Weekly, Yearly and Lifetime?',
    arA: 'الأسبوعي والسنوي اشتراكان يتجدّدان تلقائياً، والسنوي أوفر بكثير. «مدى الحياة» عملية شراء واحدة بلا تجديد.',
    enA: 'Weekly and Yearly are auto-renewing subscriptions, with Yearly far cheaper over time. Lifetime is a single one-time purchase with no renewal.',
  },
  {
    arQ: 'هل توجد تجربة مجانية؟',
    enQ: 'Is there a free trial?',
    arA: 'نعم — ٧ أيام مجاناً على الخطة الأسبوعية. تمنح Apple التجربة مرة واحدة لكل حساب، فإن كنت قد استخدمتها في CleanSpace من قبل فلن تظهر لك. تتحوّل بعدها إلى ٦٫٩٩$ أسبوعياً ما لم تُلغِها قبل ٢٤ ساعة من انتهائها.',
    enA: 'Yes — 7 days free on the weekly plan. Apple grants the trial once per account, so if you have already used it on CleanSpace it won’t be offered again. It then becomes $6.99 / week unless you cancel at least 24 hours before it ends.',
  },
  {
    arQ: 'هل يعمل مع صور iCloud؟',
    enQ: 'Does it work with iCloud Photos?',
    arA: 'نعم. يقرأ CleanSpace مكتبة الصور نفسها التي يستخدمها تطبيق «الصور»، وما تحذفه ينعكس على iCloud كما لو حذفته من تطبيق الصور مباشرة.',
    enA: 'Yes. CleanSpace reads the same photo library the Photos app uses, and anything you delete syncs to iCloud exactly as it would if you deleted it in Photos.',
  },
  {
    arQ: 'هل يمكنني الإلغاء في أي وقت؟',
    enQ: 'Can I cancel anytime?',
    arA: 'نعم. تُدار الاشتراكات من إعدادات الـ App Store، ويمكنك إيقاف التجديد في أي وقت.',
    enA: 'Yes. Subscriptions are managed from your App Store settings, and you can turn off renewal at any time.',
  },
  {
    arQ: 'هل الحذف آمن؟ ماذا لو حذفت شيئاً بالخطأ؟',
    enQ: 'Is deleting safe? What if I remove something by mistake?',
    arA: 'يمرّ المحذوف عبر ألبوم «المحذوفة مؤخراً» في تطبيق الصور لمدة ٣٠ يوماً، فيمكنك الاستعادة بسهولة.',
    enA: 'Deleted items pass through the Photos app’s “Recently Deleted” album for 30 days, so you can restore them easily.',
  },
];
