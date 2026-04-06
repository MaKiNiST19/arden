import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://fcyouilpoqkegiwquzji.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjeW91aWxwb3FrZWdpd3F1emppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTk2MTYsImV4cCI6MjA5MDgzNTYxNn0.LAloNnq-6mjvegXiYLwwTjG0th4BYh4CVuRad2WtIyo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const productsDataPath = path.join(process.cwd(), 'src', 'data', 'products-4akc.json');
const products = JSON.parse(fs.readFileSync(productsDataPath, 'utf8'));

// Sabit kategoriler
const categoriesToUpload = [
  { name: 'Takım Elbise', slug: 'takim-elbise' },
  { name: 'Smokin', slug: 'smokin' },
  { name: 'Ceket', slug: 'ceket' },
  { name: 'Pantolon', slug: 'pantolon' },
  { name: 'Gömlek', slug: 'gomlek' },
  { name: 'T-Shirt', slug: 't-shirt' },
  { name: 'Triko', slug: 'triko' },
  { name: 'Ayakkabı', slug: 'ayakkabi' },
  { name: 'Aksesuar', slug: 'aksesuar' },
  { name: 'Mont', slug: 'mont' },
  { name: 'Dış Giyim', slug: 'dis-giyim' }
];

async function uploadData() {
  console.log('🚀 Veri yükleme işlemi başlıyor...');

  // 1. Kategorileri Yükle
  console.log('📂 Kategoriler yükleniyor...');
  const { data: dbCategories, error: catError } = await supabase
    .from('categories')
    .upsert(categoriesToUpload, { onConflict: 'slug' })
    .select();

  if (catError) {
    console.error('❌ Kategori hatası:', catError);
    return;
  }
  console.log(`✅ ${dbCategories.length} kategori hazır.`);

  // Kategori slug -> ID map
  const categoryMap = {};
  dbCategories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  // 2. Ürünleri Hazırla ve Yükle (Toplu halde veya 50'şerli gruplar halinde)
  // Shopify verisinde 'category' slug olarak var.
  console.log('📦 Ürünler yükleniyor (1278 adet)...');
  
  const formattedProducts = products.map(p => ({
    name: p.name,
    slug: `${p.slug}-${Math.floor(Math.random() * 1000)}`, // Slug çakışmalarını önlemek için (bazı Shopify sitelerinde aynı handle olabilir)
    description: p.description,
    price: p.price,
    original_price: p.originalPrice || null,
    stock: p.isAvailable ? 100 : 0,
    images: p.images || [],
    badge: p.badge,
    category_id: categoryMap[p.category] || categoryMap['takim-elbise'], // Eşleşmeyenleri default bir yere koyalım
    is_active: true
  }));

  // Toplu yüklemede Supabase limitine takılmamak için 100'erlik batchler
  const batchSize = 100;
  for (let i = 0; i < formattedProducts.length; i += batchSize) {
    const batch = formattedProducts.slice(i, i + batchSize);
    const { error: prodError } = await supabase
      .from('products')
      .insert(batch);

    if (prodError) {
      console.error(`❌ Batch ${i / batchSize + 1} hatası:`, prodError);
    } else {
      console.log(`✅ Ürünler yüklendi: ${i + batch.length} / ${formattedProducts.length}`);
    }
  }

  console.log('🏁 İşlem tamamlandı!');
}

uploadData();
