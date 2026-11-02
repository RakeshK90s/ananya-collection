import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  Percent,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR, useTranslation } from '../utils/formatters';
import { AVAILABLE_COUPONS } from '../data/mockData';

export const CartDrawer: React.FC = () => {
  const {
    theme,
    language,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartDeliveryCharge,
    cartGstTotal,
    cartGrandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeDeliveryThreshold,
    setActiveTab,
    currentUser,
    setIsLoginModalOpen,
    setAuthModalMode,
    setAuthGateMessage,
  } = useStore();

  const t = useTranslation(language);
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
    setTimeout(() => setCouponFeedback(null), 3500);
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    if (!currentUser.isLoggedIn) {
      setAuthModalMode('signup');
      setAuthGateMessage('Please register or sign in to proceed with your order.');
      setIsLoginModalOpen(true);
      return;
    }
    setActiveTab('checkout');
  };

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          style={{
            backgroundColor: 'var(--theme-card)',
            color: 'var(--theme-text)',
          }}
          className="w-screen max-w-md shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-all"
        >
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.cart} ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Milestone Progress Bar */}
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs">
            {amountNeededForFreeDelivery > 0 ? (
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                Add <span className="font-bold text-indigo-600">{formatINR(amountNeededForFreeDelivery)}</span> more to unlock <span className="text-emerald-600 font-bold">FREE Delivery!</span>
              </p>
            ) : (
              <p className="text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Yay! You unlocked FREE Expedited Delivery across India!
              </p>
            )}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
              <div
                style={{ width: `${freeDeliveryProgress}%`, backgroundColor: amountNeededForFreeDelivery === 0 ? '#10B981' : 'var(--theme-primary)' }}
                className="h-full transition-all duration-300 rounded-full"
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {t.emptyCartMessage}
                </h3>
                <p className="text-xs max-w-xs leading-relaxed">
                  Explore handloom sarees, audio gear, pure shilajit and kitchenware tailored for India.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActiveTab('storefront');
                  }}
                  style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
                  className="px-5 py-2 text-xs font-bold rounded-lg shadow-sm mt-2"
                >
                  {t.startShopping}
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex gap-3.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-20 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
                          {language === 'hi' ? item.product.titleHi : item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {Object.entries(item.selectedVariant)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' · ')}
                        </p>
                      )}

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs font-bold tabular-nums">
                          {formatINR(item.product.price)}
                        </span>
                        {item.product.mrp > item.product.price && (
                          <span className="text-[10px] text-slate-400 line-through tabular-nums">
                            {formatINR(item.product.mrp)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/80 space-y-3.5">
              
              {/* Coupon Applicator */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{appliedCoupon.code} applied! (-{formatINR(cartDiscount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-500 hover:text-rose-700 font-bold text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Promo Code (e.g. FESTIVE500)"
                        className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg uppercase placeholder-normal focus:outline-none"
                      />
                      <button
                        onClick={() => handleApplyCoupon(couponInput)}
                        className="px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-90"
                      >
                        {t.apply}
                      </button>
                    </div>

                    {/* Quick 1-click coupon chips */}
                    <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar">
                      {AVAILABLE_COUPONS.map((cpn) => (
                        <button
                          key={cpn.code}
                          onClick={() => handleApplyCoupon(cpn.code)}
                          className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold whitespace-nowrap hover:bg-amber-100"
                        >
                          {cpn.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {couponFeedback && (
                  <p className={`text-[11px] mt-1 font-medium ${couponFeedback.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Bill Details Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatINR(cartSubtotal)}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>{t.discount}</span>
                    <span className="tabular-nums">- {formatINR(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t.deliveryCharges}</span>
                  <span className="font-semibold tabular-nums">
                    {cartDeliveryCharge === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase">{t.free}</span>
                    ) : (
                      formatINR(cartDeliveryCharge)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white">
                  <span>{t.totalAmount}</span>
                  <span className="text-base tabular-nums">{formatINR(cartGrandTotal)}</span>
                </div>
                <p className="text-[10px] text-slate-400 text-right">
                  {t.gstInclusive} (Includes GST)
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                style={{
                  backgroundColor: 'var(--theme-secondary)',
                  color: '#FFFFFF',
                  borderRadius: `${Math.max(6, theme.borderRadius - 4)}px`,
                }}
                className="w-full py-3 text-xs font-bold shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>{t.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
