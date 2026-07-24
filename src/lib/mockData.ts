export interface CameraSpecs {
  sensor: string;
  resolution: string;
  isoRange: string;
  mount?: string;
  weight: string;
}

export interface CameraProduct {
  id: string;
  databaseId?: number; // Compatible with WPGraphQL node database ID
  title: string;
  slug: string;
  price: number;
  formattedPrice: string;
  originalPrice?: number;
  category: 'Rangefinder' | 'Mirrorless' | 'Medium Format' | 'Cinema';
  badge?: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  imageUrl: string;
  description: string;
  cameraSpecs: CameraSpecs;
}

export interface HeroAdvertBanner {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  bannerImageUrl: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  badgeText: string;
  offerNote?: string;
}

export const MOCK_HERO_BANNER: HeroAdvertBanner = {
  id: "hero-adv-01",
  title: "Divine Favour Fotoshop",
  subtitle: "Your one-stop destination in Aba for quality photography and videography accessories. Reliable, durable, and affordable gear for beginners and professionals.",
  tagline: "ABA, ABIA STATE",
  bannerImageUrl: "/hero-advert-banner.png",
  primaryCtaText: "Shop Accessories",
  secondaryCtaText: "View Store Location",
  badgeText: "TRUSTED HUB FOR CREATORS",
  offerNote: "Cameras, lenses, tripods, lighting, mics & storage",
};

export const MOCK_PRODUCTS: CameraProduct[] = [
  {
    id: "cam-01",
    databaseId: 101,
    title: "Leica M11 Rangefinder Digital Camera",
    slug: "leica-m11-rangefinder",
    price: 8995,
    formattedPrice: "₦8,995.00",
    originalPrice: 9495,
    category: "Rangefinder",
    badge: "FLAGSHIP",
    rating: 4.9,
    reviewsCount: 42,
    inStock: true,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
    description: "Iconic rangefinder precision featuring a triple-resolution BSI CMOS sensor (60MP/36MP/18MP) and legendary ergonomics.",
    cameraSpecs: {
      sensor: "Full-Frame BSI CMOS",
      resolution: "60.3 Megapixels",
      isoRange: "ISO 64 to 50,000",
      mount: "Leica M Mount",
      weight: "530 g"
    }
  },
  {
    id: "cam-02",
    databaseId: 102,
    title: "Hasselblad X2D 100C Medium Format",
    slug: "hasselblad-x2d-100c",
    price: 8199,
    formattedPrice: "₦8,199.00",
    category: "Medium Format",
    badge: "STUDIO CHOICE",
    rating: 5.0,
    reviewsCount: 28,
    inStock: true,
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80",
    description: "100-megapixel back-illuminated medium format sensor paired with 5-axis 7-stop in-body image stabilization.",
    cameraSpecs: {
      sensor: "Medium Format BSI CMOS",
      resolution: "100 Megapixels",
      isoRange: "ISO 64 to 25,600",
      mount: "Hasselblad X Mount",
      weight: "895 g"
    }
  },
  {
    id: "cam-03",
    databaseId: 103,
    title: "Sony α1 II Mirrorless Camera Body",
    slug: "sony-a1-ii-mirrorless",
    price: 6498,
    formattedPrice: "₦6,498.00",
    originalPrice: 6899,
    category: "Mirrorless",
    badge: "BEST SELLER",
    rating: 4.8,
    reviewsCount: 65,
    inStock: true,
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80",
    description: "Ultimate hybrid powerhouse delivering 50.1MP at 30 fps with AI autofocus processing and 8K 30p video capture.",
    cameraSpecs: {
      sensor: "Full-Frame Stacked CMOS",
      resolution: "50.1 Megapixels",
      isoRange: "ISO 100 to 32,000",
      mount: "Sony E-Mount",
      weight: "737 g"
    }
  },
  {
    id: "cam-04",
    databaseId: 104,
    title: "RED V-RAPTOR XL 8K VV Cinema Package",
    slug: "red-v-raptor-xl-8k-cinema",
    price: 34995,
    formattedPrice: "₦34,995.00",
    category: "Cinema",
    badge: "CINEMA GRADE",
    rating: 5.0,
    reviewsCount: 14,
    inStock: true,
    imageUrl: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=1000&q=80",
    description: "8K Large Format sensor offering 17+ stops of dynamic range and 8K at up to 120 fps REDCODE RAW.",
    cameraSpecs: {
      sensor: "8K V-RAPTOR VV 35.4MP",
      resolution: "8K DCI (8192 x 4320)",
      isoRange: "ISO 250 to 12,800",
      mount: "Interchangeable PL/RF",
      weight: "3620 g"
    }
  },
  {
    id: "cam-05",
    databaseId: 105,
    title: "Fujifilm GFX 100 II Medium Format",
    slug: "fujifilm-gfx-100-ii",
    price: 7499,
    formattedPrice: "₦7,499.00",
    category: "Medium Format",
    badge: "NEW RELEASE",
    rating: 4.9,
    reviewsCount: 19,
    inStock: true,
    imageUrl: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1000&q=80",
    description: "Next-generation 102MP high-speed sensor powered by X-Processor 5 and 8-stop IBIS performance.",
    cameraSpecs: {
      sensor: "GFX 102MP II HS CMOS",
      resolution: "102 Megapixels",
      isoRange: "ISO 80 to 12,800",
      mount: "Fujifilm G Mount",
      weight: "948 g"
    }
  },
  {
    id: "cam-06",
    databaseId: 106,
    title: "Canon EOS R3 Full-Frame Mirrorless",
    slug: "canon-eos-r3-mirrorless",
    price: 4999,
    formattedPrice: "₦4,999.00",
    originalPrice: 5499,
    category: "Mirrorless",
    badge: "PRO ACTION",
    rating: 4.7,
    reviewsCount: 38,
    inStock: true,
    imageUrl: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1000&q=80",
    description: "Stacked back-illuminated 24.1MP CMOS sensor with revolutionary Eye Control AF system and 30fps silent tracking.",
    cameraSpecs: {
      sensor: "Stacked BSI CMOS",
      resolution: "24.1 Megapixels",
      isoRange: "ISO 100 to 102,400",
      mount: "Canon RF Mount",
      weight: "822 g"
    }
  }
];

export const STORE_CATEGORIES = [
  { id: "all", name: "All Cameras", count: MOCK_PRODUCTS.length },
  { id: "Rangefinder", name: "Rangefinder", count: MOCK_PRODUCTS.filter(p => p.category === 'Rangefinder').length },
  { id: "Mirrorless", name: "Mirrorless", count: MOCK_PRODUCTS.filter(p => p.category === 'Mirrorless').length },
  { id: "Medium Format", name: "Medium Format", count: MOCK_PRODUCTS.filter(p => p.category === 'Medium Format').length },
  { id: "Cinema", name: "Cinema", count: MOCK_PRODUCTS.filter(p => p.category === 'Cinema').length },
];
