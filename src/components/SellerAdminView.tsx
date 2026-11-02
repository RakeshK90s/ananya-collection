import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  Ban,
  Trash2,
  Copy,
  Edit,
  Eye,
  Sliders,
  ExternalLink,
  Truck,
  CreditCard,
  ShieldAlert,
  Save,
  Palette,
  Store,
  Layers,
  Sparkles,
  X,
  Lock,
  ArrowRight,
  Printer,
  ChevronDown,
  UploadCloud,
  Star,
  CheckCircle2,
  FileText,
  Clock,
  Building,
  HelpCircle,
  Tag,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Table,
  Code,
  MoveLeft,
  MoveRight,
  Upload,
  ArrowUp,
  ArrowDown,
  Wand2,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR, useTranslation, formatDateIN } from '../utils/formatters';
import { Product, ProductStatus } from '../types';
import { INITIAL_CATEGORIES } from '../data/mockData';
import { ThemeCustomiser } from './ThemeCustomiser';

// Rich Specification Industry Presets
const SPEC_PRESETS: Record<string, { label: string; specs: Array<{ key: string; value: string }> }> = {
  ethnic: {
    label: 'Ethnic Wear & Handlooms (Sarees / Lehengas)',
    specs: [
      { key: 'Fabric Material', value: '100% Pure Mulberry Silk / Kanjeevaram' },
      { key: 'Weave Type', value: 'Varanasi Jacquard Handloom Weave' },
      { key: 'Zari Purity', value: 'Electroplated Tested Metallic Gold Zari' },
      { key: 'Saree Length', value: '5.5 Meters Saree + 0.8 Meter Blouse' },
      { key: 'Blouse Piece', value: 'Included (Unstitched Matching)' },
      { key: 'Certification', value: 'Silk Mark Certified & GI Tagged' },
      { key: 'Care Instructions', value: 'Professional Dry Clean Only' },
      { key: 'Country of Origin', value: 'India' },
    ],
  },
  audio: {
    label: 'Electronics & Audio Gadgets',
    specs: [
      { key: 'Acoustic Driver', value: '50mm Planar Magnetic Diaphragm' },
      { key: 'Bluetooth Version', value: 'v5.3 with AptX Lossless & AAC' },
      { key: 'Battery Playtime', value: '50 Hours (ANC Off) / 38 Hours (ANC On)' },
      { key: 'Noise Cancellation', value: '42dB Hybrid Quad-Mic AI ANC' },
      { key: 'Charging Standard', value: 'Type-C Fast Charge (10 min = 5 hours)' },
      { key: 'Latency', value: '38ms Ultra-Low Gaming Mode' },
      { key: 'Water Resistance', value: 'IPX5 Sweat & Splash Proof' },
      { key: 'Warranty', value: '1 Year Doorstep Replacement Guarantee' },
    ],
  },
  ayurveda: {
    label: 'Ayurveda, Organic Wellness & Beauty',
    specs: [
      { key: 'Active Botanicals', value: 'Pure Himalayan Shilajit, Kashmiri Saffron' },
      { key: 'Fulvic Acid Content', value: '>75% Lab Certified Potency' },
      { key: 'Form Factor', value: 'Purified Resin / Cold Pressed Oil' },
      { key: 'License Authority', value: 'AYUSH Approved GMP Certified Facility' },
      { key: 'Recommended Dosage', value: 'Pea-sized (300mg-500mg) in warm milk or water' },
      { key: 'Shelf Life', value: '24 Months from Packaging Date' },
      { key: 'Net Quantity', value: '50 Grams' },
      { key: 'Safety Standards', value: 'Heavy Metal Tested (Lead, Arsenic Free)' },
    ],
  },
  jewelry: {
    label: 'Jewelry & Precious Hallmarked Metal',
    specs: [
      { key: 'Precious Metal Purity', value: '22 Karat (916) Pure Yellow Gold' },
      { key: 'BIS Hallmark', value: 'BIS Certified 6-Digit HUID Code' },
      { key: 'Gross Weight', value: '18.45 Grams' },
      { key: 'Net Metal Weight', value: '16.80 Grams' },
      { key: 'Stone Type', value: 'Natural Certified VVS-VS Diamonds' },
      { key: 'Certification Body', value: 'IGI / SGL Diamond Certificate' },
      { key: 'Making Charges', value: 'Zero Hidden Charges (Transparent Breakup)' },
      { key: 'Buyback Guarantee', value: '100% Lifetime Exchange & Buyback Policy' },
    ],
  },
};

// Rich Storytelling Templates for WYSIWYG Editor
const DESCRIPTION_TEMPLATES = [
  {
    title: 'Heritage Silk Saree Story',
    html: `<h2>Heritage Craftsmanship & Weaving Tradition</h2>\n<p>Immerse yourself in the enduring elegance of <strong>authentic handloom weaving</strong>. Crafted by master artisans with centuries-old generational techniques, each motif embodies cultural auspiciousness and imperial grace.</p>\n<h3>Design & Material Highlights:</h3>\n<ul>\n  <li><strong>Pure Mulberry Silk:</strong> Silk Mark certified yarn ensuring soft drape, natural luster, and breathable comfort throughout wedding and festive occasions.</li>\n  <li><strong>Intricate Temple Border:</strong> Hand-woven golden zari pallu featuring classic floral jaal and paisley artwork.</li>\n  <li><strong>Includes Blouse Piece:</strong> 0.8 meter unstitched matching fabric ready to tailor to your custom fit.</li>\n</ul>\n<p><em>Crafted with devotion across India's premier artisanal handloom clusters. Delivered in eco-conscious keepsake luxury box.</em></p>`,
  },
  {
    title: 'Audiophile Pro Tech Spec',
    html: `<h2>Next-Generation Audiophile Acoustic Performance</h2>\n<p>Engineered for discerning listeners who demand studio-grade precision. Experience every harmonic texture with <strong>planar magnetic drivers</strong> tuned to Indian musical resonance.</p>\n<h3>Key Performance Features:</h3>\n<ul>\n  <li><strong>42dB Hybrid Active Noise Cancellation:</strong> Dual feed-forward and feedback microphones silence metro noise and ambient chatter.</li>\n  <li><strong>50-Hour Extended Endurance:</strong> Warp Charge gives 5 hours of listening time from a 10-minute USB-C charge.</li>\n  <li><strong>Lossless Wireless Audio:</strong> Supports low-latency codecs for lag-free cinematic entertainment and gaming.</li>\n</ul>`,
  },
  {
    title: 'Pure Vedic Herbal Wellness',
    html: `<h2>Ancient Vedic Formulation & Himalayan Purity</h2>\n<p>Ethically sourced from high-altitude Himalayan peaks exceeding 18,000 feet, where pristine climate conditions concentrate essential fulvic acid and trace minerals.</p>\n<h3>Holistic Benefits:</h3>\n<ul>\n  <li><strong>Natural Stamina & Vitality:</strong> Revitalizes mitochondrial energy production without jittery caffeine crashes.</li>\n  <li><strong>AYUSH & GMP Certified:</strong> Traditional shodhita purification process eliminates heavy metals and impurities.</li>\n  <li><strong>Standardized Potency:</strong> Verified >75% fulvic acid concentration with batch test report included.</li>\n</ul>`,
  },
];

