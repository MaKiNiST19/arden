'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useOutfit } from '@/context/OutfitContext';
import { products, sizeChart } from '@/data/mockData';
import { formatPrice, getWhatsAppUrl, getStars } from '@/lib/utils';
import styles from './product.module.css';

export default function ProductPage() {
  const params = useParams();
  const product = products.find(p => p.slug === params.slug);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToOutfit, isInOutfit } = useOutfit();

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Ürün Bulunamadı</h1>
        <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link href="/" className="btn btn--primary">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const favorited = isFavorite(product.id);
  const inOutfit = isInOutfit(product.id);
  const stars = getStars(product.rating);
  const discount = product.discount || 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Lütfen beden seçiniz.');
      return;
    }
    addItem(product, product.colors[selectedColor]?.name || '', selectedSize, quantity);
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className={styles.productPage}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="breadcrumb">
        <div className="container">
          <ol className={styles.breadcrumbList}>
            <li><Link href="/">Ana Sayfa</Link></li>
            <li><Link href={`/kategori/${product.category}`}>{product.category}</Link></li>
            <li className={styles.breadcrumbActive}>{product.name}</li>
          </ol>
        </div>
      </nav>

      <div className="container">
        <div className={styles.productLayout}>
          {/* Left: Gallery */}
          <div className={styles.gallery}>
            <div className={styles.galleryGrid}>
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className={`${styles.galleryItem} ${activeImage === i ? styles.activeGallery : ''}`}
                  onClick={() => setActiveImage(i)}
                >
                  {i === 1 && product.video ? (
                    <video
                      src={product.video}
                      className={styles.galleryMedia}
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <img
                      src={img}
                      alt={`${product.name} - ${i + 1}`}
                      className={styles.galleryMedia}
                      loading={i < 2 ? 'eager' : 'lazy'}
                    />
                  )}
                  {i === 0 && discount > 0 && (
                    <span className={`badge badge--sale ${styles.galleryBadge}`}>%{discount}</span>
                  )}
                  {i === 0 && product.isNew && (
                    <span className={`badge badge--new ${styles.galleryBadge}`}>Yeni</span>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Gallery Slider */}
            <div className={styles.mobileGallery}>
              <div className={styles.mobileGalleryScroll}>
                {product.images.map((img, i) => (
                  <div key={i} className={styles.mobileGallerySlide}>
                    <img src={img} alt={`${product.name} - ${i + 1}`} className={styles.galleryMedia} />
                  </div>
                ))}
              </div>
              <div className={styles.mobileGalleryDots}>
                {product.images.map((_, i) => (
                  <span key={i} className={`${styles.dot} ${activeImage === i ? styles.activeDot : ''}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Info (Sticky) */}
          <div className={styles.productInfo}>
            <div className={styles.productInfoSticky}>
              {/* Badges */}
              <div className={styles.infoBadges}>
                {product.isNew && <span className="badge badge--new">Yeni Sezon</span>}
                {product.isBestseller && <span className="badge badge--bestseller">Çok Satan</span>}
              </div>

              {/* Title */}
              <h1 className={styles.productName}>{product.name}</h1>

              {/* Rating */}
              <div className={styles.ratingRow}>
                <div className="star-rating">
                  {stars.map((star, i) => (
                    <span key={i} className={`star ${star === 'empty' ? 'empty' : ''}`}>★</span>
                  ))}
                </div>
                <span className={styles.ratingText}>{product.rating} ({product.reviewCount} değerlendirme)</span>
              </div>

              {/* Price */}
              <div className={styles.priceBlock}>
                <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className={styles.oldPrice}>{formatPrice(product.originalPrice)}</span>
                    <span className={styles.discountTag}>%{discount} İndirim</span>
                  </>
                )}
              </div>

              {/* Color Selection */}
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>
                  Renk: <strong>{product.colors[selectedColor]?.name}</strong>
                </label>
                <div className={styles.colorSwatches}>
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      className={`${styles.colorBtn} ${selectedColor === i ? styles.activeColor : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(i)}
                      aria-label={color.name}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className={styles.optionGroup}>
                <div className={styles.sizeHeader}>
                  <label className={styles.optionLabel}>
                    Beden: {selectedSize && <strong>{selectedSize}</strong>}
                  </label>
                  <button className={styles.sizeChartBtn} onClick={() => setShowSizeChart(!showSizeChart)}>
                    📐 Beden Tablosu
                  </button>
                </div>
                <div className={styles.sizeGrid}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Chart Modal */}
              {showSizeChart && (
                <div className={styles.sizeChartPanel}>
                  <div className={styles.sizeChartHeader}>
                    <h3>Beden Tablosu</h3>
                    <button onClick={() => setShowSizeChart(false)}>✕</button>
                  </div>
                  <div className={styles.sizeChartTable}>
                    <table>
                      <thead>
                        <tr>
                          {sizeChart.headers.map((h, i) => <th key={i}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {sizeChart.rows.map((row, i) => (
                          <tr key={i} className={selectedSize === row[0] ? styles.highlightedRow : ''}>
                            {row.map((cell, j) => <td key={j}>{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>Adet</label>
                <div className={styles.quantityControl}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.qtyBtn}>−</button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className={styles.qtyBtn}>+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button className="btn btn--primary btn--full btn--lg" onClick={handleAddToCart} id="add-to-cart-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  Sepete Ekle
                </button>

                <a
                  href={getWhatsAppUrl(product, product.colors[selectedColor]?.name, selectedSize)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--whatsapp btn--full btn--lg"
                  id="whatsapp-order-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp ile Sipariş
                </a>

                <div className={styles.secondaryActions}>
                  <button
                    className={`btn btn--icon ${favorited ? 'active' : ''}`}
                    onClick={() => toggleFavorite(product)}
                    aria-label="Favorilere ekle"
                    title="Favorilere Ekle"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  <button
                    className={`btn btn--icon ${inOutfit ? 'active' : ''}`}
                    onClick={() => addToOutfit(product)}
                    aria-label="Kombine ekle"
                    title="Kombine Ekle"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.38 3.46L16 2 12 5.5 8 2l-4.38 1.46a2 2 0 0 0-1.34 2.23l2.1 12.6A2 2 0 0 0 6.35 20h11.3a2 2 0 0 0 1.97-1.71l2.1-12.6a2 2 0 0 0-1.34-2.23z"/>
                    </svg>
                  </button>
                  <button className="btn btn--icon" aria-label="Paylaş" title="Paylaş" onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Product Details Tabs */}
              <div className={styles.tabs}>
                <div className={styles.tabHeaders}>
                  {['details', 'features', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === 'details' ? 'Açıklama' : tab === 'features' ? 'Özellikler' : `Değerlendirmeler (${product.reviewCount})`}
                    </button>
                  ))}
                </div>
                <div className={styles.tabContent}>
                  {activeTab === 'details' && (
                    <div className={styles.tabPanel}>
                      <p>{product.description}</p>
                    </div>
                  )}
                  {activeTab === 'features' && (
                    <div className={styles.tabPanel}>
                      <ul className={styles.featureList}>
                        {product.features.map((f, i) => (
                          <li key={i}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activeTab === 'reviews' && (
                    <div className={styles.tabPanel}>
                      <div className={styles.reviewSummary}>
                        <div className={styles.reviewScore}>
                          <span className={styles.reviewBig}>{product.rating}</span>
                          <span className={styles.reviewStars}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                          <span className={styles.reviewCount}>{product.reviewCount} değerlendirme</span>
                        </div>
                      </div>
                      <p className={styles.reviewPlaceholder}>Değerlendirmeler yakında eklenecek.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
