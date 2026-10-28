import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Sparkles, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA, getWhatsAppOrderLink } from '../../utils/format';

interface FeaturedHeroItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  price: number;
  image: string;
  material: string;
  badge: string;
}

export const Hero: React.FC = () => {
  const { goToProduct, goToCatalog } = useStore();

  const featuredItems: FeaturedHeroItem[] = [
    {
      id: 'capo-client-001',
      name: 'Pantalon Tailleur Prince de Galles « Signature »',
      category: 'Pantalons Tailleur',
      tagline: 'Coupe fuselée contemporaine en sergé souple Prince de Galles gris chiné et liseré signature.',
      price: 32000,
      image: '/products/pantalon-prince-galles.jpg',
      material: 'Viscose & Coton Peigné',
      badge: 'Best-Seller',
    },
    {
      id: 'capo-client-003',
      name: 'Pantalon Cargo Large Carpenter Écru « Heritage »',
      category: 'Streetwear & Carpenter',
      tagline: 'Coupe droite relax skate/streetwear en sergé de coton écru 340 g/m² et doubles genoux surpiqués.',
      price: 38000,
      image: '/products/pantalon-cargo-ecru.jpg',
      material: '100% Coton Bio 340 g/m²',
      badge: 'Tendance Streetwear',
    },
    {
      id: 'capo-client-016',
      name: 'Chemise Oxford Slim Fit Bleu Azur « Oxford Prestige »',
      category: 'Chemises & Hauts',
      tagline: 'Tissage Oxford lourd en pur coton azur éclatant, col boutonné classique et broderie marine de prestige.',
      price: 34000,
      image: '/products/chemise-oxford-bleu-azur.png',
      material: '100% Coton Double Retors',
      badge: 'Élégance Pure',
    },
    {
      id: 'capo-client-018',
      name: 'Monture Optique Acétate Sculpté « Optique Prestige »',
      category: 'Lunettes de Créateur',
      tagline: 'Acétate italien biseauté prune et reflets écaille, armatures métalliques ciselées en filigrane.',
      price: 42000,
      image: '/products/monture-lunettes-acetate-bordeaux.jpg',
      material: 'Acétate Italien & Acier Gravé',
      badge: 'Collection Optique',
    },
    {
      id: 'capo-client-021',
      name: 'Pochette à Main Cuir Matelassé « XQR »',
      category: 'Maroquinerie d\'Action',
      tagline: 'Cuir pleine fleur marron ébène, matelassage géométrique quadrillé, logo 3D gunmetal et dragonne.',
      price: 35000,
      image: '/products/pochette-cuir-dragonne-xqr.png',
      material: 'Cuir Vachette Pleine Fleur',
      badge: 'Maroquinerie Prestige',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredItems.length]);

  const currentItem = featuredItems[currentIndex];
  const whatsappLink = getWhatsAppOrderLink(currentItem.name, currentItem.price);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  };

  return (
    <section className="relative w-full bg-[#FAF8F5] border-b border-[#EAE5DC] overflow-hidden">
      {/* Decorative Warm African Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#B85226] via-[#D49A3D] to-[#141210]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        
        {/* Top Editorial Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-[#EAE5DC]">
          <div className="flex items-center gap-2">
            <span className="text-base">🛍️</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B85226]">
              CAPOSTORE221 • Vente en Ligne
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-xs text-[#6B645A] font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#B85226]" />
              Tu commandes, on te livre
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B85226]" />
              Photos 100% Réelles
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D49A3D]" />
              Paiement Wave, OM & à la livraison
            </span>
          </div>
        </div>

        {/* Hero Fashion Lookbook Showcase */}
        <div className="bg-white rounded-xl border border-[#E5DFD5] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left: Product Information & Buying Prompts */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 text-left flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Badge */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#141210] text-white rounded-full">
                    {currentItem.badge}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#B85226]">
                    {currentItem.category}
                  </span>
                </div>

                {/* Main Product Name */}
                <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-[#141210] tracking-tight leading-[1.1]">
                  {currentItem.name}
                </h1>

                {/* Subtitle / Material */}
                <p className="text-sm sm:text-base text-[#524B43] leading-relaxed">
                  {currentItem.tagline}
                </p>

                {/* Material tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#FAF8F5] border border-[#EDE7DF] text-xs font-semibold text-[#141210]">
                  <Sparkles className="w-3.5 h-3.5 text-[#B85226]" />
                  <span>Matière : {currentItem.material}</span>
                </div>

                {/* Big Bold Price */}
                <div className="pt-2 flex items-baseline gap-3">
                  <span className="font-display font-black text-3xl sm:text-4xl text-[#141210]">
                    {formatFCFA(currentItem.price)}
                  </span>
                  <span className="text-xs font-bold text-[#1F7A3F] bg-[#E8F5E9] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    En stock disponible
                  </span>
                </div>
              </div>

              {/* Buying CTAs: 1-Click WhatsApp + View Details */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Direct WhatsApp Buying */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3.5 rounded font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Commander sur WhatsApp</span>
                </a>

                {/* View Details */}
                <button
                  onClick={() => goToProduct(currentItem.id)}
                  className="bg-[#141210] hover:bg-[#2C2723] text-white px-6 py-3.5 rounded font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>Voir la fiche & Choisir la taille</span>
                </button>
              </div>

              {/* Slider Navigation Controls */}
              <div className="pt-6 border-t border-[#F0ECE4] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {featuredItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentIndex === idx ? 'w-8 bg-[#B85226]' : 'w-2 bg-[#D9CEBE] hover:bg-[#141210]'
                      }`}
                      aria-label={`Aller au produit ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#141210] hover:text-white text-[#141210] border border-[#E0D9CE] flex items-center justify-center transition-colors"
                    aria-label="Pièce précédente"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-[#8C8273]">
                    {currentIndex + 1} / {featuredItems.length}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#141210] hover:text-white text-[#141210] border border-[#E0D9CE] flex items-center justify-center transition-colors"
                    aria-label="Pièce suivante"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right: Generous Full-Height Studio Product Image */}
            <div 
              onClick={() => goToProduct(currentItem.id)}
              className="lg:col-span-6 bg-[#FAF8F5] p-6 sm:p-10 lg:p-12 flex items-center justify-center cursor-pointer relative group border-t lg:border-t-0 lg:border-l border-[#EAE5DC] min-h-[360px] sm:min-h-[500px]"
            >
              {/* Photo uncropped with object-contain */}
              <img
                src={currentItem.image}
                alt={currentItem.name}
                className="w-full h-full max-h-[480px] object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating clickable prompt */}
              <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D9CEBE] shadow-md text-xs font-bold text-[#141210] flex items-center gap-1.5 group-hover:bg-[#141210] group-hover:text-white transition-all">
                <span>Cliquer pour voir en détail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>

        {/* Quick Link to Browse All 21 Pieces */}
        <div className="mt-8 text-center">
          <button
            onClick={() => goToCatalog({ category: 'tous' })}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B85226] hover:text-[#141210] transition-colors py-1"
          >
            <span>Explorer l'ensemble des 21 pièces disponibles en stock</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
