'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOutfit } from '@/context/OutfitContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Download, Camera, ShoppingBag, Trash2 } from 'lucide-react';
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

  const [aiProgress, setAiProgress] = useState('');

  // Yardımcı fonksiyon: Tahmin durumunu sorgula
  const pollPrediction = async (predictionId, stepLabel) => {
    let attempts = 0;
    const maxAttempts = 40; // Yaklaşık 2-3 dakika
    
    while (attempts < maxAttempts) {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId })
      });
      
      const data = await res.json();
      
      if (data.status === 'succeeded') {
        return data.imageUrl;
      }
      
      if (data.status === 'failed' || data.status === 'canceled') {
        throw new Error(data.error || "Yapay zeka işlemi başarısız oldu.");
      }
      
      // Duruma göre mesaj güncelle
      const statusMap = {
        'starting': 'Başlatılıyor...',
        'processing': 'İşleniyor...',
        'queued': 'Sırada bekliyor...'
      };
      setAiProgress(`${stepLabel}: ${statusMap[data.status] || 'Hazırlanıyor...'}`);
      
      // 3 saniye bekle
      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
    }
    
    throw new Error("İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.");
  };

  const handleTryOn = async () => {
    const { ust, alt } = activeOutfit;
    if (!ust && !alt) {
        return alert("Lütfen sanal giydirme için en az bir Üst veya Alt seçin.");
    }
    
    setIsGeneratingAI(true);
    setAiImageUrl(null);
    setAiProgress('Hazırlanıyor...');

    try {
      let currentResultImageUrl = null;

      // 1. Üst Giyim
      if (ust) {
        setAiProgress('1/2: Üst giyim başlatılıyor...');
        const res = await fetch('/api/try-on', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            garmentImage: ust.image,
            category: 'ust',
            modelImage: null
          })
        });
        
        const data = await res.json();
        if (data.success && data.predictionId) {
          currentResultImageUrl = await pollPrediction(data.predictionId, '1/2: Üst Giyim');
        } else {
          throw new Error(data.error || "Üst giyim başlatılamadı.");
        }
      }

      // 2. Alt Giyim
      if (alt) {
        const stepLabel = ust ? '2/2: Alt Giyim' : '1/1: Alt Giyim';
        setAiProgress(`${stepLabel} başlatılıyor...`);
        const res = await fetch('/api/try-on', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            garmentImage: alt.image,
            category: 'alt',
            modelImage: currentResultImageUrl
          })
        });
        
        const data = await res.json();
        if (data.success && data.predictionId) {
          currentResultImageUrl = await pollPrediction(data.predictionId, stepLabel);
        } else {
          throw new Error(data.error || "Alt giyim başlatılamadı.");
        }
      }

      if (currentResultImageUrl) {
        setAiImageUrl(currentResultImageUrl);
      }
      
    } catch (e) {
      console.error("AI Polling Hatası:", e);
      alert("İşlem Sırasında Hata:\n\n" + e.message);
    } finally {
      setIsGeneratingAI(false);
      setAiProgress('');
    }
  };

  const handleSaveAsImage = async () => {
    // Create a canvas to draw the outfit summary
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1350; // Instagram story/portrait size

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#c9a96e';
    ctx.font = 'bold 48px serif';
    ctx.fillText('ARDEN MEN WEAR', 60, 100);
    ctx.font = '24px sans-serif';
    ctx.fillText('Premium Sanal Kombin', 60, 140);

    // Filter active items
    const items = Object.values(activeOutfit).filter(Boolean);
    
    // Draw mannequin or AI image if exists
    try {
      const displayUrl = aiImageUrl || DEFAULT_MODEL_IMAGE;
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = displayUrl;
      });

      // Maintain aspect ratio to fit in a box
      const maxWidth = 960;
      const maxHeight = 800;
      let w = img.width;
      let h = img.height;
      const ratio = Math.min(maxWidth / w, maxHeight / h);
      w *= ratio;
      h *= ratio;

      ctx.drawImage(img, (canvas.width - w) / 2, 200, w, h);
    } catch (e) {
      console.error("Görsel çizilemedi:", e);
      ctx.fillStyle = '#333';
      ctx.fillRect(100, 200, 880, 800);
      ctx.fillStyle = '#fff';
      ctx.fillText('Görsel Yüklenemedi', 400, 600);
    }

    // List products at bottom
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('Kombin Detayları:', 60, 1100);
    
    items.forEach((item, index) => {
      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#aaa';
      ctx.fillText(`• ${item.name}`, 80, 1150 + (index * 40));
      ctx.fillStyle = '#c9a96e';
      const priceText = formatPrice(item.price);
      ctx.fillText(priceText, 800, 1150 + (index * 40));
    });

    // Total
    ctx.strokeStyle = '#c9a96e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 1310);
    ctx.lineTo(1020, 1310);
    ctx.stroke();
    
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('Toplam:', 60, 1280);
    ctx.fillStyle = '#c9a96e';
    ctx.fillText(formatPrice(totalPrice), 800, 1280);

    // Download
    const link = document.createElement('a');
    link.download = `arden-kombin-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
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
                  <p>{aiProgress}<br/>(Lütfen bekleyin...)</p>
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
                  <ShoppingBag size={20} style={{marginRight: '8px'}} /> Kombini Sepete Ekle
                </button>
                <button 
                  className="btn btn--outline btn--full btn--lg" 
                  onClick={handleSaveAsImage}
                  style={{marginTop: '10px', borderColor: 'rgba(255,255,255,0.2)'}}
                >
                  <Camera size={20} style={{marginRight: '8px'}} /> Kombini Fotoğraf Olarak Kaydet
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
                        <button className={styles.cardRemove} onClick={() => removeFromOutfit(item.id)}>
                          <Trash2 size={16} />
                        </button>
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

