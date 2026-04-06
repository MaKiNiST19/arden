'use client';
import { useRef, useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { getDiscountedProducts } from '@/data/products4akc';
import styles from './ProductSection.module.css';

export default function DiscountedProducts() {
  const scrollRef = useRef(null);
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const discounted = getDiscountedProducts(12);

  const displayProducts = [...discounted, ...discounted];

  useEffect(() => {
    if (isMouseEnter || displayProducts.length === 0) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current && scrollRef.current.children.length > 0) {
        const firstItem = scrollRef.current.children[0];
        const gap = parseInt(getComputedStyle(scrollRef.current).gap) || 0;
        const itemWidth = firstItem.offsetWidth + gap;
        
        const currentScroll = scrollRef.current.scrollLeft;
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        
        if (currentScroll >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
        } else {
          scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isMouseEnter, displayProducts.length]);

  const slide = (direction) => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const firstItem = scrollRef.current.children[0];
      const gap = parseInt(getComputedStyle(scrollRef.current).gap) || 0;
      const itemWidth = firstItem.offsetWidth + gap;
      
      scrollRef.current.scrollBy({ 
        left: direction === 'right' ? itemWidth : -itemWidth, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <section 
      className={`section ${styles.section}`} 
      id="discounted-products"
      onMouseEnter={() => setIsMouseEnter(true)}
      onMouseLeave={() => setIsMouseEnter(false)}
    >
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Kaçırma</span>
          <h2 className="section-title">İndirimli Ürünler</h2>
          <div className="section-divider" />
        </div>

        <div className={styles.scrollWrapper}>
          <button className={`${styles.scrollBtn} ${styles.left}`} onClick={() => slide('left')} aria-label="Önceki">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div className={styles.productScroll} ref={scrollRef}>
            {displayProducts.map((product, i) => (
              <div key={`${product.id}-${i}`} className={styles.productSlide}>
                <ProductCard product={product} index={i} />
              </div>
            ))}
            {displayProducts.length === 0 && (
              <div style={{ width: '100%', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                Henüz indirimli ürün bulunmuyor.
              </div>
            )}
          </div>

          <button className={`${styles.scrollBtn} ${styles.right}`} onClick={() => slide('right')} aria-label="Sonraki">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
