// Format price to Turkish Lira
export function formatPrice(price) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Calculate discount percentage
export function calculateDiscount(originalPrice, currentPrice) {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

// Generate WhatsApp URL
export function getWhatsAppUrl(product, color, size) {
  const phone = '905000000000'; // Store phone
  const message = encodeURIComponent(
    `Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.\n` +
    `Renk: ${color || '-'}\n` +
    `Beden: ${size || '-'}\n` +
    `Fiyat: ${formatPrice(product.price)}\n` +
    `Link: https://ardenmenwear.com/urun/${product.slug}`
  );
  return `https://wa.me/${phone}?text=${message}`;
}

// Truncate text
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Generate star array for rating
export function getStars(rating) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars.push('full');
    else if (i === fullStars && hasHalf) stars.push('half');
    else stars.push('empty');
  }
  return stars;
}

// Slugify text
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Kategori slug veya adından manken slot'unu belirle
export function getSlotFromCategory(item) {
  if (!item) return 'ust';
  const name = (item.name || '').toLowerCase();
  const cat = (item.category || item.productType || '').toLowerCase();
  
  if ([cat, name].some(c => ['pantolon', 'şort', 'sort', 'alt-giyim', 'alt giyim', 'jean', 'esofman-alti', 'pijama alt'].some(k => c.includes(k)))) return 'alt';
  if ([cat, name].some(c => ['ayakkabi', 'ayakkabı', 'bot', 'sneaker', 'terlik', 'sandalet'].some(k => c.includes(k)))) return 'ayakkabi';
  if ([cat, name].some(c => ['aksesuar', 'taki', 'saat', 'gozluk', 'şapka', 'sapka', 'kemer', 'çanta', 'canta', 'bileklik', 'kolye'].some(k => c.includes(k)))) return 'aksesuar';
  return 'ust';
}
