import React, { useState, useMemo } from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../catalog/ProductCard';

type TabType = 'tous' | 'pantalons' | 'hauts' | 'lunettes' | 'accessoires';

export const NewArrivals: React.FC = () => {
  const { products, goToCatalog } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('tous');

  // Filter products by active tab
  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case 'pantalons':
        return products.filter((p) => p.category === 'vetements' && p.subCategory === 'Pantalons');
      case 'hauts':
        return products.filter((p) => p.category === 'vetements' && p.subCategory === 'T-shirts & Hauts');
      case 'lunettes':
        return products.filter((p) => p.category === 'lunettes');
      case 'accessoires':
        return products.filter((p) => p.category === 'accessoires');
      case 'tous':
      default:
        return products;
    }
  }, [products, activeTab]);

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'tous', label: 'Toutes les pièces', count: products.length },
    { id: 'pantalons', label: 'Pantalons & Bermudas', count: products.filter(p => p.category === 'vetements' && p.subCategory === 'Pantalons').length },
    { id: 'hauts', label: 'Chemises & Polos', count: products.filter(p => p.category === 'vetements' && p.subCategory === 'T-shirts & Hauts').length },
    { id: 'lunettes', label: 'Lunettes', count: products.filter(p => p.category === 'lunettes').length },
    { id: 'accessoires', label: 'Maroquinerie & Sacs', count: products.filter(p => p.category === 'accessoires').length },
  ];

  return (
    <section className="py-14 lg:py-20 bg-white border-b border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#EFECE5] gap-4 text-left">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#B85D19] mb-1">
              Vestiaire Complet
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-zinc-900 tracking-tight">
              Catalogue Disponible
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-xl">
              23 pièces sélectionnées en stock réel. Cliquez sur un article pour voir les détails et choisir votre taille.
            </p>
          </div>

          <button
            onClick={() => goToCatalog({ category: 'tous' })}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:text-[#B85D19] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#B85D19]" />
            <span>Filtres avancés</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Clean Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shrink-0 border ${
                activeTab === tab.id
                  ? 'bg-[#141210] text-white border-[#141210]'
                  : 'bg-[#FAF8F5] text-zinc-600 border-[#E7E2D9] hover:border-zinc-900 hover:text-zinc-900'
              }`}
            >
              {tab.label} <span className="ml-1 opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Clean Responsive Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
