import { seoContent } from '@/data/mockData';
import styles from './SeoText.module.css';

export default function SeoText() {
  return (
    <section className={`section ${styles.section}`} id="seo-content">
      <div className="container">
        <div className={styles.content}>
          <h2 className={styles.title}>{seoContent.title}</h2>
          <div className={styles.text}>
            {seoContent.text.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
