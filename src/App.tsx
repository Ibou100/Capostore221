import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { ProductDetailView } from './components/product/ProductDetailView';
import { WishlistView } from './components/catalog/WishlistView';
import { EditorialStoryView } from './components/home/EditorialStoryView';
// Public orders/tracking views removed: order management is exclusive to AdminView
import { AdminView } from './components/admin/AdminView';

import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/ui/SearchModal';
import { QuickViewModal } from './components/ui/QuickViewModal';
import { QuickOrderModal } from './components/ui/QuickOrderModal';
import { ToastNotification } from './components/ui/ToastNotification';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

// Error Boundary to prevent any blank screen in production
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CAPOSTORE221 Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('capostore_orders_v1');
      localStorage.removeItem('capostore_product_overrides_v1');
      localStorage.removeItem('capostore_custom_products_v1');
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#141210] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-[#B85D19] flex items-center justify-center text-2xl font-bold mb-4 border border-amber-500/30">
            CS
          </div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl mb-2">
            CAPOSTORE221 - Actualisation Requise
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-6">
            Une mise à jour des données est en cours. Cliquez sur le bouton ci-dessous pour recharger l'interface.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#B85D19] hover:bg-[#9E4D12] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
            >
              Recharger la page
            </button>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { currentView } = useStore();

  const renderCurrentView = () => {
    switch (currentView.type) {
      case 'home':
        return <HomeView />;
      case 'catalog':
        return <CatalogView />;
      case 'product-detail':
        return <ProductDetailView productId={currentView.productId} />;
      case 'wishlist':
        return <WishlistView />;
      case 'editorial':
        return <EditorialStoryView />;
      case 'orders':
      case 'tracking':
        return <HomeView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-capo-offwhite text-capo-black selection:bg-capo-black selection:text-white pb-16 lg:pb-0">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Navbar */}
      <Navbar />

      {/* 3. Main Dynamic Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Mobile Bottom Tab Bar (App Experience) */}
      <MobileBottomNav />

      {/* 6. Global Interactive Modals & Drawers */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <QuickOrderModal />
      <ToastNotification />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <OrderProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </OrderProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default App;
