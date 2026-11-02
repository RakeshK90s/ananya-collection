import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/formatters';

interface ShareModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ product, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?product=${product.id}`
    : `https://ananyacollection.com?product=${product.id}`;

  const shareMessage = `✨ *${product.title}*\n💎 Price: ${formatINR(product.price)} (${product.discountPercent}% OFF)\n🏛️ Boutique: Ananya Collection (Rohini, Delhi)\n👉 View & Order Online: ${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.title} from Ananya Collection (Rohini, Delhi)`)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} | Ananya Collection`,
          text: `Check out ${product.title} (${formatINR(product.price)}) from Ananya Collection (Rohini, Delhi)`,
          url: shareUrl,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 text-[#B8860B] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-amber-100">
                Share this Couture
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Ananya Collection · Rohini, Delhi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Preview Card */}
        <div className="my-4 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 flex items-center gap-3">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80'}
            alt={product.title}
            className="w-16 h-20 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700 shadow-2xs"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              {product.brand} · {product.category}
            </span>
            <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate mt-0.5">
              {product.title}
            </h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-bold text-stone-900 dark:text-amber-200">
                {formatINR(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatINR(product.mrp)}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Primary Action: WhatsApp Share */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer mb-3"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Share via WhatsApp (Direct Message)</span>
        </button>

        {/* Social Share Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={handleFacebookShare}
            className="py-2 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#1877F2]/20"
          >
            <span>Facebook</span>
          </button>
          <button
            onClick={handleTwitterShare}
            className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
          >
            <span>X / Twitter</span>
          </button>
          <button
            onClick={handleNativeShare}
            className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-amber-200 dark:border-amber-800"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>More</span>
          </button>
        </div>

        {/* Copy Link Row */}
        <div>
          <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
            Or copy product direct link:
          </label>
          <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800 p-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent px-2 text-xs font-mono text-stone-600 dark:text-stone-300 truncate focus:outline-hidden"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#B8860B] hover:bg-[#996515] text-white shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
