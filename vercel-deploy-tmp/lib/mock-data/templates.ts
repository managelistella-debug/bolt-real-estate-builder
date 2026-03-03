import { Template } from '@/lib/types';

export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Clean Professional',
    description: 'Perfect for plumbers, electricians, and general contractors',
    industry: ['plumbing', 'electrical', 'contractors'],
    previewImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    defaultGlobalStyles: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#0ea5e9',
      },
      fontPair: {
        id: 'inter-roboto',
        name: 'Inter & Roboto',
        heading: 'Inter',
        body: 'Roboto',
      },
      button: {
        variant: 'solid',
        rounded: 'md',
      },
      headings: {
        h1: { fontSize: '3rem', fontWeight: '700', lineHeight: '1.2' },
        h2: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.3' },
        h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
      },
      body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' },
    },
    defaultHeader: {
      layout: 'header-a',
      navigation: [
        { id: 'nav-1', label: 'Home', url: '/', order: 1 },
        { id: 'nav-2', label: 'About', url: '/about', order: 2 },
        { id: 'nav-3', label: 'Services', url: '/services', order: 3 },
        { id: 'nav-4', label: 'Contact', url: '/contact', order: 4 },
      ],
    },
    defaultFooter: {
      layout: 'footer-a',
      menuSource: 'customNavigation',
      navigation: [
        { id: 'footer-nav-1', label: 'Privacy Policy', url: '/privacy', order: 1 },
        { id: 'footer-nav-2', label: 'Terms of Service', url: '/terms', order: 2 },
      ],
      socialLinks: [],
    },
    defaultPages: [
      {
        name: 'Home',
        slug: '/',
        isHomepage: true,
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            order: 0,
            widget: {
              type: 'hero',
              background: {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&h=1080&fit=crop',
              },
              headline: 'Professional Services You Can Trust',
              subheadline: 'Quality workmanship and reliable service for your home or business',
              cta: {
                text: 'Get a Free Quote',
                url: '/contact',
              },
              alignment: 'center',
            },
          },
          {
            id: 'section-2',
            type: 'services',
            order: 1,
            widget: {
              type: 'services',
              title: 'Our Services',
              services: [
                {
                  id: 'service-1',
                  title: 'Service One',
                  description: 'High-quality service tailored to your needs',
                },
                {
                  id: 'service-2',
                  title: 'Service Two',
                  description: 'Professional solutions for residential and commercial',
                },
                {
                  id: 'service-3',
                  title: 'Service Three',
                  description: 'Expert maintenance and emergency repairs',
                },
              ],
            },
          },
          {
            id: 'section-3',
            type: 'contact',
            order: 2,
            widget: {
              type: 'contact',
              formFields: [
                { id: 'field-1', type: 'text', label: 'First Name', required: true, order: 0 },
                { id: 'field-2', type: 'text', label: 'Last Name', required: true, order: 1 },
                { id: 'field-3', type: 'email', label: 'Email', required: true, order: 2 },
                { id: 'field-4', type: 'phone', label: 'Phone', required: false, order: 3 },
                { id: 'field-5', type: 'textarea', label: 'Message', required: true, order: 4 },
              ],
              buttonText: 'Send Message',
              confirmationMessage: 'Thank you! We\'ll get back to you soon.',
            },
          },
        ],
        seo: {
          metaTitle: 'Professional Services | Your Business Name',
          metaDescription: 'Quality professional services for your home or business. Contact us today for a free quote.',
        },
        status: 'published',
      },
    ],
  },
  {
    id: 'template-2',
    name: 'Modern Minimalist',
    description: 'Sleek design for cleaning companies and landscapers',
    industry: ['cleaning', 'landscaping'],
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    defaultGlobalStyles: {
      colors: {
        primary: '#10b981',
        secondary: '#6b7280',
        accent: '#059669',
      },
      fontPair: {
        id: 'poppins-lato',
        name: 'Poppins & Lato',
        heading: 'Poppins',
        body: 'Lato',
      },
      button: {
        variant: 'solid',
        rounded: 'lg',
      },
      headings: {
        h1: { fontSize: '3.5rem', fontWeight: '700', lineHeight: '1.1' },
        h2: { fontSize: '2.25rem', fontWeight: '600', lineHeight: '1.2' },
        h3: { fontSize: '1.75rem', fontWeight: '600', lineHeight: '1.3' },
      },
      body: { fontSize: '1.125rem', fontWeight: '400', lineHeight: '1.7' },
    },
    defaultHeader: {
      layout: 'header-b',
      navigation: [
        { id: 'nav-1', label: 'Home', url: '/', order: 1 },
        { id: 'nav-2', label: 'Services', url: '/services', order: 2 },
        { id: 'nav-3', label: 'About', url: '/about', order: 3 },
        { id: 'nav-4', label: 'Contact', url: '/contact', order: 4 },
      ],
    },
    defaultFooter: {
      layout: 'footer-b',
      menuSource: 'customNavigation',
      navigation: [],
      socialLinks: [],
    },
    defaultPages: [
      {
        name: 'Home',
        slug: '/',
        isHomepage: true,
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            order: 0,
            widget: {
              type: 'hero',
              background: {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop',
              },
              headline: 'Transform Your Space',
              subheadline: 'Expert service with attention to detail',
              cta: {
                text: 'Book Now',
                url: '/contact',
              },
              alignment: 'left',
            },
          },
        ],
        seo: {
          metaTitle: 'Transform Your Space | Your Business',
          metaDescription: 'Expert professional services with attention to detail.',
        },
        status: 'published',
      },
    ],
  },
  {
    id: 'template-3',
    name: 'Bold & Powerful',
    description: 'Strong presence for HVAC and construction businesses',
    industry: ['hvac', 'construction'],
    previewImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    defaultGlobalStyles: {
      colors: {
        primary: '#ef4444',
        secondary: '#737373',
        accent: '#dc2626',
      },
      fontPair: {
        id: 'montserrat-opensans',
        name: 'Montserrat & Open Sans',
        heading: 'Montserrat',
        body: 'Open Sans',
      },
      button: {
        variant: 'solid',
        rounded: 'sm',
      },
      headings: {
        h1: { fontSize: '4rem', fontWeight: '800', lineHeight: '1' },
        h2: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' },
        h3: { fontSize: '2rem', fontWeight: '700', lineHeight: '1.3' },
      },
      body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' },
    },
    defaultHeader: {
      layout: 'header-c',
      navigation: [
        { id: 'nav-1', label: 'Home', url: '/', order: 1 },
        { id: 'nav-2', label: 'Services', url: '/services', order: 2 },
        { id: 'nav-3', label: 'Contact', url: '/contact', order: 3 },
      ],
    },
    defaultFooter: {
      layout: 'footer-c',
      menuSource: 'customNavigation',
      navigation: [],
      socialLinks: [],
    },
    defaultPages: [
      {
        name: 'Home',
        slug: '/',
        isHomepage: true,
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            order: 0,
            widget: {
              type: 'hero',
              background: {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop',
              },
              headline: 'Expert Solutions, Every Time',
              subheadline: '24/7 emergency service available',
              cta: {
                text: 'Call Now',
                url: 'tel:5555555555',
              },
              alignment: 'center',
            },
          },
        ],
        seo: {
          metaTitle: 'Expert Solutions | Your Business',
          metaDescription: '24/7 emergency service available for all your needs.',
        },
        status: 'published',
      },
    ],
  },
];
