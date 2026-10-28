import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, ProductColor } from '../types';
import { generateCartItemId } from '../utils/format';

interface AddToCartResult {
  success: boolean;
  message?: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: ProductColor
  ) => AddToCartResult;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  shippingFee: number;
  total: number;
}

const CART_STORAGE_KEY = 'capo221_cart_items_v1';
const FREE_SHIPPING_THRESHOLD = 25000; // Free shipping over 25 000 FCFA
const STANDARD_SHIPPING = 2500; // 2 500 FCFA standard delivery fee

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedSize?: string,
    selectedColor?: ProductColor
  ): AddToCartResult => {
    // 1. Check general product stock
    if (product.stock <= 0) {
      return { success: false, message: 'Ce produit est actuellement en rupture de stock.' };
    }

    // 2. Validate mandatory size if product has available sizes
    if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
      return { success: false, message: 'Veuillez sélectionner une taille avant d\'ajouter au panier.' };
    }

    // 3. Validate mandatory color if product has available colors
    if (product.availableColors && product.availableColors.length > 0 && !selectedColor) {
      return { success: false, message: 'Veuillez sélectionner une couleur avant d\'ajouter au panier.' };
    }

    // 4. Identify matching variant and check variant stock if defined
    let maxAvailable = product.stock;
    if (product.variants && product.variants.length > 0) {
      const matchingVariant = product.variants.find((v) => {
        const sizeMatch = !selectedSize || v.size === selectedSize;
        const colorMatch = !selectedColor || v.color?.name === selectedColor.name;
        return sizeMatch && colorMatch;
      });

      if (matchingVariant) {
        maxAvailable = matchingVariant.stock;
        if (matchingVariant.stock <= 0) {
          return { success: false, message: 'Cette déclinaison est épuisée.' };
        }
      }
    }

    const itemId = generateCartItemId(product.id, selectedSize, selectedColor?.name);

    let updatedSuccess = true;
    let feedbackMsg = `${product.name} ajouté au panier.`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > maxAvailable) {
          updatedSuccess = false;
          feedbackMsg = `Stock maximum atteint (${maxAvailable} disponibles).`;
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        if (quantity > maxAvailable) {
          updatedSuccess = false;
          feedbackMsg = `Quantité demandée indisponible (${maxAvailable} en stock).`;
          return prevItems;
        }

        const newItem: CartItem = {
          id: itemId,
          product,
          selectedSize,
          selectedColor,
          quantity,
          unitPrice: product.price,
        };
        return [...prevItems, newItem];
      }
    });

    if (updatedSuccess) {
      setIsOpen(true); // Open drawer on addition for seamless feedback
    }

    return { success: updatedSuccess, message: feedbackMsg };
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          // Check stock limit
          let maxStock = item.product.stock;
          if (item.product.variants && item.product.variants.length > 0) {
            const v = item.product.variants.find(
              (varItem) =>
                (!item.selectedSize || varItem.size === item.selectedSize) &&
                (!item.selectedColor || varItem.color?.name === item.selectedColor.name)
            );
            if (v) maxStock = v.stock;
          }

          const boundedQty = Math.min(newQty, maxStock);
          return { ...item, quantity: boundedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        shippingFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
