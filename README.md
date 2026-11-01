# CAPOSTORE221 — Boutique en Ligne de Mode Contemporaine

> **« Tu commandes, on te livre. »**  
> Boutique e-commerce officielle de prêt-à-porter contemporain, solaires et accessoires en Francs CFA (XOF).

---

## 📌 Présentation du Projet

**CAPOSTORE221** est une plateforme e-commerce moderne conçue pour une expérience d'achat directe, fluide et élégante :
- **Modèle de distribution :** Vente en ligne exclusive avec expédition soignée à domicile.
- **Grille tarifaire claire & unique :**
  - **5 000 FCFA** pour tous les vêtements (pantalons tailleur, chinos, cargos, jeans, chemises, polos).
  - **3 000 FCFA** pour les lunettes et la maroquinerie (sacs, pochettes).
- **Règlement :** Paiement en espèces à la livraison ou virement Wave / Orange Money.
- **Canaux de commande :** Commande en ligne sur le site ou commande directe en 1 clic via WhatsApp.

---

## 📞 Coordonnées Officielles de la Boutique

- **WhatsApp Commandes :** `+221 76 832 11 57` (`wa.me/221768321157`)
- **Ligne Téléphonique Directe :** `+221 77 256 39 90`
- **Email Officiel :** `capostore221@gmail.com`
- **Instagram Officiel :** [@capostore221](https://www.instagram.com/capostore221?rpxt=OTBydGo5MW81NGtx&utm_source=qr)
- **TikTok Officiel :** [@capostore.221](https://www.tiktok.com/@capostore.221)
- **Facebook Officiel :** [Page CAPOSTORE](https://www.facebook.com/share/1Edu4vsdUn/?mibextid=wwXIfr)

---

## 🛡️ Audit de Sécurité & Bonnes Pratiques

Le code source a été audité et optimisé pour respecter les standards modernes :

| Critère de sécurité | État | Détails |
| :--- | :---: | :--- |
| **Secrets & Clés API** | ✅ Conforme | Aucun mot de passe, token ou clé API privé n'est présent dans le code. |
| **Protection Git** | ✅ Conforme | Fichier `.gitignore` strict excluant `.env`, `node_modules`, `.vercel` et caches locaux. |
| **Reverse Tabnabbing** | ✅ Conforme | 100% des liens externes (`target="_blank"`) disposent de l'attribut `rel="noopener noreferrer"`. |
| **Headers HTTP de Sécurité** | ✅ Conforme | Fichier `vercel.json` configuré avec `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, etc. |
| **Routage SPA (Single Page App)** | ✅ Conforme | Réécriture automatique des URLs vers `/index.html` sur Vercel (zéro erreur 404 au rechargement). |
| **Validation des Données** | ✅ Conforme | Contrôle strict des champs de commande (nom, téléphone, ville, adresse précise). |

---

## 📲 Transmission des Commandes sur WhatsApp

Le site est équipé d'un système de transmission directe vers le WhatsApp du vendeur :
1. **Commande d'un article individuel :**  
   Depuis la fiche produit ou le catalogue, un clic sur l'icône WhatsApp ouvre un message pré-rempli avec le nom exact de l'article, son prix (5 000 ou 3 000 FCFA) et la taille choisie.
2. **Validation du panier complet :**  
   Le client peut cliquer sur **« Commander via WhatsApp »** pour envoyer la liste de tous ses articles au vendeur.
3. **Formulaire de livraison en ligne :**  
   Quand le client renseigne son **Nom**, **Téléphone**, **Ville** et **Adresse exacte de livraison**, le système génère un récapitulatif complet et ouvre directement WhatsApp sur le numéro du propriétaire (`+221 76 832 11 57`), avec un bouton de confirmation immédiate. Le vendeur reçoit donc directement la commande avec toutes les coordonnées de livraison.

---

## 🛠️ Stack Technique

- **Framework :** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Outil de build & bundler :** [Vite 8](https://vitejs.dev/)
- **Moteur CSS :** [Tailwind CSS 3](https://tailwindcss.com/)
- **Bibliothèque d'icônes :** [Lucide React](https://lucide.dev/)
- **Linter & Qualité :** Oxlint + TypeScript strict mode

---

## 💻 Démarrage Local

```bash
# 1. Cloner ou ouvrir le dossier du projet
cd CAPO221

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement local
npm run dev

# 4. Vérifier la qualité du code
npm run lint

# 5. Tester la compilation de production
npm run build
```

Le site est alors consultable en local sur **`http://localhost:5173/`**.

---

## 🚀 Guide de Déploiement : GitHub & Vercel

### Étape 1 : Pousser le code sur GitHub

1. Créez un nouveau dépôt vide sur votre compte GitHub (ex: `capostore221`).
2. Dans le terminal de votre projet, exécutez les commandes suivantes :

```bash
git remote add origin https://github.com/VOTRE_PSEUDO/capostore221.git
git branch -M main
git push -u origin main
```

### Étape 2 : Déployer sur Vercel (100% Gratuit)

1. Rendez-vous sur [Vercel](https://vercel.com) et connectez-vous avec votre compte GitHub.
2. Cliquez sur **« Add New Project »** puis sélectionnez votre dépôt `capostore221`.
3. Vercel détecte automatiquement la configuration Vite :
   - **Framework Preset :** Vite
   - **Build Command :** `npm run build`
   - **Output Directory :** `dist`
4. Cliquez sur **« Deploy »**. Votre site sera en ligne en moins de 60 secondes avec une adresse sécurisée HTTPS (`https://capostore221.vercel.app`).

### Étape 3 : Relier votre Nom de Domaine Personnalisé

1. Sur votre tableau de bord Vercel, allez dans **Settings > Domains**.
2. Entrez votre domaine acheté (ex: `capostore221.com`).
3. Vercel vous donnera les enregistrements DNS à renseigner chez votre registrar (Hostinger, Namecheap ou OVH) :
   - Enregistrement **A** : `76.76.21.21`
   - Enregistrement **CNAME** : `cname.vercel-dns.com`
4. En 10 à 30 minutes, votre boutique sera active dans le monde entier sur **`https://capostore221.com`** avec cadenas vert SSL automatique.

---

## 📄 Licence & Droits

© 2026 CAPOSTORE221. Tous droits réservés.
Boutique officielle de mode contemporaine en ligne.
