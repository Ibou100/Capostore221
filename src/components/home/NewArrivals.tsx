import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';
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
    { id: 'lunettes', label: 'Lunettes d\'Exception', count: products.filter(p => p.category === 'lunettes').length },
    { id: 'accessoires', label: 'Sacs & Maroquinerie', count: products.filter(p => p.category === 'accessoires').length },
  ];

  return (
    <section className="py-14 lg:py-20 bg-[#FAF8F5] border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B85226] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inventaire Réel • Disponible à Dakar</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#141210] tracking-tight">
              La Sélection CAPOSTORE221
            </h2>
            <p className="text-xs sm:text-sm text-[#666057] mt-1 max-w-xl">
              Cliquez sur un article pour voir les détails, ou commandez directement en 1 clic sur WhatsApp avec livraison dans la journée.
            </p>
          </div>

          <button
            onClick={() => goToCatalog({ category: 'tous' })}
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#141210] hover:text-[#B85226] transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-[#B85226]" />
            <span>Filtres par taille & prix</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Clean Filter Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all shrink-0 border ${
                activeTab === tab.id
                  ? 'bg-[#141210] text-white border-[#141210] shadow-sm ring-2 ring-[#B85226]/30'
                  : 'bg-white text-[#524B43] border-[#DDD5C7] hover:border-[#B85226] hover:text-[#141210]'
              }`}
            >
              {tab.label} <span className="ml-1 opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Clean Responsive Products Grid - 4 Columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
