import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Product, CategoryId, ProductGender, FilterState, ViewState } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

interface StoreContextType {
  products: Product[];
  currentView: ViewState;
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
  maxPrice: 10000,
  sizes: [],
  colors: [],
  inStockOnly: false,
  sortBy: 'featured',
  searchQuery: '',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'home' });
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3800);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Navigation handlers
  const goToHome = () => {
    setCurrentView({ type: 'home' });
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
