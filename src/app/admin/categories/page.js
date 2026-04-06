'use client';
import { useState, useEffect } from 'react';
import { 
  Tags, 
  Plus, 
  Edit, 
  Trash2,
  FolderOpen
} from 'lucide-react';
import styles from '../admin.module.css';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Kategoriler</h1>
        <Link href="/admin/categories/new" className="btn btn--primary" style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Plus size={18} />
          Yeni Kategori
        </Link>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>İsim</th>
              <th>Slug</th>
              <th>Açıklama</th>
              <th>Ürün Sayısı</th>
              <th style={{ textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Yükleniyor...</td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: 600 }}>{cat.name}</td>
                  <td>{cat.slug}</td>
                  <td style={{ color: '#64748b' }}>{cat.description || '-'}</td>
                  <td>-</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className={styles.userBtn} onClick={() => alert('Yönetim yakında!')}><Edit size={16} color="#64748b" /></button>
                      <button className={styles.userBtn} onClick={() => alert('Silme yakında!')}><Trash2 size={16} color="#ef4444" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                  <Tags size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                  <p>Henüz kategori eklenmemiş.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
