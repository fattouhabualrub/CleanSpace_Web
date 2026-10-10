import type { Lang } from '../../services/i18n';

/** The secondary routes that get their own title and description. */
export type SeoPage = 'download' | 'support' | 'privacy' | 'terms';

export interface PageCopy {
  title: string;
  description: string;
}

/**
 * Per-page head copy for the secondary routes, in every locale.
 *
 * Without this every route shipped the home page's title and description, so
 * 4 pages × 21 locales were duplicate titles in the index — Google tends to
 * fold such pages into one or rewrite their titles itself.
 *
 * Same length budget as SEO_COPY (title ≤ 60, description ≤ 155), and the App
 * Store name "CleanSpace: Photo Cleaner" stays Latin in every locale.
 */
export const PAGE_COPY: Record<SeoPage, Record<Lang, PageCopy>> = {
  download: {
    en: { title: 'Download CleanSpace for iPhone — Free Photo Cleaner', description: 'Get CleanSpace: Photo Cleaner on the App Store. Find duplicate photos, compress videos and free up iPhone storage — scanning is free and fully on-device.' },
    ar: { title: 'حمّل CleanSpace للآيفون — منظّف الصور المجاني', description: 'حمّل CleanSpace: Photo Cleaner من App Store. اكتشف الصور المكررة، اضغط الفيديوهات، وفرّغ مساحة الآيفون — الفحص مجاني ويتم بالكامل على جهازك.' },
    de: { title: 'CleanSpace fürs iPhone laden — kostenloser Foto-Cleaner', description: 'Hol dir CleanSpace: Photo Cleaner im App Store. Finde doppelte Fotos, komprimiere Videos und schaffe Platz auf dem iPhone – kostenlos scannen, alles lokal.' },
    es: { title: 'Descarga CleanSpace para iPhone — limpiador de fotos', description: 'Consigue CleanSpace: Photo Cleaner en el App Store. Encuentra fotos duplicadas, comprime vídeos y libera espacio en tu iPhone: el análisis es gratis y local.' },
    fr: { title: 'Télécharger CleanSpace sur iPhone — nettoyeur photo', description: 'Obtenez CleanSpace: Photo Cleaner sur l’App Store. Trouvez les photos en double, compressez les vidéos et libérez de l’espace — analyse gratuite et locale.' },
    it: { title: 'Scarica CleanSpace per iPhone — pulizia foto gratis', description: 'Scarica CleanSpace: Photo Cleaner dall’App Store. Trova foto duplicate, comprimi i video e libera spazio sull’iPhone: la scansione è gratuita e locale.' },
    nl: { title: 'Download CleanSpace voor iPhone — gratis foto-opruimer', description: 'Haal CleanSpace: Photo Cleaner in de App Store. Vind dubbele foto’s, comprimeer video’s en maak ruimte vrij op je iPhone — gratis scannen, alles lokaal.' },
    pl: { title: 'Pobierz CleanSpace na iPhone — darmowy cleaner zdjęć', description: 'Pobierz CleanSpace: Photo Cleaner z App Store. Znajdź duplikaty zdjęć, kompresuj filmy i zwolnij miejsce w iPhonie — skanowanie jest darmowe i lokalne.' },
    'pt-BR': { title: 'Baixe o CleanSpace para iPhone — limpador de fotos', description: 'Baixe o CleanSpace: Photo Cleaner na App Store. Encontre fotos duplicadas, comprima vídeos e libere espaço no iPhone — a análise é grátis e local.' },
    ru: { title: 'Скачать CleanSpace для iPhone — бесплатная чистка фото', description: 'Скачайте CleanSpace: Photo Cleaner в App Store. Находите дубликаты фото, сжимайте видео и освобождайте место на iPhone — бесплатно и прямо на устройстве.' },
    tr: { title: 'CleanSpace’i indirin — iPhone fotoğraf temizleyici', description: 'CleanSpace: Photo Cleaner’ı App Store’dan indirin. Çift fotoğrafları bulun, videoları sıkıştırın ve iPhone’da yer açın — tarama ücretsiz ve cihazda.' },
    id: { title: 'Unduh CleanSpace untuk iPhone — pembersih foto gratis', description: 'Unduh CleanSpace: Photo Cleaner di App Store. Temukan foto duplikat, kompres video, dan kosongkan ruang iPhone — pemindaian gratis dan di perangkat.' },
    vi: { title: 'Tải CleanSpace cho iPhone — dọn ảnh miễn phí', description: 'Tải CleanSpace: Photo Cleaner trên App Store. Tìm ảnh trùng lặp, nén video và giải phóng dung lượng iPhone — quét miễn phí, xử lý ngay trên máy.' },
    hi: { title: 'iPhone के लिए CleanSpace डाउनलोड करें — मुफ़्त फोटो क्लीनर', description: 'App Store से CleanSpace: Photo Cleaner पाएं। डुप्लिकेट फोटो खोजें, वीडियो कंप्रेस करें और iPhone में जगह खाली करें — स्कैन मुफ़्त और डिवाइस पर।' },
    ja: { title: 'iPhone用CleanSpaceをダウンロード — 無料の写真クリーナー', description: 'App StoreでCleanSpace: Photo Cleanerを入手。重複写真を見つけ、動画を圧縮し、iPhoneの容量を空けましょう。スキャンは無料で、すべて端末内で処理。' },
    ko: { title: 'iPhone용 CleanSpace 다운로드 — 무료 사진 정리 앱', description: 'App Store에서 CleanSpace: Photo Cleaner를 받으세요. 중복 사진을 찾고 동영상을 압축해 iPhone 공간을 확보하세요. 스캔은 무료이며 기기에서 처리됩니다.' },
    'zh-Hans': { title: '下载 iPhone 版 CleanSpace — 免费照片清理', description: '在 App Store 获取 CleanSpace: Photo Cleaner。查找重复照片、压缩视频、释放 iPhone 空间——扫描免费，全部在设备上完成。' },
    'zh-Hant': { title: '下載 iPhone 版 CleanSpace — 免費照片清理', description: '在 App Store 取得 CleanSpace: Photo Cleaner。找出重複照片、壓縮影片、釋放 iPhone 空間——掃描免費，全部在裝置上完成。' },
    fa: { title: 'دانلود CleanSpace برای آیفون — پاک‌کننده رایگان عکس', description: 'CleanSpace: Photo Cleaner را از App Store بگیرید. عکس‌های تکراری را پیدا کنید، ویدیوها را فشرده کنید و فضای آیفون را آزاد کنید — اسکن رایگان و روی دستگاه.' },
    ur: { title: 'آئی فون کے لیے CleanSpace ڈاؤن لوڈ کریں — مفت فوٹو کلینر', description: 'App Store سے CleanSpace: Photo Cleaner حاصل کریں۔ ڈپلیکیٹ تصاویر تلاش کریں، ویڈیوز کمپریس کریں اور آئی فون میں جگہ خالی کریں — اسکین مفت اور ڈیوائس پر۔' },
    ckb: { title: 'CleanSpace بۆ ئایفۆن دابگرە — پاککەرەوەی وێنە', description: 'CleanSpace: Photo Cleaner لە App Store وەربگرە. وێنە دووبارەکان بدۆزەرەوە، ڤیدیۆکان بچووک بکەرەوە و شوێن لە ئایفۆن ئازاد بکە — پشکنین بێبەرامبەرە.' },
  },
  support: {
    en: { title: 'Support & Contact — CleanSpace: Photo Cleaner', description: 'Need help with CleanSpace? Email our support team or send us a message — questions, ideas and bug reports are all welcome, and we reply quickly.' },
    ar: { title: 'الدعم والتواصل — CleanSpace: Photo Cleaner', description: 'تحتاج مساعدة في CleanSpace؟ راسل فريق الدعم بالبريد أو أرسل لنا رسالة — نرحّب بالأسئلة والاقتراحات وبلاغات الأخطاء، ونرد بسرعة.' },
    de: { title: 'Support & Kontakt — CleanSpace: Photo Cleaner', description: 'Brauchst du Hilfe mit CleanSpace? Schreib unserem Support per E-Mail oder schick uns eine Nachricht – Fragen, Ideen und Fehlerberichte sind willkommen.' },
    es: { title: 'Soporte y contacto — CleanSpace: Photo Cleaner', description: '¿Necesitas ayuda con CleanSpace? Escribe a nuestro equipo de soporte o envíanos un mensaje: preguntas, ideas y errores son bienvenidos.' },
    fr: { title: 'Assistance et contact — CleanSpace: Photo Cleaner', description: 'Besoin d’aide avec CleanSpace ? Écrivez à notre support ou envoyez-nous un message : questions, idées et signalements de bugs sont les bienvenus.' },
    it: { title: 'Assistenza e contatti — CleanSpace: Photo Cleaner', description: 'Ti serve aiuto con CleanSpace? Scrivi al nostro supporto o mandaci un messaggio: domande, idee e segnalazioni di bug sono benvenute.' },
    nl: { title: 'Support en contact — CleanSpace: Photo Cleaner', description: 'Hulp nodig met CleanSpace? Mail ons supportteam of stuur een bericht — vragen, ideeën en foutmeldingen zijn welkom. We reageren snel.' },
    pl: { title: 'Pomoc i kontakt — CleanSpace: Photo Cleaner', description: 'Potrzebujesz pomocy z CleanSpace? Napisz do naszego wsparcia lub wyślij wiadomość — pytania, pomysły i zgłoszenia błędów mile widziane.' },
    'pt-BR': { title: 'Suporte e contato — CleanSpace: Photo Cleaner', description: 'Precisa de ajuda com o CleanSpace? Envie um e-mail para o suporte ou mande uma mensagem — dúvidas, ideias e relatos de erros são bem-vindos.' },
    ru: { title: 'Поддержка и контакты — CleanSpace: Photo Cleaner', description: 'Нужна помощь с CleanSpace? Напишите в поддержку или отправьте сообщение — мы рады вопросам, идеям и сообщениям об ошибках.' },
    tr: { title: 'Destek ve iletişim — CleanSpace: Photo Cleaner', description: 'CleanSpace ile ilgili yardıma mı ihtiyacınız var? Destek ekibimize e-posta gönderin ya da mesaj yazın — sorular, fikirler ve hata bildirimleri için buradayız.' },
    id: { title: 'Dukungan & kontak — CleanSpace: Photo Cleaner', description: 'Butuh bantuan dengan CleanSpace? Kirim email ke tim dukungan atau kirim pesan — pertanyaan, ide, dan laporan bug sangat kami sambut.' },
    vi: { title: 'Hỗ trợ & liên hệ — CleanSpace: Photo Cleaner', description: 'Cần trợ giúp với CleanSpace? Gửi email cho đội hỗ trợ hoặc nhắn tin cho chúng tôi — luôn chào đón câu hỏi, ý tưởng và báo lỗi.' },
    hi: { title: 'सहायता और संपर्क — CleanSpace: Photo Cleaner', description: 'CleanSpace में मदद चाहिए? हमारी सपोर्ट टीम को ईमेल करें या संदेश भेजें — सवाल, सुझाव और बग रिपोर्ट सभी का स्वागत है।' },
    ja: { title: 'サポート・お問い合わせ — CleanSpace: Photo Cleaner', description: 'CleanSpaceについてお困りですか？サポートチームへメールまたはメッセージでご連絡ください。ご質問・ご意見・不具合報告を歓迎します。' },
    ko: { title: '지원 및 문의 — CleanSpace: Photo Cleaner', description: 'CleanSpace 사용에 도움이 필요하신가요? 지원팀에 이메일을 보내거나 메시지를 남겨 주세요. 질문, 아이디어, 버그 신고 모두 환영합니다.' },
    'zh-Hans': { title: '支持与联系 — CleanSpace: Photo Cleaner', description: '使用 CleanSpace 需要帮助？给我们的支持团队发邮件或留言——欢迎提问、建议和反馈问题，我们会尽快回复。' },
    'zh-Hant': { title: '支援與聯絡 — CleanSpace: Photo Cleaner', description: '使用 CleanSpace 需要協助？寄信給我們的支援團隊或留言給我們——歡迎提問、建議與回報問題，我們會盡快回覆。' },
    fa: { title: 'پشتیبانی و تماس — CleanSpace: Photo Cleaner', description: 'برای CleanSpace کمک لازم دارید؟ به تیم پشتیبانی ایمیل بزنید یا پیام بفرستید — از پرسش‌ها، ایده‌ها و گزارش خطا استقبال می‌کنیم.' },
    ur: { title: 'سپورٹ اور رابطہ — CleanSpace: Photo Cleaner', description: 'CleanSpace میں مدد چاہیے؟ ہماری سپورٹ ٹیم کو ای میل کریں یا پیغام بھیجیں — سوالات، تجاویز اور خرابیوں کی اطلاع کا خیرمقدم ہے۔' },
    ckb: { title: 'پشتگیری و پەیوەندی — CleanSpace: Photo Cleaner', description: 'یارمەتیت پێویستە لە CleanSpace؟ ئیمەیڵ بۆ تیمی پشتگیری بنێرە یان نامەمان بۆ بنێرە — پرسیار، بیرۆکە و ڕاپۆرتی هەڵە بەخێربێن.' },
  },
  privacy: {
    en: { title: 'Privacy Policy — CleanSpace: Photo Cleaner', description: 'How CleanSpace handles your data: every scan runs on your iPhone, no photo is ever uploaded, and no account is needed.' },
    ar: { title: 'سياسة الخصوصية — CleanSpace: Photo Cleaner', description: 'كيف يتعامل CleanSpace مع بياناتك: كل فحص يتم على جهازك، لا تُرفع أي صورة إطلاقاً، ولا حاجة لأي حساب.' },
    de: { title: 'Datenschutz — CleanSpace: Photo Cleaner', description: 'So geht CleanSpace mit deinen Daten um: Jeder Scan läuft auf deinem iPhone, kein Foto wird hochgeladen und du brauchst kein Konto.' },
    es: { title: 'Política de privacidad — CleanSpace: Photo Cleaner', description: 'Cómo trata CleanSpace tus datos: cada análisis se hace en tu iPhone, ninguna foto se sube nunca y no necesitas cuenta.' },
    fr: { title: 'Confidentialité — CleanSpace: Photo Cleaner', description: 'Comment CleanSpace traite vos données : chaque analyse se fait sur votre iPhone, aucune photo n’est envoyée et aucun compte n’est requis.' },
    it: { title: 'Privacy — CleanSpace: Photo Cleaner', description: 'Come CleanSpace gestisce i tuoi dati: ogni scansione avviene sul tuo iPhone, nessuna foto viene caricata e non serve alcun account.' },
    nl: { title: 'Privacybeleid — CleanSpace: Photo Cleaner', description: 'Zo gaat CleanSpace met je gegevens om: elke scan draait op je iPhone, er wordt geen enkele foto geüpload en je hebt geen account nodig.' },
    pl: { title: 'Polityka prywatności — CleanSpace: Photo Cleaner', description: 'Jak CleanSpace traktuje Twoje dane: każde skanowanie odbywa się na iPhonie, żadne zdjęcie nie jest wysyłane i nie potrzebujesz konta.' },
    'pt-BR': { title: 'Política de privacidade — CleanSpace: Photo Cleaner', description: 'Como o CleanSpace trata seus dados: toda análise acontece no seu iPhone, nenhuma foto é enviada e você não precisa de conta.' },
    ru: { title: 'Конфиденциальность — CleanSpace: Photo Cleaner', description: 'Как CleanSpace обращается с данными: каждое сканирование выполняется на iPhone, фото никуда не загружаются, аккаунт не нужен.' },
    tr: { title: 'Gizlilik Politikası — CleanSpace: Photo Cleaner', description: 'CleanSpace verilerinizi nasıl işler: her tarama iPhone’unuzda yapılır, hiçbir fotoğraf yüklenmez ve hesap gerekmez.' },
    id: { title: 'Kebijakan Privasi — CleanSpace: Photo Cleaner', description: 'Cara CleanSpace menangani data Anda: setiap pemindaian berjalan di iPhone Anda, tidak ada foto yang diunggah, dan tanpa akun.' },
    vi: { title: 'Quyền riêng tư — CleanSpace: Photo Cleaner', description: 'Cách CleanSpace xử lý dữ liệu của bạn: mọi lần quét đều chạy trên iPhone, không ảnh nào bị tải lên và không cần tài khoản.' },
    hi: { title: 'गोपनीयता नीति — CleanSpace: Photo Cleaner', description: 'CleanSpace आपका डेटा कैसे संभालता है: हर स्कैन आपके iPhone पर चलता है, कोई फोटो अपलोड नहीं होती और खाते की ज़रूरत नहीं।' },
    ja: { title: 'プライバシーポリシー — CleanSpace: Photo Cleaner', description: 'CleanSpaceのデータの扱い：スキャンはすべてiPhone上で行われ、写真がアップロードされることはなく、アカウントも不要です。' },
    ko: { title: '개인정보 처리방침 — CleanSpace: Photo Cleaner', description: 'CleanSpace의 데이터 처리 방식: 모든 스캔은 iPhone에서 실행되며, 사진은 업로드되지 않고 계정도 필요 없습니다.' },
    'zh-Hans': { title: '隐私政策 — CleanSpace: Photo Cleaner', description: 'CleanSpace 如何处理你的数据：所有扫描都在你的 iPhone 上进行，不会上传任何照片，也无需注册账户。' },
    'zh-Hant': { title: '隱私權政策 — CleanSpace: Photo Cleaner', description: 'CleanSpace 如何處理你的資料：所有掃描都在你的 iPhone 上進行，不會上傳任何照片，也不需要帳號。' },
    fa: { title: 'حریم خصوصی — CleanSpace: Photo Cleaner', description: 'CleanSpace چطور با داده‌های شما رفتار می‌کند: هر اسکن روی آیفون شما انجام می‌شود، هیچ عکسی آپلود نمی‌شود و نیازی به حساب نیست.' },
    ur: { title: 'رازداری کی پالیسی — CleanSpace: Photo Cleaner', description: 'CleanSpace آپ کا ڈیٹا کیسے سنبھالتا ہے: ہر اسکین آپ کے آئی فون پر ہوتا ہے، کوئی تصویر اپ لوڈ نہیں ہوتی اور اکاؤنٹ کی ضرورت نہیں۔' },
    ckb: { title: 'تایبەتمەندی — CleanSpace: Photo Cleaner', description: 'CleanSpace چۆن مامەڵە لەگەڵ داتاکانت دەکات: هەموو پشکنینێک لەسەر ئایفۆنەکەت دەکرێت، هیچ وێنەیەک بار ناکرێت و پێویستت بە هەژمار نییە.' },
  },
  terms: {
    en: { title: 'Terms & Conditions — CleanSpace: Photo Cleaner', description: 'The terms for using CleanSpace: Photo Cleaner, including subscriptions, the free trial, renewals, cancellation and acceptable use.' },
    ar: { title: 'الشروط والأحكام — CleanSpace: Photo Cleaner', description: 'شروط استخدام CleanSpace: Photo Cleaner، بما فيها الاشتراكات والتجربة المجانية والتجديد والإلغاء والاستخدام المقبول.' },
    de: { title: 'AGB — CleanSpace: Photo Cleaner', description: 'Die Nutzungsbedingungen für CleanSpace: Photo Cleaner – Abos, kostenlose Testphase, Verlängerung, Kündigung und zulässige Nutzung.' },
    es: { title: 'Términos y condiciones — CleanSpace: Photo Cleaner', description: 'Las condiciones de uso de CleanSpace: Photo Cleaner, incluidas las suscripciones, la prueba gratuita, la renovación, la cancelación y el uso aceptable.' },
    fr: { title: 'Conditions générales — CleanSpace: Photo Cleaner', description: 'Les conditions d’utilisation de CleanSpace: Photo Cleaner : abonnements, essai gratuit, renouvellement, résiliation et usage acceptable.' },
    it: { title: 'Termini e condizioni — CleanSpace: Photo Cleaner', description: 'Le condizioni d’uso di CleanSpace: Photo Cleaner, inclusi abbonamenti, prova gratuita, rinnovo, disdetta e uso consentito.' },
    nl: { title: 'Algemene voorwaarden — CleanSpace: Photo Cleaner', description: 'De gebruiksvoorwaarden van CleanSpace: Photo Cleaner, inclusief abonnementen, de gratis proefperiode, verlenging, opzegging en toegestaan gebruik.' },
    pl: { title: 'Regulamin — CleanSpace: Photo Cleaner', description: 'Zasady korzystania z CleanSpace: Photo Cleaner, w tym subskrypcje, bezpłatny okres próbny, odnawianie, anulowanie i dozwolone użycie.' },
    'pt-BR': { title: 'Termos e condições — CleanSpace: Photo Cleaner', description: 'Os termos de uso do CleanSpace: Photo Cleaner, incluindo assinaturas, teste grátis, renovação, cancelamento e uso aceitável.' },
    ru: { title: 'Условия использования — CleanSpace: Photo Cleaner', description: 'Условия использования CleanSpace: Photo Cleaner: подписки, бесплатный пробный период, продление, отмена и допустимое использование.' },
    tr: { title: 'Şartlar ve Koşullar — CleanSpace: Photo Cleaner', description: 'CleanSpace: Photo Cleaner kullanım şartları: abonelikler, ücretsiz deneme, yenileme, iptal ve kabul edilebilir kullanım.' },
    id: { title: 'Syarat & Ketentuan — CleanSpace: Photo Cleaner', description: 'Ketentuan penggunaan CleanSpace: Photo Cleaner, termasuk langganan, uji coba gratis, perpanjangan, pembatalan, dan penggunaan yang wajar.' },
    vi: { title: 'Điều khoản — CleanSpace: Photo Cleaner', description: 'Điều khoản sử dụng CleanSpace: Photo Cleaner, gồm gói đăng ký, dùng thử miễn phí, gia hạn, hủy và sử dụng hợp lệ.' },
    hi: { title: 'नियम और शर्तें — CleanSpace: Photo Cleaner', description: 'CleanSpace: Photo Cleaner के उपयोग की शर्तें — सदस्यता, मुफ़्त ट्रायल, नवीनीकरण, रद्द करना और स्वीकार्य उपयोग।' },
    ja: { title: '利用規約 — CleanSpace: Photo Cleaner', description: 'CleanSpace: Photo Cleanerの利用規約。サブスクリプション、無料トライアル、更新、解約、許容される利用について。' },
    ko: { title: '이용약관 — CleanSpace: Photo Cleaner', description: 'CleanSpace: Photo Cleaner 이용약관 — 구독, 무료 체험, 갱신, 해지 및 허용되는 사용에 관한 내용입니다.' },
    'zh-Hans': { title: '条款与条件 — CleanSpace: Photo Cleaner', description: 'CleanSpace: Photo Cleaner 的使用条款，包括订阅、免费试用、续订、取消及可接受的使用方式。' },
    'zh-Hant': { title: '條款與細則 — CleanSpace: Photo Cleaner', description: 'CleanSpace: Photo Cleaner 的使用條款，包括訂閱、免費試用、續訂、取消及可接受的使用方式。' },
    fa: { title: 'شرایط و ضوابط — CleanSpace: Photo Cleaner', description: 'شرایط استفاده از CleanSpace: Photo Cleaner، شامل اشتراک‌ها، دوره آزمایشی رایگان، تمدید، لغو و استفاده مجاز.' },
    ur: { title: 'شرائط و ضوابط — CleanSpace: Photo Cleaner', description: 'CleanSpace: Photo Cleaner کے استعمال کی شرائط، بشمول سبسکرپشن، مفت ٹرائل، تجدید، منسوخی اور قابلِ قبول استعمال۔' },
    ckb: { title: 'مەرج و ڕێساکان — CleanSpace: Photo Cleaner', description: 'مەرجەکانی بەکارهێنانی CleanSpace: Photo Cleaner، لەوانە بەشداریکردن، تاقیکردنەوەی بێبەرامبەر، نوێکردنەوە، هەڵوەشاندنەوە و بەکارهێنانی ڕێگەپێدراو.' },
  },
};

export function isSeoPage(path: string): path is SeoPage {
  return path === 'download' || path === 'support' || path === 'privacy' || path === 'terms';
}
