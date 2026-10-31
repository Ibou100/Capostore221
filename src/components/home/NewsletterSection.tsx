import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, MessageCircle, Phone, Mail } from 'lucide-react';
import { 
  isValidEmail, 
  STORE_WHATSAPP_PHONE, 
  STORE_CALL_PHONE, 
  STORE_PHONE_WHATSAPP_DISPLAY, 
  STORE_PHONE_CALL_DISPLAY, 
  STORE_EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  TIKTOK_URL
} from '../../utils/format';
import { useStore } from '../../context/StoreContext';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      showToast('Veuillez saisir une adresse email valide.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Votre inscription a été enregistrée avec succès.', 'success');
  };

  return (
    <section className="py-16 lg:py-20 bg-[#FAF8F5] border-b border-[#E7E2D9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#B85D19]">
            Nouveautés & Réassorts
          </p>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-zinc-900 tracking-tight">
            Soyez averti des prochains arrivages
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto">
            Recevez nos sélections de pièces en stock avant tout le monde. Zéro spam, uniquement nos nouveaux vêtements et accessoires.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto">
          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 py-3.5 px-4 rounded-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Votre adresse a été enregistrée avec succès.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email..."
                required
                className="flex-1 bg-white border border-[#D9D3C7] text-zinc-900 text-xs px-4 py-3 rounded-sm focus:outline-none focus:border-zinc-900 placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="bg-[#141210] hover:bg-[#2C2723] text-white px-5 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shrink-0"
              >
                <span>S'inscrire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Direct Contact Links Strip */}
        <div className="pt-6 border-t border-[#EAE5DC] flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-600">
          <a
            href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-emerald-700 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp : {STORE_PHONE_WHATSAPP_DISPLAY}</span>
          </a>

          <span className="text-zinc-300 hidden sm:inline">•</span>

          <a
            href={`tel:+${STORE_CALL_PHONE}`}
            className="inline-flex items-center gap-1.5 hover:text-zinc-900 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Appel : {STORE_PHONE_CALL_DISPLAY}</span>
          </a>

          <span className="text-zinc-300 hidden sm:inline">•</span>

          <a
            href={`mailto:${STORE_EMAIL}`}
            className="inline-flex items-center gap-1.5 hover:text-zinc-900 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{STORE_EMAIL}</span>
          </a>

          <span className="text-zinc-300 hidden sm:inline">•</span>

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 transition-colors"
          >
            Facebook
          </a>

          <span className="text-zinc-300 hidden sm:inline">•</span>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 transition-colors"
          >
            Instagram
          </a>

          <span className="text-zinc-300 hidden sm:inline">•</span>

          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 transition-colors"
          >
            TikTok
          </a>
        </div>

      </div>
    </section>
  );
};
