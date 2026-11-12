import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { 
  STORE_WHATSAPP_PHONE, 
  STORE_CALL_PHONE, 
  STORE_PHONE_WHATSAPP_DISPLAY, 
  STORE_PHONE_CALL_DISPLAY 
} from '../../utils/format';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { products } = useStore();
  const publishedCount = products.filter((p) => p.published).length;

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Annonce boutique"
      className="bg-[#121110] text-[#D4CBBF] text-[11px] sm:text-xs py-2 px-4 border-b border-[#262320] transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Core Offer Message */}
        <div className="flex-1 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 overflow-hidden truncate">
          <span className="font-semibold text-white tracking-wider uppercase text-[9px] sm:text-[11px] bg-[#221F1C] px-1.5 sm:px-2 py-0.5 rounded border border-[#38332E] shrink-0">
            {publishedCount} articles dispos
          </span>
          <p className="truncate text-zinc-300 text-[10px] sm:text-xs">
            <span className="text-white font-medium">Vêtements 5 000 F</span>
            <span className="mx-1 text-zinc-600">•</span>
            <span className="text-white font-medium">Lunettes & Sacs 3 000 F</span>
            <span className="hidden md:inline text-zinc-400"> — Tu commandes, on te livre</span>
          </p>
        </div>

        {/* Quick Contact Links on Right */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-zinc-400 shrink-0">
          <a
            href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            WhatsApp : <span className="text-zinc-200 font-medium">{STORE_PHONE_WHATSAPP_DISPLAY}</span>
          </a>
          <span className="text-zinc-700">|</span>
          <a
            href={`tel:+${STORE_CALL_PHONE}`}
            className="hover:text-white transition-colors"
          >
            Tél : <span className="text-zinc-200 font-medium">{STORE_PHONE_CALL_DISPLAY}</span>
          </a>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-zinc-500 hover:text-white p-1 transition-colors rounded shrink-0"
          aria-label="Fermer la barre d'annonce"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
