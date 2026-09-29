import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppLanguage } from '../types';

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', dir: 'rtl', flag: '🇵🇰' }
];

export const TRANSLATIONS = {
  en: {
    // Brand & Top Navigation
    brandTitle: 'مکتبہ سلیمانیہ',
    brandBadge: 'سلیمانیہ',
    brandSubtitle: 'Maktaba Sulaimaniyah • Digital Islamic Library & AI Hubs',
    searchPlaceholder: 'Search notebooks, books, authors, topics...',
    clearSearch: 'Clear search',
    viewHubs: 'Hubs',
    viewCategories: 'Categories',
    viewAllBooks: 'All Books',
    favoritesTitle: 'Saved Notebooks & Books',
    themePickerTitle: 'Change Color Theme',
    selectTheme: 'Select Theme',
    howItWorks: 'How It Works & Guide',
    addHub: 'Add Hub',
    languageSwitcher: 'Language',

    // Stats Banner & KPIs
    bannerBadge: 'Interactive Knowledge Hub',
    bannerTitle: 'مکتبہ سلیمانیہ - Digital Islamic Library & AI Hubs',
    bannerSubtitle: 'Unified gateway to 84 specialized NotebookLM AI research knowledge bases and 14,700+ classical and contemporary Islamic volumes.',
    showCharts: 'Show Authors & Centuries Charts',
    hideCharts: 'Hide Visual Charts',
    browseAllBooksBtn: 'Browse All {count} Books',
    kpiHubsTitle: 'Research Hubs',
    kpiHubsDesc: 'Thematic Knowledge Bases',
    kpiBooksTitle: 'Classical & Contemporary Volumes',
    kpiBooksDesc: 'Indexed Searchable Works',
    kpiDisciplinesTitle: 'Scholastic Disciplines',
    kpiDisciplinesDesc: 'Across Islamic Sciences',
    kpiLanguagesTitle: 'Language Distribution',
    kpiArabicPill: 'Arabic',
    kpiUrduPill: 'Urdu',

    // Visual Analytics
    analyticsTitle: 'Collection Analytics & Chronological Distribution',
    analyticsSubtitle: 'Visualizing Islamic intellectual history across 14 centuries and leading master authors',
    rechartsEngine: 'Recharts Engine',
    centuriesTab: 'Centuries Timeline (1400+ Yrs)',
    authorsTab: 'Top Master Authors',
    spanHeritage: 'Span of Intellectual Heritage',
    spanHeritageVal: '2nd AH → 15th AH (14 Centuries)',
    peakHadithEpoch: 'Peak Hadith Epoch',
    peakHadithEpochVal: '3rd Century AH (Canonization)',
    peakEncyclopedicEra: 'Peak Encyclopedic Era',
    peakEncyclopedicVal: '8th Century AH (Ibn Taymiyyah/Kathir)',
    contemporaryTahqeeq: 'Contemporary Tahqeeq',
    contemporaryTahqeeqVal: '14th–15th AH (Modern Editions)',
    centuriesHint: '💡 Hover over any bar to view the historical era, Gregorian date correlation, volume counts, and prominent scholars of that century.',
    authorsHint: '💡 Hover over any scholar to view their Arabic title, era, death year (وفات), and primary academic discipline.',
    topHadithMaster: 'Most Represented Hadith Master',
    topTheologian: 'Most Represented Jurist/Theologian',
    topCommentators: 'Key Commentators & Exegetes',

    // Category Pills
    allDisciplines: 'All Disciplines',
    notebooksCountSuffix: 'Hubs',

    // Results Bar & Controls
    notebooksAvailable: '{count} Notebooks Available',
    singleNotebookAvailable: '1 Notebook Available',
    matchingQuery: 'Matching "{query}"',
    loadingCatalog: 'Loading full catalog...',
    filterAllLangs: 'All Langs',
    filterArabic: 'Arabic',
    filterUrdu: 'Urdu',
    sortDefault: 'Default Order',
    sortAlphabetical: 'Alphabetical (A-Z)',
    sortMostBooks: 'Most Books First',

    // Notebook Card
    openNotebookLM: 'Open in NotebookLM',
    exploreBooks: 'Explore Books',
    booksCount: 'Books',
    copyLink: 'Copy NotebookLM Link',
    linkCopied: 'Copied!',
    bookmark: 'Bookmark Notebook',
    bookmarked: 'Bookmarked',

    // Empty States
    noNotebooksTitle: 'No NotebookLM Hubs Found',
    noNotebooksDesc: 'Try adjusting your search query or reset category filter.',
    resetFiltersBtn: 'Reset Filters',

    // Footer
    footerTitle: 'مکتبہ سلیمانیہ',
    footerDesc: 'Digital Islamic Library & Research Knowledge Base',
    howItWasBuiltFooter: 'How It Was Built (System Guide)',
    poweredByGoogle: 'Powered by Google NotebookLM',

    // Favorites Drawer
    favDrawerTitle: 'Saved Notebooks',
    favDrawerEmptyTitle: 'No saved notebooks yet',
    favDrawerEmptyDesc: 'Click the bookmark icon on any notebook card to save it for quick access.',
    favRemove: 'Remove',

    // Book Explorer Modal
    modalVolumesCount: '{count} Volumes Indexed',
    modalSearchPlaceholder: 'Filter books inside this notebook...',
    modalNoBooksMatch: 'No books match your filter',
    modalCitationCopy: 'Copy Citation',
    modalClose: 'Close',
    readingTimer: 'Reading Timer',
    sessionDuration: 'Session',
    totalTimeExplored: 'Total Explored',
    timerActive: 'Tracking',
    timerPaused: 'Paused',
    timerPause: 'Pause Timer',
    timerResume: 'Resume Timer',
    timerReset: 'Reset',
    estReadingTime: 'Est. Read Time',
    estReadingTimeBadge: 'Est. Read Time: {time}',
    notebookEstTotal: 'Est. Total Study: {time}',
    trackingBookFocus: 'Tracking book',

    // Reading Progress & Recently Viewed
    recentlyViewedTitle: 'Recently Viewed & Reading Progress',
    recentlyViewedSubtitle: 'Quickly resume reading and explore your active study volumes',
    recentlyViewedBadge: 'Reading Progress',
    clearRecent: 'Clear All',
    noRecentlyViewed: 'No recently viewed books yet',
    noRecentlyViewedDesc: 'Explore volumes inside any notebook to track reading progress and quickly pick up where you left off.',
    readingStatusWantToRead: 'Want to Read',
    readingStatusReading: 'Reading',
    readingStatusCompleted: 'Completed',
    readingVolumeProgress: 'Vol {current} of {total}',
    trackReadingBtn: 'Track Reading',
    removeRecentBook: 'Remove',
    resumeReading: 'Explore in Hub',
    readingFilterAll: 'All',
    timeJustNow: 'Just now',
    timeMinutesAgo: '{min}m ago',
    timeHoursAgo: '{hours}h ago',
    timeDaysAgo: '{days}d ago'
  },
  ar: {
    // Brand & Top Navigation
    brandTitle: 'المكتبة السليمانية',
    brandBadge: 'السليمانية',
    brandSubtitle: 'المكتبة الإسلامية الرقمية وقواعد المعرفة الذكية',
    searchPlaceholder: 'ابحث في الدفاتر، الكتب، المؤلفين، الموضوعات...',
    clearSearch: 'مسح البحث',
    viewHubs: 'المجموعات',
    viewCategories: 'التصنيفات',
    viewAllBooks: 'جميع الكتب',
    favoritesTitle: 'الدفاتر والكتب المحفوظة',
    themePickerTitle: 'تغيير المظهر واللون',
    selectTheme: 'اختر المظهر',
    howItWorks: 'دليل البناء والتشغيل',
    addHub: 'إضافة دفتر',
    languageSwitcher: 'اللغة',

    // Stats Banner & KPIs
    bannerBadge: 'بوابة المعرفة التفاعلية',
    bannerTitle: 'المكتبة السليمانية الرقمية وقواعد بحث الذكاء الاصطناعي',
    bannerSubtitle: 'البوابة الموحدة لـ 84 قاعدة معرفية متخصصة وأكثر من 14,700 مجلد ومصنف من أمهات كتب التراث الإسلامي.',
    showCharts: 'عرض الرسوم البيانية للمؤلفين والقرون',
    hideCharts: 'إخفاء الرسوم البيانية',
    browseAllBooksBtn: 'تصفح جميع الكتب ({count})',
    kpiHubsTitle: 'دفاتر البحث العلمي',
    kpiHubsDesc: 'قواعد معرفية موضوعية',
    kpiBooksTitle: 'المجلدات والمصنفات التراثية',
    kpiBooksDesc: 'أعمال مفهرسة وقابلة للبحث',
    kpiDisciplinesTitle: 'العلوم الشرعية واللغوية',
    kpiDisciplinesDesc: 'في مختلف فروع العلم',
    kpiLanguagesTitle: 'توزيع اللغات',
    kpiArabicPill: 'العربية',
    kpiUrduPill: 'الأردية',

    // Visual Analytics
    analyticsTitle: 'تحليلات المكتبة والتوزيع الزمني عبر القرون',
    analyticsSubtitle: 'تجسيد التاريخ الفكري الإسلامي عبر 14 قرناً وأبرز الأئمة والمصنفين',
    rechartsEngine: 'محرك Recharts البياني',
    centuriesTab: 'الجدول الزمني للقرون (14 قرناً)',
    authorsTab: 'كبار أئمة ومصنفي التراث',
    spanHeritage: 'الامتداد الزمني للتراث الفكري',
    spanHeritageVal: 'القرن 2 هـ ← القرن 15 هـ (14 قرناً)',
    peakHadithEpoch: 'ذروة عصر تدوين الحديث',
    peakHadithEpochVal: 'القرن الثالث الهجري (التصنيف والتدوين)',
    peakEncyclopedicEra: 'ذروة الموسوعات الجامعة',
    peakEncyclopedicVal: 'القرن الثامن الهجري (ابن تيمية/ابن كثير)',
    contemporaryTahqeeq: 'التحقيق والمعاصرة',
    contemporaryTahqeeqVal: 'القرنان 14 و15 هـ (الطبعات المحققة الحديثة)',
    centuriesHint: '💡 مرر المؤشر فوق أي عمود لعرض الحقبة التاريخية، والتأريخ الميلادي المقابل، وعدد الكتب، وأبرز أعلام ذلك القرن.',
    authorsHint: '💡 مرر المؤشر فوق أي إمام لعرض لقبه، وعصره، وسنة وفاته، ومجاله العلمي الرئيس.',
    topHadithMaster: 'أكثر أئمة الحديث تمثيلاً',
    topTheologian: 'أبرز الأئمة في الفقه والاعتقاد',
    topCommentators: 'كبار الشراح والمفسرين',

    // Category Pills
    allDisciplines: 'جميع العلوم التخصصية',
    notebooksCountSuffix: 'دفاتر',

    // Results Bar & Controls
    notebooksAvailable: '{count} دفتراً بحثياً متاحاً',
    singleNotebookAvailable: 'دفتر بحثي واحد متاح',
    matchingQuery: 'نتائج البحث عن "{query}"',
    loadingCatalog: 'جاري تحميل الفهرس الكامل...',
    filterAllLangs: 'جميع اللغات',
    filterArabic: 'العربية',
    filterUrdu: 'الأردية',
    sortDefault: 'الترتيب الافتراضي',
    sortAlphabetical: 'أبجدياً (أ-ي)',
    sortMostBooks: 'الأكثر كتباً أولاً',

    // Notebook Card
    openNotebookLM: 'فتح في NotebookLM',
    exploreBooks: 'استعراض الكتب',
    booksCount: 'كتاباً',
    copyLink: 'نسخ رابط NotebookLM',
    linkCopied: 'تم النسخ!',
    bookmark: 'حفظ الدفتر في المفضلة',
    bookmarked: 'محفوظ',

    // Empty States
    noNotebooksTitle: 'لم يتم العثور على دفاتر بحثية',
    noNotebooksDesc: 'يرجى تجربة كلمات بحث أخرى أو إلغاء تحديد التصنيف الحالي.',
    resetFiltersBtn: 'إعادة ضبط عوامل التصفية',

    // Footer
    footerTitle: 'المكتبة السليمانية',
    footerDesc: 'المكتبة الرقمية الإسلامية وقواعد البيانات البحثية الموثقة',
    howItWasBuiltFooter: 'كيف تم بناء هذا النظام (دليل البناء)',
    poweredByGoogle: 'مدعوم بتقنية Google NotebookLM',

    // Favorites Drawer
    favDrawerTitle: 'الدفاتر المحفوظة',
    favDrawerEmptyTitle: 'لا توجد دفاتر محفوظة حتى الآن',
    favDrawerEmptyDesc: 'انقر على أيقونة الإشارة المرجعية على أي دفتر لحفظه والوصول إليه سريعاً.',
    favRemove: 'إزالة',

    // Book Explorer Modal
    modalVolumesCount: '{count} مجلداً مفهرساً',
    modalSearchPlaceholder: 'تصفية وبحث الكتب داخل هذا الدفتر...',
    modalNoBooksMatch: 'لا توجد كتب تطابق معايير البحث',
    modalCitationCopy: 'نسخ الإحالة التوثيقية',
    modalClose: 'إغلاق',
    readingTimer: 'مؤقت القراءة',
    sessionDuration: 'الجلسة',
    totalTimeExplored: 'إجمالي الاستكشاف',
    timerActive: 'جاري التتبع',
    timerPaused: 'متوقف مؤقتاً',
    timerPause: 'إيقاف مؤقت',
    timerResume: 'استئناف',
    timerReset: 'إعادة ضبط',
    estReadingTime: 'الوقت المقدر',
    estReadingTimeBadge: 'الوقت المقدر: {time}',
    notebookEstTotal: 'إجمالي وقت الدراسة المقدر: {time}',
    trackingBookFocus: 'متابعة الكتاب',

    // Reading Progress & Recently Viewed
    recentlyViewedTitle: 'المتصفحة حديثاً ومتابعة القراءة',
    recentlyViewedSubtitle: 'استأنف القراءة بسهولة وتصفح مجلداتك الدراسية النشطة',
    recentlyViewedBadge: 'متابعة القراءة',
    clearRecent: 'مسح السجل',
    noRecentlyViewed: 'لا توجد كتب متصفحة مؤخراً',
    noRecentlyViewedDesc: 'تصفح المجلدات داخل أي قاعدة معرفية لتسجيل تقدم قراءتك والعودة إليها بسهولة.',
    readingStatusWantToRead: 'أرغب بقراءته',
    readingStatusReading: 'قيد القراءة',
    readingStatusCompleted: 'مكتمل',
    readingVolumeProgress: 'مجلد {current} من {total}',
    trackReadingBtn: 'متابعة القراءة',
    removeRecentBook: 'إزالة',
    resumeReading: 'استكشاف في القاعدة',
    readingFilterAll: 'الكل',
    timeJustNow: 'الآن',
    timeMinutesAgo: 'منذ {min} د',
    timeHoursAgo: 'منذ {hours} س',
    timeDaysAgo: 'منذ {days} يوم'
  },
  ur: {
    // Brand & Top Navigation
    brandTitle: 'مکتبہ سلیمانیہ',
    brandBadge: 'سلیمانیہ',
    brandSubtitle: 'اسلامی ڈیجیٹل لائبریری اور اسمارٹ نالج بیسز',
    searchPlaceholder: 'نوٹ بکس، کتب، مصنفین، موضوعات تلاش کریں...',
    clearSearch: 'تلاش صاف کریں',
    viewHubs: 'ہبس',
    viewCategories: 'اقسام',
    viewAllBooks: 'تمام کتب',
    favoritesTitle: 'محفوظ شدہ نوٹ بکس اور کتب',
    themePickerTitle: 'تھیم کا رنگ تبدیل کریں',
    selectTheme: 'تھیم منتخب کریں',
    howItWorks: 'سسٹم رہنمائی اور طریقہ کار',
    addHub: 'نیا ہب شامل کریں',
    languageSwitcher: 'زبان',

    // Stats Banner & KPIs
    bannerBadge: 'انٹرایکٹو علمی پورٹل',
    bannerTitle: 'مکتبہ سلیمانیہ ڈیجیٹل لائبریری اور اے آئی ریسرچ ہبس',
    bannerSubtitle: '84 مخصوص نوٹ بک ایل ایم نالج بیسز اور 14,700 سے زائد امہات الکتب اور کلاسیکی مصنفات کا جامع ذخیرہ۔',
    showCharts: 'مصنفین اور صدیوں کے چارٹس دیکھیں',
    hideCharts: 'چارٹس چھپائیں',
    browseAllBooksBtn: 'تمام {count} کتب دیکھیں',
    kpiHubsTitle: 'تحقیقی نوٹ بکس',
    kpiHubsDesc: 'موضوعاتی نالج بیسز',
    kpiBooksTitle: 'کلاسیکی و معاصر مجلدات',
    kpiBooksDesc: 'فہرست شدہ قابل تلاش کتب',
    kpiDisciplinesTitle: 'علمی شعبہ جات',
    kpiDisciplinesDesc: 'تمام علوم شریعت و لغت میں',
    kpiLanguagesTitle: 'زبانوں کی تقسیم',
    kpiArabicPill: 'عربی',
    kpiUrduPill: 'اردو',

    // Visual Analytics
    analyticsTitle: 'لائبریری تجزیات اور صدیوں کی زمانی تقسیم',
    analyticsSubtitle: '14 صدیوں کی اسلامی علمی تاریخ اور جلیل القدر مصنفین کا بصری تجزیہ',
    rechartsEngine: 'Recharts چارٹ انجن',
    centuriesTab: 'صدیوں کی ٹائم لائن (1400+ سال)',
    authorsTab: 'نمایاں مصنفین و ائمہ',
    spanHeritage: 'علمی ورثے کا زمانی تسلسل',
    spanHeritageVal: 'دوسری صدی ہجری ← پندرھویں صدی ہجری (14 صدیاں)',
    peakHadithEpoch: 'تدوین حدیث کا سنہری دور',
    peakHadithEpochVal: 'تیسری صدی ہجری (تدوین و تصنیف)',
    peakEncyclopedicEra: 'جامع انسائیکلوپیڈیا کا دور',
    peakEncyclopedicVal: 'آٹھویں صدی ہجری (ابن تیمیہ / ابن کثیر)',
    contemporaryTahqeeq: 'جدید تحقیق و اشاعت',
    contemporaryTahqeeqVal: '14ویں اور 15ویں صدی ہجری (جدید محقق نسخے)',
    centuriesHint: '💡 صدی، عیسوی سن، کتب کی تعداد اور نمایاں اکابرین دیکھنے کے لیے کسی بھی بار پر ماؤس رکھیں۔',
    authorsHint: '💡 مصنف کا عربی لقب، عہد، سنہ وفات اور اہم علمی شعبہ دیکھنے کے لیے ماؤس رکھیں۔',
    topHadithMaster: 'سب سے زیادہ پیش کردہ امام حدیث',
    topTheologian: 'فقہ و عقائد کے جلیل القدر امام',
    topCommentators: 'اہم شراح و مفسرین',

    // Category Pills
    allDisciplines: 'تمام علمی شعبے',
    notebooksCountSuffix: 'ہبس',

    // Results Bar & Controls
    notebooksAvailable: '{count} تحقیقی نوٹ بکس دستیاب ہیں',
    singleNotebookAvailable: '1 نوٹ بک دستیاب ہے',
    matchingQuery: '"{query}" کے نتائج',
    loadingCatalog: 'مکمل کیٹلاگ لوڈ ہو رہا ہے...',
    filterAllLangs: 'تمام زبانیں',
    filterArabic: 'عربی',
    filterUrdu: 'اردو',
    sortDefault: 'معمول کی ترتیب',
    sortAlphabetical: 'حروف تہجی کے لحاظ سے',
    sortMostBooks: 'زیادہ کتب پہلے',

    // Notebook Card
    openNotebookLM: 'NotebookLM میں کھولیں',
    exploreBooks: 'کتب ملاحظہ کریں',
    booksCount: 'کتب',
    copyLink: 'NotebookLM لنک کاپی کریں',
    linkCopied: 'کاپی ہو گیا!',
    bookmark: 'نوٹ بک محفوظ کریں',
    bookmarked: 'محفوظ ہے',

    // Empty States
    noNotebooksTitle: 'کوئی ریسرچ ہب نہیں ملا',
    noNotebooksDesc: 'براہ کرم تلاش کا لفظ تبدیل کریں یا کیٹیگری فلٹر ختم کریں۔',
    resetFiltersBtn: 'فلٹرز دوبارہ ترتیب دیں',

    // Footer
    footerTitle: 'مکتبہ سلیمانیہ',
    footerDesc: 'اسلامی ڈیجیٹل لائبریری اور تحقیقی ذخیرہ علم',
    howItWasBuiltFooter: 'یہ سسٹم کیسے بنایا گیا (رہنمائی)',
    poweredByGoogle: 'گوگل نوٹ بک ایل ایم کے تعاون سے',

    // Favorites Drawer
    favDrawerTitle: 'محفوظ شدہ نوٹ بکس',
    favDrawerEmptyTitle: 'ابھی تک کوئی نوٹ بک محفوظ نہیں کی گئی',
    favDrawerEmptyDesc: 'فوری رسائی کے لیے کسی بھی نوٹ بک پر بک مارک کا آئیکن دبائیں۔',
    favRemove: 'حذف کریں',

    // Book Explorer Modal
    modalVolumesCount: '{count} فہرست شدہ مجلدات',
    modalSearchPlaceholder: 'اس نوٹ بک کے اندر کتب تلاش کریں...',
    modalNoBooksMatch: 'تلاش کے مطابق کوئی کتاب نہیں ملی',
    modalCitationCopy: 'حوالہ کاپی کریں',
    modalClose: 'بند کریں',
    readingTimer: 'مطالعہ کا ٹائمر',
    sessionDuration: 'نشست',
    totalTimeExplored: 'کل مطالعہ',
    timerActive: 'جاری ہے',
    timerPaused: 'روکا ہوا',
    timerPause: 'ٹائمر روکیں',
    timerResume: 'دوبارہ شروع کریں',
    timerReset: 'ری سیٹ',
    estReadingTime: 'تخمینہ وقت',
    estReadingTimeBadge: 'تخمینہ وقت: {time}',
    notebookEstTotal: 'مجموعی مطالعہ کا تخمینہ وقت: {time}',
    trackingBookFocus: 'کتاب کا جائزہ',

    // Reading Progress & Recently Viewed
    recentlyViewedTitle: 'حال ہی میں دیکھی گئی کتب اور پیش رفت',
    recentlyViewedSubtitle: 'اپنی فعال مطالعہ شدہ کتب اور علمی پیش رفت تک فوری رسائی حاصل کریں',
    recentlyViewedBadge: 'مطالعہ پیش رفت',
    clearRecent: 'سجل صاف کریں',
    noRecentlyViewed: 'ابھی تک کوئی کتاب نہیں دیکھی گئی',
    noRecentlyViewedDesc: 'کسی بھی ریسرچ ہب کو کھولیں، کتب دیکھیں اور اپنی پڑھائی کی پیش رفت نوٹ کریں۔',
    readingStatusWantToRead: 'پڑھنا ہے',
    readingStatusReading: 'زیر مطالعہ',
    readingStatusCompleted: 'مکمل شدہ',
    readingVolumeProgress: 'مجلد {current} از {total}',
    trackReadingBtn: 'مطالعہ ٹریک کریں',
    removeRecentBook: 'ہٹائیں',
    resumeReading: 'ہب میں ملاحظہ کریں',
    readingFilterAll: 'تمام',
    timeJustNow: 'ابھی',
    timeMinutesAgo: '{min} منٹ پہلے',
    timeHoursAgo: '{hours} گھنٹے پہلے',
    timeDaysAgo: '{days} دن پہلے'
  }
};

export type TranslationKey = keyof typeof TRANSLATIONS.en;

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  fontClass: string;
  currentOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('alturath_ui_lang');
      if (saved === 'ar' || saved === 'ur' || saved === 'en') {
        return saved;
      }
    } catch (e) {
      console.warn('Could not read language from localStorage:', e);
    }
    return 'en';
  });

  const isRTL = language === 'ar' || language === 'ur';
  const dir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';

  const fontClass = language === 'ar' 
    ? 'font-arabic' 
    : language === 'ur' 
    ? 'font-urdu' 
    : 'font-sans-custom';

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    // Update HTML root attributes for complete browser accessibility & direction support
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('alturath_ui_lang', lang);
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
    }
  };

  const t = (key: TranslationKey, replacements?: Record<string, string | number>): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = (langDict as any)[key] || (TRANSLATIONS.en as any)[key] || key;

    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
        dir,
        fontClass,
        currentOption
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
