import React, { useState } from 'react';
import { ArrowRight, MessageCircle, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA, getWhatsAppOrderLink } from '../../utils/format';

interface FeaturedHeroItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  material: string;
  badge: string;
}

export const Hero: React.FC = () => {
  const { goToProduct, goToCatalog } = useStore();

  const featuredPieces: FeaturedHeroItem[] = [
    {
      id: 'capo-client-001',
      name: 'Pantalon Tailleur Prince de Galles',
      category: 'Pantalons & Tailleur',
      price: 5000,
      image: '/products/pantalon-prince-galles.jpg',
      material: 'Sergé peigné & liseré signature',
      badge: 'Best-Seller',
    },
    {
      id: 'capo-client-016',
      name: 'Chemise Oxford Slim Fit Bleu Azur',
      category: 'Chemises & Hauts',
      price: 5000,
      image: '/products/chemise-oxford-bleu-azur.png',
      material: '100% Coton tissage Oxford lourd',
      badge: 'Nouveauté',
    },
    {
      id: 'capo-client-018',
      name: 'Monture Optique Acétate Sculpté',
      category: 'Lunettes & Montures',
      price: 3000,
      image: '/products/monture-lunettes-acetate-bordeaux.jpg',
      material: 'Acétate biseauté & armatures ciselées',
      badge: 'Édition Créateur',
    },
    {
      id: 'capo-client-021',
      name: 'Pochette à Main Cuir Matelassé XQR',
      category: 'Maroquinerie & Pochettes',
      price: 3000,
      image: '/products/pochette-cuir-dragonne-xqr.png',
      material: 'Cuir pleine fleur ébène & dragonne',
      badge: 'Accessoire',
    },
  ];

  const [activePieceIndex, setActivePieceIndex] = useState(0);
  const currentPiece = featuredPieces[activePieceIndex];
  const whatsappLink = getWhatsAppOrderLink(currentPiece.name, currentPiece.price);

  return (
    <section className="relative w-full bg-[#FAF8F5] border-b border-[#E7E2D9] overflow-hidden py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top subtle category indicator */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E7E2D9] text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B85D19]" />
            <span className="font-semibold uppercase tracking-widest text-zinc-900 text-[11px]">
              Collection 2026 • CAPOSTORE221
            </span>
          </div>
          <p className="hidden sm:block text-zinc-500 font-medium text-[11px] uppercase tracking-wider">
            Vente en ligne • Tu commandes, on te livre
          </p>
        </div>

        {/* Main Grid: Left Manifesto & CTAs | Right Curated Piece Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div className="space-y-3">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#B85D19]">
                Mode Urbaine & Tailleur
              </span>
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#141210] tracking-tight leading-[1.08]">
                L'allure contemporaine, livrée chez vous.
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal max-w-lg">
                Des coupes impeccables, des toiles denses et des finitions soignées. Vous commandez en ligne, nous validons et assurons la livraison rapide directement à votre porte.
              </p>
            </div>

            {/* Price Pill Highlights */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="px-3.5 py-1.5 bg-white border border-[#E7E2D9] rounded-sm text-xs text-zinc-800">
                <span className="font-bold text-[#141210]">5 000 FCFA</span>
                <span className="text-zinc-500 ml-1.5">Pantalons & Chemises</span>
              </div>
              <div className="px-3.5 py-1.5 bg-white border border-[#E7E2D9] rounded-sm text-xs text-zinc-800">
                <span className="font-bold text-[#141210]">3 000 FCFA</span>
                <span className="text-zinc-500 ml-1.5">Lunettes & Sacs</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => goToCatalog({ category: 'tous' })}
                className="bg-[#141210] hover:bg-[#2C2723] text-white px-7 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Explorer le vestiaire (23 pièces)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-zinc-50 text-zinc-900 border border-[#D9D3C7] px-5 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Commander sur WhatsApp</span>
              </a>
            </div>

            {/* Quick Reassurance Ticker */}
            <div className="pt-4 flex items-center gap-6 text-[11px] text-zinc-500 border-t border-[#EAE5DC]">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-zinc-700" />
                Photos 100% réelles
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-zinc-700" />
                Paiement Wave, OM & espèces
              </span>
            </div>
          </div>

          {/* Right Column: Featured Studio Stage with interactive garment selector */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-[#E7E2D9] rounded-sm overflow-hidden shadow-sm">
              
              {/* Product Visual Container */}
              <div
                onClick={() => goToProduct(currentPiece.id)}
                className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] bg-[#FAF8F5] p-6 sm:p-10 flex items-center justify-center cursor-pointer group border-b border-[#EAE5DC]"
              >
                <img
                  src={currentPiece.image}
                  alt={currentPiece.name}
                  className="w-full h-full max-h-[460px] object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-103"
                />

                {/* Badge on Image */}
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#141210] text-white rounded-sm">
                    {currentPiece.badge}
                  </span>
                </div>

                {/* Clickable prompt */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-zinc-200 text-[11px] font-semibold text-zinc-900 flex items-center gap-1.5 shadow-sm group-hover:bg-[#141210] group-hover:text-white transition-colors">
                  <span>Voir la fiche</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Garment Details & Switcher Tabs */}
              <div className="p-4 sm:p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                    {currentPiece.category} • {currentPiece.material}
                  </p>
                  <h3 className="font-display font-bold text-base text-zinc-900 mt-0.5">
                    {currentPiece.name}
                  </h3>
                  <p className="font-bold text-base text-[#141210] mt-1">
                    {formatFCFA(currentPiece.price)}
                  </p>
                </div>

                {/* Garment Selector Tabs */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {featuredPieces.map((piece, idx) => (
                    <button
                      key={piece.id}
                      onClick={() => setActivePieceIndex(idx)}
                      className={`w-9 h-9 rounded-sm border text-xs font-bold transition-all flex items-center justify-center ${
                        activePieceIndex === idx
                          ? 'bg-[#141210] text-white border-[#141210]'
                          : 'bg-[#FAF8F5] text-zinc-600 border-[#E7E2D9] hover:border-zinc-900'
                      }`}
                      aria-label={`Voir pièce ${idx + 1}`}
                      title={piece.name}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
