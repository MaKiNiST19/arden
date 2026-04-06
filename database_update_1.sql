-- Ürünler tablosuna siralama ve kombin/birlikte al alanlari ekleniyor
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS menu_order INT DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS combination_products UUID[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS frequently_bought_together UUID[] DEFAULT '{}';
