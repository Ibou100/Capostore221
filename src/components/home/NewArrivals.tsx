import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../catalog/ProductCard';

export const NewArrivals: React.FC = () => {
  const { storeProducts, goToCatalog } = useStore();
  const [visibleCount, setVisibleCount] = useState(8);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 550);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const publishedProducts = useMemo(
    () => storeProducts.filter((p) => p.published),
    [storeProducts]
  );

  if (publishedProducts.length === 0) {
    return null;
  }

  const displayed = publishedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < publishedProducts.length;

  return (
    <section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-8 sm:pb-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
        <h2 className="font-display font-semibold text-2xl sm:text-4xl text-[#0A0A0A]">
          Nouveautés
        </h2>
        <button
          type="button"
          onClick={() => goToCatalog({ category: 'tous' })}
          className="text-sm font-medium text-[#0A0A0A] hover:text-[#C2410C] inline-flex items-center gap-1.5 transition-colors"
        >
          <span>Voir tout</span>
          <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>

      {/* 4 columns desktop / 2 columns mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {displayed.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination "Voir plus" */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + 12)}
            className="h-12 px-8 rounded-full border border-[#E8E6E1] hover:border-[#0A0A0A] bg-white text-sm font-medium text-[#0A0A0A] transition-colors"
          >
            Voir plus
          </button>
        </div>
      )}

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
    </section>
  );
};
