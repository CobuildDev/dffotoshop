import React from 'react';
import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ProductDetails } from '@/components/features/ProductDetails';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all mock products so they can be pre-rendered
export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage(props: any) {
  // Await params to safely support Next.js 15+ 
  const params = await Promise.resolve(props.params);
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductDetails product={product} />
    </div>
  );
}
