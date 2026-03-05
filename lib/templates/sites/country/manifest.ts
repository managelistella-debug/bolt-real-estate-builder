import { StartingPointTemplate } from '../../types';
import { Template } from '@/lib/types';

const BASE = '/templates/country/images';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Buying', href: '/buying' },
  { label: 'Selling', href: '/selling' },
  { label: 'Estates', href: '/estates' },
  { label: 'Active Listings', href: '/listings/active' },
  { label: 'Sold', href: '/listings/sold' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const FOOTER_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Estates', href: '/estates' },
  { label: 'Active', href: '/listings/active' },
  { label: 'Sold', href: '/listings/sold' },
  { label: 'Buying', href: '/buying' },
  { label: 'Selling', href: '/selling' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const builderTemplate: Template = {
  id: 'starting-point-country',
  name: 'Country',
  description: 'Dark green with gold accents, serif headings, parallax imagery — ideal for rural, ranch, and country real estate.',
  industry: ['real-estate', 'rural', 'ranch', 'country'],
  previewImage: `${BASE}/hero-bg.webp`,
  defaultGlobalStyles: {
    colors: { primary: '#09312a', secondary: '#daaf3a', accent: '#daaf3a' },
    fontPair: {
      id: 'reckless-lato',
      name: 'Reckless Neue & Lato',
      heading: 'Reckless Neue',
      body: 'Lato',
    },
    button: { variant: 'solid', rounded: 'none' },
    headings: {
      h1: { fontSize: '3.5rem', fontWeight: '400', lineHeight: '1.1' },
      h2: { fontSize: '2.25rem', fontWeight: '400', lineHeight: '1.2' },
      h3: { fontSize: '1.5rem', fontWeight: '400', lineHeight: '1.3' },
    },
    body: { fontSize: '1rem', fontWeight: '300', lineHeight: '1.7' },
  },
  defaultHeader: {
    layout: 'header-a',
    navigation: NAV.map((n, i) => ({ id: `nav-${i + 1}`, label: n.label, url: n.href, order: i + 1 })),
  },
  defaultFooter: {
    layout: 'footer-a',
    menuSource: 'customNavigation',
    navigation: FOOTER_NAV.map((n, i) => ({ id: `fn-${i + 1}`, label: n.label, url: n.href, order: i + 1 })),
    socialLinks: [],
  },
  defaultPages: [
    {
      name: 'Home',
      slug: '/',
      isHomepage: true,
      sections: [
        {
          id: 'sp-hero', type: 'hero', order: 0,
          widget: {
            type: 'hero',
            background: { type: 'image', url: `${BASE}/hero-bg.webp` },
            headline: 'Extraordinary Land. Exceptional Representation.',
            subheadline: 'Specializing in acreages, ranches, and rural properties across Mountain View County.',
            cta: { text: 'View Estates', url: '/estates' },
            alignment: 'center',
          },
        },
        {
          id: 'sp-services', type: 'services', order: 1,
          widget: {
            type: 'services',
            title: 'How Can We Help?',
          },
        },
        {
          id: 'sp-testimonials', type: 'testimonials', order: 2,
          widget: { type: 'testimonials', title: 'Client Testimonials' },
        },
        {
          id: 'sp-listings', type: 'listings', order: 3,
          widget: { type: 'listings', title: 'Featured Listings' },
        },
        {
          id: 'sp-about', type: 'about', order: 4,
          widget: {
            type: 'about',
            title: 'About Us',
            body: 'We bring deep local knowledge, honest advice, and a proven marketing strategy to every client we serve.',
          },
        },
        {
          id: 'sp-contact', type: 'contact-form', order: 5,
          widget: {
            type: 'contact-form',
            formFields: [
              { id: 'f1', type: 'text', label: 'Name', required: true, order: 0 },
              { id: 'f2', type: 'email', label: 'Email', required: true, order: 1 },
              { id: 'f3', type: 'phone', label: 'Phone', required: false, order: 2 },
              { id: 'f4', type: 'textarea', label: 'Message', required: true, order: 3 },
            ],
            buttonText: 'Get In Touch',
            confirmationMessage: "Thank you! We'll be in touch shortly.",
          },
        },
      ],
      seo: {
        metaTitle: 'Country Real Estate | Extraordinary Land, Exceptional Representation',
        metaDescription: 'Specializing in acreages, ranches, and rural properties. Expert representation for buyers and sellers.',
      },
      status: 'published',
    },
    {
      name: 'About',
      slug: '/about',
      isHomepage: false,
      sections: [
        { id: 'sp-about-hero', type: 'hero', order: 0, widget: { type: 'hero', background: { type: 'image', url: `${BASE}/about-image.webp` }, headline: 'About Us', subheadline: 'Local knowledge, honest advice, and results that speak for themselves.', alignment: 'center' } },
        { id: 'sp-about-text', type: 'text-section', order: 1, widget: { type: 'text-section', title: 'Our Story', body: '<p>With deep roots in Mountain View County, we understand the land, the community, and what it takes to achieve exceptional results for our clients.</p>' } },
        { id: 'sp-about-testimonials', type: 'testimonials', order: 2, widget: { type: 'testimonials', title: 'What Our Clients Say' } },
        { id: 'sp-about-cta', type: 'contact-form', order: 3, widget: { type: 'contact-form', formFields: [{ id: 'f1', type: 'text', label: 'Name', required: true, order: 0 }, { id: 'f2', type: 'email', label: 'Email', required: true, order: 1 }, { id: 'f3', type: 'textarea', label: 'Message', required: true, order: 2 }], buttonText: 'Contact Us', confirmationMessage: "Thank you! We'll be in touch." } },
      ],
      seo: { metaTitle: 'About Us | Country Real Estate', metaDescription: 'Learn about our approach to rural real estate.' },
      status: 'published',
    },
    {
      name: 'Buying',
      slug: '/buying',
      isHomepage: false,
      sections: [
        { id: 'sp-buy-hero', type: 'hero', order: 0, widget: { type: 'hero', background: { type: 'image', url: `${BASE}/buying-hero.webp` }, headline: 'Buying', subheadline: 'Your trusted guide to finding the perfect rural property.', alignment: 'center' } },
        { id: 'sp-buy-steps', type: 'steps', order: 1, widget: { type: 'steps', title: 'The Buying Process', items: [{ title: 'Consultation', description: 'We discuss your needs, budget, and lifestyle goals.' }, { title: 'Property Search', description: 'We find properties that match your criteria.' }, { title: 'Viewings & Offers', description: 'We tour properties and negotiate the best deal.' }, { title: 'Due Diligence', description: 'Inspections, financing, and conditions handled expertly.' }, { title: 'Closing', description: 'We guide you through closing to get you the keys.' }] } },
        { id: 'sp-buy-contact', type: 'contact-form', order: 2, widget: { type: 'contact-form', formFields: [{ id: 'f1', type: 'text', label: 'Name', required: true, order: 0 }, { id: 'f2', type: 'email', label: 'Email', required: true, order: 1 }, { id: 'f3', type: 'textarea', label: 'What are you looking for?', required: true, order: 2 }], buttonText: 'Start Your Search', confirmationMessage: "We'll be in touch to help you find your perfect property." } },
      ],
      seo: { metaTitle: 'Buying | Country Real Estate', metaDescription: 'Expert guidance for buying rural properties, acreages, and ranches.' },
      status: 'published',
    },
    {
      name: 'Selling',
      slug: '/selling',
      isHomepage: false,
      sections: [
        { id: 'sp-sell-hero', type: 'hero', order: 0, widget: { type: 'hero', background: { type: 'image', url: `${BASE}/selling-hero.webp` }, headline: 'Selling', subheadline: 'A proven marketing strategy that gets results.', alignment: 'center' } },
        { id: 'sp-sell-services', type: 'image-text-columns', order: 1, widget: { type: 'image-text-columns', title: 'Marketing Services', columns: [{ title: 'Professional Photography', image: `${BASE}/photography.webp`, body: 'High-quality imagery that showcases your property.' }, { title: 'Digital Marketing', image: `${BASE}/social-media-reach.webp`, body: 'Targeted campaigns across social media and listing platforms.' }, { title: 'Print Marketing', image: `${BASE}/print-marketing.webp`, body: 'Custom brochures and direct mail to reach local buyers.' }] } },
        { id: 'sp-sell-steps', type: 'steps', order: 2, widget: { type: 'steps', title: 'The Selling Process', items: [{ title: 'Market Evaluation', description: 'We assess your property and determine optimal pricing.' }, { title: 'Preparation', description: 'Staging, photography, and marketing materials.' }, { title: 'Launch', description: 'Your property hits the market with maximum exposure.' }, { title: 'Offers & Negotiation', description: 'We negotiate to get you the best possible outcome.' }] } },
        { id: 'sp-sell-cta', type: 'contact-form', order: 3, widget: { type: 'contact-form', formFields: [{ id: 'f1', type: 'text', label: 'Name', required: true, order: 0 }, { id: 'f2', type: 'email', label: 'Email', required: true, order: 1 }, { id: 'f3', type: 'textarea', label: 'Tell us about your property', required: true, order: 2 }], buttonText: 'Get a Free Evaluation', confirmationMessage: "Thank you! We'll schedule a consultation." } },
      ],
      seo: { metaTitle: 'Selling | Country Real Estate', metaDescription: 'Proven marketing strategies for selling rural properties and acreages.' },
      status: 'published',
    },
    {
      name: 'Contact',
      slug: '/contact',
      isHomepage: false,
      sections: [
        { id: 'sp-ct-hero', type: 'hero', order: 0, widget: { type: 'hero', background: { type: 'image', url: `${BASE}/contact-banner.webp` }, headline: 'Contact Us', subheadline: "We'd love to hear from you.", alignment: 'center' } },
        { id: 'sp-ct-form', type: 'contact-form', order: 1, widget: { type: 'contact-form', formFields: [{ id: 'f1', type: 'text', label: 'First Name', required: true, order: 0 }, { id: 'f2', type: 'text', label: 'Last Name', required: true, order: 1 }, { id: 'f3', type: 'email', label: 'Email', required: true, order: 2 }, { id: 'f4', type: 'phone', label: 'Phone', required: false, order: 3 }, { id: 'f5', type: 'textarea', label: 'Message', required: true, order: 4 }], buttonText: 'Send Message', confirmationMessage: "Thank you! We'll get back to you shortly." } },
      ],
      seo: { metaTitle: 'Contact | Country Real Estate', metaDescription: 'Get in touch with us for all your rural real estate needs.' },
      status: 'published',
    },
    {
      name: 'Blog',
      slug: '/blog',
      isHomepage: false,
      sections: [
        { id: 'sp-blog-feed', type: 'blog-feed', order: 0, widget: { type: 'blog-feed', title: 'Blog' } },
      ],
      seo: { metaTitle: 'Blog | Country Real Estate', metaDescription: 'Insights, tips, and market updates for rural real estate.' },
      status: 'published',
    },
    {
      name: 'Active Listings',
      slug: '/listings/active',
      isHomepage: false,
      sections: [
        { id: 'sp-active', type: 'listings', order: 0, widget: { type: 'listings', title: 'Active Listings' } },
      ],
      seo: { metaTitle: 'Active Listings | Country Real Estate', metaDescription: 'Browse our current active listings.' },
      status: 'published',
    },
    {
      name: 'Sold Listings',
      slug: '/listings/sold',
      isHomepage: false,
      sections: [
        { id: 'sp-sold', type: 'listings', order: 0, widget: { type: 'listings', title: 'Sold Listings' } },
      ],
      seo: { metaTitle: 'Sold Listings | Country Real Estate', metaDescription: 'View our recently sold properties.' },
      status: 'published',
    },
    {
      name: 'Estates',
      slug: '/estates',
      isHomepage: false,
      sections: [
        { id: 'sp-estates-hero', type: 'hero', order: 0, widget: { type: 'hero', background: { type: 'image', url: `${BASE}/estate-hero.webp` }, headline: 'Estates & Ranch Properties', subheadline: 'Exclusive rural estates and ranch properties.', alignment: 'center' } },
        { id: 'sp-estates-list', type: 'listings', order: 1, widget: { type: 'listings', title: 'Estate Properties' } },
      ],
      seo: { metaTitle: 'Estates & Ranch Properties | Country Real Estate', metaDescription: 'Browse exclusive estate and ranch properties.' },
      status: 'published',
    },
    {
      name: 'Privacy Policy',
      slug: '/privacy',
      isHomepage: false,
      sections: [
        { id: 'sp-privacy', type: 'text-section', order: 0, widget: { type: 'text-section', title: 'Privacy Policy', body: '<p>This privacy policy outlines how we collect, use, and protect your personal information.</p>' } },
      ],
      seo: { metaTitle: 'Privacy Policy', metaDescription: 'Our privacy policy.' },
      status: 'published',
    },
  ],
};

export const countryTemplate: StartingPointTemplate = {
  id: 'starting-point-country',
  name: 'Country',
  description: 'Dark green with gold accents, serif headings, parallax imagery. A fully built-out site with 10+ pages — ideal for rural, ranch, and country real estate agents.',
  previewImage: `${BASE}/hero-bg.webp`,
  visible: true,
  assignedUserIds: [],
  industry: ['real-estate', 'rural', 'ranch', 'country'],
  createdAt: new Date('2026-03-05'),
  updatedAt: new Date('2026-03-05'),

  colors: {
    primary: '#09312a',
    secondary: '#daaf3a',
    accent: '#daaf3a',
    background: '#09312a',
    text: '#ffffff',
  },
  fonts: {
    heading: 'Reckless Neue',
    body: 'Lato',
    headingFile: '/templates/country/fonts/RecklessNeue-Regular.ttf',
    bodyFile: '/templates/country/fonts/Lato-Regular.ttf',
  },

  pages: [
    { name: 'Home', slug: '/', description: 'Hero, services, testimonials, featured listings, about, contact form', sections: ['hero', 'services', 'testimonials', 'listings', 'about', 'contact-form'] },
    { name: 'About', slug: '/about', description: 'Hero, story, testimonials, CTA', sections: ['hero', 'text-section', 'testimonials', 'contact-form'] },
    { name: 'Buying', slug: '/buying', description: 'Hero, buying process steps, land expertise, mortgage calculator, contact', sections: ['hero', 'steps', 'contact-form'] },
    { name: 'Selling', slug: '/selling', description: 'Hero, marketing services, selling process, consultation CTA', sections: ['hero', 'image-text-columns', 'steps', 'contact-form'] },
    { name: 'Estates', slug: '/estates', description: 'Hero, estate listings grid', sections: ['hero', 'listings'] },
    { name: 'Active Listings', slug: '/listings/active', description: 'Active listings grid with pagination', sections: ['listings'] },
    { name: 'Sold Listings', slug: '/listings/sold', description: 'Sold listings grid', sections: ['listings'] },
    { name: 'Blog', slug: '/blog', description: 'Blog post grid', sections: ['blog-feed'] },
    { name: 'Contact', slug: '/contact', description: 'Hero, contact form with map', sections: ['hero', 'contact-form'] },
    { name: 'Privacy Policy', slug: '/privacy', description: 'Privacy policy text', sections: ['text-section'] },
  ],

  headerNav: NAV,
  footerNav: FOOTER_NAV,

  sampleListingsCount: 28,
  sampleBlogPostsCount: 13,

  assetsBasePath: '/templates/country',

  builderTemplate,
};
