import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { CategoryId } from '../../types';

interface DepartmentCard {
  id: string;
  title: string;
  subtitle: string;
  priceTag: string;
  count: string;
  category: CategoryId;
  image: string;
}

export const CollectionsGrid: React.FC = () => {
  const { goToCatalog } = useStore();

  const departments: DepartmentCard[] = [
    {
      id: 'vetements',
      title: 'Vêtements & Tailleur',
      subtitle: 'Pantalons Prince de Galles, cargos écru, chemises légères & polos',
      priceTag: '5 000 FCFA',
      count: '20 pièces',
      category: 'vetements',
      image: '/products/pantalon-cargo-ecru.jpg',
    },
    {
      id: 'lunettes',
      title: 'Lunettes & Montures',
      subtitle: 'Montures géométriques en acétate italien biseauté & armatures ciselées',
      priceTag: '3 000 FCFA',
      count: 'Édition exclusive',
      category: 'lunettes',
      image: '/products/monture-lunettes-acetate-bordeaux.jpg',
    },
    {
      id: 'accessoires',
      title: 'Maroquinerie & Pochettes',
      subtitle: 'Pochettes cuir matelassé XQR & sacoches bandoulière nylon sable',
      priceTag: '3 000 FCFA',
      count: '2 pièces',
      category: 'accessoires',
      image: '/products/pochette-cuir-dragonne-xqr.png',
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-[#FAF8F5] border-b border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#EAE5DC] gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#B85D19] mb-1">
              Départements
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
              Explorer par Catégorie
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
            Chaque pièce est disponible en stock réel. Commandez en ligne et recevez votre colis à domicile.
          </p>
        </div>

        {/* 3 Clean Minimalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => goToCatalog({ category: dept.category })}
              className="group relative overflow-hidden rounded-sm cursor-pointer bg-white border border-[#E7E2D9] hover:border-zinc-900 transition-all duration-300"
            >
              {/* Studio Frame */}
              <div className="aspect-[4/5] w-full bg-[#FAF8F5] p-6 overflow-hidden relative flex items-center justify-center border-b border-[#EAE5DC]">
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 ease-out group-hover:scale-104"
                  loading="lazy"
                />
                
                {/* Price tag */}
                <span className="absolute top-3 left-3 text-[11px] font-bold tracking-wider px-2.5 py-1 bg-[#141210] text-white rounded-sm">
                  {dept.priceTag}
                </span>

                {/* Arrow indicator */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-zinc-800 border border-zinc-200 flex items-center justify-center transition-transform group-hover:rotate-45 duration-300 shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 bg-white">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                  <span>{dept.count}</span>
                </div>
                <h3 className="font-display font-bold text-base text-zinc-900 group-hover:text-[#B85D19] transition-colors mb-1">
                  {dept.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                  {dept.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
