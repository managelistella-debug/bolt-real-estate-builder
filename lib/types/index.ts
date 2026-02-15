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
  headerSettings?: PageHeaderSettings;
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
export type SectionType = 'hero' | 'headline' | 'image-text' | 'image-gallery' | 'icon-text' | 'text-section' | 'faq' | 'testimonials' | 'steps' | 'image-text-columns' | 'sticky-form' | 'reviews-slider' | 'custom-code' | 'image-navigation' | 'contact-form' | 'about' | 'services' | 'contact';

export interface Section {
  id: string;
  type: SectionType;
  order: number;
  widget: Widget;
}

export type Widget = HeroWidget | HeadlineWidget | ImageTextWidget | ImageGalleryWidget | IconTextWidget | TextSectionWidget | FAQWidget | TestimonialWidget | StepsWidget | ImageTextColumnsWidget | StickyFormWidget | ReviewsSliderWidget | CustomCodeWidget | ImageNavigationWidget | ContactFormWidget | AboutWidget | ServicesWidget | ContactWidget;

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

// Font size value with unit support
export interface FontSizeValue {
  value: number;
  unit: 'rem' | 'px' | 'em' | '%';
}

// Button style configuration
export interface ButtonStyleConfig {
  text: string;
  url: string;
  openNewTab?: boolean;
  
  // Default state
  width?: 'standard' | 'full' | 'custom';
  customWidth?: number;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;  // px
  borderWidth?: number;   // px
  borderColor?: string;
  backgroundOpacity?: number;  // 0-100 (stored as percentage)
  dropShadow?: boolean;
  shadowAmount?: number;  // px
  blurEffect?: number;    // px
  
  // Typography for button text
  fontFamily?: string;
  fontSize?: FontSizeValue | string | number;  // Support legacy formats
  fontWeight?: '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';
  lineHeight?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Hover state
  hover?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    backgroundOpacity?: number;
    dropShadow?: boolean;
    shadowAmount?: number;
    blurEffect?: number;
  };
  
  // Global style linking
  useGlobalStyle?: boolean;
  globalStyleId?: string;  // e.g., 'button1', 'button2'
  
  // Legacy fields - kept for backward compatibility
  radius?: number;
  bgColor?: string;
  bgOpacity?: number;
  blurAmount?: number;
  hasBlur?: boolean;
  hasShadow?: boolean;
  strokeWidth?: number;
  strokeColor?: string;
}

// Typography configuration
export interface TypographyConfig {
  fontFamily: string;
  fontSize: FontSizeValue | string | number;  // Support legacy formats
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold' | string;
  lineHeight: string;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: string;
  color: string;
  // For global style linking
  useGlobalStyle?: boolean;
  globalStyleId?: string;  // e.g., 'h1', 'h2', 'body'
  
  // Legacy field
  size?: string;  // Deprecated - use fontSize
  weight?: string;  // Deprecated - use fontWeight
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
  titleHeaderTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
  subtitleHeaderTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
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
  button?: {
    text: string;
    url: string;
    openNewTab?: boolean;
  };
  background: {
    color: string;
    hasLink: boolean;
    linkUrl?: string;
  };
  textAlign: 'left' | 'center' | 'right';
  padding: SpacingValues;
  titleHeaderTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
  subtitleHeaderTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
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

// Icon + Text Widget Types
export type IconTextLayout = 'left' | 'center';
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconTextItem {
  id: string;
  icon: string; // SVG icon name
  iconColor: string;
  iconBgColor?: string; // Background color for icon container
  heading?: string;
  headingColor?: string;
  subheading?: string;
  subheadingColor?: string;
  order: number;
}

export interface IconTextWidget {
  type: 'icon-text';
  alignment: IconTextLayout;
  items: IconTextItem[];
  columns: number; // 1-6
  gap: number; // Gap between items in px
  iconSize: IconSize;
  showViewMore: boolean;
  viewMoreText?: string;
  viewMoreUrl?: string;
  itemsBeforeViewMore?: number; // Show this many items before "View More"
  boxed?: boolean; // Enable box/card style for each item
  boxBackground?: string; // Box background color
  boxBorderRadius?: number; // Box border radius in px
  boxPadding?: number; // Inner padding of box in px
  boxShadow?: boolean; // Enable box shadow
  boxBorder?: boolean; // Enable box border
  boxBorderColor?: string; // Box border color
  boxBorderWidth?: number; // Box border width in px
  background?: BackgroundConfig;
  layout?: LayoutConfig;
  sectionHeading?: string;
  sectionSubheading?: string;
  sectionHeadingColor?: string;
  sectionSubheadingColor?: string;
}

// Text Section Widget Types
export type TextSectionLayout = 'side-by-side' | 'stacked';
export type TextAlignment = 'left' | 'center' | 'right';

export interface TextSectionWidget {
  type: 'text-section';
  layout: TextSectionLayout;
  
