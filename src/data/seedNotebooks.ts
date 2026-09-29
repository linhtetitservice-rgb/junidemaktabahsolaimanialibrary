import { Notebook } from '../types';

export const SEED_NOTEBOOKS: Notebook[] = [
  {
    id: "mslr7cindntv",
    icon: "📝",
    title: "النحو والصرف Arabic Syntax and Morphology",
    titleLang: "ar",
    cat: "Arabic Language & Literature",
    libTitle: "مكتبة النحو والصرف",
    desc: "Classical and comprehensive treatises on Arabic grammar, morpho-phonology, and syntax.",
    fullDesc: "A complete scholarly collection covering Alfiyyah Ibn Malik, Sharh Ibn Aqil, Al-Kafiya, and major commentaries for Arabic linguistic research.",
    link: "https://notebook.google.com/notebook/99535422-1096-48b2-bd2f-2ddf05bdc0ac",
    meta: {},
    keywords: ["Nahw", "Sarf", "Grammar", "Syntax", "Ibn Malik"],
    books: [
      { title: "أبنية الأسماء والأفعال والمصادر", author: "ابن القطاع السعدي", deathYear: "515 هـ", publisher: "دار المعارف", volumes: "1", folder: "النحو والصرف", type: "DOCX", lang: "ar" },
      { title: "أخبار أبي القاسم الزجاجي", author: "ابن خلكان", deathYear: "681 هـ", publisher: "مؤسسة الرسالة", volumes: "1", folder: "النحو والصرف", type: "DOCX", lang: "ar" },
      { title: "أدوات الإعراب", author: "الزجاجي", deathYear: "337 هـ", publisher: "دار الفكر", volumes: "1", folder: "النحو والصرف", type: "DOCX", lang: "ar" },
      { title: "أصول النحو ١ - جامعة المدينة", author: "مجموعة باحثين", deathYear: "معاصر", publisher: "جامعة المدينة", volumes: "1", folder: "النحو والصرف", type: "DOCX", lang: "ar" },
      { title: "أصول النحو ٢ - جامعة المدينة", author: "مجموعة باحثين", deathYear: "معاصر", publisher: "جامعة المدينة", volumes: "1", folder: "النحو والصرف", type: "DOCX", lang: "ar" },
      { title: "ألفية ابن مالك - ت القاسم", author: "ابن مالك الأندلسي", deathYear: "672 هـ", publisher: "طبعة دار الهدى", volumes: "1", folder: "النحو والصرف", type: "DOCX", lang: "ar" }
    ]
  },
  {
    id: "quran-tafsir-hub",
    icon: "📖",
    title: "علوم القرآن والتفسير Quranic Sciences & Exegesis",
    titleLang: "ar",
    cat: "Al-Qur’an",
    libTitle: "مكتبة التفسير وعلوم القرآن",
    desc: "Classical Tafsir compendiums, Asbab al-Nuzul, and analytical Quranic studies.",
    fullDesc: "Masterworks of exegetical literature including Tafsir al-Tabari, Al-Qurtubi, Ibn Kathir, Al-Razi, and principles of Quranic sciences.",
    link: "https://notebook.google.com/notebook/8a427189-9831-41d1-8178-958cfb5058d1",
    keywords: ["Tafsir", "Quran", "Asbab Nuzul", "Qira'at"],
    books: [
      { title: "جامع البيان عن تأويل آي القرآن", author: "ابن جرير الطبري", deathYear: "310 هـ", publisher: "دار هجر", volumes: "24", lang: "ar" },
      { title: "تفسير القرآن العظيم", author: "ابن كثير الدمشقي", deathYear: "774 هـ", publisher: "دار طيبة", volumes: "8", lang: "ar" },
      { title: "الجامع لأحكام القرآن", author: "القرطبي", deathYear: "671 هـ", publisher: "مؤسسة الرسالة", volumes: "20", lang: "ar" },
      { title: "الإتقان في علوم القرآن", author: "جلال الدين السيوطي", deathYear: "911 هـ", publisher: "مجمع الملك فهد", volumes: "4", lang: "ar" },
      { title: "البرهان في علوم القرآن", author: "الزركشي", deathYear: "794 هـ", publisher: "دار التراث", volumes: "4", lang: "ar" }
    ]
  },
  {
    id: "hadith-sciences-hub",
    icon: "📜",
    title: "كتب الحديث ورجاله Hadith Literature & Biographical Evaluation",
    titleLang: "ar",
    cat: "Al-Hadith",
    libTitle: "مكتبة الحديث النبوي",
    desc: "Primary Hadith collections, Mustalah al-Hadith treatises, and narrator biographical evaluations (Rijal).",
    fullDesc: "Sahih al-Bukhari, Sahih Muslim, Sunan compendiums, Tahdhib al-Kamal, and foundational methodology manuals.",
    link: "https://notebook.google.com/notebook/377a0662-7212-429a-8bfe-85243fbfa812",
    keywords: ["Hadith", "Bukhari", "Muslim", "Rijal", "Sanad"],
    books: [
      { title: "صحيح البخاري بشرح فتح الباري", author: "ابن حجر العسقلاني", deathYear: "852 هـ", publisher: "دار السلام", volumes: "13", lang: "ar" },
      { title: "صحيح مسلم بشرح النووي", author: "الإمام النووي", deathYear: "676 هـ", publisher: "دار إحياء التراث العربي", volumes: "18", lang: "ar" },
      { title: "سير أعلام النبلاء", author: "شمس الدين الذهبي", deathYear: "748 هـ", publisher: "مؤسسة الرسالة", volumes: "25", lang: "ar" },
      { title: "مقدمة ابن الصلاح في علوم الحديث", author: "ابن الصلاح الشهرزوري", deathYear: "643 هـ", publisher: "دار الفكر", volumes: "1", lang: "ar" },
      { title: "تهذيب التهذيب", author: "ابن حجر العسقلاني", deathYear: "852 هـ", publisher: "دائرة المعارف العثمانية", volumes: "12", lang: "ar" }
    ]
  },
  {
    id: "fiqh-usul-hub",
    icon: "⚖️",
    title: "الفقه المقارن وأصوله Comparative Jurisprudence & Legal Theory",
    titleLang: "ar",
    cat: "Islamic Fiqh",
    libTitle: "مكتبة الفقه وأصوله",
    desc: "Comprehensive jurisprudential compendiums of the four Sunni legal schools (Madhahib) and Usul al-Fiqh.",
    fullDesc: "Comparative legal analysis, Islamic legal maxims (Qawaid Fiqhiyyah), and classical codifications.",
    link: "https://notebook.google.com/notebook/858004f2-95f8-4a57-b08e-5b1ffea73f73",
    keywords: ["Fiqh", "Usul", "Hanafi", "Shafi'i", "Maliki", "Hanbali"],
    books: [
      { title: "المغني في فقه الإمام أحمد", author: "ابن قدامة المقدسي", deathYear: "620 هـ", publisher: "دار الفكر", volumes: "12", lang: "ar" },
      { title: "رد المحتار على الدر المختار (حاشية ابن عابدين)", author: "ابن عابدين الشامي", deathYear: "1252 هـ", publisher: "دار الكتب العلمية", volumes: "8", lang: "ar" },
      { title: "المجموع شرح المهذب", author: "الإمام النووي", deathYear: "676 هـ", publisher: "دار الفكر", volumes: "20", lang: "ar" },
      { title: "بداية المجتهد ونهاية المقتصد", author: "ابن رشد الحفيد", deathYear: "595 هـ", publisher: "دار المعرفة", volumes: "2", lang: "ar" },
      { title: "الموافقات في أصول الشريعة", author: "أبو إسحاق الشاطبي", deathYear: "790 هـ", publisher: "دار ابن عفان", volumes: "4", lang: "ar" }
    ]
  },
  {
    id: "seerah-history-hub",
    icon: "🏛️",
    title: "السيرة النبوية والتاريخ الإسلامي Prophetic Biography & Islamic History",
    titleLang: "ar",
    cat: "Prophetic Biography",
    libTitle: "مكتبة السيرة والتاريخ",
    desc: "Exhaustive annals of the life of Prophet Muhammad (PBUH) and Islamic chronological chronicles.",
    fullDesc: "From Ibn Hisham, Al-Waqidi, and Tabari to Ibn Kathir's Al-Bidayah wa al-Nihayah.",
    link: "https://notebook.google.com/notebook/56f7cb14-efee-47b2-bdcf-88229b4e7da1",
    keywords: ["Seerah", "History", "Bidayah", "Tarikh", "Prophet"],
    books: [
      { title: "السيرة النبوية لابن هشام", author: "ابن هشام الحميري", deathYear: "218 هـ", publisher: "مصطفى البابي الحلبي", volumes: "4", lang: "ar" },
      { title: "البداية والنهاية", author: "ابن كثير الدمشقي", deathYear: "774 هـ", publisher: "دار هجر", volumes: "21", lang: "ar" },
      { title: "تاريخ الرسل والملوك", author: "ابن جرير الطبري", deathYear: "310 هـ", publisher: "دار المعارف", volumes: "11", lang: "ar" },
      { title: "زاد المعاد في هدي خير العباد", author: "ابن قيم الجوزية", deathYear: "751 هـ", publisher: "مؤسسة الرسالة", volumes: "5", lang: "ar" },
      { title: "الرحيق المختوم", author: "صفي الرحمن المباركفوري", deathYear: "1427 هـ", publisher: "دار الهلال", volumes: "1", lang: "ar" }
    ]
  },
  {
    id: "urdu-dars-nizami-hub",
    icon: "📚",
    title: "درس نظامی و شروحات Dars-e-Nizami Curricula & Urdu Commentaries",
    titleLang: "ur",
    cat: "Dars e Nizami - Books & Commentaries",
    libTitle: "درس نظامی اردو شروحات لائبریری",
    desc: "Complete South Asian madrasa curriculum texts with classical Urdu and Arabic commentaries.",
    fullDesc: "Traditional curriculum treatises on Fiqh, Usul, Mantiq, Nahw, and Hadith with renowned Urdu annotations.",
    link: "https://notebook.google.com/notebook/37a4e698-e7c1-4b13-91b4-17180bc4f783",
    keywords: ["Dars e Nizami", "Urdu", "Sharh", "Madrasa"],
    books: [
      { title: "ہدایہ اولین و آخرین مع اردو شروحات", author: "علامہ مرغینانی", deathYear: "593 هـ", publisher: "مکتبہ بشریٰ", volumes: "4", lang: "ur" },
      { title: "نور الانوار شرح المنار اردو", author: "ملا جیون", deathYear: "1130 هـ", publisher: "مکتبۃ البشریٰ", volumes: "2", lang: "ur" },
      { title: "شرح معانی الآثار للطحاوی مع تعلیقات", author: "امام طحاوی", deathYear: "321 هـ", publisher: "مکتبہ رحمانیہ", volumes: "4", lang: "ur" },
      { title: "قطبی مع میر قطبی شرح شمسیہ", author: "قطب الدین رازی", deathYear: "766 هـ", publisher: "مکتبہ عثمانیہ", volumes: "1", lang: "ur" }
    ]
  }
];
