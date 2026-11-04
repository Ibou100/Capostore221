import React, { useState } from 'react';
import { 
  Package, Search, CheckCircle2, Clock, Truck, 
  MapPin, Phone, CreditCard, MessageCircle, ArrowLeft,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import { 
  formatFCFA, 
  ORDER_STATUS_CONFIG, 
  getPaymentMethodLabel, 
  STORE_WHATSAPP_PHONE 
} from '../../utils/format';
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
  const { getOrderById, orders } = useOrders();
  const { goToHome, goToCatalog, goToOrders } = useStore();

  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [searchedId, setSearchedId] = useState(initialOrderId || '');

  const currentOrder = React.useMemo(() => {
    const id = searchedId.trim() || initialOrderId?.trim();
    if (id) {
      return getOrderById(id);
    }
    return orders.length > 0 ? orders[0] : undefined;
  }, [searchedId, initialOrderId, getOrderById, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchedId(searchQuery.trim());
  };

  const getStepProgress = (currentStatus: OrderStatus) => {
    const config = ORDER_STATUS_CONFIG[currentStatus];
    return config ? config.step : 1;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
        <button
          onClick={goToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </button>
        <button
          onClick={goToOrders}
          className="text-xs font-semibold text-[#B85D19] hover:underline"
        >
          Voir toutes mes commandes ({orders.length})
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-[#141210] text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-[11px] font-mono tracking-wider uppercase mb-3">
            <Package className="w-3.5 h-3.5" />
            <span>Suivi de Colis & Acheminement</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
            Où en est votre colis CAPOSTORE221 ?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
            Saisissez votre numéro de commande reçu lors de votre validation (ex: <strong className="text-zinc-200 font-mono">CAPO-8472</strong>) pour suivre son acheminement en temps réel.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: CAPO-8472"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-zinc-400 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#B85D19] focus:bg-white/15"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0 shadow-md"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Result Section */}
      {currentOrder ? (
        <div className="space-y-6">
          {/* Status Progress Stepper */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Numéro de Commande
                </span>
                <h2 className="font-mono text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                  {currentOrder.id}
                </h2>
                <span className="text-xs text-zinc-500">
                  Passée le {new Date(currentOrder.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                    ORDER_STATUS_CONFIG[currentOrder.status].badgeClass
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {ORDER_STATUS_CONFIG[currentOrder.status].label}
                </span>
              </div>
            </div>

            {/* Stepper Steps */}
            <div className="pt-8">
              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-zinc-100 -z-0">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${((getStepProgress(currentOrder.status) - 1) / (STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
                  {STEPS.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber <= getStepProgress(currentOrder.status);
                    const isCurrent = stepNumber === getStepProgress(currentOrder.status);
                    const Icon = step.icon;

                    return (
                      <div key={step.status} className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-sm'
                              : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                          }`}
                        >
                          {isCompleted ? <Icon className="w-5 h-5" /> : stepNumber}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isCurrent ? 'text-zinc-900' : 'text-zinc-500'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block">
                              Étape actuelle
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
                  <strong>Statut : </strong>
                  {ORDER_STATUS_CONFIG[currentOrder.status].description}
                </p>
              </div>
            </div>
          </div>

          {/* Order Details & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Col 1 & 2: Ordered Items */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-zinc-900 pb-2 border-b border-zinc-100">
                Articles dans ce colis ({currentOrder.items.length})
              </h3>

              <div className="space-y-3">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-zinc-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {item.size ? `Taille : ${item.size}` : 'Taille Unique'} • Quantité : {item.quantity}
                      </p>
                      <p className="font-bold text-xs text-[#B85D19] mt-1">
                        {formatFCFA(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-sm">
                <span className="font-semibold text-zinc-600">Total de la commande :</span>
                <span className="font-display font-bold text-base text-zinc-900">
                  {formatFCFA(currentOrder.total)}
                </span>
              </div>
            </div>

            {/* Col 3: Customer & Delivery Info */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-zinc-900 pb-2 border-b border-zinc-100">
                Coordonnées & Paiement
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-700 block">Lieu de livraison</span>
                    <span className="text-zinc-600 block">{currentOrder.customerCity}</span>
                    <span className="text-zinc-500 text-[11px] block">{currentOrder.customerAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-700 block">Téléphone du destinataire</span>
                    <span className="text-zinc-600 font-mono">{currentOrder.customerPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-700 block">Mode de paiement</span>
                    <span className="text-emerald-700 font-semibold block">
                      {getPaymentMethodLabel(currentOrder.paymentMethod)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Contact Button for this order */}
              <div className="pt-4 border-t border-zinc-100">
                <a
                  href={`https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                    `Bonjour CAPOSTORE221,\nJe vous contacte concernant le suivi de ma commande ${currentOrder.id}.\nPouvez-vous me donner des précisions sur la livraison ?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Assistance WhatsApp pour ce colis</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      ) : searchQuery ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-zinc-200">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-zinc-900">
            Aucune commande trouvée pour « {searchQuery} »
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Vérifiez le numéro saisi ou consultez votre historique de commandes ci-dessous.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={goToOrders}
              className="px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors"
            >
              Voir mes commandes
            </button>
            <button
              onClick={() => goToCatalog({ category: 'tous' })}
              className="px-4 py-2 bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Découvrir la boutique
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-zinc-200">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-zinc-900">
            Entrez votre numéro de commande
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Le numéro au format CAPO-XXXX vous a été transmis dès la validation de votre commande.
          </p>
        </div>
      )}
    </div>
  );
};
