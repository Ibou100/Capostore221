import React from 'react';
import { ShoppingBag, CheckCircle2, Truck, CreditCard } from 'lucide-react';

export const TerangaServices: React.FC = () => {
  const pillars = [
    {
      number: '01',
      title: 'Sélection Vérifiée',
      desc: 'Photos 100% réelles de chaque pièce. Toiles robustes, cotons denses et coupes soignées.',
      icon: ShoppingBag,
    },
    {
      number: '02',
      title: 'Commande en 1 Clic',
      desc: 'Commandez directement sur le site ou via WhatsApp (76 832 11 57) et par appel (77 256 39 90).',
      icon: CheckCircle2,
    },
    {
      number: '03',
      title: 'Livraison Rapide',
      desc: 'Votre colis est préparé sans délai et expédié directement à l’adresse de votre choix.',
      icon: Truck,
    },
    {
      number: '04',
      title: 'Paiement Flexible',
      desc: 'Réglez en toute sérénité par Wave, Orange Money ou en espèces à la réception.',
      icon: CreditCard,
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 pb-3 sm:pb-4 border-b border-[#EFECE5] gap-2 sm:gap-4 text-left">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#B85D19] mb-0.5">
              Fonctionnement
            </p>
            <h2 className="font-display font-extrabold text-xl sm:text-3xl text-zinc-900 tracking-tight">
              Tu commandes, on te livre
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
            Un service de vente en ligne direct. Vous choisissez vos pièces, nous assurons la livraison directement chez vous.
          </p>
        </div>

        {/* 4 Clean Pillars: 2x2 on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 text-left">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="p-3 sm:p-5 rounded-sm bg-[#FAF8F5] border border-[#E7E2D9] hover:border-zinc-900 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-zinc-400">
                      {pillar.number}
                    </span>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-800" />
                  </div>
                  <h3 className="font-display font-bold text-xs sm:text-sm text-zinc-900 mb-1 sm:mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
