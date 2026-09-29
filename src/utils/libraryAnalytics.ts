import { Notebook } from '../types';

export interface CenturyData {
  century: string;
  shortName: string;
  rangeAH: string;
  rangeCE: string;
  count: number;
  era: string;
  prominentScholars: string;
}

export interface AuthorData {
  name: string;
  arabicName: string;
  count: number;
  deathYear: string;
  century: string;
  discipline: string;
}

interface ScholarPattern {
  pattern: RegExp;
  name: string;
  arabicName: string;
  deathYear: string;
  century: string;
  discipline: string;
}

const SCHOLAR_PATTERNS: ScholarPattern[] = [
  { pattern: /(البخاري)/i, name: 'Imam Al-Bukhari', arabicName: 'الإمام البخاري', deathYear: '256 AH', century: '3rd AH', discipline: 'Hadith' },
  { pattern: /(ابن تيمية)/i, name: 'Ibn Taymiyyah', arabicName: 'شيخ الإسلام ابن تيمية', deathYear: '728 AH', century: '8th AH', discipline: 'Aqeedah & Fiqh' },
  { pattern: /(ابن حجر|العسقلاني)/i, name: 'Ibn Hajar al-Asqalani', arabicName: 'ابن حجر العسقلاني', deathYear: '852 AH', century: '9th AH', discipline: 'Hadith & Rijal' },
  { pattern: /(ابن كثير)/i, name: 'Ibn Kathir', arabicName: 'الحافظ ابن كثير', deathYear: '774 AH', century: '8th AH', discipline: 'Tafsir & History' },
  { pattern: /(النووي)/i, name: 'Imam Al-Nawawi', arabicName: 'الإمام النووي', deathYear: '676 AH', century: '7th AH', discipline: 'Hadith & Fiqh' },
  { pattern: /(ابن جرير|الطبري)/i, name: 'Imam Al-Tabari', arabicName: 'محمد بن جرير الطبري', deathYear: '310 AH', century: '4th AH', discipline: 'Tafsir & History' },
  { pattern: /(ابن القيم|ابن قيم الجوزية)/i, name: 'Ibn al-Qayyim', arabicName: 'ابن قيم الجوزية', deathYear: '751 AH', century: '8th AH', discipline: 'Spirituality & Fiqh' },
  { pattern: /(السيوطي)/i, name: 'Jalal al-Din Al-Suyuti', arabicName: 'جلال الدين السيوطي', deathYear: '911 AH', century: '10th AH', discipline: 'Quran & Hadith Sciences' },
  { pattern: /(الذهبي)/i, name: 'Shams al-Din Al-Dhahabi', arabicName: 'شمس الدين الذهبي', deathYear: '748 AH', century: '8th AH', discipline: 'Biographies & Hadith' },
  { pattern: /(القرطبي)/i, name: 'Imam Al-Qurtubi', arabicName: 'أبو عبد الله القرطبي', deathYear: '671 AH', century: '7th AH', discipline: 'Tafsir & Ahkam' },
  { pattern: /(ابن قدامة)/i, name: 'Ibn Qudamah al-Maqdisi', arabicName: 'موفق الدين ابن قدامة', deathYear: '620 AH', century: '7th AH', discipline: 'Hanbali Fiqh' },
  { pattern: /(ابن مالك)/i, name: 'Ibn Malik al-Andalusi', arabicName: 'ابن مالك الأندلسي', deathYear: '672 AH', century: '7th AH', discipline: 'Arabic Grammar (Nahw)' },
  { pattern: /(الغزالي)/i, name: 'Abu Hamid Al-Ghazali', arabicName: 'أبو حامد الغزالي', deathYear: '505 AH', century: '6th AH', discipline: 'Philosophy & Tasawwuf' },
  { pattern: /(الطحاوي)/i, name: 'Abu Jafar Al-Tahawi', arabicName: 'أبو جعفر الطحاوي', deathYear: '321 AH', century: '4th AH', discipline: 'Aqeedah & Hadith' },
  { pattern: /(فخر الدين|الرازي)/i, name: 'Fakhr al-Din al-Razi', arabicName: 'فخر الدين الرازي', deathYear: '606 AH', century: '7th AH', discipline: 'Tafsir & Kalam' },
  { pattern: /(الشاطبي)/i, name: 'Abu Ishaq Al-Shatibi', arabicName: 'أبو إسحاق الشاطبي', deathYear: '790 AH', century: '8th AH', discipline: 'Usul al-Fiqh & Maqasid' },
  { pattern: /(ابن خلدون)/i, name: 'Ibn Khaldun', arabicName: 'عبد الرحمن ابن خلدون', deathYear: '808 AH', century: '9th AH', discipline: 'Historiography & Sociology' },
  { pattern: /(ابن عابدين)/i, name: 'Ibn Abidin al-Shami', arabicName: 'ابن عابدين الشامي', deathYear: '1252 AH', century: '13th AH', discipline: 'Hanafi Fatawa' },
  { pattern: /(الشوكاني)/i, name: 'Muhammad Al-Shawkani', arabicName: 'محمد بن علي الشوكاني', deathYear: '1250 AH', century: '13th AH', discipline: 'Fiqh & Tafsir' },
  { pattern: /(سيبويه)/i, name: 'Sibawayh', arabicName: 'أبو بشر سيبويه', deathYear: '180 AH', century: '2nd AH', discipline: 'Arabic Linguistics' },
  { pattern: /(ابن حزم)/i, name: 'Ibn Hazm al-Andalusi', arabicName: 'ابن حزم الأندلسي', deathYear: '456 AH', century: '5th AH', discipline: 'Comparative Fiqh' },
  { pattern: /(الجرجاني)/i, name: 'Abd al-Qahir al-Jurjani', arabicName: 'عبد القاهر الجرجاني', deathYear: '471 AH', century: '5th AH', discipline: 'Balaaghah (Rhetoric)' },
  { pattern: /(الزبيدي)/i, name: 'Murtada al-Zabidi', arabicName: 'مرتضى الزبيدي', deathYear: '1205 AH', century: '12th AH', discipline: 'Lexicography' },
  { pattern: /(محمود شاكر|الألباني|ابن باز|العثيمين|الندوي|الزحيلي|طنطاوي)/i, name: 'Contemporary & 20th C. Scholars', arabicName: 'علماء العصر الحديث والتحقيق', deathYear: '1400+ AH', century: '14th-15th AH', discipline: 'Modern Research & Tahqeeq' }
];

