'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cartContext';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import {
  ShoppingBag, X, Plus, Minus, Trash2, ArrowRight,
  Search, Bell, Heart, ChevronDown, Menu, ShoppingCart
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cart, cartCount, subtotal, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white transition-all duration-200 shadow-subtle-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">

          {/* Left Section: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group focus:outline-none">
              <Image src="/site-icon.png" width={150} height={50} alt="logo" className="h-9 w-auto" />
            </Link>
          </div>

          {/* Right Section: Search & Icons */}
          <div className="flex items-center gap-3 lg:gap-4 flex-1 justify-end ml-4">

            {/* Search Bar */}
            <div className="hidden sm:flex relative w-full max-w-[240px] lg:max-w-[340px] mr-2 lg:mr-4 group">
              <input
                type="text"
                placeholder="Find product"
                className="w-full bg-[#F3F4F6] rounded-full py-2.5 pl-5 pr-11 text-[15px] text-slate-900 placeholder:text-slate-500 focus:outline-none focus:bg-white focus:shadow-subtle-sm transition-all duration-300 ease-in-out group-hover:bg-slate-100"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors duration-300 group-focus-within:text-emerald-600" strokeWidth={1.5} />
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button className="w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-slate-700 transition-all duration-300 hover:scale-105 active:scale-95">
                <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative w-10 h-10 rounded-full bg-[#16a31c] hover:bg-[#128617] flex items-center justify-center text-white shadow-subtle-sm transition-all duration-300 hover:shadow-subtle-md hover:scale-105 active:scale-95 focus:outline-none shrink-0"
            >
              <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2.5} />
              {/* Red Badge */}
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] rounded-full bg-[#ff1540] text-white text-[11px] font-bold shadow-sm border-[2px] border-white box-content">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row (Visible only on mobile) */}
        <div className="sm:hidden px-4 pb-3">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-[#F3F4F6] rounded-xl py-2.5 pl-4 pr-10 text-[14px] text-slate-900 placeholder:text-slate-500 focus:outline-none focus:bg-white focus:shadow-subtle-md transition-all duration-300"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" strokeWidth={2} />
          </div>
        </div>
      </header>



      {/* Mini Cart Modal/Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center md:block md:overflow-hidden p-4 sm:p-6 md:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={toggleCart}
            />
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md md:fixed md:inset-y-0 md:right-0 md:max-w-full md:flex md:pl-10 z-10"
            >
              <div className="w-full md:w-screen md:max-w-md bg-white rounded-3xl md:rounded-none shadow-subtle-lg p-6 flex flex-col justify-between max-h-[85vh] md:max-h-none md:h-full">

              <div>
                <div className="flex items-center justify-between pb-6 mb-6 shadow-[0_1px_0_rgba(226,232,240,0.5)]">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
                    <Text variant="title-md" className="font-extrabold text-slate-900">
                      Your Cart ({cartCount})
                    </Text>
                  </div>
                  <button
                    onClick={toggleCart}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                </div>

                {cart.length > 0 ? (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#F8FAFC] shadow-subtle-sm"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {item.product.title}
                          </h4>
                          <p className="text-[13px] font-extrabold text-blue-600 mt-0.5">
                            {item.product.formattedPrice}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 rounded-md bg-white text-slate-600 hover:bg-slate-200 transition-colors shadow-subtle-sm"
                            >
                              <Minus className="w-[14px] h-[14px]" strokeWidth={3} />
                            </button>
                            <span className="text-[13px] font-bold text-slate-800 px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 rounded-md bg-white text-slate-600 hover:bg-slate-200 transition-colors shadow-subtle-sm"
                            >
                              <Plus className="w-[14px] h-[14px]" strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-slate-300" strokeWidth={2} />
                    </div>
                    <Text variant="title-sm" className="font-bold text-slate-800">
                      Your bag is empty
                    </Text>
                    <Text variant="body-sm" color="muted">
                      Add a precision camera from our catalog to get started.
                    </Text>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-6 space-y-4 shadow-[0_-1px_0_rgba(226,232,240,0.5)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] text-slate-500 font-bold">Subtotal</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      ₦{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Text variant="caption" color="muted" className="block text-[11px] font-bold uppercase tracking-wider">
                    Taxes and shipping calculated at checkout.
                  </Text>
                  <Link href="/checkout" onClick={toggleCart} className="block w-full">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />}
                      iconPosition="right"
                      className="py-4 text-[15px] rounded-2xl shadow-subtle-lg hover:shadow-subtle-md"
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

