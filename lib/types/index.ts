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
export type SectionType = 'hero' | 'headline' | 'image-text' | 'image-gallery' | 'custom-code' | 'image-navigation' | 'contact-form' | 'about' | 'services' | 'contact';

export interface Section {
  id: string;
  type: SectionType;
  order: number;
  widget: Widget;
}

export type Widget = HeroWidget | HeadlineWidget | ImageTextWidget | ImageGalleryWidget | CustomCodeWidget | ImageNavigationWidget | ContactFormWidget | AboutWidget | ServicesWidget | ContactWidget;

// Spacing interface for consistent spacing properties
export interface SpacingValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Background types
export interface BackgroundConfig {
  type: 'color' | 'image' | 'video' | 'gradient';
  color?: string;
  url?: string;
  opacity: number;
  blur: number;
  gradient?: {
    enabled: boolean;
    colorStart: string;
    colorEnd: string;
    angle: number;
  };
  overlay?: {
    enabled: boolean;
    color: string;
    opacity: number;
    gradient?: {
      enabled: boolean;
      colorStart: string;
      colorEnd: string;
      angle: number;
    };
  };
}

// Button style configuration
export interface ButtonStyleConfig {
  text: string;
  url: string;
  radius: number;
  bgColor: string;
  textColor: string;
  bgOpacity?: number; // 0-100
  blurAmount?: number; // 0-20px
  hasBlur?: boolean; // Legacy - kept for backward compatibility
  hasShadow: boolean;
  shadowAmount: number;
  strokeWidth: number;
  strokeColor: string;
}

// Typography configuration
export interface TypographyConfig {
  fontFamily: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing?: string;
  color: string;
}

// Layout configuration
export interface LayoutConfig {
  height: {
    type: 'auto' | 'vh' | 'percentage' | 'pixels';
    value?: number;
  };
  width: 'full' | 'container';
  padding: SpacingValues;
  margin: SpacingValues;
}

// Enhanced Hero Widget with comprehensive properties
export interface HeroWidget {
  type: 'hero';
  title: string;
  subtitle: string;
  button: ButtonStyleConfig;
  textColor: string;
  background: BackgroundConfig;
  layout: LayoutConfig;
  textStyles: {
    title: TypographyConfig;
    subtitle: TypographyConfig;
  };
  textPosition: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'middle' | 'bottom';
  };
  border?: {
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
    color: string;
  };
  // Legacy fields for backward compatibility
  headline?: string;
  subheadline?: string;
  cta?: {
    text: string;
    url: string;
  };
  alignment?: 'left' | 'center' | 'right';
}

// Headline Widget
export interface HeadlineWidget {
  type: 'headline';
  title: string;
  subtitle?: string;
  background: {
    color: string;
    hasLink: boolean;
    linkUrl?: string;
  };
  textAlign: 'left' | 'center' | 'right';
  padding: SpacingValues;
  margin?: SpacingValues;
  height?: {
    type: 'auto' | 'vh' | 'percentage' | 'pixels';
    value?: number;
  };
}

// Image + Text Widget
export interface ImageTextWidget {
  type: 'image-text';
  layout: 'image-left' | 'image-right';
  image: string;
  imageHeight?: {
    type: 'auto' | 'vh' | 'percentage' | 'pixels';
    value?: number;
  };
  imageBorderRadius?: number;
  imageObjectFit?: 'cover' | 'contain' | 'fill';
  imageObjectPosition?: {
    x: string; // 'center', 'left', 'right', or percentage like '25%'
    y: string; // 'center', 'top', 'bottom', or percentage like '75%'
  };
  title?: string;
  content: string;
  textAlign?: 'left' | 'center' | 'right';
  textVerticalAlign?: 'top' | 'middle' | 'bottom';
  cta?: {
    text: string;
    url: string;
  };
  buttonStyles?: {
    radius: number;
    bgColor: string;
    textColor: string;
    bgOpacity?: number;
    blurAmount?: number;
    hasShadow: boolean;
    shadowAmount: number;
    strokeWidth: number;
    strokeColor: string;
  };
  imageWidth: number; // percentage
  gap: number;
  background?: {
    type: 'none' | 'color' | 'image' | 'video';
    color?: string;
    url?: string;
    opacity?: number;
  };
  mobileLayout?: 'stacked-image-top' | 'stacked-image-bottom' | 'horizontal';
  padding?: SpacingValues;
  margin?: SpacingValues;
}

// Image Collection Types
export interface ImageCollection {
  id: string;
  userId: string;
  name: string;
  images: CollectionImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

// Gallery Style Types
export type GalleryStyle = 'grid' | 'mosaic' | 'set-layout';
export type GalleryAspectRatio = '1:1' | '3:2' | '4:5' | '4:3';

// Image Gallery Widget
export interface ImageGalleryWidget {
  type: 'image-gallery';
  collectionId?: string; // Reference to image collection
  style: GalleryStyle;
  columns: number; // For grid and mosaic
  maxImages?: number; // Maximum images to display
  gap: number;
  aspectRatio?: GalleryAspectRatio; // For grid only
  lightbox: {
    enabled: boolean;
    showCaptions: boolean;
  };
  background?: BackgroundConfig;
  layout?: LayoutConfig;
  // Legacy fields for backward compatibility
  images?: {
    id: string;
    url: string;
    alt?: string;
    caption?: string;
  }[];
}

// Custom Code Widget
export interface CustomCodeWidget {
  type: 'custom-code';
  html: string;
  css: string;
  javascript: string;
}

// Image Navigation Widget
export interface ImageNavigationWidget {
  type: 'image-navigation';
  items: {
    id: string;
    title: string;
    image: string;
    url: string;
  }[];
  columns: number;
  gap: number;
}

// Contact Form Widget
export interface ContactFormWidget {
  type: 'contact-form';
  formFields: FormField[];
  buttonText: string;
  confirmationMessage: string;
  submitEndpoint?: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'custom';
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
}

// Legacy widgets for backward compatibility
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
