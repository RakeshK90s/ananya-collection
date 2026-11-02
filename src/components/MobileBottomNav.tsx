import React from 'react';
import {
  Home,
  Sparkles,
  ShoppingCart,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    cartGrandTotal,
    setIsCartDrawerOpen,
    currentUser,
    setIsLoginModalOpen,
  } = useStore();

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  // If in admin view, hide the storefront mobile nav
  if (activeTab === 'admin' || activeTab === 'seller-admin' || activeTab === 'super-admin') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-lg px-2 py-1 safe-area-pb">
      <div className="grid grid-cols-5 items-center text-[10px]">
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('storefront')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'storefront' ? 'text-[#B8860B] font-bold' : 'text-stone-500'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span className="truncate">Home</span>
        </button>

        {/* 2. Collections */}
        <button
          onClick={() => {
            setActiveTab('storefront');
            setTimeout(() => {
              const el = document.getElementById('curated-catalog');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="flex flex-col items-center justify-center py-1 text-stone-500 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-amber-500" />
          <span className="truncate">Collections</span>
        </button>

        {/* 3. Cart Drawer Trigger */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-stone-500 cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="w-4 h-4 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#B8860B] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="truncate">{cartCount > 0 ? formatINR(cartGrandTotal) : 'Bag'}</span>
        </button>

        {/* 4. Unified Admin Panel */}
        <button
          onClick={() => setActiveTab('admin')}
          className="flex flex-col items-center justify-center py-1 transition-colors cursor-pointer text-stone-600 dark:text-stone-400 hover:text-[#B8860B]"
        >
          <div className="relative">
            <ShieldCheck className="w-4 h-4 mb-0.5 text-[#B8860B]" />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
          </div>
          <span className="truncate font-semibold">Admin</span>
        </button>

        {/* 5. Account / Profile */}
        <button
          onClick={() => {
            if (currentUser.isLoggedIn) {
              setActiveTab('my-account');
            } else {
              setIsLoginModalOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'my-account' ? 'text-[#B8860B] font-bold' : 'text-stone-500'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span className="truncate">{currentUser.isLoggedIn ? 'Account' : 'Login'}</span>
        </button>
      </div>
    </div>
  );
};
