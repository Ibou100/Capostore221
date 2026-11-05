import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { Product, CategoryId, ProductGender, FilterState, ViewState, ProductCustomOverride } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { fetchCloudProducts, saveCloudProducts } from '../utils/cloudSync';
import {
  isSupabaseConfigured,
  fetchSupabaseProducts,
  upsertSupabaseProduct,
  deleteSupabaseProduct,
  getSupabaseClient
} from '../lib/supabase';

interface StoreContextType {
  products: Product[];
  currentView: ViewState;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewState>>;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  filteredProducts: Product[];
  
  // Navigation
  goToHome: () => void;
  goToCatalog: (params?: { category?: CategoryId; gender?: ProductGender; query?: string }) => void;
  goToProduct: (productId: string) => void;
  goToEditorial: () => void;
  goToWishlist: () => void;
  goToCartPage: () => void;
  goToOrders: () => void;
  goToTracking: (orderId?: string) => void;
  goToAdmin: (tab?: 'products' | 'orders' | 'security' | any) => void;
  
  // Product overrides (Owner customisations: name, price, available sizes, stock)
  productOverrides: Record<string, ProductCustomOverride>;
  updateProductOverride: (productId: string, override: ProductCustomOverride) => void;
  resetProductOverrides: () => void;
  
  // Custom Owner Products (Created & Uploaded from Admin panel)
  customProducts: Product[];
  addCustomProduct: (product: Product) => Promise<boolean>;
  deleteCustomProduct: (productId: string) => Promise<boolean>;
  refreshCloudCatalog: () => Promise<void>;

  // Search Modal
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  
  // Quick View Product Modal
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  
  // Toast notifications
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'tous',
  gender: 'all',
  minPrice: 0,
  maxPrice: 100000,
  sizes: [],
  colors: [],
  inStockOnly: false,
  sortBy: 'featured',
  searchQuery: '',
};

