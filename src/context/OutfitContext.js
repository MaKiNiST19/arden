'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const OutfitContext = createContext();

// Kategori slug veya adından manken slot'unu belirle
export function getSlotFromCategory(item) {
  if (!item) return 'ust';
  const name = (item.name || '').toLowerCase();
  const cat = (item.category || item.productType || '').toLowerCase();
  
  if ([cat, name].some(c => ['pantolon', 'şort', 'sort', 'alt-giyim', 'alt giyim', 'jean', 'esofman-alti', 'pijama alt'].some(k => c.includes(k)))) return 'alt';
  if ([cat, name].some(c => ['ayakkabi', 'ayakkabı', 'bot', 'sneaker', 'terlik', 'sandalet'].some(k => c.includes(k)))) return 'ayakkabi';
  if ([cat, name].some(c => ['aksesuar', 'taki', 'saat', 'gozluk', 'şapka', 'sapka', 'kemer', 'çanta', 'canta', 'bileklik', 'kolye'].some(k => c.includes(k)))) return 'aksesuar';
  return 'ust';
}

export function OutfitProvider({ children }) {
  const [outfitItems, setOutfitItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('arden_outfit_items');
    const savedList = localStorage.getItem('arden_saved_outfits');
    if (saved) { 
      try { 
        const items = JSON.parse(saved);
        // Eski kayıtları yeni kategori mantığına göre güncelle
        const updatedItems = items.map(item => ({
          ...item,
          category: getSlotFromCategory(item)
        }));
        setOutfitItems(updatedItems); 
      } catch {} 
    }
    if (savedList) { try { setSavedOutfits(JSON.parse(savedList)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem('arden_outfit_items', JSON.stringify(outfitItems));
  }, [outfitItems]);

  useEffect(() => {
    localStorage.setItem('arden_saved_outfits', JSON.stringify(savedOutfits));
  }, [savedOutfits]);

  const addToOutfit = useCallback((product) => {
    setOutfitItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev;
      return [...prev, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images ? product.images[0] : product.image,
        category: getSlotFromCategory(product),
        color: product.colors?.[0]?.name || '',
      }];
    });
  }, []);

  const removeFromOutfit = useCallback((productId) => {
    setOutfitItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const isInOutfit = useCallback((productId) => {
    return outfitItems.some(item => item.id === productId);
  }, [outfitItems]);

  const saveOutfit = useCallback((name) => {
    const outfit = {
      id: Date.now(),
      name: name || `Kombin ${savedOutfits.length + 1}`,
      items: [...outfitItems],
      createdAt: new Date().toISOString(),
    };
    setSavedOutfits(prev => [...prev, outfit]);
    setOutfitItems([]);
  }, [outfitItems, savedOutfits]);

  const deleteOutfit = useCallback((outfitId) => {
    setSavedOutfits(prev => prev.filter(o => o.id !== outfitId));
  }, []);

  const clearOutfit = useCallback(() => setOutfitItems([]), []);

  const totalPrice = outfitItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <OutfitContext.Provider value={{
      outfitItems, savedOutfits, addToOutfit, removeFromOutfit,
      isInOutfit, saveOutfit, deleteOutfit, clearOutfit, totalPrice
    }}>
      {children}
    </OutfitContext.Provider>
  );
}

export const useOutfit = () => {
  const context = useContext(OutfitContext);
  if (!context) throw new Error('useOutfit must be used within OutfitProvider');
  return context;
};
