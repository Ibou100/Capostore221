import React, { useState } from 'react';
import { ArrowRight, MessageCircle, Check, Smartphone, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import { formatFCFA } from '../../utils/format';
import { getProductStoreType } from '../../data/products';

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
  const { goToProduct, goToCatalog, products, storeProducts, activeStore, switchStore } = useStore();
  const { openQuickOrder } = useOrders();
  const publishedStoreProducts = storeProducts.filter((p) => p.published);
  const publishedCount = publishedStoreProducts.length;
  const modeCount = products.filter((p) => p.published && getProductStoreType(p) === 'mode').length;
  const techCount = products.filter((p) => p.published && getProductStoreType(p) === 'electronique').length;

  const baseFeaturedPieces: FeaturedHeroItem[] = [
    {
      id: 'capo-client-001',
      name: 'Pantalon tailleur Prince de Galles',
      category: 'Pantalons & Tailleur',
      price: 5000,
      image: '/products/pantalon-prince-galles.jpg',
      material: 'Sergé peigné & liseré signature',
      badge: 'Best-Seller',
    },
    {
      id: 'capo-client-016',
      name: 'Chemise Oxford bleu azur',
      category: 'Chemises & Hauts',
      price: 5000,
      image: '/products/chemise-oxford-bleu-azur.png',
      material: '100% Coton tissage Oxford lourd',
      badge: 'Nouveauté',
    },
    {
      id: 'capo-client-018',
      name: 'Lunettes monture prune et écaille',
      category: 'Lunettes & Montures',
      price: 3000,
      image: '/products/monture-lunettes-acetate-bordeaux.jpg',
      material: 'Acétate biseauté & armatures ciselées',
      badge: 'Optique',
    },
    {
      id: 'capo-client-021',
      name: 'Pochette à main cuir noir XQR',
      category: 'Maroquinerie & Pochettes',
      price: 3000,
      image: '/products/pochette-cuir-dragonne-xqr.png',
      material: 'Cuir pleine fleur ébène & dragonne',
      badge: 'Accessoire',
    },
  ];

  // Always reflect live prices/names from the active store catalog, and exclude deleted/hidden items
  const liveFeaturedPieces: FeaturedHeroItem[] =
    activeStore === 'mode'
      ? baseFeaturedPieces
          .filter((item) => publishedStoreProducts.some((p) => p.id === item.id))
          .map((item) => {
            const live = publishedStoreProducts.find((p) => p.id === item.id)!;
            return {
              ...item,
              name: live.name,
              price: live.price,
              image: live.images?.[0] || item.image,
              category: live.subCategory || item.category,
            };
          })
      : [];

  const featuredPieces: FeaturedHeroItem[] =
    liveFeaturedPieces.length > 0
      ? liveFeaturedPieces
      : publishedStoreProducts.slice(0, 4).map((p) => ({
          id: p.id,
          name: p.name,
          category: p.subCategory || p.category,
          price: p.price,
          image: p.images?.[0] || '/products/pantalon-prince-galles.jpg',
          material: p.materials || p.description,
          badge: p.isNew ? 'Nouveauté' : 'En stock',
        }));

  const [activePieceIndex, setActivePieceIndex] = useState(0);
  const safeIndex = featuredPieces.length > 0 ? activePieceIndex % featuredPieces.length : 0;
  const currentPiece = featuredPieces[safeIndex] || null;

  const hasVetements = publishedStoreProducts.some((p) => p.category === 'vetements');
  const hasLunettes = publishedStoreProducts.some((p) => p.category === 'lunettes');
  const hasAccessoires = publishedStoreProducts.some((p) => p.category === 'accessoires');
  const hasSmartphones = publishedStoreProducts.some((p) => p.category === 'smartphones');
  const hasOrdinateurs = publishedStoreProducts.some((p) => p.category === 'ordinateurs');
  const hasAccessoiresTech = publishedStoreProducts.some(
    (p) => p.category === 'accessoires_tech' || p.category === 'audio_tech' || p.category === 'tablettes_montres'
  );

  const handleHeroQuickOrder = () => {
    if (!currentPiece) {
      goToCatalog({ category: 'tous' });
      return;
    }
    const matched = publishedStoreProducts.find((p) => p.id === currentPiece.id);
    if (matched) {
      openQuickOrder(matched);
    } else {
      goToProduct(currentPiece.id);
    }
  };

  return (
    <section className="relative w-full bg-[#FAF8F5] border-b border-[#E7E2D9] overflow-hidden py-5 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-7">

        {/* Dual Store Selector (Boutique Mode vs Boutique Électronique) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={() => switchStore('mode')}
            className={`p-3 sm:p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
              activeStore === 'mode'
                ? 'bg-[#141210] text-white border-[#141210] shadow-md'
                : 'bg-white text-zinc-800 border-[#E7E2D9] hover:border-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  activeStore === 'mode' ? 'bg-[#B85D19] text-white' : 'bg-zinc-100 text-zinc-700'
                }`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs sm:text-sm truncate">Boutique Habillement</p>
                <p className={`text-[10px] sm:text-xs truncate ${activeStore === 'mode' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  Vêtements, Chaussures, Parfums ({modeCount})
                </p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 hidden sm:block ${activeStore === 'mode' ? 'text-[#B85D19]' : 'text-zinc-400'}`} />
          </button>

          <button
            type="button"
            onClick={() => switchStore('electronique')}
            className={`p-3 sm:p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
              activeStore === 'electronique'
                ? 'bg-[#141210] text-white border-[#141210] shadow-md'
                : 'bg-white text-zinc-800 border-[#E7E2D9] hover:border-zinc-900'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  activeStore === 'electronique' ? 'bg-[#B85D19] text-white' : 'bg-zinc-100 text-zinc-700'
                }`}
              >
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs sm:text-sm truncate">Boutique Électronique</p>
                <p className={`text-[10px] sm:text-xs truncate ${activeStore === 'electronique' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  iPhones, Ordinateurs & Tech ({techCount})
                </p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 hidden sm:block ${activeStore === 'electronique' ? 'text-[#B85D19]' : 'text-zinc-400'}`} />
          </button>
        </div>

        {/* Main Grid: Left Headline & CTAs | Right Featured Piece */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Clean Headline & Actions */}
          <div className="lg:col-span-6 text-left space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#B85D19]">
                {activeStore === 'electronique'
                  ? 'CAPOSTORE221 • Boutique Électronique'
                  : 'CAPOSTORE221 • Boutique Habillement'}
              </span>
              <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-[#141210] tracking-tight leading-[1.1]">
                {activeStore === 'electronique'
                  ? 'iPhones, ordinateurs et électronique.'
                  : 'Vêtements, chaussures, parfums et accessoires.'}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-md">
                Tu commandes, on te livre. Paiement par Wave, Orange Money, Yas ou espèces.
              </p>
            </div>

            {/* Category Quick Highlights */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5">
              {activeStore === 'mode' ? (
                <>
                  {hasVetements && (
                    <button
                      type="button"
                      onClick={() => goToCatalog({ category: 'vetements' })}
                      className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white hover:bg-zinc-50 border border-[#E7E2D9] hover:border-zinc-900 rounded-sm text-[11px] sm:text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                    >
                      Pantalons & Chemises
                    </button>
                  )}
                  {hasLunettes && (
                    <button
                      type="button"
                      onClick={() => goToCatalog({ category: 'lunettes' })}
                      className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white hover:bg-zinc-50 border border-[#E7E2D9] hover:border-zinc-900 rounded-sm text-[11px] sm:text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                    >
                      Lunettes & Montures
                    </button>
                  )}
                  {hasAccessoires && (
                    <button
                      type="button"
                      onClick={() => goToCatalog({ category: 'accessoires' })}
                      className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white hover:bg-zinc-50 border border-[#E7E2D9] hover:border-zinc-900 rounded-sm text-[11px] sm:text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                    >
                      Sacs & Accessoires
                    </button>
                  )}
                </>
              ) : (
                <>
                  {hasSmartphones && (
                    <button
                      type="button"
                      onClick={() => goToCatalog({ category: 'smartphones' })}
                      className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white hover:bg-zinc-50 border border-[#E7E2D9] hover:border-zinc-900 rounded-sm text-[11px] sm:text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                    >
                      Smartphones & iPhones
                    </button>
                  )}
                  {hasOrdinateurs && (
                    <button
                      type="button"
                      onClick={() => goToCatalog({ category: 'ordinateurs' })}
                      className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white hover:bg-zinc-50 border border-[#E7E2D9] hover:border-zinc-900 rounded-sm text-[11px] sm:text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                    >
                      Ordinateurs & PC
                    </button>
                  )}
                  {hasAccessoiresTech && (
                    <button
                      type="button"
                      onClick={() => goToCatalog({ category: 'accessoires_tech' })}
                      className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-white hover:bg-zinc-50 border border-[#E7E2D9] hover:border-zinc-900 rounded-sm text-[11px] sm:text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                    >
                      Audio & Accessoires Tech
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-1 flex flex-row items-center gap-2 sm:gap-3">
              <button
                onClick={() => goToCatalog({ category: 'tous' })}
                className="flex-1 sm:flex-initial bg-[#141210] hover:bg-[#2C2723] text-white px-4 sm:px-7 py-3 sm:py-3.5 rounded-sm text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shadow-sm"
              >
                <span>Explorer ({publishedCount} article{publishedCount > 1 ? 's' : ''})</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {currentPiece && (
                <button
                  type="button"
                  onClick={handleHeroQuickOrder}
                  className="flex-1 sm:flex-initial bg-white hover:bg-zinc-50 text-zinc-900 border border-[#D9D3C7] px-3 sm:px-5 py-3 sm:py-3.5 rounded-sm text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
                  <span>Commander direct</span>
                </button>
              )}
            </div>

            {/* Quick Reassurance Ticker */}
            <div className="pt-2 sm:pt-4 flex items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] text-zinc-500 border-t border-[#EAE5DC]">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700" />
                Photos réelles
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700" />
                Wave, OM, Yas & espèces
              </span>
            </div>
          </div>

          {/* Right Column: Curated Real Garment Stage (or clean empty state when no tech products yet) */}
          <div className="lg:col-span-6">
            {currentPiece ? (
              <div className="bg-white border border-[#E7E2D9] rounded-sm overflow-hidden shadow-sm">
                <div
                  onClick={() => goToProduct(currentPiece.id)}
                  className="relative aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/5] bg-[#FAF8F5] p-4 sm:p-10 flex items-center justify-center cursor-pointer group border-b border-[#EAE5DC]"
                >
                  <img
                    src={currentPiece.image}
                    alt={currentPiece.name}
                    className="w-full h-full max-h-[260px] sm:max-h-[460px] object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-103"
                    loading="eager"
                    decoding="async"
                  />

                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#141210] text-white rounded-sm">
                      {currentPiece.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-zinc-200 text-[10px] sm:text-[11px] font-semibold text-zinc-900 flex items-center gap-1 shadow-sm group-hover:bg-[#141210] group-hover:text-white transition-colors">
                    <span>Voir la fiche</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                <div className="p-3 sm:p-5 bg-white flex items-center justify-between gap-3">
                  <div className="text-left min-w-0">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 font-semibold truncate">
                      {currentPiece.category}
                    </p>
                    <h3 className="font-display font-bold text-xs sm:text-base text-zinc-900 truncate mt-0.5">
                      {currentPiece.name}
                    </h3>
                    <p className="font-bold text-xs sm:text-base text-[#141210] mt-0.5">
                      {formatFCFA(currentPiece.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {featuredPieces.map((piece, idx) => (
                      <button
                        key={piece.id}
                        onClick={() => setActivePieceIndex(idx)}
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-sm border text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center ${
                          safeIndex === idx
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
            ) : (
              <div className="bg-white border border-[#E7E2D9] rounded-sm p-8 sm:p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-zinc-900">
                  Boutique Électronique CAPOSTORE221
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  Les smartphones, ordinateurs et équipements électroniques ajoutés depuis l'espace gérant apparaîtront ici automatiquement.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
