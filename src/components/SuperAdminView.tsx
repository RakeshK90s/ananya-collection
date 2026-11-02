import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  ArrowRight,
  ExternalLink,
  Lock,
  Download,
  Plus,
  Bolt,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart3,
  Sliders,
  FileText,
  Clock,
  Layers,
  Store,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR, useTranslation, formatDateIN } from '../utils/formatters';

export const SuperAdminView: React.FC = () => {
  const {
    stores,
    currentStore,
    setCurrentStoreId,
    superAdminStats,
    updateSuperAdminStats,
    setActiveTab,
    language,
    currentUser,
    switchDemoRole,
    setIsLoginModalOpen,
  } = useStore();

  const t = useTranslation(language);

  // Authentication Gate: Only super_admin role can view
  const isSuperAdmin = currentUser.isLoggedIn && currentUser.role === 'super_admin';

  // Sub Tab Navigation
  const [activeTabSub, setActiveTabSub] = useState<'overview' | 'sellers' | 'commissions' | 'kyc' | 'settings'>('overview');
  const [globalRate, setGlobalRate] = useState(superAdminStats.defaultCommissionRate || 8.5);
  const [rateUpdated, setRateUpdated] = useState(false);
  const [searchSellerQuery, setSearchSellerQuery] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  // Pending KYC Queue Mock Cases (From Zip)
  const [pendingKyc, setPendingKyc] = useState([
    {
      id: 'KYC-8921',
      storeName: 'Royal Jaipur Silks & Crafts',
      ownerName: 'Praveen Shekhawat',
      gstin: '08AAACR4921K1ZO',
      city: 'Jaipur, Rajasthan',
      category: 'Ethnic Wear & Handlooms',
      appliedDate: '24 Oct 2026',
      status: 'pending',
    },
    {
      id: 'KYC-8922',
      storeName: 'Malabar Spice & Essential Oils',
      ownerName: 'Sunil Panicker',
      gstin: '32AADCS1290P1ZN',
      city: 'Kochi, Kerala',
      category: 'Gourmet & Wellness',
      appliedDate: '23 Oct 2026',
      status: 'pending',
    },
    {
      id: 'KYC-8923',
      storeName: 'Bengaluru Precision Tech',
      ownerName: 'Nandita Rao',
      gstin: '29AABCP9082M1ZS',
      city: 'Bengaluru, Karnataka',
      category: 'Electronics & Audio',
      appliedDate: '22 Oct 2026',
      status: 'pending',
    },
  ]);

  const [approvedCount, setApprovedCount] = useState(14);

  // If not super_admin, render Platform Master Key Security Gate
  if (!isSuperAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-900 text-white">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-5 shadow-sm border border-amber-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 font-bold text-[10px] uppercase tracking-wider border border-amber-800/60 inline-block mb-2">
            Restricted Platform Master HQ
          </span>
          <h2 className="text-2xl font-bold font-outfit text-white">
            Super Admin Gate
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Platform governance, commission override switches, merchant KYC approvals, and escrow settlement ledgers require Super Admin level credentials.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-700 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Current Status: {currentUser.isLoggedIn ? `Authenticated as ${currentUser.name} (${currentUser.role})` : 'Unauthenticated'}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              To test the Super Admin dashboard immediately with full governance privileges, click the button below.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                switchDemoRole('super_admin');
              }}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>1-Click Authenticate as Platform Super Admin</span>
            </button>

            <button
              onClick={() => setActiveTab('storefront')}
              className="text-xs text-slate-400 hover:text-white transition-colors pt-2 block mx-auto cursor-pointer"
            >
              ← Back to Public Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateGlobalRate = (e: React.FormEvent) => {
    e.preventDefault();
    updateSuperAdminStats({ defaultCommissionRate: Number(globalRate) });
    setRateUpdated(true);
    setTimeout(() => setRateUpdated(false), 2500);
  };

  const handleExportAudit = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      platformStats: superAdminStats,
      verifiedStores: stores,
      pendingKycQueue: pendingKyc,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luxecart-platform-audit-${Date.now()}.json`;
    a.click();
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleApproveKyc = (id: string) => {
    setPendingKyc((prev) => prev.filter((k) => k.id !== id));
    setApprovedCount((prev) => prev - 1);
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchSellerQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchSellerQuery.toLowerCase()) ||
      s.gstin.toLowerCase().includes(searchSellerQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 animate-fadeIn text-slate-900 dark:text-white">
      {/* Platform Orchestration Top Header (Matching Zip) */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8 py-4 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Platform Health: 99.98% All Systems Nominal
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="font-mono text-[10px] text-slate-400">NODE: HYD-AWS-PROD-01</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-outfit">
              Platform Master HQ & Super Admin Control
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time multi-tenant orchestration across 1,842+ verified merchants, commission settlement engine, and vendor governance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportAudit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-600" />
              <span>{exportNotice ? 'Audit Exported!' : 'Export Platform Audit'}</span>
            </button>

            <button
              onClick={() => setActiveTab('store-wizard')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Onboard New Merchant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 mb-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Platform Overview & GMV' },
            { id: 'sellers', label: `Verified Merchants (${stores.length})` },
            { id: 'commissions', label: 'Commission Engine' },
            { id: 'kyc', label: `Approvals & KYC Queue (${approvedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabSub(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTabSub === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. OVERVIEW & 4 KPI METRICS (Matching Zip) */}
        {activeTabSub === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Sellers */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Sellers</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      +12.4% MoM
                    </span>
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">1,842</p>
                  <p className="text-xs text-slate-400 mt-1">Spread across 22 Indian states</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{approvedCount} Pending KYC Review</span>
                </div>
              </div>

              {/* Active Stores */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Stores</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px]">
                      92.2% Live
                    </span>
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">1,698</p>
                  <p className="text-xs text-slate-400 mt-1">Actively fulfilling Indian orders</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400">
                  48 stores paused for inventory replenishment
                </div>
              </div>

              {/* Total Platform Orders */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Platform Orders</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      +18.6% MoM
                    </span>
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">148,920</p>
                  <p className="text-xs text-slate-400 mt-1">Across 19,000+ PIN codes</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-purple-600 font-semibold">
                  ₹38.4 Cr Gross GMV Processed
                </div>
              </div>

              {/* Platform Commission Earned */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Commission Earned</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      +24.2% MoM
                    </span>
                  </div>
                  <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-outfit">
                    ₹3.26 Cr
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Average Take Rate: {globalRate}%</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-emerald-600 font-semibold">
                  Auto-settled via Razorpay Route
                </div>
              </div>
            </div>

            {/* Platform Master Controls Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Commission Engine Override */}
              <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white font-outfit">
                      Global Commission Engine
                    </h3>
                    <p className="text-xs text-slate-400">Set platform baseline commission percentage for all merchants</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-extrabold text-xs">
                    Current: {globalRate}%
                  </span>
                </div>

                <form onSubmit={handleUpdateGlobalRate} className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span>Adjust Baseline Commission</span>
                      <span className="text-purple-600 font-bold text-sm">{globalRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      step="0.5"
                      value={globalRate}
                      onChange={(e) => setGlobalRate(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>2% (Competitive Low)</span>
                      <span>8.5% (Standard)</span>
                      <span>20% (High Luxury)</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Monthly Revenue Forecast at {globalRate}%:</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {formatINR((384000000 * globalRate) / 100)}
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                    >
                      Apply Rate Override
                    </button>
                  </div>
                  {rateUpdated && (
                    <p className="text-xs text-emerald-600 font-bold">✓ Commission rate updated across all active vendor stores!</p>
                  )}
                </form>
              </div>

              {/* Live KYC & Verification Queue Box */}
              <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white font-outfit">
                      Merchant KYC Queue
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-xs">
                      {pendingKyc.length} Pending Actions
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Newly applied Indian stores requiring GSTIN verification and brand verification</p>

                  <div className="space-y-2 mt-4">
                    {pendingKyc.map((kyc) => (
                      <div key={kyc.id} className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{kyc.storeName}</p>
                          <p className="text-[10px] text-slate-400">GSTIN: {kyc.gstin} • {kyc.city}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleApproveKyc(kyc.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setPendingKyc((prev) => prev.filter((k) => k.id !== k.id))}
                            className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-lg text-[11px] cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <span>Automatic GSTIN verification powered by ClearTax / Karza API</span>
                  <button
                    onClick={() => setActiveTabSub('kyc')}
                    className="text-purple-600 hover:underline font-bold"
                  >
                    View All →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. VERIFIED MERCHANTS SUB-TAB */}
        {activeTabSub === 'sellers' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchSellerQuery}
                  onChange={(e) => setSearchSellerQuery(e.target.value)}
                  placeholder="Search stores by name, city, GSTIN..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={() => setActiveTab('store-wizard')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer whitespace-nowrap"
              >
                + Onboard Store
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-750 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Store & Merchant</th>
                      <th className="py-3 px-3">Location & GSTIN</th>
                      <th className="py-3 px-3">Commission Rate</th>
                      <th className="py-3 px-3">Total GMV</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredStores.map((store) => (
                      <tr key={store.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
                              {store.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{store.name}</p>
                              <p className="text-[11px] text-slate-400">{store.ownerName} • {store.mobile}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 block">{store.city}, {store.state}</span>
                            <span className="font-mono text-[10px] text-slate-400">{store.gstin}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[11px]">
                            {store.commissionRate}%
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 dark:text-white">{formatINR(store.totalRevenue)}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                            {store.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setCurrentStoreId(store.id);
                              setActiveTab('seller-admin');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 font-bold text-[11px] cursor-pointer"
                          >
                            Manage Store →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. COMMISSION ENGINE SUB-TAB */}
        {activeTabSub === 'commissions' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl space-y-4">
            <h3 className="font-bold text-lg font-outfit">Platform Commission Configuration</h3>
            <p className="text-xs text-slate-400">Set standard and special category take-rates</p>
            <form onSubmit={handleUpdateGlobalRate} className="space-y-4 pt-2">
              <div>
                <label className="font-semibold text-xs block mb-1">Default Baseline Take-Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={globalRate}
                  onChange={(e) => setGlobalRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Save Global Rate
              </button>
              {rateUpdated && <p className="text-xs text-emerald-600 font-bold">✓ Commission rate updated!</p>}
            </form>
          </div>
        )}

        {/* 4. KYC QUEUE SUB-TAB */}
        {activeTabSub === 'kyc' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="font-bold text-lg font-outfit">Merchant Verification Queue</h3>
                <p className="text-xs text-slate-400">Review business licenses, GST certificates, and bank account proofs</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                {pendingKyc.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingKyc.map((kyc) => (
                <div key={kyc.id} className="p-4 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-purple-600 font-bold">{kyc.id}</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{kyc.storeName}</h4>
                    <p className="text-slate-500">Applicant: {kyc.ownerName} • {kyc.city} • GSTIN: {kyc.gstin}</p>
                    <span className="text-[10px] text-slate-400">Applied on {kyc.appliedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveKyc(kyc.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                    >
                      ✓ Approve Merchant
                    </button>
                    <button
                      onClick={() => setPendingKyc((prev) => prev.filter((k) => k.id !== kyc.id))}
                      className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