  // Content
  tagline?: string;
  taglineColor?: string;
  heading: string;
  headingColor?: string;
  bodyText: string;
  bodyTextColor?: string;
  
  // Button (optional)
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle?: ButtonStyleConfig;
  
  // Layout Options
  reverseOrder?: boolean; // For side-by-side, swap left/right
  headingAlignment?: TextAlignment;
  bodyAlignment?: TextAlignment;
  
  // Styling
  headingSize?: number; // Font size in px
  bodySize?: number; // Font size in px
  taglineSize?: number; // Font size in px
  
  // Spacing
  columnGap?: number; // Gap between columns in side-by-side
  rowGap?: number; // Gap between elements in stacked
  
  // Column Widths (for side-by-side)
  headingColumnWidth?: number; // Percentage (30-70)
  
  // Background & Layout
  background?: BackgroundConfig;
  layout?: LayoutConfig;
}

// FAQ Widget Types
export type FAQIconStyle = 'chevron' | 'plus-minus' | 'arrow' | 'caret';
export type FAQItemStyle = 'boxed' | 'dividers' | 'clean';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQWidget {
  type: 'faq';
  
  // Header Content
  heading: string;
  headingColor?: string;
  headingSize?: number;
  headingAlignment?: TextAlignment;
  
  subheading?: string;
  subheadingColor?: string;
  subheadingSize?: number;
  subheadingAlignment?: TextAlignment;
  
  // FAQ Items
  items: FAQItem[];
  
  // Question/Answer Styling
  questionFontSize?: number;
  questionColor?: string;
  questionAlignment?: TextAlignment;
  questionFontWeight?: number;
  
  answerFontSize?: number;
  answerColor?: string;
  answerAlignment?: TextAlignment;
  answerFontWeight?: number;
  
  // Icon Settings
  iconStyle?: FAQIconStyle;
  iconColor?: string;
  iconBackgroundColor?: string;
  iconCircleSize?: number;
  iconPosition?: 'left' | 'right'; // Position of icon relative to question
  
  // Item Style (boxed, dividers, or clean)
  itemStyle?: FAQItemStyle;
  
  // Box Styling (if itemStyle === 'boxed')
  boxBackgroundColor?: string;
  boxBorderRadius?: number;
  boxPadding?: number;
  boxShadow?: boolean;
  boxBorder?: boolean;
  boxBorderColor?: string;
  boxBorderWidth?: number;
  
  // Divider Styling (if itemStyle === 'dividers')
  dividerColor?: string;
  dividerWidth?: number;
  
  // Spacing
  itemGap?: number; // Gap between FAQ items
  questionAnswerGap?: number; // Gap between question and answer within an item
  headerGap?: number; // Gap between heading/subheading and FAQ items
  
  // Section Settings
  background?: BackgroundConfig;
  layout?: LayoutConfig;
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

// Contact Form Widget Types
export type ContactFormStyle = 'simple' | 'split' | 'contact-details';
export type ContactFormLayout = 'form-left' | 'form-right';
export type FormFieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'radio';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string; // Backend label (e.g., "message")
  placeholder?: string; // Override label display (e.g., "How can we help?")
  required: boolean;
  options?: string[]; // For select/radio fields
  order: number;
}

export interface ContactFormWidget {
  type: 'contact-form';
  
  // Style & Layout
  style: ContactFormStyle;
  layout?: ContactFormLayout;
  
