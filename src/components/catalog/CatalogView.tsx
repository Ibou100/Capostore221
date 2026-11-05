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
    <div className="bg-[#FAF8F5] min-h-screen py-8 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Catalog Header */}
        <div className="pb-6 mb-8 sm:mb-10 border-b border-stone-200/80 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[#B85D19] text-[10px] font-bold uppercase tracking-widest mb-2">
            <span>Catalogue Officiel • {filteredProducts.length} pièce{filteredProducts.length > 1 ? 's' : ''} en stock</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-[#0C0A09] tracking-tight">
            {currentCategoryMeta.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1.5 leading-relaxed">
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center my-8 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="font-display font-extrabold text-lg text-stone-900 mb-2">
                  Aucune pièce ne correspond à vos filtres
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
                  Modifiez vos critères de sélection ou réinitialisez les options pour afficher toutes les pièces disponibles.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0C0A09] hover:bg-[#201D1A] text-white text-xs font-bold uppercase tracking-wider transition-all rounded-full shadow-md"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
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
