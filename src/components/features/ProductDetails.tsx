'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WooProduct } from '@/types/product';
import { useCart } from '@/lib/cartContext';
import { Button } from '@/components/ui/Button';
import { ProductReviews } from './ProductReviews';
import { Minus, Plus, Check } from 'lucide-react';

export const ProductDetails = ({ product }: { product: WooProduct }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Derive brand loosely from title (first word)
  const brand = product.name?.split(' ')[0].toUpperCase() || 'UNKNOWN';

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrease = () => {
    setQuantity(q => q + 1);
  };

  // Since WPGraphQL returns HTML strings for prices, we will use product.regularPrice and product.price
  const hasDiscount = product.regularPrice && product.price && product.regularPrice !== product.price;

  return (
    <div className="w-full bg-white pb-16">
      {/* Container */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Breadcrumb */}
        <nav className="text-[13px] text-slate-500 mb-8 font-medium flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/" className="hover:text-emerald-600 transition-colors lowercase">{product.productCategories?.nodes?.[0]?.name || 'product'}</Link>
          <span>/</span>
          <span className="text-slate-800" dangerouslySetInnerHTML={{ __html: product.name }} />
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Left Column: Image */}
          <div className="relative aspect-[4/3] md:aspect-square w-full rounded-2xl overflow-hidden bg-[#F4F7F9] flex items-center justify-center p-8">
            <Image
              src={product.image?.sourceUrl || '/placeholder.png'}
              alt={product.name}
              fill
              priority
              className="object-contain mix-blend-multiply p-4"
            />
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col pt-2 md:pt-4">

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tight" dangerouslySetInnerHTML={{ __html: product.name }} />

            {/* Pricing block */}
            <div className="flex items-center gap-3 mb-6">
              {hasDiscount && (
                <span className="text-xl md:text-2xl font-semibold text-slate-400 line-through decoration-slate-300" dangerouslySetInnerHTML={{ __html: product.regularPrice || '' }} />
              )}
              <span className="text-2xl md:text-3xl font-black text-slate-900 border-b-[3px] border-slate-900 pb-0.5 inline-block leading-none" dangerouslySetInnerHTML={{ __html: product.price || '' }} />
            </div>

            {/* Description */}
            <div className="prose prose-slate text-slate-500 text-[15px] leading-relaxed mb-10" dangerouslySetInnerHTML={{ __html: product.description || '' }} />

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
                <span className="text-[#18AD00]">{product.productCategories?.nodes?.[0]?.name || 'Uncategorized'}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider">
                <span className="text-slate-800">Brand:</span>
                <span className="text-[#18AD00]">{brand}</span>
              </div>
            </div>

          </div>
        </div>
        {/* Reviews & Comments Section */}
        <ProductReviews product={product} />
      </div>
    </div>
  );
};
