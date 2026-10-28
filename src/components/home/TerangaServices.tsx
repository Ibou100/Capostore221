import React from 'react';
import { Truck, MessageCircle, ShieldCheck, RefreshCw } from 'lucide-react';

export const TerangaServices: React.FC = () => {
  return (
    <section className="py-10 lg:py-12 bg-white border-y border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          
          {/* Pillar 1 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] hover:border-[#B85226] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-11 h-11 rounded-full bg-[#141210] text-[#D49A3D] flex items-center justify-center shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210]">
                Livraison Dakar 24H
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Almadies, Plateau, Mermoz, Maristes, Parcelles, Pikine & envoi rapide dans toutes les régions.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] hover:border-[#25D366] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210]">
                Commande WhatsApp
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Commandez directement en ligne ou écrivez-nous sur WhatsApp pour réserver vos pièces.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] hover:border-[#B85226] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-11 h-11 rounded-full bg-[#141210] text-[#D49A3D] flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210]">
                Wave & Orange Money
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Paiement mobile sécurisé ou espèces remises en main propre au livreur après contrôle.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] hover:border-[#B85226] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-11 h-11 rounded-full bg-[#B85226] text-white flex items-center justify-center shrink-0 shadow-sm">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210]">
                L'Esprit Teranga
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Possibilité d'essayer votre vêtement à la livraison et échange de taille sous 7 jours.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
