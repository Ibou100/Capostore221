import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Edit3, Save, RotateCcw, Package, 
  Trash2, Search, ArrowLeft, Phone, MessageCircle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import { 
  formatFCFA, 
  ORDER_STATUS_CONFIG, 
  getPaymentMethodLabel 
} from '../../utils/format';
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

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // Products filtering & editing
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Edit form state for selected product
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(5000);
  const [editSizes, setEditSizes] = useState<string[]>([]);
  const [editStock, setEditStock] = useState<number>(10);
  const [editPublished, setEditPublished] = useState<boolean>(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '221' || pinCode === '2210' || pinCode === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
      showToast('Connexion à l\'espace propriétaire réussie !', 'success');
    } else {
      setPinError(true);
      showToast('Code PIN incorrect. Le code par défaut est 221.', 'error');
    }
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

    setEditingProductId(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les tenues et prix aux valeurs d\'origine ?')) {
      resetProductOverrides();
      setEditingProductId(null);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch.trim() === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(productSearch.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Login view if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-xl text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B85D19] border border-amber-200">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="font-display font-extrabold text-xl text-zinc-900 tracking-tight">
            Espace Propriétaire CAPOSTORE221
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
            Accès sécurisé réservé au propriétaire pour modifier les prix, renommer les tenues, gérer les tailles disponibles et le suivi des colis.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 text-left mb-1.5">
                Code PIN Propriétaire (Code par défaut : 221)
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinCode}
                onChange={(e) => {
                  setPinCode(e.target.value);
                  setPinError(false);
                }}
                placeholder="Entrez votre PIN (221)"
                className={`w-full text-center text-lg font-mono tracking-widest px-4 py-3 rounded-xl border ${
                  pinError ? 'border-red-400 bg-red-50 text-red-900' : 'border-zinc-300 bg-zinc-50'
                } focus:outline-none focus:ring-2 focus:ring-[#B85D19]`}
                autoFocus
              />
              {pinError && (
                <p className="text-[11px] text-red-600 font-medium text-left mt-1">
                  Code incorrect. Entrez <strong>221</strong> pour vous connecter.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#141210] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
            >
              Déverrouiller l'Espace Gestion
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-100">
            <button
              onClick={goToHome}
              className="text-xs font-semibold text-zinc-500 hover:text-black transition-colors"
            >
              ← Retour à la boutique
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Mode Propriétaire Actif</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-900 tracking-tight">
            Gestion de Boutique & Commandes
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Personnalisez vos tenues (nom, prix, tailles en stock) et mettez à jour les colis clients.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={goToHome}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voir le site</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 gap-4 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 font-display font-bold text-xs uppercase tracking-wider transition-colors relative ${
            activeTab === 'products'
              ? 'text-[#B85D19]'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <span>🏷️ Tenues & Articles ({products.length})</span>
          {activeTab === 'products' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D19] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-display font-bold text-xs uppercase tracking-wider transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'text-[#B85D19]'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <span>📦 Commandes & Colis</span>
          {orders.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#141210] text-white text-[10px]">
              {orders.length}
            </span>
          )}
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B85D19] rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Rechercher une tenue..."
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-700 focus:outline-none"
              >
                <option value="all">Toutes catégories</option>
                <option value="vetements">Vêtements</option>
                <option value="lunettes">Lunettes</option>
                <option value="accessoires">Accessoires</option>
              </select>
            </div>

            <button
              onClick={handleResetDefaults}
              className="text-xs font-semibold text-zinc-500 hover:text-red-600 flex items-center gap-1.5 transition-colors self-end md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rétablir valeurs d'origine</span>
            </button>
          </div>

          {/* Product list */}
          <div className="grid grid-cols-1 gap-4">
            {filteredProducts.map((product) => {
              const isEditing = editingProductId === product.id;

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    isEditing
                      ? 'border-[#B85D19] ring-2 ring-[#B85D19]/20 shadow-lg'
                      : 'border-zinc-200 shadow-sm hover:border-zinc-300'
                  }`}
                >
                  {isEditing ? (
                    // EDITING FORM
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-xl bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                              Nom de la tenue (tel que vous souhaitez l'appeler) :
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full text-sm font-semibold px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                              placeholder="Entrez le nom de la tenue"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                                Prix (FCFA) :
                              </label>
                              <input
                                type="number"
                                step={500}
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-full text-sm font-mono font-bold px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B85D19]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                                Disponibilité :
                              </label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditPublished(true)}
                                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
                                    editPublished ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                                  }`}
                                >
                                  En vente
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditPublished(false)}
                                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
                                    !editPublished ? 'bg-red-50 text-red-800 border-red-300 font-bold' : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                                  }`}
                                >
                                  Masqué
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sizes selection */}
                      <div className="pt-3 border-t border-zinc-100">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-bold uppercase text-zinc-700">
                            Tailles disponibles en stock pour cette tenue :
                          </label>
                          <span className="text-[10px] text-zinc-500">
                            (Seules les tailles cochées seront commandables par les clients)
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
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  isChecked
                                    ? 'bg-[#141210] text-white shadow-sm ring-2 ring-black'
                                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 border border-zinc-200'
                                }`}
                              >
                                {size} {isChecked ? '✓' : ''}
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => setEditSizes([])}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
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
                      <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveProduct(product.id)}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                        >
                          <Save className="w-4 h-4" />
                          <span>Enregistrer la tenue</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // DISPLAY ROW
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
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
                            <span className="text-[11px] text-zinc-500">
                              Tailles dispo :{' '}
                              <strong className="text-zinc-800">
                                {product.availableSizes && product.availableSizes.length > 0
                                  ? product.availableSizes.join(', ')
                                  : 'Taille Unique'}
                              </strong>
                            </span>
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

      {/* TAB 2: ORDERS MANAGEMENT & TRACKING UPDATE */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200">
              <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="font-display font-bold text-base text-zinc-900">
                Aucune commande pour le moment
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Dès qu'un client passera commande sur le site, elle apparaîtra ici. Vous pourrez mettre à jour le statut du colis en direct.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusConfig = ORDER_STATUS_CONFIG[order.status];

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm"
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
                            updateOrderStatus(order.id, e.target.value as OrderStatus);
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
                              title="Appeler"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
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
                          <div key={idx} className="py-2 flex items-center justify-between gap-3 text-xs">
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
    </div>
  );
};
