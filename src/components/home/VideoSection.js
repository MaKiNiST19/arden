import Link from 'next/link';
import styles from './VideoSection.module.css';

export default function VideoSection() {
  return (
    <section className={`section ${styles.section}`} id="video-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Lookbook</span>
          <h2 className="section-title">Stil İlhamı</h2>
          <div className="section-divider" />
        </div>

        <div className={styles.grid}>
          <div className={styles.videoCard}>
            <div className={styles.videoWrapper}>
              <div className={styles.videoPlaceholder}>
                <div className={styles.playBtn}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                <div className={styles.videoOverlay}>
                  <h3>Yeni Sezon Lookbook</h3>
                  <p>İlkbahar / Yaz 2026 Koleksiyonu</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.videoCard}>
            <div className={styles.videoWrapper}>
              <div className={styles.videoPlaceholder}>
                <div className={styles.playBtn}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                <div className={styles.videoOverlay}>
                  <h3>Kombin Rehberi</h3>
                  <p>Erkek Giyim Kombinleme İpuçları</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
