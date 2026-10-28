import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { CategoryId } from '../../types';

interface DepartmentCard {
  id: string;
  title: string;
  subtitle: string;
  count: string;
  category: CategoryId;
  image: string;
}

export const CollectionsGrid: React.FC = () => {
  const { goToCatalog } = useStore();

  const departments: DepartmentCard[] = [
    {
      id: 'vetements',
      title: 'Vêtements & Vestiaire',
      subtitle: 'Pantalons Prince de Galles, cargos écru, chemises légères & polos',
      count: '18 pièces',
      category: 'vetements',
      image: '/products/pantalon-cargo-ecru.jpg',
    },
    {
      id: 'lunettes',
      title: 'Lunettes & Montures',
      subtitle: 'Montures géométriques en acétate italien biseauté & armatures ciselées',
      count: 'Collection exclusive',
      category: 'lunettes',
      image: '/products/monture-lunettes-acetate-bordeaux.jpg',
    },
    {
      id: 'accessoires',
      title: 'Accessoires & Maroquinerie',
      subtitle: 'Pochettes cuir matelassé XQR & sacoches bandoulière nylon sable',
      count: '2 pièces',
      category: 'accessoires',
      image: '/products/pochette-cuir-dragonne-xqr.png',
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-white border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#B85D19] font-bold mb-1">
              Rayons & Départements
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141210] tracking-tight">
              Explorer par Catégorie
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#666057] max-w-md">
            Des sélections réelles et vérifiées. Vous commandez en ligne, nous préparons votre colis et organisons la livraison chez vous.
          </p>
        </div>

        {/* 3 Clean Minimalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => goToCatalog({ category: dept.category })}
              className="group relative overflow-hidden rounded-lg cursor-pointer bg-white border border-[#EAE5DC] hover:border-[#B85226] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
            >
              {/* Image Container with clean studio aspect ratio */}
              <div className="aspect-[4/5] w-full bg-[#FAF8F5] p-4 overflow-hidden relative flex items-center justify-center border-b border-[#EAE5DC]">
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Count badge */}
                <span className="absolute top-3 right-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-[#141210] text-white rounded-full shadow-sm">
                  {dept.count}
                </span>

                {/* Arrow indicator */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white text-[#141210] border border-[#E0D9CE] flex items-center justify-center transition-transform group-hover:rotate-45 duration-300 shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Text Info */}
              <div className="p-4 bg-white">
                <h3 className="font-display font-bold text-base text-[#141210] group-hover:text-[#B85D19] transition-colors mb-1">
                  {dept.title}
                </h3>
                <p className="text-xs text-[#6B645A] leading-relaxed line-clamp-2">
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
