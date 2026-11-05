import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const EditorialManifesto: React.FC = () => {
  const { goToCatalog } = useStore();

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-[#0C0A09] text-white border-y border-[#24201C] relative overflow-hidden">
      {/* Ambient background gold glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-amber-600/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Real client piece showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-[#181614] border border-stone-800 shadow-2xl group">
              <img
                src="/products/jean-carpenter-denim.jpg"
                alt="Jean Brut Carpenter"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <span className="text-[10px] tracking-[0.2em] uppercase text-amber-400 font-bold block mb-1">
                  Atelier Dakar • Sélection Signature
                </span>
                <p className="font-display font-extrabold text-sm sm:text-base text-white">
                  Jean Brut Carpenter • Denim lourd 380 g/m²
                </p>
                <p className="text-xs text-stone-300 mt-1">
                  Coupe droite structurée, surpiqûres renforcées
                </p>
              </div>
            </div>
          </div>

          {/* Right: Clean Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                <span>Le Manifeste CapoStore221</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.12]">
                L'assurance d'une allure soignée, <span className="gold-gradient-text">sans superflu.</span>
              </h2>
            </div>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-normal">
              CAPOSTORE221 repose sur un modèle d'avant-garde : sélectionner des pièces masculines contemporaines aux toiles exceptionnelles et vous les livrer directement à domicile. Sans intermédiaire ni contrainte de boutique physique, chaque commande est validée avec vous et livrée avec le plus grand soin.
            </p>

            {/* 2 Clean Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7 pt-4 sm:pt-6 border-t border-stone-800">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-amber-400 mb-1">
                  Matières & Noblesse
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Cotons peignés, toiles denim épaisses et montures en acétate italien sélectionnées pour leur résistance et leur tenue parfaite.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-amber-400 mb-1">
                  Tu commandes, on te livre
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Validation personnalisée par WhatsApp ou téléphone dès l'enregistrement de votre commande, puis livraison express à Dakar.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => goToCatalog({ category: 'tous' })}
                className="bg-white hover:bg-stone-100 text-[#0C0A09] px-7 py-3.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Découvrir tout le vestiaire (23 articles)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
