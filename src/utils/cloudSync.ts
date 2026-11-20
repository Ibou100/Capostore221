/**
 * Cloud Synchronization Service for CAPOSTORE221
 * Enables cross-device synchronization between mobile customers and desktop/mobile owner admin
 * using a high-availability cloud REST endpoint with local cache fallback.
 */

import type { Order, Product, ProductCustomOverride } from '../types';

export const CLOUD_ORDERS_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a09d98f701a1a811947c37fe';
export const CLOUD_PRODUCTS_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a09d98f701a1a813dde33803';

/**
 * Fetches all orders from the shared cloud database
 */
export async function fetchCloudOrders(): Promise<Order[]> {
  try {
    const response = await fetch(CLOUD_ORDERS_ENDPOINT, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn('Cloud orders fetch status:', response.status);
      return [];
    }

    const json = await response.json();
    if (json?.data?.orders && Array.isArray(json.data.orders)) {
      return json.data.orders as Order[];
    }
  } catch (err) {
    console.warn('Could not fetch cloud orders (offline or network error):', err);
  }
  return [];
}

/**
 * Saves all orders to the shared cloud database
 */
export async function saveCloudOrders(orders: Order[]): Promise<boolean> {
  try {
    const response = await fetch(CLOUD_ORDERS_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'CAPOSTORE221_ORDERS',
        data: {
          orders,
          lastUpdated: new Date().toISOString(),
        },
      }),
    });

    return response.ok;
  } catch (err) {
    console.warn('Could not sync orders to cloud:', err);
    return false;
  }
}

/**
 * Fetches custom products and overrides from the shared cloud database
 */
export async function fetchCloudProducts(): Promise<{
  customProducts: Product[];
  overrides: Record<string, ProductCustomOverride>;
  deletedProductIds?: string[];
}> {
  try {
    const response = await fetch(CLOUD_PRODUCTS_ENDPOINT, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) return { customProducts: [], overrides: {}, deletedProductIds: [] };

    const json = await response.json();
    return {
      customProducts: Array.isArray(json?.data?.customProducts) ? json.data.customProducts : [],
      overrides: json?.data?.overrides && typeof json.data.overrides === 'object' ? json.data.overrides : {},
      deletedProductIds: Array.isArray(json?.data?.deletedProductIds) ? json.data.deletedProductIds : [],
    };
  } catch (err) {
    console.warn('Could not fetch cloud products:', err);
    return { customProducts: [], overrides: {}, deletedProductIds: [] };
  }
}

/**
 * Saves custom products and overrides to the shared cloud database
 */
export async function saveCloudProducts(
  customProducts: Product[],
  overrides: Record<string, ProductCustomOverride>,
  deletedProductIds: string[] = []
): Promise<boolean> {
  try {
    const response = await fetch(CLOUD_PRODUCTS_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'CAPOSTORE221_CUSTOM_PRODUCTS',
        data: {
          customProducts,
          overrides,
          deletedProductIds,
          lastUpdated: new Date().toISOString(),
        },
      }),
    });

    return response.ok;
  } catch (err) {
    console.warn('Could not sync products to cloud:', err);
    return false;
  }
}

/**
 * Optimizes an image file from the owner's phone or computer to a crisp Base64 data URL.
 * Preserves small/medium files (< 180 KB) untouched to avoid quality loss,
 * and uses high-res WebP (max 1400px, quality 0.90) for larger uploads.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.9
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const originalDataUrl = readerEvent.target?.result as string;

      // Keep already-light images untouched so crisp WebP/PNG/JPEG assets stay sharp
      if (file.size <= 180 * 1024 && originalDataUrl) {
        resolve(originalDataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(originalDataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const webpUrl = canvas.toDataURL('image/webp', quality);
        if (webpUrl.startsWith('data:image/webp')) {
          resolve(webpUrl);
        } else {
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };

      img.onerror = (err) => reject(err);
      img.src = originalDataUrl;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
