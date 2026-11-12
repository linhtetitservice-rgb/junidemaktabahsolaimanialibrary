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
  ChevronDown,
  LogIn,
  LogOut,
  User as UserIcon,
  Cloud,
  Loader2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ThemeConfig, ViewMode } from '../types';
import { THEMES } from '../theme/themes';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
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
  onOpenAdminDashboard?: () => void;
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
  onOpenAdminDashboard,
  totalNotebooks,
  totalBooks
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { t, isRTL, language } = useLanguage();
  const { user, isAdmin, loading: authLoading, signIn, signOut, isCloudSyncing } = useAuth();

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
              className="relative h-9 px-2.5 rounded-lg border transition-all duration-150 cursor-pointer hover:opacity-90 flex items-center justify-center gap-1 text-xs shrink-0"
              style={{ 
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border,
                color: currentTheme.text 
              }}
              title={t('favoritesTitle')}
            >
              <Bookmark className="w-4 h-4 shrink-0" style={{ color: favoritesCount > 0 ? currentTheme.accent : currentTheme.textMuted }} />
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
            <div className="relative shrink-0">
              <button
                id="theme-picker-btn"
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="h-9 px-2 sm:px-2.5 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-center gap-1"
                style={{ 
                  backgroundColor: currentTheme.surfaceSecondary,
                  borderColor: currentTheme.border,
                  color: currentTheme.text 
                }}
                title={t('themePickerTitle')}
              >
                <Palette className="w-4 h-4 shrink-0" style={{ color: currentTheme.accent }} />
                <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
              </button>

              {showThemePicker && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowThemePicker(false)} 
                  />
                  <div 
                    id="theme-dropdown-menu"
                    className={`absolute mt-2 w-72 sm:w-80 rounded-2xl border shadow-2xl z-50 p-2.5 text-xs ${
                      isRTL ? 'left-0' : 'right-0'
                    }`}
                    style={{ 
                      backgroundColor: currentTheme.surface,
                      borderColor: currentTheme.border 
                    }}
                  >
                    <div className="px-2.5 py-2 font-bold text-xs border-b mb-1 flex items-center justify-between" style={{ borderColor: currentTheme.border, color: currentTheme.text }}>
                      <span>{t('selectTheme')}</span>
                      <span className="text-[10px] font-normal opacity-70">12 Presets</span>
                    </div>
                    <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                      {THEMES.map((tItem) => (
                        <button
                          key={tItem.id}
                          id={`theme-select-${tItem.id}`}
                          onClick={() => {
                            onThemeSelect(tItem);
                            setShowThemePicker(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                            currentTheme.id === tItem.id ? 'font-bold shadow-xs' : 'hover:opacity-85'
                          }`}
                          style={{ 
                            backgroundColor: currentTheme.id === tItem.id ? currentTheme.surfaceSecondary : 'transparent',
                            color: currentTheme.text 
                          }}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Dual Color Swatch Dot: background & primary/accent */}
                            <div className="flex items-center -space-x-1 shrink-0">
                              <span 
                                className="w-4 h-4 rounded-full border shadow-2xs"
                                style={{ backgroundColor: tItem.bg, borderColor: tItem.border }}
                              />
                              <span 
                                className="w-4 h-4 rounded-full border shadow-2xs"
                                style={{ backgroundColor: tItem.primary, borderColor: tItem.accent }}
                              />
                            </div>
                            <span className="truncate text-xs">{tItem.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <span 
                              className="text-[10px] px-1.5 py-0.5 rounded capitalize font-medium"
                              style={{ backgroundColor: currentTheme.border, color: currentTheme.textMuted }}
                            >
                              {tItem.mode}
                            </span>
                            {currentTheme.id === tItem.id && (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </div>
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
              className="h-9 px-2.5 sm:px-3 rounded-lg border font-medium text-xs flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-xs hover:opacity-90"
              style={{ 
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.accent,
                color: currentTheme.accent 
              }}
              title={t('howItWorks')}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{t('howItWorks')}</span>
            </button>

            {/* Admin Dashboard Button (Only for linhtetitservice@gmail.com) */}
            {isAdmin && onOpenAdminDashboard && (
              <button
                id="admin-dashboard-btn"
                onClick={onOpenAdminDashboard}
                className="h-9 px-2.5 sm:px-3 rounded-lg font-bold text-xs flex items-center gap-1.5 text-white transition-all duration-150 cursor-pointer shadow-md hover:opacity-95 active:scale-98 bg-linear-to-r from-purple-600 to-indigo-600 border border-purple-400/40 animate-pulse"
                title={t('adminDashboard')}
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-300" />
                <span className="hidden sm:inline">{t('adminDashboard')}</span>
              </button>
            )}

            {/* Add Custom Notebook Button */}
            <button
              id="add-notebook-btn"
              onClick={onOpenAddModal}
              className="h-9 px-2.5 sm:px-3 rounded-lg font-medium text-xs flex items-center gap-1.5 text-white transition-all duration-150 cursor-pointer shadow-sm hover:opacity-90 active:scale-98"
              style={{ backgroundColor: currentTheme.primary }}
              title={t('addHub')}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{t('addHub')}</span>
            </button>

            {/* Firebase Auth & Cloud Sync Control */}
            <div className="relative shrink-0">
              {authLoading ? (
                <div 
                  className="h-9 w-9 rounded-lg border flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                >
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              ) : !user ? (
                <button
                  id="google-signin-btn"
                  onClick={signIn}
                  className="h-9 px-2.5 sm:px-3 rounded-lg border font-medium text-xs flex items-center gap-2 transition-all duration-150 cursor-pointer shadow-xs hover:opacity-90"
                  style={{ 
                    backgroundColor: currentTheme.surfaceSecondary,
                    borderColor: currentTheme.border,
                    color: currentTheme.text 
                  }}
                  title={t('signInWithGoogle')}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="hidden md:inline">{t('signInWithGoogle')}</span>
                </button>
              ) : (
                <>
                  <button
                    id="user-profile-menu-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="h-9 px-2 rounded-lg border transition-all duration-150 cursor-pointer flex items-center gap-1.5 hover:opacity-90"
                    style={{ 
                      backgroundColor: currentTheme.surfaceSecondary,
                      borderColor: currentTheme.border,
                      color: currentTheme.text 
                    }}
                    title={user.displayName || user.email || t('account')}
                  >
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'Avatar'} 
                        className="w-5 h-5 rounded-full object-cover shrink-0" 
                      />
                    ) : (
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: currentTheme.primary }}
                      >
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden xl:inline text-xs font-medium max-w-[100px] truncate">
                      {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <div className="relative flex items-center">
                      <Cloud className={`w-3.5 h-3.5 ${isCloudSyncing ? 'text-amber-400 animate-pulse' : 'text-emerald-500'}`} />
                    </div>
                    <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                  </button>

                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)} 
                      />
                      <div 
                        id="user-dropdown-menu"
                        className={`absolute mt-2 w-64 rounded-xl border shadow-xl z-50 p-3 text-xs ${
                          isRTL ? 'left-0' : 'right-0'
                        }`}
                        style={{ 
                          backgroundColor: currentTheme.surface,
                          borderColor: currentTheme.border 
                        }}
                      >
                        <div className="flex items-center gap-2.5 pb-2.5 border-b mb-2" style={{ borderColor: currentTheme.border }}>
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                          ) : (
                            <div 
                              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                              style={{ backgroundColor: currentTheme.primary }}
                            >
                              {(user.displayName || user.email || 'U')[0].toUpperCase()}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs truncate" style={{ color: currentTheme.text }}>
                              {user.displayName || 'Maktaba Researcher'}
                            </div>
                            <div className="text-[11px] truncate" style={{ color: currentTheme.textMuted }}>
                              {user.email}
                            </div>
                          </div>
                        </div>

                        {/* Cloud Sync Status */}
                        <div 
                          className="p-2 rounded-lg border mb-2 flex items-center justify-between"
                          style={{ 
                            backgroundColor: currentTheme.surfaceSecondary,
                            borderColor: currentTheme.border 
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <Cloud className={`w-4 h-4 ${isCloudSyncing ? 'text-amber-400 animate-spin' : 'text-emerald-500'}`} />
                            <span className="text-[11px] font-medium" style={{ color: currentTheme.text }}>
                              {isCloudSyncing ? t('cloudSyncing') : t('cloudSyncActive')}
                            </span>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
                        </div>

                        {/* Admin Dashboard shortcut if admin */}
                        {isAdmin && onOpenAdminDashboard && (
                          <button
                            id="user-menu-admin-btn"
                            onClick={() => {
                              onOpenAdminDashboard();
                              setShowUserMenu(false);
                            }}
                            className="w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer mb-1.5 font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-500" />
                            <span>{t('adminDashboard')}</span>
                          </button>
                        )}

                        {/* Sign Out Action */}
                        <button
                          onClick={() => {
                            signOut();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-red-500 hover:bg-red-500/10 font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('signOut')}</span>
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
