import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { isValidEmail, DAKAR_WHATSAPP_PHONE } from '../../utils/format';
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
          <span className="text-sm">🇸🇳</span>
          <span>Le Cercle Privé Dakar 221</span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight mb-3">
          Soyez Informé des Prochains Arrivages
        </h2>

        <p className="text-[#A89E90] text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
          Nos pièces sont sélectionnées en séries limitées et s'épuisent rapidement. Recevez les photos des nouvelles pièces en avant-première à Dakar.
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

        {/* WhatsApp VIP Club */}
        <div className="pt-4 flex items-center justify-center gap-2">
          <a
            href={`https://wa.me/${DAKAR_WHATSAPP_PHONE}?text=${encodeURIComponent("Bonjour CAPOSTORE221 ! Je souhaite intégrer votre liste de diffusion WhatsApp VIP pour recevoir les nouveaux arrivages.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#25D366] hover:text-white transition-colors py-1"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ou rejoignez notre statut WhatsApp VIP en 1 clic</span>
          </a>
        </div>

      </div>
    </section>
  );
};
