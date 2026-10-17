import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- VÊTEMENTS (HOMME & FEMME & UNISEXE) ---
  {
    id: 'capo-vet-001',
    name: 'Blouson Aviateur Structuré « Almadies »',
    slug: 'blouson-aviateur-structure-almadies',
    category: 'vetements',
    subCategory: 'Vestes & Manteaux',
    gender: 'unisexe',
    price: 95000,
    compareAtPrice: 110000,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Une pièce maîtresse alliant la rigueur du tailoring urbain et la décontraction contemporaine. Confectionné dans un sergé lourd déperlant au tombé impeccable, doté de zips métalliques argent mat brossé et d\'une doublure satinée monogrammée CAPO.',
    details: [
      'Coupe droite oversize légèrement écourtée',
      'Tissu extérieur sergé technique 380 g/m²',
      'Fermeture zippée double curseur YKK en métal argenté',
      'Poches latérales passepoilées avec boutons pression invisibles',
      'Nettoyage à sec spécialisé recommandé'
    ],
    materials: '100% Coton sergé lourd déperlant, doublure 100% cupro',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Noir Onyx', hex: '#111113' },
      { name: 'Gris Asphalte', hex: '#4A4A52' }
    ],
    variants: [
      { id: 'v1', size: 'S', color: { name: 'Noir Onyx', hex: '#111113' }, stock: 4 },
      { id: 'v2', size: 'M', color: { name: 'Noir Onyx', hex: '#111113' }, stock: 6 },
      { id: 'v3', size: 'L', color: { name: 'Noir Onyx', hex: '#111113' }, stock: 3 },
      { id: 'v4', size: 'XL', color: { name: 'Noir Onyx', hex: '#111113' }, stock: 2 },
      { id: 'v5', size: 'M', color: { name: 'Gris Asphalte', hex: '#4A4A52' }, stock: 5 },
      { id: 'v6', size: 'L', color: { name: 'Gris Asphalte', hex: '#4A4A52' }, stock: 2 },
    ],
    stock: 22,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-03-10'
  },
  {
    id: 'capo-vet-002',
    name: 'T-Shirt Oversize « 221 Core »',
    slug: 't-shirt-oversize-221-core',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'unisexe',
    price: 25000,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Le basique ultime élevé au rang de standard luxe. Coton peigné 280 GSM au tombé lourd, col côtelé épais indéformable et broderie ton-sur-ton « CAPO 221 » discrète au dos du col.',
    details: [
      'Coupe ample carrée boxy fit',
      '100% Coton biologique peigné 280 GSM',
      'Col rond côtelé 3 cm indéformable',
      'Prérétréci pour une stabilité dimensionnelle durable',
      'Lavage en machine à 30°C sur l\'envers'
    ],
    materials: '100% Coton biologique certifié GOTS',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Craie Pure', hex: '#F4F4F4' },
      { name: 'Noir Intense', hex: '#0D0D0E' },
      { name: 'Terre Sablonneuse', hex: '#9C8873' }
    ],
    variants: [
      { id: 'v7', size: 'S', color: { name: 'Craie Pure', hex: '#F4F4F4' }, stock: 8 },
      { id: 'v8', size: 'M', color: { name: 'Craie Pure', hex: '#F4F4F4' }, stock: 12 },
      { id: 'v9', size: 'L', color: { name: 'Craie Pure', hex: '#F4F4F4' }, stock: 9 },
      { id: 'v10', size: 'M', color: { name: 'Noir Intense', hex: '#0D0D0E' }, stock: 15 },
      { id: 'v11', size: 'L', color: { name: 'Noir Intense', hex: '#0D0D0E' }, stock: 10 },
      { id: 'v12', size: 'XL', color: { name: 'Noir Intense', hex: '#0D0D0E' }, stock: 6 },
    ],
    stock: 60,
    isNew: false,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-02-15'
  },
  {
    id: 'capo-vet-003',
    name: 'Pantalon Cargo Tailleur « Plateau »',
    slug: 'pantalon-cargo-tailleur-plateau',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 55000,
    compareAtPrice: 65000,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Une fusion parfaite entre l\'utilitaire urbain et les lignes formelles d\'un pantalon tailleur. Poches cargo à soufflet plat intégrées sans surépaisseur, pinces frontales et patte de serrage dissimulée à la taille.',
    details: [
      'Coupe fuselée relax à taille mi-haute',
      'Pinces architecturales sur le devant',
      'Deux poches cargo plaquées discrètes avec rabat aimanté',
      'Passants pour ceinture et pattes d\'ajustement latérales',
      'Finitions intérieures gansées'
    ],
    materials: '68% Laine froide, 28% Polyester recyclé, 4% Élasthanne',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Noir Charbon', hex: '#161619' },
      { name: 'Olive Sombre', hex: '#3B4237' }
    ],
    variants: [
      { id: 'v13', size: 'S', color: { name: 'Noir Charbon', hex: '#161619' }, stock: 4 },
      { id: 'v14', size: 'M', color: { name: 'Noir Charbon', hex: '#161619' }, stock: 7 },
      { id: 'v15', size: 'L', color: { name: 'Noir Charbon', hex: '#161619' }, stock: 5 },
      { id: 'v16', size: 'XL', color: { name: 'Noir Charbon', hex: '#161619' }, stock: 3 },
    ],
    stock: 19,
    isNew: true,
    isFeatured: false,
    isPopular: true,
    published: true,
    createdAt: '2026-03-01'
  },
  {
    id: 'capo-vet-004',
    name: 'Blazer Croisé Architectural « Médina »',
    slug: 'blazer-croise-architectural-medina',
    category: 'vetements',
    subCategory: 'Vestes & Manteaux',
    gender: 'femme',
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Une silhouette audacieuse aux épaules appuyées et au croisé profond. Conçu pour apporter une allure sculpturale instantanée, que ce soit porté avec le pantalon coordonné ou un denim brut décontracté.',
    details: [
      'Coupe déstructurée oversize féminine',
      'Épaulettes intégrées légères pour une carrure nette',
      'Boutonnage croisé avec boutons en corne gravée CAPO',
      'Poches à rabat et fente centrale d\'aisance au dos'
    ],
    materials: '70% Viscose fluide lourde, 30% Coton peigné',
    availableSizes: ['XS', 'S', 'M', 'L'],
    availableColors: [
      { name: 'Blanc Ivoire', hex: '#F0EFEA' },
      { name: 'Noir Minéral', hex: '#121214' }
    ],
    variants: [
      { id: 'v17', size: 'XS', color: { name: 'Blanc Ivoire', hex: '#F0EFEA' }, stock: 3 },
      { id: 'v18', size: 'S', color: { name: 'Blanc Ivoire', hex: '#F0EFEA' }, stock: 5 },
      { id: 'v19', size: 'M', color: { name: 'Blanc Ivoire', hex: '#F0EFEA' }, stock: 4 },
      { id: 'v20', size: 'S', color: { name: 'Noir Minéral', hex: '#121214' }, stock: 6 },
    ],
    stock: 18,
    isNew: true,
    isFeatured: true,
    isPopular: false,
    published: true,
    createdAt: '2026-03-12'
  },
  {
    id: 'capo-vet-005',
    name: 'Hoodie Boxy Lourd « Gorée Sunset »',
    slug: 'hoodie-boxy-lourd-goree-sunset',
    category: 'vetements',
    subCategory: 'Sweats & Hoodies',
    gender: 'unisexe',
    price: 48000,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Le sweat à capuche ultime dans une confection en molleton lourd 450 GSM brossé à l\'intérieur. Capuche double épaisseur sans cordon pour une silhouette épurée minimaliste.',
    details: [
      'Molleton French Terry lourd 450 GSM ultra-doux',
      'Capuche enveloppante double épaisseur sans cordons',
      'Emmanchures descendues et coupe raccourcie boxy',
      'Bords-côtes renforcés aux poignets et à la base'
    ],
    materials: '100% Coton organique ultra-dense',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Ocre Terracotta', hex: '#9E5B42' },
      { name: 'Anthracite Foncé', hex: '#212124' }
    ],
    variants: [
      { id: 'v21', size: 'S', color: { name: 'Ocre Terracotta', hex: '#9E5B42' }, stock: 4 },
      { id: 'v22', size: 'M', color: { name: 'Ocre Terracotta', hex: '#9E5B42' }, stock: 8 },
      { id: 'v23', size: 'L', color: { name: 'Ocre Terracotta', hex: '#9E5B42' }, stock: 5 },
      { id: 'v24', size: 'M', color: { name: 'Anthracite Foncé', hex: '#212124' }, stock: 7 },
    ],
    stock: 24,
    isNew: false,
    isFeatured: false,
    isPopular: true,
    published: true,
    createdAt: '2026-01-20'
  },
  {
    id: 'capo-vet-006',
    name: 'Ensemble Drapé Satin Minimaliste',
    slug: 'ensemble-drape-satin-minimaliste',
    category: 'vetements',
    subCategory: 'Robes & Ensembles',
    gender: 'femme',
    price: 72000,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Une fluidité captivante pensée pour les soirées chaudes dakaroises. Ensemble deux pièces en satin soyeux texturé avec col asymétrique sculptural et fente d\'aisance latérale.',
    details: [
      'Matière satinée au drapé lourd et reflet mat subtil',
      'Haut sans manches avec découpe sculptée',
      'Jupe midi à taille élastiquée invisible',
      'Fabriqué en édition très limitée'
    ],
    materials: '95% Soie synthétique fluide, 5% Élasthanne',
    availableSizes: ['XS', 'S', 'M'],
    availableColors: [
      { name: 'Noir Nuit', hex: '#0B0B0C' },
      { name: 'Champagne Sable', hex: '#DED3C4' }
    ],
    variants: [
      { id: 'v25', size: 'XS', color: { name: 'Noir Nuit', hex: '#0B0B0C' }, stock: 2 },
      { id: 'v26', size: 'S', color: { name: 'Noir Nuit', hex: '#0B0B0C' }, stock: 3 },
      { id: 'v27', size: 'M', color: { name: 'Noir Nuit', hex: '#0B0B0C' }, stock: 0 }, // Out of stock on M
    ],
    stock: 5,
    isNew: true,
    isFeatured: true,
    isPopular: false,
    published: true,
    createdAt: '2026-03-05'
  },

  // --- LUNETTES (PAS DE TAILLE S/M/L) ---
  {
    id: 'capo-lun-001',
    name: 'Lunettes « Solstice » Acétate Épais',
    slug: 'lunettes-solstice-acetate-epais',
    category: 'lunettes',
    subCategory: 'Lunettes de Soleil',
    gender: 'unisexe',
    price: 42000,
    compareAtPrice: 50000,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Lignes acérées, monture biseautée sculptée à la main dans un bloc d\'acétate de cellulose italien premium. Verres solaires catégorie 3 avec protection 100% UV400, idéaux pour la luminosité dakaroise intense.',
    details: [
      'Acétate de cellulose 8mm découpé avec biseaux géométriques',
      'Charnières 7 barillets rivetées en acier inoxydable',
      'Verres minéraux teintés UV400 Catégorie 3',
      'Livré avec son étui rigide CAPO221 en cuir végane et chamoisine microfibre'
    ],
    materials: 'Acétate de cellulose biodégradable d\'Italie, charnières inox',
    // NO availableSizes! Sunglasses have no clothing sizes.
    availableColors: [
      { name: 'Noir Ébène Poli', hex: '#101012' },
      { name: 'Écaille Havane', hex: '#583D29' },
      { name: 'Ambre Fumé', hex: '#A86C32' }
    ],
    variants: [
      { id: 'v28', color: { name: 'Noir Ébène Poli', hex: '#101012' }, stock: 8 },
      { id: 'v29', color: { name: 'Écaille Havane', hex: '#583D29' }, stock: 5 },
      { id: 'v30', color: { name: 'Ambre Fumé', hex: '#A86C32' }, stock: 4 },
    ],
    stock: 17,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-03-08'
  },
  {
    id: 'capo-lun-002',
    name: 'Lunettes « Dakar Matrix » Métal Profilé',
    slug: 'lunettes-dakar-matrix-metal-profile',
    category: 'lunettes',
    subCategory: 'Lunettes de Soleil',
    gender: 'unisexe',
    price: 38000,
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509695503492-413bc6d0a63a?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Design néo-futuriste ultra-léger en titane brossé. Forme rectangulaire étirée et branches ultra-fines pour un style affirmé et un confort de port absolu.',
    details: [
      'Armature ultra-légère en alliage de titane flexible',
      'Plaquettes nasales ajustables en silicone hypoallergénique',
      'Verres miroités argent ou gris fumé UV400',
      'Poids plume : seulement 24 grammes'
    ],
    materials: 'Alliage titane & acier inoxydable médical',
    availableColors: [
      { name: 'Argent Miroir', hex: '#C0C0C8' },
      { name: 'Noir Mat Brut', hex: '#18181A' }
    ],
    variants: [
      { id: 'v31', color: { name: 'Argent Miroir', hex: '#C0C0C8' }, stock: 6 },
      { id: 'v32', color: { name: 'Noir Mat Brut', hex: '#18181A' }, stock: 7 },
    ],
    stock: 13,
    isNew: false,
    isFeatured: false,
    isPopular: true,
    published: true,
    createdAt: '2026-02-10'
  },
  {
    id: 'capo-lun-003',
    name: 'Lunettes Pilote Contemporaines « Horizon »',
    slug: 'lunettes-pilote-contemporaines-horizon',
    category: 'lunettes',
    subCategory: 'Lunettes de Soleil',
    gender: 'unisexe',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Une réinterprétation avant-gardiste de la forme pilote classique avec double pont rectiligne et cerclage en acétate translucide teinté champagne.',
    details: [
      'Double pont droit au profil architectural',
      'Monture hybride acétate translucide et métal doré mat',
      'Protection solaire anti-éblouissement maximale',
      'Gravure discrète du logo CAPO sur le verre supérieur gauche'
    ],
    materials: 'Acétate translucide & laiton brossé doré',
    availableColors: [
      { name: 'Champagne / Or Mat', hex: '#C5A880' },
      { name: 'Fumée Grise', hex: '#4F525A' }
    ],
    variants: [
      { id: 'v33', color: { name: 'Champagne / Or Mat', hex: '#C5A880' }, stock: 4 },
      { id: 'v34', color: { name: 'Fumée Grise', hex: '#4F525A' }, stock: 3 },
    ],
    stock: 7,
    isNew: true,
    isFeatured: false,
    isPopular: false,
    published: true,
    createdAt: '2026-03-01'
  },

  // --- CHAUSSURES (TAILLES 40, 41, 42, 43, 44, 45) ---
  {
    id: 'capo-ch-001',
    name: 'Sneakers Chunky « Mamelles 01 »',
    slug: 'sneakers-chunky-mamelles-01',
    category: 'chaussures',
    subCategory: 'Sneakers',
    gender: 'unisexe',
    price: 89000,
    compareAtPrice: 105000,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Une basket de luxe à la semelle sculpturale surdimensionnée. Empiècements en cuir de veau lisse pleine fleur et suède velouté, doublure cuir respirante et amorti dynamique ultra-confort.',
    details: [
      'Tige multimatières : cuir pleine fleur et cuir suédé premium',
      'Semelle extérieure crantée en gomme EVA légère et durable',
      'Semelle intérieure anatomique amovible en cuir',
      'Lacets ronds en coton ciré ton sur ton'
    ],
    materials: 'Cuir de veau pleine fleur, semelle EVA & caoutchouc naturel',
    availableSizes: ['40', '41', '42', '43', '44', '45'],
    availableColors: [
      { name: 'Blanc Craie & Gris Béton', hex: '#EBEBEB' },
      { name: 'Noir Monolithe', hex: '#141416' }
    ],
    variants: [
      { id: 'v35', size: '40', color: { name: 'Blanc Craie & Gris Béton', hex: '#EBEBEB' }, stock: 3 },
      { id: 'v36', size: '41', color: { name: 'Blanc Craie & Gris Béton', hex: '#EBEBEB' }, stock: 5 },
      { id: 'v37', size: '42', color: { name: 'Blanc Craie & Gris Béton', hex: '#EBEBEB' }, stock: 8 },
      { id: 'v38', size: '43', color: { name: 'Blanc Craie & Gris Béton', hex: '#EBEBEB' }, stock: 6 },
      { id: 'v39', size: '44', color: { name: 'Blanc Craie & Gris Béton', hex: '#EBEBEB' }, stock: 4 },
      { id: 'v40', size: '42', color: { name: 'Noir Monolithe', hex: '#141416' }, stock: 5 },
      { id: 'v41', size: '43', color: { name: 'Noir Monolithe', hex: '#141416' }, stock: 4 },
    ],
    stock: 35,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-03-02'
  },
  {
    id: 'capo-ch-002',
    name: 'Bottines Chelsea Chunky « Terrou »',
    slug: 'bottines-chelsea-chunky-terrou',
    category: 'chaussures',
    subCategory: 'Bottines & Boots',
    gender: 'unisexe',
    price: 110000,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'La botte Chelsea réinventée pour le vestiaire urbain de haut vol. Cuir de bovin au grain semi-brillant, semelle commando épaisse cousue trépointe et élastiques d\'aisance latéraux ton-sur-ton.',
    details: [
      'Construction cousue durable résistante à l\'usure',
      'Tirants en ruban tissé siglés au talon pour un enfilage facile',
      'Semelle crantée anti-dérapante haute adhérence 4,5 cm',
      'Cuir doublé à l\'intérieur pour un maintien irréprochable'
    ],
    materials: '100% Cuir de bovin gras, semelle crantée caoutchouc haute densité',
    availableSizes: ['40', '41', '42', '43', '44'],
    availableColors: [
      { name: 'Noir Onyx Ciré', hex: '#0D0D0E' }
    ],
    variants: [
      { id: 'v42', size: '40', color: { name: 'Noir Onyx Ciré', hex: '#0D0D0E' }, stock: 2 },
      { id: 'v43', size: '41', color: { name: 'Noir Onyx Ciré', hex: '#0D0D0E' }, stock: 3 },
      { id: 'v44', size: '42', color: { name: 'Noir Onyx Ciré', hex: '#0D0D0E' }, stock: 4 },
      { id: 'v45', size: '43', color: { name: 'Noir Onyx Ciré', hex: '#0D0D0E' }, stock: 3 },
      { id: 'v46', size: '44', color: { name: 'Noir Onyx Ciré', hex: '#0D0D0E' }, stock: 1 },
    ],
    stock: 13,
    isNew: false,
    isFeatured: true,
    isPopular: false,
    published: true,
    createdAt: '2026-01-25'
  },
  {
    id: 'capo-ch-003',
    name: 'Mules Minimalistes en Cuir Souple',
    slug: 'mules-minimalistes-cuir-souple',
    category: 'chaussures',
    subCategory: 'Sandales & Mules',
    gender: 'femme',
    price: 65000,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Une sandale d\'une élégance dépouillée absolue. Bride large en agneau nappa ultra-doux, semelle carrée géométrique et talon bloc biseauté de 4 cm.',
    details: [
      'Bout carré moderne',
      'Talon stable et confortable de 4 cm',
      'Semelle de propreté rembourrée en mousse mémoire de forme',
      'Fabriqué artisanalement avec finitions tranches cirées'
    ],
    materials: '100% Cuir d\'agneau nappa plongé',
    availableSizes: ['36', '37', '38', '39', '40', '41'],
    availableColors: [
      { name: 'Noir Mat', hex: '#141416' },
      { name: 'Sable Chaud', hex: '#D6C5AD' }
    ],
    variants: [
      { id: 'v47', size: '37', color: { name: 'Noir Mat', hex: '#141416' }, stock: 3 },
      { id: 'v48', size: '38', color: { name: 'Noir Mat', hex: '#141416' }, stock: 4 },
      { id: 'v49', size: '39', color: { name: 'Noir Mat', hex: '#141416' }, stock: 2 },
      { id: 'v50', size: '38', color: { name: 'Sable Chaud', hex: '#D6C5AD' }, stock: 3 },
    ],
    stock: 12,
    isNew: true,
    isFeatured: false,
    isPopular: true,
    published: true,
    createdAt: '2026-03-07'
  },

  // --- ACCESSOIRES (PAS DE TAILLE S/M/L) ---
  {
    id: 'capo-acc-001',
    name: 'Sac Bandoulière Holster « Ngor »',
    slug: 'sac-bandouliere-holster-ngor',
    category: 'accessoires',
    subCategory: 'Sacs & Maroquinerie',
    gender: 'unisexe',
    price: 49000,
    compareAtPrice: 58000,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Le compagnon urbain par excellence. Porté en bandoulière près du corps ou à la taille, ce sac en cuir grainé étanche protège vos essentiels avec une allure furtive et affûtée.',
    details: [
      'Cuir de vachette pleine fleur au grain résistant aux rayures',
      'Sangle en nylon balistique réglable avec boucle clip Cobra en aluminium',
      'Compartiment principal zippé + poche plate arrière plaquée anti-vol',
      'Dimensions : 24 cm x 16 cm x 6 cm'
    ],
    materials: 'Cuir pleine fleur résistant aux intempéries, quincaillerie acier mat',
    // NO sizes!
    availableColors: [
      { name: 'Noir Brut', hex: '#121214' },
      { name: 'Brun Cuir Brûlé', hex: '#4A2E1D' }
    ],
    variants: [
      { id: 'v51', color: { name: 'Noir Brut', hex: '#121214' }, stock: 6 },
      { id: 'v52', color: { name: 'Brun Cuir Brûlé', hex: '#4A2E1D' }, stock: 4 },
    ],
    stock: 10,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-03-04'
  },
  {
    id: 'capo-acc-002',
    name: 'Casquette Structurée « CAPO Monogram »',
    slug: 'casquette-structuree-capo-monogram',
    category: 'accessoires',
    subCategory: 'Chapeaux & Casquettes',
    gender: 'unisexe',
    price: 22000,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Couronne à profil moyen 6 panneaux, visière préincurvée et broderie relief 3D ton-sur-ton « C221 ». Boucle de serrage arrière en métal argent vieilli.',
    details: [
      'Sergé de coton 100% lourd lavé',
      'Bande de propreté intérieure absorbante thermo-régulatrice',
      'Fermoir arrière en métal avec passant dissimulé',
      'Taille unique ajustable'
    ],
    materials: '100% Coton peigné sergé haute densité',
    availableColors: [
      { name: 'Noir Absolu', hex: '#111113' },
      { name: 'Sable Minéral', hex: '#C2B8A3' },
      { name: 'Vert Forêt Sombre', hex: '#263428' }
    ],
    variants: [
      { id: 'v53', color: { name: 'Noir Absolu', hex: '#111113' }, stock: 12 },
      { id: 'v54', color: { name: 'Sable Minéral', hex: '#C2B8A3' }, stock: 8 },
      { id: 'v55', color: { name: 'Vert Forêt Sombre', hex: '#263428' }, stock: 6 },
    ],
    stock: 26,
    isNew: false,
    isFeatured: false,
    isPopular: true,
    published: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'capo-acc-003',
    name: 'Bracelet Chaîne Lourde « Dakar Link » Argent 925',
    slug: 'bracelet-chaine-lourde-dakar-link-argent-925',
    category: 'accessoires',
    subCategory: 'Bijoux Contemporains',
    gender: 'unisexe',
    price: 68000,
    images: [
      'https://images.unsplash.com/photo-1611591475155-42e9fba5ce55?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Maillons d\'inspiration industrielle aux arêtes vives biseautées et fermoir boîte sécurisé gravé au laser. Réalisé en argent massif 925 avec finition brossée semi-mate.',
    details: [
      'Argent 925 massif poinçonné certifié',
      'Poids : environ 48 grammes d\'argent massif',
      'Fermoir à cliquet double sécurité',
      'Livré avec écrin rigide et certificat d\'authenticité'
    ],
    materials: 'Argent sterling 925 massif rhodié anti-oxydation',
    availableColors: [
      { name: 'Argent Brossé', hex: '#D1D5DB' }
    ],
    variants: [
      { id: 'v56', color: { name: 'Argent Brossé', hex: '#D1D5DB' }, stock: 4 }
    ],
    stock: 4,
    isNew: true,
    isFeatured: true,
    isPopular: false,
    published: true,
    createdAt: '2026-03-11'
  },
  {
    id: 'capo-acc-004',
    name: 'Ceinture Cuir Lisse « Loop 221 »',
    slug: 'ceinture-cuir-lisse-loop-221',
    category: 'accessoires',
    subCategory: 'Ceintures & Maroquinerie',
    gender: 'unisexe',
    price: 32000,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Une pièce sobre et racée. Cuir tannage végétal de 35 mm de largeur avec tranche teintée à la main et boucle géométrique exclusive en métal coulé brossé.',
    details: [
      'Cuir tannage végétal artisanal durable qui se patine avec le temps',
      'Largeur optimale de 35 mm compatible costumes et pantalons streetwear',
      'Boucle ardillon minimaliste sans fioriture',
      'Fabriqué au Sénégal'
    ],
    materials: '100% Cuir pleine fleur tannage végétal',
    availableSizes: ['85 cm', '95 cm', '105 cm'],
    availableColors: [
      { name: 'Noir Profond', hex: '#111113' },
      { name: 'Cognac Ambré', hex: '#63381E' }
    ],
    variants: [
      { id: 'v57', size: '85 cm', color: { name: 'Noir Profond', hex: '#111113' }, stock: 3 },
      { id: 'v58', size: '95 cm', color: { name: 'Noir Profond', hex: '#111113' }, stock: 5 },
      { id: 'v59', size: '105 cm', color: { name: 'Noir Profond', hex: '#111113' }, stock: 3 },
      { id: 'v60', size: '95 cm', color: { name: 'Cognac Ambré', hex: '#63381E' }, stock: 4 },
    ],
    stock: 15,
    isNew: false,
    isFeatured: false,
    isPopular: false,
    published: true,
    createdAt: '2026-02-18'
  },

  // --- OUT OF STOCK DEMO ITEM FOR TESTING STOCK INTEGRITY ---
  {
    id: 'capo-vet-999',
    name: 'Parka Technique Déconstruite « Harmattan »',
    slug: 'parka-technique-deconstruite-harmattan',
    category: 'vetements',
    subCategory: 'Vestes & Manteaux',
    gender: 'unisexe',
    price: 135000,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Édition défilé capsule limitée. Parka trois-quarts à membrane triple couche coupe-vent et déperlante. Cette pièce d\'archive est actuellement victime de son succès.',
    details: [
      'Membrane 3 couches étanche 20 000 mm',
      'Capuche tempête ergonomique',
      'Finitions thermocollées sans coutures traversantes'
    ],
    materials: '100% Polyamide technique laminé',
    availableSizes: ['M', 'L'],
    availableColors: [
      { name: 'Noir Obsidienne', hex: '#0B0C0E' }
    ],
    variants: [
      { id: 'v99', size: 'M', color: { name: 'Noir Obsidienne', hex: '#0B0C0E' }, stock: 0 },
      { id: 'v100', size: 'L', color: { name: 'Noir Obsidienne', hex: '#0B0C0E' }, stock: 0 },
    ],
    stock: 0, // OUT OF STOCK
    isNew: false,
    isFeatured: false,
    isPopular: false,
    published: true,
    createdAt: '2026-01-05'
  }
];

