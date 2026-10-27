import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Hero: React.FC = () => {
  const { goToCatalog } = useStore();

  return (
    <section className="relative w-full bg-[#FAF7F2] text-[#141210] border-b border-[#E8DFD5] overflow-hidden">
      {/* Subtle warm African decorative accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#B85D19] via-[#D49A3D] to-[#141210]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Clean Editorial Typography */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Teranga Dakar Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDE5D8] border border-[#D9CEBE] text-xs font-semibold tracking-wider text-[#7A3E12] uppercase">
              <span className="text-sm">🇸🇳</span>
              <span>Dakar 221 • Mode Urbaine & Streetwear Chic</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-[#141210] uppercase">
              L'Élégance Urbaine <br />
              <span className="text-[#B85D19] font-serif italic normal-case">au cœur de Dakar.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#4A453E] leading-relaxed max-w-xl font-normal">
              Découvrez notre sélection exclusive de pièces de caractère disponibles immédiatement à Dakar. Chinos tailleur, cargos écru, chemises légères, montures en acétate et maroquinerie soignée.
            </p>

            {/* Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-2">
              <div className="flex items-center gap-2 text-xs text-[#2E2A25] font-medium">
                <Truck className="w-4 h-4 text-[#B85D19] shrink-0" />
                <span>Livraison Dakar 24h</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#2E2A25] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#B85D19] shrink-0" />
                <span>100% Photos Réelles</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#2E2A25] font-medium">
                <Sparkles className="w-4 h-4 text-[#B85D19] shrink-0" />
                <span>Wave & Orange Money</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => goToCatalog({ category: 'tous' })}
                className="bg-[#141210] hover:bg-[#2C2723] text-white px-7 py-3.5 font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <span>Voir le catalogue (21 pièces)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/221770000000?text=Bonjour%20CAPOSTORE221,%20je%20souhaite%20d%C3%A9couvrir%20vos%20pi%C3%A8ces%20disponibles"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3.5 font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Commander sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Genuine Client Products Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-[#EDE5D8]/70 border border-[#D9CEBE] p-4 sm:p-5 rounded-sm shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                {/* Main Featured Photo: Prince de Galles */}
                <div 
                  onClick={() => goToCatalog({ category: 'vetements' })}
                  className="col-span-2 relative aspect-[16/11] rounded-sm overflow-hidden bg-white border border-[#D9CEBE] cursor-pointer group"
                >
                  <img
                    src="/products/pantalon-prince-galles.jpg"
                    alt="Pantalon Prince de Galles Almadies"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#B85D19] text-white inline-block mb-1">
                      Pièce Phare
                    </span>
                    <p className="text-xs sm:text-sm font-bold truncate">Pantalon Prince de Galles « Almadies »</p>
                    <p className="text-xs text-[#E8DFD5] font-semibold">32 000 FCFA</p>
                  </div>
                </div>

                {/* Second Photo: Lunettes Acétate */}
                <div 
                  onClick={() => goToCatalog({ category: 'lunettes' })}
                  className="relative aspect-square rounded-sm overflow-hidden bg-white border border-[#D9CEBE] cursor-pointer group"
                >
                  <img
                    src="/products/monture-lunettes-acetate-bordeaux.jpg"
                    alt="Monture Optique Acétate Sculpté"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <p className="text-[11px] font-bold truncate">Lunettes Acétate</p>
                    <p className="text-[11px] text-[#E8DFD5] font-semibold">42 000 FCFA</p>
                  </div>
                </div>

                {/* Third Photo: Pochette XQR Cuir */}
                <div 
                  onClick={() => goToCatalog({ category: 'accessoires' })}
                  className="relative aspect-square rounded-sm overflow-hidden bg-white border border-[#D9CEBE] cursor-pointer group"
                >
                  <img
                    src="/products/pochette-cuir-dragonne-xqr.png"
                    alt="Pochette Cuir Matelassé XQR"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <p className="text-[11px] font-bold truncate">Pochette Cuir XQR</p>
                    <p className="text-[11px] text-[#E8DFD5] font-semibold">35 000 FCFA</p>
                  </div>
                </div>
              </div>

              {/* Floating Quality Tag */}
              <div className="absolute -bottom-3 -right-3 bg-[#141210] text-white px-3 py-1.5 border border-[#D49A3D] shadow-md text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block animate-pulse" />
                <span>Disponible à Dakar</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
