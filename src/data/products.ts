import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- NOUVELLE SÉLECTION CLIENT CAPOSTORE221 (PHOTOS RÉELLES) ---
  {
    id: 'capo-client-001',
    name: 'Pantalon Tailleur Prince de Galles « Signature »',
    slug: 'pantalon-tailleur-prince-de-galles-signature',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 5000,
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
    name: 'Bermuda Cargo Poches Zippées Écru « Nomad »',
    slug: 'bermuda-cargo-poches-zippees-ecru-nomad',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 5000,
    images: [
      '/products/bermuda-cargo-ecru.jpg'
    ],
    description: 'Bermuda utilitaire estival en sergé de coton écru délavé ultra-robuste. Multiples rangements ergonomiques avec doubles poches cargo à rabat et poche zippée technique en métal vieilli sur la cuisse droite. Idéal par temps chaud pour un confort respirant au quotidien.',
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
    name: 'Pantalon Cargo Large Carpenter Écru « Heritage »',
    slug: 'pantalon-cargo-large-carpenter-ecru-heritage',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'unisexe',
    price: 5000,
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
    name: 'Jean Brut Carpenter Délavé « Édition 221 »',
    slug: 'jean-brut-carpenter-delave-edition-221',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 5000,
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
    name: 'Chemise Tartan Madras Col Boutonné « Classic »',
    slug: 'chemise-tartan-madras-col-boutonne-classic',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 5000,
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
    name: 'Chemise Popeline Rayée Rose & Craie « Riviera »',
    slug: 'chemise-popeline-rayee-rose-craie-riviera',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 5000,
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
    name: 'Jean Droit Regular Stone Washed « Authentic Vintage »',
    slug: 'jean-droit-regular-stone-washed-authentic-vintage',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 5000,
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
    name: 'Jean Droit Bleached Denim « Pure Sky »',
    slug: 'jean-droit-bleached-denim-pure-sky',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'unisexe',
    price: 5000,
    images: [
      '/products/jean-droit-bleached.png'
    ],
    description: 'Denim clair estival à la coupe décontractée et soignée. Toile de coton résistante au tombé net et fluide, rivets en laiton cuivré, surpiqûres ambrées contrastées et finitions de cheville idéales pour mettre en valeur vos sneakers.',
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
    price: 5000,
    images: [
      '/products/polo-manches-longues-grenat.jpg'
    ],
    description: 'Une alliance d\'élégance intemporelle et de décontraction contemporaine. Confectionné en piqué de coton chiné flammé grenat profond. Col polo franc avec liséré intérieur bordeaux, patte de boutonnage 3 boutons foncés nacrés et poignets finition chemise.',
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
    name: 'Jean Droit Brut Indigo Pur « Deep Indigo »',
    slug: 'jean-droit-brut-indigo-pur-deep-indigo',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 5000,
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
    name: 'Chemisette Popeline Micro-Vichy Rouge & Craie « Resort Club »',
    slug: 'chemisette-popeline-micro-vichy-rouge-craie-resort-club',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 5000,
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
    name: 'Sacoche Bandoulière Nylon & Cuir Sable « Urban Crossbody »',
    slug: 'sacoche-bandouliere-nylon-cuir-sable-urban-crossbody',
    category: 'accessoires',
    subCategory: 'Sacs & Maroquinerie',
    gender: 'unisexe',
    price: 3000,
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
    name: 'Bermuda Chino Technique Graphite « Executive Sport »',
    slug: 'bermuda-chino-technique-graphite-executive-sport',
    category: 'vetements',
    subCategory: 'Pantalons',
    gender: 'homme',
    price: 5000,
    images: [
      '/products/bermuda-technique-graphite.png'
    ],
    description: 'Bermuda chino technique haute performance en tissu stretch respirant anti-froissement gris graphite. Finition taille élastiquée intérieure siglée, poches italiennes avec poche zippée invisible, poches arrière passepoilées avec broderie discrète et bouton noir mat.',
    details: [
      'Coupe chino bermuda au tombé droit au-dessus du genou',
      'Tissu technique bi-stretch respirant séchage rapide',
      'Ceinture intérieure antidérapante siglée',
      'Double poche arrière passepoilée avec surpiqûres de renfort',
      'Idéal pour les sorties quotidiennes comme pour les moments de détente'
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
    price: 5000,
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
    price: 5000,
    images: [
      '/products/tshirt-henley-gris-chine.jpg'
    ],
    description: 'T-shirt manches courtes style henley à col tunisien en jersey de coton flammé chiné gris perle. Patte de boutonnage 2 boutons contrastés noirs mats, bord-côte extensible au col ras-du-cou et tombé droit fluide ultra-confortable pour les journées chaudes et ensoleillées.',
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
    name: 'Chemise Oxford Slim Fit Bleu Azur « Oxford Prestige »',
    slug: 'chemise-oxford-slim-fit-bleu-azur-oxford-prestige',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 5000,
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
    price: 5000,
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
    name: 'Monture Optique Acétate Sculpté Prune & Écaille « Optique Prestige »',
    slug: 'monture-optique-acetate-sculpte-prune-ecaille-optique-prestige',
    category: 'lunettes',
    subCategory: 'Lunettes',
    gender: 'unisexe',
    price: 3000,
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
    price: 5000,
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
  {
    id: 'capo-client-020',
    name: 'Chemise Popeline Coton Ciel Épurée « Business Élégance »',
    slug: 'chemise-popeline-coton-ciel-epuree-business-elegance',
    category: 'vetements',
    subCategory: 'T-shirts & Hauts',
    gender: 'homme',
    price: 5000,
    images: [
      '/products/chemise-popeline-bleu-pastel.png'
    ],
    description: 'Chemise formelle et business épurée en popeline de coton haute définition bleu ciel lumineux. Col boutonné classique aux pointes précises, boutons nacrés blancs cousus croix, patte de boutonnage américaine impeccable et poignets ajustables avec fente boutonnée renforcée.',
    details: [
      'Coupe regular moderne au tombé ajusté net',
      'Popeline 100% coton doux au toucher soyeux anti-froissement',
      'Col boutonné américain classique structure rigide',
      'Étiquette tissée « Estudio Fitted » d\'origine au col',
      'Boutonnière avec boutons en nacre blanche polie',
      'Poignets biseautés à double boutonnage'
    ],
    materials: '100% Coton popeline peigné 140 g/m²',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Bleu Ciel Pastel', hex: '#A8C4E6' }
    ],
    variants: [
      { id: 'vc76', size: 'S', color: { name: 'Bleu Ciel Pastel', hex: '#A8C4E6' }, stock: 5 },
      { id: 'vc77', size: 'M', color: { name: 'Bleu Ciel Pastel', hex: '#A8C4E6' }, stock: 10 },
      { id: 'vc78', size: 'L', color: { name: 'Bleu Ciel Pastel', hex: '#A8C4E6' }, stock: 7 },
      { id: 'vc79', size: 'XL', color: { name: 'Bleu Ciel Pastel', hex: '#A8C4E6' }, stock: 4 },
    ],
    stock: 26,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  },
  {
    id: 'capo-client-021',
    name: 'Pochette à Main Cuir Matelassé & Dragonne « XQR Executive »',
    slug: 'pochette-a-main-cuir-matelasse-dragonne-xqr-executive',
    category: 'accessoires',
    subCategory: 'Sacs & Maroquinerie',
    gender: 'unisexe',
    price: 3000,
    images: [
      '/products/pochette-cuir-dragonne-xqr.png'
    ],
    description: 'Pochette zippée moderne et sophistiquée en cuir véritable grainé marron ébène / prune foncé. Surpiqûres quadrillées façon matelassage architectural, logo métallique en relief « XQR » en finition gunmetal brossé, dragonne amovible pour un porté poignet sécurisé et double poche zippée extérieure.',
    details: [
      'Cuir pleine fleur texturé haute résistance aux rayures',
      'Finition quadrillée matelassée surpiquée ton sur ton',
      'Lettrage métallique en relief chromé gunmetal « XQR »',
      'Fermeture zippée supérieure fluide + poche verticale zippée avant',
      'Tirettes de zip en métal plein brossé',
      'Dragonne de poignet en cuir avec mousqueton pivotant',
      'Dimensions idéales pour tablette compacte, carnet, smartphone et portefeuille : 28 cm x 18 cm'
    ],
    materials: 'Cuir de vachette véritable texturé, doublure sergé résistant & métal gunmetal',
    availableColors: [
      { name: 'Ébène Prune Foncé', hex: '#2A1820' }
    ],
    variants: [
      { id: 'vc80', color: { name: 'Ébène Prune Foncé', hex: '#2A1820' }, stock: 14 }
    ],
    stock: 14,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    published: true,
    createdAt: '2026-10-27'
  }
];

