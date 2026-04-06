'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import styles from './cart.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛒</div>
        <h1>Sepetiniz Boş</h1>
        <p>Henüz sepetinize ürün eklemediniz.</p>
        <Link href="/" className="btn btn--primary btn--lg">Alışverişe Başla</Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Sepetim ({totalItems} Ürün)</h1>

        <div className={styles.layout}>
          <div className={styles.cartItems}>
            {items.map((item, i) => (
              <div key={`${item.id}-${item.color}-${item.size}`} className={styles.cartItem}>
                <Link href={`/urun/${item.slug}`} className={styles.itemImage}>
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className={styles.itemInfo}>
                  <Link href={`/urun/${item.slug}`} className={styles.itemName}>{item.name}</Link>
                  <div className={styles.itemMeta}>
                    {item.color && <span>Renk: {item.color}</span>}
                    {item.size && <span>Beden: {item.size}</span>}
                  </div>
                  <div className={styles.itemBottom}>
                    <div className={styles.quantityControl}>
                      <button onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}>+</button>
                    </div>
                    <div className={styles.itemPrice}>
                      <span className={styles.priceMain}>{formatPrice(item.price * item.quantity)}</span>
                      {item.quantity > 1 && <span className={styles.priceUnit}>{formatPrice(item.price)} / adet</span>}
                    </div>
                  </div>
                </div>
                <button className={styles.removeBtn} onClick={() => removeItem(item.id, item.color, item.size)} aria-label="Ürünü kaldır">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Sipariş Özeti</h2>
              <div className={styles.summaryRow}>
                <span>Ara Toplam</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Kargo</span>
                <span className={styles.freeShipping}>{totalPrice >= 500 ? 'Ücretsiz' : formatPrice(49)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Toplam</span>
                <span>{formatPrice(totalPrice >= 500 ? totalPrice : totalPrice + 49)}</span>
              </div>
              <button className="btn btn--primary btn--full btn--lg" style={{ marginTop: 'var(--space-4)' }}>
                Ödemeye Geç
              </button>
              <a
                href={`https://wa.me/905000000000?text=${encodeURIComponent(`Sipariş vermek istiyorum:\n${items.map(i => `- ${i.name} (${i.color}, ${i.size}) x${i.quantity}`).join('\n')}\n\nToplam: ${formatPrice(totalPrice)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp btn--full"
                style={{ marginTop: 'var(--space-2)' }}
              >
                WhatsApp ile Sipariş
              </a>
              <button className={styles.clearBtn} onClick={clearCart}>Sepeti Temizle</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
