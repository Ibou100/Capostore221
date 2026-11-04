import React from 'react';
import { Home, LayoutGrid, Heart, ShoppingBag, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useOrders } from '../../context/OrderContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, goToHome, goToCatalog, goToWishlist, goToOrders } = useStore();
  const { openCart, totalCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { orders } = useOrders();

  const isHome = currentView.type === 'home';
  const isCatalog = currentView.type === 'catalog';
  const isWishlist = currentView.type === 'wishlist';
  const isOrders = currentView.type === 'orders' || currentView.type === 'tracking';

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 py-1 px-2 flex items-center justify-around lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      {/* 1. Accueil */}
      <button
        onClick={goToHome}
        className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
          isHome ? 'text-[#141210]' : 'text-zinc-400 hover:text-zinc-700'
        }`}
        aria-label="Accueil"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Accueil</span>
      </button>

      {/* 2. Catalogue */}
      <button
        onClick={() => goToCatalog({ category: 'tous' })}
        className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
          isCatalog ? 'text-[#141210]' : 'text-zinc-400 hover:text-zinc-700'
        }`}
        aria-label="Catalogue"
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Boutique</span>
      </button>

      {/* 3. Commandes & Suivi */}
      <button
        onClick={goToOrders}
        className={`relative flex flex-col items-center justify-center p-1.5 transition-colors ${
          isOrders ? 'text-[#B85D19]' : 'text-zinc-400 hover:text-zinc-700'
        }`}
        aria-label="Mes Commandes"
      >
        <Package className="w-5 h-5" />
        {orders.length > 0 && (
          <span className="absolute top-0 right-1 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
            {orders.length}
          </span>
        )}
        <span className="text-[10px] font-medium mt-0.5">Commandes</span>
      </button>

      {/* 4. Favoris */}
      <button
        onClick={goToWishlist}
        className={`relative flex flex-col items-center justify-center p-1.5 transition-colors ${
          isWishlist ? 'text-[#141210]' : 'text-zinc-400 hover:text-zinc-700'
        }`}
        aria-label="Favoris"
      >
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[#141210] text-white text-[9px] font-bold flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
        <span className="text-[10px] font-medium mt-0.5">Favoris</span>
      </button>

      {/* 5. Panier */}
      <button
        onClick={openCart}
        className="relative flex flex-col items-center justify-center p-1.5 text-zinc-400 hover:text-zinc-700 transition-colors"
        aria-label="Panier"
      >
        <ShoppingBag className="w-5 h-5" />
        {totalCount > 0 && (
          <span className="absolute top-0 right-1 min-w-4 h-4 px-1 rounded-full bg-[#B85D19] text-white text-[9px] font-bold flex items-center justify-center">
            {totalCount}
          </span>
        )}
        <span className="text-[10px] font-medium mt-0.5">Panier</span>
      </button>
    </div>
  );
};
