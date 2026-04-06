'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('arden_favorites');
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('arden_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((product) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === product.id);
      if (exists) {
        return prev.filter(f => f.id !== product.id);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images ? product.images[0] : product.image,
        rating: product.rating,
      }];
    });
  }, []);

  const isFavorite = useCallback((productId) => {
    return favorites.some(f => f.id === productId);
  }, [favorites]);

  const removeFavorite = useCallback((productId) => {
    setFavorites(prev => prev.filter(f => f.id !== productId));
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
