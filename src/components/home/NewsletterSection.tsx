import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { 
  isValidEmail, 
  STORE_WHATSAPP_PHONE, 
  STORE_CALL_PHONE, 
  STORE_PHONE_WHATSAPP_DISPLAY, 
  STORE_PHONE_CALL_DISPLAY, 
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

        {/* WhatsApp VIP Club & Contact Numbers & Social Links */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs font-bold">
          <a
            href={`https://wa.me/${STORE_WHATSAPP_PHONE}?text=${encodeURIComponent("Bonjour CAPOSTORE221 ! Je souhaite intégrer votre liste de diffusion WhatsApp VIP pour recevoir les nouveaux arrivages.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#25D366] hover:text-white transition-colors py-1"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp : {STORE_PHONE_WHATSAPP_DISPLAY}</span>
          </a>

          <span className="hidden sm:inline text-zinc-600">•</span>

          <a
            href={`tel:+${STORE_CALL_PHONE}`}
            className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors py-1"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>Appel : {STORE_PHONE_CALL_DISPLAY}</span>
          </a>

          <span className="hidden sm:inline text-zinc-600">•</span>

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#5B9DF8] hover:text-white transition-colors py-1"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
            <span>Facebook</span>
          </a>

          <span className="hidden sm:inline text-zinc-600">•</span>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#FD1D1D] hover:text-white transition-colors py-1"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Instagram</span>
          </a>

          <span className="hidden sm:inline text-zinc-600">•</span>

          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors py-1"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
            <span>TikTok</span>
          </a>
        </div>

      </div>
    </section>
  );
};
