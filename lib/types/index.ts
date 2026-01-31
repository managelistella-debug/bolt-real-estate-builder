// User and Authentication Types
export type UserRole = 'super_admin' | 'internal_admin' | 'business_user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  businessId?: string; // Only for business users
}

// Website and Page Types
export interface Website {
  id: string;
  name: string;
  userId: string;
  templateId: string;
  domain?: string;
  published: boolean;
  globalStyles: GlobalStyles;
  header: HeaderConfig;
  footer: FooterConfig;
  pages: Page[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  websiteId: string;
  name: string;
  slug: string;
  isHomepage: boolean;
  sections: Section[];
  seo: SEOSettings;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  industry: string[];
  previewImage: string;
  defaultGlobalStyles: GlobalStyles;
  defaultHeader: HeaderConfig;
  defaultFooter: FooterConfig;
  defaultPages: Omit<Page, 'id' | 'websiteId' | 'createdAt' | 'updatedAt'>[];
}

// Section and Widget Types
export type SectionType = 'hero' | 'about' | 'services' | 'contact';

export interface Section {
  id: string;
  type: SectionType;
  order: number;
  widget: Widget;
}

export type Widget = HeroWidget | AboutWidget | ServicesWidget | ContactWidget;

export interface HeroWidget {
  type: 'hero';
  background: {
    type: 'image' | 'video';
    url: string;
  };
  headline: string;
  subheadline: string;
  cta: {
    text: string;
    url: string;
  };
  alignment: 'left' | 'center' | 'right';
}

export interface AboutWidget {
  type: 'about';
  content: string;
  image: string;
  cta?: {
    text: string;
    url: string;
  };
}

export interface ServicesWidget {
  type: 'services';
  title: string;
  services: ServiceCard[];
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface ContactWidget {
  type: 'contact';
  formFields: FormField[];
  buttonText: string;
  confirmationMessage: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'custom';
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
}

// Global Styles Types
export interface GlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fontPair: FontPair;
  button: ButtonStyle;
  headings: {
    h1: TypographyStyle;
    h2: TypographyStyle;
    h3: TypographyStyle;
  };
  body: TypographyStyle;
}

export interface FontPair {
  id: string;
  name: string;
  heading: string;
  body: string;
}

export interface ButtonStyle {
  variant: 'solid' | 'outline' | 'ghost';
  rounded: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export interface TypographyStyle {
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
}

// Header and Footer Types
export type HeaderLayout = 'header-a' | 'header-b' | 'header-c';
export type FooterLayout = 'footer-a' | 'footer-b' | 'footer-c';

export interface HeaderConfig {
  layout: HeaderLayout;
  logo?: string;
  navigation: NavItem[];
  phone?: string;
  email?: string;
}

export interface FooterConfig {
  layout: FooterLayout;
  logo?: string;
  navigation: NavItem[];
  phone?: string;
  email?: string;
  address?: string;
  socialLinks: SocialLink[];
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
  order: number;
}

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube';
  url: string;
}

// Media Types
export interface MediaAsset {
  id: string;
  userId: string;
  filename: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: Date;
}

// SEO Types
export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  targetKeyword?: string;
}

// CRM Types
export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'closed' | 'lost';

export interface Lead {
  id: string;
  websiteId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  status: LeadStatus;
  tags: string[];
  sourcePage: string;
  ownerId?: string;
  customFields?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  assignedUserId?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface Note {
  id: string;
  leadId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface ActivityLogEntry {
  id: string;
  leadId: string;
  type: 'status_change' | 'note_added' | 'task_created' | 'task_completed' | 'lead_created';
  description: string;
  userId?: string;
  createdAt: Date;
}
