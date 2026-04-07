'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOutfit } from '@/context/OutfitContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import styles from './outfit.module.css';

export default function OutfitPage() {
  const { outfitItems, removeFromOutfit } = useOutfit();
  const { addItem } = useCart();
  
  // State for the active items being "worn" in the slots
  const [activeOutfit, setActiveOutfit] = useState({
    ust: null,
    alt: null,
    ayakkabi: null,
    aksesuar: null
  });
  const [aiImageUrl, setAiImageUrl] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Automatically select the first item of each category on load
  useEffect(() => {
    if (outfitItems.length > 0) {
      const newActive = { ...activeOutfit };
      outfitItems.forEach(item => {
        const cat = item.category || 'ust';
        if (!newActive[cat]) {
          newActive[cat] = item;
        }
      });
      setActiveOutfit(newActive);
    }
  }, [outfitItems]);

  const hasItems = outfitItems.length > 0;

  if (!hasItems) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>✂️</div>
        <h1>Kendi Kombinini Oluştur</h1>
        <p>Premium parçaları seç, kendi stilini oluştur ve paylaş.</p>
        <Link href="/" className="btn btn--primary btn--lg">Stilini Bul</Link>
      </div>
    );
  }

  const wearItem = (item) => {
    const cat = item.category || 'ust';
    setActiveOutfit(prev => ({
      ...prev,
      [cat]: item
    }));
    // Eğer yeni bir şey seçilirse AI sonucunu temizleyelim ki eski foto kalmasın
    setAiImageUrl(null);
  };

  const buyOutfit = () => {
    Object.values(activeOutfit).forEach(item => {
      if (item) {
        addItem({ ...item, images: [item.image || item.images[0]] }, item.color || '', 'M');
      }
    });
  };

  const handleTryOn = async () => {
    const garmentToTry = activeOutfit.ust || activeOutfit.alt;
    if (!garmentToTry) {
        return alert("Lütfen sanal giydirme için bir Üst veya Alt seçin.");
    }
    
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentImage: garmentToTry.image,
          category: garmentToTry.category || 'ust',
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setAiImageUrl(data.imageUrl);
      } else {
        alert("AI Yapılandırma Hatası: Lütfen API anahtarınızın doğru olduğundan emin olun. Detay: " + (data.details || data.error));
      }
    } catch (e) {
      alert("Sunucuya ulaşılamadı.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const totalPrice = Object.values(activeOutfit).reduce((sum, item) => sum + (item ? item.price : 0), 0);

  return (
    <div className={styles.outfitPage}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Sanal Giyinme Odası</h1>
          <p className={styles.subtitle}>Yapay Zeka (IDM-VTON) ile seçtiğiniz parçaların gerçek bir model üzerinde nasıl durduğunu anında görün.</p>
        </header>

        <div className={styles.layout}>
          {/* Main Showcase (Left) - Live Mannequin */}
          <div className={styles.showcase}>
            <div className={styles.mannequinStage}>
              {isGeneratingAI && (
                <div className={styles.aiLoading}>
                  <div className={styles.loader}></div>
                  <p>Yapay Zeka Modeli Giydiriyor...<br/>(Lütfen 15-30 sn bekleyin)</p>
                </div>
              )}

              {aiImageUrl && !isGeneratingAI ? (
                // Display the actual AI generated Try-On image
                <img src={aiImageUrl} alt="AI Virtual Try On" className={styles.aiResultImage} />
              ) : (
                // Standart Silhouette and Absolute Slots
                <>
                  <svg className={styles.mannequinSvg} viewBox="0 0 200 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{opacity: isGeneratingAI ? 0.1 : 1}}>
                    <g opacity="0.3">
                      {/* Head & Neck */}
                      <path d="M100 20 C115 20 120 35 120 50 C120 70 108 80 100 85 C92 80 80 70 80 50 C80 35 85 20 100 20 Z" stroke="var(--color-accent)" strokeWidth="2"/>
                      {/* Torso */}
                      <path d="M100 85 C140 85 150 110 155 130 C160 150 160 280 160 280 L135 280 C135 280 130 190 125 190 C125 190 120 300 120 320 L80 320 C80 300 75 190 75 190 C70 190 65 280 65 280 L40 280 C40 280 40 150 45 130 C50 110 60 85 100 85 Z" fill="rgba(201,169,110,0.05)" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="5 5"/>
                      {/* Legs */}
                      <path d="M80 320 L120 320 C120 320 125 500 135 550 L110 550 L100 450 L90 550 L65 550 C75 500 80 320 80 320 Z" fill="rgba(201,169,110,0.05)" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="5 5"/>
                      {/* Feet */}
                      <path d="M65 550 C55 560 50 580 50 590 L90 590 L90 550 L65 550 Z" stroke="var(--color-accent)" strokeWidth="2"/>
                      <path d="M135 550 C145 560 150 580 150 590 L110 590 L110 550 L135 550 Z" stroke="var(--color-accent)" strokeWidth="2"/>
                    </g>
                  </svg>

                  {/* Clothing Slots */}
                  {['ust', 'alt', 'ayakkabi', 'aksesuar'].map(cat => (
                    <div key={cat} className={`${styles.mannequinSlot} ${styles[`slot_${cat}`]}`} style={{display: isGeneratingAI ? 'none' : 'flex'}}>
                      {activeOutfit[cat] ? (
                        <div className={styles.itemPreview}>
                          <img src={activeOutfit[cat].image} alt={activeOutfit[cat].name} />
                          <button className={styles.removeBtn} onClick={() => setActiveOutfit(prev => ({ ...prev, [cat]: null }))}>×</button>
                        </div>
                      ) : (
                        <div className={styles.slotEmpty}>
                          <span className={styles.slotPlus}>+</span>
                          <span className={styles.slotLabel}>
                            {cat === 'ust' ? 'Üst' : cat === 'alt' ? 'Alt' : cat === 'ayakkabi' ? 'Ayakkabı' : 'Aksesuar'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
            
            <div className={styles.summary}>
              <div className={styles.totalBlock}>
                <span>Kombin Toplamı:</span>
                <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
              </div>
              <div className={styles.summaryActions}>
                <button 
                  className={`btn btn--secondary btn--full btn--lg ${styles.aiBtn}`} 
                  onClick={handleTryOn}
                  disabled={isGeneratingAI || (!activeOutfit.ust && !activeOutfit.alt)}
                  style={{marginBottom: '10px'}}
                >
                  {isGeneratingAI ? '✨ Hazırlanıyor...' : '✨ Üzerimde Nasıl Durur?'}
                </button>
                <button 
                  className="btn btn--primary btn--full btn--lg" 
                  onClick={buyOutfit}
                  disabled={!activeOutfit.ust && !activeOutfit.alt && !activeOutfit.ayakkabi}
                >
                  Kombini Sepete Ekle
                </button>
              </div>
            </div>
          </div>

          {/* Pool of Available Items (Right) */}
          <div className={styles.itemList}>
            <h2 className={styles.listTitle}>Parçalarım ({outfitItems.length})</h2>
            <div className={styles.itemGrid}>
              {outfitItems.map(item => {
                const isActive = Object.values(activeOutfit).some(active => active?.id === item.id);
                return (
                  <div key={item.id} className={`${styles.card} ${isActive ? styles.activeCard : ''}`}>
                    <img src={item.image} alt={item.name} className={styles.cardImg} />
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardName}>{item.name}</h3>
                      <p className={styles.cardPrice}>{formatPrice(item.price)}</p>
                      <div className={styles.cardActions}>
                        <button 
                          className={`${styles.wearBtn} ${isActive ? styles.wearing : ''}`}
                          onClick={() => wearItem(item)}
                        >
                          {isActive ? 'Kombinde ✓' : 'Kombine Ekle +'}
                        </button>
                        <button className={styles.cardRemove} onClick={() => removeFromOutfit(item.id)}>Kaldır</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

