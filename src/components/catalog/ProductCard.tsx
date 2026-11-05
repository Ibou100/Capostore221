import React, { useState } from 'react';
import { Heart, MessageCircle, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { formatFCFA } from '../../utils/format';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { goToProduct, openQuickView, showToast } = useStore();
  const { addToCart } = useCart();
  const { openQuickOrder } = useOrders();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const hasMultipleImages = product.images.length > 1;

  const handleCardClick = () => {
    goToProduct(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If product has size choices, open quick view
    const hasRequiredSizes = product.availableSizes && product.availableSizes.length > 0;
    const hasRequiredColors = product.availableColors && product.availableColors.length > 1;

    if (hasRequiredSizes || hasRequiredColors) {
      openQuickView(product);
      return;
    }

    const defaultColor = product.availableColors?.[0];
    const res = addToCart(product, 1, undefined, defaultColor);
    if (res.success) {
      showToast(res.message || 'Article ajouté au panier !', 'success');
    } else {
      showToast(res.message || 'Impossible d\'ajouter l\'article.', 'error');
    }
  };

  const handleQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickOrder(product);
  };

  return (
    <article
      className="group relative flex flex-col bg-white border border-stone-200/80 hover:border-stone-900/40 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* 1. Studio Image Stage - Uncropped 4/5 Aspect Ratio */}
      <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#FAF8F5] to-[#F1EFE9] overflow-hidden flex items-center justify-center p-3 sm:p-5 border-b border-stone-200/70">
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`h-full w-full object-contain drop-shadow-sm transition-all duration-500 ease-out ${
            isHovered && hasMultipleImages ? 'opacity-0 scale-106' : 'opacity-100 group-hover:scale-105'
          }`}
          loading="lazy"
          decoding="async"
        />

        {/* Secondary Alternative Image */}
        {hasMultipleImages && (
          <img
            src={product.images[1]}
            alt={`${product.name} - vue détail`}
            className={`absolute inset-0 h-full w-full object-contain p-3 sm:p-5 drop-shadow-sm transition-all duration-500 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Quick View Hover Cue */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-3 inset-x-3 hidden sm:flex items-center justify-center pointer-events-none z-10">
          <span className="px-3 py-1.5 rounded-full bg-[#0C0A09]/90 text-white backdrop-blur-md text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
            <span>Aperçu Rapide</span>
          </span>
        </div>

        {/* Minimalist Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#f68b1e] text-white rounded-md shadow-xs">
              -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}
          {isOutOfStock ? (
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-zinc-900 text-white rounded-md">
              Épuisé
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/95 text-stone-800 border border-stone-200/90 rounded-md shadow-2xs">
              En stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
            showToast(
              isFavorited ? 'Retiré de vos favoris' : 'Ajouté à vos favoris',
              'info'
            );
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-black flex items-center justify-center border border-stone-200/80 shadow-xs transition-all hover:scale-110"
          aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-[#B85D19] text-[#B85D19]' : 'text-stone-600'
            }`}
          />
        </button>
      </div>

      {/* 2. Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between text-left">
        <div>
          {/* Subcategory */}
          <div className="flex items-center justify-between text-[10px] text-[#B85D19] uppercase tracking-widest mb-1 font-bold truncate">
            <span>{product.subCategory}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-display font-extrabold text-xs sm:text-sm text-stone-900 group-hover:text-[#B85D19] transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>

          {/* Price - Jumia Marketing Style */}
          <div className="flex flex-col gap-0.5 mb-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-sm sm:text-base text-[#0C0A09] tracking-tight">
                {formatFCFA(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-[10px] font-black text-[#f68b1e] bg-[#fef3e9] px-1.5 py-0.2 rounded border border-[#fbd3ad]">
                  -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </span>
              )}
            </div>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-stone-400 line-through decoration-stone-400 font-medium">
                {formatFCFA(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* 3. Action Row */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center gap-2">
          {/* Quick Add / Select Size Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="flex-1 bg-[#0C0A09] hover:bg-[#201D1A] disabled:bg-stone-200 disabled:text-stone-400 text-white py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">
              {product.availableSizes && product.availableSizes.length > 0 ? 'Choisir taille' : 'Ajouter'}
            </span>
          </button>

          {/* Direct WhatsApp Ordering */}
          <button
            type="button"
            onClick={handleQuickOrder}
            className="w-9 h-9 rounded-xl border border-stone-200 hover:border-emerald-600 text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex items-center justify-center shrink-0 shadow-2xs cursor-pointer"
            title="Commander sur WhatsApp (Suivi de colis & Paiement Wave/OM/Cash)"
            aria-label="Commander sur WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>
    </article>
  );
};