export const CATEGORIES_META = [
  {
    id: 'tous',
    name: 'Tout le Catalogue',
    description: 'L\'ensemble des créations CAPO221'
  },
  {
    id: 'vetements',
    name: 'Vêtements',
    tagline: 'Tailoring décontracté, vestes d\'exception & hauts boxy',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    description: 'Une coupe irréprochable, des matières denses et un style affirmé pour le quotidien et les grands soirs.'
  },
  {
    id: 'lunettes',
    name: 'Lunettes',
    tagline: 'Montures acétate sculptées & verres UV400 haute clarté',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85',
    description: 'Des solaires de caractère pour affronter la lumière dakaroise avec panache et protection absolue.'
  },
  {
    id: 'chaussures',
    name: 'Chaussures',
    tagline: 'Sneakers volumineuses, Chelsea boots & mules en cuir souple',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
    description: 'L\'ancrage au sol de votre silhouette. Confection haut de gamme et semelles sculptées.'
  },
  {
    id: 'accessoires',
    name: 'Accessoires',
    tagline: 'Sacs holster étanches, casquettes structurées & argent 925',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
    description: 'Les détails qui font la différence. Maroquinerie d\'action et bijoux massifs contemporains.'
  }
] as const;

export const HOME_COLLECTIONS = [
  {
    title: 'Mode Homme',
    subtitle: 'Lignes architecturales & streetwear affûté',
    filterType: 'homme',
    category: 'vetements',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
    cta: 'Découvrir Homme'
  },
  {
    title: 'Mode Femme',
    subtitle: 'Élégance urbaine & silhouettes puissantes',
    filterType: 'femme',
    category: 'vetements',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    cta: 'Découvrir Femme'
  },
  {
    title: 'Lunettes',
    subtitle: 'Acétate d\'exception & protection solaire UV400',
    filterType: 'all',
    category: 'lunettes',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=85',
    cta: 'Explorer les Solaires'
  },
  {
    title: 'Chaussures',
    subtitle: 'Sneakers massives & bottines de caractère',
    filterType: 'all',
    category: 'chaussures',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
    cta: 'Voir les Chaussures'
  },
  {
    title: 'Accessoires',
    subtitle: 'Maroquinerie fonctionnelle & bijoux argent 925',
    filterType: 'all',
    category: 'accessoires',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
    cta: 'Voir les Accessoires'
  }
];
