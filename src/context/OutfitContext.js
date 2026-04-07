'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const OutfitContext = createContext();

// Kategori slug veya adından manken slot'unu belirle
function getSlotFromCategory(cat) {
  if (!cat) return 'ust';
  const c = cat.toLowerCase();
  if (['pantolon', 'şort', 'sort', 'alt-giyim', 'alt giyim', 'jean', 'esofman-alti'].some(k => c.includes(k))) return 'alt';
  if (['ayakkabi', 'ayakkabı', 'bot', 'sneaker', 'terlik', 'sandalet'].some(k => c.includes(k))) return 'ayakkabi';
  if (['aksesuar', 'taki', 'saat', 'gozluk', 'şapka', 'sapka', 'kemer', 'çanta', 'canta'].some(k => c.includes(k))) return 'aksesuar';
  return 'ust';
}

export function OutfitProvider({ children }) {
  const [outfitItems, setOutfitItems] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('arden_outfit_items');
    const savedList = localStorage.getItem('arden_saved_outfits');
    if (saved) { try { setOutfitItems(JSON.parse(saved)); } catch {} }
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
        category: product.outfitCategory || getSlotFromCategory(product.category || product.productType || ''),
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
