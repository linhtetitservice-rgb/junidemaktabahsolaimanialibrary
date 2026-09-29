import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { CategoryPills } from './components/CategoryPills';
import { NotebookCard } from './components/NotebookCard';
import { BookExplorerModal } from './components/BookExplorerModal';
import { MasterBooksView } from './components/MasterBooksView';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { DeveloperGuideModal } from './components/DeveloperGuideModal';
import { AddNotebookModal } from './components/AddNotebookModal';
import { RecentlyViewedSection } from './components/RecentlyViewedSection';
import { SEED_NOTEBOOKS } from './data/seedNotebooks';
import { THEMES } from './theme/themes';
import { Notebook, ThemeConfig, ViewMode, LanguageFilter } from './types';
import { useLanguage } from './context/LanguageContext';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  FolderTree, 
  SlidersHorizontal,
  ChevronDown,
  Layers
} from 'lucide-react';

export default function App() {
  const { t, language, isRTL, dir } = useLanguage();

  // Theme state persisted in localStorage
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    try {
      const savedTheme = localStorage.getItem('alturath_theme');
      if (savedTheme) {
        const found = THEMES.find((t) => t.id === savedTheme);
        if (found) return found;
      }
    } catch (e) {
      console.warn('Could not read theme from localStorage:', e);
    }
    return THEMES[0]; // Emerald Night
  });

  // Notebooks state
  const [notebooks, setNotebooks] = useState<Notebook[]>(SEED_NOTEBOOKS);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<'default' | 'title' | 'books-desc'>('default');

  // Modals & Drawers
  const [selectedNotebookForBooks, setSelectedNotebookForBooks] = useState<Notebook | null>(null);
  const [selectedBookTitleForModal, setSelectedBookTitleForModal] = useState<string | undefined>(undefined);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenNotebookBooks = (nb: Notebook, bookTitle?: string) => {
    setSelectedNotebookForBooks(nb);
    setSelectedBookTitleForModal(bookTitle);
  };

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<Notebook[]>(() => {
    try {
      const saved = localStorage.getItem('alturath_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load complete notebooks dataset (84 hubs, 14,700+ books)
  useEffect(() => {
    let isMounted = true;
    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const jsonUrl = `${cleanBase}notebooks-data.json`;

    fetch(jsonUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load JSON');
        return res.json();
      })
      .then((data: Notebook[]) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setNotebooks(data);
          setIsLoadingData(false);
        }
      })
      .catch((err) => {
        console.warn('Using seed data as fallback:', err);
        if (isMounted) setIsLoadingData(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Save theme & favorites to localStorage
  const handleThemeSelect = (theme: ThemeConfig) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem('alturath_theme', theme.id);
    } catch (e) {
      console.warn('Could not save theme to localStorage:', e);
    }
  };

  const handleToggleFavorite = (nb: Notebook) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === nb.id);
      let updated: Notebook[];
      if (exists) {
        updated = prev.filter((item) => item.id !== nb.id);
      } else {
        updated = [...prev, nb];
      }
      try {
        localStorage.setItem('alturath_favorites', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save favorites to localStorage:', e);
      }
      return updated;
    });
  };

  const handleRemoveFavorite = (nbId: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((item) => item.id !== nbId);
      try {
        localStorage.setItem('alturath_favorites', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not update favorites in localStorage:', e);
      }
      return updated;
    });
  };

  const handleAddNotebook = (newNb: Notebook) => {
    setNotebooks((prev) => [newNb, ...prev]);
  };

  const handleImportNotebooks = (newNbs: Notebook[]) => {
    setNotebooks(newNbs);
  };

  // Compute stats
  const { totalBooks, arabicBooksCount, urduBooksCount } = useMemo(() => {
    let booksCount = 0;
    let arCount = 0;
    let urCount = 0;

    notebooks.forEach((nb) => {
      const bList = nb.books || [];
      booksCount += bList.length;
      bList.forEach((b) => {
        if (b.lang === 'ur' || nb.titleLang === 'ur') {
          urCount++;
        } else {
          arCount++;
        }
      });
    });

    return {
      totalBooks: booksCount,
      arabicBooksCount: arCount,
      urduBooksCount: urCount
    };
  }, [notebooks]);

  // Categories list with counts
  const categoriesStats = useMemo(() => {
    const map = new Map<string, { count: number; booksCount: number }>();
    notebooks.forEach((nb) => {
      const cat = nb.cat || 'General';
      const existing = map.get(cat) || { count: 0, booksCount: 0 };
      existing.count += 1;
      existing.booksCount += (nb.books || []).length;
      map.set(cat, existing);
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        booksCount: data.booksCount
      }))
      .sort((a, b) => b.count - a.count);
  }, [notebooks]);

  // Filter & Sort notebooks
  const filteredNotebooks = useMemo(() => {
    return notebooks.filter((nb) => {
      // Category filter
      if (selectedCategory !== 'all' && nb.cat !== selectedCategory) {
        return false;
      }

      // Language filter
      if (languageFilter !== 'all') {
        const isUr = nb.titleLang === 'ur';
        if (languageFilter === 'ur' && !isUr) return false;
        if (languageFilter === 'ar' && isUr) return false;
      }

      // Search Query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const titleMatch = nb.title?.toLowerCase().includes(q);
      const catMatch = nb.cat?.toLowerCase().includes(q);
      const descMatch = nb.desc?.toLowerCase().includes(q);
      const kwMatch = nb.keywords?.some((k) => k.toLowerCase().includes(q));
      const bookMatch = nb.books?.some(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q)
      );

      return titleMatch || catMatch || descMatch || kwMatch || bookMatch;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'books-desc') {
        return (b.books?.length || 0) - (a.books?.length || 0);
      }
      return 0;
    });
  }, [notebooks, selectedCategory, languageFilter, searchQuery, sortBy]);

  // Grouped by Category map
  const groupedByCategory = useMemo(() => {
    const groups: { [cat: string]: Notebook[] } = {};
    filteredNotebooks.forEach((nb) => {
      const c = nb.cat || 'Other Sciences';
      if (!groups[c]) groups[c] = [];
      groups[c].push(nb);
    });
    return groups;
  }, [filteredNotebooks]);

  return (
    <div 
      id="app-root" 
      className="min-h-screen flex flex-col font-sans-custom transition-colors duration-200"
      style={{ 
        backgroundColor: currentTheme.bg,
        color: currentTheme.text 
      }}
    >
      {/* Top Navbar */}
      <Navbar
        currentTheme={currentTheme}
        onThemeSelect={handleThemeSelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        totalNotebooks={notebooks.length}
        totalBooks={totalBooks}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Banner with Stats & KPIs */}
        <StatsBanner
          currentTheme={currentTheme}
          notebooks={notebooks}
          totalNotebooks={notebooks.length}
          totalBooks={totalBooks}
          totalCategories={categoriesStats.length}
          arabicBooksCount={arabicBooksCount}
          urduBooksCount={urduBooksCount}
          onSelectLanguage={(lang) => {
            setLanguageFilter(lang);
            setViewMode('grid');
          }}
          onOpenMasterBooks={() => setViewMode('masterBooks')}
        />

        {/* View Mode Router */}
        {viewMode === 'masterBooks' ? (
          <MasterBooksView
            notebooks={notebooks}
            currentTheme={currentTheme}
            onExploreNotebook={handleOpenNotebookBooks}
          />
        ) : (
          <>
            {/* Recently Viewed & Reading Progress Shelf */}
            <RecentlyViewedSection
              currentTheme={currentTheme}
              allNotebooks={notebooks}
              onOpenNotebookBooks={handleOpenNotebookBooks}
            />

            {/* Category horizontal scrolling filter bar */}
            <CategoryPills
              currentTheme={currentTheme}
              categories={categoriesStats}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              totalAllNotebooks={notebooks.length}
            />

            {/* Hubs Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              
              {/* Controls bar: Results count, Language pill, Sort dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: currentTheme.text }}>
                    {filteredNotebooks.length === 1 
                      ? t('singleNotebookAvailable') 
                      : t('notebooksAvailable', { count: filteredNotebooks.length.toLocaleString() })}
                  </span>
                  {searchQuery && (
                    <span className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: currentTheme.surfaceSecondary, color: currentTheme.accent }}>
                      {t('matchingQuery', { query: searchQuery })}
                    </span>
                  )}
                  {isLoadingData && (
                    <span className="text-xs text-amber-500 animate-pulse font-medium">
                      {t('loadingCatalog')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Language filter buttons */}
                  <div className="flex items-center rounded-lg border p-0.5 text-xs" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                    {(['all', 'ar', 'ur'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguageFilter(lang)}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          languageFilter === lang ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: languageFilter === lang ? currentTheme.accent : 'transparent',
                          color: languageFilter === lang ? (currentTheme.mode === 'dark' ? '#000' : '#fff') : currentTheme.text
                        }}
                      >
                        {lang === 'all' ? t('filterAllLangs') : lang === 'ar' ? t('filterArabic') : t('filterUrdu')}
                      </button>
                    ))}
                  </div>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-1 text-xs">
                    <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: currentTheme.textMuted }} />
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-2.5 py-1.5 rounded-lg border text-xs outline-hidden"
                      style={{ 
                        backgroundColor: currentTheme.surface,
                        borderColor: currentTheme.border,
                        color: currentTheme.text 
                      }}
                    >
                      <option value="default">{t('sortDefault')}</option>
                      <option value="title">{t('sortAlphabetical')}</option>
                      <option value="books-desc">{t('sortMostBooks')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* View Rendering: Grid vs Grouped */}
              {viewMode === 'grid' ? (
                filteredNotebooks.length === 0 ? (
                  <div className="text-center py-20 rounded-2xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: currentTheme.textMuted }} />
                    <h3 className="text-base font-bold mb-1" style={{ color: currentTheme.text }}>{t('noNotebooksTitle')}</h3>
                    <p className="text-xs max-w-sm mx-auto" style={{ color: currentTheme.textMuted }}>
                      {t('noNotebooksDesc')}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setLanguageFilter('all');
                      }}
                      className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer shadow-xs"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      {t('resetFiltersBtn')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {filteredNotebooks.map((nb) => (
                      <NotebookCard
                        key={nb.id}
                        notebook={nb}
                        currentTheme={currentTheme}
                        isFavorite={favorites.some((f) => f.id === nb.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onExploreBooks={(n) => handleOpenNotebookBooks(n)}
                      />
                    ))}
                  </div>
                )
              ) : (
                /* Grouped by Category View */
                <div className="space-y-8">
                  {Object.keys(groupedByCategory).length === 0 ? (
                    <div className="text-center py-20 rounded-2xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                      <p className="text-sm" style={{ color: currentTheme.textMuted }}>No collections in this category.</p>
                    </div>
                  ) : (
                    Object.entries(groupedByCategory).map(([catName, nbs]) => (
                      <div key={catName} className="space-y-3">
                        <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: currentTheme.border }}>
                          <FolderTree className="w-5 h-5" style={{ color: currentTheme.accent }} />
                          <h3 className="font-bold text-lg" style={{ color: currentTheme.text }}>
                            {catName}
                          </h3>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ 
                              backgroundColor: currentTheme.surfaceSecondary,
                              color: currentTheme.accent,
                              border: `1px solid ${currentTheme.border}`
                            }}
                          >
                            {nbs.length} {nbs.length === 1 ? 'Hub' : 'Hubs'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {nbs.map((nb) => (
                            <NotebookCard
                              key={nb.id}
                              notebook={nb}
                              currentTheme={currentTheme}
                              isFavorite={favorites.some((f) => f.id === nb.id)}
                              onToggleFavorite={handleToggleFavorite}
                              onExploreBooks={(n) => handleOpenNotebookBooks(n)}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <footer 
        id="app-footer"
        className="mt-12 py-8 px-4 sm:px-6 lg:px-8 border-t text-center text-xs"
        style={{ 
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
          color: currentTheme.textMuted 
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-normal font-nastaleeq text-lg" style={{ color: currentTheme.text }}>
              {t('footerTitle')}
            </span>
            <span>•</span>
            <span>{t('footerDesc')}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="font-medium hover:underline cursor-pointer"
              style={{ color: currentTheme.accent }}
            >
              {t('howItWasBuiltFooter')}
            </button>
            <span>•</span>
            <a 
              href="https://notebooklm.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline flex items-center gap-1"
            >
              <span>{t('poweredByGoogle')}</span>
              <Sparkles className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Book Explorer Modal Drawer */}
      <BookExplorerModal
        notebook={selectedNotebookForBooks}
        currentTheme={currentTheme}
        onClose={() => {
          setSelectedNotebookForBooks(null);
          setSelectedBookTitleForModal(undefined);
        }}
        initialBookTitle={selectedBookTitleForModal}
      />

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        currentTheme={currentTheme}
        onRemoveFavorite={handleRemoveFavorite}
        onExploreBooks={(nb) => handleOpenNotebookBooks(nb)}
      />

      {/* Developer Architecture Guide Modal */}
      <DeveloperGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentTheme={currentTheme}
      />

      {/* Add Custom Notebook Modal */}
      <AddNotebookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        currentTheme={currentTheme}
        onAddNotebook={handleAddNotebook}
        allNotebooks={notebooks}
        onImportNotebooks={handleImportNotebooks}
      />

    </div>
  );
}
