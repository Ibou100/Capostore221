import React from 'react';
import { useStore } from '../../context/StoreContext';
import type { CategoryId } from '../../types';
import { SmartImage } from '../ui/SmartImage';

interface CategoryCardItem {
  id: CategoryId;
  title: string;
  count: number;
  image: string;
}

export const CollectionsGrid: React.FC = () => {
  const { goToCatalog, storeProducts, activeStore } = useStore();
  const published = storeProducts.filter((p) => p.published);

  const rawCategories: { id: CategoryId; title: string }[] =
    activeStore === 'electronique'
      ? [
          { id: 'smartphones', title: 'Smartphones' },
          { id: 'ordinateurs', title: 'Ordinateurs' },
          { id: 'tablettes_montres', title: 'Tablettes & montres' },
          { id: 'audio_tech', title: 'Audio' },
          { id: 'accessoires_tech', title: 'Accessoires' },
        ]
      : [
          { id: 'vetements', title: 'Vêtements' },
          { id: 'chaussures', title: 'Chaussures' },
          { id: 'parfums', title: 'Parfums' },
          { id: 'lunettes', title: 'Lunettes' },
          { id: 'accessoires', title: 'Accessoires' },
        ];

  const categories: CategoryCardItem[] = rawCategories
    .map((cat) => {
      const items = published.filter((p) => p.category === cat.id);
      return {
        id: cat.id,
        title: cat.title,
        count: items.length,
        image: items[0]?.images?.[0] || '',
      };
    })
    .filter((cat) => cat.count > 0);

  if (categories.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[#0A0A0A]">
          Catégories
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => goToCatalog({ category: cat.id })}
            className="group text-left cursor-pointer space-y-3"
          >
            <div className="aspect-[4/5] w-full rounded-[20px] bg-[#F6F5F2] p-3 sm:p-4 overflow-hidden">
              {cat.image && (
                <SmartImage
                  src={cat.image}
                  alt={cat.title}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03]"
                />
              )}
            </div>
            <div className="px-0.5">
              <h3 className="font-display font-medium text-base text-[#0A0A0A] group-hover:text-[#C2410C] transition-colors">
                {cat.title}
              </h3>
              <p className="text-[13px] text-[#5F5F5A]">
                {cat.count} article{cat.count > 1 ? 's' : ''}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
