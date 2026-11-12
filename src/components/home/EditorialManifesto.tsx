import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const EditorialManifesto: React.FC = () => {
  const { goToCatalog, products } = useStore();
  const publishedCount = products.filter((p) => p.published).length;

  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-[#121110] text-white border-y border-[#26221E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left: Real client piece showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[4/5] rounded-sm overflow-hidden bg-[#1C1916] border border-[#2E2924]">
              <img
                src="/products/jean-carpenter-denim.jpg"
                alt="Jean Brut Carpenter"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[10px] tracking-widest uppercase text-[#B85D19] font-bold block mb-0.5">
                  Atelier & Sélection
                </span>
                <p className="font-display font-medium text-xs sm:text-sm text-zinc-200">
                  Jean Brut Carpenter • Denim lourd 380 g/m²
                </p>
              </div>
            </div>
          </div>

          {/* Right: Clean Editorial Copy */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#B85D19] block mb-1">
                Manifeste
              </span>
              <h2 className="font-display font-bold text-xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                L'assurance d'une allure soignée, sans superflu.
              </h2>
            </div>

            <p className="text-zinc-400 text-xs sm:text-base leading-relaxed font-normal">
              CAPOSTORE221 repose sur un modèle clair : sélectionner des pièces contemporaines aux finitions irréprochables et vous les livrer directement. Sans intermédiaire ni contrainte de boutique physique, chaque article commandé est validé avec vous et acheminé avec soin.
            </p>

            {/* 2 Clean Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-[#26221E]">
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-200">
                  Matières & Tenue
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Cotons peignés, toiles denim épaisses et montures en acétate italien sélectionnées pour leur résistance dans le temps.
                </p>
              </div>
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-200">
                  Tu commandes, on te livre
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Validation personnalisée par WhatsApp ou téléphone dès réception de votre commande, puis livraison rapide chez vous.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => goToCatalog({ category: 'tous' })}
                className="bg-white hover:bg-zinc-200 text-[#141210] px-5 py-3 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 rounded-sm transition-colors"
              >
                <span>Voir toutes les pièces ({publishedCount} articles)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
