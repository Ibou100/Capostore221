import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const EditorialStoryView: React.FC = () => {
  const { goToCatalog, goToHome } = useStore();

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <button
          onClick={goToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-black mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour à l'accueil</span>
        </button>

        {/* Editorial Title */}
        <div className="space-y-4 mb-12 text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#B85D19]">
            CAPOSTORE221 • À Propos
          </span>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-zinc-900 tracking-tight leading-tight">
            L'Exigence du Vestiaire Moderne
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl">
            L'histoire d'un vestiaire contemporain pensé pour allier coupes soignées, matières durables et simplicité de commande.
          </p>
        </div>

        {/* Editorial Photo */}
        <div className="aspect-[16/9] bg-[#FAF8F5] rounded-sm overflow-hidden mb-12 border border-[#E7E2D9]">
          <img
            src="/products/pantalon-cargo-ecru.jpg"
            alt="CAPOSTORE221"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Text Sections */}
        <div className="space-y-8 text-zinc-700 leading-relaxed font-normal text-sm sm:text-base text-left">
          <p>
            <strong className="font-semibold text-zinc-900">Tu commandes, on te livre.</strong> Notre modèle est pensé pour vous simplifier la vie : vous explorez le catalogue en ligne, vous choisissez vos pièces coups de cœur, et nous assurons la validation, la préparation et la livraison rapide directement chez vous.
          </p>

          <p>
            Fondée avec l'ambition d'offrir des vêtements de haute qualité accessibles à tous sans contrainte de magasin physique, <strong className="font-semibold text-zinc-900">CAPOSTORE221</strong> puise sa force dans une sélection rigoureuse : des coupes impeccables, des toiles denses et des matières adaptées au quotidien.
          </p>

          {/* Quote Block */}
          <div className="p-6 my-8 bg-white border-l-2 border-[#141210] border border-zinc-200/80 rounded-sm">
            <p className="font-display font-medium text-lg sm:text-xl text-zinc-900 italic mb-2">
              « Le style contemporain ne réside pas dans l'ostentation, mais dans la justesse d'une coupe, la densité d'un textile et l'assurance de porter une pièce authentique. »
            </p>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              — CAPOSTORE221
            </span>
          </div>

          <h2 className="font-display font-bold text-xl sm:text-2xl text-zinc-900 tracking-tight pt-4">
            Nos Engagements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 bg-white border border-[#E7E2D9] rounded-sm">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2">
                Grammages Lourds & Toiles Résistantes
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Nos chemises, pantalons et cargos privilégient des cotons denses et des sergés robustes qui conservent leur tenue au fil du temps.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7E2D9] rounded-sm">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2">
                Montures en Acétate & Verres Protecteurs
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Nos montures optiques et solaires sont taillées dans des acétates biseautés aux charnières solides pour un confort optimal.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7E2D9] rounded-sm">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2">
                Maroquinerie Sélectionnée
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Nos pochettes et sacoches privilégient des cuirs texturés et des nylons renforcés, pensés pour vous accompagner au quotidien.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7E2D9] rounded-sm">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2">
                Livraison Directe & Paiement Simple
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Validation par WhatsApp ou téléphone, acheminement rapide et paiement flexible par Wave, Orange Money ou à la remise.
              </p>
            </div>
          </div>

          <div className="pt-8 text-center sm:text-left">
            <button
              onClick={() => goToCatalog({ category: 'tous' })}
              className="bg-[#141210] hover:bg-[#2C2723] text-white px-7 py-3.5 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 rounded-sm transition-colors shadow-sm"
            >
              <span>Découvrir la collection (23 pièces)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
