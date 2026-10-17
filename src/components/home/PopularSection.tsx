import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../catalog/ProductCard';

export const PopularSection: React.FC = () => {
  const { products, goToCatalog } = useStore();

  const popularProducts = products
    .filter((p) => p.published && p.isPopular)
    .slice(0, 4);

  return (
    <section className="py-20 lg:py-24 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
              <Flame className="w-3.5 h-3.5 text-capo-accent" />
              <span>Sélection Éditoriale</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-capo-black tracking-tightest">
              Les Pièces Emblématiques
            </h2>
          </div>

          <button
            onClick={() => goToCatalog({ category: 'tous' })}
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-capo-black hover:text-zinc-600 transition-colors"
          >
            <span>Toutes les créations</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
