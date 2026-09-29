import React from 'react';
import { ThemeConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoryPillsProps {
  currentTheme: ThemeConfig;
  categories: { name: string; count: number; booksCount: number }[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  totalAllNotebooks: number;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  currentTheme,
  categories,
  selectedCategory,
  onSelectCategory,
  totalAllNotebooks
}) => {
  const { t, language } = useLanguage();

  return (
    <div 
      id="category-pills-bar"
      className="py-3 px-4 sm:px-6 lg:px-8 border-b overflow-x-auto no-scrollbar"
      style={{ 
        backgroundColor: currentTheme.surface,
        borderColor: currentTheme.border
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        
        {/* All Categories pill */}
        <button
          id="pill-cat-all"
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
            selectedCategory === 'all' ? 'shadow-xs scale-[1.02]' : 'opacity-80 hover:opacity-100'
          }`}
          style={{ 
            backgroundColor: selectedCategory === 'all' ? currentTheme.accent : currentTheme.surfaceSecondary,
            borderColor: selectedCategory === 'all' ? currentTheme.accent : currentTheme.border,
            color: selectedCategory === 'all' ? (currentTheme.mode === 'dark' ? '#000' : '#fff') : currentTheme.text
          }}
        >
          <span className={language === 'ar' ? 'font-arabic' : language === 'ur' ? 'font-urdu' : ''}>
            {t('allDisciplines')}
          </span>
          <span 
            className="text-[10px] px-1.5 py-0.2 rounded-full font-bold"
            style={{ 
              backgroundColor: selectedCategory === 'all' 
                ? (currentTheme.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)')
                : currentTheme.border,
              color: 'inherit'
            }}
          >
            {totalAllNotebooks}
          </span>
        </button>

        {/* Dynamic Category Pills */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              id={`pill-cat-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSelected ? 'shadow-xs scale-[1.02]' : 'opacity-80 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: isSelected ? currentTheme.accent : currentTheme.surfaceSecondary,
                borderColor: isSelected ? currentTheme.accent : currentTheme.border,
                color: isSelected ? (currentTheme.mode === 'dark' ? '#000' : '#fff') : currentTheme.text
              }}
            >
              <span>{cat.name}</span>
              <span 
                className="text-[10px] px-1.5 py-0.2 rounded-full font-bold"
                style={{ 
                  backgroundColor: isSelected 
                    ? (currentTheme.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)')
                    : currentTheme.border,
                  color: 'inherit'
                }}
              >
                {cat.count}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
};
