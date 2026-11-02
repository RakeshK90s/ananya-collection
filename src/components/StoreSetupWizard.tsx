import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Rocket,
  Check,
  Store,
  Palette,
  Package,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { THEME_PRESETS, INITIAL_CATEGORIES } from '../data/mockData';
import { formatINR } from '../utils/formatters';

export const StoreSetupWizard: React.FC = () => {
  const { createStore, applyPreset, addProduct, setActiveTab, theme } = useStore();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [storeData, setStoreData] = useState({
    name: 'Bharat Artisans Emporium',
    slug: 'bharat-artisans',
    tagline: 'Authentic Indian Handcrafts & Spices',
    category: 'ethnic-wear',
    ownerName: 'Rakesh Sharma',
    email: 'rakesh.sharma@store.in',
    mobile: '9812345678',
    city: 'Jaipur',
    state: 'Rajasthan',
    themePreset: 'royal-saffron',
    firstProductTitle: 'Hand-block Printed Pure Cotton Dohar',
    firstProductPrice: 1299,
    firstProductMrp: 2499,
    firstProductStock: 40,
    firstProductImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    paymentMode: 'razorpay_upi',
    codEnabled: true,
    shippingPartner: 'delhivery' as 'delhivery' | 'shiprocket',
  });

  const [isLaunched, setIsLaunched] = useState(false);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleLaunch();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleLaunch = () => {
    // 1. Create the store
    const newStore = createStore({
      name: storeData.name,
      ownerName: storeData.ownerName,
      email: storeData.email,
      mobile: `+91 ${storeData.mobile}`,
      city: storeData.city,
      state: storeData.state,
      shippingPartner: storeData.shippingPartner,
      codEnabled: storeData.codEnabled,
    });

    // 2. Apply chosen theme preset
    applyPreset(storeData.themePreset);

    // 3. Add first product
    addProduct({
      storeId: newStore.id,
      storeName: newStore.name,
      title: storeData.firstProductTitle,
      titleHi: storeData.firstProductTitle,
      description: `Authentic premium product from ${storeData.name}, crafted in ${storeData.city}, ${storeData.state}.`,
      descriptionHi: `${storeData.name} से प्रामाणिक उत्पाद।`,
      category: storeData.category,
      categoryHi: 'उत्सव एवं परिधान',
      brand: storeData.name,
      price: storeData.firstProductPrice,
      mrp: storeData.firstProductMrp,
      discountPercent: Math.round(((storeData.firstProductMrp - storeData.firstProductPrice) / storeData.firstProductMrp) * 100),
      stock: storeData.firstProductStock,
      status: 'active',
      sku: `${storeData.slug.substring(0, 3).toUpperCase()}-01`,
      gstRate: 12,
      hsnCode: '5208',
      images: [storeData.firstProductImage],
      rating: 5.0,
      reviewCount: 1,
      highlights: ['Authentic regional craftsmanship', 'Includes GST invoice', '7-Day return policy'],
      highlightsHi: ['प्रामाणिक क्षेत्रीय शिल्प', 'जीएसटी बिल सहित', '7-दिवसीय वापसी नीति'],
      specs: { 'Origin': `${storeData.city}, ${storeData.state}`, 'Brand': storeData.name },
      returnPolicyDays: 7,
      codAvailable: storeData.codEnabled,
    });

    // Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }

    setIsLaunched(true);
  };

  const stepsList = [
    { num: 1, title: 'Store Identity', desc: 'Name & slug' },
    { num: 2, title: 'Category & Location', desc: 'Business hub' },
    { num: 3, title: 'Brand Theme', desc: 'Color & fonts' },
    { num: 4, title: 'First Product', desc: 'Catalog setup' },
    { num: 5, title: 'Payments & COD', desc: 'Razorpay UPI' },
    { num: 6, title: 'Launch Store', desc: 'Go live in 15m' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Wizard Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Indian Seller Onboarding — 15-Minute Zero Coding Setup</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Launch Your Custom E-Commerce Store
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
          Bina kisi coding ke apna premium online store banayein, theme chunein, pehla product dalein aur Razorpay se payments lein.
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-6 gap-2 mb-8">
        {stepsList.map((st) => {
          const isDone = currentStep > st.num || isLaunched;
          const isCurrent = currentStep === st.num && !isLaunched;
          return (
            <div key={st.num} className="text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1 ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? '✓' : st.num}
              </div>
              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate hidden sm:block">
                {st.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-md">
        {isLaunched ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Rocket className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Badhai Ho! Your Store "{storeData.name}" is Now Live! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Aapka store live ho chuka hai. Customers ab UPI, Cards aur COD ke zariye orders de sakte hain.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl max-w-sm mx-auto font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold border border-slate-200 dark:border-slate-700">
              https://luxecart.in/store/{storeData.slug}
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveTab('storefront')}
                style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
                className="px-6 py-2.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-2"
              >
                <span>Visit Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('seller-admin')}
                className="px-6 py-2.5 text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg shadow-sm"
              >
                Open Seller Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step 1: Store Identity */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 1: Store Name & Web Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Store / Business Name *</label>
                    <input
                      type="text"
                      value={storeData.name}
                      onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Store Subdomain / Slug *</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={storeData.slug}
                        onChange={(e) => setStoreData({ ...storeData, slug: e.target.value })}
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg font-mono"
                      />
                      <span className="px-3 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg text-slate-500 flex items-center">
                        .luxecart.in
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Store Tagline / Bio</label>
                    <input
                      type="text"
                      value={storeData.tagline}
                      onChange={(e) => setStoreData({ ...storeData, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Category & Location */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 2: Business Category & Indian Hub</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Product Category</label>
                    <select
                      value={storeData.category}
                      onChange={(e) => setStoreData({ ...storeData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
                    >
                      {INITIAL_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.nameHi})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={storeData.ownerName}
                      onChange={(e) => setStoreData({ ...storeData, ownerName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      value={storeData.city}
                      onChange={(e) => setStoreData({ ...storeData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      value={storeData.state}
                      onChange={(e) => setStoreData({ ...storeData, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Brand Theme Preset */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 3: Choose Visual Theme Palette</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THEME_PRESETS.map((pst) => (
                    <button
                      key={pst.id}
                      type="button"
                      onClick={() => setStoreData({ ...storeData, themePreset: pst.id })}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        storeData.themePreset === pst.id
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{pst.name}</span>
                        {storeData.themePreset === pst.id && <span className="text-indigo-600 text-xs font-bold">✓</span>}
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div style={{ backgroundColor: pst.primaryColor }} className="w-5 h-5 rounded-full border border-black/10" />
                        <div style={{ backgroundColor: pst.secondaryColor }} className="w-5 h-5 rounded-full border border-black/10" />
                        <div style={{ backgroundColor: pst.accentColor }} className="w-5 h-5 rounded-full border border-black/10" />
                        <span className="text-[10px] text-slate-400 font-mono ml-auto">{pst.fontFamily}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{pst.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: First Product */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 4: List Your First Product</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Title *</label>
                    <input
                      type="text"
                      value={storeData.firstProductTitle}
                      onChange={(e) => setStoreData({ ...storeData, firstProductTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={storeData.firstProductPrice}
                      onChange={(e) => setStoreData({ ...storeData, firstProductPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">MRP Strikethrough (₹) *</label>
                    <input
                      type="number"
                      value={storeData.firstProductMrp}
                      onChange={(e) => setStoreData({ ...storeData, firstProductMrp: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Stock Count *</label>
                    <input
                      type="number"
                      value={storeData.firstProductStock}
                      onChange={(e) => setStoreData({ ...storeData, firstProductStock: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={storeData.firstProductImage}
                      onChange={(e) => setStoreData({ ...storeData, firstProductImage: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Payments & COD */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 5: Setup Payment Options</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Razorpay Standard Payment Gateway</p>
                      <p className="text-[11px] text-slate-500">Supports UPI (GPay/PhonePe), RuPay Cards, NetBanking</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      Enabled (Test Sandbox)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-slate-500">Allow customers to pay cash at their doorstep</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={storeData.codEnabled}
                      onChange={(e) => setStoreData({ ...storeData, codEnabled: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Shipping Partner
                    </label>
                    <select
                      value={storeData.shippingPartner}
                      onChange={(e) => setStoreData({ ...storeData, shippingPartner: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
                    >
                      <option value="delhivery">Delhivery Surface Express</option>
                      <option value="shiprocket">Shiprocket Multi-Carrier</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Final Review before Go Live */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 6: Ready to Go Live!</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Store Name:</span>
                    <span className="font-bold">{storeData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subdomain:</span>
                    <span className="font-mono">{storeData.slug}.luxecart.in</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category & Location:</span>
                    <span>{storeData.category} ({storeData.city}, {storeData.state})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">First Product:</span>
                    <span>{storeData.firstProductTitle} ({formatINR(storeData.firstProductPrice)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payments:</span>
                    <span className="text-emerald-600 font-semibold">Razorpay UPI & {storeData.codEnabled ? 'COD Active' : 'Online Only'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={handlePrev}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg ${
                  currentStep === 1 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                style={{ backgroundColor: 'var(--theme-secondary)', color: '#FFFFFF' }}
                className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold rounded-lg shadow-md hover:opacity-95"
              >
                <span>{currentStep === 6 ? '🚀 Launch Store Now' : 'Continue'}</span>
                {currentStep < 6 && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
