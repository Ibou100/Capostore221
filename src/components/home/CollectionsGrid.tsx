import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { CategoryId, ProductGender } from '../../types';

interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  category: CategoryId;
  gender?: ProductGender;
  image: string;
  span: string; // Tailwind grid span
}

export const CollectionsGrid: React.FC = () => {
  const { goToCatalog } = useStore();

  const collections: CollectionItem[] = [
    {
      id: 'homme',
      title: 'Mode Homme',
      subtitle: 'Tailoring déstructuré & silhouettes affûtées',
      category: 'vetements',
      gender: 'homme',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
      span: 'md:col-span-7 lg:col-span-7 aspect-[16/10] sm:aspect-[16/9]',
    },
    {
      id: 'femme',
      title: 'Mode Femme',
      subtitle: 'Élégance contemporaine & coupes graphiques',
      category: 'vetements',
      gender: 'femme',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      span: 'md:col-span-5 lg:col-span-5 aspect-[4/5] sm:aspect-[16/9] md:aspect-auto',
    },
    {
      id: 'lunettes',
      title: 'Lunettes Solaires',
      subtitle: 'Acétate biseauté italien & verres UV400',
      category: 'lunettes',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85',
      span: 'md:col-span-4 lg:col-span-4 aspect-[4/5]',
    },
    {
      id: 'chaussures',
      title: 'Chaussures & Sneakers',
      subtitle: 'Volumes audacieux & cuirs pleine fleur',
      category: 'chaussures',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85',
      span: 'md:col-span-4 lg:col-span-4 aspect-[4/5]',
    },
    {
      id: 'accessoires',
      title: 'Accessoires & Maroquinerie',
      subtitle: 'Sacs holsters étanches & argent massif 925',
      category: 'accessoires',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
      span: 'md:col-span-4 lg:col-span-4 aspect-[4/5]',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2">
              Univers & Vestiaire
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-capo-black tracking-tightest">
              Nos Grandes Collections
            </h2>
          </div>
          <p className="text-sm text-zinc-500 max-w-md">
            Chaque collection explore une facette du style contemporain, adaptée aux exigences et au climat de l'Afrique de l'Ouest.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
          {collections.map((item) => (
            <div
              key={item.id}
              onClick={() => goToCatalog({ category: item.category, gender: item.gender })}
              className={`group relative overflow-hidden rounded-sm cursor-pointer bg-zinc-900 ${item.span}`}
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-90 opacity-80"
                loading="lazy"
              />

              {/* Shading Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                <div className="flex items-end justify-between">
                  <div className="max-w-md">
                    <p className="text-[11px] font-medium tracking-widest uppercase text-capo-accent mb-1">
                      Collection
                    </p>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Circle Arrow Button */}
                  <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-capo-black transition-all duration-300 shrink-0 ml-4">
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
