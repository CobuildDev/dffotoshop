'use client';

import React, { useState } from 'react';
import { CameraProduct, MOCK_PRODUCTS, STORE_CATEGORIES } from '@/lib/mockData';
import { ProductCard } from './ProductCard';
import { Text } from '@/components/ui/Text';
import { Search, Filter, Camera } from 'lucide-react';

export interface ProductGridProps {
  products?: CameraProduct[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = MOCK_PRODUCTS,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="w-full py-8 space-y-8">





      {/* Grid Container */}
      {
        filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} priorityImage={idx < 3} />
            ))}
          </div>
        ) : (
          <div className="w-full py-16 px-6 text-center rounded-3xl bg-white shadow-subtle-sm flex flex-col items-center justify-center">
            <Camera className="w-12 h-12 text-slate-300 mb-3" />
            <Text variant="title-sm" className="font-bold text-slate-800">
              No cameras match your search
            </Text>
            <Text variant="body-sm" color="muted" className="mt-1">
              Try adjusting your search terms or category filter.
            </Text>
          </div>
        )
      }
    </section >
  );
};
