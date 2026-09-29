import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Sparkles,
  Filter
} from 'lucide-react';
import { Notebook, Book, ThemeConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MasterBooksViewProps {
  notebooks: Notebook[];
  currentTheme: ThemeConfig;
  onExploreNotebook: (nb: Notebook, bookTitle?: string) => void;
}

interface FlattenedBook extends Book {
  notebookId: string;
  notebookTitle: string;
  notebookIcon: string;
  notebookCat: string;
  notebookLink: string;
}

export const MasterBooksView: React.FC<MasterBooksViewProps> = ({
  notebooks,
  currentTheme,
  onExploreNotebook
}) => {
  const { t, isRTL, dir } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedLang, setSelectedLang] = useState<'all' | 'ar' | 'ur'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const pageSize = 50;

  // Flatten all books with parent notebook information
  const allFlattenedBooks = useMemo(() => {
    const list: FlattenedBook[] = [];
    notebooks.forEach((nb) => {
      (nb.books || []).forEach((b) => {
        list.push({
          ...b,
          notebookId: nb.id,
          notebookTitle: nb.title,
          notebookIcon: nb.icon || '📚',
          notebookCat: nb.cat,
          notebookLink: nb.link
        });
      });
    });
    return list;
  }, [notebooks]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    notebooks.forEach((nb) => {
      if (nb.cat) set.add(nb.cat);
    });
    return Array.from(set).sort();
  }, [notebooks]);

  // Filter books
  const filteredBooks = useMemo(() => {
    return allFlattenedBooks.filter((b) => {
      if (selectedCat !== 'all' && b.notebookCat !== selectedCat) return false;
      if (selectedLang !== 'all' && b.lang && b.lang !== selectedLang) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.publisher?.toLowerCase().includes(q) ||
        b.notebookCat?.toLowerCase().includes(q) ||
        b.notebookTitle?.toLowerCase().includes(q)
      );
    });
  }, [allFlattenedBooks, query, selectedCat, selectedLang]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const pageBooks = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, validPage, pageSize]);

  const handleCopyBook = (title: string) => {
    navigator.clipboard.writeText(title);
    setCopiedTitle(title);
    setTimeout(() => setCopiedTitle(null), 2000);
  };

  return (
    <div id="master-books-view" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir={dir}>
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5" style={{ color: currentTheme.accent }} />
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: currentTheme.text }}>
              {isRTL ? 'فهرس الكتب والمصادر الشامل' : 'Master Library Catalog'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm" style={{ color: currentTheme.textMuted }}>
            {isRTL 
              ? `بحث في ${filteredBooks.length.toLocaleString()} مجلداً ومصدراً إسلامياً عبر ${notebooks.length} دفتراً ذكياً.`
              : `Searching ${filteredBooks.length.toLocaleString()} indexed classical & contemporary volumes across all ${notebooks.length} NotebookLM hubs.`}
          </p>
        </div>

        {/* Quick Language Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
          {(['all', 'ar', 'ur'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setSelectedLang(lang);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                selectedLang === lang ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: selectedLang === lang ? currentTheme.accent : 'transparent',
                color: selectedLang === lang ? (currentTheme.mode === 'dark' ? '#000' : '#fff') : currentTheme.text
              }}
            >
              {lang === 'all' ? t('filterAllLangs') : lang === 'ar' ? t('filterArabic') : t('filterUrdu')}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div 
        className="p-3 sm:p-4 rounded-xl border mb-6 flex flex-col sm:flex-row items-center gap-3"
        style={{ 
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border 
        }}
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3" style={{ color: currentTheme.textMuted }} />
          <input
            type="text"
            placeholder="Search within all 14,700+ books by title, author, or publisher..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border outline-hidden"
            style={{
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          />
        </div>

        {/* Category Select Dropdown */}
        <div className="w-full sm:w-64">
          <select
            value={selectedCat}
            onChange={(e) => {
              setSelectedCat(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border outline-hidden"
            style={{
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Table */}
      <div 
        className="rounded-2xl border overflow-hidden shadow-xs"
        style={{ 
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border 
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs sm:text-sm">
            <thead>
              <tr 
                className="border-b font-semibold"
                style={{ 
                  backgroundColor: currentTheme.surfaceSecondary,
                  borderColor: currentTheme.border,
                  color: currentTheme.textMuted 
                }}
              >
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 text-start">{isRTL ? 'عنوان الكتاب' : 'Book Title'}</th>
                <th className="py-3 px-4 text-start">{isRTL ? 'المؤلف / سنة الوفاة' : 'Author / Death Year'}</th>
                <th className="py-3 px-4 text-start">{isRTL ? 'التصنيف والدفتر' : 'Discipline & Hub'}</th>
                <th className="py-3 px-4 text-center">{isRTL ? 'اللغة' : 'Lang'}</th>
                <th className="py-3 px-4 text-end">{isRTL ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: currentTheme.border }}>
              {pageBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center" style={{ color: currentTheme.textMuted }}>
                    {isRTL ? 'لم يتم العثور على أي كتب تطابق معايير البحث الحالية.' : 'No books found matching the current search filters.'}
                  </td>
                </tr>
              ) : (
                pageBooks.map((book, idx) => {
                  const globalIdx = (validPage - 1) * pageSize + idx + 1;
                  return (
                    <tr 
                      key={`${book.notebookId}-${idx}`}
                      className="hover:bg-black/5 transition-colors"
                      style={{ color: currentTheme.text }}
                    >
                      <td className="py-3 px-4 text-center font-mono font-medium text-xs" style={{ color: currentTheme.textMuted }}>
                        {globalIdx}
                      </td>

                      <td className="py-3 px-4 max-w-xs sm:max-w-md">
                        <div 
                          onClick={() => {
                            const parentNb = notebooks.find((n) => n.id === book.notebookId) || {
                              id: book.notebookId,
                              title: book.notebookTitle,
                              icon: book.notebookIcon,
                              cat: book.notebookCat,
                              link: book.notebookLink
                            } as Notebook;
                            onExploreNotebook(parentNb, book.title);
                          }}
                          className="font-bold font-arabic text-sm sm:text-base leading-snug cursor-pointer hover:underline" 
                          dir="auto"
                          title="View and track reading progress"
                        >
                          {book.title}
                        </div>
                        {book.publisher && (
                          <div className="text-[11px] mt-0.5" style={{ color: currentTheme.textMuted }}>
                            {book.publisher} {book.volumes ? `• ${book.volumes} Vol.` : ''}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {book.author ? (
                          <div className="font-medium font-arabic">{book.author}</div>
                        ) : (
                          <span className="opacity-40">-</span>
                        )}
                        {book.deathYear && (
                          <div className="text-[11px]" style={{ color: currentTheme.accent }}>
                            ت: {book.deathYear}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span 
                          className="inline-block text-[11px] px-2 py-0.5 rounded-full font-medium mb-1"
                          style={{ 
                            backgroundColor: currentTheme.surfaceSecondary,
                            color: currentTheme.accent,
                            border: `1px solid ${currentTheme.border}`
                          }}
                        >
                          {book.notebookCat}
                        </span>
                        <div className="text-xs truncate max-w-[200px]" style={{ color: currentTheme.textMuted }}>
                          {book.notebookTitle}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span 
                          className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold"
                          style={{
                            backgroundColor: currentTheme.surfaceSecondary,
                            color: currentTheme.primary,
                            border: `1px solid ${currentTheme.border}`
                          }}
                        >
                          {book.lang || 'ar'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyBook(book.title)}
                            className="p-1.5 rounded-lg border transition-colors cursor-pointer"
                            style={{ 
                              backgroundColor: currentTheme.surfaceSecondary,
                              borderColor: currentTheme.border,
                              color: currentTheme.textMuted 
                            }}
                            title={t('copyLink')}
                          >
                            {copiedTitle === book.title ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <a
                            href={book.notebookLink || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border text-white flex items-center gap-1 text-xs transition-opacity hover:opacity-90"
                            style={{ 
                              backgroundColor: currentTheme.primary,
                              borderColor: currentTheme.primary 
                            }}
                            title={t('openNotebookLM')}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div 
            className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
            style={{ 
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border,
              color: currentTheme.textMuted 
            }}
          >
            <div>
              {isRTL ? (
                <span>عرض {((validPage - 1) * pageSize + 1).toLocaleString()} إلى {Math.min(validPage * pageSize, filteredBooks.length).toLocaleString()} من أصل {filteredBooks.length.toLocaleString()} كتاب</span>
              ) : (
                <span>Showing {((validPage - 1) * pageSize + 1).toLocaleString()} to {Math.min(validPage * pageSize, filteredBooks.length).toLocaleString()} of {filteredBooks.length.toLocaleString()} books</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validPage === 1}
                className="px-2.5 py-1.5 rounded-lg border flex items-center gap-1 disabled:opacity-30 cursor-pointer"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
              >
                {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{isRTL ? 'السابق' : 'Prev'}</span>
              </button>

              <span className="font-semibold px-2" style={{ color: currentTheme.text }}>
                {isRTL ? `صفحة ${validPage} من ${totalPages}` : `Page ${validPage} of ${totalPages}`}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validPage === totalPages}
                className="px-2.5 py-1.5 rounded-lg border flex items-center gap-1 disabled:opacity-30 cursor-pointer"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
              >
                <span>{isRTL ? 'التالي' : 'Next'}</span>
                {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