  // Form Content
  formHeading: string;
  formDescription?: string;
  fields: FormField[];
  buttonText: string;
  confirmationMessage: string;
  
  // Column Content (for split & contact-details styles)
  columnHeading?: string;
  columnDescription?: string;
  
  // Contact Details (for contact-details style)
  phone?: string;
  email?: string;
  website?: string;
  showContactIcons?: boolean;
  
  // Buttons (for left column)
  button1Text?: string;
  button1Url?: string;
  button2Text?: string;
  button2Url?: string;
  
  // Form Styling
  formBoxed?: boolean;
  formBoxBackground?: string;
  formBoxBorderRadius?: number;
  formBoxPadding?: number;
  formBoxShadow?: boolean;
  
  // Field Styling
  fieldBackgroundColor?: string;
  fieldTextColor?: string;
  fieldPlaceholderColor?: string;
  fieldBorderRadius?: number;
  fieldBorderWidth?: number;
  fieldBorderColor?: string;
  fieldBorderSides?: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  
  // Button Styling
  buttonFullWidth?: boolean;
  buttonAlignment?: 'left' | 'center' | 'right';
  buttonStyle?: ButtonStyleConfig;
  buttonHoverColor?: string;
  buttonHoverBackground?: string;
  
  // Typography
  headingSize?: number;
  headingColor?: string;
  descriptionSize?: number;
  descriptionColor?: string;
  
  // Background & Layout
  background?: BackgroundConfig;
  layout?: LayoutConfig;
  
  // Legacy support
  formFields?: FormField[];
  submitEndpoint?: string;
  contactIconSize?: number;
  contactLineSpacing?: number;
}

// Testimonials Widget Types
export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number; // 1-5
  title?: string; // Optional job title/company
  avatar?: string; // Optional image URL
}

export type TestimonialArrowStyle = 'circle' | 'square' | 'minimal';

export interface TestimonialWidget {
  type: 'testimonials';
  
  // Section Header
  sectionHeading?: string;
  sectionHeadingColor?: string;
  sectionSubheading?: string;
  sectionSubheadingColor?: string;
  
  // Testimonials
  testimonials: Testimonial[];
  
  // Display Options
  autoplay?: boolean;
  autoplayInterval?: number; // seconds, default 5
  showAvatar?: boolean;
  avatarShape?: 'circle' | 'square';
  avatarSize?: number; // px
  namePosition?: 'above-quote' | 'below-quote';
  textAlign?: TextAlignment;
  
  // Star Settings
  showStars?: boolean;
  starColor?: string;
  starSize?: number;
  
  // Typography
  nameFontSize?: number;
  nameColor?: string;
  nameFontWeight?: number;
  titleFontSize?: number;
  titleColor?: string;
  quoteFontSize?: number;
  quoteColor?: string;
  quoteLineHeight?: number;
  quoteMaxWidth?: number;
  
  // Navigation Arrows
  arrowStyle?: TestimonialArrowStyle;
  arrowBackgroundColor?: string;
  arrowColor?: string;
  arrowSize?: number;
  
  // Navigation Dots
  dotColor?: string;
  activeDotColor?: string;
  dotSize?: number;
  
  // Section Layout & Background
  background: BackgroundConfig;
  layout: LayoutConfig;
}

// Steps Widget Types
export interface Step {
  id: string;
  label: string; // e.g., "STEP 01"
  heading: string;
  description: string;
}

export type StepsLayout = 'image-left' | 'image-right';

export interface StepsWidget {
  type: 'steps';
  
  // Section Header
  sectionHeading: string;
  sectionHeadingColor?: string;
  sectionHeadingSize?: number;
  
  // Button
  buttonText?: string;
  buttonUrl?: string;
  buttonVisible?: boolean;
  buttonStyle?: ButtonStyleConfig;
  
  // Image Layout
  imageLayout: StepsLayout;
  imageUrl: string;
  imagePosition?: 'center' | 'top' | 'bottom';
  
  // Steps
  steps: Step[];
  
  // Card Styling
  cardBackground?: string;
  cardBorderRadius?: number;
  cardPadding?: number;
  cardShadow?: boolean;
  
