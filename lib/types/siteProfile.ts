export interface SiteProfile {
  agentName: string;
  brokerageName?: string;
  teamName?: string;

  personalLogo?: string;
  brokerageLogo?: string;
  brokerageLogoSource?: 'upload' | 'library';

  contactName: string;
  email: string;
  phone?: string;
  officeAddress?: string;
  websiteUrl?: string;

  social: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
    x?: string;
  };

  aboutMe: string;
  targetAreas: string;
  additionalNotes?: string;

  primaryColor: string;
  secondaryColor: string;
  fonts?: {
    heading?: string;
    body?: string;
    subheading?: string;
  };
  fontFiles?: { name: string; url: string }[];

  selectedPages: string[];
  selectedFeatures: string[];

  preferredTemplateId?: string;

  completedAt?: string;
}

export const DEFAULT_SITE_PROFILE: SiteProfile = {
  agentName: '',
  contactName: '',
  email: '',
  social: {},
  aboutMe: '',
  targetAreas: '',
  primaryColor: '#002349',
  secondaryColor: '#DAFF07',
  selectedPages: ['homepage'],
  selectedFeatures: [],
};

export const AVAILABLE_PAGES = [
  { id: 'homepage', label: 'Homepage', locked: true },
  { id: 'buying', label: 'Buying' },
  { id: 'selling', label: 'Selling' },
  { id: 'active-listings', label: 'Active Listings' },
  { id: 'sold-listings', label: 'Sold Listings' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
  { id: 'blog', label: 'Blog' },
  { id: 'testimonials', label: 'Testimonials' },
] as const;

export const AVAILABLE_FEATURES = [
  { id: 'mortgage-calculator', label: 'Mortgage Calculator' },
  { id: 'newsletter-signup', label: 'Newsletter Sign Up' },
  { id: 'social-media-feed', label: 'Social Media Feed' },
  { id: 'google-reviews', label: 'Google Reviews' },
] as const;

export const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', placeholder: '@yourusername' },
  { id: 'facebook', label: 'Facebook', placeholder: 'facebook.com/yourpage' },
  { id: 'tiktok', label: 'TikTok', placeholder: '@yourusername' },
  { id: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@yourchannel' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/yourprofile' },
  { id: 'x', label: 'X (Twitter)', placeholder: '@yourusername' },
] as const;
