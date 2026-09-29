import React, { useState } from 'react';
import { BookOpen, Layers, Globe2, Sparkles, Compass, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { Notebook, ThemeConfig } from '../types';
import { LibraryDataVisualizer } from './LibraryDataVisualizer';
import { useLanguage } from '../context/LanguageContext';

interface StatsBannerProps {
  currentTheme: ThemeConfig;
  notebooks: Notebook[];
  totalNotebooks: number;
  totalBooks: number;
  totalCategories: number;
  arabicBooksCount: number;
  urduBooksCount: number;
  onSelectLanguage: (lang: 'all' | 'ar' | 'ur') => void;
  onOpenMasterBooks: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  currentTheme,
  notebooks,
  totalNotebooks,
  totalBooks,
  totalCategories,
  arabicBooksCount,
  urduBooksCount,
  onSelectLanguage,
  onOpenMasterBooks
}) => {
  const [showVisualizer, setShowVisualizer] = useState<boolean>(true);
  const { t, language } = useLanguage();

  return (
    <div 
      id="stats-banner-container"
      className="py-6 px-4 sm:px-6 lg:px-8 border-b"
      style={{ 
        backgroundColor: currentTheme.surface,
        borderColor: currentTheme.border
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl shrink-0">🕌</span>
              <h2 
                className="text-xl sm:text-2xl font-bold tracking-tight flex items-baseline flex-wrap gap-2"
                style={{ color: currentTheme.text }}
              >
                <span className="font-nastaleeq text-2xl sm:text-3xl font-normal leading-normal inline-block text-balance">
                  {language === 'ar' ? 'المكتبة السليمانية' : 'مکتبہ سلیمانیہ'}
                </span>
                <span 
                  className={`text-sm sm:text-base font-medium opacity-90 ${
                    language === 'ar' ? 'font-arabic' : language === 'ur' ? 'font-nastaleeq' : 'font-sans-custom'
                  }`}
                  style={{ color: currentTheme.textMuted }}
                >
                  - {language === 'en' 
                      ? 'Digital Islamic Library & AI Research Hubs' 
                      : language === 'ar' 
                      ? 'الرقمية وقواعد بحث الذكاء الاصطناعي' 
                      : 'ڈیجیٹل لائبریری اور اے آئی ریسرچ ہبس'}
                </span>
              </h2>
            </div>
            <p 
              className="text-xs sm:text-sm max-w-2xl font-normal leading-relaxed"
              style={{ color: currentTheme.textMuted }}
            >
              {t('bannerSubtitle')}
            </p>
          </div>

          {/* Quick Action Pill */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="toggle-analytics-btn"
              onClick={() => setShowVisualizer(!showVisualizer)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs hover:opacity-90"
              style={{ 
                backgroundColor: showVisualizer ? currentTheme.accent : currentTheme.surfaceSecondary,
                borderColor: currentTheme.accent,
                color: showVisualizer ? (currentTheme.mode === 'dark' ? '#000' : '#fff') : currentTheme.accent
              }}
              title={showVisualizer ? t('hideCharts') : t('showCharts')}
            >
              <BarChart2 className="w-4 h-4" />
              <span>{showVisualizer ? t('hideCharts') : t('showCharts')}</span>
              {showVisualizer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              id="browse-all-books-banner-btn"
              onClick={onOpenMasterBooks}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border shadow-xs hover:opacity-90"
              style={{ 
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border,
                color: currentTheme.text
              }}
            >
              <BookOpen className="w-4 h-4" style={{ color: currentTheme.primary }} />
              <span>{t('browseAllBooksBtn', { count: totalBooks.toLocaleString() })}</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Notebooks Count */}
          <div 
            id="stat-card-notebooks"
            className="p-3.5 rounded-xl border transition-all duration-150"
            style={{ 
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border 
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>
                {t('kpiHubsTitle')}
              </span>
              <Sparkles className="w-4 h-4" style={{ color: currentTheme.accent }} />
            </div>
            <div className="text-2xl font-extrabold" style={{ color: currentTheme.text }}>
              {totalNotebooks}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: currentTheme.textMuted }}>
              {t('kpiHubsDesc')}
            </div>
          </div>

          {/* Total Books */}
          <div 
            id="stat-card-books"
            onClick={onOpenMasterBooks}
            className="p-3.5 rounded-xl border transition-all duration-150 cursor-pointer hover:border-opacity-100"
            style={{ 
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border 
            }}
            title={t('browseAllBooksBtn', { count: totalBooks.toLocaleString() })}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>
                {t('kpiBooksTitle')}
              </span>
              <BookOpen className="w-4 h-4" style={{ color: currentTheme.primary }} />
            </div>
            <div className="text-2xl font-extrabold" style={{ color: currentTheme.text }}>
              {totalBooks.toLocaleString()}
            </div>
            <div className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: currentTheme.accent }}>
              <span>{t('browseAllBooksBtn', { count: totalBooks.toLocaleString() })} &rarr;</span>
            </div>
          </div>

          {/* Categories */}
          <div 
            id="stat-card-categories"
            className="p-3.5 rounded-xl border transition-all duration-150"
            style={{ 
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border 
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>
                {t('kpiDisciplinesTitle')}
              </span>
              <Layers className="w-4 h-4" style={{ color: currentTheme.accent }} />
            </div>
            <div className="text-2xl font-extrabold" style={{ color: currentTheme.text }}>
              {totalCategories}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: currentTheme.textMuted }}>
              {t('kpiDisciplinesDesc')}
            </div>
          </div>

          {/* Languages Distribution */}
          <div 
            id="stat-card-languages"
            className="p-3.5 rounded-xl border transition-all duration-150"
            style={{ 
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border 
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>
                {t('kpiLanguagesTitle')}
              </span>
              <Globe2 className="w-4 h-4" style={{ color: currentTheme.primary }} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => onSelectLanguage('ar')}
                className="text-xs px-2 py-1 rounded font-medium border transition-opacity hover:opacity-80 cursor-pointer"
                style={{ 
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.text
                }}
                title="Filter Arabic Sources"
              >
                {t('kpiArabicPill')}: {arabicBooksCount.toLocaleString()}
              </button>
              <button 
                onClick={() => onSelectLanguage('ur')}
                className="text-xs px-2 py-1 rounded font-medium border transition-opacity hover:opacity-80 cursor-pointer"
                style={{ 
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.text
                }}
                title="Filter Urdu Sources"
              >
                {t('kpiUrduPill')}: {urduBooksCount.toLocaleString()}
              </button>
            </div>
          </div>

        </div>

        {/* Data Visualization Section using Recharts */}
        {showVisualizer && (
          <LibraryDataVisualizer
            notebooks={notebooks}
            currentTheme={currentTheme}
          />
        )}

      </div>
    </div>
  );
};

