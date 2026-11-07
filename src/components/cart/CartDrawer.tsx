import React, { useState } from 'react';
import { 
  X, ShoppingBag, Trash2, ShieldCheck, 
  Truck, CheckCircle2, MessageCircle, PackageCheck 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import type { PaymentMethod } from '../../types';
import { 
  formatFCFA, 
  STORE_WHATSAPP_PHONE, 
  STORE_PHONE_WHATSAPP_DISPLAY, 
  STORE_PHONE_CALL_DISPLAY,
  getWhatsAppCheckoutLink,
  PAYMENT_METHODS_DATA,
  getPaymentMethodLabel,
  validateSenegalPhone,
  formatSenegalPhoneInput
} from '../../utils/format';

export const CartDrawer: React.FC = () => {
  const { 
    items, isOpen, closeCart, removeFromCart, updateQuantity, 
    clearCart, totalCount, subtotal, shippingFee, total 
  } = useCart();
  const { goToCatalog, showToast, goToTracking, goToOrders } = useStore();
  const { createOrder } = useOrders();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
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
      showToast(phoneValidation.error || 'Veuillez saisir un numéro sénégalais valide à 9 chiffres.', 'error');
      return;
    }

    if (!city || city.length < 2) {
      showToast('Veuillez renseigner votre ville ou localité.', 'error');
      return;
    }

    if (!address || address.length < 3) {
      showToast('Veuillez préciser votre adresse de livraison.', 'error');
      return;
    }

    // 1. Enregistrer la commande sur la plateforme avec son N° de suivi unique
    const newOrder = createOrder({
      customerName: name,
      customerPhone: phoneValidation.formatted,
      customerCity: city,
      customerAddress: address,
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
    });

    // 2. Générer le lien WhatsApp complet incluant N° de suivi, téléphone, paiement et photos
    const checkoutUrl = getWhatsAppCheckoutLink(items, total, {
      orderId: newOrder.id,
      name,
      phone,
      city,
      address,
      paymentMethod
    });

    setCreatedOrderId(newOrder.id);
    setLastWhatsAppUrl(checkoutUrl);
    setOrderCompleted(true);
    showToast(`Commande ${newOrder.id} validée ! Redirection vers WhatsApp...`, 'success');

    // 3. Ouvrir WhatsApp
    try {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // If browser blocks popup, user can click the button on the confirmation screen
    }
  };

  const handleFinish = () => {
    clearCart();
    setIsCheckoutModalOpen(false);
    setOrderCompleted(false);
    setCreatedOrderId(null);
    closeCart();
  };

  const handleTrackPackage = () => {
    if (createdOrderId) {
      clearCart();
      setIsCheckoutModalOpen(false);
      setOrderCompleted(false);
      closeCart();
      goToTracking(createdOrderId);
    }
  };

  const handleGoToOrderHistory = () => {
    clearCart();
    setIsCheckoutModalOpen(false);
    setOrderCompleted(false);
    closeCart();
    goToOrders();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-drawer">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-zinc-900" />
                <h2 className="font-display font-bold text-sm sm:text-base tracking-tight uppercase text-zinc-900">
                  Votre Panier ({totalCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1 rounded text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Banner */}
            {items.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-100">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200/70">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Livraison offerte sur toute commande</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                    0 FCFA
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-5 border-b border-zinc-100 last:border-b-0">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-20 object-contain p-1 bg-[#FAF8F5] border border-[#EAE5DC] rounded-sm shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-display font-medium text-xs sm:text-sm text-zinc-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                          title="Supprimer l'article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant tags */}
                      <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-zinc-500">
                        {item.selectedSize && (
                          <span className="bg-zinc-100 px-2 py-0.5 rounded-sm">
                            Taille : {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="bg-zinc-100 px-2 py-0.5 rounded-sm flex items-center gap-1">
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
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="inline-flex items-center border border-zinc-200 rounded-sm bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-zinc-600 hover:text-black"
                          aria-label="Diminuer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-zinc-600 hover:text-black"
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-semibold text-xs text-zinc-900">
                        {formatFCFA(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-sm text-zinc-900 uppercase tracking-tight">
                  Votre panier est vide
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs mb-6">
                  Découvrez nos collections de vêtements et accessoires disponibles en stock.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    goToCatalog({ category: 'tous' });
                  }}
                  className="bg-[#141210] text-white px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                >
                  Découvrir les pièces
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout actions */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-zinc-50/80 border-t border-zinc-200 space-y-4">
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-semibold text-zinc-900">{formatFCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span className="font-bold text-emerald-700">Offerts (0 FCFA)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total</span>
                  <span className="font-display text-base text-zinc-900">{formatFCFA(total)}</span>
                </div>
              </div>

              {/* Order checkout CTAs */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full bg-[#141210] hover:bg-[#2C2723] text-white py-3.5 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-colors shadow-sm"
                >
                  <span>Valider la commande en ligne</span>
                </button>

                <a
                  href={`https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                    `Bonjour CAPOSTORE221,\nJe souhaite commander les articles suivants vus sur votre boutique en ligne :\n\n` +
                    items.map(i => `• ${i.quantity}x ${i.product.name}${i.selectedSize ? ` (Taille ${i.selectedSize})` : ''} - ${formatFCFA(i.unitPrice * i.quantity)}`).join('\n') +
                    `\n\nTotal : ${formatFCFA(total)}\n\nMerci de me contacter pour la livraison !`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Commander via WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !orderCompleted && setIsCheckoutModalOpen(false)}
          />

          <div className="relative bg-white max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-2xl z-10 animate-fade-in border border-zinc-200">
            {!orderCompleted ? (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-zinc-900 uppercase tracking-tight">
                      Informations de livraison
                    </h3>
                    <p className="text-xs text-zinc-500">Tu commandes, on te livre</p>
                  </div>
                  <button
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-black rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Items summary */}
                <div className="max-h-36 overflow-y-auto mb-5 pr-2 space-y-1.5 border-b border-zinc-100 pb-3">
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
                    <span>Total de la commande :</span>
                    <span className="text-sm font-display">{formatFCFA(total)}</span>
                  </div>
                </div>

                {/* Shipping form */}
                <form onSubmit={handleOrderSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Votre nom et prénom"
                      className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded-sm focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                        Téléphone * <span className="text-amber-700 font-normal">(WhatsApp / Appel)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500 font-mono select-none">
                          🇸🇳 +221
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
                          className={`w-full text-xs font-semibold pl-16 pr-3 py-2.5 border rounded-sm focus:outline-none transition-colors ${
                            phoneError ? 'border-red-400 bg-red-50/20' : 'border-zinc-300 focus:border-black'
                          }`}
                        />
                      </div>
                      {phoneError ? (
                        <p className="text-[10px] text-red-600 mt-1 font-medium">{phoneError}</p>
                      ) : (
                        <p className="text-[10px] text-zinc-500 mt-1">
                          Format Sénégal : 9 chiffres (ex : 77 455 23 41)
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                        Ville / Localité
                      </label>
                      <input
                        type="text"
                        required
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        placeholder="Votre ville"
                        className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded-sm focus:border-black focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                      Adresse de livraison précise
                    </label>
                    <input
                      type="text"
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Rue, repère ou quartier de livraison"
                      className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded-sm focus:border-black focus:outline-none"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-900">
                      Mode de règlement souhaité *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS_DATA.map((method) => {
                        const isSelected = paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            className={`p-2 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'border-[#B85D19] bg-amber-50/70 ring-1 ring-[#B85D19]'
                                : 'border-zinc-200 bg-white hover:bg-zinc-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{method.icon}</span>
                              <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                                isSelected ? 'bg-[#B85D19] text-white' : 'bg-zinc-100 text-zinc-500'
                              }`}>
                                {method.badge}
                              </span>
                            </div>
                            <p className="font-bold text-[11px] text-zinc-900 mt-1">
                              {method.label}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutModalOpen(false)}
                      className="flex-1 py-3 border border-zinc-300 text-xs font-semibold uppercase tracking-wider text-zinc-700 hover:border-black rounded-sm"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#141210] hover:bg-[#2C2723] text-white text-xs font-semibold uppercase tracking-wider transition-colors rounded-sm shadow-md"
                    >
                      Confirmer la commande
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Success screen */
              <div className="text-center py-5 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-100">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
                    Étape 2 sur 2 : Confirmation WhatsApp
                  </span>
                  <h3 className="font-display font-black text-lg text-zinc-900 uppercase">
                    Commande Enregistrée !
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto leading-relaxed">
                    Merci <strong>{customerName}</strong>. Votre commande a été enregistrée sur notre plateforme.
                  </p>

                  <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl mt-3 text-xs text-amber-950 text-left space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-950">
                      <span>⚠️</span> Action requise pour confirmer :
                    </p>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Cliquez sur le bouton vert ci-dessous pour ouvrir WhatsApp puis appuyez sur <strong>« Envoyer »</strong> afin que nous traitions votre commande.
                    </p>
                  </div>
                </div>

                {createdOrderId && (
                  <div className="inline-block p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                      Numéro de suivi de colis
                    </span>
                    <span className="font-mono text-lg font-black text-amber-950">
                      {createdOrderId}
                    </span>
                  </div>
                )}

                <div className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-700 text-left space-y-1 border border-zinc-200">
                  <p><strong>Destinataire :</strong> {customerName} ({customerPhone})</p>
                  <p><strong>Lieu :</strong> {customerAddress}, {customerCity}</p>
                  <p><strong>Moyen de paiement :</strong> <span className="text-emerald-700 font-bold">{getPaymentMethodLabel(paymentMethod)}</span></p>
                  <p><strong>Total à régler :</strong> {formatFCFA(total)}</p>
                </div>

                {lastWhatsAppUrl && (
                  <a
                    href={lastWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span>ENVOYER MA COMMANDE SUR WHATSAPP</span>
                  </a>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleTrackPackage}
                    className="py-2.5 px-3 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Suivre ce colis</span>
                  </button>
                  <button
                    onClick={handleGoToOrderHistory}
                    className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Mes commandes
                  </button>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full py-2.5 text-zinc-500 hover:text-black text-xs font-semibold transition-colors"
                >
                  Fermer & retourner à la boutique
                </button>

                <p className="text-[11px] text-zinc-400 pt-1">
                  Service client : {STORE_PHONE_WHATSAPP_DISPLAY} (WhatsApp) • {STORE_PHONE_CALL_DISPLAY} (Appel)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
