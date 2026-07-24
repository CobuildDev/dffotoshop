
import React from 'react';
import { ProductGrid } from '@/components/features/ProductGrid';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Camera, Sparkles, Award, Zap, ArrowUpRight } from 'lucide-react';

import { graphqlClient } from '@/lib/graphqlClient';
import { GET_ALL_PRODUCTS } from '@/lib/queries';
import { WooProduct } from '@/types/product';

export default async function StorefrontHome() {
  let products: WooProduct[] = [];

  try {
    const data: any = await graphqlClient.request(GET_ALL_PRODUCTS);
    products = data?.products?.nodes || [];
  } catch (error) {
    console.error("Failed to fetch products from WooCommerce", error);
  }
const res = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: GET_ALL_PRODUCTS }),
  // This tells Next.js to refresh the cache every 60 seconds
  next: { revalidate: 60 } 
});
  return (
    <div className="space-y-12">
      {/* 3. Product Catalog Grid Section */}
      <div id="catalog">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
