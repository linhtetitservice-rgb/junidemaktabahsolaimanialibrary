import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  BookOpen, 
  Database, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Save, 
  Layers,
  ArrowRight,
  RefreshCw,
  FolderTree
} from 'lucide-react';
import { Notebook, Book, ThemeConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  saveGlobalNotebook, 
  deleteGlobalNotebook, 
  batchSeedGlobalCatalog 
} from '../services/firebase';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  allNotebooks: Notebook[];
  onRefreshData?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  allNotebooks,
  onRefreshData
}) => {
  const { t, isRTL, dir } = useLanguage();
  const { user } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Editing state
  const [editingNotebook, setEditingNotebook] = useState<Notebook | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form fields for editing/creating
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCat, setFormCat] = useState('Islamic Fiqh');
  const [formIcon, setFormIcon] = useState('⚖️');
  const [formLink, setFormLink] = useState('');
  const [formShamelaLink, setFormShamelaLink] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBooks, setFormBooks] = useState<Book[]>([]);

  // New book inline addition
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookDeathYear, setNewBookDeathYear] = useState('');
  const [newBookPublisher, setNewBookPublisher] = useState('');
  const [newBookVolumes, setNewBookVolumes] = useState('1');
  const [newBookShamela, setNewBookShamela] = useState('');

  // Bulk add books state
  const [bulkBooksText, setBulkBooksText] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  // Action status states
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    allNotebooks.forEach((n) => {
      if (n.cat) set.add(n.cat);
    });
    return Array.from(set).sort();
  }, [allNotebooks]);

  // Filtered notebooks
  const filteredNotebooks = useMemo(() => {
    return allNotebooks.filter((nb) => {
      if (selectedCat !== 'all' && nb.cat !== selectedCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        nb.title?.toLowerCase().includes(q) ||
        nb.cat?.toLowerCase().includes(q) ||
        nb.link?.toLowerCase().includes(q) ||
        nb.shamelaLink?.toLowerCase().includes(q) ||
        nb.books?.some((b) => b.title.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q))
      );
    });
  }, [allNotebooks, selectedCat, searchQuery]);

  // Shamela links count
  const shamelaLinksCount = useMemo(() => {
    let count = 0;
    allNotebooks.forEach((nb) => {
      if (nb.shamelaLink) count++;
      nb.books?.forEach((b) => {
        if (b.shamelaLink) count++;
      });
    });
    return count;
  }, [allNotebooks]);

  if (!isOpen) return null;

  // Open Edit modal for a notebook
  const handleOpenEdit = (nb: Notebook) => {
    setEditingNotebook(nb);
    setIsCreatingNew(false);
    setFormId(nb.id);
    setFormTitle(nb.title);
    setFormCat(nb.cat);
    setFormIcon(nb.icon || '📖');
    setFormLink(nb.link);
    setFormShamelaLink(nb.shamelaLink || '');
    setFormDesc(nb.desc || '');
    setFormBooks(nb.books ? [...nb.books] : []);
  };

  // Open Create New notebook modal
  const handleOpenCreateNew = () => {
    const newId = `nb-${Date.now()}`;
    setEditingNotebook(null);
    setIsCreatingNew(true);
    setFormId(newId);
    setFormTitle('');
    setFormCat(categories[0] || 'Islamic Fiqh');
    setFormIcon('📖');
    setFormLink('');
    setFormShamelaLink('');
    setFormDesc('');
    setFormBooks([]);
  };

  // Add individual book to current form
  const handleAddBookToForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    const newBook: Book = {
      title: newBookTitle.trim(),
      author: newBookAuthor.trim() || undefined,
      deathYear: newBookDeathYear.trim() || undefined,
      publisher: newBookPublisher.trim() || undefined,
      volumes: newBookVolumes.trim() || '1',
      shamelaLink: newBookShamela.trim() || undefined,
      lang: /[\u0600-\u06FF]/.test(newBookTitle) ? 'ar' : 'en'
    };

    setFormBooks((prev) => [newBook, ...prev]);
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookDeathYear('');
    setNewBookPublisher('');
    setNewBookVolumes('1');
    setNewBookShamela('');
  };

  // Bulk add books
  const handleApplyBulkBooks = () => {
    if (!bulkBooksText.trim()) return;
    const lines = bulkBooksText.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed: Book[] = lines.map((l) => ({
      title: l,
      volumes: '1',
      lang: /[\u0600-\u06FF]/.test(l) ? 'ar' : 'en'
    }));

    setFormBooks((prev) => [...parsed, ...prev]);
    setBulkBooksText('');
    setShowBulkAdd(false);
  };

  // Remove a book from current form
  const handleRemoveBookFromForm = (index: number) => {
    setFormBooks((prev) => prev.filter((_, i) => i !== index));
  };

  // Save Notebook (Live to Cloud Firestore)
  const handleSaveNotebook = async () => {
    if (!user) {
      showStatus('error', 'You must be signed in with the Admin account.');
      return;
    }
    if (!formTitle.trim() || !formLink.trim()) {
      showStatus('error', 'Title and NotebookLM link are required.');
      return;
    }

    setIsSaving(true);
    try {
      const updatedNb: Notebook = {
        id: formId,
        icon: formIcon.trim() || '📖',
        title: formTitle.trim(),
        cat: formCat.trim(),
        link: formLink.trim(),
        shamelaLink: formShamelaLink.trim() || undefined,
        desc: formDesc.trim() || undefined,
        books: formBooks,
        totalSources: formBooks.length,
        order: editingNotebook?.order ?? Date.now(),
        visible: true,
      };

      await saveGlobalNotebook(updatedNb, user.uid);
      showStatus('success', t('adminSaveSuccess'));
      setEditingNotebook(null);
      setIsCreatingNew(false);
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      console.error('Failed to save notebook to Firestore:', err);
      showStatus('error', err?.message || 'Failed to save to Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Notebook from Cloud Firestore
  const handleDeleteNotebook = async (notebookId: string, title: string) => {
    if (!user) return;
    const confirmed = window.confirm(`Are you sure you want to delete "${title}" from the live library? This will update the website for all visitors.`);
    if (!confirmed) return;

    try {
      await deleteGlobalNotebook(notebookId);
      showStatus('success', t('adminDeleteSuccess'));
      if (editingNotebook?.id === notebookId) {
        setEditingNotebook(null);
      }
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      console.error('Failed to delete notebook from Firestore:', err);
      showStatus('error', err?.message || 'Failed to delete from Firestore.');
    }
  };

  // One-Click Seed All Library to Live Firestore
  const handleSeedAllToFirestore = async () => {
    if (!user) {
      showStatus('error', 'Sign in as Admin to sync to cloud.');
      return;
    }
    const confirmed = window.confirm(`This will sync all ${allNotebooks.length} research hubs into live Firebase Firestore collection "notebooks". Connected users will immediately see the synchronized catalog. Proceed?`);
    if (!confirmed) return;

    setIsSeeding(true);
    try {
      const count = await batchSeedGlobalCatalog(allNotebooks, user.uid);
      showStatus('success', t('adminSeedSuccess', { count: count.toString() }));
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      console.error('Failed to seed catalog:', err);
      showStatus('error', err?.message || 'Failed to sync library to Firestore.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div 
      id="admin-dashboard-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      dir={dir}
    >
      <div 
        id="admin-dashboard-modal"
        className="w-full max-w-5xl max-h-[92vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden"
        style={{ 
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.accent 
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
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs"
              style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.accent }}
            >
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg" style={{ color: currentTheme.text }}>
                  {t('adminDashboard')}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
                  {t('adminModeActive')}
                </span>
                <span className="text-xs font-mono opacity-80" style={{ color: currentTheme.textMuted }}>
                  ({user?.email})
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: currentTheme.textMuted }}>
                {t('adminSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border transition-colors cursor-pointer hover:opacity-80"
              style={{ 
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.textMuted 
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Status Message */}
        {statusMessage && (
          <div 
            className={`p-3 text-xs font-semibold flex items-center gap-2 border-b animate-in slide-in-from-top ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500' 
                : 'bg-red-500/15 border-red-500/30 text-red-500'
            }`}
          >
            {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Action KPIs and Migration Tool */}
        <div 
          className="p-4 border-b grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0"
          style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
        >
          {/* Total Hubs */}
          <div className="p-3 rounded-xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
            <span className="text-[11px] block" style={{ color: currentTheme.textMuted }}>Total Research Hubs</span>
            <span className="text-xl font-extrabold" style={{ color: currentTheme.text }}>{allNotebooks.length}</span>
          </div>

          {/* Total Books */}
          <div className="p-3 rounded-xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
            <span className="text-[11px] block" style={{ color: currentTheme.textMuted }}>Indexed Volumes</span>
            <span className="text-xl font-extrabold" style={{ color: currentTheme.primary }}>
              {allNotebooks.reduce((acc, n) => acc + (n.books?.length || 0), 0).toLocaleString()}
            </span>
          </div>

          {/* Shamela Links */}
          <div className="p-3 rounded-xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
            <span className="text-[11px] block" style={{ color: currentTheme.textMuted }}>Shamela.ws Links</span>
            <span className="text-xl font-extrabold text-teal-500">{shamelaLinksCount}</span>
          </div>

          {/* Cloud Sync / Seed Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSeedAllToFirestore}
              disabled={isSeeding}
              className="w-full h-full py-2.5 px-3 rounded-xl border font-semibold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ 
                backgroundColor: currentTheme.surface, 
                borderColor: currentTheme.accent,
                color: currentTheme.accent 
              }}
              title="Upload entire initial library of 87 hubs to Cloud Firestore so it is globally stored & synchronized"
            >
              <div className="flex items-center gap-1.5">
                <Database className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>{isSeeding ? t('syncingCatalog') : t('seedCatalogBtn')}</span>
              </div>
              <span className="text-[10px] opacity-70">Sync 87 Hubs to Cloud</span>
            </button>
          </div>
        </div>

        {/* Content Area: Form Editor vs Hubs Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {editingNotebook || isCreatingNew ? (
            /* Notebook Edit / Create View */
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentTheme.border }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{formIcon}</span>
                  <div>
                    <h4 className="font-bold text-base" style={{ color: currentTheme.text }}>
                      {isCreatingNew ? t('addNewNotebookBtn') : `${t('editNotebookBtn')}: ${formTitle || 'Untitled'}`}
                    </h4>
                    <span className="text-xs font-mono opacity-70" style={{ color: currentTheme.textMuted }}>
                      ID: {formId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingNotebook(null);
                      setIsCreatingNew(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveNotebook}
                    disabled={isSaving}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-md hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : t('saveLiveToCloud')}</span>
                  </button>
                </div>
              </div>

              {/* Main Fields Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs sm:text-sm">
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                    Emoji / Icon
                  </label>
                  <input
                    type="text"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full text-center py-2 rounded-lg border outline-hidden"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                    Discipline / Category
                  </label>
                  <input
                    type="text"
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-hidden"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                    required
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                    Notebook Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. الفقه الحنفي وشروحاته"
                    className="w-full px-3 py-2 rounded-lg border outline-hidden font-arabic font-medium"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                    Google NotebookLM Share Link
                  </label>
                  <input
                    type="url"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="https://notebooklm.link.google/... or https://notebook.google.com/notebook/..."
                    className="w-full px-3 py-2 rounded-lg border outline-hidden font-mono text-xs"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1 text-teal-500 font-semibold flex items-center justify-between">
                    <span>{t('shamelaLink')} (المكتبة الشاملة)</span>
                    {formShamelaLink && (
                      <a 
                        href={formShamelaLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[10px] text-teal-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </label>
                  <input
                    type="url"
                    value={formShamelaLink}
                    onChange={(e) => setFormShamelaLink(e.target.value)}
                    placeholder={t('shamelaPlaceholder')}
                    className="w-full px-3 py-2 rounded-lg border outline-hidden font-mono text-xs"
                    style={{ 
                      backgroundColor: currentTheme.surfaceSecondary, 
                      borderColor: formShamelaLink ? '#14b8a6' : currentTheme.border, 
                      color: currentTheme.text 
                    }}
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.textMuted }}>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Description of the research collection..."
                    className="w-full px-3 py-2 rounded-lg border outline-hidden"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                  />
                </div>
              </div>

              {/* Books Management in this Hub */}
              <div 
                className="p-4 rounded-xl border space-y-4"
                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" style={{ color: currentTheme.accent }} />
                    <h5 className="font-bold text-sm" style={{ color: currentTheme.text }}>
                      {t('manageBooksInHub', { count: formBooks.length.toString() })}
                    </h5>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBulkAdd(!showBulkAdd)}
                    className="px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
                  >
                    {showBulkAdd ? 'Hide Quick Bulk Paste' : '+ Quick Bulk Paste Books'}
                  </button>
                </div>

                {/* Bulk Paste Box */}
                {showBulkAdd && (
                  <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                    <span className="text-xs font-medium block" style={{ color: currentTheme.textMuted }}>
                      Paste book titles (1 book title per line):
                    </span>
                    <textarea
                      rows={4}
                      value={bulkBooksText}
                      onChange={(e) => setBulkBooksText(e.target.value)}
                      placeholder="Book 1&#10;Book 2&#10;Book 3"
                      className="w-full p-2 rounded-md border outline-hidden font-arabic text-xs"
                      style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyBulkBooks}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      Append Books to List
                    </button>
                  </div>
                )}

                {/* Add Single Book Form */}
                <form onSubmit={handleAddBookToForm} className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-xs">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="New Book Title *"
                      value={newBookTitle}
                      onChange={(e) => setNewBookTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border outline-hidden font-arabic"
                      style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      placeholder="Author"
                      value={newBookAuthor}
                      onChange={(e) => setNewBookAuthor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border outline-hidden font-arabic"
                      style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      placeholder="Vols (e.g. 4)"
                      value={newBookVolumes}
                      onChange={(e) => setNewBookVolumes(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border outline-hidden"
                      style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="url"
                      placeholder="Shamela.ws Link"
                      value={newBookShamela}
                      onChange={(e) => setNewBookShamela(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border outline-hidden font-mono text-[11px]"
                      style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded-lg font-semibold text-white cursor-pointer hover:opacity-90 flex items-center justify-center gap-1"
                      style={{ backgroundColor: currentTheme.accent, color: currentTheme.mode === 'dark' ? '#000' : '#fff' }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Book</span>
                    </button>
                  </div>
                </form>

                {/* Existing Books List */}
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {formBooks.length === 0 ? (
                    <div className="text-center py-4 text-xs" style={{ color: currentTheme.textMuted }}>
                      No books added yet. Add books using the fields above.
                    </div>
                  ) : (
                    formBooks.map((b, idx) => (
                      <div 
                        key={idx}
                        className="p-2 rounded-lg border flex items-center justify-between gap-2 text-xs"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="w-5 text-center font-mono text-[10px] opacity-60 shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-semibold font-arabic truncate" style={{ color: currentTheme.text }}>
                            {b.title}
                          </span>
                          {b.author && (
                            <span className="text-[11px] opacity-70 truncate" style={{ color: currentTheme.textMuted }}>
                              • {b.author}
                            </span>
                          )}
                          {b.volumes && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded border shrink-0" style={{ borderColor: currentTheme.border }}>
                              {b.volumes} {b.volumes === '1' ? 'vol' : 'vols'}
                            </span>
                          )}
                          {b.shamelaLink && (
                            <a 
                              href={b.shamelaLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-teal-500/10 text-teal-500 border border-teal-500/30 flex items-center gap-0.5 shrink-0 hover:underline"
                            >
                              <span>Shamela</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveBookFromForm(idx)}
                          className="p-1 rounded text-red-500 hover:bg-red-500/10 cursor-pointer shrink-0"
                          title="Remove Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* Hubs Catalog List & Search View */
            <div className="space-y-4">
              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className={`w-4 h-4 absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'}`} style={{ color: currentTheme.textMuted }} />
                    <input
                      type="text"
                      placeholder="Filter by title, category, Shamela link..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 rounded-lg border text-xs outline-hidden`}
                      style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                  </div>

                  {/* Category filter */}
                  <select
                    value={selectedCat}
                    onChange={(e) => setSelectedCat(e.target.value)}
                    className="py-2 px-2.5 rounded-lg border text-xs outline-hidden shrink-0"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.text }}
                  >
                    <option value="all">All Disciplines ({allNotebooks.length})</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleOpenCreateNew}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:opacity-90"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('addNewNotebookBtn')}</span>
                </button>
              </div>

              {/* Table / Cards List of Notebooks */}
              <div className="space-y-2">
                {filteredNotebooks.length === 0 ? (
                  <div className="text-center py-12 border rounded-xl" style={{ borderColor: currentTheme.border }}>
                    <p className="text-xs" style={{ color: currentTheme.textMuted }}>No hubs match your search query.</p>
                  </div>
                ) : (
                  filteredNotebooks.map((nb) => {
                    const booksCount = nb.books?.length || 0;
                    const hasShamela = Boolean(nb.shamelaLink || nb.books?.some((b) => b.shamelaLink));

                    return (
                      <div 
                        key={nb.id}
                        className="p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                        style={{ 
                          backgroundColor: currentTheme.surfaceSecondary,
                          borderColor: currentTheme.border 
                        }}
                      >
                        <div className="flex items-start gap-3 overflow-hidden">
                          <span className="text-2xl shrink-0 mt-0.5">{nb.icon || '📖'}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-bold text-sm font-arabic" style={{ color: currentTheme.text }}>
                                {nb.title}
                              </h5>
                              <span 
                                className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                                style={{ backgroundColor: currentTheme.surface, color: currentTheme.accent, border: `1px solid ${currentTheme.border}` }}
                              >
                                {nb.cat}
                              </span>
                              {hasShamela && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-teal-500/10 text-teal-500 border border-teal-500/30 flex items-center gap-1 shrink-0">
                                  <span>Shamela</span>
                                  <Check className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <div className="text-xs mt-1 flex items-center gap-3 flex-wrap" style={{ color: currentTheme.textMuted }}>
                              <span>{booksCount} {booksCount === 1 ? 'Volume' : 'Volumes'}</span>
                              {nb.shamelaLink && (
                                <a 
                                  href={nb.shamelaLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-500 hover:underline flex items-center gap-0.5 text-[11px]"
                                >
                                  <span>Shamela Link</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <a 
                                href={nb.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline flex items-center gap-0.5 text-[11px]"
                                style={{ color: currentTheme.primary }}
                              >
                                <span>NotebookLM</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleOpenEdit(nb)}
                            className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-90"
                            style={{ 
                              backgroundColor: currentTheme.surface,
                              borderColor: currentTheme.border,
                              color: currentTheme.text 
                            }}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                            <span>Edit Hub & Books</span>
                          </button>

                          <button
                            onClick={() => handleDeleteNotebook(nb.id, nb.title)}
                            className="p-1.5 rounded-lg border text-red-500 hover:bg-red-500/10 cursor-pointer"
                            title="Delete Hub"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="p-3 sm:px-5 border-t flex items-center justify-between text-xs shrink-0"
          style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
        >
          <span className="flex items-center gap-1.5" style={{ color: currentTheme.textMuted }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Changes persist immediately to Firebase Firestore and update live for all website visitors.</span>
          </span>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border font-semibold cursor-pointer hover:opacity-80"
            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
