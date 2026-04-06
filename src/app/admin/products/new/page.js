'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save, 
  Sparkles, 
  Info,
  DollarSign,
  Package,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from '../../admin.module.css';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: 0,
    category_id: '',
    is_active: true,
    badge: '',
    menu_order: 0,
    images: []
  });

  const [combinationProducts, setCombinationProducts] = useState([]);
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState([]);

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]); // { url, type: 'image' | 'video' }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: cats } = await supabase.from('categories').select('*').order('name');
    if (cats) setCategories(cats);

    const { data: prods } = await supabase.from('products').select('id, name').order('name');
    if (prods) setAllProducts(prods);
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const generateAIContent = async () => {
    if (!formData.name) return alert('Lütfen önce bir ürün adı girin.');
    setLoading(true);
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, type: 'product' })
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
    setLoading(true);

    try {
      // 1. Upload Images to Supabase Storage (if any)
      const uploadedImageUrls = [];
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);
          uploadedImageUrls.push(publicUrl);
        }
      }

      // 2. Save Product to Database
      const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const { error } = await supabase.from('products').insert([{
        ...formData,
        slug,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : formData.images,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        combination_products: combinationProducts,
        frequently_bought_together: frequentlyBoughtTogether
      }]);

      if (error) throw error;
      
      alert('Ürün başarıyla eklendi!');
      router.push('/admin/products');
    } catch (error) {
      alert('Hata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.newProductPage}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/admin/products" className={styles.userBtn}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Yeni Ürün Ekle</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Mağazanıza yeni bir premium parça ekleyin.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Column - Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Title & Description */}
          <div className={styles.card}>
            <div style={{ marginBottom: '16px' }}>
              <label className={styles.label}>Ürün Adı</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input} 
                placeholder="Örn: Siyah Oversize Pamuklu Tişört"
                required
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className={styles.label} style={{ marginBottom: 0 }}>Açıklama</label>
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
                rows={8}
                placeholder="Ürünün kumaşı, kalıbı ve detayları hakkında bilgi verin..."
              />
            </div>
          </div>

          {/* Media */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ fontSize: '0.875rem' }}>Görseller ve Videolar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
              {previews.map((item, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#000' }}>
                  {item.type === 'video' ? (
                    <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  ) : (
                    <img src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                  >
                    <X size={12} />
                  </button>
                  {item.type === 'video' && (
                     <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '2px 4px', borderRadius: '4px' }}>VIDEO</div>
                  )}
                </div>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px', border: '2px dashed #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <Upload size={24} color="#94a3b8" />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>Resim veya Video<br/>Yükle</span>
                <input type="file" multiple onChange={handleImageChange} style={{ display: 'none' }} accept="image/*,video/*" />
              </label>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '12px' }}>* İlk video otomatik olarak 2. medya konumuna (kapaktan sonraki ilk sıraya) yerleştirilir.</p>
          </div>

          {/* Pricing */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ fontSize: '0.875rem' }}>Fiyatlandırma</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className={styles.label}>Satış Fiyatı (₺)</label>
                <div style={{ position: 'relative' }}>
                   <DollarSign size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                   <input 
                     type="number" 
                     name="price"
                     value={formData.price}
                     onChange={handleInputChange}
                     style={{ paddingLeft: '32px' }}
                     className={styles.input} 
                     placeholder="0.00"
                     required
                   />
                </div>
              </div>
              <div>
                <label className={styles.label}>İndirim Öncesi Fiyat (₺)</label>
                <div style={{ position: 'relative' }}>
                   <DollarSign size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                   <input 
                     type="number" 
                     name="original_price"
                     value={formData.original_price}
                     onChange={handleInputChange}
                     style={{ paddingLeft: '32px' }}
                     className={styles.input} 
                     placeholder="Gerekli değil"
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ fontSize: '0.875rem' }}>Envanter</h3>
            <div style={{ maxWidth: '200px' }}>
              <label className={styles.label}>Stok Miktarı</label>
              <input 
                type="number" 
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={styles.input} 
                min="0"
                required
              />
            </div>
          </div>

          {/* Upsell / Cross-sell */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ fontSize: '0.875rem' }}>İlişkili Ürünler (Upsell & Cross-sell)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className={styles.label}>Kombin Yapılabilecek Ürünler (Çoklu seçimi virgülle ID ekleyerek veya dropdownla listeleyebilirsiniz, bu versiyonda basitleştirilmiş UI var)</label>
                <select 
                  multiple
                  value={combinationProducts}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setCombinationProducts(values);
                  }}
                  className={styles.input}
                  style={{ minHeight: '100px' }}
                >
                  {allProducts.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.name}</option>
                  ))}
                </select>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Birden fazla seçmek için CTRL/CMD basılı tutun. Kombin sayfasında giydirmede önerilir.</span>
              </div>
              
              <div>
                <label className={styles.label}>Birlikte Al Seçenekleri</label>
                <select 
                  multiple
                  value={frequentlyBoughtTogether}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFrequentlyBoughtTogether(values);
                  }}
                  className={styles.input}
                  style={{ minHeight: '100px' }}
                >
                   {allProducts.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.name}</option>
                  ))}
                </select>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Örn: Pantolon altına uygun kemer önermek için.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Organization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ fontSize: '0.875rem' }}>Yayınla</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <span className={styles.slider}></span>
              </label>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sitede Yayında</span>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn--primary btn--full" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Save size={18} /> {loading ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
            </button>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ fontSize: '0.875rem' }}>Organizasyon</h3>
            <div style={{ marginBottom: '16px' }}>
              <label className={styles.label}>Kategori</label>
              <select 
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className={styles.input}
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>Etiket / Badge</label>
              <input 
                type="text" 
                name="badge"
                value={formData.badge}
                onChange={handleInputChange}
                className={styles.input} 
                placeholder="Örn: Yeni, Çok Satan"
              />
            </div>
            <div>
              <label className={styles.label} style={{ marginTop: '16px' }}>Sıralama Değeri (Menu Order)</label>
              <input 
                type="number" 
                name="menu_order"
                value={formData.menu_order}
                onChange={handleInputChange}
                className={styles.input} 
                placeholder="0"
              />
              <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '4px' }}>Ana sayfa vitrinlerinde (Popüler/İndirimli) bu numaraya göre sıralanır. (1 en başa geçer)</span>
            </div>
          </div>

          <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '12px', color: '#1e40af', border: '1px solid #bfdbfe', display: 'flex', gap: '12px' }}>
            <Info size={20} />
            <p style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
              Ürün yayınlandığında slug otomatik oluşturulur ve URL adresi ürünün ismine göre belirlenir.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
