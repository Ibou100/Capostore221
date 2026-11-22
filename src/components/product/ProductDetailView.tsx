import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  Share2,
  MessageCircle,
  Minus,
  Plus,
} from 'lucide-react';
import type { Product, ProductColor } from '../../types';
import { formatFCFA } from '../../utils/format';
import { getSelectableSizes } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import { ProductCard } from '../catalog/ProductCard';
import { SmartImage } from '../ui/SmartImage';

interface ProductDetailViewProps {
  productId: string;
}

interface ProductDetailContentProps {
  product: Product;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product }) => {
  const { products, goToCatalog, showToast } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openQuickOrder, soldCounts } = useOrders();
  const soldCount = soldCounts[product.id] || 0;

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
  const availableColors = Array.isArray(product.availableColors) ? product.availableColors : [];
  const availableSizes = getSelectableSizes(product);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    availableSizes.length === 1 ? availableSizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(
    availableColors.length > 0 ? availableColors[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  let currentStock = product.stock;
  if (product.variants && product.variants.length > 0) {
    const variantMatch = product.variants.find((v) => {
      const matchSize = !selectedSize || v.size === selectedSize;
      const matchColor = !selectedColor || v.color?.name === selectedColor.name;
      return matchSize && matchColor;
    });
    if (variantMatch) {
      currentStock = variantMatch.stock;
    }
  }

  const handleAddToCart = () => {
    setValidationError(null);
    const sizeToUse = selectedSize || (availableSizes.length > 0 ? availableSizes[0] : undefined);

    if (availableSizes.length > 1 && !selectedSize) {
      setValidationError(
        product.storeType === 'electronique'
          ? 'Veuillez choisir une capacité ou option.'
          : product.category === 'chaussures'
            ? 'Veuillez sélectionner une pointure.'
            : 'Veuillez sélectionner une taille.'
      );
      return;
    }

    if (availableColors.length > 0 && !selectedColor) {
      setValidationError('Veuillez sélectionner une teinte.');
      return;
    }

    const result = addToCart(product, quantity, sizeToUse, selectedColor);
    if (result.success) {
      showToast(result.message || 'Ajouté au panier', 'success');
    } else {
      setValidationError(result.message || 'Impossible d’ajouter au panier.');
      showToast(result.message || 'Stock indisponible', 'error');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Découvrez ${product.name} sur CAPOSTORE221.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Lien du produit copié', 'info');
    }
  };

  const similarProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.published)
    .slice(0, 4);

  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const optionLabel =
    product.storeType === 'electronique'
      ? 'Capacité / État'
      : product.category === 'chaussures'
        ? 'Pointure'
        : 'Taille';

  return (
    <div className="bg-white min-h-screen pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
        {/* Back link */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('produit')) {
              window.history.back();
            } else {
              goToCatalog({ category: product.category });
            }
          }}
          className="inline-flex items-center gap-2 text-sm text-[#5F5F5A] hover:text-[#0A0A0A] transition-colors mb-6 sm:mb-8 group min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Retour</span>
        </button>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`Voir image ${idx + 1}`}
                    className={`relative w-16 sm:w-20 aspect-[4/5] overflow-hidden rounded-[14px] bg-[#F6F5F2] p-1.5 border transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#0A0A0A]'
                        : 'border-[#E8E6E1] opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} miniature ${idx + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Studio Stage */}
            <div className="flex-1 relative aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-[24px] bg-[#F6F5F2] flex items-center justify-center p-6 sm:p-10">
              {images[selectedImageIndex] || images[0] ? (
                <SmartImage
                  src={images[selectedImageIndex] || images[0]}
                  alt={product.name}
                  priority
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-contain mix-blend-multiply brightness-[1.03] contrast-[1.05] transition-transform duration-300"
                />
              ) : (
                <div className="text-sm text-[#5F5F5A]">Image non disponible</div>
              )}

              {/* Minimal top-left badge */}
              {discountPct > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#FFF0E8] text-[#C2410C] text-xs font-semibold">
                  -{discountPct}%
                </span>
              )}

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#0A0A0A] border border-[#E8E6E1] hover:scale-105 transition-transform"
                  aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorited ? 'fill-[#C2410C] text-[#C2410C]' : 'text-[#0A0A0A]'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#0A0A0A] border border-[#E8E6E1] hover:scale-105 transition-transform"
                  aria-label="Partager le produit"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Category & Title */}
            <div>
              <p className="text-sm text-[#5F5F5A] mb-1.5">
                {product.subCategory || product.category}
              </p>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0A0A0A] tracking-[-0.025em] leading-[1.12]">
                {product.name}
              </h1>
              {soldCount > 0 && (
                <p className="mt-2 text-xs text-[#5F5F5A]">
                  {soldCount} {soldCount > 1 ? 'articles vendus' : 'article vendu'}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3 pb-5 border-b border-[#E8E6E1]">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight">
                {formatFCFA(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-base text-[#5F5F5A] line-through">
                    {formatFCFA(product.compareAtPrice)}
                  </span>
                  <span className="text-xs font-semibold text-[#C2410C] bg-[#FFF0E8] px-2.5 py-0.5 rounded-full">
                    -{discountPct}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm sm:text-base text-[#5F5F5A] leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Color Selector */}
            {availableColors.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-sm font-medium text-[#0A0A0A]">
                  Couleur : <span className="text-[#5F5F5A]">{selectedColor?.name || 'Choisir'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const isSelected = selectedColor?.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => {
                          setSelectedColor(color);
                          setValidationError(null);
                        }}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm rounded-full border transition-colors min-h-[44px] ${
                          isSelected
                            ? 'border-[#0A0A0A] bg-[#F6F5F2] font-medium text-[#0A0A0A]'
                            : 'border-[#E8E6E1] text-[#5F5F5A] hover:border-[#0A0A0A]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-[#E8E6E1]"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size / Storage Selector */}
            {availableSizes.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-sm font-medium text-[#0A0A0A]">
                  {optionLabel} :{' '}
                  <span className="text-[#5F5F5A]">{selectedSize || 'Sélectionner'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setValidationError(null);
                        }}
                        className={`px-4 py-2 text-sm rounded-full border transition-colors min-h-[44px] ${
                          isSelected
                            ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] font-medium'
                            : 'bg-white text-[#0A0A0A] border-[#E8E6E1] hover:border-[#0A0A0A]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock indicator (only when relevant) */}
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-sm text-[#C2410C] bg-[#FFF0E8] px-4 py-2.5 rounded-2xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Rupture de stock</span>
              </div>
            ) : currentStock <= 3 ? (
              <div className="flex items-center gap-2 text-sm text-[#C2410C]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Dernières pièces disponibles ({currentStock})</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-[#5F5F5A]">
                <Check className="w-4 h-4 text-[#0A0A0A]" />
                <span>Disponible pour livraison rapide</span>
              </div>
            )}

            {validationError && (
              <div className="flex items-center gap-2 text-sm text-[#C2410C] bg-[#FFF0E8] px-4 py-2.5 rounded-2xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                {!isOutOfStock && (
                  <div className="inline-flex items-center border border-[#E8E6E1] rounded-full bg-white h-12 px-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-[#0A0A0A] disabled:opacity-30"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-[#0A0A0A]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                      disabled={quantity >= currentStock}
                      className="w-10 h-10 flex items-center justify-center text-[#0A0A0A] disabled:opacity-30"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || currentStock <= 0}
                  className={`flex-1 h-12 px-6 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    isOutOfStock || currentStock <= 0
                      ? 'bg-[#F6F5F2] text-[#5F5F5A] cursor-not-allowed'
                      : 'bg-[#0A0A0A] hover:bg-neutral-800 text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isOutOfStock || currentStock <= 0
                      ? 'Rupture'
                      : `Ajouter au panier · ${formatFCFA(product.price * quantity)}`}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => openQuickOrder(product, selectedSize)}
                className="w-full h-12 px-6 rounded-full border border-[#E8E6E1] hover:border-[#0A0A0A] bg-white text-[#0A0A0A] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#16A34A]" />
                <span>Commander sur WhatsApp</span>
              </button>
            </div>

            {/* 2-line sober delivery / exchange reminder */}
            <div className="pt-4 border-t border-[#E8E6E1] space-y-2 text-xs sm:text-sm text-[#5F5F5A]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#0A0A0A] shrink-0" />
                <span>Livraison directe au Sénégal · Paiement Wave, Orange Money, Yas ou espèces.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#0A0A0A] shrink-0" />
                <span>Échange facile sous 7 jours si l’article ne convient pas.</span>
              </div>
            </div>

            {/* Technical details */}
            {product.details && product.details.length > 0 && (
              <div className="pt-4 border-t border-[#E8E6E1]">
                <h2 className="font-display font-semibold text-sm text-[#0A0A0A] mb-2.5">
                  Détails
                </h2>
                <ul className="space-y-1.5 text-sm text-[#5F5F5A] list-disc list-inside">
                  {product.materials && <li>Matière : {product.materials}</li>}
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#E8E6E1]">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0A0A0A] tracking-[-0.02em]">
                Vous aimerez aussi
              </h2>
              <button
                type="button"
                onClick={() => goToCatalog({ category: product.category })}
                className="text-sm font-medium text-[#5F5F5A] hover:text-[#0A0A0A] transition-colors"
              >
                Voir tout
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {similarProducts.map((simProd) => (
                <ProductCard key={simProd.id} product={simProd} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile Purchase Bar */}
      {!isOutOfStock && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E8E6E1] px-4 py-3 flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-[#5F5F5A] truncate">{product.name}</p>
            <p className="font-display font-bold text-sm text-[#0A0A0A]">
              {formatFCFA(product.price * quantity)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="ml-auto px-5 h-11 rounded-full bg-[#0A0A0A] text-white text-sm font-medium shrink-0"
          >
            Ajouter
          </button>
        </div>
      )}
    </div>
  );
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const { products, goToCatalog } = useStore();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display font-bold text-2xl text-[#0A0A0A] mb-3">
          Produit introuvable
        </h2>
        <p className="text-sm text-[#5F5F5A] mb-6">
          Cet article n’est plus disponible ou vient d’être retiré.
        </p>
        <button
          type="button"
          onClick={() => goToCatalog()}
          className="px-6 py-3 rounded-full bg-[#0A0A0A] text-white text-sm font-medium"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  return <ProductDetailContent product={product} />;
};
