import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import type { CategoryId } from '../../types';

export const Navbar: React.FC = () => {
  const { totalCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { goToHome, goToCatalog, goToWishlist, openSearch, currentView } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; category?: CategoryId; isSpecial?: boolean; filterType?: 'newest' | 'all' }[] = [
    { label: 'Accueil' },
    { label: 'Nouveautés', filterType: 'newest' },
    { label: 'Vêtements', category: 'vetements' },
    { label: 'Lunettes', category: 'lunettes' },
    { label: 'Chaussures', category: 'chaussures' },
    { label: 'Accessoires', category: 'accessoires' },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false);
    if (!link.category && !link.filterType) {
      goToHome();
    } else if (link.filterType === 'newest') {
      goToCatalog({ category: 'tous' });
    } else if (link.category) {
      goToCatalog({ category: link.category });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-200/80 py-3.5'
          : 'bg-white border-b border-zinc-200/60 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile hamburger menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-capo-black hover:text-zinc-600 transition-colors focus:outline-none"
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={openSearch}
              className="p-2 text-capo-black hover:text-zinc-600 transition-colors focus:outline-none ml-1"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center justify-center lg:justify-start">
            <button
              onClick={goToHome}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
              aria-label="CAPO221 - Accueil"
            >
              {/* Minimalist Monogram icon */}
              <div className="w-8 h-8 rounded-lg bg-capo-black flex items-center justify-center text-white font-display font-bold text-sm tracking-tighter group-hover:scale-105 transition-transform duration-200">
                <span className="text-white">C</span>
                <span className="text-capo-accent text-[10px] font-mono ml-0.5">221</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold tracking-tightest text-xl sm:text-2xl text-capo-black leading-none">
                  CAPO<span className="text-zinc-400 font-light tracking-normal text-lg ml-0.5">221</span>
                </span>
                <span className="text-[9px] tracking-widest uppercase text-zinc-500 font-medium">
                  Maison de Mode • Dakar
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive =
                (!link.category && !link.filterType && currentView.type === 'home') ||
                (currentView.type === 'catalog' &&
                  link.category &&
                  (currentView as any).initialCategory === link.category);

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`text-sm font-medium tracking-wide uppercase transition-all duration-200 relative py-1 ${
                    isActive
                      ? 'text-capo-black font-semibold'
                      : 'text-zinc-600 hover:text-capo-black'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-capo-black rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Desktop Search Button */}
            <button
              onClick={openSearch}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200/80 transition-colors focus:outline-none border border-zinc-200"
              aria-label="Rechercher des pièces"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-500">Rechercher...</span>
              <kbd className="hidden xl:inline text-[10px] bg-white px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-200">
                ⌘K
              </kbd>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={goToWishlist}
              className="relative p-2 text-capo-black hover:text-zinc-600 transition-colors focus:outline-none"
              aria-label="Voir mes favoris"
            >
              <Heart className="w-5 h-5 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-capo-black text-white text-[9px] font-bold flex items-center justify-center animate-scale">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-capo-black hover:text-zinc-600 transition-colors focus:outline-none group"
              aria-label={`Panier (${totalCount} articles)`}
            >
              <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5 transition-transform group-hover:scale-105" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 rounded-full bg-capo-black text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl flex flex-col justify-between z-50 p-6 animate-drawer">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-capo-black flex items-center justify-center text-white font-bold text-xs">
                    C<span className="text-capo-accent text-[9px]">221</span>
                  </div>
                  <span className="font-display font-extrabold text-lg tracking-tight">CAPO221</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-zinc-500 hover:text-capo-black hover:bg-zinc-100"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation list */}
              <nav className="mt-6 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className="w-full flex items-center justify-between py-3 px-3 text-left font-display font-medium text-base text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-capo-black transition-colors" />
                  </button>
                ))}
              </nav>

              {/* Quick links */}
              <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    goToWishlist();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:text-black"
                >
                  <Heart className="w-4 h-4" />
                  <span>Mes Favoris ({wishlistCount})</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openCart();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:text-black"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Mon Panier ({totalCount})</span>
                </button>
              </div>
            </div>

            {/* Mobile drawer footer */}
            <div className="pt-6 border-t border-zinc-100 text-xs text-zinc-500">
              <p className="font-semibold text-zinc-800 uppercase tracking-wider mb-1">Maison CAPO221</p>
              <p>Dakar, Sénégal • Service Client 7j/7</p>
              <p className="mt-2 text-zinc-400">Devise : FCFA (XOF)</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
