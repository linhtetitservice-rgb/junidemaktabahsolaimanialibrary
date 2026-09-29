import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { ThemeConfig, AppLanguage } from '../types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  currentTheme: ThemeConfig;
  variant?: 'dropdown' | 'pills';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentTheme,
  variant = 'dropdown'
}) => {
  const { language, setLanguage, currentOption, t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'pills') {
    return (
      <div 
        className="flex items-center p-0.5 rounded-lg border text-xs"
        style={{ 
          backgroundColor: currentTheme.surface, 
          borderColor: currentTheme.border 
        }}
        role="group"
        aria-label="Language selection"
      >
        {LANGUAGE_OPTIONS.map((opt) => {
          const isSelected = language === opt.code;
          return (
            <button
              key={opt.code}
              id={`lang-pill-${opt.code}`}
              onClick={() => setLanguage(opt.code)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isSelected ? currentTheme.accent : 'transparent',
                color: isSelected 
                  ? (currentTheme.mode === 'dark' ? '#000' : '#fff') 
                  : currentTheme.text
              }}
              aria-pressed={isSelected}
            >
              <span>{opt.flag}</span>
              <span className={opt.code === 'ar' ? 'font-arabic' : opt.code === 'ur' ? 'font-urdu' : ''}>
                {opt.nativeLabel}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="language-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-2 rounded-lg border transition-all duration-150 cursor-pointer flex items-center gap-1.5 text-xs font-semibold hover:opacity-90 shadow-xs"
        style={{ 
          backgroundColor: currentTheme.surfaceSecondary,
          borderColor: isOpen ? currentTheme.accent : currentTheme.border,
          color: currentTheme.text 
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('languageSwitcher')}
        title={t('languageSwitcher')}
      >
        <Globe className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
        <span>{currentOption.flag}</span>
        <span className="hidden sm:inline font-medium">
          {currentOption.nativeLabel}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60 transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </button>

      {isOpen && (
        <div 
          id="language-dropdown-menu"
          className={`absolute mt-2 w-44 rounded-xl border shadow-xl z-50 p-1.5 text-xs ${
            isRTL ? 'left-0' : 'right-0'
          }`}
          style={{ 
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.border 
          }}
          role="menu"
        >
          <div 
            className="px-2.5 py-1.5 font-semibold text-[11px] border-b mb-1 flex items-center justify-between"
            style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}
          >
            <span>{t('languageSwitcher')}</span>
            <span className="text-[10px] uppercase font-mono">{language}</span>
          </div>

          <div className="space-y-0.5">
            {LANGUAGE_OPTIONS.map((opt) => {
              const isSelected = language === opt.code;
              return (
                <button
                  key={opt.code}
                  id={`lang-select-${opt.code}`}
                  onClick={() => {
                    setLanguage(opt.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected ? 'font-bold' : 'hover:opacity-80'
                  }`}
                  style={{ 
                    backgroundColor: isSelected ? currentTheme.surfaceSecondary : 'transparent',
                    color: currentTheme.text 
                  }}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{opt.flag}</span>
                    <div className="flex flex-col text-left">
                      <span className={`text-xs ${opt.code === 'ar' ? 'font-arabic' : opt.code === 'ur' ? 'font-urdu' : ''}`}>
                        {opt.nativeLabel}
                      </span>
                      <span className="text-[10px] opacity-60 font-sans">
                        {opt.label}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
