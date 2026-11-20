import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import {
  STORE_WHATSAPP_PHONE,
  STORE_CALL_PHONE,
  STORE_PHONE_WHATSAPP_DISPLAY,
  STORE_PHONE_CALL_DISPLAY,
} from '../../utils/format';
import type { CategoryId } from '../../types';

export const Navbar: React.FC = () => {
  const { totalCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const {
    goToHome,
    goToCatalog,
    goToWishlist,
    openSearch,
    currentView,
    activeStore,
    hasEnteredStore,
    switchStore,
  } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminView = currentView.type === 'admin';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !isAdminView &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminView, openSearch]);

  const navLinks: { label: string; category?: CategoryId; filterType?: 'all' }[] =
    activeStore === 'electronique'
      ? [
          { label: 'Smartphones', category: 'smartphones' },
          { label: 'Ordinateurs', category: 'ordinateurs' },
          { label: 'Tablettes & montres', category: 'tablettes_montres' },
          { label: 'Audio', category: 'audio_tech' },
          { label: 'Accessoires', category: 'accessoires_tech' },
        ]
      : [
          { label: 'Nouveautés', filterType: 'all' },
          { label: 'Vêtements', category: 'vetements' },
          { label: 'Chaussures', category: 'chaussures' },
          { label: 'Parfums', category: 'parfums' },
          { label: 'Lunettes', category: 'lunettes' },
          { label: 'Accessoires', category: 'accessoires' },
        ];

  const handleNavClick = (link: (typeof navLinks)[0]) => {
    setIsMobileMenuOpen(false);
    if (link.filterType === 'all') {
      goToCatalog({ category: 'tous' });
    } else if (link.category) {
      goToCatalog({ category: link.category });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-[#E8E6E1] py-3'
          : 'bg-white py-3.5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <button
            type="button"
            onClick={goToHome}
            className="flex items-center gap-2.5 text-left group shrink-0 min-h-[44px]"
            aria-label="CAPOSTORE221 - Accueil"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center text-white font-display font-bold text-xs tracking-tight transition-transform duration-150 group-hover:scale-105">
              CS
            </div>
            <span className="font-display font-bold tracking-tight text-lg sm:text-xl text-[#0A0A0A]">
              CAPOSTORE<span className="text-[#C2410C]">221</span>
            </span>
          </button>

          {/* Center (Desktop): Short navigation for active boutique */}
          {!isAdminView && hasEnteredStore && (
            <nav aria-label="Catégories" className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive =
                  currentView.type === 'catalog' &&
                  ((link.filterType === 'all' && (currentView as any).initialCategory === 'tous') ||
                    (link.category && (currentView as any).initialCategory === link.category));

                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => handleNavClick(link)}
                    className={`text-[14px] font-medium transition-colors py-1.5 relative ${
                      isActive ? 'text-[#0A0A0A]' : 'text-[#5F5F5A] hover:text-[#0A0A0A]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#0A0A0A] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Cluster */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Discreet segmented store switcher (Desktop) */}
            {!isAdminView && hasEnteredStore && (
              <div
                className="hidden md:flex items-center bg-[#F6F5F2] p-1 rounded-full border border-[#E8E6E1] mr-2"
                role="group"
                aria-label="Changer de boutique"
              >
                <button
                  type="button"
                  onClick={() => switchStore('mode')}
                  className={`px-3 py-1 rounded-full text-[13px] font-medium transition-all ${
                    activeStore === 'mode'
                      ? 'bg-[#0A0A0A] text-white'
                      : 'text-[#5F5F5A] hover:text-[#0A0A0A]'
                  }`}
                >
                  Habillement
                </button>
                <button
                  type="button"
                  onClick={() => switchStore('electronique')}
                  className={`px-3 py-1 rounded-full text-[13px] font-medium transition-all ${
                    activeStore === 'electronique'
                      ? 'bg-[#0A0A0A] text-white'
                      : 'text-[#5F5F5A] hover:text-[#0A0A0A]'
                  }`}
                >
                  Électronique
                </button>
              </div>
            )}

            {/* Search Button */}
            {!isAdminView && (
              <button
                type="button"
                onClick={openSearch}
                className="w-11 h-11 rounded-full flex items-center justify-center text-[#0A0A0A] hover:bg-[#F6F5F2] transition-colors"
                aria-label="Rechercher un article"
                title="Rechercher (/)"
              >
                <Search className="w-[19px] h-[19px]" strokeWidth={1.75} />
              </button>
            )}

            {/* Wishlist Button (Desktop) */}
            {!isAdminView && (
              <button
                type="button"
                onClick={goToWishlist}
                className="hidden sm:flex relative w-11 h-11 rounded-full items-center justify-center text-[#0A0A0A] hover:bg-[#F6F5F2] transition-colors"
                aria-label="Mes favoris"
              >
                <Heart className="w-[19px] h-[19px]" strokeWidth={1.75} />
                {wishlistCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0A0A0A] text-white text-[10px] font-semibold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button */}
            {!isAdminView && (
              <button
                type="button"
                onClick={openCart}
                className="relative w-11 h-11 rounded-full flex items-center justify-center text-[#0A0A0A] hover:bg-[#F6F5F2] transition-colors"
                aria-label={`Panier (${totalCount} articles)`}
              >
                <ShoppingBag className="w-[19px] h-[19px]" strokeWidth={1.75} />
                {totalCount > 0 && (
                  <span className="absolute top-2 right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C2410C] text-white text-[10px] font-semibold flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Burger Menu */}
            {!isAdminView && (
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="xl:hidden w-11 h-11 rounded-full flex items-center justify-center text-[#0A0A0A] hover:bg-[#F6F5F2] transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Drawer */}
      {isMobileMenuOpen && !isAdminView && (
        <div className="fixed inset-0 z-50 xl:hidden bg-white flex flex-col justify-between p-6 overflow-y-auto animate-fade-in">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-[#E8E6E1]">
              <span className="font-display font-bold text-lg text-[#0A0A0A]">
                CAPOSTORE<span className="text-[#C2410C]">221</span>
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center text-[#0A0A0A] hover:bg-[#F6F5F2]"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Boutique Switcher */}
            <div className="mt-6 grid grid-cols-2 gap-2 p-1 bg-[#F6F5F2] rounded-full border border-[#E8E6E1]">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  switchStore('mode');
                }}
                className={`py-2.5 px-3 rounded-full text-sm font-medium transition-all ${
                  activeStore === 'mode' ? 'bg-[#0A0A0A] text-white' : 'text-[#5F5F5A]'
                }`}
              >
                Habillement
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  switchStore('electronique');
                }}
                className={`py-2.5 px-3 rounded-full text-sm font-medium transition-all ${
                  activeStore === 'electronique' ? 'bg-[#0A0A0A] text-white' : 'text-[#5F5F5A]'
                }`}
              >
                Électronique
              </button>
            </div>

            {/* Navigation links */}
            {hasEnteredStore && (
              <nav className="mt-6 divide-y divide-[#E8E6E1]">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => handleNavClick(link)}
                    className="w-full flex items-center justify-between py-4 text-left font-display font-medium text-lg text-[#0A0A0A]"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#5F5F5A]" strokeWidth={1.75} />
                  </button>
                ))}
              </nav>
            )}

            <div className="mt-6 pt-4 border-t border-[#E8E6E1] space-y-1">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  goToWishlist();
                }}
                className="w-full flex items-center gap-3 py-3 text-sm font-medium text-[#0A0A0A]"
              >
                <Heart className="w-4 h-4 text-[#5F5F5A]" strokeWidth={1.75} />
                <span>Mes favoris ({wishlistCount})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full flex items-center gap-3 py-3 text-sm font-medium text-[#0A0A0A]"
              >
                <ShoppingBag className="w-4 h-4 text-[#5F5F5A]" strokeWidth={1.75} />
                <span>Mon panier ({totalCount})</span>
              </button>
            </div>
          </div>

          {/* Bottom Contact */}
          <div className="pt-6 border-t border-[#E8E6E1] space-y-2.5 text-sm text-[#5F5F5A]">
            <a
              href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-[#0A0A0A] font-medium py-1"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" strokeWidth={1.75} />
              <span>WhatsApp : {STORE_PHONE_WHATSAPP_DISPLAY}</span>
            </a>
            <a
              href={`tel:+${STORE_CALL_PHONE}`}
              className="flex items-center gap-2.5 text-[#5F5F5A] py-1"
            >
              <Phone className="w-4 h-4" strokeWidth={1.75} />
              <span>Appel : {STORE_PHONE_CALL_DISPLAY}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
