import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  Filter,
  Grid,
  List,
  ChevronRight,
  ChevronLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Star,
  CheckCircle2,
  Tag,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Palette,
  X,
  Search,
  Check,
  CornerDownRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { formatINR, useTranslation } from '../utils/formatters';
import { Product } from '../types';
import { INITIAL_CATEGORIES } from '../data/mockData';
import { getDidYouMean } from '../utils/searchUtils';

interface StorefrontViewProps {
  searchQuery: string;
  onSearchChange?: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  selectedSubcategory?: string;
  onSelectSubcategory?: (subId: string, parentCatId?: string) => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedSubcategory = '',
  onSelectSubcategory,
}) => {
  const {
    theme,
    language,
    products,
    setActiveTab,
    setSelectedProduct,
    wishlist,
    orders,
  } = useStore();

  const t = useTranslation(language);

  // Filter & Sort States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [pricePreset, setPricePreset] = useState<'all' | 'under1000' | '1000-2500' | '2500-5000' | 'above5000'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
  const [dismissedSuggestion, setDismissedSuggestion] = useState<string | null>(null);

  // Deals Horizontal Carousel Ref & Controls
  const dealsScrollRef = React.useRef<HTMLDivElement>(null);
  const isDraggingDeals = React.useRef(false);
  const startXDeals = React.useRef(0);
  const scrollLeftDeals = React.useRef(0);

  const scrollDeals = (direction: 'left' | 'right') => {
    if (dealsScrollRef.current) {
      const containerWidth = dealsScrollRef.current.clientWidth;
      const scrollAmount = Math.max(280, Math.round(containerWidth * 0.75));
      dealsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Enable mouse wheel horizontal scrolling over deals section
  useEffect(() => {
    const el = dealsScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0 || Math.abs(e.deltaX) > 0) {
        const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        e.preventDefault();
        el.scrollBy({
          left: delta * 1.5,
          behavior: 'auto',
        });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  const handleDealsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dealsScrollRef.current) return;
    isDraggingDeals.current = true;
    startXDeals.current = e.pageX - dealsScrollRef.current.offsetLeft;
    scrollLeftDeals.current = dealsScrollRef.current.scrollLeft;
  };

  const handleDealsMouseLeave = () => {
    isDraggingDeals.current = false;
  };

  const handleDealsMouseUp = () => {
    isDraggingDeals.current = false;
  };

  const handleDealsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingDeals.current || !dealsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - dealsScrollRef.current.offsetLeft;
    const walk = (x - startXDeals.current) * 1.5;
    dealsScrollRef.current.scrollLeft = scrollLeftDeals.current - walk;
  };

  // Hero Carousel State
  const [heroSlide, setHeroSlide] = useState(0);

  const heroSlides = [
    {
      kicker: 'Ananya Collection · Grand Couture Showcase',
      kickerHi: 'अनन्य कलेक्शन · भव्य बुटीक कुटूर शोकेस',
      title: 'Royal Anarkalis, Velvet & Pure Silk Designer Suits',
      titleHi: 'शाही अनारकली, वेलवेट व सिल्क डिजाइनर सूट सेट्स',
      desc: 'Step into royal elegance with handcrafted Russian silk, georgette shararas, and rich velvet party wear suits curated in Rohini, Delhi.',
      descHi: 'शाही रशियन सिल्क, जॉर्जेट और रिच वेलवेट पर जरी व रेशम की मनमोहक कारीगरी। रोहिणी फ्लैगशिप बुटीक से पूरे भारत में डिलीवरी।',
      image: '/hero/hero-grand-collection.png',
      category: 'salwar-suits',
      ctaText: 'Explore Grand Collection',
      position: 'object-[78%_center] sm:object-[68%_center] md:object-center',
    },
    {
      kicker: 'Ananya Collection · Rohini Flagship Boutique',
      kickerHi: 'अनन्य कलेक्शन · फ्लैगशिप बुटीक रोहिणी, दिल्ली',
      title: 'Handcrafted Designer Couture & Festive Luxury',
      titleHi: 'सिल्क, ज़री और शाही भारतीय कारीगरी का बेजोड़ संगम',
      desc: 'Exclusive handcrafted lehengas, pure silk sarees, royal bridal wear, and festive ensembles curated in Rohini, Delhi for discerning patrons across India.',
      descHi: 'रोहिणी, दिल्ली से विशेष हस्तनिर्मित अनारकली, शरारा एवं डिजाइनर सिल्क सूट सीधे आपके द्वार।',
      image: '/hero/hero-5.png',
      category: 'salwar-suits',
      ctaText: 'Explore Bridal & Festive Wear',
      position: 'object-center sm:object-[center_25%]',
    },
    {
      kicker: 'Festive & Wedding Season 2026',
      kickerHi: 'फेस्टिव एवं वेडिंग सीजन 2026 स्पेशल',
      title: 'Bespoke Designer Suit Sets & Elegant Silhouettes',
      titleHi: 'उत्सव एवं वैवाहिक आयोजनों के लिए स्पेशल डिजाइनर सूट',
      desc: 'From Russian silk to royal georgette and Chikankari mukaish work, discover timeless couture tailored to perfection.',
      descHi: 'शाही रशियन सिल्क से लेकर जॉर्जेट और लखनवी मुकैश वर्क तक, प्रामाणिक परिधानों का भव्य संग्रह।',
      image: '/hero/hero-4.png',
      category: 'salwar-suits',
      ctaText: 'Shop Latest Suits',
      position: 'object-center',
    },
    {
      kicker: 'Pure Kanjeevaram & Banarasi Silk · Heritage Weaves',
      kickerHi: 'प्रामाणिक कांजीवरम एवं बनारसी सिल्क हथकरघा',
      title: 'Authentic Silk Sarees with Rich Hand-Woven Zari',
      titleHi: 'पारंपरिक शुद्ध रेशम साड़ियाँ - रीगल ज़री पल्लू के साथ',
      desc: 'Timeless elegance crafted by master artisans. Pure Kanjeevaram silk, Organza tissue, and royal Banarasi weaves with certified silk mark authenticity.',
      descHi: 'हस्तनिर्मित अनारकली, फ्लेयर्ड शरारा और स्ट्रेट कट कुर्ते जरी वर्क के साथ।',
      image: '/hero/hero-1.webp',
      category: 'salwar-suits',
      ctaText: 'Shop Handloom Silks',
      position: 'object-top sm:object-[center_15%]',
    },
    {
      kicker: 'Aarzoo Luxury Silk · Festive Collection',
      kickerHi: 'आरज़ू लक्ज़री सिल्क · फेस्टिव स्पेशल',
      title: 'Aarzoo Designer Silk Suits with Jacquard Dupatta',
      titleHi: 'आरज़ू प्रीमियम सिल्क फेस्टिव सूट कलेक्शन',
      desc: 'Lustrous festive silk suits with rich jacquard dupattas and intricate gold embroidery for grand weddings and celebrations.',
      descHi: 'रिच जैक्वार्ड दुपट्टे और सुनहरी कढ़ाई के साथ चमकदार फेस्टिव सिल्क सूट सेट्स।',
      image: '/hero/hero-6.jpeg',
      category: 'salwar-suits',
      ctaText: 'Shop Aarzoo Silk',
      position: 'object-top sm:object-[center_10%]',
    },
    {
      kicker: 'Inaayat Couture · Royal Silk Edition',
      kickerHi: 'इनायत कुटूर · रॉयल सिल्क एडिशन',
      title: 'Inaayat Royal Silk Ladies Suit Catalog',
      titleHi: 'इनायत रॉयल सिल्क लेडीज सूट कलेक्शन',
      desc: 'Regal shades, hand-finished zari borders, and heavy contrast dupattas crafted for wedding guests and family festivities.',
      descHi: 'शाही रंग, जरी बॉर्डर और हेवी कंट्रास्ट दुपट्टे के साथ शादी समारोहों के लिए स्पेशल।',
      image: '/hero/hero-8.jpeg',
      category: 'salwar-suits',
      ctaText: 'Explore Inaayat Suits',
      position: 'object-top sm:object-[center_10%]',
    },
    {
      kicker: 'Jasmeen Vol. 2 · Latest Catalog Designs',
      kickerHi: 'जैसमीन वॉल्यूम 2 · नवीनतम कैटलॉग डिजाइन',
      title: 'Jasmeen Luxury Party Wear Silk Suit Ensembles',
      titleHi: 'जैसमीन लक्ज़री पार्टी वियर सूट कलेक्शन',
      desc: 'Graceful cuts, rich silk textures, and dazzling embroideries designed to make every celebration memorable.',
      descHi: 'सुंदर कट्स, रिच सिल्क और मनमोहक कढ़ाई जो हर उत्सव को यादगार बना दे।',
      image: '/hero/hero-9.jpeg',
      category: 'salwar-suits',
      ctaText: 'Discover Jasmeen',
      position: 'object-top sm:object-[center_10%]',
    },
    {
      kicker: 'Sukanya Heritage Silk Collection',
      kickerHi: 'सुकन्या हेरिटेज सिल्क कलेक्शन',
      title: 'Sukanya Designer Silk Suits with Heavy Dupatta',
      titleHi: 'सुकन्या हेरिटेज सिल्क सूट एवं हैवी दुपट्टा सेट',
      desc: 'Traditional handloom-inspired motifs paired with contemporary fit and finish. Pure ethnic grace.',
      descHi: 'पारंपरिक हैंडलूम मोटिफ्स और आधुनिक फिटिंग का संगम। शुद्ध भारतीय परिधान।',
      image: '/hero/hero-10.jpeg',
      category: 'salwar-suits',
      ctaText: 'Shop Sukanya',
      position: 'object-top sm:object-[center_10%]',
    },
    {
      kicker: 'Exclusive Rohini Studio Curation · Ananya Collection',
      kickerHi: 'अनन्य कलेक्शन एक्सक्लूसिव रोहिणी स्टूडियो क्यूरेशन',
      title: 'Lucknowi Chikankari & Designer Partywear Suits',
      titleHi: 'लखनवी चिकनकारी एवं डिजाइनर पार्टीवियर सूट्स',
      desc: 'Intricate hand-embroidered modal silk kurtas, velvet potlis, and royal designer wear designed for weddings, celebrations, and festive gatherings.',
      descHi: 'ऑर्गेन्ज़ा दुपट्टे, रेशम कढ़ाई और रोहिणी फ्लैगशिप स्टूडियो से विशेष कस्टमाइजेशन।',
      image: '/hero/hero-2.webp',
      category: 'salwar-suits',
      ctaText: 'View Designer Suits',
      position: 'object-top sm:object-[center_15%]',
    },
  ];

  // Auto slide hero every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Deal of the day countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Did You Mean suggestion computation
  const didYouMean = useMemo(() => {
    if (!searchQuery || searchQuery.startsWith('__')) return null;
    const suggestion = getDidYouMean(searchQuery, products, INITIAL_CATEGORIES);
    if (!suggestion) return null;
    if (suggestion.toLowerCase() === searchQuery.trim().toLowerCase()) return null;
    return suggestion;
  }, [searchQuery, products]);

  // Derived available filter options across catalog
  const availableBrands = useMemo(() => {
    const brandMap: Record<string, number> = {};
    products.forEach((p) => {
      if (p.status !== 'paused') {
        brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
      }
    });
    return Object.entries(brandMap)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const availableSizes = useMemo(() => {
    const sizeMap: Record<string, number> = {};
    products.forEach((p) => {
      if (p.status !== 'paused' && p.sizes) {
        p.sizes.forEach((s) => {
          sizeMap[s] = (sizeMap[s] || 0) + 1;
        });
      }
    });
    return Object.entries(sizeMap)
      .map(([size, count]) => ({ size, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  const availableColors = useMemo(() => {
    const colorMap: Record<string, number> = {};
    products.forEach((p) => {
      if (p.status !== 'paused' && p.colors) {
        p.colors.forEach((c) => {
          colorMap[c] = (colorMap[c] || 0) + 1;
        });
      }
    });
    return Object.entries(colorMap)
      .map(([color, count]) => ({ color, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Active Category & Subcategory references
  const currentCategoryObj = INITIAL_CATEGORIES.find((c) => c.id === selectedCategory);
  const availableSubcategories = currentCategoryObj?.subcategories || [];

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Hidden internal search tags
    if (searchQuery === '__wishlist__') {
      return wishlist.includes(p.id);
    }
    if (searchQuery === '__orders__') {
      return true;
    }

    // 1. Keyword search (title, Hindi title, description, brand, category, subcategory, tags, highlights)
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.descriptionHi && p.descriptionHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.subcategoryHi && p.subcategoryHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (p.highlights && p.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())));

    // 2. Category & Subcategory
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || selectedSubcategory === 'all' || p.subcategory === selectedSubcategory;

    // 3. Price Preset & Max Price
    let matchesPricePreset = true;
    if (pricePreset === 'under1000') matchesPricePreset = p.price < 1000;
    else if (pricePreset === '1000-2500') matchesPricePreset = p.price >= 1000 && p.price <= 2500;
    else if (pricePreset === '2500-5000') matchesPricePreset = p.price >= 2500 && p.price <= 5000;
    else if (pricePreset === 'above5000') matchesPricePreset = p.price > 5000;

    const matchesPrice = p.price <= maxPrice;

    // 4. Rating & Stock
    const matchesRating = p.rating >= minRating;
    const matchesStock = inStockOnly ? p.status !== 'sold_out' && p.stock > 0 : true;

    // 5. Brand Multi-select
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);

    // 6. Size Multi-select
    const matchesSize =
      selectedSizes.length === 0 ||
      (p.sizes && p.sizes.some((s) => selectedSizes.includes(s)));

    // 7. Color Multi-select
    const matchesColor =
      selectedColors.length === 0 ||
      (p.colors && p.colors.some((c) => selectedColors.includes(c)));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubcategory &&
      matchesPricePreset &&
      matchesPrice &&
      matchesRating &&
      matchesStock &&
      matchesBrand &&
      matchesSize &&
      matchesColor &&
      p.status !== 'paused'
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
  });

  const dealProducts = products.filter((p) => p.isDealOfTheDay || p.discountPercent >= 45 || p.isBestseller);

  // Check if any filter is actively applied
  const hasActiveFilters =
    selectedCategory !== 'all' ||
    Boolean(selectedSubcategory) ||
    pricePreset !== 'all' ||
    maxPrice < 10000 ||
    minRating > 0 ||
    inStockOnly ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0;

  const handleClearAllFilters = () => {
    onSelectCategory('all');
    if (onSelectSubcategory) onSelectSubcategory('');
    setPricePreset('all');
    setMaxPrice(10000);
    setMinRating(0);
    setInStockOnly(false);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. Hero Carousel (Full Uncropped Landscape Banners with Ambient Fill) */}
      {!searchQuery && selectedCategory === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            style={{ borderRadius: `${theme.borderRadius + 6}px` }}
            className="relative overflow-hidden bg-stone-950 text-white min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex items-center shadow-xl border border-stone-200/60 dark:border-stone-800"
          >
            {/* Background Images with Precise Object Position */}
            {heroSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  heroSlide === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover ${slide.position || 'object-[center_top]'} filter brightness-[0.88] contrast-[1.04] transition-all duration-1000 ease-out`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/92 via-stone-950/50 to-transparent" />
              </div>
            ))}

            {/* Top-Right Verified Luxury Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-20 px-4 py-1.5 bg-stone-900/80 text-amber-200 backdrop-blur-md border border-amber-400/40 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="font-serif tracking-wider uppercase text-[11px]">Rohini Flagship Boutique</span>
            </div>

            {/* Slide Content */}
            <div className="relative z-10 max-w-2xl px-6 sm:px-14 py-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/40 text-xs font-semibold text-amber-200 tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'hi' ? heroSlides[heroSlide].kickerHi : heroSlides[heroSlide].kicker}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-[1.12] text-white">
                {language === 'hi' ? heroSlides[heroSlide].titleHi : heroSlides[heroSlide].title}
              </h1>

              <p className="text-xs sm:text-base text-stone-200 line-clamp-3 leading-relaxed max-w-xl font-light">
                {language === 'hi' ? heroSlides[heroSlide].descHi : heroSlides[heroSlide].desc}
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectCategory(heroSlides[heroSlide].category)}
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{heroSlides[heroSlide].ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('deals-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onSelectCategory('all');
                    }
                  }}
                  className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>{language === 'hi' ? 'आज के डील्स देखें' : "Festive Specials"}</span>
                </button>
              </div>
            </div>

            {/* Slider Dots & Arrows */}
            <div className="absolute bottom-5 left-6 sm:left-12 z-20 flex items-center gap-2">
              {heroSlides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setHeroSlide(dotIdx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    heroSlide === dotIdx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  title={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            <div className="absolute bottom-5 right-6 sm:right-12 z-20 flex items-center gap-2">
              <button
                onClick={() => setHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setHeroSlide((prev) => (prev + 1) % heroSlides.length)}
                className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. Indian Value & Trust Pillars Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 flex items-center gap-3.5 shadow-2xs hover:shadow-xs hover:border-amber-400/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-stone-800 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 border border-amber-200/60 dark:border-amber-700/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-serif font-bold text-stone-900 dark:text-white">Rohini Flagship Boutique</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">Delhi Studio & Video Appointments</p>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 flex items-center gap-3.5 shadow-2xs hover:shadow-xs hover:border-amber-400/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-stone-800 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 border border-amber-200/60 dark:border-amber-700/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-serif font-bold text-stone-900 dark:text-white">100% Certified Silks</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">Handloom Zari & Silk Mark</p>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 flex items-center gap-3.5 shadow-2xs hover:shadow-xs hover:border-amber-400/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-stone-800 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 border border-amber-200/60 dark:border-amber-700/40">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-serif font-bold text-stone-900 dark:text-white">Free Express Shipping</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">Across Delhi NCR & All India</p>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 flex items-center gap-3.5 shadow-2xs hover:shadow-xs hover:border-amber-400/50 transition-all">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-stone-800 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 border border-amber-200/60 dark:border-amber-700/40">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-serif font-bold text-stone-900 dark:text-white">Bespoke Fit & Alterations</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">In-House Master Tailoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Deals of the Day (With Live Ticking Countdown & Smooth Horizontal Scrolling) */}
      {!searchQuery && selectedCategory === 'all' && (
        <section id="deals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-6 shadow-xs overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="p-2 sm:p-2.5 rounded-2xl bg-amber-50 text-amber-700 dark:bg-stone-800 dark:text-amber-400 border border-amber-200/60 dark:border-amber-700/40 shadow-2xs">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-xl font-serif font-bold text-stone-900 dark:text-white">
                      {t.dealsOfTheDay}
                    </h2>
                    <span className="inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      Limited Time
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Exclusive limited-time festive offers on handcrafted sarees, lehengas & boutique couture
                  </p>
                </div>
              </div>

              {/* Countdown Timer & Left/Right Carousel Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                <div className="flex items-center gap-2 text-xs font-bold bg-amber-50/70 dark:bg-stone-800/80 px-3 py-1.5 rounded-xl border border-amber-200/80 dark:border-amber-700/40 text-amber-950 dark:text-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-stone-500 font-medium hidden xs:inline">{t.dealsEndsIn}:</span>
                  <span className="font-mono font-bold">
                    {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>

                {/* Left/Right Carousel Arrows */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollDeals('left')}
                    className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-950 hover:text-[#D4AF37] transition-all cursor-pointer shadow-2xs"
                    aria-label="Previous Deals"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollDeals('right')}
                    className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-950 hover:text-[#D4AF37] transition-all cursor-pointer shadow-2xs"
                    aria-label="Next Deals"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Scrolling Carousel with Prominent Left & Right Slider Arrows */}
            <div className="relative group/deals px-1">
              {/* Prominent Floating Left Slider Arrow */}
              <button
                type="button"
                onClick={() => scrollDeals('left')}
                className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 shadow-2xl backdrop-blur-md flex items-center justify-center hover:bg-[#B8860B] hover:text-white hover:border-[#B8860B] transition-all cursor-pointer hover:scale-110 active:scale-95"
                aria-label="Previous Deals"
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Prominent Floating Right Slider Arrow */}
              <button
                type="button"
                onClick={() => scrollDeals('right')}
                className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 shadow-2xl backdrop-blur-md flex items-center justify-center hover:bg-[#B8860B] hover:text-white hover:border-[#B8860B] transition-all cursor-pointer hover:scale-110 active:scale-95"
                aria-label="Next Deals"
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div
                ref={dealsScrollRef}
                onMouseDown={handleDealsMouseDown}
                onMouseLeave={handleDealsMouseLeave}
                onMouseUp={handleDealsMouseUp}
                onMouseMove={handleDealsMouseMove}
                className="flex gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1 -mx-2 px-2 cursor-grab active:cursor-grabbing select-none"
              >
                {dealProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-[210px] sm:w-[250px] md:w-[270px] shrink-0"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Main Product Catalog & Filter Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Did You Mean Banner */}
        {didYouMean && dismissedSuggestion !== didYouMean && (
          <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              </div>
              <div className="text-slate-800 dark:text-slate-200">
                <span className="text-slate-500 mr-1.5 font-medium">
                  {language === 'hi' ? 'क्या आपका मतलब यह था:' : 'Did you mean:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onSearchChange) onSearchChange(didYouMean);
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer bg-white/70 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800"
                >
                  <span>{didYouMean}</span>
                  <CornerDownRight className="w-3.5 h-3.5" />
                </button>
                <span className="hidden sm:inline-block text-slate-300 mx-2">|</span>
                <button
                  type="button"
                  onClick={() => setDismissedSuggestion(didYouMean)}
                  className="hidden sm:inline text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline ml-1"
                >
                  Search instead for "{searchQuery}"
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDismissedSuggestion(didYouMean)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-md hover:bg-black/5"
              title="Dismiss suggestion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Catalog Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
              <span>
                {selectedCategory === 'all'
                  ? t.featuredProducts
                  : `${INITIAL_CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Products'}`}
              </span>
              {selectedSubcategory && (
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {availableSubcategories.find((s) => s.id === selectedSubcategory)?.name || selectedSubcategory}
                  </span>
                </span>
              )}
              <span className="text-xs font-medium text-slate-400">
                ({sortedProducts.length} {sortedProducts.length === 1 ? 'item' : 'items'})
              </span>
            </h2>
            {searchQuery && (
              <p className="text-xs text-indigo-600 mt-0.5">
                Showing results matching: "<strong>{searchQuery}</strong>"
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 hidden sm:inline">{t.sortBy}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="featured">{t.featured}</option>
                <option value="price-low">{t.priceLowHigh}</option>
                <option value="price-high">{t.priceHighLow}</option>
                <option value="rating">{t.highestRated}</option>
                <option value="newest">{t.newestFirst}</option>
              </select>
            </div>

            {/* Grid / List Mode Toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600' : 'text-slate-400'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600' : 'text-slate-400'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Active Filters:
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                <span>Cat: {INITIAL_CATEGORIES.find((c) => c.id === selectedCategory)?.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('all');
                    if (onSelectSubcategory) onSelectSubcategory('');
                  }}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubcategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                <span>Sub: {availableSubcategories.find((s) => s.id === selectedSubcategory)?.name || selectedSubcategory}</span>
                <button
                  type="button"
                  onClick={() => onSelectSubcategory && onSelectSubcategory('')}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {pricePreset !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                <span>
                  {pricePreset === 'under1000' && '< ₹1,000'}
                  {pricePreset === '1000-2500' && '₹1,000 - ₹2,500'}
                  {pricePreset === '2500-5000' && '₹2,500 - ₹5,000'}
                  {pricePreset === 'above5000' && '> ₹5,000'}
                </span>
                <button type="button" onClick={() => setPricePreset('all')} className="hover:text-emerald-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {maxPrice < 10000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                <span>Max: {formatINR(maxPrice)}</span>
                <button type="button" onClick={() => setMaxPrice(10000)} className="hover:text-slate-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                <span>{minRating}★ & above</span>
                <button type="button" onClick={() => setMinRating(0)} className="hover:text-amber-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-[11px] font-semibold text-teal-700 dark:text-teal-300">
                <span>In Stock Only</span>
                <button type="button" onClick={() => setInStockOnly(false)} className="hover:text-teal-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedBrands.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-[11px] font-semibold text-purple-700 dark:text-purple-300"
              >
                <span>{brand}</span>
                <button type="button" onClick={() => toggleBrand(brand)} className="hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold text-blue-700 dark:text-blue-300"
              >
                <span>Size: {size}</span>
                <button type="button" onClick={() => toggleSize(size)} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedColors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-[11px] font-semibold text-rose-700 dark:text-rose-300"
              >
                <span>Color: {color}</span>
                <button type="button" onClick={() => toggleColor(color)} className="hover:text-rose-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* 2-Column Split: Filters Left (3 Cols on Desktop) + Products Right (9 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* Desktop & Mobile Filter Sidebar */}
          <aside className={`lg:col-span-3 space-y-6 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  {t.filterBy}
                </span>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-[11px] text-indigo-600 hover:underline font-semibold"
                >
                  Reset All
                </button>
              </div>

              {/* 1. Department Categories */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span>{t.category}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {INITIAL_CATEGORIES.length} Indian Categories
                  </span>
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('all');
                      if (onSelectSubcategory) onSelectSubcategory('');
                    }}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors flex items-center justify-between ${
                      selectedCategory === 'all'
                        ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{t.allCategories}</span>
                    <span className="text-[10px] text-slate-400">{products.length}</span>
                  </button>
                  {INITIAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.id);
                        if (onSelectSubcategory) onSelectSubcategory('');
                      }}
                      className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="truncate">{language === 'hi' ? cat.nameHi : cat.name}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        {products.filter((p) => p.category === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Sub-categories (Dynamic based on selected category or available) */}
              {availableSubcategories.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Sub-Categories ({currentCategoryObj?.name})
                  </h4>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => onSelectSubcategory && onSelectSubcategory('')}
                      className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                        !selectedSubcategory
                          ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span>All Subcategories</span>
                      <span className="text-[10px] text-slate-400">
                        {products.filter((p) => p.category === selectedCategory).length}
                      </span>
                    </button>
                    {availableSubcategories.map((sub) => {
                      const count = products.filter((p) => p.subcategory === sub.id).length;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => onSelectSubcategory && onSelectSubcategory(sub.id, selectedCategory)}
                          className={`w-full text-left text-xs py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                            selectedSubcategory === sub.id
                              ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <span className="truncate">{language === 'hi' ? sub.nameHi : sub.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-1">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Price Filter (Presets + Slider) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Price Range
                  </h4>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Up to {formatINR(maxPrice)}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPricePreset(pricePreset === 'under1000' ? 'all' : 'under1000');
                    }}
                    className={`text-[11px] py-1 px-2 rounded-md border text-center transition-colors ${
                      pricePreset === 'under1000'
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Under ₹1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPricePreset(pricePreset === '1000-2500' ? 'all' : '1000-2500');
                    }}
                    className={`text-[11px] py-1 px-2 rounded-md border text-center transition-colors ${
                      pricePreset === '1000-2500'
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    ₹1,000 - ₹2,500
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPricePreset(pricePreset === '2500-5000' ? 'all' : '2500-5000');
                    }}
                    className={`text-[11px] py-1 px-2 rounded-md border text-center transition-colors ${
                      pricePreset === '2500-5000'
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    ₹2,500 - ₹5,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPricePreset(pricePreset === 'above5000' ? 'all' : 'above5000');
                    }}
                    className={`text-[11px] py-1 px-2 rounded-md border text-center transition-colors ${
                      pricePreset === 'above5000'
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Over ₹5,000
                  </button>
                </div>

                <input
                  type="range"
                  min={500}
                  max={10000}
                  step={250}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setPricePreset('all');
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹500</span>
                  <span>₹10,000+</span>
                </div>
              </div>

              {/* 4. Brand Filter */}
              {availableBrands.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Brands ({availableBrands.length})
                    </h4>
                    {selectedBrands.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedBrands([])}
                        className="text-[10px] text-indigo-600 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {availableBrands.map(({ brand, count }) => {
                      const isSelected = selectedBrands.includes(brand);
                      return (
                        <label
                          key={brand}
                          className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleBrand(brand)}
                              className="w-3.5 h-3.5 text-indigo-600 rounded cursor-pointer"
                            />
                            <span className={`truncate ${isSelected ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}`}>
                              {brand}
                            </span>
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. Size Filter */}
              {availableSizes.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Size & Fit
                    </h4>
                    {selectedSizes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSizes([])}
                        className="text-[10px] text-indigo-600 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSizes.map(({ size, count }) => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                              : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span>{size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. Color Filter */}
              {availableColors.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Color Palette
                    </h4>
                    {selectedColors.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedColors([])}
                        className="text-[10px] text-indigo-600 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableColors.map(({ color }) => {
                      const isSelected = selectedColors.includes(color);
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => toggleColor(color)}
                          className={`text-[11px] px-2 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                            style={{
                              backgroundColor:
                                color.toLowerCase().includes('gold') ? '#D97706' :
                                color.toLowerCase().includes('red') || color.toLowerCase().includes('ruby') || color.toLowerCase().includes('maroon') ? '#DC2626' :
                                color.toLowerCase().includes('green') || color.toLowerCase().includes('emerald') ? '#059669' :
                                color.toLowerCase().includes('blue') || color.toLowerCase().includes('navy') ? '#2563EB' :
                                color.toLowerCase().includes('black') || color.toLowerCase().includes('obsidian') ? '#1E293B' :
                                color.toLowerCase().includes('white') || color.toLowerCase().includes('ivory') ? '#F8FAFC' :
                                color.toLowerCase().includes('silver') || color.toLowerCase().includes('grey') ? '#94A3B8' :
                                color.toLowerCase().includes('brass') || color.toLowerCase().includes('yellow') ? '#EAB308' :
                                color.toLowerCase().includes('orange') || color.toLowerCase().includes('saffron') ? '#EA580C' :
                                '#6366F1'
                            }}
                          />
                          <span>{color}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 7. Customer Rating Filter */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {t.customerRatings}
                </h4>
                <div className="space-y-1.5">
                  {[4.5, 4.0, 3.0, 0].map((star) => (
                    <label key={star} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="radio"
                        name="ratingFilter"
                        checked={minRating === star}
                        onChange={() => setMinRating(star)}
                        className="text-indigo-600"
                      />
                      <span className="flex items-center gap-1 font-medium">
                        {star === 0 ? 'All Ratings' : (
                          <>
                            <span className="text-amber-500 font-bold">{star}★</span>
                            <span>& above</span>
                          </>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 8. In-Stock Filter */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span>In Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </label>
              </div>

            </div>
          </aside>

          {/* Product Items Grid / List (9 Cols) */}
          <main className="lg:col-span-9">
            {sortedProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No products found matching your current filter criteria
                  </p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Try adjusting your keyword, resetting filters, or widening your price range to discover our rich catalog.
                  </p>
                </div>

                {didYouMean && (
                  <div className="pt-2 pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSearchChange) onSearchChange(didYouMean);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Search for "{didYouMean}" instead</span>
                    </button>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    style={{ backgroundColor: 'var(--theme-primary)', color: '#FFFFFF' }}
                    className="px-5 py-2.5 text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    style={{
                      backgroundColor: 'var(--theme-card)',
                      borderRadius: `${theme.borderRadius}px`,
                      borderColor: 'var(--theme-border)',
                    }}
                    className="p-4 border rounded-xl flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-28 h-32 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                        <span className="font-bold text-indigo-600">{product.brand}</span>
                        <span>·</span>
                        <span>{language === 'hi' ? product.categoryHi : product.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {language === 'hi' ? product.titleHi : product.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {language === 'hi' ? product.descriptionHi : product.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold">{formatINR(product.price)}</span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-slate-400 line-through">{formatINR(product.mrp)}</span>
                        )}
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {product.discountPercent}% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </section>

      {/* 5. Indian Customer Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Trusted by 100,000+ Indian Shoppers
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Real Experiences from Delhi, Mumbai, Bengaluru & Across Bharat
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "Ordered the Kanjeevaram silk saree for my sister's wedding in Chennai. The pure silk sheen and heavy golden zari exceeded all our expectations!"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
                <p className="font-bold text-slate-900 dark:text-white">Meenakshi Sundaram</p>
                <p className="text-slate-400">Chennai · Verified Buyer</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "AuraPro Earbuds are a game changer on the Bengaluru metro commute. 42dB ANC completely cuts out crowd rumble, and 10 min charge gives 5 hrs battery."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
                <p className="font-bold text-slate-900 dark:text-white">Arjun Nambiar</p>
                <p className="text-slate-400">Bengaluru · Verified Tech Enthusiast</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "Pure Himalayan Shilajit resin lab tested report verified with QR code. Delivered to Jaipur in exactly 48 hours by Delhivery with Cash on Delivery."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
                <p className="font-bold text-slate-900 dark:text-white">Dr. Harshvardhan Singh</p>
                <p className="text-slate-400">Jaipur · Verified Wellness Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