export const CATEGORIES_META = [
  {
    id: 'tous',
    name: 'Tout le Catalogue',
    description: 'L\'ensemble des 21 pièces réelles CAPOSTORE221 disponibles en ligne. Tu commandes, on te livre.'
  },
  {
    id: 'vetements',
    name: 'Vêtements',
    tagline: 'Chinos Prince de Galles, cargos écru, jeans carpenter & chemises',
    image: '/products/pantalon-cargo-ecru.jpg',
    description: 'Coupes impeccables, finitions soignées et matières denses sélectionnées pour une allure élégante et moderne.'
  },
  {
    id: 'lunettes',
    name: 'Lunettes & Optique',
    tagline: 'Montures sculptées biseautées en acétate & armatures gravées',
    image: '/products/monture-lunettes-acetate-bordeaux.jpg',
    description: 'Pièces d\'optique de caractère pour affronter la lumière avec style et prestance.'
  },
  {
    id: 'accessoires',
    name: 'Accessoires & Maroquinerie',
    tagline: 'Sacs bandoulière nylon sable & pochettes cuir matelassé XQR',
    image: '/products/pochette-cuir-dragonne-xqr.png',
    description: 'Maroquinerie fonctionnelle et pochettes en cuir pour vos essentiels urbains.'
  }
] as const;

export const HOME_COLLECTIONS = [
  {
    title: 'Pantalons & Bermudas',
    subtitle: 'Chinos Prince de Galles, cargos écru & denims carpenter',
    filterType: 'all',
    category: 'vetements',
    image: '/products/pantalon-prince-galles.jpg',
    cta: 'Voir les Pantalons'
  },
  {
    title: 'Chemises & Polos',
    subtitle: 'Oxford bleu ciel, popeline vichy & polos rétro club',
    filterType: 'all',
    category: 'vetements',
    image: '/products/chemise-oxford-bleu-azur.png',
    cta: 'Voir les Hauts'
  },
  {
    title: 'Lunettes & Montures',
    subtitle: 'Acétate sculpté prune biseauté & armatures ciselées',
    filterType: 'all',
    category: 'lunettes',
    image: '/products/monture-lunettes-acetate-bordeaux.jpg',
    cta: 'Voir les Lunettes'
  },
  {
    title: 'Maroquinerie & Sacs',
    subtitle: 'Pochette cuir XQR & sacoche bandoulière sable',
    filterType: 'all',
    category: 'accessoires',
    image: '/products/pochette-cuir-dragonne-xqr.png',
    cta: 'Voir la Maroquinerie'
  }
];
