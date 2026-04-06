// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ARDEN MEN WEAR - Mock Data
// Bu veriler ileride Supabase'den gelecek
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { allProducts4akc, categories4akc } from './products4akc';

export const categories = categories4akc.map(cat => ({
  id: cat.slug,
  name: cat.name,
  slug: cat.slug,
  icon: 'shirt',
  image: '/assets/kategoriler/gomlek.png'
}));

export const megaMenuData = {
  'Giyim': {
    subcategories: [
      {
        title: 'Üst Giyim',
        items: ['Tişörtler', 'Gömlekler', 'Sweatshirtler', 'Kazaklar', 'Yelekler', 'Ceketler']
      },
      {
        title: 'Alt Giyim',
        items: ['Pantolonlar', 'Şortlar', 'Eşofman Altları', 'Kotlar', 'Chino']
      },
      {
        title: 'Dış Giyim',
        items: ['Montlar', 'Paltolar', 'Tenchcoatlar', 'Yağmurluklar']
      }
    ],
    featured: { title: 'Yeni Sezon', image: '/assets/mega-menu-featured.jpg' }
  },
  'Ayakkabı': {
    subcategories: [
      {
        title: 'Spor',
        items: ['Sneakers', 'Koşu Ayakkabısı', 'Antrenman']
      },
      {
        title: 'Klasik',
        items: ['Oxford', 'Loafer', 'Derby', 'Monk Strap']
      },
      {
        title: 'Günlük',
        items: ['Slip-on', 'Sandalet', 'Terlik']
      }
    ],
    featured: { title: 'En Çok Satanlar', image: '/assets/mega-menu-shoes.jpg' }
  },
  'Aksesuar': {
    subcategories: [
      {
        title: 'Aksesuarlar',
        items: ['Saatler', 'Güneş Gözlükleri', 'Kemerler', 'Kravatlar', 'Cüzdanlar', 'Çantalar']
      },
      {
        title: 'Takılar',
        items: ['Bileklikler', 'Kolyeler', 'Yüzükler']
      }
    ],
    featured: { title: 'Premium Koleksiyon', image: '/assets/mega-menu-acc.jpg' }
  },
};

export const heroSlides = [
  {
    id: 1,
    title: 'Yeni Sezon Koleksiyonu',
    subtitle: 'İlkbahar / Yaz 2026',
    description: 'Şıklığı ve konforu bir arada sunan yeni sezon parçalarıyla tarzınızı yansıtın.',
    cta: 'Koleksiyonu Keşfet',
    ctaLink: '/kategori/yeni-sezon',
    bgColor: '#1a1510',
    textColor: '#f5f5f5',
    image: '/assets/arden-men-wear-slide-1.jpg',
  },
  {
    id: 2,
    title: 'Premium Kumaşlar',
    subtitle: 'Özel Üretim',
    description: 'İtalyan kumaşlarla üretilen özel koleksiyonumuz ile farkınızı ortaya koyun.',
    cta: 'İncele',
    ctaLink: '/kategori/premium',
    bgColor: '#0d1117',
    textColor: '#f5f5f5',
  },
  {
    id: 3,
    title: '%40\'a Varan İndirimler',
    subtitle: 'Sınırlı Süre',
    description: 'Seçili ürünlerde kaçırılmayacak fırsatlar sizi bekliyor.',
    cta: 'Fırsatları Gör',
    ctaLink: '/indirimli',
    bgColor: '#170d0d',
    textColor: '#f5f5f5',
  },
];

const colorOptions = {
  siyah: '#1a1a1a',
  beyaz: '#f5f5f5',
  lacivert: '#1e3a5f',
  haki: '#5b6b4a',
  bej: '#c8b896',
  bordo: '#6b1d2a',
  gri: '#6b6b6b',
  kahve: '#5c3d2e',
  hardal: '#c49a2a',
  zeytinyesili: '#5b6b3a',
  antrasit: '#3d3d3d',
  kiremit: '#b85c38',
};

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const products = allProducts4akc;

