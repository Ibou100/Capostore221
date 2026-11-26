import React from 'react';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../ui/BrandLogo';
import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  TIKTOK_URL,
  STORE_WHATSAPP_PHONE,
  STORE_CALL_PHONE,
  STORE_PHONE_WHATSAPP_DISPLAY,
  STORE_PHONE_CALL_DISPLAY,
  STORE_EMAIL,
} from '../../utils/format';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const [tapCount, setTapCount] = React.useState(0);
  const lastTapRef = React.useRef(0);
  const { goToHome, switchStore } = useStore();

  const handleSecretAdminTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current > 3000) {
      setTapCount(1);
    } else {
      const next = tapCount + 1;
      if (next >= 5) {
        window.location.href = '/admin';
        return;
      }
      setTapCount(next);
    }
    lastTapRef.current = now;
  };

  return (
    <footer className="bg-[#F6F5F2] text-[#0A0A0A] border-t border-[#E8E6E1]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={goToHome}
              className="flex items-center text-left group"
              aria-label="CAPOSTORE221 - Accueil"
            >
              <BrandLogo size="sm" />
            </button>
            <p className="text-sm text-[#5F5F5A] leading-relaxed max-w-xs">
              Boutique en ligne d'habillement et d'électronique au Sénégal. Tu commandes, on te livre.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <img src="/payments/wave.png" alt="Wave" className="w-7 h-7 rounded-md object-contain bg-white border border-[#E8E6E1] p-0.5" loading="lazy" />
              <img src="/payments/orange-money.png" alt="Orange Money" className="w-7 h-7 rounded-md object-contain bg-white border border-[#E8E6E1] p-0.5" loading="lazy" />
              <img src="/payments/yas.png" alt="Yas" className="w-7 h-7 rounded-md object-contain bg-white border border-[#E8E6E1] p-0.5" loading="lazy" />
              <img src="/payments/visa-mastercard.svg" alt="Visa / Mastercard" className="h-7 w-10 rounded-md object-contain bg-white border border-[#E8E6E1] p-0.5" loading="lazy" />
            </div>
          </div>

          {/* Col 2: Boutiques */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-sm text-[#0A0A0A]">Boutiques</h3>
            <ul className="space-y-2.5 text-sm text-[#5F5F5A]">
              <li>
                <button
                  type="button"
                  onClick={() => switchStore('mode')}
                  className="hover:text-[#0A0A0A] transition-colors"
                >
                  Habillement
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => switchStore('electronique')}
                  className="hover:text-[#0A0A0A] transition-colors"
                >
                  Électronique
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Aide */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-sm text-[#0A0A0A]">Aide & livraison</h3>
            <ul className="space-y-2.5 text-sm text-[#5F5F5A]">
              <li>Commandes au Sénégal & à l'international</li>
              <li>Carte bancaire (Visa / Mastercard), Wave, Orange Money, Yas ou espèces</li>
              <li>Échanges sous 7 jours</li>
              <li>
                <a
                  href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#0A0A0A] font-medium hover:text-[#C2410C] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" strokeWidth={1.75} />
                  <span>WhatsApp {STORE_PHONE_WHATSAPP_DISPLAY}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & réseaux */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-sm text-[#0A0A0A]">Contact & réseaux</h3>
            <ul className="space-y-2.5 text-sm text-[#5F5F5A]">
              <li>
                <a
                  href={`tel:+${STORE_CALL_PHONE}`}
                  className="inline-flex items-center gap-2 hover:text-[#0A0A0A] transition-colors"
                >
                  <Phone className="w-4 h-4" strokeWidth={1.75} />
                  <span>{STORE_PHONE_CALL_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="inline-flex items-center gap-2 hover:text-[#0A0A0A] transition-colors"
                >
                  <Mail className="w-4 h-4" strokeWidth={1.75} />
                  <span>{STORE_EMAIL}</span>
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#0A0A0A] transition-colors">
                  Instagram @capostore221
                </a>
              </li>
              <li>
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#0A0A0A] transition-colors">
                  TikTok @capostore.221
                </a>
              </li>
              <li>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#0A0A0A] transition-colors">
                  Facebook CAPOSTORE221
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-12 border-t border-[#E8E6E1] flex flex-col sm:flex-row items-center justify-between text-[13px] text-[#5F5F5A] gap-3">
          <p onClick={handleSecretAdminTap} className="cursor-default select-none">
            © {CURRENT_YEAR} CAPOSTORE221. Tous droits réservés.
          </p>
          <span>Prix en FCFA (XOF) · Tu commandes, on te livre.</span>
        </div>
      </div>
    </footer>
  );
};
