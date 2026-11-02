import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Boxes,
  Users,
  CreditCard,
  Truck,
  TicketPercent,
  Palette,
  FileText,
  BarChart3,
  Settings,
  History,
  Store,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Copy,
  ChevronRight,
  ChevronLeft,
  X,
  Printer,
  Sparkles,
  Layers,
  Percent,
  Sliders,
  DollarSign,
  Tag,
  Maximize2,
  ArrowRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Globe,
  UploadCloud,
  Check,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, InventoryMovement, Coupon, Category, ProductVariantItem } from '../types';

type AdminSection =
  | 'dashboard'
  | 'products'
  | 'add-product'
  | 'categories'
  | 'orders'
  | 'inventory'
  | 'customers'
  | 'coupons'
  | 'shipping'
  | 'theme'
  | 'settings'
  | 'audit-logs';

export const UnifiedAdminPanel: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductSoldOut,
    toggleProductPause,
    orders,
    updateOrderStatus,
    categories,
    addCategory,
    inventoryMovements,
    adjustStock,
    storeSettings,
    updateStoreSettings,
    auditLogs,
    adminNotifications,
    markNotificationRead,
    availableCoupons,
    addCoupon,
    deleteCoupon,
    theme,
    updateTheme,
    currentUser,
    setActiveTab,
    logoutUser,
  } = useStore();

  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedOrderForFulfill, setSelectedOrderForFulfill] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [courierInput, setCourierInput] = useState<'Delhivery' | 'Shiprocket' | 'Bluedart'>('Delhivery');
  
  // Stock Adjustment Modal
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [stockAdjustmentQty, setStockAdjustmentQty] = useState<number>(0);
  const [stockAdjustmentReason, setStockAdjustmentReason] = useState<InventoryMovement['reason']>('restock');

  // Filter States
  const [productFilter, setProductFilter] = useState<'all' | 'active' | 'low_stock' | 'sold_out' | 'paused'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // 10-Step Wizard State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardData, setWizardData] = useState<{
    title: string;
    titleHi: string;
    subtitle: string;
    slug: string;
    sku: string;
    barcode: string;
    brand: string;
    category: string;
    categoryHi: string;
    subcategory: string;
    tags: string;
    description: string;
    descriptionHi: string;
    status: 'active' | 'draft' | 'paused';
    isFeatured: boolean;
    isNewArrival: boolean;
    isDealOfTheDay: boolean;
    images: string[];
    mrp: number;
    price: number;
    purchaseCost: number;
    gstRate: number;
    hsnCode: string;
    taxInclusive: boolean;
    colors: string[];
    sizes: string[];
    variants: ProductVariantItem[];
    stock: number;
    lowStockThreshold: number;
    allowBackorders: boolean;
    warehouseLocation: string;
    trackInventory: boolean;
    specs: Record<string, string>;
    weightGrams: number;
    dimensions: { length: number; width: number; height: number };
    shippingClass: 'standard' | 'express' | 'fragile';
    freeShipping: boolean;
    codAvailable: boolean;
    dispatchTime: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    relatedProductIds: string[];
  }>({
    title: '',
    titleHi: '',
    subtitle: 'Exclusive Designer Piece · Pure Handloom',
    slug: '',
    sku: '',
    barcode: '',
    brand: 'Ananya Collection',
    category: 'ethnic-wear',
    categoryHi: 'एथनिक एवं उत्सव',
    subcategory: 'sarees',
    tags: 'saree, silk, banarasi, bridal, festive, wedding',
    description: 'Exquisite handcrafted attire meticulously woven with authentic gold zari threads and pure soft silk, curated specially for celebratory elegance.',
    descriptionHi: 'शुद्ध सिल्क और ज़री की बारीक कारीगरी से निर्मित आकर्षक वस्त्र, विशेष अवसरों के लिए श्रेष्ठ।',
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isDealOfTheDay: false,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    mrp: 5999,
    price: 3499,
    purchaseCost: 1800,
    gstRate: 5,
    hsnCode: '5007',
    taxInclusive: true,
    colors: ['Royal Red', 'Emerald Green', 'Mustard Gold'],
    sizes: ['Free Size (5.5m Saree + 0.8m Blouse)'],
    variants: [
      { id: 'v-1', sku: 'AC-SAR-RED-01', color: 'Royal Red', size: 'Free Size', stock: 15, available: true },
      { id: 'v-2', sku: 'AC-SAR-GRN-01', color: 'Emerald Green', size: 'Free Size', stock: 10, available: true },
      { id: 'v-3', sku: 'AC-SAR-GLD-01', color: 'Mustard Gold', size: 'Free Size', priceOverride: 3699, stock: 8, available: true }
    ],
    stock: 33,
    lowStockThreshold: 5,
    allowBackorders: false,
    warehouseLocation: 'Rohini Main Store · Rack A-04',
    trackInventory: true,
    specs: {
      'Fabric': 'Pure Katan Silk',
      'Length': '5.5 Meters Saree + 0.8 Meter Blouse Piece',
      'Zari Type': 'Tested Antique Gold Zari',
      'Weave Technique': 'Handloom Kadhwa Weave',
      'Blouse Included': 'Yes (Unstitched Running Piece)',
      'Occasion': 'Bridal, Wedding Reception, Diwali',
      'Wash Care': 'Dry Clean Recommended Only'
    },
    weightGrams: 850,
    dimensions: { length: 35, width: 25, height: 5 },
    shippingClass: 'standard',
    freeShipping: true,
    codAvailable: true,
    dispatchTime: 'Ships within 24-48 Hours from Rohini Boutique',
    seoTitle: 'Designer Silk Sarees Online - Ananya Collection Rohini',
    seoDescription: 'Shop handcrafted bridal silk sarees and ethnic suits directly from Ananya Collection, Rohini Delhi. Free pan-India delivery.',
    seoKeywords: 'silk saree, banarasi saree, bridal lehenga, designer suit, rohini delhi',
    relatedProductIds: []
  });

  // Calculate KPIs
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter((o) => o.orderStatus === 'placed' || o.orderStatus === 'confirmed' || o.orderStatus === 'packed');
  }, [orders]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.stock <= 0 || p.status === 'sold_out').length;
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (productFilter === 'active') return p.status === 'active';
      if (productFilter === 'low_stock') return p.stock > 0 && p.stock <= 10;
      if (productFilter === 'sold_out') return p.stock <= 0 || p.status === 'sold_out';
      if (productFilter === 'paused') return p.status === 'paused';
      return true;
    });
  }, [products, searchQuery, productFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.mobile.includes(searchQuery);

      if (!matchesSearch) return false;
      if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
      return true;
    });
  }, [orders, searchQuery, orderStatusFilter]);

  // Reset Wizard for New Product
  const startNewProductWizard = () => {
    setEditingProduct(null);
    setWizardStep(1);
    setWizardData({
      title: '',
      titleHi: '',
      subtitle: 'Exclusive Designer Piece · Pure Handloom',
      slug: '',
      sku: `AC-${Date.now().toString().slice(-6)}`,
      barcode: `890${Date.now().toString().slice(-9)}`,
      brand: 'Ananya Collection',
      category: 'ethnic-wear',
      categoryHi: 'एथनिक एवं उत्सव',
      subcategory: 'sarees',
      tags: 'saree, silk, bridal, ethnic',
      description: 'Handcrafted luxury attire curated for festive celebrations and wedding wear.',
      descriptionHi: 'शाही कारीगरी और शुद्ध फैब्रिक से तैयार वस्त्र।',
      status: 'active',
      isFeatured: true,
      isNewArrival: true,
      isDealOfTheDay: false,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
      ],
      mrp: 4999,
      price: 2999,
      purchaseCost: 1500,
      gstRate: 5,
      hsnCode: '5007',
      taxInclusive: true,
      colors: ['Maroon Gold', 'Rani Pink'],
      sizes: ['Free Size'],
      variants: [],
      stock: 20,
      lowStockThreshold: 5,
      allowBackorders: false,
      warehouseLocation: 'Rohini Main Store · Rack A-02',
      trackInventory: true,
      specs: {
        'Fabric': 'Pure Silk',
        'Occasion': 'Festive / Wedding',
        'Wash Care': 'Dry Clean Only'
      },
      weightGrams: 750,
      dimensions: { length: 30, width: 20, height: 5 },
      shippingClass: 'standard',
      freeShipping: true,
      codAvailable: true,
      dispatchTime: 'Ships within 24-48 Hours from Rohini Boutique',
      seoTitle: 'Buy Handcrafted Ethnic Wear - Ananya Collection',
      seoDescription: 'Authentic Indian ethnic wear and bridal couture from Rohini, Delhi.',
      seoKeywords: 'ethnic wear, sarees, suites, ananya collection',
      relatedProductIds: []
    });
    setActiveSection('add-product');
  };

  // Populate Wizard for Editing
  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setWizardStep(1);
    setWizardData({
      title: prod.title,
      titleHi: prod.titleHi || prod.title,
      subtitle: prod.subtitle || '',
      slug: prod.slug || prod.id,
      sku: prod.sku,
      barcode: prod.barcode || '',
      brand: prod.brand,
      category: prod.category,
      categoryHi: prod.categoryHi,
      subcategory: prod.subcategory || '',
      tags: prod.tags?.join(', ') || '',
      description: prod.description,
      descriptionHi: prod.descriptionHi || '',
      status: prod.status === 'sold_out' ? 'active' : prod.status,
      isFeatured: !!prod.isBestseller,
      isNewArrival: !!prod.isNewArrival,
      isDealOfTheDay: !!prod.isDealOfTheDay,
      images: prod.images.length ? prod.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      mrp: prod.mrp,
      price: prod.price,
      purchaseCost: prod.purchaseCost || Math.round(prod.price * 0.55),
      gstRate: prod.gstRate || 5,
      hsnCode: prod.hsnCode || '5007',
      taxInclusive: true,
      colors: prod.colors || ['Standard'],
      sizes: prod.sizes || ['Free Size'],
      variants: prod.variantMatrix || [],
      stock: prod.stock,
      lowStockThreshold: prod.inventoryDetails?.lowStockThreshold || 5,
      allowBackorders: prod.inventoryDetails?.allowBackorders || false,
      warehouseLocation: prod.inventoryDetails?.warehouseLocation || 'Rohini Store',
      trackInventory: prod.inventoryDetails?.trackInventory ?? true,
      specs: prod.specs || {},
      weightGrams: prod.shippingDetails?.weightGrams || 800,
      dimensions: {
        length: prod.shippingDetails?.lengthCm || 30,
        width: prod.shippingDetails?.widthCm || 25,
        height: prod.shippingDetails?.heightCm || 5,
      },
      shippingClass: prod.shippingDetails?.shippingClass === 'heavy' ? 'fragile' : prod.shippingDetails?.shippingClass || 'standard',
      freeShipping: prod.shippingDetails?.freeShipping ?? true,
      codAvailable: prod.codAvailable ?? true,
      dispatchTime: prod.shippingDetails?.dispatchTime || 'Ships in 24-48 Hours',
      seoTitle: prod.seoSettings?.title || prod.title,
      seoDescription: prod.seoSettings?.description || prod.description.slice(0, 150),
      seoKeywords: prod.seoSettings?.keywords || prod.tags?.join(', ') || '',
      relatedProductIds: prod.relatedProductIds || []
    });
    setActiveSection('add-product');
  };

  // Submit Wizard
  const handlePublishProduct = () => {
    const discountPercent = Math.max(0, Math.round(((wizardData.mrp - wizardData.price) / wizardData.mrp) * 100));
    const productPayload: Omit<Product, 'id'> = {
      storeId: 'store-1',
      storeName: 'Ananya Collection',
      title: wizardData.title || 'Untitled Designer Piece',
      titleHi: wizardData.titleHi || wizardData.title,
      subtitle: wizardData.subtitle,
      slug: wizardData.slug || wizardData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: wizardData.sku || `AC-${Date.now().toString().slice(-6)}`,
      barcode: wizardData.barcode,
      brand: wizardData.brand || 'Ananya Collection',
      price: wizardData.price,
      mrp: wizardData.mrp,
      purchaseCost: wizardData.purchaseCost,
      discountPercent,
      category: wizardData.category,
      categoryHi: wizardData.categoryHi,
      subcategory: wizardData.subcategory,
      description: wizardData.description,
      descriptionHi: wizardData.descriptionHi,
      status: wizardData.stock === 0 ? 'sold_out' : wizardData.status,
      stock: wizardData.stock,
      gstRate: wizardData.gstRate,
      hsnCode: wizardData.hsnCode,
      images: wizardData.images.length ? wizardData.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      rating: 5.0,
      reviewCount: 1,
      isBestseller: wizardData.isFeatured,
      isNewArrival: wizardData.isNewArrival,
      isDealOfTheDay: wizardData.isDealOfTheDay,
      colors: wizardData.colors,
      sizes: wizardData.sizes,
      variantMatrix: wizardData.variants,
      specs: wizardData.specs,
      highlights: [
        '100% Authentic Handcrafted Quality Guaranteed',
        'Direct from Ananya Collection Flagship Studio (Rohini, Delhi)',
        'Delicate Embroidery & Premium Drape',
        'Express Doorstep Delivery Across Delhi NCR & All India'
      ],
      highlightsHi: [
        '100% प्रामाणिक हस्तशिल्प और प्रीमियम फैब्रिक',
        'सीधे अनन्य कलेक्शन रोहिणी स्टोर से',
        'आकर्षक फिनिशिंग एवं टिकाऊ रंग',
        'पूरे भारत में सुरक्षित व तीव्र डिलीवरी'
      ],
      returnPolicyDays: 7,
      codAvailable: wizardData.codAvailable,
      shippingDetails: {
        weightGrams: wizardData.weightGrams,
        lengthCm: wizardData.dimensions.length,
        widthCm: wizardData.dimensions.width,
        heightCm: wizardData.dimensions.height,
        shippingClass: wizardData.shippingClass === 'fragile' ? 'heavy' : wizardData.shippingClass,
        freeShipping: wizardData.freeShipping,
        codAvailable: wizardData.codAvailable,
        dispatchTime: wizardData.dispatchTime
      },
      inventoryDetails: {
        stockQuantity: wizardData.stock,
        reservedStock: 0,
        trackInventory: wizardData.trackInventory,
        lowStockThreshold: wizardData.lowStockThreshold,
        allowBackorders: wizardData.allowBackorders,
        warehouseLocation: wizardData.warehouseLocation
      },
      seoSettings: {
        title: wizardData.seoTitle,
        description: wizardData.seoDescription,
        keywords: wizardData.seoKeywords,
        slug: wizardData.slug || wizardData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        index: true
      }
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setActiveSection('products');
    setEditingProduct(null);
  };

  // Quick Stock Adjustment Submit
  const handleStockAdjustmentSubmit = () => {
    if (!stockModalProduct) return;
    adjustStock(stockModalProduct.id, stockAdjustmentQty, stockAdjustmentReason);
    setStockModalProduct(null);
  };

  // Order Fulfillment Submit
  const handleFulfillOrderSubmit = () => {
    if (!selectedOrderForFulfill) return;
    const finalTracking = trackingNumberInput || `DLV-${Date.now().toString().slice(-8)}`;
    updateOrderStatus(selectedOrderForFulfill.id, 'shipped', finalTracking);
    setSelectedOrderForFulfill(null);
    setTrackingNumberInput('');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-stone-900 flex flex-col font-sans antialiased">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand & Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors hidden md:flex"
              title="Toggle Sidebar"
            >
              <Sliders className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors md:hidden"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#B8860B] overflow-hidden bg-white shadow-xs shrink-0">
                <img src="/logo.jpg" alt="Ananya Collection" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-serif font-bold tracking-tight text-stone-900">
                    Ananya Collection
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    FLAGSHIP ADMIN
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  Unified Store Control · Rohini, Delhi
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search products, orders (ID, mobile), SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={startNewProductWizard}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#B8860B] hover:bg-[#996515] text-white shadow-xs transition-all hover:shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 relative transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {adminNotifications.some((n) => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Notifications</h4>
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                      {adminNotifications.filter((n) => !n.read).length} unread
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-50">
                    {adminNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 text-xs hover:bg-stone-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-stone-800 mb-0.5">
                          <span>{notif.title}</span>
                          <span className="text-[10px] text-stone-400 font-normal">{notif.timestamp}</span>
                        </div>
                        <p className="text-stone-500 text-[11px] leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View Storefront Pill */}
            <button
              onClick={() => setActiveTab('storefront')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Open Customer Storefront"
            >
              <Store className="w-4 h-4 text-[#B8860B]" />
              <span className="hidden sm:inline">Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`bg-white border-r border-stone-200 shrink-0 transition-all duration-300 flex flex-col justify-between z-30 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } ${mobileMenuOpen ? 'fixed inset-y-0 left-0 shadow-2xl z-50' : 'hidden md:flex'}`}
        >
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {/* Store Badge */}
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center shrink-0 font-serif font-bold text-sm">
                AC
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-stone-900 truncate">Ananya Flagship</div>
                  <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    Live & Online (Rohini)
                  </div>
                </div>
              )}
            </div>

            {/* Nav Groups */}
            <nav className="space-y-4">
              {/* MAIN */}
              <div>
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Main
                  </p>
                )}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveSection('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'dashboard'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Dashboard Overview</span>}
                  </button>
                </div>
              </div>

              {/* CATALOG */}
              <div>
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Catalog
                  </p>
                )}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveSection('products');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'products'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>All Products</span>}
                    </div>
                    {!sidebarCollapsed && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-stone-100 rounded text-stone-600">
                        {products.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      startNewProductWizard();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'add-product'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4 shrink-0 text-[#B8860B]" />
                    {!sidebarCollapsed && <span>Add Product (10 Steps)</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection('categories');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'categories'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <FolderTree className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Categories</span>}
                  </button>
                </div>
              </div>

              {/* SALES */}
              <div>
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Sales
                  </p>
                )}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveSection('orders');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'orders'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Orders & Shipments</span>}
                    </div>
                    {!sidebarCollapsed && pendingOrders.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded">
                        {pendingOrders.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* INVENTORY */}
              <div>
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Inventory
                  </p>
                )}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveSection('inventory');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'inventory'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Boxes className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>Stock & Adjustments</span>}
                    </div>
                    {!sidebarCollapsed && lowStockCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded">
                        {lowStockCount} low
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* CUSTOMERS & MARKETING */}
              <div>
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Marketing & Growth
                  </p>
                )}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveSection('customers');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'customers'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Customers Directory</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection('coupons');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'coupons'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <TicketPercent className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Coupons & Offers</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection('theme');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'theme'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <Palette className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Theme & Branding</span>}
                  </button>
                </div>
              </div>

              {/* SYSTEM */}
              <div>
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    System
                  </p>
                )}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveSection('settings');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'settings'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Store Settings & GST</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection('audit-logs');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === 'audit-logs'
                        ? 'bg-[#B8860B]/10 text-[#B8860B] font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <History className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Audit Trail</span>}
                  </button>
                </div>
              </div>
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-stone-200 space-y-1">
            <button
              onClick={() => setActiveTab('storefront')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#B8860B]" />
              {!sidebarCollapsed && <span>Visit Storefront</span>}
            </button>

            <button
              onClick={() => {
                logoutUser();
                setActiveTab('storefront');
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Exit Admin</span>}
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#FBFBFA] p-4 sm:p-6 lg:p-8">
          {/* View: DASHBOARD */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Welcome Banner */}
              <div className="bg-linear-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-stone-800">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-3">
                      <Sparkles className="w-3.5 h-3.5" /> Ananya Collection · Rohini Flagship Store
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                      Namaste, {currentUser.name || 'Store Manager'}
                    </h2>
                    <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                      Your single-store management hub is active. Review today&apos;s ethnic wear orders, manage live stock, and publish new collections.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={startNewProductWizard}
                      className="px-4 py-2.5 rounded-xl bg-[#B8860B] hover:bg-[#996515] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" /> Add New Ethnic Piece
                    </button>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" /> View Orders ({orders.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Gross Revenue</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-stone-900">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last week
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-stone-900">{orders.length}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium mt-1">
                    <span className="font-semibold text-amber-700">{pendingOrders.length}</span> awaiting dispatch
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Catalog Size</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-stone-900">{products.length}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium mt-1">
                    Across {categories.length} Ethnic Categories
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Inventory Health</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Boxes className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-stone-900">
                    {lowStockCount > 0 ? (
                      <span className="text-rose-600">{lowStockCount} Low</span>
                    ) : (
                      <span className="text-emerald-600">Optimal</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium mt-1">
                    {outOfStockCount} items currently sold out
                  </div>
                </div>
              </div>

              {/* Two Column Section: Recent Orders & Quick Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                  <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">Recent Customer Orders</h3>
                      <p className="text-xs text-stone-500">Live fulfillment status for Delhi NCR & India orders</p>
                    </div>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className="text-xs font-semibold text-[#B8860B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All ({orders.length}) <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-stone-700">
                      <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-400 border-b border-stone-100">
                        <tr>
                          <th className="px-6 py-3">Order ID</th>
                          <th className="px-6 py-3">Customer</th>
                          <th className="px-6 py-3">Items</th>
                          <th className="px-6 py-3">Amount</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="px-6 py-3.5 font-mono text-stone-900 font-bold">
                              {order.id}
                            </td>
                            <td className="px-6 py-3.5">
                              <div className="font-semibold text-stone-800">{order.customer.fullName}</div>
                              <div className="text-[11px] text-stone-400">{order.customer.city}, {order.customer.state}</div>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="text-stone-600">
                                {order.items.reduce((s, i) => s + i.quantity, 0)} pcs
                              </span>
                            </td>
                            <td className="px-6 py-3.5 font-bold text-stone-900">
                              ₹{order.total.toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-3.5">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  order.orderStatus === 'delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : order.orderStatus === 'shipped'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : order.orderStatus === 'cancelled'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {order.orderStatus.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-right space-x-1">
                              <button
                                onClick={() => setSelectedOrderForInvoice(order)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                                title="Print GST Invoice"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSelectedOrderForFulfill(order)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-[#B8860B] bg-amber-50 hover:bg-amber-100 rounded-md transition-colors cursor-pointer"
                              >
                                Fulfill
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right 1 Col: Low Stock & Audit Alerts */}
                <div className="space-y-6">
                  {/* Low Stock Watch */}
                  <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                          Low Stock Alerts
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                        {lowStockCount} items
                      </span>
                    </div>

                    <div className="space-y-3">
                      {products
                        .filter((p) => p.stock <= 10)
                        .slice(0, 4)
                        .map((prod) => (
                          <div
                            key={prod.id}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs"
                          >
                            <div className="overflow-hidden pr-2">
                              <div className="font-semibold text-stone-900 truncate">{prod.title}</div>
                              <div className="text-[10px] text-stone-400 font-mono">SKU: {prod.sku}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <span
                                className={`text-xs font-bold block ${
                                  prod.stock === 0 ? 'text-rose-600' : 'text-amber-700'
                                }`}
                              >
                                {prod.stock === 0 ? 'Sold Out' : `${prod.stock} left`}
                              </span>
                              <button
                                onClick={() => {
                                  setStockModalProduct(prod);
                                  setStockAdjustmentQty(prod.stock + 10);
                                }}
                                className="text-[10px] text-[#B8860B] font-semibold hover:underline cursor-pointer"
                              >
                                Restock +
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Store Operations Quick Info */}
                  <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-3">
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#B8860B]" /> Rohini Flagship Boutique
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {storeSettings.addressLine}, {storeSettings.city} - {storeSettings.pincode}
                    </p>
                    <div className="text-[11px] text-stone-500 space-y-1 border-t border-stone-100 pt-2">
                      <div className="flex justify-between">
                        <span>GSTIN:</span>
                        <span className="font-mono font-medium text-stone-800">{storeSettings.gstin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Free Shipping:</span>
                        <span className="font-semibold text-stone-800">Above ₹{storeSettings.freeShippingAbove}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Logistics Partner:</span>
                        <span className="font-semibold text-emerald-700 capitalize">{storeSettings.shippingPartner}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View: ALL PRODUCTS */}
          {activeSection === 'products' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">Product Catalog</h2>
                  <p className="text-xs text-stone-500">Manage all single-store inventory, variants, and pricing</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={startNewProductWizard}
                    className="px-4 py-2 bg-[#B8860B] hover:bg-[#996515] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" /> Add New Product
                  </button>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setProductFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      productFilter === 'all'
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    All ({products.length})
                  </button>
                  <button
                    onClick={() => setProductFilter('active')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      productFilter === 'active'
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Active ({products.filter((p) => p.status === 'active').length})
                  </button>
                  <button
                    onClick={() => setProductFilter('low_stock')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      productFilter === 'low_stock'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    Low Stock ({lowStockCount})
                  </button>
                  <button
                    onClick={() => setProductFilter('sold_out')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      productFilter === 'sold_out'
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                    }`}
                  >
                    Sold Out ({outOfStockCount})
                  </button>
                </div>

                <div className="w-full sm:w-64">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Filter product table..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-[#B8860B]"
                    />
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-400 border-b border-stone-100">
                      <tr>
                        <th className="px-6 py-3.5">Product</th>
                        <th className="px-4 py-3.5">Category & SKU</th>
                        <th className="px-4 py-3.5">Price & Margin</th>
                        <th className="px-4 py-3.5">Stock</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {filteredProducts.map((prod) => {
                        const cost = prod.purchaseCost || Math.round(prod.price * 0.55);
                        const marginPercent = Math.round(((prod.price - cost) / prod.price) * 100);

                        return (
                          <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                            {/* Product Info */}
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                                  <img
                                    src={prod.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                                    alt={prod.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="max-w-xs">
                                  <div className="font-semibold text-stone-900 truncate">{prod.title}</div>
                                  <div className="text-[11px] text-stone-400 font-serif line-clamp-1">{prod.brand}</div>
                                </div>
                              </div>
                            </td>

                            {/* Category & SKU */}
                            <td className="px-4 py-3.5">
                              <span className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px] font-medium mb-0.5">
                                {prod.category}
                              </span>
                              <div className="font-mono text-[11px] text-stone-400">{prod.sku}</div>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3.5">
                              <div className="font-bold text-stone-900">₹{prod.price.toLocaleString('en-IN')}</div>
                              <div className="text-[11px] text-stone-400 line-through">MRP ₹{prod.mrp.toLocaleString('en-IN')}</div>
                              <div className="text-[10px] text-emerald-600 font-bold">Margin: ~{marginPercent}%</div>
                            </td>

                            {/* Stock */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold ${
                                    prod.stock <= 0
                                      ? 'text-rose-600'
                                      : prod.stock <= 10
                                      ? 'text-amber-600'
                                      : 'text-stone-800'
                                  }`}
                                >
                                  {prod.stock} in stock
                                </span>
                                <button
                                  onClick={() => {
                                    setStockModalProduct(prod);
                                    setStockAdjustmentQty(prod.stock);
                                  }}
                                  className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
                                  title="Quick stock edit"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  prod.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : prod.status === 'sold_out'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                                }`}
                              >
                                {prod.status.replace('_', ' ')}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-3.5 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => openEditProduct(prod)}
                                className="p-1.5 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => toggleProductSoldOut(prod.id)}
                                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                  prod.status === 'sold_out'
                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                    : 'text-amber-600 hover:bg-amber-50'
                                }`}
                                title={prod.status === 'sold_out' ? 'Mark Available' : 'Mark Sold Out'}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(prod.id)}
                                className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* View: 10-STEP PRODUCT WIZARD */}
          {activeSection === 'add-product' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Wizard Title & Exit */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                    {editingProduct ? 'Edit Product Details' : 'Professional 10-Step Product Management Wizard'}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Step {wizardStep} of 10 — Ananya Collection Central Catalog
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection('products')}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel & Exit
                </button>
              </div>

              {/* Steps Progress Ribbon */}
              <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-xs overflow-x-auto">
                <div className="flex items-center gap-1 min-w-[700px]">
                  {[
                    '1. Basic Info',
                    '2. Media',
                    '3. Pricing',
                    '4. Variants',
                    '5. Stock',
                    '6. Specs',
                    '7. Shipping',
                    '8. SEO',
                    '9. Upsells',
                    '10. Review'
                  ].map((stepLabel, idx) => {
                    const stepNum = idx + 1;
                    const isActive = wizardStep === stepNum;
                    const isDone = wizardStep > stepNum;

                    return (
                      <button
                        key={stepLabel}
                        onClick={() => setWizardStep(stepNum)}
                        className={`flex-1 py-2 px-2 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#B8860B] text-white shadow-xs'
                            : isDone
                            ? 'bg-amber-50 text-amber-900'
                            : 'text-stone-400 hover:bg-stone-50'
                        }`}
                      >
                        {stepLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wizard Steps Content */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
                {/* STEP 1: Basic Information */}
                {wizardStep === 1 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                      <Tag className="w-4 h-4 text-[#B8860B]" /> Step 1: Product Basics & Classification
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Product Title (English) *</label>
                        <input
                          type="text"
                          value={wizardData.title}
                          onChange={(e) => setWizardData({ ...wizardData, title: e.target.value })}
                          placeholder="e.g. Royal Maroon Pure Katan Banarasi Silk Saree"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-200 rounded-lg focus:ring-1 focus:ring-[#B8860B] focus:border-[#B8860B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Product Title (Hindi)</label>
                        <input
                          type="text"
                          value={wizardData.titleHi}
                          onChange={(e) => setWizardData({ ...wizardData, titleHi: e.target.value })}
                          placeholder="e.g. शाही महरून शुद्ध कातान बनारसी सिल्क साड़ी"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-200 rounded-lg focus:ring-1 focus:ring-[#B8860B] focus:border-[#B8860B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">SKU Code *</label>
                        <input
                          type="text"
                          value={wizardData.sku}
                          onChange={(e) => setWizardData({ ...wizardData, sku: e.target.value })}
                          placeholder="e.g. AC-SAR-KTN-01"
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Brand Name</label>
                        <input
                          type="text"
                          value={wizardData.brand}
                          onChange={(e) => setWizardData({ ...wizardData, brand: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                        <select
                          value={wizardData.category}
                          onChange={(e) => setWizardData({ ...wizardData, category: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Subcategory / Department</label>
                      <input
                        type="text"
                        value={wizardData.subcategory}
                        onChange={(e) => setWizardData({ ...wizardData, subcategory: e.target.value })}
                        placeholder="e.g. Sarees, Bridal Lehengas, Suits"
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Description (English)</label>
                      <textarea
                        rows={3}
                        value={wizardData.description}
                        onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wizardData.isFeatured}
                          onChange={(e) => setWizardData({ ...wizardData, isFeatured: e.target.checked })}
                          className="rounded text-[#B8860B]"
                        />
                        <span>Featured on Homepage</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wizardData.isNewArrival}
                          onChange={(e) => setWizardData({ ...wizardData, isNewArrival: e.target.checked })}
                          className="rounded text-[#B8860B]"
                        />
                        <span>Mark as New Arrival</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wizardData.isDealOfTheDay}
                          onChange={(e) => setWizardData({ ...wizardData, isDealOfTheDay: e.target.checked })}
                          className="rounded text-[#B8860B]"
                        />
                        <span>Festive Deal of the Day</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 2: Images & Media */}
                {wizardStep === 2 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                      <UploadCloud className="w-4 h-4 text-[#B8860B]" /> Step 2: High-Resolution Images & Angles
                    </h3>

                    <p className="text-xs text-stone-500">
                      Add front drape, pallu detail, blouse, and zoom shots for luxury customer presentation.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {wizardData.images.map((imgUrl, i) => (
                        <div key={i} className="relative rounded-xl border border-stone-200 overflow-hidden group bg-stone-50">
                          <img src={imgUrl} alt={`Upload ${i + 1}`} className="w-full h-36 object-cover" />
                          <button
                            onClick={() => {
                              const updated = wizardData.images.filter((_, idx) => idx !== i);
                              setWizardData({ ...wizardData, images: updated });
                            }}
                            className="absolute top-2 right-2 p-1 bg-white/90 text-rose-600 rounded-full shadow-xs hover:bg-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded font-medium">
                            {i === 0 ? 'Primary / Front' : `Angle #${i + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                      <label className="block text-xs font-bold text-stone-700 mb-2">Add Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="new-img-url"
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const inp = document.getElementById('new-img-url') as HTMLInputElement;
                            if (inp && inp.value.trim()) {
                              setWizardData({
                                ...wizardData,
                                images: [...wizardData.images, inp.value.trim()]
                              });
                              inp.value = '';
                            }
                          }}
                          className="px-4 py-1.5 bg-[#B8860B] text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Add URL
                        </button>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setWizardData({
                              ...wizardData,
                              images: [
                                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                                'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
                                'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
                              ]
                            });
                          }}
                          className="text-[11px] text-[#B8860B] font-semibold hover:underline"
                        >
                          + Load Designer Banarasi Photoset Preset
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Pricing & Tax */}
                {wizardStep === 3 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                      <DollarSign className="w-4 h-4 text-[#B8860B]" /> Step 3: Pricing, Cost & Profit Margin Analysis
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">MRP (Strikethrough Price ₹) *</label>
                        <input
                          type="number"
                          value={wizardData.mrp}
                          onChange={(e) => setWizardData({ ...wizardData, mrp: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Selling Price (Customer Pays ₹) *</label>
                        <input
                          type="number"
                          value={wizardData.price}
                          onChange={(e) => setWizardData({ ...wizardData, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg font-bold text-[#B8860B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Boutique Purchase Cost (₹)</label>
                        <input
                          type="number"
                          value={wizardData.purchaseCost}
                          onChange={(e) => setWizardData({ ...wizardData, purchaseCost: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Auto Profit Calculation Card */}
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Gross Profit per Unit</span>
                        <div className="text-lg font-bold text-stone-900">
                          ₹{(wizardData.price - wizardData.purchaseCost).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Profit Margin</span>
                        <div className="text-lg font-bold text-emerald-700">
                          {Math.round(((wizardData.price - wizardData.purchaseCost) / (wizardData.price || 1)) * 100)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Customer Discount</span>
                        <div className="text-lg font-bold text-rose-600">
                          {Math.round(((wizardData.mrp - wizardData.price) / (wizardData.mrp || 1)) * 100)}% OFF
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">GST Tax Rate</label>
                        <select
                          value={wizardData.gstRate}
                          onChange={(e) => setWizardData({ ...wizardData, gstRate: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white"
                        >
                          <option value={5}>5% (Standard Handloom & Ethnic Textiles)</option>
                          <option value={12}>12% (Apparel with price &gt; ₹1,000)</option>
                          <option value={18}>18% (Luxury & Lifestyle)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">HSN Code</label>
                        <input
                          type="text"
                          value={wizardData.hsnCode}
                          onChange={(e) => setWizardData({ ...wizardData, hsnCode: e.target.value })}
                          placeholder="5007 (Woven Silk Fabrics)"
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Variants */}
                {wizardStep === 4 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                      <Layers className="w-4 h-4 text-[#B8860B]" /> Step 4: Color & Size Matrix
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Available Colors (Comma separated)</label>
                      <input
                        type="text"
                        value={wizardData.colors.join(', ')}
                        onChange={(e) =>
                          setWizardData({
                            ...wizardData,
                            colors: e.target.value.split(',').map((c) => c.trim()).filter(Boolean)
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Available Sizes (Comma separated)</label>
                      <input
                        type="text"
                        value={wizardData.sizes.join(', ')}
                        onChange={(e) =>
                          setWizardData({
                            ...wizardData,
                            sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 5: Inventory */}
                {wizardStep === 5 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                      <Boxes className="w-4 h-4 text-[#B8860B]" /> Step 5: Stock & Inventory Management
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Initial Stock Units *</label>
                        <input
                          type="number"
                          value={wizardData.stock}
                          onChange={(e) => setWizardData({ ...wizardData, stock: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Low Stock Alert Threshold</label>
                        <input
                          type="number"
                          value={wizardData.lowStockThreshold}
                          onChange={(e) => setWizardData({ ...wizardData, lowStockThreshold: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Warehouse Bin / Rack Location</label>
                        <input
                          type="text"
                          value={wizardData.warehouseLocation}
                          onChange={(e) => setWizardData({ ...wizardData, warehouseLocation: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: Dynamic Category Specs */}
                {wizardStep === 6 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                      <FileText className="w-4 h-4 text-[#B8860B]" /> Step 6: Ethnic Specifications
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(wizardData.specs).map(([key, val]) => (
                        <div key={key}>
                          <label className="block text-xs font-bold text-stone-700 mb-1">{key}</label>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) =>
                              setWizardData({
                                ...wizardData,
                                specs: { ...wizardData.specs, [key]: e.target.value }
                              })
                            }
                            className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 7: Shipping Details */}
                {wizardStep === 7 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                      <Truck className="w-4 h-4 text-[#B8860B]" /> Step 7: Packaging & Delivery Parameters
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Parcel Weight (Grams)</label>
                        <input
                          type="number"
                          value={wizardData.weightGrams}
                          onChange={(e) => setWizardData({ ...wizardData, weightGrams: Number(e.target.value) })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Dispatch Lead Time</label>
                        <input
                          type="text"
                          value={wizardData.dispatchTime}
                          onChange={(e) => setWizardData({ ...wizardData, dispatchTime: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wizardData.freeShipping}
                          onChange={(e) => setWizardData({ ...wizardData, freeShipping: e.target.checked })}
                          className="rounded text-[#B8860B]"
                        />
                        <span>Eligible for Free Pan-India Delivery</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wizardData.codAvailable}
                          onChange={(e) => setWizardData({ ...wizardData, codAvailable: e.target.checked })}
                          className="rounded text-[#B8860B]"
                        />
                        <span>Cash on Delivery (COD) Allowed</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 8: SEO */}
                {wizardStep === 8 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                      <Globe className="w-4 h-4 text-[#B8860B]" /> Step 8: Search Engine Optimization (Google SERP)
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={wizardData.seoTitle}
                        onChange={(e) => setWizardData({ ...wizardData, seoTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Meta Description</label>
                      <textarea
                        rows={2}
                        value={wizardData.seoDescription}
                        onChange={(e) => setWizardData({ ...wizardData, seoDescription: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                      />
                    </div>

                    {/* Google SERP Snippet Preview */}
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Google Search Preview</span>
                      <div className="text-xs text-blue-700 font-medium hover:underline cursor-pointer">
                        {wizardData.seoTitle || wizardData.title}
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        https://ananyacollection.in/product/{wizardData.slug || 'sample-item'}
                      </div>
                      <p className="text-[11px] text-stone-600 line-clamp-2">
                        {wizardData.seoDescription || wizardData.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 9: Upsells */}
                {wizardStep === 9 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                      <Sparkles className="w-4 h-4 text-[#B8860B]" /> Step 9: Pair with Matching Pieces (Cross-sell)
                    </h3>

                    <p className="text-xs text-stone-500">
                      Select matching accessories, clutches, or dupattas from your catalog for &quot;Complete the Look&quot;.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {products.slice(0, 6).map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 hover:bg-stone-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={wizardData.relatedProductIds.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setWizardData({
                                  ...wizardData,
                                  relatedProductIds: [...wizardData.relatedProductIds, item.id]
                                });
                              } else {
                                setWizardData({
                                  ...wizardData,
                                  relatedProductIds: wizardData.relatedProductIds.filter((id) => id !== item.id)
                                });
                              }
                            }}
                            className="rounded text-[#B8860B]"
                          />
                          <div className="w-10 h-10 rounded bg-stone-100 overflow-hidden shrink-0">
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-xs overflow-hidden">
                            <div className="font-semibold text-stone-900 truncate">{item.title}</div>
                            <div className="text-[10px] text-stone-400">₹{item.price.toLocaleString('en-IN')}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 10: Final Review */}
                {wizardStep === 10 && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Step 10: Final Review & Publish
                    </h3>

                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row gap-5">
                      <div className="w-24 h-32 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                        <img
                          src={wizardData.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                          alt={wizardData.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="text-base font-serif font-bold text-stone-900">
                          {wizardData.title || 'Untitled Piece'}
                        </div>
                        <div className="text-stone-500">{wizardData.titleHi}</div>
                        <div className="text-stone-400 font-mono">SKU: {wizardData.sku}</div>
                        <div className="pt-2 flex items-center gap-3">
                          <span className="text-lg font-bold text-[#B8860B]">₹{wizardData.price}</span>
                          <span className="line-through text-stone-400">MRP ₹{wizardData.mrp}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {wizardData.stock} Units in Stock
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setWizardData({ ...wizardData, status: 'draft' });
                          handlePublishProduct();
                        }}
                        className="px-4 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg cursor-pointer"
                      >
                        Save as Draft
                      </button>
                      <button
                        type="button"
                        onClick={handlePublishProduct}
                        className="px-6 py-2 text-xs font-bold bg-[#B8860B] hover:bg-[#996515] text-white rounded-lg shadow-md cursor-pointer"
                      >
                        {editingProduct ? 'Update Product' : 'Publish to Ananya Collection'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Wizard Bottom Navigation Prev / Next */}
                <div className="flex items-center justify-between border-t border-stone-100 pt-6 mt-6">
                  <button
                    disabled={wizardStep === 1}
                    onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  {wizardStep < 10 ? (
                    <button
                      onClick={() => setWizardStep((s) => Math.min(10, s + 1))}
                      className="px-5 py-2 text-xs font-bold rounded-lg bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1 cursor-pointer"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handlePublishProduct}
                      className="px-6 py-2 text-xs font-bold rounded-lg bg-[#B8860B] hover:bg-[#996515] text-white flex items-center gap-1 cursor-pointer"
                    >
                      Publish Now <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* View: ORDERS MANAGEMENT */}
          {activeSection === 'orders' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">Orders & Shipments</h2>
                  <p className="text-xs text-stone-500">Track and dispatch customer orders from Rohini boutique</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                  >
                    <option value="all">All Orders ({orders.length})</option>
                    <option value="placed">Placed (New)</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-400 border-b border-stone-100">
                      <tr>
                        <th className="px-6 py-3.5">Order ID & Date</th>
                        <th className="px-4 py-3.5">Customer & Shipping</th>
                        <th className="px-4 py-3.5">Items</th>
                        <th className="px-4 py-3.5">Payment</th>
                        <th className="px-4 py-3.5">Status & AWB</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="font-mono font-bold text-stone-900">{ord.id}</div>
                            <div className="text-[10px] text-stone-400">{ord.date}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-stone-900">{ord.customer.fullName}</div>
                            <div className="text-[11px] text-stone-500">{ord.customer.mobile}</div>
                            <div className="text-[10px] text-stone-400 truncate max-w-xs">{ord.customer.addressLine1}, {ord.customer.city} ({ord.customer.pincode})</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-stone-800">
                              {ord.items.map((i) => `${i.product.title} (x${i.quantity})`).join(', ')}
                            </div>
                            <div className="text-[11px] text-stone-400 font-bold">Total: ₹{ord.total.toLocaleString('en-IN')}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 block w-max">
                              {ord.paymentMethod}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-medium capitalize">{ord.paymentStatus}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 ${
                                ord.orderStatus === 'delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : ord.orderStatus === 'shipped'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {ord.orderStatus.replace('_', ' ')}
                            </span>
                            <div className="text-[10px] font-mono text-stone-400">
                              AWB: {ord.trackingNumber || 'Pending'}
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedOrderForInvoice(ord)}
                              className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md cursor-pointer"
                            >
                              Invoice
                            </button>
                            <button
                              onClick={() => setSelectedOrderForFulfill(ord)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-[#B8860B] hover:bg-[#996515] rounded-md cursor-pointer"
                            >
                              Update Status
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

          {/* View: INVENTORY & MOVEMENTS */}
          {activeSection === 'inventory' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">Inventory Management</h2>
                  <p className="text-xs text-stone-500">Live stock adjustment, audit movements, and threshold monitoring</p>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-400 border-b border-stone-100">
                      <tr>
                        <th className="px-6 py-3.5">Product Title</th>
                        <th className="px-4 py-3.5">SKU</th>
                        <th className="px-4 py-3.5">Current Stock</th>
                        <th className="px-4 py-3.5">Threshold</th>
                        <th className="px-6 py-3.5 text-right">Adjustment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="px-6 py-3.5 font-semibold text-stone-900">{p.title}</td>
                          <td className="px-4 py-3.5 font-mono text-stone-500">{p.sku}</td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`font-bold ${
                                p.stock === 0 ? 'text-rose-600' : p.stock <= 10 ? 'text-amber-600' : 'text-stone-800'
                              }`}
                            >
                              {p.stock} Units
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-stone-400">5 Units</td>
                          <td className="px-6 py-3.5 text-right">
                            <button
                              onClick={() => {
                                setStockModalProduct(p);
                                setStockAdjustmentQty(p.stock);
                              }}
                              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-md cursor-pointer"
                            >
                              Adjust Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Movement History Log */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5">
                <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#B8860B]" /> Recent Stock Movements & Audits
                </h3>
                <div className="space-y-2">
                  {inventoryMovements.map((mov) => (
                    <div
                      key={mov.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-stone-50 text-xs border border-stone-100"
                    >
                      <div>
                        <div className="font-semibold text-stone-800">{mov.productName}</div>
                        <div className="text-[10px] text-stone-400">{mov.timestamp} · By {mov.adminUser}</div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-bold ${
                            mov.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {mov.change >= 0 ? `+${mov.change}` : mov.change} Units ({mov.reason})
                        </span>
                        <div className="text-[10px] text-stone-400">New Balance: {mov.newQty}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* View: CATEGORIES */}
          {activeSection === 'categories' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">Categories & Departments</h2>
                  <p className="text-xs text-stone-500">Configure storefront navigation and departmental taxonomies</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
                    <div className="h-32 rounded-lg overflow-hidden bg-stone-100 mb-3">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">{cat.name}</h4>
                    <p className="text-xs text-stone-400 font-serif">{cat.nameHi}</p>
                    <div className="mt-2 text-xs text-stone-500 font-medium">
                      {cat.subcategories?.length || 0} subcategories
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View: COUPONS */}
          {activeSection === 'coupons' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">Marketing & Coupons</h2>
                  <p className="text-xs text-stone-500">Manage promotional discounts and festival vouchers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableCoupons.map((c) => (
                  <div key={c.code} className="bg-white rounded-xl border border-dashed border-[#B8860B] p-5 shadow-xs relative">
                    <button
                      onClick={() => deleteCoupon(c.code)}
                      className="absolute top-3 right-3 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="font-mono text-base font-bold text-[#B8860B] mb-1">{c.code}</div>
                    <div className="text-xs font-semibold text-stone-800 mb-2">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed mb-3">{c.description}</p>
                    <div className="text-[10px] text-stone-400 font-medium">
                      Min Order: ₹{c.minOrderValue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View: CUSTOMERS */}
          {activeSection === 'customers' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">Customer Directory</h2>
                <p className="text-xs text-stone-500">Direct registered shoppers and repeat patrons</p>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 text-[#B8860B] font-bold flex items-center justify-center">
                        NS
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 text-sm">Neha Sharma</div>
                        <div className="text-xs text-stone-500">neha.sharma@gmail.com · +91 9871122334</div>
                        <div className="text-[11px] text-stone-400">Barakhamba Road, New Delhi</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase">
                        Gold Patron
                      </span>
                      <div className="text-xs font-bold text-stone-900 mt-1">₹16,998 Spent</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View: STORE SETTINGS */}
          {activeSection === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">Boutique & GST Settings</h2>
                <p className="text-xs text-stone-500">Configure Rohini address, tax invoices, and shipping thresholds</p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Store Name</label>
                    <input
                      type="text"
                      value={storeSettings.storeName}
                      onChange={(e) => updateStoreSettings({ storeName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={storeSettings.ownerName}
                      onChange={(e) => updateStoreSettings({ ownerName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">GSTIN</label>
                    <input
                      type="text"
                      value={storeSettings.gstin}
                      onChange={(e) => updateStoreSettings({ gstin: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Support Contact / WhatsApp</label>
                    <input
                      type="text"
                      value={storeSettings.mobile}
                      onChange={(e) => updateStoreSettings({ mobile: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Store Location & Boutique Address</label>
                  <input
                    type="text"
                    value={storeSettings.addressLine}
                    onChange={(e) => updateStoreSettings({ addressLine: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      value={storeSettings.city}
                      onChange={(e) => updateStoreSettings({ city: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">State</label>
                    <input
                      type="text"
                      value={storeSettings.state}
                      onChange={(e) => updateStoreSettings({ state: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={storeSettings.pincode}
                      onChange={(e) => updateStoreSettings({ pincode: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Shipping Thresholds</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Free Delivery Above (₹)</label>
                      <input
                        type="number"
                        value={storeSettings.freeShippingAbove}
                        onChange={(e) => updateStoreSettings({ freeShippingAbove: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Standard Delivery Fee (₹)</label>
                      <input
                        type="number"
                        value={storeSettings.standardShippingFee}
                        onChange={(e) => updateStoreSettings({ standardShippingFee: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View: AUDIT LOGS */}
          {activeSection === 'audit-logs' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">Audit Trail & Logs</h2>
                <p className="text-xs text-stone-500">Immutable chronological administrative activity record</p>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-400 border-b border-stone-100">
                    <tr>
                      <th className="px-6 py-3.5">Action & Module</th>
                      <th className="px-4 py-3.5">Details</th>
                      <th className="px-4 py-3.5">Admin User</th>
                      <th className="px-6 py-3.5 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/70">
                        <td className="px-6 py-3.5">
                          <span className="font-bold text-stone-900 block">{log.action}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                            {log.module}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-stone-600">{log.details}</td>
                        <td className="px-4 py-3.5 font-semibold text-stone-800">{log.adminUser}</td>
                        <td className="px-6 py-3.5 text-right text-stone-400 font-mono text-[11px]">
                          {log.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* View: THEME & BRANDING */}
          {activeSection === 'theme' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">Store Theme & Branding</h2>
                <p className="text-xs text-stone-500">Fine-tune the royal pearl ivory & gold storefront appearance</p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Announcement Bar Text</label>
                  <input
                    type="text"
                    value={theme.announcementText}
                    onChange={(e) => updateTheme({ announcementText: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Primary Brand Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded border border-stone-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 text-xs font-mono border border-stone-200 rounded-lg uppercase"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Typography System (Unified Storefront & Admin)</label>
                    <select
                      value={theme.fontFamily}
                      onChange={(e) => updateTheme({ fontFamily: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white"
                    >
                      <option value="Playfair Display">Playfair Display + Inter + Noto Sans Devanagari (Recommended)</option>
                      <option value="Inter">Inter + Noto Sans Devanagari (Clean Modern SaaS)</option>
                      <option value="Cinzel">Cinzel + Inter + Noto Sans Devanagari (Regal Indian Couture)</option>
                      <option value="Cormorant Garamond">Cormorant Garamond + Inter (Fine Silk Boutique)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setActiveTab('storefront')}
                    className="px-5 py-2 bg-[#B8860B] hover:bg-[#996515] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Save & Preview on Storefront
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: STOCK ADJUSTMENT */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">Adjust Physical Stock</h3>
              <button onClick={() => setStockModalProduct(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-stone-900 text-xs">{stockModalProduct.title}</div>
              <div className="text-[11px] text-stone-400 font-mono">SKU: {stockModalProduct.sku}</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">New Stock Quantity *</label>
              <input
                type="number"
                value={stockAdjustmentQty}
                onChange={(e) => setStockAdjustmentQty(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Reason for Stock Adjustment</label>
              <select
                value={stockAdjustmentReason}
                onChange={(e) => setStockAdjustmentReason(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white"
              >
                <option value="restock">New Shipment Restock from Weaver</option>
                <option value="sale">Offline In-Store Boutique Sale</option>
                <option value="return">Customer Exchange / Return Received</option>
                <option value="damaged">Damaged in Transit / Fabric Defect</option>
                <option value="audit_adjustment">Physical Audit Correction</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setStockModalProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleStockAdjustmentSubmit}
                className="px-5 py-2 text-xs font-bold text-white bg-[#B8860B] hover:bg-[#996515] rounded-lg"
              >
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ORDER FULFILLMENT / UPDATE */}
      {selectedOrderForFulfill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">Dispatch Order {selectedOrderForFulfill.id}</h3>
              <button onClick={() => setSelectedOrderForFulfill(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-stone-600">
              Customer: <span className="font-semibold text-stone-900">{selectedOrderForFulfill.customer.fullName}</span> ({selectedOrderForFulfill.customer.city})
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Courier Partner</label>
              <select
                value={courierInput}
                onChange={(e) => setCourierInput(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white"
              >
                <option value="Delhivery">Delhivery Surface / Express</option>
                <option value="Shiprocket">Shiprocket Xpress</option>
                <option value="Bluedart">Bluedart Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tracking Number (AWB)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. DLV-984218392"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-lg font-mono"
                />
                <button
                  type="button"
                  onClick={() => setTrackingNumberInput(`DLV-${Date.now().toString().slice(-8)}`)}
                  className="px-3 py-2 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700"
                >
                  Generate AWB
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedOrderForFulfill(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleFulfillOrderSubmit}
                className="px-5 py-2 text-xs font-bold text-white bg-[#B8860B] hover:bg-[#996515] rounded-lg"
              >
                Mark as Shipped & Send SMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRINTABLE GST TAX INVOICE */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-stone-200 p-8 w-full max-w-2xl shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 print:p-0 print:border-none print:shadow-none">
            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#B8860B] overflow-hidden bg-white shrink-0">
                  <img src="/logo.jpg" alt="Ananya Collection" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">Ananya Collection</h2>
                  <p className="text-xs text-stone-500">Rohini, Delhi · Designer Ethnic & Bridal Boutique</p>
                  <p className="text-[11px] text-stone-400 font-mono mt-0.5">GSTIN: {storeSettings.gstin}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 bg-stone-900 text-white rounded">
                  TAX INVOICE
                </span>
                <div className="text-xs font-mono font-bold text-stone-900 mt-2">{selectedOrderForInvoice.id}</div>
                <div className="text-[11px] text-stone-500">{selectedOrderForInvoice.date}</div>
              </div>
            </div>

            {/* Bill To & Ship To */}
            <div className="grid grid-cols-2 gap-6 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Billed & Shipped To:</span>
                <div className="font-bold text-stone-900 text-sm">{selectedOrderForInvoice.customer.fullName}</div>
                <div>{selectedOrderForInvoice.customer.addressLine1}</div>
                <div>{selectedOrderForInvoice.customer.city}, {selectedOrderForInvoice.customer.state} - {selectedOrderForInvoice.customer.pincode}</div>
                <div className="text-stone-500 mt-1">Mobile: {selectedOrderForInvoice.customer.mobile}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Dispatch Details:</span>
                <div>Courier: <span className="font-semibold">{selectedOrderForInvoice.courierPartner || 'Delhivery Surface'}</span></div>
                <div>AWB: <span className="font-mono">{selectedOrderForInvoice.trackingNumber || 'DLV-INVOICE'}</span></div>
                <div>Payment Method: <span className="uppercase font-bold">{selectedOrderForInvoice.paymentMethod}</span></div>
                <div>Payment Status: <span className="font-semibold text-emerald-700 capitalize">{selectedOrderForInvoice.paymentStatus}</span></div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-[10px] uppercase font-bold text-stone-600">
                  <tr>
                    <th className="px-4 py-2.5">Item Description</th>
                    <th className="px-3 py-2.5">HSN</th>
                    <th className="px-3 py-2.5 text-center">Qty</th>
                    <th className="px-3 py-2.5 text-right">Rate</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {selectedOrderForInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-semibold text-stone-900">{item.product.title}</td>
                      <td className="px-3 py-3 font-mono text-[11px] text-stone-500">{item.product.hsnCode || '5007'}</td>
                      <td className="px-3 py-3 text-center">{item.quantity}</td>
                      <td className="px-3 py-3 text-right">₹{item.product.price.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right font-bold">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Totals */}
            <div className="flex justify-end text-xs space-y-1">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrderForInvoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrderForInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-₹{selectedOrderForInvoice.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500">
                  <span>GST (Included):</span>
                  <span>₹{selectedOrderForInvoice.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Shipping & Delivery:</span>
                  <span>{selectedOrderForInvoice.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrderForInvoice.deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-sm text-stone-900 border-t border-stone-200 pt-2">
                  <span>Grand Total (INR):</span>
                  <span>₹{selectedOrderForInvoice.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Invoice Footer Actions */}
            <div className="flex items-center justify-between border-t border-stone-100 pt-4 print:hidden">
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 text-xs font-bold bg-[#B8860B] hover:bg-[#996515] text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" /> Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
