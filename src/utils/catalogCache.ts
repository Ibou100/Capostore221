import type { Product } from '../types';

const DB_NAME = 'capostore221_cache';
const STORE_NAME = 'kv';
const CUSTOM_PRODUCTS_KEY = 'custom_products_v1';

function openCacheDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedCustomProducts(): Promise<Product[] | null> {
  try {
    const db = await openCacheDB();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(CUSTOM_PRODUCTS_KEY);
      req.onsuccess = () => resolve(Array.isArray(req.result) ? (req.result as Product[]) : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function setCachedCustomProducts(products: Product[]): Promise<void> {
  try {
    const db = await openCacheDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(products, CUSTOM_PRODUCTS_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // Ignore cache write errors
  }
}
