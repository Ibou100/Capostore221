import React from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const EditorialManifesto: React.FC = () => {
  const { goToCatalog } = useStore();

  return (
    <section className="py-16 lg:py-20 bg-[#191614] text-white relative overflow-hidden border-y border-[#38322D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Real client piece showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-[#24201C] border border-[#3E3731]">
              <img
                src="/products/jean-carpenter-denim.jpg"
                alt="Jean Brut Carpenter Dakar Denim 221"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Badge on image */}
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-[10px] tracking-widest uppercase text-[#D49A3D] font-bold block mb-1">
                  🇸🇳 Fait pour Dakar • CAPOSTORE221
                </span>
                <p className="font-display font-medium text-base text-white">
                  L'assurance d'une allure qui n'a pas besoin de crier pour être remarquée.
                </p>
              </div>
            </div>

            {/* Floating quote badge */}
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-44 bg-[#26221D] border border-[#473E36] p-4 rounded-sm shadow-xl">
              <Quote className="w-5 h-5 text-[#B85D19] mb-1.5 opacity-90" />
              <p className="text-[11px] text-[#D8CEBF] leading-relaxed">
                « Ni suiveur, ni imitateur. CAPOSTORE221 impose son propre rythme sur le bitume dakarois. »
              </p>
            </div>
          </div>

          {/* Right: Clean Editorial Copy */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2C2723] border border-[#4A413A] text-xs font-semibold tracking-widest uppercase text-[#D49A3D]">
              <span>L'Esprit de la Maison</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight uppercase">
              L'Élégance Dakaroise <br />
              <span className="text-[#B85D19] font-serif italic normal-case">simple & assumée.</span>
            </h2>

            <p className="text-[#CFC4B5] text-sm sm:text-base leading-relaxed">
              CAPOSTORE221 est né d'une conviction simple : la mode dakaroise mérite des pièces à la hauteur de son énergie culturelle. Nous sélectionnons des coupes actuelles, des toiles de qualité et des finitions impeccables pour vous accompagner du bureau aux Almadies.
            </p>

            {/* 2 Simple Value Columns */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#38322D]">
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D49A3D]">Matières & Tenue</h3>
                <p className="text-xs text-[#A89E90] mt-1">Cotons denses, toiles denim robustes et popelines respirantes adaptées au climat sénégalais.</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D49A3D]">Disponibilité Réelle</h3>
                <p className="text-xs text-[#A89E90] mt-1">Chaque pièce présentée est physiquement en stock à Dakar, prête pour expédition immédiate.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => goToCatalog({ category: 'tous' })}
                className="bg-[#B85D19] hover:bg-[#A35014] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <span>Explorer la boutique (21 pièces)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
