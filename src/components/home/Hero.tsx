import React from 'react';
import { ArrowRight, Smartphone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/format';
import { SmartImage } from '../ui/SmartImage';

export const Hero: React.FC = () => {
  const { goToProduct, goToCatalog, storeProducts, activeStore, switchStore } = useStore();

  const publishedStoreProducts = storeProducts.filter((p) => p.published);
  const heroProduct =
    publishedStoreProducts.find((p) => p.isFeatured) || publishedStoreProducts[0] || null;

  // Empty state for Boutique Électronique when 0 products have been added yet
  if (activeStore === 'electronique' && publishedStoreProducts.length === 0) {
    return (
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <div className="rounded-[28px] bg-[#F6F5F2] px-6 sm:px-12 py-16 sm:py-24 text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E6E1] flex items-center justify-center mx-auto text-[#0A0A0A]">
            <Smartphone className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-semibold text-3xl sm:text-5xl text-[#0A0A0A] tracking-tight">
              Les premiers produits arrivent bientôt
            </h1>
            <p className="text-base text-[#5F5F5A] max-w-md mx-auto">
              Notre sélection d'iPhones, ordinateurs et accessoires électroniques est en cours de préparation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => switchStore('mode')}
            className="h-12 px-7 rounded-full bg-[#0A0A0A] hover:bg-zinc-800 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors"
          >
            <span>Découvrir l'Habillement</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12 pb-16 sm:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Strong Editorial Headline & Actions */}
        <div className="lg:col-span-6 text-left space-y-6">
          <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-[60px] text-[#0A0A0A] tracking-tightest leading-[1.06]">
            {activeStore === 'electronique'
              ? 'La tech fiable, livrée chez vous.'
              : 'Le style qui te ressemble.'}
          </h1>

          <p className="text-base sm:text-lg text-[#5F5F5A] max-w-md leading-relaxed">
            {activeStore === 'electronique'
              ? 'Smartphones, ordinateurs et équipements sélectionnés. Tu commandes, on te livre.'
              : 'Vêtements, chaussures, parfums et accessoires. Tu commandes, on te livre.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => goToCatalog({ category: 'tous' })}
              className="h-12 px-7 rounded-full bg-[#0A0A0A] hover:bg-zinc-800 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors"
            >
              <span>Voir les nouveautés</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => goToCatalog({ category: 'tous' })}
              className="h-12 px-5 rounded-full text-sm font-medium text-[#0A0A0A] hover:text-[#C2410C] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Tout le catalogue</span>
            </button>
          </div>
        </div>

        {/* Right: ONE Large Clean Product Photo */}
        {heroProduct && (
          <div className="lg:col-span-6">
            <div
              onClick={() => goToProduct(heroProduct.id)}
              className="group cursor-pointer space-y-3"
            >
              <div className="aspect-[4/5] max-h-[480px] w-full rounded-[24px] bg-[#F6F5F2] p-6 sm:p-10 overflow-hidden flex items-center justify-center transition-shadow duration-200 group-hover:shadow-[0_12px_32px_rgba(10,10,10,0.06)]">
                <SmartImage
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  priority
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-contain mix-blend-multiply brightness-[1.03] contrast-[1.05] transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-medium text-[#0A0A0A] group-hover:text-[#C2410C] transition-colors truncate pr-4">
                  {heroProduct.name}
                </span>
                <span className="text-sm font-semibold text-[#0A0A0A] shrink-0">
                  {formatFCFA(heroProduct.price)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
