export type CategoryId = 'tous' | 'vetements' | 'lunettes' | 'chaussures' | 'accessoires';

export type ProductGender = 'homme' | 'femme' | 'unisexe';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: ProductColor;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'vetements' | 'lunettes' | 'chaussures' | 'accessoires';
  subCategory: string;
  gender: ProductGender;
  price: number; // in FCFA (XOF)
  compareAtPrice?: number; // optional original price for discounts/archive
  images: string[];
  description: string;
  details: string[];
  materials?: string;
  variants: ProductVariant[];
  availableSizes?: string[]; // Defined only for clothing/shoes (e.g. S, M, L, XL or 41, 42, 43)
  availableColors?: ProductColor[];
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  published: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // Unique key: `${productId}-${selectedSize || 'none'}-${selectedColor?.name || 'none'}`
  product: Product;
  selectedSize?: string;
  selectedColor?: ProductColor;
  quantity: number;
  unitPrice: number;
}

export interface FilterState {
  category: CategoryId;
  gender: 'all' | ProductGender;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popular';
  searchQuery: string;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'catalog'; initialCategory?: CategoryId; initialGender?: ProductGender; query?: string }
  | { type: 'product-detail'; productId: string }
  | { type: 'editorial' }
  | { type: 'wishlist' }
  | { type: 'cart-page' };
