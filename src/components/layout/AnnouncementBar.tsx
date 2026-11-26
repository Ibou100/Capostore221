import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Information livraison et paiement"
      className="bg-[#0A0A0A] text-white h-9 px-4 flex items-center justify-center relative"
    >
      <p className="text-[12px] sm:text-[13px] font-normal text-zinc-200 truncate pr-8 text-center">
        Commandes Sénégal & International · Paiement Carte Bancaire, Wave, Orange Money, Yas ou espèces
      </p>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-full"
        aria-label="Fermer l'annonce"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
