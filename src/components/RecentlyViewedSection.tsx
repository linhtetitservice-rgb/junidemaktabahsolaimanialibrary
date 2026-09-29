import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  ExternalLink, 
  X, 
  Trash2, 
  Sparkles,
  Layers,
  ChevronRight,
  Library,
  BookMarked,
  Timer
} from 'lucide-react';
import { ThemeConfig, Notebook, ReadingStatus, BookProgress } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useReadingTracker } from '../utils/readingTracker';
import { estimateReadingTime, formatTimerFriendly } from '../utils/readingTimer';

interface RecentlyViewedSectionProps {
  currentTheme: ThemeConfig;
  allNotebooks: Notebook[];
  onOpenNotebookBooks: (notebook: Notebook, bookTitle?: string) => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  currentTheme,
  allNotebooks,
  onOpenNotebookBooks
}) => {
  const { t, isRTL, dir } = useLanguage();
  const { recentlyViewed, updateStatus, removeProgress, clearAll } = useReadingTracker();
  const [statusFilter, setStatusFilter] = useState<'all' | ReadingStatus>('all');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Map notebookId to Notebook object for quick lookup
  const notebookMap = useMemo(() => {
    const map = new Map<string, Notebook>();
    allNotebooks.forEach((nb) => map.set(nb.id, nb));
    return map;
  }, [allNotebooks]);

  // Filter recently viewed items
  const filteredItems = useMemo(() => {
    if (statusFilter === 'all') return recentlyViewed;
    return recentlyViewed.filter((item) => item.status === statusFilter);
  }, [recentlyViewed, statusFilter]);

  // Counts by status
  const counts = useMemo(() => {
    let reading = 0;
    let completed = 0;
    let wantToRead = 0;
    recentlyViewed.forEach((item) => {
      if (item.status === 'reading') reading++;
      else if (item.status === 'completed') completed++;
      else if (item.status === 'want_to_read') wantToRead++;
    });
    return {
      all: recentlyViewed.length,
      reading,
      completed,
      wantToRead
    };
  }, [recentlyViewed]);

  // Format relative time
  const formatTimeAgo = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t('timeJustNow');
    if (diffMins < 60) return t('timeMinutesAgo', { min: diffMins });
    if (diffHours < 24) return t('timeHoursAgo', { hours: diffHours });
    return t('timeDaysAgo', { days: diffDays });
  };

  const getStatusBadge = (status: ReadingStatus) => {
    switch (status) {
      case 'reading':
        return {
          label: t('readingStatusReading'),
          icon: BookOpen,
          bg: currentTheme.mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
          color: '#3b82f6',
          border: 'rgba(59, 130, 246, 0.3)'
        };
      case 'completed':
        return {
          label: t('readingStatusCompleted'),
          icon: CheckCircle2,
          bg: currentTheme.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
          color: '#10b981',
          border: 'rgba(16, 185, 129, 0.3)'
        };
      case 'want_to_read':
      default:
        return {
          label: t('readingStatusWantToRead'),
          icon: Bookmark,
          bg: currentTheme.mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb',
          color: '#f59e0b',
          border: 'rgba(245, 158, 11, 0.3)'
        };
    }
  };

  const handleOpenBook = (item: BookProgress) => {
    const nb = notebookMap.get(item.notebookId) || {
      id: item.notebookId,
      title: item.notebookTitle,
      icon: item.notebookIcon || '📚',
      cat: item.notebookCat || 'General',
      link: item.notebookLink || 'https://notebooklm.google.com'
    };
    onOpenNotebookBooks(nb as Notebook, item.bookTitle);
  };

  // If there are no recently viewed books and user hasn't tracked any, render clean empty prompt
  if (recentlyViewed.length === 0) {
    return (
      <section 
        id="recently-viewed-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"
        dir={dir}
      >
        <div 
          className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors"
          style={{ 
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.border 
          }}
        >
          <div className="flex items-center gap-3 text-center sm:text-start">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
              style={{ 
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border,
                color: currentTheme.accent 
              }}
            >
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2 justify-center sm:justify-start" style={{ color: currentTheme.text }}>
                <span>{t('recentlyViewedTitle')}</span>
                <span 
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ 
                    backgroundColor: currentTheme.surfaceSecondary,
                    color: currentTheme.accent,
                    border: `1px solid ${currentTheme.border}`
                  }}
                >
                  {t('recentlyViewedBadge')}
                </span>
              </h3>
              <p className="text-xs mt-0.5" style={{ color: currentTheme.textMuted }}>
                {t('noRecentlyViewedDesc')}
              </p>
            </div>
          </div>
          <div className="text-xs font-medium px-3 py-1.5 rounded-lg border flex items-center gap-1.5" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.textMuted }}>
            <span>💡 Click &ldquo;Explore Books&rdquo; inside any Hub to track</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="recently-viewed-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      dir={dir}
    >
      <div 
        className="rounded-2xl border shadow-xs overflow-hidden transition-colors"
        style={{ 
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border 
        }}
      >
        {/* Header Bar */}
        <div 
          className="p-4 sm:px-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-3"
          style={{ 
            backgroundColor: currentTheme.surfaceSecondary,
            borderColor: currentTheme.border 
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
              style={{ 
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.accent 
              }}
            >
              <Clock className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base tracking-tight" style={{ color: currentTheme.text }}>
                  {t('recentlyViewedTitle')}
                </h3>
                <span 
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ 
                    backgroundColor: currentTheme.primary,
                    color: '#fff' 
                  }}
                >
                  {recentlyViewed.length}
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: currentTheme.textMuted }}>
                {t('recentlyViewedSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
            {/* Status Filter Tabs */}
            <div 
              className="flex items-center rounded-lg border p-0.5 text-xs"
              style={{ 
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border 
              }}
            >
              <button
                id="filter-all-recent"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: statusFilter === 'all' ? currentTheme.accent : 'transparent',
                  color: statusFilter === 'all' ? (currentTheme.mode === 'dark' ? '#000' : '#fff') : currentTheme.text
                }}
              >
                {t('readingFilterAll', { count: counts.all })}
              </button>

              <button
                id="filter-reading-recent"
                onClick={() => setStatusFilter('reading')}
                className={`px-2 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'reading' ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: statusFilter === 'reading' ? '#3b82f6' : 'transparent',
                  color: statusFilter === 'reading' ? '#fff' : currentTheme.text
                }}
              >
                <BookOpen className="w-3 h-3" />
                <span>{t('readingStatusReading')} ({counts.reading})</span>
              </button>

              <button
                id="filter-completed-recent"
                onClick={() => setStatusFilter('completed')}
                className={`px-2 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'completed' ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: statusFilter === 'completed' ? '#10b981' : 'transparent',
                  color: statusFilter === 'completed' ? '#fff' : currentTheme.text
                }}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>{t('readingStatusCompleted')} ({counts.completed})</span>
              </button>

              <button
                id="filter-want-recent"
                onClick={() => setStatusFilter('want_to_read')}
                className={`px-2 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'want_to_read' ? 'shadow-xs font-semibold' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: statusFilter === 'want_to_read' ? '#f59e0b' : 'transparent',
                  color: statusFilter === 'want_to_read' ? '#fff' : currentTheme.text
                }}
              >
                <Bookmark className="w-3 h-3" />
                <span>{t('readingStatusWantToRead')} ({counts.wantToRead})</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                id="collapse-recent-btn"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="px-2.5 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-colors"
                style={{ 
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.textMuted 
                }}
              >
                {isCollapsed ? 'Expand' : 'Collapse'}
              </button>

              <button
                id="clear-all-recent-btn"
                onClick={() => {
                  if (window.confirm('Clear all recently viewed reading history?')) {
                    clearAll();
                  }
                }}
                className="p-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors hover:text-red-500"
                style={{ 
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.textMuted 
                }}
                title={t('clearRecent')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Items */}
        {!isCollapsed && (
          <div className="p-4 sm:p-5">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: currentTheme.textMuted }} />
                <p className="text-xs" style={{ color: currentTheme.textMuted }}>
                  No books found in this status filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredItems.map((item) => {
                  const badge = getStatusBadge(item.status);
                  const Icon = badge.icon;
                  const totalVols = item.totalVolumes || 1;
                  const curVol = item.currentVolume || 1;
                  const progressPct = totalVols > 1 
                    ? Math.round((curVol / totalVols) * 100) 
                    : item.status === 'completed' ? 100 : item.status === 'reading' ? 50 : 0;

                  return (
                    <div
                      key={item.id}
                      id={`recent-book-${item.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`}
                      className="p-3.5 rounded-xl border flex flex-col justify-between transition-all duration-150 hover:shadow-md group relative"
                      style={{ 
                        backgroundColor: currentTheme.surfaceSecondary,
                        borderColor: currentTheme.border 
                      }}
                    >
                      {/* Top Info: Origin Hub & Remove button */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                          <button
                            onClick={() => handleOpenBook(item)}
                            className="flex items-center gap-1.5 font-medium truncate hover:underline cursor-pointer text-start"
                            style={{ color: currentTheme.accent }}
                            title={item.notebookTitle}
                          >
                            <span>{item.notebookIcon || '📚'}</span>
                            <span className="truncate max-w-[170px] sm:max-w-[200px]">{item.notebookTitle}</span>
                          </button>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[11px] opacity-75" style={{ color: currentTheme.textMuted }}>
                              {formatTimeAgo(item.lastViewedAt)}
                            </span>
                            <button
                              id={`remove-recent-${item.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeProgress(item.id);
                              }}
                              className="p-1 rounded-md opacity-60 hover:opacity-100 hover:text-red-500 cursor-pointer transition-opacity"
                              title={t('removeRecentBook')}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Book Title in Nastaleeq / Arabic Font */}
                        <h4 
                          onClick={() => handleOpenBook(item)}
                          className="font-bold text-base sm:text-lg font-nastaleeq leading-relaxed line-clamp-2 cursor-pointer hover:opacity-85 transition-opacity mb-1"
                          style={{ color: currentTheme.text }}
                          dir="auto"
                        >
                          {item.bookTitle}
                        </h4>

                        {/* Author info */}
                        <div className="flex items-center gap-2 text-xs mb-3 flex-wrap" style={{ color: currentTheme.textMuted }}>
                          {item.author && (
                            <span className="font-arabic font-medium truncate max-w-[200px]" style={{ color: currentTheme.text }}>
                              {item.author}
                            </span>
                          )}
                          {item.deathYear && (
                            <span>(وفات: {item.deathYear})</span>
                          )}
                          {item.volumes && (
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              <span>{item.volumes} Vols</span>
                            </span>
                          )}
                          <span 
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border"
                            style={{ 
                              backgroundColor: currentTheme.surface, 
                              borderColor: currentTheme.border,
                              color: currentTheme.accent
                            }}
                            title={`Estimated reading duration based on book length: ~${estimateReadingTime(item.volumes).hours} hours`}
                          >
                            <Clock className="w-2.5 h-2.5 text-indigo-400" />
                            <span>{estimateReadingTime(item.volumes).formatted}</span>
                          </span>
                          {item.timeSpentSeconds && item.timeSpentSeconds > 0 ? (
                            <span 
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium opacity-80"
                              style={{ 
                                backgroundColor: currentTheme.surface,
                                color: currentTheme.textMuted,
                                border: `1px solid ${currentTheme.border}`
                              }}
                              title="Time spent exploring this book"
                            >
                              <Timer className="w-2.5 h-2.5 text-blue-500" />
                              <span>{formatTimerFriendly(item.timeSpentSeconds)}</span>
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Bottom Status & Actions */}
                      <div className="pt-2 border-t mt-1" style={{ borderColor: currentTheme.border }}>
                        
                        {/* Status badge & volume switcher */}
                        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                          <div 
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{ 
                              backgroundColor: badge.bg, 
                              color: badge.color,
                              border: `1px solid ${badge.border}` 
                            }}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{badge.label}</span>
                            {item.status === 'reading' && totalVols > 1 && (
                              <span className="font-normal opacity-90">
                                • {t('readingVolumeProgress', { current: curVol, total: totalVols })}
                              </span>
                            )}
                          </div>

                          {/* Quick status dropdown / toggle */}
                          <div className="flex items-center gap-1 text-[11px]">
                            {item.status !== 'reading' && (
                              <button
                                onClick={() => {
                                  const nb = notebookMap.get(item.notebookId) || { id: item.notebookId, title: item.notebookTitle } as any;
                                  updateStatus({ title: item.bookTitle, volumes: item.volumes } as any, nb, 'reading', curVol);
                                }}
                                className="px-2 py-0.5 rounded-md border hover:opacity-100 opacity-80 cursor-pointer"
                                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: '#3b82f6' }}
                                title="Mark as Reading"
                              >
                                Read
                              </button>
                            )}
                            {item.status !== 'completed' && (
                              <button
                                onClick={() => {
                                  const nb = notebookMap.get(item.notebookId) || { id: item.notebookId, title: item.notebookTitle } as any;
                                  updateStatus({ title: item.bookTitle, volumes: item.volumes } as any, nb, 'completed', totalVols);
                                }}
                                className="px-2 py-0.5 rounded-md border hover:opacity-100 opacity-80 cursor-pointer"
                                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: '#10b981' }}
                                title="Mark as Completed"
                              >
                                Done
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar for multi-volume work */}
                        {totalVols > 1 && (
                          <div className="mb-2.5">
                            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.surface }}>
                              <div 
                                className="h-full rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${progressPct}%`,
                                  backgroundColor: item.status === 'completed' ? '#10b981' : currentTheme.accent
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Action buttons: Explore inside modal & NotebookLM link */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            id={`explore-book-btn-${item.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`}
                            onClick={() => handleOpenBook(item)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer shadow-2xs"
                            style={{ 
                              backgroundColor: currentTheme.surface, 
                              color: currentTheme.text,
                              border: `1px solid ${currentTheme.border}` 
                            }}
                          >
                            <Library className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
                            <span>{t('resumeReading')}</span>
                            <ChevronRight className="w-3 h-3 opacity-60" />
                          </button>

                          {item.notebookLink && (
                            <a
                              href={item.notebookLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-opacity hover:opacity-90"
                              style={{ 
                                backgroundColor: currentTheme.surface,
                                borderColor: currentTheme.border,
                                color: currentTheme.textMuted 
                              }}
                              title="Query in Google NotebookLM"
                            >
                              <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
