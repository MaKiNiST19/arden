'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('arden_cart');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('arden_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, selectedColor, selectedSize, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(
        item => item.id === product.id && item.color === selectedColor && item.size === selectedSize
      );
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.color === selectedColor && item.size === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        color: selectedColor,
        size: selectedSize,
        quantity,
      }];
    });
  }, []);

  const removeItem = useCallback((id, color, size) => {
    setItems(prev => prev.filter(
      item => !(item.id === id && item.color === color && item.size === size)
    ));
  }, []);

  const updateQuantity = useCallback((id, color, size, quantity) => {
    if (quantity <= 0) {
      removeItem(id, color, size);
      return;
    }
    setItems(prev => prev.map(item =>
      item.id === id && item.color === color && item.size === size
        ? { ...item, quantity }
        : item
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
