import { Template } from '@/lib/types';

const RE_NAV = [
  { id: 'nav-1', label: 'Buying', url: '/buying', order: 1 },
  { id: 'nav-2', label: 'Selling', url: '/selling', order: 2 },
  { id: 'nav-3', label: 'Active Listings', url: '/listings/active', order: 3 },
  { id: 'nav-4', label: 'About', url: '/about', order: 4 },
  { id: 'nav-5', label: 'Contact', url: '/contact', order: 5 },
];

const RE_FOOTER_NAV = [
  { id: 'fn-1', label: 'Privacy Policy', url: '/privacy', order: 1 },
  { id: 'fn-2', label: 'Terms of Service', url: '/terms', order: 2 },
];

export const mockTemplates: Template[] = [
  {
    id: 'template-luxury-classic',
    name: 'Luxury Classic',
    description: 'Elegant serif typography, navy palette, full-width hero imagery for luxury real estate.',
    industry: ['real-estate', 'luxury'],
    previewImage: 'https://placehold.co/800x600/002349/ffffff?text=Luxury+Classic',
    defaultGlobalStyles: {
      colors: { primary: '#002349', secondary: '#C9A96E', accent: '#002349' },
      fontPair: { id: 'playfair-dm', name: 'Playfair Display & DM Sans', heading: 'Playfair Display', body: 'DM Sans' },
      button: { variant: 'solid', rounded: 'none' },
      headings: {
        h1: { fontSize: '3.5rem', fontWeight: '700', lineHeight: '1.1' },
        h2: { fontSize: '2.25rem', fontWeight: '600', lineHeight: '1.2' },
        h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.3' },
      },
      body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' },
    },
    defaultHeader: { layout: 'header-a', navigation: RE_NAV },
    defaultFooter: { layout: 'footer-a', menuSource: 'customNavigation', navigation: RE_FOOTER_NAV, socialLinks: [] },
    defaultPages: [
      {
        name: 'Home', slug: '/', isHomepage: true,
        sections: [
          { id: 's-hero', type: 'hero', order: 0, widget: { type: 'hero', background: { type: 'image', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80' }, headline: 'Luxury Properties, Expert Representation', subheadline: 'Showcasing exceptional homes with concierge-level client service.', cta: { text: 'View Exclusive Listings', url: '/listings/active' }, alignment: 'center' } },
          { id: 's-listings', type: 'listings', order: 1, widget: { type: 'listings', title: 'Exclusive Listings' } },
          { id: 's-about', type: 'about', order: 2, widget: { type: 'about', title: 'Why Clients Work With Us', body: 'We combine local market expertise, modern marketing, and high-touch guidance.' } },
          { id: 's-contact', type: 'contact-form', order: 3, widget: { type: 'contact-form', formFields: [{ id: 'f1', type: 'text', label: 'Name', required: true, order: 0 }, { id: 'f2', type: 'email', label: 'Email', required: true, order: 1 }, { id: 'f3', type: 'phone', label: 'Phone', required: false, order: 2 }, { id: 'f4', type: 'textarea', label: 'Message', required: true, order: 3 }], buttonText: 'Get In Touch', confirmationMessage: 'Thank you! We\'ll be in touch shortly.' } },
        ],
        seo: { metaTitle: 'Luxury Real Estate | Find Your Dream Home', metaDescription: 'Expert representation for luxury real estate buyers and sellers.' },
        status: 'published',
      },
    ],
  },
  {
    id: 'template-modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean sans-serif, dark tones, rounded corners, generous whitespace for a modern feel.',
    industry: ['real-estate', 'modern'],
    previewImage: 'https://placehold.co/800x600/111827/ffffff?text=Modern+Minimal',
    defaultGlobalStyles: {
      colors: { primary: '#111827', secondary: '#6B7280', accent: '#111827' },
      fontPair: { id: 'dm-inter', name: 'DM Sans & Inter', heading: 'DM Sans', body: 'Inter' },
      button: { variant: 'solid', rounded: 'lg' },
      headings: {
        h1: { fontSize: '3rem', fontWeight: '700', lineHeight: '1.15' },
        h2: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.25' },
        h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.35' },
      },
      body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.7' },
    },
    defaultHeader: { layout: 'header-b', navigation: RE_NAV },
    defaultFooter: { layout: 'footer-b', menuSource: 'customNavigation', navigation: RE_FOOTER_NAV, socialLinks: [] },
    defaultPages: [
      {
        name: 'Home', slug: '/', isHomepage: true,
        sections: [
          { id: 's-hero', type: 'hero', order: 0, widget: { type: 'hero', background: { type: 'image', url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1800&q=80' }, headline: 'Modern Real Estate For Today', subheadline: 'A clean, fast way to discover listings and schedule showings.', cta: { text: 'Browse Listings', url: '/listings/active' }, alignment: 'left' } },
          { id: 's-listings', type: 'listings', order: 1, widget: { type: 'listings', title: 'Featured Properties' } },
          { id: 's-contact', type: 'contact-form', order: 2, widget: { type: 'contact-form', formFields: [{ id: 'f1', type: 'text', label: 'Name', required: true, order: 0 }, { id: 'f2', type: 'email', label: 'Email', required: true, order: 1 }, { id: 'f3', type: 'textarea', label: 'Message', required: true, order: 2 }], buttonText: 'Send Message', confirmationMessage: 'Thanks! We\'ll respond within 24 hours.' } },
        ],
        seo: { metaTitle: 'Modern Realty | Discover Your Next Home', metaDescription: 'Clean, modern real estate experience for buyers and sellers.' },
        status: 'published',
      },
    ],
  },
  {
    id: 'template-warm-traditional',
    name: 'Warm Traditional',
    description: 'Warm copper accents, classic Garamond typography, an inviting and trustworthy aesthetic.',
    industry: ['real-estate', 'traditional'],
    previewImage: 'https://placehold.co/800x600/3d2b1f/f5e6d3?text=Warm+Traditional',
    defaultGlobalStyles: {
      colors: { primary: '#141414', secondary: '#c28563', accent: '#c28563' },
      fontPair: { id: 'cormorant-dm', name: 'Cormorant Garamond & DM Sans', heading: 'Cormorant Garamond', body: 'DM Sans' },
      button: { variant: 'solid', rounded: 'md' },
      headings: {
        h1: { fontSize: '3.5rem', fontWeight: '600', lineHeight: '1.1' },
        h2: { fontSize: '2.25rem', fontWeight: '500', lineHeight: '1.25' },
        h3: { fontSize: '1.75rem', fontWeight: '500', lineHeight: '1.3' },
      },
      body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.7' },
    },
    defaultHeader: { layout: 'header-a', navigation: RE_NAV },
    defaultFooter: { layout: 'footer-a', menuSource: 'customNavigation', navigation: RE_FOOTER_NAV, socialLinks: [] },
    defaultPages: [
      {
        name: 'Home', slug: '/', isHomepage: true,
        sections: [
          { id: 's-hero', type: 'hero', order: 0, widget: { type: 'hero', background: { type: 'image', url: 'https://images.unsplash.com/photo-1600585154154-712e664d8f7b?auto=format&fit=crop&w=1800&q=80' }, headline: 'Your Trusted Real Estate Partner', subheadline: 'Helping families find their perfect home for over a decade.', cta: { text: 'Start Your Search', url: '/listings/active' }, alignment: 'center' } },
          { id: 's-listings', type: 'listings', order: 1, widget: { type: 'listings', title: 'Current Listings' } },
          { id: 's-testimonials', type: 'testimonials', order: 2, widget: { type: 'testimonials', title: 'What Our Clients Say' } },
          { id: 's-contact', type: 'contact-form', order: 3, widget: { type: 'contact-form', formFields: [{ id: 'f1', type: 'text', label: 'Full Name', required: true, order: 0 }, { id: 'f2', type: 'email', label: 'Email', required: true, order: 1 }, { id: 'f3', type: 'phone', label: 'Phone', required: false, order: 2 }, { id: 'f4', type: 'textarea', label: 'How can we help?', required: true, order: 3 }], buttonText: 'Contact Us', confirmationMessage: 'Thank you for reaching out!' } },
        ],
        seo: { metaTitle: 'Trusted Real Estate | Your Partner in Home Buying', metaDescription: 'Warm, personalized real estate services for buyers and sellers.' },
        status: 'published',
      },
    ],
  },
  {
    id: 'template-bold-contemporary',
    name: 'Bold Contemporary',
    description: 'High-contrast dark palette, gold accents, bold headings for maximum visual impact.',
    industry: ['real-estate', 'bold'],
    previewImage: 'https://placehold.co/800x600/0B0F19/C9A96E?text=Bold+Contemporary',
    defaultGlobalStyles: {
      colors: { primary: '#0B0F19', secondary: '#C9A96E', accent: '#C9A96E' },
      fontPair: { id: 'montserrat-inter', name: 'Montserrat & Inter', heading: 'Montserrat', body: 'Inter' },
      button: { variant: 'solid', rounded: 'sm' },
      headings: {
        h1: { fontSize: '4rem', fontWeight: '800', lineHeight: '1' },
        h2: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.15' },
        h3: { fontSize: '1.75rem', fontWeight: '700', lineHeight: '1.25' },
      },
      body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' },
    },
    defaultHeader: { layout: 'header-c', navigation: RE_NAV },
    defaultFooter: { layout: 'footer-c', menuSource: 'customNavigation', navigation: RE_FOOTER_NAV, socialLinks: [] },
    defaultPages: [
      {
        name: 'Home', slug: '/', isHomepage: true,
        sections: [
          { id: 's-hero', type: 'hero', order: 0, widget: { type: 'hero', background: { type: 'image', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1800&q=80' }, headline: 'Make a Bold Move', subheadline: 'Premium properties. Exceptional results. Unmatched service.', cta: { text: 'Explore Properties', url: '/listings/active' }, alignment: 'center' } },
          { id: 's-listings', type: 'listings', order: 1, widget: { type: 'listings', title: 'Premium Listings' } },
          { id: 's-about', type: 'about', order: 2, widget: { type: 'about', title: 'Driven by Results', body: 'We approach every transaction with strategy, expertise, and relentless dedication to our clients.' } },
          { id: 's-contact', type: 'contact-form', order: 3, widget: { type: 'contact-form', formFields: [{ id: 'f1', type: 'text', label: 'Name', required: true, order: 0 }, { id: 'f2', type: 'email', label: 'Email', required: true, order: 1 }, { id: 'f3', type: 'textarea', label: 'Message', required: true, order: 2 }], buttonText: 'Get Started', confirmationMessage: 'We\'ll be in touch soon.' } },
        ],
        seo: { metaTitle: 'Bold Contemporary Real Estate', metaDescription: 'Premium properties with exceptional results and unmatched service.' },
        status: 'published',
      },
    ],
  },
];
