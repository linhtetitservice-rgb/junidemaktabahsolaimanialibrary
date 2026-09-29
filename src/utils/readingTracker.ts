import { useEffect, useState, useCallback } from 'react';
import { Book, Notebook, BookProgress, ReadingStatus } from '../types';

const STORAGE_KEY = 'maktaba_reading_progress';
const LEGACY_STORAGE_KEY = 'alturath_reading_progress';
const UPDATE_EVENT = 'maktaba_reading_progress_updated';

// Helper to parse volume count number from string like "4", "4 vols", etc.
export function parseTotalVolumes(volStr?: string): number {
  if (!volStr) return 1;
  const match = volStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

// Generate unique id for a book in a notebook
export function getBookProgressId(notebookId: string, bookTitle: string): string {
  return `${notebookId}::${bookTitle.trim()}`;
}

// Read map from localStorage
export function getReadingProgressMap(): Record<string, BookProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to read reading progress from localStorage:', err);
  }
  return {};
}

// Save map to localStorage and dispatch update event
export function persistMapDirectly(map: Record<string, BookProgress>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  } catch (err) {
    console.error('Failed to save reading progress to localStorage:', err);
  }
}
const persistMap = persistMapDirectly;

// Get sorted recently viewed list
export function getRecentlyViewedList(): BookProgress[] {
  const map = getReadingProgressMap();
  return Object.values(map).sort((a, b) => (b.lastViewedAt || 0) - (a.lastViewedAt || 0));
}

// Record a view event for a book (auto adds or updates lastViewedAt)
export function recordBookView(
  book: Book,
  notebook: Notebook,
  initialStatus: ReadingStatus = 'want_to_read'
): BookProgress {
  const map = getReadingProgressMap();
  const id = getBookProgressId(notebook.id, book.title);
  const totalVols = parseTotalVolumes(book.volumes);
  const existing = map[id];

  const updated: BookProgress = {
    id,
    bookTitle: book.title,
    author: book.author,
    deathYear: book.deathYear,
    publisher: book.publisher,
    volumes: book.volumes,
    lang: book.lang,
    notebookId: notebook.id,
    notebookTitle: notebook.title,
    notebookIcon: notebook.icon || '📚',
    notebookCat: notebook.cat,
    notebookLink: notebook.link,
    status: existing ? existing.status : initialStatus,
    currentVolume: existing?.currentVolume ?? 1,
    totalVolumes: existing?.totalVolumes ?? totalVols,
    lastViewedAt: Date.now(),
    notes: existing?.notes
  };

  map[id] = updated;
  persistMap(map);
  return updated;
}

// Update reading status & volume progress
export function updateBookStatus(
  book: Book,
  notebook: Notebook,
  status: ReadingStatus,
  currentVolume?: number,
  notes?: string
): BookProgress {
  const map = getReadingProgressMap();
  const id = getBookProgressId(notebook.id, book.title);
  const totalVols = parseTotalVolumes(book.volumes);
  const existing = map[id];

  const targetVol = currentVolume !== undefined 
    ? Math.max(1, Math.min(currentVolume, totalVols))
    : (existing?.currentVolume ?? 1);

  const updated: BookProgress = {
    id,
    bookTitle: book.title,
    author: book.author,
    deathYear: book.deathYear,
    publisher: book.publisher,
    volumes: book.volumes,
    lang: book.lang,
    notebookId: notebook.id,
    notebookTitle: notebook.title,
    notebookIcon: notebook.icon || '📚',
    notebookCat: notebook.cat,
    notebookLink: notebook.link,
    status,
    currentVolume: targetVol,
    totalVolumes: existing?.totalVolumes ?? totalVols,
    lastViewedAt: Date.now(),
    notes: notes !== undefined ? notes : existing?.notes
  };

  map[id] = updated;
  persistMap(map);
  return updated;
}

// Remove item from progress / recently viewed
export function removeBookProgress(id: string): void {
  const map = getReadingProgressMap();
  if (map[id]) {
    delete map[id];
    persistMap(map);
  }
}

// Clear all recently viewed
export function clearAllReadingProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

// React Hook to consume reading progress reactively
export function useReadingTracker() {
  const [progressMap, setProgressMap] = useState<Record<string, BookProgress>>(() => getReadingProgressMap());

  const refresh = useCallback(() => {
    setProgressMap(getReadingProgressMap());
  }, []);

  useEffect(() => {
    const handleUpdate = () => refresh();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) {
        refresh();
      }
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  const recentlyViewed = Object.values(progressMap).sort(
    (a, b) => (b.lastViewedAt || 0) - (a.lastViewedAt || 0)
  );

  return {
    progressMap,
    recentlyViewed,
    recordView: recordBookView,
    updateStatus: updateBookStatus,
    removeProgress: removeBookProgress,
    clearAll: clearAllReadingProgress,
    refresh
  };
}
