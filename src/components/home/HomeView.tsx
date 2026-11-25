import React from 'react';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { STORE_WHATSAPP_PHONE } from '../../utils/format';
import { Hero } from './Hero';
import { CollectionsGrid } from './CollectionsGrid';
import { NewArrivals } from './NewArrivals';
import { SmartImage } from '../ui/SmartImage';

export const HomeView: React.FC = () => {
  const { hasEnteredStore, switchStore } = useStore();

  const portalImage = '/portal-habillement.jpg';
  const techPortalImage = '/portal-electronique.jpg';

  if (!hasEnteredStore) {
    return (
      <div className="bg-white min-h-[82vh] flex flex-col justify-between">
        <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-5 sm:pt-12 lg:pt-16 pb-12 sm:pb-24">
          {/* Header */}
          <div className="max-w-2xl text-left mb-5 sm:mb-10 lg:mb-14 space-y-1.5 sm:space-y-3">
            <h1 className="font-display font-semibold text-[28px] sm:text-5xl lg:text-6xl text-[#0A0A0A] tracking-tightest leading-[1.08]">
              Que cherchez-vous aujourd'hui ?
            </h1>
            <p className="text-sm sm:text-lg text-[#5F5F5A] font-normal">
              Deux boutiques, une seule livraison rapide.
            </p>
          </div>

          {/* 2 Large Portal Cards — both fit above the fold on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6 lg:gap-8">
            {/* Card 1: Habillement */}
            <button
              type="button"
              onClick={() => switchStore('mode')}
              className="group relative h-[210px] sm:h-[320px] md:h-[500px] w-full rounded-[22px] sm:rounded-[28px] overflow-hidden bg-[#F6F5F2] text-left cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-premium"
            >
              <SmartImage
                src={portalImage}
                alt="Boutique Habillement CAPOSTORE221"
                priority
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Bottom content */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-7 sm:left-7 sm:right-7 text-white space-y-1 sm:space-y-2">
                <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight">
                  Habillement
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-white/85 line-clamp-1 sm:line-clamp-none">
                  Vêtements, chaussures, parfums, lunettes et accessoires
                </p>
                <div className="pt-0.5 sm:pt-2 inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-white">
                  <span>Entrer dans la boutique</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1.5" strokeWidth={1.75} />
                </div>
              </div>
            </button>

            {/* Card 2: Électronique */}
            <button
              type="button"
              onClick={() => switchStore('electronique')}
              className="group relative h-[210px] sm:h-[320px] md:h-[500px] w-full rounded-[22px] sm:rounded-[28px] overflow-hidden bg-[#0A0A0A] text-left cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-premium"
            >
              <SmartImage
                src={techPortalImage}
                alt="Boutique Électronique CAPOSTORE221"
                priority
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Bottom content */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-7 sm:left-7 sm:right-7 text-white space-y-1 sm:space-y-2">
                <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight">
                  Électronique
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-zinc-300 line-clamp-1 sm:line-clamp-none">
                  iPhone, ordinateurs, tablettes, montres et audio
                </p>
                <div className="pt-0.5 sm:pt-2 inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-white">
                  <span>Entrer dans la boutique</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1.5" strokeWidth={1.75} />
                </div>
              </div>
            </button>
          </div>

          {/* 4 Simple Reassurances */}
          <div className="mt-14 pt-8 border-t border-[#E8E6E1] grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="flex items-center gap-3 text-sm text-[#0A0A0A]">
              <Truck className="w-4 h-4 text-[#5F5F5A] shrink-0" strokeWidth={1.75} />
              <span>Livraison directe</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#0A0A0A]">
              <ShieldCheck className="w-4 h-4 text-[#5F5F5A] shrink-0" strokeWidth={1.75} />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#0A0A0A]">
              <RefreshCw className="w-4 h-4 text-[#5F5F5A] shrink-0" strokeWidth={1.75} />
              <span>Échanges 7 jours</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#0A0A0A]">
              <MessageCircle className="w-4 h-4 text-[#5F5F5A] shrink-0" strokeWidth={1.75} />
              <span>Service client WhatsApp</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Storefront Hero */}
      <Hero />

      {/* 2. Categories */}
      <CollectionsGrid />

      {/* 3. New Arrivals / Products */}
      <NewArrivals />

      {/* 4. Clean 1-line WhatsApp Band */}
      <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <div className="rounded-[24px] bg-[#F6F5F2] px-6 sm:px-12 py-10 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[#0A0A0A]">
              Une question ? Écris-nous sur WhatsApp
            </h2>
            <p className="text-sm sm:text-base text-[#5F5F5A]">
              Tu commandes, on te livre partout au Sénégal.
            </p>
          </div>
          <a
            href={`https://wa.me/${STORE_WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-7 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
            <span>Discuter sur WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
