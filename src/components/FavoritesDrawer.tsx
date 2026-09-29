import React from 'react';
import { X, Bookmark, ExternalLink, Trash2, BookOpen, Sparkles } from 'lucide-react';
import { Notebook, ThemeConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Notebook[];
  currentTheme: ThemeConfig;
  onRemoveFavorite: (nbId: string) => void;
  onExploreBooks: (nb: Notebook) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  currentTheme,
  onRemoveFavorite,
  onExploreBooks
}) => {
  const { t, isRTL, dir } = useLanguage();

  if (!isOpen) return null;

  return (
    <div 
      id="favorites-drawer-overlay"
      className={`fixed inset-0 z-50 flex ${isRTL ? 'justify-start' : 'justify-end'} bg-black/50 backdrop-blur-xs animate-in fade-in duration-150`}
      onClick={onClose}
      dir={dir}
    >
      <div 
        id="favorites-drawer-panel"
        className={`w-full max-w-md h-full shadow-2xl flex flex-col overflow-hidden animate-in ${
          isRTL ? 'slide-in-from-left' : 'slide-in-from-right'
        } duration-200`}
        style={{ 
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
          borderLeft: isRTL ? 'none' : `1px solid ${currentTheme.border}`,
          borderRight: isRTL ? `1px solid ${currentTheme.border}` : 'none'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-5 border-b flex items-center justify-between gap-3 shrink-0"
          style={{ 
            backgroundColor: currentTheme.surfaceSecondary,
            borderColor: currentTheme.border 
          }}
        >
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 fill-current" style={{ color: currentTheme.accent }} />
            <h3 className="font-bold text-base sm:text-lg" style={{ color: currentTheme.text }}>
              {t('favDrawerTitle')} ({favorites.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border transition-colors cursor-pointer"
            style={{ 
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.border,
              color: currentTheme.textMuted 
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: currentTheme.textMuted }} />
              <p className="text-sm font-medium" style={{ color: currentTheme.textMuted }}>
                {t('favDrawerEmptyTitle')}
              </p>
              <p className="text-xs mt-1" style={{ color: currentTheme.textMuted }}>
                {t('favDrawerEmptyDesc')}
              </p>
            </div>
          ) : (
            favorites.map((nb) => (
              <div
                key={nb.id}
                className="p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all shadow-xs"
                style={{ 
                  backgroundColor: currentTheme.surfaceSecondary,
                  borderColor: currentTheme.border 
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <span className="text-lg shrink-0 mt-0.5">{nb.icon || '📚'}</span>
                    <div className="flex-1 min-w-0">
                      <span 
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ 
                          backgroundColor: currentTheme.surface,
                          color: currentTheme.accent,
                          border: `1px solid ${currentTheme.border}`
                        }}
                      >
                        {nb.cat}
                      </span>
                      <h4 
                        className="font-semibold text-sm mt-1 leading-snug truncate font-arabic"
                        style={{ color: currentTheme.text }}
                      >
                        {nb.title}
                      </h4>
                      <p className="text-xs mt-0.5" style={{ color: currentTheme.textMuted }}>
                        {(nb.books || []).length} {t('booksCount')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFavorite(nb.id)}
                    className="p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 text-red-400 hover:text-red-500"
                    style={{ 
                      backgroundColor: currentTheme.surface,
                      borderColor: currentTheme.border 
                    }}
                    title={t('favRemove')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onExploreBooks(nb);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 cursor-pointer"
                    style={{ 
                      backgroundColor: currentTheme.surface,
                      borderColor: currentTheme.border,
                      color: currentTheme.text 
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t('exploreBooks')}</span>
                  </button>

                  <a
                    href={nb.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1 shadow-xs transition-opacity hover:opacity-90"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('openNotebookLM')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div 
          className="p-3 border-t text-center text-xs"
          style={{ 
            backgroundColor: currentTheme.surfaceSecondary,
            borderColor: currentTheme.border,
            color: currentTheme.textMuted 
          }}
        >
          {isRTL ? 'يتم حفظ المفضلات تلقائياً وبأمان في متصفحك' : 'Favorites are securely saved in your browser\'s local cache.'}
        </div>
      </div>
    </div>
  );
};
