'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WooProduct } from '@/types/product';

export interface CartItem {
  product: WooProduct;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  addToCart: (product: WooProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('dffotoshop-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('dffotoshop-cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // WooCommerce returns price as a formatted HTML string, extract the number
  const extractNumericPrice = (priceStr?: string | null) => {
    if (!priceStr) return 0;
    const matches = priceStr.replace(/,/g, '').match(/[\d\.]+/);
    return matches ? parseFloat(matches[0]) : 0;
  };
  
  const subtotal = cart.reduce((total, item) => total + extractNumericPrice(item.product.price) * item.quantity, 0);

  const addToCart = (product: WooProduct, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
