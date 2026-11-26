import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, MessageCircle, ExternalLink, Truck, Store, Banknote, CreditCard } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import { getProductStoreType, getSelectableSizes } from '../../data/products';
import type { PaymentMethod } from '../../types';
import {
  formatFCFA,
  PAYMENT_METHODS_DATA,
  getWhatsAppOrderLink,
  validateSenegalPhone,
  formatSenegalPhoneInput,
} from '../../utils/format';

export const QuickOrderModal: React.FC = () => {
  const { quickOrderProduct, closeQuickOrder, createOrder } = useOrders();
  const { showToast } = useStore();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [deliveryMode, setDeliveryMode] = useState<'livraison' | 'retrait'>('livraison');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [customerCity, setCustomerCity] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string>('');

  const product = quickOrderProduct?.product;

  useEffect(() => {
    if (quickOrderProduct) {
      setCreatedOrderId(null);
      setWhatsAppUrl('');
      if (quickOrderProduct.initialSize) {
        setSelectedSize(quickOrderProduct.initialSize);
      } else {
        const selectable = product ? getSelectableSizes(product) : [];
        setSelectedSize(selectable.length > 0 ? selectable[0] : undefined);
      }
    }
  }, [quickOrderProduct, product]);

  if (!quickOrderProduct || !product) return null;

  const selectableSizes = getSelectableSizes(product);
  const hasSizes = selectableSizes.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasSizes && !selectedSize) {
      showToast('Veuillez sélectionner une option disponible.', 'error');
      return;
    }

    const phoneValidation = validateSenegalPhone(customerPhone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Numéro invalide');
      showToast(
        phoneValidation.error || 'Veuillez saisir un numéro de téléphone valide.',
        'error'
      );
      return;
    }

    if (deliveryMode === 'livraison') {
      if (!customerCity.trim()) {
        showToast('Veuillez renseigner votre ville et pays.', 'error');
        return;
      }

      if (!customerAddress.trim()) {
        showToast('Veuillez préciser votre adresse de livraison.', 'error');
        return;
      }
    }

    const finalCity = deliveryMode === 'retrait' ? 'Sur place (Boutique)' : customerCity.trim();
    const finalAddress =
      deliveryMode === 'retrait'
        ? 'Récupération sur place par le client'
        : `Livraison à domicile : ${customerAddress.trim()}`;

    const newOrder = createOrder({
      customerName: customerName.trim() || 'Client',
      customerPhone: phoneValidation.formatted,
      customerCity: finalCity,
      customerAddress: finalAddress,
      paymentMethod,
      items: [
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          size: selectedSize,
          image: product.images[0] || '',
        },
      ],
      total: product.price,
      shippingFee: 0,
      notes: deliveryMode,
      storeType: getProductStoreType(product),
    });

    const waLink = getWhatsAppOrderLink(
      product.name,
      product.price,
      selectedSize,
      product.images[0],
      {
        orderId: newOrder.id,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        customerCity: customerCity.trim() || 'Dakar',
        customerAddress: customerAddress.trim(),
        paymentMethod: newOrder.paymentMethod,
        deliveryMode,
      }
    );

    setCreatedOrderId(newOrder.id);
    setWhatsAppUrl(waLink);
    showToast(`Commande ${newOrder.id} enregistrée.`, 'success');

    try {
      window.open(waLink, '_blank', 'noopener,noreferrer');
    } catch {
      // Handled in confirmation screen
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeQuickOrder}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 text-center">
        <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-premium overflow-hidden text-left animate-fade-in my-6 border border-[#E8E6E1]">
          {/* Clean Header */}
          <div className="px-6 py-4 border-b border-[#E8E6E1] flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-base text-[#0A0A0A]">
                {createdOrderId ? 'Commande enregistrée' : 'Commander cet article'}
              </h3>
              <p className="text-xs text-[#5F5F5A]">
                {createdOrderId ? `Référence ${createdOrderId}` : 'Livraison directe ou retrait sur place'}
              </p>
            </div>
            <button
              type="button"
              onClick={closeQuickOrder}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#5F5F5A] hover:text-[#0A0A0A] hover:bg-[#F6F5F2] transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {createdOrderId ? (
              <div className="space-y-6 text-center py-2">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" strokeWidth={1.75} />
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-semibold text-xl text-[#0A0A0A]">
                    Commande enregistrée
                  </h4>
                  <p className="text-sm text-[#5F5F5A]">
                    Référence : <strong className="font-mono text-[#0A0A0A]">{createdOrderId}</strong>
                  </p>
                  <div className="p-3.5 bg-[#F6F5F2] rounded-2xl text-xs text-[#0A0A0A] text-left space-y-1">
                    <p>
                      Votre commande a bien été transmise à l'équipe <strong>CAPOSTORE221</strong>.
                    </p>
                    <p className="text-[#5F5F5A]">
                      {paymentMethod === 'carte_bancaire'
                        ? 'Cliquez ci-dessous pour recevoir immédiatement votre lien de paiement sécurisé par Carte Bancaire (Visa / Mastercard) sur WhatsApp.'
                        : 'Vous pouvez également envoyer le récapitulatif sur WhatsApp pour accélérer le traitement.'}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F6F5F2] rounded-2xl p-3.5 flex items-center gap-3 text-left">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-xl bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm text-[#0A0A0A] truncate">{product.name}</h5>
                    <p className="text-xs text-[#5F5F5A]">
                      {selectedSize ? `${selectedSize} · ` : ''}{formatFCFA(product.price)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-full flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
                    <span>Envoyer sur WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <button
                    type="button"
                    onClick={closeQuickOrder}
                    className="w-full h-11 px-4 bg-[#F6F5F2] hover:bg-[#E8E6E1] text-[#0A0A0A] text-sm font-medium rounded-full transition-colors"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Summary */}
                <div className="flex items-center gap-3.5 p-3 bg-[#F6F5F2] rounded-2xl">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#5F5F5A] truncate">{product.subCategory}</p>
                    <h4 className="font-display font-medium text-sm text-[#0A0A0A] truncate">
                      {product.name}
                    </h4>
                    <span className="font-semibold text-sm text-[#0A0A0A]">
                      {formatFCFA(product.price)}
                    </span>
                  </div>
                </div>

                {/* Size / Option Selection */}
                {hasSizes && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#0A0A0A]">
                      Option disponible *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-11 h-10 px-4 rounded-full text-xs font-medium transition-colors border ${
                            selectedSize === size
                              ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                              : 'bg-white text-[#0A0A0A] border-[#E8E6E1] hover:border-[#0A0A0A]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery vs Pickup */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0A0A0A]">
                    Mode de réception *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('livraison')}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                        deliveryMode === 'livraison'
                          ? 'border-[#0A0A0A] bg-[#F6F5F2]'
                          : 'border-[#E8E6E1] bg-white hover:border-[#0A0A0A]'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-[#0A0A0A] shrink-0 mt-0.5" strokeWidth={1.75} />
                      <div>
                        <p className="font-medium text-xs text-[#0A0A0A]">Me faire livrer</p>
                        <p className="text-[11px] text-[#5F5F5A] mt-0.5">Livraison à votre adresse</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMode('retrait')}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                        deliveryMode === 'retrait'
                          ? 'border-[#0A0A0A] bg-[#F6F5F2]'
                          : 'border-[#E8E6E1] bg-white hover:border-[#0A0A0A]'
                      }`}
                    >
                      <Store className="w-4 h-4 text-[#0A0A0A] shrink-0 mt-0.5" strokeWidth={1.75} />
                      <div>
                        <p className="font-medium text-xs text-[#0A0A0A]">Venir récupérer</p>
                        <p className="text-[11px] text-[#5F5F5A] mt-0.5">Retrait sur place</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Contact Fields */}
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
                      placeholder="Ex: Moussa Diop"
                      className="w-full h-11 text-sm px-3.5 rounded-xl border border-[#E8E6E1] focus:border-[#0A0A0A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#0A0A0A] mb-1">
                      Téléphone (Tous pays) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(formatSenegalPhoneInput(e.target.value));
                        setPhoneError(null);
                      }}
                      placeholder="Ex: +33 6 12 34 56 78 ou 77 455 23 41"
                      maxLength={24}
                      className={`w-full h-11 text-sm font-mono px-3.5 rounded-xl border focus:outline-none ${
                        phoneError ? 'border-red-500 bg-red-50/30' : 'border-[#E8E6E1] focus:border-[#0A0A0A]'
                      }`}
                    />
                    {phoneError && <p className="text-[11px] text-red-600 mt-1">{phoneError}</p>}
                  </div>
                </div>

                {deliveryMode === 'livraison' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#0A0A0A] mb-1">
                        Ville & Pays *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        placeholder="Ex: Dakar, Paris, Bruxelles..."
                        className="w-full h-11 text-sm px-3.5 rounded-xl border border-[#E8E6E1] focus:border-[#0A0A0A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#0A0A0A] mb-1">
                        Adresse complète *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Ex: Rue, code postal ou quartier"
                        className="w-full h-11 text-sm px-3.5 rounded-xl border border-[#E8E6E1] focus:border-[#0A0A0A] focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#F6F5F2] rounded-xl text-xs text-[#5F5F5A]">
                    Vous viendrez récupérer votre commande vous-même. L'adresse vous sera confirmée sur WhatsApp.
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#0A0A0A]">
                    Moyen de paiement *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS_DATA.map((method) => {
                      const isSelected = paymentMethod === method.id;
                      const isCard = method.id === 'carte_bancaire';
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                            isCard ? 'col-span-2 justify-between' : ''
                          } ${
                            isSelected
                              ? 'border-[#0A0A0A] bg-[#F6F5F2]'
                              : 'border-[#E8E6E1] bg-white hover:border-[#0A0A0A]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {method.logo ? (
                              <img
                                src={method.logo}
                                alt={method.label}
                                className="w-8 h-8 rounded-lg object-contain bg-white border border-[#E8E6E1] p-0.5 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-[#F6F5F2] border border-[#E8E6E1] flex items-center justify-center shrink-0">
                                <Banknote className="w-4 h-4 text-[#0A0A0A]" strokeWidth={1.75} />
                              </div>
                            )}
                            <span className="font-medium text-xs text-[#0A0A0A] leading-tight">
                              {method.label}
                            </span>
                          </div>
                          {isCard && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                              Sénégal & International
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {paymentMethod === 'carte_bancaire' && (
                    <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80 flex items-start gap-2 text-xs text-indigo-950">
                      <CreditCard className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                      <span>
                        Paiement sécurisé <strong>Visa / Mastercard</strong> (Europe, International & Sénégal). Votre commande est enregistrée immédiatement et vous recevez votre lien de paiement CB sécurisé.
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-1 space-y-2">
                  <button
                    type="submit"
                    className="w-full h-12 px-5 bg-[#0A0A0A] hover:bg-zinc-800 text-white font-medium text-sm rounded-full flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Valider ma commande</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                  <p className="text-[12px] text-center text-[#5F5F5A]">
                    Commandes Sénégal & International · Carte bancaire, Mobile Money ou espèces
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
