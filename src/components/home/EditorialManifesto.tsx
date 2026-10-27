import React from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const EditorialManifesto: React.FC = () => {
  const { goToEditorial, goToCatalog } = useStore();

  return (
    <section className="py-24 bg-capo-black text-white relative overflow-hidden border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
                alt="Manifeste Éditorial CAPOSTORE221"
                className="w-full h-full object-cover object-center filter grayscale contrast-125"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Badge on image */}
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] tracking-widest uppercase text-capo-accent font-semibold block mb-1">
                  Édition Limitée • CAPOSTORE221
                </span>
                <p className="font-display font-medium text-lg text-white">
                  L'assurance d'une allure qui n'a pas besoin de crier pour être remarquée.
                </p>
              </div>
            </div>

            {/* Floating accent block */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-5 rounded-sm shadow-2xl">
              <Quote className="w-8 h-8 text-capo-accent mb-2 opacity-80" />
              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                « Ni suiveur, ni imitateur. CAPOSTORE221 impose son propre rythme sur le bitume dakarois. »
              </p>
            </div>
          </div>

          {/* Right Editorial Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[11px] tracking-widest uppercase text-zinc-400">
              <span>Manifeste de la Marque</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tightest leading-tight uppercase">
              L'Élégance <br className="hidden sm:inline" />
              <span className="text-zinc-400 font-light italic">sans compromis.</span>
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              CAPOSTORE221 est né d'une conviction simple : la mode dakaroise mérite des pièces à la hauteur de son énergie culturelle. Nous fusionnons la structure intemporelle du tailoring haut de gamme avec l'urgence brute du streetwear international.
            </p>

            <p className="text-zinc-400 text-sm leading-relaxed">
              Chaque coupe est travaillée pour libérer le mouvement, chaque matière est sélectionnée pour résister au temps et sublimer votre présence. Pas de logos envahissants, pas d'artifices éphémères : seulement la pureté des lignes et l'affirmation de soi.
            </p>

            {/* Pillars */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white">Matières Nobles</h3>
                <p className="text-xs text-zinc-400 mt-1">Cotons denses 280-450 GSM, cuirs nappa et acétates italiens découpés main.</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white">Création Locale</h3>
                <p className="text-xs text-zinc-400 mt-1">Conception et finitions réalisées en lien étroit avec nos artisans dakarois.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={goToEditorial}
                className="bg-white text-capo-black hover:bg-zinc-200 px-7 py-3.5 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-colors"
              >
                <span>Lire le manifeste complet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => goToCatalog({ category: 'vetements' })}
                className="text-zinc-300 hover:text-white px-5 py-3.5 text-xs font-semibold uppercase tracking-wider border border-zinc-800 hover:border-zinc-600 transition-colors"
              >
                Explorer les créations
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
