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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Cameras', href: '#' },
    { name: 'Lenses', href: '#' },
    { name: 'Accessories', href: '#', hasDropdown: true },
    { name: 'Journal', href: '#' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white transition-all duration-200 shadow-subtle-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">

          {/* Left Section: Logo & Desktop Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center group focus:outline-none">
              <Image src="/site-icon.png" width={150} height={50} alt="logo" className="h-9 w-auto" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 ml-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-1.5 text-[15px] text-slate-700 transition-all duration-300 ease-out"
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4 text-slate-500" strokeWidth={1.5} />}
                </Link>
              ))}
            </nav>
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
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <button className="w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-slate-700 transition-all duration-300 hover:scale-105 active:scale-95">
                <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-slate-700 transition-all duration-300 hover:scale-105 active:scale-95 hover:text-emerald-600">
                <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
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

            {/* Mobile Menu Toggle (Right aligned) */}
            <button
              className="lg:hidden p-2 ml-1 text-slate-700 hover:text-emerald-600 transition-colors focus:outline-none group"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <div className="flex flex-col gap-[5px] w-[22px] items-end">
                <span className="w-full h-[2.5px] bg-current rounded-full transition-all group-hover:bg-emerald-600"></span>
                <span className="w-3/4 h-[2.5px] bg-current rounded-full transition-all group-hover:bg-emerald-600 group-hover:w-full"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 lg:hidden bg-white flex flex-col overflow-hidden"
          >
            {/* Header matching Navbar */}
            <div className="flex items-center justify-between px-4 sm:px-6 h-[72px]">
              <div className="flex items-center gap-2.5">
                <Image src="/site-icon.png" width={140} height={50} alt="logo" className="h-9 w-auto" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#F3F4F6] text-slate-700 rounded-full hover:bg-[#E5E7EB] transition-all duration-300 active:scale-95"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
              {/* Prominent Search */}
              <div className="relative w-full mb-10 group">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-[#F3F4F6] rounded-2xl py-4 pl-5 pr-14 text-[17px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:shadow-subtle-md transition-all duration-300"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-[42px] h-[42px] bg-[#16a31c] hover:bg-[#128617] rounded-xl flex items-center justify-center text-white shadow-subtle-sm transition-all duration-300 active:scale-95">
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              {/* Huge Navigation Links */}
              <nav className="flex flex-col gap-6 mb-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="group flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-2xl text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {link.name}
                    </span>
                    {link.hasDropdown && (
                      <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center group-hover:bg-emerald-50 transition-colors duration-300">
                        <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" strokeWidth={3} />
                      </div>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Quick Action Cards (Alerts/Saved) */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <button className="flex flex-col items-start gap-4 p-5 rounded-3xl bg-[#F8FAFC] hover:bg-emerald-50 transition-colors duration-300 shadow-subtle-sm group">
                  <div className="w-11 h-11 rounded-full bg-white shadow-subtle-sm flex items-center justify-center text-slate-600 group-hover:text-emerald-600 transition-colors">
                    <Bell className="w-[22px] h-[22px]" strokeWidth={2.2} />
                  </div>
                  <span className="font-extrabold text-slate-900 text-[15px]">Alerts</span>
                </button>
                <button className="flex flex-col items-start gap-4 p-5 rounded-3xl bg-[#F8FAFC] hover:bg-emerald-50 transition-colors duration-300 shadow-subtle-sm group">
                  <div className="w-11 h-11 rounded-full bg-white shadow-subtle-sm flex items-center justify-center text-slate-600 group-hover:text-emerald-600 transition-colors">
                    <Heart className="w-[22px] h-[22px]" strokeWidth={2.2} />
                  </div>
                  <span className="font-extrabold text-slate-900 text-[15px]">Saved</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over Mini Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
            onClick={toggleCart}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-subtle-lg p-6 flex flex-col justify-between">

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
                    <span className="text-2xl font-black text-slate-900">
                      ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Text variant="caption" color="muted" className="block text-[11px] font-bold uppercase tracking-wider">
                    Taxes and shipping calculated at checkout.
                  </Text>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={<ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />}
                    iconPosition="right"
                    onClick={() => alert('Proceeding to Headless Checkout...')}
                    className="py-4 text-[15px] rounded-2xl shadow-subtle-lg hover:shadow-subtle-md"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

