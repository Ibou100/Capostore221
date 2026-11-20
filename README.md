# CAPOSTORE221 — Plateforme E-Commerce Multi-Boutiques

> **« Tu commandes, on te livre. »**  
> Site e-commerce officiel au Sénégal (Francs CFA / XOF) regroupant deux univers distincts : **Boutique Habillement** et **Boutique Électronique**.  
> **Portail principal :** https://capostore221.com  
> **Boutique Habillement :** https://capostore221.com/habillement  
> **Boutique Électronique :** https://capostore221.com/electronique  
> **Espace Gérant (privé) :** https://capostore221.com/admin

---

## Présentation du Projet

**CAPOSTORE221** est une application web e-commerce connectée en temps réel à **Supabase (PostgreSQL)** et déployée sur **Vercel**.  
À l'arrivée sur **`https://capostore221.com`**, le client choisit directement entre deux boutons :
1. **Boutique Habillement** (vêtements, chaussures, parfums, lunettes, sacs & accessoires).
2. **Boutique Électronique** (smartphones & iPhones, ordinateurs & PC, tablettes & montres connectées, audio & écouteurs, accessoires & outils tech).

Chaque boutique possède son propre catalogue, ses propres catégories, ses propres filtres et ses propres compteurs d'articles en direct, tout en étant gérée depuis une seule console d'administration (`/admin`).

---

## Fonctionnalités Principales

### 1. Accès & Expérience Client (`https://capostore221.com`)
- **Écran d'accueil à 2 Boutiques :**
  - Le visiteur choisit librement d'entrer dans **Boutique Habillement** (`/habillement`) ou **Boutique Électronique** (`/electronique`), avec compteur d'articles disponibles en temps réel sur chaque bouton.
  - Bascule possible entre les deux boutiques à tout moment.
- **Boutique Habillement :**
  - Catégories : **Vêtements**, **Chaussures**, **Parfums**, **Lunettes**, **Sacs & Accessoires**.
  - Masquage automatique des catégories vides sur la page d'accueil.
- **Boutique Électronique :**
  - Catégories : **Smartphones & iPhones**, **Ordinateurs & PC**, **Tablettes & Montres**, **Audio & Écouteurs**, **Accessoires Tech**.
  - Options adaptées aux produits électroniques (`64 Go`, `128 Go`, `256 Go`, `512 Go`, `1 To`, `Neuf scellé`, `Venant`).
