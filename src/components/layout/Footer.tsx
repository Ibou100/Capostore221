import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Truck, RefreshCw, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { 
  isValidEmail, 
  FACEBOOK_URL, 
  INSTAGRAM_URL, 
  TIKTOK_URL, 
  STORE_WHATSAPP_PHONE, 
  STORE_CALL_PHONE, 
  STORE_PHONE_WHATSAPP_DISPLAY, 
  STORE_PHONE_CALL_DISPLAY 
} from '../../utils/format';

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

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
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
              <p>
                <strong className="text-zinc-300 font-medium">WhatsApp Commande :</strong>{' '}
                <a
                  href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  {STORE_PHONE_WHATSAPP_DISPLAY}
                </a>
              </p>
              <p>
                <strong className="text-zinc-300 font-medium">Ligne Téléphonique / Appel :</strong>{' '}
                <a
                  href={`tel:+${STORE_CALL_PHONE}`}
                  className="text-zinc-200 hover:text-white hover:underline font-semibold"
                >
                  {STORE_PHONE_CALL_DISPLAY}
                </a>
              </p>
              <p><strong className="text-zinc-300 font-medium">Email :</strong> contact@capostore221.com</p>
              <div className="pt-2 flex flex-col gap-1.5">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#5B9DF8] hover:text-white transition-colors font-medium text-xs"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  <span>Facebook : CAPOSTORE</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#FD1D1D] hover:text-white transition-colors font-medium text-xs"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram : @capostore221</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors font-medium text-xs"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                  <span>TikTok : @capostore.221</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
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
            
            {/* Direct Official Social Buttons */}
            <div className="space-y-2">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold transition-all shadow-sm group"
              >
                <div className="flex items-center gap-2">
                  <FacebookIcon className="w-4 h-4" />
                  <span>Facebook CAPOSTORE</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white text-xs font-bold transition-all shadow-sm group"
              >
                <div className="flex items-center gap-2">
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram @capostore221</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded bg-black hover:bg-zinc-900 border border-zinc-700 text-white text-xs font-bold transition-all shadow-sm group"
              >
                <div className="flex items-center gap-2">
                  <TikTokIcon className="w-4 h-4" />
                  <span>TikTok @capostore.221</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
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
