import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { CATEGORIES_META } from '../../data/products';
import { PackageSearch, ArrowUp } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { filteredProducts, filters, resetFilters, activeStore, switchStore } = useStore();
  const [visibleCount, setVisibleCount] = useState(12);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setVisibleCount(12);
  }, [filters, activeStore]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 450);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentCategoryMeta =
    CATEGORIES_META.find((c) => c.id === filters.category) || CATEGORIES_META[0];

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="bg-white min-h-screen py-10 sm:py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        {/* Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-[#E8E6E1] text-left">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[#0A0A0A] tracking-tight">
              {filters.category === 'tous' ? 'Catalogue' : currentCategoryMeta.name}
            </h1>
          </div>
        </div>

        {/* Horizontal Filter Bar */}
        <ProductFilters />

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="pt-8 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 12)}
                  className="h-12 px-8 rounded-full border border-[#E8E6E1] hover:border-[#0A0A0A] bg-white text-sm font-medium text-[#0A0A0A] transition-colors"
                >
                  Voir plus
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[24px] bg-[#F6F5F2] p-12 text-center my-8 max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto text-[#5F5F5A]">
              <PackageSearch className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <h3 className="font-display font-semibold text-lg text-[#0A0A0A]">
              {activeStore === 'electronique' && filters.category === 'tous'
                ? 'Les premiers produits arrivent bientôt'
                : 'Aucun article trouvé'}
            </h3>
            <p className="text-sm text-[#5F5F5A]">
              {activeStore === 'electronique' && filters.category === 'tous'
                ? "La boutique électronique est en cours d'approvisionnement."
                : 'Essayez de modifier vos filtres pour voir plus de pièces.'}
            </p>
            <div className="pt-2">
              {activeStore === 'electronique' && filters.category === 'tous' ? (
                <button
                  type="button"
                  onClick={() => switchStore('mode')}
                  className="h-11 px-6 rounded-full bg-[#0A0A0A] text-white text-sm font-medium"
                >
                  Voir la Boutique Habillement
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-11 px-6 rounded-full bg-[#0A0A0A] text-white text-sm font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Remonter en haut"
          className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-30 h-11 px-4 rounded-full bg-[#0A0A0A] text-white text-xs font-medium shadow-premium inline-flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
        >
          <ArrowUp className="w-4 h-4" strokeWidth={1.75} />
          <span>Haut</span>
        </button>
      )}
    </div>
  );
};
