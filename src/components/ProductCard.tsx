import React from 'react';
import { Heart, Star, ShoppingBag, Eye, Bell, Share2 } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatINR, useTranslation } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const {
    theme,
    language,
    addToCart,
    wishlist,
    toggleWishlist,
    setSelectedProduct,
    setSharingProduct,
  } = useStore();

  const t = useTranslation(language);
  const isWishlisted = wishlist.includes(product.id);
  const isSoldOut = product.status === 'sold_out' || product.stock <= 0;

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSoldOut) {
      addToCart(product, 1);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setSelectedProduct(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: 'var(--theme-card)',
        borderRadius: `${theme.borderRadius}px`,
        borderColor: 'var(--theme-border)',
      }}
      className={`group relative flex flex-col border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer overflow-hidden ${
        isSoldOut ? 'opacity-90' : ''
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-4/5 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            isSoldOut ? 'grayscale contrast-125' : ''
          }`}
        />

        {/* Floating Discount & Status Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-white rounded-md shadow-xs backdrop-blur-xs">
              {t.soldOut}
            </span>
          ) : (
            <>
              {product.discountPercent > 0 && (
                <span
                  style={{ backgroundColor: 'var(--theme-secondary)' }}
                  className="px-2 py-0.5 text-[10px] font-bold text-white rounded-md shadow-xs"
                >
                  {product.discountPercent}% OFF
                </span>
              )}
              {product.isBestseller && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-md shadow-xs">
                  Bestseller
                </span>
              )}
              {product.isDealOfTheDay && (
                <span
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                  className="px-2 py-0.5 text-[10px] font-bold text-white rounded-md shadow-xs"
                >
                  Deal
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button (Frosted Circle with animated pop) */}
        <button
          onClick={handleWishlistToggle}
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-90 transition-all z-10 cursor-pointer shadow-xs"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? 'text-rose-600 fill-rose-600 animate-heart-pop'
                : 'hover:text-rose-600'
            }`}
          />
        </button>

        {/* Share Button (Frosted Circle) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSharingProduct(product);
          }}
          title="Share on WhatsApp & Social Media"
          className="absolute top-12 right-2.5 w-8 h-8 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#25D366] hover:scale-110 active:scale-90 transition-all z-10 cursor-pointer shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickView}
            className="w-full py-1.5 px-3 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white rounded-lg text-xs font-semibold shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 hover:bg-white transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata (Category · Brand) */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium truncate">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{language === 'hi' ? product.categoryHi : product.category}</span>
          </div>

          {/* Product Title */}
          <h3
            style={{ color: 'var(--theme-text)' }}
            className="text-xs sm:text-sm font-semibold line-clamp-2 leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors"
          >
            {language === 'hi' ? product.titleHi : product.title}
          </h3>

          {/* Ratings & Verified Buyer Count */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            </div>
            <span className="text-[10px] text-slate-400">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-baseline gap-2 mb-2">
            <span
              style={{ color: 'var(--theme-text)' }}
              className="text-sm sm:text-base font-bold tabular-nums"
            >
              {formatINR(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>

          {/* Add to Cart or Sold Out Button */}
          {isSoldOut ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert(`We will notify you on WhatsApp/Email when "${product.title}" is back in stock!`);
              }}
              className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{t.notifyMe}</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-3 bg-stone-900 hover:bg-black text-amber-200 dark:bg-amber-400 dark:text-stone-950 text-xs font-semibold rounded-lg shadow-xs hover:opacity-95 active:scale-97 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400 dark:text-stone-950" />
              <span>{t.addToCart}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
