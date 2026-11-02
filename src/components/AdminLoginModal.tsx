import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  UserCheck,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginUser, setActiveTab } = useStore();
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (adminId.trim() === 'acadmin' && adminPassword === 'acadmin123') {
        loginUser({
          id: 'usr-admin-1',
          name: 'Ananya Verma (Store Owner)',
          email: 'admin@ananyacollection.com',
          mobile: '9667417843',
          city: 'Rama Vihar, Rohini, New Delhi',
          state: 'Delhi',
          pincode: '110081',
          role: 'super_admin',
          isLoggedIn: true,
        });
        setActiveTab('admin');
        onClose();
      } else {
        setErrorMsg('Invalid Admin ID or Password. Access denied.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative overflow-hidden">
        
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2.5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-stone-950 border-2 border-[#B8860B] overflow-hidden flex items-center justify-center mx-auto shadow-lg shadow-amber-950/20">
            <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1">
              <KeyRound className="w-3 h-3 text-[#B8860B]" />
              Authorized Personnel Only
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-amber-100 tracking-tight">
              Boutique Admin Portal
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Ananya Collection · Central Store Control
            </p>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-800 dark:text-rose-200 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Admin ID
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => {
                  setAdminId(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter Admin ID"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-sans bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#B8860B]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm font-sans bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#B8860B]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#B8860B] hover:bg-[#996515] active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Unified Admin Panel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-4 text-[11px] text-stone-400 text-center">
          Customer orders, inventory sync, and GST invoicing are protected by 256-bit encryption.
        </p>

      </div>
    </div>
  );
};
