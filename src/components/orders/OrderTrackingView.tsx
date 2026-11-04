import React, { useState } from 'react';
import { 
  Package, Search, CheckCircle2, Clock, Truck, 
  MapPin, Phone, CreditCard, MessageCircle, ArrowLeft,
  AlertCircle, ShieldCheck, Lock, KeyRound, X
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import { 
  formatFCFA, 
  ORDER_STATUS_CONFIG, 
  getPaymentMethodLabel, 
  STORE_WHATSAPP_PHONE 
} from '../../utils/format';
import { isSessionValid, verifyOwnerPassword } from '../../utils/security';
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
  const { getOrderById, orders, updateOrderStatus } = useOrders();
  const { goToHome, goToCatalog, goToOrders, goToAdmin, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [searchedId, setSearchedId] = useState(initialOrderId || '');

  // Admin In-Place Modification State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isSessionValid());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

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

  const getStepProgress = (currentStatus?: OrderStatus) => {
    if (!currentStatus) return 1;
    const config = ORDER_STATUS_CONFIG[currentStatus];
    return config ? config.step : 1;
  };

  const handleStepClick = (status: OrderStatus) => {
    if (!currentOrder) return;

    if (isAdmin) {
      updateOrderStatus(currentOrder.id, status);
      const label = ORDER_STATUS_CONFIG[status]?.label || status;
      showToast(`Statut de la commande ${currentOrder.id} mis à jour : ${label}`, 'success');
    } else {
      setPendingStatus(status);
      setAuthPassword('');
      setAuthError(null);
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPassword.trim()) {
      setAuthError('Veuillez entrer le mot de passe propriétaire.');
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const res = await verifyOwnerPassword(authPassword);
      if (res.success) {
        setIsAdmin(true);
        setIsAuthModalOpen(false);
        if (currentOrder && pendingStatus) {
          updateOrderStatus(currentOrder.id, pendingStatus);
          const label = ORDER_STATUS_CONFIG[pendingStatus]?.label || pendingStatus;
          showToast(`Accès validé ! Statut passé à : ${label}`, 'success');
        } else {
          showToast('Mode propriétaire activé avec succès !', 'success');
        }
      } else {
        setAuthError(res.error || 'Mot de passe propriétaire incorrect.');
      }
    } catch {
      setAuthError('Erreur de validation.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const currentStatusConfig = (currentOrder?.status && ORDER_STATUS_CONFIG[currentOrder.status]) || ORDER_STATUS_CONFIG['transmise'];
  const currentItems = Array.isArray(currentOrder?.items) ? currentOrder.items : [];

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
            Saisissez votre numéro de commande reçu lors de votre validation (ex: <strong className="text-zinc-200 font-mono">CAPO-8924</strong>) pour suivre son acheminement en temps réel.
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
              placeholder="Ex: CAPO-8924"
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

          {/* Stepper Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-sm">
            
            {/* Owner banner */}
            {isAdmin ? (
              <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>👑 Mode Propriétaire Actif : Cliquez sur n'importe quelle étape (1 à 5) ci-dessous pour changer le statut en 1 clic !</span>
                </div>
                <button
                  onClick={goToAdmin}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shrink-0 transition-colors"
                >
                  Console Admin →
                </button>
              </div>
            ) : (
              <div className="mb-6 p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between text-xs text-zinc-600">
                <span>Vous êtes le propriétaire du site ? Cliquez sur une étape pour modifier le statut du colis.</span>
                <button
                  onClick={() => {
                    setPendingStatus(null);
                    setAuthPassword('');
                    setAuthError(null);
                    setIsAuthModalOpen(true);
                  }}
                  className="font-bold text-[#B85D19] hover:underline flex items-center gap-1 shrink-0 ml-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Activer la gestion</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Numéro de Commande
                </span>
                <h2 className="font-mono text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                  {currentOrder.id}
                </h2>
                <span className="text-xs text-zinc-500">
                  {currentOrder.createdAt ? `Passée le ${new Date(currentOrder.createdAt).toLocaleDateString('fr-FR', {
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
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {currentStatusConfig.label}
                </span>
              </div>
            </div>

            {/* Stepper Steps (NOW FULLY CLICKABLE BY ADMIN/OWNER) */}
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
                      <button
                        type="button"
                        key={step.status}
                        onClick={() => handleStepClick(step.status)}
                        className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center relative z-10 group cursor-pointer p-2 rounded-2xl hover:bg-zinc-50 transition-all text-left sm:text-center"
                        title={`Cliquer pour définir le statut sur "${step.label}"`}
                      >
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all group-hover:scale-110 ${
                            isCompleted
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md'
                              : 'bg-zinc-100 text-zinc-400 border border-zinc-200 group-hover:border-[#B85D19] group-hover:text-zinc-700'
                          }`}
                        >
                          {isCompleted ? <Icon className="w-5 h-5" /> : stepNumber}
                        </div>
                        <div>
                          <p className={`text-xs font-bold transition-colors ${isCurrent ? 'text-zinc-900 font-black' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                            {step.label}
                          </p>
                          {isCurrent ? (
                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
                              Étape actuelle
                            </span>
                          ) : (
                            <span className="text-[9px] text-zinc-400 group-hover:text-[#B85D19] font-medium block">
                              {isAdmin ? 'Cliquer pour activer' : 'Modifier le statut'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status explanation */}
              <div className="mt-8 p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs text-zinc-600 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Explication du statut : </strong>
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
                  {formatFCFA(currentOrder.total || 0)}
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
                  <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Lieu de livraison</span>
                    <strong className="text-zinc-800">{currentOrder.customerCity || 'Dakar'}</strong>
                    <p className="text-zinc-500 mt-0.5">{currentOrder.customerAddress || 'Adresse client'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Mode de règlement</span>
                    <strong className="text-emerald-700">
                      {getPaymentMethodLabel(currentOrder.paymentMethod || 'wave')}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold">Client</span>
                    <strong className="text-zinc-800">{currentOrder.customerName}</strong>
                    <p className="text-zinc-500 font-mono mt-0.5">{currentOrder.customerPhone}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <a
                  href={`https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                    `Bonjour CAPOSTORE221,\nJe souhaite des informations sur le suivi de ma commande ${currentOrder.id}. Merci.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Assistance WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200 shadow-sm">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-zinc-900">
            {searchedId ? `Aucune commande trouvée pour "${searchedId}"` : 'Aucune commande enregistrée'}
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Vérifiez l'identifiant saisi ou consultez l'historique complet de vos commandes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => goToCatalog({ category: 'tous' })}
              className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors"
            >
              Voir le catalogue
            </button>
            <button
              onClick={goToOrders}
              className="px-5 py-2.5 bg-[#B85D19] text-white rounded-xl text-xs font-semibold hover:bg-[#9E4D12] transition-colors"
            >
              Toutes mes commandes
            </button>
          </div>
        </div>
      )}

      {/* ADMIN AUTH MODAL (Allows the owner to authenticate right from the tracking page) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141210] text-white w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Accès Propriétaire
                </h3>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Entrez le mot de passe administrateur pour modifier le statut du colis en direct.
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="password"
                required
                autoFocus
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Mot de passe propriétaire"
                className="w-full text-xs px-3.5 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
              />

              {authError && (
                <p className="text-xs text-red-400 bg-red-950/30 p-2.5 rounded-lg border border-red-500/30">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {isAuthenticating ? 'Vérification...' : 'Valider et Changer le statut'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
