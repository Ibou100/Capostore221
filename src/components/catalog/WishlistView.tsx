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
    <div className="bg-capo-offwhite min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-8 mb-8 border-b border-zinc-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            Maison CAPO221
          </p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-capo-black tracking-tightest uppercase">
            Mes Pièces Favorites ({favoritedProducts.length})
          </h1>
          <p className="text-sm text-zinc-600 max-w-xl mt-2 font-light">
            Retrouvez ici votre sélection personnelle enregistrée. Vous pouvez ajouter directement vos pièces au panier.
          </p>
        </div>

        {/* Content */}
        {favoritedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favoritedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 p-16 text-center rounded-sm max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-zinc-900 mb-2">
              Votre liste de favoris est vide
            </h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Enregistrez vos coups de cœur en cliquant sur l'icône de cœur présente sur chaque fiche ou carte produit.
            </p>
            <button
              onClick={() => goToCatalog({ category: 'tous' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-capo-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
            >
              <span>Explorer la collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
