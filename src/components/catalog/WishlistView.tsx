import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlistIds } = useWishlist();
  const { products, goToCatalog } = useStore();

  const favoritedProducts = products.filter((p) => wishlistIds.includes(p.id) && p.published);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-6 mb-8 border-b border-[#E7E2D9] text-left">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#B85D19] mb-1">
            CAPOSTORE221 • Sélection Personnelle
          </p>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-zinc-900 tracking-tight">
            Mes Favoris ({favoritedProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mt-1.5">
            Retrouvez vos pièces enregistrées. Vous pouvez les ajouter directement au panier ou commander via WhatsApp.
          </p>
        </div>

        {/* Content */}
        {favoritedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {favoritedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E7E2D9] p-12 sm:p-16 text-center rounded-sm max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-zinc-900 mb-2">
              Votre liste de favoris est vide
            </h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Enregistrez vos coups de cœur en cliquant sur l'icône de cœur sur les articles du catalogue.
            </p>
            <button
              onClick={() => goToCatalog({ category: 'tous' })}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#141210] hover:bg-[#2C2723] text-white text-xs font-semibold uppercase tracking-wider transition-colors rounded-sm"
            >
              <span>Découvrir le catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
