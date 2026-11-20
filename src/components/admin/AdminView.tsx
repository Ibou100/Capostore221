import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ShieldCheck, Filter, Edit3, Save, RotateCcw, Package, 
  Trash2, Search, ArrowLeft, Phone, MessageCircle, 
  Eye, EyeOff, KeyRound, Download, Clock, 
  LogOut, Plus, Upload, RefreshCw, 
  Check, X, Sparkles, 
  CheckCircle2,
  TrendingUp, Users, DollarSign, ShoppingBag, CreditCard, ArrowUpRight, BarChart3, Smartphone
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
import { compressImageFile } from '../../utils/cloudSync';
import type { OrderStatus, Product, CategoryId, ProductCategory, StoreType } from '../../types';
import { getProductStoreType } from '../../data/products';

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SHOE_SIZES = ['39', '40', '41', '42', '43', '44', '45'];
const TECH_VARIANTS = ['64 Go', '128 Go', '256 Go', '512 Go', '1 To', 'Neuf scellé', 'Venant'];

export const AdminView: React.FC = () => {
  const { 
    products, 
    updateProductOverride, 
    resetProductOverrides, 
    customProducts,
    addCustomProduct,
    deleteProduct,
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || params.get('onglet');
      if (tab === 'dashboard' || tab === 'ventes') return 'dashboard';
      if (tab === 'orders' || tab === 'commandes') return 'orders';
      if (tab === 'products' || tab === 'articles') return 'products';
          }
    return 'dashboard';
  });

  const [adminStoreFilter, setAdminStoreFilter] = useState<'all' | StoreType>('all');
  const [dashboardPeriod, setDashboardPeriod] = useState<'all' | 'today' | '7d' | '30d'>('all');

  const storeScopedOrders = useMemo(() => {
    const list = orders || [];
    if (adminStoreFilter === 'all') return list;
    return list.filter((o) => {
      if (o?.storeType === adminStoreFilter || o?.storeType === 'mixte') return true;
      if (!o?.storeType && adminStoreFilter === 'mode') return true;
      return false;
    });
  }, [orders, adminStoreFilter]);

  const dashboardOrders = useMemo(() => {
    const list = storeScopedOrders;
    if (dashboardPeriod === 'all') return list;
    const now = Date.now();
    const msMap = {
      today: 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    const cutoff = now - msMap[dashboardPeriod];
    return list.filter((o) => new Date(o.createdAt).getTime() >= cutoff);
  }, [storeScopedOrders, dashboardPeriod]);

  // Business Analytics & KPIs for the Store Owner Dashboard
  const totalRevenue = useMemo(() => {
    return dashboardOrders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  }, [dashboardOrders]);

  const deliveredRevenue = useMemo(() => {
    return dashboardOrders
      .filter((o) => o?.status === 'livree')
      .reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  }, [dashboardOrders]);

  const totalOrdersCount = dashboardOrders.length;
  const deliveredOrdersCount = dashboardOrders.filter((o) => o?.status === 'livree').length;
  const pendingOrdersCount = dashboardOrders.filter((o) => o?.status !== 'livree').length;

  const uniqueCustomersCount = useMemo(() => {
    const clients = new Set(
      dashboardOrders.map((o) => (o?.customerPhone || o?.customerName || '').trim().toLowerCase())
    );
    clients.delete('');
    return clients.size;
  }, [dashboardOrders]);

  // Breakdown by payment methods (count + revenue)
  const paymentStats = useMemo(() => {
    const calc = (method: string) => {
      const matching = dashboardOrders.filter((o) => o?.paymentMethod === method);
      return {
        count: matching.length,
        revenue: matching.reduce((s, o) => s + (Number(o?.total) || 0), 0),
      };
    };
    return {
      wave: calc('wave'),
      om: calc('orange_money'),
      cash: calc('especes'),
      free: calc('free_money'),
    };
  }, [dashboardOrders]);

  // Breakdown by city
  const cityStats = useMemo(() => {
    const dakar = dashboardOrders.filter((o) => (o?.customerCity || '').toLowerCase().includes('dakar')).length;
    const regions = totalOrdersCount - dakar;
    return { dakar, regions };
  }, [dashboardOrders, totalOrdersCount]);

  // Top selling items
  const topSellingItems = useMemo(() => {
    const map = new Map<string, { name: string; count: number; revenue: number; image?: string }>();
    dashboardOrders.forEach((o) => {
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
  }, [dashboardOrders]);

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

  // Order Status Counts for fast status filter tabs
  const orderStatusCounts = useMemo(() => {
    const list = orders || [];
    return {
      all: list.length,
      transmise: list.filter((o) => o?.status === 'transmise').length,
      confirmee: list.filter((o) => o?.status === 'confirmee').length,
      en_preparation: list.filter((o) => o?.status === 'en_preparation').length,
      en_livraison: list.filter((o) => o?.status === 'en_livraison').length,
      livree: list.filter((o) => o?.status === 'livree').length,
    };
  }, [orders]);


  // Edit form state for selected product
  const [editName, setEditName] = useState('');
  const [editStoreType, setEditStoreType] = useState<StoreType>('mode');
  const [editCategory, setEditCategory] = useState<ProductCategory>('vetements');
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
  const [newStoreType, setNewStoreType] = useState<StoreType>('mode');
  const [newCategory, setNewCategory] = useState<CategoryId>('vetements');
  const [categoryManuallyChosen, setCategoryManuallyChosen] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState('Boubous & Costumes');
  const [newSizes, setNewSizes] = useState<string[]>([]);
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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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

      const validCategory: ProductCategory =
        newCategory === 'tous' ? (newStoreType === 'electronique' ? 'smartphones' : 'vetements') : newCategory;

      const productToCreate: Product = {
        id: productId,
        name: cleanName,
        slug: `${slug}-${Math.floor(Math.random() * 900 + 100)}`,
        storeType: newStoreType,
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
      setCategoryManuallyChosen(false);
      setNewSubCategory('Boubous & Costumes');
      setNewSizes([]);
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

  const autoDetectCategory = (text: string) => {
    if (categoryManuallyChosen) return;
    if (/\b(iphone|samsung|galaxy|smartphone|téléphone|telephone|pixel|redmi|xiaomi|tecno|infinix)\b/i.test(text)) {
      setNewStoreType('electronique');
      setNewCategory('smartphones');
      setNewSubCategory('Smartphones & iPhones');
      setNewSizes([]);
      return;
    }
    if (/\b(macbook|ordinateur|pc|laptop|dell|hp|lenovo|asus|imac)\b/i.test(text)) {
      setNewStoreType('electronique');
      setNewCategory('ordinateurs');
      setNewSubCategory('Ordinateurs & PC');
      setNewSizes([]);
      return;
    }
    if (/\b(ipad|tablette|apple watch|smartwatch|montre connectée)\b/i.test(text)) {
      setNewStoreType('electronique');
      setNewCategory('tablettes_montres');
      setNewSubCategory('Tablettes & Montres');
      setNewSizes([]);
      return;
    }
    if (/\b(airpods|écouteur|ecouteur|casque|enceinte|jbl)\b/i.test(text)) {
      setNewStoreType('electronique');
      setNewCategory('audio_tech');
      setNewSubCategory('Audio & Écouteurs');
      setNewSizes([]);
      return;
    }
    if (/\b(chargeur|câble|cable|powerbank|coque|clavier|souris|adaptateur)\b/i.test(text)) {
      setNewStoreType('electronique');
      setNewCategory('accessoires_tech');
      setNewSubCategory('Accessoires Tech');
      setNewSizes([]);
      return;
    }
    if (categoryManuallyChosen) return;
    if (/\b(sac|sacs|sacoche|sacoches|pochette|pochettes|portefeuille|portefeuilles|bag|clutch|cluth|maroquinerie|accessoire|accessoires|ceinture|ceintures|casquette|casquettes|chapeau|montre)\b/i.test(text)) {
      setNewCategory('accessoires');
      setNewSubCategory('Sacs & Accessoires');
      setNewSizes([]);
    } else if (/\b(lunette|lunettes|monture|montures|solaire|optique)\b/i.test(text)) {
      setNewCategory('lunettes');
      setNewSubCategory('Lunettes de Soleil');
      setNewSizes([]);
    } else if (/\b(parfum|parfums|eau de parfum|eau de toilette|oud|musc|senteur|senteurs|cologne|fragrance)\b/i.test(text)) {
      setNewCategory('parfums');
      setNewSubCategory('Parfums');
      setNewSizes([]);
    } else if (/\b(chaussure|chaussures|basket|baskets|sneaker|sneakers|mocassin|mocassins|sandale|sandales|soulier|souliers)\b/i.test(text)) {
      setNewCategory('chaussures');
      setNewSubCategory('Chaussures de Ville');
    }
  };

  const handleStartEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditStoreType(getProductStoreType(product));
    setEditCategory(product.category);
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
      storeType: editStoreType,
      category: editCategory,
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

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Voulez-vous vraiment supprimer définitivement l'article "${product.name}" du site ?`)) {
      await deleteProduct(product.id);
      addAuditLog(`Suppression article (${product.id})`, `Nom : "${product.name}"`);
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

  // Filtered products list (Defensively null-safe)
  const filteredProducts = (products || []).filter((p) => {
    if (!p) return false;
    const q = (productSearch || '').toLowerCase().trim();
    const name = String(p.name || '').toLowerCase();
    const sub = String(p.subCategory || '').toLowerCase();
    const matchesSearch = q === '' || name.includes(q) || sub.includes(q);
    const matchesStore = adminStoreFilter === 'all' || getProductStoreType(p) === adminStoreFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesStore && matchesSearch && matchesCategory;
  });

  // Filtered orders list (Defensively null-safe)
  const filteredOrders = storeScopedOrders.filter((o) => {
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

        {/* Boutique Switcher in Admin */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'all', label: 'Toutes les boutiques' },
              { id: 'mode', label: 'Boutique Mode' },
              { id: 'electronique', label: 'Boutique Électronique' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  const next = st.id as 'all' | StoreType;
                  setAdminStoreFilter(next);
                  setCategoryFilter('all');
                  if (next === 'electronique') {
                    setNewStoreType('electronique');
                    setNewCategory('smartphones');
                    setNewSubCategory('Smartphones & iPhones');
                  } else if (next === 'mode') {
                    setNewStoreType('mode');
                    setNewCategory('vetements');
                    setNewSubCategory('Boubous & Costumes');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  adminStoreFilter === st.id
                    ? 'bg-white text-black shadow-xs'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-zinc-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#B85D19] text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tableau de bord</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#B85D19] text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Articles ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#B85D19] text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Commandes</span>
            {orders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white text-black text-[10px] font-bold">
                {orders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================
          TAB 0: CLEAN INTERACTIVE DASHBOARD
         ============================================================ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Interactive Period Filter & Quick Actions Bar */}
          <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'Tout' },
                { id: 'today', label: "Aujourd'hui" },
                { id: '7d', label: '7 jours' },
                { id: '30d', label: '30 jours' },
              ].map((period) => (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setDashboardPeriod(period.id as 'all' | 'today' | '7d' | '30d')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    dashboardPeriod === period.id
                      ? 'bg-[#141210] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  refreshOrders();
                  showToast('Données actualisées.', 'info');
                }}
                className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouvel article</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 hover:border-zinc-900 shadow-xs text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Chiffre d'affaires
                </span>
                <DollarSign className="w-4 h-4 text-[#B85D19]" />
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-zinc-950">
                {formatFCFA(totalRevenue)}
              </div>
              <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Livré : <strong className="text-emerald-700">{formatFCFA(deliveredRevenue)}</strong></span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 hover:border-zinc-900 shadow-xs text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Commandes
                </span>
                <Package className="w-4 h-4 text-zinc-700" />
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-zinc-950">
                {totalOrdersCount}
              </div>
              <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-semibold">{deliveredOrdersCount} livrée{deliveredOrdersCount > 1 ? 's' : ''}</span>
                <span className="text-amber-700 font-semibold">{pendingOrdersCount} en cours</span>
              </div>
            </button>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 shadow-xs text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Clients
                </span>
                <Users className="w-4 h-4 text-zinc-700" />
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-zinc-950">
                {uniqueCustomersCount}
              </div>
              <div className="mt-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
                {cityStats.dakar} Dakar • {cityStats.regions} Régions
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 hover:border-zinc-900 shadow-xs text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Articles en ligne
                </span>
                <ShoppingBag className="w-4 h-4 text-zinc-700" />
              </div>
              <div className="font-display font-black text-xl sm:text-2xl text-zinc-950">
                {products.filter((p) => p.published).length}
              </div>
              <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Gérer le catalogue</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900" />
              </div>
            </button>
          </div>

          {/* Middle Section: Payment Breakdown & Top Selling Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods with Real Logos */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="font-display font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#B85D19]" />
                  <span>Paiements reçus</span>
                </h3>
                <span className="text-xs text-zinc-500 font-medium">
                  {totalOrdersCount} commande{totalOrdersCount > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  { label: 'Wave', logo: '/payments/wave.png', stat: paymentStats.wave, barColor: 'bg-sky-500' },
                  { label: 'Orange Money', logo: '/payments/orange-money.png', stat: paymentStats.om, barColor: 'bg-orange-500' },
                  { label: 'Yas / Mixx', logo: '/payments/yas.png', stat: paymentStats.free, barColor: 'bg-amber-400' },
                  { label: 'Espèces', logo: '', stat: paymentStats.cash, barColor: 'bg-emerald-600' },
                ].map((pm) => {
                  const pct = totalOrdersCount > 0 ? Math.round((pm.stat.count / totalOrdersCount) * 100) : 0;
                  return (
                    <div key={pm.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-semibold text-zinc-800">
                          {pm.logo ? (
                            <img src={pm.logo} alt={pm.label} className="w-5 h-5 rounded object-contain border border-zinc-200 bg-white p-0.5" />
                          ) : (
                            <span className="w-5 h-5 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-700">F</span>
                          )}
                          <span>{pm.label}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-zinc-500">{pm.stat.count} ({pct}%)</span>
                          <span className="font-bold text-zinc-900">{formatFCFA(pm.stat.revenue)}</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div className={`h-full ${pm.barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Top Articles */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="font-display font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#B85D19]" />
                  <span>Articles les plus vendus</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-semibold text-[#B85D19] hover:underline cursor-pointer"
                >
                  Voir le catalogue →
                </button>
              </div>

              {topSellingItems.length === 0 ? (
                <div className="py-8 text-center text-zinc-400 text-xs">
                  Aucune vente sur cette période.
                </div>
              ) : (
                <div className="space-y-2">
                  {topSellingItems.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setProductSearch(item.name);
                        setActiveTab('products');
                      }}
                      className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono font-bold text-xs text-zinc-400 w-4 shrink-0">
                          {idx + 1}.
                        </span>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg bg-zinc-200 border border-zinc-200 shrink-0"
                          />
                        )}
                        <div className="truncate">
                          <p className="font-semibold text-xs text-zinc-900 truncate group-hover:text-[#B85D19] transition-colors">{item.name}</p>
                          <p className="text-[11px] text-zinc-500">{item.count} vendu{item.count > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-zinc-900 shrink-0">
                        {formatFCFA(item.revenue)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Recent Orders with Direct Status Update */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-100">
              <h3 className="font-display font-bold text-sm text-zinc-900">
                Dernières commandes ({dashboardOrders.length})
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-[#B85D19] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Tout voir</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {dashboardOrders.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs">
                Aucune commande sur cette période.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {dashboardOrders.slice(0, 6).map((order) => {
                  const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
                    label: order.status,
                    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
                  };
                  return (
                    <div key={order.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono font-bold text-xs text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md shrink-0">
                          {order.id}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-zinc-900 truncate">
                            {order.customerName} • <span className="font-mono text-zinc-600">{order.customerPhone}</span>
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {order.customerCity} • {(order.items?.length || 0)} {(order.items?.length || 0) > 1 ? 'articles' : 'article'} • {getPaymentMethodLabel(order.paymentMethod)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-between sm:justify-end shrink-0">
                        <span className="font-mono font-bold text-xs text-zinc-900 mr-1">
                          {formatFCFA(order.total)}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as OrderStatus;
                            updateOrderStatus(order.id, newStatus);
                            addAuditLog(`Statut commande ${order.id} mis à jour`, `Nouveau statut : ${newStatus}`);
                            showToast(`Commande ${order.id} mise à jour.`, 'success');
                          }}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${statusConfig.badgeClass} focus:outline-none cursor-pointer`}
                        >
                          <option value="transmise">Reçue</option>
                          <option value="confirmee">Confirmée</option>
                          <option value="en_preparation">En préparation</option>
                          <option value="en_livraison">En livraison</option>
                          <option value="livree">Livrée</option>
                        </select>
                        <a
                          href={`https://wa.me/${String(order.customerPhone || '').replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          title="Contacter sur WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
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
                        onChange={(e) => { const val = e.target.value; setNewName(val); autoDetectCategory(val); }}
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

                  {/* BOUTIQUE SELECTION (Mode vs Électronique) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Boutique de destination *
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryManuallyChosen(true);
                          setNewStoreType('mode');
                          setNewCategory('vetements');
                          setNewSubCategory('Boubous & Costumes');
                          setNewSizes([]);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          newStoreType === 'mode'
                            ? 'border-[#B85D19] bg-amber-50/70 ring-1 ring-[#B85D19]'
                            : 'border-zinc-200 bg-white hover:bg-zinc-50'
                        }`}
                      >
                        <ShoppingBag className={`w-4 h-4 ${newStoreType === 'mode' ? 'text-[#B85D19]' : 'text-zinc-500'}`} />
                        <div>
                          <p className="font-bold text-xs text-zinc-900">Boutique Mode</p>
                          <p className="text-[10px] text-zinc-500">Vêtements, Chaussures, Parfums</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCategoryManuallyChosen(true);
                          setNewStoreType('electronique');
                          setNewCategory('smartphones');
                          setNewSubCategory('Smartphones & iPhones');
                          setNewSizes([]);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          newStoreType === 'electronique'
                            ? 'border-[#B85D19] bg-amber-50/70 ring-1 ring-[#B85D19]'
                            : 'border-zinc-200 bg-white hover:bg-zinc-50'
                        }`}
                      >
                        <Smartphone className={`w-4 h-4 ${newStoreType === 'electronique' ? 'text-[#B85D19]' : 'text-zinc-500'}`} />
                        <div>
                          <p className="font-bold text-xs text-zinc-900">Boutique Électronique</p>
                          <p className="text-[10px] text-zinc-500">iPhones, PC, Outils Tech</p>
                        </div>
                      </button>
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
                          setCategoryManuallyChosen(true);
                          setNewCategory(cat);
                          if (['smartphones', 'ordinateurs', 'tablettes_montres', 'audio_tech', 'accessoires_tech'].includes(cat)) {
                            setNewStoreType('electronique');
                            setNewSizes([]);
                            const labels: Record<string, string> = {
                              smartphones: 'Smartphones & iPhones',
                              ordinateurs: 'Ordinateurs & PC',
                              tablettes_montres: 'Tablettes & Montres',
                              audio_tech: 'Audio & Écouteurs',
                              accessoires_tech: 'Accessoires Tech',
                            };
                            setNewSubCategory(labels[cat] || 'Électronique');
                          } else if (cat === 'chaussures') {
                            setNewSizes(['41', '42', '43', '44']);
                            setNewSubCategory('Chaussures de Ville');
                          } else if (cat === 'lunettes' || cat === 'accessoires' || cat === 'parfums') {
                            setNewSizes([]);
                            setNewSubCategory(cat === 'lunettes' ? 'Lunettes de Soleil' : cat === 'parfums' ? 'Parfums' : 'Accessoires');
                          } else {
                            setNewSizes(['M', 'L', 'XL']);
                            setNewSubCategory('Boubous & Costumes');
                          }
                        }}
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                      >
                        <option value="vetements">Vêtements (Boubous, Costumes, Chemises...)</option>
                        <option value="chaussures">Chaussures & Souliers</option>
                        <option value="parfums">Parfums & Senteurs</option>
                        <option value="smartphones">Smartphones & iPhones</option>
                        <option value="ordinateurs">Ordinateurs & PC</option>
                        <option value="tablettes_montres">Tablettes & Montres Connectées</option>
                        <option value="audio_tech">Audio & Écouteurs</option>
                        <option value="accessoires_tech">Accessoires & Outils Électroniques</option>
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
                        onChange={(e) => { const val = e.target.value; setNewSubCategory(val); autoDetectCategory(val); }}
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
                      {(newStoreType === 'electronique' ? TECH_VARIANTS : newCategory === 'chaussures' ? SHOE_SIZES : CLOTHING_SIZES).map((sz) => {
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
                <option value="chaussures">Chaussures</option>
                  <option value="parfums">Parfums</option>
                  <option value="lunettes">Lunettes</option>
                <option value="accessoires">Accessoires</option>
                  <option value="smartphones">Smartphones & iPhones</option>
                  <option value="ordinateurs">Ordinateurs & PC</option>
                  <option value="tablettes_montres">Tablettes & Montres</option>
                  <option value="audio_tech">Audio & Écouteurs</option>
                  <option value="accessoires_tech">Accessoires Tech</option>
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

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-800 mb-1">
                              Catégorie de l'article *
                            </label>
                            <select
                              value={editCategory}
                              onChange={(e) => {
                                const cat = e.target.value as ProductCategory;
                                setEditCategory(cat);
                                setEditStoreType(['smartphones', 'ordinateurs', 'tablettes_montres', 'audio_tech', 'accessoires_tech'].includes(cat) ? 'electronique' : 'mode');
                              }}
                              className="w-full text-xs font-semibold px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                            >
                              <option value="vetements">Vêtements (Pantalons, Chemises, Vestes...)</option>
                              <option value="accessoires">Sacs & Accessoires (Sacs, Pochettes, Portefeuilles...)</option>
                              <option value="lunettes">Lunettes & Montures</option>
                              <option value="chaussures">Chaussures & Souliers</option>
                              <option value="parfums">Parfums & Senteurs</option>
                              <option value="smartphones">Smartphones & iPhones</option>
                              <option value="ordinateurs">Ordinateurs & PC</option>
                              <option value="tablettes_montres">Tablettes & Montres Connectées</option>
                              <option value="audio_tech">Audio & Écouteurs</option>
                              <option value="accessoires_tech">Accessoires & Outils Électroniques</option>
                            </select>
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
                          {(editStoreType === 'electronique' ? TECH_VARIANTS : editCategory === 'chaussures' ? SHOE_SIZES : CLOTHING_SIZES).map((size) => {
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
                      <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product)}
                          className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer cet article</span>
                        </button>
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setEditingProductId(null)}
                            className="px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-black transition-colors cursor-pointer"
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

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(product)}
                          className="px-3.5 py-2 bg-[#141210] hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Modifier</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product)}
                          className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200/80 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                          title={`Supprimer l'article "${product.name}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          <span>Supprimer</span>
                        </button>
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
                    Gestion des Commandes en Direct
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Connecté
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Toutes les commandes passées par vos clients apparaissent instantanément sur cette page.
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

          
          {/* Status Filter Tabs (Top-Level Interactive Status Filters) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#B85D19]" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Filtrer les commandes par état :
                </span>
              </div>
              {orderStatusFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setOrderStatusFilter('all')}
                  className="text-xs font-bold text-[#B85D19] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Réinitialiser (Tous les colis)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { id: 'all', label: 'Tous les colis', count: orderStatusCounts.all, activeBg: 'bg-zinc-900 text-white' },
                { id: 'transmise', label: '1. Reçues en Ligne', count: orderStatusCounts.transmise, activeBg: 'bg-amber-600 text-white' },
                { id: 'confirmee', label: '2. Confirmées', count: orderStatusCounts.confirmee, activeBg: 'bg-blue-600 text-white' },
                { id: 'en_preparation', label: '3. En préparation', count: orderStatusCounts.en_preparation, activeBg: 'bg-purple-600 text-white' },
                { id: 'en_livraison', label: "4. En cours d'acheminement", count: orderStatusCounts.en_livraison, activeBg: 'bg-orange-600 text-white' },
                { id: 'livree', label: '5. Colis Livrés', count: orderStatusCounts.livree, activeBg: 'bg-emerald-600 text-white' },
              ].map((tab) => {
                const isActive = orderStatusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setOrderStatusFilter(tab.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-1.5 cursor-pointer border ${
                      isActive
                        ? `${tab.activeBg} border-transparent shadow-md ring-2 ring-black/10 scale-[1.02]`
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <span className="truncate">{tab.label}</span>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-zinc-200 text-zinc-800'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>


          
          {/* Active Filter Context Banner */}
          {orderStatusFilter !== 'all' && (
            <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B85D19] animate-pulse shrink-0" />
                <span className="text-zinc-700">
                  Vue filtrée : <strong>{filteredOrders.length} commande(s)</strong> avec l'état{' '}
                  <strong className="text-zinc-950 font-bold">
                    « {ORDER_STATUS_CONFIG[orderStatusFilter as OrderStatus]?.label || orderStatusFilter} »
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOrderStatusFilter('all')}
                className="text-xs font-bold text-[#B85D19] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>Voir toutes les commandes ({orders.length})</span>
              </button>
            </div>
          )}


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
                <option value="transmise">1. Reçue en Ligne</option>
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
                {orderStatusFilter !== 'all'
                  ? `Aucune commande avec l'état « ${ORDER_STATUS_CONFIG[orderStatusFilter as OrderStatus]?.label || orderStatusFilter} »`
                  : 'Aucune commande trouvée'}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                {orderStatusFilter !== 'all'
                  ? 'Il n\'y a actuellement aucun colis dans cette étape. Vous pouvez changer l\'état d\'un colis ou réinitialiser le filtre.'
                  : 'Dès qu\'un client passe commande sur le site, elle apparaîtra ici et sera conservée dans la plateforme.'}
              </p>
              {orderStatusFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setOrderStatusFilter('all')}
                  className="mt-4 px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Afficher tous les colis ({orders.length})
                </button>
              )}
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
                          <option value="transmise">1. Reçue en Ligne</option>
                          <option value="confirmee">2. Confirmée par CAPOSTORE221</option>
                          <option value="en_preparation">3. En cours de préparation</option>
                          <option value="en_livraison">4. En cours de livraison</option>
                          <option value="livree">5. Colis Livré</option>
                        </select>
                      </div>
                    </div>

                    
                    {/* Visual Status Banner distinguishing each step */}
                    {order.status === 'en_livraison' && (
                      <div className="bg-orange-50 border-b border-orange-200 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-orange-950 font-semibold">
                        <span className="flex items-center gap-2">
                          <span>🚚</span>
                          <span><strong>COLIS CHEZ LE LIVREUR :</strong> En cours d'acheminement vers l'adresse du client ({order.customerCity})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            updateOrderStatus(order.id, 'livree');
                            addAuditLog(`Statut commande ${order.id} mis à jour`, 'Nouveau statut : livree');
                            showToast(`Colis ${order.id} marqué comme Livré avec succès !`, 'success');
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shrink-0 cursor-pointer shadow-xs transition-colors"
                        >
                          ✓ Valider la livraison
                        </button>
                      </div>
                    )}

                    {order.status === 'livree' && (
                      <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-6 py-2 flex items-center gap-2 text-xs text-emerald-950 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span><strong>COMMANDE LIVRÉE & TERMINÉE :</strong> Colis remis au client avec succès. Paiement encaissé ({formatFCFA(order.total)}).</span>
                      </div>
                    )}

                    {order.status === 'transmise' && (
                      <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2 flex items-center gap-2 text-xs text-amber-950 font-semibold">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span><strong>NOUVELLE COMMANDE REÇUE :</strong> Commande passée sur le site par le client, en attente de confirmation par WhatsApp ou téléphone.</span>
                      </div>
                    )}

                    {order.status === 'confirmee' && (
                      <div className="bg-blue-50 border-b border-blue-200 px-4 sm:px-6 py-2 flex items-center gap-2 text-xs text-blue-950 font-semibold">
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        <span><strong>COMMANDE CONFIRMÉE :</strong> Validée par CAPOSTORE221. Prête pour mise en préparation.</span>
                      </div>
                    )}

                    {order.status === 'en_preparation' && (
                      <div className="bg-purple-50 border-b border-purple-200 px-4 sm:px-6 py-2 flex items-center gap-2 text-xs text-purple-950 font-semibold">
                        <Package className="w-4 h-4 text-purple-600 shrink-0" />
                        <span><strong>EN PRÉPARATION :</strong> Les articles sont en cours d'emballage et d'étiquetage à l'atelier.</span>
                      </div>
                    )}


                    {/* Action Gérant : Modifier l'état de ce colis */}
                    <div className="bg-zinc-100/90 px-4 sm:px-6 py-2.5 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-black text-zinc-500 tracking-wider">
                          État actuel de ce colis :
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusConfig.badgeClass}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{statusConfig.label}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 mr-1">
                          Passer ce colis à :
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
                                  ? `${cfg?.badgeClass || 'bg-black text-white'} ring-2 ring-black/20 shadow-xs font-black`
                                  : 'bg-white hover:bg-zinc-200/70 text-zinc-700 border border-zinc-200 hover:border-zinc-400'
                              }`}
                              title={`Définir le statut de cette commande sur "${cfg?.label || st}"`}
                            >
                              {idx + 1}. {cfg?.label || st} {isAct ? '✓' : ''}
                            </button>
                          );
                        })}
                      </div>
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
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Paiement & Mode de Réception</span>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-emerald-700 font-bold">{getPaymentMethodLabel(order.paymentMethod)}</span>
                            {(order.notes === 'retrait' || (order.customerAddress || '').toLowerCase().includes('récupération') || (order.customerCity || '').toLowerCase().includes('sur place')) ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                                🏪 Récupération sur place
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                                🚚 Livraison à domicile
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-600 block mt-1 truncate">{order.customerCity} - {order.customerAddress}</span>
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
                              `Bonjour ${order.customerName || 'Client'}, CAPOSTORE221 vous informe que votre commande ${order.id} est actuellement : ${statusConfig.label}. Merci pour votre confiance sur https://capostore221.com !`
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

      
      {/* Modal Dédié : Modifier le mot de passe Propriétaire */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141210] text-white w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Modifier le mot de passe
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPwdChangeError(null);
                  setCurrentPwd('');
                  setNewPwd('');
                  setConfirmPwd('');
                }}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Saisissez votre mot de passe actuel puis choisissez votre nouveau code d'accès propriétaire.
            </p>

            <form onSubmit={async (e) => {
              e.preventDefault();
              await handleChangePassword(e);
              if (!pwdChangeError) {
                setIsPasswordModalOpen(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Mot de passe actuel *
                </label>
                <input
                  type="password"
                  required
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Mot de passe actuel"
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Nouveau mot de passe *
                </label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Répétez le nouveau mot de passe"
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                />
              </div>

              {pwdChangeError && (
                <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
                  {pwdChangeError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#B85D19] hover:bg-[#9E4D12] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                Enregistrer le mot de passe
              </button>
            </form>
          </div>
        </div>
      )}
</div>
  );
};
