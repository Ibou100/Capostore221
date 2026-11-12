/**
 * Supabase Database Client for CAPOSTORE221
 * Provides real-time, persistent PostgreSQL cloud database integration for:
 * - Products catalog (live prices, stock, photo uploads, active status)
 * - Orders management (multi-device real-time sync between mobile clients and admin)
 *
 * Supports configuration via:
 * 1. Environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
 * 2. In-app Owner Admin configuration (stored safely in local storage)
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Order, OrderStatus, Product } from '../types';

const SUPABASE_CONFIG_KEY = 'capostore_supabase_config_v1';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let cachedClient: SupabaseClient | null = null;
let lastUsedConfig: string = '';

export const DEFAULT_SUPABASE_URL = 'https://qpvjmqjrpzwefbolswvh.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_IuVNbH_zrUx3gaK7uCvJgg_q9MxFmf0';

/**
 * Sanitizes and normalizes Supabase URL
 */
export function cleanSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  // Strip /rest/v1 or /rest if present
  url = url.replace(/\/rest(\/v1)?\/?$/, '');
  return url;
}

/**
 * Gets currently saved Supabase configuration
 */
export function getSupabaseConfig(): SupabaseConfig {
  // 1. Check environment variables
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey && typeof envUrl === 'string' && typeof envKey === 'string') {
    return { url: cleanSupabaseUrl(envUrl), anonKey: envKey.trim() };
  }

  // 2. Check local storage (configured by owner in Admin panel)
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.url && parsed?.anonKey) {
          return { url: cleanSupabaseUrl(parsed.url), anonKey: String(parsed.anonKey).trim() };
        }
      }
    } catch (e) {
      console.warn('Could not read Supabase config from localStorage:', e);
    }
  }

  // 3. Fallback to production CapoStore221 Supabase project
  return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_KEY };
}

/**
 * Checks if Supabase has been configured with valid credentials
 */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(
    url && 
    anonKey && 
    url.startsWith('https://') && 
    url.includes('.supabase.co') && 
    anonKey.length > 20
  );
}

/**
 * Saves Supabase config from the Admin panel
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  const cleanUrl = cleanSupabaseUrl(url);
  const cleanKey = anonKey.trim();
  localStorage.setItem(
    SUPABASE_CONFIG_KEY,
    JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
  );
  cachedClient = null; // force recreation with new credentials
}

/**
 * Clears Supabase config
 */
export function clearSupabaseConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SUPABASE_CONFIG_KEY);
  cachedClient = null;
}

