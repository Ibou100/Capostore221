import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { CategoryId, ProductGender } from '../../types';
import { formatFCFA } from '../../utils/format';

const MODE_CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'tous', label: 'Toutes' },
  { id: 'vetements', label: 'Vêtements' },
  { id: 'chaussures', label: 'Chaussures' },
  { id: 'parfums', label: 'Parfums' },
  { id: 'lunettes', label: 'Lunettes' },
  { id: 'accessoires', label: 'Accessoires' },
];

const TECH_CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'tous', label: 'Toutes' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'ordinateurs', label: 'Ordinateurs' },
  { id: 'tablettes_montres', label: 'Tablettes & montres' },
  { id: 'audio_tech', label: 'Audio' },
  { id: 'accessoires_tech', label: 'Accessoires' },
];

const GENDERS: { id: 'all' | ProductGender; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'homme', label: 'Homme' },
  { id: 'unisexe', label: 'Unisexe' },
];

const MODE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '39', '40', '41', '42', '43', '44', '45'];
const TECH_OPTIONS = ['64 Go', '128 Go', '256 Go', '512 Go', '1 To', 'Neuf scellé', 'Venant'];

export const ProductFilters: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredProducts, activeStore } = useStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const CATEGORIES = activeStore === 'electronique' ? TECH_CATEGORIES : MODE_CATEGORIES;
  const SIZE_OPTIONS = activeStore === 'electronique' ? TECH_OPTIONS : MODE_SIZES;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFiltersCount =
    (filters.category !== 'tous' ? 1 : 0) +
    (filters.gender !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.maxPrice < 100000 ? 1 : 0) +
    filters.sizes.length +
    (filters.searchQuery ? 1 : 0);

  const toggleSize = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const activeCategoryLabel = CATEGORIES.find((c) => c.id === filters.category)?.label || 'Catégorie';

  return (
    <div ref={barRef} className="space-y-4">
      {/* Top Horizontal Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Pills on Desktop, Trigger on Mobile */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile Filter Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden h-10 px-4 rounded-full border border-[#E8E6E1] bg-white hover:border-[#0A0A0A] text-sm font-medium text-[#0A0A0A] inline-flex items-center gap-2 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
            <span>Filtres {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>

          {/* Desktop Horizontal Filter Pills */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            {/* 1. Catégorie */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'category' ? null : 'category')}
                className={`h-10 px-4 rounded-full border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                  filters.category !== 'tous'
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-[#0A0A0A] border-[#E8E6E1] hover:border-[#0A0A0A]'
                }`}
              >
                <span>{filters.category === 'tous' ? 'Catégorie' : activeCategoryLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openMenu === 'category' && (
                <div className="absolute left-0 top-12 z-30 w-56 bg-white border border-[#E8E6E1] rounded-2xl shadow-premium p-2 space-y-0.5 animate-fade-in">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, category: cat.id }));
                        setOpenMenu(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                        filters.category === cat.id
                          ? 'bg-[#F6F5F2] font-medium text-[#0A0A0A]'
                          : 'text-[#5F5F5A] hover:bg-[#F6F5F2] hover:text-[#0A0A0A]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {filters.category === cat.id && <Check className="w-3.5 h-3.5 text-[#0A0A0A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Genre (Mode only) */}
            {activeStore === 'mode' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenMenu(openMenu === 'gender' ? null : 'gender')}
                  className={`h-10 px-4 rounded-full border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                    filters.gender !== 'all'
                      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                      : 'bg-white text-[#0A0A0A] border-[#E8E6E1] hover:border-[#0A0A0A]'
                  }`}
                >
                  <span>
                    {filters.gender === 'all'
                      ? 'Genre'
                      : GENDERS.find((g) => g.id === filters.gender)?.label}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {openMenu === 'gender' && (
                  <div className="absolute left-0 top-12 z-30 w-44 bg-white border border-[#E8E6E1] rounded-2xl shadow-premium p-2 space-y-0.5 animate-fade-in">
                    {GENDERS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, gender: g.id }));
                          setOpenMenu(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                          filters.gender === g.id
                            ? 'bg-[#F6F5F2] font-medium text-[#0A0A0A]'
                            : 'text-[#5F5F5A] hover:bg-[#F6F5F2] hover:text-[#0A0A0A]'
                        }`}
                      >
                        <span>{g.label}</span>
                        {filters.gender === g.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Prix */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'price' ? null : 'price')}
                className={`h-10 px-4 rounded-full border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                  filters.maxPrice < 100000
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-[#0A0A0A] border-[#E8E6E1] hover:border-[#0A0A0A]'
                }`}
              >
                <span>{filters.maxPrice < 100000 ? `Max ${formatFCFA(filters.maxPrice)}` : 'Prix'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openMenu === 'price' && (
                <div className="absolute left-0 top-12 z-30 w-64 bg-white border border-[#E8E6E1] rounded-2xl shadow-premium p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-medium text-[#0A0A0A]">
                    <span>Prix maximum</span>
                    <span>{formatFCFA(filters.maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={100000}
                    step={1000}
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                    }
                    className="w-full accent-[#0A0A0A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[12px] text-[#5F5F5A]">
                    <span>2 000 FCFA</span>
                    <span>100 000 FCFA</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Tailles / Stockage */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 'size' ? null : 'size')}
                className={`h-10 px-4 rounded-full border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                  filters.sizes.length > 0
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-[#0A0A0A] border-[#E8E6E1] hover:border-[#0A0A0A]'
                }`}
              >
                <span>
                  {activeStore === 'electronique' ? 'Stockage / État' : 'Taille'}
                  {filters.sizes.length > 0 ? ` (${filters.sizes.length})` : ''}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openMenu === 'size' && (
                <div className="absolute left-0 top-12 z-30 w-72 bg-white border border-[#E8E6E1] rounded-2xl shadow-premium p-4 animate-fade-in">
                  <div className="flex flex-wrap gap-1.5">
                    {SIZE_OPTIONS.map((sz) => {
                      const active = filters.sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => toggleSize(sz)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            active
                              ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                              : 'bg-white text-[#0A0A0A] border-[#E8E6E1] hover:border-[#0A0A0A]'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 5. En stock uniquement */}
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
              className={`h-10 px-4 rounded-full border text-sm font-medium transition-colors ${
                filters.inStockOnly
                  ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                  : 'bg-white text-[#0A0A0A] border-[#E8E6E1] hover:border-[#0A0A0A]'
              }`}
            >
              En stock
            </button>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 px-3 text-sm text-[#5F5F5A] hover:text-[#C2410C] transition-colors"
              >
                Tout effacer
              </button>
            )}
          </div>
        </div>

        {/* Right: Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any,
                }))
              }
              aria-label="Trier les articles"
              className="appearance-none h-10 bg-white border border-[#E8E6E1] hover:border-[#0A0A0A] text-sm font-medium text-[#0A0A0A] pl-4 pr-9 rounded-full focus:outline-none cursor-pointer transition-colors"
            >
              <option value="featured">Sélection vedette</option>
              <option value="newest">Nouveautés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="popular">Populaires</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5F5F5A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-drawer p-6 overflow-y-auto flex flex-col justify-between animate-drawer">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1]">
                <span className="font-display font-semibold text-base text-[#0A0A0A]">Filtres</span>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F6F5F2]"
                  aria-label="Fermer les filtres"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Catégorie */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-medium text-[#0A0A0A]">Catégorie</h4>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border ${
                        filters.category === cat.id
                          ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                          : 'bg-white text-[#5F5F5A] border-[#E8E6E1]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-[#0A0A0A]">
                  <span>Prix max</span>
                  <span>{formatFCFA(filters.maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={100000}
                  step={1000}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                  }
                  className="w-full accent-[#0A0A0A]"
                />
              </div>

              {/* Tailles / Options */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-medium text-[#0A0A0A]">
                  {activeStore === 'electronique' ? 'Stockage & état' : 'Tailles & pointures'}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {SIZE_OPTIONS.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                        filters.sizes.includes(sz)
                          ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                          : 'bg-white text-[#5F5F5A] border-[#E8E6E1]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* En stock */}
              <label className="flex items-center gap-2.5 text-sm text-[#0A0A0A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#0A0A0A]"
                />
                <span>Articles en stock uniquement</span>
              </label>
            </div>

            <div className="pt-6 border-t border-[#E8E6E1] space-y-2.5 mt-6">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full h-11 rounded-full border border-[#E8E6E1] text-sm font-medium text-[#5F5F5A]"
                >
                  Réinitialiser
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full h-12 rounded-full bg-[#0A0A0A] text-white text-sm font-medium"
              >
                Afficher {filteredProducts.length} article{filteredProducts.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
