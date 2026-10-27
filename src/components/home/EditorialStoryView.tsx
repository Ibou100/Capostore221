import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const EditorialStoryView: React.FC = () => {
  const { goToCatalog, goToHome } = useStore();

  return (
    <div className="bg-white min-h-screen py-12">
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
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            <Sparkles className="w-3.5 h-3.5 text-capo-accent" />
            <span>Maison CAPOSTORE221 • Dakar, Sénégal</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-capo-black tracking-tightest leading-tight uppercase">
            Ton Style.<br />
            <span className="italic font-light text-zinc-500">Tes Règles.</span>
          </h1>

          <p className="text-lg text-zinc-600 font-light leading-relaxed max-w-2xl">
            L'histoire d'un vestiaire audacieux qui refuse les compromis entre l'élégance formelle et l'énergie brute de la jeunesse ouest-africaine.
          </p>
        </div>

        {/* Editorial Photo - Real Client Product */}
        <div className="aspect-[16/9] bg-[#EDE5D8] rounded-sm overflow-hidden mb-12 border border-[#D9CEBE]">
          <img
            src="/products/pantalon-cargo-ecru.jpg"
            alt="Maison CAPOSTORE221 Dakar Atelier"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Text Sections */}
        <div className="space-y-8 text-zinc-800 leading-relaxed font-light text-base sm:text-lg">
          <p>
            <strong className="font-semibold text-capo-black">Dakar ne dort jamais vraiment.</strong> Entre la brise atlantique des Almadies, la ferveur créative du Plateau et l'agitation vibrante de la Médina, un nouveau langage vestimentaire s'est imposé. Ni purement traditionnel, ni simple reflet des tendances importées : un streetwear d'auteur, pensé avec rigueur.
          </p>

          <p>
            Fondée avec l'ambition d'élever le vestiaire urbain au rang de haute confection accessible, <strong className="font-semibold text-capo-black">CAPOSTORE221</strong> puise sa force dans une équation précise : la structure des coupes tailleur européennes rencontre la générosité des volumes décontractés et les exigences thermiques tropicales.
          </p>

          {/* Quote Block */}
          <div className="p-8 my-8 bg-zinc-50 border-l-2 border-capo-black">
            <p className="font-display font-medium text-xl sm:text-2xl text-zinc-900 italic mb-2">
              « Le luxe contemporain ne réside pas dans l'ostentation d'un logo, mais dans la justesse d'une ligne, la densité d'un textile et l'assurance avec laquelle vous traversez la ville. »
            </p>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              — Direction de Création CAPOSTORE221
            </span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-capo-black uppercase tracking-tight pt-4">
            Nos Engagements Fondamentaux
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 border border-zinc-200 rounded-sm">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-black mb-2">
                Grammages Lourds & Tenue Irréprochable
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Tous nos hauts utilisent des cotons peignés de 280 à 450 GSM qui conservent leur structure après chaque lavage, évitant l'effet relâché des vêtements ordinaires.
              </p>
            </div>

            <div className="p-6 border border-zinc-200 rounded-sm">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-black mb-2">
                Acétates Italiens & Verres UV400
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Nos solaires sont taillées dans des plaques d'acétate de cellulose biocompatible avec des charnières inox rivetées pour une robustesse à toute épreuve.
              </p>
            </div>

            <div className="p-6 border border-zinc-200 rounded-sm">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-black mb-2">
                Cuirs Pleine Fleur Artisanaux
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Nos souliers et pièces de maroquinerie privilégient les peaux denses au tannage soigné, conçues pour s'embellir et se patiner au fil des années.
              </p>
            </div>

            <div className="p-6 border border-zinc-200 rounded-sm">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-black mb-2">
                Tarification Transparente en FCFA
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Chaque prix affiché en Francs CFA (XOF) est clair, sans frais cachés à la livraison, avec un service de conciergerie à votre écoute 7 jours sur 7.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="pt-12 mt-12 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-lg text-black uppercase">Prêt(e) à affirmer votre allure ?</h3>
              <p className="text-xs text-zinc-500">Découvrez l'ensemble de nos pièces disponibles immédiatement.</p>
            </div>
            <button
              onClick={() => goToCatalog({ category: 'tous' })}
              className="px-8 py-4 bg-capo-black text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-colors shrink-0"
            >
              <span>Accéder au catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