export const bentoCategories = [
  {
    id: 1,
    title: 'Pantolonlar',
    subtitle: 'Slim & Regular Fit',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
    link: '/kategori/pantolon',
    size: 'large',
  },
  {
    id: 2,
    title: 'Dış Giyim',
    subtitle: 'Mont & Ceket',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    link: '/kategori/mont',
    size: 'small',
  },
  {
    id: 3,
    title: 'Kazak & Hırka',
    subtitle: 'Sezon Koleksiyonu',
    image: 'https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&q=80',
    link: '/kategori/kazak',
    size: 'small',
  },
];

export const featuresData = [
  {
    icon: '📏',
    title: 'Mükemmel Kalıp',
    description: 'Geniş beden aralığımızla size en uygun kalıbı bulun.',
  },
  {
    icon: '🔄',
    title: 'Kolay İade',
    description: 'Beğenmediniz mi? 14 gün içinde ücretsiz iade ve değişim.',
  },
  {
    icon: '🚚',
    title: 'Hızlı Teslimat',
    description: '500₺ üzeri siparişlerde ücretsiz kargo. 1-3 iş günü teslimat.',
  },
  {
    icon: '💳',
    title: 'Güvenli Ödeme',
    description: '256-bit SSL ile güvenli alışveriş. Kredi kartı ve havale seçenekleri.',
  },
];

export const customerPhotos = [
  { id: 1, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', username: '@ardenfan1' },
  { id: 2, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', username: '@styledude' },
  { id: 3, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', username: '@mensfashion_tr' },
  { id: 4, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', username: '@fashion_ankara' },
  { id: 5, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', username: '@styleboy' },
  { id: 6, image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80', username: '@urbanwear_tr' },
];

export const seoContent = {
  title: 'Arden Men Wear - Premium Erkek Giyim',
  text: `Arden Men Wear olarak erkek modasında kalite ve şıklığı bir araya getiriyoruz. Ankara Etimesgut Eryaman Porto'daki fiziki mağazamız ve online platformumuzla, modern erkeğin gardırobuna premium parçalar sunuyoruz. Tişörtten pantolona, monttan aksesuara kadar geniş ürün yelpazemizle her tarza ve her bütçeye uygun seçenekler sizi bekliyor.

Koleksiyonlarımız, en son moda trendlerini takip ederken, zamansız tasarım anlayışımızla da öne çıkıyor. Üstün kalite kumaşlar ve titiz üretim süreçleriyle hazırlanan her bir ürünümüz, uzun ömürlü kullanım ve konfor vaat ediyor. Arden Men Wear ile tarzınızı yansıtın, kendinizi özel hissedin.`,
};

export const storeInfo = {
  name: 'Arden Men Wear',
  slogan: 'Premium Erkek Giyim',
  phone: '+90 312 000 00 00',
  whatsapp: '+905000000000',
  email: 'info@ardenmenwear.com',
  address: 'Eryaman Porto AVM, Etimesgut, Ankara',
  fullAddress: 'Eryaman Mahallesi, Porto AVM No:XX, 06824 Etimesgut/Ankara',
  workingHours: 'Pazartesi - Cumartesi: 10:00 - 22:00 | Pazar: 11:00 - 21:00',
  social: {
    instagram: 'https://instagram.com/ardenmenwear',
    facebook: 'https://facebook.com/ardenmenwear',
    twitter: 'https://twitter.com/ardenmenwear',
    tiktok: 'https://tiktok.com/@ardenmenwear',
  },
};

export const sizeChart = {
  headers: ['Beden', 'Göğüs (cm)', 'Bel (cm)', 'Kalça (cm)', 'Boy (cm)'],
  rows: [
    ['XS', '86-90', '72-76', '88-92', '170-175'],
    ['S', '90-94', '76-80', '92-96', '173-178'],
    ['M', '94-98', '80-84', '96-100', '176-181'],
    ['L', '98-102', '84-88', '100-104', '179-184'],
    ['XL', '102-106', '88-92', '104-108', '182-187'],
    ['XXL', '106-110', '92-96', '108-112', '185-190'],
  ],
};
