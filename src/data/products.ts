import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- NOUVELLE SÉLECTION CLIENT CAPOSTORE221 (PHOTOS RÉELLES) ---
  {
    id: 'capo-client-001',
    name: 'Pantalon Tailleur Prince de Galles « Almadies »',
    slug: 'pantalon-tailleur-prince-de-galles-almadies',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 32000,
    compareAtPrice: 38000,
    images: [
      '/products/pantalon-prince-galles.jpg',
      '/products/pantalon-prince-galles-alt.jpg'
    ],
    description: 'Pantalon chino tailleur à la coupe moderne fuselée, confectionné dans un sergé souple au motif Prince de Galles gris chiné et noir. Bouton gravé, taille semi-élastiquée pour un confort irréprochable et détail liseré tricolore discret à la poche cavalière.',
    details: [
      'Coupe slim-tapered contemporaine',
      'Motif Prince de Galles tissé en fil teinté',
      'Ceinture avec passants et élastique dos d\'aisance',
      'Poches cavalières avant avec liseré contrasté & poches passepoilées arrière',
      'Lavage délicat à 30°C ou pressing'
    ],
    materials: '65% Viscose, 30% Coton peigné, 5% Élasthanne',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Prince de Galles Gris', hex: '#4A4B50' }
    ],
    variants: [
      { id: 'vc1', size: 'S', color: { name: 'Prince de Galles Gris', hex: '#4A4B50' }, stock: 4 },
      { id: 'vc2', size: 'M', color: { name: 'Prince de Galles Gris', hex: '#4A4B50' }, stock: 8 },
      { id: 'vc3', size: 'L', color: { name: 'Prince de Galles Gris', hex: '#4A4B50' }, stock: 5 },
      { id: 'vc4', size: 'XL', color: { name: 'Prince de Galles Gris', hex: '#4A4B50' }, stock: 3 },
    ],
    stock: 20,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-25'
  },
  {
    id: 'capo-client-002',
    name: 'Bermuda Cargo Poches Zippées Écru « Ngor »',
    slug: 'bermuda-cargo-poches-zippees-ecru-ngor',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 26000,
    compareAtPrice: 32000,
    images: [
      '/products/bermuda-cargo-ecru.jpg'
    ],
    description: 'Bermuda utilitaire estival en sergé de coton écru délavé ultra-robuste. Multiples rangements ergonomiques avec doubles poches cargo à rabat et poche zippée technique en métal vieilli sur la cuisse droite. Idéal pour la saison chaude dakaroise.',
    details: [
      'Coupe regular cargo au-dessus du genou',
      'Toile de coton peigné lourd délavé vintage',
      'Poche latérale droite zippée en métal vieilli',
      'Fermeture braguette zippée avec bouton métal siglé',
      'Passants de ceinture renforcés'
    ],
    materials: '100% Coton sergé naturel résistant',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Blanc Écru Naturel', hex: '#F0ECE4' }
    ],
    variants: [
      { id: 'vc5', size: 'S', color: { name: 'Blanc Écru Naturel', hex: '#F0ECE4' }, stock: 6 },
      { id: 'vc6', size: 'M', color: { name: 'Blanc Écru Naturel', hex: '#F0ECE4' }, stock: 10 },
      { id: 'vc7', size: 'L', color: { name: 'Blanc Écru Naturel', hex: '#F0ECE4' }, stock: 6 },
      { id: 'vc8', size: 'XL', color: { name: 'Blanc Écru Naturel', hex: '#F0ECE4' }, stock: 4 },
    ],
    stock: 26,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-25'
  },
  {
    id: 'capo-client-003',
    name: 'Pantalon Cargo Large Carpenter Écru « Gorée »',
    slug: 'pantalon-cargo-large-carpenter-ecru-goree',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'unisexe',
    price: 38000,
    compareAtPrice: 45000,
    images: [
      '/products/pantalon-cargo-ecru.jpg'
    ],
    description: 'La pièce streetwear emblématique de CAPOSTORE221. Coupe droite relax skate/streetwear en sergé de coton écru non blanchi 340 g/m². Empiècements genoux surpiqués façon double-knee et grandes poches cargo à rabat.',
    details: [
      'Coupe droite décontractée skate/loose fit',
      'Toile sergé épaisse haute ténacité',
      'Double empiècement genoux renforcé surpiqué',
      'Poches cargo latérales à soufflet et rabat',
      'Finition bas de jambe droit net'
    ],
    materials: '100% Coton biologique épais 340 g/m²',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Écru Minéral', hex: '#EDE8E0' }
    ],
    variants: [
      { id: 'vc9', size: 'XS', color: { name: 'Écru Minéral', hex: '#EDE8E0' }, stock: 3 },
      { id: 'vc10', size: 'S', color: { name: 'Écru Minéral', hex: '#EDE8E0' }, stock: 6 },
      { id: 'vc11', size: 'M', color: { name: 'Écru Minéral', hex: '#EDE8E0' }, stock: 8 },
      { id: 'vc12', size: 'L', color: { name: 'Écru Minéral', hex: '#EDE8E0' }, stock: 5 },
      { id: 'vc13', size: 'XL', color: { name: 'Écru Minéral', hex: '#EDE8E0' }, stock: 3 },
    ],
    stock: 25,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-25'
  },
  {
    id: 'capo-client-004',
    name: 'Jean Brut Carpenter Délavé « Dakar Denim 221 »',
    slug: 'jean-brut-carpenter-delave-dakar-denim-221',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 35000,
    images: [
      '/products/jean-carpenter-denim.jpg'
    ],
    description: 'Jean denim carpenter de caractère, confectionné dans une toile 100% coton 14 oz avec délavage vintage indigo intense. Poche utilitaire latérale sur la cuisse droite, poches arrière plaquées avec broderie rouge distinctive et étiquette cuir au dos.',
    details: [
      'Coupe droite authentique carpenter streetwear',
      'Toile denim lourd 14 oz résistant',
      'Poche outil latérale droite surpiquée',
      'Broderie rouge contrastée artisanale sur la poche arrière',
      'Étiquette jacron en cuir patiné à la ceinture'
    ],
    materials: '100% Denim coton lourd prélavé',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Indigo Brut Délavé', hex: '#2B394A' }
    ],
    variants: [
      { id: 'vc14', size: 'S', color: { name: 'Indigo Brut Délavé', hex: '#2B394A' }, stock: 4 },
      { id: 'vc15', size: 'M', color: { name: 'Indigo Brut Délavé', hex: '#2B394A' }, stock: 7 },
      { id: 'vc16', size: 'L', color: { name: 'Indigo Brut Délavé', hex: '#2B394A' }, stock: 5 },
      { id: 'vc17', size: 'XL', color: { name: 'Indigo Brut Délavé', hex: '#2B394A' }, stock: 2 },
    ],
    stock: 18,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-25'
  },
  {
    id: 'capo-client-005',
    name: 'Chemise Tartan Madras Col Boutonné « Plateau »',
    slug: 'chemise-tartan-madras-col-boutonne-plateau',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 29000,
    compareAtPrice: 34000,
    images: [
      '/products/chemise-carreaux-burton.jpg'
    ],
    description: 'Chemise casual chic en popeline de coton fine et légère. Carreaux tartan madras harmonieux ocre ambré, bleu marine, blanc et écru. Col boutonné américain souple, poche poitrine plaquée et poignets ajustables à deux boutons.',
    details: [
      'Coupe ajustée moderne sans entrave',
      'Popeline de coton aérée 100% respirante',
      'Col boutonné américain (Button-down collar)',
      'Poche plaquée sur la poitrine',
      'Boutons nacrés gravés cousus croisés'
    ],
    materials: '100% Coton peigné haute finesse',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Madras Ambré & Marine', hex: '#B86F36' }
    ],
    variants: [
      { id: 'vc18', size: 'S', color: { name: 'Madras Ambré & Marine', hex: '#B86F36' }, stock: 4 },
      { id: 'vc19', size: 'M', color: { name: 'Madras Ambré & Marine', hex: '#B86F36' }, stock: 9 },
      { id: 'vc20', size: 'L', color: { name: 'Madras Ambré & Marine', hex: '#B86F36' }, stock: 6 },
      { id: 'vc21', size: 'XL', color: { name: 'Madras Ambré & Marine', hex: '#B86F36' }, stock: 4 },
      { id: 'vc22', size: 'XXL', color: { name: 'Madras Ambré & Marine', hex: '#B86F36' }, stock: 2 },
    ],
    stock: 25,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-25'
  },
  {
    id: 'capo-client-006',
    name: 'Chemise Popeline Rayée Rose & Craie « Fann Résidence »',
    slug: 'chemise-popeline-rayee-rose-craie-fann-residence',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 30000,
    compareAtPrice: 36000,
    images: [
      '/products/chemise-rayee-rose-craie.jpg'
    ],
    description: 'Chemise moderne chic à rayures bâtonnets rose framboise et blanc craie sur une popeline 100% coton aérée. Col classique structuré avec intérieur contrasté, patte de boutonnage américaine, poche poitrine plaquée et poignets biseautés ajustables avec élégant parement blanc.',
    details: [
      'Coupe regular contemporaine droite',
      'Popeline de coton respirante au toucher soyeux',
      'Col avec doublure blanche intérieure de propreté',
      'Poche poitrine plaquée surpiquée',
      'Poignets de manche ajustables à double boutonnerie'
    ],
    materials: '100% Coton peigné haute densité',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Rayures Rose & Craie', hex: '#E05A74' }
    ],
    variants: [
      { id: 'vc23', size: 'S', color: { name: 'Rayures Rose & Craie', hex: '#E05A74' }, stock: 4 },
      { id: 'vc24', size: 'M', color: { name: 'Rayures Rose & Craie', hex: '#E05A74' }, stock: 8 },
      { id: 'vc25', size: 'L', color: { name: 'Rayures Rose & Craie', hex: '#E05A74' }, stock: 5 },
      { id: 'vc26', size: 'XL', color: { name: 'Rayures Rose & Craie', hex: '#E05A74' }, stock: 3 },
    ],
    stock: 20,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-007',
    name: 'Jean Droit Regular Stone Washed « Mermoz Vintage »',
    slug: 'jean-droit-regular-stone-washed-mermoz-vintage',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 34000,
    images: [
      '/products/jean-droit-stone-washed.jpg'
    ],
    description: 'Jean denim vintage authentique à coupe droite regular en toile de coton lourd. Délavage texturé stone washed sur les cuisses, braguette zippée avec bouton en laiton patiné, poches arrière à double surpiqûre horizontale et jacron noir contemporain.',
    details: [
      'Coupe droite intemporelle regular fit',
      'Denim 100% coton lourd stone washed',
      'Surpiqûres ambrées renforcées',
      'Poches arrière à détails graphiques surpiqués',
      'Jacron noir siglé à la ceinture au dos'
    ],
    materials: '100% Coton denim lavé',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Bleu Denim Stone Washed', hex: '#4A6984' }
    ],
    variants: [
      { id: 'vc27', size: 'S', color: { name: 'Bleu Denim Stone Washed', hex: '#4A6984' }, stock: 5 },
      { id: 'vc28', size: 'M', color: { name: 'Bleu Denim Stone Washed', hex: '#4A6984' }, stock: 9 },
      { id: 'vc29', size: 'L', color: { name: 'Bleu Denim Stone Washed', hex: '#4A6984' }, stock: 5 },
      { id: 'vc30', size: 'XL', color: { name: 'Bleu Denim Stone Washed', hex: '#4A6984' }, stock: 3 },
    ],
    stock: 22,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-008',
    name: 'Jean Droit Bleached Denim « Almadies Sky »',
    slug: 'jean-droit-bleached-denim-almadies-sky',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'unisexe',
    price: 36000,
    compareAtPrice: 42000,
    images: [
      '/products/jean-droit-bleached.png'
    ],
    description: 'Denim clair estival inspiré par le ciel dakaroise et les embruns des Almadies. Toile de coton résistante au tombé net et fluide, rivets en laiton cuivré, surpiqûres ambrées contrastées et finitions de cheville idéales pour mettre en valeur vos sneakers.',
    details: [
      'Coupe droite décontractée unisexe',
      'Toile denim délavée bleached wash lumineuse',
      'Rivets métalliques cuivrés anti-arrachement',
      'Poche ticket avant et poches cavalières traditionnelles',
      'Ourlet inférieur renforcé'
    ],
    materials: '100% Coton denim haute tenue',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Bleu Céleste Décoloré', hex: '#8BA9C6' }
    ],
    variants: [
      { id: 'vc31', size: 'XS', color: { name: 'Bleu Céleste Décoloré', hex: '#8BA9C6' }, stock: 3 },
      { id: 'vc32', size: 'S', color: { name: 'Bleu Céleste Décoloré', hex: '#8BA9C6' }, stock: 6 },
      { id: 'vc33', size: 'M', color: { name: 'Bleu Céleste Décoloré', hex: '#8BA9C6' }, stock: 7 },
      { id: 'vc34', size: 'L', color: { name: 'Bleu Céleste Décoloré', hex: '#8BA9C6' }, stock: 4 },
    ],
    stock: 20,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-009',
    name: 'Polo Manches Longues Piqué Flammé « Corniche Grenat »',
    slug: 'polo-manches-longues-pique-flamme-corniche-grenat',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 32000,
    images: [
      '/products/polo-manches-longues-grenat.jpg'
    ],
    description: 'Une alliance d\'élégance parisienne et de décontraction dakaroise. Confectionné en piqué de coton chiné flammé grenat profond. Col polo franc avec liséré intérieur bordeaux, patte de boutonnage 3 boutons foncés nacrés et poignets finition chemise.',
    details: [
      'Coupe droite décontractée haut de gamme',
      'Maille piquée de coton flammée chinée respirante',
      'Col polo structuré à revers soigné',
      'Patte 3 boutons noirs nacrés cousus croix',
      'Bas de corps légèrement arrondi'
    ],
    materials: '100% Coton piqué flammé chiné',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Grenat Flammé Chiné', hex: '#8B1E28' }
    ],
    variants: [
      { id: 'vc35', size: 'S', color: { name: 'Grenat Flammé Chiné', hex: '#8B1E28' }, stock: 4 },
      { id: 'vc36', size: 'M', color: { name: 'Grenat Flammé Chiné', hex: '#8B1E28' }, stock: 8 },
      { id: 'vc37', size: 'L', color: { name: 'Grenat Flammé Chiné', hex: '#8B1E28' }, stock: 6 },
      { id: 'vc38', size: 'XL', color: { name: 'Grenat Flammé Chiné', hex: '#8B1E28' }, stock: 4 },
      { id: 'vc39', size: 'XXL', color: { name: 'Grenat Flammé Chiné', hex: '#8B1E28' }, stock: 2 },
    ],
    stock: 24,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-010',
    name: 'Jean Droit Brut Indigo Pur « Terrou Bi »',
    slug: 'jean-droit-brut-indigo-pur-terrou-bi',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 35000,
    compareAtPrice: 42000,
    images: [
      '/products/jean-droit-brut-indigo.png'
    ],
    description: 'Confectionné dans une authentique toile denim 100% coton lourd au bleu indigo profond sans artifice. Coupe droite épurée, surpiqûres ton-sur-ton raffinées, bouton noir mat gravé, grandes poches arrière plaquées à double surpiqûre géométrique.',
    details: [
      'Coupe droite moderne regular fit',
      'Denim lourd 13,5 oz 100% coton brut non lavé',
      'Poches arrière plaquées architecturales avec double couture',
      'Bouton métallique noir mat et braguette zippée robuste',
      'Finition bas de jambe droit net'
    ],
    materials: '100% Coton denim brut haute qualité',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Indigo Brut Profond', hex: '#1E2C3D' }
    ],
    variants: [
      { id: 'vc40', size: 'S', color: { name: 'Indigo Brut Profond', hex: '#1E2C3D' }, stock: 4 },
      { id: 'vc41', size: 'M', color: { name: 'Indigo Brut Profond', hex: '#1E2C3D' }, stock: 9 },
      { id: 'vc42', size: 'L', color: { name: 'Indigo Brut Profond', hex: '#1E2C3D' }, stock: 6 },
      { id: 'vc43', size: 'XL', color: { name: 'Indigo Brut Profond', hex: '#1E2C3D' }, stock: 3 },
    ],
    stock: 22,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-011',
    name: 'Chemisette Popeline Micro-Vichy Rouge & Craie « Ngor Beach »',
    slug: 'chemisette-popeline-micro-vichy-rouge-craie-ngor-beach',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 28000,
    compareAtPrice: 34000,
    images: [
      '/products/chemisette-vichy-rouge.jpg'
    ],
    description: 'Chemisette estivale manches courtes en popeline de coton fine et ultra-respirante. Motif micro-vichy rouge framboise et blanc craie, col boutonné classique américain, broderie prestigieuse contrastée sur la poche poitrine plaquée et hirondelles de renfort écrues.',
    details: [
      'Coupe droite décontractée manches courtes',
      'Popeline 100% coton ultra-fraîche',
      'Col boutonné américain (button-down)',
      'Poche plaquée poitrine avec broderie rouge relief',
      'Hirondelles de renfort écrues à la base'
    ],
    materials: '100% Coton peigné haute finesse',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Vichy Rouge & Craie', hex: '#D23E4B' }
    ],
    variants: [
      { id: 'vc44', size: 'S', color: { name: 'Vichy Rouge & Craie', hex: '#D23E4B' }, stock: 5 },
      { id: 'vc45', size: 'M', color: { name: 'Vichy Rouge & Craie', hex: '#D23E4B' }, stock: 10 },
      { id: 'vc46', size: 'L', color: { name: 'Vichy Rouge & Craie', hex: '#D23E4B' }, stock: 7 },
      { id: 'vc47', size: 'XL', color: { name: 'Vichy Rouge & Craie', hex: '#D23E4B' }, stock: 4 },
    ],
    stock: 26,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-012',
    name: 'Sacoche Bandoulière Nylon & Cuir Sable « Dakar Crossbody »',
    slug: 'sacoche-bandouliere-nylon-cuir-sable-dakar-crossbody',
    category: 'accessoires',
    subCategory: 'Sacs & Maroquinerie',
    gender: 'unisexe',
    price: 29000,
    compareAtPrice: 35000,
    images: [
      '/products/sacoche-bandouliere-sable.png'
    ],
    description: 'Sacoche urbaine compacte et fonctionnelle en nylon ripstop déperlant coloris sable minéral. Compartiment principal à fermeture zippée double curseur avec tirettes cordons, poche zippée avant et arrière, écusson en cuir naturel gravé et bandoulière en sangle coton épaisse réglable.',
    details: [
      'Toile nylon technique déperlante et anti-déchirure',
      'Fermetures zippées fluides avec doubles tirettes cordons',
      'Compartiment principal spacieux + 2 poches zippées extérieures',
      'Écusson en cuir véritable surpiqué à l\'avant',
      'Bandoulière en toile sangle robuste avec boucle de réglage métal',
      'Dimensions : 24 cm x 17 cm x 7 cm'
    ],
    materials: 'Nylon ripstop imperméable, sangle coton & finitions cuir véritable',
    availableColors: [
      { name: 'Sable Minéral', hex: '#E2D7C5' }
    ],
    variants: [
      { id: 'vc48', color: { name: 'Sable Minéral', hex: '#E2D7C5' }, stock: 18 }
    ],
    stock: 18,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-013',
    name: 'Bermuda Chino Technique Graphite « Almadies Golf Club »',
    slug: 'bermuda-chino-technique-graphite-almadies-golf-club',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 30000,
    compareAtPrice: 38000,
    images: [
      '/products/bermuda-technique-graphite.png'
    ],
    description: 'Bermuda chino technique haute performance en tissu stretch respirant anti-froissement gris graphite. Finition taille élastiquée intérieure siglée, poches italiennes avec poche zippée invisible, poches arrière passepoilées avec broderie discrète et bouton noir mat.',
    details: [
      'Coupe chino bermuda au tombé droit au-dessus du genou',
      'Tissu technique bi-stretch respirant séchage rapide',
      'Ceinture intérieure antidérapante siglée',
      'Double poche arrière passepoilée avec surpiqûres de renfort',
      'Idéal en ville comme pour les activités de plein air à Dakar'
    ],
    materials: '88% Polyamide technique micro-aéré, 12% Élasthanne',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Gris Graphite Technique', hex: '#4B4B52' }
    ],
    variants: [
      { id: 'vc49', size: 'S', color: { name: 'Gris Graphite Technique', hex: '#4B4B52' }, stock: 5 },
      { id: 'vc50', size: 'M', color: { name: 'Gris Graphite Technique', hex: '#4B4B52' }, stock: 9 },
      { id: 'vc51', size: 'L', color: { name: 'Gris Graphite Technique', hex: '#4B4B52' }, stock: 6 },
      { id: 'vc52', size: 'XL', color: { name: 'Gris Graphite Technique', hex: '#4B4B52' }, stock: 4 },
    ],
    stock: 24,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-014',
    name: 'Chemise Oxford Rayures Brique & Craie « Médina Chic »',
    slug: 'chemise-oxford-rayures-brique-craie-medina-chic',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 32000,
    compareAtPrice: 38000,
    images: [
      '/products/chemise-oxford-brique.jpg'
    ],
    description: 'Chemise oxford en coton peigné durable aux rayures fines brique terracotta et blanc cassé. Col boutonné souple, poche poitrine avec broderie bleu marine de créateur, pli creux central au dos pour une liberté de mouvement totale et poignets boutonnés avec renfort.',
    details: [
      'Tissage Oxford lourd en pur coton peigné',
      'Col boutonné américain intemporel',
      'Poche poitrine plaquée ornée d\'une broderie marine',
      'Pli rond d\'aisance au dos avec patte d\'accrochage',
      'Boutons cousus croisés haute résistance'
    ],
    materials: '100% Coton peigné Oxford 220 g/m²',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Rayures Brique & Craie', hex: '#B35848' }
    ],
    variants: [
      { id: 'vc53', size: 'S', color: { name: 'Rayures Brique & Craie', hex: '#B35848' }, stock: 4 },
      { id: 'vc54', size: 'M', color: { name: 'Rayures Brique & Craie', hex: '#B35848' }, stock: 8 },
      { id: 'vc55', size: 'L', color: { name: 'Rayures Brique & Craie', hex: '#B35848' }, stock: 5 },
      { id: 'vc56', size: 'XL', color: { name: 'Rayures Brique & Craie', hex: '#B35848' }, stock: 3 },
    ],
    stock: 20,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-015',
    name: 'T-Shirt Henley Col Tunisien Coton Chiné « Somone »',
    slug: 't-shirt-henley-col-tunisien-coton-chine-somone',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 24000,
    compareAtPrice: 29000,
    images: [
      '/products/tshirt-henley-gris-chine.jpg'
    ],
    description: 'T-shirt manches courtes style henley à col tunisien en jersey de coton flammé chiné gris perle. Patte de boutonnage 2 boutons contrastés noirs mats, bord-côte extensible au col ras-du-cou et tombé droit fluide ultra-confortable pour les journées chaudes dakaroises.',
    details: [
      'Coupe droite décontractée contemporaine',
      'Jersey 100% coton flammé chiné respirant 200 g/m²',
      'Col rond tunisien avec patte 2 boutons noirs cousus main',
      'Finitions double piqûre aux emmanchures et à la base',
      'Idéal porté seul ou sous une surchemise ouverte'
    ],
    materials: '100% Coton peigné flammé',
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Gris Chiné Perle', hex: '#B8B9BD' }
    ],
    variants: [
      { id: 'vc57', size: 'M', color: { name: 'Gris Chiné Perle', hex: '#B8B9BD' }, stock: 6 },
      { id: 'vc58', size: 'L', color: { name: 'Gris Chiné Perle', hex: '#B8B9BD' }, stock: 9 },
      { id: 'vc59', size: 'XL', color: { name: 'Gris Chiné Perle', hex: '#B8B9BD' }, stock: 7 },
      { id: 'vc60', size: 'XXL', color: { name: 'Gris Chiné Perle', hex: '#B8B9BD' }, stock: 4 },
    ],
    stock: 26,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-016',
    name: 'Chemise Oxford Slim Fit Bleu Azur « Fann Corniche »',
    slug: 'chemise-oxford-slim-fit-bleu-azur-fann-corniche',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 34000,
    compareAtPrice: 40000,
    images: [
      '/products/chemise-oxford-bleu-azur.png'
    ],
    description: 'L\'incontournable chemise oxford classique en pur coton teint en fil bleu ciel éclatant. Col boutonné structuré à pointes maintenues, broderie signature marine prestigieuse sur la poitrine, boutons blancs nacrés gravés et poignets ajustables à revers net.',
    details: [
      'Coupe semi-ajustée intemporelle slim fit',
      'Tissage Oxford 100% coton lourd double retors',
      'Col boutonné américain aux lignes impeccables',
      'Broderie emblème brodé ton marine au torse gauche',
      'Poignets arrondis réglables à deux boutons'
    ],
    materials: '100% Coton peigné double retors',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Bleu Azur Éclatant', hex: '#688EE6' }
    ],
    variants: [
      { id: 'vc61', size: 'S', color: { name: 'Bleu Azur Éclatant', hex: '#688EE6' }, stock: 4 },
      { id: 'vc62', size: 'M', color: { name: 'Bleu Azur Éclatant', hex: '#688EE6' }, stock: 8 },
      { id: 'vc63', size: 'L', color: { name: 'Bleu Azur Éclatant', hex: '#688EE6' }, stock: 6 },
      { id: 'vc64', size: 'XL', color: { name: 'Bleu Azur Éclatant', hex: '#688EE6' }, stock: 3 },
    ],
    stock: 21,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-017',
    name: 'Chemise Tartan Automne Taupe & Bleu Slate « Saint-Louis »',
    slug: 'chemise-tartan-automne-taupe-bleu-slate-saint-louis',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 31000,
    compareAtPrice: 36000,
    images: [
      '/products/chemise-carreaux-taupe-azur.jpg'
    ],
    description: 'Chemise casual élégante à carreaux tartan vintage mariant des tons chauds de terre taupe, bleu ardoise, corail discret et lignes écrues. Col boutonné américain, poche poitrine plaquée ornée d\'un bouton nacre et broderie logo signature au fil brun.',
    details: [
      'Coupe contemporaine confort fit',
      'Popeline douce de coton peigné texturé',
      'Poche plaquée poitrine avec fermeture boutonnée et broderie emblème',
      'Col boutonné souple et patte de gorge surpiquée',
      'Poignets biseautés ajustables renforcés'
    ],
    materials: '100% Coton peigné tissé teint',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Tartan Taupe & Slate', hex: '#877568' }
    ],
    variants: [
      { id: 'vc65', size: 'S', color: { name: 'Tartan Taupe & Slate', hex: '#877568' }, stock: 4 },
      { id: 'vc66', size: 'M', color: { name: 'Tartan Taupe & Slate', hex: '#877568' }, stock: 7 },
      { id: 'vc67', size: 'L', color: { name: 'Tartan Taupe & Slate', hex: '#877568' }, stock: 6 },
      { id: 'vc68', size: 'XL', color: { name: 'Tartan Taupe & Slate', hex: '#877568' }, stock: 4 },
      { id: 'vc69', size: 'XXL', color: { name: 'Tartan Taupe & Slate', hex: '#877568' }, stock: 2 },
    ],
    stock: 23,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-018',
    name: 'Monture Optique Acétate Sculpté Prune & Écaille « Almadies Eyewear »',
    slug: 'monture-optique-acetate-sculpte-prune-ecaille-almadies-eyewear',
    category: 'lunettes',
    subCategory: 'Lunettes',
    gender: 'unisexe',
    price: 42000,
    compareAtPrice: 50000,
    images: [
      '/products/monture-lunettes-acetate-bordeaux.jpg'
    ],
    description: 'Une pièce d\'optique sculpturale d\'exception. Monture géométrique épaisse en acétate italien de cellulose biseauté coloris prune foncé et reflets écaille marbrée. Armatures métalliques internes ciselées en filigrane gravé visibles par transparence le long des branches, charnières 5 crans robustes et pont architectural.',
    details: [
      'Design géométrique biseauté audacieux',
      'Acétate de cellulose de haute densité lustré à la main',
      'Armature métallique interne gravée ciselée visible par transparence',
      'Charnières 5 points en acier inoxydable haute précision',
      'Verres neutres de présentation remplaçables par verres correcteurs ou solaires',
      'Livré avec étui rigide CAPOSTORE221 et chamoisine microfibre'
    ],
    materials: 'Acétate de cellulose premium & armature acier inoxydable gravé',
    availableColors: [
      { name: 'Prune & Écaille Marbrée', hex: '#4F1B2D' }
    ],
    variants: [
      { id: 'vc70', color: { name: 'Prune & Écaille Marbrée', hex: '#4F1B2D' }, stock: 15 }
    ],
    stock: 15,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-019',
    name: 'Polo Rugby Rétro Club Vert Forêt & Crème « California Oars »',
    slug: 'polo-rugby-retro-club-vert-foret-creme-california-oars',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 30000,
    compareAtPrice: 36000,
    images: [
      '/products/polo-vintage-vert-foret.png'
    ],
    description: 'Inspiré du vestiaire universitaire vintage et des clubs d\'aviron. Confectionné en piqué de coton lourd vert forêt intense avec col polo contrasté en maille côtelée beurre crème. Patte polo sous patte cachée, et écusson brodé blanc « CALIFORNIA » aux rames croisées sur la poitrine.',
    details: [
      'Coupe ample boxy rétro années 90',
      'Maille piquée de coton 240 g/m² au tombé lourd',
      'Col polo contrasté en côte souple écru crème',
      'Broderie artisanale haute précision California crossed oars sur le cœur',
      'Bas droit fendu sur les côtés pour un tombé naturel'
    ],
    materials: '100% Coton piqué peigné lourd',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Vert Forêt & Crème', hex: '#2A4736' }
    ],
    variants: [
      { id: 'vc71', size: 'S', color: { name: 'Vert Forêt & Crème', hex: '#2A4736' }, stock: 4 },
      { id: 'vc72', size: 'M', color: { name: 'Vert Forêt & Crème', hex: '#2A4736' }, stock: 8 },
      { id: 'vc73', size: 'L', color: { name: 'Vert Forêt & Crème', hex: '#2A4736' }, stock: 7 },
      { id: 'vc74', size: 'XL', color: { name: 'Vert Forêt & Crème', hex: '#2A4736' }, stock: 4 },
      { id: 'vc75', size: 'XXL', color: { name: 'Vert Forêt & Crème', hex: '#2A4736' }, stock: 3 },
    ],
    stock: 26,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },

  // --- VÊTEMENTS DE CRÉATION & VESTIAIRE ---
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
    description: 'Une pièce maîtresse alliant la rigueur du tailoring urbain et la décontraction contemporaine. Confectionné dans un sergé lourd déperlant au tombé impeccable, doté de zips métalliques argent mat brossé et d\'une doublure satinée monogrammée CAPOSTORE221.',
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
    isNew: false,
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
    description: 'Le basique ultime élevé au rang de standard luxe. Coton peigné 280 GSM au tombé lourd, col côtelé épais indéformable et broderie ton-sur-ton « CAPOSTORE 221 » discrète au dos du col.',
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
    isFeatured: false,
    isPopular: true,
    published: true,
    createdAt: '2026-02-15'
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
    description: 'Une silhouette audacieuse aux épaules appuyées et au croisé profond. Conçu pour apporter une allure sculpturale instantanée, que ce soit porté avec un denim brut ou un pantalon tailleur.',
    details: [
      'Coupe déstructurée oversize féminine',
      'Épaulettes intégrées légères pour une carrure nette',
      'Boutonnage croisé avec boutons gravés CAPOSTORE221',
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
    isNew: false,
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
      { id: 'v27', size: 'M', color: { name: 'Noir Nuit', hex: '#0B0B0C' }, stock: 0 },
    ],
    stock: 5,
    isNew: false,
    isFeatured: true,
    isPopular: false,
    published: true,
    createdAt: '2026-03-05'
  },

  // --- LUNETTES (PAS DE TAILLE VÊTEMENT) ---
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
      'Livré avec son étui rigide CAPOSTORE221 en cuir végane et chamoisine microfibre'
    ],
    materials: 'Acétate de cellulose biodégradable d\'Italie, charnières inox',
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
    isNew: false,
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

  // --- CHAUSSURES (POINTURES 40 À 45) ---
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
    isNew: false,
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

  // --- ACCESSOIRES (MAROQUINERIE & BIJOUX) ---
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
    availableColors: [
      { name: 'Noir Brut', hex: '#121214' },
      { name: 'Brun Cuir Brûlé', hex: '#4A2E1D' }
    ],
    variants: [
      { id: 'v51', color: { name: 'Noir Brut', hex: '#121214' }, stock: 6 },
      { id: 'v52', color: { name: 'Brun Cuir Brûlé', hex: '#4A2E1D' }, stock: 4 },
    ],
    stock: 10,
    isNew: false,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-03-04'
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
      'Livré avec écrin rigide CAPOSTORE221 et certificat d\'authenticité'
    ],
    materials: 'Argent sterling 925 massif rhodié anti-oxydation',
    availableColors: [
      { name: 'Argent Brossé', hex: '#D1D5DB' }
    ],
    variants: [
      { id: 'v56', color: { name: 'Argent Brossé', hex: '#D1D5DB' }, stock: 4 }
    ],
    stock: 4,
    isNew: false,
    isFeatured: true,
    isPopular: false,
    published: true,
    createdAt: '2026-03-11'
  },
  {
    id: 'capo-acc-002',
    name: 'Casquette Structurée « CAPOSTORE Monogram »',
    slug: 'casquette-structuree-capostore-monogram',
    category: 'accessoires',
    subCategory: 'Chapeaux & Casquettes',
    gender: 'unisexe',
    price: 22000,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Couronne à profil moyen 6 panneaux, visière préincurvée et broderie relief 3D ton-sur-ton « CS221 ». Boucle de serrage arrière en métal argent vieilli.',
    details: [
      'Sergé de coton 100% lourd lavé',
      'Bande de propreté intérieure absorbante thermo-régulatrice',
      'Fermoir arrière en métal avec passant dissimulé',
      'Taille unique ajustable'
    ],
    materials: '100% Coton peigné sergé haute densité',
    availableColors: [
      { name: 'Noir Absolu', hex: '#111113' },
      { name: 'Sable Minéral', hex: '#C2B8A3' }
    ],
    variants: [
      { id: 'v53', color: { name: 'Noir Absolu', hex: '#111113' }, stock: 12 },
      { id: 'v54', color: { name: 'Sable Minéral', hex: '#C2B8A3' }, stock: 8 },
    ],
    stock: 20,
    isNew: false,
    isFeatured: false,
    isPopular: true,
    published: true,
    createdAt: '2026-02-01'
  }
];

