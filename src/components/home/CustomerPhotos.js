import { customerPhotos } from '@/data/mockData';
import styles from './CustomerPhotos.module.css';

export default function CustomerPhotos() {
  return (
    <section className={`section ${styles.section}`} id="customer-photos">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">#ArdenMenWear</span>
          <h2 className="section-title">Sizden Gelenler</h2>
          <div className="section-divider" />
        </div>

        <div className={styles.grid}>
          {customerPhotos.map((photo) => (
            <div key={photo.id} className={styles.photoCard}>
              <img src={photo.image} alt={photo.username} className={styles.photo} loading="lazy" />
              <div className={styles.photoOverlay}>
                <span className={styles.username}>{photo.username}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
