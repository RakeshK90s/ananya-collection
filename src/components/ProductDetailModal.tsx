import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  CheckCircle2,
  Share2,
  ShieldCheck,
  RotateCcw,
  MapPin,
  ChevronRight,
  Heart,
  Store,
  Info,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatINR, useTranslation } from '../utils/formatters';
import { PINCODE_DATABASE, SAMPLE_REVIEWS } from '../data/mockData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const {
    theme,
    language,
    addToCart,
    wishlist,
    toggleWishlist,
    setSharingProduct,
    setActiveTab,
  } = useStore();

  const t = useTranslation(language);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{
    valid: boolean;
    city: string;
    state: string;
    days: number;
    cod: boolean;
    courier: string;
  } | null>(null);
  const [activeTab, setActiveInfoTab] = useState<'highlights' | 'specs' | 'reviews'>('highlights');

  if (!product) return null;

  const isSoldOut = product.status === 'sold_out' || product.stock <= 0;
  const isWishlisted = wishlist.includes(product.id);

  // Initialize default variants
  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: option }));
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincodeInput.trim();
    if (cleanPin.length !== 6 || !/^\d+$/.test(cleanPin)) {
      alert('Please enter a valid 6-digit Indian PIN code (e.g. 110001 or 400001).');
      return;
    }

    const data = PINCODE_DATABASE[cleanPin] || {
      city: 'Local Area',
      state: 'India',
      days: 3,
      cod: true,
      courier: 'Delhivery Surface Express',
    };

    setPincodeResult({
      valid: true,
      ...data,
    });
  };

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(product, quantity, selectedVariants);
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    addToCart(product, quantity, selectedVariants);
    onClose();
    setActiveTab('checkout');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Check out ${product.title} on ${theme.storeName} for just ${formatINR(product.price)}! Free shipping across India.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const reviews = SAMPLE_REVIEWS[product.id] || [
    { name: 'Ananya Deshpande', city: 'Mumbai', rating: 5, date: '16 Oct 2026', comment: 'Superb quality and authentic craftsmanship! Packaging was very premium and secure.' },
    { name: 'Vikram Sengupta', city: 'Kolkata', rating: 5, date: '04 Oct 2026', comment: 'Prompt 2-day delivery by Delhivery. Exactly as described on the website.' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div
        style={{
          backgroundColor: 'var(--theme-card)',
          borderRadius: `${theme.borderRadius + 4}px`,
          borderColor: 'var(--theme-border)',
        }}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto border shadow-2xl transition-all"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Gallery Column (5 Cols) */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <div className="relative aspect-4/5 w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-center ${
                    isSoldOut ? 'grayscale contrast-125' : ''
                  }`}
                />

                {isSoldOut && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-md">
                      {t.soldOut}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails rail if multiple images */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Store Marker */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sold & Fulfilled by:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{product.storeName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            {/* Info & Purchase Column (7 Cols) */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Brand & Breadcrumb */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-indigo-600 uppercase tracking-wide">{product.brand}</span>
                    <span aria-hidden="true">·</span>
                    <span>{language === 'hi' ? product.categoryHi : product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">SKU: {product.sku}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setSharingProduct(product)}
                      className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 px-2 py-1 rounded-md"
                      title="Share on WhatsApp & Social Media"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="flex items-center gap-1 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer text-[11px] font-medium bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 px-2 py-1 rounded-md"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
                      <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {language === 'hi' ? product.titleHi : product.title}
                </h1>

                {/* Rating & Review Counter */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md text-xs font-bold">
                    <span>{product.rating}</span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  </div>
                  <span className="text-xs text-slate-500 underline cursor-pointer" onClick={() => setActiveInfoTab('reviews')}>
                    {product.reviewCount} Verified Buyer Ratings
                  </span>
                </div>

                {/* Pricing Block with Indian Psychology */}
                <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatINR(product.price)}
                    </span>
                    {product.mrp > product.price && (
                      <span className="text-sm text-slate-400 line-through tabular-nums">
                        MRP {formatINR(product.mrp)}
                      </span>
                    )}
                    {product.discountPercent > 0 && (
                      <span
                        style={{ backgroundColor: 'var(--theme-secondary)' }}
                        className="px-2 py-0.5 text-xs font-bold text-white rounded-md"
                      >
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    {t.gstInclusive} ({product.gstRate}% GST included)
                  </p>
                </div>

                {/* Variants Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {product.variants.map((variant) => (
                      <div key={variant.id}>
                        <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Select {variant.name}:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {variant.options.map((opt) => {
                            const isSelected = selectedVariants[variant.name] === opt || (!selectedVariants[variant.name] && opt === variant.options[0]);
                            return (
                              <button
                                key={opt}
                                onClick={() => handleVariantSelect(variant.name, opt)}
                                style={{
                                  borderColor: isSelected ? 'var(--theme-primary)' : '',
                                  backgroundColor: isSelected ? 'var(--theme-primary)' : '',
                                  color: isSelected ? '#FFFFFF' : '',
                                }}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                                  isSelected
                                    ? 'shadow-xs'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold tabular-nums">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                    >
                      +
                    </button>
                  </div>
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="text-xs text-amber-600 font-medium">
                      {t.hurryOnly} {product.stock} {t.leftInStock}
                    </span>
                  )}
                </div>

                {/* Indian Delivery Pincode Checker */}
                <div className="mt-5 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    <span>{t.estimatedDelivery} Check</span>
                  </div>

                  <form onSubmit={handleCheckPincode} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value)}
                      placeholder={t.enterPincode}
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {t.check}
                    </button>
                  </form>

                  {pincodeResult && (
                    <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                      <p className="font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Delivery in {pincodeResult.days} {pincodeResult.days === 1 ? 'day' : 'days'} to {pincodeResult.city}, {pincodeResult.state}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Via {pincodeResult.courier} · Cash on Delivery {pincodeResult.cod ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons: Add to Cart & Buy Now */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {isSoldOut ? (
                    <button
                      onClick={() => alert(`We will notify you on WhatsApp/Email when "${product.title}" is back in stock!`)}
                      className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t.notifyMe}</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleAddToCart}
                        style={{
                          backgroundColor: 'var(--theme-card)',
                          borderColor: 'var(--theme-primary)',
                          color: 'var(--theme-primary)',
                        }}
                        className="flex-1 py-3 px-4 text-xs font-bold rounded-xl border-2 hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t.addToCart}</span>
                      </button>

                      <button
                        onClick={handleBuyNow}
                        style={{
                          backgroundColor: 'var(--theme-secondary)',
                          color: '#FFFFFF',
                        }}
                        className="flex-1 py-3 px-4 text-xs font-bold rounded-xl shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span>{t.buyNow}</span>
                      </button>
                    </>
                  )}

                  {/* WhatsApp Share Button */}
                  <button
                    onClick={handleWhatsAppShare}
                    title="Share this product on WhatsApp"
                    className="px-3 py-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                </div>

                {/* Trust Guarantees */}
                <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>7 Days Easy Return</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>100% Genuine Item</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>Fast Pan-India Transit</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Deep Tabs: Highlights, Specifications, Reviews */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setActiveInfoTab('highlights')}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeTab === 'highlights'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Key Highlights
              </button>
              <button
                onClick={() => setActiveInfoTab('specs')}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeTab === 'specs'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.specifications}
              </button>
              <button
                onClick={() => setActiveInfoTab('reviews')}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.reviewsAndRatings} ({product.reviewCount})
              </button>
            </div>

            <div className="py-4">
              {activeTab === 'highlights' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {language === 'hi' ? product.descriptionHi : product.description}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {(language === 'hi' ? product.highlightsHi : product.highlights).map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <tbody>
                      {Object.entries(product.specs).map(([key, val], idx) => (
                        <tr
                          key={key}
                          className={idx % 2 === 0 ? 'bg-slate-50/60 dark:bg-slate-800/40' : 'bg-white dark:bg-slate-800'}
                        >
                          <td className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 w-1/3 border-b border-slate-200/50 dark:border-slate-700/50">
                            {key}
                          </td>
                          <td className="px-4 py-2 text-slate-900 dark:text-white border-b border-slate-200/50 dark:border-slate-700/50 font-medium">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{product.rating}</span>
                      <div>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400">Based on {product.reviewCount} customer reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {reviews.map((rev, index) => (
                      <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {rev.name} ({rev.city})
                          </span>
                          <span className="text-slate-400 text-[11px]">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-1 text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-500" />
                          ))}
                          <span className="text-[10px] text-emerald-600 font-semibold ml-2">✓ Verified Purchase</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
