import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Phone, MessageCircle, Mail } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { 
  FACEBOOK_URL, 
  INSTAGRAM_URL, 
  TIKTOK_URL, 
  STORE_WHATSAPP_PHONE, 
  STORE_CALL_PHONE, 
  STORE_PHONE_WHATSAPP_DISPLAY, 
  STORE_PHONE_CALL_DISPLAY,
  STORE_EMAIL
} from '../../utils/format';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const { goToHome, goToCatalog } = useStore();

  return (
    <footer className="bg-[#121110] text-[#D4CBBF] border-t border-[#262320]">
      {/* Top Reassurance Strip */}
      <div className="border-b border-[#24211E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-zinc-400 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Livraison Directe</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">Tu commandes, on te livre</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Paiement Sécurisé</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">Wave, OM ou à la remise</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-zinc-400 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Échanges 7 Jours</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">Si la taille ne convient pas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-zinc-400 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Service Client</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">Assistance 7j/7 par WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
          
          {/* Col 1: Brand & Contact */}
          <div className="space-y-4">
            <button
              onClick={goToHome}
              className="flex items-center gap-2 text-left focus:outline-none group"
            >
              <div className="w-7 h-7 rounded bg-white flex items-center justify-center text-[#121110] font-display font-bold text-xs group-hover:bg-zinc-200 transition-colors">
                <span>CS</span>
                <span className="text-[#B85D19] text-[9px] ml-0.5">221</span>
              </div>
              <span className="font-display font-black text-xl tracking-tight text-white">
                CAPOSTORE<span className="text-[#B85D19] font-normal text-lg ml-0.5">221</span>
              </span>
            </button>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Boutique en ligne officielle de mode contemporaine. Prêt-à-porter, lunettes et maroquinerie en Francs CFA (XOF). Tu commandes, on te livre.
            </p>
            <div className="space-y-1.5 text-xs text-zinc-400 pt-2">
              <p>
                <a
                  href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp : <strong className="text-zinc-200">{STORE_PHONE_WHATSAPP_DISPLAY}</strong></span>
                </a>
              </p>
              <p>
                <a
                  href={`tel:+${STORE_CALL_PHONE}`}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appel direct : <strong className="text-zinc-200">{STORE_PHONE_CALL_DISPLAY}</strong></span>
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email : <strong className="text-zinc-200">{STORE_EMAIL}</strong></span>
                </a>
              </p>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Départements
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => goToCatalog({ category: 'vetements' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Vêtements & Tailleur (5 000 FCFA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToCatalog({ category: 'lunettes' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Lunettes & Montures (3 000 FCFA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToCatalog({ category: 'accessoires' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Maroquinerie & Sacs (3 000 FCFA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToCatalog({ category: 'tous' })}
                  className="hover:text-white transition-colors text-left"
                >
                  Tout le catalogue (23 pièces)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Service Client */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Engagements
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>Vente en ligne exclusive 7j/7</li>
              <li>Validation personnalisée de chaque commande</li>
              <li>Livraison à domicile express</li>
              <li>Règlement à la livraison ou Wave / Orange Money</li>
              <li>Échange de taille sous 7 jours</li>
            </ul>
          </div>

          {/* Col 4: Réseaux Sociaux */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Réseaux Sociaux
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Suivez nos arrivages en photo et en vidéo sur nos canaux officiels :
            </p>
            <div className="space-y-2 text-xs">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors py-1"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram : @capostore221</span>
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors py-1"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                <span>TikTok : @capostore.221</span>
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors py-1"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <span>Facebook : Page Officielle</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-10 mt-10 border-t border-[#24211E] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {CURRENT_YEAR} CAPOSTORE221. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>Devise : FCFA (XOF)</span>
            <span>Vente en ligne • Tu commandes, on te livre</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