  // Step Label Styling
  stepLabelBackground?: string;
  stepLabelColor?: string;
  stepLabelFontSize?: number;
  stepLabelBorderRadius?: number;
  stepLabelPadding?: number;
  
  // Step Typography
  stepHeadingColor?: string;
  stepHeadingSize?: number;
  stepHeadingFontWeight?: number;
  stepDescriptionColor?: string;
  stepDescriptionSize?: number;
  stepGap?: number; // gap between steps
  
  // Section Layout & Background
  background: BackgroundConfig;
  layout: LayoutConfig;
}

// Multi-Column Image + Text Widget Types
export interface ImageTextColumnItem {
  id: string;
  image: string;
  subtitle: string;
  description: string;
  order: number;
}

export interface ImageTextColumnsWidget {
  type: 'image-text-columns';
  
  // Section Header
  sectionHeading?: string;
  sectionSubheading?: string;
  sectionHeadingColor?: string;
  sectionSubheadingColor?: string;
  sectionHeadingSize?: number;
  sectionSubheadingSize?: number;
  
  // Column Items
  items: ImageTextColumnItem[];
  
  // Layout
  desktopColumns: number; // 1-4
  tabletColumns: number; // 1-3
  mobileColumns: number; // 1-2
  gap: number; // Gap between columns in px
  
  // Image Styling
  imageAspectRatio?: '1:1' | '3:2' | '4:3' | '16:9';
  imageBorderRadius?: number;
  
  // Text Styling
  textAlign?: 'left' | 'center' | 'right';
  subtitleColor?: string;
  subtitleSize?: number;
  subtitleFontWeight?: number;
  descriptionColor?: string;
  descriptionSize?: number;
  descriptionFontWeight?: number;
  
  // Section Layout & Background
  background: BackgroundConfig;
  layout: LayoutConfig;
}

// Sticky Form + Text Widget Types
export type StickyFormLayout = 'form-left' | 'form-right';
export type MobileStackOrder = 'form-first' | 'text-first';

export interface Hyperlink {
  id: string;
  text: string;
  url: string;
}

export interface StickyFormWidget {
  type: 'sticky-form';
  
  // Layout
  formLayout: StickyFormLayout;
  mobileStackOrder: MobileStackOrder;
  stickyOffset?: number; // px offset from viewport top for sticky form (desktop/tablet)
  
  // Text Content
  heading: string;
  headingColor?: string;
  headingSize?: number;
  headingFontFamily?: string;
  richTextContent?: string; // HTML content from WYSIWYG editor
  bodyParagraphs?: string[]; // DEPRECATED: Array of paragraph text (kept for backward compatibility)
  bulletPoints?: string[]; // DEPRECATED: Optional bullet list
  hyperlinks?: Hyperlink[]; // DEPRECATED: Links that can be inserted in body text
  textColor?: string;
  textSize?: number;
  textFontFamily?: string;
  
  // Form Fields (reuse from contact form)
  fields: FormField[];
  formHeading?: string;
  formDescription?: string;
  buttonText: string;
  confirmationMessage: string;
  
  // Form Styling (all from contact form)
  formBoxed?: boolean;
  formBoxBackground?: string;
  formBoxBorderRadius?: number;
  formBoxPadding?: number;
  formBoxShadow?: boolean;
  fieldBackgroundColor?: string;
  fieldTextColor?: string;
  fieldPlaceholderColor?: string;
  fieldBorderRadius?: number;
  fieldBorderWidth?: number;
  fieldBorderColor?: string;
  fieldBorderSides?: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  buttonFullWidth?: boolean;
  buttonAlignment?: 'left' | 'center' | 'right';
  buttonStyle?: ButtonStyleConfig;
  
  // Section Layout & Background
  background: BackgroundConfig;
  layout: LayoutConfig;
}

// Google Reviews Slider Widget Types
export type ReviewSource = 'google' | 'manual';

export interface Review {
  id: string;
  name: string;
  rating: number; // 1-5
  text: string;
  date: string;
  avatar?: string;
  source: ReviewSource;
}

export interface ReviewsSliderWidget {
  type: 'reviews-slider';
  
  // Source
  source: ReviewSource;
  reviews: Review[]; // For manual entry or fetched from API
  
