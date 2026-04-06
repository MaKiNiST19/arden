-- Arden Men Wear Kategori Hiyerarşisi SQL
-- Bu kodu Supabase SQL Editor kısmında çalıştırın.

-- Önce mevcut kategorileri temizleyelim (Opsiyonel, temiz bir başlangıç için)
-- DELETE FROM public.categories;

-- 1. ANA KATEGORİLER
INSERT INTO public.categories (id, name, slug, description) VALUES
(gen_random_uuid(), 'Takım Elbise', 'takim-elbise', 'Premium kesim takım elbiseler ve smokinler'),
(gen_random_uuid(), 'Üst Giyim', 'ust-giyim', 'Tişört, gömlek, kazak ve ceket koleksiyonu'),
(gen_random_uuid(), 'Alt Giyim', 'alt-giyim', 'Pantolon ve eşofman grubu'),
(gen_random_uuid(), 'Dış Giyim', 'dis-giyim', 'Kaban, mont ve mevsimlik dış giyim'),
(gen_random_uuid(), 'Ayakkabı', 'ayakkabi', 'Klasik ve casual ayakkabı modelleri'),
(gen_random_uuid(), 'Aksesuar', 'aksesuar', 'Kemer, kravat, mendil ve daha fazlası');

-- 2. ALT KATEGORİLERİ EKLEME (Parent_id eşleşmeleri ile)

-- Takım Elbise Altı
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Smokin', 'smokin', id FROM public.categories WHERE slug = 'takim-elbise';

-- Üst Giyim Altı
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Gömlek', 'gomlek', id FROM public.categories WHERE slug = 'ust-giyim';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'T-Shirt', 't-shirt', id FROM public.categories WHERE slug = 'ust-giyim';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Triko & Kazak', 'triko-kazak', id FROM public.categories WHERE slug = 'ust-giyim';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Ceket', 'ceket', id FROM public.categories WHERE slug = 'ust-giyim';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Yelek', 'yelek', id FROM public.categories WHERE slug = 'ust-giyim';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Oversize', 'oversize', id FROM public.categories WHERE slug = 'ust-giyim';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Hırka', 'hirka', id FROM public.categories WHERE slug = 'ust-giyim';

-- Alt Giyim Altı
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Pantolon', 'pantolon', id FROM public.categories WHERE slug = 'alt-giyim';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Eşofman & Şort', 'esofman-sort', id FROM public.categories WHERE slug = 'alt-giyim';

-- Dış Giyim Altı
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Mont', 'mont', id FROM public.categories WHERE slug = 'dis-giyim';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Kaban & Palto', 'kaban-palto', id FROM public.categories WHERE slug = 'dis-giyim';

-- Aksesuar Altı
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Mendil', 'mendil', id FROM public.categories WHERE slug = 'aksesuar';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Kemer', 'kemer', id FROM public.categories WHERE slug = 'aksesuar';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Kravat', 'kravat', id FROM public.categories WHERE slug = 'aksesuar';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Çorap', 'corap', id FROM public.categories WHERE slug = 'aksesuar';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Şal & Atkı', 'sal-atki', id FROM public.categories WHERE slug = 'aksesuar';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Pantolon Askısı', 'pantolon-askisi', id FROM public.categories WHERE slug = 'aksesuar';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Bere', 'bere', id FROM public.categories WHERE slug = 'aksesuar';
INSERT INTO public.categories (name, slug, parent_id) 
SELECT 'Yaka Zinciri', 'yaka-zinciri', id FROM public.categories WHERE slug = 'aksesuar';
