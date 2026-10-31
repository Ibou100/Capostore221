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
    <div className="bg-[#FAF8F5] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Catalog Header */}
        <div className="pb-6 mb-8 border-b border-[#E7E2D9] text-left">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#B85D19] mb-1">
            Catalogue • {filteredProducts.length} pièce{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
          </p>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-zinc-900 tracking-tight">
            {currentCategoryMeta.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl mt-1.5 leading-relaxed">
            {currentCategoryMeta.description}
          </p>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
          
          {/* Desktop Left Sidebar for Filters */}
          <div className="lg:col-span-1">
            <ProductFilters />
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white border border-[#E7E2D9] rounded-sm p-12 text-center my-8">
                <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <PackageSearch className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-base text-zinc-900 mb-2">
                  Aucune pièce ne correspond à vos filtres
                </h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mb-6">
                  Modifiez vos critères de sélection pour explorer nos créations disponibles.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141210] text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors rounded-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser les filtres</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
