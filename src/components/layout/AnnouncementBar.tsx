import React, { useState } from 'react';
import { X } from 'lucide-react';
import { 
  STORE_WHATSAPP_PHONE, 
  STORE_CALL_PHONE, 
  STORE_PHONE_WHATSAPP_DISPLAY, 
  STORE_PHONE_CALL_DISPLAY 
} from '../../utils/format';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Annonce boutique"
      className="bg-[#0C0A09] text-[#E7DFD5] text-[11px] sm:text-xs py-2.5 px-4 border-b border-[#24201C] transition-colors relative z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Core Offer Message */}
        <div className="flex-1 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2 overflow-hidden truncate">
          <span className="font-extrabold text-[9px] sm:text-[10px] uppercase tracking-widest bg-gradient-to-r from-amber-600 to-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs">
            Offre Spéciale
          </span>
          <p className="truncate text-stone-300 text-[11px] sm:text-xs tracking-wide">
            <span className="text-white font-bold">Vêtements 5 000 FCFA</span>
            <span className="mx-2 text-stone-600">•</span>
            <span className="text-white font-bold">Lunettes & Sacs 3 000 FCFA</span>
            <span className="hidden md:inline text-stone-400"> — Tu commandes, on te livre à domicile</span>
          </p>
        </div>

        {/* Quick Contact Links on Right */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-stone-400 shrink-0">
          <a
            href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>WhatsApp :</span>
            <strong className="text-stone-200 font-semibold">{STORE_PHONE_WHATSAPP_DISPLAY}</strong>
          </a>
          <span className="text-stone-700">|</span>
          <a
            href={`tel:+${STORE_CALL_PHONE}`}
            className="hover:text-white transition-colors"
          >
            Appel : <strong className="text-stone-200 font-semibold">{STORE_PHONE_CALL_DISPLAY}</strong>
          </a>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-stone-500 hover:text-white p-1 transition-colors rounded-full hover:bg-stone-800 shrink-0"
          aria-label="Fermer la barre d'annonce"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
