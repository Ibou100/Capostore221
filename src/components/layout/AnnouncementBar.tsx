import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside aria-label="Annonce spéciale" className="bg-[#141210] text-[#E8DFD5] text-xs tracking-wider uppercase py-2 px-4 border-b border-[#302B26] transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden">
          <span className="text-xs">🇸🇳</span>
          <p className="truncate">
            <span className="font-bold text-[#D49A3D]">CAPOSTORE221</span>
            <span className="text-[#E8DFD5]"> — PANTALONS & CHEMISES À 5 000 FCFA • LUNETTES & SACS À 3 000 FCFA</span>
            <span className="hidden md:inline text-[#A89E90]"> • WHATSAPP : 76 832 11 57 • APPEL : 77 256 39 90</span>
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-[#A89E90] hover:text-white p-1 ml-2 transition-colors"
          aria-label="Fermer la barre d'annonce"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
