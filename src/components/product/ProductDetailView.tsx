import React, { useState } from 'react';
import { 
  ArrowLeft, Heart, ShoppingBag, Truck, ShieldCheck, 
  RotateCcw, Check, AlertCircle, Share2 
} from 'lucide-react';
import type { Product, ProductColor } from '../../types';
import { formatFCFA } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
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

            {/* Main Stage Image */}
            <div className="flex-1 relative aspect-[3/4] overflow-hidden rounded-sm bg-zinc-100">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider">
                    Épuisé
                  </span>
                ) : product.isNew ? (
                  <span className="px-3 py-1 bg-capo-black text-white text-[11px] font-bold uppercase tracking-wider">
                    Nouvelle Pièce
                  </span>
                ) : null}
              </div>

              {/* Action buttons on image */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-capo-black shadow-md hover:scale-110 transition-transform"
                  aria-label="Ajouter aux favoris"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorited ? 'fill-capo-black text-capo-black' : 'text-zinc-600'
                    }`}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-capo-black shadow-md hover:scale-110 transition-transform"
                  aria-label="Partager la fiche produit"
                >
                  <Share2 className="w-4 h-4 text-zinc-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product Actions & Config */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Category & Title */}
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">
                  <span>{product.subCategory}</span>
                  <span className="capitalize">{product.gender}</span>
                </div>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-capo-black tracking-tightest leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Pricing in FCFA */}
              <div className="flex items-baseline gap-3 pb-5 border-b border-zinc-100">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-capo-black">
                  {formatFCFA(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base text-zinc-400 line-through">
                    {formatFCFA(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium ml-auto">
                  TTC • Facturation FCFA
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
                    <span>En stock à notre atelier de Dakar — Prêt pour expédition express</span>
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

              {/* Quantity Stepper & Add to Cart */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                {/* Quantity selector */}
                {!isOutOfStock && (
                  <div className="inline-flex items-center border border-zinc-300 rounded-none bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-3.5 py-3 text-zinc-600 hover:text-black disabled:opacity-30"
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
                      className="px-3.5 py-3 text-zinc-600 hover:text-black disabled:opacity-30"
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
                  className={`flex-1 py-4 px-6 text-xs font-display font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${
                    isOutOfStock || currentStock <= 0
                      ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      : 'bg-capo-black hover:bg-zinc-800 text-white shadow-xl hover:shadow-2xl'
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

              {/* Delivery Accordions & Guarantees */}
              <div className="pt-6 border-t border-zinc-100 space-y-3 text-xs text-zinc-600">
                <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded">
                  <Truck className="w-4 h-4 text-capo-black shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 block">Livraison Express Dakar 24h :</strong>
                    Courseur dédié pour Dakar (2 500 FCFA ou offerte dès 75 000 FCFA). Expédition sous 48h dans les régions (Thiès, Saint-Louis, Mbour, Ziguinchor).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded">
                  <ShieldCheck className="w-4 h-4 text-capo-black shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 block">Paiement Flexible :</strong>
                    Règlement sécurisé par Wave, Orange Money ou paiement comptant à la livraison à Dakar.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded">
                  <RotateCcw className="w-4 h-4 text-capo-black shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 block">Échanges Gratuits 7 Jours :</strong>
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
