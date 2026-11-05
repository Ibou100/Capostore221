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
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B85D19] text-[10px] font-bold uppercase tracking-widest">
            <span>Privilège Client</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0C0A09] tracking-tight">
            Soyez averti des prochains arrivages
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
            Recevez nos pièces exclusives et alertes réassorts en priorité. Zéro spam, uniquement nos nouveaux vêtements, lunettes et maroquinerie.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto">
          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 py-4 px-6 rounded-2xl shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Votre adresse a été enregistrée avec succès. Bienvenue !</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 p-1.5 bg-white border border-stone-200 rounded-2xl shadow-sm focus-within:border-stone-900 transition-all">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email personnelle..."
                required
                className="flex-1 bg-transparent text-stone-900 text-xs px-4 py-3 focus:outline-none placeholder:text-stone-400 font-medium"
              />
              <button
                type="submit"
                className="bg-[#0C0A09] hover:bg-[#201D1A] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
              >
                <span>Rejoindre</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          )}
        </div>

        {/* Direct Contact Links Strip */}
        <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-stone-600">
          <a
            href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-emerald-700 transition-colors font-medium"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp : <strong>{STORE_PHONE_WHATSAPP_DISPLAY}</strong></span>
          </a>

          <span className="text-stone-300 hidden sm:inline">•</span>

          <a
            href={`tel:+${STORE_CALL_PHONE}`}
            className="inline-flex items-center gap-2 hover:text-stone-900 transition-colors font-medium"
          >
            <Phone className="w-4 h-4 text-stone-700" />
            <span>Appel direct : <strong>{STORE_PHONE_CALL_DISPLAY}</strong></span>
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
