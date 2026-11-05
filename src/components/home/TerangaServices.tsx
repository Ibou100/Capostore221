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
    <section className="py-10 sm:py-16 lg:py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-stone-200/60 gap-3 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[#B85D19] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <span>L'Expérience CapoStore221</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0C0A09] tracking-tight">
              Tu commandes, on te livre.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md leading-relaxed">
            Un service de vente en ligne d'excellence sans boutique physique : vous choisissez vos pièces en toute confiance, nous gérons la livraison sécurisée à domicile.
          </p>
        </div>

        {/* 4 Luxury Pillars: 2x2 on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-white border border-stone-200/80 hover:border-[#B85D19]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-black text-[#B85D19] bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {pillar.number}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white border border-stone-200/90 text-stone-800 flex items-center justify-center shadow-2xs group-hover:bg-[#0C0A09] group-hover:text-amber-400 group-hover:border-[#0C0A09] transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-stone-900 mb-1.5 group-hover:text-[#B85D19] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
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
