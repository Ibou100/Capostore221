import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, MessageCircle, ExternalLink, Truck, Store } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import type { PaymentMethod } from '../../types';
import { 
  formatFCFA, 
  PAYMENT_METHODS_DATA, 
  getWhatsAppOrderLink, 
  validateSenegalPhone, 
  formatSenegalPhoneInput 
} from '../../utils/format';

export const QuickOrderModal: React.FC = () => {
  const { quickOrderProduct, closeQuickOrder, createOrder } = useOrders();
  const { showToast } = useStore();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [deliveryMode, setDeliveryMode] = useState<'livraison' | 'retrait'>('livraison');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [customerCity, setCustomerCity] = useState('Dakar');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string>('');

  const product = quickOrderProduct?.product;

  useEffect(() => {
    if (quickOrderProduct) {
      setCreatedOrderId(null);
      setWhatsAppUrl('');
      // Set initial size if available
      if (quickOrderProduct.initialSize) {
        setSelectedSize(quickOrderProduct.initialSize);
      } else if (product?.availableSizes && product.availableSizes.length > 0) {
        setSelectedSize(product.availableSizes[0]);
      } else {
        setSelectedSize(undefined);
      }
    }
  }, [quickOrderProduct, product]);

  if (!quickOrderProduct || !product) return null;

  const hasSizes = product.availableSizes && product.availableSizes.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasSizes && !selectedSize) {
      showToast('Veuillez sélectionner une taille disponible.', 'error');
      return;
    }

    const phoneValidation = validateSenegalPhone(customerPhone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Numéro invalide');
      showToast(phoneValidation.error || 'Veuillez saisir un numéro sénégalais valide à 9 chiffres.', 'error');
      return;
    }

    if (deliveryMode === 'livraison') {
      if (!customerCity.trim()) {
        showToast('Veuillez renseigner votre ville ou localité.', 'error');
        return;
      }

      if (!customerAddress.trim()) {
        showToast('Veuillez préciser votre adresse ou quartier de livraison.', 'error');
        return;
      }
    }

    const finalCity = deliveryMode === 'retrait' ? 'Sur place (Boutique)' : customerCity.trim();
    const finalAddress = deliveryMode === 'retrait'
      ? '🏪 Récupération sur place par le client'
      : `🚚 Livraison à domicile : ${customerAddress.trim()}`;

    // 1. Create order in platform system
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
    });

    // 2. Generate WhatsApp link with tracking ID, phone, payment mode & direct photo link
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
    showToast(`Commande ${newOrder.id} enregistrée ! Redirection vers WhatsApp...`, 'success');

    // 3. Open WhatsApp in new tab
    try {
      window.open(waLink, '_blank', 'noopener,noreferrer');
    } catch {
      // Handled in confirmation screen
    }
  };

  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeQuickOrder} 
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 text-center">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden text-left transform transition-all animate-scaleUp my-8">
          
          {/* Header */}
          <div className="bg-[#141210] text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded bg-[#B85D19] flex items-center justify-center text-white text-xs font-bold">
                ✓
              </span>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base tracking-tight">
                  {createdOrderId ? 'Commande Enregistrée !' : 'Commander cet article'}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {createdOrderId ? `Numéro de suivi : ${createdOrderId}` : 'Envoi direct via WhatsApp & suivi en temps réel'}
                </p>
              </div>
            </div>
            <button
              onClick={closeQuickOrder}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
            {createdOrderId ? (
              // Order Confirmation State
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100 animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2">
                    Étape 2 sur 2 : Confirmation WhatsApp
                  </span>
                  <h4 className="font-display font-black text-xl text-zinc-900">
                    Commande Enregistrée !
                  </h4>
                  <p className="text-xs text-zinc-600 mt-1.5 max-w-sm mx-auto leading-relaxed">
                    Votre commande est bien enregistrée sous le numéro de suivi :
                  </p>
                  <div className="inline-block mt-2 px-4 py-1.5 bg-zinc-100 border border-zinc-200 rounded-xl">
                    <span className="font-mono text-base font-black text-zinc-900 tracking-wider">
                      {createdOrderId}
                    </span>
                  </div>

                  <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl mt-4 text-xs text-amber-950 text-left space-y-1.5 shadow-xs">
                    <p className="font-bold flex items-center gap-1.5 text-amber-950 text-[12px]">
                      <span>⚠️</span> Important pour expédier votre colis :
                    </p>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Veuillez cliquer sur le bouton vert ci-dessous pour ouvrir WhatsApp puis appuyer sur <strong>« Envoyer »</strong>. Le gérant confirmera votre livraison sans délai !
                    </p>
                  </div>
                </div>

                {/* Recap of the item */}
                <div className="bg-zinc-50 rounded-xl p-3.5 flex items-center gap-3 text-left border border-zinc-200/80">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg bg-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs text-zinc-900 truncate">
                      {product.name}
                    </h5>
                    <p className="text-[11px] text-zinc-500">
                      {selectedSize ? `Taille : ${selectedSize}` : 'Taille unique'} • {formatFCFA(product.price)}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                      Paiement : {paymentMethod === 'wave' ? 'Wave' : paymentMethod === 'orange_money' ? 'Orange Money' : paymentMethod === 'free_money' ? 'Yas / Mixx' : 'Espèces à la livraison'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-2">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5 text-white shrink-0" />
                    <span>ENVOYER SUR WHATSAPP (76 832 11 57)</span>
                    <ExternalLink className="w-4 h-4 opacity-80 shrink-0" />
                  </a>

                  <button
                    type="button"
                    onClick={closeQuickOrder}
                    className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Continuer mes achats
                  </button>
                </div>
              </div>
            ) : (
              // Order Form State
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Summary */}
                <div className="flex items-center gap-3.5 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      {product.subCategory}
                    </span>
                    <h4 className="font-display font-semibold text-xs sm:text-sm text-zinc-900 truncate">
                      {product.name}
                    </h4>
                    <span className="font-display font-bold text-sm text-[#B85D19]">
                      {formatFCFA(product.price)}
                    </span>
                  </div>
                </div>

                {/* Size Selection (ONLY sizes enabled by the owner!) */}
                {hasSizes && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                        Tailles disponibles en stock *
                      </label>
                      <span className="text-[11px] text-zinc-500">
                        Définies par CAPOSTORE221
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.availableSizes!.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-10 h-10 px-3 rounded-lg text-xs font-bold transition-all ${
                            selectedSize === size
                              ? 'bg-[#141210] text-white shadow-sm ring-2 ring-black'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Contact & Delivery Info */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                      Comment souhaitez-vous recevoir votre commande ? *
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setDeliveryMode('livraison')}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                          deliveryMode === 'livraison'
                            ? 'border-[#B85D19] bg-amber-50/70 ring-2 ring-[#B85D19]/30'
                            : 'border-zinc-200 bg-white hover:bg-zinc-50'
                        }`}
                      >
                        <Truck className={`w-4 h-4 shrink-0 mt-0.5 ${deliveryMode === 'livraison' ? 'text-[#B85D19]' : 'text-zinc-500'}`} />
                        <div>
                          <p className="font-bold text-xs text-zinc-900">Me faire livrer</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
                            Livraison à votre adresse
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryMode('retrait')}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                          deliveryMode === 'retrait'
                            ? 'border-[#B85D19] bg-amber-50/70 ring-2 ring-[#B85D19]/30'
                            : 'border-zinc-200 bg-white hover:bg-zinc-50'
                        }`}
                      >
                        <Store className={`w-4 h-4 shrink-0 mt-0.5 ${deliveryMode === 'retrait' ? 'text-[#B85D19]' : 'text-zinc-500'}`} />
                        <div>
                          <p className="font-bold text-xs text-zinc-900">Venir récupérer</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">
                            Je viens moi-même chercher
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <h5 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-900 pt-1">
                    Vos coordonnées
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                        Votre Nom & Prénom
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ex: Moussa Diop"
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-800 mb-1">
                        Numéro de Téléphone * <span className="text-amber-600 font-normal">(WhatsApp / Appel)</span>
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
                          className={`w-full text-xs font-semibold pl-16 pr-3.5 py-2.5 rounded-lg border font-mono focus:outline-none focus:ring-2 transition-colors ${
                            phoneError ? 'border-red-400 focus:ring-red-400 bg-red-50/20' : 'border-zinc-300 focus:ring-[#B85D19]'
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
                  </div>

                  {deliveryMode === 'livraison' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-800 mb-1">
                          Ville / Région *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerCity}
                          onChange={(e) => setCustomerCity(e.target.value)}
                          placeholder="Ex: Dakar, Thiès, Mbour..."
                          className="w-full text-xs px-3 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-800 mb-1">
                          Adresse ou Quartier *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="Ex: Sacré-Cœur 3, près de la boulangerie"
                          className="w-full text-xs px-3 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2.5">
                      <Store className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        <strong>Récupération sur place :</strong> Vous viendrez récupérer votre commande vous-même. L'adresse exacte vous sera confirmée sur WhatsApp.
                      </span>
                    </div>
                  )}
                </div>

                {/* Payment Method Selector (REQUIRED by user: Wave, Orange Money, Espèces, Free Money) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                      Avec quoi allez-vous payer ? *
                    </label>
                    <span className="text-[10px] text-zinc-400">Règlement sécurisé</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {PAYMENT_METHODS_DATA.map((method) => {
                      const isSelected = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#B85D19] bg-amber-50/70 ring-2 ring-[#B85D19]/30 shadow-xs'
                              : 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            {method.logo ? (
                              <div className="w-10 h-10 rounded-lg bg-white border border-zinc-200 p-1 flex items-center justify-center overflow-hidden shadow-2xs shrink-0">
                                <img
                                  src={method.logo}
                                  alt={method.label}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-lg shrink-0">
                                {method.icon}
                              </div>
                            )}
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-[#B85D19] text-white' : 'bg-zinc-100 text-zinc-600'
                            }`}>
                              {method.badge}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="font-bold text-xs text-zinc-900 leading-tight">
                              {method.label}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                              {method.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Valider & Commander sur WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center text-zinc-500 mt-2">
                    🔒 Un code de suivi unique vous sera attribué pour suivre l'acheminement de votre colis.
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
