/**
 * 4AKC Ürün Çekme Script'i
 * 
 * 4akc.com Shopify sitesinden tüm ürünleri çeker ve
 * Arden proje formatına dönüştürüp JSON dosyasına kaydeder.
 * 
 * Kullanım: node scripts/fetch-4akc-products.mjs
 */

const BASE_URL = 'https://4akc.com/products.json';
const PRODUCTS_PER_PAGE = 250; // Shopify max limit

const colorMap = {
  'siyah': '#1a1a1a',
  'beyaz': '#f5f5f5',
  'lacivert': '#1e3a5f',
  'haki': '#5b6b4a',
  'bej': '#c8b896',
  'bordo': '#6b1d2a',
  'gri': '#6b6b6b',
  'kahve': '#5c3d2e',
  'kahverengi': '#5c3d2e',
  'koyu kahve': '#3d2618',
  'camel': '#c19a6b',
  'vizon': '#8b7d6b',
  'indigo': '#3f51b5',
  'bakır': '#b87333',
  'bakir': '#b87333',
  'mavi': '#2979ff',
  'yeşil': '#4caf50',
  'yesil': '#4caf50',
  'kremit': '#b85c38',
  'kiremit': '#b85c38',
  'hardal': '#c49a2a',
  'sarı': '#f5c518',
  'sari': '#f5c518',
  'pembe': '#e91e63',
  'turuncu': '#ff9800',
};

const categoryMap = {
  'Takım Elbise': { slug: 'takim-elbise', parentSlug: 'ust-giyim' },
  'Smokin': { slug: 'smokin', parentSlug: 'takim-elbise' },
  'Ceket': { slug: 'ceket', parentSlug: 'ust-giyim' },
  'Pantolon': { slug: 'pantolon', parentSlug: 'alt-giyim' },
  'Gömlek': { slug: 'gomlek', parentSlug: 'ust-giyim' },
  'T-Shirt': { slug: 't-shirt', parentSlug: 'ust-giyim' },
  'Triko': { slug: 'triko', parentSlug: 'ust-giyim' },
  'Kazak': { slug: 'kazak', parentSlug: 'ust-giyim' },
  'Yelek': { slug: 'yelek', parentSlug: 'ust-giyim' },
  'Oversize': { slug: 'oversize', parentSlug: 'ust-giyim' },
  'Eşofman': { slug: 'esofman', parentSlug: 'alt-giyim' },
  'Mont': { slug: 'mont', parentSlug: 'dis-giyim' },
  'Kaban': { slug: 'kaban', parentSlug: 'dis-giyim' },
  'Palto': { slug: 'palto', parentSlug: 'dis-giyim' },
  'Hırka': { slug: 'hirka', parentSlug: 'ust-giyim' },
  'Ayakkabı': { slug: 'ayakkabi', parentSlug: 'ayakkabi' },
  'AKSESUAR': { slug: 'aksesuar', parentSlug: 'aksesuar' },
  'Kravat': { slug: 'kravat', parentSlug: 'aksesuar' },
  'Kemer': { slug: 'kemer', parentSlug: 'aksesuar' },
  'Mendil': { slug: 'mendil', parentSlug: 'aksesuar' },
  'Çorap': { slug: 'corap', parentSlug: 'aksesuar' },
};

function getColorHex(colorName) {
  const lower = colorName.toLowerCase().trim();
  return colorMap[lower] || '#999999';
}

function getCategoryInfo(productType) {
  return categoryMap[productType] || { slug: productType?.toLowerCase().replace(/\s+/g, '-') || 'diger', parentSlug: 'diger' };
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFeatures(bodyHtml) {
  if (!bodyHtml) return [];
  const features = [];
  const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(bodyHtml)) !== null) {
    const text = stripHtml(match[1]).trim();
    if (text && text.length > 3 && text.length < 200) {
      features.push(text);
    }
  }
  return features.slice(0, 8);
}

