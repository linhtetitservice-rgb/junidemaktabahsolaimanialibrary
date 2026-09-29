import React, { useState } from 'react';
import { 
  ExternalLink, 
  BookOpen, 
  Bookmark, 
  Share2, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { Notebook, ThemeConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NotebookCardProps {
  notebook: Notebook;
  currentTheme: ThemeConfig;
  isFavorite: boolean;
  onToggleFavorite: (nb: Notebook) => void;
  onExploreBooks: (nb: Notebook) => void;
}

export const NotebookCard: React.FC<NotebookCardProps> = ({
  notebook,
  currentTheme,
  isFavorite,
  onToggleFavorite,
  onExploreBooks
}) => {
  const [copied, setCopied] = useState(false);
  const { t, language } = useLanguage();
  const bookCount = (notebook.books || []).length;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(notebook.link || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isArabic = notebook.titleLang === 'ar' || /[\u0600-\u06FF]/.test(notebook.title);
  const isUrdu = notebook.titleLang === 'ur';

  return (
    <div
      id={`notebook-card-${notebook.id}`}
      className="rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 group"
      style={{
        backgroundColor: currentTheme.cardBg,
        borderColor: currentTheme.border
      }}
    >
      {/* Top Banner / Category strip */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 shadow-xs border"
              style={{ 
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border
              }}
            >
              {notebook.icon || '📚'}
            </span>
            <span 
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full truncate max-w-[180px]"
              style={{ 
                backgroundColor: currentTheme.surfaceSecondary,
                color: currentTheme.accent,
                border: `1px solid ${currentTheme.border}`
              }}
            >
              {notebook.cat}
            </span>
          </div>

          {/* Top Right Quick Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              id={`fav-btn-${notebook.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(notebook);
              }}
              className="p-1.5 rounded-lg border transition-colors cursor-pointer"
              style={{
                backgroundColor: isFavorite ? currentTheme.surfaceSecondary : 'transparent',
                borderColor: isFavorite ? currentTheme.accent : currentTheme.border,
                color: isFavorite ? currentTheme.accent : currentTheme.textMuted
              }}
              title={isFavorite ? t('favRemove') : t('bookmark')}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              id={`copy-btn-${notebook.id}`}
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg border transition-colors cursor-pointer"
              style={{
                backgroundColor: 'transparent',
                borderColor: currentTheme.border,
                color: currentTheme.textMuted
              }}
              title={copied ? t('linkCopied') : t('copyLink')}
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Notebook Title */}
        <h3 
          className={`font-semibold text-base sm:text-lg line-clamp-2 leading-relaxed tracking-tight ${
            isUrdu ? 'font-urdu' : isArabic ? 'font-arabic text-xl' : 'font-sans-custom'
          }`}
          style={{ color: currentTheme.text }}
          dir={isArabic || isUrdu ? 'auto' : 'ltr'}
        >
          {notebook.title}
        </h3>

        {notebook.libTitle && notebook.libTitle !== notebook.title && (
          <p 
            className="text-xs mt-1 truncate font-medium font-arabic"
            style={{ color: currentTheme.accent }}
          >
            {notebook.libTitle}
          </p>
        )}

        {/* Description */}
        {notebook.desc && (
          <p 
            className="text-xs mt-2 line-clamp-2 leading-normal"
            style={{ color: currentTheme.textMuted }}
          >
            {notebook.desc}
          </p>
        )}

        {/* Keywords */}
        {notebook.keywords && notebook.keywords.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {notebook.keywords.slice(0, 3).map((kw, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: currentTheme.surfaceSecondary,
                  color: currentTheme.textMuted
                }}
              >
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div 
        className="px-4 sm:px-5 py-3 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5"
        style={{ 
          backgroundColor: currentTheme.surfaceSecondary,
          borderColor: currentTheme.border 
        }}
      >
        {/* Book count badge */}
        <button
          id={`explore-books-badge-${notebook.id}`}
          onClick={() => onExploreBooks(notebook)}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer transition-all hover:opacity-90"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.border,
            color: currentTheme.text
          }}
          title={t('exploreBooks')}
        >
          <BookOpen className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
          <span className={language === 'ar' ? 'font-arabic' : language === 'ur' ? 'font-urdu' : ''}>
            {bookCount > 0 ? `${bookCount} ${t('booksCount')}` : t('exploreBooks')}
          </span>
        </button>

        {/* Open in NotebookLM Button */}
        <a
          id={`open-notebooklm-${notebook.id}`}
          href={notebook.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-white transition-all shadow-xs hover:opacity-90 active:scale-95"
          style={{ backgroundColor: currentTheme.primary }}
          title={t('openNotebookLM')}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className={language === 'ar' ? 'font-arabic' : language === 'ur' ? 'font-urdu' : ''}>
            {t('openNotebookLM')}
          </span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>
    </div>
  );
};
