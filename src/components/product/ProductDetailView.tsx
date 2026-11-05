import React, { useState } from 'react';
import { 
  ArrowLeft, Heart, ShoppingBag, Truck, ShieldCheck, 
  RotateCcw, Check, AlertCircle, Share2, MessageCircle
} from 'lucide-react';
import type { Product, ProductColor } from '../../types';
import { formatFCFA } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import { ProductCard } from '../catalog/ProductCard';

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
  const { openQuickOrder } = useOrders();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(
    product.availableColors && product.availableColors.length > 0 ? product.availableColors[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  // Determine variant stock if size/color chosen
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

    // Validate size selection if sizes exist for product
    if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
      setValidationError('Veuillez sélectionner votre taille.');
      return;
    }

    // Validate color selection if colors exist
    if (product.availableColors && product.availableColors.length > 0 && !selectedColor) {
      setValidationError('Veuillez sélectionner une teinte.');
      return;
    }

    const result = addToCart(product, quantity, selectedSize, selectedColor);
    if (result.success) {
      showToast(result.message || 'Pièce ajoutée au panier avec succès !', 'success');
    } else {
      setValidationError(result.message || 'Impossible d\'ajouter au panier.');
      showToast(result.message || 'Stock indisponible', 'error');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Découvrez ${product.name} sur CAPO221.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Lien du produit copié dans le presse-papier !', 'info');
    }
  };

  // Similar products in same category
  const similarProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.published)
    .slice(0, 4);

  return (
    <div className="bg-capo-offwhite min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={() => goToCatalog({ category: product.category })}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-capo-black transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour à la collection {product.category}</span>
        </button>

        {/* Main Product Section: Gallery + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 border border-zinc-200 rounded-sm">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails (desktop left / mobile bottom) */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 sm:w-20 aspect-[3/4] overflow-hidden rounded-sm border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-capo-black opacity-100 ring-1 ring-capo-black'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} miniature ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image - 100% Uncropped & Showcased */}
            <div className="flex-1 relative aspect-[4/5] overflow-hidden rounded-sm bg-[#FAF8F5] border border-[#E7E2D9] flex items-center justify-center p-4 sm:p-6">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full max-h-[520px] object-contain drop-shadow-sm transition-all duration-300"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isOutOfStock ? (
                  <span className="px-2.5 py-1 bg-zinc-900 text-white text-[10px] font-semibold uppercase tracking-wider rounded-sm shadow-sm">
                    Épuisé
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-white/95 text-zinc-900 border border-zinc-200 text-[10px] font-semibold uppercase tracking-wider rounded-sm shadow-sm">
                    En stock
                  </span>
                )}
              </div>

              {/* Action buttons on image */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-zinc-700 hover:text-black shadow-sm transition-transform hover:scale-105 border border-zinc-200"
                  aria-label="Ajouter aux favoris"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorited ? 'fill-[#B85D19] text-[#B85D19]' : 'text-zinc-600'
                    }`}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-zinc-700 hover:text-black shadow-sm transition-transform hover:scale-105 border border-zinc-200"
                  aria-label="Partager la fiche produit"
                >
                  <Share2 className="w-3.5 h-3.5 text-zinc-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product Actions & Config */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Category & Title */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">
                  <span>{product.subCategory}</span>
                  <span className="capitalize">{product.gender}</span>
                </div>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Pricing in FCFA */}
              <div className="flex flex-wrap items-baseline gap-3 pb-5 border-b border-zinc-100">
                <span className="font-display font-black text-2xl sm:text-3xl text-zinc-900">
                  {formatFCFA(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg text-zinc-400 line-through font-medium">
                      {formatFCFA(product.compareAtPrice)}
                    </span>
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      Économisez {formatFCFA(product.compareAtPrice - product.price)} (-{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%)
                    </span>
                  </div>
                )}
                <span className="text-xs text-zinc-500 ml-auto font-medium">
                  Livraison directe à domicile
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Color Selection (if applicable) */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-2.5">
                    <span className="text-zinc-900">
                      Teinte : <strong className="text-black">{selectedColor?.name || 'Sélectionner'}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.availableColors.map((color) => {
                      const isSelected = selectedColor?.name === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => {
                            setSelectedColor(color);
                            setValidationError(null);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border transition-all ${
                            isSelected
                              ? 'border-capo-black ring-1 ring-capo-black bg-zinc-50 font-medium'
                              : 'border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-zinc-300"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection (ONLY for clothing and shoes, NOT for glasses/accessories!) */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-2.5">
                    <span className="text-zinc-900">
                      {product.category === 'chaussures' ? 'Pointure' : 'Taille'} :{' '}
                      <strong className="text-black">{selectedSize || 'Faites votre choix'}</strong>
                    </span>
                    <span className="text-zinc-500 font-normal underline cursor-pointer text-[11px]">
                      Guide des tailles
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {product.availableSizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setValidationError(null);
                          }}
                          className={`py-2.5 text-xs font-bold uppercase transition-all rounded-none border ${
                            isSelected
                              ? 'bg-capo-black text-white border-capo-black shadow-sm'
                              : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-900'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Status Indicator */}
              <div className="pt-2">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Cette pièce est actuellement en rupture d'inventaire.</span>
                  </div>
                ) : currentStock <= 3 ? (
                  <div className="flex items-center gap-2 text-xs text-amber-800 font-medium bg-amber-50 p-2.5 rounded border border-amber-200">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Stock très limité : seulement {currentStock} exemplaire(s) disponible(s) !</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>En stock — Prêt pour validation et expédition rapide</span>
                  </div>
                )}
              </div>

              {/* Validation Error Banner */}
              {validationError && (
                <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart & WhatsApp */}
              <div className="pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Quantity selector */}
                  {!isOutOfStock && (
                    <div className="inline-flex items-center border border-[#D9CEBE] rounded bg-white">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-3.5 py-3 text-zinc-600 hover:text-black disabled:opacity-30 font-bold"
                        aria-label="Diminuer la quantité"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-xs text-zinc-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                        disabled={quantity >= currentStock}
                        className="px-3.5 py-3 text-zinc-600 hover:text-black disabled:opacity-30 font-bold"
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>
                  )}

                  {/* Primary Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || currentStock <= 0}
                    className={`flex-1 py-3.5 px-6 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-colors ${
                      isOutOfStock || currentStock <= 0
                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        : 'bg-[#141210] hover:bg-[#2C2723] text-white shadow-sm'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {isOutOfStock || currentStock <= 0
                        ? 'Pièce Indisponible'
                        : `Ajouter au Panier • ${formatFCFA(product.price * quantity)}`}
                    </span>
                  </button>
                </div>

                {/* Direct WhatsApp Order Button */}
                <button
                  type="button"
                  onClick={() => openQuickOrder(product, selectedSize)}
                  className="w-full bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 py-3 px-6 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Commander sur WhatsApp (Suivi de colis & Paiement)</span>
                </button>
              </div>

              {/* Delivery Accordions & Guarantees */}
              <div className="pt-6 border-t border-zinc-100 space-y-2.5 text-xs text-zinc-600">
                <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-sm border border-zinc-200/70">
                  <Truck className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 block font-semibold">Livraison Directe à Domicile :</strong>
                    Vous passez commande en ligne, nous validons et organisons la livraison directement chez vous.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-sm border border-zinc-200/70">
                  <ShieldCheck className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 block font-semibold">Paiement Sécurisé :</strong>
                    Règlement par Wave, Orange Money ou paiement en espèces à la livraison.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-sm border border-zinc-200/70">
                  <RotateCcw className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 block font-semibold">Échanges 7 Jours :</strong>
                    Si la taille ne convient pas, nous procédons à l'échange rapidement.
                  </div>
                </div>
              </div>

              {/* Composition & Technical Details */}
              {product.details && product.details.length > 0 && (
                <div className="pt-6 border-t border-zinc-100">
                  <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-zinc-900 mb-3">
                    Fiche Technique & Confection
                  </h3>
                  <ul className="space-y-1.5 text-xs text-zinc-600 list-disc list-inside">
                    {product.materials && (
                      <li><strong className="text-zinc-800">Composition :</strong> {product.materials}</li>
                    )}
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Similar Products Recommendation */}
        {similarProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-1">
                  Dans la même collection
                </p>
                <h3 className="font-display font-extrabold text-2xl text-capo-black tracking-tight">
                  Vous aimerez également
                </h3>
              </div>
              <button
                onClick={() => goToCatalog({ category: product.category })}
                className="text-xs font-semibold uppercase tracking-wider text-capo-black hover:underline"
              >
                Voir tout ({product.category})
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {similarProducts.map((simProd) => (
                <ProductCard key={simProd.id} product={simProd} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const { products, goToCatalog } = useStore();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-display font-bold mb-4">Produit introuvable</h2>
        <button
          onClick={() => goToCatalog()}
          className="px-6 py-3 bg-capo-black text-white text-xs font-semibold uppercase tracking-wider"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  return <ProductDetailContent product={product} />;
};
