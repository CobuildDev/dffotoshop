'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/lib/cartContext';
import { processCheckout, syncCartAndFetchShipping } from '@/app/actions/checkout';
import { Button } from '@/components/ui/Button';
import { Country, State } from 'country-state-city';
import { useRouter } from 'next/navigation';

// Safely parse numeric price strings from WooCommerce
const parsePrice = (priceString?: string | number): number => {
  if (typeof priceString === 'number') return priceString;
  if (!priceString) return 0;
  const cleaned = String(priceString).replace(/,/g, '');
  const match = cleaned.match(/[\d\.]+/);
  return match ? parseFloat(match[0]) : 0;
};

// Borderless Input Component
const InputField = ({ name, label, type = 'text', required = false, className = '' }: any) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
    <input
      name={name}
      type={type}
      required={required}
      className="h-12 px-4 rounded-xl bg-slate-100/80 focus:bg-white shadow-inner focus:shadow-md transition-all text-slate-900 font-medium placeholder-slate-400 outline-none"
    />
  </div>
);

export const CheckoutForm = () => {
  const router = useRouter();
  const { cart, subtotal } = useCart();

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address States
  const [useSameBilling, setUseSameBilling] = useState(true);
  const [shippingCountry, setShippingCountry] = useState('NG');
  const [shippingState, setShippingState] = useState('');
  const [billingCountry, setBillingCountry] = useState('NG');
  const [billingState, setBillingState] = useState('');

  // WooCommerce Dynamic Shipping States
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<string>('');
  const [selectedShippingCost, setSelectedShippingCost] = useState<number>(0);
  const [isFetchingShipping, setIsFetchingShipping] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const countries = Country.getAllCountries();
  const shippingStates = State.getStatesOfCountry(shippingCountry);
  const billingStates = State.getStatesOfCountry(billingCountry);

  // Sync Cart & Fetch Shipping Rates whenever Address Changes
  useEffect(() => {
    if (cart.length === 0 || !shippingCountry) return;

    const fetchRates = async () => {
      setIsFetchingShipping(true);
      setError(null);
      try {
        const lineItems = cart.map((item: any) => ({
          productId: item.product.databaseId || parseInt(item.product.id, 10),
          quantity: item.quantity,
        }));

        // Call to your Next.js server action
        const data = await syncCartAndFetchShipping({
          lineItems,
          country: shippingCountry,
          state: shippingState,
          sessionToken // Pass existing token if we already synced
        });

        if (data?.sessionToken) setSessionToken(data.sessionToken);

        if (data?.shippingMethods && data.shippingMethods.length > 0) {
          setShippingOptions(data.shippingMethods);
          setSelectedShippingRate(data.shippingMethods[0].id);
          setSelectedShippingCost(parsePrice(data.shippingMethods[0].cost));
        } else {
          setShippingOptions([]);
          setSelectedShippingCost(0);
        }
      } catch (err) {
        console.error("Failed to fetch shipping rates:", err);
      } finally {
        setIsFetchingShipping(false);
      }
    };

    // Debounce the fetch slightly to prevent spamming the backend
    const timeoutId = setTimeout(() => fetchRates(), 500);
    return () => clearTimeout(timeoutId);
  }, [cart, shippingCountry, shippingState]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedShippingRate) {
      setError('Please select a valid shipping method before placing your order.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);

      // Trim email to prevent invisible whitespace failing Paystack validation
      const rawEmail = formData.get('email') as string;
      const contact = { email: rawEmail ? rawEmail.trim() : '' };

      const shipping = {
        firstName: formData.get('shippingFirstName') as string,
        lastName: formData.get('shippingLastName') as string,
        address1: formData.get('shippingAddress') as string,
        address2: formData.get('shippingApartment') as string || '',
        city: formData.get('shippingCity') as string,
        state: formData.get('shippingState') as string,
        postcode: formData.get('shippingPostcode') as string || '00000',
        country: formData.get('shippingCountry') as string,
        phone: formData.get('shippingPhone') as string,
      };

      const billing = useSameBilling ? { ...shipping } : {
        firstName: formData.get('billingFirstName') as string,
        lastName: formData.get('billingLastName') as string,
        address1: formData.get('billingAddress') as string,
        address2: formData.get('billingApartment') as string || '',
        city: formData.get('billingCity') as string,
        state: formData.get('billingState') as string,
        postcode: formData.get('billingPostcode') as string || '00000',
        country: formData.get('billingCountry') as string,
        phone: formData.get('billingPhone') as string,
      };

      const customerNote = formData.get('customerNote') as string || '';

      // We pass the sessionToken so WooCommerce knows which server-side cart to checkout
      const result = await processCheckout(
        contact,
        shipping,
        billing,
        customerNote,
        selectedShippingRate,
        sessionToken
      );

      if (result?.success && result?.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        setError(result?.message || 'Checkout failed. Please check your details.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-3">Your cart is empty</h2>
        <Button onClick={() => router.push('/')} variant="primary" className="bg-slate-900 hover:bg-black text-white shadow-md">
          Return to Shop
        </Button>
      </div>
    );
  }

  const grandTotal = subtotal + selectedShippingCost;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-8 pb-24 px-4">
      {/* Left Column: Form Details */}
      <div className="lg:col-span-7 space-y-10">

        {error && (
          <div className="p-5 bg-red-50/80 text-red-900 rounded-2xl shadow-sm text-sm font-semibold flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">{error}</div>
          </div>
        )}

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h2>
          <InputField name="email" label="Email address" type="email" required />
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Country / Region</label>
              <select
                name="shippingCountry"
                value={shippingCountry}
                onChange={(e) => { setShippingCountry(e.target.value); setShippingState(''); }}
                required
                className="h-12 px-4 rounded-xl bg-slate-100/80 focus:bg-white shadow-inner focus:shadow-md transition-all text-slate-900 font-medium outline-none"
              >
                <option value="">Select Country</option>
                {countries.map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
              </select>
            </div>
            <InputField name="shippingFirstName" label="First name" required />
            <InputField name="shippingLastName" label="Last name" required />
            <InputField name="shippingAddress" label="Street address" required className="sm:col-span-2" />
            <InputField name="shippingCity" label="City" required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">State / Province</label>
              {shippingStates.length > 0 ? (
                <select
                  name="shippingState"
                  value={shippingState}
                  onChange={(e) => setShippingState(e.target.value)}
                  required
                  className="h-12 px-4 rounded-xl bg-slate-100/80 focus:bg-white shadow-inner focus:shadow-md transition-all text-slate-900 font-medium outline-none"
                >
                  <option value="">Select State</option>
                  {shippingStates.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                </select>
              ) : (
                <input name="shippingState" type="text" required className="h-12 px-4 rounded-xl bg-slate-100/80 focus:bg-white shadow-inner focus:shadow-md transition-all text-slate-900 font-medium outline-none" />
              )}
            </div>
            <InputField name="shippingPhone" label="Phone number" type="tel" required className="sm:col-span-2" />
          </div>
          <label className="flex items-center gap-3 mt-6 ml-1 cursor-pointer select-none">
            <input type="checkbox" checked={useSameBilling} onChange={(e) => setUseSameBilling(e.target.checked)} className="w-5 h-5 rounded bg-slate-100 text-slate-900 focus:ring-0 shadow-inner" />
            <span className="text-sm font-medium text-slate-700">Billing matches shipping address</span>
          </label>
        </section>

        {/* Live WooCommerce Shipping Options */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Shipping Method</h2>
          <div className="space-y-3">
            {isFetchingShipping ? (
              <div className="p-4 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-center text-slate-500 font-medium animate-pulse">
                Calculating live rates from store...
              </div>
            ) : shippingOptions.length > 0 ? (
              shippingOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => {
                    setSelectedShippingRate(option.id);
                    setSelectedShippingCost(parsePrice(option.cost));
                  }}
                  className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${selectedShippingRate === option.id ? 'bg-white shadow-md' : 'bg-slate-50 shadow-sm'
                    }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer w-full">
                    <input type="radio" checked={selectedShippingRate === option.id} readOnly className="w-5 h-5 text-slate-900 focus:ring-0" />
                    <span className="font-semibold text-slate-900">{option.label}</span>
                  </label>
                  <span className="font-bold text-slate-900 whitespace-nowrap">
                    {parsePrice(option.cost) === 0 ? 'FREE' : `₦${parsePrice(option.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-center text-slate-500 text-sm font-medium">
                Please enter a valid shipping address to view options.
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Method</h2>
          <div className="p-5 bg-white rounded-2xl shadow-sm space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" defaultChecked className="w-5 h-5 text-slate-900 focus:ring-0" />
              <span className="font-bold text-slate-900 flex-1">Cards, Bank Transfer (Paystack)</span>
            </label>
          </div>
        </section>
      </div>

      {/* Right Column: Dynamic Order Summary */}
      <div className="lg:col-span-5">
        <div className="bg-slate-50 p-8 rounded-[28px] shadow-md sticky top-12 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
            {cart.map((item: any) => (
              <div key={item.product.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 bg-white rounded-xl shadow-sm overflow-hidden shrink-0">
                  <img src={item.product.image?.sourceUrl || '/placeholder.png'} alt={item.product.name} className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-slate-900 text-white rounded-md text-[10px] font-bold">{item.quantity}</div>
                </div>
                <div className="flex-1 text-sm font-bold text-slate-900 line-clamp-2 leading-tight">{item.product.name}</div>
                <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
                  ₦{(parsePrice(item.product.price) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200/60">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-slate-900 font-bold">₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Shipping</span>
              <span className="text-slate-900 font-bold">
                {isFetchingShipping ? '...' : selectedShippingCost === 0 ? 'FREE' : `₦${selectedShippingCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/60 flex justify-between items-center">
            <span className="text-lg font-bold text-slate-900">Total</span>
            <span className="text-2xl font-black text-slate-900">
              ₦{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || isFetchingShipping || !selectedShippingRate}
            className="w-full h-16 rounded-2xl bg-slate-900 text-white font-bold text-[17px] shadow-lg hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing Order...' : 'Place Order Securely'}
          </button>
        </div>
      </div>
    </form>
  );
};