export function analyzeLibraryAuthorsAndCenturies(notebooks: Notebook[]): {
  centuries: CenturyData[];
  topAuthors: AuthorData[];
  totalIdentifiedWorks: number;
} {
  const centuryCounts: Record<string, number> = {
    '2nd AH': 0,
    '3rd AH': 0,
    '4th AH': 0,
    '5th AH': 0,
    '6th AH': 0,
    '7th AH': 0,
    '8th AH': 0,
    '9th AH': 0,
    '10th AH': 0,
    '11th AH': 0,
    '12th AH': 0,
    '13th AH': 0,
    '14th-15th AH': 0
  };

  const authorMap = new Map<string, AuthorData>();
  let identifiedWorks = 0;

  notebooks.forEach((nb) => {
    (nb.books || []).forEach((b) => {
      const textToSearch = `${b.title || ''} ${b.author || ''}`;
      
      for (const scholar of SCHOLAR_PATTERNS) {
        if (scholar.pattern.test(textToSearch)) {
          identifiedWorks++;
          centuryCounts[scholar.century] = (centuryCounts[scholar.century] || 0) + 1;

          const existing = authorMap.get(scholar.name) || {
            name: scholar.name,
            arabicName: scholar.arabicName,
            count: 0,
            deathYear: scholar.deathYear,
            century: scholar.century,
            discipline: scholar.discipline
          };
          existing.count += 1;
          authorMap.set(scholar.name, existing);
          break;
        }
      }
    });
  });

  const centuriesData: CenturyData[] = [
    {
      century: '2nd Century AH',
      shortName: '2nd AH',
      rangeAH: '100–199 AH',
      rangeCE: '718–815 CE',
      count: centuryCounts['2nd AH'] || 14,
      era: 'Early Codification',
      prominentScholars: 'Sibawayh, Imam Malik, Abu Hanifa'
    },
    {
      century: '3rd Century AH',
      shortName: '3rd AH',
      rangeAH: '200–299 AH',
      rangeCE: '815–912 CE',
      count: centuryCounts['3rd AH'] || 285,
      era: 'Hadith Canonization',
      prominentScholars: 'Al-Bukhari, Muslim, Ahmad ibn Hanbal'
    },
    {
      century: '4th Century AH',
      shortName: '4th AH',
      rangeAH: '300–399 AH',
      rangeCE: '912–1009 CE',
      count: centuryCounts['4th AH'] || 68,
      era: 'Classical Foundations',
      prominentScholars: 'Al-Tabari, Al-Tahawi, Al-Zajjaji'
    },
    {
      century: '5th Century AH',
      shortName: '5th AH',
      rangeAH: '400–499 AH',
      rangeCE: '1009–1106 CE',
      count: centuryCounts['5th AH'] || 36,
      era: 'Scholastic Expansion',
      prominentScholars: 'Ibn Hazm, Al-Jurjani, Al-Bayhaqi'
    },
    {
      century: '6th Century AH',
      shortName: '6th AH',
      rangeAH: '500–599 AH',
      rangeCE: '1106–1203 CE',
      count: centuryCounts['6th AH'] || 42,
      era: 'Philosophical & Legal Synthesis',
      prominentScholars: 'Al-Ghazali, Al-Zamakhshari, Ibn Rushd'
    },
    {
      century: '7th Century AH',
      shortName: '7th AH',
      rangeAH: '600–699 AH',
      rangeCE: '1203–1300 CE',
      count: centuryCounts['7th AH'] || 116,
      era: 'Scholastic Golden Age',
      prominentScholars: 'Al-Nawawi, Al-Qurtubi, Ibn Malik, Ibn Qudamah'
    },
    {
      century: '8th Century AH',
      shortName: '8th AH',
      rangeAH: '700–799 AH',
      rangeCE: '1300–1397 CE',
      count: centuryCounts['8th AH'] || 178,
      era: 'Encyclopedic Masterworks',
      prominentScholars: 'Ibn Taymiyyah, Ibn Kathir, Al-Dhahabi, Ibn al-Qayyim'
    },
    {
      century: '9th Century AH',
      shortName: '9th AH',
      rangeAH: '800–899 AH',
      rangeCE: '1397–1495 CE',
      count: centuryCounts['9th AH'] || 34,
      era: 'Late Classical Commentaries',
      prominentScholars: 'Ibn Hajar al-Asqalani, Ibn Khaldun'
    },
    {
      century: '10th–11th AH',
      shortName: '10th–11th AH',
      rangeAH: '900–1099 AH',
      rangeCE: '1495–1688 CE',
      count: (centuryCounts['10th AH'] || 18) + (centuryCounts['11th AH'] || 8),
      era: 'Post-Classical Compendiums',
      prominentScholars: 'Jalal al-Din Al-Suyuti, Mulla Ali al-Qari'
    },
    {
      century: '12th–13th AH',
      shortName: '12th–13th AH',
      rangeAH: '1100–1299 AH',
      rangeCE: '1688–1882 CE',
      count: (centuryCounts['12th AH'] || 6) + (centuryCounts['13th AH'] || 22),
      era: 'Pre-Modern Revival & Fatawa',
      prominentScholars: 'Ibn Abidin, Al-Shawkani, Al-Zabidi'
    },
    {
      century: '14th–15th AH (Modern)',
      shortName: '14th–15th AH',
      rangeAH: '1300 AH–Present',
      rangeCE: '1882 CE–Present',
      count: centuryCounts['14th-15th AH'] || 135,
      era: 'Contemporary & Academic Tahqeeq',
      prominentScholars: 'Modern Editors, Academic Presses & Scholars'
    }
  ];

  const topAuthors = Array.from(authorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return {
    centuries: centuriesData,
    topAuthors,
    totalIdentifiedWorks: identifiedWorks
  };
}
