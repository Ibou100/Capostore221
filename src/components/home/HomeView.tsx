import React from 'react';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getProductStoreType } from '../../data/products';
import { STORE_WHATSAPP_PHONE } from '../../utils/format';
import { Hero } from './Hero';
import { CollectionsGrid } from './CollectionsGrid';
import { NewArrivals } from './NewArrivals';
import { SmartImage } from '../ui/SmartImage';

export const HomeView: React.FC = () => {
  const { hasEnteredStore, switchStore, products } = useStore();

  const modeProducts = products.filter((p) => p.published && getProductStoreType(p) === 'mode');
  const techProducts = products.filter((p) => p.published && getProductStoreType(p) === 'electronique');
  const modeCount = modeProducts.length;
  const techCount = techProducts.length;

  const portalImage = modeProducts[0]?.images?.[0] || '/products/pantalon-cargo-ecru.jpg';

  if (!hasEnteredStore) {
    return (
      <div className="bg-white min-h-[82vh] flex flex-col justify-between">
        <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-16 pb-16 sm:pb-24">
          {/* Header */}
          <div className="max-w-2xl text-left mb-10 sm:mb-14 space-y-3">
            <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-[#0A0A0A] tracking-tightest leading-[1.06]">
              Que cherchez-vous aujourd'hui ?
            </h1>
            <p className="text-base sm:text-lg text-[#5F5F5A] font-normal">
              Deux boutiques, une seule livraison rapide.
            </p>
          </div>

          {/* 2 Large Portal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1: Habillement */}
            <button
              type="button"
              onClick={() => switchStore('mode')}
              className="group relative h-[420px] sm:h-[520px] w-full rounded-[28px] overflow-hidden bg-[#F6F5F2] text-left cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-premium"
            >
              <SmartImage
                src={portalImage}
                alt="Boutique Habillement CAPOSTORE221"
                priority
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Top-left count pill */}
              <div className="absolute top-6 left-6">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-white text-[#0A0A0A] text-[13px] font-medium shadow-subtle">
                  {modeCount} article{modeCount > 1 ? 's' : ''}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-7 left-7 right-7 text-white space-y-2">
                <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight">
                  Habillement
                </h2>
                <p className="text-sm sm:text-base text-white/85">
                  Vêtements, chaussures, parfums, lunettes et accessoires
                </p>
                <div className="pt-2 inline-flex items-center gap-2 text-sm font-medium text-white">
                  <span>Entrer dans la boutique</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" strokeWidth={1.75} />
                </div>
              </div>
            </button>

            {/* Card 2: Électronique */}
            <button
              type="button"
              onClick={() => switchStore('electronique')}
              className="group relative h-[420px] sm:h-[520px] w-full rounded-[28px] overflow-hidden bg-[#0A0A0A] text-left cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-premium"
            >
              {/* Line-art Smartphone SVG Illustration */}
              <div className="absolute inset-0 flex items-center justify-center opacity-25 group-hover:opacity-35 transition-opacity duration-200 pointer-events-none">
                <svg
                  viewBox="0 0 220 340"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-48 sm:w-56 h-auto text-white"
                  aria-hidden="true"
                >
                  <rect x="20" y="16" width="180" height="308" rx="34" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="32" y="28" width="156" height="284" rx="24" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
                  <rect x="82" y="38" width="56" height="14" rx="7" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="126" cy="45" r="2.5" fill="currentColor" />
                  <line x1="86" y1="296" x2="134" y2="296" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Top-left badge */}
              <div className="absolute top-6 left-6">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-white text-[#0A0A0A] text-[13px] font-medium">
                  {techCount === 0 ? 'Nouveau' : `${techCount} article${techCount > 1 ? 's' : ''}`}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-7 left-7 right-7 text-white space-y-2">
                <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight">
                  Électronique
                </h2>
                <p className="text-sm sm:text-base text-zinc-300">
                  iPhone, ordinateurs, tablettes, montres et audio
                </p>
                <div className="pt-2 inline-flex items-center gap-2 text-sm font-medium text-white">
                  <span>Entrer dans la boutique</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" strokeWidth={1.75} />
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
