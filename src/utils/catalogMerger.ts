import { Notebook } from '../types';

/**
 * Merges the base classical library catalog (87 hubs, 14,713+ books) with:
 * 1. Global Firestore live catalog updates from Admin (/notebooks)
 * 2. Personal custom notebooks created by the user
 *
 * Guarantees:
 * - Base catalog items are NEVER lost or wiped when a new item is added to Firestore.
 * - Admin additions in Firestore are seamlessly appended or overlaid.
 * - Admin updates to specific hubs (like adding Shamela links or volumes) update that specific hub.
 * - Admin-deleted hubs (marked visible: false) are filtered out.
 */
export function mergeCatalogs(
  baseNotebooks: Notebook[],
  cloudNotebooks: Notebook[] = [],
  userCustomNotebooks: Notebook[] = []
): Notebook[] {
  // If base notebooks haven't loaded yet, return cloud notebooks or empty
  if (!baseNotebooks || baseNotebooks.length === 0) {
    return cloudNotebooks.filter((n) => n.visible !== false);
  }

  const map = new Map<string, Notebook>();

  // 1. Populate all 87 base notebooks
  baseNotebooks.forEach((nb) => {
    map.set(nb.id, { ...nb });
  });

  // 2. Overlay global cloud notebooks from Firestore /notebooks
  cloudNotebooks.forEach((cloudNb) => {
    if (cloudNb.visible === false) {
      // Admin soft-deleted or hidden this hub
      map.delete(cloudNb.id);
      return;
    }

    const existing = map.get(cloudNb.id);
    if (existing) {
      // Overwrite/update existing hub with cloud changes
      // Protect against accidental loss of books if cloud payload has empty books array
      const booksList = (cloudNb.books && cloudNb.books.length > 0)
        ? cloudNb.books
        : (existing.books || []);

      map.set(cloudNb.id, {
        ...existing,
        ...cloudNb,
        books: booksList,
        totalSources: booksList.length,
      });
    } else {
      // New hub created by admin in Firestore
      map.set(cloudNb.id, {
        ...cloudNb,
        totalSources: (cloudNb.books || []).length,
      });
    }
  });

  // 3. Overlay any personal custom notebooks
  userCustomNotebooks.forEach((customNb) => {
    if (!map.has(customNb.id)) {
      map.set(customNb.id, customNb);
    }
  });

  const merged = Array.from(map.values());

  // Sort: newly added items or items with lower order number first
  merged.sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 999;
    const orderB = typeof b.order === 'number' ? b.order : 999;
    if (orderA !== orderB) return orderA - orderB;
    return 0;
  });

  return merged;
}
