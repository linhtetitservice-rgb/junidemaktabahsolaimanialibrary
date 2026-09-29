export interface Book {
  title: string;
  author?: string;
  deathYear?: string;
  writer?: string;
  tahqeeq?: string;
  publisher?: string;
  edition?: string;
  pubYear?: string;
  volumes?: string;
  folder?: string;
  type?: string;
  lang?: string;
}

export type ReadingStatus = 'want_to_read' | 'reading' | 'completed';

export interface BookProgress {
  id: string; // `${notebookId}::${bookTitle}`
  bookTitle: string;
  author?: string;
  deathYear?: string;
  publisher?: string;
  volumes?: string;
  lang?: string;
  notebookId: string;
  notebookTitle: string;
  notebookIcon?: string;
  notebookCat?: string;
  notebookLink?: string;
  status: ReadingStatus;
  currentVolume?: number;
  totalVolumes?: number;
  lastViewedAt: number; // timestamp in ms
  notes?: string;
  timeSpentSeconds?: number;
}

export interface Notebook {
  id: string;
  icon: string;
  title: string;
  titleLang?: string;
  cat: string;
  libTitle?: string;
  desc?: string;
  fullDesc?: string;
  link: string;
  meta?: Record<string, any>;
  keywords?: string[];
  sources?: {
    primary?: string[];
    secondary?: string[];
  };
  books?: Book[];
  totalSources?: number;
  order?: number;
  visible?: boolean;
  added?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  mode: 'dark' | 'light';
  bg: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  primary: string;
  primaryHover: string;
  accent: string;
  text: string;
  textMuted: string;
  cardBg: string;
}

export type ViewMode = 'grid' | 'grouped' | 'masterBooks';
export type LanguageFilter = 'all' | 'ar' | 'ur' | 'en';
export type SortOption = 'default' | 'title' | 'books-desc' | 'books-asc' | 'cat';
export type AppLanguage = 'en' | 'ar' | 'ur';
