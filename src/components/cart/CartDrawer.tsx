import React, { useState } from 'react';
import { 
  X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, 
  Truck, ChevronRight, PackageCheck, MessageCircle 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatFCFA, DAKAR_WHATSAPP_PHONE } from '../../utils/format';

export const CartDrawer: React.FC = () => {
  const { 
    items, isOpen, closeCart, removeFromCart, updateQuantity, 
    clearCart, totalCount, subtotal, shippingFee, total, freeShippingThreshold 
  } = useCart();
  const { goToCatalog, showToast } = useStore();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Dakar');
  const [orderCompleted, setOrderCompleted] = useState(false);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountRemainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      showToast('Veuillez compléter toutes les coordonnées de livraison.', 'error');
      return;
    }
    setOrderCompleted(true);
    showToast('Commande enregistrée ! Notre équipe vous contactera.', 'success');
  };

  const handleFinish = () => {
    clearCart();
    setOrderCompleted(false);
    setIsCheckoutModalOpen(false);
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-drawer">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-capo-black" />
                <h2 className="font-display font-extrabold text-base tracking-tight uppercase">
                  Votre Panier ({totalCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1 rounded-full text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress bar */}
            {items.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-100">
                <div className="flex justify-between text-xs text-zinc-600 mb-1.5">
                  {amountRemainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Livraison express offerte à Dakar !
                    </span>
                  ) : (
                    <span>
                      Plus que <strong className="text-capo-black">{formatFCFA(amountRemainingForFreeShipping)}</strong> pour la livraison offerte
                    </span>
                  )}
                  <span className="font-medium text-zinc-900">{progressPercent}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-capo-black h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-zinc-100 last:border-b-0">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-contain p-1.5 bg-[#FAF8F5] border border-[#EAE5DC] rounded shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-display font-medium text-xs sm:text-sm text-zinc-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                          title="Supprimer l'article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant tags */}
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-zinc-500">
                        {item.selectedSize && (
                          <span className="bg-zinc-100 px-2 py-0.5 rounded">
                            Taille: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="bg-zinc-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <span
                              className="w-2 h-2 rounded-full border border-zinc-300"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and quantity stepper */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-zinc-200 rounded-none bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-zinc-600 hover:text-black"
                          aria-label="Diminuer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-zinc-600 hover:text-black"
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-semibold text-xs sm:text-sm text-capo-black">
                        {formatFCFA(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty state */
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-base text-zinc-900 mb-1">
                  Votre panier est vide
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-6">
                  Explorez notre vestiaire et sélectionnez les pièces qui affirment votre style.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    goToCatalog({ category: 'tous' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-capo-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                >
                  <span>Découvrir les collections</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-4">
              <div className="space-y-2 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-medium text-zinc-900">{formatFCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison Dakar estimée</span>
                  <span className="font-medium text-zinc-900">
                    {shippingFee === 0 ? 'Offerte (Gratuit)' : formatFCFA(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-capo-black pt-2 border-t border-zinc-200">
                  <span>Total TTC</span>
                  <span className="font-display text-base text-capo-black">{formatFCFA(total)}</span>
                </div>
              </div>

              {/* Order checkout CTAs */}
              <div className="space-y-2.5">
                <a
                  href={`https://wa.me/${DAKAR_WHATSAPP_PHONE}?text=${encodeURIComponent(
                    `Bonjour CAPOSTORE221 ! 🇸🇳\nJe souhaite valider ma commande avec les articles suivants :\n\n` +
                    items.map(i => `• ${i.quantity}x ${i.product.name}${i.selectedSize ? ` (Taille ${i.selectedSize})` : ''} - ${formatFCFA(i.unitPrice * i.quantity)}`).join('\n') +
                    `\n\nTotal : ${formatFCFA(total)}\n\nMerci de me contacter pour la livraison à Dakar !`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander ce panier sur WhatsApp</span>
                </a>

                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full bg-[#141210] hover:bg-[#2C2723] text-white py-3.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded shadow-sm transition-colors"
                >
                  <span>Formulaire de livraison en ligne</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A7163] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B85226]" />
                <span>Paiement à la livraison ou Wave / Orange Money</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Checkout Preview & Confirmation Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !orderCompleted && setIsCheckoutModalOpen(false)}
          />

          <div className="relative bg-white max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-2xl z-10 animate-fade-in">
            {!orderCompleted ? (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-capo-black uppercase tracking-tight">
                      Récapitulatif de votre commande
                    </h3>
                    <p className="text-xs text-zinc-500">Expédition Dakar & Régions</p>
                  </div>
                  <button
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-black rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Items summary */}
                <div className="max-h-40 overflow-y-auto mb-6 pr-2 space-y-2 border-b border-zinc-100 pb-4">
                  {items.map((i) => (
                    <div key={i.id} className="flex justify-between text-xs">
                      <span className="truncate pr-4 text-zinc-700">
                        {i.quantity}x {i.product.name}
                        {i.selectedSize ? ` (${i.selectedSize})` : ''}
                      </span>
                      <span className="font-semibold text-zinc-900 shrink-0">
                        {formatFCFA(i.unitPrice * i.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between text-xs font-bold text-zinc-900 border-t border-dashed border-zinc-200">
                    <span>Total à régler :</span>
                    <span className="text-sm font-display">{formatFCFA(total)}</span>
                  </div>
                </div>

                {/* Shipping form */}
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Nom complet & Prénom
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Aminata Diallo"
                      className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                        Téléphone (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ex: 77 000 00 00"
                        className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                        Ville / Région
                      </label>
                      <select
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded focus:border-black focus:outline-none bg-white"
                      >
                        <option value="Dakar">Dakar (Plateau, Almadies, Mermoz...)</option>
                        <option value="Thiès">Thiès</option>
                        <option value="Saint-Louis">Saint-Louis</option>
                        <option value="Mbour / Saly">Mbour / Saly</option>
                        <option value="Autre Région">Autre Région du Sénégal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Adresse de livraison précise
                    </label>
                    <input
                      type="text"
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Ex: Almadies, en face de la pharmacie..."
                      className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-600">
                    <p className="font-semibold text-zinc-900 mb-0.5">Mode de règlement :</p>
                    <p>Paiement comptant à la remise ou virement Wave / Orange Money après confirmation téléphonique de notre concierge.</p>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutModalOpen(false)}
                      className="flex-1 py-3 border border-zinc-300 text-xs font-semibold uppercase tracking-wider text-zinc-700 hover:border-black"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-capo-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Confirmer la commande
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Success screen */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <PackageCheck className="w-8 h-8" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-capo-black uppercase mb-2">
                  Commande validée avec succès !
                </h3>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto mb-6 leading-relaxed">
                  Merci <strong>{customerName}</strong>. Notre concierge CAPOSTORE221 va vous contacter au <strong>{customerPhone}</strong> pour coordonner la livraison express à {customerCity}.
                </p>
                <div className="p-4 bg-zinc-50 rounded text-xs text-zinc-700 mb-6 text-left space-y-1">
                  <p><strong>Total de la commande :</strong> {formatFCFA(total)}</p>
                  <p><strong>Lieu de livraison :</strong> {customerAddress}, {customerCity}</p>
                </div>
                <button
                  onClick={handleFinish}
                  className="w-full py-3.5 bg-capo-black text-white text-xs font-bold uppercase tracking-wider"
                >
                  Retourner à la boutique
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
