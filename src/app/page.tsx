'use client';

import React from 'react';
import { ProductGrid } from '@/components/features/ProductGrid';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Camera, Sparkles, Award, Zap, ArrowUpRight } from 'lucide-react';

export default function StorefrontHome() {
  const scrollToCatalog = () => {
    const grid = document.getElementById('catalog');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12">

      {/* 3. Product Catalog Grid Section */}
      <div id="catalog">
        <ProductGrid />
      </div>
    </div>
  );
}
