import type { Lang } from '../../services/i18n';

/**
 * Per-locale SEO copy.
 *
 * Kept out of the runtime translation dictionary on purpose: that dictionary is a
 * ~500 kB lazily-loaded chunk, while these strings have to be readable
 * synchronously the moment a page is rendered (including during prerendering).
 * Three short strings × 21 locales costs almost nothing to ship eagerly.
 *
 * Length budget: title ≤ 60 chars, description ≤ 155 — beyond that Google
 * truncates in the SERP.
 */
export interface SeoCopy {
  /** <title>, og:title, twitter:title */
  title: string;
  /** meta description, og:description, twitter:description */
  description: string;
  /** og:image:alt */
  imageAlt: string;
}

/**
 * Every title leads with the App Store listing name, "CleanSpace: Photo Cleaner",
 * in Latin script for all 21 locales — a visitor searching the store name should
 * find the site, and the name must read identically in both places. The keyword
 * tail after the dash stays localized. Body copy and the wordmark keep the short
 * "CleanSpace".
 */
export const SEO_COPY: Record<Lang, SeoCopy> = {
  en: {
    title: 'CleanSpace: Photo Cleaner — iPhone Storage & Duplicates',
    description:
      'Free up gigabytes on your iPhone. Find duplicate and similar photos, compress videos, and merge duplicate contacts — all processed on-device.',
    imageAlt: 'Smart, private iPhone storage cleaner',
  },
  ar: {
    title: 'CleanSpace: Photo Cleaner — تنظيف الآيفون والصور المكررة',
    description:
      'فرّغ مساحة جهازك بثواني. اكتشف الصور المكررة والمتشابهة، اضغط الفيديوهات، وادمج جهات الاتصال — كل المعالجة تتم على جهازك بدون إنترنت.',
    imageAlt: 'منظّف مساحة ذكي وآمن للآيفون',
  },
  de: {
    title: 'CleanSpace: Photo Cleaner — iPhone Speicher & Duplikate',
    description:
      'Schaffe Gigabytes Platz auf deinem iPhone: doppelte und ähnliche Fotos finden, Videos komprimieren, Kontakte zusammenführen — alles direkt auf dem Gerät.',
    imageAlt: 'Intelligenter, privater Speicherreiniger fürs iPhone',
  },
  es: {
    title: 'CleanSpace: Photo Cleaner — Fotos duplicadas iPhone',
    description:
      'Libera gigabytes en tu iPhone: encuentra fotos duplicadas y similares, comprime vídeos y fusiona contactos repetidos. Todo se procesa en tu dispositivo.',
    imageAlt: 'Limpiador de almacenamiento privado e inteligente para iPhone',
  },
  fr: {
    title: 'CleanSpace: Photo Cleaner — Photos en double iPhone',
    description:
      "Libérez des gigaoctets sur votre iPhone : photos en double et similaires, compression vidéo, fusion des contacts. Tout est traité sur l'appareil.",
    imageAlt: 'Nettoyeur de stockage iPhone intelligent et confidentiel',
  },
  it: {
    title: 'CleanSpace: Photo Cleaner — Foto duplicate su iPhone',
    description:
      'Libera gigabyte sul tuo iPhone: trova foto duplicate e simili, comprimi i video e unisci i contatti doppi. Tutto viene elaborato sul dispositivo.',
    imageAlt: 'Pulizia dello spazio iPhone intelligente e privata',
  },
  nl: {
    title: "CleanSpace: Photo Cleaner — Dubbele foto's iPhone",
    description:
      "Maak gigabytes vrij op je iPhone: vind dubbele en gelijkende foto's, comprimeer video's en voeg dubbele contacten samen. Alles blijft op je toestel.",
    imageAlt: 'Slimme, private opslagopruimer voor iPhone',
  },
  'pt-BR': {
    title: 'CleanSpace: Photo Cleaner — Fotos duplicadas iPhone',
    description:
      'Libere gigabytes no seu iPhone: encontre fotos duplicadas e parecidas, comprima vídeos e mescle contatos repetidos. Tudo processado no seu aparelho.',
    imageAlt: 'Limpador de armazenamento do iPhone inteligente e privado',
  },
  ru: {
    title: 'CleanSpace: Photo Cleaner — дубликаты фото на iPhone',
    description:
      'Освободите гигабайты на iPhone: найдите дубликаты и похожие фото, сожмите видео, объедините контакты. Всё обрабатывается прямо на устройстве.',
    imageAlt: 'Умная и приватная очистка памяти iPhone',
  },
  tr: {
    title: 'CleanSpace: Photo Cleaner — iPhone çift fotoğraf',
    description:
      "iPhone'unuzda gigabaytlarca yer açın: çift ve benzer fotoğrafları bulun, videoları sıkıştırın, yinelenen kişileri birleştirin. Tüm işlem cihazınızda.",
    imageAlt: 'Akıllı ve gizliliğe saygılı iPhone depolama temizleyici',
  },
  ja: {
    title: 'CleanSpace: Photo Cleaner — iPhoneの重複写真を削除',
    description:
      'iPhoneの空き容量を数秒で確保。重複写真や類似写真を検出し、動画を圧縮、重複した連絡先を統合。すべて端末内で処理されます。',
    imageAlt: 'プライバシーに配慮したiPhoneのストレージ整理アプリ',
  },
  ko: {
    title: 'CleanSpace: Photo Cleaner — iPhone 중복 사진 정리',
    description:
      'iPhone에서 기가바이트의 공간을 확보하세요. 중복·유사 사진을 찾고, 비디오를 압축하고, 중복 연락처를 병합합니다. 모든 처리는 기기에서 이루어집니다.',
    imageAlt: '스마트하고 개인정보를 보호하는 iPhone 저장 공간 정리 앱',
  },
  pl: {
    title: 'CleanSpace: Photo Cleaner — duplikaty zdjęć iPhone',
    description:
      'Zwolnij gigabajty na iPhonie: znajdź duplikaty i podobne zdjęcia, kompresuj filmy i scal powielone kontakty. Wszystko odbywa się na urządzeniu.',
    imageAlt: 'Inteligentne i prywatne czyszczenie pamięci iPhone’a',
  },
  vi: {
    title: 'CleanSpace: Photo Cleaner — dọn ảnh trùng iPhone',
    description:
      'Giải phóng hàng gigabyte trên iPhone: tìm ảnh trùng và tương tự, nén video, gộp danh bạ trùng. Mọi thao tác đều được xử lý ngay trên thiết bị.',
    imageAlt: 'Trình dọn dung lượng iPhone thông minh và riêng tư',
  },
  'zh-Hans': {
    title: 'CleanSpace: Photo Cleaner — iPhone 重复照片清理',
    description:
      '快速释放 iPhone 空间：查找重复和相似照片、压缩视频、合并重复联系人。所有处理均在设备本地完成，不上传任何数据。',
    imageAlt: '智能且注重隐私的 iPhone 存储清理工具',
  },
  'zh-Hant': {
    title: 'CleanSpace: Photo Cleaner — iPhone 重複照片清理',
    description:
      '快速釋放 iPhone 空間：找出重複與相似照片、壓縮影片、合併重複聯絡人。所有處理都在裝置上完成，不會上傳任何資料。',
    imageAlt: '聰明且重視隱私的 iPhone 儲存空間清理工具',
  },
  hi: {
    title: 'CleanSpace: Photo Cleaner — iPhone डुप्लिकेट फोटो',
    description:
      'अपने iPhone में गीगाबाइट जगह खाली करें: डुप्लिकेट और मिलती-जुलती फोटो ढूंढें, वीडियो कंप्रेस करें, डुप्लिकेट कॉन्टैक्ट मर्ज करें — सब कुछ डिवाइस पर।',
    imageAlt: 'स्मार्ट और निजी iPhone स्टोरेज क्लीनर',
  },
  id: {
    title: 'CleanSpace: Photo Cleaner — Foto Duplikat iPhone',
    description:
      'Kosongkan gigabyte di iPhone Anda: temukan foto duplikat dan serupa, kompres video, dan gabungkan kontak ganda. Semua diproses langsung di perangkat.',
    imageAlt: 'Pembersih penyimpanan iPhone yang cerdas dan privat',
  },
  fa: {
    title: 'CleanSpace: Photo Cleaner — حذف عکس‌های تکراری آیفون',
    description:
      'چند گیگابایت از فضای آیفون خود را آزاد کنید: یافتن عکس‌های تکراری و مشابه، فشرده‌سازی ویدیو و ادغام مخاطبین تکراری — همه پردازش‌ها روی خود دستگاه.',
    imageAlt: 'پاک‌سازی هوشمند و خصوصی حافظه آیفون',
  },
  ur: {
    title: 'CleanSpace: Photo Cleaner — آئی فون ڈپلیکیٹ تصاویر',
    description:
      'اپنے آئی فون میں گیگا بائٹس جگہ خالی کریں: ڈپلیکیٹ اور ملتی جلتی تصاویر تلاش کریں، ویڈیو کمپریس کریں، اور دہرے رابطے ضم کریں — سب کچھ آپ کے ڈیوائس پر۔',
    imageAlt: 'ذہین اور نجی آئی فون اسٹوریج کلینر',
  },
  ckb: {
    title: 'CleanSpace: Photo Cleaner — وێنە دووبارەکانی ئایفۆن',
    description:
      'چەند گێگابایتێک لە ئایفۆنەکەت ئازاد بکە: دۆزینەوەی وێنە دووبارە و لێکچووەکان، پەستاندنی ڤیدیۆ، و تێکەڵکردنی پەیوەندییە دووبارەکان — هەمووی لەسەر ئامێرەکەت.',
    imageAlt: 'پاککەرەوەی زیرەک و تایبەتی بیرگەی ئایفۆن',
  },
};

/**
 * og:locale values in lang_TERRITORY form. Facebook rejects malformed values —
 * the site previously shipped `ar_AR`, which is not a real locale.
 */
export const OG_LOCALE: Record<Lang, string> = {
  ar: 'ar_JO',
  en: 'en_US',
  ckb: 'ckb_IQ',
  de: 'de_DE',
  es: 'es_ES',
  fa: 'fa_IR',
  fr: 'fr_FR',
  hi: 'hi_IN',
  id: 'id_ID',
  it: 'it_IT',
  ja: 'ja_JP',
  ko: 'ko_KR',
  nl: 'nl_NL',
  pl: 'pl_PL',
  'pt-BR': 'pt_BR',
  ru: 'ru_RU',
  tr: 'tr_TR',
  ur: 'ur_PK',
  vi: 'vi_VN',
  'zh-Hans': 'zh_CN',
  'zh-Hant': 'zh_TW',
};
