import Link from 'next/link';
import styles from './OutfitCTA.module.css';

export default function OutfitCTA() {
  return (
    <section className={`section ${styles.section}`} id="outfit-cta">
      <div className="container">
        <div className={styles.ctaCard}>
          <div className={styles.bgDecor}>
            <div className={styles.circle1} />
            <div className={styles.circle2} />
          </div>
          <div className={styles.content}>
            <span className={styles.label}>Yeni Özellik</span>
            <h2 className={styles.title}>Kombinini Yap</h2>
            <p className={styles.desc}>
              Ürünleri seç, kombinle ve kendi tarzını oluştur. 
              Üst, alt ve ayakkabını bir araya getir, hayalindeki kombini keşfet!
            </p>
            <Link href="/kombinlerim" className="btn btn--primary btn--lg">
              Kombin Oluştur
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
          <div className={styles.visual}>
            <div className={styles.mannequin}>
              <div className={styles.mannequinSlot}>
                <span>ÜST</span>
              </div>
              <div className={styles.mannequinSlot}>
                <span>ALT</span>
              </div>
              <div className={styles.mannequinSlot}>
                <span>AYAKKABI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
