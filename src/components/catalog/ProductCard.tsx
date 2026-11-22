import React, { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import type { Product } from '../../types';
import { formatFCFA } from '../../utils/format';
import { getSelectableSizes } from '../../data/products';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { SmartImage } from '../ui/SmartImage';

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
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const hasMultipleImages = product.images.length > 1;
  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const handleCardClick = () => {
    goToProduct(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    const hasRequiredSizes = getSelectableSizes(product).length > 0;
    const hasRequiredColors = product.availableColors && product.availableColors.length > 1;

    if (hasRequiredSizes || hasRequiredColors) {
      openQuickView(product);
      return;
    }

    const defaultColor = product.availableColors?.[0];
    const res = addToCart(product, 1, undefined, defaultColor);
    if (res.success) {
      showToast(res.message || 'Article ajouté au panier.', 'success');
    } else {
      showToast(res.message || "Impossible d'ajouter l'article.", 'error');
    }
  };

  const handleQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickOrder(product);
  };

  return (
    <article
      className="group flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image Stage: 4:5, rounded-[20px], #F6F5F2, no border */}
      <div className="relative aspect-[4/5] w-full rounded-[20px] bg-[#F6F5F2] p-3 sm:p-4 overflow-hidden">
        <SmartImage
          src={product.images[0]}
          alt={product.name}
          wrapperClassName="w-full h-full"
          className={`w-full h-full object-contain mix-blend-multiply brightness-[1.03] contrast-[1.05] transition-transform duration-300 ease-out ${
            isHovered ? 'scale-[1.03]' : 'scale-100'
          }`}
        />

        {/* Secondary image mounted only on hover to keep initial load fast */}
        {isHovered && hasMultipleImages && (
          <img
            src={product.images[1]}
            alt={`${product.name} - vue détail`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain p-3 sm:p-4 bg-[#F6F5F2] transition-opacity duration-200 scale-[1.03]"
          />
        )}

        {/* Minimalist Badges Top-Left */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {discountPct > 0 && (
            <span className="px-2.5 py-1 text-[12px] font-semibold bg-[#FFF7ED] text-[#C2410C] rounded-full">
              -{discountPct}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 text-[12px] font-medium bg-[#0A0A0A] text-white rounded-full">
              Rupture
            </span>
          )}
          {isLowStock && (
            <span className="px-2.5 py-1 text-[12px] font-medium bg-white/95 text-[#0A0A0A] rounded-full">
              Dernières pièces
            </span>
          )}
        </div>

        {/* Wishlist Heart Button Top-Right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
            showToast(
              isFavorited ? 'Retiré de vos favoris' : 'Ajouté à vos favoris',
              'info'
            );
          }}
          className="absolute top-2.5 right-2.5 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#0A0A0A] flex items-center justify-center shadow-subtle transition-transform duration-150 hover:scale-105"
          aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            className={`w-[18px] h-[18px] transition-colors ${
              isFavorited ? 'fill-[#C2410C] text-[#C2410C]' : 'text-[#0A0A0A]'
            }`}
            strokeWidth={1.75}
          />
        </button>

        {/* Action Pills: visible on mobile below or overlay on desktop hover */}
        <div
          className="hidden lg:flex items-center gap-2 absolute bottom-3 left-3 right-3 z-10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
        >
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="flex-1 h-11 rounded-full bg-[#0A0A0A] hover:bg-zinc-800 disabled:bg-zinc-300 text-white text-[14px] font-medium transition-colors shadow-subtle"
          >
            {isOutOfStock ? 'Indisponible' : 'Ajouter'}
          </button>
          <button
            type="button"
            onClick={handleQuickOrder}
            className="w-11 h-11 rounded-full bg-white hover:bg-[#F6F5F2] text-[#0A0A0A] flex items-center justify-center shadow-subtle transition-colors shrink-0"
            aria-label="Commander sur WhatsApp"
            title="Commander sur WhatsApp"
          >
            <MessageCircle className="w-[18px] h-[18px] text-emerald-700" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-3.5 text-left space-y-1 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[13px] text-[#5F5F5A] truncate">
            {product.subCategory}
          </p>
          <h3 className="text-[15px] sm:text-[16px] font-medium text-[#0A0A0A] group-hover:text-[#C2410C] transition-colors line-clamp-2 leading-snug mt-0.5">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
            <span className="text-[15px] sm:text-[16px] font-semibold text-[#0A0A0A]">
              {formatFCFA(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-[13px] text-[#5F5F5A] line-through">
                {formatFCFA(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Action Row (always visible on mobile & tablet) */}
        <div className="flex lg:hidden items-center gap-2 pt-3">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="flex-1 h-11 rounded-full bg-[#0A0A0A] disabled:bg-zinc-300 text-white text-[13px] font-medium transition-colors"
          >
            {isOutOfStock ? 'Rupture' : 'Ajouter'}
          </button>
          <button
            type="button"
            onClick={handleQuickOrder}
            className="w-11 h-11 rounded-full bg-[#F6F5F2] text-[#0A0A0A] flex items-center justify-center shrink-0"
            aria-label="Commander sur WhatsApp"
          >
            <MessageCircle className="w-[18px] h-[18px] text-emerald-700" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </article>
  );
};
