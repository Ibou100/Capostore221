import React, { useState } from 'react';
import { Heart, MessageCircle, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { formatFCFA, getWhatsAppOrderLink } from '../../utils/format';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { goToProduct, openQuickView, showToast } = useStore();
  const { addToCart } = useCart();

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

  const whatsappLink = getWhatsAppOrderLink(
    product.name, 
    product.price, 
    undefined, 
    product.images[0]
  );

  return (
    <article
      className="group relative flex flex-col bg-white border border-[#E7E2D9] hover:border-[#141210] rounded-sm transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* 1. Studio Image Stage - Uncropped 4/5 Aspect Ratio */}
      <div className="relative aspect-[4/5] w-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-2 sm:p-4 border-b border-[#EFECE5]">
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`h-full w-full object-contain transition-all duration-300 ease-out ${
            isHovered && hasMultipleImages ? 'opacity-0 scale-103' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
          decoding="async"
        />

        {/* Secondary Alternative Image */}
        {hasMultipleImages && (
          <img
            src={product.images[1]}
            alt={`${product.name} - vue détail`}
            className={`absolute inset-0 h-full w-full object-contain p-2 sm:p-4 transition-all duration-300 ease-out ${
              isHovered ? 'opacity-100 scale-103' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Minimalist Badges */}
        <div className="absolute top-2 left-2 z-10">
          {isOutOfStock ? (
            <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-zinc-900 text-white rounded-sm">
              Épuisé
            </span>
          ) : (
            <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-white/95 text-zinc-900 border border-zinc-200/90 rounded-sm">
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
          className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-black flex items-center justify-center border border-zinc-200 shadow-sm transition-transform hover:scale-105"
          aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isFavorited ? 'fill-[#B85D19] text-[#B85D19]' : 'text-zinc-600'
            }`}
          />
        </button>
      </div>

      {/* 2. Product Details */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between text-left">
        <div>
          {/* Subcategory */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5 font-medium truncate">
            <span>{product.subCategory}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-display font-medium text-xs sm:text-sm text-zinc-900 group-hover:text-[#B85D19] transition-colors line-clamp-1 mb-1 sm:mb-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
            <span className="font-display font-bold text-xs sm:text-base text-zinc-900">
              {formatFCFA(product.price)}
            </span>
          </div>
        </div>

        {/* 3. Action Row */}
        <div className="pt-2 border-t border-[#F0ECE5] flex items-center gap-1.5 sm:gap-2">
          {/* Quick Add / Select Size Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="flex-1 bg-[#141210] hover:bg-[#2C2723] disabled:bg-zinc-200 disabled:text-zinc-400 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-sm text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">
              {product.availableSizes && product.availableSizes.length > 0 ? 'Choisir taille' : 'Ajouter'}
            </span>
          </button>

          {/* Direct WhatsApp Ordering */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm border border-zinc-200 hover:border-emerald-600 text-zinc-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center shrink-0"
            title="Commander sur WhatsApp avec photo"
            aria-label="Commander sur WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          </a>
        </div>
      </div>
    </article>
  );
};