export const SellerAdminView: React.FC = () => {
  const {
    theme,
    language,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductSoldOut,
    toggleProductPause,
    duplicateProduct,
    orders,
    updateOrderStatus,
    stores,
    currentStore,
    setCurrentStoreId,
    updateCurrentStore,
    setActiveTab,
    setSelectedProduct,
    currentUser,
    loginUser,
    switchDemoRole,
    setIsLoginModalOpen,
  } = useStore();

  const t = useTranslation(language);

  // Authentication Gate: Check if user is seller or super_admin
  const isAuthorized = currentUser.isLoggedIn && (currentUser.role === 'seller' || currentUser.role === 'super_admin');

  // Sub Tab Navigation inside Seller Portal
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'products' | 'orders' | 'theme' | 'settings'>('dashboard');
  const [productSearch, setProductSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  
  // Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productModalTab, setProductModalTab] = useState<'basic' | 'media' | 'pricing' | 'specs' | 'reviews' | 'inventory'>('basic');

  // Comprehensive Product Form State matching luxecart_add_edit_product
  const [productForm, setProductForm] = useState<{
    title: string;
    titleHi: string;
    description: string;
    descriptionHi: string;
    category: string;
    categoryHi: string;
    brand: string;
    price: number;
    mrp: number;
    costPrice: number;
    stock: number;
    sku: string;
    barcode: string;
    gstRate: number;
    hsnCode: string;
    status: ProductStatus;
    isDealOfTheDay: boolean;
    isBestseller: boolean;
    isNewArrival: boolean;
    images: string[];
    highlights: string[];
    specs: Array<{ key: string; value: string }>;
    rating: number;
    reviewCount: number;
    returnPolicyDays: number;
    codAvailable: boolean;
  }>({
    title: '',
    titleHi: '',
    description: '',
    descriptionHi: '',
    category: 'ethnic-wear',
    categoryHi: 'एथनिक एवं उत्सव',
    brand: currentStore.name,
    price: 3499,
    mrp: 8999,
    costPrice: 1850,
    stock: 25,
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    barcode: '890432190871',
    gstRate: 5,
    hsnCode: '5208',
    status: 'active',
    isDealOfTheDay: false,
    isBestseller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    highlights: [
      '100% Pure Silk with Silk Mark Certification',
      'Heavy golden zari handwoven pallu and temple border',
      'Includes 0.8 meter matching unstitched blouse piece',
      '7-day doorstep replacement or refund guarantee',
    ],
    specs: [
      { key: 'Fabric', value: 'Pure Kanjeevaram Soft Silk' },
      { key: 'Weave Type', value: 'Varanasi Handloom Jacquard' },
      { key: 'Length', value: '6.3 Meters (With Blouse)' },
      { key: 'Country of Origin', value: 'India' },
      { key: 'Care Instructions', value: 'Dry Clean Only' },
    ],
    rating: 4.8,
    reviewCount: 342,
    returnPolicyDays: 7,
    codAvailable: true,
  });

  const [newHighlightInput, setNewHighlightInput] = useState('');
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // WYSIWYG Editor State
  const [wysiwygMode, setWysiwygMode] = useState<'editor' | 'preview' | 'html'>('editor');

  // Bulk Media Upload States
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [bulkUrlInput, setBulkUrlInput] = useState('');
  const [showBulkUrlModal, setShowBulkUrlModal] = useState(false);

  // Dynamic Specifications Preset Selection State
  const [specPresetKey, setSpecPresetKey] = useState<string>('custom');

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    name: currentStore.name,
    ownerName: currentStore.ownerName,
    email: currentStore.email,
    mobile: currentStore.mobile,
    gstin: currentStore.gstin,
    city: currentStore.city,
    state: currentStore.state,
    razorpayKeyId: currentStore.razorpayKeyId,
    razorpayKeySecret: currentStore.razorpayKeySecret,
    isTestMode: currentStore.isTestMode,
    codEnabled: currentStore.codEnabled,
    codCharge: currentStore.codCharge,
    freeShippingAbove: currentStore.freeShippingAbove,
    shippingPartner: currentStore.shippingPartner,
    whatsappSupportNumber: currentStore.whatsappSupportNumber,
  });

  const [settingsSaved, setSettingsSaved] = useState(false);

  // If not authenticated, render the dedicated Merchant Portal Security Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-5 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">
            Seller Portal Restricted
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            This administrative console is restricted to verified store merchants, inventory managers, and platform auditors. You must be authenticated with a seller account.
          </p>

          <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600/50 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              <span>Current Status: {currentUser.isLoggedIn ? `Logged in as ${currentUser.name} (${currentUser.role})` : 'Not Logged In'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              To test the Seller Admin dashboard immediately, click below to authenticate with the verified Demo Seller profile or login with your vendor credentials.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                switchDemoRole('seller');
              }}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>1-Click Authenticate as Verified Seller</span>
            </button>

            <button
              onClick={() => {
                setIsLoginModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Sign In with Vendor Credentials
            </button>

            <button
              onClick={() => setActiveTab('storefront')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors pt-2 block mx-auto cursor-pointer"
            >
              ← Return to Public Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter products by current store or all store products
  const storeProducts = products.filter(
    (p) => p.storeId === currentStore.id || p.storeName === currentStore.name
  );

  const filteredProducts = storeProducts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter orders for this store
  const storeOrders = orders.filter(
    (o) => o.storeId === currentStore.id || o.storeName === currentStore.name
  );

  const filteredOrders = storeOrders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    if (orderStatusFilter === 'pending') return o.orderStatus === 'placed' || o.orderStatus === 'confirmed';
    if (orderStatusFilter === 'processing') return o.orderStatus === 'packed';
    if (orderStatusFilter === 'shipped') return o.orderStatus === 'shipped' || o.orderStatus === 'out_for_delivery';
    if (orderStatusFilter === 'delivered') return o.orderStatus === 'delivered';
    if (orderStatusFilter === 'cancelled') return o.orderStatus === 'cancelled';
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProductId(null);
    setProductModalTab('basic');
    setProductForm({
      title: '',
      titleHi: '',
      description: '',
      descriptionHi: '',
      category: 'ethnic-wear',
      categoryHi: 'एथनिक एवं उत्सव',
      brand: currentStore.name,
      price: 1999,
      mrp: 3999,
      costPrice: 950,
      stock: 40,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `8904${Math.floor(10000000 + Math.random() * 90000000)}`,
      gstRate: 12,
      hsnCode: '8518',
      status: 'active',
      isDealOfTheDay: false,
      isBestseller: true,
      isNewArrival: true,
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      ],
      highlights: [
        'Mastering-grade acoustic audio performance',
        'Multipoint Bluetooth 5.3 with lossless codec support',
        '48-hour continuous battery playback',
        'Inclusive of 18% Indian GST with Tax Invoice',
      ],
      specs: [
        { key: 'Driver Type', value: '50mm Planar Magnetic Diaphragm' },
        { key: 'Battery Life', value: '48 Hours with Fast Type-C Charge' },
        { key: 'Country of Origin', value: 'India' },
        { key: 'Warranty', value: '1 Year Doorstep Replacement' },
      ],
      rating: 4.8,
      reviewCount: 342,
      returnPolicyDays: 7,
      codAvailable: true,
    });
    setShowAddProductModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProductId(p.id);
    setProductModalTab('basic');
    setProductForm({
      title: p.title,
      titleHi: p.titleHi || p.title,
      description: p.description,
      descriptionHi: p.descriptionHi || p.description,
      category: p.category,
      categoryHi: p.categoryHi || p.category,
      brand: p.brand,
      price: p.price,
      mrp: p.mrp || p.price * 1.5,
      costPrice: Math.round(p.price * 0.55),
      stock: p.stock,
      sku: p.sku,
      barcode: '890432190871',
      gstRate: p.gstRate,
      hsnCode: p.hsnCode || '5208',
      status: p.status,
      isDealOfTheDay: !!p.isDealOfTheDay,
      isBestseller: !!p.isBestseller,
      isNewArrival: !!p.isNewArrival,
      images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      highlights: p.highlights && p.highlights.length > 0 ? p.highlights : ['100% Authentic quality guaranteed', 'Inclusive of Indian GST'],
      specs: p.specs ? Object.entries(p.specs).map(([key, value]) => ({ key, value })) : [{ key: 'Brand', value: p.brand }],
      rating: p.rating || 4.8,
      reviewCount: p.reviewCount || 342,
      returnPolicyDays: p.returnPolicyDays || 7,
      codAvailable: p.codAvailable !== false,
    });
    setShowAddProductModal(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = Math.max(0, Math.round(((productForm.mrp - productForm.price) / productForm.mrp) * 100));

    // Convert specs array back to Record
    const specsRecord: Record<string, string> = {};
    productForm.specs.forEach((item) => {
      if (item.key.trim()) {
        specsRecord[item.key.trim()] = item.value;
      }
    });

    if (editingProductId) {
      updateProduct(editingProductId, {
        title: productForm.title,
        titleHi: productForm.titleHi || productForm.title,
        description: productForm.description,
        descriptionHi: productForm.descriptionHi || productForm.description,
        category: productForm.category,
        categoryHi: productForm.categoryHi,
        brand: productForm.brand,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        discountPercent: discount,
        stock: Number(productForm.stock),
        status: Number(productForm.stock) === 0 ? 'sold_out' : productForm.status,
        sku: productForm.sku,
        gstRate: Number(productForm.gstRate),
        hsnCode: productForm.hsnCode,
        images: productForm.images,
        highlights: productForm.highlights,
        specs: specsRecord,
        rating: Number(productForm.rating),
        reviewCount: Number(productForm.reviewCount),
        isDealOfTheDay: productForm.isDealOfTheDay,
        isBestseller: productForm.isBestseller,
        isNewArrival: productForm.isNewArrival,
        returnPolicyDays: Number(productForm.returnPolicyDays),
        codAvailable: productForm.codAvailable,
      });
    } else {
      addProduct({
        storeId: currentStore.id,
        storeName: currentStore.name,
        title: productForm.title,
        titleHi: productForm.titleHi || productForm.title,
        description: productForm.description,
        descriptionHi: productForm.descriptionHi || productForm.description,
        category: productForm.category,
        categoryHi: productForm.categoryHi,
        brand: productForm.brand,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        discountPercent: discount,
        stock: Number(productForm.stock),
        status: Number(productForm.stock) === 0 ? 'sold_out' : productForm.status,
        sku: productForm.sku,
        gstRate: Number(productForm.gstRate),
        hsnCode: productForm.hsnCode,
        images: productForm.images,
        rating: Number(productForm.rating),
        reviewCount: Number(productForm.reviewCount),
        isBestseller: productForm.isBestseller,
        isDealOfTheDay: productForm.isDealOfTheDay,
        isNewArrival: productForm.isNewArrival,
        highlights: productForm.highlights,
        highlightsHi: productForm.highlights,
        specs: specsRecord,
        returnPolicyDays: Number(productForm.returnPolicyDays),
        codAvailable: productForm.codAvailable,
      });
    }

    setShowAddProductModal(false);
  };

  const handleAddHighlight = () => {
    if (!newHighlightInput.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, newHighlightInput.trim()],
    }));
    setNewHighlightInput('');
  };

  const handleRemoveHighlight = (idx: number) => {
    setProductForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };

  const handleAddImage = () => {
    if (!newImageUrlInput.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrlInput.trim()],
    }));
    setNewImageUrlInput('');
  };

  // Bulk Multi-File Upload via FileReader
  const handleBulkFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setProductForm((prev) => ({
            ...prev,
            images: [...prev.images, result],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Bulk URL Importer
  const handleBulkUrlImport = () => {
    if (!bulkUrlInput.trim()) return;
    const urls = bulkUrlInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 5 && (u.startsWith('http://') || u.startsWith('https://')));

    if (urls.length === 0) {
      alert('Please enter valid HTTP/HTTPS image URLs separated by newlines or commas.');
      return;
    }

    setProductForm((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
    }));
    setBulkUrlInput('');
    setShowBulkUrlModal(false);
  };

  // Image Reordering
  const handleMoveImage = (idx: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= productForm.images.length) return;

    setProductForm((prev) => {
      const newImages = [...prev.images];
      const temp = newImages[idx];
      newImages[idx] = newImages[targetIdx];
      newImages[targetIdx] = temp;
      return { ...prev, images: newImages };
    });
  };

  const handleRemoveImage = (idx: number) => {
    if (productForm.images.length <= 1) {
      alert('Product must have at least one image.');
      return;
    }
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleSetPrimaryImage = (idx: number) => {
    const selected = productForm.images[idx];
    const filtered = productForm.images.filter((_, i) => i !== idx);
    setProductForm((prev) => ({
      ...prev,
      images: [selected, ...filtered],
    }));
  };

  // WYSIWYG Tag Inserter for Description
  const insertWysiwygTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById('product-description-editor') as HTMLTextAreaElement;
    if (!textarea) {
      setProductForm((prev) => ({
        ...prev,
        description: prev.description + `${openTag}Sample Text${closeTag}`,
      }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'Sample text';
    const replacement = `${openTag}${selected}${closeTag}`;

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setProductForm((prev) => ({ ...prev, description: newText }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 50);
  };

  // Dynamic Specification Handlers
  const loadSpecPreset = (key: string) => {
    setSpecPresetKey(key);
    const preset = SPEC_PRESETS[key];
    if (preset) {
      setProductForm((prev) => ({
        ...prev,
        specs: [...preset.specs],
      }));
    }
  };

  const handleMoveSpec = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= productForm.specs.length) return;

    setProductForm((prev) => {
      const newSpecs = [...prev.specs];
      const temp = newSpecs[idx];
      newSpecs[idx] = newSpecs[targetIdx];
      newSpecs[targetIdx] = temp;
      return { ...prev, specs: newSpecs };
    });
  };

  const handleAddSpecRow = () => {
    setProductForm((prev) => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }],
    }));
  };

  const handleUpdateSpec = (idx: number, key: string, value: string) => {
    setProductForm((prev) => {
      const updated = [...prev.specs];
      updated[idx] = { key, value };
      return { ...prev, specs: updated };
    });
  };

  const handleRemoveSpec = (idx: number) => {
    setProductForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentStore(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 animate-fadeIn">
      {/* Top Seller Bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white">{currentStore.name}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Verified Merchant
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                GSTIN: <span className="font-mono text-slate-600 dark:text-slate-300">{currentStore.gstin}</span> • {currentStore.city}, {currentStore.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Escrow Balance Banner from Zip */}
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600 flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">Escrow Balance</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">₹4,82,350</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-semibold">
                Razorpay Settled
              </span>
            </div>

            {/* Switch Active Store Dropdown */}
            {stores.length > 1 && (
              <select
                value={currentStore.id}
                onChange={(e) => setCurrentStoreId(e.target.value)}
                className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-none cursor-pointer"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setActiveTab('storefront')}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Tabs (Dashboard, Products, Orders, Theme Customizer, Settings) */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'dashboard'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard & Metrics</span>
          </button>

          <button
            onClick={() => setActiveSubTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'products'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Inventory ({storeProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'orders'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Fulfillment ({storeOrders.length})</span>
          </button>

          {/* Theme Customizer Inside Admin Only - Directly answering user request */}
          <button
            onClick={() => setActiveSubTab('theme')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'theme'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-500" />
            <span>Theme & Brand Customizer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'settings'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Settings & Payment Keys</span>
          </button>
        </div>

        {/* 1. DASHBOARD OVERVIEW SUB-TAB */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top 4 KPI Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Gross Sales Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {formatINR(currentStore.totalRevenue)}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                  +18.4% this month
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Total Fulfilled Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {currentStore.totalOrders}
                </p>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Across Delhivery & Shiprocket
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Live Active SKUs</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {storeProducts.filter((p) => p.status === 'active').length} / {storeProducts.length}
                </p>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {storeProducts.filter((p) => p.status === 'sold_out').length} sold out, {storeProducts.filter((p) => p.status === 'paused').length} paused
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Platform Commission Rate</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {currentStore.commissionRate}%
                </p>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Fixed LuxeCart Tier 1 Partner rate
                </span>
              </div>
            </div>

            {/* Quick Actions & Fulfillment Pipeline Alert */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Fulfillment Pipeline Status</h3>
                    <p className="text-xs text-slate-400">Live order fulfillment dispatch queue</p>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('orders')}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Orders</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl text-center">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                      {storeOrders.filter((o) => o.orderStatus === 'placed' || o.orderStatus === 'confirmed').length}
                    </span>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">To Pack</span>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 rounded-xl text-center">
                    <span className="text-xs font-bold text-blue-800 dark:text-blue-300 block">
                      {storeOrders.filter((o) => o.orderStatus === 'packed').length}
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Manifested</span>
                  </div>

                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40 rounded-xl text-center">
                    <span className="text-xs font-bold text-purple-800 dark:text-purple-300 block">
                      {storeOrders.filter((o) => o.orderStatus === 'shipped' || o.orderStatus === 'out_for_delivery').length}
                    </span>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">In Transit</span>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl text-center">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                      {storeOrders.filter((o) => o.orderStatus === 'delivered').length}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Delivered</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl text-center">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {storeOrders.filter((o) => o.orderStatus === 'cancelled').length}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">RTO / Return</span>
                  </div>
                </div>
              </div>

              {/* Quick Catalog Actions */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Quick Catalog Actions</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage products and catalog updates</p>
                  
                  <div className="mt-4 space-y-2.5">
                    <button
                      onClick={handleOpenAdd}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product (Full Details)</span>
                    </button>

                    <button
                      onClick={() => setActiveSubTab('theme')}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Palette className="w-4 h-4 text-amber-500" />
                      <span>Customize Store Theme & Branding</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>GSTIN & Delhivery APIs Synchronized</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS & INVENTORY SUB-TAB */}
        {activeSubTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by Title or SKU..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="draft">Draft</option>
                </select>

                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Price & MRP</th>
                      <th className="py-3 px-3">Stock Units</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Rating / Reviews</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80'}
                              alt={p.title}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-xs">{p.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">{p.brand}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="capitalize text-slate-600 dark:text-slate-300 font-medium">
                            {p.category.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-white">{formatINR(p.price)}</span>
                            {p.mrp > p.price && (
                              <span className="text-[10px] text-slate-400 line-through">{formatINR(p.mrp)}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.stock <= 5
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            p.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : p.status === 'sold_out'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {p.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{p.rating}</span>
                            <span className="text-slate-400 font-normal">({p.reviewCount})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Toggle Sold Out */}
                            <button
                              onClick={() => toggleProductSoldOut(p.id)}
                              title={p.status === 'sold_out' ? 'Mark Back in Stock' : 'Mark Sold Out'}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                p.status === 'sold_out'
                                  ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                                  : 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30'
                              }`}
                            >
                              <Ban className="w-4 h-4" />
                            </button>

                            {/* Toggle Pause */}
                            <button
                              onClick={() => toggleProductPause(p.id)}
                              title={p.status === 'paused' ? 'Resume Product' : 'Pause Product'}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors cursor-pointer"
                            >
                              {p.status === 'paused' ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                            </button>

                            {/* Duplicate */}
                            <button
                              onClick={() => duplicateProduct(p.id)}
                              title="Duplicate SKU"
                              className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEdit(p)}
                              title="Edit Full Product Details"
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${p.title}?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              title="Delete Product"
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDERS & FULFILLMENT SUB-TAB */}
        {activeSubTab === 'orders' && (
          <div className="space-y-4">
            {/* Orders Status Sub-Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'All Orders', count: storeOrders.length },
                { id: 'pending', label: 'To Pack / SLA Alert', count: storeOrders.filter((o) => o.orderStatus === 'placed' || o.orderStatus === 'confirmed').length },
                { id: 'processing', label: 'Processing Manifest', count: storeOrders.filter((o) => o.orderStatus === 'packed').length },
                { id: 'shipped', label: 'In Transit', count: storeOrders.filter((o) => o.orderStatus === 'shipped' || o.orderStatus === 'out_for_delivery').length },
                { id: 'delivered', label: 'Delivered', count: storeOrders.filter((o) => o.orderStatus === 'delivered').length },
                { id: 'cancelled', label: 'Cancelled / RTO', count: storeOrders.filter((o) => o.orderStatus === 'cancelled').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setOrderStatusFilter(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    orderStatusFilter === tab.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                    orderStatusFilter === tab.id ? 'bg-purple-800 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Orders List / Cards */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No orders in this status</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{order.id}</span>
                        <span className="text-slate-400">Placed on {formatDateIN(order.date)}</span>
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                          {order.paymentMethod.toUpperCase()} {order.paymentStatus === 'paid' ? '• PREPAID' : '• COD'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                        >
                          <option value="placed">Order Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="packed">Packed & Ready</option>
                          <option value="shipped">Handed to Courier</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => {
                            setActiveTab('order-tracking');
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="Print Shipping Label / GST Tax Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      <div className="md:col-span-7 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.product.title}</p>
                              <p className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatINR(item.product.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="md:col-span-5 bg-slate-50 dark:bg-slate-700/40 p-3 rounded-xl border border-slate-100 dark:border-slate-600/50 space-y-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {order.customer.fullName} • {order.customer.mobile}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">
                          {order.customer.addressLine1}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                          <span>Courier: {order.courierPartner} ({order.trackingNumber})</span>
                          <span>Total: {formatINR(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. THEME & BRAND CUSTOMIZER SUB-TAB (Admin Only Location) */}
        {activeSubTab === 'theme' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-700 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                    Storefront Appearance & Brand Theme Engine
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Private Merchant Control: Customize your brand colors, announcement ticker, Google typography, and corner radius. Changes reflect live on the customer storefront.
                </p>
              </div>
            </div>

            {/* Embedded Theme Customizer Component */}
            <ThemeCustomiser />
          </div>
        )}

        {/* 5. SETTINGS & INTEGRATIONS SUB-TAB */}
        {activeSubTab === 'settings' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm max-w-4xl space-y-6">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Store Settings & Payment Gateway</h2>
                <p className="text-xs text-slate-400">Manage Razorpay API keys, GST compliance, and courier routing</p>
              </div>
              {settingsSaved && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Settings Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Store Legal Name</label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={settingsForm.gstin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gstin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Razorpay Key ID</label>
                  <input
                    type="text"
                    value={settingsForm.razorpayKeyId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKeyId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Razorpay Key Secret</label>
                  <input
                    type="password"
                    value={settingsForm.razorpayKeySecret}
                    onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKeySecret: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Store Configuration</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* COMPREHENSIVE ADD / EDIT PRODUCT MODAL (MATCHING LUXECART_ADD_EDIT_PRODUCT FROM ZIP) */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-750">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg font-outfit">
                  {editingProductId ? 'Edit Product SKU Details' : 'Create New Product Listing'}
                </h3>
                <p className="text-xs text-slate-400">Configure media gallery, key highlights, specifications & reviews</p>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-750 overflow-x-auto text-xs no-scrollbar">
              {[
                { id: 'basic', label: '1. Basic Info & Highlights' },
                { id: 'media', label: '2. Media Gallery (Bulk Upload)' },
                { id: 'pricing', label: '3. Pricing & Taxes (GST)' },
                { id: 'specs', label: '4. Product Specifications' },
                { id: 'reviews', label: '5. Reviews & Ratings' },
                { id: 'inventory', label: '6. Inventory & Status' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProductModalTab(tab.id as any)}
                  className={`px-3.5 py-2 font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    productModalTab === tab.id
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* TAB 1: BASIC INFO & KEY HIGHLIGHTS */}
              {productModalTab === 'basic' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Product Title (English) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.title}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        placeholder="e.g. Apex Wireless Studio Pro ANC Headset"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Product Title (Hindi / हिंदी)
                      </label>
                      <input
                        type="text"
                        value={productForm.titleHi}
                        onChange={(e) => setProductForm({ ...productForm, titleHi: e.target.value })}
                        placeholder="e.g. ऑराप्रो वायरलेस हेडसेट"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => {
                          const cat = INITIAL_CATEGORIES.find((c) => c.id === e.target.value);
                          setProductForm({
                            ...productForm,
                            category: e.target.value,
                            categoryHi: cat ? cat.nameHi : '',
                          });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold cursor-pointer"
                      >
                        {INITIAL_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.nameHi})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Brand / Craft Label</label>
                      <input
                        type="text"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold"
                      />
                    </div>
                  </div>

                  {/* WYSIWYG EDITOR FOR PRODUCT DESCRIPTION (Directly requested by user) */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span>Product Description (Rich WYSIWYG Storytelling)</span>
                      </label>

                      {/* Mode Toggles */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-750 p-1 rounded-xl text-[11px] self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setWysiwygMode('editor')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            wysiwygMode === 'editor'
                              ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Visual Editor
                        </button>
                        <button
                          type="button"
                          onClick={() => setWysiwygMode('html')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            wysiwygMode === 'html'
                              ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          &lt;HTML Code&gt;
                        </button>
                        <button
                          type="button"
                          onClick={() => setWysiwygMode('preview')}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            wysiwygMode === 'preview'
                              ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Live PDP Preview
                        </button>
                      </div>
                    </div>

                    {/* WYSIWYG Toolbar */}
                    {wysiwygMode !== 'preview' && (
                      <div className="p-2 bg-slate-100 dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            type="button"
                            onClick={() => insertWysiwygTag('<strong>', '</strong>')}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                            title="Bold Text"
                          >
                            <Bold className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertWysiwygTag('<em>', '</em>')}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 italic text-xs cursor-pointer"
                            title="Italic Text"
                          >
                            <Italic className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertWysiwygTag('<u>', '</u>')}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                            title="Underline"
                          >
                            <Underline className="w-3.5 h-3.5" />
                          </button>

                          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>

                          <button
                            type="button"
                            onClick={() => insertWysiwygTag('<h2>', '</h2>')}
                            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                            title="Heading 2"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() => insertWysiwygTag('<h3>', '</h3>')}
                            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                            title="Heading 3"
                          >
                            H3
                          </button>

                          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>

                          <button
                            type="button"
                            onClick={() => insertWysiwygTag('<ul>\n  <li>', '</li>\n</ul>')}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                            title="Bullet List"
                          >
                            <List className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertWysiwygTag('<ol>\n  <li>', '</li>\n</ol>')}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                            title="Numbered List"
                          >
                            <ListOrdered className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertWysiwygTag(
                                '<table class="w-full border text-xs">\n  <tr class="bg-slate-100">\n    <th class="p-1.5 border">Feature</th>\n    <th class="p-1.5 border">Specification</th>\n  </tr>\n  <tr>\n    <td class="p-1.5 border">Material</td>\n    <td class="p-1.5 border">Pure Handloom Silk</td>\n  </tr>\n</table>',
                                ''
                              )
                            }
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                            title="Insert Table"
                          >
                            <Table className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Quick Storytelling Templates */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                            <Wand2 className="w-3 h-3 text-purple-600" /> Template:
                          </span>
                          <select
                            onChange={(e) => {
                              const tpl = DESCRIPTION_TEMPLATES.find((t) => t.title === e.target.value);
                              if (tpl) {
                                setProductForm((prev) => ({ ...prev, description: tpl.html }));
                              }
                            }}
                            className="text-[11px] px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                            defaultValue=""
                          >
                            <option value="" disabled>Select Story Template</option>
                            {DESCRIPTION_TEMPLATES.map((tpl) => (
                              <option key={tpl.title} value={tpl.title}>{tpl.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Editor Content Area */}
                    {wysiwygMode === 'preview' ? (
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[160px] text-slate-800 dark:text-slate-200 text-xs space-y-2 leading-relaxed">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-[11px] text-purple-600 font-bold">
                          <span>Live Customer PDP Preview</span>
                          <span>Clean Typography Render</span>
                        </div>
                        <div
                          className="space-y-2 pt-1"
                          dangerouslySetInnerHTML={{
                            __html: productForm.description || '<p class="text-slate-400 italic">No description entered yet. Switch to Visual Editor to compose.</p>',
                          }}
                        />
                      </div>
                    ) : (
                      <textarea
                        id="product-description-editor"
                        rows={6}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Compose comprehensive product story, heritage background, fabric details, and care notes..."
                        className={`w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none ${
                          wysiwygMode === 'html' ? 'font-mono text-[11px]' : ''
                        }`}
                      />
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>HTML formatting tags supported (&lt;h2&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;table&gt;)</span>
                      <span>{productForm.description.length} characters</span>
                    </div>
                  </div>

                  {/* KEY BULLET POINTS / HIGHLIGHTS (Directly requested by user!) */}
                  <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-800/40 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>PDP Key Highlights (Shown above the fold)</span>
                      </label>
                      <span className="text-[10px] text-purple-600 font-semibold">{productForm.highlights.length} Active Points</span>
                    </div>

                    <div className="space-y-1.5">
                      {productForm.highlights.map((point, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="flex-1 text-slate-800 dark:text-slate-200 text-xs">{point}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(idx)}
                            className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newHighlightInput}
                        onChange={(e) => setNewHighlightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddHighlight();
                          }
                        }}
                        placeholder="Add new highlight (e.g. 100% Pure Mulberry Silk, BIS Hallmarked)..."
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                      >
                        + Add Bullet
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BULK IMAGE UPLOADS & MEDIA SUITE (Directly requested by user) */}
              {productModalTab === 'media' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-purple-600" />
                        <span>Bulk Product Image Gallery & Multi-Upload Suite</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Upload multiple high-res product photos at once, drag & drop files, or paste bulk CDN URLs. The 1st photo is the Hero Cover.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800">
                      {productForm.images.length} Photos Active
                    </span>
                  </div>

                  {/* Drag & Drop Multi-File Upload Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingImages(true);
                    }}
                    onDragLeave={() => setIsDraggingImages(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingImages(false);
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        Array.from(files).forEach((file) => {
                          const reader = new FileReader();
                          reader.onload = (uploadEvt) => {
                            const res = uploadEvt.target?.result as string;
                            if (res) {
                              setProductForm((prev) => ({
                                ...prev,
                                images: [...prev.images, res],
                              }));
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }
                    }}
                    className={`relative border-2 border-dashed rounded-3xl p-6 text-center transition-all ${
                      isDraggingImages
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30'
                        : 'border-slate-300 dark:border-slate-650 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      id="bulk-product-file-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleBulkFileUpload}
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 mx-auto flex items-center justify-center mb-2.5 shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>

                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      Drag & Drop Multiple High-Res Product Photos Here
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 mb-3">
                      Supports PNG, JPG, WEBP, AVIF (Select 5, 10 or 20 files together)
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <label
                        htmlFor="bulk-product-file-input"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Multiple Files from Device</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowBulkUrlModal(!showBulkUrlModal)}
                        className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Tag className="w-3.5 h-3.5 text-purple-600" />
                        <span>Bulk Import URLs (Multi-Paste)</span>
                      </button>
                    </div>
                  </div>

                  {/* Bulk URL Import Panel */}
                  {showBulkUrlModal && (
                    <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-purple-900 dark:text-purple-200 text-xs flex items-center gap-1.5">
                          <span>Paste Multiple Image URLs (One per line or comma-separated)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowBulkUrlModal(false)}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={bulkUrlInput}
                        onChange={(e) => setBulkUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-700 rounded-xl font-mono focus:outline-none"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowBulkUrlModal(false)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleBulkUrlImport}
                          className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs shadow-sm cursor-pointer"
                        >
                          + Import All URLs Now
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Single Fast URL Input Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={newImageUrlInput}
                      onChange={(e) => setNewImageUrlInput(e.target.value)}
                      placeholder="Or paste a single high-res CDN image URL..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      + Add Single URL
                    </button>
                  </div>

                  {/* Image Thumbnails & Sequence Arrangement Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Gallery Sequence & Hero Cover Order:
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Use arrows to reorder • First photo displays on Storefront Card
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      {productForm.images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-2xl overflow-hidden border transition-all group bg-slate-100 dark:bg-slate-800 ${
                            idx === 0
                              ? 'border-purple-600 ring-2 ring-purple-500/20 shadow-md'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Product gallery thumbnail ${idx + 1}`}
                            className="w-full h-32 object-cover object-center"
                          />

                          {/* Index Badge */}
                          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/70 text-white font-mono text-[9px] font-bold">
                            #{idx + 1}
                          </span>

                          {/* Hero Pill vs Set As Hero */}
                          {idx === 0 ? (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[9px] shadow-sm flex items-center gap-1">
                              ★ Hero Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 hover:bg-purple-600 text-white font-medium text-[9px] transition-colors cursor-pointer"
                            >
                              Make Hero
                            </button>
                          )}

                          {/* Reordering Controls */}
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-md p-0.5 backdrop-blur-xs">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'left')}
                                title="Move Earlier in Gallery"
                                className="p-1 text-white hover:text-purple-300"
                              >
                                <MoveLeft className="w-3 h-3" />
                              </button>
                            )}
                            {idx < productForm.images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'right')}
                                title="Move Later in Gallery"
                                className="p-1 text-white hover:text-purple-300"
                              >
                                <MoveRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Remove Photo"
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preset Luxury Verified Images */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2 text-xs">
                      Quick Add Verified Sample Photography:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Kanjeevaram Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Zari Pallu Detail', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Acoustic Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Wireless Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Ayurvedic Shilajit', url: 'https://images.unsplash.com/photo-1608248597359-009139265f04?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Cast Iron Skillet', url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80' },
                        { label: 'Kolhapuri Chappals', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            if (!productForm.images.includes(preset.url)) {
                              setProductForm((prev) => ({ ...prev, images: [...prev.images, preset.url] }));
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors cursor-pointer"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING, MARGINS & GST */}
              {productModalTab === 'pricing' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Selling Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Compare MRP (₹)
                      </label>
                      <input
                        type="number"
                        value={productForm.mrp}
                        onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Cost per Item / BOM (₹)
                      </label>
                      <input
                        type="number"
                        value={productForm.costPrice}
                        onChange={(e) => setProductForm({ ...productForm, costPrice: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  {/* Calculated Margin Box */}
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium block">
                        Estimated Customer Discount: {Math.max(0, Math.round(((productForm.mrp - productForm.price) / productForm.mrp) * 100))}% OFF MRP
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Net Profit Margin: {formatINR(productForm.price - productForm.costPrice)} per unit
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs">
                      {Math.round(((productForm.price - productForm.costPrice) / (productForm.price || 1)) * 100)}% Net Margin
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">GST Tax Slab</label>
                      <select
                        value={productForm.gstRate}
                        onChange={(e) => setProductForm({ ...productForm, gstRate: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold cursor-pointer"
                      >
                        <option value={5}>GST 5% (Textiles, Handloom Silk, Spices)</option>
                        <option value={12}>GST 12% (Ayurvedic Formulations, Handicrafts)</option>
                        <option value={18}>GST 18% (Electronics, Audio Gear, Lifestyle)</option>
                        <option value={28}>GST 28% (Luxury Goods & Premium Devices)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">HSN Code</label>
                      <input
                        type="text"
                        value={productForm.hsnCode}
                        onChange={(e) => setProductForm({ ...productForm, hsnCode: e.target.value })}
                        placeholder="e.g. 5208, 8518, 3004"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PRODUCT SPECIFICATIONS & DYNAMIC FIELD GENERATOR (Directly requested by user) */}
              {productModalTab === 'specs' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-purple-600" />
                        <span>Product Specifications & Dynamic Attribute Builder</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Dynamic custom field generator with one-click Indian industry presets. Renders on the PDP specifications table.
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 self-start sm:self-auto">
                      {productForm.specs.length} Attributes Defined
                    </span>
                  </div>

                  {/* Industry Vertical Preset Selector */}
                  <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                          Industry Schema Presets (Auto-fill standardized keys)
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Pre-configured for Indian GST, BIS Hallmark, Silk Mark & AYUSH standards
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={specPresetKey}
                        onChange={(e) => loadSpecPreset(e.target.value)}
                        className="text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 rounded-xl font-semibold text-purple-700 dark:text-purple-300 cursor-pointer focus:outline-none"
                      >
                        <option value="custom" disabled>Select Industry Preset</option>
                        {Object.entries(SPEC_PRESETS).map(([key, item]) => (
                          <option key={key} value={key}>{item.label}</option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={handleAddSpecRow}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Row</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Specifications Rows */}
                  <div className="space-y-2">
                    {productForm.specs.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Sliders className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">No specifications added yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Row" or choose an Industry Preset above.</p>
                      </div>
                    ) : (
                      productForm.specs.map((item, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-750 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-200 transition-colors"
                        >
                          {/* Reorder Handle & Index */}
                          <div className="col-span-1 flex items-center justify-center gap-0.5">
                            <span className="font-mono text-[10px] text-slate-400 w-4">{idx + 1}</span>
                            <div className="flex flex-col">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveSpec(idx, 'up')}
                                  className="text-slate-400 hover:text-purple-600 p-0.5"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                              )}
                              {idx < productForm.specs.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveSpec(idx, 'down')}
                                  className="text-slate-400 hover:text-purple-600 p-0.5"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Specification Name / Key */}
                          <div className="col-span-4">
                            <input
                              type="text"
                              value={item.key}
                              onChange={(e) => handleUpdateSpec(idx, e.target.value, item.value)}
                              placeholder="e.g. Fabric Material, Battery Life, BIS Hallmark"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-xs focus:outline-none"
                            />
                          </div>

                          {/* Specification Value */}
                          <div className="col-span-6">
                            <input
                              type="text"
                              value={item.value}
                              onChange={(e) => handleUpdateSpec(idx, item.key, e.target.value)}
                              placeholder="e.g. Pure Kanjeevaram Silk, 50 Hours, 22K 916"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                            />
                          </div>

                          {/* Remove Row Button */}
                          <div className="col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveSpec(idx)}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                              title="Delete Row"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Specification Table Footer Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-purple-600" />
                      <span>+ Add Another Attribute</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProductForm((prev) => ({ ...prev, specs: [] }))}
                      className="text-[11px] text-slate-400 hover:text-red-500 underline cursor-pointer"
                    >
                      Clear All Rows
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: CUSTOMER REVIEWS & RATINGS (Directly requested by user!) */}
              {productModalTab === 'reviews' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Customer Ratings & Reviews Setup</h4>
                      <p className="text-xs text-slate-400">Configure verified review score and customer feedback quotes shown on storefront card & PDP.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Average Star Rating (1.0 to 5.0)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={productForm.rating}
                        onChange={(e) => setProductForm({ ...productForm, rating: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Total Verified Reviews Count
                      </label>
                      <input
                        type="number"
                        value={productForm.reviewCount}
                        onChange={(e) => setProductForm({ ...productForm, reviewCount: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  {/* Badges Toggle */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Merchandising Badges</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isBestseller}
                          onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                          className="rounded text-purple-600 focus:ring-0"
                        />
                        <span className="font-semibold">Bestseller Pill</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isDealOfTheDay}
                          onChange={(e) => setProductForm({ ...productForm, isDealOfTheDay: e.target.checked })}
                          className="rounded text-orange-600 focus:ring-0"
                        />
                        <span className="font-semibold text-orange-600">Deals of the Day 🔥</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isNewArrival}
                          onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                          className="rounded text-indigo-600 focus:ring-0"
                        />
                        <span className="font-semibold">New Arrival</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: INVENTORY & STATUS */}
              {productModalTab === 'inventory' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Stock Quantity (Units) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        SKU Identifier
                      </label>
                      <input
                        type="text"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Barcode (EAN-13)
                      </label>
                      <input
                        type="text"
                        value={productForm.barcode}
                        onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Publishing Status
                      </label>
                      <select
                        value={productForm.status}
                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value as ProductStatus })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold cursor-pointer"
                      >
                        <option value="active">Active (Live on Storefront)</option>
                        <option value="paused">Paused (Temporarily Hidden)</option>
                        <option value="sold_out">Sold Out (Mark as Out of Stock)</option>
                        <option value="draft">Draft (Private Merchant)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Return Window (Days)
                      </label>
                      <input
                        type="number"
                        value={productForm.returnPolicyDays}
                        onChange={(e) => setProductForm({ ...productForm, returnPolicyDays: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.codAvailable}
                      onChange={(e) => setProductForm({ ...productForm, codAvailable: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Enable Cash on Delivery (COD) for this product
                    </span>
                  </label>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {productModalTab !== 'inventory' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: Array<'basic' | 'media' | 'pricing' | 'specs' | 'reviews' | 'inventory'> = ['basic', 'media', 'pricing', 'specs', 'reviews', 'inventory'];
                        const nextIdx = tabs.indexOf(productModalTab) + 1;
                        if (nextIdx < tabs.length) setProductModalTab(tabs[nextIdx]);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
                    >
                      Next Step →
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-600/20 cursor-pointer transition-all"
                  >
                    {editingProductId ? 'Save Product Updates' : 'Publish Product to Store'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
