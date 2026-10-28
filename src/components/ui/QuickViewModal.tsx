import React, { useState } from 'react';
import { X, ShoppingBag, Heart, MessageCircle, Truck, Sparkles } from 'lucide-react';
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
      showToast(res.message || 'Article ajouté au panier !', 'success');
      onClose();
    } else {
      setErrorMsg(res.message || 'Erreur lors de l\'ajout.');
    }
  };

  const whatsappLink = getWhatsAppOrderLink(product.name, product.price, selectedSize);

  return (
    <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden z-10 animate-fade-in border border-[#EAE5DC] max-h-[90vh] overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#141210] flex items-center justify-center shadow-md border border-[#E0D9CE] transition-all"
        aria-label="Fermer l'aperçu"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Full Uncropped Image Stage */}
        <div className="relative bg-[#FAF8F5] p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#EAE5DC] min-h-[320px] sm:min-h-[440px]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full max-h-[420px] object-contain drop-shadow-md"
          />

          {/* Wishlist Button on Image */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#141210] flex items-center justify-center shadow-md border border-[#E0D9CE]"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? 'fill-[#B85226] text-[#B85226]' : 'text-[#666057]'
              }`}
            />
          </button>

          {/* Quality Tag */}
          <div className="absolute bottom-4 left-4 bg-[#141210]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-sm flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#D49A3D]" />
            <span>Photo 100% Réelle</span>
          </div>
        </div>

        {/* Right: Clean African Luxury Details & 2-Way Checkout */}
        <div className="p-6 sm:p-8 flex flex-col justify-between text-left">
          <div className="space-y-4">
            {/* Header / Subcategory */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#B85226]">
                {product.category} • {product.subCategory}
              </p>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#141210] tracking-tight mt-1">
                {product.name}
              </h3>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-3 border-b border-[#F0ECE4]">
              <span className="font-display font-black text-2xl sm:text-3xl text-[#141210]">
                {formatFCFA(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-[#9E9587] line-through">
                  {formatFCFA(product.compareAtPrice)}
                </span>
              )}
              <span className="ml-auto text-xs font-semibold text-[#1F7A3F] bg-[#E8F5E9] px-2 py-0.5 rounded">
                En stock à Dakar
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#5C554B] leading-relaxed">
              {product.description}
            </p>

            {/* Materials note */}
            {product.materials && (
              <div className="text-xs text-[#7A7163] bg-[#FAF8F5] p-2.5 rounded border border-[#EBE7DF]">
                <strong className="text-[#141210]">Matière :</strong> {product.materials}
              </div>
            )}

            {/* Size Selector if Clothing */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#141210]">
                    Sélectionner la Taille :
                  </span>
                  <span className="text-[11px] text-[#B85226] font-semibold">Taille standard sénégalaise</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 min-w-10 px-3.5 text-xs font-bold uppercase rounded border transition-all ${
                        selectedSize === size
                          ? 'bg-[#141210] text-white border-[#141210] shadow-sm ring-2 ring-[#B85226]/30'
                          : 'bg-white text-[#141210] border-[#D9CEBE] hover:border-[#141210]'
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#141210]">
                Quantité :
              </span>
              <div className="flex items-center border border-[#D9CEBE] rounded bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-[#141210] hover:bg-[#F5EFE6]"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-[#141210]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1 text-sm font-bold text-[#141210] hover:bg-[#F5EFE6]"
                >
                  +
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded border border-rose-200">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Actions & Teranga Reassurance */}
          <div className="pt-6 space-y-3">
            {/* Primary Action 1: WhatsApp (Preferred in Dakar) */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3.5 px-4 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Commander directement via WhatsApp</span>
            </a>

            {/* Primary Action 2: Add to Cart */}
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className="w-full bg-[#141210] hover:bg-[#2C2723] disabled:bg-zinc-300 text-white py-3.5 px-4 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ajouter au panier du site</span>
            </button>

            {/* Dakar Local Delivery Promise */}
            <div className="p-3 bg-[#FAF8F5] rounded border border-[#EDE7DF] flex items-center gap-2.5 text-xs text-[#524B43]">
              <Truck className="w-4 h-4 text-[#B85226] shrink-0" />
              <span>Livraison 24h à Dakar • Paiement Wave, OM ou Espèces au livreur</span>
            </div>

            {/* Link to Full Product Page */}
            <div className="text-center pt-1">
              <button
                onClick={() => {
                  onClose();
                  goToProduct(product.id);
                }}
                className="text-xs font-bold text-[#141210] hover:text-[#B85226] underline transition-colors"
              >
                Voir la fiche complète avec tous les détails
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
