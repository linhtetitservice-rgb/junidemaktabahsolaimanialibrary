import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  Sparkles,
  Layers,
  Calendar,
  Building,
  Filter,
  CheckCircle2,
  Bookmark,
  Plus,
  Minus,
  RotateCcw,
  Timer,
  Clock,
  Play,
  Pause
} from 'lucide-react';
import { Notebook, Book, ThemeConfig, ReadingStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  useReadingTracker, 
  getBookProgressId, 
  parseTotalVolumes 
} from '../utils/readingTracker';
import { 
  useReadingTimer, 
  estimateReadingTime 
} from '../utils/readingTimer';

interface BookExplorerModalProps {
  notebook: Notebook | null;
  currentTheme: ThemeConfig;
  onClose: () => void;
  initialBookTitle?: string;
}

export const BookExplorerModal: React.FC<BookExplorerModalProps> = ({
  notebook,
  currentTheme,
  onClose,
  initialBookTitle
}) => {
  if (!notebook) return null;

  const { t, language, isRTL, dir } = useLanguage();
  const [bookSearch, setBookSearch] = useState(initialBookTitle || '');
  const [langFilter, setLangFilter] = useState<'all' | 'ar' | 'ur'>('all');
  const [readingFilter, setReadingFilter] = useState<'all' | ReadingStatus>('all');
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  const { progressMap, updateStatus, recordView, removeProgress } = useReadingTracker();

  // Reading timer hook tracking time spent exploring this notebook and active book
  const {
    sessionSeconds,
    totalNotebookSeconds,
    isPaused,
    togglePause,
    resetSession,
    activeBookTitle,
    setActiveBookTitle,
    formattedSession,
    formattedFriendly,
    formattedTotal
  } = useReadingTimer({
    notebookId: notebook.id,
    initialBookTitle,
    enabled: true
  });

  const books = notebook.books || [];

  // Calculate notebook-wide total estimated reading time
  const notebookEstimatedReadingTime = useMemo(() => {
    const totalVolumes = books.reduce((acc, b) => acc + parseTotalVolumes(b.volumes), 0);
    return estimateReadingTime(totalVolumes);
  }, [books]);

  // Reading progress stats within this specific notebook
  const notebookReadingStats = useMemo(() => {
    let reading = 0;
    let completed = 0;
    let wantToRead = 0;
    books.forEach((b) => {
      const p = progressMap[getBookProgressId(notebook.id, b.title)];
      if (p) {
        if (p.status === 'reading') reading++;
        else if (p.status === 'completed') completed++;
        else if (p.status === 'want_to_read') wantToRead++;
      }
    });
    return { 
      reading, 
      completed, 
      wantToRead, 
      totalTracked: reading + completed + wantToRead 
    };
  }, [books, notebook.id, progressMap]);

  // Filter books based on search, language, and reading status
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Language filter
      if (langFilter !== 'all' && b.lang && b.lang !== langFilter) {
        return false;
      }

      // Reading status filter
      if (readingFilter !== 'all') {
        const p = progressMap[getBookProgressId(notebook.id, b.title)];
        if (!p || p.status !== readingFilter) {
          return false;
        }
      }

      // Text search
      if (!bookSearch.trim()) return true;
      const q = bookSearch.toLowerCase();
      const titleMatch = b.title?.toLowerCase().includes(q);
      const authorMatch = b.author?.toLowerCase().includes(q);
      const pubMatch = b.publisher?.toLowerCase().includes(q);
      const tahqeeqMatch = b.tahqeeq?.toLowerCase().includes(q);
      return titleMatch || authorMatch || pubMatch || tahqeeqMatch;
    });
  }, [books, bookSearch, langFilter, readingFilter, notebook.id, progressMap]);

  // Auto-scroll to initialBookTitle if provided
  useEffect(() => {
    if (initialBookTitle) {
      const timer = setTimeout(() => {
        const idSafe = `book-item-${initialBookTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
        const el = document.getElementById(idSafe);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialBookTitle]);

  const handleCopyBook = (book: Book) => {
    navigator.clipboard.writeText(book.title);
    setCopiedTitle(book.title);
    recordView(book, notebook);
    setTimeout(() => setCopiedTitle(null), 2000);
  };

  const handleSetStatus = (book: Book, status: ReadingStatus) => {
    const totalVols = parseTotalVolumes(book.volumes);
    const existing = progressMap[getBookProgressId(notebook.id, book.title)];
    const curVol = status === 'completed' ? totalVols : (existing?.currentVolume ?? 1);
    updateStatus(book, notebook, status, curVol);
  };

  const handleAdjustVolume = (book: Book, delta: number) => {
    const id = getBookProgressId(notebook.id, book.title);
    const existing = progressMap[id];
    const totalVols = parseTotalVolumes(book.volumes);
    const current = existing?.currentVolume ?? 1;
    const next = Math.max(1, Math.min(totalVols, current + delta));
    const nextStatus = next >= totalVols ? 'completed' : 'reading';
    updateStatus(book, notebook, nextStatus, next);
  };

  return (
    <div 
      id="book-explorer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      dir={dir}
    >
      <div 
        id="book-explorer-modal"
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden"
        style={{ 
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          className="p-4 sm:p-5 border-b flex items-start justify-between gap-3 shrink-0"
          style={{ 
            backgroundColor: currentTheme.surfaceSecondary,
            borderColor: currentTheme.border 
          }}
        >
          <div className="flex items-start gap-3 min-w-0">
            <span 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border shadow-xs"
              style={{ 
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border 
              }}
            >
              {notebook.icon || '📚'}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span 
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.border,
                    color: currentTheme.accent,
                    border: `1px solid ${currentTheme.border}`
                  }}
                >
                  {notebook.cat}
                </span>
                <span 
                  className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ 
                    backgroundColor: currentTheme.primary,
                    color: '#fff' 
                  }}
                >
                  {t('modalVolumesCount', { count: books.length })}
                </span>

                {/* Notebook Estimated Reading Time Badge */}
                <span 
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border shadow-2xs"
                  style={{ 
                    backgroundColor: currentTheme.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
                    borderColor: currentTheme.mode === 'dark' ? 'rgba(99, 102, 241, 0.3)' : '#c7d2fe',
                    color: currentTheme.mode === 'dark' ? '#a5b4fc' : '#4338ca' 
                  }}
                  title={`Estimated total study time for all ${books.length} volumes in this notebook`}
                >
                  <Clock className="w-3 h-3 text-indigo-500" />
                  <span>{t('estReadingTime')}: {notebookEstimatedReadingTime.formatted}</span>
                </span>

                {/* Progress summary pill */}
                {notebookReadingStats.totalTracked > 0 && (
                  <span 
                    className="text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border"
                    style={{ 
                      backgroundColor: currentTheme.surface,
                      borderColor: currentTheme.border,
                      color: currentTheme.text 
                    }}
                  >
                    <span>📖 {notebookReadingStats.reading}</span>
                    <span>•</span>
                    <span>✅ {notebookReadingStats.completed}</span>
                    <span>•</span>
                    <span>🔖 {notebookReadingStats.wantToRead}</span>
                  </span>
                )}
              </div>
              <h2 
                className="text-lg sm:text-xl font-bold font-arabic leading-snug truncate"
                style={{ color: currentTheme.text }}
              >
                {notebook.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Direct NotebookLM link */}
            <a
              id="modal-open-notebooklm-btn"
              href={notebook.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs transition-opacity hover:opacity-90"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('openNotebookLM')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg border transition-colors cursor-pointer"
              style={{ 
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.textMuted 
              }}
              title={t('modalClose')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Reading Timer & Session Tracker Bar */}
        <div 
          id="modal-reading-timer-bar"
          className="px-3 sm:px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2.5 text-xs select-none"
          style={{ 
            backgroundColor: currentTheme.mode === 'dark' ? 'rgba(15, 23, 42, 0.65)' : '#f8fafc',
            borderColor: currentTheme.border 
          }}
        >
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {/* Live digital timer pill */}
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono font-bold shadow-2xs"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: isPaused ? currentTheme.border : '#3b82f6',
                color: currentTheme.text
              }}
              title={isPaused ? t('timerPaused') : t('timerActive')}
            >
              <Timer className={`w-3.5 h-3.5 ${isPaused ? 'text-amber-500' : 'text-blue-500'}`} />
              <span className="text-xs sm:text-sm tracking-wider">{formattedSession}</span>
              
              {/* Activity indicator */}
              {!isPaused ? (
                <span className="relative flex h-2 w-2 ms-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : (
                <span className="inline-flex rounded-full h-2 w-2 bg-amber-400 ms-0.5" title="Paused"></span>
              )}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                id="timer-toggle-pause-btn"
                onClick={togglePause}
                className="px-2 py-1 rounded-md border text-xs flex items-center gap-1 transition-all cursor-pointer shadow-2xs font-medium"
                style={{
                  backgroundColor: isPaused 
                    ? (currentTheme.mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5')
                    : currentTheme.surface,
                  borderColor: isPaused ? '#10b981' : currentTheme.border,
                  color: isPaused ? '#10b981' : currentTheme.text
                }}
                title={isPaused ? t('timerResume') : t('timerPause')}
              >
                {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
                <span className="text-[11px]">{isPaused ? t('timerResume') : t('timerPause')}</span>
              </button>

              <button
                type="button"
                id="timer-reset-btn"
                onClick={resetSession}
                className="p-1.5 rounded-md border text-xs transition-opacity hover:opacity-100 cursor-pointer shadow-2xs"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.textMuted
                }}
                title={t('timerReset')}
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Cumulative Notebook Exploration Time */}
            <div 
              className="text-[11px] flex items-center gap-1 px-2 py-0.5 rounded-md border"
              style={{ 
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.textMuted 
              }}
              title="Total time spent exploring this notebook across sessions"
            >
              <span>{t('totalTimeExplored')}:</span>
              <strong style={{ color: currentTheme.text }}>{formattedTotal}</strong>
            </div>

            {/* Currently Focused Book */}
            {activeBookTitle && (
              <div 
                className="text-[11px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1.5 max-w-xs sm:max-w-md truncate"
                style={{ 
                  backgroundColor: currentTheme.mode === 'dark' ? 'rgba(59, 130, 246, 0.12)' : '#eff6ff',
                  borderColor: currentTheme.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
                  color: currentTheme.mode === 'dark' ? '#93c5fd' : '#1d4ed8'
                }}
                title={`Active reading timer focused on: ${activeBookTitle}`}
              >
                <BookOpen className="w-3 h-3 text-blue-500 shrink-0" />
                <span className="truncate">{activeBookTitle}</span>
                <button
                  type="button"
                  onClick={() => setActiveBookTitle(undefined)}
                  className="ms-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Clear active book focus"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Notebook Estimated Reading Time Badge */}
          <div className="flex items-center gap-1.5 ms-auto shrink-0">
            <span 
              className="text-[11px] px-2.5 py-1 rounded-full font-semibold inline-flex items-center gap-1.5 border shadow-2xs"
              style={{ 
                backgroundColor: currentTheme.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
                borderColor: currentTheme.mode === 'dark' ? 'rgba(99, 102, 241, 0.3)' : '#c7d2fe',
                color: currentTheme.mode === 'dark' ? '#a5b4fc' : '#4338ca' 
              }}
              title={`Estimated reading duration for the entire ${notebook.title} notebook (${notebookEstimatedReadingTime.volumesCount} total volumes)`}
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('notebookEstTotal', { time: notebookEstimatedReadingTime.formatted })}</span>
            </span>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div 
          className="p-3 sm:px-5 border-b flex flex-col gap-2.5 shrink-0"
          style={{ 
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.border 
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* In-modal Search */}
            <div className="relative w-full sm:w-80">
              <Search className={`w-4 h-4 absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5`} style={{ color: currentTheme.textMuted }} />
              <input
                id="modal-search-books"
                type="text"
                placeholder={t('modalSearchPlaceholder')}
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-1.5 text-xs sm:text-sm rounded-lg border outline-hidden`}
                style={{ 
                  backgroundColor: currentTheme.surfaceSecondary,
                  borderColor: currentTheme.border,
                  color: currentTheme.text 
                }}
              />
              {bookSearch && (
                <button
                  onClick={() => setBookSearch('')}
                  className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-2 text-xs text-gray-400 hover:text-gray-600`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Language filter buttons */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              {(['all', 'ar', 'ur'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLangFilter(lang)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    langFilter === lang ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: langFilter === lang ? currentTheme.accent : currentTheme.surfaceSecondary,
                    color: langFilter === lang ? (currentTheme.mode === 'dark' ? '#000' : '#fff') : currentTheme.text
                  }}
                >
                  {lang === 'all' ? t('filterAllLangs') : lang === 'ar' ? t('filterArabic') : t('filterUrdu')}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Progress Filter Bar */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1 border-t" style={{ borderColor: currentTheme.border }}>
            <span className="text-[11px] font-medium me-1" style={{ color: currentTheme.textMuted }}>
              Reading Status:
            </span>

            <button
              onClick={() => setReadingFilter('all')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                readingFilter === 'all' ? 'font-semibold shadow-2xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: readingFilter === 'all' ? currentTheme.surfaceSecondary : 'transparent',
                color: readingFilter === 'all' ? currentTheme.accent : currentTheme.text,
                border: readingFilter === 'all' ? `1px solid ${currentTheme.border}` : 'none'
              }}
            >
              All ({books.length})
            </button>

            <button
              onClick={() => setReadingFilter('reading')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                readingFilter === 'reading' ? 'font-semibold shadow-2xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: readingFilter === 'reading' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: readingFilter === 'reading' ? '#3b82f6' : currentTheme.text,
                border: readingFilter === 'reading' ? '1px solid rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              <BookOpen className="w-3 h-3 text-blue-500" />
              <span>{t('readingStatusReading')} ({notebookReadingStats.reading})</span>
            </button>

            <button
              onClick={() => setReadingFilter('completed')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                readingFilter === 'completed' ? 'font-semibold shadow-2xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: readingFilter === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: readingFilter === 'completed' ? '#10b981' : currentTheme.text,
                border: readingFilter === 'completed' ? '1px solid rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{t('readingStatusCompleted')} ({notebookReadingStats.completed})</span>
            </button>

            <button
              onClick={() => setReadingFilter('want_to_read')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                readingFilter === 'want_to_read' ? 'font-semibold shadow-2xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: readingFilter === 'want_to_read' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: readingFilter === 'want_to_read' ? '#f59e0b' : currentTheme.text,
                border: readingFilter === 'want_to_read' ? '1px solid rgba(245, 158, 11, 0.3)' : 'none'
              }}
            >
              <Bookmark className="w-3 h-3 text-amber-500" />
              <span>{t('readingStatusWantToRead')} ({notebookReadingStats.wantToRead})</span>
            </button>
          </div>
        </div>

        {/* Books List Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: currentTheme.textMuted }} />
              <p className="text-sm font-medium" style={{ color: currentTheme.textMuted }}>
                {t('modalNoBooksMatch')}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div 
                className="text-xs font-medium mb-2 flex items-center justify-between"
                style={{ color: currentTheme.textMuted }}
              >
                <span>Showing {filteredBooks.length} of {books.length} volumes</span>
                <span>Track reading progress with the status buttons</span>
              </div>

              {filteredBooks.map((book, idx) => {
                const progressId = getBookProgressId(notebook.id, book.title);
                const progress = progressMap[progressId];
                const totalVols = parseTotalVolumes(book.volumes);
                const curVol = progress?.currentVolume ?? 1;
                const isCurrentInitial = initialBookTitle && book.title.includes(initialBookTitle);
                const isTimerFocused = activeBookTitle === book.title;
                const bookEstimate = estimateReadingTime(book.volumes);

                return (
                  <div
                    key={idx}
                    id={`book-item-${book.title.replace(/[^a-zA-Z0-9_-]/g, '_')}`}
                    className={`p-3 sm:p-4 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-opacity-100 ${
                      isCurrentInitial || isTimerFocused ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{ 
                      backgroundColor: currentTheme.surfaceSecondary,
                      borderColor: (isCurrentInitial || isTimerFocused) ? '#3b82f6' : currentTheme.border 
                    }}
                    onClick={() => {
                      setActiveBookTitle(book.title);
                      recordView(book, notebook);
                    }}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span 
                        className="text-xs font-mono font-bold w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                        style={{ 
                          backgroundColor: currentTheme.surface,
                          color: currentTheme.textMuted,
                          border: `1px solid ${currentTheme.border}`
                        }}
                      >
                        {idx + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 
                            className="font-bold text-sm sm:text-base font-nastaleeq leading-relaxed cursor-pointer"
                            style={{ color: currentTheme.text }}
                            dir="auto"
                          >
                            {book.title}
                          </h4>

                          {/* Active Status Badge if set */}
                          {progress && (
                            <span 
                              className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border"
                              style={{ 
                                backgroundColor: progress.status === 'completed' 
                                  ? 'rgba(16, 185, 129, 0.15)' 
                                  : progress.status === 'reading' 
                                  ? 'rgba(59, 130, 246, 0.15)' 
                                  : 'rgba(245, 158, 11, 0.15)',
                                color: progress.status === 'completed' 
                                  ? '#10b981' 
                                  : progress.status === 'reading' 
                                  ? '#3b82f6' 
                                  : '#f59e0b',
                                borderColor: progress.status === 'completed' 
                                  ? 'rgba(16, 185, 129, 0.3)' 
                                  : progress.status === 'reading' 
                                  ? 'rgba(59, 130, 246, 0.3)' 
                                  : 'rgba(245, 158, 11, 0.3)'
                              }}
                            >
                              {progress.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5" />}
                              {progress.status === 'reading' && <BookOpen className="w-2.5 h-2.5" />}
                              {progress.status === 'want_to_read' && <Bookmark className="w-2.5 h-2.5" />}
                              <span>
                                {progress.status === 'completed' 
                                  ? t('readingStatusCompleted') 
                                  : progress.status === 'reading' 
                                  ? (totalVols > 1 ? `Reading Vol ${curVol}/${totalVols}` : t('readingStatusReading'))
                                  : t('readingStatusWantToRead')}
                              </span>
                            </span>
                          )}

                          {/* Estimated Reading Time Badge based on book length */}
                          <span 
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 border shadow-2xs"
                            style={{ 
                              backgroundColor: currentTheme.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
                              borderColor: currentTheme.mode === 'dark' ? 'rgba(99, 102, 241, 0.3)' : '#c7d2fe',
                              color: currentTheme.mode === 'dark' ? '#a5b4fc' : '#4338ca'
                            }}
                            title={`Estimated Reading Time based on book length (${bookEstimate.volumesCount} ${bookEstimate.volumesCount === 1 ? 'Volume' : 'Volumes'} ≈ ~${bookEstimate.hours} hours)`}
                          >
                            <Clock className="w-2.5 h-2.5 shrink-0 text-indigo-500" />
                            <span>{t('estReadingTime')}: {bookEstimate.formatted}</span>
                          </span>

                          {/* Timer Focus indicator if active */}
                          {isTimerFocused && (
                            <span 
                              className="text-[10px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 border"
                              style={{
                                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                borderColor: 'rgba(59, 130, 246, 0.35)',
                                color: '#3b82f6'
                              }}
                              title="Active reading timer is focused on this book"
                            >
                              <Timer className="w-2.5 h-2.5" />
                              <span>{t('timerActive')}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 flex-wrap mt-1 text-xs" style={{ color: currentTheme.textMuted }}>
                          {book.author && (
                            <span className="flex items-center gap-1 font-arabic">
                              <span>المؤلف:</span>
                              <strong style={{ color: currentTheme.text }}>{book.author}</strong>
                            </span>
                          )}

                          {book.deathYear && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>وفات: {book.deathYear}</span>
                            </span>
                          )}

                          {book.publisher && (
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              <span>{book.publisher}</span>
                            </span>
                          )}

                          {book.volumes && (
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              <span>{book.volumes} {book.volumes === '1' ? 'Volume' : 'Volumes'}</span>
                            </span>
                          )}
                        </div>

                        {/* Volume Stepper if currently reading and totalVolumes > 1 */}
                        {progress?.status === 'reading' && totalVols > 1 && (
                          <div className="mt-2 flex items-center gap-2 pt-1 border-t border-dashed" style={{ borderColor: currentTheme.border }}>
                            <span className="text-[11px] font-medium" style={{ color: currentTheme.textMuted }}>
                              Volume Progress:
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdjustVolume(book, -1);
                                }}
                                disabled={curVol <= 1}
                                className="w-5 h-5 rounded-sm border flex items-center justify-center text-xs disabled:opacity-30 cursor-pointer"
                                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                                title="Previous volume"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-mono font-bold px-1.5" style={{ color: currentTheme.text }}>
                                {curVol} / {totalVols}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdjustVolume(book, 1);
                                }}
                                disabled={curVol >= totalVols}
                                className="w-5 h-5 rounded-sm border flex items-center justify-center text-xs disabled:opacity-30 cursor-pointer"
                                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                                title="Next volume"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="w-24 h-1.5 rounded-full overflow-hidden ml-1" style={{ backgroundColor: currentTheme.surface }}>
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${Math.round((curVol / totalVols) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Control Actions */}
                    <div 
                      className="flex items-center gap-1.5 shrink-0 self-end sm:self-center flex-wrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Status Action Buttons */}
                      <div 
                        className="flex items-center rounded-lg border p-0.5 text-xs"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                      >
                        <button
                          onClick={() => handleSetStatus(book, 'want_to_read')}
                          className={`p-1.5 rounded-md transition-all cursor-pointer ${
                            progress?.status === 'want_to_read' ? 'bg-amber-500/20 text-amber-500 font-bold' : 'opacity-60 hover:opacity-100'
                          }`}
                          title="Want to Read"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleSetStatus(book, 'reading')}
                          className={`p-1.5 rounded-md transition-all cursor-pointer ${
                            progress?.status === 'reading' ? 'bg-blue-500/20 text-blue-500 font-bold' : 'opacity-60 hover:opacity-100'
                          }`}
                          title="Currently Reading"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleSetStatus(book, 'completed')}
                          className={`p-1.5 rounded-md transition-all cursor-pointer ${
                            progress?.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500 font-bold' : 'opacity-60 hover:opacity-100'
                          }`}
                          title="Mark Completed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>

                        {progress && (
                          <button
                            onClick={() => removeProgress(progressId)}
                            className="p-1.5 rounded-md opacity-40 hover:opacity-100 hover:text-red-500 transition-all cursor-pointer"
                            title="Clear progress"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Language pill */}
                      {book.lang && (
                        <span 
                          className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold"
                          style={{ 
                            backgroundColor: currentTheme.surface,
                            color: currentTheme.accent,
                            border: `1px solid ${currentTheme.border}`
                          }}
                        >
                          {book.lang}
                        </span>
                      )}

                      {/* Focus Reading Timer button */}
                      <button
                        type="button"
                        id={`timer-focus-btn-${idx}`}
                        onClick={() => {
                          if (isTimerFocused) {
                            setActiveBookTitle(undefined);
                          } else {
                            setActiveBookTitle(book.title);
                            recordView(book, notebook);
                          }
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isTimerFocused ? 'ring-2 ring-blue-500 shadow-2xs font-bold' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ 
                          backgroundColor: isTimerFocused 
                            ? (currentTheme.mode === 'dark' ? 'rgba(59, 130, 246, 0.25)' : '#dbeafe')
                            : currentTheme.surface,
                          borderColor: isTimerFocused ? '#3b82f6' : currentTheme.border,
                          color: isTimerFocused ? '#2563eb' : currentTheme.textMuted 
                        }}
                        title={isTimerFocused ? "Active timer tracking this book (click to unset)" : "Focus reading timer on this book"}
                      >
                        <Timer className={`w-3.5 h-3.5 ${isTimerFocused ? 'text-blue-500' : ''}`} />
                      </button>

                      {/* Copy Title button */}
                      <button
                        id={`copy-book-btn-${idx}`}
                        onClick={() => handleCopyBook(book)}
                        className="p-1.5 rounded-lg border transition-colors cursor-pointer"
                        style={{ 
                          backgroundColor: currentTheme.surface,
                          borderColor: currentTheme.border,
                          color: currentTheme.textMuted 
                        }}
                        title="Copy Book Title"
                      >
                        {copiedTitle === book.title ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div 
          className="p-3 sm:px-5 border-t flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs"
          style={{ 
            backgroundColor: currentTheme.surfaceSecondary,
            borderColor: currentTheme.border,
            color: currentTheme.textMuted
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 font-mono">
              <Timer className="w-3.5 h-3.5 text-blue-500" />
              <span>{t('sessionDuration')}: <strong style={{ color: currentTheme.text }}>{formattedFriendly}</strong></span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('notebookEstTotal', { time: notebookEstimatedReadingTime.formatted })}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer"
            style={{ 
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.border,
              color: currentTheme.text 
            }}
          >
            {t('modalClose')}
          </button>
        </div>
      </div>
    </div>
  );
};

