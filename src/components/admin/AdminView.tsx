import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ShieldCheck, Edit3, Save, RotateCcw, Package, 
  Trash2, Search, ArrowLeft, Phone, MessageCircle, 
  Eye, EyeOff, KeyRound, Download, Clock, 
  LogOut, Plus, Upload, RefreshCw, 
  Check, X, Sparkles, Copy, Link as LinkIcon,
  Database, Server, CheckCircle2, AlertTriangle, ExternalLink,
  TrendingUp, Users, DollarSign, ShoppingBag, CreditCard, Award, Activity, ArrowUpRight, BarChart3
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import { 
  formatFCFA, 
  ORDER_STATUS_CONFIG, 
  getPaymentMethodLabel 
} from '../../utils/format';
import { 
  verifyOwnerPassword, 
  isSessionValid, 
  revokeAdminSession, 
  setOwnerPassword, 
  getAuditLogs,
  addAuditLog,
  type SecurityAuditLog 
} from '../../utils/security';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  isSupabaseConfigured,
  testSupabaseConnection,
  seedInitialProductsToSupabase
} from '../../lib/supabase';
import { compressImageFile } from '../../utils/cloudSync';
import type { OrderStatus, Product, CategoryId } from '../../types';

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SHOE_SIZES = ['39', '40', '41', '42', '43', '44', '45'];

