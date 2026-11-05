import React, { useState } from 'react';
import { ArrowRight, MessageCircle, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import { formatFCFA } from '../../utils/format';

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
  const { goToProduct, goToCatalog, products } = useStore();
  const { openQuickOrder } = useOrders();

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

  const handleHeroQuickOrder = () => {
    const matched = products.find((p) => p.id === currentPiece.id);
    if (matched) {
      openQuickOrder(matched);
    } else {
      openQuickOrder({
        id: currentPiece.id,
        name: currentPiece.name,
        slug: currentPiece.id,
        category: 'vetements',
        subCategory: currentPiece.category,
        gender: 'homme',
        price: currentPiece.price,
        images: [currentPiece.image],
        description: currentPiece.material,
        details: [],
        variants: [],
        stock: 10,
        published: true,
        createdAt: '2026-10-25',
      });
    }
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#FAF8F5] via-[#F5F2EB] to-[#FAF8F5] border-b border-[#E7E2D9] overflow-hidden py-8 sm:py-12 lg:py-20">
      {/* Decorative ambient subtle glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-400/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top subtle category indicator */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 mb-6 sm:mb-10 border-b border-[#E2DDD3] text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#B85D19] animate-pulse" />
            <span className="font-extrabold uppercase tracking-[0.2em] text-[#0C0A09] text-[10px] sm:text-xs">
              Maison CapoStore221 • Dakar
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-stone-500 font-medium text-[11px] uppercase tracking-wider">
            <span className="px-2.5 py-0.5 rounded-full bg-stone-200/60 text-stone-700 font-bold">Stock Réel</span>
            <span>Tu commandes, on te livre</span>
          </div>
        </div>

        {/* Main Grid: Left Manifesto & CTAs | Right Curated Piece Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 text-left space-y-5 sm:space-y-7">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B85D19] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <span>Édition Urbaine & Tailleur 2026</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#0C0A09] tracking-tight leading-[1.08]">
                L'allure contemporaine, <span className="gold-gradient-text block sm:inline">livrée chez vous.</span>
              </h1>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal max-w-lg">
                Des coupes impeccables, des toiles denses et des finitions soignées. Vous commandez en ligne en 1 clic, nous préparons et assurons la livraison rapide directement chez vous à Dakar et dans tout le Sénégal.
              </p>
            </div>

            {/* Price Pill Highlights */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-1">
              <div className="px-3.5 py-2 bg-white/90 backdrop-blur-xs border border-stone-200 rounded-xl text-xs text-stone-800 shadow-2xs flex items-center gap-2">
                <span className="font-extrabold text-[#0C0A09] text-sm">5 000 FCFA</span>
                <span className="text-[11px] text-stone-400 line-through">8 500 F</span>
                <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  -41%
                </span>
                <span className="text-stone-500 font-medium ml-1">Pantalons & Chemises</span>
              </div>
              <div className="px-3.5 py-2 bg-white/90 backdrop-blur-xs border border-stone-200 rounded-xl text-xs text-stone-800 shadow-2xs flex items-center gap-2">
                <span className="font-extrabold text-[#0C0A09] text-sm">3 000 FCFA</span>
                <span className="text-[11px] text-stone-400 line-through">5 000 F</span>
                <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  -40%
                </span>
                <span className="text-stone-500 font-medium ml-1">Lunettes & Sacs</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => goToCatalog({ category: 'tous' })}
                className="bg-[#0C0A09] hover:bg-[#1E1B18] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 group cursor-pointer"
              >
                <span>Explorer la Collection (23 pièces)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={handleHeroQuickOrder}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Commander direct (WhatsApp)</span>
              </button>
            </div>

            {/* Quick Reassurance Ticker */}
            <div className="pt-4 flex flex-wrap items-center gap-5 sm:gap-7 text-xs text-stone-600 border-t border-[#E5DFD4]">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                Photos 100% réelles
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                Livraison Dakar 2h-4h
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                Wave, OM & Espèces
              </span>
            </div>
          </div>

          {/* Right Column: Featured Studio Stage with interactive garment selector */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all">
              
              {/* Product Visual Container */}
              <div
                onClick={() => goToProduct(currentPiece.id)}
                className="relative aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/5] bg-gradient-to-b from-[#FAF8F5] to-[#F2EFE8] p-6 sm:p-10 flex items-center justify-center cursor-pointer group border-b border-stone-200/80"
              >
                <img
                  src={currentPiece.image}
                  alt={currentPiece.name}
                  className="w-full h-full max-h-[280px] sm:max-h-[440px] object-contain drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />

                {/* Badge on Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                  <span className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-[#0C0A09] text-white rounded-full shadow-sm">
                    {currentPiece.badge}
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#f68b1e] text-white rounded shadow-sm">
                    {currentPiece.price === 5000 ? '-41% Promo' : '-40% Promo'}
                  </span>
                </div>

                {/* Clickable prompt */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200 text-xs font-bold text-stone-900 flex items-center gap-1.5 shadow-md group-hover:bg-[#0C0A09] group-hover:text-white transition-all">
                  <span>Voir la fiche</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Garment Details & Switcher Tabs */}
              <div className="p-4 sm:p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-[#B85D19] font-bold truncate">
                    {currentPiece.category}
                  </p>
                  <h3 className="font-display font-extrabold text-sm sm:text-lg text-stone-900 truncate mt-0.5">
                    {currentPiece.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display font-black text-base sm:text-xl text-[#0C0A09]">
                      {formatFCFA(currentPiece.price)}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      {formatFCFA(currentPiece.price === 5000 ? 8500 : 5000)}
                    </span>
                  </div>
                </div>

                {/* Interactive Visual Thumbnail Garment Switcher */}
                <div className="flex items-center gap-2 shrink-0">
                  {featuredPieces.map((piece, idx) => (
                    <button
                      key={piece.id}
                      onClick={() => setActivePieceIndex(idx)}
                      className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                        activePieceIndex === idx
                          ? 'border-[#B85D19] ring-2 ring-[#B85D19]/30 scale-105'
                          : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`Voir ${piece.name}`}
                      title={piece.name}
                    >
                      <img
                        src={piece.image}
                        alt={piece.name}
                        className="w-full h-full object-cover rounded-lg bg-stone-100"
                      />
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
