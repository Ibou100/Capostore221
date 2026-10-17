import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Hero: React.FC = () => {
  const { goToCatalog } = useStore();

  return (
    <section className="relative w-full bg-capo-black text-white overflow-hidden min-h-[82vh] flex items-center">
      {/* Background Editorial Image with subtle cinematic overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85"
          alt="Éditorial Mode CAPO221 Dakar"
          className="w-full h-full object-cover object-center brightness-[0.75] contrast-[1.05] scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Editorial gradient shadows for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-capo-black via-capo-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-capo-black/80 via-capo-black/30 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-2xl">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs uppercase tracking-widest text-zinc-200 mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-capo-accent" />
            <span>Maison Contemporaine • Dakar, Sénégal</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tightest leading-[1.05] text-white uppercase text-balance mb-6">
            Ton style.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              Tes règles.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-zinc-300 font-normal leading-relaxed mb-8 max-w-xl text-balance">
            Découvre les pièces qui affirment ta personnalité. Une vision singulière du streetwear d'avant-garde et de l'élégance urbaine dakaroise.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => goToCatalog({ category: 'tous' })}
              className="group bg-white text-capo-black hover:bg-zinc-100 px-8 py-4 rounded-none font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl"
            >
              <span>Explorer la collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => goToCatalog({ category: 'tous' })}
              className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-8 py-4 rounded-none font-display font-medium text-xs uppercase tracking-widest transition-all duration-300 backdrop-blur-sm"
            >
              Découvrir les nouveautés
            </button>
          </div>

          {/* Editorial Key Values */}
          <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-3 gap-4 text-left">
            <div>
              <p className="font-display font-bold text-xl sm:text-2xl text-white">100%</p>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider mt-0.5">Designs Exclusifs</p>
            </div>
            <div>
              <p className="font-display font-bold text-xl sm:text-2xl text-white">24H</p>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider mt-0.5">Dakar Express</p>
            </div>
            <div>
              <p className="font-display font-bold text-xl sm:text-2xl text-white">FCFA</p>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider mt-0.5">Prix Transparents</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
