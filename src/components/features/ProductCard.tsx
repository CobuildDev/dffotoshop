'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CameraProduct } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useCart } from '@/lib/cartContext';
import { ShoppingBag, Check, Star, Heart } from 'lucide-react';

export interface ProductCardProps {
  product: CameraProduct;
  onAddToCart?: (product: CameraProduct) => void;
  priorityImage?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  priorityImage = false,
}) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
    }

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <article className="group relative flex flex-col rounded-[20px] bg-white p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 ring-1 ring-slate-200/60 hover:ring-slate-300/60">
      {/* Image Container */}
      <div className="relative aspect-[4/5] sm:aspect-[4/4] w-full overflow-hidden rounded-[14px] bg-[#F4F7F9] mb-4">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priorityImage}
          className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Heart Icon Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button className="w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full text-slate-500 hover:text-emerald-500 transition-colors shadow-subtle-sm">
            <Heart className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-1 pb-1">
        {/* Product Title */}
        <h3 className="text-[14px] sm:text-[15px] font-medium text-slate-700 line-clamp-2 leading-snug mb-1.5 group-hover:text-emerald-600 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <Star className="w-3.5 h-3.5 fill-[#FF9800] text-[#FF9800]" />
          <span className="text-[13px] font-semibold text-slate-600">{product.rating}</span>
          <span className="text-[13px] text-slate-400">({product.reviewsCount} reviews)</span>
        </div>

        {/* Footer Price & Action */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between mt-auto gap-2.5">
          <span className="text-[14px] sm:text-[15px] xl:text-base font-extrabold text-slate-900 xl:pb-1">
            {product.formattedPrice}
          </span>

          <button
            onClick={handleAddToCart}
            className="w-full xl:w-auto px-3.5 h-9 rounded-xl bg-[#18AD00] flex items-center justify-center text-white text-[13px] font-bold tracking-wide whitespace-nowrap shadow-subtle-sm transition-all hover:bg-[#138e00] hover:shadow-subtle-md hover:scale-[1.02] active:scale-95"
          >
            {isAdded ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
};
