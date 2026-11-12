import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Sparkles } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import type { OrderStatus } from '../../types';

function getActivityStatusLabel(status: OrderStatus): { text: string; colorClass: string } {
  switch (status) {
    case 'livree':
      return { text: '✅ Vendu & livré', colorClass: 'text-emerald-700' };
    case 'en_livraison':
      return { text: '🚚 En livraison', colorClass: 'text-orange-700' };
    case 'en_preparation':
      return { text: '📦 En préparation', colorClass: 'text-purple-700' };
    case 'confirmee':
      return { text: '✓ Confirmé', colorClass: 'text-blue-700' };
    case 'transmise':
    default:
      return { text: '🛍️ Commandé', colorClass: 'text-emerald-700' };
  }
}

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  if (isNaN(diffMs) || diffMs < 0) return "à l'instant";
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'hier';
  return `il y a ${days} j`;
}

export const LiveActivityBar: React.FC = () => {
  const { publicActivity, soldCounts } = useOrders();
  const { goToProduct, products } = useStore();

  const totalSold = Object.values(soldCounts).reduce((sum, count) => sum + count, 0);
  const recentItems = publicActivity.slice(0, 8);

  if (recentItems.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#FAF8F5] border-b border-[#E7E2D9] py-4 sm:py-5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
              <span>Commandes en direct</span>
              <span className="text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                🔥 {totalSold} article{totalSold > 1 ? 's' : ''} vendu{totalSold > 1 ? 's' : ''}
              </span>
            </h3>
          </div>
          <p className="text-[11px] text-zinc-500">
            Achats validés en ligne par nos clients • Livraison & retrait en boutique
          </p>
        </div>

        {/* Horizontal scrollable strip of recent real purchases */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {recentItems.map((act, idx) => {
            const matchedProduct = products.find((p) => p.id === act.productId);
            const thumb = act.image || matchedProduct?.images?.[0] || '/products/pantalon-prince-galles.jpg';
            const statusInfo = getActivityStatusLabel(act.status);
            const displayTime = formatRelativeTime(act.updatedAt || act.createdAt);

            return (
              <button
                key={`${act.productId}-${act.createdAt}-${idx}`}
                type="button"
                onClick={() => {
                  if (matchedProduct) {
                    goToProduct(matchedProduct.id);
                  }
                }}
                className="flex items-center gap-2.5 bg-white hover:bg-zinc-50 border border-[#E7E2D9] hover:border-[#B85D19] rounded-xl px-3 py-2 shrink-0 text-left transition-all shadow-2xs group cursor-pointer max-w-[270px] sm:max-w-[300px]"
              >
                <img
                  src={thumb}
                  alt={act.productName}
                  className="w-10 h-10 rounded-lg object-cover bg-[#FAF8F5] border border-zinc-200 shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold ${statusInfo.colorClass}`}>
                    <span className="truncate">{statusInfo.text} • {act.city}</span>
                    <span className="text-zinc-400 font-normal shrink-0">• {displayTime}</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-900 truncate group-hover:text-[#B85D19] transition-colors mt-0.5">
                    {act.quantity > 1 ? `${act.quantity}x ` : ''}{act.productName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const LivePurchaseToast: React.FC = () => {
  const { publicActivity } = useOrders();
  const { goToProduct, products, currentView } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const items = publicActivity.slice(0, 10);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsVisible(true);
      }, 350);
    }, 7000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (isDismissed || items.length === 0 || currentView.type === 'admin') {
    return null;
  }

  const current = items[currentIndex % items.length];
  if (!current) return null;

  const matchedProduct = products.find((p) => p.id === current.productId);
  const thumb = current.image || matchedProduct?.images?.[0] || '/products/pantalon-prince-galles.jpg';

  return (
    <div
      className={`fixed bottom-20 lg:bottom-5 left-3 sm:left-5 z-40 max-w-[300px] sm:max-w-xs transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl shadow-xl p-2.5 pr-8 flex items-center gap-3 relative">
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="absolute top-1.5 right-1.5 p-1 text-zinc-400 hover:text-zinc-800 rounded-full"
          aria-label="Fermer la notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (matchedProduct) goToProduct(matchedProduct.id);
          }}
          className="flex items-center gap-2.5 text-left min-w-0 flex-1 cursor-pointer group"
        >
          <div className="relative shrink-0">
            <img
              src={thumb}
              alt={current.productName}
              className="w-11 h-11 rounded-xl object-cover bg-[#FAF8F5] border border-zinc-200"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-2.5 h-2.5" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className={`text-[10px] font-bold flex items-center gap-1 ${getActivityStatusLabel(current.status).colorClass}`}>
              <Sparkles className="w-3 h-3 text-[#B85D19] shrink-0" />
              <span className="truncate">{getActivityStatusLabel(current.status).text} • {current.city}</span>
            </p>
            <p className="text-xs font-bold text-zinc-900 truncate group-hover:text-[#B85D19] transition-colors">
              {current.productName}
            </p>
            <p className="text-[10px] text-zinc-500">
              Mis à jour {formatRelativeTime(current.updatedAt || current.createdAt)}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
