import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  StoreSettings,
  InventoryMovement,
  AuditLog,
  AdminNotification,
  StoreThemeConfig,
  ThemePreset,
  CartItem,
  Order,
  Language,
  ActiveTab,
  Coupon,
  SellerStore,
  CustomerAddress,
  PaymentMethod,
  AppUser,
  UserRole,
} from '../types';
import {
  DEFAULT_THEME_CONFIG,
  THEME_PRESETS,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_STORES,
  INITIAL_ORDERS,
  AVAILABLE_COUPONS,
  INITIAL_STORE_SETTINGS,
  INITIAL_INVENTORY_MOVEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ADMIN_NOTIFICATIONS,
  SUPER_ADMIN_INITIAL_STATS,
  DEMO_USERS,
  INITIAL_GUEST_USER,
} from '../data/mockData';

interface StoreContextType {
  // Theme & Branding
  theme: StoreThemeConfig;
  updateTheme: (updates: Partial<StoreThemeConfig>) => void;
  applyPreset: (presetId: string) => void;
  resetTheme: () => void;
  exportThemeJson: () => string;
  importThemeJson: (jsonStr: string) => boolean;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;

  // Navigation & Views
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  navigateToProtectedTab: (tab: ActiveTab) => boolean;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  sharingProduct: Product | null;
  setSharingProduct: (product: Product | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (isOpen: boolean) => void;
  authModalMode: 'login' | 'signup' | 'role_gate';
  setAuthModalMode: (mode: 'login' | 'signup' | 'role_gate') => void;
  authGateMessage: string;
  setAuthGateMessage: (message: string) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductSoldOut: (id: string) => void;
  toggleProductPause: (id: string) => void;
  duplicateProduct: (id: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryCharge: number;
  cartGstTotal: number;
  cartGrandTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  freeDeliveryThreshold: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Checkout
  orders: Order[];
  customerOrders: Order[];
  placeOrder: (
    customer: CustomerAddress,
    paymentMethod: PaymentMethod,
    upiId?: string
  ) => Order;
  updateOrderStatus: (
    orderId: string,
    status: Order['orderStatus'],
    trackingNo?: string
  ) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Multi-Seller (Legacy Support)
  stores: SellerStore[];
  currentStore: SellerStore;
  setCurrentStoreId: (storeId: string) => void;
  updateCurrentStore: (updates: Partial<SellerStore>) => void;
  createStore: (storeData: Partial<SellerStore>) => SellerStore;

  // Unified Admin & Single Store Extensions
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  storeSettings: StoreSettings;
  updateStoreSettings: (updates: Partial<StoreSettings>) => void;

  inventoryMovements: InventoryMovement[];
  adjustStock: (
    productId: string,
    newQty: number,
    reason: InventoryMovement['reason'],
    variantSku?: string
  ) => void;

  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: string, details: string) => void;

  adminNotifications: AdminNotification[];
  markNotificationRead: (id: string) => void;

  availableCoupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // Super Admin
  superAdminStats: typeof SUPER_ADMIN_INITIAL_STATS;
  updateSuperAdminStats: (updates: Partial<typeof SUPER_ADMIN_INITIAL_STATS>) => void;

  // Authentication & Users
  currentUser: AppUser;
  loginUser: (userData: Partial<AppUser>) => void;
  logoutUser: () => void;
  switchDemoRole: (role: UserRole) => void;
  saveUserAddress: (address: CustomerAddress) => void;
  deleteUserAddress: (index: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<StoreThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('ananya_theme_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          fontFamily: parsed.fontFamily || 'Playfair Display',
        };
      }
      return DEFAULT_THEME_CONFIG;
    } catch {
      return DEFAULT_THEME_CONFIG;
    }
  });

  // Language State
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('luxecart_lang');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('storefront');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'role_gate'>('login');
  const [authGateMessage, setAuthGateMessage] = useState<string>('');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // User State (with Role Based Access Control)
  const [currentUser, setCurrentUser] = useState<AppUser>(() => {
    try {
      const saved = localStorage.getItem('ananya_user_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Pooja Agarwal' || parsed.id === 'usr-customer-1' || !parsed.isLoggedIn) {
          return INITIAL_GUEST_USER;
        }
        return parsed;
      }
      return INITIAL_GUEST_USER;
    } catch {
      return INITIAL_GUEST_USER;
    }
  });

  // Data States
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ananya_products_v6');
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ananya_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ananya_wishlist_v1');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
    } catch {
      return ['prod-1', 'prod-3'];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ananya_orders_v1');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [stores, setStores] = useState<SellerStore[]>(() => {
    try {
      const saved = localStorage.getItem('luxecart_stores');
      return saved ? JSON.parse(saved) : INITIAL_STORES;
    } catch {
      return INITIAL_STORES;
    }
  });

  const [currentStoreId, setCurrentStoreId] = useState<string>(() => {
    return currentUser.storeId || 'store-1';
  });

  const [superAdminStats, setSuperAdminStats] = useState(SUPER_ADMIN_INITIAL_STATS);

  // Unified Single-Store States
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('ananya_categories_v3');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('ananya_store_settings_v1');
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(() => {
    try {
      const saved = localStorage.getItem('ananya_inv_movs_v1');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY_MOVEMENTS;
    } catch {
      return INITIAL_INVENTORY_MOVEMENTS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('ananya_audit_logs_v1');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('ananya_admin_notifs_v1');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_NOTIFICATIONS;
    } catch {
      return INITIAL_ADMIN_NOTIFICATIONS;
    }
  });

  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('ananya_coupons_v1');
      return saved ? JSON.parse(saved) : AVAILABLE_COUPONS;
    } catch {
      return AVAILABLE_COUPONS;
    }
  });

  // Apply CSS Variables Whenever Theme Changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-secondary', theme.secondaryColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
    root.style.setProperty('--theme-bg', theme.bgColor);
    root.style.setProperty('--theme-card', theme.cardColor);
    root.style.setProperty('--theme-text', theme.textColor);
    root.style.setProperty('--theme-border', theme.borderColor || '#E2E8F0');
    root.style.setProperty('--theme-radius', `${theme.borderRadius}px`);
    root.style.setProperty(
      '--theme-font-heading',
      `'${theme.fontFamily || 'Playfair Display'}', 'Playfair Display', 'Noto Sans Devanagari', Georgia, serif`
    );
    root.style.setProperty(
      '--theme-font-sans',
      `'Inter', 'Noto Sans Devanagari', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
    );

    if (theme.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem('ananya_theme_v6', JSON.stringify(theme));
    } catch {
      // ignore
    }
  }, [theme]);

  // Persist State
  useEffect(() => {
    try {
      if (currentUser.isLoggedIn) {
        localStorage.setItem('ananya_user_v3', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('ananya_user_v3');
        localStorage.removeItem('ananya_user_v2');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('ananya_products_v6', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('ananya_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('ananya_orders_v1', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ananya_wishlist_v1', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('ananya_categories_v3', JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('ananya_store_settings_v1', JSON.stringify(storeSettings));
    } catch {
      // ignore
    }
  }, [storeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('ananya_inv_movs_v1', JSON.stringify(inventoryMovements));
    } catch {
      // ignore
    }
  }, [inventoryMovements]);

  useEffect(() => {
    try {
      localStorage.setItem('ananya_audit_logs_v1', JSON.stringify(auditLogs));
    } catch {
      // ignore
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('ananya_admin_notifs_v1', JSON.stringify(adminNotifications));
    } catch {
      // ignore
    }
  }, [adminNotifications]);

  useEffect(() => {
    try {
      localStorage.setItem('ananya_coupons_v1', JSON.stringify(availableCoupons));
    } catch {
      // ignore
    }
  }, [availableCoupons]);

  // Role Protection Guard for Navigation
  const navigateToProtectedTab = (tab: ActiveTab): boolean => {
    if (tab === 'admin' || tab === 'seller-admin' || tab === 'super-admin') {
      setActiveTab('admin');
      return true;
    }

    setActiveTab(tab);
    return true;
  };

  // Theme Helpers
  const updateTheme = (updates: Partial<StoreThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setTheme((prev) => ({
      ...prev,
      presetId: preset.id,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      bgColor: preset.bgColor,
      cardColor: preset.cardColor,
      textColor: preset.textColor,
      borderColor: preset.isDark ? '#334155' : '#E2E8F0',
      fontFamily: preset.fontFamily,
      borderRadius: preset.borderRadius,
      isDarkMode: preset.isDark,
    }));
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME_CONFIG);
  };

  const exportThemeJson = () => {
    return JSON.stringify(theme, null, 2);
  };

  const importThemeJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.primaryColor && parsed.storeName) {
        setTheme(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('luxecart_lang', lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  // Product Operations
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      storeId: productData.storeId || 'store-1',
      storeName: productData.storeName || 'Ananya Collection',
    };
    setProducts((prev) => [newProduct, ...prev]);
    addAuditLog('Product Added', 'Catalog', `Added product: ${newProduct.title} (SKU: ${newProduct.sku || 'N/A'})`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addAuditLog('Product Updated', 'Catalog', `Updated product details (ID: ${id})`);
  };

  const deleteProduct = (id: string) => {
    const item = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('Product Deleted', 'Catalog', `Deleted product: ${item?.title || id}`);
  };

  // Categories Operations
  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
    addAuditLog('Category Created', 'Catalog', `Added new category: ${category.name}`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addAuditLog('Category Updated', 'Catalog', `Updated category: ${id}`);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('Category Deleted', 'Catalog', `Deleted category: ${id}`);
  };

  // Store Settings
  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...updates }));
    addAuditLog('Settings Updated', 'System', 'Updated store configuration & logistics settings');
  };

  // Audit Logs & System Notifications
  const addAuditLog = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      module,
      details,
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      adminUser: currentUser.name || 'Ananya Verma (Admin)',
      ip: '103.21.144.12',
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const markNotificationRead = (id: string) => {
    setAdminNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Inventory Management
  const adjustStock = (
    productId: string,
    newQty: number,
    reason: InventoryMovement['reason'],
    variantSku?: string
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const prevQty = p.stock;
          const change = newQty - prevQty;
          const mov: InventoryMovement = {
            id: `mov-${Date.now()}`,
            productId: p.id,
            productName: p.title,
            variantSku,
            prevQty,
            newQty,
            change,
            reason,
            timestamp: new Date().toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            adminUser: currentUser.name || 'Ananya Admin',
          };
          setInventoryMovements((mPrev) => [mov, ...mPrev]);
          addAuditLog(
            'Stock Adjusted',
            'Inventory',
            `Adjusted stock of "${p.title}" from ${prevQty} to ${newQty} (Reason: ${reason})`
          );
          return {
            ...p,
            stock: newQty,
            status: newQty === 0 ? 'sold_out' : p.status === 'sold_out' && newQty > 0 ? 'active' : p.status,
          };
        }
        return p;
      })
    );
  };

  // Coupons
  const addCoupon = (coupon: Coupon) => {
    setAvailableCoupons((prev) => [coupon, ...prev]);
    addAuditLog('Coupon Created', 'Marketing', `Created coupon: ${coupon.code}`);
  };

  const deleteCoupon = (code: string) => {
    setAvailableCoupons((prev) => prev.filter((c) => c.code !== code));
    addAuditLog('Coupon Deleted', 'Marketing', `Deleted coupon: ${code}`);
  };

  const toggleProductSoldOut = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isNowSoldOut = p.status !== 'sold_out';
          return {
            ...p,
            status: isNowSoldOut ? 'sold_out' : 'active',
            stock: isNowSoldOut ? 0 : 25,
          };
        }
        return p;
      })
    );
  };

  const toggleProductPause = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: p.status === 'paused' ? 'active' : 'paused',
          };
        }
        return p;
      })
    );
  };

  const duplicateProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const duplicated: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      title: `${prod.title} (Copy)`,
      titleHi: `${prod.titleHi} (कॉपी)`,
      sku: `${prod.sku}-COPY`,
    };
    setProducts((prev) => [duplicated, ...prev]);
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, variant?: Record<string, string>) => {
    if (product.status === 'sold_out') return;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedVariant: variant }];
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeDeliveryThreshold = 499;

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  const cartDeliveryCharge =
    cartSubtotal >= freeDeliveryThreshold || cart.length === 0 ? 0 : 49;

  const cartGstTotal = Math.round(
    cart.reduce(
      (sum, item) =>
        sum +
        (item.product.price * item.quantity * (item.product.gstRate || 12)) / 100,
      0
    )
  );

  const cartGrandTotal = Math.max(
    0,
    cartSubtotal - cartDiscount + cartDeliveryCharge
  );

  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    const coupon = availableCoupons.find((c) => c.code === formatted);
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try FESTIVE500 or WELCOME10' };
    }
    if (cartSubtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `Minimum cart value of ₹${coupon.minOrderValue} required for ${coupon.code}`,
      };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon ${coupon.code} applied successfully! You saved ₹${coupon.discountType === 'fixed' ? coupon.discountValue : `${coupon.discountValue}%`}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = (
    customer: CustomerAddress,
    paymentMethod: PaymentMethod,
    upiId?: string
  ): Order => {
    const orderId = `LX-IND-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNum = `DLV-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newOrder: Order = {
      id: orderId,
      storeId: currentStoreId,
      storeName: currentStore.name,
      date: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryCharge: cartDeliveryCharge,
      gstAmount: cartGstTotal,
      total: cartGrandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'cod_verified' : 'paid',
      orderStatus: 'placed',
      trackingNumber: trackingNum,
      courierPartner: 'Delhivery',
      estimatedDeliveryDate: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0],
      upiTransactionId: upiId || `UPI/${Date.now().toString().slice(-8)}@okhdfcbank`,
      timeline: [
        {
          status: `Order Placed & ${paymentMethod === 'cod' ? 'Confirmed with COD' : 'Paid via Online Gateway'}`,
          statusHi: `ऑर्डर दर्ज व ${paymentMethod === 'cod' ? 'COD द्वारा स्वीकृत' : 'ऑनलाइन भुगतान सफल'}`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          location: `${customer.city}, ${customer.state}`,
          completed: true,
          current: true,
        },
        {
          status: 'Seller Confirmation & Quality Verification',
          statusHi: 'विक्रेता द्वारा गुणवत्ता जांच व स्वीकृति',
          date: 'Within 4 Hours',
          time: '--',
          location: `${currentStore.city}, ${currentStore.state}`,
          completed: false,
          current: false,
        },
        {
          status: 'Packed & Manifest Dispatched via Delhivery Express',
          statusHi: 'पैकिंग व दिल्लीवेरी कूरियर को सुपुर्द',
          date: 'Next Business Day',
          time: '--',
          location: 'Regional Logistics Center',
          completed: false,
          current: false,
        },
        {
          status: 'Out for Delivery to Your Doorstep',
          statusHi: 'आपके पते पर डिलीवरी के लिए रवाना',
          date: 'In 2-3 Days',
          time: '--',
          location: `${customer.pincode} Delivery Center`,
          completed: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setTrackingOrderId(newOrder.id);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: Order['orderStatus'],
    trackingNo?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            orderStatus: status,
            trackingNumber: trackingNo || ord.trackingNumber,
          };
        }
        return ord;
      })
    );
  };

  // Customer Orders Filtered for Current User
  const customerOrders = orders.filter((o) => {
    if (currentUser.role === 'customer') {
      return (
        o.customer.mobile.includes(currentUser.mobile) ||
        o.customer.fullName.toLowerCase() === currentUser.name.toLowerCase()
      );
    }
    return true;
  });

  // Multi-Seller Store Handling
  const currentStore =
    stores.find((s) => s.id === currentStoreId) || stores[0];

  const updateCurrentStore = (updates: Partial<SellerStore>) => {
    setStores((prev) =>
      prev.map((s) => (s.id === currentStoreId ? { ...s, ...updates } : s))
    );
  };

  const createStore = (storeData: Partial<SellerStore>): SellerStore => {
    const newStore: SellerStore = {
      id: `store-${Date.now()}`,
      name: storeData.name || 'Apna Online Store',
      slug: (storeData.name || 'apna-store')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-'),
      ownerName: storeData.ownerName || currentUser.name || 'New Indian Seller',
      email: storeData.email || currentUser.email || 'seller@store.in',
      mobile: storeData.mobile || `+91 ${currentUser.mobile}`,
      gstin: storeData.gstin || '27AAAAA0000A1Z5',
      city: storeData.city || 'New Delhi',
      state: storeData.state || 'Delhi',
      status: 'active',
      commissionRate: 5,
      totalRevenue: 0,
      totalOrders: 0,
      productCount: 1,
      joinedDate: new Date().toISOString().split('T')[0],
      razorpayKeyId: 'rzp_test_new_' + Math.floor(Math.random() * 1000),
      razorpayKeySecret: '••••••••••••••••',
      isTestMode: true,
      codEnabled: true,
      codCharge: 40,
      freeShippingAbove: 599,
      shippingPartner: 'delhivery',
      whatsappSupportNumber: storeData.mobile || '+919999900000',
      ...storeData,
    };
    setStores((prev) => [...prev, newStore]);
    setCurrentStoreId(newStore.id);

    // If customer created a store, elevate role to seller
    if (currentUser.role === 'customer') {
      setCurrentUser((prev) => ({
        ...prev,
        role: 'seller',
        storeId: newStore.id,
        storeName: newStore.name,
      }));
    }

    return newStore;
  };

  const updateSuperAdminStats = (
    updates: Partial<typeof SUPER_ADMIN_INITIAL_STATS>
  ) => {
    setSuperAdminStats((prev) => ({ ...prev, ...updates }));
  };

  // Auth Operations
  const loginUser = (userData: Partial<AppUser>) => {
    const updatedUser: AppUser = {
      id: userData.id || `usr-${Date.now()}`,
      name: userData.name || 'Valued Customer',
      email: userData.email || '',
      mobile: userData.mobile || '',
      role: userData.role || 'customer',
      storeId: userData.storeId,
      storeName: userData.storeName,
      isLoggedIn: true,
      city: userData.city || '',
      state: userData.state || 'Delhi',
      pincode: userData.pincode || '',
      savedAddresses: userData.savedAddresses || currentUser.savedAddresses,
    };

    setCurrentUser(updatedUser);
    if (updatedUser.storeId) {
      setCurrentStoreId(updatedUser.storeId);
    }
    setIsLoginModalOpen(false);
  };

  const logoutUser = () => {
    setCurrentUser(INITIAL_GUEST_USER);
    try {
      localStorage.removeItem('ananya_user_v3');
      localStorage.removeItem('ananya_user_v2');
    } catch {
      // ignore
    }
    setActiveTab('storefront');
  };

  const switchDemoRole = (role: UserRole) => {
    if (role === 'seller') setActiveTab('seller-admin');
    else if (role === 'super_admin') setActiveTab('admin');
    else setActiveTab('storefront');
  };

  const saveUserAddress = (address: CustomerAddress) => {
    setCurrentUser((prev) => ({
      ...prev,
      savedAddresses: [address, ...(prev.savedAddresses || [])],
    }));
  };

  const deleteUserAddress = (index: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      savedAddresses: (prev.savedAddresses || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        updateTheme,
        applyPreset,
        resetTheme,
        exportThemeJson,
        importThemeJson,

        language,
        setLanguage,
        toggleLanguage,

        activeTab,
        setActiveTab,
        navigateToProtectedTab,
        selectedProduct,
        setSelectedProduct,
        sharingProduct,
        setSharingProduct,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        authModalMode,
        setAuthModalMode,
        authGateMessage,
        setAuthGateMessage,
        trackingOrderId,
        setTrackingOrderId,
        lastPlacedOrder,
        setLastPlacedOrder,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductSoldOut,
        toggleProductPause,
        duplicateProduct,

        cart,
        addToCart,
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

        wishlist,
        toggleWishlist,
        isInWishlist,

        orders,
        customerOrders,
        placeOrder,
        updateOrderStatus,

        stores,
        currentStore,
        setCurrentStoreId,
        updateCurrentStore,
        createStore,

        // Unified Admin & Single Store
        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        storeSettings,
        updateStoreSettings,

        inventoryMovements,
        adjustStock,

        auditLogs,
        addAuditLog,

        adminNotifications,
        markNotificationRead,

        availableCoupons,
        addCoupon,
        deleteCoupon,

        superAdminStats,
        updateSuperAdminStats,

        currentUser,
        loginUser,
        logoutUser,
        switchDemoRole,
        saveUserAddress,
        deleteUserAddress,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
