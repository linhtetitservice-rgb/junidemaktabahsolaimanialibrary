import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Code, 
  Sparkles, 
  Globe, 
  Copy, 
  Check, 
  Layers, 
  Database,
  Terminal,
  FileJson
} from 'lucide-react';
import { ThemeConfig } from '../types';

interface DeveloperGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
}

export const DeveloperGuideModal: React.FC<DeveloperGuideModalProps> = ({
  isOpen,
  onClose,
  currentTheme
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'burmese' | 'english' | 'schema'>('burmese');
  const [copiedSchema, setCopiedSchema] = useState(false);

  const sampleJson = `[
  {
    "id": "notebook-unique-id-1",
    "icon": "📖",
    "title": "علوم القرآن والتفسير Quranic Sciences & Exegesis",
    "titleLang": "ar",
    "cat": "Al-Qur’an",
    "link": "https://notebook.google.com/notebook/YOUR_NOTEBOOK_UUID",
    "desc": "Classical Tafsir compendiums and Quranic research.",
    "books": [
      {
        "title": "جامع البيان عن تأويل آي القرآن (تفسير الطبري)",
        "author": "ابن جرير الطبري",
        "deathYear": "310 هـ",
        "publisher": "دار هجر",
        "volumes": "24",
        "lang": "ar"
      }
    ]
  }
]`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(sampleJson);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div 
      id="developer-guide-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="developer-guide-modal"
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden"
        style={{ 
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-5 border-b flex items-start justify-between gap-3 shrink-0"
          style={{ 
            backgroundColor: currentTheme.surfaceSecondary,
            borderColor: currentTheme.border 
          }}
        >
          <div className="flex items-center gap-3">
            <span 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border shadow-xs"
              style={{ 
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.accent 
              }}
            >
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: currentTheme.text }}>
                ဒီလို Hub စနစ်မျိုး အစမှအဆုံး ပြည့်စုံအောင် ဘယ်လိုတည်ဆောက်ရမလဲ လမ်းညွှန်
              </h2>
              <p className="text-xs" style={{ color: currentTheme.textMuted }}>
                How to Build an AI Digital Library Hub like مکتبہ سلیمانیہ & NotebookLM Hubs
              </p>
            </div>
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
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div 
          className="px-4 py-2.5 border-b flex items-center gap-2 shrink-0"
          style={{ 
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.border 
          }}
        >
          <button
            onClick={() => setActiveTab('burmese')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'burmese' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'burmese' ? currentTheme.accent : currentTheme.surfaceSecondary,
              color: activeTab === 'burmese' ? (currentTheme.mode === 'dark' ? '#000' : '#fff') : currentTheme.text
            }}
          >
            🇲🇲 မြန်မာဘာသာ ရှင်းပြချက်
          </button>

          <button
            onClick={() => setActiveTab('english')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'english' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'english' ? currentTheme.accent : currentTheme.surfaceSecondary,
              color: activeTab === 'english' ? (currentTheme.mode === 'dark' ? '#000' : '#fff') : currentTheme.text
            }}
          >
            🌐 English Architecture
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'schema' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'schema' ? currentTheme.accent : currentTheme.surfaceSecondary,
              color: activeTab === 'schema' ? (currentTheme.mode === 'dark' ? '#000' : '#fff') : currentTheme.text
            }}
          >
            📋 JSON Data Template
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm leading-relaxed" style={{ color: currentTheme.text }}>
          
          {activeTab === 'burmese' && (
            <div className="space-y-6">
              
              {/* Intro Box */}
              <div 
                className="p-4 rounded-xl border"
                style={{ 
                  backgroundColor: currentTheme.surfaceSecondary,
                  borderColor: currentTheme.accent 
                }}
              >
                <h3 className="font-bold text-base mb-2 flex items-center gap-2" style={{ color: currentTheme.accent }}>
                  <Sparkles className="w-5 h-5" />
                  Al-Turath Hub ဆိုတာ ဘာလဲ? ဘာကြောင့် ဒီလောက် အသုံးဝင်တာလဲ?
                </h3>
                <p className="text-xs sm:text-sm">
                  <strong>sajidzbi.github.io/alturathhubtest/</strong> သည် အစ္စလာမ့်ကျမ်းစာအုပ်ပေါင်း <strong>၁၄,၇၀၀ ကျော်</strong> ကို ဘာသာရပ်အလိုက် (ဥပမာ- အဘိဓာန်၊ ဥပဒေ၊ သမိုင်း၊ ဒဿနိက စသည်ဖြင့်) စုစုပေါင်း <strong>၈၄ ခုသော Google NotebookLM</strong> များနှင့် ချိတ်ဆက်ထားသော <strong>Digital AI Research Library</strong> ဖြစ်ပါတယ်။
                  စာဖတ်သူ/သုတေသီများသည် ကျမ်းစာအုပ်ထောင်ပေါင်းများစွာကို ကိုယ်တိုင်ရှာဖတ်စရာမလိုဘဲ NotebookLM AI ကို အချိန်မရွေး မေးခွန်းထုတ်နိုင်ပြီး တိကျသော အထောက်အထား (Citations) များနှင့် အဖြေထုတ်ပေးနိုင်အောင် လုပ်ထားတာဖြစ်ပါတယ်။
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <h4 className="font-bold text-base border-b pb-2" style={{ borderColor: currentTheme.border }}>
                  ဒါမျိုးတစ်ခု သင်ကိုယ်တိုင် ပြည့်ပြည့်စုံစုံ တည်ဆောက်နိုင်မည့် အဆင့် ၅ ဆင့်:
                </h4>

                {/* Step 1 */}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}>
                  <div className="flex items-center gap-2 font-bold mb-1.5" style={{ color: currentTheme.primary }}>
                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs">၁</span>
                    <span>Google NotebookLM တွင် AI Knowledge Base များ ဖန်တီးခြင်း</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2">
                    <li><a href="https://notebooklm.google.com" target="_blank" rel="noreferrer" className="underline font-semibold" style={{ color: currentTheme.accent }}>notebooklm.google.com</a> သို့သွားပြီး Google Account ဖြင့် ဝင်ပါ။</li>
                    <li>ဘာသာရပ်တစ်ခုချင်းစီအတွက် <strong>"New Notebook"</strong> တစ်ခုစီ ဖန်တီးပါ (ဥပမာ- "ပိဋကတ်တော်ကျမ်းများ", "မြန်မာ့သမိုင်း", "ဥပဒေနှင့် စီရင်ထုံးများ")။</li>
                    <li>ထို Notebook ထဲသို့ မိမိစုဆောင်းထားသော PDF များ၊ DOCX များ၊ Google Docs သို့မဟုတ် စာတမ်းများကို Sources အဖြစ် Upload တင်ပါ။ (Notebook တစ်ခုလျှင် စာအုပ်/ဖိုင် အများအပြား ထည့်သွင်းနိုင်သည်)။</li>
                    <li>ညာဘက်အပေါ်ရှိ <strong>"Share"</strong> ခလုတ်ကိုနှိပ်ပြီး <strong>"Anyone with the link can view"</strong> အဖြစ် Public link ပြောင်းကာ URL ကို ကူးယူထားပါ (ဥပမာ: <code>https://notebook.google.com/notebook/xxxx-xxxx</code>)။</li>
                  </ul>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}>
                  <div className="flex items-center gap-2 font-bold mb-1.5" style={{ color: currentTheme.primary }}>
                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs">၂</span>
                    <span>စာအုပ်များနှင့် NotebookLM Links များကို JSON Data ဖွဲ့စည်းခြင်း</span>
                  </div>
                  <p className="text-xs sm:text-sm mb-2">
                    Al-Turath Hub တွင် စာအုပ်ပေါင်း ၁၄,၇၀၀ ကျော်ကို JSON array အဖြစ် သိမ်းဆည်းထားသည်။ သင်ကိုယ်တိုင် စာရင်းပြုစုသည့်အခါ အောက်ပါအတိုင်း ရေးနိုင်သည်:
                  </p>
                  <div className="p-3 rounded-lg bg-black/30 font-mono text-xs overflow-x-auto">
                    <code>
                      {`{ "title": "ကျမ်းအမည်", "author": "ကျမ်းပြုဆရာ", "cat": "ဘာသာရပ်", "link": "https://notebook.google.com/notebook/...", "books": [...] }`}
                    </code>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}>
                  <div className="flex items-center gap-2 font-bold mb-1.5" style={{ color: currentTheme.primary }}>
                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs">၃</span>
                    <span>Frontend Web App တည်ဆောက်ခြင်း (ယခု Application ကဲ့သို့)</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2">
                    <li><strong>React + TypeScript + Tailwind CSS</strong>: ခေတ်မီ UI၊ မြန်ဆန်သော Search နှင့် Category Filtering အတွက် အကောင်းဆုံးဖြစ်ပါတယ်။</li>
                    <li><strong>Modal & Drawers</strong>: Notebook တစ်ခုချင်းစီ၏ အတွင်းရှိ စာအုပ်များကို ကြည့်ရှုနိုင်သော <em>Book Explorer Modal</em>။</li>
                    <li><strong>Global Search</strong>: စာအုပ်ခေါင်းစဉ်၊ ရေးသားသူ၊ ထုတ်ဝေသူ မည်သည့်အရာမဆို ချက်ချင်းရှာဖွေနိုင်သည့် စနစ်။</li>
                    <li><strong>Color Themes</strong>: မျက်စိအေးပြီး ခန့်ညားသော Dark/Light Theme မျိုးစုံ။</li>
                    <li><strong>Bookmarks (Favorites)</strong>: မိမိအမြဲလေ့လာလိုသော Notebook များကို Save လုပ်နိုင်ရန် LocalStorage ဖြင့် ထိန်းသိမ်းခြင်း။</li>
                  </ul>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}>
                  <div className="flex items-center gap-2 font-bold mb-1.5" style={{ color: currentTheme.primary }}>
                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs">၄</span>
                    <span>GitHub Pages သို့မဟုတ် Vercel တွင် အခမဲ့ Host တင်နည်း</span>
                  </div>
                  <p className="text-xs sm:text-sm mb-1">
                    မူရင်းဝဘ်ဆိုက် <code>sajidzbi.github.io/alturathhubtest</code> သည် <strong>GitHub Pages</strong> တွင် အခမဲ့ Host တင်ထားခြင်း ဖြစ်ပါသည်။
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm pl-2">
                    <li>GitHub တွင် Repository အသစ်တစ်ခု ဆောက်ပါ (ဥပမာ: <code>my-digital-hub</code>)။</li>
                    <li>Build ထွက်လာသော HTML/CSS/JS ဖိုင်များကို အဆိုပါ repo သို့ push လုပ်ပါ။</li>
                    <li>Repository Settings &rarr; Pages &rarr; Source ကို <code>gh-pages</code> သို့မဟုတ် <code>main / root</code> သတ်မှတ်လိုက်ရုံဖြင့် အခမဲ့ URL တစ်ခု ရရှိပါမည်။</li>
                  </ol>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-xl border" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}>
                  <div className="flex items-center gap-2 font-bold mb-1.5" style={{ color: currentTheme.primary }}>
                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs">၅</span>
                    <span>အခြားသော နယ်ပယ်များအတွက် အသုံးချနိုင်မှု</span>
                  </div>
                  <p className="text-xs sm:text-sm">
                    ဤစနစ်သည် အစ္စလာမ့်ကျမ်းစာအုပ်များအတွက်သာမက:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm pl-2 mt-1">
                    <li><strong>မြန်မာ့သမိုင်းနှင့် စာပေကျမ်းဂန်များ</strong> (ဦးကုလား မဟာရာဇဝင်၊ မှန်နန်းရာဇဝင် စသည်)</li>
                    <li><strong>ဗုဒ္ဓဘာသာ ပိဋကတ်တော်နှင့် အဋ္ဌကထာများ</strong></li>
                    <li><strong>မြန်မာနိုင်ငံ တရားဥပဒေနှင့် တရားရုံးချုပ် စီရင်ထုံးများ</strong></li>
                    <li><strong>ဆေးပညာနှင့် သုတေသန စာတမ်းများ (Medical Research Hub)</strong></li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'english' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold" style={{ color: currentTheme.accent }}>
                System Architecture & Tech Stack Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}>
                  <h4 className="font-bold text-xs uppercase mb-1" style={{ color: currentTheme.primary }}>AI Engine: Google NotebookLM</h4>
                  <p className="text-xs leading-relaxed" style={{ color: currentTheme.textMuted }}>
                    NotebookLM uses Gemini 1.5 Pro to synthesize up to 50 sources per notebook with zero hallucination citations. By hosting 84 specialized notebooks, Al-Turath effectively organizes 14,700+ classical sources into discrete disciplinary AI expert agents.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}>
                  <h4 className="font-bold text-xs uppercase mb-1" style={{ color: currentTheme.primary }}>Data Tier: Static JSON Repository</h4>
                  <p className="text-xs leading-relaxed" style={{ color: currentTheme.textMuted }}>
                    Instead of requiring an expensive heavy database server, all 84 notebooks and 14,710 books metadata are indexed in a static JSON structure, allowing sub-50ms instant client-side searches and offline caching.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}>
                  <h4 className="font-bold text-xs uppercase mb-1" style={{ color: currentTheme.primary }}>Frontend: React + Tailwind CSS</h4>
                  <p className="text-xs leading-relaxed" style={{ color: currentTheme.textMuted }}>
                    Responsive multi-tier catalog with Grid views, Grouped discipline drawers, Master All-Books Explorer, and multi-theme rendering (Emerald, Lapis, Amethyst, Pearl, Desert).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}>
                  <h4 className="font-bold text-xs uppercase mb-1" style={{ color: currentTheme.primary }}>Deployment: GitHub Pages & Static Hosting</h4>
                  <p className="text-xs leading-relaxed" style={{ color: currentTheme.textMuted }}>
                    Pure static compilation allows free hosting with infinite bandwidth on GitHub Pages, Cloudflare Pages, or Google Cloud Run.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Notebook & Book Data Schema (JSON Template)</h4>
                  <p className="text-xs" style={{ color: currentTheme.textMuted }}>
                    Copy this template to create your own custom notebooks and books dataset.
                  </p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border cursor-pointer"
                  style={{ 
                    backgroundColor: currentTheme.surfaceSecondary,
                    borderColor: currentTheme.border,
                    color: currentTheme.text 
                  }}
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied!' : 'Copy Schema'}</span>
                </button>
              </div>

              <pre 
                className="p-4 rounded-xl font-mono text-xs overflow-x-auto border"
                style={{ 
                  backgroundColor: currentTheme.surfaceSecondary,
                  borderColor: currentTheme.border,
                  color: currentTheme.accent 
                }}
              >
                {sampleJson}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div 
          className="p-3 sm:px-5 border-t flex items-center justify-between text-xs"
          style={{ 
            backgroundColor: currentTheme.surfaceSecondary,
            borderColor: currentTheme.border,
            color: currentTheme.textMuted 
          }}
        >
          <span>This app is fully interactive and already contains the real 84 NotebookLM hubs dataset.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-medium border cursor-pointer"
            style={{ 
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.border,
              color: currentTheme.text 
            }}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
