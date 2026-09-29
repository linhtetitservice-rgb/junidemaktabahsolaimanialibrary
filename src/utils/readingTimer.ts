import { useState, useEffect, useRef, useCallback } from 'react';
import { parseTotalVolumes, getReadingProgressMap, persistMapDirectly, getBookProgressId } from './readingTracker';

const NOTEBOOK_TIMER_STORAGE_KEY = 'maktaba_notebook_reading_time';
const TIMER_UPDATE_EVENT = 'maktaba_reading_timer_updated';

/**
 * Calculates estimated reading time based on book length (volumes count).
 * In Islamic classical and contemporary scholarship, each printed volume
 * (مجلد) contains approximately 450-550 pages of scholarly Arabic/Urdu text.
 * At an attentive scholarly reading speed of ~30-35 pages/hr,
 * 1 volume ≈ 14 reading hours.
 */
export function estimateReadingTime(volumes?: string | number): {
  volumesCount: number;
  hours: number;
  formatted: string;
  approxDays: number;
} {
  const count = typeof volumes === 'number' ? volumes : parseTotalVolumes(volumes);
  const safeCount = Math.max(1, count);
  // 14 hours per volume
  const hours = safeCount * 14;
  const approxDays = Math.max(1, Math.round(hours / 24));

  let formatted = `~${hours}h`;
  if (hours >= 48) {
    formatted = `~${hours}h (${approxDays}d)`;
  }

  return {
    volumesCount: safeCount,
    hours,
    formatted,
    approxDays
  };
}

/**
 * Format raw seconds into standard digital timer string (MM:SS or HH:MM:SS)
 */
export function formatTimerDigital(totalSeconds: number): string {
  const safeSec = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safeSec / 3600);
  const mins = Math.floor((safeSec % 3600) / 60);
  const secs = safeSec % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Format raw seconds into friendly text (e.g. "12m 45s", "1h 15m")
 */
export function formatTimerFriendly(totalSeconds: number): string {
  const safeSec = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safeSec / 3600);
  const mins = Math.floor((safeSec % 3600) / 60);
  const secs = safeSec % 60;

  if (hrs > 0) {
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Read notebook exploration times map from localStorage
 */
export function getNotebookTimesMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(NOTEBOOK_TIMER_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load notebook timers:', err);
  }
  return {};
}

/**
 * Persist notebook exploration times map
 */
function persistNotebookTimes(map: Record<string, number>) {
  try {
    localStorage.setItem(NOTEBOOK_TIMER_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent(TIMER_UPDATE_EVENT));
  } catch (err) {
    console.error('Failed to persist notebook timers:', err);
  }
}

/**
 * Get total historical exploration time in seconds for a specific notebook
 */
export function getNotebookExplorationTime(notebookId: string): number {
  const map = getNotebookTimesMap();
  return map[notebookId] || 0;
}

/**
 * Add elapsed seconds to a notebook's total exploration time
 */
export function addNotebookExplorationTime(notebookId: string, additionalSeconds: number): number {
  if (additionalSeconds <= 0) return getNotebookExplorationTime(notebookId);
  const map = getNotebookTimesMap();
  const current = map[notebookId] || 0;
  const updated = current + additionalSeconds;
  map[notebookId] = updated;
  persistNotebookTimes(map);
  return updated;
}

/**
 * Reset exploration time for a notebook
 */
export function resetNotebookExplorationTime(notebookId: string): void {
  const map = getNotebookTimesMap();
  delete map[notebookId];
  persistNotebookTimes(map);
}

/**
 * Record exploration seconds for a specific book in reading progress
 */
export function recordBookExplorationTime(
  notebookId: string,
  bookTitle: string,
  additionalSeconds: number
): void {
  if (additionalSeconds <= 0 || !bookTitle) return;
  const progressMap = getReadingProgressMap();
  const id = getBookProgressId(notebookId, bookTitle);
  const existing = progressMap[id];
  if (existing) {
    existing.timeSpentSeconds = (existing.timeSpentSeconds || 0) + additionalSeconds;
    persistMapDirectly(progressMap);
  }
}

interface UseReadingTimerOptions {
  notebookId: string;
  initialBookTitle?: string;
  enabled?: boolean;
}

/**
 * React Hook for tracking active reading time inside the BookExplorerModal
 */
export function useReadingTimer({
  notebookId,
  initialBookTitle,
  enabled = true
}: UseReadingTimerOptions) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeBookTitle, setActiveBookTitle] = useState<string | undefined>(initialBookTitle);
  const [totalNotebookSeconds, setTotalNotebookSeconds] = useState<number>(() =>
    getNotebookExplorationTime(notebookId)
  );

  // Sync activeBookTitle when initialBookTitle prop changes
  useEffect(() => {
    if (initialBookTitle) {
      setActiveBookTitle(initialBookTitle);
    }
  }, [initialBookTitle]);

  // Keep latest values in ref for cleanup persistence
  const unpersistedSecondsRef = useRef(0);
  const activeBookTitleRef = useRef(activeBookTitle);
  const notebookIdRef = useRef(notebookId);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    activeBookTitleRef.current = activeBookTitle;
  }, [activeBookTitle]);

  useEffect(() => {
    notebookIdRef.current = notebookId;
    setTotalNotebookSeconds(getNotebookExplorationTime(notebookId));
  }, [notebookId]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Flush unpersisted seconds to localStorage
  const flushTime = useCallback(() => {
    const unpersisted = unpersistedSecondsRef.current;
    if (unpersisted > 0 && notebookIdRef.current) {
      addNotebookExplorationTime(notebookIdRef.current, unpersisted);
      if (activeBookTitleRef.current) {
        recordBookExplorationTime(notebookIdRef.current, activeBookTitleRef.current, unpersisted);
      }
      unpersistedSecondsRef.current = 0;
      setTotalNotebookSeconds(getNotebookExplorationTime(notebookIdRef.current));
    }
  }, []);

  // Timer tick interval
  useEffect(() => {
    if (!enabled || !notebookId) return;

    const interval = setInterval(() => {
      if (!isPausedRef.current && document.visibilityState === 'visible') {
        setSessionSeconds((prev) => prev + 1);
        unpersistedSecondsRef.current += 1;

        // Auto flush every 10 seconds so progress is preserved reliably
        if (unpersistedSecondsRef.current >= 10) {
          flushTime();
        }
      }
    }, 1000);

    // Auto-pause when user switches away from browser tab, auto-resume on return
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      flushTime();
    };
  }, [enabled, notebookId, flushTime]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      if (next) {
        flushTime();
      }
      return next;
    });
  }, [flushTime]);

  const resetSession = useCallback(() => {
    flushTime();
    setSessionSeconds(0);
  }, [flushTime]);

  return {
    sessionSeconds,
    totalNotebookSeconds: totalNotebookSeconds + unpersistedSecondsRef.current,
    isPaused,
    togglePause,
    resetSession,
    activeBookTitle,
    setActiveBookTitle,
    formattedSession: formatTimerDigital(sessionSeconds),
    formattedFriendly: formatTimerFriendly(sessionSeconds),
    formattedTotal: formatTimerFriendly(totalNotebookSeconds + unpersistedSecondsRef.current)
  };
}
