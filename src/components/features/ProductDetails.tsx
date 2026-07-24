'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CameraProduct } from '@/lib/mockData';
import { useCart } from '@/lib/cartContext';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Check } from 'lucide-react';

export const ProductDetails = ({ product }: { product: CameraProduct }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Derive brand loosely from title (first word)
  const brand = product.title.split(' ')[0].toUpperCase();

  const handleAddToCart = () => {
    addToCart(product,);
    //quantity is meant to be added
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrease = () => {
    setQuantity(q => q + 1);
  };

  // Format original price for display (naive format for mock)
  const formattedOriginalPrice = product.originalPrice
    ? `₦${(product.originalPrice * 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : '';

  return (
    <div className="w-full bg-white pb-16">
      {/* Container */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Breadcrumb */}
        <nav className="text-[13px] text-slate-500 mb-8 font-medium flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/" className="hover:text-emerald-600 transition-colors lowercase">{product.category}</Link>
          <span>/</span>
          <span className="text-slate-800">{product.title}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Left Column: Image */}
          <div className="relative aspect-[4/3] md:aspect-square w-full rounded-2xl overflow-hidden bg-[#F4F7F9] flex items-center justify-center p-8">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              priority
              className="object-contain mix-blend-multiply p-4"
            />
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col pt-2 md:pt-4">

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
              {product.title}
            </h1>

            {/* Pricing block */}
            <div className="flex items-center gap-3 mb-6">
              {(product.originalPrice && product.originalPrice > product.price) && (
                <span className="text-xl md:text-2xl font-semibold text-slate-400 line-through decoration-slate-300">
                  {formattedOriginalPrice}
                </span>
              )}
              <span className="text-2xl md:text-3xl font-black text-slate-900 border-b-[3px] border-slate-900 pb-0.5 inline-block leading-none">
                {product.formattedPrice}
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-slate text-slate-500 text-[15px] leading-relaxed mb-10">
              <p>{product.description}</p>
              <p className="mt-4">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
              </p>
            </div>

            {/* Add to Cart Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10 border-b border-slate-200 pb-10">

              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-200 rounded-lg h-12 w-full sm:w-32 bg-white">
                <button
                  onClick={handleDecrease}
                  className="flex-1 h-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors rounded-l-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 h-full flex items-center justify-center text-[15px] font-bold text-slate-900 border-x border-slate-100">
                  {quantity}
                </div>
                <button
                  onClick={handleIncrease}
                  className="flex-1 h-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors rounded-r-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                variant="primary"
                onClick={handleAddToCart}
                className={`flex-1 h-12 text-[15px] font-bold tracking-wide rounded-lg transition-all duration-300 shadow-subtle-sm ${isAdded ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-[#18AD00] hover:bg-[#159a00] text-white'
                  }`}
                icon={isAdded ? <Check className="w-5 h-5" strokeWidth={3} /> : undefined}
                iconPosition="left"
              >
                {isAdded ? 'Added to Cart' : 'Add to cart'}
              </Button>
            </div>

            {/* Meta tags */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider">
                <span className="text-slate-800">Category:</span>
                <span className="text-[#18AD00]">{product.category}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider">
                <span className="text-slate-800">Brand:</span>
                <span className="text-[#18AD00]">{brand}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Reviews & Comments Section */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="border-t border-slate-200 pt-16">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Customer Reviews</h2>

          {/* Review Summary */}
          <div className="flex items-center gap-4 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-6 h-6 ${star <= Math.round(product.rating) ? 'text-[#FF9800] fill-[#FF9800]' : 'text-slate-300'}`} viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ))}
            </div>
            <div className="text-lg font-bold text-slate-900">{product.rating} out of 5</div>
            <div className="text-slate-500">Based on {product.reviewsCount} reviews</div>
          </div>

          {/* Comment Form */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add a Review</h3>
            <form className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name *" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" required />
                <input type="email" placeholder="Your Email *" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" required />
              </div>
              <textarea rows={4} placeholder="Your Review *" className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" required></textarea>
              <Button variant="primary" className="px-8 py-3 rounded-xl bg-[#18AD00] hover:bg-[#159a00] shadow-subtle-sm font-bold">
                Submit Review
              </Button>
            </form>
          </div>

          {/* Sample Comments */}
          <div className="space-y-8 max-w-3xl">
            <div className="border-b border-slate-100 pb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">JD</div>
                <div>
                  <div className="font-bold text-slate-900 text-[15px]">John Doe</div>
                  <div className="text-slate-400 text-xs">October 12, 2025</div>
                </div>
              </div>
              <p className="text-slate-600 text-[15px] leading-relaxed mt-3">
                Absolutely incredible piece of gear. The build quality is precisely what you would expect, and the image output is stunning. Highly recommend this for any serious creator.
              </p>
            </div>
            <div className="border-b border-slate-100 pb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">AS</div>
                <div>
                  <div className="font-bold text-slate-900 text-[15px]">Alice Smith</div>
                  <div className="text-slate-400 text-xs">September 28, 2025</div>
                </div>
              </div>
              <p className="text-slate-600 text-[15px] leading-relaxed mt-3">
                Fast shipping and the product arrived in perfect condition. It has completely elevated my workflow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
