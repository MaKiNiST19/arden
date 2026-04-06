/**
 * 4AKC Ürün Veri Yöneticisi
 * 
 * 4akc.com'dan çekilen ürünleri yükler, filtreler ve arar.
 * Orijinal veri: products-4akc.json
 */

import productsData from './products-4akc.json';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TÜM ÜRÜNLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const allProducts4akc = productsData;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KATEGORİ BİLGİLERİ
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const categories4akc = [
  { slug: 'takim-elbise', name: 'Takım Elbise', icon: '🤵' },
  { slug: 'smokin', name: 'Smokin', icon: '🎩' },
  { slug: 'ceket', name: 'Ceket', icon: '🧥' },
  { slug: 'pantolon', name: 'Pantolon', icon: '👖' },
  { slug: 'gomlek', name: 'Gömlek', icon: '👔' },
  { slug: 't-shirt', name: 'T-Shirt', icon: '👕' },
  { slug: 'triko', name: 'Triko & Kazak', icon: '🧶' },
  { slug: 'yelek', name: 'Yelek', icon: '🦺' },
  { slug: 'mont', name: 'Mont', icon: '🧥' },
  { slug: 'hirka', name: 'Hırka', icon: '🧣' },
  { slug: 'ayakkabi', name: 'Ayakkabı', icon: '👞' },
  { slug: 'aksesuar', name: 'Aksesuar', icon: '⌚' },
  { slug: 'kravat', name: 'Kravat', icon: '👔' },
  { slug: 'kemer', name: 'Kemer', icon: '🏷️' },
  { slug: 'mendil', name: 'Mendil', icon: '🤧' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FİLTRE FONKSİYONLARI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Kategoriye göre ürünleri filtreler
 */
export function getProductsByCategory(categorySlug) {
  return allProducts4akc.filter(p => p.category === categorySlug);
}

/**
 * Ürün tipine göre filtreler
 */
export function getProductsByType(productType) {
  return allProducts4akc.filter(p => 
    p.productType?.toLowerCase() === productType.toLowerCase()
  );
}

/**
 * Slug ile tek ürün getirir
 */
export function getProductBySlug(slug) {
  return allProducts4akc.find(p => p.slug === slug) || null;
}

/**
 * ID ile tek ürün getirir
 */
export function getProductById(id) {
  return allProducts4akc.find(p => p.id === id) || null;
}

/**
 * En yeni ürünleri getirir
 */
export function getNewProducts(limit = 20) {
  return allProducts4akc
    .filter(p => p.isNew && p.isAvailable)
    .slice(0, limit);
}

/**
 * İndirimli ürünleri getirir
 */
export function getDiscountedProducts(limit = 20) {
  return allProducts4akc
    .filter(p => p.discount && p.discount > 0 && p.isAvailable)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, limit);
}

/**
 * Fiyat aralığına göre filtreler
 */
export function getProductsByPriceRange(minPrice, maxPrice) {
  return allProducts4akc.filter(p => p.price >= minPrice && p.price <= maxPrice);
}

/**
 * Metin araması yapar (isim, açıklama, etiketler)
 */
export function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  return allProducts4akc.filter(p => {
    const searchable = [
      p.name,
      p.description,
      p.productType,
      ...(p.tags || []),
      ...(p.colors?.map(c => c.name) || []),
    ].join(' ').toLowerCase();
    
    return searchable.includes(q);
  });
}

/**
 * Gelişmiş filtreleme
 */
export function filterProducts({
  category,
  productType,
  minPrice,
  maxPrice,
  colors,
  sizes,
  isNew,
  isAvailable = true,
  sortBy = 'newest', // newest, price-asc, price-desc, name
  page = 1,
  limit = 24,
}) {
  let filtered = [...allProducts4akc];

  // Kategori filtresi
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  // Ürün tipi filtresi
  if (productType) {
    filtered = filtered.filter(p => 
      p.productType?.toLowerCase() === productType.toLowerCase()
    );
  }

  // Fiyat filtresi
  if (minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  // Renk filtresi
  if (colors?.length > 0) {
    filtered = filtered.filter(p =>
      p.colors?.some(c => colors.includes(c.name.toLowerCase()))
    );
  }

  // Beden filtresi
  if (sizes?.length > 0) {
    filtered = filtered.filter(p =>
      p.sizes?.some(s => sizes.includes(s))
    );
  }

  // Yeni ürün filtresi
  if (isNew !== undefined) {
    filtered = filtered.filter(p => p.isNew === isNew);
  }

  // Stok filtresi
  if (isAvailable) {
    filtered = filtered.filter(p => p.isAvailable);
  }

  // Sıralama
  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      break;
    case 'newest':
    default:
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  // Sayfalama
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginatedProducts,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Benzer ürünleri getirir
 */
export function getSimilarProducts(productId, limit = 8) {
  const product = getProductById(productId);
  if (!product) return [];
  
  return allProducts4akc
    .filter(p => 
      p.id !== productId && 
      (p.category === product.category || p.productType === product.productType) &&
      p.isAvailable
    )
    .slice(0, limit);
}

/**
 * Kategori istatistiklerini döndürür
 */
export function getCategoryStats() {
  const stats = {};
  allProducts4akc.forEach(p => {
    const cat = p.category || 'diger';
    stats[cat] = (stats[cat] || 0) + 1;
  });
  return stats;
}