  // Filters
  filterStars?: boolean; // Show only 4-5 star reviews
  
  // Scroll Settings
  scrollStyle: 'timer' | 'marquee' | 'manual'; // timer = auto-scroll with interval, marquee = continuous, manual = nav buttons only
  scrollInterval?: number; // seconds (for timer style)
  autoScroll?: boolean; // DEPRECATED: kept for backward compatibility
  
  // Display Settings
  desktopCount: number; // 1-4 reviews per row
  tabletCount: number; // 1-3 reviews per row
  mobileCount: number; // 1-2 reviews per row
  
  // Read More
  enableReadMore: boolean;
  readMoreLimit?: number; // character limit
  
  // Star Styling
  starIconStyle?: 'filled' | 'outlined';
  starColor?: string;
  starSize?: number;
  
  // Display Options
  showGoogleLogo: boolean;
  showReviewDate: boolean;
  
  // Box Styling
  boxBackground?: string;
  boxBorderRadius?: number;
  boxBorder?: boolean;
  boxBorderColor?: string;
  boxBorderWidth?: number;
  boxShadow?: boolean;
  boxPadding?: number;
  gap?: number; // gap between review cards
  
  // Typography
  nameColor?: string;
  nameSize?: number;
  nameFontWeight?: number;
  textColor?: string;
  textSize?: number;
  dateColor?: string;
  dateSize?: number;
  
  // Optional CTA Button
  showButton?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle?: ButtonStyleConfig;
  
  // Section Header
  sectionHeading?: string;
  sectionSubheading?: string;
  sectionHeadingColor?: string;
  sectionSubheadingColor?: string;
  
  // Section Layout & Background
  background: BackgroundConfig;
  layout: LayoutConfig;
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
  colorLabels?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  customColors?: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  fontPair: FontPair;
  buttons: {
    button1: GlobalButtonStyle;
    button2: GlobalButtonStyle;
  };
  headings: {
    h1: TypographyStyle;
    h2: TypographyStyle;
    h3: TypographyStyle;
    h4: TypographyStyle;
    h5: TypographyStyle;
    h6: TypographyStyle;
  };
  body: TypographyStyle;
  
  // Legacy field for backward compatibility
  button?: ButtonStyle;
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

export interface GlobalButtonStyle {
  width: 'standard' | 'full' | 'custom';
  customWidth?: number;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  borderWidth: number;
  borderColor?: string;
  backgroundOpacity: number;
  dropShadow: boolean;
  shadowAmount: number;
  blurEffect: number;
  fontFamily: string;
  fontSize: FontSizeValue;
  fontWeight: string;
  lineHeight: string;
  textTransform: string;
  hover: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    backgroundOpacity?: number;
    dropShadow?: boolean;
    shadowAmount?: number;
    blurEffect?: number;
  };
}

export interface TypographyStyle {
  fontFamily: string;
  fontSize: FontSizeValue | string;  // Support legacy string format
  fontWeight: string;
  lineHeight: string;
  textTransform: string;
  color?: string; // Legacy only; section typography color is now local.
  letterSpacing?: string;
}

// Header and Footer Types
export type HeaderLayout = 'leftLogoRightMenu' | 'centeredLogoSplitMenu' | 'centeredLogoBurger';
export type LegacyHeaderLayout = 'header-a' | 'header-b' | 'header-c';
export type FooterLayout = 'footer-a' | 'footer-b' | 'footer-c';
export type FooterMenuSource = 'headerNavigation' | 'customNavigation';

export type HeaderPositioning = 'aboveFirstSection' | 'overlayFirstSection';
export type HeaderScrollMode = 'none' | 'color-shift' | 'transparent-to-solid' | 'solid-to-transparent';