function transformProduct(shopifyProduct, index) {
  const { title, handle, body_html, product_type, tags, variants, images, options } = shopifyProduct;
  
  // Fiyat bilgisi
  const firstVariant = variants[0];
  const price = parseFloat(firstVariant?.price || 0);
  const comparePrice = firstVariant?.compare_at_price ? parseFloat(firstVariant.compare_at_price) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;
  
  // Renk bilgisi
  const colorOption = options?.find(o => o.name === 'Renk' || o.name === 'Color');
  const colors = colorOption?.values?.map(colorName => ({
    name: colorName,
    hex: getColorHex(colorName),
    images: [],
  })) || [];

  // Beden bilgisi
  const sizeOption = options?.find(o => o.name === 'Beden' || o.name === 'Size');
  const sizes = sizeOption?.values || [];

  // Görseller
  const productImages = images?.map(img => img.src) || [];
  
  // Kategori
  const catInfo = getCategoryInfo(product_type);
  
  // Badge belirleme
  let badge = null;
  if (tags?.includes('EN YENİLER')) badge = 'Yeni';
  if (discount) badge = 'İndirim';
  
  // Stok durumu
  const available = variants.some(v => v.available);

  return {
    id: shopifyProduct.id,
    name: title,
    slug: handle,
    category: catInfo.slug,
    parentCategory: catInfo.parentSlug,
    productType: product_type,
    price: price,
    originalPrice: comparePrice,
    discount: discount,
    badge: badge,
    rating: (4.3 + Math.random() * 0.7).toFixed(1), // Placeholder rating
    reviewCount: Math.floor(Math.random() * 50 + 10),
    description: stripHtml(body_html).substring(0, 500),
    features: extractFeatures(body_html),
    colors: colors,
    sizes: sizes,
    images: productImages,
    video: null,
    isNew: tags?.includes('EN YENİLER') || false,
    isBestseller: false,
    isAvailable: available,
    tags: tags || [],
    sku: firstVariant?.sku || '',
    vendor: shopifyProduct.vendor || '4AKC',
    source: '4akc',
    sourceUrl: `https://4akc.com/products/${handle}`,
    variants: variants.map(v => ({
      id: v.id,
      title: v.title,
      price: parseFloat(v.price),
      compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
      available: v.available,
      sku: v.sku,
      option1: v.option1,
      option2: v.option2,
    })),
    createdAt: shopifyProduct.created_at,
    updatedAt: shopifyProduct.updated_at,
  };
}

async function fetchAllProducts() {
  let allProducts = [];
  let page = 1;
  let hasMore = true;

  console.log('🔍 4akc.com ürünleri çekiliyor...\n');

  while (hasMore) {
    const url = `${BASE_URL}?limit=${PRODUCTS_PER_PAGE}&page=${page}`;
    console.log(`📄 Sayfa ${page} çekiliyor: ${url}`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const products = data.products || [];
      
      if (products.length === 0) {
        hasMore = false;
        console.log(`   ✅ Son sayfa (boş), toplam sayfa: ${page - 1}`);
      } else {
        allProducts = allProducts.concat(products);
        console.log(`   ✅ ${products.length} ürün bulundu (toplam: ${allProducts.length})`);
        
        if (products.length < PRODUCTS_PER_PAGE) {
          hasMore = false;
        } else {
          page++;
        }
      }
    } catch (error) {
      console.error(`   ❌ Hata: ${error.message}`);
      hasMore = false;
    }
  }

  return allProducts;
}

async function main() {
  try {
    const shopifyProducts = await fetchAllProducts();
    
    console.log(`\n📦 Toplam ${shopifyProducts.length} ürün çekildi.`);
    
    // Ürünleri dönüştür
    const transformedProducts = shopifyProducts.map((p, i) => transformProduct(p, i));
    
    // Kategori istatistikleri
    const categoryStats = {};
    transformedProducts.forEach(p => {
      const cat = p.productType || 'Belirtilmemiş';
      categoryStats[cat] = (categoryStats[cat] || 0) + 1;
    });
    
    console.log('\n📊 Kategori Dağılımı:');
    Object.entries(categoryStats)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} ürün`);
      });
    
    // Fiyat aralığı
    const prices = transformedProducts.map(p => p.price).filter(p => p > 0);
    console.log(`\n💰 Fiyat Aralığı: ${Math.min(...prices).toLocaleString('tr-TR')}₺ - ${Math.max(...prices).toLocaleString('tr-TR')}₺`);
    
    // JSON dosyasına kaydet
    const fs = await import('fs');
    const path = await import('path');
    
    const outputPath = path.join(process.cwd(), 'src', 'data', 'products-4akc.json');
    fs.writeFileSync(outputPath, JSON.stringify(transformedProducts, null, 2), 'utf-8');
    console.log(`\n✅ ${transformedProducts.length} ürün kaydedildi: ${outputPath}`);
    
    // Özet bilgi
    const summary = {
      totalProducts: transformedProducts.length,
      categories: categoryStats,
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
      fetchedAt: new Date().toISOString(),
      source: 'https://4akc.com',
    };
    
    const summaryPath = path.join(process.cwd(), 'src', 'data', 'products-4akc-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
    console.log(`📋 Özet bilgi kaydedildi: ${summaryPath}`);
    
  } catch (error) {
    console.error('❌ Script hatası:', error);
    process.exit(1);
  }
}

main();
