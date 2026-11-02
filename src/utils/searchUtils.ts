import { Product, Category } from '../types';

export interface SearchSuggestionItem {
  type: 'category' | 'subcategory' | 'product' | 'brand' | 'keyword';
  title: string;
  subtitle?: string;
  categoryId?: string;
  subcategoryId?: string;
  brand?: string;
  productId?: string;
  price?: number;
  image?: string;
}

export interface SearchSuggestionsResult {
  categories: SearchSuggestionItem[];
  brands: SearchSuggestionItem[];
  products: SearchSuggestionItem[];
  keywords: string[];
}

// Popular Indian E-Commerce search terms
export const POPULAR_SEARCH_TERMS = [
  'Kanjeevaram Silk Saree',
  'Pure Banarasi Katan Silk',
  'Russian Silk Anarkali Suit',
  'Lucknowi Chikankari Kurta',
  'Bridal Heritage Lehengas',
  'Phulkari Gotta Patti Dupatta',
  'Kashmiri Pashmina Shawl',
  'Velvet Wedding Ensembles',
  'Men Raw Silk Kurta Pajama',
  'Kids Festive Kurta Set',
  'Pure Cotton Nightwear Set',
  'Satin Silk Lounge Set',
];

// Curated Indian E-Commerce phonetic and typo dictionary
const INDIAN_QUERY_CORRECTIONS: Record<string, string> = {
  // Saree & Ethnic
  'kanjivaram': 'Kanjeevaram',
  'kanchipuram': 'Kanjeevaram',
  'kanjeevaram': 'Kanjeevaram',
  'sari': 'Saree',
  'saari': 'Saree',
  'sare': 'Saree',
  'chikan': 'Chikankari',
  'chikankari': 'Chikankari',
  'chikenkari': 'Chikankari',
  'kurti': 'Kurta',
  'kurta': 'Kurta',
  'kurthi': 'Kurta',
  'anarkali': 'Anarkali',
  'lehanga': 'Lehenga',
  'lengha': 'Lehenga',
  'lehenga': 'Lehenga',
  'sherwani': 'Sherwani',
  'bandgala': 'Bandhgala',
  'bandhgala': 'Bandhgala',
  'dupatta': 'Dupatta',
  'dupata': 'Dupatta',

  // Electronics & Gadgets
  'earbud': 'Earbuds',
  'earbuds': 'Earbuds',
  'erbuds': 'Earbuds',
  'airbud': 'Earbuds',
  'airbuds': 'Earbuds',
  'aerbuds': 'Earbuds',
  'airpods': 'Earbuds',
  'earphone': 'Earbuds',
  'earphones': 'Earbuds',
  'wacth': 'Smartwatch',
  'watch': 'Smartwatch',
  'smart watch': 'Smartwatch',
  'smartwatch': 'Smartwatch',
  'carger': 'Charger',
  'charger': 'Charger',
  'gan charger': 'Fast Charger',
  'spekar': 'Speaker',
  'speaker': 'Speaker',

  // Ayurveda & Wellness
  'silajit': 'Shilajit',
  'silajeet': 'Shilajit',
  'shilajeet': 'Shilajit',
  'shilajit': 'Shilajit',
  'kumkumadi': 'Kumkumadi',
  'kumkumaadi': 'Kumkumadi',
  'kumkumadi tailam': 'Kumkumadi',
  'kesar': 'Kashmiri Kesar',
  'keshar': 'Kashmiri Kesar',
  'saffron': 'Kashmiri Kesar',
  'ghee': 'A2 Bilona Ghee',
  'desi ghee': 'A2 Bilona Ghee',
  'bilona ghee': 'A2 Bilona Ghee',

  // Home & Kitchen
  'tawa': 'Cast Iron Tawa',
  'tava': 'Cast Iron Tawa',
  'kadai': 'Kadhai',
  'kadhai': 'Kadhai',
  'kadahi': 'Kadhai',
  'diya': 'Brass Diya',
  'deeya': 'Brass Diya',
  'urli': 'Urli Decor',
  'urli bowl': 'Urli Decor',
  'bedsheet': 'Bedsheet',
  'bed sheet': 'Bedsheet',
  'chaddar': 'Bedsheet',

  // Footwear
  'kolhapuri': 'Kolhapuri',
  'kolapuri': 'Kolhapuri',
  'chappal': 'Kolhapuri Chappal',
  'jutti': 'Jutti',
  'jooti': 'Jutti',
  'mojri': 'Mojari',
  'mojari': 'Mojari',
  'potli': 'Potli Bag',
};

