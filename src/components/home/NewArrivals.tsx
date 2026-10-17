import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../catalog/ProductCard';

export const NewArrivals: React.FC = () => {
  const { products, goToCatalog } = useStore();

  // Get new or featured products
  const newProducts = products
    .filter((p) => p.published && p.isNew)
    .slice(0, 4);

  return (
    <section className="py-20 lg:py-24 bg-capo-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-capo-accent" />
              <span>Derniers Arrivages</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-capo-black tracking-tightest">
              Nouveautés de la Maison
            </h2>
          </div>

          <button
            onClick={() => goToCatalog({ category: 'tous' })}
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-capo-black hover:text-zinc-600 transition-colors"
          >
            <span>Voir toute la sélection</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
