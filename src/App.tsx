import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { ProductDetailView } from './components/product/ProductDetailView';
import { WishlistView } from './components/catalog/WishlistView';
import { EditorialStoryView } from './components/home/EditorialStoryView';

import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/ui/SearchModal';
import { QuickViewModal } from './components/ui/QuickViewModal';
import { ToastNotification } from './components/ui/ToastNotification';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

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
      <ToastNotification />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </StoreProvider>
  );
}

export default App;
