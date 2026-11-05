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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 border border-stone-200/90 rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.04)]">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails (desktop left / mobile bottom) */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 sm:w-20 aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all shrink-0 p-0.5 ${
                      selectedImageIndex === idx
                        ? 'border-[#B85D19] ring-2 ring-[#B85D19]/30 opacity-100 scale-102'
                        : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} miniature ${idx + 1}`}
                      className="w-full h-full object-cover object-center rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image - 100% Uncropped & Showcased */}
            <div className="flex-1 relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-[#F2EFE9] border border-stone-200/80 flex items-center justify-center p-6 sm:p-8">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full max-h-[520px] object-contain drop-shadow-md transition-all duration-300"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Épuisé
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-white/95 text-stone-800 border border-stone-200 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                    En stock réel
                  </span>
                )}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="px-2.5 py-0.5 bg-[#f68b1e] text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-xs">
                    -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% Promo
                  </span>
                )}
              </div>

              {/* Action buttons on image */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-stone-700 hover:text-black shadow-sm transition-transform hover:scale-110 border border-stone-200"
                  aria-label="Ajouter aux favoris"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorited ? 'fill-[#B85D19] text-[#B85D19]' : 'text-stone-600'
                    }`}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-stone-700 hover:text-black shadow-sm transition-transform hover:scale-110 border border-stone-200"
                  aria-label="Partager la fiche produit"
                >
                  <Share2 className="w-4 h-4 text-stone-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product Actions & Config */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Category & Title */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#B85D19] uppercase tracking-widest font-bold mb-2">
                  <span>{product.subCategory}</span>
                  <span className="capitalize text-stone-400 font-medium">{product.gender}</span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-4xl text-[#0C0A09] tracking-tight leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Pricing in FCFA - Jumia Marketing Style */}
              <div className="flex flex-col gap-1.5 pb-6 border-b border-stone-100">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-display font-black text-2xl sm:text-4xl text-[#0C0A09] tracking-tight">
                    {formatFCFA(product.price)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-xs font-black text-[#f68b1e] bg-[#fef3e9] px-2.5 py-0.5 rounded border border-[#fbd3ad]">
                      -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                    </span>
                  )}
                  <span className="text-xs text-stone-500 ml-auto font-medium">
                    Livraison directe à domicile
                  </span>
                </div>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base sm:text-lg text-stone-400 line-through decoration-stone-400 font-medium">
                      {formatFCFA(product.compareAtPrice)}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Économisez {formatFCFA(product.compareAtPrice - product.price)}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Color Selection (if applicable) */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2.5">
                    <span className="text-stone-900">
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
                          className={`flex items-center gap-2 px-3.5 py-2 text-xs rounded-full border transition-all ${
                            isSelected
                              ? 'border-[#0C0A09] ring-2 ring-[#0C0A09]/20 bg-stone-50 font-bold'
                              : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-stone-300"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2.5">
                    <span className="text-stone-900">
                      {product.category === 'chaussures' ? 'Pointure' : 'Taille'} :{' '}
                      <strong className="text-black">{selectedSize || 'Faites votre choix'}</strong>
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
                          className={`py-3 text-xs font-bold uppercase transition-all rounded-xl border cursor-pointer ${
                            isSelected
                              ? 'bg-[#0C0A09] text-white border-[#0C0A09] shadow-sm'
                              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-900'
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
                  <div className="flex items-center gap-2 text-xs text-rose-600 font-medium bg-rose-50 p-3 rounded-xl border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Cette pièce est actuellement en rupture d'inventaire.</span>
                  </div>
                ) : currentStock <= 3 ? (
                  <div className="flex items-center gap-2 text-xs text-amber-800 font-medium bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Stock très limité : seulement {currentStock} exemplaire(s) disponible(s) !</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>En stock — Prêt pour validation et expédition immédiate</span>
                  </div>
                )}
              </div>

              {/* Validation Error Banner */}
              {validationError && (
                <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3.5 rounded-xl animate-fade-in font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart & WhatsApp */}
              <div className="pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Quantity selector */}
                  {!isOutOfStock && (
                    <div className="inline-flex items-center border border-stone-300 rounded-xl bg-white shadow-2xs">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-4 py-3.5 text-stone-600 hover:text-black disabled:opacity-30 font-bold"
                        aria-label="Diminuer la quantité"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-xs text-stone-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                        disabled={quantity >= currentStock}
                        className="px-4 py-3.5 text-stone-600 hover:text-black disabled:opacity-30 font-bold"
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
                    className={`flex-1 py-4 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer ${
                      isOutOfStock || currentStock <= 0
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-[#0C0A09] hover:bg-[#201D1A] text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
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
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Commander sur WhatsApp (Suivi de colis & Paiement Wave/OM/Cash)</span>
                </button>
              </div>

              {/* Delivery Accordions & Guarantees */}
              <div className="pt-6 border-t border-stone-100 space-y-3 text-xs text-stone-600">
                <div className="flex items-start gap-3.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
                  <Truck className="w-4 h-4 text-[#B85D19] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block font-bold">Livraison Directe à Domicile :</strong>
                    Vous passez commande en ligne, nous validons et organisons la livraison rapide directement chez vous à Dakar et dans les régions.
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block font-bold">Paiement Sécurisé :</strong>
                    Règlement par Wave, Orange Money ou paiement en espèces à la réception de votre colis.
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
                  <RotateCcw className="w-4 h-4 text-[#B85D19] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block font-bold">Échanges & Essayage 7 Jours :</strong>
                    Si la taille ne convient pas, nous procédons à l'échange sans tracasserie.
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
