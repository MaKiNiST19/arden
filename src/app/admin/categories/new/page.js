'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save, 
  Info,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../../admin.module.css';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: '',
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  const generateAIContent = async () => {
    if (!formData.name) return alert('Lütfen önce bir kategori adı girin.');
    setLoading(true);
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, type: 'category' })
      });
      const data = await response.json();
      if (data.text) {
        setFormData(prev => ({ ...prev, description: data.text }));
      }
    } catch (error) {
      console.error('Gemini Hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return alert('Kategori adı zorunludur.');
    setLoading(true);

    try {
      let uploadedImageUrl = null;

      // 1. Upload Image to Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `cat_${Math.random()}.${fileExt}`;
        const filePath = `category-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products') // Assuming we use same general bucket, or a public bucket
          .upload(filePath, imageFile);

        if (uploadError) {
           console.warn('Görsel yüklenirken hata oluştu:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);
          uploadedImageUrl = publicUrl;
        }
      }

      // 2. Save Category to Database
      const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const { error } = await supabase.from('categories').insert([{
        name: formData.name,
        slug: slug,
        description: formData.description,
        image_url: uploadedImageUrl,
        parent_id: formData.parent_id || null
      }]);

      if (error) throw error;
      
      alert('Kategori başarıyla eklendi!');
      router.push('/admin/categories');
    } catch (error) {
      alert('Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.newProductPage}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/categories" className={styles.userBtn}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Yeni Kategori Ekle</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Mağazanız için ana ve alt kategoriler oluşturun.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Column - Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className={styles.card}>
            <div style={{ marginBottom: '16px' }}>
              <label className={styles.label}>Kategori Adı</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input} 
                placeholder="Örn: Erkek Pantolon"
                required
              />
            </div>
            <div>
              <label className={styles.label}>Üst Kategori (Opsiyonel)</label>
              <select 
                name="parent_id"
                value={formData.parent_id}
                onChange={handleInputChange}
                className={styles.input}
              >
                <option value="">Ana Kategori (Üst Kademe Yok)</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 8px 0' }}>
                <label className={styles.label} style={{ marginBottom: 0 }}>Açıklama (Opsiyonel)</label>
                <button 
                  type="button" 
                  onClick={generateAIContent}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  <Sparkles size={14} /> Gemini ile Yaz
                </button>
              </div>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.textarea} 
                rows={4}
                placeholder="Bu kategori hakkında müşterilere görünecek kısa bir bilgi yazın (SEO için faydalıdır)."
              />
            </div>
          </div>
        </div>

        {/* Right Column - Organization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ fontSize: '0.875rem' }}>İşlemler</h3>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn--primary btn--full" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Save size={18} /> {loading ? 'Kaydediliyor...' : 'Kategori Kaydet'}
            </button>
          </div>

          <div className={styles.card}>
             <h3 className={styles.cardTitle} style={{ fontSize: '0.875rem' }}>Kategori Görseli</h3>
             {preview ? (
                <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img src={preview} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  <button 
                    type="button" 
                    onClick={removeImage}
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', border: '2px dashed #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', background: '#f8fafc' }}>
                  <Upload size={24} color="#94a3b8" />
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>Görsel Seç (Opsiyonel)</span>
                  <input type="file" onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                </label>
              )}
          </div>

          <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '12px', color: '#1e40af', border: '1px solid #bfdbfe', display: 'flex', gap: '12px' }}>
            <Info size={20} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
               Kategori eklendikten sonra ürün sayfasından ürün eklerken bu kategoriyi artık listede görebilirsiniz.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
