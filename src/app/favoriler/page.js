'use client';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import styles from './favorites.module.css';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { addItem } = useCart();

  if (favorites.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>♡</div>
        <h1>Favorileriniz Boş</h1>
        <p>Beğendiğiniz ürünleri favorilere ekleyerek buradan kolayca ulaşabilirsiniz.</p>
        <Link href="/" className="btn btn--primary btn--lg">Ürünleri Keşfet</Link>
      </div>
    );
  }

  return (
    <div className={styles.favPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Favorilerim ({favorites.length})</h1>

        <div className={styles.grid}>
          {favorites.map((item) => (
            <div key={item.id} className={styles.card}>
              <Link href={`/urun/${item.slug}`} className={styles.imageWrap}>
                <img src={item.image || item.images[0]} alt={item.name} />
              </Link>
              <div className={styles.info}>
                <Link href={`/urun/${item.slug}`} className={styles.name}>{item.name}</Link>
                <div className={styles.rating}>
                  <span>★ {item.rating}</span>
                </div>
                <span className={styles.price}>{formatPrice(item.price)}</span>
                {item.originalPrice && (
                  <span className={styles.oldPrice}>{formatPrice(item.originalPrice)}</span>
                )}
              </div>
              <div className={styles.actions}>
                <button className="btn btn--primary btn--full" onClick={() => addItem({ ...item, images: [item.image] }, '', 'M')}>
                  Sepete Ekle
                </button>
                <button className={styles.removeBtn} onClick={() => removeFavorite(item.id)}>Kaldır</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
