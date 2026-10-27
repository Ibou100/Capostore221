import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { isValidEmail } from '../../utils/format';

const CURRENT_YEAR = new Date().getFullYear();

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
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Livraison Dakar Express 24h</h3>
              <p className="text-xs text-zinc-400 mt-1">Expédition rapide à Dakar & dans toutes les régions du Sénégal.</p>
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
              Maison de mode contemporaine ancrée à Dakar. Prêt-à-porter de créateur, streetwear d'avant-garde, solaires et accessoires d'exception en Francs CFA (XOF).
            </p>
            <div className="pt-2 text-xs text-zinc-400 space-y-1">
              <p><strong className="text-zinc-300 font-medium">Boutique & Showroom :</strong> Dakar, Sénégal (Horaires 10h - 20h)</p>
              <p><strong className="text-zinc-300 font-medium">Service Client :</strong> contact@capostore221.com</p>
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
                  Voir toutes les 21 pièces
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
                  L'Atelier Dakar
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
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                Facebook /capostore221
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
          <p>© {CURRENT_YEAR} CAPOSTORE221. Tous droits réservés. Dakar, Sénégal.</p>
          <div className="flex items-center gap-6">
            <span>Devise : FCFA (XOF)</span>
            <span>Made for Dakar & the World</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
