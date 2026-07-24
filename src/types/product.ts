export interface WooProduct {
  id: string;
  databaseId: number;
  slug: string;
  name: string;
  description?: string;
  image?: {
    sourceUrl: string;
  } | null;
  galleryImages?: {
    nodes: {
      sourceUrl: string;
    }[];
  } | null;
  productCategories?: {
    nodes: {
      name: string;
    }[];
  } | null;
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  // Fallback for extracted numeric prices if we parse them
  parsedPrice?: number;
  parsedRegularPrice?: number;
  reviewCount?: number;
  averageRating?: number;
  reviews?: {
    nodes: {
      id: string;
      content: string;
      date?: string;
      author?: {
        node: {
          name: string;
        };
      } | null;
    }[];
  } | null;
}
