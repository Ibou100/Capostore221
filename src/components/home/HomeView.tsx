import React from 'react';
import { ShoppingBag, Smartphone, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getProductStoreType } from '../../data/products';
import { Hero } from './Hero';
import { CollectionsGrid } from './CollectionsGrid';
import { LiveActivityBar } from './LiveActivityBar';
import { NewArrivals } from './NewArrivals';
import { NewsletterSection } from './NewsletterSection';

export const HomeView: React.FC = () => {
  const { hasEnteredStore, switchStore, products } = useStore();

  const modeCount = products.filter((p) => p.published && getProductStoreType(p) === 'mode').length;
  const techCount = products.filter((p) => p.published && getProductStoreType(p) === 'electronique').length;

  if (!hasEnteredStore) {
    return (
      <section className="min-h-[78vh] bg-[#FAF8F5] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-2.5">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#B85D19]">
              CAPOSTORE221
            </span>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-[#141210] tracking-tight">
              Choisissez votre boutique
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              Sélectionnez l'univers que vous souhaitez consulter
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => switchStore('mode')}
              className="group bg-white hover:bg-[#141210] border-2 border-[#E7E2D9] hover:border-[#141210] rounded-2xl p-6 sm:p-8 text-left transition-all duration-200 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between gap-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] group-hover:bg-[#B85D19] text-[#141210] group-hover:text-white border border-[#E7E2D9] group-hover:border-[#B85D19] flex items-center justify-center transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 group-hover:bg-white/10 text-zinc-700 group-hover:text-zinc-200 transition-colors">
                  {modeCount} article{modeCount > 1 ? 's' : ''}
                </span>
              </div>

              <div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-[#141210] group-hover:text-white transition-colors">
                  Boutique Habillement
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 group-hover:text-zinc-300 mt-1.5 transition-colors">
                  Vêtements, Chaussures, Parfums, Lunettes & Accessoires
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B85D19] group-hover:text-white transition-colors">
                <span>Accéder à la boutique</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => switchStore('electronique')}
              className="group bg-white hover:bg-[#141210] border-2 border-[#E7E2D9] hover:border-[#141210] rounded-2xl p-6 sm:p-8 text-left transition-all duration-200 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between gap-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] group-hover:bg-[#B85D19] text-[#141210] group-hover:text-white border border-[#E7E2D9] group-hover:border-[#B85D19] flex items-center justify-center transition-colors">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 group-hover:bg-white/10 text-zinc-700 group-hover:text-zinc-200 transition-colors">
                  {techCount} article{techCount > 1 ? 's' : ''}
                </span>
              </div>

              <div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-[#141210] group-hover:text-white transition-colors">
                  Boutique Électronique
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 group-hover:text-zinc-300 mt-1.5 transition-colors">
                  iPhones, Ordinateurs, Tablettes, Audio & Équipements Tech
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B85D19] group-hover:text-white transition-colors">
                <span>Accéder à la boutique</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* 1. Hero Showcase */}
      <Hero />

      {/* 2. Categories */}
      <CollectionsGrid />

      {/* 3. Catalog */}
      <NewArrivals />

      {/* 4. Recent Orders */}
      <LiveActivityBar />

      {/* 5. Contact */}
      <NewsletterSection />
    </div>
  );
};
