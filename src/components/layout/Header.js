'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useOutfit } from '@/context/OutfitContext';
import { megaMenuData, categories } from '@/data/mockData';
import styles from './Header.module.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const megaRef = useRef(null);
  const { totalItems: cartCount } = useCart();
  const { favorites } = useFavorites();
  const { outfitItems } = useOutfit();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setActiveMega(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = Object.keys(megaMenuData);

  const announcements = [
    "✦ Ücretsiz Kargo 500₺ Üzeri Siparişlerde ✦",
    "✦ Fiziki Mağaza: Eryaman Porto AVM ✦",
    "✦ Yeni Sezon Ürünleri Geldi ✦",
    "✦ 14 Gün İade Garantisi ✦"
  ];
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <>

      {/* Announcement Bar */}
      <div className={styles.announcementBar}>
        <div className={styles.announcementInner}>
          {announcements.map((text, i) => (
            <span 
              key={i} 
              className={`${styles.announcementItem} ${i === activeAnnouncement ? styles.active : ''}`}
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`} ref={megaRef}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            {/* Mobile Menu Toggle */}
            <button
              className={styles.menuToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menü"
              id="mobile-menu-toggle"
            >
              <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.active : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>

            {/* Logo */}
            <Link href="/" className={styles.logo} id="header-logo">
              <div className={styles.logoWrapper}>
                <img src="/assets/logo/logo.png" alt="Arden Men Wear" className={styles.logoImg} />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.desktopNav}>
              {navLinks.map((link) => (
                <button
                  key={link}
                  className={`${styles.navLink} ${activeMega === link ? styles.active : ''}`}
                  onMouseEnter={() => setActiveMega(link)}
                  onClick={() => setActiveMega(activeMega === link ? null : link)}
                >
                  {link}
                  <svg className={styles.navArrow} width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
              <Link href="/kategori/indirimli" className={`${styles.navLink} ${styles.saleLink}`}>
                İndirimler
              </Link>
            </nav>
          </div>

          {/* Right Icons */}
          <div className={styles.headerActions}>
            <Link href="/kombinlerim" className={`${styles.navLink} ${styles.desktopOnly}`}>
              Kombinlerim
            </Link>
            {/* Search */}
            <button
              className={styles.iconBtn}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Ara"
              id="header-search-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Favorites */}
            <Link href="/favoriler" className={styles.iconBtn} aria-label="Favoriler" id="header-favorites-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {favorites.length > 0 && <span className={styles.badge}>{favorites.length}</span>}
            </Link>

            {/* Outfit */}
            <Link href="/kombinlerim" className={`${styles.iconBtn} ${styles.outfitBtn}`} aria-label="Kombinlerim" id="header-outfit-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46L16 2 12 5.5 8 2l-4.38 1.46a2 2 0 0 0-1.34 2.23l2.1 12.6A2 2 0 0 0 6.35 20h11.3a2 2 0 0 0 1.97-1.71l2.1-12.6a2 2 0 0 0-1.34-2.23z"/>
                <path d="M12 5.5V16"/>
              </svg>
              {outfitItems.length > 0 && <span className={styles.badge}>{outfitItems.length}</span>}
            </Link>

            {/* Cart */}
            <Link href="/sepet" className={styles.iconBtn} aria-label="Sepet" id="header-cart-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </Link>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {activeMega && megaMenuData[activeMega] && (
          <div className={styles.megaMenu} onMouseLeave={() => setActiveMega(null)}>
            <div className={styles.megaMenuInner}>
              <div className={styles.megaMenuContent}>
                {megaMenuData[activeMega].subcategories.map((sub, idx) => (
                  <div key={idx} className={styles.megaMenuColumn}>
                    <h3 className={styles.megaMenuTitle}>{sub.title}</h3>
                    <ul className={styles.megaMenuList}>
                      {sub.items.map((item, i) => (
                        <li key={i}>
                          <Link href={`/kategori/${getCategorySlug(item)}`} className={styles.megaMenuItem} onClick={() => { setActiveMega(null); setIsMobileMenuOpen(false); }}>
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {megaMenuData[activeMega].featured && (
                <div className={styles.megaMenuFeatured}>
                  <div className={styles.megaMenuFeaturedBox}>
                    <div className={styles.megaMenuFeaturedOverlay}>
                      <span className={styles.megaMenuFeaturedLabel}>{megaMenuData[activeMega].featured.title}</span>
                      <Link href="/kategori/yeni-sezon" className={styles.megaMenuFeaturedLink} onClick={() => { setActiveMega(null); setIsMobileMenuOpen(false); }}>
                        Keşfet →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Bar */}
        {isSearchOpen && (
          <div className={styles.searchBar}>
            <div className={styles.searchBarInner}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Ürün, kategori veya marka ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                autoFocus
                id="search-input"
              />
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className={styles.searchClose} aria-label="Kapat">
                ✕
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.open : ''}`} onClick={() => setIsMobileMenuOpen(false)} />

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <div className={styles.mobileLogoWrapper}>
            <img src="/assets/logo/logo.png" alt="Arden Logo" className={styles.mobileLogoImg} />
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileMenuClose} aria-label="Kapat">
            ✕
          </button>
        </div>

        <div className={styles.mobileMenuBody}>
          {/* Mobile Search */}
          <div className={styles.mobileSearch}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Ara..." className={styles.mobileSearchInput} />
          </div>

          {/* Mobile Nav Links */}
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <MobileAccordion key={link} title={link} data={megaMenuData[link]} onClose={() => setIsMobileMenuOpen(false)} />
            ))}
            <Link href="/indirimli" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
              <span className={styles.saleTag}>🔥 İndirimler</span>
            </Link>
            <Link href="/kombinlerim" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
              ✂️ Kombinlerim
            </Link>
          </nav>

          {/* Mobile Menu Footer */}
          <div className={styles.mobileMenuFooter}>
            <Link href="/favoriler" className={styles.mobileFooterLink} onClick={() => setIsMobileMenuOpen(false)}>
              ♡ Favorilerim ({favorites.length})
            </Link>
            <Link href="/sepet" className={styles.mobileFooterLink} onClick={() => setIsMobileMenuOpen(false)}>
              🛒 Sepetim ({cartCount})
            </Link>
            <a href="https://wa.me/905000000000" className={`${styles.mobileFooterLink} ${styles.whatsappLink}`} target="_blank" rel="noopener">
              💬 WhatsApp ile İletişim
            </a>
            <div className={styles.mobileStoreInfo}>
              <p>📍 Eryaman Porto AVM, Etimesgut/Ankara</p>
              <p>📞 +90 312 000 00 00</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper function - outside Header scope
const getCategorySlug = (name) => {
  const cat = categories.find(c => c.name === name);
  return cat ? cat.slug : name.toLowerCase().replace(/\s/g, '-').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g');
};

// Mobile Menu Accordion Component
function MobileAccordion({ title, data, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.mobileAccordion}>
      <button className={styles.mobileAccordionTrigger} onClick={() => setIsOpen(!isOpen)}>
        {title}
        <svg className={`${styles.mobileAccordionArrow} ${isOpen ? styles.rotated : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {isOpen && (
        <div className={styles.mobileAccordionContent}>
          {data.subcategories.map((sub, idx) => (
            <div key={idx} className={styles.mobileSubCategory}>
              <span className={styles.mobileSubTitle}>{sub.title}</span>
              {sub.items.map((item, i) => (
                <Link key={i} href={`/kategori/${getCategorySlug(item)}`} className={styles.mobileSubLink} onClick={onClose}>
                  {item}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
