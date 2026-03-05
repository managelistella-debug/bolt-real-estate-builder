export interface PublicListing {
  slug: string;
  title: string;
  price: string;
  beds: number;
  baths: number;
  city: string;
  status: 'active' | 'sold';
  image: string;
  description: string;
}

export const stockHeroImage =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80';

export const stockSectionImages = {
  buying:
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80',
  selling:
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
  about:
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
  contact:
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=80',
};

export const publicListings: PublicListing[] = [
  {
    slug: '123-main-st',
    title: '123 Main St',
    price: '$675,000',
    beds: 3,
    baths: 2,
    city: 'Beverly Hills',
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80',
    description:
      'Elegant move-in-ready property with bright interiors, premium finishes, and a landscaped yard.',
  },
  {
    slug: '88-oak-ave',
    title: '88 Oak Ave',
    price: '$849,000',
    beds: 4,
    baths: 3,
    city: 'Bel Air',
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=80',
    description:
      'Contemporary home featuring an open floor plan, chef kitchen, and resort-style outdoor living.',
  },
  {
    slug: '42-sunset-dr',
    title: '42 Sunset Dr',
    price: '$539,000',
    beds: 2,
    baths: 2,
    city: 'West Hollywood',
    status: 'active',
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
    description:
      'Stylish urban retreat with curated design details and easy access to top dining and shopping.',
  },
  {
    slug: '12-cedar-ln',
    title: '12 Cedar Ln',
    price: '$710,000',
    beds: 3,
    baths: 2,
    city: 'Brentwood',
    status: 'sold',
    image:
      'https://images.unsplash.com/photo-1600585154154-712e664d8f7b?auto=format&fit=crop&w=1400&q=80',
    description:
      'Recently sold residence with spacious entertaining areas, designer upgrades, and mature landscaping.',
  },
  {
    slug: '304-ridge-rd',
    title: '304 Ridge Rd',
    price: '$965,000',
    beds: 5,
    baths: 4,
    city: 'Pacific Palisades',
    status: 'sold',
    image:
      'https://images.unsplash.com/photo-1600607687126-8a6f450f1b17?auto=format&fit=crop&w=1400&q=80',
    description:
      'Signature luxury estate sold with multiple offers, showcasing custom architecture and panoramic views.',
  },
  {
    slug: '900-park-pl',
    title: '900 Park Pl',
    price: '$580,000',
    beds: 3,
    baths: 2,
    city: 'Santa Monica',
    status: 'sold',
    image:
      'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?auto=format&fit=crop&w=1400&q=80',
    description:
      'Charming coastal home recently sold with refreshed interiors and strong neighborhood demand.',
  },
];

export function getListingsByStatus(status: 'active' | 'sold') {
  return publicListings.filter((listing) => listing.status === status);
}

export function getPublicListing(slug: string, status?: 'active' | 'sold') {
  return publicListings.find(
    (listing) => listing.slug === slug && (status ? listing.status === status : true),
  );
}