// Simple Levenshtein distance for fuzzy matching
export function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Compute 'Did You Mean' suggestion
export function getDidYouMean(
  query: string,
  products: Product[],
  categories: Category[]
): string | null {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 3) return null;

  // 1. Direct dictionary lookup
  if (INDIAN_QUERY_CORRECTIONS[trimmed]) {
    const directMatch = INDIAN_QUERY_CORRECTIONS[trimmed];
    if (directMatch.toLowerCase() !== trimmed) {
      return directMatch;
    }
  }

  // 2. Check individual words against dictionary
  const words = trimmed.split(/\s+/);
  let replacedAny = false;
  const correctedWords = words.map((w) => {
    if (INDIAN_QUERY_CORRECTIONS[w]) {
      replacedAny = true;
      return INDIAN_QUERY_CORRECTIONS[w];
    }
    return w;
  });

  if (replacedAny) {
    const combined = correctedWords.join(' ');
    if (combined.toLowerCase() !== trimmed) {
      return combined;
    }
  }

  // 3. Collect all candidate vocabulary tokens from catalog
  const candidateTokens = new Set<string>();
  categories.forEach((c) => {
    candidateTokens.add(c.name);
    c.subcategories?.forEach((sub) => candidateTokens.add(sub.name));
  });

  products.forEach((p) => {
    candidateTokens.add(p.brand);
    p.tags?.forEach((t) => candidateTokens.add(t));
    // extract key terms from title
    const titleWords = p.title.split(/\s+/).filter((w) => w.length > 4);
    titleWords.forEach((tw) => candidateTokens.add(tw));
  });

  // Find candidate with smallest edit distance
  let bestMatch: string | null = null;
  let minDistance = 999;

  for (const candidate of candidateTokens) {
    const candLower = candidate.toLowerCase();
    if (candLower === trimmed) return null; // exact match already

    const dist = getLevenshteinDistance(trimmed, candLower);
    // Allow edit distance of 1 or 2 for short words, up to 3 for longer words
    const maxAllowed = trimmed.length > 6 ? 2 : 1;
    if (dist > 0 && dist <= maxAllowed && dist < minDistance) {
      minDistance = dist;
      bestMatch = candidate;
    }
  }

  return bestMatch;
}

// Generate auto-suggestions as user types
export function getSearchSuggestions(
  query: string,
  products: Product[],
  categories: Category[]
): SearchSuggestionsResult {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return {
      categories: [],
      brands: [],
      products: [],
      keywords: POPULAR_SEARCH_TERMS.slice(0, 6),
    };
  }

  const result: SearchSuggestionsResult = {
    categories: [],
    brands: [],
    products: [],
    keywords: [],
  };

  // 1. Categories & Subcategories matching
  categories.forEach((cat) => {
    if (
      cat.name.toLowerCase().includes(trimmed) ||
      cat.nameHi.toLowerCase().includes(trimmed)
    ) {
      result.categories.push({
        type: 'category',
        title: cat.name,
        subtitle: `In ${cat.nameHi}`,
        categoryId: cat.id,
        image: cat.image,
      });
    }

    cat.subcategories?.forEach((sub) => {
      if (
        sub.name.toLowerCase().includes(trimmed) ||
        sub.nameHi.toLowerCase().includes(trimmed)
      ) {
        result.categories.push({
          type: 'subcategory',
          title: sub.name,
          subtitle: `in ${cat.name}`,
          categoryId: cat.id,
          subcategoryId: sub.id,
        });
      }
    });
  });

  // 2. Brands matching
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand)));
  uniqueBrands.forEach((brand) => {
    if (brand.toLowerCase().includes(trimmed)) {
      result.brands.push({
        type: 'brand',
        title: brand,
        subtitle: 'Verified Brand Store',
        brand: brand,
      });
    }
  });

  // 3. Top Products matching
  const matchingProducts = products.filter((p) => {
    return (
      p.title.toLowerCase().includes(trimmed) ||
      p.titleHi.toLowerCase().includes(trimmed) ||
      p.brand.toLowerCase().includes(trimmed) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(trimmed)))
    );
  });

  matchingProducts.slice(0, 4).forEach((p) => {
    result.products.push({
      type: 'product',
      title: p.title,
      subtitle: `${p.brand} · ₹${p.price.toLocaleString('en-IN')}`,
      productId: p.id,
      price: p.price,
      image: p.images[0],
    });
  });

  // 4. Keyword suggestions
  const keywordsSet = new Set<string>();
  POPULAR_SEARCH_TERMS.forEach((term) => {
    if (term.toLowerCase().includes(trimmed)) {
      keywordsSet.add(term);
    }
  });

  products.forEach((p) => {
    if (p.tags) {
      p.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(trimmed)) {
          keywordsSet.add(tag);
        }
      });
    }
  });

  result.keywords = Array.from(keywordsSet).slice(0, 5);

  return result;
}
