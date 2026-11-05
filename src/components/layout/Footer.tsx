import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Phone, MessageCircle, Mail, Package, Lock } from 'lucide-react';
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
  const { goToHome, goToCatalog, goToOrders, goToTracking, goToAdmin } = useStore();

  return (
    <footer className="bg-[#0C0A09] text-[#E7DFD5] border-t border-[#24201C]">
      {/* Top Reassurance Strip */}
      <div className="border-b border-[#24201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Livraison Directe</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">Dakar 2h-4h • Tu commandes, on te livre</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Paiement Sécurisé</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">Wave, OM ou en espèces à la livraison</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Échange & Essayage</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">Essayez tranquillement chez vous</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Service VIP 7j/7</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">Conseiller personnel sur WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
          
          {/* Col 1: Brand & Contact */}
          <div className="space-y-4">
            <button
              onClick={goToHome}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-display font-black text-xs group-hover:bg-[#B85D19] transition-all">
                <span>CS</span>
                <span className="text-[#D4AF37] text-[9px] font-mono ml-0.5 font-bold">221</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-tight text-white">
                  CAPOSTORE<span className="text-[#B85D19] font-medium text-lg ml-0.5">221</span>
                </span>
                <span className="text-[8px] tracking-[0.25em] uppercase text-stone-400 font-bold">
                  Dakar • Maison de Mode
                </span>
              </div>
            </button>
            <p className="text-xs text-stone-400 leading-relaxed">
              Maison de mode contemporaine en ligne à Dakar. Pièces réelles en prêt-à-porter, lunettes de créateurs et maroquinerie d'exception. Tu commandes, on te livre.
            </p>
            <div className="space-y-2 text-xs text-stone-400 pt-2">
              <p>
                <a
                  href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>WhatsApp : <strong className="text-white">{STORE_PHONE_WHATSAPP_DISPLAY}</strong></span>
                </a>
              </p>
              <p>
                <a
                  href={`tel:+${STORE_CALL_PHONE}`}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-stone-400" />
                  <span>Appel direct : <strong className="text-white">{STORE_PHONE_CALL_DISPLAY}</strong></span>
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-stone-400" />
                  <span>Email : <strong className="text-white">{STORE_EMAIL}</strong></span>
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

          {/* Col 3: Service Client & Suivi */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Suivi & Commandes
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={goToOrders}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Historique de mes commandes</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => goToTracking()}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Suivre mon colis en direct
                </button>
              </li>
              <li>Livraison à domicile express</li>
              <li>Règlement : Wave, Orange Money, Espèces ou Free</li>
              <li>Échange de taille sous 7 jours</li>
              <li className="pt-2 border-t border-[#24211E]">
                <button
                  onClick={goToAdmin}
                  className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-[11px]"
                >
                  <Lock className="w-3 h-3 text-zinc-600" />
                  <span>Espace Propriétaire (Gestion)</span>
                </button>
              </li>
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
