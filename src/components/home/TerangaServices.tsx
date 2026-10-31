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
    <section className="py-12 lg:py-16 bg-white border-b border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#EFECE5] gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#B85D19] mb-1">
              Fonctionnement
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-900 tracking-tight">
              Tu commandes, on te livre
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
            Un service de vente en ligne direct et transparent. Vous choisissez vos pièces, nous gérons toute la logistique jusqu'à chez vous.
          </p>
        </div>

        {/* 4 Clean Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="p-5 rounded-sm bg-[#FAF8F5] border border-[#E7E2D9] hover:border-zinc-900 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      {pillar.number}
                    </span>
                    <Icon className="w-4 h-4 text-zinc-800" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-zinc-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
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
