import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { 
  isValidEmail, 
  STORE_WHATSAPP_PHONE, 
  STORE_CALL_PHONE, 
  STORE_PHONE_WHATSAPP_DISPLAY, 
  STORE_PHONE_CALL_DISPLAY, 
  FACEBOOK_URL 
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
    showToast('Bienvenue dans le cercle privé CAPOSTORE221.', 'success');
  };

  return (
    <section className="py-16 lg:py-20 bg-[#141210] text-white relative overflow-hidden border-t border-[#2B2621]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#241F1A] border border-[#3E352C] text-xs font-bold uppercase tracking-widest text-[#D49A3D] mb-4">
          <span className="text-sm">✨</span>
          <span>Le Cercle Privé CAPOSTORE221</span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight mb-3">
          Soyez Informé des Prochains Arrivages
        </h2>

        <p className="text-[#A89E90] text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
          Nos pièces sont sélectionnées en séries limitées et s'épuisent rapidement. Recevez les photos des nouvelles pièces en avant-première dès leur mise en ligne.
        </p>

        {isSubscribed ? (
          <div className="max-w-md mx-auto p-4 rounded-lg bg-[#1F2C22] border border-[#2B4E32] flex items-center justify-center gap-3 text-emerald-400 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-xs text-left">
              <span className="font-bold block text-white">Inscription validée !</span>
              Vous serez prévenu(e) en priorité lors des prochains arrivages.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email (ex: amadou@gmail.com)..."
              className="flex-1 bg-[#211C18] border border-[#3E352C] text-white placeholder-[#7A7163] text-xs sm:text-sm px-4 py-3.5 rounded focus:outline-none focus:border-[#B85226] transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-[#B85226] hover:bg-[#A1441B] text-white px-6 py-3.5 font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded transition-colors shrink-0 shadow-sm"
            >
              <span>Rejoindre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* WhatsApp VIP Club & Contact Numbers & Facebook */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-bold">
          <a
            href={`https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent("Bonjour CAPOSTORE221 ! Je souhaite intégrer votre liste de diffusion WhatsApp VIP pour recevoir les nouveaux arrivages.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#25D366] hover:text-white transition-colors py-1"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp : {STORE_PHONE_WHATSAPP_DISPLAY}</span>
          </a>

          <span className="hidden sm:inline text-zinc-600">•</span>

          <a
            href={`tel:+${STORE_CALL_PHONE}`}
            className="inline-flex items-center gap-2 text-zinc-300 hover:text-white transition-colors py-1"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>Appel direct : {STORE_PHONE_CALL_DISPLAY}</span>
          </a>

          <span className="hidden sm:inline text-zinc-600">•</span>

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#5B9DF8] hover:text-white transition-colors py-1"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
            <span>Facebook CAPOSTORE</span>
          </a>
        </div>

      </div>
    </section>
  );
};
