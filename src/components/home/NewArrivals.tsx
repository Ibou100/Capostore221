import React, { useState, useMemo } from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import { ProductCard } from '../catalog/ProductCard';

type TabType = 'tous' | 'vendus' | 'pantalons' | 'hauts' | 'lunettes' | 'accessoires' | 'chaussures';

function isPantProduct(name: string, subCategory: string): boolean {
  if (subCategory === 'Pantalons') return true;
  return /\b(pantalon|pantalons|jean|jeans|denim|cargo|bermuda|short|jogging)\b/i.test(`${name} ${subCategory}`);
}

export const NewArrivals: React.FC = () => {
  const { products, goToCatalog } = useStore();
  const { soldCounts } = useOrders();
  const [activeTab, setActiveTab] = useState<TabType>('tous');

  const publishedProducts = useMemo(
    () => products.filter((p) => p.published),
    [products]
  );

  const soldProducts = useMemo(
    () =>
      publishedProducts
        .filter((p) => (soldCounts[p.id] || 0) > 0)
        .sort((a, b) => (soldCounts[b.id] || 0) - (soldCounts[a.id] || 0)),
    [publishedProducts, soldCounts]
  );

  const lunettesCount = useMemo(
    () => publishedProducts.filter((p) => p.category === 'lunettes').length,
    [publishedProducts]
  );

  const shoesCount = useMemo(
    () => publishedProducts.filter((p) => p.category === 'chaussures').length,
    [publishedProducts]
  );

  // Filter products by active tab
  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case 'vendus':
        return soldProducts;
      case 'pantalons':
        return publishedProducts.filter((p) => p.category === 'vetements' && isPantProduct(p.name, p.subCategory));
      case 'hauts':
        return publishedProducts.filter((p) => p.category === 'vetements' && !isPantProduct(p.name, p.subCategory));
      case 'lunettes':
        return publishedProducts.filter((p) => p.category === 'lunettes');
      case 'accessoires':
        return publishedProducts.filter((p) => p.category === 'accessoires');
      case 'chaussures':
        return publishedProducts.filter((p) => p.category === 'chaussures');
      case 'tous':
      default:
        return publishedProducts;
    }
  }, [publishedProducts, soldProducts, activeTab]);

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'tous', label: 'Toutes les pièces', count: publishedProducts.length },
    ...(soldProducts.length > 0
      ? [{ id: 'vendus' as TabType, label: 'Articles vendus', count: soldProducts.length }]
      : []),
    { id: 'pantalons', label: 'Pantalons & Jeans', count: publishedProducts.filter(p => p.category === 'vetements' && isPantProduct(p.name, p.subCategory)).length },
    { id: 'hauts', label: 'Chemises, Hauts & Vestes', count: publishedProducts.filter(p => p.category === 'vetements' && !isPantProduct(p.name, p.subCategory)).length },
    ...(lunettesCount > 0
      ? [{ id: 'lunettes' as TabType, label: 'Lunettes', count: lunettesCount }]
      : []),
    { id: 'accessoires', label: 'Sacs & Accessoires', count: publishedProducts.filter(p => p.category === 'accessoires').length },
    ...(shoesCount > 0
      ? [{ id: 'chaussures' as TabType, label: 'Chaussures', count: shoesCount }]
      : []),
  ];

  return (
    <section className="py-8 sm:py-14 lg:py-20 bg-white border-b border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-6 pb-3 border-b border-[#EFECE5] gap-2 text-left">
          <div>
            <h2 className="font-display font-extrabold text-xl sm:text-3xl text-zinc-900 tracking-tight">
              Catalogue
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              {publishedProducts.length} article{publishedProducts.length > 1 ? 's' : ''} disponible{publishedProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={() => goToCatalog({ category: 'tous' })}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:text-[#B85D19] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#B85D19]" />
            <span>Filtres avancés</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Clean Filter Tabs - Mobile scrollable */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 sm:mb-8 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors shrink-0 border ${
                activeTab === tab.id
                  ? 'bg-[#141210] text-white border-[#141210]'
                  : 'bg-[#FAF8F5] text-zinc-600 border-[#E7E2D9] hover:border-zinc-900 hover:text-zinc-900'
              }`}
            >
              {tab.label} <span className="ml-1 opacity-70 text-[10px]">({tab.count})</span>
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
