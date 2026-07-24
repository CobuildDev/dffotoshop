'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ShoppingBag, CreditCard, Wallet, Banknote, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const CheckoutForm = () => {
  const { cart, subtotal, clearCart } = useCart();
  const router = useRouter();
  
  const [paymentMethod, setPaymentMethod] = useState<string>('bank_transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Mock shipping flat rate
  const shippingRate = cart.length > 0 ? 5000 : 0;
  const total = subtotal + shippingRate;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="w-full max-w-[600px] mx-auto py-20 px-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Order Received!</h1>
        <p className="text-slate-500 mb-8 text-lg">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        <Button variant="primary" onClick={() => router.push('/')} className="px-8 py-3 rounded-full text-base font-bold shadow-subtle-sm">
          Return to Shop
        </Button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="w-full max-w-[600px] mx-auto py-20 px-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Your cart is empty</h1>
        <p className="text-slate-500 mb-8 text-lg">
          Add some products to your cart before proceeding to checkout.
        </p>
        <Button variant="primary" onClick={() => router.push('/')} className="px-8 py-3 rounded-full text-base font-bold shadow-subtle-sm">
          Return to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 pb-4 border-b border-slate-100">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Column: Billing Details */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-6">
              Billing Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">First name *</label>
                <input required type="text" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Last name *</label>
                <input required type="text" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-700">Company name (optional)</label>
              <input type="text" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-700">Country / Region *</label>
              <select required className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors appearance-none">
                <option value="NG">Nigeria</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-700">Street address *</label>
              <input required type="text" placeholder="House number and street name" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors mb-3" />
              <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Town / City *</label>
                <input required type="text" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">State / County *</label>
                <input required type="text" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Phone *</label>
                <input required type="tel" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Email address *</label>
                <input required type="email" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5 mt-8">
              <label className="text-[13px] font-bold text-slate-700">Order notes (optional)</label>
              <textarea 
                rows={4} 
                placeholder="Notes about your order, e.g. special notes for delivery." 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none" 
              />
            </div>
          </div>

          {/* Right Column: Your Order */}
          <div className="lg:col-span-5">
            <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 sm:p-8 sticky top-24 shadow-subtle-sm">
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-6 border-b border-slate-200 pb-4">
                Your Order
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[13px] font-bold uppercase text-slate-500 mb-2">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>
                {cart.map((item) => {
                  const numericPrice = parseFloat(item.product.price?.replace(/,/g, '').match(/[\d\.]+/)![0] || '0');
                  return (
                    <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="text-[14px] text-slate-700 flex-1 pr-4" dangerouslySetInnerHTML={{ __html: `${item.product.name} <strong class="text-slate-900">× ${item.quantity}</strong>` }} />
                      <span className="text-[15px] font-bold text-slate-900">
                        ₦{(numericPrice * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-8 border-y border-slate-200 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-slate-600 font-bold">Subtotal</span>
                  <span className="text-[15px] font-bold text-slate-900">
                    ₦{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-slate-600 font-bold">Shipping</span>
                  <span className="text-[15px] font-bold text-slate-900">
                    Flat rate: ₦{shippingRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-200">
                  <span className="text-lg font-black text-slate-900 uppercase">Total</span>
                  <span className="text-2xl font-black text-[#18AD00]">
                    ₦{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-8">
                {/* Method 1 */}
                <label className="block bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-emerald-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#18AD00] focus:ring-[#18AD00] border-slate-300"
                    />
                    <Banknote className="w-5 h-5 text-slate-500" />
                    <span className="font-bold text-[14px] text-slate-800">Direct bank transfer</span>
                  </div>
                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-3 pl-7 text-[13px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                    </div>
                  )}
                </label>

                {/* Method 2 */}
                <label className="block bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-emerald-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#18AD00] focus:ring-[#18AD00] border-slate-300"
                    />
                    <Wallet className="w-5 h-5 text-slate-500" />
                    <span className="font-bold text-[14px] text-slate-800">Cash on delivery</span>
                  </div>
                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="mt-3 pl-7 text-[13px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      Pay with cash upon delivery.
                    </div>
                  )}
                </label>

                {/* Method 3 */}
                <label className="block bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-emerald-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#18AD00] focus:ring-[#18AD00] border-slate-300"
                    />
                    <CreditCard className="w-5 h-5 text-slate-500" />
                    <span className="font-bold text-[14px] text-slate-800">PayPal</span>
                  </div>
                  {paymentMethod === 'paypal' && (
                    <div className="mt-3 pl-7 text-[13px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      Pay via PayPal; you can pay with your credit card if you don't have a PayPal account.
                    </div>
                  )}
                </label>
              </div>

              <div className="text-[13px] text-slate-500 mb-6">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link href="/" className="text-emerald-600 hover:underline">privacy policy</Link>.
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isProcessing}
                className="py-4 text-[16px] font-bold tracking-wide rounded-xl shadow-subtle-sm bg-[#18AD00] hover:bg-[#159a00]"
              >
                Place order
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
