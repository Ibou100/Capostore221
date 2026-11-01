import React, { useState } from 'react';
import { X, ShoppingBag, Heart, MessageCircle, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatFCFA, getWhatsAppOrderLink } from '../../utils/format';
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

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes[0] : undefined
  );
  const [selectedColor, _setSelectedColor] = useState<ProductColor | undefined>(
    product.availableColors && product.availableColors.length > 0 ? product.availableColors[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdd = () => {
    setErrorMsg(null);

    if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
      setErrorMsg('Veuillez sélectionner une taille.');
      return;
    }

    const res = addToCart(product, quantity, selectedSize, selectedColor);
    if (res.success) {
      showToast(res.message || 'Article ajouté au panier.', 'success');
      onClose();
    } else {
      setErrorMsg(res.message || 'Erreur lors de l\'ajout.');
    }
  };

  const whatsappLink = getWhatsAppOrderLink(product.name, product.price, selectedSize, product.images[0]);

  return (
    <div className="relative w-full max-w-3xl bg-white shadow-2xl rounded-sm overflow-hidden z-10 animate-fade-in border border-[#E7E2D9] max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-black flex items-center justify-center border border-zinc-200 transition-colors shadow-sm"
        aria-label="Fermer l'aperçu"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Studio Image */}
        <div className="relative bg-[#FAF8F5] p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E7E2D9] min-h-[300px] sm:min-h-[400px]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full max-h-[380px] object-contain drop-shadow-sm"
          />

          {/* Wishlist Button on Image */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 flex items-center justify-center border border-zinc-200 shadow-sm"
            aria-label="Favoris"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavorited ? 'fill-[#B85D19] text-[#B85D19]' : 'text-zinc-600'
              }`}
            />
          </button>
        </div>

        {/* Right: Details & Order */}
        <div className="p-6 sm:p-8 flex flex-col justify-between text-left">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#B85D19]">
                {product.category} • {product.subCategory}
              </p>
              <h3 className="font-display font-bold text-lg sm:text-xl text-zinc-900 tracking-tight mt-1">
                {product.name}
              </h3>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-3 border-b border-[#EFECE5]">
              <span className="font-display font-bold text-2xl text-zinc-900">
                {formatFCFA(product.price)}
              </span>
              <span className="ml-auto text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                En stock
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Materials note */}
            {product.materials && (
              <p className="text-xs text-zinc-500">
                <strong className="text-zinc-800 font-medium">Matière :</strong> {product.materials}
              </p>
            )}

            {/* Size Selector if Clothing */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                  Taille :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-9 min-w-9 px-3 text-xs font-semibold uppercase rounded-sm border transition-colors ${
                        selectedSize === size
                          ? 'bg-[#141210] text-white border-[#141210]'
                          : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-700">
                Quantité :
              </span>
              <div className="flex items-center border border-zinc-200 rounded-sm bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-0.5 text-xs font-semibold text-zinc-600 hover:text-black"
                >
                  -
                </button>
                <span className="px-2.5 py-0.5 text-xs font-semibold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-2.5 py-0.5 text-xs font-semibold text-zinc-600 hover:text-black"
                >
                  +
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded-sm border border-rose-200">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Actions & Reassurance */}
          <div className="pt-6 space-y-2.5">
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className="w-full bg-[#141210] hover:bg-[#2C2723] disabled:bg-zinc-200 text-white py-3 px-4 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ajouter au panier</span>
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 py-2.5 px-4 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Commander sur WhatsApp</span>
            </a>

            <div className="p-2.5 bg-[#FAF8F5] rounded-sm border border-[#E7E2D9] flex items-center gap-2 text-[11px] text-zinc-500">
              <Truck className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <span>Tu commandes, on te livre • Paiement Wave, OM ou espèces</span>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => {
                  onClose();
                  goToProduct(product.id);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-900 underline transition-colors"
              >
                Voir la fiche complète
              </button>
            </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div 
        className="fixed inset-0"
        onClick={closeQuickView}
      />
      <QuickViewContent product={quickViewProduct} onClose={closeQuickView} />
    </div>
  );
};
