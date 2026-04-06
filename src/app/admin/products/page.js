'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import styles from '../admin.module.css';

import { supabase } from '@/lib/supabase';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ürünler yüklenirken hata:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Ürün Yönetimi</h1>
        <Link href="/admin/products/new" className="btn btn--primary" style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Plus size={18} />
          Yeni Ürün Ekle
        </Link>
      </div>

      <div className={styles.card}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="text" 
              placeholder="Ürün ismi, SKU veya slug ile ara..." 
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b' }}>
            <option>Tüm Kategoriler</option>
            <option>Üst Giyim</option>
            <option>Alt Giyim</option>
            <option>Ayakkabı</option>
          </select>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Görsel</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>Durum</th>
              <th style={{ textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  Yükleniyor...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/50'} 
                      alt={product.name} 
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                  <td>{product.categories?.name || 'Kategorisiz'}</td>
                  <td>₺{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`${styles.badge} ${product.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                      {product.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className={styles.userBtn} onClick={() => alert('Düzenleme yakında!')}><Edit size={16} color="#64748b" /></button>
                      <button className={styles.userBtn} onClick={() => alert('Silme yakında!')}><Trash2 size={16} color="#ef4444" /></button>
                      <Link href={`/urun/${product.slug}`} target="_blank"><ExternalLink size={16} color="#64748b" /></Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                  <Package size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                  <p>Henüz ürün eklenmemiş.</p>
                  <p style={{ fontSize: '0.8rem' }}>Hemen bir ürün ekleyerek başlayın.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
