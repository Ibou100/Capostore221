import React, { useState } from 'react';
import { Package, MessageCircle, ShoppingBag, Eye, Search, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import { isSessionValid } from '../../utils/security';
import { 
  formatFCFA, 
  ORDER_STATUS_CONFIG, 
  getPaymentMethodLabel, 
  STORE_WHATSAPP_PHONE,
  maskPhoneNumber,
  maskCustomerName 
} from '../../utils/format';

export const OrderHistoryView: React.FC = () => {
  const { myOrders, verifyAndLinkOrder } = useOrders();
  const { goToCatalog, goToTracking, goToAdmin, showToast } = useStore();

  const isAdmin = isSessionValid();

  // Dual-credential lookup for guest or multi-device tracking
  const [lookupId, setLookupId] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);

    const cleanId = lookupId.trim().toUpperCase();
    const cleanPhone = lookupPhone.trim();

    if (!cleanId) {
      setLookupError('Veuillez renseigner votre numéro de commande (ex: CAPO-2063).');
      return;
    }
    if (!cleanPhone) {
      setLookupError('Veuillez renseigner votre numéro de téléphone pour vérifier votre identité.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await verifyAndLinkOrder(cleanId, cleanPhone);
      if (res.success && res.order) {
        showToast(`Commande ${res.order.id} retrouvée avec succès !`, 'success');
        setLookupId('');
        setLookupPhone('');
        goToTracking(res.order.id);
      } else {
        setLookupError(
          res.error || 'Numéro de commande ou de téléphone non reconnu. Vérifiez les informations reçues sur WhatsApp.'
        );
      }
    } catch {
      setLookupError('Erreur de vérification. Veuillez réessayer.');
    } finally {
      setIsVerifying(false);
    }
  };

  // STRICT PRIVACY: This view displays ONLY orders placed on THIS device.
  // All global store management belongs exclusively to the Admin console.
  const displayedOrders = myOrders;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* OWNER ADMIN QUICK ACCESS BANNER */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-[#141210] to-zinc-900 text-white p-4 sm:p-5 rounded-2xl mb-8 shadow-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Session Propriétaire Active
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                Pour piloter toutes les commandes de la boutique et modifier les statuts, accédez à votre console sécurisée.
              </p>
            </div>
          </div>

          <button
            onClick={() => goToAdmin('orders')}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Console Admin Commandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Espace Client Privé & Confidentiel
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3" /> Données protégées
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
            Historique de vos commandes
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Vos achats sont strictement confidentiels : seul vous sur cet appareil et le gérant CAPOSTORE221 pouvez voir vos commandes.
          </p>
        </div>

        <button
          onClick={() => goToCatalog({ category: 'tous' })}
          className="self-start sm:self-auto px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Continuer mes achats</span>
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-zinc-200 shadow-sm">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="font-display font-bold text-lg text-zinc-900">
              Aucune commande passée sur cet appareil pour le moment
            </h2>
            <p className="text-xs text-zinc-500 mt-1.5 max-w-md mx-auto">
              Par mesure de stricte confidentialité, seules les commandes passées par vous sur cet appareil s'affichent ici.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => goToCatalog({ category: 'tous' })}
                className="px-6 py-3 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Découvrir la collection
              </button>
            </div>
          </div>

          {/* Secure Lookup Box: Requires both Order ID and Phone Number */}
          <div className="bg-zinc-50 rounded-2xl p-6 sm:p-8 border border-zinc-200">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <h3 className="font-display font-bold text-sm text-zinc-900">
                Vous avez commandé depuis un autre téléphone ou via WhatsApp ?
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Pour des raisons de stricte confidentialité, indiquez votre référence unique et votre numéro de téléphone pour rattacher votre commande en toute sécurité.
            </p>

            <form onSubmit={handleLookupSubmit} className="space-y-3 max-w-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Numéro de commande *
                  </label>
                  <input
                    type="text"
                    value={lookupId}
                    onChange={(e) => {
                      setLookupId(e.target.value);
                      setLookupError(null);
                    }}
                    placeholder="Ex: CAPO-2063"
                    className="w-full px-3.5 py-2.5 text-xs font-mono uppercase bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Téléphone de la commande *
                  </label>
                  <input
                    type="tel"
                    value={lookupPhone}
                    onChange={(e) => {
                      setLookupPhone(e.target.value);
                      setLookupError(null);
                    }}
                    placeholder="Ex: 77 123 45 67"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>Vérification sécurisée...</span>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Retrouver et rattacher ma commande</span>
                  </>
                )}
              </button>
            </form>

            {lookupError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 mt-3">
                {lookupError}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedOrders.map((order) => {
            const statusConfig = (order.status && ORDER_STATUS_CONFIG[order.status]) || {
              label: 'Transmise',
              badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
              color: '#666',
              step: 1,
            };

            const items = Array.isArray(order.items) ? order.items : [];
            const displayDate = order.createdAt ? (() => {
              try {
                return new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
              } catch {
                return 'Date récente';
              }
            })() : 'Date récente';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="bg-zinc-50 px-5 py-4 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-zinc-900 bg-white px-2.5 py-1 rounded-md border border-zinc-200 shadow-2xs">
                      {order.id}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {displayDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.badgeClass}`}
                    >
                      {order.status === 'livree' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                      <span>{order.status === 'livree' ? 'Colis Livré (Terminé)' : statusConfig.label}</span>
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Items */}
                  <div className="divide-y divide-zinc-100">
                    {items.map((item, idx) => (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3.5">
                        <img
                          src={item.image || '/products/pantalon-prince-galles.jpg'}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs text-zinc-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {item.size ? `Taille : ${item.size}` : 'Taille Unique'} • Qté : {item.quantity || 1}
                          </p>
                          <p className="font-bold text-xs text-[#B85D19] mt-0.5">
                            {formatFCFA((item.price || 0) * (item.quantity || 1))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Bar */}
                  <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-zinc-500">
                        Destinataire : <strong className="text-zinc-800">{maskCustomerName(order.customerName)}</strong> ({maskPhoneNumber(order.customerPhone)})
                      </p>
                      <p className="text-zinc-500">
                        Paiement : <strong className="text-zinc-800">{getPaymentMethodLabel(order.paymentMethod || 'wave')}</strong> • Destination : <strong className="text-zinc-800">{order.customerCity || 'Dakar'}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-zinc-400 block">Total</span>
                      <span className="font-display font-black text-base text-zinc-900">
                        {formatFCFA(order.total || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-end gap-2.5">
                    <button
                      onClick={() => goToTracking(order.id)}
                      className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Suivre ce colis</span>
                    </button>

                    <a
                      href={`https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent(
                        `Bonjour CAPOSTORE221,\nJ'aimerais avoir des nouvelles de ma commande ${order.id}. Merci !`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Message WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Secure Secondary Lookup Box for other devices */}
          <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-zinc-500" />
              <span className="font-bold text-zinc-700">
                Vous avez passé une autre commande sur un autre appareil ?
              </span>
            </div>
            <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="text"
                value={lookupId}
                onChange={(e) => {
                  setLookupId(e.target.value);
                  setLookupError(null);
                }}
                placeholder="N° CAPO-XXXX"
                className="px-3 py-2 text-xs font-mono uppercase bg-white border border-zinc-300 rounded-lg focus:outline-none"
              />
              <input
                type="tel"
                value={lookupPhone}
                onChange={(e) => {
                  setLookupPhone(e.target.value);
                  setLookupError(null);
                }}
                placeholder="Téléphone associé"
                className="px-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-black shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Vérification...' : 'Rattacher'}
              </button>
            </form>
            {lookupError && (
              <p className="text-xs text-red-600 mt-2">
                {lookupError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
