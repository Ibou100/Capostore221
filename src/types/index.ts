export type CategoryId = 'tous' | 'vetements' | 'lunettes' | 'chaussures' | 'accessoires';

export type ProductGender = 'homme' | 'unisexe';

export type PaymentMethod = 'wave' | 'orange_money' | 'especes' | 'free_money';

export type OrderStatus = 'transmise' | 'confirmee' | 'en_preparation' | 'en_livraison' | 'livree';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Order {
  id: string; // ex: 'CAPO-7241'
  createdAt: string; // ISO date string
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  total: number;
  shippingFee: number;
  status: OrderStatus;
  notes?: string;
}

export interface ProductCustomOverride {
  name?: string;
  price?: number;
  compareAtPrice?: number | null;
  availableSizes?: string[];
  stock?: number;
  published?: boolean;
}

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
  compareAtPrice?: number | null; // optional original price for discounts/archive
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
  | { type: 'cart-page' }
  | { type: 'orders' }
  | { type: 'tracking'; orderId?: string }
  | { type: 'admin' };
