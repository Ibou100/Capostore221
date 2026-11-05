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
    <section className="py-8 sm:py-14 lg:py-20 bg-white border-b border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-stone-200/60 gap-3 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[#B85D19] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <span>Vestiaire Disponible</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0C0A09] tracking-tight">
              Nos 23 Pièces en Stock
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl leading-relaxed">
              Toutes les pièces présentées sont disponibles en stock réel immédiat. Cliquez sur un article pour voir les détails, les toiles et sélectionner votre taille.
            </p>
          </div>

          <button
            onClick={() => goToCatalog({ category: 'tous' })}
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-[#B85D19] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-stone-500 group-hover:text-[#B85D19]" />
            <span>Filtres avancés</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Clean Luxury Filter Tabs - Mobile scrollable */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-6 sm:mb-10 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold tracking-wider rounded-full transition-all shrink-0 border cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0C0A09] text-white border-[#0C0A09] shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900 shadow-2xs'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-2 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-amber-400/20 text-amber-300' : 'bg-stone-100 text-stone-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* 2 columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
