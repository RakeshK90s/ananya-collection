import React from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Phone,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTranslation } from '../utils/formatters';

export const Footer: React.FC = () => {
  const { theme, language, setActiveTab } = useStore();
  const t = useTranslation(language);

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-800/80">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3.5">
              {theme.logoUrl ? (
                <div className="relative w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-500 shadow-md shrink-0 ring-1 ring-amber-400/50">
                  <img
                    src={theme.logoUrl}
                    alt={theme.storeName}
                    className="w-full h-full object-cover rounded-full bg-black shadow-inner"
                  />
                </div>
              ) : (
                <div
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                >
                  {theme.logoText.slice(0, 2)}
                </div>
              )}
              <div>
                <span className="text-2xl font-serif font-medium tracking-wide text-white block">
                  {theme.storeName}
                </span>
                <span className="text-[11px] font-medium tracking-widest text-amber-400/90 uppercase block mt-0.5">
                  Rohini, Delhi · Designer Couture & Bridal Boutique
                </span>
              </div>
            </div>
            
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              {language === 'hi'
                ? 'अनन्य कलेक्शन (रोहिणी, दिल्ली) — विशेष हस्तशिल्प ब्राइडल लहंगे, शुद्ध कांजीवरम व बनारसी सिल्क साड़ियाँ, डिजाइनर सूट एवं भारतीय उत्सव परिधान।'
                : 'Ananya Collection (Rohini, Delhi) — Curating premium designer ethnic wear, bridal couture, pure handloom silks, and bespoke festive fashion with doorstep delivery across India.'}
            </p>

            <div className="space-y-2 text-stone-400 text-xs pt-1">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
                <span>Sector 7 / 8, Rohini, New Delhi, Delhi 110085</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
                <span>Boutique Hours: 11:00 AM – 8:30 PM (Mon – Sun)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
                <span>Client Concierge: +91 98711 22334 (WhatsApp & Call)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Certified Handlooms
              </span>
              <span>·</span>
              <span>GST Registered</span>
              <span>·</span>
              <span>19,000+ PIN Codes</span>
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-100">
              {language === 'hi' ? 'कलेक्शन एवं श्रेणियां' : 'Couture Collections'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Pure Kanjeevaram & Banarasi Sarees
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Royal Wedding & Bridal Lehengas
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Lucknowi Chikankari & Anarkali Suits
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Designer Kurta Sets & Silk Co-ords
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Handcrafted Potlis & Pure Zari Dupattas
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Festive Specials & Deals of the Day
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-100">
              {language === 'hi' ? 'ग्राहक सेवा व नीतियां' : 'Customer Care & Policies'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setActiveTab('order-success')} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-2 text-left">
                  <Truck className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
                  <span>Track Live Order & Shipment</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('my-account')} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-2 text-left">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
                  <span>7-Day Easy Return & Exchange</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Custom Stitching & Alteration Guide
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Fabric Care & Silk Preservation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Shipping & Delivery Timeline
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('storefront')} className="hover:text-amber-300 transition-colors text-left cursor-pointer">
                  Privacy Policy & Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Logistics Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-100">
              Payment & Logistics
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <p className="leading-relaxed">
                Powered by <strong className="text-stone-200 font-semibold">Razorpay Standard Gateway</strong> with UPI (GPay, PhonePe, Paytm, BHIM) and Cash on Delivery.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[11px] text-stone-300 font-medium">RuPay</span>
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[11px] text-stone-300 font-medium">UPI</span>
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[11px] text-stone-300 font-medium">Visa</span>
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[11px] text-stone-300 font-medium">Mastercard</span>
                <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-[11px] text-stone-300 font-medium">NetBanking</span>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-[11px] font-semibold">COD Available</span>
              </div>
              <p className="text-[11px] text-stone-500 pt-1 leading-relaxed">
                Dispatches handled via Delhivery Surface & Shiprocket Air Express across 19,000+ PIN codes.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © 2026 {theme.storeName} (Rohini, Delhi). All rights reserved. Premium Indian Designer Boutique.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-stone-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Couture
            </span>
            <span>·</span>
            <span>IT Act & DPDP Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
