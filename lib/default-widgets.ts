import { SectionType } from './types';

// Consistent default padding for all sections
const DEFAULT_PADDING = {
  top: 80,
  right: 20,
  bottom: 80,
  left: 20,
};

const DEFAULT_MARGIN = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export function createDefaultWidget(type: SectionType): any {
  const timestamp = Date.now();
  
  switch (type) {
    case 'hero':
      return {
        type: 'hero',
        title: 'Welcome to Our Website',
        subtitle: 'We help you build amazing experiences',
        button: {
          text: 'Get Started',
          url: '#',
          openNewTab: false,
          // New button properties
          width: 'standard' as const,
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          borderRadius: 42,
          borderWidth: 0,
          backgroundOpacity: 100,
          dropShadow: true,
          shadowAmount: 4,
          blurEffect: 0,
          fontFamily: 'Inter',
          fontSize: { value: 16, unit: 'px' as const },
          fontWeight: '600',
          lineHeight: '1.5',
          textTransform: 'none' as const,
          hover: {
            backgroundOpacity: 90,
          },
          // Legacy fields for backward compatibility
          radius: 8,
          bgColor: '#3b82f6',
          hasBlur: false,
          hasShadow: true,
          strokeWidth: 0,
          strokeColor: '#000000',
        },
        textColor: '#ffffff',
        background: {
          type: 'color',
          color: '#3b82f6',
          opacity: 100,
          blur: 0,
          gradient: {
            enabled: false,
            colorStart: '#3b82f6',
            colorEnd: '#8b5cf6',
            angle: 45,
          },
        },
        layout: {
          height: { type: 'vh', value: 60 },
          width: 'full',
          padding: DEFAULT_PADDING,
          margin: DEFAULT_MARGIN,
        },
        textStyles: {
          title: {
            fontFamily: 'Inter',
            fontSize: { value: 48, unit: 'px' as const },
            fontWeight: '700',
            lineHeight: '1.2',
            textTransform: 'none' as const,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          },
          subtitle: {
            fontFamily: 'Inter',
            fontSize: { value: 20, unit: 'px' as const },
            fontWeight: '400',
            lineHeight: '1.6',
            textTransform: 'none' as const,
            letterSpacing: '0em',
            color: '#ffffff',
          },
        },
        textPosition: {
          horizontal: 'center',
          vertical: 'middle',
        },
        // Legacy fields for backward compatibility
        headline: 'Welcome to Our Website',
        subheadline: 'We help you build amazing experiences',
        cta: { text: 'Get Started', url: '#' },
        alignment: 'center',
        // SEO header tags
        titleHeaderTag: 'h1', // Hero title should be H1 (main page title)
        subtitleHeaderTag: 'p', // Subtitle is typically not a heading
      };
      
    case 'headline':
      return {
        type: 'headline',
        title: 'Section Headline',
        subtitle: 'Optional subtitle text',
        button: {
          text: '',
          url: '',
          openNewTab: false,
        },
        // Typography properties
        titleFontFamily: 'Inter',
        titleSize: { value: 36, unit: 'px' as const },
        titleFontWeight: '700',
        titleLineHeight: '1.2',
        titleTextTransform: 'none' as const,
        titleColor: '#1f2937',
        subtitleFontFamily: 'Inter',
        subtitleSize: { value: 18, unit: 'px' as const },
        subtitleFontWeight: '400',
        subtitleLineHeight: '1.5',
        subtitleTextTransform: 'none' as const,
        subtitleColor: '#6b7280',
        // Button styling properties
        buttonWidth: 'standard' as const,
        buttonBgColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        buttonBorderRadius: 42,
        buttonBorderWidth: 0,
        buttonBgOpacity: 100,
        buttonDropShadow: true,
        buttonShadowAmount: 4,
        buttonBlurEffect: 0,
        buttonFontFamily: 'Inter',
        buttonFontSize: { value: 16, unit: 'px' as const },
        buttonFontWeight: '600',
        buttonLineHeight: '1.5',
        buttonTextTransform: 'none' as const,
        buttonHover: {
          backgroundOpacity: 90,
        },
        background: {
          color: '#f9fafb',
          hasLink: false,
        },
        textAlign: 'center',
        padding: DEFAULT_PADDING,
        titleHeaderTag: 'h2', // Section headers should be H2 by default
        subtitleHeaderTag: 'h3', // Subheaders should be H3
      };
      
    case 'image-text':
      return {
        type: 'image-text',
        layout: 'image-left',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600',
        imageHeight: {
          type: 'auto',
          value: 50,
        },
        imageBorderRadius: 0,
        imageObjectFit: 'cover',
        imageObjectPosition: {
          x: 'center',
          y: 'center',
        },
        title: 'About Us',
        content: 'Tell your story here. Share information about your business, your values, and what makes you unique.',
        textAlign: 'left',
        textVerticalAlign: 'middle',
        buttonStyles: {
          radius: 8,
          bgColor: '#3b82f6',
          textColor: '#ffffff',
          bgOpacity: 100,
          blurAmount: 0,
          hasShadow: true,
          shadowAmount: 4,
          strokeWidth: 0,
          strokeColor: '#000000',
        },
        imageWidth: 50,
        gap: 40,
        background: {
          type: 'none',
          color: '#ffffff',
          opacity: 100,
        },
        mobileLayout: 'stacked-image-top',
        padding: DEFAULT_PADDING,
        margin: DEFAULT_MARGIN,
      };
      
    case 'contact-form':
      return {
        type: 'contact-form',
        style: 'standard',
        layout: {
          width: 'container',
          padding: 80,
        },
        formHeading: 'Get in Touch',
        formDescription: 'Fill out the form below and we\'ll get back to you as soon as possible.',
        fields: [
          {
            id: `field_${timestamp}_1`,
            type: 'text',
            label: 'Name',
            placeholder: 'Your name',
            required: true,
            width: 'full',
            order: 0,
          },
          {
            id: `field_${timestamp}_2`,
            type: 'email',
            label: 'Email',
            placeholder: 'your@email.com',
            required: true,
            width: 'full',
            order: 1,
          },
          {
            id: `field_${timestamp}_3`,
            type: 'tel',
            label: 'Phone',
            placeholder: '(555) 123-4567',
            required: false,
            width: 'full',
            order: 2,
          },
          {
            id: `field_${timestamp}_4`,
            type: 'textarea',
            label: 'Message',
            placeholder: 'Your message...',
            required: true,
            width: 'full',
            order: 3,
          },
        ],
        buttonText: 'Send Message',
        confirmationMessage: 'Thank you for your message! We\'ll be in touch soon.',
        // Typography using nested objects (new format)
        formHeadingTypography: {
          fontFamily: 'Inter',
          fontSize: { value: 2, unit: 'rem' as const },
          fontWeight: '700',
          lineHeight: '1.2',
          textTransform: 'none' as const,
          letterSpacing: '0em',
          color: '#1f2937',
        },
        formDescriptionTypography: {
          fontFamily: 'Inter',
          fontSize: { value: 1, unit: 'rem' as const },
          fontWeight: '400',
          lineHeight: '1.6',
          textTransform: 'none' as const,
          letterSpacing: '0em',
          color: '#6b7280',
        },
        // Submit button configuration
        submitButton: {
          text: 'Send Message',
          url: '',
          width: 'full' as const,
          backgroundColor: '#10b981',
          textColor: '#ffffff',
          borderRadius: 8,
          borderWidth: 0,
          borderColor: '#000000',
          backgroundOpacity: 100,
          dropShadow: true,
          shadowAmount: 4,
          blurEffect: 0,
          fontFamily: 'Inter',
          fontSize: { value: 16, unit: 'px' as const },
          fontWeight: '600',
          lineHeight: '1.5',
          textTransform: 'none' as const,
          hover: {
            backgroundOpacity: 90,
          },
        },
      };
      
    case 'sticky-form':
      return {
        type: 'sticky-form',
        heading: 'Quick Contact',
        description: 'Get a free consultation',
        buttonText: 'Submit',
        nameLabel: 'Name',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        position: 'bottom-right',
        offset: 20,
        // Typography using nested objects (new format)
        headingTypography: {
          fontFamily: 'Inter',
          fontSize: { value: 1.25, unit: 'rem' as const },
          fontWeight: '700',
          lineHeight: '1.2',
          textTransform: 'none' as const,
          letterSpacing: '0em',
          color: '#1f2937',
        },
        descriptionTypography: {
          fontFamily: 'Inter',
          fontSize: { value: 0.875, unit: 'rem' as const },
          fontWeight: '400',
          lineHeight: '1.5',
          textTransform: 'none' as const,
          letterSpacing: '0em',
          color: '#6b7280',
        },
        // Submit button configuration
        submitButton: {
          text: 'Submit',
          url: '',
          width: 'full' as const,
          backgroundColor: '#10b981',
          textColor: '#ffffff',
          borderRadius: 8,
          borderWidth: 0,
          borderColor: '#000000',
          backgroundOpacity: 100,
          dropShadow: true,
          shadowAmount: 4,
          blurEffect: 0,
          fontFamily: 'Inter',
          fontSize: { value: 14, unit: 'px' as const },
          fontWeight: '600',
          lineHeight: '1.5',
          textTransform: 'none' as const,
          hover: {
            backgroundOpacity: 90,
          },
        },
      };
      
    case 'image-navigation':
      return {
        type: 'image-navigation',
        columns: 3,
        items: [
          {
            id: `item_${timestamp}_1`,
            title: 'Services',
            image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300',
            url: '/services',
          },
          {
            id: `item_${timestamp}_2`,
            title: 'About Us',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300',
            url: '/about',
          },
          {
            id: `item_${timestamp}_3`,
            title: 'Contact',
            image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&h=300',
            url: '/contact',
          },
        ],
      };
    
    case 'testimonials':
      return {
        type: 'testimonials',
        sectionHeading: 'What Our Clients Say',
        showSectionHeading: true,
        testimonials: [
          {
            id: `testimonial_${timestamp}_1`,
            name: 'John Doe',
            title: 'CEO, Company Inc',
            quote: 'This service exceeded our expectations. Highly recommended!',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100',
          },
          {
            id: `testimonial_${timestamp}_2`,
            name: 'Jane Smith',
            title: 'Marketing Director',
            quote: 'Professional, reliable, and results-driven. A pleasure to work with!',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100',
          },
        ],
        // Light colors for dark background (default #0f4c75)
        nameFontSizeObj: { value: 18, unit: 'px' as const },
        nameColor: '#ffffff', // White for visibility on dark background
        nameFontWeight: '600',
        titleFontSizeObj: { value: 14, unit: 'px' as const },
        titleColor: '#cbd5e1', // Light gray for secondary text
        titleFontWeight: '400',
        quoteFontSizeObj: { value: 16, unit: 'px' as const },
        quoteColor: '#ffffff', // White for visibility on dark background
        quoteFontWeight: '400',
        cardStyle: 'gradient',
        cardBgColor: '#1e3a8a',
        cardBorderRadius: 16,
        cardShadow: true,
        bgColor: '#0f4c75', // Dark blue background
        padding: DEFAULT_PADDING,
        margin: DEFAULT_MARGIN,
      };
    
    case 'icon-text':
      return {
        type: 'icon-text',
        sectionHeading: 'Our Features',
        showSectionHeading: true,
        items: [
          {
            id: `item_${timestamp}_1`,
            icon: 'Star',
            heading: 'Feature One',
            subheading: 'Description of your first amazing feature',
          },
          {
            id: `item_${timestamp}_2`,
            icon: 'Target',
            heading: 'Feature Two',
            subheading: 'Description of your second amazing feature',
          },
          {
            id: `item_${timestamp}_3`,
            icon: 'Zap',
            heading: 'Feature Three',
            subheading: 'Description of your third amazing feature',
          },
        ],
        columns: 3,
        alignment: 'center',
        iconSize: 'md',
        gap: 24,
        // Typography defaults (dark text for light background)
        headerFontSize: { value: 36, unit: 'px' as const },
        headingColor: '#1f2937',
        headingWeight: '700',
        itemTitleFontSize: { value: 20, unit: 'px' as const },
        titleColor: '#1f2937',
        titleFontWeight: '600',
        itemDescFontSize: { value: 16, unit: 'px' as const },
        descriptionColor: '#6b7280',
        descriptionFontWeight: '400',
        // Box styling
        boxed: false,
        boxBackground: '#ffffff',
        boxBorderRadius: 12,
        boxPadding: 24,
        boxShadow: true,
        // Layout
        layout: {
          height: { type: 'auto' as const },
          width: 'container' as const,
          padding: DEFAULT_PADDING,
          margin: DEFAULT_MARGIN,
        },
        background: {
          type: 'color',
          color: 'transparent',
          opacity: 100,
          blur: 0,
        },
      };
    
    case 'reviews-slider':
      return {
        type: 'reviews-slider',
        sectionHeading: 'Customer Reviews',
        showSectionHeading: true,
        reviews: [
          {
            id: `review_${timestamp}_1`,
            author: 'Sarah Johnson',
            rating: 5,
            text: 'Excellent service! Highly recommend to anyone looking for quality work.',
            date: new Date().toISOString(),
            source: 'google',
          },
          {
            id: `review_${timestamp}_2`,
            author: 'Michael Chen',
            rating: 5,
            text: 'Professional, reliable, and exceeded expectations. Will definitely work with them again!',
            date: new Date().toISOString(),
            source: 'google',
          },
          {
            id: `review_${timestamp}_3`,
            author: 'Emma Davis',
            rating: 5,
            text: 'Great experience from start to finish. The team was responsive and delivered on time.',
            date: new Date().toISOString(),
            source: 'google',
          },
        ],
        // Typography using nested objects (new format)
        sectionHeaderTypography: {
          fontFamily: 'Inter',
          fontSize: { value: 2, unit: 'rem' as const },
          fontWeight: '700',
          lineHeight: '1.2',
          textTransform: 'none' as const,
          letterSpacing: '0em',
          color: '#1f2937',
        },
        nameTypography: {
          fontFamily: 'Inter',
          fontSize: { value: 1, unit: 'rem' as const },
          fontWeight: '600',
          lineHeight: '1.2',
          textTransform: 'none' as const,
          letterSpacing: '0em',
          color: '#1f2937',
        },
        reviewTextTypography: {
          fontFamily: 'Inter',
          fontSize: { value: 0.875, unit: 'rem' as const },
          fontWeight: '400',
          lineHeight: '1.6',
          textTransform: 'none' as const,
          letterSpacing: '0em',
          color: '#6b7280',
        },
        dateTypography: {
          fontFamily: 'Inter',
          fontSize: { value: 0.75, unit: 'rem' as const },
          fontWeight: '400',
          lineHeight: '1.2',
          textTransform: 'none' as const,
          letterSpacing: '0em',
          color: '#9ca3af',
        },
        // Display settings
        source: 'google',
        scrollStyle: 'timer',
        scrollInterval: 5,
        desktopCount: 3,
        tabletCount: 2,
        mobileCount: 1,
        enableReadMore: true,
        readMoreLimit: 150,
        // Star styling
        starIconStyle: 'filled',
        starColor: '#f59e0b',
        starSize: 20,
        // Box styling
        boxBackground: '#ffffff',
        boxBorderRadius: 12,
        boxBorder: false,
        boxBorderColor: '#e5e7eb',
        boxBorderWidth: 1,
        boxShadow: true,
        boxPadding: 24,
        gap: 24,
        // Additional settings
        showGoogleLogo: true,
        showReviewDate: true,
        filterStars: false,
        minStars: 4,
        // Layout
        layout: {
          fullWidth: true,
          maxWidth: 1200,
          paddingTop: 80,
          paddingBottom: 80,
          paddingLeft: 24,
          paddingRight: 24,
        },
        background: {
          type: 'color',
          color: '#f9fafb',
          opacity: 100,
        },
      };
    
    // Add more section types as needed - for brevity, returning basic structure
    default:
      return {
        type,
        padding: DEFAULT_PADDING,
        margin: DEFAULT_MARGIN,
      };
  }
}
