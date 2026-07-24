'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart on mount to reset the local state after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-24">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 animate-[bounce_1s_ease-in-out_infinite] animate-bounce">
        <CheckCircle2 className="w-12 h-12 text-[#18AD00]" />
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight text-center">
        Thank You!
      </h1>
      
      <p className="text-lg text-slate-500 mb-12 text-center max-w-md">
        Your order has been successfully placed. We'll send you an email confirmation with your order details and tracking info shortly!
      </p>
    </div>
  );
}
