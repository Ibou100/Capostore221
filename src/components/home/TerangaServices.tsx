import React from 'react';
import { ShoppingBag, CheckCircle2, Truck, Wallet } from 'lucide-react';

export const TerangaServices: React.FC = () => {
  return (
    <section className="py-10 lg:py-12 bg-white border-y border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title / Promise header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#B85226] mb-1">
            Vente en Ligne Simplifiée
          </p>
          <h3 className="font-display font-black text-xl sm:text-2xl text-[#141210] uppercase tracking-tight">
            Comment ça marche ? Tu commandes, on te livre
          </h3>
          <p className="text-xs text-[#6B645A] mt-1">
            Faites vos achats en toute sérénité depuis chez vous, nous nous occupons du reste.
          </p>
        </div>

        {/* 4 Clean Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] hover:border-[#B85226] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-11 h-11 rounded-full bg-[#141210] text-[#D49A3D] flex items-center justify-center shrink-0 shadow-sm font-display font-black text-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#B85226]">Étape 1</div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210] mt-0.5">
                Tu passes commande
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Choisis ton article sur le catalogue et commande en 1 clic sur WhatsApp (76 832 11 57) ou par appel (77 256 39 90).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] hover:border-[#B85226] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-11 h-11 rounded-full bg-[#B85226] text-white flex items-center justify-center shrink-0 shadow-sm font-display font-black text-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#B85226]">Étape 2</div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210] mt-0.5">
                Validation & Préparation
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Le vendeur reçoit votre demande, valide la commande et prépare soigneusement votre colis.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] hover:border-[#B85226] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-11 h-11 rounded-full bg-[#141210] text-[#D49A3D] flex items-center justify-center shrink-0 shadow-sm font-display font-black text-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#B85226]">Étape 3</div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210] mt-0.5">
                Expédition & Livraison
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Votre bagage est acheminé et livré directement à l'adresse que vous avez indiquée.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] hover:border-[#25D366] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm font-display font-black text-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#25D366]">Étape 4</div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#141210] mt-0.5">
                Paiement Sécurisé
              </h4>
              <p className="text-xs text-[#6B645A] mt-1 leading-relaxed">
                Payez en toute confiance par Wave, Orange Money ou en espèces directement à la réception.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
