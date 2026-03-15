export interface Estate {
  id: string;
  address: string;
  description: string; // rich text (HTML string)
  listPrice: number;
  listingStatus: "active" | "sold" | "pending";
  representation?: string; // optional
  neighborhood: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  yearBuilt: number;
  livingArea: number; // square feet
  lotArea: number;
  lotAreaUnit: string; // "acres" | "sq ft" etc.
  taxes: number; // annual
  listingBrokerage: string;
  mlsNumber: string;
  gallery: string[]; // array of image URLs
  thumbnail: string; // selected thumbnail image URL
}

export const estates: Estate[] = [
  {
    id: "e1",
    address: "44012 Range Road 60, Sundre, AB",
    description:
      "<p>A breathtaking 160-acre ranch estate with panoramic mountain views, featuring a custom-built timber frame home with vaulted ceilings, a stone fireplace, and floor-to-ceiling windows that frame the Rockies. The chef&rsquo;s kitchen boasts granite countertops, a large island, and premium appliances.</p><p>The property includes a heated 4-car garage, a fully equipped barn with 8 stalls, fenced paddocks, a riding arena, and year-round creek access. Ideal for equestrian enthusiasts or those seeking a premium rural lifestyle.</p>",
    listPrice: 2850000,
    listingStatus: "active",
    representation: "Seller",
    neighborhood: "Bearberry",
    city: "Sundre",
    bedrooms: 5,
    bathrooms: 4,
    propertyType: "Ranch / Estate",
    yearBuilt: 2015,
    livingArea: 4800,
    lotArea: 160,
    lotAreaUnit: "acres",
    taxes: 8400,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2098001",
    gallery: [
      "/images/featured-1.webp",
      "/images/featured-2.webp",
      "/images/featured-3.webp",
      "/images/hero-bg.webp",
      "/images/selling-card.webp",
    ],
    thumbnail: "/images/featured-1.webp",
  },
  {
    id: "e2",
    address: "33507 Township Road 340, Mountain View County, AB",
    description:
      "<p>An exceptional 320-acre working cattle ranch with a modern 3,600 sq ft home, offering sweeping views of the foothills. The home features an open-concept main floor, a luxurious primary suite, and a walkout basement with a second kitchen and family room.</p><p>Ranch infrastructure includes corrals, a calving barn, hay storage, and cross-fenced pastures with excellent grass. Water rights and a dugout provide reliable water supply. Minutes from Sundre with paved road access.</p>",
    listPrice: 3200000,
    listingStatus: "active",
    representation: "Seller",
    neighborhood: "Mountain View",
    city: "Mountain View County",
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Ranch / Estate",
    yearBuilt: 2010,
    livingArea: 3600,
    lotArea: 320,
    lotAreaUnit: "acres",
    taxes: 9200,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2098002",
    gallery: [
      "/images/featured-2.webp",
      "/images/featured-3.webp",
      "/images/featured-1.webp",
      "/images/hero-bg.webp",
    ],
    thumbnail: "/images/featured-2.webp",
  },
  {
    id: "e3",
    address: "55120 Range Road 52, Sundre, AB",
    description:
      "<p>A stunning 80-acre equestrian estate with a custom-built 4,200 sq ft home featuring handcrafted details throughout. The great room showcases a dramatic stone fireplace and cathedral ceilings, while the gourmet kitchen opens to a sunlit dining area with mountain views.</p><p>Equestrian amenities include a heated 6-stall barn, indoor riding arena, outdoor arena, round pen, and miles of private trails. The property also features a guest cabin, workshop, and mature shelter belts.</p>",
    listPrice: 2450000,
    listingStatus: "active",
    representation: "Seller",
    neighborhood: "Bearberry",
    city: "Sundre",
    bedrooms: 4,
    bathrooms: 4,
    propertyType: "Ranch / Estate",
    yearBuilt: 2012,
    livingArea: 4200,
    lotArea: 80,
    lotAreaUnit: "acres",
    taxes: 7800,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2098003",
    gallery: [
      "/images/featured-3.webp",
      "/images/featured-1.webp",
      "/images/featured-2.webp",
      "/images/hero-bg.webp",
      "/images/selling-card.webp",
    ],
    thumbnail: "/images/featured-3.webp",
  },
  {
    id: "e4",
    address: "22189 Township Road 322, Olds, AB",
    description:
      "<p>A premier 240-acre ranch with a beautifully renovated farmhouse offering 3,200 sq ft of living space. The home blends rustic charm with modern updates, featuring exposed beam ceilings, a renovated kitchen, and a wraparound porch with sunset views.</p><p>The land is fully fenced and cross-fenced with excellent water from two wells and a spring-fed creek. Outbuildings include a 40x60 shop, a livestock barn, and hay storage. Perfect for a working ranch or hobby farm.</p>",
    listPrice: 1950000,
    listingStatus: "active",
    representation: "Dual",
    neighborhood: "Eagle Hill",
    city: "Olds",
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Ranch / Estate",
    yearBuilt: 1985,
    livingArea: 3200,
    lotArea: 240,
    lotAreaUnit: "acres",
    taxes: 6500,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2098004",
    gallery: [
      "/images/featured-1.webp",
      "/images/featured-3.webp",
      "/images/featured-2.webp",
      "/images/hero-bg.webp",
    ],
    thumbnail: "/images/featured-1.webp",
  },
  {
    id: "e5",
    address: "66401 Range Road 64, Caroline, AB",
    description:
      "<p>A secluded 480-acre wilderness ranch bordering crown land, offering unparalleled privacy and recreational opportunities. The custom log home features 3,800 sq ft with a wraparound deck, stone fireplace, and panoramic views of the foothills and mountains.</p><p>The property includes a spring-fed pond, year-round creek, old-growth forest, and open meadows. Infrastructure includes a detached 3-car garage, equipment shed, and livestock facilities. A rare opportunity for hunters, ranchers, or nature enthusiasts.</p>",
    listPrice: 3750000,
    listingStatus: "active",
    representation: "Seller",
    neighborhood: "Clearwater",
    city: "Caroline",
    bedrooms: 5,
    bathrooms: 4,
    propertyType: "Ranch / Estate",
    yearBuilt: 2008,
    livingArea: 3800,
    lotArea: 480,
    lotAreaUnit: "acres",
    taxes: 10200,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2098005",
    gallery: [
      "/images/featured-2.webp",
      "/images/featured-1.webp",
      "/images/featured-3.webp",
      "/images/hero-bg.webp",
      "/images/selling-card.webp",
    ],
    thumbnail: "/images/featured-2.webp",
  },
  {
    id: "e6",
    address: "11098 Range Road 55, Sundre, AB",
    description:
      "<p>A beautifully maintained 40-acre estate just minutes from Sundre, featuring a 2,800 sq ft walkout bungalow with a modern open-concept design. The main floor offers a spacious living room, chef&rsquo;s kitchen, and a primary suite with ensuite spa bath and mountain views.</p><p>The walkout basement includes two additional bedrooms, a family room, and a home gym. The property features a heated shop, three-season greenhouse, landscaped gardens, and fully fenced pastures suitable for horses or hobby farming.</p>",
    listPrice: 1650000,
    listingStatus: "active",
    representation: "Seller",
    neighborhood: "South Sundre",
    city: "Sundre",
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Ranch / Estate",
    yearBuilt: 2019,
    livingArea: 2800,
    lotArea: 40,
    lotAreaUnit: "acres",
    taxes: 5800,
    listingBrokerage: "RE/MAX House of Real Estate",
    mlsNumber: "A2098006",
    gallery: [
      "/images/featured-3.webp",
      "/images/featured-2.webp",
      "/images/featured-1.webp",
      "/images/hero-bg.webp",
    ],
    thumbnail: "/images/featured-3.webp",
  },
];

export function getActiveEstates(): Estate[] {
  return estates.filter((e) => e.listingStatus === "active");
}

export function getEstateById(id: string): Estate | undefined {
  return estates.find((e) => e.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(price);
}
