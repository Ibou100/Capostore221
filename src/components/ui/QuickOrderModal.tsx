import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, MessageCircle, ExternalLink, PackageCheck } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import type { PaymentMethod } from '../../types';
import { 
  formatFCFA, 
  PAYMENT_METHODS_DATA, 
  getWhatsAppOrderLink 
} from '../../utils/format';

export const QuickOrderModal: React.FC = () => {
  const { quickOrderProduct, closeQuickOrder, createOrder } = useOrders();
  const { showToast, goToTracking, goToOrders } = useStore();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
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

    const phoneClean = customerPhone.trim().replace(/\D/g, '');
    if (phoneClean.length < 7) {
      showToast('Veuillez saisir un numéro de téléphone valide (ex: 77 123 45 67).', 'error');
      return;
    }

    if (!customerCity.trim()) {
      showToast('Veuillez renseigner votre ville ou localité.', 'error');
      return;
    }

    if (!customerAddress.trim()) {
      showToast('Veuillez préciser votre adresse ou quartier de livraison.', 'error');
      return;
    }

    // 1. Create order in platform system
    const newOrder = createOrder({
      customerName: customerName.trim() || 'Client',
      customerPhone: customerPhone.trim(),
      customerCity: customerCity.trim(),
      customerAddress: customerAddress.trim(),
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
        customerCity: newOrder.customerCity,
        customerAddress: newOrder.customerAddress,
        paymentMethod: newOrder.paymentMethod,
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

  const handleTrackDirectly = () => {
    if (createdOrderId) {
      closeQuickOrder();
      goToTracking(createdOrderId);
    }
  };

  const handleViewOrders = () => {
    closeQuickOrder();
    goToOrders();
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
                  <h4 className="font-display font-bold text-lg text-zinc-900">
                    Votre commande est validée !
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    La commande a été enregistrée sur la plateforme sous le numéro :
                  </p>
                  <div className="inline-block mt-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                      Code de suivi du colis
                    </span>
                    <span className="font-mono text-xl font-black text-amber-950 tracking-wider">
                      {createdOrderId}
                    </span>
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
                      Paiement : {paymentMethod === 'wave' ? 'Wave' : paymentMethod === 'orange_money' ? 'Orange Money' : paymentMethod === 'free_money' ? 'Free Money' : 'Espèces à la livraison'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-2">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Ouvrir la conversation WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleTrackDirectly}
                      className="py-2.5 px-3 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <PackageCheck className="w-4 h-4 text-amber-400" />
                      <span>Suivre ce colis</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleViewOrders}
                      className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Mes commandes
                    </button>
                  </div>
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
                <div className="space-y-3">
                  <h5 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-900">
                    Vos coordonnées de livraison
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
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ex: 77 123 45 67"
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-zinc-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                      />
                    </div>
                  </div>

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
                </div>

                {/* Payment Method Selector (REQUIRED by user: Wave, Orange Money, Espèces, Free Money) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                      Avec quoi allez-vous payer ? *
                    </label>
                    <span className="text-[10px] text-zinc-400">Règlement sécurisé</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS_DATA.map((method) => {
                      const isSelected = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#B85D19] bg-amber-50/60 ring-2 ring-[#B85D19]/30'
                              : 'border-zinc-200 bg-white hover:bg-zinc-50'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-base">{method.icon}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-[#B85D19] text-white' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                              {method.badge}
                            </span>
                          </div>
                          <div className="mt-1.5">
                            <p className="font-bold text-xs text-zinc-900 leading-tight">
                              {method.label}
                            </p>
                            <p className="text-[9px] text-zinc-500 mt-0.5 line-clamp-1">
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