- **Catalogue, Recherche & Filtres :**
  - Filtrage dynamique par boutique, catégorie, genre, prix (jusqu'à `100 000 FCFA`), tailles/variantes, couleurs, disponibilité en stock et tri.
  - Barre de recherche instantanée et liste de favoris.
- **Commande Rapide, Panier & WhatsApp :**
  - **Choix du mode de réception :** **Me faire livrer** (ville + adresse précise) ou **Venir récupérer sur place**.
  - **Validation stricte du téléphone sénégalais :** exactement **9 chiffres** (`77`, `78`, `76`, `70`, `75`, `33`).
  - **Moyens de paiement avec logos officiels :** **Wave**, **Orange Money**, **Yas / Mixx** et **Espèces** (`/payments/wave.png`, `/payments/orange-money.png`, `/payments/yas.png`).
  - **Envoi direct WhatsApp :** récapitulatif complet (`CAPO-XXXX`, articles, mode de réception, paiement, lien photo) vers le WhatsApp officiel de la boutique.
- **Activité en Direct (Anonymisée) :**
  - Affichage des commandes récentes et du nombre d'articles vendus sans exposer les données personnelles (noms complets, téléphones, adresses) des clients.

### 2. Espace Gérant / Admin (`https://capostore221.com/admin`)
- **Accès protégé par mot de passe** (modifiable depuis la console).
- **Sélecteur Multi-Boutiques en haut de l'Admin :**
  - Vue unifiée **`Toutes les boutiques`** ou filtrage dédié **`Boutique Habillement`** / **`Boutique Électronique`** pour le Tableau de bord, les Articles et les Commandes.
- **Tableau de bord interactif :**
  - Filtres par période : **Tout**, **Aujourd'hui**, **7 jours**, **30 jours**.
  - Cartes KPI cliquables : Chiffre d'affaires (total et encaissé livré), Commandes, Clients (Dakar vs Régions), Articles en ligne.
  - Répartition des paiements (Wave, Orange Money, Yas / Mixx, Espèces) avec logos officiels, montants et pourcentages.
  - Top articles vendus et mise à jour directe du statut des dernières commandes.
- **Gestion des Articles :**
  - Ajout d'article avec choix explicite de la boutique (**Boutique Habillement** ou **Boutique Électronique**), upload et compression automatique d'image, et détection automatique de catégorie.
  - Modification en ligne : nom, boutique, catégorie, prix de vente, ancien prix barré (promo `%`), visibilité (*En vente / Masqué*) et gestion des tailles/options.
  - Suppression définitive synchronisée avec Supabase.
- **Gestion des Commandes :**
  - Suivi exclusif dans l'espace Admin (*Reçue → Confirmée → En préparation → En livraison → Livrée*).
  - Identification claire du mode de réception (**Livraison à domicile** vs **Récupération sur place**) et de la boutique concernée (`mode`, `electronique`, `mixte`).
  - Boutons directs **Appeler** et **WhatsApp**.

---

## Base de Données Supabase (SQL)

Les tables `products` et `orders` supportent le champ `store_type` (`'mode'` ou `'electronique'`).  
Le script de migration est disponible dans [`supabase/migrations/add_electronics_store.sql`](supabase/migrations/add_electronics_store.sql) :

```sql
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS store_type TEXT NOT NULL DEFAULT 'mode';

CREATE INDEX IF NOT EXISTS idx_products_store_type
  ON public.products (store_type);

UPDATE public.products
SET store_type = 'electronique'
WHERE category IN ('smartphones', 'ordinateurs', 'tablettes_montres', 'audio_tech', 'accessoires_tech');

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS store_type TEXT NOT NULL DEFAULT 'mode';

CREATE INDEX IF NOT EXISTS idx_orders_store_type
  ON public.orders (store_type);
```

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
│   ├── payments/                      # Logos officiels (wave.png, orange-money.png, yas.png)
│   └── products/                      # Images des articles d'origine
├── supabase/
│   └── migrations/
│       └── add_electronics_store.sql  # Migration SQL Multi-Boutiques (store_type)
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminView.tsx          # Console Admin (Multi-boutiques, Dashboard, Articles, Commandes)
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx         # Panier latéral & validation de commande
│   │   ├── catalog/
│   │   │   ├── CatalogView.tsx        # Vue catalogue filtrable
│   │   │   ├── ProductCard.tsx        # Carte produit avec promo, stock & ventes
│   │   │   ├── ProductFilters.tsx     # Panneau de filtres adapté à la boutique active
│   │   │   └── WishlistView.tsx       # Page favoris
│   │   ├── home/
│   │   │   ├── HomeView.tsx           # Écran de choix des 2 boutiques + vue boutique active
│   │   │   ├── Hero.tsx               # Bannière d'accueil dynamique par boutique
│   │   │   ├── CollectionsGrid.tsx    # Cartes de catégories dynamiques
│   │   │   ├── NewArrivals.tsx        # Grille catalogue + onglets par catégorie
│   │   │   ├── LiveActivityBar.tsx    # Flux temps réel des commandes anonymisées
│   │   │   └── NewsletterSection.tsx  # Contact & réseaux sociaux
│   │   ├── layout/
│   │   │   ├── AnnouncementBar.tsx    # Barre supérieure (compteur d'articles par boutique)
│   │   │   ├── Navbar.tsx             # Navigation principale (masquée sur /admin et avant choix)
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
│   │   ├── StoreContext.tsx           # État boutique active, catalogue, filtres & sync Supabase
│   │   ├── OrderContext.tsx           # Commandes, Realtime Supabase & activité publique
│   │   ├── CartContext.tsx            # Gestion du panier
│   │   └── WishlistContext.tsx        # Gestion des favoris
│   ├── data/
│   │   └── products.ts                # Catalogue initial Habillement & métadonnées des catégories
│   ├── lib/
│   │   └── supabase.ts                # Client Supabase & requêtes CRUD produits/commandes
│   ├── types/
│   │   └── index.ts                   # Types TypeScript (StoreType, Product, Order, CategoryId...)
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
- **Styles :** Tailwind CSS 3 + Lucide React
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
Le fichier `vercel.json` assure la réécriture SPA vers `/index.html` (`/habillement`, `/electronique`, `/catalogue`, `/admin`) et applique les en-têtes de sécurité HTTP.
