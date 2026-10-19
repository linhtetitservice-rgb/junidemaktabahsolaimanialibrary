import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  ChevronDown, 
  Compass, 
  Search, 
  HelpCircle, 
  X, 
  Info
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CornerAIPortalsProps {
  currentTheme: ThemeConfig;
}

interface AIPortalItem {
  id: string;
  name: string;
  shortName: string;
  nativeNameAr: string;
  nativeNameUr: string;
  url: string;
  badgeKey: 'alIkhlasTag' | 'darulIftaTag' | 'fatwaQaTag';
  descKey: 'alIkhlasDesc' | 'darulIftaDesc' | 'fatwaQaDesc';
  icon: 'compass' | 'search' | 'help';
}

const AI_PORTALS: AIPortalItem[] = [
  {
    id: 'al-ikhlas-ai',
    name: 'Al-Ikhlas Online AI',
    shortName: 'Al-Ikhlas AI',
    nativeNameAr: 'الإخلاص أونلاين',
    nativeNameUr: 'الاحلاص AI',
    url: 'https://alikhlasonline.ai/',
    badgeKey: 'alIkhlasTag',
    descKey: 'alIkhlasDesc',
    icon: 'compass'
  },
  {
    id: 'darul-ifta-ai',
    name: 'Darul Ifta AI Search',
    shortName: 'Darul Ifta AI',
    nativeNameAr: 'دار الإفتاء AI',
    nativeNameUr: 'دار الافتاء AI',
    url: 'https://www.darulifta.info/ai-search',
    badgeKey: 'darulIftaTag',
    descKey: 'darulIftaDesc',
    icon: 'search'
  },
  {
    id: 'fatwa-qa-ai',
    name: 'FatwaQA AI Search',
    shortName: 'FatwaQA AI',
    nativeNameAr: 'فتاوى QA AI',
    nativeNameUr: 'فتاویٰ سوال و جواب AI',
    url: 'https://www.fatwaqa.com/ur/ai-search',
    badgeKey: 'fatwaQaTag',
    descKey: 'fatwaQaDesc',
    icon: 'help'
  }
];

