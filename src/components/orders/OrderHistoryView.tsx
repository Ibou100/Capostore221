import React from 'react';
import { Package, MessageCircle, ShoppingBag, Eye } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import { 
  formatFCFA, 
  ORDER_STATUS_CONFIG, 
  getPaymentMethodLabel, 
  STORE_WHATSAPP_PHONE 
} from '../../utils/format';

export const OrderHistoryView: React.FC = () => {
  const { orders } = useOrders();
  const { goToCatalog, goToTracking } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Espace Client
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
            Historique de vos commandes
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Retrouvez tous vos achats enregistrés sur CAPOSTORE221 et suivez l'avancement de vos livraisons.
          </p>
        </div>

        <button
          onClick={() => goToCatalog({ category: 'tous' })}
          className="self-start sm:self-auto px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Continuer mes achats</span>
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200 shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-lg text-zinc-900">
            Aucune commande enregistrée pour le moment
          </h2>
          <p className="text-xs text-zinc-500 mt-1.5 max-w-sm mx-auto">
            Dès que vous validez une commande via WhatsApp ou via le panier, elle apparaîtra ici avec son numéro de suivi pour suivre votre colis.
          </p>
          <div className="mt-6">
            <button
              onClick={() => goToCatalog({ category: 'tous' })}
              className="px-6 py-3 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
            >
              Découvrir la collection
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = ORDER_STATUS_CONFIG[order.status];

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
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.badgeClass}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Items */}
                  <div className="divide-y divide-zinc-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs text-zinc-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {item.size ? `Taille : ${item.size}` : 'Taille Unique'} • Qté : {item.quantity}
                          </p>
                          <p className="font-bold text-xs text-[#B85D19] mt-0.5">
                            {formatFCFA(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Bar */}
                  <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-zinc-500">
                        Paiement : <strong className="text-zinc-800">{getPaymentMethodLabel(order.paymentMethod)}</strong>
                      </p>
                      <p className="text-zinc-500">
                        Livraison : <strong className="text-zinc-800">{order.customerCity}</strong> ({order.customerAddress})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-zinc-400 block">Total payé</span>
                      <span className="font-display font-black text-base text-zinc-900">
                        {formatFCFA(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-end gap-2.5">
                    <button
                      onClick={() => goToTracking(order.id)}
                      className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
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
        </div>
      )}
    </div>
  );
};
