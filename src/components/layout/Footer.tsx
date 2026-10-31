import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Truck, RefreshCw, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { isValidEmail, FACEBOOK_URL } from '../../utils/format';

const CURRENT_YEAR = new Date().getFullYear();

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      clipRule="evenodd"
    />
  </svg>
);

export const Footer: React.FC = () => {
  const { goToHome, goToCatalog, goToEditorial, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(newsletterEmail)) {
      showToast('Veuillez renseigner une adresse email valide.', 'error');
      return;
    }
    setNewsletterSubmitted(true);
    showToast('Merci pour votre inscription à la Gazette CAPO221.', 'success');
  };

  return (
    <footer className="bg-capo-black text-white pt-16 pb-12 border-t border-zinc-800">
      {/* Guarantees banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-capo-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Livraison Rapide à Domicile</h3>
              <p className="text-xs text-zinc-400 mt-1">Tu commandes, nous validons et assurons la livraison directe chez toi.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-capo-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Pièces Authentiques & Finitions Luxe</h3>
              <p className="text-xs text-zinc-400 mt-1">Matières premières nobles sélectionnées et contrôles qualité rigoureux.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-capo-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Échanges & Retours Sous 7 Jours</h3>
              <p className="text-xs text-zinc-400 mt-1">Essayez en toute sérénité avec assistance dédiée par WhatsApp et appel.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-zinc-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-capo-black font-display font-bold text-xs tracking-tighter">
                <span>CS</span>
                <span className="text-capo-accent text-[9px] ml-0.5">221</span>
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tightest text-white">
                CAPOSTORE<span className="text-zinc-500 font-light text-xl ml-0.5">221</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Boutique en ligne officielle de mode contemporaine. Prêt-à-porter de créateur, streetwear d'avant-garde, solaires et accessoires en Francs CFA (XOF). Tu commandes, on te livre.
            </p>
            <div className="pt-2 text-xs text-zinc-400 space-y-1.5">
              <p><strong className="text-zinc-300 font-medium">Vente en Ligne Exclusive :</strong> Commandes 24h/24 & 7j/7</p>
              <p><strong className="text-zinc-300 font-medium">Service Client :</strong> contact@capostore221.com</p>
              <p className="pt-1">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#5B9DF8] hover:text-white transition-colors font-medium"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  <span>Suivez-nous sur Facebook</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Collections</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button onClick={() => goToCatalog({ category: 'vetements' })} className="hover:text-white transition-colors">
                  Vêtements (Pantalons, Chemises, Polos)
                </button>
              </li>
              <li>
                <button onClick={() => goToCatalog({ category: 'lunettes' })} className="hover:text-white transition-colors">
                  Lunettes & Montures
                </button>
              </li>
              <li>
                <button onClick={() => goToCatalog({ category: 'accessoires' })} className="hover:text-white transition-colors">
                  Maroquinerie & Pochettes
                </button>
              </li>
              <li>
                <button onClick={() => goToCatalog({ category: 'tous' })} className="hover:text-white transition-colors">
                  Voir toutes les 23 pièces
                </button>
              </li>
            </ul>
          </div>

          {/* Maison & Brand */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Maison CAPOSTORE221</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button onClick={goToEditorial} className="hover:text-white transition-colors">
                  Manifeste de Marque
                </button>
              </li>
              <li>
                <button onClick={goToHome} className="hover:text-white transition-colors">
                  Notre Concept
                </button>
              </li>
              <li>
                <span className="text-zinc-500 cursor-not-allowed">
                  Guide des Tailles (Inclus sur fiche)
                </span>
              </li>
              <li>
                <span className="text-zinc-500 cursor-not-allowed">
                  Conditions Générales de Vente
                </span>
              </li>
              <li>
                <span className="text-zinc-500 cursor-not-allowed">
                  Politique de Confidentialité
                </span>
              </li>
            </ul>
          </div>

          {/* Socials & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">Réseaux Sociaux</h4>
            
            {/* Direct Official Facebook Button */}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold transition-all shadow-sm group w-full justify-center"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Page Facebook Officielle</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                Instagram @capostore221
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                TikTok @capostore221
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                Snapchat @capostore221
              </span>
            </div>

            <div className="pt-2">
              <p className="text-xs text-zinc-400 mb-2 font-medium">Rejoindre le cercle privé CAPOSTORE221 :</p>
              {newsletterSubmitted ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Votre adresse a été enregistrée avec succès.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Votre email..."
                    className="bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-zinc-500 w-full"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-white text-capo-black px-3 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-200 transition-colors shrink-0"
                  >
                    S'inscrire
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {CURRENT_YEAR} CAPOSTORE221. Boutique en ligne officielle. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>Devise : FCFA (XOF)</span>
            <span>Vente en ligne • Tu commandes, on te livre</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
