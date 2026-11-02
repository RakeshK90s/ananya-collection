import React, { useState } from 'react';
import {
  X,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DEMO_USERS } from '../data/mockData';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginUser,
    authModalMode,
    authGateMessage,
  } = useStore();

  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [mobileOrEmail, setMobileOrEmail] = useState('9871122334');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');

  if (!isLoginModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      id: 'usr-customer-1',
      name: 'Pooja Agarwal',
      email: mobileOrEmail.includes('@') ? mobileOrEmail : 'pooja.agarwal@gmail.com',
      mobile: !mobileOrEmail.includes('@') ? mobileOrEmail : '9871122334',
      city: 'Rohini, New Delhi',
      state: 'Delhi',
      pincode: '110085',
      role: 'customer',
      isLoggedIn: true,
      savedAddresses: [
        {
          fullName: 'Pooja Agarwal',
          mobile: '9871122334',
          pincode: '110085',
          addressLine1: 'B-4, Sector 8, Rohini',
          city: 'New Delhi',
          state: 'Delhi',
          type: 'home',
        },
      ],
    });
    setIsLoginModalOpen(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !regMobile) {
      alert('Please enter your full name and mobile number.');
      return;
    }

    loginUser({
      id: `usr-${Date.now()}`,
      name: fullName,
      mobile: regMobile,
      email: regEmail || `${regMobile}@ananyaboutique.in`,
      role: 'customer',
      city: city || 'New Delhi',
      state: 'Delhi',
      pincode: pincode || '110001',
      isLoggedIn: true,
      savedAddresses: [
        {
          fullName,
          mobile: regMobile,
          pincode: pincode || '110001',
          addressLine1: `${city}, Delhi NCR`,
          city: city || 'New Delhi',
          state: 'Delhi',
          type: 'home',
        },
      ],
    });
    setIsLoginModalOpen(false);
  };

  const handleQuickCustomerLogin = () => {
    loginUser({
      id: 'usr-customer-1',
      name: 'Pooja Agarwal',
      email: 'pooja.agarwal@gmail.com',
      mobile: '9871122334',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      role: 'customer',
      isLoggedIn: true,
    });
    setIsLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#B8860B] overflow-hidden bg-white mx-auto shadow-md p-0.5">
            <img src="/logo.jpg" alt="Ananya Collection" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-amber-100 tracking-tight">
              Ananya Collection
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Rohini, Delhi · Designer Ethnic & Bridal Boutique
            </p>
          </div>
        </div>

        {/* Auth Gate Notification if any */}
        {authModalMode === 'role_gate' && authGateMessage && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            {authGateMessage}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-stone-100 dark:bg-stone-800 p-1 mb-6">
          <button
            onClick={() => setAuthTab('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authTab === 'signin'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-amber-200 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              authTab === 'register'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-amber-200 shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
            }`}
          >
            New Customer
          </button>
        </div>

        {/* TAB 1: SIGN IN */}
        {authTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Mobile Number or Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={mobileOrEmail}
                  onChange={(e) => setMobileOrEmail(e.target.value)}
                  placeholder="e.g. 9871122334 or name@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#B8860B]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#B8860B]/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#B8860B] hover:bg-[#996515] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In to Boutique</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER */}
        {authTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#B8860B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                  placeholder="10 Digits"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#B8860B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="priya@gmail.com"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#B8860B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New Delhi"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="110001"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#B8860B] hover:bg-[#996515] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-3"
            >
              <span>Create Customer Account</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Customer Button */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
          <button
            type="button"
            onClick={handleQuickCustomerLogin}
            className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <User className="w-3.5 h-3.5 text-stone-500" />
            <span>1-Click Customer Demo Profile (Pooja Agarwal)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
