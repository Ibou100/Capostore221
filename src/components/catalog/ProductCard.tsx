import React, { useState } from 'react';
import { Heart, Eye, MessageCircle, ShoppingBag } from 'lucide-react';
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
    
    // If product has size or color choices, open quick view
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

  const whatsappLink = getWhatsAppOrderLink(product.name, product.price);

  return (
    <div
      className="group relative flex flex-col bg-white rounded-lg border border-[#EAE5DC] hover:border-[#B85226] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* 1. Generous Studio Image Frame (Respects 100% of the photo details) */}
      <div className="relative aspect-[4/5] w-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-3 sm:p-4 border-b border-[#F0ECE4]">
        {/* Main image - object-contain ensures zero crop on collars, buttons or zoom insets */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`h-full w-full object-contain transition-all duration-500 ease-out drop-shadow-sm ${
            isHovered && hasMultipleImages ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
        />

        {/* Secondary hover image if available */}
        {hasMultipleImages && (
          <img
            src={product.images[1]}
            alt={`${product.name} vue alternative`}
            className={`absolute inset-0 h-full w-full object-contain p-3 sm:p-4 transition-all duration-500 ease-out drop-shadow-sm ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#141210] text-[#E8DFD5] rounded-full shadow-sm">
              Épuisé
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#141210] text-white rounded-full shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block animate-pulse" />
              <span>En stock Dakar</span>
            </span>
          )}

          {product.compareAtPrice && !isOutOfStock && (
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#B85226] text-white rounded-full">
              Prix Club
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
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#141210] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-[#B85226] text-[#B85226]' : 'text-[#666057]'
            }`}
          />
        </button>

        {/* Quick View Button on Hover */}
        <div
          className={`absolute bottom-3 inset-x-3 z-10 transition-all duration-300 hidden sm:block ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="w-full bg-[#141210]/95 hover:bg-[#141210] text-white py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded shadow-lg backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu & Tailles</span>
          </button>
        </div>
      </div>

      {/* 2. Product Details & Purchase Actions */}
      <div className="p-4 flex flex-col flex-1 justify-between text-left">
        <div>
          {/* Subcategory & Gender */}
          <div className="flex items-center justify-between text-[11px] text-[#8C8273] uppercase tracking-wider mb-1 font-semibold">
            <span>{product.subCategory}</span>
            <span>{product.materials ? product.materials.split(',')[0] : 'Qualité Supérieure'}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-display font-bold text-sm sm:text-base text-[#141210] group-hover:text-[#B85226] transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-display font-black text-base sm:text-lg text-[#141210]">
              {formatFCFA(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#9E9587] line-through font-normal">
                {formatFCFA(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* 3. Direct Actions: WhatsApp Order (King in Senegal) + Cart Button */}
        <div className="pt-2 border-t border-[#F2EDE4] flex items-center gap-2">
          {/* Direct WhatsApp Ordering */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2.5 px-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            title="Commander directement cet article sur WhatsApp"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">WhatsApp</span>
          </a>

          {/* Quick Cart Action */}
          <button
            onClick={handleQuickAdd}
            className="bg-[#141210] hover:bg-[#2E2824] text-white p-2.5 rounded transition-colors shadow-sm shrink-0 flex items-center justify-center"
            title="Ajouter au panier du site"
            aria-label="Ajouter au panier"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
