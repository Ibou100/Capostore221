# CAPO221 — Maison de Mode Contemporaine

Boutique e-commerce premium de prêt-à-porter, streetwear d'avant-garde, solaires et accessoires, ancrée à Dakar, Sénégal.

## 💎 Identité Visuelle & Direction Artistique

- **Nom de marque :** CAPO221
- **Positionnement :** Fashion premium, streetwear contemporain, élégance urbaine dakaroise.
- **Devise :** Franc CFA (XOF) avec séparateur de milliers officiel (`45 000 FCFA`).
- **Typographie :** *Space Grotesk* (titres éditoriaux percutants) & *Plus Jakarta Sans* (lisibilité contemporaine).
- **Palette chromatique :** Noir profond (`#0A0A0C`), blanc cassé (`#F8F8F9`), graphite et accents argent brossé.
- **Slogan :** « TON STYLE. TES RÈGLES. »

---

## 🚀 Fonctionnalités Implémentées

### 1. Page d'Accueil Éditoriale
- **Barre d'annonce :** Informations de livraison express 24h à Dakar et seuil de gratuité, fermable.
- **En-tête & Logo :** Identité typographique CAPO221 avec monogramme C221, recherche instantanée, compteur de favoris et panier dynamique. Menu mobile sous forme de tiroir latéral fluide.
- **Hero Section :** Photographie éditoriale haute définition, typographie percutante, boutons d'action rapide vers le catalogue et les nouveautés, indicateurs clés.
- **Grandes Collections Visuelles :** Sections dédiées pour *Mode Homme*, *Mode Femme*, *Lunettes*, *Chaussures* et *Accessoires*.
- **Nouveautés Récentes :** Grille de produits récents avec badges « Nouveau » et tarification transparente en FCFA.
- **Manifeste Éditorial :** Espace immersif sur fond noir profond mettant en lumière l'ADN de la marque, ses piliers de confection et l'artisanat ouest-africain.
- **Sélection Éditoriale des Pièces Emblématiques :** Mises en avant des modèles les plus populaires.
- **Newsletter Privée :** Inscription au cercle restreint CAPO221 avec retour visuel immédiat.
- **Pied de page :** Navigation secondaire, informations de contact à Dakar, mentions légales, informations de livraison et réseaux sociaux (Instagram, TikTok, Snapchat, Facebook).

### 2. Catalogue & Filtres Dynamiques
- Grille responsive auto-adaptative (mobile 2 colonnes, tablette 3 colonnes, desktop 4 colonnes).
- **Filtres fonctionnels réels :**
  - Par catégorie (*Vêtements, Lunettes, Chaussures, Accessoires*).
  - Par genre (*Homme, Femme, Unisexe*).
  - Par tranche de prix (slider interactif jusqu'à 150 000 FCFA).
  - Par tailles & pointures (*XS à XXL, 40 à 45*).
  - Par teintes / couleurs avec pastilles chromatiques.
  - Disponibilité (*En stock uniquement*).
- **Tris avancés :** Sélection vedette, nouveautés récentes, prix croissant, prix décroissant, pièces les plus populaires.
- **Chips de filtres actifs :** Suppression individuelle en 1 clic ou réinitialisation complète.
- **État vide explicite :** Message d'information avec bouton de réinitialisation.

### 3. Fiches Produits Riches
- Galerie d'images avec zoom et miniatures interactives.
- Affichage du prix en FCFA avec comparaison de prix barré si réduction.
- Sélecteur de teintes avec pastilles chromatiques et nom de la teinte active.
- Sélecteur de tailles/pointures **uniquement sur les vêtements et chaussures** (les lunettes et accessoires n'affichent pas de fausses tailles de vêtements).
- Indicateur de disponibilité des stocks en temps réel (*En stock, Pièces limitées, Épuisé*).
- Sélecteur de quantité avec limitation stricte selon le stock réel.
- Informations d'expédition Dakar 24h, options de règlement (Wave, Orange Money, Espèces à la livraison) et politique d'échange sous 7 jours.
- Recommandations dynamiques de pièces similaires dans la même collection.

### 4. Panier d'Achat Client & Persistance
- Tiroir latéral accessible à tout moment sans quitter la page.
- Ajout, modification de quantité et suppression d'articles avec conservation fidèle des variantes sélectionnées.
- Calcul automatique des sous-totaux, de la livraison offerte dès 75 000 FCFA et du total en FCFA.
- **Persistance locale :** Le panier et les favoris sont automatiquement conservés via `localStorage`.
- **Tunnel de finalisation de commande :** Modal récapitulatif avec formulaire de livraison (Dakar & régions), confirmation instantanée et coordination par la conciergerie CAPO221.

### 5. Recherche Rapide & Raccourcis Clavier
- Fenêtre modale de recherche instantanée avec suggestions rapides.
- Déclencheur clavier universel `⌘K` / `Ctrl+K` et fermeture via touche `Échap`.

---

## 🛠️ Stack Technique

- **Frontend :** React 19 + TypeScript
- **Bundler & Build :** Vite 8
- **Styling :** Tailwind CSS avec thème sur-mesure CAPO221
- **Icônes :** Lucide React
- **Validation & Qualité :** TypeScript strict mode (`verbatimModuleSyntax`) + Oxlint

---

## 💻 Démarrage en Développement

```bash
# Installation des dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Lancer la vérification du code
npm run lint

# Compiler pour la production
npm run build
```
