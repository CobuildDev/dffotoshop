import React from 'react';
import { notFound } from 'next/navigation';
import { graphqlClient } from '@/lib/graphqlClient';
import { GET_PRODUCT_BY_SLUG } from '@/lib/queries';
import { ProductDetails } from '@/components/features/ProductDetails';
import { WooProduct } from '@/types/product';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage(props: any) {
  // Await params to safely support Next.js 15+ 
  const params = await Promise.resolve(props.params);
  
  let product: WooProduct | null = null;
  try {
    const data: any = await graphqlClient.request(GET_PRODUCT_BY_SLUG, {
      id: params.slug
    });
    product = data?.product || null;
  } catch (error) {
    console.error("Failed to fetch product from WooCommerce", error);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductDetails product={product} />
    </div>
  );
}
