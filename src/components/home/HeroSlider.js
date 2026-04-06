'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { heroSlides } from '@/data/mockData';
import styles from './HeroSlider.module.css';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className={styles.hero} id="hero-slider">
      {/* Background layers */}
      <div className={styles.bgLayers}>
        {heroSlides.map((s, i) => (
          <div
            key={s.id}
            className={`${styles.bgLayer} ${i === current ? styles.active : ''}`}
            style={{ backgroundColor: s.bgColor }}
          >
            {s.image && (
              <>
                <img src={s.image} alt={s.title} className={styles.heroImage} />
                <div className={styles.gradientOverlay} />
              </>
            )}
            <div className={styles.bgPattern} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.heroTextBlock}>
          <span className={styles.subtitle} key={`sub-${current}`}>
            {slide.subtitle}
          </span>
          <h1 className={styles.title} key={`title-${current}`}>
            {slide.title}
          </h1>
          <p className={styles.description} key={`desc-${current}`}>
            {slide.description}
          </p>
          <div className={styles.ctaGroup}>
            <Link href={slide.ctaLink} className={`btn btn--primary btn--lg ${styles.ctaBtn}`}>
              {slide.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link href="/kategori/yeni-sezon" className={`btn btn--secondary btn--lg`}>
              Yeni Gelenler
            </Link>
          </div>
        </div>


      </div>

      {/* Slide indicators */}
      <div className={styles.indicators}>
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`${styles.indicator} ${i === current ? styles.active : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          >
            <span className={styles.indicatorFill} />
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className={styles.counter}>
        <span className={styles.counterCurrent}>{String(current + 1).padStart(2, '0')}</span>
        <span className={styles.counterDivider}>/</span>
        <span className={styles.counterTotal}>{String(heroSlides.length).padStart(2, '0')}</span>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollDown}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
      </div>
    </section>
  );
}
