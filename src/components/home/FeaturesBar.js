import { featuresData } from '@/data/mockData';
import styles from './FeaturesBar.module.css';

export default function FeaturesBar() {
  return (
    <section className={styles.featuresBar} id="features-bar">
      <div className="container">
        <div className={styles.grid}>
          {featuresData.map((feature, i) => (
            <div key={i} className={styles.feature}>
              <span className={styles.icon}>{feature.icon}</span>
              <div className={styles.content}>
                <h3 className={styles.title}>{feature.title}</h3>
                <p className={styles.desc}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