export const AdminView: React.FC = () => {
  const { 
    products, 
    updateProductOverride, 
    resetProductOverrides, 
    customProducts,
    addCustomProduct,
    deleteCustomProduct,
    goToHome, 
    showToast 
  } = useStore();

  const { 
    orders, 
    updateOrderStatus, 
    deleteOrder, 
    refreshOrders, 
    isSyncing, 
    lastSyncTime 
  } = useOrders();

  // Authentication & Session State - Check if persistent session is valid
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return isSessionValid();
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Tab: 'dashboard' | 'products' | 'orders' | 'security'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'security'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || params.get('onglet');
      if (tab === 'dashboard' || tab === 'ventes') return 'dashboard';
      if (tab === 'orders' || tab === 'commandes') return 'orders';
      if (tab === 'products' || tab === 'articles') return 'products';
      if (tab === 'security' || tab === 'securite') return 'security';
    }
    return 'dashboard';
  });

  // Business Analytics & KPIs for the Store Owner Dashboard
  const totalRevenue = useMemo(() => {
    return (orders || []).reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  }, [orders]);

  const deliveredRevenue = useMemo(() => {
    return (orders || [])
      .filter((o) => o?.status === 'livree')
      .reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  }, [orders]);

  const totalOrdersCount = (orders || []).length;
  const deliveredOrdersCount = (orders || []).filter((o) => o?.status === 'livree').length;
  const pendingOrdersCount = (orders || []).filter((o) => o?.status !== 'livree').length;

  const uniqueCustomersCount = useMemo(() => {
    const clients = new Set(
      (orders || []).map((o) => (o?.customerPhone || o?.customerName || '').trim().toLowerCase())
    );
    clients.delete('');
    return clients.size;
  }, [orders]);

  const averageBasket = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const deliverySuccessRate = totalOrdersCount > 0 ? Math.round((deliveredOrdersCount / totalOrdersCount) * 100) : 100;

  // Breakdown by payment methods
  const paymentStats = useMemo(() => {
    const wave = (orders || []).filter((o) => o?.paymentMethod === 'wave').length;
    const om = (orders || []).filter((o) => o?.paymentMethod === 'orange_money').length;
    const cash = (orders || []).filter((o) => o?.paymentMethod === 'especes').length;
    const free = (orders || []).filter((o) => o?.paymentMethod === 'free_money').length;
    return { wave, om, cash, free };
  }, [orders]);

  // Breakdown by city
  const cityStats = useMemo(() => {
    const dakar = (orders || []).filter((o) => (o?.customerCity || '').toLowerCase().includes('dakar')).length;
    const regions = totalOrdersCount - dakar;
    return { dakar, regions };
  }, [orders, totalOrdersCount]);

  // Top selling items
  const topSellingItems = useMemo(() => {
    const map = new Map<string, { name: string; count: number; revenue: number; image?: string }>();
    (orders || []).forEach((o) => {
      (o?.items || []).forEach((item) => {
        const key = item.productId || item.name;
        const existing = map.get(key) || { name: item.name, count: 0, revenue: 0, image: item.image };
        existing.count += item.quantity || 1;
        existing.revenue += (item.price || 0) * (item.quantity || 1);
        if (item.image && !existing.image) existing.image = item.image;
        map.set(key, existing);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [orders]);

  // Change Password Form State
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdChangeError, setPwdChangeError] = useState<string | null>(null);

  // Products filtering & editing
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Orders Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Edit form state for selected product
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(5000);
  const [editCompareAtPrice, setEditCompareAtPrice] = useState<number | ''>('');
  const [editSizes, setEditSizes] = useState<string[]>([]);
  const [editStock, setEditStock] = useState<number>(10);
  const [editPublished, setEditPublished] = useState<boolean>(true);

  // ADD NEW PRODUCT FORM STATE
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>(15000);
  const [newCompareAtPrice, setNewCompareAtPrice] = useState<number | ''>('');
  const [newCategory, setNewCategory] = useState<CategoryId>('vetements');
  const [newSubCategory, setNewSubCategory] = useState('Boubous & Costumes');
  const [newSizes, setNewSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [newDescription, setNewDescription] = useState('');
  const [newInStock, setNewInStock] = useState(true);
  const [newImageData, setNewImageData] = useState<string>('');
  const [newImageFileName, setNewImageFileName] = useState<string>('');
  const [newImageSizeLabel, setNewImageSizeLabel] = useState<string>('');
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);

  // Supabase Database Connection State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseConfig().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseConfig().anonKey);
  const [isDbConfigured, setIsDbConfigured] = useState(() => isSupabaseConfigured());
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbTestFeedback, setDbTestFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isSeedingDb, setIsSeedingDb] = useState(false);

  // Clean secret URL key quietly after first mount without re-renders
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const secretKey = params.get('cle') || params.get('key') || params.get('pass');
      if (secretKey) {
        try {
          window.history.replaceState(null, '', '/admin');
        } catch {}
      }
    }
  }, []);

  // Refresh audit logs on tab switch
  useEffect(() => {
    if (isAuthenticated) {
      setAuditLogs(getAuditLogs());
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Veuillez entrer votre mot de passe.');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await verifyOwnerPassword(passwordInput);
      if (result.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
        setAuthError(null);
        showToast('Connexion réussie ! Session active pendant 30 jours sur cet appareil.', 'success');
      } else {
        setAuthError(result.error || 'Mot de passe incorrect.');
      }
    } catch {
      setAuthError('Erreur de validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    revokeAdminSession();
    setIsAuthenticated(false);
    setPasswordInput('');
    showToast('Session propriétaire fermée.', 'info');
  };

  // Image upload & compression handler
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Veuillez choisir un fichier image valide (JPG, PNG, WEBP).', 'error');
      return;
    }

    setIsCompressingImage(true);
    try {
      // Compress to 850px max dimension, quality 0.8 -> ~30-60 KB
      const compressedDataUrl = await compressImageFile(file, 850, 850, 0.8);
      setNewImageData(compressedDataUrl);
      setNewImageFileName(file.name);
      const approxKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
      setNewImageSizeLabel(`${approxKb} Ko (Compressée & Optimisée)`);
      showToast('Photo optimisée et prête !', 'success');
    } catch (err) {
      console.error('Image compression failed:', err);
      showToast('Erreur lors du traitement de la photo.', 'error');
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handleToggleNewSize = (size: string) => {
    setNewSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Save new product
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) {
      showToast('Veuillez renseigner le nom de la tenue.', 'error');
      return;
    }

    if (!newPrice || Number(newPrice) <= 0) {
      showToast('Veuillez saisir un prix valide en FCFA.', 'error');
      return;
    }

    if (!newImageData) {
      showToast('Veuillez ajouter une photo de l\'article (prenez une photo ou choisissez dans votre galerie).', 'error');
      return;
    }

    setIsSavingProduct(true);

    try {
      const productId = `capo-custom-${Date.now()}`;
      const cleanName = newName.trim();
      const slug = cleanName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const validCategory: 'vetements' | 'lunettes' | 'chaussures' | 'accessoires' = 
        newCategory === 'tous' ? 'vetements' : newCategory;

      const productToCreate: Product = {
        id: productId,
        name: cleanName,
        slug: `${slug}-${Math.floor(Math.random() * 900 + 100)}`,
        category: validCategory,
        subCategory: newSubCategory.trim() || 'Nouvelle Collection',
        gender: 'homme',
        price: Number(newPrice),
        compareAtPrice: newCompareAtPrice && Number(newCompareAtPrice) > Number(newPrice) ? Number(newCompareAtPrice) : undefined,
        images: [newImageData],
        description: newDescription.trim() || `${cleanName} – Confection artisanale haut de gamme par CAPOSTORE221. Finitions d'exception.`,
        details: [
          'Pièce authentique CAPOSTORE221',
          'Tissu premium au tombé irréprochable',
          'Livraison rapide sécurisée à Dakar et dans toutes les régions du Sénégal'
        ],
        availableSizes: newSizes.length > 0 ? newSizes : undefined,
        variants: (newSizes.length > 0 ? newSizes : ['Taille Unique']).map((sz, idx) => ({
          id: `var-${productId}-${idx}`,
          size: sz,
          stock: newInStock ? 10 : 0,
        })),
        stock: newInStock ? 15 : 0,
        isNew: true,
        isFeatured: true,
        published: true,
        createdAt: new Date().toISOString(),
      };

      await addCustomProduct(productToCreate);
      addAuditLog(`Nouvel article ajouté (${productToCreate.id})`, `Nom : "${productToCreate.name}" | Prix : ${formatFCFA(productToCreate.price)}`);

      // Reset modal state
      setNewName('');
      setNewPrice(15000);
      setNewCompareAtPrice('');
      setNewCategory('vetements');
      setNewSubCategory('Boubous & Costumes');
      setNewSizes(['M', 'L', 'XL']);
      setNewDescription('');
      setNewImageData('');
      setNewImageFileName('');
      setNewImageSizeLabel('');
      setIsAddModalOpen(false);

      showToast(`Article "${cleanName}" publié et synchronisé sur le site !`, 'success');
    } catch (err) {
      console.error('Failed to create product:', err);
      showToast('Une erreur est survenue lors de l\'enregistrement de l\'article.', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleStartEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditCompareAtPrice(product.compareAtPrice && product.compareAtPrice > 0 ? product.compareAtPrice : '');
    setEditSizes(product.availableSizes ? [...product.availableSizes] : []);
    setEditStock(product.stock);
    setEditPublished(product.published);
  };

  const handleToggleEditSize = (size: string) => {
    setEditSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSaveProduct = (productId: string) => {
    if (!editName.trim()) {
      showToast('Le nom de l\'article ne peut pas être vide.', 'error');
      return;
    }

    if (isNaN(editPrice) || editPrice <= 0) {
      showToast('Veuillez saisir un prix valide en FCFA.', 'error');
      return;
    }

    const comparePrice = editCompareAtPrice !== '' && Number(editCompareAtPrice) > 0 
      ? Number(editCompareAtPrice) 
      : null;

    updateProductOverride(productId, {
      name: editName.trim(),
      price: editPrice,
      compareAtPrice: comparePrice,
      availableSizes: editSizes,
      stock: editStock,
      published: editPublished,
    });

    const promoInfo = comparePrice && comparePrice > editPrice ? ` (Ancien prix barré : ${formatFCFA(comparePrice)})` : '';
    addAuditLog(`Tenue modifiée (${productId})`, `Nouveau nom : "${editName.trim()}" | Prix : ${formatFCFA(editPrice)}${promoInfo}`);
    setEditingProductId(null);
  };

  const handleDeleteCustomProduct = async (product: Product) => {
    if (window.confirm(`Voulez-vous vraiment supprimer définitivement l'article "${product.name}" du site ?`)) {
      await deleteCustomProduct(product.id);
      addAuditLog(`Suppression article personnalisé (${product.id})`, `Nom : "${product.name}"`);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les tenues d\'origine et leurs prix aux valeurs d\'usine ? (Vos articles créés seront conservés)')) {
      resetProductOverrides();
      addAuditLog('Réinitialisation des tenues d\'origine aux valeurs usine');
      setEditingProductId(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdChangeError(null);

    if (newPwd.length < 4) {
      setPwdChangeError('Le nouveau code/mot de passe doit comporter au moins 4 caractères.');
      return;
    }

    if (newPwd !== confirmPwd) {
      setPwdChangeError('Les deux nouveaux codes ne correspondent pas.');
      return;
    }

    const checkCurrent = await verifyOwnerPassword(currentPwd);
    if (!checkCurrent.success) {
      setPwdChangeError('Le mot de passe actuel saisi est incorrect.');
      return;
    }

    await setOwnerPassword(newPwd);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    showToast('Votre code propriétaire a été mis à jour avec succès !', 'success');
  };

  const handleExportBackup = () => {
    const data = {
      backupDate: new Date().toISOString(),
      store: 'CAPOSTORE221',
      orders,
      customProducts,
      productOverrides: localStorage.getItem('capostore_product_overrides_v1'),
      auditLogs,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `capostore221_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Sauvegarde JSON téléchargée avec succès.', 'success');
  };

  const handleSaveAndTestSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbTestFeedback(null);
    setIsTestingDb(true);
    try {
      if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
        showToast('Veuillez saisir votre URL Supabase et votre clé API anon.', 'error');
        return;
      }
      saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
      const res = await testSupabaseConnection();
      setDbTestFeedback(res);
      setIsDbConfigured(res.success);
      if (res.success) {
        addAuditLog('Connexion réussie à Supabase PostgreSQL');
        showToast('Base de données Supabase connectée avec succès !', 'success');
      } else {
        showToast('Erreur de connexion. Vérifiez l\'URL et la clé.', 'error');
      }
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleDisconnectSupabase = () => {
    if (window.confirm('Voulez-vous déconnecter la base Supabase et revenir au stockage local ?')) {
      clearSupabaseConfig();
      setSupabaseUrlInput('');
      setSupabaseKeyInput('');
      setIsDbConfigured(false);
      setDbTestFeedback(null);
      addAuditLog('Déconnexion de Supabase (retour au mode local)');
      showToast('Base de données déconnectée.', 'info');
    }
  };

  const handleSeedProducts = async () => {
    setIsSeedingDb(true);
    try {
      const res = await seedInitialProductsToSupabase(products);
      if (res.error) {
        showToast(`Erreur : ${res.error}`, 'error');
      } else {
        addAuditLog(`Initialisation de ${res.count} articles dans Supabase`);
        showToast(`${res.count} articles synchronisés avec succès dans Supabase !`, 'success');
      }
    } finally {
      setIsSeedingDb(false);
    }
  };

  const SQL_SCHEMA_SNIPPET = `-- 1. Table Produits
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

-- 2. Table Commandes
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
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

-- 3. Sécurité RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Full access to products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders read access" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders update access" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Orders delete access" ON public.orders FOR DELETE USING (true);`;

  // Filtered products list (Defensively null-safe)
  const filteredProducts = (products || []).filter((p) => {
    if (!p) return false;
    const q = (productSearch || '').toLowerCase().trim();
    const name = String(p.name || '').toLowerCase();
    const sub = String(p.subCategory || '').toLowerCase();
    const matchesSearch = q === '' || name.includes(q) || sub.includes(q);
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered orders list (Defensively null-safe)
  const filteredOrders = (orders || []).filter((o) => {
    if (!o || !o.id) return false;
    const q = (orderSearch || '').toLowerCase().trim();
    const id = String(o.id || '').toLowerCase();
    const customerName = String(o.customerName || '').toLowerCase();
    const customerPhone = String(o.customerPhone || '');
    const matchesSearch =
      q === '' ||
      id.includes(q) ||
      customerName.includes(q) ||
      customerPhone.includes(q);

    const matchesStatus =
      orderStatusFilter === 'all' || o.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // 1. FAST & SIMPLE LOGIN SCREEN (NO LOCKOUTS)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#141210] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-zinc-800 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Console Propriétaire CAPOSTORE221</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
              Espace Propriétaire
            </h1>
            <p className="text-xs text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Veuillez entrer votre mot de passe pour accéder à la console de gestion.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Mot de passe *
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">Session Sécurisée</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  inputMode="text"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm font-medium px-4 py-3.5 pr-11 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#B85D19] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs text-red-400 bg-red-950/30 p-3 rounded-xl border border-red-500/30">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Vérification...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Accéder à ma Console</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-zinc-800 text-center space-y-3">
            <p className="text-[11px] text-zinc-500">
              ✓ Console protégée : connexion requise par mot de passe.
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={goToHome}
              className="text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retourner sur la boutique</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. AUTHENTICATED OWNER DASHBOARD
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Admin Header Bar */}
      <div className="bg-[#141210] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-zinc-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Propriétaire Authentifié (Session Sécurisée)</span>
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
              Console de Gestion CAPOSTORE221
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Pilotez votre catalogue ({products.length} articles), ajoutez de nouvelles tenues avec photos et suivez les commandes clients en direct.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={goToHome}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voir le site</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-white/10"
              title="Télécharger une sauvegarde complète"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Sauvegarder (.json)</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-zinc-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#B85D19] text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📊 Tableau de Bord & Ventes</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#B85D19] text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🏷️ Tenues & Articles ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#B85D19] text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>📦 Commandes & Suivi Colis</span>
            {orders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white text-black text-[10px] font-bold">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-[#B85D19] text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>🔒 Sécurité & Base Cloud</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          TAB 0: EXECUTIVE ANALYTICS & SALES DASHBOARD (DASHBOARD)
         ============================================================ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Welcome & Revenue Overview Banner */}
          <div className="bg-gradient-to-r from-zinc-900 via-[#1a1714] to-zinc-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3 h-3" />
                    <span>Performance Commerciale en Direct</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    PostgreSQL Supabase Connecté
                  </span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  Vue d'Ensemble des Ventes & Clients
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
                  Suivi en temps réel des encaissements, du volume de commandes et de la fidélité de vos clients à Dakar et dans les régions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-5 py-3 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Gérer les Commandes ({orders.length})</span>
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une tenue</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. Chiffre d'Affaires */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Chiffre d'Affaires Global
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#B85D19] flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-zinc-950 tracking-tight">
                {formatFCFA(totalRevenue)}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span>Encaissé (livré) :</span>
                <strong className="text-emerald-700 font-bold">{formatFCFA(deliveredRevenue)}</strong>
              </div>
            </div>

            {/* 2. Clients Uniques */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Clients Uniques
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-zinc-950 tracking-tight">
                {uniqueCustomersCount} {uniqueCustomersCount > 1 ? 'Clients' : 'Client'}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span>Répartition :</span>
                <span className="font-semibold text-zinc-800">{cityStats.dakar} Dakar • {cityStats.regions} Régions</span>
              </div>
            </div>

            {/* 3. Total Commandes */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Commandes Réalisées
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-zinc-950 tracking-tight">
                {totalOrdersCount}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{deliveredOrdersCount} livrée(s)</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{pendingOrdersCount} en cours</span>
                </span>
              </div>
            </div>

            {/* 4. Panier Moyen */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Panier Moyen / Commande
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-zinc-950 tracking-tight">
                {formatFCFA(averageBasket)}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span>Taux de livraison :</span>
                <strong className="text-zinc-900 font-bold">{deliverySuccessRate}% réussi</strong>
              </div>
            </div>
          </div>

          {/* Middle Section: Analytics Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel A: Modes de Paiement Utilisés */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#B85D19]" />
                  <h3 className="font-display font-bold text-sm text-zinc-900">
                    Modes de Paiement Clients (Sénégal)
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  {totalOrdersCount} transaction(s)
                </span>
              </div>

              <div className="space-y-4">
                {/* Wave */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-700">Wave Sénégal (🌊)</span>
                    <span className="font-mono text-zinc-900">{paymentStats.wave} commande(s) ({totalOrdersCount > 0 ? Math.round((paymentStats.wave / totalOrdersCount) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${totalOrdersCount > 0 ? (paymentStats.wave / totalOrdersCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Orange Money */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-700">Orange Money (🍊)</span>
                    <span className="font-mono text-zinc-900">{paymentStats.om} commande(s) ({totalOrdersCount > 0 ? Math.round((paymentStats.om / totalOrdersCount) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${totalOrdersCount > 0 ? (paymentStats.om / totalOrdersCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Espèces */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-700">Paiement à la Livraison (💵 Espèces)</span>
                    <span className="font-mono text-zinc-900">{paymentStats.cash} commande(s) ({totalOrdersCount > 0 ? Math.round((paymentStats.cash / totalOrdersCount) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${totalOrdersCount > 0 ? (paymentStats.cash / totalOrdersCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Free Money */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-700">Free Money (🔴)</span>
                    <span className="font-mono text-zinc-900">{paymentStats.free} commande(s) ({totalOrdersCount > 0 ? Math.round((paymentStats.free / totalOrdersCount) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${totalOrdersCount > 0 ? (paymentStats.free / totalOrdersCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Panel B: Top Articles les plus Demandés */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h3 className="font-display font-bold text-sm text-zinc-900">
                    Articles les plus Demandés
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-[11px] font-bold text-[#B85D19] hover:underline"
                >
                  Gérer les prix →
                </button>
              </div>

              {topSellingItems.length === 0 ? (
                <div className="py-8 text-center text-zinc-400 text-xs">
                  Aucune vente enregistrée pour le moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {topSellingItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-display font-black text-xs text-zinc-400 w-4">
                          #{idx + 1}
                        </span>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg bg-zinc-200 border border-zinc-200 shrink-0"
                          />
                        )}
                        <div className="truncate">
                          <p className="font-bold text-xs text-zinc-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-zinc-500">{item.count} exemplaire(s) vendu(s)</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-xs text-[#B85D19]">
                          {formatFCFA(item.revenue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Recent Live Orders Table */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
              <div>
                <h3 className="font-display font-bold text-sm text-zinc-900">
                  Dernières Commandes Clients Reçues
                </h3>
                <p className="text-xs text-zinc-500">
                  Flux synchronisé en direct depuis Supabase.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-[#B85D19] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Voir et traiter toutes les commandes ({orders.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs">
                Aucune commande enregistrée.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {orders.slice(0, 5).map((order) => {
                  const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
                    label: order.status,
                    badgeClass: 'bg-zinc-100 text-zinc-800',
                  };
                  return (
                    <div key={order.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-xs text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md">
                          {order.id}
                        </span>
                        <div>
                          <p className="font-bold text-xs text-zinc-900">
                            {order.customerName} • <span className="font-mono text-zinc-600">{order.customerPhone}</span>
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {order.customerCity} • {order.items?.length || 0} article(s) • {getPaymentMethodLabel(order.paymentMethod)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        <span className="font-mono font-bold text-xs text-zinc-900">
                          {formatFCFA(order.total)}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusConfig.badgeClass}`}>
                          {statusConfig.label}
                        </span>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="p-1.5 hover:bg-zinc-100 text-zinc-500 hover:text-black rounded-lg transition-colors"
                          title="Gérer cette commande"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 1: PRODUCTS / OUTFITS MANAGEMENT & ADD NEW ARTICLE
         ============================================================ */}
      {activeTab === 'products' && (
        <div className="space-y-6">

          {/* Action Header: Button to Add New Product */}
          <div className="bg-gradient-to-r from-amber-950/30 via-zinc-900 to-amber-950/20 p-5 rounded-3xl border border-amber-500/20 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="font-display font-bold text-base text-zinc-900 sm:text-white">
                  Gestion du Catalogue en Temps Réel
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Ajoutez de nouvelles tenues avec photo de votre téléphone ou modifiez les prix et tailles en stock.
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un Nouvel Article</span>
            </button>
          </div>

          {/* ADD PRODUCT MODAL / DRAWER */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 animate-fadeIn my-8">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B85D19] flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-zinc-900">
                        Ajouter une Nouvelle Tenue au Catalogue
                      </h3>
                      <p className="text-xs text-zinc-500">
                        La photo et l'article seront synchronisés instantanément sur le site et mobile.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateProductSubmit} className="space-y-5">
                  {/* PHOTO UPLOAD SECTION */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Photo de l'article * (Prenez une photo ou choisissez dans votre galerie)
                    </label>

                    {newImageData ? (
                      <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 p-3 flex items-center gap-4">
                        <img
                          src={newImageData}
                          alt="Prévisualisation"
                          className="w-24 h-24 object-cover rounded-xl border border-zinc-300 bg-white shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mb-1">
                            <Check className="w-3 h-3" /> Photo prête
                          </span>
                          <p className="text-xs font-semibold text-zinc-900 truncate">
                            {newImageFileName || 'Photo personnalisée'}
                          </p>
                          <span className="text-[11px] text-zinc-500 font-mono block">
                            {newImageSizeLabel}
                          </span>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-2 text-xs font-semibold text-[#B85D19] hover:underline inline-flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" /> Changer de photo
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNewImageData('');
                            setNewImageFileName('');
                            setNewImageSizeLabel('');
                          }}
                          className="p-2 text-zinc-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Supprimer la photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-300 hover:border-[#B85D19] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-zinc-50/70 hover:bg-amber-50/30"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto text-[#B85D19] mb-3">
                          {isCompressingImage ? (
                            <RefreshCw className="w-6 h-6 animate-spin" />
                          ) : (
                            <Upload className="w-6 h-6" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
                          {isCompressingImage ? 'Optimisation de la photo en cours...' : 'Cliquez pour ajouter une photo'}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Appareil photo de votre téléphone ou galerie d'images (JPG, PNG, WEBP)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* NOM ET PRIX */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        Nom de la tenue / article *
                      </label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ex: Costume 2 Pièces Royal Bleu"
                        className="w-full text-xs font-semibold px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                          Prix de vente / Promo (FCFA) *
                        </label>
                        <input
                          type="number"
                          step={500}
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Ex: 5000"
                          className="w-full text-xs font-mono font-bold px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                          Ancien Prix Barré (FCFA) - Optionnel
                        </label>
                        <input
                          type="number"
                          step={500}
                          value={newCompareAtPrice}
                          onChange={(e) => setNewCompareAtPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Ex: 8000 (s'affichera barré)"
                          className="w-full text-xs font-mono px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                        />
                        <span className="text-[10px] text-zinc-400 mt-0.5 block">
                          {newCompareAtPrice && Number(newCompareAtPrice) > Number(newPrice)
                            ? `Badge Promo : -${Math.round(((Number(newCompareAtPrice) - Number(newPrice)) / Number(newCompareAtPrice)) * 100)}%`
                            : 'Laissez vide si l\'article n\'est pas en promotion.'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CATEGORIE ET SOUS-CATEGORIE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        Catégorie *
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => {
                          const cat = e.target.value as CategoryId;
                          setNewCategory(cat);
                          if (cat === 'chaussures') {
                            setNewSizes(['41', '42', '43', '44']);
                            setNewSubCategory('Chaussures de Ville');
                          } else if (cat === 'lunettes' || cat === 'accessoires') {
                            setNewSizes([]);
                            setNewSubCategory(cat === 'lunettes' ? 'Lunettes de Soleil' : 'Accessoires');
                          } else {
                            setNewSizes(['M', 'L', 'XL']);
                            setNewSubCategory('Boubous & Costumes');
                          }
                        }}
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                      >
                        <option value="vetements">Vêtements (Boubous, Costumes, Chemises...)</option>
                        <option value="chaussures">Chaussures & Souliers</option>
                        <option value="lunettes">Lunettes de soleil</option>
                        <option value="accessoires">Accessoires & Maroquinerie</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                        Sous-catégorie / Style
                      </label>
                      <input
                        type="text"
                        value={newSubCategory}
                        onChange={(e) => setNewSubCategory(e.target.value)}
                        placeholder="Ex: Boubous, Costumes, Chemises..."
                        className="w-full text-xs font-semibold px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                      />
                    </div>
                  </div>

                  {/* SIZES SELECTION */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                        Tailles disponibles en stock :
                      </label>
                      <span className="text-[10px] text-zinc-500">
                        {newSizes.length > 0 ? `${newSizes.length} sélectionnée(s)` : 'Taille Unique'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(newCategory === 'chaussures' ? SHOE_SIZES : CLOTHING_SIZES).map((sz) => {
                        const isChecked = newSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleToggleNewSize(sz)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isChecked
                                ? 'bg-[#141210] text-white ring-2 ring-black shadow-sm'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
                            }`}
                          >
                            {sz} {isChecked ? '✓' : ''}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => setNewSizes([])}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          newSizes.length === 0
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                        }`}
                      >
                        Taille unique
                      </button>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                      Description & détails de l'article (facultatif)
                    </label>
                    <textarea
                      rows={2}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Précisez le tissu, la coupe, la broderie ou les particularités..."
                      className="w-full text-xs font-medium px-3.5 py-2 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                    />
                  </div>

                  {/* IN STOCK TOGGLE */}
                  <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">
                        Disponibilité immédiate en boutique
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {newInStock ? 'L\'article sera visible et commandable' : 'L\'article apparaîtra comme Épuisé'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewInStock(!newInStock)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        newInStock ? 'bg-emerald-600' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          newInStock ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* MODAL ACTIONS */}
                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-black transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProduct || isCompressingImage}
                      className="px-6 py-3 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSavingProduct ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Publication en cours...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Publier et Synchroniser</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Rechercher une tenue à modifier..."
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:outline-none"
              >
                <option value="all">Toutes les catégories</option>
                <option value="vetements">Vêtements</option>
                <option value="chaussures">Chaussures</option>
                <option value="lunettes">Lunettes</option>
                <option value="accessoires">Accessoires</option>
              </select>
            </div>

            <button
              onClick={handleResetDefaults}
              className="text-xs font-semibold text-zinc-500 hover:text-red-600 flex items-center gap-1.5 transition-colors self-end md:self-auto py-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rétablir les 23 tenues d'origine</span>
            </button>
          </div>

          {/* Product Items List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => {
              const isEditing = editingProductId === product.id;
              const isCustom = product.id.startsWith('capo-custom-');

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    isEditing
                      ? 'border-[#B85D19] ring-2 ring-[#B85D19]/20 shadow-xl'
                      : 'border-zinc-200 shadow-sm hover:border-zinc-300'
                  }`}
                >
                  {isEditing ? (
                    // EDITING FORM
                    <div className="space-y-5">
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <img
                          src={product.images && product.images[0] ? product.images[0] : '/products/pantalon-prince-galles.jpg'}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-xl bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div className="flex-1 space-y-3 w-full">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-800 mb-1">
                              Nom de la tenue (Entrez le nom que vous préférez) *
                            </label>
                            <input
                              type="text"
                              required
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full text-sm font-semibold px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                              placeholder="Ex: Chemise Lilas Slim Fit, Pantalon Noir..."
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-800 mb-1">
                                Prix de vente / Promo (FCFA) *
                              </label>
                              <input
                                type="number"
                                step={500}
                                required
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-full text-sm font-mono font-bold px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-800 mb-1">
                                Ancien Prix Barré (FCFA) - Optionnel
                              </label>
                              <input
                                type="number"
                                step={500}
                                value={editCompareAtPrice}
                                onChange={(e) => setEditCompareAtPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="Ex: 8000 (s'affichera barré)"
                                className="w-full text-sm font-mono px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                              />
                              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                                {editCompareAtPrice && Number(editCompareAtPrice) > editPrice
                                  ? `Promo : -${Math.round(((Number(editCompareAtPrice) - editPrice) / Number(editCompareAtPrice)) * 100)}%`
                                  : 'Laissez vide si non barré.'}
                              </span>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-800 mb-1">
                                Disponibilité en boutique
                              </label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditPublished(true)}
                                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                                    editPublished
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                                      : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                                  }`}
                                >
                                  ✓ En vente
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditPublished(false)}
                                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                                    !editPublished
                                      ? 'bg-red-50 text-red-800 border-red-300 font-bold'
                                      : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                                  }`}
                                >
                                  ✕ Masqué
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sizes selection checkboxes */}
                      <div className="pt-3 border-t border-zinc-100">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
                            Tailles en stock pour cette tenue :
                          </label>
                          <span className="text-[10px] text-zinc-500">
                            (Seules les tailles cochées seront sélectionnables par les clients)
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(product.category === 'chaussures' ? SHOE_SIZES : CLOTHING_SIZES).map((size) => {
                            const isChecked = editSizes.includes(size);
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleToggleEditSize(size)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                  isChecked
                                    ? 'bg-[#141210] text-white ring-2 ring-black shadow-sm'
                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
                                }`}
                              >
                                {size} {isChecked ? '✓' : ''}
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => setEditSizes([])}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                              editSizes.length === 0
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                            }`}
                          >
                            Taille unique / Sans taille
                          </button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-black transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveProduct(product.id)}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                        >
                          <Save className="w-4 h-4" />
                          <span>Enregistrer les modifications</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // DISPLAY ROW
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.images && product.images[0] ? product.images[0] : '/products/pantalon-prince-galles.jpg'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                              {product.category} • {product.subCategory}
                            </span>
                            {isCustom && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">
                                <Sparkles className="w-2.5 h-2.5" /> Ajouté par vous
                              </span>
                            )}
                          </div>
                          <h3 className="font-display font-bold text-sm text-zinc-900 mt-0.5">
                            {product.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="font-mono font-bold text-xs text-[#B85D19]">
                              {formatFCFA(product.price)}
                            </span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <>
                                <span className="font-mono text-[11px] text-zinc-400 line-through">
                                  {formatFCFA(product.compareAtPrice)}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-800">
                                  Promo -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                                </span>
                              </>
                            )}
                            <span className="text-zinc-300">•</span>
                            <span className="text-[11px] text-zinc-600">
                              Tailles dispo :{' '}
                              <strong className="text-zinc-900">
                                {product.availableSizes && product.availableSizes.length > 0
                                  ? product.availableSizes.join(', ')
                                  : 'Taille Unique'}
                              </strong>
                            </span>
                            {!product.published && (
                              <span className="px-2 py-0.5 rounded text-[9px] bg-red-100 text-red-800 font-bold">
                                Masqué
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleStartEdit(product)}
                          className="px-4 py-2 bg-[#141210] hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Modifier</span>
                        </button>

                        {isCustom && (
                          <button
                            onClick={() => handleDeleteCustomProduct(product)}
                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Supprimer cet article personnalisé"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: ORDERS MANAGEMENT & REAL-TIME PARCEL TRACKING UPDATE
         ============================================================ */}
      {activeTab === 'orders' && (
        <div className="space-y-6">

          {/* Real-time Cloud Sync Banner */}
          <div className="bg-gradient-to-r from-emerald-950/20 via-zinc-900 to-emerald-950/30 p-4 sm:p-5 rounded-2xl border border-emerald-500/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-sm text-white">
                    Synchronisation Cloud Active (Temps Réel)
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Connecté
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Toutes les commandes passées depuis un smartphone ou un ordinateur apparaissent instantanément.
                  {lastSyncTime && (
                    <span className="ml-1 text-zinc-500">
                      (Dernière vérif : {lastSyncTime.toLocaleTimeString('fr-FR')})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                refreshOrders();
                showToast('Actualisation des commandes terminée !', 'info');
              }}
              disabled={isSyncing}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors border border-white/10 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isSyncing ? 'Actualisation...' : 'Actualiser en direct'}</span>
            </button>
          </div>

          {/* Orders Controls */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Rechercher par N° CAPO, client ou tél..."
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:outline-none"
              >
                <option value="all">Tous les statuts ({orders.length})</option>
                <option value="transmise">1. Transmise via WhatsApp</option>
                <option value="confirmee">2. Confirmée</option>
                <option value="en_preparation">3. En préparation</option>
                <option value="en_livraison">4. En livraison</option>
                <option value="livree">5. Livrée</option>
              </select>
            </div>

            <span className="text-xs text-zinc-500 font-semibold self-end md:self-auto">
              {filteredOrders.length} commande(s) affichée(s)
            </span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200">
              <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="font-display font-bold text-base text-zinc-900">
                Aucune commande trouvée
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Dès qu'un client passe commande sur le site, elle apparaîtra ici et sera conservée dans la plateforme.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
                  label: order.status,
                  badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
                  color: '#666',
                  step: 1
                };

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="bg-zinc-50 p-4 sm:px-6 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-sm text-zinc-900 bg-white px-2.5 py-1 rounded-md border border-zinc-200 shadow-2xs">
                          {order.id}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Status Selector for Owner */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-xs font-bold text-zinc-700">
                          Statut Colis :
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as OrderStatus;
                            updateOrderStatus(order.id, newStatus);
                            addAuditLog(`Statut commande ${order.id} mis à jour`, `Nouveau statut : ${newStatus}`);
                            showToast(`Statut de la commande ${order.id} mis à jour !`, 'success');
                          }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${statusConfig.badgeClass} focus:outline-none`}
                        >
                          <option value="transmise">1. Transmise via WhatsApp</option>
                          <option value="confirmee">2. Confirmée par CAPOSTORE221</option>
                          <option value="en_preparation">3. En cours de préparation</option>
                          <option value="en_livraison">4. En cours de livraison</option>
                          <option value="livree">5. Colis Livré</option>
                        </select>
                      </div>
                    </div>

                    {/* Quick Step Buttons for Owner */}
                    <div className="bg-zinc-100/70 px-4 sm:px-6 py-2 border-b border-zinc-200/80 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 mr-1">
                        Changer en 1 clic :
                      </span>
                      {(['transmise', 'confirmee', 'en_preparation', 'en_livraison', 'livree'] as OrderStatus[]).map((st, idx) => {
                        const isAct = order.status === st;
                        const cfg = ORDER_STATUS_CONFIG[st];
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => {
                              updateOrderStatus(order.id, st);
                              addAuditLog(`Statut commande ${order.id} mis à jour`, `Nouveau statut : ${st}`);
                              showToast(`Commande ${order.id} passée à : ${cfg?.label || st} !`, 'success');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              isAct
                                ? `${cfg?.badgeClass || 'bg-black text-white'} ring-2 ring-black/10 shadow-xs font-black`
                                : 'bg-white hover:bg-zinc-200/60 text-zinc-600 border border-zinc-200'
                            }`}
                          >
                            {idx + 1}. {cfg?.label || st} {isAct ? '✓' : ''}
                          </button>
                        );
                      })}
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Customer Info row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs">
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Client</span>
                          <strong className="text-zinc-900 text-sm">{order.customerName}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Téléphone</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-zinc-900">{order.customerPhone}</span>
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="p-1.5 rounded-lg bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                              title="Appeler le client"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${String(order.customerPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Bonjour ${order.customerName || 'Client'}, CAPOSTORE221 vous remercie pour votre commande ${order.id}. Nous sommes en train de la traiter.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              title="Discuter avec le client sur WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Paiement & Adresse</span>
                          <span className="text-emerald-700 font-bold block">{getPaymentMethodLabel(order.paymentMethod)}</span>
                          <span className="text-zinc-600 block mt-0.5 truncate">{order.customerCity} - {order.customerAddress}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-zinc-100">
                        {(Array.isArray(order.items) ? order.items : []).map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image || '/products/pantalon-prince-galles.jpg'}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                              />
                              <div>
                                <h4 className="font-semibold text-zinc-900">{item.name}</h4>
                                <span className="text-[11px] text-zinc-500">
                                  {item.size ? `Taille : ${item.size}` : 'Taille Unique'} • Quantité : {item.quantity || 1}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-zinc-900 font-mono">
                              {formatFCFA((item.price || 0) * (item.quantity || 1))}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer & Delete */}
                      <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs">
                          <span className="text-zinc-500">Total commande : </span>
                          <strong className="font-mono text-sm text-zinc-900">{formatFCFA(order.total)}</strong>
                        </div>

                        <div className="flex items-center gap-3">
                          <a
                            href={`https://wa.me/${String(order.customerPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Bonjour ${order.customerName || 'Client'}, CAPOSTORE221 vous informe que votre commande ${order.id} est actuellement: ${statusConfig.label}. Suivez votre colis sur: https://capostore221.vercel.app/suivi?track=${order.id}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Contacter sur WhatsApp</span>
                          </a>

                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer la commande ${order.id} ?`)) {
                                deleteOrder(order.id);
                                addAuditLog(`Suppression commande ${order.id}`);
                                showToast(`Commande ${order.id} supprimée.`, 'info');
                              }
                            }}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 3: SECURITY, DIRECT SHORTCUTS & PASSWORDS
         ============================================================ */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Direct Link Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B85D19] flex items-center justify-center font-bold">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-zinc-900">
                  Lien d'Accès à la Console d'Administration
                </h3>
                <p className="text-xs text-zinc-500">
                  Lien sécurisé pour piloter vos articles, vos commandes et vos statistiques de vente.
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Enregistrez ce lien dans vos favoris WhatsApp ou placez-le sur l'écran d'accueil de votre smartphone comme une application :
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <span className="font-mono text-xs text-zinc-800 flex-1 truncate px-2 py-1">
                https://capostore221.vercel.app/admin
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('https://capostore221.vercel.app/admin');
                  showToast('Lien administrateur copié !', 'success');
                }}
                className="px-4 py-2 bg-[#B85D19] hover:bg-[#9E4D12] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le lien</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <strong className="text-amber-900 block mb-1">📱 Raccourci Écran d'Accueil</strong>
                <p className="text-amber-800 text-[11px]">
                  Sur Safari (iPhone) ou Chrome (Android), ouvrez ce lien puis appuyez sur <em>« Ajouter à l'écran d'accueil »</em> pour l'ouvrir comme une application en 1 clic.
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <strong className="text-emerald-900 block mb-1">⏱️ Session 30 Jours</strong>
                <p className="text-emerald-800 text-[11px]">
                  Votre session reste enregistrée pendant 30 jours consécutifs sur votre téléphone ou PC sans avoir à ressaisir votre code.
                </p>
              </div>
            </div>
          </div>

          {/* Supabase PostgreSQL Cloud Database Integration Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-zinc-900">
                      Base de Données Cloud (Supabase PostgreSQL)
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isDbConfigured
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {isDbConfigured ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Connecté en Temps Réel
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3" /> Non Connecté (Mode Local)
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Permet la mise à jour des prix en direct et la réception instantanée des commandes clients sur tous les téléphones et PC.
                  </p>
                </div>
              </div>

              {isDbConfigured && (
                <button
                  type="button"
                  onClick={handleDisconnectSupabase}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-semibold rounded-lg transition-colors shrink-0"
                >
                  Déconnecter
                </button>
              )}
            </div>

            {/* Connection Form */}
            <form onSubmit={handleSaveAndTestSupabase} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    URL du Projet Supabase *
                  </label>
                  <input
                    type="url"
                    required
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    placeholder="https://xyzabcdefg.supabase.co"
                    className="w-full text-xs font-mono px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                  />
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">
                    Trouvable dans : <em>Project Settings &gt; API &gt; Project URL</em>
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Clé API Publique (anon key) *
                  </label>
                  <input
                    type="password"
                    required
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full text-xs font-mono px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                  />
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">
                    Trouvable dans : <em>Project Settings &gt; API &gt; Project API keys (anon public)</em>
                  </span>
                </div>
              </div>

              {dbTestFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    dbTestFeedback.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  {dbTestFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{dbTestFeedback.message}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isTestingDb}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isTestingDb ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Test de connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <Server className="w-3.5 h-3.5" />
                      <span>{isDbConfigured ? 'Tester & Actualiser la Connexion' : 'Connecter à Supabase'}</span>
                    </>
                  )}
                </button>

                {isDbConfigured && (
                  <button
                    type="button"
                    onClick={handleSeedProducts}
                    disabled={isSeedingDb}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    title="Envoie les 23 articles du catalogue directement dans votre base Supabase"
                  >
                    {isSeedingDb ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Envoi des articles...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Synchroniser les 23 articles vers Supabase</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SQL_SCHEMA_SNIPPET);
                    showToast('Script SQL copié ! Vous pouvez le coller dans Supabase SQL Editor.', 'success');
                  }}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Copier le Script SQL (Tables & Sécurité)</span>
                </button>
              </div>
            </form>

            {/* Quick 3-Step Setup Instructions */}
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs space-y-2">
              <strong className="text-zinc-800 font-bold block">
                💡 Comment configurer votre base de données Supabase gratuite en 3 minutes :
              </strong>
              <ol className="list-decimal list-inside space-y-1.5 text-zinc-600 text-[11px] leading-relaxed">
                <li>
                  Rendez-vous sur{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B85D19] font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    supabase.com <ExternalLink className="w-2.5 h-2.5" />
                  </a>{' '}
                  et créez un compte gratuit (avec Google ou GitHub).
                </li>
                <li>
                  Cliquez sur <strong>« New Project »</strong>, nommez-le <em>capostore221</em> et choisissez un mot de passe.
                </li>
                <li>
                  Allez dans l'onglet <strong>SQL Editor</strong> à gauche, cliquez sur <em>« Copier le Script SQL »</em> ci-dessus, collez-le et appuyez sur <strong>Run</strong>.
                </li>
                <li>
                  Allez dans <strong>Project Settings &gt; API</strong>, copiez votre <strong>URL</strong> et votre <strong>clé anon</strong>, collez-les dans les champs ci-dessus puis cliquez sur <strong>Connecter à Supabase</strong> !
                </li>
              </ol>
            </div>
          </div>

          {/* Password Change Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B85D19] flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-zinc-900">
                  Modifier le Mot de Passe Propriétaire
                </h3>
                <p className="text-xs text-zinc-500">
                  Code PIN par défaut : <strong className="text-zinc-800 font-mono">2210</strong> (ou votre mot de passe personnalisé).
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Mot de passe actuel *
                </label>
                <input
                  type="password"
                  required
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Mot de passe actuel"
                  className="w-full text-xs px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Nouveau mot de passe * (min. 4 caractères)
                </label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  className="w-full text-xs px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Confirmer le nouveau code *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Répétez le nouveau code"
                  className="w-full text-xs px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                />
              </div>

              {pwdChangeError && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {pwdChangeError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#141210] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
              >
                Mettre à jour mon code propriétaire
              </button>
            </form>
          </div>

          {/* Security Audit Log */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-zinc-500" />
                <h3 className="font-display font-bold text-base text-zinc-900">
                  Journal d'Activité
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {auditLogs.length} événements
              </span>
            </div>

            <p className="text-xs text-zinc-500">
              Trace toutes les connexions et actions administratives.
            </p>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">Aucun événement consigné pour l'instant.</p>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span>{new Date(log.timestamp).toLocaleString('fr-FR')}</span>
                    </div>
                    <p className="font-semibold text-zinc-800">{log.action}</p>
                    {log.details && (
                      <p className="text-[11px] text-zinc-500 font-mono">{log.details}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
