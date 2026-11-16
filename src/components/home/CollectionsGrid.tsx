import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { CategoryId } from '../../types';

interface DepartmentCard {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  count: string;
  category: CategoryId;
  image: string;
}

export const CollectionsGrid: React.FC = () => {
  const { goToCatalog, products } = useStore();

  const published = products.filter((p) => p.published);
  const vetements = published.filter((p) => p.category === 'vetements');
  const lunettes = published.filter((p) => p.category === 'lunettes');
  const accessoires = published.filter((p) => p.category === 'accessoires');
  const chaussures = published.filter((p) => p.category === 'chaussures');

  const allDepartments: DepartmentCard[] = [
    {
      id: 'vetements',
      title: 'Vêtements & Tailleur',
      subtitle: 'Pantalons, jeans, chemises, t-shirts & vestes disponibles en stock',
      badgeText: 'Collection Prêt-à-porter',
      count: `${vetements.length} article${vetements.length > 1 ? 's' : ''}`,
      category: 'vetements',
      image: vetements[0]?.images?.[0] || '/products/pantalon-cargo-ecru.jpg',
    },
    {
      id: 'lunettes',
      title: 'Lunettes & Montures',
      subtitle: 'Montures géométriques en acétate & solaires disponibles',
      badgeText: 'Édition exclusive',
      count: `${lunettes.length} article${lunettes.length > 1 ? 's' : ''}`,
      category: 'lunettes',
      image: lunettes[0]?.images?.[0] || '/products/monture-lunettes-acetate-bordeaux.jpg',
    },
    {
      id: 'accessoires',
      title: 'Sacs & Maroquinerie',
      subtitle: 'Sacs à bandoulière, pochettes cuir & portefeuilles',
      badgeText: 'Maroquinerie',
      count: `${accessoires.length} article${accessoires.length > 1 ? 's' : ''}`,
      category: 'accessoires',
      image: accessoires[0]?.images?.[0] || '/products/pochette-cuir-dragonne-xqr.png',
    },
    {
      id: 'chaussures',
      title: 'Chaussures & Souliers',
      subtitle: 'Baskets, mocassins et souliers de ville',
      badgeText: 'Chaussures',
      count: `${chaussures.length} article${chaussures.length > 1 ? 's' : ''}`,
      category: 'chaussures',
      image: chaussures[0]?.images?.[0] || '/products/pantalon-cargo-ecru.jpg',
    },
  ];

  // Only show categories that actually have at least 1 published product
  const departments = allDepartments.filter((dept) => {
    if (dept.category === 'vetements') return vetements.length > 0;
    if (dept.category === 'lunettes') return lunettes.length > 0;
    if (dept.category === 'accessoires') return accessoires.length > 0;
    if (dept.category === 'chaussures') return chaussures.length > 0;
    return false;
  });

  if (departments.length === 0) return null;

  const gridColsClass =
    departments.length === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : departments.length === 2
      ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'
      : 'grid-cols-1 sm:grid-cols-3';

  return (
    <section className="py-6 sm:py-10 bg-[#FAF8F5] border-b border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-4 sm:mb-6 pb-2.5 border-b border-[#EAE5DC] gap-2 text-left">
          <h2 className="font-display font-extrabold text-lg sm:text-2xl text-zinc-900 tracking-tight">
            Catégories
          </h2>
          <span className="text-xs text-zinc-500">
            {published.length} articles au total
          </span>
        </div>

        {/* Clean Minimalist Cards */}
        <div className={`grid ${gridColsClass} gap-3.5 sm:gap-6`}>
          {departments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => goToCatalog({ category: dept.category })}
              className="group relative overflow-hidden rounded-sm cursor-pointer bg-white border border-[#E7E2D9] hover:border-zinc-900 transition-all duration-300"
            >
              {/* Studio Frame */}
              <div className="aspect-[4/3] sm:aspect-[4/5] w-full bg-[#FAF8F5] p-4 sm:p-6 overflow-hidden relative flex items-center justify-center border-b border-[#EAE5DC]">
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full max-h-[220px] sm:max-h-none object-contain drop-shadow-sm transition-transform duration-300 ease-out group-hover:scale-104"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Department badge */}
                <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 text-[10px] sm:text-[11px] font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#141210] text-white rounded-sm">
                  {dept.badgeText}
                </span>

                {/* Arrow indicator */}
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-zinc-800 border border-zinc-200 flex items-center justify-center transition-transform group-hover:rotate-45 duration-300 shadow-sm">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              {/* Text Info */}
              <div className="p-3 sm:p-4 bg-white text-left flex items-center justify-between gap-2">
                <h3 className="font-display font-bold text-sm sm:text-base text-zinc-900 group-hover:text-[#B85D19] transition-colors">
                  {dept.title}
                </h3>
                <span className="text-[11px] font-semibold text-zinc-500 shrink-0">
                  {dept.count}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
