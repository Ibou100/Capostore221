-- Migration : Ajout du support Multi-Boutiques (Mode & Électronique) pour CAPOSTORE221
-- À exécuter dans Supabase -> SQL Editor

-- 1. Ajouter la colonne store_type à la table products ('mode' ou 'electronique')
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS store_type TEXT NOT NULL DEFAULT 'mode';

-- Index pour accélérer le filtrage par boutique
CREATE INDEX IF NOT EXISTS idx_products_store_type
  ON public.products (store_type);

-- Mettre à jour automatiquement d'éventuels articles tech déjà classés dans des catégories électroniques
UPDATE public.products
SET store_type = 'electronique'
WHERE category IN ('smartphones', 'ordinateurs', 'tablettes_montres', 'audio_tech', 'accessoires_tech');

-- 2. Ajouter la colonne store_type à la table orders ('mode', 'electronique' ou 'mixte')
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS store_type TEXT NOT NULL DEFAULT 'mode';

CREATE INDEX IF NOT EXISTS idx_orders_store_type
  ON public.orders (store_type);
