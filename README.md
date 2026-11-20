# CAPOSTORE221 — Boutique en Ligne Officielle

> **« Tu commandes, on te livre. »**  
> Site e-commerce officiel de mode, chaussures, parfums et accessoires au Sénégal (prix en Francs CFA / XOF).  
> **Site en ligne :** https://capostore221.com  
> **Espace Gérant (privé) :** https://capostore221.com/admin

---

## Présentation du Projet

**CAPOSTORE221** est une plateforme e-commerce complète connectée en temps réel à une base de données **Supabase (PostgreSQL)** et hébergée sur **Vercel**. Elle permet aux clients de commander facilement en ligne ou via WhatsApp, et au propriétaire de gérer l'ensemble de son catalogue, de ses prix, de ses stocks et de ses commandes depuis une console d'administration dédiée.

---

## Fonctionnalités Principales

### 1. Boutique Client (`https://capostore221.com`)
- **Catégories complètes & dynamiques :**
  - **Vêtements** (pantalons, jeans, cargos, chemises, t-shirts, vestes, polos)
  - **Chaussures** (baskets, mocassins, souliers)
  - **Parfums** (eaux de parfum, muscs, senteurs)
  - **Lunettes** (montures optiques & solaires)
  - **Sacs & Accessoires** (sacs à bandoulière, pochettes cuir, portefeuilles)
  - Les catégories sans articles en stock sont automatiquement masquées sur l'accueil, et les compteurs d'articles sont calculés en direct.
