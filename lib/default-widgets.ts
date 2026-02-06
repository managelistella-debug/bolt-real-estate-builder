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
          radius: 8,
          bgColor: '#3b82f6',
          textColor: '#ffffff',
          hasBlur: false,
          hasShadow: true,
          shadowAmount: 4,
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
            size: '3rem',
            weight: '700',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            color: '#ffffff',
          },
          subtitle: {
            fontFamily: 'Inter',
            size: '1.25rem',
            weight: '400',
            lineHeight: '1.6',
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
    
    // Add more section types as needed - for brevity, returning basic structure
    default:
      return {
        type,
        padding: DEFAULT_PADDING,
        margin: DEFAULT_MARGIN,
      };
  }
}
