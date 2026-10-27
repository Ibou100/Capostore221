import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { CATEGORIES_META } from '../../data/products';
import { RotateCcw, PackageSearch } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { filteredProducts, filters, resetFilters } = useStore();

  const currentCategoryMeta = CATEGORIES_META.find(
    (c) => c.id === filters.category
  ) || CATEGORIES_META[0];

  return (
    <div className="bg-capo-offwhite min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Catalog Header */}
        <div className="pb-8 mb-8 border-b border-zinc-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            Collection CAPOSTORE221 • Dakar
          </p>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-capo-black tracking-tightest uppercase">
            {currentCategoryMeta.name}
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mt-3 font-light leading-relaxed">
            {currentCategoryMeta.description}
          </p>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
          
          {/* Desktop Left Sidebar for Filters */}
          <div className="lg:col-span-1">
            <ProductFilters />
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Explicit Empty State */
              <div className="bg-white border border-zinc-200 rounded-sm p-12 text-center my-8">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-lg text-zinc-900 mb-2">
                  Aucune pièce ne correspond à vos critères
                </h3>
                <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
                  Modifiez vos filtres de prix, de taille ou de catégorie pour découvrir nos créations disponibles.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-capo-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réinitialiser tous les filtres</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
