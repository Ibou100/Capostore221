import React, { useState } from 'react';
import { X, ShoppingBag, Heart, ArrowRight, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatFCFA } from '../../utils/format';
import type { Product, ProductColor } from '../../types';

interface QuickViewContentProps {
  product: Product;
  onClose: () => void;
}

const QuickViewContent: React.FC<QuickViewContentProps> = ({ product, onClose }) => {
  const { goToProduct, showToast } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(
    product.availableColors && product.availableColors.length > 0 ? product.availableColors[0] : undefined
  );
  const quantity = 1;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdd = () => {
    setErrorMsg(null);

    if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
      setErrorMsg('Veuillez sélectionner une taille.');
      return;
    }

    if (product.availableColors && product.availableColors.length > 0 && !selectedColor) {
      setErrorMsg('Veuillez sélectionner une couleur.');
      return;
    }

    const res = addToCart(product, quantity, selectedSize, selectedColor);
    if (res.success) {
      showToast(res.message || 'Article ajouté au panier !', 'success');
      onClose();
    } else {
      setErrorMsg(res.message || 'Erreur lors de l\'ajout.');
    }
  };

  return (
    <div className="relative w-full max-w-3xl bg-white shadow-2xl rounded-sm overflow-hidden z-10 animate-fade-in border border-zinc-200">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-zinc-600 hover:text-black shadow-sm"
        aria-label="Fermer l'aperçu"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-zinc-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/80 hover:bg-white text-black shadow-sm"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? 'fill-black text-black' : 'text-zinc-600'
              }`}
            />
          </button>
        </div>

        {/* Details & Action */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                {product.category} • {product.subCategory}
              </p>
              <h3 className="font-display font-extrabold text-xl text-capo-black tracking-tight mt-1">
                {product.name}
              </h3>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-xl text-capo-black">
                {formatFCFA(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatFCFA(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Couleur : <span className="text-black">{selectedColor?.name}</span>
                </label>
                <div className="flex gap-2">
                  {product.availableColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        selectedColor?.name === c.name
                          ? 'ring-2 ring-capo-black ring-offset-2'
                          : 'border-zinc-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Taille : <span className="text-black">{selectedSize || 'Choisir'}</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {product.availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSize(s);
                        setErrorMsg(null);
                      }}
                      className={`min-w-8 h-8 px-2 text-xs font-semibold uppercase border ${
                        selectedSize === s
                          ? 'bg-capo-black text-white border-capo-black'
                          : 'bg-white text-zinc-800 border-zinc-200 hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-zinc-100 space-y-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : 'bg-capo-black text-white hover:bg-zinc-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Épuisé' : 'Ajouter au panier'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                goToProduct(product.id);
              }}
              className="w-full text-center py-2 text-[11px] uppercase tracking-wider font-semibold text-zinc-500 hover:text-black flex items-center justify-center gap-1"
            >
              <span>Voir la fiche produit complète</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView } = useStore();

  if (!quickViewProduct) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex justify-center items-center">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeQuickView}
      />
      <QuickViewContent product={quickViewProduct} onClose={closeQuickView} />
    </div>
  );
};