export interface HeaderLogoConfig {
  src?: string;
  alt?: string;
  sizes: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface HeaderBackgroundConfig {
  initialColor: string;
  scrolledColor: string;
  initialOpacity: number; // 0-100
  scrolledOpacity: number; // 0-100
}

export interface HeaderLogoScrollConfig {
  mode: 'none' | 'svg-color' | 'swap-image';
  scrolledSrc?: string;
  initialColor?: string;
  scrolledColor?: string;
}

export interface HeaderStickyConfig {
  enabled: boolean;
  offset: number;
}

export interface HeaderScrollConfig {
  mode: HeaderScrollMode;
  triggerY: number;
}

export interface HeaderBurgerMenuConfig {
  panelSide: 'left' | 'right';
  panelWidth: number;
  overlayOpacity: number; // 0-100
  closeOnItemClick: boolean;
}

export interface HeaderBurgerIconConfig {
  src?: string;
  size: number;
  initialColor?: string;
  scrolledColor?: string;
}

export interface HeaderBorderConfig {
  enabled: boolean;
  width: number;
  color: string;
}

/**
 * Screenshot-driven visual references:
 * - leftLogoRightMenu: dark header with left logo block and right nav
 * - centeredLogoSplitMenu: light header with centered logo and split nav
 * - centeredLogoBurger: transparent/overlay capable header with centered logo and right burger
 */
export const HEADER_LAYOUT_REFERENCE_SPECS: Record<HeaderLayout, { treatment: 'light' | 'dark'; notes: string }> = {
  leftLogoRightMenu: {
    treatment: 'dark',
    notes: 'Left-aligned brand block and right horizontal navigation.',
  },
  centeredLogoSplitMenu: {
    treatment: 'light',
    notes: 'Centered logo with navigation items distributed evenly on both sides.',
  },
  centeredLogoBurger: {
    treatment: 'dark',
    notes: 'Centered logo with right burger trigger that opens an overlay menu.',
  },
};

export interface HeaderConfig {
  layout: HeaderLayout | LegacyHeaderLayout;
  logo?: string; // Legacy fallback
  logoConfig?: HeaderLogoConfig;
  logoScroll?: HeaderLogoScrollConfig;
  navigation: NavItem[];
  menuItemTypography?: Partial<TypographyConfig>;
  menuItemScrolledColor?: string;
  menuItemGap?: number; // px spacing between desktop menu items
  height?: {
    type: 'auto' | 'vh' | 'percentage' | 'pixels';
    value?: number;
  };
  padding?: SpacingValues;
  margin?: SpacingValues;
  positioning?: HeaderPositioning;
  sticky?: HeaderStickyConfig;
  scroll?: HeaderScrollConfig;
  background?: HeaderBackgroundConfig;
  burgerMenu?: HeaderBurgerMenuConfig;
  burgerIcon?: HeaderBurgerIconConfig;
  border?: HeaderBorderConfig;
  presetTheme?: 'light' | 'dark';
  phone?: string;
  email?: string;
}

export interface PageHeaderSettings {
  useCustomHeader: boolean;
  headerOverride?: Partial<HeaderConfig>;
}

export interface FooterLogoConfig {
  src?: string;
  alt?: string;
  sizes: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface FooterBackgroundConfig {
  topColor: string;
  bottomColor: string;
  watermarkSvg?: string;
  watermarkOpacity: number;
  watermarkSize: number;
}

export interface FooterLinksConfig {
  privacyLabel: string;
  privacyUrl: string;
  termsLabel: string;
  termsUrl: string;
}

export interface FooterConfig {
  layout: FooterLayout;
  menuSource: FooterMenuSource;
  logoConfig?: FooterLogoConfig;
  logo?: string;
  navigation: NavItem[];
  menuItemTypography?: Partial<TypographyConfig>;
  menuItemGap?: number;
  contactTypography?: Partial<TypographyConfig>;
  disclaimerTypography?: Partial<TypographyConfig>;
  legalTypography?: Partial<TypographyConfig>;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks: SocialLink[];
  socialIconSize?: number;
  socialIconGap?: number;
  socialIconColor?: string;
  customSocialIconColor?: string;
  disclaimer?: string;
  legalLinks?: FooterLinksConfig;
  background?: FooterBackgroundConfig;
  padding?: SpacingValues;
  margin?: SpacingValues;
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
  order: number;
  source?: 'page' | 'custom';
  pageId?: string;
  openInNewTab?: boolean;
}

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'custom';
  url: string;
  iconSrc?: string;
  label?: string;
  openInNewTab?: boolean;
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
