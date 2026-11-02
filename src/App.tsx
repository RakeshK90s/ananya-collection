import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { StorefrontView } from './components/StorefrontView';
import { ThemeCustomiser } from './components/ThemeCustomiser';
import { UnifiedAdminPanel } from './components/UnifiedAdminPanel';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LoginModal } from './components/LoginModal';
import { CustomerAccountView } from './components/CustomerAccountView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';
import { AdminLoginModal } from './components/AdminLoginModal';

const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedProduct,
    setSelectedProduct,
    sharingProduct,
    setSharingProduct,
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('all');
  };

  const handleSelectSubcategory = (subId: string, parentCatId?: string) => {
    setSelectedSubcategory(subId);
    if (parentCatId) {
      setSelectedCategory(parentCatId);
    }
  };

  // If in Unified Single-Store Admin View, render full Admin Interface
  if (activeTab === 'admin' || activeTab === 'seller-admin' || activeTab === 'super-admin') {
    return <UnifiedAdminPanel />;
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">
      {/* Universal Top Header */}
      <Header
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={handleSelectSubcategory}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {activeTab === 'storefront' && (
          <StorefrontView
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={handleSelectSubcategory}
          />
        )}

        {activeTab === 'theme-customiser' && <ThemeCustomiser />}

        {activeTab === 'checkout' && <CheckoutView />}

        {(activeTab === 'order-success' || activeTab === 'order-tracking') && (
          <OrderConfirmationView />
        )}

        {activeTab === 'my-account' && <CustomerAccountView />}
      </main>

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Mobile + OTP Login Modal */}
      <LoginModal />

      {/* Product Share Modal */}
      <ShareModal
        product={sharingProduct}
        isOpen={Boolean(sharingProduct)}
        onClose={() => setSharingProduct(null)}
      />

      {/* Boutique Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
      />

      {/* Global Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