/**
 * Gets or creates the Supabase client
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return null;

  const configSignature = `${config.url}::${config.anonKey}`;
  if (cachedClient && lastUsedConfig === configSignature) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastUsedConfig = configSignature;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Tests live connection to Supabase database
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Veuillez renseigner votre URL de projet Supabase et votre clé API anon publique.',
    };
  }

  try {
    // Attempt a lightweight read on products table
    const { error } = await client.from('products').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connecté à Supabase avec succès, mais la table "products" n\'a pas encore été créée. Cliquez sur "Créer les tables" ci-dessous.',
        };
      }
      return { success: false, message: `Erreur Supabase (${error.code || 'API'}): ${error.message}` };
    }
    return { success: true, message: 'Connexion à la base de données Supabase établie avec succès !' };
  } catch (e: any) {
    return { success: false, message: `Impossible de joindre Supabase: ${e?.message || 'Erreur réseau'}` };
  }
}

// ============================================================================
// PRODUCTS CRUD OPERATIONS
// ============================================================================

export async function fetchSupabaseProducts(): Promise<Product[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch products error:', error.message);
      return null;
    }

    if (!Array.isArray(data)) return [];

    return data.map((row: any): Product => ({
      id: String(row.id),
      name: String(row.name || ''),
      slug: String(row.slug || row.id),
      category: row.category || 'vetements',
      subCategory: String(row.sub_category || row.subCategory || 'Nouvelle Collection'),
      gender: row.gender || 'homme',
      price: Number(row.price) || 0,
      compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
      images: Array.isArray(row.images) ? row.images : (row.image ? [row.image] : []),
      description: String(row.description || ''),
      details: Array.isArray(row.details) ? row.details : [],
      materials: row.materials ? String(row.materials) : undefined,
      variants: Array.isArray(row.variants) ? row.variants : [],
      availableSizes: Array.isArray(row.available_sizes) ? row.available_sizes : undefined,
      stock: typeof row.stock === 'number' ? row.stock : 10,
      isNew: Boolean(row.is_new),
      isFeatured: Boolean(row.is_featured),
      isPopular: Boolean(row.is_popular),
      published: row.published !== false,
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('Failed to fetch products from Supabase:', err);
    return null;
  }
}

export async function upsertSupabaseProduct(product: Product): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      sub_category: product.subCategory,
      gender: product.gender,
      price: product.price,
      compare_at_price: product.compareAtPrice || null,
      images: product.images,
      description: product.description,
      details: product.details,
      materials: product.materials || null,
      variants: product.variants,
      available_sizes: product.availableSizes || null,
      stock: product.stock,
      is_new: product.isNew || false,
      is_featured: product.isFeatured || false,
      is_popular: product.isPopular || false,
      published: product.published,
      updated_at: new Date().toISOString(),
    };

    const { error } = await client
      .from('products')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Supabase product upsert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase upsertProduct exception:', err);
    return false;
  }
}

export async function deleteSupabaseProduct(productId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('products')
      .delete()
      .eq('id', productId);

    return !error;
  } catch (err) {
    console.error('Supabase deleteProduct error:', err);
    return false;
  }
}

export async function seedInitialProductsToSupabase(products: Product[]): Promise<{ count: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { count: 0, error: 'Supabase non configuré' };

  try {
    const rows = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      sub_category: p.subCategory,
      gender: p.gender,
      price: p.price,
      compare_at_price: p.compareAtPrice || null,
      images: p.images,
      description: p.description,
      details: p.details,
      materials: p.materials || null,
      variants: p.variants,
      available_sizes: p.availableSizes || null,
      stock: p.stock,
      is_new: p.isNew || false,
      is_featured: p.isFeatured || false,
      is_popular: p.isPopular || false,
      published: p.published,
      created_at: p.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await client
      .from('products')
      .upsert(rows, { onConflict: 'id' });

    if (error) return { count: 0, error: error.message };
    return { count: rows.length };
  } catch (e: any) {
    return { count: 0, error: e?.message || 'Erreur inconnue' };
  }
}

// ============================================================================
// ORDERS CRUD OPERATIONS
// ============================================================================

export async function fetchSupabaseOrders(): Promise<Order[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch orders error:', error.message);
      return null;
    }

    if (!Array.isArray(data)) return [];

    return data.map((row: any): Order => ({
      id: String(row.id),
      createdAt: row.created_at || new Date().toISOString(),
      customerName: String(row.customer_name || 'Client CAPOSTORE221'),
      customerPhone: String(row.customer_phone || ''),
      customerCity: String(row.customer_city || 'Dakar'),
      customerAddress: String(row.customer_address || ''),
      paymentMethod: row.payment_method || 'wave',
      items: Array.isArray(row.items) ? row.items : [],
      total: Number(row.total) || 0,
      shippingFee: Number(row.shipping_fee) || 0,
      status: (row.status as OrderStatus) || 'transmise',
      notes: row.notes ? String(row.notes) : undefined,
    }));
  } catch (err) {
    console.warn('Failed to fetch orders from Supabase:', err);
    return null;
  }
}

/**
 * Fetches ONLY the specific orders belonging to a customer's device IDs
 * (Zero leak of other customers' orders)
 */
export async function fetchSupabaseOrdersByIds(ids: string[]): Promise<Order[]> {
  const client = getSupabaseClient();
  if (!client || !ids || ids.length === 0) return [];

  const cleanIds = ids.map((id) => id.trim().toUpperCase()).filter(Boolean);
  if (cleanIds.length === 0) return [];

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .in('id', cleanIds)
      .order('created_at', { ascending: false });

    if (error || !Array.isArray(data)) {
      return [];
    }

    return data.map((row: any): Order => ({
      id: String(row.id),
      createdAt: row.created_at || new Date().toISOString(),
      customerName: String(row.customer_name || 'Client CAPOSTORE221'),
      customerPhone: String(row.customer_phone || ''),
      customerCity: String(row.customer_city || 'Dakar'),
      customerAddress: String(row.customer_address || ''),
      paymentMethod: row.payment_method || 'wave',
      items: Array.isArray(row.items) ? row.items : [],
      total: Number(row.total) || 0,
      shippingFee: Number(row.shipping_fee) || 0,
      status: (row.status as OrderStatus) || 'transmise',
      notes: row.notes ? String(row.notes) : undefined,
    }));
  } catch (err) {
    console.warn('Failed to fetch orders by IDs from Supabase:', err);
    return [];
  }
}

