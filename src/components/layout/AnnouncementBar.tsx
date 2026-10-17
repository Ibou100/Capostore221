import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside aria-label="Annonce spéciale" className="bg-capo-black text-white text-xs tracking-wider uppercase py-2 px-4 border-b border-capo-borderDark transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-capo-accent shrink-0 animate-pulse" />
          <p className="truncate">
            <span className="font-semibold text-white">LIVRAISON EXPRESS DAKAR EN 24H</span>
            <span className="hidden sm:inline text-zinc-400"> — GRATUITE DÈS 75 000 FCFA</span>
            <span className="hidden md:inline text-zinc-500"> • RETOURS SOUS 7 JOURS</span>
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-zinc-400 hover:text-white p-1 ml-2 transition-colors"
          aria-label="Fermer la barre d'annonce"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
