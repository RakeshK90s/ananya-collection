import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  CreditCard,
  QrCode,
  Smartphone,
  Landmark,
  Banknote,
  ArrowRight,
  ChevronLeft,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR, useTranslation } from '../utils/formatters';
import { CustomerAddress, PaymentMethod } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    theme,
    language,
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryCharge,
    cartGrandTotal,
    appliedCoupon,
    placeOrder,
    setActiveTab,
    currentUser,
    setIsLoginModalOpen,
    setAuthModalMode,
    setAuthGateMessage,
  } = useStore();

  const t = useTranslation(language);

  // Auth gate
  useEffect(() => {
    if (!currentUser.isLoggedIn) {
      setAuthModalMode('signup');
      setAuthGateMessage('Please register or sign in to complete your checkout.');
      setIsLoginModalOpen(true);
    }
  }, [currentUser.isLoggedIn]);

  // 3-Step Accordion State: 1 = Address, 2 = Payment, 3 = Review
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Address State
  const [address, setAddress] = useState<CustomerAddress>({
    fullName: currentUser.isLoggedIn ? currentUser.name : '',
    mobile: currentUser.isLoggedIn ? currentUser.mobile : '',
    pincode: currentUser.isLoggedIn && currentUser.pincode ? currentUser.pincode : '',
    addressLine1: currentUser.savedAddresses?.[0]?.addressLine1 || '',
    addressLine2: '',
    city: currentUser.city || 'New Delhi',
    state: currentUser.state || 'Delhi',
    landmark: '',
    type: 'home',
  });

  useEffect(() => {
    if (currentUser.isLoggedIn) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name,
        mobile: prev.mobile || currentUser.mobile,
        pincode: prev.pincode || currentUser.pincode || '',
        city: prev.city || currentUser.city || 'New Delhi',
        state: prev.state || currentUser.state || 'Delhi',
        addressLine1: prev.addressLine1 || currentUser.savedAddresses?.[0]?.addressLine1 || '',
      }));
    }
  }, [currentUser]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiOption, setUpiOption] = useState<'qr' | 'id'>('qr');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  const indianStates = [
    'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh',
    'Gujarat', 'Rajasthan', 'Telangana', 'West Bengal', 'Kerala',
    'Punjab', 'Haryana', 'Madhya Pradesh', 'Bihar', 'Andhra Pradesh'
  ];

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.mobile || !address.pincode || !address.addressLine1) {
      alert('Please fill in all required address fields.');
      return;
    }
    setActiveStep(2);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const order = placeOrder(
        address,
        paymentMethod,
        paymentMethod === 'upi' ? upiIdInput : undefined
      );

      setIsProcessing(false);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [theme.primaryColor, theme.secondaryColor, '#10B981', '#F59E0B'],
        });
      } catch {
        // ignore
      }

      setActiveTab('order-success');
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-3">{t.emptyCartMessage}</h2>
        <button
          onClick={() => setActiveTab('storefront')}
          style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
          className="px-6 py-2.5 rounded-lg text-xs font-bold"
        >
          {t.startShopping}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Checkout Breadcrumb Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('storefront')}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <span className="text-slate-300">|</span>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            3-Step Express Checkout
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">256-Bit Bank Grade SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Column: 3 Steps (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* STEP 1: Delivery Address */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <div
              onClick={() => setActiveStep(1)}
              className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer bg-slate-50/50 dark:bg-slate-800/80"
            >
              <div className="flex items-center gap-3">
                <span
                  style={{
                    backgroundColor: activeStep === 1 ? 'var(--theme-primary)' : '#10B981',
                    color: '#FFFFFF',
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                >
                  {activeStep > 1 ? '✓' : '1'}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.step1Address}</h3>
                  {activeStep > 1 && (
                    <p className="text-[11px] text-slate-500 truncate max-w-sm">
                      {address.fullName}, {address.city} - {address.pincode} ({address.mobile})
                    </p>
                  )}
                </div>
              </div>
              {activeStep > 1 && (
                <span className="text-xs text-indigo-600 font-semibold hover:underline">Change</span>
              )}
            </div>

            {activeStep === 1 && (
              <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.mobileNumber} *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-xs bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={address.mobile}
                        onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.pinCode} * (6 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.city} *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.addressLine} *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.addressLine1}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.state} *
                    </label>
                    <select
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.landmark}
                    </label>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
                    className="px-6 py-2.5 text-xs font-bold rounded-lg shadow-sm hover:opacity-95"
                  >
                    Deliver to this Address &rarr;
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* STEP 2: Payment Method (Razorpay UPI, Cards, NetBanking, COD) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <div
              onClick={() => activeStep > 2 && setActiveStep(2)}
              className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer bg-slate-50/50 dark:bg-slate-800/80"
            >
              <div className="flex items-center gap-3">
                <span
                  style={{
                    backgroundColor: activeStep === 2 ? 'var(--theme-primary)' : activeStep > 2 ? '#10B981' : '#94A3B8',
                    color: '#FFFFFF',
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                >
                  {activeStep > 2 ? '✓' : '2'}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.step2Payment}</h3>
                  {activeStep > 2 && (
                    <p className="text-[11px] text-slate-500 uppercase">
                      {paymentMethod === 'upi' ? 'Instant UPI' : paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'netbanking' ? 'Net Banking' : 'Cash on Delivery'}
                    </p>
                  )}
                </div>
              </div>
              {activeStep > 2 && (
                <span className="text-xs text-indigo-600 font-semibold hover:underline">Change</span>
              )}
            </div>

            {activeStep === 2 && (
              <div className="p-6 space-y-4">
                
                {/* Method Options Radio Group */}
                <div className="space-y-3">
                  
                  {/* Option 1: Instant UPI */}
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-slate-700/40 ring-1 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {t.upiPayment}
                            </span>
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                              FASTEST
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Google Pay, PhonePe, Paytm, CRED & Any BHIM UPI App
                          </p>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700 space-y-3">
                        <div className="flex items-center gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => setUpiOption('qr')}
                            className={`px-3 py-1.5 rounded-lg border font-semibold ${
                              upiOption === 'qr'
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200'
                            }`}
                          >
                            Scan Instant QR Code
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiOption('id')}
                            className={`px-3 py-1.5 rounded-lg border font-semibold ${
                              upiOption === 'id'
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200'
                            }`}
                          >
                            Enter UPI ID / VPA
                          </button>
                        </div>

                        {upiOption === 'qr' ? (
                          <div className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 max-w-sm">
                            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 flex items-center justify-center border border-slate-300 dark:border-slate-600">
                              <QrCode className="w-16 h-16 text-slate-800 dark:text-slate-200" />
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                              <p className="font-bold text-slate-900 dark:text-white">Scan with Any UPI App</p>
                              <p className="text-[11px]">GPay, PhonePe, Paytm, BHIM</p>
                              <p className="text-[10px] text-emerald-600 font-medium">Secured by Razorpay Gateway</p>
                            </div>
                          </div>
                        ) : (
                          <div className="max-w-sm">
                            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                              Your Virtual Payment Address (UPI ID)
                            </label>
                            <input
                              type="text"
                              value={upiIdInput}
                              onChange={(e) => setUpiIdInput(e.target.value)}
                              placeholder="e.g. mobile@upi or username@okaxis"
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </label>

                  {/* Option 2: Credit / Debit Cards */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-slate-700/40 ring-1 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {t.cardsPayment}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <span>RuPay</span> · <span>Visa</span> · <span>Mastercard</span>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700 space-y-3 max-w-sm">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Valid Thru</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Option 3: Net Banking */}
                  <label
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-slate-700/40 ring-1 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'netbanking'}
                        onChange={() => setPaymentMethod('netbanking')}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {t.netBankingPayment}
                        </span>
                      </div>
                    </div>

                    {paymentMethod === 'netbanking' && (
                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700 space-y-2 max-w-sm">
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">Select Bank</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="State Bank of India">State Bank of India (SBI)</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          <option value="Punjab National Bank">Punjab National Bank</option>
                        </select>
                      </div>
                    )}
                  </label>

                  {/* Option 4: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-slate-700/40 ring-1 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {t.codPayment}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">Pay in Cash or UPI on Delivery</span>
                    </div>
                  </label>

                </div>

                <div className="flex justify-between items-center pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    &larr; Back to Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
                    className="px-6 py-2.5 text-xs font-bold rounded-lg shadow-sm hover:opacity-95"
                  >
                    Continue to Order Review &rarr;
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* STEP 3: Order Review & Final Placement */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/80">
              <span
                style={{
                  backgroundColor: activeStep === 3 ? 'var(--theme-primary)' : '#94A3B8',
                  color: '#FFFFFF',
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              >
                3
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.step3Review}</h3>
            </div>

            {activeStep === 3 && (
              <div className="p-6 space-y-4">
                <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-60 overflow-y-auto pr-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.product.images[0]} alt={item.product.title} className="w-10 h-12 object-cover rounded-md" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{language === 'hi' ? item.product.titleHi : item.product.title}</p>
                          <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold tabular-nums">{formatINR(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs space-y-1.5 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Delivering to:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{address.fullName}, {address.city} ({address.pincode})</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Payment via:</span>
                    <span className="font-semibold text-slate-900 dark:text-white uppercase">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Courier Partner:</span>
                    <span className="font-semibold text-indigo-600">Delhivery Surface Express (Trackable)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    &larr; Back to Payment
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    style={{ backgroundColor: 'var(--theme-secondary)', color: '#FFFFFF' }}
                    className="px-8 py-3 text-xs font-bold rounded-xl shadow-lg hover:opacity-95 active:scale-98 transition-all flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Verifying Payment...</span>
                    ) : (
                      <>
                        <span>{t.placeOrder} ({formatINR(cartGrandTotal)})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary Card (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              {t.orderSummary} ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{formatINR(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{t.discount} {appliedCoupon && `(${appliedCoupon.code})`}</span>
                  <span className="tabular-nums">- {formatINR(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.deliveryCharges}</span>
                <span className="font-semibold tabular-nums">
                  {cartDeliveryCharge === 0 ? <span className="text-emerald-600 font-bold uppercase">{t.free}</span> : formatINR(cartDeliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-white">
                <span>{t.totalAmount}</span>
                <span className="tabular-nums">{formatINR(cartGrandTotal)}</span>
              </div>
              <p className="text-[10px] text-slate-400 text-right">
                {t.gstInclusive}
              </p>
            </div>

            {/* Trust badge */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Secure Checkout Guarantee</span>
              </div>
              <p>Your payment information is tokenized and never stored in plain text.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
