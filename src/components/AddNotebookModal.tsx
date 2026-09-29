import React, { useState } from 'react';
import { X, Plus, Download, Upload, Sparkles, Check } from 'lucide-react';
import { Notebook, ThemeConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AddNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onAddNotebook: (nb: Notebook) => void;
  allNotebooks: Notebook[];
  onImportNotebooks: (nbs: Notebook[]) => void;
}

export const AddNotebookModal: React.FC<AddNotebookModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onAddNotebook,
  allNotebooks,
  onImportNotebooks
}) => {
  if (!isOpen) return null;

  const { t, isRTL, dir } = useLanguage();
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState('Islamic Fiqh');
  const [link, setLink] = useState('');
  const [icon, setIcon] = useState('📖');
  const [desc, setDesc] = useState('');
  const [rawBooks, setRawBooks] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allNotebooks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "al-turath-notebooks-library.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportNotebooks(json);
          setSuccessMsg(`Successfully imported ${json.length} notebooks!`);
          setTimeout(() => setSuccessMsg(''), 3000);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !link.trim()) {
      alert('Please provide at least a title and a Google NotebookLM link.');
      return;
    }

    const books = rawBooks
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({
        title: line,
        lang: /[\u0600-\u06FF]/.test(line) ? 'ar' : 'en'
      }));

    const newNb: Notebook = {
      id: `nb-${Date.now()}`,
      icon: icon.trim() || '📖',
      title: title.trim(),
      cat: cat.trim(),
      link: link.trim(),
      desc: desc.trim(),
      books: books.length > 0 ? books : [{ title: title.trim() }]
    };

    onAddNotebook(newNb);
    setSuccessMsg('Notebook added to your library!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div 
      id="add-notebook-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      dir={dir}
    >
      <div 
        id="add-notebook-modal"
        className="w-full max-w-lg max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden"
        style={{ 
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border 
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
            <Sparkles className="w-5 h-5" style={{ color: currentTheme.accent }} />
            <h3 className="font-bold text-base sm:text-lg" style={{ color: currentTheme.text }}>
              {isRTL ? 'إضافة دفتر ذكي / استيراد وتصدير' : 'Add NotebookLM Hub / Export Data'}
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {successMsg && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Import / Export bar */}
          <div 
            className="p-3 rounded-xl border flex items-center justify-between gap-2"
            style={{ 
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border 
            }}
          >
            <span className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>
              Dataset Management:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer hover:opacity-80"
                style={{ 
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.text 
                }}
                title="Download complete JSON of all notebooks"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <label 
                className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer hover:opacity-80"
                style={{ 
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.text 
                }}
                title="Import JSON file"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>
          </div>

          {/* Add form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
            
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-1">
                <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                  Icon
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full text-center py-2 rounded-lg border outline-hidden"
                  style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                />
              </div>

              <div className="col-span-3">
                <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                  Category / Discipline
                </label>
                <input
                  type="text"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-hidden"
                  style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                Notebook Title
              </label>
              <input
                type="text"
                placeholder="e.g. Al-Fiqh al-Muqaran (Comparative Jurisprudence)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border outline-hidden font-arabic"
                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                Google NotebookLM Share Link
              </label>
              <input
                type="url"
                placeholder="https://notebook.google.com/notebook/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border outline-hidden font-mono text-xs"
                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="Short description of the collection..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border outline-hidden"
                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                Books in this Notebook (1 book title per line)
              </label>
              <textarea
                rows={4}
                placeholder="Book 1&#10;Book 2&#10;Book 3"
                value={rawBooks}
                onChange={(e) => setRawBooks(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border outline-hidden font-arabic"
                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-md flex items-center justify-center gap-2"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Notebook to Hub</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
