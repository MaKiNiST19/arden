'use client';
import { useParams } from 'next/navigation';
import { products, categories } from '@/data/mockData';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

export default function CategoryPage() {
  const { slug } = useParams();
  
  const category = categories.find(c => c.slug === slug) || { name: slug.charAt(0).toUpperCase() + slug.slice(1) };
  const categoryProducts = products.filter(p => p.category === slug || (slug === 'yeni-sezon' && p.isNew) || (slug === 'indirimli' && p.discount));

  return (
    <div className="section" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
          <nav style={{ marginBottom: '10px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <Link href="/">Anasayfa</Link> / <span style={{ color: 'var(--color-accent)' }}>{category.name}</span>
          </nav>
          <h1 className="section-title" style={{ fontSize: '32px' }}>{category.name}</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '10px' }}>
            {categoryProducts.length} ürün listeleniyor
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '30px' 
          }}>
            {categoryProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>Bu kategoride henüz ürün bulunmuyor.</p>
            <Link href="/" className="btn btn--primary">Alışverişe Devam Et</Link>
          </div>
        )}
      </div>
    </div>
  );
}
