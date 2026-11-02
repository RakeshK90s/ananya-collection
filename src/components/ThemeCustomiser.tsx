import React, { useState } from 'react';
import {
  Palette,
  RotateCcw,
  Download,
  Upload,
  Check,
  Sparkles,
  Type,
  Maximize2,
  Sliders,
  Store,
  Layers,
  ArrowRight,
  Eye,
  ShoppingBag,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { THEME_PRESETS } from '../data/mockData';
import { useTranslation, formatINR } from '../utils/formatters';

export const ThemeCustomiser: React.FC = () => {
  const {
    theme,
    updateTheme,
    applyPreset,
    resetTheme,
    exportThemeJson,
    importThemeJson,
    language,
    setActiveTab,
  } = useStore();

  const t = useTranslation(language);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);

  const handleExport = () => {
    const json = exportThemeJson();
    navigator.clipboard.writeText(json);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleImportSubmit = () => {
    const success = importThemeJson(importJsonText);
    if (success) {
      setShowImportModal(false);
      setImportJsonText('');
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 2500);
    } else {
      alert('Invalid Theme JSON format. Please verify the JSON string.');
    }
  };

  const handleSaveAndApply = () => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2500);
  };

  const popularSwatches = {
    primary: ['#4F46E5', '#D97706', '#1D4ED8', '#0F172A', '#C2410C', '#7C3AED', '#059669', '#DC2626'],
    secondary: ['#F97316', '#047857', '#F59E0B', '#E11D48', '#15803D', '#EC4899', '#2563EB', '#84CC16'],
    bg: ['#F8FAFC', '#FFFDF9', '#FAF6F0', '#F1F5F9', '#FFFFFF', '#0B0F17', '#0A0E1A', '#18181B'],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: 'var(--theme-primary)' }}
              className="p-1.5 rounded-lg text-white"
            >
              <Palette className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.customizeThemeTitle}
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? 'यहाँ से आप अपने ऑनलाइन स्टोर का नाम, लोगो, प्राथमिक और सेकेंडरी रंग, फॉन्ट और लेआउट कभी भी आसानी से बदल सकते हैं।'
              : 'Easily customize your storefront branding, color palette, typography, announcement bar, and layout tokens with instant live preview.'}
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={resetTheme}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetDefault}</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{copiedNotification ? 'JSON Copied!' : t.exportJson}</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t.importJson}</span>
          </button>

          <button
            onClick={() => setActiveTab('storefront')}
            style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg shadow-sm hover:opacity-95 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>View Live Storefront</span>
          </button>
        </div>
      </div>

      {saveNotification && (
        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">
              {language === 'hi' ? 'थीम सफलतापूर्वक सहेज ली गई है और स्टोर पर लागू हो चुकी है!' : 'Theme settings successfully saved and applied live across your entire store!'}
            </span>
          </div>
          <button onClick={() => setActiveTab('storefront')} className="underline font-bold">
            See Storefront &rarr;
          </button>
        </div>
      )}

      {/* Main Grid: Controls Left + Live Mockup Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* LEFT COLUMN: Controls (8 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: 1-Click Curated Presets */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {t.presetThemes}
              </h2>
              <span className="text-xs text-slate-500">6 Ready-to-use palettes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isActive = theme.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`p-3 text-left rounded-xl border transition-all relative overflow-hidden group ${
                      isActive
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-slate-700/50'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {language === 'hi' ? preset.nameHi : preset.name}
                      </span>
                      {isActive && (
                        <span className="w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mb-2">
                      <div
                        style={{ backgroundColor: preset.primaryColor }}
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        title="Primary Color"
                      />
                      <div
                        style={{ backgroundColor: preset.secondaryColor }}
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        title="Secondary (CTA) Color"
                      />
                      <div
                        style={{ backgroundColor: preset.accentColor }}
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        title="Accent Color"
                      />
                      <div
                        style={{ backgroundColor: preset.bgColor }}
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        title="Background Tone"
                      />
                      <span className="text-[10px] text-slate-400 font-mono ml-auto">
                        {preset.fontFamily}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Store Identity & Branding */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Store className="w-4 h-4 text-indigo-500" />
              {t.brandName} & Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Store Name (ब्रांड का नाम)
                </label>
                <input
                  type="text"
                  value={theme.storeName}
                  onChange={(e) => updateTheme({ storeName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. LuxeCart Bharat"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logo Short Name (लोगो टेक्स्ट)
                </label>
                <input
                  type="text"
                  value={theme.logoText}
                  onChange={(e) => updateTheme({ logoText: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. AC"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brand Logo Image URL (लोगो इमेज URL)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={theme.logoUrl || ''}
                    onChange={(e) => updateTheme({ logoUrl: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="/logo.jpg"
                  />
                  {theme.logoUrl && (
                    <img
                      src={theme.logoUrl}
                      alt="Logo Preview"
                      className="w-8 h-8 rounded-full object-cover border border-amber-400 bg-black shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline (English)
                </label>
                <input
                  type="text"
                  value={theme.tagline}
                  onChange={(e) => updateTheme({ tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. Premium Multi-Seller Online Store"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  टैगलाइन (हिंदी)
                </label>
                <input
                  type="text"
                  value={theme.taglineHi}
                  onChange={(e) => updateTheme({ taglineHi: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="उदा. भारत का प्रीमियम मल्टी-सेलर ऑनलाइन स्टोर"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Fine-Grained Color System */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Custom Color Palette (रंग पैलेट)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Primary Color */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Primary Brand Color
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    {theme.primaryColor}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {popularSwatches.primary.map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        onClick={() => updateTheme({ primaryColor: swatch })}
                        style={{ backgroundColor: swatch }}
                        className={`w-5 h-5 rounded-full border border-black/10 transition-transform hover:scale-110 ${
                          theme.primaryColor.toLowerCase() === swatch.toLowerCase() ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Used for brand mark, active nav links, headers & icons.</p>
              </div>

              {/* Secondary CTA Color */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Secondary CTA Color (Action Triggers)
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    {theme.secondaryColor}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {popularSwatches.secondary.map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        onClick={() => updateTheme({ secondaryColor: swatch })}
                        style={{ backgroundColor: swatch }}
                        className={`w-5 h-5 rounded-full border border-black/10 transition-transform hover:scale-110 ${
                          theme.secondaryColor.toLowerCase() === swatch.toLowerCase() ? 'ring-2 ring-orange-500 ring-offset-1' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Dedicated to "Add to Cart", "Buy Now" and high-conversion buttons.</p>
              </div>

              {/* Accent / Offer Tag Color */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Accent & Discount Color
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    {theme.accentColor}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => updateTheme({ accentColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <span className="text-xs text-slate-500">Highlight discount tags & verified trust markers.</span>
                </div>
              </div>

              {/* Background Canvas Tone */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Store Canvas Background
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    {theme.bgColor}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.bgColor}
                    onChange={(e) => updateTheme({ bgColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {popularSwatches.bg.map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        onClick={() => {
                          const isDark = swatch === '#0B0F17' || swatch === '#0A0E1A' || swatch === '#18181B';
                          updateTheme({
                            bgColor: swatch,
                            cardColor: isDark ? '#151D2C' : '#FFFFFF',
                            textColor: isDark ? '#F8FAFC' : '#0F172A',
                            isDarkMode: isDark,
                          });
                        }}
                        style={{ backgroundColor: swatch }}
                        className={`w-5 h-5 rounded-full border border-black/10 transition-transform hover:scale-110 ${
                          theme.bgColor.toLowerCase() === swatch.toLowerCase() ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Typography, Radius & Marquee Banner */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Type className="w-4 h-4 text-indigo-500" />
              Typography & Shapes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fontFamily}
                </label>
                <select
                  value={theme.fontFamily}
                  onChange={(e) => updateTheme({ fontFamily: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Playfair Display">Playfair Display + Inter + Noto Sans Devanagari (Recommended Luxury & SaaS)</option>
                  <option value="Inter">Inter + Noto Sans Devanagari (Modern SaaS Clean)</option>
                  <option value="Cinzel">Cinzel + Inter + Noto Sans Devanagari (Regal Indian Couture)</option>
                  <option value="Cormorant Garamond">Cormorant Garamond + Inter (Classic Fine Jewelry & Silk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Card Border Radius: {theme.borderRadius}px
                </label>
                <div className="flex items-center gap-3 mt-2">
                  {[4, 8, 12, 16, 24].map((rad) => (
                    <button
                      key={rad}
                      type="button"
                      onClick={() => updateTheme({ borderRadius: rad })}
                      className={`flex-1 py-1 text-xs font-semibold rounded-md border transition-all ${
                        theme.borderRadius === rad
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {rad}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Header Announcement Bar Editor */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                    {t.announcementBanner}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Show Marquee</span>
                    <input
                      type="checkbox"
                      checked={theme.showAnnouncement}
                      onChange={(e) => updateTheme({ showAnnouncement: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded-sm cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={theme.announcementText}
                    onChange={(e) => updateTheme({ announcementText: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    placeholder="Announcement in English"
                  />
                  <input
                    type="text"
                    value={theme.announcementTextHi}
                    onChange={(e) => updateTheme({ announcementTextHi: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    placeholder="घोषणा हिंदी में"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleSaveAndApply}
              style={{ backgroundColor: 'var(--theme-secondary)', color: '#FFFFFF' }}
              className="px-6 py-2.5 text-xs font-bold rounded-lg shadow-md hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{t.saveAndApply}</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Live Mockup Preview (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-500" />
                Live Storefront Preview
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                Real-Time Render
              </span>
            </div>

            {/* Mockup Canvas */}
            <div
              style={{
                backgroundColor: theme.bgColor,
                fontFamily: `'${theme.fontFamily}', sans-serif`,
                color: theme.textColor,
                borderRadius: `${theme.borderRadius}px`,
              }}
              className="border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-all duration-300"
            >
              {/* Mockup Announcement */}
              {theme.showAnnouncement && (
                <div
                  style={{ backgroundColor: theme.primaryColor }}
                  className="py-1.5 px-3 text-[10px] text-white text-center font-medium truncate"
                >
                  {language === 'hi' ? theme.announcementTextHi : theme.announcementText}
                </div>
              )}

              {/* Mockup Header */}
              <div
                style={{ backgroundColor: theme.cardColor }}
                className="px-4 py-3 border-b border-black/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {theme.logoUrl ? (
                    <img
                      src={theme.logoUrl}
                      alt={theme.storeName}
                      className="w-7 h-7 rounded-full object-cover border border-amber-400/80 bg-black"
                    />
                  ) : (
                    <div
                      style={{ backgroundColor: theme.primaryColor }}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs"
                    >
                      {theme.logoText ? theme.logoText.slice(0, 2) : 'AC'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-xs tracking-tight leading-none font-serif">{theme.storeName}</h3>
                    <p className="text-[9px] text-amber-500 font-medium">Rohini, Delhi</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-slate-400">Cart (3)</span>
                  <div
                    style={{ backgroundColor: theme.secondaryColor }}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-white"
                  >
                    <ShoppingBag className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Mockup Content Body */}
              <div className="p-4 space-y-4">
                {/* Hero Snippet */}
                <div
                  style={{
                    backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                    borderRadius: `${Math.max(6, theme.borderRadius - 4)}px`,
                  }}
                  className="p-3.5 border border-black/5"
                >
                  <span
                    style={{ color: theme.primaryColor }}
                    className="text-[10px] font-bold uppercase tracking-wider block"
                  >
                    Festive 2026 Collection
                  </span>
                  <h4 className="text-sm font-bold mt-0.5 leading-snug">
                    {language === 'hi' ? 'भारतीय कारीगरों द्वारा हस्तनिर्मित संग्रह' : 'Handcrafted Heritage for the Modern Indian Home'}
                  </h4>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      style={{
                        backgroundColor: theme.secondaryColor,
                        color: '#FFFFFF',
                        borderRadius: `${Math.max(4, theme.borderRadius - 6)}px`,
                      }}
                      className="px-3 py-1 text-[11px] font-bold shadow-xs"
                    >
                      Shop Now
                    </button>
                    <span className="text-[11px] font-medium text-slate-400">
                      From ₹999
                    </span>
                  </div>
                </div>

                {/* Sample Product Card Mockup */}
                <div
                  style={{
                    backgroundColor: theme.cardColor,
                    borderRadius: `${theme.borderRadius}px`,
                  }}
                  className="p-3 border border-black/5 shadow-xs flex items-center gap-3"
                >
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80"
                    alt="Sample"
                    className="w-16 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        style={{ color: theme.accentColor }}
                        className="text-[10px] font-bold"
                      >
                        61% OFF
                      </span>
                      <span className="text-[10px] text-slate-400">· Pure Silk</span>
                    </div>
                    <p className="text-xs font-bold truncate mt-0.5">
                      Kanjeevaram Silk Saree
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xs font-bold">{formatINR(3499)}</span>
                      <span className="text-[10px] text-slate-400 line-through">₹8,999</span>
                    </div>
                    <button
                      style={{
                        backgroundColor: theme.secondaryColor,
                        color: '#FFFFFF',
                        borderRadius: `${Math.max(4, theme.borderRadius - 6)}px`,
                      }}
                      className="mt-2 w-full py-1 text-[10px] font-bold shadow-xs hover:opacity-90"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>

                {/* Feature Pointers */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Razorpay UPI & COD</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>19,000+ PIN Codes</span>
                  </div>
                </div>

              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400">
              Any changes made here apply immediately to your live store and stay persistent.
            </p>
          </div>
        </div>

      </div>

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Import Storefront Theme JSON
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Paste a previously exported Theme JSON string below to restore or transfer your exact branding setup.
            </p>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON here..."
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Import & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
