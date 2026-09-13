"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

export type CartItem = {
  id: string;
  name_en: string;
  name_hi?: string;
  price: number;
  quantity: number;
  image?: string;
  shopId: string;
  shopName?: string;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem("localmart_cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setItems(parsed.items || []);
      } catch (e) {}
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("localmart_cart", JSON.stringify({ items }));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
