'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useOutfit } from '@/context/OutfitContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToOutfit, isInOutfit } = useOutfit();

  const discount = product.discount || calculateDiscount(product.original_price, product.price);
  const favorited = isFavorite(product.id);
  const inOutfit = isInOutfit(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.colors?.[selectedColor]?.name || '', 'M');
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleOutfit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToOutfit(product);
  };

  return (
    <article
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Image Container */}
      <Link href={`/urun/${product.slug}`} className={styles.imageContainer}>
        <div className={styles.imageWrapper}>
          <img
            src={product.images[0]}
            alt={product.name}
            className={`${styles.image} ${styles.imagePrimary}`}
            loading="lazy"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} - 2`}
              className={`${styles.image} ${styles.imageSecondary} ${isHovered ? styles.show : ''}`}
              loading="lazy"
            />
          )}
        </div>

        {/* Badges */}
        <div className={styles.badges}>
          {product.badge === 'Yeni' && <span className={`badge badge--new ${styles.badge}`}>Yeni</span>}
          {discount > 0 && <span className={`badge badge--sale ${styles.badge}`}>%{discount}</span>}
          {product.badge === 'Çok Satan' && <span className={`badge badge--bestseller ${styles.badge}`}>Çok Satan</span>}
        </div>

        {/* Action Buttons */}
        <div className={`${styles.actions} ${isHovered ? styles.show : ''}`}>
          <button
            className={`${styles.actionBtn} ${favorited ? styles.active : ''}`}
            onClick={handleFavorite}
            aria-label="Favorilere ekle"
            title="Favorilere Ekle"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button
            className={`${styles.actionBtn} ${inOutfit ? styles.active : ''}`}
            onClick={handleOutfit}
            aria-label="Kombine ekle"
            title="Kombine Ekle"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.38 3.46L16 2 12 5.5 8 2l-4.38 1.46a2 2 0 0 0-1.34 2.23l2.1 12.6A2 2 0 0 0 6.35 20h11.3a2 2 0 0 0 1.97-1.71l2.1-12.6a2 2 0 0 0-1.34-2.23z"/>
            </svg>
          </button>
          <button
            className={styles.actionBtn}
            onClick={handleQuickAdd}
            aria-label="Sepete ekle"
            title="Hızlı Sepete Ekle"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
        </div>

        {/* Quick Add Bar (Mobile) */}
        <button className={styles.quickAddMobile} onClick={handleQuickAdd}>
          Sepete Ekle
        </button>
      </Link>

      {/* Info */}
      <div className={styles.info}>
        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className={styles.colorRow}>
            <div className={styles.colors}>
              {product.colors.slice(0, 4).map((color, i) => (
                <button
                  key={i}
                  className={`${styles.colorSwatch} ${selectedColor === i ? styles.active : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(i)}
                  aria-label={color.name}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className={styles.moreColors}>+{product.colors.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Rating & Tag */}
        <div className={styles.meta}>
          {product.badge && product.badge !== 'İndirim' && product.badge !== 'Yeni' && (
            <span className={styles.tag}>{product.badge}</span>
          )}
          <div className={styles.rating}>
            <span className={styles.ratingScore}>{product.rating}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/urun/${product.slug}`} className={styles.name}>
          {product.name}
        </Link>

        {/* Price */}
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className={styles.originalPrice}>{formatPrice(product.original_price)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
