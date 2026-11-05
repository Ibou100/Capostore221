import React from 'react';
import { Home, LayoutGrid, Heart, ShoppingBag, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useOrders } from '../../context/OrderContext';
import { isSessionValid } from '../../utils/security';

export const MobileBottomNav: React.FC = () => {
  const { currentView, goToHome, goToCatalog, goToWishlist, goToOrders } = useStore();
  const { openCart, totalCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { orders, myOrders } = useOrders();
  const isAdmin = isSessionValid();
  // Notification badge only counts orders pending action (not delivered ones)
  const pendingOrdersCount = orders.filter((o) => o.status !== 'livree').length;
  const pendingMyOrdersCount = myOrders.filter((o) => o.status !== 'livree').length;
  const orderBadgeCount = isAdmin ? pendingOrdersCount : pendingMyOrdersCount;

  const isHome = currentView.type === 'home';
  const isCatalog = currentView.type === 'catalog';
  const isWishlist = currentView.type === 'wishlist';
  const isOrders = currentView.type === 'orders' || currentView.type === 'tracking';

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-stone-200/80 py-1.5 px-3 flex items-center justify-around lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      {/* 1. Accueil */}
      <button
        onClick={goToHome}
        className={`flex flex-col items-center justify-center p-1 transition-all ${
          isHome ? 'text-[#0C0A09]' : 'text-stone-400 hover:text-stone-700'
        }`}
        aria-label="Accueil"
      >
        <Home className={`w-5 h-5 transition-transform ${isHome ? 'scale-110' : ''}`} />
        <span className={`text-[10px] tracking-wider mt-0.5 ${isHome ? 'font-black text-[#0C0A09]' : 'font-medium'}`}>Accueil</span>
      </button>

      {/* 2. Catalogue */}
      <button
        onClick={() => goToCatalog({ category: 'tous' })}
        className={`flex flex-col items-center justify-center p-1 transition-all ${
          isCatalog ? 'text-[#0C0A09]' : 'text-stone-400 hover:text-stone-700'
        }`}
        aria-label="Catalogue"
      >
        <LayoutGrid className={`w-5 h-5 transition-transform ${isCatalog ? 'scale-110' : ''}`} />
        <span className={`text-[10px] tracking-wider mt-0.5 ${isCatalog ? 'font-black text-[#0C0A09]' : 'font-medium'}`}>Boutique</span>
      </button>

      {/* 3. Commandes & Suivi */}
      <button
        onClick={goToOrders}
        className={`relative flex flex-col items-center justify-center p-1 transition-all ${
          isOrders ? 'text-[#B85D19]' : 'text-stone-400 hover:text-stone-700'
        }`}
        aria-label="Mes Commandes"
      >
        <Package className={`w-5 h-5 transition-transform ${isOrders ? 'scale-110' : ''}`} />
        {orderBadgeCount > 0 && (
          <span className="absolute top-0 right-1 min-w-4 h-4 px-1 rounded-full bg-[#B85D19] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
            {orderBadgeCount}
          </span>
        )}
        <span className={`text-[10px] tracking-wider mt-0.5 ${isOrders ? 'font-black text-[#B85D19]' : 'font-medium'}`}>Commandes</span>
      </button>

      {/* 4. Favoris */}
      <button
        onClick={goToWishlist}
        className={`relative flex flex-col items-center justify-center p-1 transition-all ${
          isWishlist ? 'text-[#0C0A09]' : 'text-stone-400 hover:text-stone-700'
        }`}
        aria-label="Favoris"
      >
        <Heart className={`w-5 h-5 transition-transform ${isWishlist ? 'scale-110 fill-[#B85D19] text-[#B85D19]' : ''}`} />
        {wishlistCount > 0 && (
          <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[#0C0A09] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
            {wishlistCount}
          </span>
        )}
        <span className={`text-[10px] tracking-wider mt-0.5 ${isWishlist ? 'font-black text-[#0C0A09]' : 'font-medium'}`}>Favoris</span>
      </button>

      {/* 5. Panier */}
      <button
        onClick={openCart}
        className="relative flex flex-col items-center justify-center p-1 text-stone-700 hover:text-stone-900 transition-all"
        aria-label="Panier"
      >
        <ShoppingBag className="w-5 h-5" />
        {totalCount > 0 && (
          <span className="absolute top-0 right-1 min-w-4 h-4 px-1 rounded-full bg-[#B85D19] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
            {totalCount}
          </span>
        )}
        <span className="text-[10px] font-bold tracking-wider mt-0.5">Panier</span>
      </button>
    </div>
  );
};
