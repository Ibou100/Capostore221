import React, { useState } from 'react';
import { Filter, X, RotateCcw, Check, ChevronDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { CategoryId, ProductGender } from '../../types';
import { formatFCFA } from '../../utils/format';

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'tous', label: 'Toutes les catégories' },
  { id: 'vetements', label: 'Vêtements' },
  { id: 'lunettes', label: 'Lunettes' },
  { id: 'accessoires', label: 'Accessoires' },
];

const GENDERS: { id: 'all' | ProductGender; label: string }[] = [
  { id: 'all', label: 'Tous genres' },
  { id: 'homme', label: 'Homme' },
  { id: 'femme', label: 'Femme' },
  { id: 'unisexe', label: 'Unisexe' },
];

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLOR_SWATCHES = [
  { name: 'Noir', hex: '#111113' },
  { name: 'Blanc', hex: '#F4F4F4' },
  { name: 'Gris', hex: '#4A4A52' },
  { name: 'Sable', hex: '#C2B8A3' },
  { name: 'Terracotta', hex: '#9E5B42' },
  { name: 'Argent', hex: '#D1D5DB' },
];

export const ProductFilters: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredProducts } = useStore();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const activeFiltersCount =
    (filters.category !== 'tous' ? 1 : 0) +
    (filters.gender !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < 10000 ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    (filters.searchQuery ? 1 : 0);

  const toggleSize = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (colorName: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter((c) => c !== colorName)
        : [...prev.colors, colorName],
    }));
  };

  const renderFilterPanel = () => (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-zinc-900 mb-3">
          Catégorie
        </h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
              className={`w-full flex items-center justify-between text-left text-xs py-1.5 px-2.5 rounded transition-colors ${
                filters.category === cat.id
                  ? 'bg-capo-black text-white font-medium'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <span>{cat.label}</span>
              {filters.category === cat.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-zinc-900 mb-3">
          Genre
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              onClick={() => setFilters((prev) => ({ ...prev, gender: g.id }))}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                filters.gender === g.id
                  ? 'bg-capo-black text-white border-capo-black font-medium'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-zinc-900">
            Prix Max : {formatFCFA(filters.maxPrice)}
          </h4>
        </div>
        <input
          type="range"
          min={2000}
          max={10000}
          step={1000}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-capo-black cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
          <span>2 000 FCFA</span>
          <span>10 000 FCFA</span>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-zinc-900 mb-3">
          Tailles & Pointures
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`min-w-8 h-8 px-2 text-xs flex items-center justify-center border transition-colors ${
                  isSelected
                    ? 'bg-capo-black text-white border-capo-black font-semibold'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-zinc-900 mb-3">
          Couleurs
        </h4>
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((swatch) => {
            const isSelected = filters.colors.includes(swatch.name);
            return (
              <button
                key={swatch.name}
                onClick={() => toggleColor(swatch.name)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs border rounded-full transition-colors ${
                  isSelected
                    ? 'border-capo-black bg-zinc-900 text-white font-medium'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-zinc-300"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span>{swatch.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability / In-Stock toggle */}
      <div className="pt-2 border-t border-zinc-100">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-zinc-800">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
            }
            className="w-4 h-4 accent-capo-black rounded"
          />
          <span>Pièces en stock uniquement</span>
        </label>
      </div>

      {/* Reset filters button */}
      {activeFiltersCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-black border border-zinc-300 hover:border-black rounded transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser les filtres ({activeFiltersCount})</span>
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Top Controls Bar: Mobile filter button + Sorting dropdown + Count */}
      <div className="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-zinc-200 gap-4">
        
        {/* Count and Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-capo-black text-white text-xs font-semibold uppercase tracking-wider rounded-none"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          <span className="text-xs text-zinc-500 font-medium">
            <strong className="text-zinc-900">{filteredProducts.length}</strong> pièce
            {filteredProducts.length !== 1 ? 's' : ''} trouvée
            {filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Sorting selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 hidden sm:inline">Trier par :</span>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any,
                }))
              }
              className="appearance-none bg-white border border-zinc-200 text-xs font-medium text-zinc-800 py-2 pl-3 pr-8 rounded focus:outline-none focus:border-black cursor-pointer"
            >
              <option value="featured">Sélection vedette</option>
              <option value="newest">Nouveautés récentes</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="popular">Pièces les plus populaires</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Active Filter Chips / Pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mr-1">
            Filtres actifs :
          </span>

          {filters.category !== 'tous' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">
              Catégorie : {filters.category}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, category: 'tous' }))}
                className="hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.gender !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">
              Genre : {filters.gender}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, gender: 'all' }))}
                className="hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.maxPrice < 10000 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">
              Max : {formatFCFA(filters.maxPrice)}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, maxPrice: 10000 }))}
                className="hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">
              En stock
              <button
                onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: false }))}
                className="hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.sizes.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full"
            >
              Taille : {s}
              <button onClick={() => toggleSize(s)} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.colors.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full"
            >
              Couleur : {c}
              <button onClick={() => toggleColor(c)} className="hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">
              « {filters.searchQuery} »
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-zinc-500 hover:text-black underline ml-1"
          >
            Tout effacer
          </button>
        </div>
      )}

      {/* Desktop Filters Sidebar Component (rendered in Catalog grid layout) */}
      <div className="hidden lg:block">
        {renderFilterPanel()}
      </div>

      {/* Mobile Filters Drawer modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-drawer">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-capo-black" />
                  <span className="font-display font-bold text-sm uppercase tracking-wider">
                    Filtres
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {renderFilterPanel()}
            </div>

            <div className="pt-6 border-t border-zinc-200 mt-6">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-capo-black text-white py-3 text-xs font-bold uppercase tracking-wider"
              >
                Afficher {filteredProducts.length} pièces
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
