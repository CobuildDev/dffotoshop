import { CheckoutForm } from '@/components/features/CheckoutForm';

export const metadata = {
  title: 'Secure Checkout | dffotoshop',
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