const OVERRIDES_STORAGE_KEY = 'capostore_product_overrides_v1';
const CUSTOM_PRODUCTS_STORAGE_KEY = 'capostore_custom_products_v1';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productOverrides, setProductOverrides] = useState<Record<string, ProductCustomOverride>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(OVERRIDES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      }
    } catch (e) {
      console.error('Failed to parse product overrides from localStorage', e);
    }
    return {};
  });

  const [customProducts, setCustomProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CUSTOM_PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Failed to parse custom products from localStorage', e);
    }
    return [];
  });

  const customProductsRef = useRef<Product[]>(customProducts);
  useEffect(() => {
    customProductsRef.current = customProducts;
  }, [customProducts]);

  const productOverridesRef = useRef<Record<string, ProductCustomOverride>>(productOverrides);
  useEffect(() => {
    productOverridesRef.current = productOverrides;
  }, [productOverrides]);

  const [currentView, setCurrentView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const params = new URLSearchParams(window.location.search);

      // Instant direct link to admin (/admin or ?cle=2210 or ?admin=1)
      if (
        pathname === '/admin' || 
        pathname.startsWith('/admin/') ||
        params.get('cle') !== null ||
        params.get('key') !== null ||
        params.get('admin') === '1' || 
        params.get('espace') === 'proprietaire'
      ) {
        return { type: 'admin' };
      }

      if (pathname === '/commandes' || pathname === '/orders' || params.get('orders') === '1' || params.get('commandes') === '1') {
        return { type: 'orders' };
      }
      if (pathname === '/suivi' || pathname === '/tracking' || params.get('track')) {
        return { type: 'tracking', orderId: params.get('track') || undefined };
      }
      if (pathname === '/catalogue' || pathname === '/boutique') {
        return { type: 'catalog' };
      }
    }
    return { type: 'home' };
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync custom products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(customProducts));
    } catch (e) {
      console.error('Failed to save custom products', e);
    }
  }, [customProducts]);

  // Sync overrides to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(productOverrides));
    } catch (e) {
      console.error('Failed to save product overrides', e);
    }
  }, [productOverrides]);

  /**
   * Cloud Catalog Synchronization:
   * Merges custom products and overrides across all devices via Supabase Database (or local fallback)
   */
  const refreshCloudCatalog = useCallback(async () => {
    try {
      // 1. Try Supabase first if configured
      if (isSupabaseConfigured()) {
        const dbProducts = await fetchSupabaseProducts();
        if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
          const customs = dbProducts.filter((p) => p.id.startsWith('capo-custom-'));
          setCustomProducts(customs);
          try {
            localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(customs));
          } catch {}

          const overrides: Record<string, ProductCustomOverride> = {};
          dbProducts
            .filter((p) => !p.id.startsWith('capo-custom-'))
            .forEach((p) => {
              overrides[p.id] = {
                name: p.name,
                price: p.price,
                stock: p.stock,
                published: p.published,
                availableSizes: p.availableSizes,
              };
            });
          setProductOverrides(overrides);
          try {
            localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
          } catch {}
          return;
        }
      }

      // 2. Fallback to Cloud Sync
      const cloudData = await fetchCloudProducts();
      
      // Merge custom products
      if (cloudData.customProducts && Array.isArray(cloudData.customProducts)) {
        setCustomProducts((prev) => {
          const map = new Map<string, Product>();
          cloudData.customProducts.forEach((p) => {
            if (p && p.id) map.set(p.id, p);
          });
          prev.forEach((p) => {
            if (p && p.id && !map.has(p.id)) {
              map.set(p.id, p);
            }
          });
          const merged = Array.from(map.values());
          try {
            localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.error(e);
          }
          return merged;
        });
      }

      // Merge overrides
      if (cloudData.overrides && typeof cloudData.overrides === 'object') {
        setProductOverrides((prev) => {
          const merged = { ...prev, ...cloudData.overrides };
          try {
            localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.error(e);
          }
          return merged;
        });
      }
    } catch (err) {
      console.warn('Could not refresh cloud catalog:', err);
    }
  }, []);

  // Sync cloud catalog on mount and on tab focus
  useEffect(() => {
    refreshCloudCatalog();

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        refreshCloudCatalog();
      }
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [refreshCloudCatalog]);

  // Real-time Supabase Subscription for products
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const client = getSupabaseClient();
    if (!client) return;

    const channel = client
      .channel('public:products_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        refreshCloudCatalog();
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [refreshCloudCatalog]);

  // Add custom product from owner admin
  const addCustomProduct = async (product: Product): Promise<boolean> => {
    const updated = [product, ...customProductsRef.current];
    setCustomProducts(updated);
    try {
      localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast(`Nouvel article "${product.name}" ajouté avec succès !`, 'success');

    // Supabase push if configured
    if (isSupabaseConfigured()) {
      upsertSupabaseProduct(product).catch((err) => console.warn('Supabase product save failed:', err));
    }

    // Cloud push fallback
    const saved = await saveCloudProducts(updated, productOverridesRef.current);
    return saved;
  };

  // Delete custom product from owner admin
  const deleteCustomProduct = async (productId: string): Promise<boolean> => {
    const updated = customProductsRef.current.filter((p) => p.id !== productId);
    setCustomProducts(updated);
    try {
      localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast('Article supprimé du catalogue.', 'info');

    if (isSupabaseConfigured()) {
      deleteSupabaseProduct(productId).catch((err) => console.warn('Supabase product delete failed:', err));
    }

    // Cloud push fallback
    const saved = await saveCloudProducts(updated, productOverridesRef.current);
    return saved;
  };

  // Compute merged products (Base 23 products + Owner custom products + Overrides)
  const products = useMemo(() => {
    const allBase = [...INITIAL_PRODUCTS, ...customProducts];
    return allBase.map((baseProduct) => {
      const override = productOverrides[baseProduct.id];
      if (!override) return baseProduct;

      return {
        ...baseProduct,
        name: override.name !== undefined && override.name.trim() !== '' ? override.name.trim() : baseProduct.name,
        price: override.price !== undefined && override.price > 0 ? override.price : baseProduct.price,
        compareAtPrice: override.compareAtPrice !== undefined 
          ? (override.compareAtPrice && override.compareAtPrice > 0 ? override.compareAtPrice : undefined) 
          : baseProduct.compareAtPrice,
        availableSizes: override.availableSizes !== undefined ? override.availableSizes : baseProduct.availableSizes,
        stock: override.stock !== undefined ? override.stock : baseProduct.stock,
        published: override.published !== undefined ? override.published : baseProduct.published,
      };
    });
  }, [productOverrides, customProducts]);

  const updateProductOverride = (productId: string, override: ProductCustomOverride) => {
    setProductOverrides((prev) => {
      const updated = {
        ...prev,
        [productId]: {
          ...prev[productId],
          ...override,
        },
      };
      try {
        localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      // Supabase push directly
      if (isSupabaseConfigured()) {
        const fullProd = products.find((p) => p.id === productId);
        if (fullProd) {
          upsertSupabaseProduct({
            ...fullProd,
            ...override,
            compareAtPrice: override.compareAtPrice !== undefined ? override.compareAtPrice : (fullProd.compareAtPrice || null),
          }).catch((err) => console.warn('Supabase price update error:', err));
        }
      }

      saveCloudProducts(customProductsRef.current, updated).catch((err) =>
        console.warn('Cloud sync override failed:', err)
      );
      return updated;
    });
    showToast('Modifications du produit enregistrées avec succès !', 'success');
  };

  const resetProductOverrides = () => {
    setProductOverrides({});
    try {
      localStorage.removeItem(OVERRIDES_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    saveCloudProducts(customProductsRef.current, {}).catch((err) =>
      console.warn('Cloud reset failed:', err)
    );
    showToast('Toutes les tenues ont été réinitialisées aux valeurs par défaut.', 'info');
  };

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3800);
  }, []);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '');
      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        setCurrentView({ type: 'admin' });
      } else if (pathname === '/commandes' || pathname === '/orders') {
        setCurrentView({ type: 'orders' });
      } else if (pathname === '/suivi' || pathname === '/tracking') {
        const params = new URLSearchParams(window.location.search);
        setCurrentView({ type: 'tracking', orderId: params.get('track') || undefined });
      } else if (pathname === '/catalogue' || pathname === '/boutique') {
        setCurrentView({ type: 'catalog' });
      } else {
        setCurrentView({ type: 'home' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handlers
  const goToHome = () => {
    setCurrentView({ type: 'home' });
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCatalog = (params?: { category?: CategoryId; gender?: ProductGender; query?: string }) => {
    if (params) {
      setFilters((prev) => ({
        ...prev,
        category: params.category || prev.category,
        gender: params.gender || 'all',
        searchQuery: params.query !== undefined ? params.query : prev.searchQuery,
      }));
    }
    setCurrentView({
      type: 'catalog',
      initialCategory: params?.category,
      initialGender: params?.gender,
      query: params?.query,
    });
    if (typeof window !== 'undefined' && window.location.pathname !== '/catalogue') {
      window.history.pushState(null, '', '/catalogue');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToProduct = (productId: string) => {
    setCurrentView({ type: 'product-detail', productId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToEditorial = () => {
    setCurrentView({ type: 'editorial' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToWishlist = () => {
    setCurrentView({ type: 'wishlist' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCartPage = () => {
    setCurrentView({ type: 'cart-page' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToOrders = () => {
    setCurrentView({ type: 'orders' });
    if (typeof window !== 'undefined' && window.location.pathname !== '/commandes') {
      window.history.pushState(null, '', '/commandes');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToTracking = (orderId?: string) => {
    setCurrentView({ type: 'tracking', orderId });
    if (typeof window !== 'undefined') {
      const url = orderId ? `/suivi?track=${encodeURIComponent(orderId)}` : '/suivi';
      window.history.pushState(null, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToAdmin = (tab?: 'products' | 'orders' | 'security' | any) => {
    const validTab = (typeof tab === 'string' && ['products', 'orders', 'security'].includes(tab)) ? tab : undefined;
    setCurrentView({ type: 'admin' });
    if (typeof window !== 'undefined') {
      const targetUrl = validTab ? `/admin?tab=${validTab}` : '/admin';
      window.history.pushState(null, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.published);

    // Filter by Category
    if (filters.category && filters.category !== 'tous') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Filter by Gender
    if (filters.gender && filters.gender !== 'all') {
      result = result.filter((p) => p.gender === filters.gender || p.gender === 'unisexe');
    }

    // Filter by Price
    result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    // Filter by In-Stock Only
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Filter by Sizes
    if (filters.sizes.length > 0) {
      result = result.filter((p) => {
        if (!p.availableSizes) return false;
        return filters.sizes.some((size) => p.availableSizes?.includes(size));
      });
    }

    // Filter by Colors
    if (filters.colors.length > 0) {
      result = result.filter((p) => {
        if (!p.availableColors) return false;
        return filters.colors.some((colorName) =>
          p.availableColors?.some((c) => c.name.toLowerCase() === colorName.toLowerCase())
        );
      });
    }

    // Search query filtering
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.materials && p.materials.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, filters]);

  return (
    <StoreContext.Provider
      value={{
        products,
        currentView,
        setCurrentView,
        filters,
        setFilters,
        resetFilters,
        updateFilter,
        filteredProducts,
        goToHome,
        goToCatalog,
        goToProduct,
        goToEditorial,
        goToWishlist,
        goToCartPage,
        goToOrders,
        goToTracking,
        goToAdmin,
        productOverrides,
        updateProductOverride,
        resetProductOverrides,
        customProducts,
        addCustomProduct,
        deleteCustomProduct,
        refreshCloudCatalog,
        isSearchOpen,
        openSearch,
        closeSearch,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
