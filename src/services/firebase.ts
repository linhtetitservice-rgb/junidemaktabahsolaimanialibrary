import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  collection, 
  serverTimestamp,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Notebook, BookProgress } from '../types';

export const ADMIN_EMAIL = 'linhtetitservice@gmail.com';

export function isUserAdmin(user: User | null | undefined): boolean {
  if (!user || !user.email) return false;
  return user.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// 1. Initialize Firebase App and Services
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// 2. Test Connection on Boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is offline. Check network or Firebase configuration.');
    } else {
      // Document may not exist, but server connectivity was established
      console.log('Firebase connection initialized successfully.');
    }
    return true;
  }
}

// 3. Strict Error Handling conforming to FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 4. Google Authentication
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return result.user;
  } catch (error: any) {
    // If popup was closed by user or cancelled, log gracefully
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      console.info('User cancelled Google sign in popup.');
      throw error;
    }
    console.error('Failed to sign in with Google:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
}

// 5. User Profile Sync
export async function syncUserProfile(user: User, preferences?: { language?: string; theme?: string }) {
  const userRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;
  try {
    const existingSnap = await getDoc(userRef);
    const now = new Date().toISOString();

    if (!existingSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        preferredLanguage: preferences?.language || 'ar',
        preferredTheme: preferences?.theme || 'emerald-night',
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await setDoc(userRef, {
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        preferredLanguage: preferences?.language || existingSnap.data()?.preferredLanguage || 'ar',
        preferredTheme: preferences?.theme || existingSnap.data()?.preferredTheme || 'emerald-night',
        updatedAt: now,
      }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 6. Favorites Cloud Sync
export async function syncFavoriteToCloud(userId: string, notebook: Notebook): Promise<void> {
  const safeId = (notebook.id || `nb-${Date.now()}`).trim().slice(0, 128);
  const path = `users/${userId}/favorites/${safeId}`;
  try {
    const favRef = doc(db, 'users', userId, 'favorites', safeId);
    const payload: {
      id: string;
      userId: string;
      title: string;
      cat: string;
      icon: string;
      link: string;
      shamelaLink?: string;
      savedAt: string;
    } = {
      id: safeId,
      userId,
      title: (notebook.title || 'Untitled Hub').trim().slice(0, 512),
      cat: (notebook.cat || 'Islamic Fiqh').trim().slice(0, 256),
      icon: (notebook.icon || '📖').trim().slice(0, 32),
      link: (notebook.link || '').trim().slice(0, 2048),
      savedAt: new Date().toISOString(),
    };
    if (notebook.shamelaLink && notebook.shamelaLink.trim()) {
      payload.shamelaLink = notebook.shamelaLink.trim().slice(0, 2048);
    }
    await setDoc(favRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeFavoriteFromCloud(userId: string, notebookId: string): Promise<void> {
  const safeId = (notebookId || '').trim().slice(0, 128);
  const path = `users/${userId}/favorites/${safeId}`;
  try {
    const favRef = doc(db, 'users', userId, 'favorites', safeId);
    await deleteDoc(favRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchFavoritesFromCloud(userId: string): Promise<Notebook[]> {
  const path = `users/${userId}/favorites`;
  try {
    const colRef = collection(db, 'users', userId, 'favorites');
    const snapshot = await getDocs(colRef);
    const list: Notebook[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: data.id,
        title: data.title,
        cat: data.cat || 'Islamic Fiqh',
        icon: data.icon || '📖',
        link: data.link || '',
        shamelaLink: data.shamelaLink || undefined,
      });
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// 7. Reading Progress Cloud Sync
export async function syncReadingProgressToCloud(userId: string, progress: BookProgress): Promise<void> {
  // Sanitize doc ID for firestore
  const safeId = progress.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `users/${userId}/readingProgress/${safeId}`;
  try {
    const docRef = doc(db, 'users', userId, 'readingProgress', safeId);
    const payload: Record<string, any> = {
      id: progress.id.slice(0, 256),
      userId,
      bookTitle: (progress.bookTitle || 'Untitled Book').trim().slice(0, 512),
      author: (progress.author || '').trim().slice(0, 256),
      notebookId: (progress.notebookId || '').trim().slice(0, 128),
      notebookTitle: (progress.notebookTitle || '').trim().slice(0, 512),
      status: progress.status,
      currentVolume: typeof progress.currentVolume === 'number' ? progress.currentVolume : 1,
      totalVolumes: typeof progress.totalVolumes === 'number' ? progress.totalVolumes : 1,
      timeSpentSeconds: typeof progress.timeSpentSeconds === 'number' ? progress.timeSpentSeconds : 0,
      notes: (progress.notes || '').slice(0, 8192),
      lastViewedAt: typeof progress.lastViewedAt === 'number' ? progress.lastViewedAt : Date.now(),
      updatedAt: new Date().toISOString(),
    };
    if (progress.shamelaLink && progress.shamelaLink.trim()) {
      payload.shamelaLink = progress.shamelaLink.trim().slice(0, 2048);
    }
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchReadingProgressFromCloud(userId: string): Promise<BookProgress[]> {
  const path = `users/${userId}/readingProgress`;
  try {
    const colRef = collection(db, 'users', userId, 'readingProgress');
    const snapshot = await getDocs(colRef);
    const items: BookProgress[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      items.push({
        id: d.id,
        bookTitle: d.bookTitle,
        author: d.author,
        notebookId: d.notebookId,
        notebookTitle: d.notebookTitle,
        status: d.status,
        currentVolume: d.currentVolume,
        totalVolumes: d.totalVolumes,
        timeSpentSeconds: d.timeSpentSeconds,
        notes: d.notes,
        shamelaLink: d.shamelaLink,
        lastViewedAt: d.lastViewedAt,
      });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// 8. Custom Notebooks Cloud Sync
export async function syncCustomNotebookToCloud(userId: string, notebook: Notebook): Promise<void> {
  const safeId = (notebook.id || `nb-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `users/${userId}/customNotebooks/${safeId}`;
  try {
    const docRef = doc(db, 'users', userId, 'customNotebooks', safeId);
    const payload: Record<string, any> = {
      id: safeId,
      userId,
      icon: (notebook.icon || '📖').trim().slice(0, 32),
      title: (notebook.title || 'Untitled Hub').trim().slice(0, 512),
      cat: (notebook.cat || 'Islamic Fiqh').trim().slice(0, 256),
      link: (notebook.link || '').trim().slice(0, 2048),
      desc: (notebook.desc || '').trim().slice(0, 2048),
      booksCount: (notebook.books || []).length,
      createdAt: new Date().toISOString(),
    };
    if (notebook.shamelaLink && notebook.shamelaLink.trim()) {
      payload.shamelaLink = notebook.shamelaLink.trim().slice(0, 2048);
    }
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchCustomNotebooksFromCloud(userId: string): Promise<Notebook[]> {
  const path = `users/${userId}/customNotebooks`;
  try {
    const colRef = collection(db, 'users', userId, 'customNotebooks');
    const snapshot = await getDocs(colRef);
    const notebooks: Notebook[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      notebooks.push({
        id: d.id,
        icon: d.icon || '📖',
        title: d.title,
        cat: d.cat,
        link: d.link,
        desc: d.desc,
        books: [{ title: d.title }],
      });
    });
    return notebooks;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// 9. Global Shared Library Catalog (Admin managed, public read, live onSnapshot)
export function subscribeToGlobalCatalog(
  onData: (notebooks: Notebook[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = 'notebooks';
  const colRef = collection(db, path);

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const items: Notebook[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        items.push({
          id: d.id,
          icon: d.icon || '📖',
          title: d.title,
          titleLang: d.titleLang || 'ar',
          cat: d.cat,
          libTitle: d.libTitle,
          desc: d.desc,
          fullDesc: d.fullDesc,
          link: d.link,
          shamelaLink: d.shamelaLink,
          books: Array.isArray(d.books) ? d.books : [],
          keywords: Array.isArray(d.keywords) ? d.keywords : [],
          totalSources: typeof d.totalSources === 'number' ? d.totalSources : (d.books?.length || 0),
          order: typeof d.order === 'number' ? d.order : 999,
          visible: d.visible !== false,
          added: d.added || d.updatedAt,
        });
      });
      // Sort by order ascending
      items.sort((a, b) => (a.order || 999) - (b.order || 999));
      onData(items);
    },
    (error) => {
      console.warn('Realtime catalog subscription error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );

  return unsubscribe;
}

export async function fetchGlobalCatalog(): Promise<Notebook[]> {
  const path = 'notebooks';
  try {
    const colRef = collection(db, path);
    const snapshot = await getDocs(colRef);
    const items: Notebook[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      items.push({
        id: d.id,
        icon: d.icon || '📖',
        title: d.title,
        titleLang: d.titleLang || 'ar',
        cat: d.cat,
        libTitle: d.libTitle,
        desc: d.desc,
        fullDesc: d.fullDesc,
        link: d.link,
        shamelaLink: d.shamelaLink,
        books: Array.isArray(d.books) ? d.books : [],
        keywords: Array.isArray(d.keywords) ? d.keywords : [],
        totalSources: typeof d.totalSources === 'number' ? d.totalSources : (d.books?.length || 0),
        order: typeof d.order === 'number' ? d.order : 999,
        visible: d.visible !== false,
        added: d.added || d.updatedAt,
      });
    });
    items.sort((a, b) => (a.order || 999) - (b.order || 999));
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveGlobalNotebook(notebook: Notebook, adminUid: string): Promise<void> {
  const safeId = (notebook.id || `nb-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `notebooks/${safeId}`;
  try {
    const docRef = doc(db, 'notebooks', safeId);
    await setDoc(docRef, {
      id: safeId,
      icon: (notebook.icon || '📖').trim().slice(0, 32),
      title: (notebook.title || 'Untitled Hub').trim().slice(0, 512),
      titleLang: (notebook.titleLang || 'ar').trim().slice(0, 16),
      cat: (notebook.cat || 'Islamic Fiqh').trim().slice(0, 256),
      libTitle: (notebook.libTitle || '').trim().slice(0, 512),
      desc: (notebook.desc || '').trim().slice(0, 4096),
      fullDesc: (notebook.fullDesc || '').trim().slice(0, 8192),
      link: (notebook.link || '').trim().slice(0, 2048),
      shamelaLink: (notebook.shamelaLink || '').trim().slice(0, 2048),
      books: notebook.books || [],
      keywords: notebook.keywords || [],
      totalSources: (notebook.books || []).length,
      order: typeof notebook.order === 'number' ? notebook.order : Date.now(),
      visible: notebook.visible !== false,
      updatedAt: new Date().toISOString(),
      updatedBy: adminUid,
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteGlobalNotebook(notebookId: string): Promise<void> {
  const safeId = notebookId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `notebooks/${safeId}`;
  try {
    const docRef = doc(db, 'notebooks', safeId);
    // Set visible: false so it is removed from the catalog even if it is in the base static JSON
    await setDoc(docRef, {
      id: safeId,
      title: '[Deleted Hub]',
      link: 'https://deleted.invalid',
      cat: 'Deleted',
      visible: false,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function batchSeedGlobalCatalog(
  notebooksList: Notebook[],
  adminUid: string
): Promise<number> {
  const chunkSize = 20; // safe firestore batch chunk
  let count = 0;
  for (let i = 0; i < notebooksList.length; i += chunkSize) {
    const chunk = notebooksList.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    chunk.forEach((nb, index) => {
      const safeId = (nb.id || `nb-${Date.now()}-${index}`).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
      const docRef = doc(db, 'notebooks', safeId);
      batch.set(docRef, {
        id: safeId,
        icon: (nb.icon || '📖').trim().slice(0, 32),
        title: (nb.title || 'Untitled Hub').trim().slice(0, 512),
        titleLang: (nb.titleLang || 'ar').trim().slice(0, 16),
        cat: (nb.cat || 'Islamic Fiqh').trim().slice(0, 256),
        libTitle: (nb.libTitle || '').trim().slice(0, 512),
        desc: (nb.desc || '').trim().slice(0, 4096),
        fullDesc: (nb.fullDesc || '').trim().slice(0, 8192),
        link: (nb.link || '').trim().slice(0, 2048),
        shamelaLink: (nb.shamelaLink || '').trim().slice(0, 2048),
        books: nb.books || [],
        keywords: nb.keywords || [],
        totalSources: (nb.books || []).length,
        order: typeof nb.order === 'number' ? nb.order : (i + index + 1),
        visible: nb.visible !== false,
        updatedAt: new Date().toISOString(),
        updatedBy: adminUid,
      }, { merge: true });
    });
    try {
      await batch.commit();
      count += chunk.length;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'notebooks');
    }
  }
  return count;
}