/**
 * Fetches a single order strictly by exact ID
 */
export async function fetchSupabaseOrderById(orderId: string): Promise<Order | null> {
  const client = getSupabaseClient();
  if (!client || !orderId) return null;

  const cleanId = orderId.trim().toUpperCase();
  if (!cleanId) return null;

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .eq('id', cleanId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: String(data.id),
      createdAt: data.created_at || new Date().toISOString(),
      customerName: String(data.customer_name || 'Client CAPOSTORE221'),
      customerPhone: String(data.customer_phone || ''),
      customerCity: String(data.customer_city || 'Dakar'),
      customerAddress: String(data.customer_address || ''),
      paymentMethod: data.payment_method || 'wave',
      items: Array.isArray(data.items) ? data.items : [],
      total: Number(data.total) || 0,
      shippingFee: Number(data.shipping_fee) || 0,
      status: (data.status as OrderStatus) || 'transmise',
      notes: data.notes ? String(data.notes) : undefined,
    };
  } catch (err) {
    console.warn('Failed to fetch single order from Supabase:', err);
    return null;
  }
}

export async function insertSupabaseOrder(order: Order): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = {
      id: order.id,
      created_at: order.createdAt,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_city: order.customerCity,
      customer_address: order.customerAddress,
      payment_method: order.paymentMethod,
      items: order.items,
      total: order.total,
      shipping_fee: order.shippingFee,
      status: order.status,
      notes: order.notes || null,
    };

    const { error } = await client
      .from('orders')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Supabase order insert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to insert order to Supabase:', err);
    return false;
  }
}

export async function updateSupabaseOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    return !error;
  } catch (err) {
    console.error('Supabase update order status error:', err);
    return false;
  }
}

export async function deleteSupabaseOrder(orderId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('orders')
      .delete()
      .eq('id', orderId);

    return !error;
  } catch (err) {
    console.error('Supabase delete order error:', err);
    return false;
  }
}

export interface PublicOrderActivity {
  productId: string;
  productName: string;
  image?: string;
  quantity: number;
  city: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches anonymized recent order activity (city, product, status, time) without exposing customer PII
 */
export async function fetchPublicOrderActivity(): Promise<PublicOrderActivity[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('orders')
      .select('created_at, updated_at, customer_city, status, items')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !Array.isArray(data)) {
      return [];
    }

    const activities: PublicOrderActivity[] = [];
    for (const row of data) {
      const rawItems = Array.isArray(row.items) ? row.items : [];
      const city = String(row.customer_city || 'Dakar').replace(/\s*\(Boutique\)/i, '').trim() || 'Sénégal';
      const createdAt = row.created_at || new Date().toISOString();
      const updatedAt = row.updated_at || createdAt;
      const validStatuses: OrderStatus[] = ['transmise', 'confirmee', 'en_preparation', 'en_livraison', 'livree'];
      const status: OrderStatus = validStatuses.includes(row.status) ? row.status : 'transmise';

      for (const item of rawItems) {
        if (!item) continue;
        activities.push({
          productId: String(item.productId || ''),
          productName: String(item.name || 'Article CAPOSTORE221'),
          image: item.image ? String(item.image) : undefined,
          quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
          city,
          status,
          createdAt,
          updatedAt,
        });
      }
    }

    // Sort by most recently treated or placed order so newly processed orders appear first
    activities.sort((a, b) => {
      const timeA = Math.max(new Date(a.createdAt).getTime(), new Date(a.updatedAt).getTime());
      const timeB = Math.max(new Date(b.createdAt).getTime(), new Date(b.updatedAt).getTime());
      return timeB - timeA;
    });

    return activities;
  } catch (err) {
    console.warn('Failed to fetch public order activity:', err);
    return [];
  }
}
