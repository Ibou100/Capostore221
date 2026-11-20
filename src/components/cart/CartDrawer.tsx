import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Truck,
  Store,
  CheckCircle2,
  MessageCircle,
  Banknote,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import { getProductStoreType } from '../../data/products';
import type { PaymentMethod } from '../../types';
import {
  formatFCFA,
  STORE_WHATSAPP_PHONE,
  getWhatsAppCheckoutLink,
  PAYMENT_METHODS_DATA,
  getPaymentMethodLabel,
  validateSenegalPhone,
  formatSenegalPhoneInput,
} from '../../utils/format';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    subtotal,
    shippingFee,
    total,
  } = useCart();
  const { goToCatalog, showToast } = useStore();
  const { createOrder } = useOrders();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'livraison' | 'retrait'>('livraison');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Dakar');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  if (!isOpen) return null;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customerName.trim();
    const phone = customerPhone.trim();
    const address = customerAddress.trim();
    const city = customerCity.trim();

    if (!name || name.length < 2) {
      showToast('Veuillez renseigner votre nom complet.', 'error');
      return;
    }

    const phoneValidation = validateSenegalPhone(phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Numéro invalide');
      showToast(
        phoneValidation.error || 'Veuillez saisir un numéro sénégalais valide à 9 chiffres.',
        'error'
      );
      return;
    }

    if (deliveryMode === 'livraison') {
      if (!city || city.length < 2) {
        showToast('Veuillez renseigner votre ville ou localité.', 'error');
        return;
      }

      if (!address || address.length < 3) {
        showToast('Veuillez préciser votre adresse de livraison.', 'error');
        return;
      }
    }

    const finalCity = deliveryMode === 'retrait' ? 'Sur place (Boutique)' : city;
    const finalAddress =
      deliveryMode === 'retrait'
        ? 'Récupération sur place par le client'
        : `Livraison à domicile : ${address}`;

    const newOrder = createOrder({
      customerName: name,
      customerPhone: phoneValidation.formatted,
      customerCity: finalCity,
      customerAddress: finalAddress,
      paymentMethod,
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.unitPrice,
        quantity: i.quantity,
        size: i.selectedSize,
        image: i.product.images[0] || '',
      })),
      total,
      shippingFee,
      notes: deliveryMode,
      storeType: (() => {
        const types = new Set(items.map((i) => getProductStoreType(i.product)));
        if (types.size > 1) return 'mixte' as const;
        return types.has('electronique') ? ('electronique' as const) : ('mode' as const);
      })(),
    });

    const checkoutUrl = getWhatsAppCheckoutLink(items, total, {
      orderId: newOrder.id,
      name,
      phone: phoneValidation.formatted,
      city: finalCity,
      address: deliveryMode === 'retrait' ? 'Récupération sur place' : address,
      paymentMethod,
      deliveryMode,
    });

    setCreatedOrderId(newOrder.id);
    setLastWhatsAppUrl(checkoutUrl);
    setOrderCompleted(true);
    showToast(`Commande ${newOrder.id} validée.`, 'success');

    try {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Handled in confirmation screen
    }
  };

  const handleFinish = () => {
    clearCart();
    setIsCheckoutModalOpen(false);
    setOrderCompleted(false);
    setCreatedOrderId(null);
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-drawer flex flex-col justify-between animate-drawer">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E8E6E1] flex items-center justify-between">
            <h2 className="font-display font-semibold text-base text-[#0A0A0A]">
              Panier ({totalCount})
            </h2>
            <button
              type="button"
              onClick={closeCart}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#5F5F5A] hover:text-[#0A0A0A] hover:bg-[#F6F5F2] transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-5 border-b border-[#E8E6E1] last:border-b-0"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-22 object-cover bg-[#F6F5F2] rounded-2xl shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-sm text-[#0A0A0A] line-clamp-2 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#5F5F5A] hover:text-red-600 p-1 transition-colors shrink-0"
                          aria-label="Supprimer l'article"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                        </button>
                      </div>

                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-xs text-[#5F5F5A] mt-1">
                          {[item.selectedSize, item.selectedColor?.name].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-[#E8E6E1] rounded-full bg-white h-8">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 text-sm text-[#5F5F5A] hover:text-[#0A0A0A]"
                          aria-label="Diminuer la quantité"
                        >
                          −
                        </button>
                        <span className="px-1.5 text-xs font-medium text-[#0A0A0A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 text-sm text-[#5F5F5A] hover:text-[#0A0A0A]"
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-semibold text-sm text-[#0A0A0A]">
                        {formatFCFA(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#F6F5F2] flex items-center justify-center text-[#5F5F5A]">
                  <ShoppingBag className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-semibold text-base text-[#0A0A0A]">
                    Votre panier est vide
                  </h3>
                  <p className="text-sm text-[#5F5F5A] max-w-xs">
                    Parcourez nos boutiques pour ajouter des articles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    goToCatalog({ category: 'tous' });
                  }}
                  className="h-11 px-6 rounded-full bg-[#0A0A0A] text-white text-sm font-medium"
                >
                  Continuer mes achats
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-[#F6F5F2] border-t border-[#E8E6E1] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#5F5F5A]">
                  <span>Sous-total</span>
                  <span className="font-medium text-[#0A0A0A]">{formatFCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#0A0A0A] pt-2 border-t border-[#E8E6E1]">
                  <span>Total</span>
                  <span>{formatFCFA(total)}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full h-12 rounded-full bg-[#0A0A0A] hover:bg-zinc-800 text-white text-sm font-medium transition-colors"
                >
                  Commander
                </button>

                <a
                  href={`https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                    `Bonjour CAPOSTORE221,\nJe souhaite commander :\n\n` +
                      items
                        .map(
                          (i) =>
                            `• ${i.quantity}x ${i.product.name}${i.selectedSize ? ` (${i.selectedSize})` : ''} - ${formatFCFA(i.unitPrice * i.quantity)}`
                        )
                        .join('\n') +
                      `\n\nTotal : ${formatFCFA(total)}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 rounded-full bg-white hover:bg-[#F6F5F2] border border-[#E8E6E1] text-[#0A0A0A] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" strokeWidth={1.75} />
                  <span>Commander via WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => !orderCompleted && setIsCheckoutModalOpen(false)}
          />

          <div className="relative bg-white max-w-lg w-full p-6 sm:p-8 rounded-[24px] shadow-premium z-10 animate-fade-in border border-[#E8E6E1] max-h-[90vh] overflow-y-auto">
            {!orderCompleted ? (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1] mb-5">
                  <div>
                    <h3 className="font-display font-semibold text-base text-[#0A0A0A]">
                      Finaliser la commande
                    </h3>
                    <p className="text-xs text-[#5F5F5A]">Tu commandes, on te livre</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[#5F5F5A] hover:bg-[#F6F5F2]"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" strokeWidth={1.75} />
                  </button>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  {/* Delivery vs Pickup */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('livraison')}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2 ${
                        deliveryMode === 'livraison'
                          ? 'border-[#0A0A0A] bg-[#F6F5F2]'
                          : 'border-[#E8E6E1] bg-white'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-[#0A0A0A] shrink-0 mt-0.5" strokeWidth={1.75} />
                      <div>
                        <p className="font-medium text-xs text-[#0A0A0A]">Me faire livrer</p>
                        <p className="text-[11px] text-[#5F5F5A]">À domicile</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMode('retrait')}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2 ${
                        deliveryMode === 'retrait'
                          ? 'border-[#0A0A0A] bg-[#F6F5F2]'
                          : 'border-[#E8E6E1] bg-white'
                      }`}
                    >
                      <Store className="w-4 h-4 text-[#0A0A0A] shrink-0 mt-0.5" strokeWidth={1.75} />
                      <div>
                        <p className="font-medium text-xs text-[#0A0A0A]">Venir récupérer</p>
                        <p className="text-[11px] text-[#5F5F5A]">Sur place</p>
                      </div>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#0A0A0A] mb-1">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Votre nom et prénom"
                        className="w-full h-11 text-sm px-3.5 rounded-xl border border-[#E8E6E1] focus:border-[#0A0A0A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#0A0A0A] mb-1">
                        Téléphone *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#5F5F5A] select-none">
                          +221
                        </span>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => {
                            setCustomerPhone(formatSenegalPhoneInput(e.target.value));
                            setPhoneError(null);
                          }}
                          placeholder="77 455 23 41"
                          maxLength={12}
                          className={`w-full h-11 text-sm font-mono pl-14 pr-3.5 rounded-xl border focus:outline-none ${
                            phoneError ? 'border-red-500 bg-red-50/30' : 'border-[#E8E6E1] focus:border-[#0A0A0A]'
                          }`}
                        />
                      </div>
                      {phoneError && <p className="text-[11px] text-red-600 mt-1">{phoneError}</p>}
                    </div>
                  </div>

                  {deliveryMode === 'livraison' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#0A0A0A] mb-1">
                          Ville / Localité *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerCity}
                          onChange={(e) => setCustomerCity(e.target.value)}
                          placeholder="Votre ville"
                          className="w-full h-11 text-sm px-3.5 rounded-xl border border-[#E8E6E1] focus:border-[#0A0A0A] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#0A0A0A] mb-1">
                          Adresse précise *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="Quartier, rue..."
                          className="w-full h-11 text-sm px-3.5 rounded-xl border border-[#E8E6E1] focus:border-[#0A0A0A] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-[#0A0A0A]">
                      Moyen de paiement *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS_DATA.map((method) => {
                        const isSelected = paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                              isSelected
                                ? 'border-[#0A0A0A] bg-[#F6F5F2]'
                                : 'border-[#E8E6E1] bg-white hover:border-[#0A0A0A]'
                            }`}
                          >
                            {method.logo ? (
                              <img
                                src={method.logo}
                                alt={method.label}
                                className="w-7 h-7 rounded-lg object-contain bg-white border border-[#E8E6E1] p-0.5 shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-[#F6F5F2] border border-[#E8E6E1] flex items-center justify-center shrink-0">
                                <Banknote className="w-4 h-4 text-[#0A0A0A]" strokeWidth={1.75} />
                              </div>
                            )}
                            <span className="font-medium text-xs text-[#0A0A0A]">{method.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutModalOpen(false)}
                      className="flex-1 h-12 rounded-full border border-[#E8E6E1] text-sm font-medium text-[#0A0A0A]"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-12 rounded-full bg-[#0A0A0A] hover:bg-zinc-800 text-white text-sm font-medium"
                    >
                      Confirmer ({formatFCFA(total)})
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-4 space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" strokeWidth={1.75} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-semibold text-xl text-[#0A0A0A]">
                    Commande enregistrée
                  </h3>
                  {createdOrderId && (
                    <p className="text-sm text-[#5F5F5A]">
                      Référence : <strong className="font-mono text-[#0A0A0A]">{createdOrderId}</strong>
                    </p>
                  )}
                </div>

                <div className="p-4 bg-[#F6F5F2] rounded-2xl text-xs text-[#0A0A0A] text-left space-y-1">
                  <p><strong>Client :</strong> {customerName} ({customerPhone})</p>
                  <p>
                    <strong>Réception :</strong>{' '}
                    {deliveryMode === 'retrait' ? 'Récupération sur place' : `${customerAddress}, ${customerCity}`}
                  </p>
                  <p><strong>Paiement :</strong> {getPaymentMethodLabel(paymentMethod)}</p>
                  <p><strong>Total :</strong> {formatFCFA(total)}</p>
                </div>

                {lastWhatsAppUrl && (
                  <a
                    href={lastWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
                    <span>Envoyer sur WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full h-11 rounded-full bg-[#F6F5F2] hover:bg-[#E8E6E1] text-[#0A0A0A] text-sm font-medium transition-colors"
                >
                  Continuer mes achats
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
