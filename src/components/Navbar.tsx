import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Bookmark, 
  Palette, 
  HelpCircle, 
  PlusCircle, 
  LayoutGrid, 
  FolderTree, 
  Library, 
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { ThemeConfig, ViewMode } from '../types';
import { THEMES } from '../theme/themes';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  currentTheme: ThemeConfig;
  onThemeSelect: (theme: ThemeConfig) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenGuide: () => void;
  onOpenAddModal: () => void;
  totalNotebooks: number;
  totalBooks: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onThemeSelect,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  favoritesCount,
  onOpenFavorites,
  onOpenGuide,
  onOpenAddModal,
  totalNotebooks,
  totalBooks
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const { t, isRTL, language } = useLanguage();

  return (
    <header 
      id="main-topbar"
      className="sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 border-b shadow-xs"
      style={{ 
        backgroundColor: currentTheme.mode === 'dark' 
          ? `${currentTheme.surface}f2` 
          : `${currentTheme.surface}f5`,
        borderColor: currentTheme.border
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm border font-arabic"
              style={{ 
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border,
                color: currentTheme.accent 
              }}
            >
              <span>س</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h1 
                  className="font-normal text-xl sm:text-2xl tracking-normal font-nastaleeq leading-snug"
                  style={{ color: currentTheme.text }}
                >
                  {t('brandTitle')}
                </h1>
                <span 
                  className="text-xs px-2.5 py-0.5 rounded-full font-normal font-nastaleeq"
                  style={{ 
                    backgroundColor: currentTheme.surfaceSecondary,
                    color: currentTheme.accent,
                    border: `1px solid ${currentTheme.border}`
                  }}
                >
                  {t('brandBadge')}
                </span>
              </div>
              <p 
                className="text-xs font-normal truncate max-w-[210px] md:max-w-xs"
                style={{ color: currentTheme.textMuted }}
              >
                {t('brandSubtitle')}
              </p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-1 sm:mx-2">
            <div className="relative">
              <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Search className="h-4 w-4" style={{ color: currentTheme.textMuted }} />
              </div>
              <input
                id="global-search-input"
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full ${isRTL ? 'pr-9 pl-8' : 'pl-9 pr-8'} py-2 text-sm rounded-lg border outline-hidden transition-all duration-150`}
                style={{ 
                  backgroundColor: currentTheme.surfaceSecondary,
                  borderColor: currentTheme.border,
                  color: currentTheme.text
                }}
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-2.5' : 'right-0 pr-2.5'} flex items-center cursor-pointer`}
                  title={t('clearSearch')}
                >
                  <X className="h-4 w-4 hover:opacity-80" style={{ color: currentTheme.textMuted }} />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* View Mode Switcher */}
            <div 
              className="hidden md:flex items-center rounded-lg p-0.5 border"
              style={{ 
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border 
              }}
            >
              <button
                id="view-grid-btn"
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: viewMode === 'grid' ? currentTheme.surface : 'transparent',
                  color: viewMode === 'grid' ? currentTheme.accent : currentTheme.text
                }}
                title={t('viewHubs')}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden lg:inline">{t('viewHubs')}</span>
              </button>

              <button
                id="view-grouped-btn"
                onClick={() => onViewModeChange('grouped')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'grouped' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: viewMode === 'grouped' ? currentTheme.surface : 'transparent',
                  color: viewMode === 'grouped' ? currentTheme.accent : currentTheme.text
                }}
                title={t('viewCategories')}
              >
                <FolderTree className="w-4 h-4" />
                <span className="hidden lg:inline">{t('viewCategories')}</span>
              </button>

              <button
                id="view-master-books-btn"
                onClick={() => onViewModeChange('masterBooks')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'masterBooks' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: viewMode === 'masterBooks' ? currentTheme.surface : 'transparent',
                  color: viewMode === 'masterBooks' ? currentTheme.accent : currentTheme.text
                }}
                title={t('viewAllBooks')}
              >
                <Library className="w-4 h-4" />
                <span className="hidden lg:inline">{t('viewAllBooks')}</span>
              </button>
            </div>

            {/* Language Switcher Component */}
            <LanguageSwitcher currentTheme={currentTheme} />

            {/* Favorites Drawer Toggle */}
            <button
              id="favorites-toggle-btn"
              onClick={onOpenFavorites}
              className="relative p-2 rounded-lg border transition-all duration-150 cursor-pointer hover:opacity-90 flex items-center gap-1 text-xs"
              style={{ 
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border,
                color: currentTheme.text 
              }}
              title={t('favoritesTitle')}
            >
              <Bookmark className="w-4 h-4" style={{ color: favoritesCount > 0 ? currentTheme.accent : currentTheme.textMuted }} />
              {favoritesCount > 0 && (
                <span 
                  className="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: currentTheme.accent, color: currentTheme.mode === 'dark' ? '#000' : '#fff' }}
                >
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Theme Picker Dropdown */}
            <div className="relative">
              <button
                id="theme-picker-btn"
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="p-2 rounded-lg border transition-all duration-150 cursor-pointer flex items-center gap-1"
                style={{ 
                  backgroundColor: currentTheme.surfaceSecondary,
                  borderColor: currentTheme.border,
                  color: currentTheme.text 
                }}
                title={t('themePickerTitle')}
              >
                <Palette className="w-4 h-4" style={{ color: currentTheme.accent }} />
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showThemePicker && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowThemePicker(false)} 
                  />
                  <div 
                    id="theme-dropdown-menu"
                    className={`absolute mt-2 w-56 rounded-xl border shadow-xl z-50 p-2 text-xs ${
                      isRTL ? 'left-0' : 'right-0'
                    }`}
                    style={{ 
                      backgroundColor: currentTheme.surface,
                      borderColor: currentTheme.border 
                    }}
                  >
                    <div className="px-2 py-1.5 font-semibold text-xs border-b mb-1" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                      {t('selectTheme')}
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {THEMES.map((tItem) => (
                        <button
                          key={tItem.id}
                          id={`theme-select-${tItem.id}`}
                          onClick={() => {
                            onThemeSelect(tItem);
                            setShowThemePicker(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                            currentTheme.id === tItem.id ? 'font-semibold' : 'hover:opacity-80'
                          }`}
                          style={{ 
                            backgroundColor: currentTheme.id === tItem.id ? currentTheme.surfaceSecondary : 'transparent',
                            color: currentTheme.text 
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border"
                              style={{ backgroundColor: tItem.primary, borderColor: tItem.accent }}
                            />
                            <span>{tItem.name}</span>
                          </div>
                          <span 
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: currentTheme.border, color: currentTheme.textMuted }}
                          >
                            {tItem.mode}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* "How to Build This" Guide Button */}
            <button
              id="how-to-build-btn"
              onClick={onOpenGuide}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg border font-medium text-xs flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-xs"
              style={{ 
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.accent,
                color: currentTheme.accent 
              }}
              title={t('howItWorks')}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('howItWorks')}</span>
            </button>

            {/* Add Custom Notebook Button */}
            <button
              id="add-notebook-btn"
              onClick={onOpenAddModal}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 text-white transition-all duration-150 cursor-pointer shadow-sm"
              style={{ backgroundColor: currentTheme.primary }}
              title={t('addHub')}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('addHub')}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
