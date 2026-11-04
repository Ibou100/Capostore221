import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ArrowUpRight, Phone, MessageCircle, Mail, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import { 
  FACEBOOK_URL, 
  INSTAGRAM_URL, 
  TIKTOK_URL, 
  STORE_WHATSAPP_PHONE, 
  STORE_CALL_PHONE, 
  STORE_PHONE_WHATSAPP_DISPLAY, 
  STORE_PHONE_CALL_DISPLAY,
  STORE_EMAIL
} from '../../utils/format';
import type { CategoryId } from '../../types';

export const Navbar: React.FC = () => {
  const { totalCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { goToHome, goToCatalog, goToWishlist, goToOrders, goToAdmin, openSearch, currentView } = useStore();
  const { orders } = useOrders();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; category?: CategoryId; filterType?: 'all' }[] = [
    { label: 'Accueil' },
    { label: 'Catalogue', filterType: 'all' },
    { label: 'Vêtements', category: 'vetements' },
    { label: 'Lunettes', category: 'lunettes' },
    { label: 'Accessoires', category: 'accessoires' },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false);
    if (!link.category && !link.filterType) {
      goToHome();
    } else if (link.filterType === 'all') {
      goToCatalog({ category: 'tous' });
    } else if (link.category) {
      goToCatalog({ category: link.category });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-200/90 py-3.5'
          : 'bg-white border-b border-zinc-200/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-zinc-900 hover:text-zinc-600 transition-colors focus:outline-none"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={openSearch}
              className="p-2 text-zinc-900 hover:text-zinc-600 transition-colors focus:outline-none ml-0.5"
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center justify-center lg:justify-start">
            <button
              onClick={goToHome}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
              aria-label="CAPOSTORE221 - Accueil"
            >
              <div className="w-8 h-8 rounded bg-[#141210] flex items-center justify-center text-white font-display font-bold text-xs tracking-tighter group-hover:bg-[#2C2723] transition-colors">
                <span>CS</span>
                <span className="text-[#B85D19] text-[9px] font-mono ml-0.5">221</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black tracking-tight text-xl text-[#141210] leading-none">
                  CAPOSTORE<span className="text-[#B85D19] font-medium text-lg ml-0.5">221</span>
                </span>
                <span className="text-[9px] tracking-widest uppercase text-zinc-500 font-semibold mt-0.5">
                  Boutique en ligne
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
                  ((link.filterType === 'all' && (currentView as any).initialCategory === 'tous') ||
                   (link.category && (currentView as any).initialCategory === link.category)));

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`text-xs font-semibold tracking-wider uppercase transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#141210]'
                      : 'text-zinc-500 hover:text-[#141210]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#141210] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Desktop Search Button */}
            <button
              onClick={openSearch}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-zinc-500 bg-zinc-100 hover:bg-zinc-200/70 hover:text-zinc-900 transition-colors focus:outline-none border border-zinc-200/80"
              aria-label="Rechercher des pièces"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>Rechercher...</span>
              <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-200 font-mono">
                /
              </kbd>
            </button>

            {/* Order Tracking & History Button */}
            <button
              onClick={goToOrders}
              className="relative p-2 text-zinc-800 hover:text-zinc-600 transition-colors focus:outline-none"
              aria-label="Mes commandes et suivi"
              title="Mes commandes & Suivi de colis"
            >
              <Package className="w-5 h-5" />
              {orders.length > 0 && (
                <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={goToWishlist}
              className="relative p-2 text-zinc-800 hover:text-zinc-600 transition-colors focus:outline-none"
              aria-label="Voir mes favoris"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#141210] text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-zinc-800 hover:text-zinc-600 transition-colors focus:outline-none group"
              aria-label={`Panier (${totalCount} articles)`}
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#B85D19] text-white text-[10px] font-bold flex items-center justify-center">
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
                  <div className="w-7 h-7 rounded bg-[#141210] flex items-center justify-center text-white font-bold text-[10px]">
                    CS<span className="text-[#B85D19] text-[8px] ml-0.5">221</span>
                  </div>
                  <span className="font-display font-extrabold text-base tracking-tight text-[#141210]">
                    CAPOSTORE221
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
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
                    className="w-full flex items-center justify-between py-3 px-3 text-left font-display font-medium text-sm text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                  </button>
                ))}
              </nav>

              {/* Quick links */}
              <div className="mt-6 pt-6 border-t border-zinc-100 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    goToOrders();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-800 hover:text-black hover:bg-zinc-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-amber-600" />
                    <span>Mes Commandes & Suivi</span>
                  </div>
                  {orders.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                      {orders.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    goToWishlist();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-600 hover:text-black"
                >
                  <Heart className="w-4 h-4" />
                  <span>Mes Favoris ({wishlistCount})</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openCart();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-600 hover:text-black"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Mon Panier ({totalCount})</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    goToAdmin();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 pt-2 border-t border-zinc-100"
                >
                  <span>⚙️ Espace Propriétaire (Gestion)</span>
                </button>
              </div>

              {/* Social links */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-3 px-3">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-900 transition-colors p-1"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-900 transition-colors p-1"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-900 transition-colors p-1"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile drawer contact footer */}
            <div className="pt-6 border-t border-zinc-100 text-xs text-zinc-600 space-y-2">
              <p className="font-semibold text-zinc-900 tracking-wider uppercase text-[11px]">
                Service Client • Commandes
              </p>
              <div className="flex flex-col gap-1.5 text-xs">
                <a
                  href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-700 hover:underline flex items-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp : {STORE_PHONE_WHATSAPP_DISPLAY}</span>
                </a>
                <a
                  href={`tel:+${STORE_CALL_PHONE}`}
                  className="font-medium text-zinc-800 hover:underline flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appel direct : {STORE_PHONE_CALL_DISPLAY}</span>
                </a>
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="font-medium text-zinc-600 hover:underline flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{STORE_EMAIL}</span>
                </a>
              </div>
              <p className="pt-2 text-[11px] text-zinc-400">
                Tu commandes, on te livre • Devise : FCFA
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
