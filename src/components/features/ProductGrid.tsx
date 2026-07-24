'use client';

import React, { useState } from 'react';
import { WooProduct } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Text } from '@/components/ui/Text';
import { Search, Filter, Camera } from 'lucide-react';

export interface ProductGridProps {
  products?: WooProduct[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterOptions = ['All', 'Cameras', 'Lenses', 'Accessories', 'Journal'];

  const filteredProducts = products.filter((product) => {
    // Basic plural stripping for fuzzy match (Cameras -> camera, Lenses -> lense/lens)
    const filterTerm = selectedCategory === 'All' ? '' : selectedCategory.toLowerCase().replace(/s$/, '');

    const categoryName = product.productCategories?.nodes?.[0]?.name?.toLowerCase() || '';
    const productName = product.name?.toLowerCase() || '';
    const productDesc = product.description?.toLowerCase() || '';

    const matchesCategory =
      selectedCategory === 'All' ||
      categoryName.includes(filterTerm) ||
      productName.includes(filterTerm) ||
      productDesc.includes(filterTerm);

    const matchesSearch =
      productName.includes(searchQuery.toLowerCase()) ||
      productDesc.includes(searchQuery.toLowerCase()) ||
      categoryName.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="w-full py-6 space-y-6">

      {/* Filter Pills */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto p-4 scrollbar-hide">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedCategory(filter)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-[12px] font-bold transition-all duration-300 ${selectedCategory === filter
              ? 'bg-[#16a31c] text-white shadow-subtle-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 ring-1 ring-slate-200/60 hover:text-slate-900'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>      {/* Grid Container */}
      {
        filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} priorityImage={idx < 3} />
            ))}
          </div>
        ) : (
          <div className="w-full py-16 px-6 text-center rounded-3xl bg-white flex flex-col items-center justify-center">
            <Text variant="title-sm" className="font-bold text-slate-800">
              No Items match your search
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
