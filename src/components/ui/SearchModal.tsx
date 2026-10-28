import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/format';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, products, goToProduct, goToCatalog } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const handleClose = React.useCallback(() => {
    setSearchTerm('');
    closeSearch();
  }, [closeSearch]);

  // Handle Escape and Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
        if (isSearchOpen) handleClose();
        else inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isSearchOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, handleClose]);

  if (!isSearchOpen) return null;

  const results = searchTerm.trim()
    ? products
        .filter((p) => p.published)
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            p.subCategory.toLowerCase().includes(searchTerm.toLowerCase().trim())
        )
        .slice(0, 6)
    : [];

  const handleQuickKeyword = (kw: string) => {
    setSearchTerm(kw);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-sm overflow-hidden z-10 animate-fade-in border border-zinc-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-zinc-200 gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une pièce, catégorie ou matière (ex: Aviateur, Lunettes, Sneakers)..."
            className="w-full text-sm sm:text-base text-zinc-900 placeholder-zinc-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-zinc-400 hover:text-black p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="text-xs uppercase tracking-wider font-semibold text-zinc-500 hover:text-black px-2 py-1 bg-zinc-100 rounded"
          >
            Échap
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!searchTerm && (
          <div className="p-6 bg-zinc-50 border-b border-zinc-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Recherches fréquentes à Dakar :
            </p>
            <div className="flex flex-wrap gap-2">
              {['Prince de Galles', 'Bermuda Cargo', 'Pantalon Cargo', 'Jean Bleached', 'Chemise Rose', 'Polo Grenat', 'Jean Carpenter'].map((kw) => (
                <button
                  key={kw}
                  onClick={() => handleQuickKeyword(kw)}
                  className="px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-xs text-zinc-700 hover:border-black hover:text-black transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {searchTerm.trim() ? (
            results.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  {results.length} résultat{results.length > 1 ? 's' : ''} correspondant{results.length > 1 ? 's' : ''} :
                </p>
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      closeSearch();
                      goToProduct(product.id);
                    }}
                    className="flex items-center gap-4 p-2.5 rounded hover:bg-zinc-100 cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-16 object-contain p-1 rounded bg-[#FAF8F5] border border-[#EAE5DC] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                        {product.category} • {product.subCategory}
                      </p>
                      <h4 className="font-display font-medium text-sm text-zinc-900 group-hover:text-black truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-semibold text-capo-black mt-0.5">
                        {formatFCFA(product.price)}
                      </p>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
                  </div>
                ))}

                <div className="pt-4 mt-2 border-t border-zinc-100">
                  <button
                    onClick={() => {
                      closeSearch();
                      goToCatalog({ query: searchTerm });
                    }}
                    className="w-full text-center py-2 text-xs font-semibold uppercase tracking-wider text-capo-black hover:underline"
                  >
                    Voir tous les résultats dans le catalogue →
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-500">
                <p className="text-sm font-medium">Aucun produit ne correspond à « {searchTerm} »</p>
                <p className="text-xs text-zinc-400 mt-1">Essayez un autre mot-clé ou parcourez nos grandes catégories.</p>
              </div>
            )
          ) : (
            <div className="py-6 text-center text-xs text-zinc-400">
              Tapez le nom d'un vêtement, accessoire, lunette ou pointure pour voir les résultats en direct.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
