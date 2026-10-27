import React from 'react';
import { Truck, MessageCircle, ShieldCheck, RefreshCw } from 'lucide-react';

export const TerangaServices: React.FC = () => {
  return (
    <section className="py-12 bg-white border-y border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          
          {/* Pillar 1 */}
          <div className="flex items-start gap-3.5 p-4 rounded-sm bg-[#FAF7F2] border border-[#EDE5D8]">
            <div className="w-10 h-10 rounded-full bg-[#141210] text-[#D49A3D] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210]">
                Livraison Dakar 24H
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Almadies, Plateau, Mermoz, Maristes, Parcelles, Pikine & envoi sécurisé dans toutes les régions.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-3.5 p-4 rounded-sm bg-[#FAF7F2] border border-[#EDE5D8]">
            <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210]">
                Commande WhatsApp
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Commandez directement en ligne ou discutez avec notre équipe sur WhatsApp en 1 clic.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-3.5 p-4 rounded-sm bg-[#FAF7F2] border border-[#EDE5D8]">
            <div className="w-10 h-10 rounded-full bg-[#141210] text-[#D49A3D] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210]">
                Wave & Orange Money
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Paiement mobile instantané ou espèces remises en main propre au livreur après contrôle.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start gap-3.5 p-4 rounded-sm bg-[#FAF7F2] border border-[#EDE5D8]">
            <div className="w-10 h-10 rounded-full bg-[#B85D19] text-white flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210]">
                L'Esprit Teranga
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Possibilité d'essayage à la livraison et échange rapide de taille en toute simplicité.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
