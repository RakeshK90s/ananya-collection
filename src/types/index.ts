export type Language = 'en' | 'hi';

export type UserRole = 'customer' | 'admin' | 'seller' | 'super_admin';

export type ActiveTab = 
  | 'storefront'
  | 'admin'
  | 'product-detail'
  | 'checkout'
  | 'order-success'
  | 'order-tracking'
  | 'seller-admin'
  | 'theme-customiser'
  | 'store-wizard'
  | 'super-admin'
  | 'my-account';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  storeId?: string; // If seller, maps to their SellerStore.id
  storeName?: string;
  isLoggedIn: boolean;
  avatar?: string;
  buyerId?: string; // Unique Buyer ID e.g. "LX-BUYER-89421"
  loyaltyTier?: 'Silver' | 'Gold' | 'Platinum' | 'Sovereign';
  city?: string;
  state?: string;
  pincode?: string;
  referralCode?: string;
  savedAddresses?: CustomerAddress[];
}

export type ProductStatus = 'active' | 'paused' | 'sold_out' | 'draft';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size" or "Color"
  options: string[]; // e.g. ["S", "M", "L", "XL"] or ["Midnight Black", "Royal Emerald"]
}

export interface ProductReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  fabric?: string;
  priceOverride?: number;
  stock: number;
  image?: string;
  barcode?: string;
  available: boolean;
}

export interface InventoryDetails {
  stockQuantity: number;
  reservedStock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorders: boolean;
  warehouseLocation?: string;
}

export interface ShippingDetails {
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  shippingClass: 'standard' | 'express' | 'heavy';
  freeShipping: boolean;
  codAvailable: boolean;
  dispatchTime: string;
  handlingInstructions?: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  slug: string;
  canonicalUrl?: string;
  ogImage?: string;
  index: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  title: string;
  titleHi: string;
  subtitle?: string;
  slug?: string;
  barcode?: string;
  productType?: string;
  purchaseCost?: number;
  description: string;
  descriptionHi: string;
  category: string;
  categoryHi: string;
  subcategory?: string;
  subcategoryHi?: string;
  brand: string;
  price: number; // In INR (₹)
  mrp: number; // Strikethrough price
  discountPercent: number;
  stock: number;
  status: ProductStatus;
  sku: string;
  gstRate: number; // 5%, 12%, 18%, 28%
  hsnCode: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isDealOfTheDay?: boolean;
  dealEndsAt?: string; // ISO date string or relative hours
  isNewArrival?: boolean;
  variants?: ProductVariant[];
  variantMatrix?: ProductVariantItem[];
  inventoryDetails?: InventoryDetails;
  shippingDetails?: ShippingDetails;
  seoSettings?: SeoSettings;
  categorySpecs?: Record<string, string>;
  relatedProductIds?: string[];
  sizes?: string[]; // e.g. ["S", "M", "L", "XL"] or ["Free Size"]
  colors?: string[]; // e.g. ["Emerald Green", "Midnight Black", "Gold"]
  tags?: string[];
  highlights: string[];
  highlightsHi: string[];
  specs: Record<string, string>;
  returnPolicyDays: number; // e.g. 7
  codAvailable: boolean;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  variantSku?: string;
  prevQty: number;
  newQty: number;
  change: number;
  reason: 'restock' | 'sale' | 'return' | 'damaged' | 'audit_adjustment';
  timestamp: string;
  adminUser: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  adminUser: string;
  ip?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'stock' | 'payment' | 'system';
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  ownerName: string;
  email: string;
  mobile: string;
  whatsappNumber: string;
  gstin: string;
  panNumber: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  freeShippingAbove: number;
  standardShippingFee: number;
  codFee: number;
  codEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  isTestMode: boolean;
  shippingPartner: 'delhivery' | 'shiprocket';
}

export interface SubCategory {
  id: string;
  name: string;
  nameHi: string;
  itemCount?: number;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  nameHi: string;
  iconName: string; // Lucide icon identifier
  image: string;
  itemCount: number;
  featured?: boolean;
  subcategories?: SubCategory[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: Record<string, string>; // e.g. { Size: 'L', Color: 'Emerald' }
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 15 for 15% or 500 for ₹500
  minOrderValue: number;
  description: string;
  descriptionHi: string;
}

export interface CustomerAddress {
  fullName: string;
  mobile: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  landmark?: string;
  type: 'home' | 'work';
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod' | 'emi';

export interface TrackingStep {
  status: string;
  statusHi: string;
  date: string;
  time: string;
  location: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string; // e.g. "LX-IND-89421"
  storeId: string;
  storeName: string;
  date: string;
  customer: CustomerAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  gstAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'cod_verified';
  orderStatus: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  trackingNumber: string; // e.g. "DLV-984218392"
  courierPartner: 'Delhivery' | 'Shiprocket' | 'Bluedart';
  estimatedDeliveryDate: string;
  timeline: TrackingStep[];
  upiTransactionId?: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  cardColor: string;
  textColor: string;
  fontFamily: 'Cinzel' | 'Playfair Display' | 'Cormorant Garamond' | 'Plus Jakarta Sans' | 'Outfit' | 'Poppins' | 'Inter';
  borderRadius: number;
  isDark: boolean;
}

export interface StoreThemeConfig {
  storeName: string;
  tagline: string;
  taglineHi: string;
  logoText: string;
  logoUrl?: string;
  presetId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  cardColor: string;
  textColor: string;
  borderColor: string;
  fontFamily: 'Cinzel' | 'Playfair Display' | 'Cormorant Garamond' | 'Plus Jakarta Sans' | 'Outfit' | 'Poppins' | 'Inter';
  borderRadius: number; // 4, 8, 12, 16, 24
  announcementText: string;
  announcementTextHi: string;
  showAnnouncement: boolean;
  isDarkMode: boolean;
}

export interface SellerStore {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  email: string;
  mobile: string;
  gstin: string;
  city: string;
  state: string;
  status: 'active' | 'pending' | 'suspended';
  commissionRate: number; // e.g. 5%
  totalRevenue: number;
  totalOrders: number;
  productCount: number;
  joinedDate: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  isTestMode: boolean;
  codEnabled: boolean;
  codCharge: number;
  freeShippingAbove: number;
  shippingPartner: 'delhivery' | 'shiprocket';
  whatsappSupportNumber: string;
}

export interface SuperAdminStats {
  totalPlatformRevenue: number;
  totalCommissionEarned: number;
  totalActiveSellers: number;
  totalActiveProducts: number;
  totalPlatformOrders: number;
  defaultCommissionRate: number;
}
