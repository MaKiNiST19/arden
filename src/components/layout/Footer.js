import Link from 'next/link';
import { storeInfo } from '@/data/mockData';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={`container ${styles.footerGrid}`}>
          {/* Brand Column */}
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.footerLogo}>
              <span className={styles.footerLogoText}>ARDEN</span>
              <span className={styles.footerLogoSub}>MEN WEAR</span>
            </Link>
            <p className={styles.footerDesc}>
              Premium erkek giyimde kalite ve şıklığı bir arada sunan marka.
              Ankara Etimesgut Eryaman Porto AVM'deki fiziki mağazamızda ve online platformumuzda sizi bekliyoruz.
            </p>
            <div className={styles.socialLinks}>
              <a href={storeInfo.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href={storeInfo.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={storeInfo.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l11.733 16h4.267l-11.733 -16h-4.267z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              </a>
              <a href={storeInfo.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Hızlı Erişim</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/kategori/yeni-sezon">Yeni Gelenler</Link></li>
              <li><Link href="/indirimli">İndirimler</Link></li>
              <li><Link href="/kategori/cok-satanlar">Çok Satanlar</Link></li>
              <li><Link href="/kombinlerim">Kombinlerim</Link></li>
              <li><Link href="/favoriler">Favorilerim</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Kategoriler</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/kategori/gomlek">Gömlekler</Link></li>
              <li><Link href="/kategori/pantolon">Pantolonlar</Link></li>
              <li><Link href="/kategori/mont">Dış Giyim</Link></li>
              <li><Link href="/kategori/ayakkabi">Ayakkabılar</Link></li>
              <li><Link href="/kategori/aksesuar">Aksesuarlar</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Yardım</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/hakkimizda">Hakkımızda</Link></li>
              <li><Link href="/iletisim">İletişim</Link></li>
              <li><Link href="/iade-politikasi">İade Politikası</Link></li>
              <li><Link href="/gizlilik-politikasi">Gizlilik Politikası</Link></li>
              <li><Link href="/beden-tablosu">Beden Tablosu</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>İletişim</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{storeInfo.fullAddress}</span>
              </div>
              <div className={styles.contactItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>{storeInfo.phone}</span>
              </div>
              <div className={styles.contactItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>{storeInfo.email}</span>
              </div>
              <div className={styles.contactItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{storeInfo.workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={`container ${styles.footerBottomInner}`}>
          <p>© 2026 Arden Men Wear. Tüm hakları saklıdır.</p>
          <div className={styles.paymentIcons}>
            <span>💳 Visa</span>
            <span>💳 Master</span>
            <span>💳 Troy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
