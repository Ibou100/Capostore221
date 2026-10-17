import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { isValidEmail } from '../../utils/format';
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
    showToast('Bienvenue dans le cercle privé CAPO221.', 'success');
  };

  return (
    <section className="py-20 bg-capo-black text-white relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 text-capo-accent">
          <Mail className="w-5 h-5" />
        </div>

        <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-3">
          Le Cercle CAPO221
        </p>

        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tightest mb-4">
          Accès Privilégié aux Capsules Privées
        </h2>

        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light leading-relaxed">
          Soyez averti des réassorts avant épuisement, des précommandes et des lancements confidentiels à Dakar.
        </p>

        {isSubscribed ? (
          <div className="max-w-md mx-auto p-4 rounded-lg bg-zinc-900/90 border border-zinc-700 flex items-center justify-center gap-3 text-emerald-400 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-xs text-left">
              <span className="font-semibold block text-white">Inscription enregistrée !</span>
              Vous serez notifié(e) lors de la prochaine sortie exclusive.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email personnelle..."
              className="flex-1 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm px-4 py-3.5 rounded-none focus:outline-none focus:border-white transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-white text-capo-black hover:bg-zinc-200 px-6 py-3.5 font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              <span>Rejoindre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-zinc-500 mt-4">
          Aucun spam. Désinscription possible à tout instant.
        </p>
      </div>
    </section>
  );
};
