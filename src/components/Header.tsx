import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Store,
  Compass,
  X,
  Sparkles,
  Headphones,
  Leaf,
  Flame,
  ShoppingBag,
  Shirt,
  Crown,
  Layers,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  CheckCircle2,
  Lock,
  Tag,
  TrendingUp,
  ArrowRight,
  Star,
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR, useTranslation } from '../utils/formatters';
import { INITIAL_CATEGORIES } from '../data/mockData';
import { getSearchSuggestions, POPULAR_SEARCH_TERMS, SearchSuggestionItem } from '../utils/searchUtils';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedSubcategory?: string;
  onSelectSubcategory?: (subcategoryId: string, parentCatId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedSubcategory = 'all',
  onSelectSubcategory,
}) => {
  const {
    theme,
    updateTheme,
    language,
    toggleLanguage,
    activeTab,
    setActiveTab,
    cartCount,
    cartGrandTotal,
    setIsCartDrawerOpen,
    wishlist,
    currentUser,
    setIsLoginModalOpen,
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    logoutUser,
    navigateToProtectedTab,
    products,
    setSelectedProduct,
  } = useStore();

  const t = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeCategoryDropdown, setActiveCategoryDropdown] = useState<string | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);

  const scrollNav = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth',
      });
    }
  };

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        categoryNavRef.current &&
        !categoryNavRef.current.contains(e.target as Node)
      ) {
        setActiveCategoryDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    return getSearchSuggestions(searchQuery, products, INITIAL_CATEGORIES);
  }, [searchQuery, products]);

  const handleSelectSuggestion = (item: SearchSuggestionItem | string) => {
    if (typeof item === 'string') {
      handleSearchInput(item);
      setIsSearchFocused(false);
      if (activeTab !== 'storefront') setActiveTab('storefront');
      return;
    }

    if (item.type === 'category' && item.categoryId) {
      onSelectCategory(item.categoryId);
      if (onSelectSubcategory) onSelectSubcategory('all');
      setIsSearchFocused(false);
      if (activeTab !== 'storefront') setActiveTab('storefront');
    } else if (item.type === 'subcategory' && item.subcategoryId && item.categoryId) {
      if (onSelectSubcategory) onSelectSubcategory(item.subcategoryId, item.categoryId);
      setIsSearchFocused(false);
      if (activeTab !== 'storefront') setActiveTab('storefront');
    } else if (item.type === 'brand' && item.brand) {
      handleSearchInput(item.brand);
      setIsSearchFocused(false);
      if (activeTab !== 'storefront') setActiveTab('storefront');
    } else if (item.type === 'product' && item.productId) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        setSelectedProduct(prod);
      }
      setIsSearchFocused(false);
    } else {
      handleSearchInput(item.title);
      setIsSearchFocused(false);
      if (activeTab !== 'storefront') setActiveTab('storefront');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchQuery);
    if (activeTab !== 'storefront') {
      setActiveTab('storefront');
    }
  };

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    onSearchChange(val);
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    'sarees': <Sparkles className="w-4 h-4 text-amber-600" />,
    'salwar-suits': <Shirt className="w-4 h-4 text-amber-600" />,
    'bridal-lehengas': <Crown className="w-4 h-4 text-amber-600" />,
    'kurta-sets': <Layers className="w-4 h-4 text-amber-600" />,
    'festive-wear': <Flame className="w-4 h-4 text-amber-600" />,
    'dupattas-potlis': <ShoppingBag className="w-4 h-4 text-amber-600" />,
    'ethnic-wear': <Sparkles className="w-4 h-4 text-amber-600" />,
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/98 dark:bg-stone-950/98 backdrop-blur-xl border-b border-stone-200/90 dark:border-stone-800 transition-colors shadow-xs">
      {/* 1. HeaderTop Bar (Social Links, Boutique Info, Live Notice & Dedicated Admin Login) */}
      <div className="bg-stone-950 text-stone-300 border-b border-stone-800 text-[11px] py-1.5 px-3 sm:px-6 lg:px-8 tracking-wide">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Social Media Icons & Studio Info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-stone-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Ananya Collection on Instagram"
                className="hover:text-amber-300 transition-colors cursor-pointer p-0.5"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="hover:text-amber-300 transition-colors cursor-pointer p-0.5"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube Studio"
                className="hover:text-amber-300 transition-colors cursor-pointer p-0.5"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/919667417843?text=Hello%20Ananya%20Collection%2C%20I%20have%20an%20enquiry"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp (+91 96674 17843)"
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/80 hover:text-emerald-300 transition-all cursor-pointer font-medium text-[11px]"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.127-.521-1.625-.675-2.712-2.316-2.793-2.425-.08-.108-.66-.879-.66-1.674 0-.795.416-1.187.564-1.347.149-.16.326-.2.434-.2.108 0 .216.002.31.006.1.005.234-.038.366.279.136.327.464 1.132.505 1.215.041.083.069.18.014.288-.054.108-.082.176-.162.271-.08.096-.168.214-.24.288-.08.083-.163.173-.07.333.093.16.413.682.886 1.103.61.543 1.124.711 1.284.791.16.08.254.07.35-.041.096-.11.41-.477.52-.641.11-.164.22-.137.369-.082.149.055.945.446 1.107.527.162.081.27.121.31.189.04.068.04.394-.104.799z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.309A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.656 0-3.197-.482-4.502-1.316l-.323-.205-2.96.777.79-2.885-.224-.356A8.026 8.026 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8.05-8 8.05z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Center: Live Announcement Notice */}
          {theme.showAnnouncement && (
            <div className="hidden md:flex items-center justify-center gap-2 text-amber-200/90 truncate px-2 font-medium text-center">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">
                {language === 'hi'
                  ? theme.announcementTextHi || theme.announcementText
                  : theme.announcementText}
              </span>
            </div>
          )}

          {/* Right: Quick Links & Dedicated Boutique Admin Login */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 text-stone-300">
            {/* Track Order */}
            <button
              onClick={() => setActiveTab('order-success')}
              className="hidden lg:flex items-center gap-1 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Truck className="w-3 h-3 text-amber-400" />
              <span>Track Order</span>
            </button>

            <span className="text-stone-700 hidden lg:inline">|</span>

            {/* Currency Badge */}
            <span className="text-stone-400 font-mono text-[10px] hidden sm:inline">
              INR (₹)
            </span>

            <span className="text-stone-700 hidden sm:inline">|</span>

            {/* Exclusive Boutique Admin Access Button */}
            <button
              onClick={() => {
                if (currentUser.isLoggedIn && (currentUser.role === 'super_admin' || currentUser.role === 'admin')) {
                  setActiveTab('admin');
                } else {
                  setIsAdminLoginModalOpen(true);
                }
              }}
              title="Boutique Administration Portal"
              aria-label="Admin Portal Login"
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900 hover:bg-black text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer font-medium text-[11px] group shadow-2xs"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-serif tracking-wider">
                {currentUser.isLoggedIn && (currentUser.role === 'super_admin' || currentUser.role === 'admin')
                  ? 'Admin Panel'
                  : 'Admin Login'}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar (Clean Luxury Marketplace Header - NO public theme customizer!) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20 sm:h-24">
          
          {/* Left: Brand Logo & Deliver To PIN code */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <button
              onClick={() => setActiveTab('storefront')}
              className="text-left group flex items-center gap-3 sm:gap-4 focus:outline-none cursor-pointer"
            >
              {theme.logoUrl ? (
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-500 shadow-md group-hover:scale-105 transition-all shrink-0 ring-2 ring-amber-400/50">
                  <img
                    src={theme.logoUrl}
                    alt={theme.storeName}
                    className="w-full h-full object-cover rounded-full bg-black shadow-inner"
                  />
                </div>
              ) : (
                <div
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md group-hover:scale-105 transition-transform shrink-0"
                >
                  {theme.logoText ? theme.logoText.slice(0, 2) : 'AC'}
                </div>
              )}
              <div className="flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[0.05em] uppercase whitespace-nowrap leading-none font-serif text-stone-900 dark:text-amber-100">
                  {theme.storeName}
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase flex items-center gap-1.5 text-amber-950 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700/60 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Rohini, Delhi
                  </span>
                  <span className="text-stone-300 dark:text-stone-600 text-xs hidden sm:inline">|</span>
                  <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium tracking-wide truncate max-w-[150px] sm:max-w-[280px] hidden sm:inline">
                    {language === 'hi' ? theme.taglineHi : theme.tagline}
                  </span>
                </div>
              </div>
            </button>

          </div>

          {/* Center: Search Bar (Spacious, Luxury Boutique Design) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-2xl mx-6 hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full h-11 sm:h-12 bg-white dark:bg-stone-900 rounded-full border border-stone-200 dark:border-stone-700 shadow-2xs focus-within:ring-2 focus-within:ring-[#B8860B]/40 focus-within:border-[#B8860B] transition-all overflow-hidden">
              <div className="pl-4 pr-2 text-stone-400 shrink-0">
                <Search className="w-4 h-4 text-[#B8860B]" />
              </div>

              <div className="relative flex-1 h-full flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    handleSearchInput(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  placeholder="Search pure silk sarees, bridal lehengas, designer suits, anarkalis..."
                  className="w-full h-full pr-8 bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchInput('')}
                    className="absolute right-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                aria-label="Search"
                className="h-full px-6 bg-[#B8860B] hover:bg-[#996515] text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
              >
                <span>Search</span>
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Live Auto-Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-fadeIn max-h-[460px] overflow-y-auto">
                {!searchQuery.trim() ? (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                        <TrendingUp className="w-4 h-4" />
                        Popular Searches in Bharat
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCH_TERMS.map((term, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectSuggestion(term)}
                          className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60"
                        >
                          <Search className="w-3 h-3 text-slate-400" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Browse by Category
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {INITIAL_CATEGORIES.slice(0, 4).map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              onSelectCategory(c.id);
                              if (onSelectSubcategory) onSelectSubcategory('all');
                              setIsSearchFocused(false);
                              if (activeTab !== 'storefront') setActiveTab('storefront');
                            }}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/20 text-left flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <img src={c.image} alt="" className="w-7 h-7 rounded-lg object-cover" />
                            <div className="truncate">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">{c.name}</span>
                              <span className="text-[10px] text-slate-400">{c.itemCount} items</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Categories & Subcategories Matches */}
                    {suggestions.categories.length > 0 && (
                      <div className="p-2.5 bg-slate-50/70 dark:bg-slate-800/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                          Categories & Departments
                        </span>
                        <div className="space-y-1">
                          {suggestions.categories.map((cat, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectSuggestion(cat)}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Tag className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                <span className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                  {cat.title}
                                </span>
                                {cat.subtitle && (
                                  <span className="text-[11px] text-slate-400 truncate">({cat.subtitle})</span>
                                )}
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Brand Suggestions */}
                    {suggestions.brands.length > 0 && (
                      <div className="p-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                          Brand Stores
                        </span>
                        <div className="flex flex-wrap gap-1.5 px-2">
                          {suggestions.brands.map((b, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectSuggestion(b)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold text-xs hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Store className="w-3 h-3" />
                              <span>{b.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Products Preview */}
                    {suggestions.products.length > 0 && (
                      <div className="p-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                          Matching Products
                        </span>
                        <div className="space-y-1">
                          {suggestions.products.map((p, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectSuggestion(p)}
                              className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors cursor-pointer"
                            >
                              {p.image && (
                                <img
                                  src={p.image}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {p.title}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {p.subtitle}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Keyword Completions */}
                    {suggestions.keywords.length > 0 && (
                      <div className="p-2.5 bg-slate-50/50 dark:bg-slate-800/30">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                          Suggested Searches
                        </span>
                        <div className="space-y-0.5">
                          {suggestions.keywords.map((kw, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectSuggestion(kw)}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-white dark:hover:bg-slate-800 flex items-center gap-2 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            >
                              <Search className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-medium">{kw}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom Action: View all matching */}
                    <div className="p-3 bg-slate-100/70 dark:bg-slate-800/70 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">
                        Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border rounded font-mono text-[10px]">Enter</kbd> to search
                      </span>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Search for "{searchQuery}" →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions: Language, Wishlist, Cart Drawer & User Account */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Language Toggle: English <-> हिंदी */}
            <button
              onClick={toggleLanguage}
              title={language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              {language === 'en' ? 'हिंदी' : 'EN'}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                setActiveTab('storefront');
                onSearchChange('__wishlist__');
              }}
              title="Your Saved Wishlist"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500/20' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-heart-pop shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full font-semibold text-xs transition-all shadow-xs bg-stone-900 hover:bg-black text-amber-200 dark:bg-amber-400 dark:text-stone-950 border border-amber-400/40 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-amber-300 dark:text-stone-950" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-amber-400 text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-cart-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold font-serif tracking-wide">
                {t.cart}
              </span>
            </button>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-1.5 p-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                  currentUser.role === 'super_admin'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : currentUser.role === 'seller'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                }`}>
                  {currentUser.isLoggedIn ? (
                    currentUser.name.charAt(0)
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 leading-none">
                    {currentUser.isLoggedIn ? 'Account' : 'Welcome'}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {currentUser.isLoggedIn ? currentUser.name.split(' ')[0] : 'Sign In'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 py-2.5 z-50 text-xs animate-in fade-in">
                  {currentUser.isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-stone-900 dark:text-amber-100 truncate text-xs">{currentUser.name}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            currentUser.role === 'super_admin' || currentUser.role === 'admin'
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                              : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                          }`}>
                            {currentUser.role === 'super_admin' || currentUser.role === 'admin' ? 'Store Admin' : 'Customer'}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{currentUser.mobile}</p>
                      </div>

                      {/* Navigation links */}
                      <button
                        onClick={() => {
                          setActiveTab('my-account');
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <User className="w-4 h-4 text-[#B8860B]" />
                        <span>My Account & Addresses</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('my-account');
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-600" />
                        <span>My Orders & Invoices</span>
                      </button>

                      <div className="border-t border-stone-100 dark:border-stone-800 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logoutUser();
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-semibold cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-3 text-center space-y-3">
                      <p className="text-xs text-stone-600 dark:text-stone-400">
                        Sign in for express checkout, order tracking & bespoke ethnic collections.
                      </p>
                      <button
                        onClick={() => {
                          setIsLoginModalOpen(true);
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full py-2.5 bg-[#B8860B] hover:bg-[#996515] text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Sign In / Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar with Auto-Suggestions */}
        <div ref={mobileSearchRef} className="relative pb-2.5 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                handleSearchInput(e.target.value);
                setIsSearchFocused(true);
              }}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Mobile Auto-Suggestions Overlay */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-[350px] overflow-y-auto">
              {!searchQuery.trim() ? (
                <div className="p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SEARCH_TERMS.slice(0, 6).map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectSuggestion(term)}
                        className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {suggestions.categories.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Categories</span>
                      {suggestions.categories.slice(0, 3).map((cat, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSuggestion(cat)}
                          className="w-full text-left py-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center justify-between"
                        >
                          <span>{cat.title}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  {suggestions.products.length > 0 && (
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Products</span>
                      {suggestions.products.slice(0, 3).map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSuggestion(p)}
                          className="w-full text-left py-1.5 flex items-center gap-2"
                        >
                          {p.image && <img src={p.image} alt="" className="w-8 h-8 rounded object-cover" />}
                          <div className="truncate">
                            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">{p.title}</p>
                            <p className="text-[10px] text-slate-400">{p.subtitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Secondary Navigation Strip with Responsive Menu & Black-Gold Hover */}
      <div
        ref={categoryNavRef}
        className="relative bg-white/95 dark:bg-stone-950/95 border-t border-stone-200/80 dark:border-stone-800 text-xs w-full overflow-visible backdrop-blur-md shadow-xs z-30"
      >
        <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-8 flex items-center justify-between gap-1 sm:gap-2 relative">
          
          {/* Mobile/Tablet Left Scroll Arrow */}
          <button
            type="button"
            onClick={() => scrollNav('left')}
            className="hidden sm:flex lg:hidden items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xs text-stone-600 dark:text-stone-300 hover:bg-stone-950 hover:text-[#D4AF37] transition-all shrink-0 z-10 cursor-pointer"
            aria-label="Scroll menu left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Nav Categories Container (Centered & Proportionate on Desktop, Swipeable on Mobile) */}
          <div
            ref={navScrollRef}
            className="flex-1 min-w-0 flex items-center justify-start lg:justify-center gap-1.5 sm:gap-2 lg:gap-2.5 overflow-x-auto lg:overflow-visible no-scrollbar scroll-smooth py-2 px-1"
          >
            {/* All Collections Button */}
            <button
              onClick={() => {
                onSelectCategory('all');
                if (onSelectSubcategory) onSelectSubcategory('all');
                if (activeTab !== 'storefront') setActiveTab('storefront');
              }}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 text-xs ${
                selectedCategory === 'all'
                  ? 'bg-stone-950 text-[#D4AF37] border-amber-500/60 shadow-md font-bold'
                  : 'bg-stone-100/70 dark:bg-stone-900/60 text-stone-700 dark:text-stone-300 border-transparent hover:bg-stone-950 dark:hover:bg-black hover:text-[#D4AF37] dark:hover:text-[#F59E0B] hover:border-amber-500/50 hover:shadow-md'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 transition-colors ${selectedCategory === 'all' ? 'text-[#D4AF37]' : 'text-stone-500 group-hover:text-[#D4AF37]'}`} />
              <span>{language === 'hi' ? 'सभी संग्रह' : 'All Collections'}</span>
            </button>

            {/* Quick Deals Link with Fire */}
            <button
              onClick={() => {
                if (activeTab !== 'storefront') setActiveTab('storefront');
                setTimeout(() => {
                  const el = document.getElementById('deals-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 border border-transparent bg-amber-500/10 text-amber-900 dark:text-amber-300 hover:bg-stone-950 dark:hover:bg-black hover:text-[#D4AF37] dark:hover:text-[#F59E0B] hover:border-amber-500/50 hover:shadow-md cursor-pointer shrink-0 text-xs"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600 group-hover:text-[#D4AF37] transition-colors" />
              <span>{language === 'hi' ? 'डील्स' : 'Deals'}</span>
            </button>

            {/* Category Pills with Black Box & Golden Text Hover */}
            {INITIAL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;
              const isDropdownOpen = activeCategoryDropdown === cat.id;

              return (
                <div
                  key={cat.id}
                  className="relative shrink-0 group"
                  onMouseEnter={() => setActiveCategoryDropdown(cat.id)}
                  onMouseLeave={() => setActiveCategoryDropdown(null)}
                >
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      if (onSelectSubcategory) onSelectSubcategory('all');
                      if (activeTab !== 'storefront') setActiveTab('storefront');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-stone-950 text-[#D4AF37] border-amber-500/60 shadow-md font-bold'
                        : 'bg-stone-100/70 dark:bg-stone-900/60 text-stone-700 dark:text-stone-300 border-transparent hover:bg-stone-950 dark:hover:bg-black hover:text-[#D4AF37] dark:hover:text-[#F59E0B] hover:border-amber-500/50 hover:shadow-md'
                    }`}
                  >
                    <span className={`transition-colors ${isSelected ? 'text-[#D4AF37]' : 'text-stone-500 group-hover:text-[#D4AF37]'}`}>
                      {categoryIcons[cat.id] || <Sparkles className="w-3.5 h-3.5" />}
                    </span>
                    <span>{language === 'hi' ? cat.nameHi : cat.name}</span>
                    {hasSubcategories && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180' : ''
                        } ${isSelected ? 'text-[#D4AF37]' : 'text-stone-400 group-hover:text-[#D4AF37]'}`}
                      />
                    )}
                  </button>

                  {/* Subcategories Flyout Dropdown Menu (Luxury Black & Gold Box) */}
                  {hasSubcategories && isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-60 bg-stone-950/95 dark:bg-black/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-1">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400/90 border-b border-stone-800 flex items-center justify-between mb-1.5">
                        <span>{language === 'hi' ? 'कलेक्शन' : 'Collection'}</span>
                        <span className="text-amber-300 font-semibold text-[10px]">{cat.subcategories!.length}</span>
                      </div>
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCategory(cat.id);
                            if (onSelectSubcategory) onSelectSubcategory('all');
                            if (activeTab !== 'storefront') setActiveTab('storefront');
                            setActiveCategoryDropdown(null);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                            isSelected && selectedSubcategory === 'all'
                              ? 'bg-amber-500/20 text-[#D4AF37] font-bold border-l-2 border-[#D4AF37]'
                              : 'text-stone-300 hover:bg-stone-900 hover:text-[#D4AF37] hover:pl-4'
                          }`}
                        >
                          <span>{language === 'hi' ? `सभी ${cat.nameHi}` : `All ${cat.name}`}</span>
                          <span className="text-[10px] text-stone-400">({cat.itemCount})</span>
                        </button>
                        {cat.subcategories!.map((sub) => {
                          const isSubSelected = selectedCategory === cat.id && selectedSubcategory === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                if (onSelectSubcategory) onSelectSubcategory(sub.id, cat.id);
                                if (activeTab !== 'storefront') setActiveTab('storefront');
                                setActiveCategoryDropdown(null);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                                isSubSelected
                                  ? 'bg-amber-500/20 text-[#D4AF37] font-bold border-l-2 border-[#D4AF37]'
                                  : 'text-stone-300 hover:bg-stone-900 hover:text-[#D4AF37] hover:pl-4'
                              }`}
                            >
                              <span>{language === 'hi' ? sub.nameHi : sub.name}</span>
                              {sub.itemCount && (
                                <span className={`text-[10px] ${isSubSelected ? 'text-amber-300' : 'text-stone-500'}`}>
                                  ({sub.itemCount})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile/Tablet Right Scroll Arrow */}
          <button
            type="button"
            onClick={() => scrollNav('right')}
            className="hidden sm:flex lg:hidden items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xs text-stone-600 dark:text-stone-300 hover:bg-stone-950 hover:text-[#D4AF37] transition-all shrink-0 z-10 cursor-pointer"
            aria-label="Scroll menu right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
