import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { formatFCFA } from '../../utils/format';
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
    
    // If product has size or color choices, open quick view so user selects properly
    const hasRequiredSizes = product.availableSizes && product.availableSizes.length > 0;
    const hasRequiredColors = product.availableColors && product.availableColors.length > 1;

    if (hasRequiredSizes || hasRequiredColors) {
      openQuickView(product);
      return;
    }

    // Direct add if single option or accessories/glasses without size choice
    const defaultColor = product.availableColors?.[0];
    const res = addToCart(product, 1, undefined, defaultColor);
    if (res.success) {
      showToast(res.message || 'Article ajouté au panier !', 'success');
    } else {
      showToast(res.message || 'Impossible d\'ajouter l\'article.', 'error');
    }
  };

  return (
    <div
      className="group relative flex flex-col cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 rounded-sm">
        {/* Main image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`h-full w-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && hasMultipleImages ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
        />

        {/* Secondary hover image */}
        {hasMultipleImages && (
          <img
            src={product.images[1]}
            alt={`${product.name} vue secondaire`}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-zinc-900 text-zinc-300">
              Rupture
            </span>
          ) : product.isNew ? (
            <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-capo-black text-white">
              Nouveau
            </span>
          ) : product.compareAtPrice ? (
            <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-zinc-800 text-capo-accent">
              Privilège
            </span>
          ) : null}

          {product.stock > 0 && product.stock <= 3 && (
            <span className="px-2 py-0.5 text-[9px] font-medium tracking-wide bg-amber-100 text-amber-900 border border-amber-300">
              Plus que {product.stock}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
            showToast(
              isFavorited
                ? 'Retiré de vos favoris'
                : 'Ajouté à vos favoris',
              'info'
            );
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-capo-black hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm"
          aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-capo-black text-capo-black' : 'text-zinc-600'
            }`}
          />
        </button>

        {/* Action Overlay bar (slides up on hover) */}
        <div
          className={`absolute inset-x-3 bottom-3 z-10 flex gap-2 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex-1 bg-white/95 backdrop-blur-sm hover:bg-white text-capo-black py-2.5 px-3 rounded-none text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Aperçu</span>
          </button>

          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className="bg-capo-black hover:bg-zinc-800 text-white p-2.5 rounded-none flex items-center justify-center shadow-md transition-colors"
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 uppercase tracking-wider mb-1">
          <span>{product.subCategory}</span>
          <span className="capitalize">{product.gender}</span>
        </div>

        <h3 className="font-display font-medium text-sm text-zinc-900 group-hover:text-black line-clamp-1 transition-colors">
          {product.name}
        </h3>

        {/* Price & Discounts */}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold text-sm text-capo-black">
            {formatFCFA(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-zinc-400 line-through">
              {formatFCFA(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Color swatches preview */}
        {product.availableColors && product.availableColors.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.availableColors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-2.5 h-2.5 rounded-full border border-zinc-300"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.availableColors.length > 4 && (
              <span className="text-[10px] text-zinc-400">
                +{product.availableColors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
