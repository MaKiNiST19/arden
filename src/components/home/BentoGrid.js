import Link from 'next/link';
import { bentoCategories } from '@/data/mockData';
import styles from './BentoGrid.module.css';

export default function BentoGrid() {
  return (
    <section className={`section ${styles.section}`} id="bento-categories">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Koleksiyonlar</span>
          <h2 className="section-title">Kategorileri Keşfet</h2>
          <div className="section-divider" />
        </div>

        <div className={styles.grid}>
          {bentoCategories.map((cat, i) => (
            <Link
              key={cat.id}
              href={cat.link}
              className={`${styles.card} ${cat.size === 'large' ? styles.large : styles.small}`}
            >
              <img src={cat.image} alt={cat.title} className={styles.cardImage} loading="lazy" />
              <div className={styles.cardOverlay}>
                <span className={styles.cardSubtitle}>{cat.subtitle}</span>
                <h3 className={styles.cardTitle}>{cat.title}</h3>
                <span className={styles.cardCta}>
                  Keşfet
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
