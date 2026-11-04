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
}> {
  try {
    const response = await fetch(CLOUD_PRODUCTS_ENDPOINT, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) return { customProducts: [], overrides: {} };

    const json = await response.json();
    return {
      customProducts: Array.isArray(json?.data?.customProducts) ? json.data.customProducts : [],
      overrides: json?.data?.overrides && typeof json.data.overrides === 'object' ? json.data.overrides : {},
    };
  } catch (err) {
    console.warn('Could not fetch cloud products:', err);
    return { customProducts: [], overrides: {} };
  }
}

/**
 * Saves custom products and overrides to the shared cloud database
 */
export async function saveCloudProducts(
  customProducts: Product[],
  overrides: Record<string, ProductCustomOverride>
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
 * Compresses an image file from the owner's phone or computer to an optimized Base64 JPEG data URL
 * (Limits max width/height to 900px, quality 0.82 -> result is typically ~40-80 KB)
 */
export function compressImageFile(
  file: File,
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
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
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = (err) => reject(err);
      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
