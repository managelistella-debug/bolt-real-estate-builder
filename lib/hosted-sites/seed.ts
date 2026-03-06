import { HostedSite } from '@/lib/types';

const ASPEN_COUNTRY_PAGES = [
  '/', '/about', '/buying', '/selling', '/estates',
  '/listings/active', '/listings/sold', '/blog', '/contact', '/privacy',
];

export const ASPEN_COUNTRY_SITE: HostedSite = {
  id: 'hosted-aspen-country',
  name: 'Aspen Muraski – Country Theme',
  description: 'Full-fidelity real estate site with dark green and gold design. Includes all 10 pages, CMS-linked listings and blogs.',
  previewImage: 'https://aspen-country.vercel.app/images/hero-bg.webp',
  siteSlug: 'aspen-country',
  originUrl: 'https://aspen-country.vercel.app',
  pages: ASPEN_COUNTRY_PAGES.map((p) => ({ path: p, htmlKey: p })),
  cmsConfig: {
    listingsSelector: '[data-cms-listings]',
    blogsSelector: '[data-cms-blogs]',
  },
  assignedUserIds: [],
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

export function getDefaultHostedSites(): HostedSite[] {
  return [ASPEN_COUNTRY_SITE];
}