export const CATEGORIES_META = [
  {
    id: 'tous',
    name: 'Tout le Catalogue',
    description: 'L\'ensemble des créations et sélections exclusives CAPOSTORE221 à Dakar.'
  },
  {
    id: 'vetements',
    name: 'Vêtements',
    tagline: 'Pantalons cargo, chinos Prince de Galles, jeans carpenter & chemises',
    image: '/products/pantalon-cargo-ecru.jpg',
    description: 'Coupes impeccables, finitions de créateur et matières denses sélectionnées pour l\'élégance urbaine dakaroise.'
  },
  {
    id: 'lunettes',
    name: 'Lunettes',
    tagline: 'Montures acétate sculptées prune & verres haute clarté',
    image: '/products/monture-lunettes-acetate-bordeaux.jpg',
    description: 'Des montures et solaires de caractère pour affronter la lumière dakaroise avec panache et protection absolue.'
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
    tagline: 'Sacoches bandoulière nylon & cuir, maroquinerie fonctionnelle',
    image: '/products/sacoche-bandouliere-sable.png',
    description: 'Les détails qui font la différence. Maroquinerie d\'action dakaroise et accessoires de caractère.'
  }
] as const;

export const HOME_COLLECTIONS = [
  {
    title: 'Mode Homme',
    subtitle: 'Chinos Prince de Galles, bermudas cargo & denims carpenter',
    filterType: 'homme',
    category: 'vetements',
    image: '/products/pantalon-prince-galles.jpg',
    cta: 'Découvrir Homme'
  },
  {
    title: 'Mode Femme & Unisexe',
    subtitle: 'Cargos larges déstructurés & blazers architecturaux',
    filterType: 'all',
    category: 'vetements',
    image: '/products/pantalon-cargo-ecru.jpg',
    cta: 'Découvrir la Sélection'
  },
  {
    title: 'Lunettes & Montures',
    subtitle: 'Acétate sculpté biseauté & armatures ciselées',
    filterType: 'all',
    category: 'lunettes',
    image: '/products/monture-lunettes-acetate-bordeaux.jpg',
    cta: 'Explorer les Lunettes'
  },
  {
    title: 'Chaussures & Sneakers',
    subtitle: 'Volumes audacieux & cuirs pleine fleur',
    filterType: 'all',
    category: 'chaussures',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85',
    cta: 'Voir les Chaussures'
  },
  {
    title: 'Accessoires & Maroquinerie',
    subtitle: 'Sacoches bandoulière nylon sable & maroquinerie urbaine',
    filterType: 'all',
    category: 'accessoires',
    image: '/products/sacoche-bandouliere-sable.png',
    cta: 'Voir les Accessoires'
  }
];
