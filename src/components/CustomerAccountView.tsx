import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  ShieldCheck,
  Store,
  LogOut,
  ChevronRight,
  ExternalLink,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR, useTranslation, formatDateIN } from '../utils/formatters';
import { CustomerAddress } from '../types';

export const CustomerAccountView: React.FC = () => {
  const {
    currentUser,
    logoutUser,
    customerOrders,
    setTrackingOrderId,
    setActiveTab,
    wishlist,
    products,
    addToCart,
    saveUserAddress,
    deleteUserAddress,
    switchDemoRole,
    language,
    theme,
  } = useStore();

  const t = useTranslation(language);
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<CustomerAddress>({
    fullName: currentUser.name,
    mobile: currentUser.mobile,
    pincode: '110001',
    addressLine1: '',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'home',
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.addressLine1 || !newAddress.pincode) return;
    saveUserAddress(newAddress);
    setShowAddressModal(false);
    setNewAddress({
      fullName: currentUser.name,
      mobile: currentUser.mobile,
      pincode: '110001',
      addressLine1: '',
      city: 'New Delhi',
      state: 'Delhi',
      type: 'home',
    });
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Account Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            style={{ backgroundColor: 'var(--theme-primary)' }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
          >
            {currentUser.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                  currentUser.role === 'super_admin'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    : currentUser.role === 'seller'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {currentUser.role === 'super_admin'
                  ? '👑 Platform Super Admin'
                  : currentUser.role === 'seller'
                  ? `🏪 Seller (${currentUser.storeName || 'Store Owner'})`
                  : '👤 Verified Buyer'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
              <span>+91 {currentUser.mobile} · {currentUser.email}</span>
              {currentUser.buyerId && (
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-600">
                  ID: {currentUser.buyerId}
                </span>
              )}
              {currentUser.loyaltyTier && (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                  ★ {currentUser.loyaltyTier} Tier
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentUser.role === 'customer' ? (
            <button
              onClick={() => setActiveTab('store-wizard')}
              style={{ backgroundColor: 'var(--theme-secondary)', color: '#FFFFFF' }}
              className="px-4 py-2 text-xs font-bold rounded-lg shadow-sm hover:opacity-95 flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Become a Seller (15-Min Setup)</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab(currentUser.role === 'super_admin' ? 'super-admin' : 'seller-admin')}
              style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
              className="px-4 py-2 text-xs font-bold rounded-lg shadow-sm hover:opacity-95 flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Go to {currentUser.role === 'super_admin' ? 'Super Admin Console' : 'Seller Dashboard'}</span>
            </button>
          )}

          <button
            onClick={logoutUser}
            className="px-3.5 py-2 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900 hover:bg-rose-100 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-2 mb-6 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders & Invoices ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('addresses')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'addresses'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({currentUser.savedAddresses?.length || 1})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wishlist')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'wishlist'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Wishlist Items ({wishlist.length})</span>
        </button>
      </div>

      {/* TAB 1: MY ORDERS & INVOICES */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your order history will appear here once you purchase authentic silk sarees, electronics or ayurvedic elixirs.
              </p>
              <button
                onClick={() => setActiveTab('storefront')}
                style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
                className="px-6 py-2.5 text-xs font-bold rounded-lg shadow-sm"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            customerOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      Order #{ord.id}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{formatDateIN(ord.date)}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Seller: {ord.storeName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      ● {ord.orderStatus}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatINR(ord.total)}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-14 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {language === 'hi' ? item.product.titleHi : item.product.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.quantity} · {formatINR(item.product.price)} each
                        </p>
                        {item.selectedVariant && (
                          <p className="text-[10px] text-slate-400">
                            {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery & Tracking Row */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      Shipped via {ord.courierPartner} · AWB: <span className="font-mono font-bold">{ord.trackingNumber}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Delivering to: {ord.customer.addressLine1}, {ord.customer.city} ({ord.customer.pincode})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setTrackingOrderId(ord.id);
                        setActiveTab('order-success');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700"
                    >
                      Track Live & Invoice
                    </button>
                    <button
                      onClick={() => alert(`Return requested for Order #${ord.id}. Our courier pickup will arrive within 48 hours.`)}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-xs hover:bg-slate-100"
                    >
                      Return
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: SAVED ADDRESSES */}
      {activeSubTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delivery Addresses</h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-xs hover:bg-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(currentUser.savedAddresses || []).map((addr, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase rounded">
                    {addr.type}
                  </span>
                  <button
                    onClick={() => deleteUserAddress(idx)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{addr.fullName}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{addr.addressLine1}</p>
                {addr.landmark && <p className="text-xs text-slate-400">Landmark: {addr.landmark}</p>}
                <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-mono">Mobile: +91 {addr.mobile}</p>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Delivery Address</h3>
                <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">10-Digit Mobile</label>
                    <input
                      type="tel"
                      required
                      value={newAddress.mobile}
                      onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Address (House No, Street, Colony)</label>
                    <input
                      type="text"
                      required
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 border rounded-lg text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {activeSubTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Your Saved Wishlist</h3>
            <span className="text-xs text-slate-500">{wishlist.length} saved products</span>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm">No Wishlisted Items</h4>
              <p className="text-xs text-slate-400">Tap the heart icon on any product card to save it for later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-3.5 flex items-center gap-3 shadow-xs"
                >
                  <img src={p.images[0]} alt={p.title} className="w-16 h-20 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{p.title}</p>
                    <p className="text-xs font-bold mt-1 text-slate-900 dark:text-white">{formatINR(p.price)}</p>
                    <button
                      onClick={() => addToCart(p, 1)}
                      style={{ backgroundColor: 'var(--theme-secondary)', color: '#FFFFFF' }}
                      className="mt-2 w-full py-1 text-[11px] font-bold rounded-md"
                    >
                      + Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
