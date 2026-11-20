import React from 'react';
import { Home, LayoutGrid, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, goToHome, goToCatalog, goToWishlist } = useStore();
  const { openCart, totalCount } = useCart();
  const { wishlistCount } = useWishlist();

  if (currentView.type === 'admin') return null;

  const isHome = currentView.type === 'home';
  const isCatalog = currentView.type === 'catalog';
  const isWishlist = currentView.type === 'wishlist';

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E6E1] py-1.5 px-2 flex items-center justify-around lg:hidden"
    >
      <button
        type="button"
        onClick={goToHome}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
          isHome ? 'text-[#0A0A0A]' : 'text-[#5F5F5A]'
        }`}
        aria-label="Accueil"
      >
        <Home className="w-5 h-5" strokeWidth={1.75} />
        <span className="text-[11px] font-medium mt-0.5">Accueil</span>
      </button>

      <button
        type="button"
        onClick={() => goToCatalog({ category: 'tous' })}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
          isCatalog ? 'text-[#0A0A0A]' : 'text-[#5F5F5A]'
        }`}
        aria-label="Catalogue"
      >
        <LayoutGrid className="w-5 h-5" strokeWidth={1.75} />
        <span className="text-[11px] font-medium mt-0.5">Catalogue</span>
      </button>

      <button
        type="button"
        onClick={goToWishlist}
        className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
          isWishlist ? 'text-[#0A0A0A]' : 'text-[#5F5F5A]'
        }`}
        aria-label="Favoris"
      >
        <Heart className="w-5 h-5" strokeWidth={1.75} />
        {wishlistCount > 0 && (
          <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-[#0A0A0A] text-white text-[9px] font-semibold flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
        <span className="text-[11px] font-medium mt-0.5">Favoris</span>
      </button>

      <button
        type="button"
        onClick={openCart}
        className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[#5F5F5A] hover:text-[#0A0A0A] transition-colors"
        aria-label="Panier"
      >
        <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
        {totalCount > 0 && (
          <span className="absolute top-0.5 right-2 min-w-4 h-4 px-1 rounded-full bg-[#C2410C] text-white text-[9px] font-semibold flex items-center justify-center">
            {totalCount}
          </span>
        )}
        <span className="text-[11px] font-medium mt-0.5">Panier</span>
      </button>
    </nav>
  );
};
