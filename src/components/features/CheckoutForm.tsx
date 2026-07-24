'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { processCheckout } from '@/app/actions/checkout';
import { Button } from '@/components/ui/Button';
import { Country, State } from 'country-state-city';
import { useRouter } from 'next/navigation';

const InputField = ({ name, label, type = 'text', required = false, className = '' }: any) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-sm font-semibold text-slate-600 ml-1">{label}</label>
    <input
      name={name}
      type={type}
      required={required}
      className="h-12 px-4 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:outline-none focus:border-slate-500/30 transition-all text-slate-900 font-medium placeholder-slate-400"
    />
  </div>
);

export const CheckoutForm = () => {
  const router = useRouter();
  const { cart, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [useSameBilling, setUseSameBilling] = useState(true);
  const flatRateShippingCost = 4000;

  // Location Dropdowns State
  const [shippingCountry, setShippingCountry] = useState('NG');
  const [shippingState, setShippingState] = useState('');
  const [billingCountry, setBillingCountry] = useState('NG');
  const [billingState, setBillingState] = useState('');

  const countries = Country.getAllCountries();
  const shippingStates = State.getStatesOfCountry(shippingCountry);
  const billingStates = State.getStatesOfCountry(billingCountry);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const contact = { email: formData.get('email') as string };

    const shipping = {
      firstName: formData.get('shippingFirstName') as string,
      lastName: formData.get('shippingLastName') as string,
      address1: formData.get('shippingAddress') as string,
      address2: formData.get('shippingApartment') as string,
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
      address2: formData.get('billingApartment') as string,
      city: formData.get('billingCity') as string,
      state: formData.get('billingState') as string,
      postcode: formData.get('billingPostcode') as string || '00000',
      country: formData.get('billingCountry') as string,
      phone: formData.get('billingPhone') as string,
    };

    const customerNote = formData.get('customerNote') as string;
    const shippingMethod = formData.get('shippingMethod') as string;

    const lineItems = cart.map((item) => ({
      productId: item.product.databaseId,
      quantity: item.quantity,
    }));

    const result = await processCheckout(contact, shipping, billing, customerNote, shippingMethod, lineItems);

    if (result.success && result.redirectUrl) {
      window.location.href = result.redirectUrl;
    } else {
      setError(result.message || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Add some items before proceeding to checkout.</p>
        <Button onClick={() => router.push('/')} variant="primary" className="bg-[#18AD00] hover:bg-[#159a00]">Return to Shop</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-10 pb-24">

      {/* Left Column: Form Details */}
      <div className="lg:col-span-7 space-y-12">

        {error && (
          <div className="p-5 bg-red-50 border border-red-100 text-red-900 rounded-2xl shadow-sm text-sm font-semibold flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-5">Contact information</h2>
          <InputField name="email" label="Email address" type="email" required />
          <p className="text-sm text-slate-500 mt-2 ml-1">You are currently checking out as a guest.</p>
        </section>

        {/* Shipping Address */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-5">Shipping address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">Country/Region</label>
              <select
                name="shippingCountry"
                value={shippingCountry}
                onChange={(e) => {
                  setShippingCountry(e.target.value);
                  setShippingState('');
                }}
                required
                className="h-12 px-4 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:outline-none focus:border-emerald-500/30 transition-all text-slate-900 font-medium"
              >
                <option value="">Select Country</option>
                {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
              </select>
            </div>
            <InputField name="shippingFirstName" label="First name" required />
            <InputField name="shippingLastName" label="Last name" required />
            <InputField name="shippingAddress" label="Address" required className="sm:col-span-2" />
            <InputField name="shippingApartment" label="Apartment, suite, etc. (optional)" className="sm:col-span-2" />
            <InputField name="shippingCity" label="City" required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600 ml-1">State</label>
              {shippingStates.length > 0 ? (
                <select name="shippingState" value={shippingState} onChange={(e) => setShippingState(e.target.value)} required className="h-12 px-4 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:outline-none focus:border-emerald-500/30 transition-all text-slate-900 font-medium">
                  <option value="">Select State</option>
                  {shippingStates.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                </select>
              ) : (
                <input name="shippingState" type="text" required className="h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium" />
              )}
            </div>
            <InputField name="shippingPhone" label="Phone" type="tel" required className="sm:col-span-2" />
          </div>

          <label className="flex items-center gap-3 mt-6 ml-1 cursor-pointer">
            <input type="checkbox" checked={useSameBilling} onChange={(e) => setUseSameBilling(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm font-medium text-slate-700">Use same address for billing</span>
          </label>
        </section>

        {/* Billing Address (Conditional) */}
        {!useSameBilling && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Billing address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Country/Region</label>
                <select name="billingCountry" value={billingCountry} onChange={(e) => { setBillingCountry(e.target.value); setBillingState(''); }} required className="h-12 px-4 rounded-xl bg-white border border-slate-200 transition-all text-slate-900 font-medium focus:ring-0 focus:outline-none focus:border-emerald-500/30">
                  <option value="">Select Country</option>
                  {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                </select>
              </div>
              <InputField name="billingFirstName" label="First name" required />
              <InputField name="billingLastName" label="Last name" required />
              <InputField name="billingAddress" label="Address" required className="sm:col-span-2" />
              <InputField name="billingApartment" label="Apartment, suite, etc. (optional)" className="sm:col-span-2" />
              <InputField name="billingCity" label="City" required />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600 ml-1">State</label>
                {billingStates.length > 0 ? (
                  <select name="billingState" value={billingState} onChange={(e) => setBillingState(e.target.value)} required className="h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:ring-0 focus:outline-none focus:border-emerald-500/30">
                    <option value="">Select State</option>
                    {billingStates.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                  </select>
                ) : (
                  <input name="billingState" type="text" required className="h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:ring-0 focus:outline-none focus:border-emerald-500/30" />
                )}
              </div>
              <InputField name="billingPhone" label="Phone" type="tel" required className="sm:col-span-2" />
            </div>
          </section>
        )}

        {/* Shipping Options */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-5">Shipping options</h2>
          <div className="space-y-3">
            <div className="border border-emerald-500 bg-emerald-50/30 rounded-xl p-4 flex items-center justify-between cursor-pointer">
              <label className="flex items-center gap-3 cursor-pointer w-full">
                <input type="radio" name="shippingMethod" value="flat_rate:1" defaultChecked className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                <span className="font-medium text-slate-900">Flat rate</span>
              </label>
              <span className="font-bold text-slate-900 whitespace-nowrap">₦{flatRateShippingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </section>

        {/* Payment Options */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-5">Payment options</h2>
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="paymentMethod" value="paystack" defaultChecked className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
              <span className="font-medium text-slate-900 flex-1">Debit/Credit Cards/Transfers</span>
              <div className="flex gap-1">
                <div className="h-5 w-8 bg-blue-100 rounded text-[8px] font-bold text-blue-900 flex items-center justify-center">VISA</div>
                <div className="h-5 w-8 bg-orange-100 rounded text-[8px] font-bold text-orange-900 flex items-center justify-center">MC</div>
              </div>
            </label>
            <div className="mt-4 pl-8 text-sm text-slate-500">
              Make payment using your debit/credit cards or via bank transfer securely through Paystack.
            </div>
          </div>
        </section>

        {/* Order Note */}
        <section>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-600 ml-1">Add a note to your order (optional)</label>
            <textarea name="customerNote" rows={3} className="px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-0 focus:outline-none focus:border-emerald-500/30 transition-all text-slate-900 font-medium placeholder-slate-400 resize-none" />
          </div>
        </section>

      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5">
        <div className="bg-slate-50 border border-slate-100 p-8 rounded-[24px] shadow-sm sticky top-12">

          <div className="space-y-5 mb-8">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0">
                  <img src={item.product.image?.sourceUrl || '/placeholder.png'} alt={item.product.name} className="w-full h-full object-cover" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-500 text-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-bold text-slate-900 line-clamp-2 leading-tight">{item.product.name}</div>
                </div>
                <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
                  ₦{((parseFloat(item.product.price?.replace(/,/g, '').match(/[\d\.]+/)![0] || '0')) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200/60 pt-5 space-y-3 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-slate-900 font-bold">₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Shipping</span>
              <span className="text-slate-900 font-bold">₦{flatRateShippingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="border-t border-slate-200/60 pt-5 mb-8 flex justify-between items-center">
            <span className="text-lg font-bold text-slate-900">Total</span>
            <span className="text-2xl font-black text-[#18AD00]">₦{(subtotal + flatRateShippingCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <p className="text-[13px] text-slate-500 text-center mb-6 leading-relaxed">
            By proceeding with your purchase you agree to our Terms and Conditions and Privacy Policy.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-slate-900 text-white font-bold text-[17px] shadow-subtle-sm transition-all hover:bg-black hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </>
            ) : (
              'Place Order Securely'
            )}
          </button>
        </div>
      </div>

    </form>
  );
};