- **Catalogue, Recherche & Filtres :**
  - Filtrage par catégorie, genre, fourchette de prix (jusqu'à `100 000 FCFA`), tailles, couleurs, disponibilité en stock et tri.
  - Barre de recherche instantanée et liste de favoris.
- **Commande Rapide & Panier :**
  - **Choix du mode de réception :** le client précise s'il souhaite **être livré à domicile** (ville + adresse précise) ou **venir récupérer sur place**.
  - **Validation stricte du téléphone sénégalais :** format contrôlé à exactement **9 chiffres** (`77`, `78`, `76`, `70`, `75`, `33`).
  - **Moyens de paiement avec logos officiels :** **Wave**, **Orange Money**, **Yas / Mixx** et **Espèces** (`/payments/wave.png`, `/payments/orange-money.png`, `/payments/yas.png`).
  - **Transmission directe WhatsApp :** génération automatique du récapitulatif complet (référence `CAPO-XXXX`, articles, mode de réception, paiement, lien photo) vers le WhatsApp de la boutique.
- **Activité & Articles Vendus en Direct :**
  - Affichage dynamique et anonymisé des commandes récentes (ville, article, statut en temps réel, sans exposer les noms complets ni les numéros de téléphone des clients).
  - Badges de ventes sur les fiches produits et onglet **Articles vendus**.

### 2. Espace Gérant / Admin (`https://capostore221.com/admin`)
- **Accès sécurisé par mot de passe** (modifiable depuis la console).
- **Tableau de bord interactif :**
  - Filtrage par période : **Tout**, **Aujourd'hui**, **7 jours**, **30 jours**.
  - Indicateurs cliquables : Chiffre d'affaires (total et encaissé livré), Commandes, Clients (Dakar vs Régions), Articles en ligne.
  - Répartition des paiements (Wave, Orange Money, Yas / Mixx, Espèces) avec montants et pourcentages.
  - Classement des articles les plus vendus et traitement rapide des dernières commandes.
- **Gestion du Catalogue (`Articles`) :**
  - Ajout de nouveaux articles avec upload et compression automatique d'image.
  - Détection automatique de la catégorie selon le nom saisi (ex. *sac, parfum, chaussure, lunette*).
  - Modification en ligne : nom, catégorie, prix de vente, ancien prix barré (calcul automatique du badge promo `%`), disponibilité (*En vente / Masqué*), et gestion exclusive des tailles/pointures disponibles.
  - Suppression définitive synchronisée avec Supabase.
- **Gestion des Commandes (`Commandes`) :**
  - Suivi exclusif côté Admin (les suivis publics ont été retirés par sécurité).
  - Filtres par statut (*Reçue → Confirmée → En préparation → En livraison → Livrée*) et recherche par référence `CAPO-XXXX`, nom ou téléphone.
  - Badge distinct **Livraison à domicile** / **Récupération sur place**, et boutons directs **Appeler** / **WhatsApp**.

---

## Coordonnées Officielles

- **Site Web :** https://capostore221.com
- **WhatsApp Commandes :** `+221 76 832 11 57`
- **Appel Direct :** `+221 77 256 39 90`
- **Email :** `capostore221@gmail.com`
- **Instagram :** `@capostore221`
- **TikTok :** `@capostore.221`
- **Facebook :** Page Officielle CAPOSTORE221

---

## Architecture du Projet

```text
CAPO221/
├── public/
│   ├── payments/              # Logos officiels (wave.png, orange-money.png, yas.png)
│   └── products/              # Images des articles d'origine
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminView.tsx          # Console Admin (Dashboard, Articles, Commandes)
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx         # Panier latéral & validation de commande
│   │   ├── catalog/
│   │   │   ├── CatalogView.tsx        # Vue catalogue filtrable
│   │   │   ├── ProductCard.tsx        # Carte produit avec promo, stock & ventes
│   │   │   ├── ProductFilters.tsx     # Panneau de filtres (catégorie, prix, tailles)
│   │   │   └── WishlistView.tsx       # Page favoris
│   │   ├── home/
│   │   │   ├── Hero.tsx               # Bannière d'accueil dynamique
│   │   │   ├── CollectionsGrid.tsx    # Cartes de catégories dynamiques
│   │   │   ├── NewArrivals.tsx        # Grille catalogue + onglets par catégorie
│   │   │   ├── LiveActivityBar.tsx    # Flux temps réel des commandes anonymisées
│   │   │   ├── NewsletterSection.tsx  # Contact & réseaux sociaux
│   │   │   └── HomeView.tsx           # Assemblage de la page d'accueil
│   │   ├── layout/
│   │   │   ├── AnnouncementBar.tsx    # Barre supérieure (nombre d'articles en direct)
│   │   │   ├── Navbar.tsx             # Navigation principale (masquée sur /admin)
│   │   │   ├── MobileBottomNav.tsx    # Barre de navigation mobile
│   │   │   └── Footer.tsx             # Pied de page + accès rapide admin
│   │   ├── product/
│   │   │   └── ProductDetailView.tsx  # Fiche produit détaillée
│   │   └── ui/
│   │       ├── QuickOrderModal.tsx    # Commande directe en 1 clic
│   │       ├── QuickViewModal.tsx     # Aperçu rapide produit
│   │       ├── SearchModal.tsx        # Recherche instantanée
│   │       └── ToastNotification.tsx  # Notifications interface
│   ├── context/
│   │   ├── StoreContext.tsx           # État catalogue, filtres, navigation & sync Supabase
│   │   ├── OrderContext.tsx           # Commandes, Realtime Supabase & activité publique
│   │   ├── CartContext.tsx            # Gestion du panier
│   │   └── WishlistContext.tsx        # Gestion des favoris
│   ├── data/
│   │   └── products.ts                # Catalogue initial & métadonnées des catégories
│   ├── lib/
│   │   └── supabase.ts                # Client Supabase & requêtes CRUD produits/commandes
│   ├── types/
│   │   └── index.ts                   # Types TypeScript (Product, Order, CategoryId...)
│   ├── utils/
│   │   ├── format.ts                  # Formatage FCFA, validation tél Sénégal, liens WhatsApp
│   │   ├── cloudSync.ts               # Compression d'images & fallback sync
│   │   └── security.ts                # Authentification Admin & journal d'audit
│   ├── App.tsx                        # Point d'entrée des vues & ErrorBoundary
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                        # Réécriture SPA & en-têtes de sécurité HTTP
└── vite.config.ts
```

---

## Stack Technique

- **Frontend :** React 19 + TypeScript 6
- **Bundler :** Vite 8
- **Styles :** Tailwind CSS 3 + Lucide React (icônes)
- **Base de données & Temps réel :** Supabase (`@supabase/supabase-js`)
- **Qualité de code :** Oxlint + `tsc -b`
- **Hébergement & Domaine :** Vercel + `capostore221.com`

---

## Installation & Commandes Locales

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement local
npm run dev

# 3. Vérifier le code avec Oxlint
npm run lint

# 4. Vérifier TypeScript et compiler pour la production
npm run build

# 5. Prévisualiser le build de production
npm run preview
```

---

## Déploiement

Tout `git push` sur la branche `main` déclenche automatiquement le build (`tsc -b && vite build`) et la mise en production sur **Vercel** (`https://capostore221.com`).  
Le fichier `vercel.json` gère la redirection SPA vers `/index.html` (pour les routes `/admin`, `/catalogue`, etc.) ainsi que les en-têtes de sécurité HTTP (`X-Frame-Options`, `X-Content-Type-Options`, etc.).
