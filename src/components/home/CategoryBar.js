'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './CategoryBar.module.css';

// Suuupply assets mapped locally
const n = (dir, count) => Array.from({ length: count }, (_, i) => `/assets/category-hovers/${dir}/${i + 1}.jpg`);

const suuupplyData = [
  { name: 'T-Shirt',        illustration: '/assets/category-illustrations/tshirt.svg',       hovers: n('tshirt', 10) },
  { name: 'Gömlek',         illustration: '/assets/category-illustrations/shirt.svg',        hovers: n('shirt', 10) },
  { name: 'Triko & Kazak',  illustration: '/assets/category-illustrations/sweater.svg',      hovers: n('sweater', 10) },
  { name: 'Sweatshirt',     illustration: '/assets/category-illustrations/sweatshirt-2.svg', hovers: n('sweatshirt', 10) },
  { name: 'Pantolon',       illustration: '/assets/category-illustrations/pants.svg',        hovers: n('pants', 10) },
  { name: 'Şort',           illustration: '/assets/category-illustrations/short.svg',        hovers: n('shorts', 10) },
  { name: 'Dış Giyim',      illustration: '/assets/category-illustrations/coat.svg',         hovers: n('outerwear', 10) },
  { name: 'Ceket',          illustration: '/assets/category-illustrations/coat.svg',         hovers: n('outerwear', 10) },
  { name: 'Ayakkabı',       illustration: '/assets/category-illustrations/shoes.svg',        hovers: n('shoes', 10) },
  { name: 'Çorap',          illustration: '/assets/category-illustrations/socks.svg',        hovers: n('socks', 7) },
  { name: 'Çanta',          illustration: '/assets/category-illustrations/bag.svg',          hovers: n('bags', 10) },
  { name: 'Aksesuar',       illustration: '/assets/category-illustrations/bag.svg',          hovers: n('bags', 10) },
  { name: 'Bere',           illustration: '/assets/category-illustrations/beanie.svg',       hovers: n('beanies', 10) },
  { name: 'Şal & Atkı',     illustration: '/assets/category-illustrations/scarve.svg',       hovers: n('scarves', 9) },
  { name: 'Eldiven',        illustration: '/assets/category-illustrations/gloves.svg',       hovers: n('gloves', 3) },
  { name: 'Güneş Gözlüğü',  illustration: '/assets/category-illustrations/sunglasses.svg',   hovers: n('eyewear', 10) },
  { name: 'Diğer',          illustration: '/assets/category-illustrations/soap.svg',         hovers: n('others', 4) },
];

export default function CategoryBar() {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(0);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*');
      if (data) {
        const mapped = data.map(dbCat => {
           const match = suuupplyData.find(s => dbCat.name.includes(s.name) || s.name.includes(dbCat.name));
           return {
             ...dbCat,
             illustration: match ? match.illustration : suuupplyData[0].illustration,
             hovers: match ? match.hovers : suuupplyData[0].hovers
           };
        });
        setCategories(mapped.slice(0, 15)); 
      }
    }
    fetchCategories();
  }, []);

  // Half-second (500ms) image rotation logic
  useEffect(() => {
    let interval;
    if (hoveredId) {
      interval = setInterval(() => {
        setHoverIndex(prev => prev + 1);
      }, 500);
    } else {
      setHoverIndex(0);
    }
    return () => clearInterval(interval);
  }, [hoveredId]);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -250, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 250, behavior: 'smooth' });

  return (
    <section className={styles.categoryBar} id="category-bar">
      <div className={styles.container}>
        <div className={styles.scrollWrapper}>
          <div className={styles.headerInfo}>
             <h2 className={styles.headerTitle}>OUR PRODUCTS</h2>
             <p className={styles.headerSub}>A carefully curated collection bringing together the best of each category.</p>
          </div>

          <div className={styles.navigationBtns}>
            <button className={styles.navBtn} onClick={scrollLeft}>‹</button>
            <button className={styles.navBtn} onClick={scrollRight}>›</button>
          </div>

          <div className={styles.categoryScroll} ref={scrollRef}>
            {categories.map((cat) => {
              const isHovered = hoveredId === cat.id;
              const currentHoverImg = cat.hovers[hoverIndex % cat.hovers.length];

              return (
                <Link 
                  key={cat.id} 
                  href={`/kategori/${cat.slug}`} 
                  className={styles.categoryItem}
                  onMouseEnter={() => { setHoveredId(cat.id); setHoverIndex(0); }}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className={styles.imageContainer}>
                    <img
                      key={isHovered ? currentHoverImg : 'illustration'}
                      src={isHovered ? currentHoverImg : cat.illustration}
                      alt={cat.name}
                      className={isHovered ? styles.productImage : styles.illustrationImage}
                    />
                  </div>
                  <span className={styles.categoryName}>{cat.name.toUpperCase()}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
