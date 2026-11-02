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
  Layers,
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
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [pricePreset, setPricePreset] = useState<'all' | 'under3500' | '3500-5000' | '5000-10000' | 'above10000'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
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
      kicker: 'Ananya Collection · Grand Festive & Wedding Showcase',
      kickerHi: 'अनन्या कलेक्शन · भव्य उत्सव व वैवाहिक परिधान',
      title: 'Royal Anarkalis, Velvet & Pure Silk Designer Suits',
      titleHi: 'शाही अनारकली, वेलवेट व सिल्क डिजाइनर सूट सेट्स',
      desc: 'Step into royal elegance with handcrafted Russian silk, georgette shararas, and rich velvet party wear suits curated in Rohini, Delhi.',
      descHi: 'शाही रशियन सिल्क, जॉर्जेट और रिच वेलवेट पर जरी व रेशम की मनमोहक कारीगरी। रोहिणी फ्लैगशिप बुटीक से पूरे भारत में डिलीवरी।',
      image: '/hero/hero-ethnic-kurtas.png',
      category: 'salwar-suits',
      ctaText: 'Explore Royal Showcase',
      position: 'object-[78%_center] sm:object-[72%_center] md:object-[68%_center] lg:object-[65%_center]',
    },
    {
      kicker: 'Couture Elegance · Navy & Fuchsia Edition',
      kickerHi: 'कुटूर एलिगेंस · नेवी व फ्युशिया एडिशन',
      title: 'Bespoke Velvet & Zari Embroidered Festive Suits',
      titleHi: 'वेलवेट और ज़री कढ़ाई से सुसज्जित भव्य सूट सेट्स',
      desc: 'Regal jewel tones crafted in premium silk and velvet, adorned with intricate antique zari work for memorable wedding receptions.',
      descHi: 'शाही नेवी और फ्युशिया रंगों में प्राचीन ज़री हस्तशिल्प। शादी व रिसेप्शन के लिए सबसे खास परिधान।',
      image: '/hero/hero-navy-fuchsia.png',
      category: 'salwar-suits',
      ctaText: 'Shop Couture Suits',
      position: 'object-[75%_center] sm:object-[65%_center] md:object-center',
    },
    {
      kicker: 'Heritage Terraces · Pure Handloom Silks',
      kickerHi: 'हेरिटेज बनारसी व कांजीवरम सिल्क साड़ियाँ',
      title: 'Authentic Pure Silk Sarees with Rich Woven Zari',
      titleHi: 'पारंपरिक शुद्ध रेशम साड़ियाँ - रीगल जरी पल्लू के साथ',
      desc: 'Masterpieces in Kanjeevaram and Banarasi handlooms, woven with certified silk mark purity and timeless royal borders.',
      descHi: 'सिल्क मार्क प्रमाणित शुद्ध कांजीवरम व बनारसी साड़ियाँ। पारंपरिक पूजा व विवाह आयोजनों के लिए भव्य चॉइस।',
      image: '/hero/hero-sari-terrace.png',
      category: 'sarees',
      ctaText: 'Shop Silk Sarees',
      position: 'object-[75%_center] sm:object-[65%_center] md:object-center',
    },
    {
      kicker: 'South Asian Designer Fashion Trio',
      kickerHi: 'साउथ एशियन डिजाइनर फैशन तिकड़ी',
      title: 'Coordinated Festive Ensembles for Grand Celebrations',
      titleHi: 'विवाह व त्योहारों के लिए समन्वित डिजाइनर परिधान',
      desc: 'From layered shararas to structured straight kurtas, explore coordinated ethnic couture designed for weddings and sangeet ceremonies.',
      descHi: 'शरारा, अनारकली और स्ट्रेट कट डिजाइनर सूट। संगीत और हल्दी कार्यक्रमों के लिए परफेक्ट मैच।',
      image: '/hero/hero-fashion-trio.png',
      category: 'salwar-suits',
      ctaText: 'Explore Designer Trio',
      position: 'object-[75%_center] sm:object-[65%_center] md:object-center',
    },
    {
      kicker: 'Jewel Tones · Teal & Deep Plum Silk',
      kickerHi: 'ज्वेल टोन्स · टील व डीप प्लम सिल्क',
      title: 'Exquisite Threadwork & Metallic Zari Ensembles',
      titleHi: 'बारीक रेशम कढ़ाई और मेटैलिक जरी सूट सेट्स',
      desc: 'Rich teal and luscious plum silks enriched with delicate scalloped borders and artisan floral resham embroideries.',
      descHi: 'खूबसूरत टील और प्लम रंगों में स्कैलप्ड बॉर्डर्स और रेशम एम्ब्रॉयडरी के साथ 3-पीस डिजाइनर सूट।',
      image: '/hero/hero-teal-plum.png',
      category: 'salwar-suits',
      ctaText: 'Shop Teal & Plum',
      position: 'object-[75%_center] sm:object-[65%_center] md:object-center',
    },
    {
      kicker: 'Golden Courtyard · Family Celebrations',
      kickerHi: 'गोल्डन कोर्टयार्ड · पारिवारिक उत्सव संग्रह',
      title: 'Timeless Golden Heirlooms & Regal Wedding Couture',
      titleHi: 'शाही पारिवारिक उत्सव व वेडिंग कुटूर परिधान',
      desc: 'Luminous gold and warm ivory silhouettes with traditional craftsmanship, capturing the radiant joy of Indian festivities.',
      descHi: 'सुनहरी जरी और पारंपरिक कारीगरी से सजे परिधान। परिवार के हर खास मौके के लिए बेमिसाल।',
      image: '/hero/hero-golden-celebration.png',
      category: 'bridal-lehengas',
      ctaText: 'Explore Wedding Couture',
      position: 'object-[75%_center] sm:object-[65%_center] md:object-center',
    },
    {
      kicker: 'Everyday Grace · Breathable Designer Kurtas',
      kickerHi: 'दैनिक सुरुचिपूर्ण · कॉटन व सिल्क कुर्ती सेट्स',
      title: 'Chic Silhouettes Styled for Every Body Shape',
      titleHi: 'हर अवसर के लिए आरामदायक और स्टाइलिश कुर्ती सेट्स',
      desc: 'Effortless elegance tailored for daily sophistication and festive gatherings with premium fabrics and modern cuts.',
      descHi: 'प्रीमियम हवादार फैब्रिक और कंटेम्पररी कट्स। ऑफिस, पूजा और पारिवारिक मिलन के लिए उत्तम।',
      image: '/hero/hero-grand-collection.png',
      category: 'salwar-suits',
      ctaText: 'Shop Daily Couture',
      position: 'object-[75%_center] sm:object-[68%_center] md:object-center',
    },
    {
      kicker: 'Temple Courtyard · Divine Handcrafted Silks',
      kickerHi: 'टेंपल हेरिटेज · पावन हस्तशिल्प सिल्क संग्रह',
      title: 'Sacred Hues & Heritage Zari Bridal Masterpieces',
      titleHi: 'पवित्र रंग और हेरिटेज जरी ब्राइडल मास्टरपीस',
      desc: 'Immerse in the heritage of sacred temple architecture and master craftsmanship with royal crimson and turmeric silks.',
      descHi: 'शाही क्रिम्सन और हल्दी पीतांबरी सिल्क पर पारंपरिक मंदिर बॉर्डर और भारी पल्लू की कारीगरी।',
      image: '/hero/hero-radiant-temple.png',
      category: 'sarees',
      ctaText: 'Discover Temple Silks',
      position: 'object-[75%_center] sm:object-[65%_center] md:object-center',
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

  const availableFabrics = useMemo(() => {
    const fabricMap: Record<string, number> = {};
    products.forEach((p) => {
      if (p.status !== 'paused') {
        const rawFabric = (
          p.specs?.['Fabric'] ||
          p.specs?.['Top Fabric'] ||
          p.specs?.['Lehenga Fabric'] ||
          ''
        ).toLowerCase();

        let key = '';
        if (rawFabric.includes('russian silk')) key = 'Russian Silk';
        else if (rawFabric.includes('soft silk') || rawFabric.includes('pure silk') || rawFabric.includes('raw silk') || rawFabric.includes('katan')) key = 'Pure Handloom Silk';
        else if (rawFabric.includes('satin')) key = 'Lustrous Satin Silk';
        else if (rawFabric.includes('tussar')) key = 'Handloom Tussar Silk';
        else if (rawFabric.includes('georgette')) key = 'Pure Georgette';
        else if (rawFabric.includes('organza')) key = 'Organza Silk';
        else if (rawFabric.includes('chanderi')) key = 'Chanderi Silk';
        else if (rawFabric.includes('velvet')) key = 'Micro Velvet';
        else if (rawFabric.includes('cotton')) key = 'Breathable Cotton';

        if (key) {
          fabricMap[key] = (fabricMap[key] || 0) + 1;
        }
      }
    });
    return Object.entries(fabricMap)
      .map(([fabric, count]) => ({ fabric, count }))
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
    if (pricePreset === 'under3500') matchesPricePreset = p.price < 3500;
    else if (pricePreset === '3500-5000') matchesPricePreset = p.price >= 3500 && p.price <= 5000;
    else if (pricePreset === '5000-10000') matchesPricePreset = p.price >= 5000 && p.price <= 10000;
    else if (pricePreset === 'above10000') matchesPricePreset = p.price > 10000;

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

    // 7. Fabric Multi-select
    const matchesFabric =
      selectedFabrics.length === 0 ||
      selectedFabrics.some((f) => {
        const raw = `${p.specs?.['Fabric'] || ''} ${p.specs?.['Top Fabric'] || ''} ${p.specs?.['Lehenga Fabric'] || ''} ${p.title} ${p.description}`.toLowerCase();
        if (f === 'Russian Silk') return raw.includes('russian silk');
        if (f === 'Pure Handloom Silk') return raw.includes('soft silk') || raw.includes('pure silk') || raw.includes('raw silk') || raw.includes('kanjeevaram') || raw.includes('katan');
        if (f === 'Lustrous Satin Silk') return raw.includes('satin');
        if (f === 'Handloom Tussar Silk') return raw.includes('tussar');
        if (f === 'Pure Georgette') return raw.includes('georgette');
        if (f === 'Organza Silk') return raw.includes('organza');
        if (f === 'Chanderi Silk') return raw.includes('chanderi');
        if (f === 'Micro Velvet') return raw.includes('velvet');
        if (f === 'Breathable Cotton') return raw.includes('cotton');
        return false;
      });

    // 8. Occasion Multi-select
    const matchesOccasion =
      selectedOccasions.length === 0 ||
      selectedOccasions.some((occ) => {
        const textToSearch = `${p.tags?.join(' ') || ''} ${p.specs?.['Occasion'] || ''} ${p.title} ${p.description}`.toLowerCase();
        if (occ === 'wedding') return textToSearch.includes('wedding') || textToSearch.includes('bridal') || textToSearch.includes('reception') || textToSearch.includes('zardozi');
        if (occ === 'festive') return textToSearch.includes('festive') || textToSearch.includes('festival') || textToSearch.includes('puja') || textToSearch.includes('diwali') || textToSearch.includes('karwa');
        if (occ === 'party') return textToSearch.includes('party') || textToSearch.includes('sangeet') || textToSearch.includes('cocktail') || textToSearch.includes('mehendi');
        if (occ === 'daily') return textToSearch.includes('daily') || textToSearch.includes('comfort') || textToSearch.includes('casual');
        return true;
      });

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
      matchesFabric &&
      matchesOccasion &&
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
    maxPrice < 30000 ||
    minRating > 0 ||
    inStockOnly ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    selectedFabrics.length > 0 ||
    selectedOccasions.length > 0;

  const handleClearAllFilters = () => {
    onSelectCategory('all');
    if (onSelectSubcategory) onSelectSubcategory('');
    setPricePreset('all');
    setMaxPrice(30000);
    setMinRating(0);
    setInStockOnly(false);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedFabrics([]);
    setSelectedOccasions([]);
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

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const toggleOccasion = (occ: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
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
            <div className="absolute top-3 right-3 sm:top-6 sm:right-8 z-20 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-stone-900/80 text-amber-200 backdrop-blur-md border border-amber-400/40 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1.5 sm:gap-2 shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span className="font-serif tracking-wider uppercase text-[10px] sm:text-[11px]">Rohini Flagship Boutique</span>
            </div>

            {/* Slide Content */}
            <div className="relative z-10 max-w-2xl px-4 sm:px-14 py-8 sm:py-12 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/40 text-[10px] sm:text-xs font-semibold text-amber-200 tracking-wider uppercase">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                <span className="truncate max-w-[260px] sm:max-w-none">{language === 'hi' ? heroSlides[heroSlide].kickerHi : heroSlides[heroSlide].kicker}</span>
              </div>

              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-[1.15] text-white">
                {language === 'hi' ? heroSlides[heroSlide].titleHi : heroSlides[heroSlide].title}
              </h1>

              <p className="text-xs sm:text-base text-stone-200 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl font-light">
                {language === 'hi' ? heroSlides[heroSlide].descHi : heroSlides[heroSlide].desc}
              </p>

              <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => onSelectCategory(heroSlides[heroSlide].category)}
                  className="px-5 sm:px-8 py-2.5 sm:py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{heroSlides[heroSlide].ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                  className="px-4 sm:px-6 py-2.5 sm:py-3.5 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
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
                  {pricePreset === 'under3500' && '< ₹3,500'}
                  {pricePreset === '3500-5000' && '₹3,500 - ₹5,000'}
                  {pricePreset === '5000-10000' && '₹5,000 - ₹10,000'}
                  {pricePreset === 'above10000' && 'Luxury > ₹10,000'}
                </span>
                <button type="button" onClick={() => setPricePreset('all')} className="hover:text-emerald-900 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {maxPrice < 30000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                <span>Max: {formatINR(maxPrice)}</span>
                <button type="button" onClick={() => setMaxPrice(30000)} className="hover:text-slate-900 cursor-pointer">
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

            {selectedFabrics.map((fabric) => (
              <span
                key={fabric}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-300"
              >
                <span>Fabric: {fabric}</span>
                <button type="button" onClick={() => toggleFabric(fabric)} className="hover:text-amber-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedOccasions.map((occ) => {
              const label =
                occ === 'wedding' ? 'Wedding & Bridal' :
                occ === 'festive' ? 'Festive & Puja' :
                occ === 'party' ? 'Party & Sangeet' : 'Daily Couture';
              return (
                <span
                  key={occ}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-[11px] font-semibold text-rose-800 dark:text-rose-300"
                >
                  <span>Occasion: {label}</span>
                  <button type="button" onClick={() => toggleOccasion(occ)} className="hover:text-rose-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

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
                      setPricePreset(pricePreset === 'under3500' ? 'all' : 'under3500');
                    }}
                    className={`text-[11px] py-1 px-2 rounded-md border text-center transition-colors cursor-pointer ${
                      pricePreset === 'under3500'
                        ? 'bg-[#B8860B] text-white border-[#B8860B] font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Under ₹3,500
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPricePreset(pricePreset === '3500-5000' ? 'all' : '3500-5000');
                    }}
                    className={`text-[11px] py-1 px-2 rounded-md border text-center transition-colors cursor-pointer ${
                      pricePreset === '3500-5000'
                        ? 'bg-[#B8860B] text-white border-[#B8860B] font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    ₹3,500 - ₹5,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPricePreset(pricePreset === '5000-10000' ? 'all' : '5000-10000');
                    }}
                    className={`text-[11px] py-1 px-2 rounded-md border text-center transition-colors cursor-pointer ${
                      pricePreset === '5000-10000'
                        ? 'bg-[#B8860B] text-white border-[#B8860B] font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    ₹5,000 - ₹10,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPricePreset(pricePreset === 'above10000' ? 'all' : 'above10000');
                    }}
                    className={`text-[11px] py-1 px-2 rounded-md border text-center transition-colors cursor-pointer ${
                      pricePreset === 'above10000'
                        ? 'bg-[#B8860B] text-white border-[#B8860B] font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Luxury ₹10,000+
                  </button>
                </div>

                <input
                  type="range"
                  min={1000}
                  max={30000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setPricePreset('all');
                  }}
                  className="w-full accent-[#B8860B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹1,000</span>
                  <span>₹30,000+</span>
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
                        className="text-[10px] text-[#B8860B] hover:underline cursor-pointer font-semibold"
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
                              className="w-3.5 h-3.5 accent-[#B8860B] rounded cursor-pointer"
                            />
                            <span className={`truncate ${isSelected ? 'font-bold text-[#B8860B] dark:text-amber-400' : ''}`}>
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
                        className="text-[10px] text-[#B8860B] hover:underline cursor-pointer font-semibold"
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
                          className={`text-[11px] px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#B8860B] text-white border-[#B8860B] font-bold shadow-xs'
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

              {/* 5. Fabric & Craft Filter (Curated for Ethnic Couture) */}
              {availableFabrics.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>Fabric & Weave</span>
                    </h4>
                    {selectedFabrics.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedFabrics([])}
                        className="text-[10px] text-[#B8860B] hover:underline cursor-pointer font-semibold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {availableFabrics.map(({ fabric, count }) => {
                      const isSelected = selectedFabrics.includes(fabric);
                      return (
                        <label
                          key={fabric}
                          className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleFabric(fabric)}
                              className="w-3.5 h-3.5 accent-[#B8860B] rounded cursor-pointer"
                            />
                            <span className={`truncate ${isSelected ? 'font-bold text-[#B8860B] dark:text-amber-400' : ''}`}>
                              {fabric}
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

              {/* 6. Occasion Filter */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Occasion & Styling</span>
                  </h4>
                  {selectedOccasions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedOccasions([])}
                      className="text-[10px] text-[#B8860B] hover:underline cursor-pointer font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Wedding & Bridal Reception', key: 'wedding' },
                    { label: 'Festive, Diwali & Puja', key: 'festive' },
                    { label: 'Party Wear & Sangeet', key: 'party' },
                    { label: 'Daily & Casual Couture', key: 'daily' },
                  ].map(({ label, key }) => {
                    const isSelected = selectedOccasions.includes(key);
                    return (
                      <label
                        key={key}
                        className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOccasion(key)}
                            className="w-3.5 h-3.5 accent-[#B8860B] rounded cursor-pointer"
                          />
                          <span className={`truncate ${isSelected ? 'font-bold text-[#B8860B] dark:text-amber-400' : ''}`}>
                            {label}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

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
                "The Russian Silk Anarkali Suit set from Ananya Collection is breathtaking! The intricate zari work and perfect master tailoring fitting made me the center of attention at my family Sangeet in Rohini."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
                <p className="font-bold text-slate-900 dark:text-white">Priya Sharma</p>
                <p className="text-slate-400">Rohini, New Delhi · Verified Boutique Buyer</p>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                "Ordered the pure Banarasi Katan Silk Dupatta with heavy gold zari jaal. The fabric texture, royal crimson color, and prompt delivery across Mumbai were truly outstanding."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
                <p className="font-bold text-slate-900 dark:text-white">Simran Kaur</p>
                <p className="text-slate-400">Mumbai · Verified Heritage Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
