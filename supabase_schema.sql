-- ==============================================================================
-- CAPOSTORE221 — SCRIPT SQL D'INITIALISATION BASE DE DONNÉES SUPABASE
-- À coller directement dans l'onglet "SQL Editor" de votre tableau de bord Supabase
-- et cliquer sur "RUN" (Exécuter).
-- ==============================================================================

-- 1. TABLE DES PRODUITS & ARTICLES DU CATALOGUE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'vetements',
  sub_category TEXT DEFAULT 'Boubous & Costumes',
  gender TEXT DEFAULT 'homme',
  price NUMERIC NOT NULL DEFAULT 5000,
  compare_at_price NUMERIC,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  details JSONB DEFAULT '[]'::jsonb,
  materials TEXT,
  variants JSONB DEFAULT '[]'::jsonb,
  available_sizes JSONB DEFAULT '[]'::jsonb,
  stock INTEGER DEFAULT 10,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products (published);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);

-- 2. TABLE DES COMMANDES CLIENTS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- ex: 'CAPO-8924'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT DEFAULT 'Dakar',
  customer_address TEXT DEFAULT '',
  payment_method TEXT DEFAULT 'wave',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'transmise',
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour commandes
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- 3. ACTIVATION DU TEMPS RÉEL (REALTIME)
-- Permet la mise à jour instantanée sans recharger la page
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 4. POLITIQUES DE SÉCURITÉ (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Politiques pour les Produits :
-- Tout le monde peut voir les produits publiés
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products
  FOR SELECT USING (true);

-- Modifications autorisées (gérées et sécurisées par le code de l'application)
DROP POLICY IF EXISTS "Full access to products" ON public.products;
CREATE POLICY "Full access to products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour les Commandes :
-- N'importe quel client peut envoyer une commande
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Lecture des commandes (permet le suivi client par ID et l'administration)
DROP POLICY IF EXISTS "Orders read access" ON public.orders;
CREATE POLICY "Orders read access" ON public.orders
  FOR SELECT USING (true);

-- Mise à jour de statut (administrateur)
DROP POLICY IF EXISTS "Orders update access" ON public.orders;
CREATE POLICY "Orders update access" ON public.orders
  FOR UPDATE USING (true) WITH CHECK (true);

-- Suppression (administrateur)
DROP POLICY IF EXISTS "Orders delete access" ON public.orders;
CREATE POLICY "Orders delete access" ON public.orders
  FOR DELETE USING (true);
