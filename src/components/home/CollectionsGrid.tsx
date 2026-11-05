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
    <section className="py-10 sm:py-16 lg:py-20 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-stone-200/60 gap-3 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[#B85D19] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <span>Le Vestiaire</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0C0A09] tracking-tight">
              Explorer par Département
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md leading-relaxed">
            23 créations disponibles en stock réel immédiat. Choisissez votre catégorie, visualisez les coupes et commandez en direct.
          </p>
        </div>

        {/* 3 Luxury Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-7">
          {departments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => goToCatalog({ category: dept.category })}
              className="group relative overflow-hidden rounded-3xl cursor-pointer bg-white border border-stone-200/80 hover:border-[#B85D19]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Studio Frame */}
              <div className="aspect-[4/3] sm:aspect-[4/5] w-full bg-gradient-to-b from-[#FAF8F5] to-[#F1EFEA] p-6 sm:p-8 overflow-hidden relative flex items-center justify-center border-b border-stone-200/80">
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full max-h-[240px] sm:max-h-none object-contain drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-106"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Price tag */}
                <span className="absolute top-4 left-4 text-xs font-black tracking-wider px-3 py-1 bg-[#0C0A09] text-white rounded-full shadow-md">
                  {dept.priceTag}
                </span>

                {/* Arrow indicator */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-stone-900 border border-stone-200 flex items-center justify-center transition-all group-hover:bg-[#0C0A09] group-hover:text-amber-400 group-hover:rotate-45 duration-300 shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 sm:p-6 bg-white text-left">
                <div className="flex items-center justify-between text-[10px] text-[#B85D19] uppercase tracking-widest font-bold mb-1">
                  <span>{dept.count}</span>
                  <span className="text-stone-400 font-medium">Collection 2026</span>
                </div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 group-hover:text-[#B85D19] transition-colors">
                  {dept.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
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
