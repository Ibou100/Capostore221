import React, { useState, useMemo } from 'react';
import { 
  Package, Search, CheckCircle2, Clock, Truck, 
  MapPin, Phone, CreditCard, MessageCircle, ArrowLeft,
  AlertCircle, ShieldCheck, Lock, ArrowRight
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import { 
  formatFCFA, 
  ORDER_STATUS_CONFIG, 
  getPaymentMethodLabel, 
  STORE_WHATSAPP_PHONE,
  maskPhoneNumber,
  maskCustomerName
} from '../../utils/format';
import { isSessionValid } from '../../utils/security';
import type { OrderStatus } from '../../types';

interface OrderTrackingViewProps {
  initialOrderId?: string;
}

const STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'transmise', label: 'Transmise', icon: Clock },
  { status: 'confirmee', label: 'Confirmée', icon: CheckCircle2 },
  { status: 'en_preparation', label: 'Préparation', icon: Package },
  { status: 'en_livraison', label: 'Livraison en cours', icon: Truck },
  { status: 'livree', label: 'Livré', icon: ShieldCheck },
];

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ initialOrderId }) => {
  const { 
    getOrderById, 
    myOrders, 
    isMyOrder, 
    verifyAndLinkOrder 
  } = useOrders();

  const { goToCatalog, goToOrders, goToAdmin, showToast } = useStore();

  const isAdmin = isSessionValid();

  // Search state
  const [searchOrderId, setSearchOrderId] = useState(initialOrderId || '');
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    if (initialOrderId?.trim()) return initialOrderId.trim().toUpperCase();
    if (myOrders.length > 0) return myOrders[0].id;
    return '';
  });

  // Verification challenge state (when accessing an order not linked to this device)
  const [challengePhone, setChallengePhone] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Retrieve current order
  const targetOrder = useMemo(() => {
    if (!selectedOrderId) return undefined;
    return getOrderById(selectedOrderId);
  }, [selectedOrderId, getOrderById]);

  // Is this order authorized on this device?
  const isAuthorized = useMemo(() => {
    if (!selectedOrderId) return false;
    if (isAdmin) return true;
    return isMyOrder(selectedOrderId);
  }, [selectedOrderId, isAdmin, isMyOrder]);

  const getStepProgress = (currentStatus?: OrderStatus) => {
    if (!currentStatus) return 1;
    const config = ORDER_STATUS_CONFIG[currentStatus];
    return config ? config.step : 1;
  };

  // Handle phone verification challenge
  const handleChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);

    if (!selectedOrderId) return;
    if (!challengePhone.trim()) {
      setVerificationError('Veuillez renseigner votre numéro de téléphone.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await verifyAndLinkOrder(selectedOrderId, challengePhone.trim());
      if (res.success && res.order) {
        showToast('Identité vérifiée ! Suivi de commande déverrouillé.', 'success');
        setVerificationError(null);
        setChallengePhone('');
      } else {
        setVerificationError(
          res.error || 'Numéro de téléphone incorrect pour cette commande. Accès refusé par mesure de sécurité.'
        );
      }
    } catch {
      setVerificationError('Erreur lors de la vérification. Veuillez réessayer.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle new search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);

    const cleanId = searchOrderId.trim().toUpperCase();
    if (!cleanId) return;

    // If order already belongs to this device or viewer is Admin, direct view
    if (isAdmin || isMyOrder(cleanId)) {
      setSelectedOrderId(cleanId);
      return;
    }

    // Otherwise require phone
    if (!searchPhone.trim()) {
      setSelectedOrderId(cleanId);
      return;
    }

    setIsVerifying(true);
    try {
      const res = await verifyAndLinkOrder(cleanId, searchPhone.trim());
      if (res.success && res.order) {
        setSelectedOrderId(cleanId);
        showToast(`Commande ${cleanId} retrouvée et validée !`, 'success');
      } else {
        setSelectedOrderId(cleanId);
        setVerificationError(
          res.error || 'Numéro de commande ou de téléphone non reconnu.'
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const currentStatusConfig = (targetOrder?.status && ORDER_STATUS_CONFIG[targetOrder.status]) || ORDER_STATUS_CONFIG['transmise'];
  const currentItems = Array.isArray(targetOrder?.items) ? targetOrder.items : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* OWNER ADMIN NOTICE */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-[#141210] to-zinc-900 text-white p-4 rounded-2xl mb-8 shadow-lg border border-amber-500/30 flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-zinc-300">
              <strong className="text-amber-400">Mode Administrateur :</strong> Pour changer le statut ou imprimer le bordereau, utilisez la console de gestion.
            </p>
          </div>
          <button
            onClick={() => goToAdmin('orders')}
            className="px-4 py-2 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Gérer dans l'Admin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200">
        <button
          onClick={goToOrders}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à mes commandes</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Suivi Sécurisé & Confidentiel</span>
          </span>
        </div>
      </div>

      {/* Search Bar for Other Orders */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 shadow-sm mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              placeholder="Numéro de commande (ex: CAPO-2063)"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
            />
          </div>

          {!isAdmin && !isMyOrder(searchOrderId.trim().toUpperCase()) && (
            <input
              type="tel"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Téléphone utilisé (ex: 77 123 45 67)"
              className="sm:w-60 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
            />
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isVerifying ? 'Vérification...' : 'Rechercher mon colis'}
          </button>
        </form>
      </div>

      {/* CASE 1: ORDER EXISTS AND IS AUTHORIZED */}
      {targetOrder && isAuthorized ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Status Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Numéro de Commande
                </span>
                <h2 className="font-mono text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                  {targetOrder.id}
                </h2>
                <span className="text-xs text-zinc-500">
                  {targetOrder.createdAt ? `Passée le ${new Date(targetOrder.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}` : 'Commande récente'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                    currentStatusConfig.badgeClass
                  }`}
                >
                  {targetOrder.status === 'livree' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  )}
                  <span>{targetOrder.status === 'livree' ? 'Colis Livré (Terminé)' : currentStatusConfig.label}</span>
                </span>
              </div>
            </div>

            {/* Stepper Steps (PURE DISPLAY / NON-INTERACTIVE PROGRESS TRACKER) */}
            <div className="pt-8">
              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-zinc-100 -z-0">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${((getStepProgress(targetOrder.status) - 1) / (STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
                  {STEPS.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber <= getStepProgress(targetOrder.status);
                    const isCurrent = stepNumber === getStepProgress(targetOrder.status);
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.status}
                        className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center relative z-10 p-2 text-left sm:text-center"
                      >
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md'
                              : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                          }`}
                        >
                          {isCompleted ? <Icon className="w-5 h-5" /> : stepNumber}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isCurrent ? 'text-zinc-900 font-black' : 'text-zinc-600'}`}>
                            {step.label}
                          </p>
                          {isCurrent ? (
                            <span className={`text-[10px] font-bold uppercase tracking-wider block ${step.status === 'livree' ? 'text-emerald-700 font-black' : 'text-emerald-600'}`}>
                              {step.status === 'livree' ? '✓ Livré' : 'Étape actuelle'}
                            </span>
                          ) : isCompleted ? (
                            <span className="text-[9px] text-emerald-600 font-semibold block">
                              ✓ Validée
                            </span>
                          ) : (
                            <span className="text-[9px] text-zinc-400 font-medium block">
                              À venir
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status explanation */}
              <div className="mt-8 p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs text-zinc-600 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Progression de votre commande : </strong>
                  {currentStatusConfig.description}
                </p>
              </div>
            </div>
          </div>

          {/* Order Details & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Col 1 & 2: Ordered Items */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-zinc-900 pb-2 border-b border-zinc-100">
                Articles dans ce colis ({currentItems.length})
              </h3>

              <div className="space-y-3">
                {currentItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                    <img
                      src={item.image || '/products/pantalon-prince-galles.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-zinc-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {item.size ? `Taille : ${item.size}` : 'Taille Unique'} • Quantité : {item.quantity || 1}
                      </p>
                      <p className="font-bold text-xs text-[#B85D19] mt-1">
                        {formatFCFA((item.price || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-sm">
                <span className="font-semibold text-zinc-600">Total de la commande :</span>
                <span className="font-display font-bold text-base text-zinc-900">
                  {formatFCFA(targetOrder.total || 0)}
                </span>
              </div>
            </div>

            {/* Col 3: Customer & Delivery Info (CONFIDENTIAL) */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-zinc-900">
                  Livraison & Règlement
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono">Protégé</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Destination</span>
                    <strong className="text-zinc-800">
                      {targetOrder.customerCity || 'Dakar'}
                      {isAdmin && targetOrder.customerAddress ? ` (${targetOrder.customerAddress})` : ''}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Mode de règlement</span>
                    <strong className="text-emerald-700">
                      {getPaymentMethodLabel(targetOrder.paymentMethod || 'wave')}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Client</span>
                    <strong className="text-zinc-800">
                      {isAdmin ? targetOrder.customerName : maskCustomerName(targetOrder.customerName)}
                    </strong>
                    <p className="text-zinc-500 font-mono mt-0.5">
                      {isAdmin ? targetOrder.customerPhone : maskPhoneNumber(targetOrder.customerPhone)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <a
                  href={`https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                    `Bonjour CAPOSTORE221,\nJe souhaite des informations sur le suivi de ma commande ${targetOrder.id}. Merci.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Assistance WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : selectedOrderId && !isAuthorized ? (
        /* CASE 2: ACCESS RESTRICTED - PHONE VERIFICATION CHALLENGE REQUIRED */
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-zinc-200 shadow-xl max-w-lg mx-auto text-center animate-fadeIn">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Lock className="w-7 h-7" />
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 mb-2">
            Confidentialité & Sécurité
          </span>

          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-zinc-900 tracking-tight">
            Vérification de Confidentialité
          </h2>

          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Pour des raisons strictes de protection de la vie privée, les détails de la commande <strong className="font-mono text-zinc-800">{selectedOrderId}</strong> ne sont visibles qu'à son acheteur. Veuillez confirmer le numéro de téléphone utilisé lors de votre achat.
          </p>

          <form onSubmit={handleChallengeSubmit} className="mt-6 space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Numéro de commande
              </label>
              <input
                type="text"
                value={selectedOrderId}
                readOnly
                className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl font-mono text-xs font-bold text-zinc-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Numéro de téléphone de la commande *
              </label>
              <input
                type="tel"
                required
                autoFocus
                value={challengePhone}
                onChange={(e) => {
                  setChallengePhone(e.target.value);
                  setVerificationError(null);
                }}
                placeholder="Ex : 77 123 45 67"
                className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
              />
            </div>

            {verificationError && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                {verificationError}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Vérification sécurisée...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Accéder à mon suivi</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-zinc-400 mt-4">
            Une fois validée, la commande sera automatiquement rattachée à cet appareil.
          </p>
        </div>
      ) : (
        /* CASE 3: NO ORDER ENTERED */
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200 shadow-sm">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-zinc-900">
            Saisissez votre numéro de commande pour suivre votre colis
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Entrez votre référence CAPO-XXXX ci-dessus pour consulter en temps réel l'acheminement de vos articles.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => goToCatalog({ category: 'tous' })}
              className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Voir le catalogue
            </button>
            <button
              onClick={goToOrders}
              className="px-5 py-2.5 bg-[#B85D19] text-white rounded-xl text-xs font-semibold hover:bg-[#9E4D12] transition-colors cursor-pointer"
            >
              Mes commandes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
