import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Edit3, Save, RotateCcw, Package, 
  Trash2, Search, ArrowLeft, Phone, MessageCircle, 
  Eye, EyeOff, KeyRound, Download, Clock, 
  AlertTriangle, ShieldAlert, LogOut
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
  getAttemptTracker,
  getAuditLogs,
  addAuditLog,
  type SecurityAuditLog 
} from '../../utils/security';
import type { OrderStatus, Product } from '../../types';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const AdminView: React.FC = () => {
  const { 
    products, 
    updateProductOverride, 
    resetProductOverrides, 
    goToHome, 
    showToast 
  } = useStore();

  const { orders, updateOrderStatus, deleteOrder } = useOrders();

  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSessionValid());
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState<string | null>(null);

  // Active Tab: 'products' | 'orders' | 'security' | 'backup'
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'security' | 'backup'>('products');

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
  const [editSizes, setEditSizes] = useState<string[]>([]);
  const [editStock, setEditStock] = useState<number>(10);
  const [editPublished, setEditPublished] = useState<boolean>(true);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);

  // Check lockout countdown
  useEffect(() => {
    const checkLockout = () => {
      const tracker = getAttemptTracker();
      if (tracker.lockedUntil && tracker.lockedUntil > Date.now()) {
        const remainingSeconds = Math.ceil((tracker.lockedUntil - Date.now()) / 1000);
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        setLockoutTimer(`${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
      } else {
        setLockoutTimer(null);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
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
      setAuthError('Veuillez entrer le mot de passe propriétaire.');
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
        showToast('Connexion sécurisée réussie ! Bienvenue dans votre console.', 'success');
      } else {
        setAuthError(result.error || 'Mot de passe incorrect.');
      }
    } catch {
      setAuthError('Erreur de validation de sécurité.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    revokeAdminSession();
    setIsAuthenticated(false);
    setPasswordInput('');
    showToast('Session propriétaire fermée en toute sécurité.', 'info');
  };

  const handleStartEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditSizes(product.availableSizes ? [...product.availableSizes] : []);
    setEditStock(product.stock);
    setEditPublished(product.published);
  };

  const handleToggleSize = (size: string) => {
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

    updateProductOverride(productId, {
      name: editName.trim(),
      price: editPrice,
      availableSizes: editSizes,
      stock: editStock,
      published: editPublished,
    });

    addAuditLog(`Tenue modifiée (${productId})`, `Nouveau nom : "${editName.trim()}" | Prix : ${formatFCFA(editPrice)}`);
    setEditingProductId(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les tenues et prix aux valeurs d\'origine ?')) {
      resetProductOverrides();
      addAuditLog('Réinitialisation complète du catalogue aux valeurs usine');
      setEditingProductId(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdChangeError(null);

    if (newPwd.length < 6) {
      setPwdChangeError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (newPwd !== confirmPwd) {
      setPwdChangeError('Les deux nouveaux mots de passe ne correspondent pas.');
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
    showToast('Votre mot de passe propriétaire a été mis à jour avec succès !', 'success');
  };

  const handleExportBackup = () => {
    const data = {
      backupDate: new Date().toISOString(),
      store: 'CAPOSTORE221',
      orders,
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

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch.trim() === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(productSearch.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q);

    const matchesStatus =
      orderStatusFilter === 'all' || o.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // ==========================================
  // 1. SECURE LOGIN SCREEN (IF NOT AUTHENTICATED)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#141210] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-zinc-800 relative overflow-hidden">
          {/* Subtle security glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#B85D19]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-[#B85D19] shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-400 text-[10px] font-mono uppercase tracking-widest mb-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Accès Restreint Propriétaire</span>
              </div>
              <h1 className="font-display font-black text-2xl tracking-tight text-white">
                Portail Administration
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Espace sécurisé de contrôle CAPOSTORE221 (Articles, Prix, Tailles & Commandes).
              </p>
            </div>
          </div>

          {/* Lockout Warning */}
          {lockoutTimer && (
            <div className="mt-6 p-4 rounded-xl bg-red-950/80 border border-red-700/80 text-xs text-red-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-300 font-bold uppercase">
                  Accès Temporairement Verrouillé
                </strong>
                <span>
                  Plusieurs tentatives infructueuses. Veuillez patienter encore{' '}
                  <strong className="font-mono text-white text-sm">{lockoutTimer}</strong>.
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  Mot de passe Propriétaire *
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">Chiffré SHA-256</span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={!!lockoutTimer || isSubmitting}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="Entrez votre mot de passe"
                  className="w-full text-sm px-4 py-3 bg-white/5 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#B85D19] focus:border-transparent transition-all pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!!lockoutTimer || isSubmitting}
              className="w-full py-3.5 bg-[#B85D19] hover:bg-[#9E4D12] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#B85D19]/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Vérification sécurisée...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Se connecter au Panneau de Contrôle</span>
                </>
              )}
            </button>
          </form>

          {/* Credentials Info Helper for the Owner */}
          <div className="mt-6 p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-zinc-400 space-y-1 text-left">
            <span className="font-bold text-zinc-200 block">🔑 Aide pour le Propriétaire :</span>
            <p>
              Mot de passe initial par défaut : <strong className="text-amber-400 font-mono">CapoStore221@Admin</strong> (ou <strong className="text-amber-400 font-mono">capo221</strong>).
            </p>
            <p className="text-[10px] text-zinc-500">
              Vous pourrez changer ce mot de passe à tout moment dans l'onglet « Sécurité » de votre tableau de bord.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
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
              Pilotez vos 23 tenues (noms, prix, tailles en stock) et suivez l'acheminement des commandes clients en direct.
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
            <Lock className="w-3.5 h-3.5" />
            <span>Sécurité & Mot de Passe</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          TAB 1: PRODUCTS / OUTFITS MANAGEMENT (NAMES, PRICES, SIZES)
         ============================================================ */}
      {activeTab === 'products' && (
        <div className="space-y-6">
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
                <option value="lunettes">Lunettes</option>
                <option value="accessoires">Accessoires & Maroquinerie</option>
              </select>
            </div>

            <button
              onClick={handleResetDefaults}
              className="text-xs font-semibold text-zinc-500 hover:text-red-600 flex items-center gap-1.5 transition-colors self-end md:self-auto py-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rétablir tous les noms et prix initiaux</span>
            </button>
          </div>

          {/* Product Items List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => {
              const isEditing = editingProductId === product.id;

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
                          src={product.images[0]}
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

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-800 mb-1">
                                Prix de vente (FCFA) *
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
                                  ✕ Masqué du catalogue
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
                          {ALL_SIZES.map((size) => {
                            const isChecked = editSizes.includes(size);
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleToggleSize(size)}
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
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                            {product.category} • {product.subCategory}
                          </span>
                          <h3 className="font-display font-bold text-sm text-zinc-900">
                            {product.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="font-mono font-bold text-xs text-[#B85D19]">
                              {formatFCFA(product.price)}
                            </span>
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
                const statusConfig = ORDER_STATUS_CONFIG[order.status];

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
                      <div className="flex items-center gap-2">
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

                    {/* Content */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Customer Info row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs">
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Client</span>
                          <strong className="text-zinc-900">{order.customerName}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Téléphone</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-zinc-900">{order.customerPhone}</span>
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="p-1 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                              title="Appeler le client"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              title="Discuter sur WhatsApp"
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
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0"
                              />
                              <div>
                                <h4 className="font-semibold text-zinc-900">{item.name}</h4>
                                <span className="text-[11px] text-zinc-500">
                                  {item.size ? `Taille : ${item.size}` : 'Taille Unique'} • Quantité : {item.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-zinc-900 font-mono">
                              {formatFCFA(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer & Delete */}
                      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <div className="text-xs">
                          <span className="text-zinc-500">Total commande : </span>
                          <strong className="font-mono text-sm text-zinc-900">{formatFCFA(order.total)}</strong>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer la commande ${order.id} ?`)) {
                              deleteOrder(order.id);
                              addAuditLog(`Suppression commande ${order.id}`);
                              showToast(`Commande ${order.id} supprimée.`, 'info');
                            }
                          }}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
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
          TAB 3: SECURITY, MASTER PASSWORD & AUDIT LOG
         ============================================================ */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  Chiffré avec sel cryptographique via SHA-256 (Web Crypto).
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
                  placeholder="Votre mot de passe actuel"
                  className="w-full text-xs px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Nouveau mot de passe * (min. 6 caractères)
                </label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Nouveau mot de passe fort"
                  className="w-full text-xs px-3.5 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Confirmer le nouveau mot de passe *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Répétez le nouveau mot de passe"
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
                Mettre à jour mon mot de passe
              </button>
            </form>
          </div>

          {/* Security Audit Log */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-zinc-500" />
                <h3 className="font-display font-bold text-base text-zinc-900">
                  Journal d'Activité de Sécurité
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {auditLogs.length} événements
              </span>
            </div>

            <p className="text-xs text-zinc-500">
              Trace toutes les connexions et actions administratives sensibles.
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