export const CornerAIPortals: React.FC<CornerAIPortalsProps> = ({ currentTheme }) => {
  const { t, isRTL, language } = useLanguage();

  // Mode: 'dock' (sleek bottom bar) | 'minimized' (small FAB) | 'expanded' (detail popover)
  const [viewMode, setViewMode] = useState<'dock' | 'minimized' | 'expanded'>('dock');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getPortalLabel = (portal: AIPortalItem) => {
    if (language === 'ar') return portal.nativeNameAr;
    if (language === 'ur') return portal.nativeNameUr;
    return portal.shortName;
  };

  const renderPortalIcon = (icon: AIPortalItem['icon'], className: string = "w-3.5 h-3.5") => {
    switch (icon) {
      case 'compass':
        return <Compass className={`${className} text-emerald-500 shrink-0`} />;
      case 'search':
        return <Search className={`${className} text-amber-500 shrink-0`} />;
      case 'help':
        return <HelpCircle className={`${className} text-sky-500 shrink-0`} />;
    }
  };

  return (
    <aside 
      id="corner-ai-portals"
      aria-label={t('aiPortalsCornerTitle')}
      className={`fixed bottom-3 sm:bottom-4 z-40 max-w-[calc(100vw-1.5rem)] transition-all duration-200 ${
        isRTL ? 'left-3 sm:left-4' : 'right-3 sm:right-4'
      }`}
    >
      {/* 1. Minimized View (Floating Circular Badge) */}
      {viewMode === 'minimized' && (
        <button
          type="button"
          onClick={() => setViewMode('dock')}
          className="h-10 px-3 rounded-full shadow-lg border flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{ 
            backgroundColor: currentTheme.surface, 
            borderColor: currentTheme.accent,
            color: currentTheme.text,
            boxShadow: `0 4px 15px -2px ${currentTheme.accent}33`
          }}
          title={t('expandCornerTooltip')}
          aria-label={t('aiPortalsCornerTitle')}
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">
            {language === 'ar' ? 'بوابات AI' : language === 'ur' ? 'اے آئی ٹولز' : 'AI Tools'}
          </span>
          <span 
            className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: currentTheme.accent }}
          >
            {AI_PORTALS.length}
          </span>
        </button>
      )}

      {/* 2. Dock View (Compact, perfectly aligned corner dock bar) */}
      {viewMode === 'dock' && (
        <div 
          className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-xl border backdrop-blur-md max-w-full overflow-hidden"
          style={{ 
            backgroundColor: currentTheme.surface, 
            borderColor: currentTheme.accent,
            boxShadow: `0 8px 24px -4px rgba(0,0,0,0.18), 0 0 0 1px ${currentTheme.accent}25`
          }}
        >
          {/* Badge / Info Toggle */}
          <button
            type="button"
            onClick={() => setViewMode('expanded')}
            className="px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-opacity hover:opacity-80 shrink-0 cursor-pointer"
            style={{ 
              backgroundColor: currentTheme.surfaceSecondary,
              color: currentTheme.accent
            }}
            title={t('aiPortalsCornerSubtitle')}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span className="hidden md:inline text-[11px]">
              {language === 'ar' ? 'ذكاء اصطناعي' : language === 'ur' ? 'اسلامک AI' : 'Islamic AI'}
            </span>
            <Info className="w-3 h-3 opacity-60" />
          </button>

          {/* AI Portals Links */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-[calc(100vw-8rem)] sm:max-w-none">
            {AI_PORTALS.map((portal) => (
              <a
                key={portal.id}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-2 sm:px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-all hover:brightness-105 active:scale-98 shrink-0 shadow-xs"
                style={{ 
                  backgroundColor: currentTheme.surfaceSecondary,
                  borderColor: currentTheme.border,
                  color: currentTheme.text
                }}
                title={portal.name}
              >
                {renderPortalIcon(portal.icon, "w-3.5 h-3.5")}
                <span className="font-semibold text-[11px] sm:text-xs whitespace-nowrap">
                  {getPortalLabel(portal)}
                </span>
                <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
              </a>
            ))}
          </div>

          {/* Minimize Button */}
          <button
            type="button"
            onClick={() => setViewMode('minimized')}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer shrink-0"
            style={{ color: currentTheme.textMuted }}
            title={t('minimizeCornerTooltip')}
            aria-label={t('minimizeCornerTooltip')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Expanded View (Modal-style neat corner card with details and copy button) */}
      {viewMode === 'expanded' && (
        <div 
          className="rounded-2xl shadow-2xl border backdrop-blur-xl overflow-hidden w-76 sm:w-84 max-w-[calc(100vw-1.5rem)]"
          style={{ 
            backgroundColor: currentTheme.surface, 
            borderColor: currentTheme.accent,
            boxShadow: `0 16px 36px -6px rgba(0,0,0,0.22)`
          }}
        >
          {/* Header */}
          <div 
            className="px-3.5 py-2.5 border-b flex items-center justify-between"
            style={{ 
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border 
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs" style={{ color: currentTheme.text }}>
                {t('aiPortalsCornerTitle')}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('dock')}
                className="p-1 rounded-md hover:opacity-70 transition-opacity text-xs cursor-pointer"
                style={{ color: currentTheme.textMuted }}
                title="Dock"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('minimized')}
                className="p-1 rounded-md hover:opacity-70 transition-opacity cursor-pointer"
                style={{ color: currentTheme.textMuted }}
                title={t('minimizeCornerTooltip')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="p-3 space-y-2 max-h-[65vh] overflow-y-auto">
            {AI_PORTALS.map((portal) => {
              const isCopied = copiedId === portal.id;

              return (
                <div 
                  key={portal.id}
                  className="p-2.5 rounded-xl border transition-all"
                  style={{ 
                    backgroundColor: currentTheme.surfaceSecondary,
                    borderColor: currentTheme.border
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{ 
                          backgroundColor: currentTheme.surface,
                          borderColor: currentTheme.border
                        }}
                      >
                        {renderPortalIcon(portal.icon, "w-3.5 h-3.5")}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs leading-snug" style={{ color: currentTheme.text }}>
                          {portal.name}
                        </h4>
                        <span className="text-[10px] font-mono opacity-70 block" style={{ color: currentTheme.textMuted }}>
                          {portal.url.replace('https://', '').replace(/\/$/, '')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] my-1.5 leading-relaxed" style={{ color: currentTheme.textMuted }}>
                    {t(portal.descKey)}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t" style={{ borderColor: currentTheme.border }}>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(portal.id, portal.url, e)}
                      className="px-2 py-1 rounded-md border text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-all hover:opacity-80"
                      style={{ 
                        backgroundColor: currentTheme.surface,
                        borderColor: currentTheme.border,
                        color: isCopied ? '#10b981' : currentTheme.textMuted 
                      }}
                      title={t('copyLinkTooltip')}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-semibold">{t('copiedTooltip')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{t('copyLinkTooltip')}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-white flex items-center gap-1 transition-all shadow-xs hover:brightness-110"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      <span>{t('openPortal')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card Footer */}
          <div 
            className="px-3 py-1.5 text-center text-[10px] border-t flex items-center justify-between"
            style={{ 
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border,
              color: currentTheme.textMuted 
            }}
          >
            <span>External Islamic AI Research</span>
            <button
              type="button"
              onClick={() => setViewMode('dock')}
              className="hover:underline cursor-pointer font-semibold text-[10px]"
              style={{ color: currentTheme.accent }}
            >
              Dock Bar
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
