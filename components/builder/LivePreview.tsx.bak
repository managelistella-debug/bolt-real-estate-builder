'use client';

import { useState, useEffect } from 'react';
import { Page, Website, HeroWidget, AboutWidget, ServicesWidget, ContactWidget, HeadlineWidget, ImageTextWidget, ImageGalleryWidget, IconTextWidget, TextSectionWidget, FAQWidget, FAQIconStyle, TestimonialWidget, StepsWidget, ImageTextColumnsWidget, StickyFormWidget, ReviewsSliderWidget, CustomCodeWidget, ImageNavigationWidget, ContactFormWidget } from '@/lib/types';
import { useBuilderStore } from '@/lib/stores/builder';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { cn } from '@/lib/utils';
import { Lightbox } from './Lightbox';
import { getIcon } from '@/lib/icons/iconLibrary';
import { ChevronRight, ChevronLeft, ChevronDown, Plus, Minus, ArrowRight, Star } from 'lucide-react';

interface LivePreviewProps {
  page: Page;
  website: Website;
}

export function LivePreview({ page, website }: LivePreviewProps) {
  const { deviceView, selectedSectionId, selectSection } = useBuilderStore();

  const containerClass = cn(
    'mx-auto bg-white min-h-full transition-all duration-300',
    deviceView === 'mobile' && 'max-w-[375px]',
    deviceView === 'tablet' && 'max-w-[768px]',
    deviceView === 'desktop' && 'w-full'
  );

  return (
    <div className="p-8">
      <div className={containerClass}>
        {/* Header */}
        <header className="border-b py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="font-bold text-xl" style={{ color: website.globalStyles.colors.primary }}>
              {website.header.logo ? (
                <img src={website.header.logo} alt="Logo" className="h-8" />
              ) : (
                website.name
              )}
            </div>
            <nav className="flex gap-4">
              {website.header.navigation.map((item) => (
                <a key={item.id} href={item.url} className="text-sm hover:underline">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* Sections */}
        <main>
          {page.sections.map((section) => (
            <div
              key={section.id}
              onClick={() => selectSection(section.id)}
              className={cn(
                'transition-all cursor-pointer hover:ring-1 hover:ring-gray-300 hover:ring-inset',
                selectedSectionId === section.id && 'ring-2 ring-primary ring-inset'
              )}
            >
              {section.type === 'hero' && (
                <HeroSection widget={section.widget as HeroWidget} styles={website.globalStyles} />
              )}
              {section.type === 'headline' && (
                <HeadlineSection widget={section.widget as HeadlineWidget} />
              )}
              {section.type === 'image-text' && (
                <ImageTextSection widget={section.widget as ImageTextWidget} />
              )}
              {section.type === 'image-gallery' && (
                <ImageGallerySection widget={section.widget as ImageGalleryWidget} />
              )}
              {section.type === 'icon-text' && (
                <IconTextSection widget={section.widget as IconTextWidget} />
              )}
              {section.type === 'text-section' && (
                <TextSectionComponent widget={section.widget as TextSectionWidget} />
              )}
              {section.type === 'faq' && (
                <FAQSection widget={section.widget as FAQWidget} />
              )}
              {section.type === 'testimonials' && (
                <TestimonialsSection widget={section.widget as TestimonialWidget} />
              )}
              {section.type === 'steps' && (
                <StepsSection widget={section.widget as StepsWidget} />
              )}
              {section.type === 'image-text-columns' && (
                <ImageTextColumnsSection widget={section.widget as ImageTextColumnsWidget} />
              )}
              {section.type === 'sticky-form' && (
                <StickyFormSection widget={section.widget as StickyFormWidget} />
              )}
              {section.type === 'reviews-slider' && (
                <ReviewsSliderSection widget={section.widget as ReviewsSliderWidget} />
              )}
              {section.type === 'custom-code' && (
                <CustomCodeSection widget={section.widget as CustomCodeWidget} />
              )}
              {section.type === 'image-navigation' && (
                <ImageNavigationSection widget={section.widget as ImageNavigationWidget} />
              )}
              {section.type === 'contact-form' && (
                <ContactFormSection widget={section.widget as ContactFormWidget} />
              )}
              {section.type === 'about' && (
                <AboutSection widget={section.widget as AboutWidget} styles={website.globalStyles} />
              )}
              {section.type === 'services' && (
                <ServicesSection widget={section.widget as ServicesWidget} styles={website.globalStyles} />
              )}
              {section.type === 'contact' && (
                <ContactSection widget={section.widget as ContactWidget} styles={website.globalStyles} />
              )}
            </div>
          ))}
        </main>

        {/* Footer */}
        <footer className="border-t py-8 px-6 bg-gray-50 mt-12">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} {website.name}. All rights reserved.
            </p>
            {website.footer.navigation.length > 0 && (
              <div className="flex justify-center gap-4 mt-4">
                {website.footer.navigation.map((item) => (
                  <a key={item.id} href={item.url} className="text-sm text-gray-600 hover:underline">
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

function HeroSection({ widget, styles }: { widget: HeroWidget; styles: any }) {
  const title = widget.title || widget.headline || 'Welcome';
  const subtitle = widget.subtitle || widget.subheadline || '';
  const buttonText = widget.button?.text || widget.cta?.text || 'Get Started';
  const buttonUrl = widget.button?.url || widget.cta?.url || '#';
  
  const horizontal = widget.textPosition?.horizontal || widget.alignment || 'center';
  const vertical = widget.textPosition?.vertical || 'middle';
  
  const heightType = widget.layout?.height?.type || 'vh';
  const heightValue = widget.layout?.height?.value || 60;
  let height = '500px';
  if (heightType === 'vh') height = `${heightValue}vh`;
  else if (heightType === 'percentage') height = `${heightValue}%`;
  else if (heightType === 'pixels') height = `${heightValue}px`;
  else height = 'auto';

  const padding = widget.layout?.padding || { top: 80, right: 40, bottom: 80, left: 40 };
  const margin = widget.layout?.margin || { top: 0, right: 0, bottom: 0, left: 0 };

  const bgType = widget.background?.type || 'color';
  const bgColor = widget.background?.color || '#3b82f6';
  const bgOpacity = (widget.background?.opacity || 100) / 100;
  const bgBlur = widget.background?.blur || 0;
  
  const textColor = widget.textColor || widget.textStyles?.title?.color || '#ffffff';
  const fontFamily = widget.textStyles?.title?.fontFamily || widget.textStyles?.subtitle?.fontFamily || 'Inter';
  const titleSize = widget.textStyles?.title?.size || '3rem';
  const titleWeight = widget.textStyles?.title?.weight || '700';
  const titleLineHeight = widget.textStyles?.title?.lineHeight || '1.2';
  const titleLetterSpacing = widget.textStyles?.title?.letterSpacing || '-0.02em';
  const subtitleSize = widget.textStyles?.subtitle?.size || '1.25rem';
  const subtitleWeight = widget.textStyles?.subtitle?.weight || '400';
  const subtitleLineHeight = widget.textStyles?.subtitle?.lineHeight || '1.6';
  
  const buttonRadius = widget.button?.radius || 8;
  const buttonBgColor = widget.button?.bgColor || '#3b82f6';
  const buttonTextColor = widget.button?.textColor || '#ffffff';
  const buttonBgOpacity = widget.button?.bgOpacity !== undefined ? widget.button.bgOpacity / 100 : 1;
  const buttonBlurAmount = widget.button?.blurAmount || 0;
  const buttonHasShadow = widget.button?.hasShadow || false;
  const buttonShadowAmount = widget.button?.shadowAmount || 4;
  const buttonStrokeWidth = widget.button?.strokeWidth || 0;
  const buttonStrokeColor = widget.button?.strokeColor || '#000000';

  const getBackgroundStyle = () => {
    if (bgType === 'gradient' && widget.background?.gradient?.enabled) {
      const angle = widget.background.gradient.angle || 45;
      const colorStart = widget.background.gradient.colorStart || '#3b82f6';
      const colorEnd = widget.background.gradient.colorEnd || '#8b5cf6';
      return `linear-gradient(${angle}deg, ${colorStart}, ${colorEnd})`;
    }
    return bgColor;
  };

  // Helper to convert hex color to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const buttonStyle: React.CSSProperties = {
    borderRadius: `${buttonRadius}px`,
    backgroundColor: hexToRgba(buttonBgColor, buttonBgOpacity),
    color: buttonTextColor,
    padding: '12px 32px',
    border: buttonStrokeWidth > 0 ? `${buttonStrokeWidth}px solid ${buttonStrokeColor}` : 'none',
    boxShadow: buttonHasShadow ? `0 ${buttonShadowAmount}px ${buttonShadowAmount * 2}px rgba(0,0,0,0.1)` : 'none',
    backdropFilter: buttonBlurAmount > 0 ? `blur(${buttonBlurAmount}px)` : 'none',
    WebkitBackdropFilter: buttonBlurAmount > 0 ? `blur(${buttonBlurAmount}px)` : 'none',
  };

  return (
    <div 
      className="relative overflow-hidden flex"
      style={{
        height,
        marginTop: `${margin.top}px`,
        marginRight: `${margin.right}px`,
        marginBottom: `${margin.bottom}px`,
        marginLeft: `${margin.left}px`,
        alignItems: vertical === 'top' ? 'flex-start' : vertical === 'bottom' ? 'flex-end' : 'center',
      }}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ opacity: bgOpacity }}>
        {bgType === 'image' && widget.background?.url && (
          <img
            src={widget.background.url}
            alt="Hero background"
            className="w-full h-full object-cover"
            style={{ filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none' }}
          />
        )}
        {bgType === 'video' && widget.background?.url && (
          <video
            src={widget.background.url}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
            style={{ filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none' }}
          />
        )}
        {(bgType === 'color' || bgType === 'gradient') && (
          <div 
            className="w-full h-full" 
            style={{ background: getBackgroundStyle() }}
          />
        )}
      </div>

      {/* Background Overlay */}
      {widget.background?.overlay?.enabled && (
        <div className="absolute inset-0" style={{
          background: widget.background.overlay.gradient?.enabled 
            ? `linear-gradient(${widget.background.overlay.gradient.angle || 45}deg, ${widget.background.overlay.gradient.colorStart || '#000000'}, ${widget.background.overlay.gradient.colorEnd || '#ffffff'})`
            : widget.background.overlay.color || '#000000',
          opacity: (widget.background.overlay.opacity || 50) / 100,
        }} />
      )}

      {/* Content */}
      <div 
        className={cn(
          'relative z-10 w-full max-w-6xl mx-auto',
          horizontal === 'left' && 'text-left',
          horizontal === 'center' && 'text-center',
          horizontal === 'right' && 'text-right'
        )}
        style={{
          color: textColor,
          paddingTop: `${padding.top}px`,
          paddingRight: `${padding.right}px`,
          paddingBottom: `${padding.bottom}px`,
          paddingLeft: `${padding.left}px`,
        }}
      >
        <h1 
          className="mb-4"
          style={{ 
            fontFamily,
            fontSize: titleSize,
            fontWeight: titleWeight,
            lineHeight: titleLineHeight,
            letterSpacing: titleLetterSpacing,
            color: textColor,
          }}
        >
          {title}
        </h1>
        <p 
          className="mb-8"
          style={{ 
            fontFamily,
            fontSize: subtitleSize,
            fontWeight: subtitleWeight,
            lineHeight: subtitleLineHeight,
            color: textColor,
          }}
        >
          {subtitle}
        </p>
        <a
          href={buttonUrl}
          className="inline-block font-medium transition-all hover:opacity-90"
          style={buttonStyle}
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}

function AboutSection({ widget, styles }: { widget: AboutWidget; styles: any }) {
  return (
    <div className="py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{widget.content}</p>
          {widget.cta && (
            <a
              href={widget.cta.url}
              className="inline-block mt-6 px-6 py-2 rounded-md font-medium"
              style={{ 
                backgroundColor: styles.colors.primary,
                color: 'white'
              }}
            >
              {widget.cta.text}
            </a>
          )}
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img
            src={widget.image}
            alt="About"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

function ServicesSection({ widget, styles }: { widget: ServicesWidget; styles: any }) {
  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 
          className="text-3xl font-bold text-center mb-12"
          style={{ color: styles.colors.primary }}
        >
          {widget.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {widget.services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactSection({ widget, styles }: { widget: ContactWidget; styles: any }) {
  return (
    <div className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 
          className="text-3xl font-bold text-center mb-12"
          style={{ color: styles.colors.primary }}
        >
          Get In Touch
        </h2>
        <form className="space-y-4">
          {widget.formFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  className="w-full px-4 py-2 border rounded-md"
                  rows={4}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 rounded-md font-medium text-white"
            style={{ backgroundColor: styles.colors.primary }}
          >
            {widget.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

// New section renderers
function HeadlineSection({ widget }: { widget: HeadlineWidget }) {
  const padding = widget.padding || { top: 40, right: 20, bottom: 40, left: 20 };
  const margin = widget.margin || { top: 0, right: 0, bottom: 0, left: 0 };
  
  const heightType = widget.height?.type || 'auto';
  const heightValue = widget.height?.value || 100;
  let height = 'auto';
  if (heightType === 'vh') height = `${heightValue}vh`;
  else if (heightType === 'percentage') height = `${heightValue}%`;
  else if (heightType === 'pixels') height = `${heightValue}px`;
  
  return (
    <div 
      className={cn('flex items-center', `text-${widget.textAlign || 'center'}`)}
      style={{ 
        backgroundColor: widget.background.color,
        paddingTop: `${padding.top}px`,
        paddingRight: `${padding.right}px`,
        paddingBottom: `${padding.bottom}px`,
        paddingLeft: `${padding.left}px`,
        marginTop: `${margin.top}px`,
        marginRight: `${margin.right}px`,
        marginBottom: `${margin.bottom}px`,
        marginLeft: `${margin.left}px`,
        height,
      }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-4xl font-bold mb-3">{widget.title}</h2>
        {widget.subtitle && <p className="text-xl text-muted-foreground">{widget.subtitle}</p>}
      </div>
    </div>
  );
}

function ImageTextSection({ widget }: { widget: ImageTextWidget }) {
  const { deviceView } = useBuilderStore();
  const padding = widget.padding || { top: 60, right: 40, bottom: 60, left: 40 };
  const margin = widget.margin || { top: 0, right: 0, bottom: 0, left: 0 };
  
  // Image height calculation
  const imageHeightType = widget.imageHeight?.type || 'auto';
  const defaultValue = imageHeightType === 'pixels' ? 350 : 50;
  const imageHeightValue = widget.imageHeight?.value || defaultValue;
  let imageHeight = 'auto';
  if (imageHeightType === 'vh') imageHeight = `${imageHeightValue}vh`;
  else if (imageHeightType === 'pixels') imageHeight = `${imageHeightValue}px`;
  else imageHeight = 'auto';

  const imageBorderRadius = widget.imageBorderRadius || 0;
  const imageObjectFit = widget.imageObjectFit || 'cover';
  const imageObjectPosition = `${widget.imageObjectPosition?.x || 'center'} ${widget.imageObjectPosition?.y || 'center'}`;
  
  const textAlign = widget.textAlign || 'left';
  const textVerticalAlign = widget.textVerticalAlign || 'middle';
  
  // Background styling
  const bgType = widget.background?.type || 'none';
  const bgColor = widget.background?.color || '#ffffff';
  const bgOpacity = (widget.background?.opacity || 100) / 100;

  // Helper to convert hex color to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex || !hex.startsWith('#')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const sectionStyle: React.CSSProperties = {
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
    position: 'relative',
  };

  // Calculate fixed aspect ratio for image frame
  const getImageFrameHeight = () => {
    if (imageHeightType === 'auto') {
      // Default to 3:2 aspect ratio when auto
      return 'auto';
    } else if (imageHeightType === 'vh') {
      return `${imageHeightValue}vh`;
    } else if (imageHeightType === 'pixels') {
      return `${imageHeightValue}px`;
    }
    return 'auto';
  };

  const imageFrameHeight = getImageFrameHeight();

  const imageComponent = widget.image ? (
    <div 
      className="relative overflow-hidden w-full flex-shrink-0"
      style={{ 
        height: imageFrameHeight === 'auto' ? undefined : imageFrameHeight,
        aspectRatio: imageFrameHeight === 'auto' ? '3/2' : undefined,
        borderRadius: `${imageBorderRadius}px`,
        minHeight: 0, // Prevent flex item from growing beyond its content
      }}
    >
      <img 
        src={widget.image} 
        alt={widget.title || ''} 
        className="w-full h-full"
        style={{
          objectFit: imageObjectFit as any,
          objectPosition: imageObjectPosition,
          display: 'block',
        }}
      />
    </div>
  ) : (
    // Placeholder when no image
    <div 
      className="relative overflow-hidden bg-muted flex items-center justify-center w-full flex-shrink-0"
      style={{ 
        height: imageFrameHeight === 'auto' ? undefined : imageFrameHeight,
        aspectRatio: imageFrameHeight === 'auto' ? '3/2' : undefined,
        borderRadius: `${imageBorderRadius}px`,
        minHeight: 0,
      }}
    >
      <p className="text-muted-foreground">No image selected</p>
    </div>
  );

  // Button styling
  const buttonRadius = widget.buttonStyles?.radius || 8;
  const buttonBgColor = widget.buttonStyles?.bgColor || '#3b82f6';
  const buttonTextColor = widget.buttonStyles?.textColor || '#ffffff';
  const buttonBgOpacity = widget.buttonStyles?.bgOpacity !== undefined ? widget.buttonStyles.bgOpacity / 100 : 1;
  const buttonBlurAmount = widget.buttonStyles?.blurAmount || 0;
  const buttonHasShadow = widget.buttonStyles?.hasShadow ?? true;
  const buttonShadowAmount = widget.buttonStyles?.shadowAmount || 4;
  const buttonStrokeWidth = widget.buttonStyles?.strokeWidth || 0;
  const buttonStrokeColor = widget.buttonStyles?.strokeColor || '#000000';

  const buttonStyle: React.CSSProperties = {
    borderRadius: `${buttonRadius}px`,
    backgroundColor: hexToRgba(buttonBgColor, buttonBgOpacity),
    color: buttonTextColor,
    padding: '12px 32px',
    border: buttonStrokeWidth > 0 ? `${buttonStrokeWidth}px solid ${buttonStrokeColor}` : 'none',
    boxShadow: buttonHasShadow ? `0 ${buttonShadowAmount}px ${buttonShadowAmount * 2}px rgba(0,0,0,0.1)` : 'none',
    backdropFilter: buttonBlurAmount > 0 ? `blur(${buttonBlurAmount}px)` : 'none',
    WebkitBackdropFilter: buttonBlurAmount > 0 ? `blur(${buttonBlurAmount}px)` : 'none',
    alignSelf: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
  };

  const textComponent = (
    <div 
      className={cn('flex flex-col h-full')}
      style={{
        textAlign: textAlign as any,
        justifyContent: textVerticalAlign === 'top' ? 'flex-start' : textVerticalAlign === 'bottom' ? 'flex-end' : 'center',
      }}
    >
      {widget.title && <h2 className="text-3xl font-bold mb-4">{widget.title}</h2>}
      <p className="text-lg leading-relaxed whitespace-pre-wrap">{widget.content}</p>
      {widget.cta && (
        <a 
          href={widget.cta.url} 
          className="inline-block mt-6"
          style={buttonStyle}
        >
          {widget.cta.text}
        </a>
      )}
    </div>
  );

  return (
    <div className="relative" style={sectionStyle}>
      {/* Background layer */}
      {bgType !== 'none' && (
        <div className="absolute inset-0">
          {bgType === 'color' && (
            <div 
              className="w-full h-full" 
              style={{ backgroundColor: hexToRgba(bgColor, bgOpacity) }}
            />
          )}
          {bgType === 'image' && widget.background?.url && (
            <img
              src={widget.background.url}
              alt="Section background"
              className="w-full h-full object-cover"
              style={{ opacity: bgOpacity }}
            />
          )}
          {bgType === 'video' && widget.background?.url && (
            <video
              src={widget.background.url}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
              style={{ opacity: bgOpacity }}
            />
          )}
        </div>
      )}

      {/* Content layer */}
      <div className="relative z-10">
        {/* Check device view to determine layout */}
        {deviceView === 'mobile' ? (
          /* Mobile Layout */
          <div 
            className={cn(
              'max-w-6xl mx-auto grid items-center',
              widget.mobileLayout === 'horizontal' ? 'grid-cols-2' : 'grid-cols-1'
            )}
            style={{ gap: `${widget.gap || 40}px` }}
          >
            {widget.mobileLayout === 'stacked-image-bottom' ? (
              <>
                {textComponent}
                {imageComponent}
              </>
            ) : (
              // Default: stacked-image-top or horizontal
              <>
                {imageComponent}
                {textComponent}
              </>
            )}
          </div>
        ) : (
          /* Desktop & Tablet Layout */
          <div 
            className="max-w-6xl mx-auto grid items-center grid-cols-2"
            style={{ gap: `${widget.gap || 40}px` }}
          >
            {widget.layout === 'image-left' ? (
              <>
                {imageComponent}
                {textComponent}
              </>
            ) : (
              <>
                {textComponent}
                {imageComponent}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ImageGallerySection({ widget }: { widget: ImageGalleryWidget }) {
  const { getCollectionById } = useImageCollectionsStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Get images from collection or fallback to legacy images array
  const collection = widget.collectionId ? getCollectionById(widget.collectionId) : null;
  const allImages = collection?.images || widget.images || [];
  
  // Sort images by order
  const sortedImages = [...allImages].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Limit images if maxImages is set
  const displayImages = widget.maxImages 
    ? sortedImages.slice(0, widget.maxImages)
    : sortedImages;

  if (displayImages.length === 0) {
    return (
      <div className="py-16 px-6 text-center text-muted-foreground">
        <p>No images to display. Please select a collection with images.</p>
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    if (widget.lightbox?.enabled) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  // Apply background styles
  const bgType = widget.background?.type || 'color';
  const bgColor = widget.background?.color || 'transparent';
  const bgOpacity = (widget.background?.opacity || 100) / 100;
  
  let backgroundStyle: React.CSSProperties = {};
  if (bgType === 'color' && bgColor !== 'transparent') {
    backgroundStyle.backgroundColor = bgColor;
    backgroundStyle.opacity = bgOpacity;
  } else if (bgType === 'image' && widget.background?.url) {
    backgroundStyle.backgroundImage = `url(${widget.background.url})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
  } else if (bgType === 'video' && widget.background?.url) {
    backgroundStyle.position = 'relative';
  }

  // Apply layout styles
  const heightType = widget.layout?.height?.type || 'auto';
  const heightValue = widget.layout?.height?.value || 100;
  let height = 'auto';
  if (heightType === 'vh') height = `${heightValue}vh`;
  else if (heightType === 'pixels') height = `${heightValue}px`;

  const padding = widget.layout?.padding || { top: 40, right: 20, bottom: 40, left: 20 };
  const margin = widget.layout?.margin || { top: 0, right: 0, bottom: 0, left: 0 };
  const width = widget.layout?.width || 'container';

  const sectionStyle: React.CSSProperties = {
    ...backgroundStyle,
    minHeight: height,
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
  };

  const containerClass = width === 'container' ? 'max-w-6xl mx-auto' : 'w-full';

  return (
    <>
      <div style={sectionStyle}>
        <div className={containerClass}>
          {widget.style === 'grid' && (
            <GridGallery
              images={displayImages}
              columns={widget.columns}
              gap={widget.gap}
              aspectRatio={widget.aspectRatio || '3:2'}
              onImageClick={handleImageClick}
            />
          )}
          {widget.style === 'mosaic' && (
            <MosaicGallery
              images={displayImages}
              columns={widget.columns}
              gap={widget.gap}
              onImageClick={handleImageClick}
            />
          )}
          {widget.style === 'set-layout' && (
            <SetLayoutGallery
              images={displayImages}
              gap={widget.gap}
              onImageClick={handleImageClick}
            />
          )}
        </div>
      </div>

      {lightboxOpen && widget.lightbox?.enabled && (
        <Lightbox
          images={sortedImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          showCaptions={widget.lightbox.showCaptions}
        />
      )}
    </>
  );
}

function GridGallery({
  images,
  columns,
  gap,
  aspectRatio,
  onImageClick,
}: {
  images: any[];
  columns: number;
  gap: number;
  aspectRatio: string;
  onImageClick: (index: number) => void;
}) {
  const { deviceView } = useBuilderStore();
  
  // Responsive columns
  let responsiveColumns = columns;
  if (deviceView === 'mobile') {
    responsiveColumns = Math.min(columns, 2);
  } else if (deviceView === 'tablet') {
    responsiveColumns = Math.max(2, columns - 1);
  }

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative overflow-hidden rounded cursor-pointer hover:opacity-90 transition-opacity"
          style={{ aspectRatio: aspectRatio.replace(':', '/') }}
          onClick={() => onImageClick(index)}
        >
          {image.url.startsWith('data:') ? (
            <img src={image.url} alt={image.caption || `Image ${index + 1}`} className="w-full h-full object-cover" />
          ) : (
            <img src={image.url} alt={image.caption || `Image ${index + 1}`} className="w-full h-full object-cover" />
          )}
        </div>
      ))}
    </div>
  );
}

function MosaicGallery({
  images,
  columns,
  gap,
  onImageClick,
}: {
  images: any[];
  columns: number;
  gap: number;
  onImageClick: (index: number) => void;
}) {
  const { deviceView } = useBuilderStore();
  
  // Responsive columns
  let responsiveColumns = columns;
  if (deviceView === 'mobile') {
    responsiveColumns = 1;
  } else if (deviceView === 'tablet') {
    responsiveColumns = 2;
  }

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
        gridAutoRows: '200px',
        gridAutoFlow: 'dense',
        gap: `${gap}px`,
      }}
    >
      {images.map((image, index) => {
        // Randomly make some images taller for variety
        const spanRows = index % 3 === 0 ? 2 : 1;
        return (
          <div
            key={image.id}
            className="relative overflow-hidden rounded cursor-pointer hover:opacity-90 transition-opacity"
            style={{ gridRow: `span ${spanRows}` }}
            onClick={() => onImageClick(index)}
          >
            {image.url.startsWith('data:') ? (
              <img src={image.url} alt={image.caption || `Image ${index + 1}`} className="w-full h-full object-cover" />
            ) : (
              <img src={image.url} alt={image.caption || `Image ${index + 1}`} className="w-full h-full object-cover" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SetLayoutGallery({
  images,
  gap,
  onImageClick,
}: {
  images: any[];
  gap: number;
  onImageClick: (index: number) => void;
}) {
  const { deviceView } = useBuilderStore();

  if (deviceView === 'mobile') {
    // Stack vertically on mobile
    return (
      <div className="flex flex-col" style={{ gap: `${gap}px` }}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative overflow-hidden rounded cursor-pointer hover:opacity-90 transition-opacity"
            style={{ aspectRatio: '3/2' }}
            onClick={() => onImageClick(index)}
          >
            {image.url.startsWith('data:') ? (
              <img src={image.url} alt={image.caption || `Image ${index + 1}`} className="w-full h-full object-cover" />
            ) : (
              <img src={image.url} alt={image.caption || `Image ${index + 1}`} className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Desktop/Tablet: Pattern layout
  // Pattern: [img1 img2] [img3----] [img4----] [img5 img6] ...
  const renderPattern = () => {
    const elements = [];
    let imageIndex = 0;

    while (imageIndex < images.length) {
      const patternBlock = [];
      
      // Row 1: Two images side by side
      if (imageIndex < images.length) {
        patternBlock.push(
          <div key={`row1-${imageIndex}`} className="grid grid-cols-2" style={{ gap: `${gap}px` }}>
            {images[imageIndex] && (
              <div
                className="relative overflow-hidden rounded cursor-pointer hover:opacity-90 transition-opacity"
                style={{ aspectRatio: '3/2' }}
                onClick={() => onImageClick(imageIndex)}
              >
                {images[imageIndex].url.startsWith('data:') ? (
                  <img src={images[imageIndex].url} alt={images[imageIndex].caption || `Image ${imageIndex + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <Image src={images[imageIndex].url} alt={images[imageIndex].caption || `Image ${imageIndex + 1}`} fill className="object-cover" />
                )}
              </div>
            )}
            {images[imageIndex + 1] && (
              <div
                className="relative overflow-hidden rounded cursor-pointer hover:opacity-90 transition-opacity"
                style={{ aspectRatio: '3/2' }}
                onClick={() => onImageClick(imageIndex + 1)}
              >
                {images[imageIndex + 1].url.startsWith('data:') ? (
                  <img src={images[imageIndex + 1].url} alt={images[imageIndex + 1].caption || `Image ${imageIndex + 2}`} className="w-full h-full object-cover" />
                ) : (
                  <Image src={images[imageIndex + 1].url} alt={images[imageIndex + 1].caption || `Image ${imageIndex + 2}`} fill className="object-cover" />
                )}
              </div>
            )}
          </div>
        );
        imageIndex += 2;
      }

      // Row 2: One full-width image
      if (imageIndex < images.length) {
        patternBlock.push(
          <div
            key={`row2-${imageIndex}`}
            className="relative overflow-hidden rounded cursor-pointer hover:opacity-90 transition-opacity"
            style={{ aspectRatio: '3/2' }}
            onClick={() => onImageClick(imageIndex)}
          >
            {images[imageIndex].url.startsWith('data:') ? (
              <img src={images[imageIndex].url} alt={images[imageIndex].caption || `Image ${imageIndex + 1}`} className="w-full h-full object-cover" />
            ) : (
              <Image src={images[imageIndex].url} alt={images[imageIndex].caption || `Image ${imageIndex + 1}`} fill className="object-cover" />
            )}
          </div>
        );
        imageIndex++;
      }

      // Row 3: One full-width image
      if (imageIndex < images.length) {
        patternBlock.push(
          <div
            key={`row3-${imageIndex}`}
            className="relative overflow-hidden rounded cursor-pointer hover:opacity-90 transition-opacity"
            style={{ aspectRatio: '3/2' }}
            onClick={() => onImageClick(imageIndex)}
          >
            {images[imageIndex].url.startsWith('data:') ? (
              <img src={images[imageIndex].url} alt={images[imageIndex].caption || `Image ${imageIndex + 1}`} className="w-full h-full object-cover" />
            ) : (
              <Image src={images[imageIndex].url} alt={images[imageIndex].caption || `Image ${imageIndex + 1}`} fill className="object-cover" />
            )}
          </div>
        );
        imageIndex++;
      }

      elements.push(
        <div key={`pattern-${imageIndex}`} className="flex flex-col" style={{ gap: `${gap}px` }}>
          {patternBlock}
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="flex flex-col" style={{ gap: `${gap}px` }}>
      {renderPattern()}
    </div>
  );
}

function CustomCodeSection({ widget }: { widget: CustomCodeWidget }) {
  return (
    <div className="py-8 px-6">
      <style dangerouslySetInnerHTML={{ __html: widget.css }} />
      <div dangerouslySetInnerHTML={{ __html: widget.html }} />
      <script dangerouslySetInnerHTML={{ __html: widget.javascript }} />
    </div>
  );
}

function ImageNavigationSection({ widget }: { widget: ImageNavigationWidget }) {
  return (
    <div className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: `repeat(${widget.columns}, 1fr)`,
            gap: `${widget.gap}px`,
          }}
        >
          {widget.items.map((item) => (
            <a 
              key={item.id} 
              href={item.url}
              className="relative h-64 rounded-lg overflow-hidden group"
            >
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{item.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function IconTextSection({ widget }: { widget: IconTextWidget }) {
  const { deviceView } = useBuilderStore();

  // Ensure alignment has a valid value
  const alignment = widget.alignment || 'center';

  // Icon size mapping
  const ICON_SIZES = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const iconSizeClass = ICON_SIZES[widget.iconSize || 'md'];
  
  // Safeguard for columns, gap, and items
  const columns = widget.columns || 3;
  const gap = widget.gap ?? 24;
  const items = widget.items || [];
  
  // Box styling
  const boxed = widget.boxed || false;
  const boxBackground = widget.boxBackground || '#ffffff';
  const boxBorderRadius = widget.boxBorderRadius ?? 12;
  const boxPadding = widget.boxPadding ?? 24;
  const boxShadow = widget.boxShadow !== false; // Default to true
  const boxBorder = widget.boxBorder || false;
  const boxBorderColor = widget.boxBorderColor || '#e5e7eb';
  const boxBorderWidth = widget.boxBorderWidth ?? 1;
  
  const boxStyle: React.CSSProperties = boxed ? {
    backgroundColor: boxBackground,
    borderRadius: `${boxBorderRadius}px`,
    padding: `${boxPadding}px`,
    ...(boxShadow && {
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    }),
    ...(boxBorder && {
      border: `${boxBorderWidth}px solid ${boxBorderColor}`,
    }),
  } : {};

  // Determine number of columns based on device view
  let displayColumns = columns;
  if (deviceView === 'mobile') {
    displayColumns = 1;
  } else if (deviceView === 'tablet') {
    displayColumns = Math.max(2, columns - 1);
  }

  // Determine items to display
  const displayItems = widget.showViewMore && widget.itemsBeforeViewMore
    ? items.slice(0, widget.itemsBeforeViewMore)
    : items;

  // Background styling
  const bgType = widget.background?.type || 'none';
  const bgColor = widget.background?.color || 'transparent';
  const bgOpacity = (widget.background?.opacity || 100) / 100;
  const bgBlur = widget.background?.blur || 0;

  // Layout - with robust safeguards for corrupted data
  const defaultLayout = {
    height: { type: 'auto' as const },
    width: 'container' as const,
    padding: { top: 60, right: 20, bottom: 60, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  
  // Ensure layout is an object and has proper structure
  const layoutCfg = (widget.layout && typeof widget.layout === 'object' && 'height' in widget.layout)
    ? {
        height: widget.layout.height || defaultLayout.height,
        width: widget.layout.width || defaultLayout.width,
        padding: widget.layout.padding || defaultLayout.padding,
        margin: widget.layout.margin || defaultLayout.margin,
      }
    : defaultLayout;

  let heightStyle: React.CSSProperties = {};
  if (layoutCfg.height?.type === 'vh') {
    heightStyle.height = `${layoutCfg.height.value || 100}vh`;
  } else if (layoutCfg.height?.type === 'pixels') {
    heightStyle.height = `${layoutCfg.height.value || 500}px`;
  }

  const sectionStyle: React.CSSProperties = {
    ...heightStyle,
    paddingTop: `${layoutCfg.padding?.top || 60}px`,
    paddingRight: `${layoutCfg.padding?.right || 20}px`,
    paddingBottom: `${layoutCfg.padding?.bottom || 60}px`,
    paddingLeft: `${layoutCfg.padding?.left || 20}px`,
    marginTop: `${layoutCfg.margin?.top || 0}px`,
    marginRight: `${layoutCfg.margin?.right || 0}px`,
    marginBottom: `${layoutCfg.margin?.bottom || 0}px`,
    marginLeft: `${layoutCfg.margin?.left || 0}px`,
  };

  return (
    <div className="relative overflow-hidden" style={sectionStyle}>
      {/* Background layer */}
      {bgType !== 'none' && (
        <div className="absolute inset-0 z-0">
          {bgType === 'color' && (
            <div
              className="w-full h-full"
              style={{
                backgroundColor: bgColor,
                opacity: bgOpacity,
              }}
            />
          )}
          {bgType === 'image' && widget.background?.url && (
            <img
              src={widget.background.url}
              alt="Section background"
              className="w-full h-full object-cover"
              style={{ 
                opacity: bgOpacity,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
          {bgType === 'video' && widget.background?.url && (
            <video
              src={widget.background.url}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
              style={{ opacity: bgOpacity }}
            />
          )}
          {bgBlur > 0 && (
            <div
              className="absolute inset-0"
              style={{ backdropFilter: `blur(${bgBlur}px)` }}
            />
          )}
        </div>
      )}

      {/* Content layer */}
      <div className={cn('relative z-10', layoutCfg.width === 'container' && 'max-w-6xl mx-auto')}>
        {/* Section Header */}
        {(widget.sectionHeading || widget.sectionSubheading) && (
          <div className="text-center mb-12">
            {widget.sectionHeading && (
              <h2
                className="text-4xl font-bold mb-4"
                style={{ color: widget.sectionHeadingColor || '#1f2937' }}
              >
                {widget.sectionHeading}
              </h2>
            )}
            {widget.sectionSubheading && (
              <p
                className="text-lg"
                style={{ color: widget.sectionSubheadingColor || '#6b7280' }}
              >
                {widget.sectionSubheading}
              </p>
            )}
          </div>
        )}

        {/* Items Grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${displayColumns}, minmax(0, 1fr))`,
            gap: `${deviceView === 'mobile' ? gap / 2 : gap}px`,
          }}
        >
          {displayItems.map((item) => {
            const IconComponent = getIcon(item.icon);

            if (alignment === 'left') {
              // Left Aligned Layout
              return (
                <div key={item.id} className="flex gap-4 items-start" style={boxStyle}>
                  {/* Icon Container */}
                  <div
                    className="flex-shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: item.iconBgColor || 'transparent',
                      padding: widget.iconSize === 'sm' ? '12px' : widget.iconSize === 'md' ? '16px' : widget.iconSize === 'lg' ? '20px' : '24px',
                    }}
                  >
                    <IconComponent className={iconSizeClass} color={item.iconColor} />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    {item.heading && (
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ color: item.headingColor || '#1f2937' }}
                      >
                        {item.heading}
                      </h3>
                    )}
                    {item.subheading && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: item.subheadingColor || '#6b7280' }}
                      >
                        {item.subheading}
                      </p>
                    )}
                  </div>
                </div>
              );
            } else {
              // Center Aligned Layout
              return (
                <div key={item.id} className="flex flex-col items-center text-center" style={boxStyle}>
                  {/* Icon Container */}
                  <div
                    className="rounded-full flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: item.iconBgColor || 'transparent',
                      padding: widget.iconSize === 'sm' ? '12px' : widget.iconSize === 'md' ? '16px' : widget.iconSize === 'lg' ? '20px' : '24px',
                    }}
                  >
                    <IconComponent className={iconSizeClass} color={item.iconColor} />
                  </div>

                  {/* Text Content */}
                  <div>
                    {item.heading && (
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ color: item.headingColor || '#1f2937' }}
                      >
                        {item.heading}
                      </h3>
                    )}
                    {item.subheading && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: item.subheadingColor || '#6b7280' }}
                      >
                        {item.subheading}
                      </p>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* View More Button */}
        {widget.showViewMore && widget.viewMoreUrl && (
          <div className="mt-12 text-center">
            <a
              href={widget.viewMoreUrl}
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {widget.viewMoreText || 'View More'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function TextSectionComponent({ widget }: { widget: TextSectionWidget }) {
  const { deviceView } = useBuilderStore();

  // Safeguards
  const layout = widget.layout || 'side-by-side';
  const headingAlignment = widget.headingAlignment || 'left';
  const bodyAlignment = widget.bodyAlignment || 'left';
  const headingSize = widget.headingSize ?? 48;
  const bodySize = widget.bodySize ?? 16;
  const taglineSize = widget.taglineSize ?? 14;
  const columnGap = widget.columnGap ?? 60;
  const rowGap = widget.rowGap ?? 24;
  const headingColumnWidth = widget.headingColumnWidth ?? 40;
  const reverseOrder = widget.reverseOrder || false;

  // Force stacked layout on mobile
  const effectiveLayout = deviceView === 'mobile' ? 'stacked' : layout;

  // Background styling
  const bgType = widget.background?.type || 'none';
  const bgColor = widget.background?.color || 'transparent';
  const bgOpacity = (widget.background?.opacity || 100) / 100;
  const bgBlur = widget.background?.blur || 0;

  // Layout config
  const defaultLayout = {
    height: { type: 'auto' as const },
    width: 'container' as const,
    padding: { top: 80, right: 20, bottom: 80, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  
  const layoutCfg = (widget.layout && typeof widget.layout === 'object' && 'height' in widget.layout)
    ? {
        height: widget.layout.height || defaultLayout.height,
        width: widget.layout.width || defaultLayout.width,
        padding: widget.layout.padding || defaultLayout.padding,
        margin: widget.layout.margin || defaultLayout.margin,
      }
    : defaultLayout;

  let heightStyle: React.CSSProperties = {};
  if (layoutCfg.height?.type === 'vh') {
    heightStyle.height = `${layoutCfg.height.value || 100}vh`;
  } else if (layoutCfg.height?.type === 'pixels') {
    heightStyle.height = `${layoutCfg.height.value || 500}px`;
  }

  const sectionStyle: React.CSSProperties = {
    ...heightStyle,
    paddingTop: `${layoutCfg.padding?.top || 80}px`,
    paddingRight: `${layoutCfg.padding?.right || 20}px`,
    paddingBottom: `${layoutCfg.padding?.bottom || 80}px`,
    paddingLeft: `${layoutCfg.padding?.left || 20}px`,
    marginTop: `${layoutCfg.margin?.top || 0}px`,
    marginRight: `${layoutCfg.margin?.right || 0}px`,
    marginBottom: `${layoutCfg.margin?.bottom || 0}px`,
    marginLeft: `${layoutCfg.margin?.left || 0}px`,
  };

  // Button styling
  const buttonStyle = widget.buttonStyle || {
    backgroundColor: '#10b981',
    backgroundOpacity: 100,
    textColor: '#ffffff',
    borderRadius: 8,
    blur: 0,
    shadow: true,
    borderWidth: 0,
    borderColor: '#000000',
  };

  const buttonBgColor = buttonStyle.backgroundColor;
  const buttonOpacity = (buttonStyle.backgroundOpacity || 100) / 100;
  const buttonTextColor = buttonStyle.textColor;
  const buttonBorderRadius = buttonStyle.borderRadius;
  const buttonBlur = buttonStyle.blur || 0;
  const buttonShadow = buttonStyle.shadow;
  const buttonBorderWidth = buttonStyle.borderWidth || 0;
  const buttonBorderColor = buttonStyle.borderColor;

  const buttonContainerStyle: React.CSSProperties = {
    backgroundColor: buttonBgColor,
    opacity: buttonOpacity,
    color: buttonTextColor,
    borderRadius: `${buttonBorderRadius}px`,
    ...(buttonBlur > 0 && { backdropFilter: `blur(${buttonBlur}px)` }),
    ...(buttonShadow && { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }),
    ...(buttonBorderWidth > 0 && {
      border: `${buttonBorderWidth}px solid ${buttonBorderColor}`,
    }),
  };

  // Alignment classes
  const getAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  // Responsive font sizes
  const responsiveHeadingSize = deviceView === 'mobile' ? Math.min(headingSize, 32) : deviceView === 'tablet' ? Math.min(headingSize, 36) : headingSize;
  const responsiveBodySize = deviceView === 'mobile' ? Math.min(bodySize, 14) : bodySize;

  // Tagline component (subheader - appears under heading)
  const taglineElement = widget.tagline && (
    <div
      className={`font-semibold uppercase tracking-wide mt-3 ${getAlignmentClass(headingAlignment)}`}
      style={{
        color: widget.taglineColor || '#10b981',
        fontSize: `${taglineSize}px`,
      }}
    >
      {widget.tagline}
    </div>
  );

  // Heading component
  const headingElement = (
    <h2
      className={`font-bold ${getAlignmentClass(headingAlignment)}`}
      style={{
        color: widget.headingColor || '#1f2937',
        fontSize: `${responsiveHeadingSize}px`,
        lineHeight: '1.2',
      }}
    >
      {widget.heading}
    </h2>
  );

  // Body component
  const bodyElement = (
    <div
      className={`${getAlignmentClass(bodyAlignment)}`}
      style={{
        color: widget.bodyTextColor || '#6b7280',
        fontSize: `${responsiveBodySize}px`,
        lineHeight: '1.6',
        maxWidth: bodyAlignment === 'center' ? '65ch' : 'none',
        margin: bodyAlignment === 'center' ? '0 auto' : '0',
      }}
    >
      {widget.bodyText}
    </div>
  );

  // Button component
  const buttonElement = widget.buttonText && widget.buttonText.trim() !== '' && (
    <div className={`mt-6 ${getAlignmentClass(bodyAlignment)}`}>
      <a
        href={widget.buttonUrl || '#'}
        className="inline-block px-6 py-3 font-medium transition-all hover:scale-105"
        style={buttonContainerStyle}
      >
        {widget.buttonText}
      </a>
    </div>
  );

  return (
    <div className="relative overflow-hidden" style={sectionStyle}>
      {/* Background layer */}
      {bgType !== 'none' && (
        <div className="absolute inset-0 z-0">
          {bgType === 'color' && (
            <div
              className="w-full h-full"
              style={{
                backgroundColor: bgColor,
                opacity: bgOpacity,
              }}
            />
          )}
          {bgType === 'image' && widget.background?.url && (
            <img
              src={widget.background.url}
              alt="Section background"
              className="w-full h-full object-cover"
              style={{ 
                opacity: bgOpacity,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
          {bgType === 'video' && widget.background?.url && (
            <video
              src={widget.background.url}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
              style={{ opacity: bgOpacity }}
            />
          )}
          {bgBlur > 0 && (
            <div
              className="absolute inset-0"
              style={{ backdropFilter: `blur(${bgBlur}px)` }}
            />
          )}
        </div>
      )}

      {/* Content layer */}
      <div className={cn('relative z-10', layoutCfg.width === 'container' && 'max-w-6xl mx-auto')}>
        {effectiveLayout === 'side-by-side' ? (
          // Side by Side Layout
          <div
            className="grid items-start"
            style={{
              gridTemplateColumns: reverseOrder
                ? `${100 - headingColumnWidth}% ${headingColumnWidth}%`
                : `${headingColumnWidth}% ${100 - headingColumnWidth}%`,
              gap: `${columnGap}px`,
            }}
          >
            {reverseOrder ? (
              <>
                {/* Body Column */}
                <div>
                  {bodyElement}
                  {buttonElement}
                </div>
                {/* Heading Column */}
                <div>
                  {headingElement}
                  {taglineElement}
                </div>
              </>
            ) : (
              <>
                {/* Heading Column */}
                <div>
                  {headingElement}
                  {taglineElement}
                </div>
                {/* Body Column */}
                <div>
                  {bodyElement}
                  {buttonElement}
                </div>
              </>
            )}
          </div>
        ) : (
          // Stacked Layout
          <div className="flex flex-col" style={{ gap: `${rowGap}px` }}>
            <div>
              {headingElement}
              {taglineElement}
            </div>
            {bodyElement}
            {buttonElement}
          </div>
        )}
      </div>
    </div>
  );
}

function FAQSection({ widget }: { widget: FAQWidget }) {
  const { deviceView } = useBuilderStore();
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  // Ensure defaults
  const heading = widget.heading || 'Have Questions?';
  const headingColor = widget.headingColor || '#1f2937';
  const headingSize = widget.headingSize || 48;
  const headingAlignment = widget.headingAlignment || 'center';
  
  const subheading = widget.subheading || '';
  const subheadingColor = widget.subheadingColor || '#6b7280';
  const subheadingSize = widget.subheadingSize || 18;
  const subheadingAlignment = widget.subheadingAlignment || 'center';
  
  const items = widget.items || [];
  
  const questionFontSize = widget.questionFontSize || 18;
  const questionColor = widget.questionColor || '#1f2937';
  const questionAlignment = widget.questionAlignment || 'left';
  const questionFontWeight = widget.questionFontWeight || 600;
  
  const answerFontSize = widget.answerFontSize || 16;
  const answerColor = widget.answerColor || '#6b7280';
  const answerAlignment = widget.answerAlignment || 'left';
  const answerFontWeight = widget.answerFontWeight || 400;
  
  const iconStyle = widget.iconStyle || 'chevron';
  const iconColor = widget.iconColor || '#10b981';
  const iconBackgroundColor = widget.iconBackgroundColor || '#d1fae5';
  const iconCircleSize = widget.iconCircleSize || 40;
  const iconPosition = widget.iconPosition || 'left';
  
  const itemStyle = widget.itemStyle || 'clean';
  
  const boxBackgroundColor = widget.boxBackgroundColor || '#f9fafb';
  const boxBorderRadius = widget.boxBorderRadius || 12;
  const boxPadding = widget.boxPadding || 24;
  const boxShadow = widget.boxShadow || false;
  const boxBorder = widget.boxBorder || false;
  const boxBorderColor = widget.boxBorderColor || '#e5e7eb';
  const boxBorderWidth = widget.boxBorderWidth || 1;
  
  const dividerColor = widget.dividerColor || '#e5e7eb';
  const dividerWidth = widget.dividerWidth || 1;
  
  const itemGap = widget.itemGap || 16;
  const questionAnswerGap = widget.questionAnswerGap || 12;
  const headerGap = widget.headerGap || 40;

  // Responsive adjustments
  const responsiveHeadingSize = deviceView === 'mobile' ? headingSize * 0.7 : deviceView === 'tablet' ? headingSize * 0.85 : headingSize;
  const responsiveSubheadingSize = deviceView === 'mobile' ? subheadingSize * 0.9 : subheadingSize;
  const responsiveIconCircleSize = deviceView === 'mobile' ? iconCircleSize * 0.8 : iconCircleSize;
  const responsiveBoxPadding = deviceView === 'mobile' ? boxPadding * 0.75 : boxPadding;

  const getAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  const renderFAQIcon = (isOpen: boolean) => {
    const iconSize = responsiveIconCircleSize * 0.5;
    const iconProps = {
      style: { width: iconSize, height: iconSize, color: iconColor },
      className: 'transition-transform duration-200'
    };

    switch (iconStyle) {
      case 'chevron':
        return <ChevronRight {...iconProps} className={`${iconProps.className} ${isOpen ? 'rotate-90' : ''}`} />;
      case 'plus-minus':
        return isOpen ? <Minus {...iconProps} /> : <Plus {...iconProps} />;
      case 'arrow':
        return <ArrowRight {...iconProps} className={`${iconProps.className} ${isOpen ? 'rotate-90' : ''}`} />;
      case 'caret':
        return <ChevronDown {...iconProps} className={`${iconProps.className} ${isOpen ? '' : '-rotate-90'}`} />;
      default:
        return <ChevronRight {...iconProps} className={`${iconProps.className} ${isOpen ? 'rotate-90' : ''}`} />;
    }
  };

  const toggleItem = (itemId: string) => {
    setOpenItemId(openItemId === itemId ? null : itemId);
  };

  const getItemStyle = (index: number) => {
    const baseStyle: React.CSSProperties = {
      cursor: 'pointer',
    };

    if (itemStyle === 'boxed') {
      return {
        ...baseStyle,
        backgroundColor: boxBackgroundColor,
        borderRadius: `${boxBorderRadius}px`,
        padding: `${responsiveBoxPadding}px`,
        boxShadow: boxShadow ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : 'none',
        border: boxBorder ? `${boxBorderWidth}px solid ${boxBorderColor}` : 'none',
      };
    } else if (itemStyle === 'dividers') {
      return {
        ...baseStyle,
        borderBottom: index < items.length - 1 ? `${dividerWidth}px solid ${dividerColor}` : 'none',
        paddingBottom: index < items.length - 1 ? `${itemGap}px` : '0',
        paddingTop: index > 0 ? `${itemGap}px` : '0',
      };
    } else {
      // clean style
      return baseStyle;
    }
  };

  return (
    <div 
      className="w-full"
      style={{
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: deviceView === 'mobile' ? '16px' : '24px',
        paddingRight: deviceView === 'mobile' ? '16px' : '24px',
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div style={{ marginBottom: `${headerGap}px` }}>
          <h2
            className={`font-bold ${getAlignmentClass(headingAlignment)}`}
            style={{
              color: headingColor,
              fontSize: `${responsiveHeadingSize}px`,
              lineHeight: '1.2',
              marginBottom: subheading ? '12px' : '0',
            }}
          >
            {heading}
          </h2>
          {subheading && (
            <p
              className={getAlignmentClass(subheadingAlignment)}
              style={{
                color: subheadingColor,
                fontSize: `${responsiveSubheadingSize}px`,
              }}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* FAQ Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: itemStyle === 'dividers' ? '0' : `${itemGap}px` }}>
          {items.map((item, index) => {
            const isOpen = openItemId === item.id;
            
            return (
              <div
                key={item.id}
                style={getItemStyle(index)}
              >
                {/* Question */}
                <div
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center"
                  style={{ 
                    gap: iconPosition === 'left' ? '16px' : '0',
                    justifyContent: iconPosition === 'right' ? 'space-between' : 'flex-start'
                  }}
                >
                  {/* Icon Circle - Left Position */}
                  {iconPosition === 'left' && (
                    <div
                      style={{
                        width: `${responsiveIconCircleSize}px`,
                        height: `${responsiveIconCircleSize}px`,
                        backgroundColor: iconBackgroundColor,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {renderFAQIcon(isOpen)}
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="flex-1" style={{ minWidth: 0 }}>
                    <h3
                      className={getAlignmentClass(questionAlignment)}
                      style={{
                        color: questionColor,
                        fontSize: `${questionFontSize}px`,
                        fontWeight: questionFontWeight,
                        margin: 0,
                      }}
                    >
                      {item.question}
                    </h3>
                  </div>

                  {/* Icon Circle - Right Position */}
                  {iconPosition === 'right' && (
                    <div
                      style={{
                        width: `${responsiveIconCircleSize}px`,
                        height: `${responsiveIconCircleSize}px`,
                        backgroundColor: iconBackgroundColor,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginLeft: '16px',
                      }}
                    >
                      {renderFAQIcon(isOpen)}
                    </div>
                  )}
                </div>

                {/* Answer */}
                {isOpen && (
                  <div
                    style={{
                      marginTop: `${questionAnswerGap}px`,
                      marginLeft: iconPosition === 'left' ? `${responsiveIconCircleSize + 16}px` : '0',
                      marginRight: iconPosition === 'right' ? `${responsiveIconCircleSize + 16}px` : '0',
                      paddingBottom: `${questionAnswerGap}px`,
                    }}
                  >
                    <p
                      className={getAlignmentClass(answerAlignment)}
                      style={{
                        color: answerColor,
                        fontSize: `${answerFontSize}px`,
                        fontWeight: answerFontWeight,
                        margin: 0,
                        lineHeight: '1.6',
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ContactFormSection({ widget }: { widget: ContactFormWidget }) {
  const { deviceView } = useBuilderStore();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Ensure defaults
  const style = widget.style || 'simple';
  const layout = widget.layout || 'form-right';
  const fields = widget.fields || widget.formFields || []; // Support legacy formFields
  const formHeading = widget.formHeading || 'Get in Touch';
  const buttonText = widget.buttonText || 'Send Message';
  const confirmationMessage = widget.confirmationMessage || 'Thank you! We\'ll be in touch soon.';
  
  const formBoxed = widget.formBoxed ?? true;
  const formBoxBackground = widget.formBoxBackground || '#ffffff';
  const formBoxBorderRadius = widget.formBoxBorderRadius ?? 12;
  const formBoxPadding = widget.formBoxPadding ?? 32;
  const formBoxShadow = widget.formBoxShadow ?? true;
  
  const fieldBackgroundColor = widget.fieldBackgroundColor || '#f3f4f6';
  const fieldTextColor = widget.fieldTextColor || '#1f2937';
  const fieldPlaceholderColor = widget.fieldPlaceholderColor || '#9ca3af';
  const fieldBorderRadius = widget.fieldBorderRadius ?? 8;
  const fieldBorderWidth = widget.fieldBorderWidth ?? 0;
  const fieldBorderColor = widget.fieldBorderColor || '#d1d5db';
  const fieldBorderSides = widget.fieldBorderSides || { top: false, right: false, bottom: true, left: false };
  
  const buttonFullWidth = widget.buttonFullWidth ?? false;
  const buttonAlignment = widget.buttonAlignment || 'left';
  const buttonStyle = widget.buttonStyle || {
    backgroundColor: '#10b981',
    backgroundOpacity: 100,
    textColor: '#ffffff',
    borderRadius: 8,
    blur: 0,
    shadow: true,
    borderWidth: 0,
    borderColor: '#000000',
  };
  
  const headingSize = widget.headingSize ?? 32;
  const headingColor = widget.headingColor || '#1f2937';
  const descriptionSize = widget.descriptionSize ?? 16;
  const descriptionColor = widget.descriptionColor || '#6b7280';
  
  const background = widget.background || { type: 'color', color: 'transparent', opacity: 100, blur: 0 };
  const layoutCfg = (widget.layout && typeof widget.layout === 'object' && 'height' in widget.layout)
    ? widget.layout
    : {
        height: { type: 'auto' as const },
        width: 'container' as const,
        padding: { top: 80, right: 20, bottom: 80, left: 20 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      };
  
  const isMobile = deviceView === 'mobile';
  const isTablet = deviceView === 'tablet';
  
  const responsiveHeadingSize = isMobile ? headingSize * 0.6 : isTablet ? headingSize * 0.8 : headingSize;
  const responsiveDescriptionSize = isMobile ? descriptionSize * 0.9 : descriptionSize;
  
  // Get background styles
  const getBackgroundStyles = () => {
    const styles: React.CSSProperties = {};
    
    if (background.type === 'color') {
      const opacity = background.opacity ?? 100;
      if (background.color === 'transparent') {
        styles.backgroundColor = 'transparent';
      } else {
        const r = parseInt(background.color.slice(1, 3), 16);
        const g = parseInt(background.color.slice(3, 5), 16);
        const b = parseInt(background.color.slice(5, 7), 16);
        styles.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
      }
    } else if (background.type === 'image' && background.imageUrl) {
      styles.backgroundImage = `url(${background.imageUrl})`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
      styles.backgroundRepeat = 'no-repeat';
    } else if (background.type === 'video' && background.videoUrl) {
      styles.position = 'relative';
    } else if (background.type === 'gradient' && background.gradientColors) {
      const [color1, color2] = background.gradientColors;
      const angle = background.gradientAngle ?? 135;
      styles.backgroundImage = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }
    
    return styles;
  };
  
  // Get field border styles
  const getFieldBorderStyle = () => {
    const borderParts: string[] = [];
    if (fieldBorderSides.top) borderParts.push('top');
    if (fieldBorderSides.right) borderParts.push('right');
    if (fieldBorderSides.bottom) borderParts.push('bottom');
    if (fieldBorderSides.left) borderParts.push('left');
    
    if (borderParts.length === 4) {
      return `${fieldBorderWidth}px solid ${fieldBorderColor}`;
    } else if (borderParts.length === 0) {
      return 'none';
    } else {
      // Individual borders
      const style: React.CSSProperties = {};
      if (fieldBorderSides.top) style.borderTop = `${fieldBorderWidth}px solid ${fieldBorderColor}`;
      if (fieldBorderSides.right) style.borderRight = `${fieldBorderWidth}px solid ${fieldBorderColor}`;
      if (fieldBorderSides.bottom) style.borderBottom = `${fieldBorderWidth}px solid ${fieldBorderColor}`;
      if (fieldBorderSides.left) style.borderLeft = `${fieldBorderWidth}px solid ${fieldBorderColor}`;
      return style;
    }
  };
  
  const fieldBorderStyle = getFieldBorderStyle();
  
  // Get button alignment class
  const getButtonAlignmentClass = () => {
    if (buttonFullWidth) return '';
    if (buttonAlignment === 'center') return 'mx-auto';
    if (buttonAlignment === 'right') return 'ml-auto';
    return ''; // left
  };
  
  const getButtonAlignmentContainerClass = () => {
    if (buttonFullWidth) return '';
    if (buttonAlignment === 'center') return 'flex justify-center';
    if (buttonAlignment === 'right') return 'flex justify-end';
    return 'flex justify-start';
  };
  
  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.placeholder || field.label} is required`;
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    if (field.type === 'phone' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
    }
    
    return null;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, any> = {};
    const newErrors: Record<string, string> = {};
    
    // Collect and validate form data
    fields.forEach(field => {
      const value = String(formData.get(field.id) || '');
      data[field.label] = value;
      
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
      }
    });
    
    // If there are validation errors, show them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Parse full name into first and last name if needed
    let firstName = data.firstName || '';
    let lastName = data.lastName || '';
    
    if (data.name && !firstName && !lastName) {
      const nameParts = (data.name as string).trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    // Prepare lead data
    const leadData = {
      firstName: firstName || 'Unknown',
      lastName: lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      message: data.message || '',
      customFields: {} as Record<string, string>,
    };
    
    // Add any custom fields
    Object.keys(data).forEach(key => {
      if (!['name', 'firstName', 'lastName', 'email', 'phone', 'message'].includes(key)) {
        leadData.customFields[key] = String(data[key] || '');
      }
    });
    
    // Submit to CRM (in preview mode, just log it)
    console.log('Form submission to CRM:', leadData);
    
    // In production, this would call an API endpoint:
    // await fetch('/api/leads', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(leadData),
    // });
    
    setSubmitted(true);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setSubmitted(false), 5000);
  };
  
  const renderFormFields = () => (
    <>
      {fields.sort((a, b) => a.order - b.order).map((field) => {
        const placeholder = field.placeholder || field.label;
        const hasError = errors[field.id];
        const fieldStyles: React.CSSProperties = {
          backgroundColor: fieldBackgroundColor,
          color: fieldTextColor,
          borderRadius: `${fieldBorderRadius}px`,
          padding: '12px 16px',
          width: '100%',
          outline: 'none',
          ...(typeof fieldBorderStyle === 'string' 
            ? { border: hasError ? '2px solid #ef4444' : fieldBorderStyle }
            : { ...fieldBorderStyle, border: hasError ? '2px solid #ef4444' : undefined }
          ),
        };
        
        if (field.type === 'textarea') {
          return (
            <div key={field.id}>
              <textarea
                name={field.id}
                placeholder={placeholder}
                required={field.required}
                rows={4}
                style={fieldStyles}
                className="placeholder-opacity-60"
              />
              {hasError && (
                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors[field.id]}
                </p>
              )}
            </div>
          );
        } else if (field.type === 'select' && field.options) {
          return (
            <div key={field.id}>
              <select
                name={field.id}
                required={field.required}
                style={fieldStyles}
              >
                <option value="">{placeholder}</option>
                {field.options.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
              {hasError && (
                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors[field.id]}
                </p>
              )}
            </div>
          );
        } else if (field.type === 'radio' && field.options) {
          return (
            <div key={field.id} style={{ marginBottom: '16px' }}>
              <label style={{ color: fieldTextColor, display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                {placeholder} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
              </label>
              {field.options.map((opt, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={field.id}
                      value={opt}
                      required={field.required}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ color: fieldTextColor }}>{opt}</span>
                  </label>
                </div>
              ))}
              {hasError && (
                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors[field.id]}
                </p>
              )}
            </div>
          );
        } else {
          return (
            <div key={field.id}>
              <input
                name={field.id}
                type={field.type === 'phone' ? 'tel' : field.type}
                placeholder={placeholder}
                required={field.required}
                style={fieldStyles}
                className="placeholder-opacity-60"
              />
              {hasError && (
                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                  {errors[field.id]}
                </p>
              )}
            </div>
          );
        }
      })}
    </>
  );
  
  const renderButton = () => {
    const bgOpacity = buttonStyle.backgroundOpacity ?? 100;
    const bgColor = buttonStyle.backgroundColor || '#10b981';
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    
    return (
      <div className={getButtonAlignmentContainerClass()}>
        <button
          type="submit"
          style={{
            backgroundColor: `rgba(${r}, ${g}, ${b}, ${bgOpacity / 100})`,
            color: buttonStyle.textColor,
            borderRadius: `${buttonStyle.borderRadius}px`,
            padding: '12px 32px',
            fontWeight: 600,
            border: buttonStyle.borderWidth ? `${buttonStyle.borderWidth}px solid ${buttonStyle.borderColor}` : 'none',
            boxShadow: buttonStyle.shadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
            backdropFilter: buttonStyle.blur ? `blur(${buttonStyle.blur}px)` : 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: buttonFullWidth ? '100%' : 'auto',
          }}
          onMouseEnter={(e) => {
            if (widget.buttonHoverBackground) {
              e.currentTarget.style.backgroundColor = widget.buttonHoverBackground;
            }
            if (widget.buttonHoverColor) {
              e.currentTarget.style.color = widget.buttonHoverColor;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${bgOpacity / 100})`;
            e.currentTarget.style.color = buttonStyle.textColor;
          }}
        >
          {buttonText}
        </button>
      </div>
    );
  };
  
  const renderForm = () => (
    <div
      style={{
        backgroundColor: formBoxed ? formBoxBackground : 'transparent',
        borderRadius: formBoxed ? `${formBoxBorderRadius}px` : 0,
        padding: formBoxed ? `${formBoxPadding}px` : 0,
        boxShadow: formBoxed && formBoxShadow ? '0 10px 30px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: `${responsiveHeadingSize}px`, color: headingColor, marginBottom: '12px', fontWeight: 700 }}>
              {formHeading}
            </h2>
            {widget.formDescription && (
              <p style={{ fontSize: `${responsiveDescriptionSize}px`, color: descriptionColor, marginBottom: '24px' }}>
                {widget.formDescription}
              </p>
            )}
          </div>
          {renderFormFields()}
          {renderButton()}
        </form>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: `${responsiveDescriptionSize}px`, color: headingColor }}>
            {confirmationMessage}
          </p>
        </div>
      )}
    </div>
  );
  
  // Simple style - just the form
  if (style === 'simple') {
    return (
      <div style={{
        ...getBackgroundStyles(),
        paddingTop: `${layoutCfg.padding.top}px`,
        paddingBottom: `${layoutCfg.padding.bottom}px`,
        paddingLeft: `${layoutCfg.padding.left}px`,
        paddingRight: `${layoutCfg.padding.right}px`,
      }}>
        <div style={{ maxWidth: layoutCfg.width === 'container' ? '600px' : '100%', margin: '0 auto' }}>
          {renderForm()}
        </div>
      </div>
    );
  }
  
  // Split style - text + form
  if (style === 'split') {
    const formColumn = renderForm();
    const textColumn = (
      <div>
        {widget.columnHeading && (
          <h2 style={{ fontSize: `${responsiveHeadingSize}px`, color: headingColor, marginBottom: '16px', fontWeight: 700 }}>
            {widget.columnHeading}
          </h2>
        )}
        {widget.columnDescription && (
          <p style={{ fontSize: `${responsiveDescriptionSize}px`, color: descriptionColor, marginBottom: '24px', lineHeight: 1.6 }}>
            {widget.columnDescription}
          </p>
        )}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {widget.button1Text && (
            <a
              href={widget.button1Url || '#'}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: buttonStyle.backgroundColor,
                color: buttonStyle.textColor,
                borderRadius: `${buttonStyle.borderRadius}px`,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: buttonStyle.shadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
              }}
            >
              {widget.button1Text}
            </a>
          )}
          {widget.button2Text && (
            <a
              href={widget.button2Url || '#'}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: buttonStyle.backgroundColor,
                border: `2px solid ${buttonStyle.backgroundColor}`,
                borderRadius: `${buttonStyle.borderRadius}px`,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {widget.button2Text}
            </a>
          )}
        </div>
      </div>
    );
    
    return (
      <div style={{
        ...getBackgroundStyles(),
        paddingTop: `${layoutCfg.padding.top}px`,
        paddingBottom: `${layoutCfg.padding.bottom}px`,
        paddingLeft: `${layoutCfg.padding.left}px`,
        paddingRight: `${layoutCfg.padding.right}px`,
      }}>
        <div style={{ maxWidth: layoutCfg.width === 'container' ? '1200px' : '100%', margin: '0 auto' }}>
          <div style={{
            display: isMobile ? 'flex' : 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '48px',
            flexDirection: isMobile ? 'column' : undefined,
          }}>
            {layout === 'form-left' ? (
              <>
                <div>{formColumn}</div>
                <div>{textColumn}</div>
              </>
            ) : (
              <>
                <div>{textColumn}</div>
                <div>{formColumn}</div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Contact details style - contact info + form
  if (style === 'contact-details') {
    const formColumn = renderForm();
    const showIcons = widget.showContactIcons ?? true;
    
    const contactDetailsColumn = (
      <div>
        {widget.columnHeading && (
          <h2 style={{ fontSize: `${responsiveHeadingSize}px`, color: headingColor, marginBottom: '16px', fontWeight: 700 }}>
            {widget.columnHeading}
          </h2>
        )}
        {widget.columnDescription && (
          <p style={{ fontSize: `${responsiveDescriptionSize}px`, color: descriptionColor, marginBottom: '32px', lineHeight: 1.6 }}>
            {widget.columnDescription}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {widget.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {showIcons && (
                <div style={{ 
                  width: '40px',
                  height: '40px',
                  backgroundColor: buttonStyle.backgroundColor,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={buttonStyle.textColor} strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
              )}
              <a href={`tel:${widget.phone}`} style={{ fontSize: `${responsiveDescriptionSize}px`, color: headingColor, textDecoration: 'none' }}>
                {widget.phone}
              </a>
            </div>
          )}
          {widget.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {showIcons && (
                <div style={{ 
                  width: '40px',
                  height: '40px',
                  backgroundColor: buttonStyle.backgroundColor,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={buttonStyle.textColor} strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
              )}
              <a href={`mailto:${widget.email}`} style={{ fontSize: `${responsiveDescriptionSize}px`, color: headingColor, textDecoration: 'none' }}>
                {widget.email}
              </a>
            </div>
          )}
          {widget.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {showIcons && (
                <div style={{ 
                  width: '40px',
                  height: '40px',
                  backgroundColor: buttonStyle.backgroundColor,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={buttonStyle.textColor} strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
              )}
              <a href={`https://${widget.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: `${responsiveDescriptionSize}px`, color: headingColor, textDecoration: 'none' }}>
                {widget.website}
              </a>
            </div>
          )}
        </div>
        {widget.button1Text && (
          <div style={{ marginTop: '32px' }}>
            <a
              href={widget.button1Url || '#'}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: buttonStyle.backgroundColor,
                color: buttonStyle.textColor,
                borderRadius: `${buttonStyle.borderRadius}px`,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: buttonStyle.shadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
              }}
            >
              {widget.button1Text}
            </a>
          </div>
        )}
      </div>
    );
    
    return (
      <div style={{
        ...getBackgroundStyles(),
        paddingTop: `${layoutCfg.padding.top}px`,
        paddingBottom: `${layoutCfg.padding.bottom}px`,
        paddingLeft: `${layoutCfg.padding.left}px`,
        paddingRight: `${layoutCfg.padding.right}px`,
      }}>
        <div style={{ maxWidth: layoutCfg.width === 'container' ? '1200px' : '100%', margin: '0 auto' }}>
          <div style={{
            display: isMobile ? 'flex' : 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '48px',
            flexDirection: isMobile ? 'column' : undefined,
          }}>
            {layout === 'form-left' ? (
              <>
                <div>{formColumn}</div>
                <div>{contactDetailsColumn}</div>
              </>
            ) : (
              <>
                <div>{contactDetailsColumn}</div>
                <div>{formColumn}</div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}

function TestimonialsSection({ widget }: { widget: TestimonialWidget }) {
  const { selectSection } = useBuilderStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = widget.testimonials || [];
  const autoplay = widget.autoplay ?? true;
  const autoplayInterval = (widget.autoplayInterval ?? 5) * 1000;
  
  // Auto-play logic
  useEffect(() => {
    if (!autoplay || isPaused || testimonials.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoplayInterval);
    
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, isPaused, testimonials.length]);
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };
  
  if (testimonials.length === 0) {
    return (
      <div style={{
        padding: '80px 24px',
        textAlign: 'center',
        backgroundColor: '#f3f4f6',
      }}>
        <p style={{ color: '#6b7280' }}>No testimonials added yet</p>
      </div>
    );
  }
  
  const currentTestimonial = testimonials[currentIndex];
  
  // Ensure defaults
  const showAvatar = widget.showAvatar ?? true;
  const avatarShape = widget.avatarShape || 'circle';
  const avatarSize = widget.avatarSize ?? 80;
  const namePosition = widget.namePosition || 'above-quote';
  const textAlign = widget.textAlign || 'center';
  
  const showStars = widget.showStars ?? true;
  const starColor = widget.starColor || '#f59e0b';
  const starSize = widget.starSize ?? 24;
  
  const nameFontSize = widget.nameFontSize ?? 24;
  const nameColor = widget.nameColor || '#ffffff';
  const nameFontWeight = widget.nameFontWeight ?? 700;
  const titleFontSize = widget.titleFontSize ?? 16;
  const titleColor = widget.titleColor || '#cbd5e1';
  const quoteFontSize = widget.quoteFontSize ?? 20;
  const quoteColor = widget.quoteColor || '#ffffff';
  const quoteLineHeight = widget.quoteLineHeight ?? 1.6;
  const quoteMaxWidth = widget.quoteMaxWidth ?? 700;
  
  const arrowStyle = widget.arrowStyle || 'circle';
  const arrowBackgroundColor = widget.arrowBackgroundColor || '#ffffff';
  const arrowColor = widget.arrowColor || '#1e40af';
  const arrowSize = widget.arrowSize ?? 60;
  
  const dotColor = widget.dotColor || '#94a3b8';
  const activeDotColor = widget.activeDotColor || '#ffffff';
  const dotSize = widget.dotSize ?? 10;
  
  const sectionHeading = widget.sectionHeading || '';
  const sectionHeadingColor = widget.sectionHeadingColor || '#ffffff';
  const sectionSubheading = widget.sectionSubheading || '';
  const sectionSubheadingColor = widget.sectionSubheadingColor || '#cbd5e1';
  
  // Background styles
  const background = widget.background || { type: 'color', color: '#0f4c75', opacity: 100, blur: 0 };
  const layout = widget.layout || {
    fullWidth: true,
    maxWidth: 1200,
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
  };
  
  const backgroundStyles: React.CSSProperties = {};
  
  if (background.type === 'color') {
    backgroundStyles.backgroundColor = background.color;
    backgroundStyles.opacity = (background.opacity || 100) / 100;
  } else if (background.type === 'image' && background.url) {
    backgroundStyles.backgroundImage = `url(${background.url})`;
    backgroundStyles.backgroundSize = 'cover';
    backgroundStyles.backgroundPosition = 'center';
  } else if (background.type === 'video' && background.url) {
    backgroundStyles.position = 'relative';
  }
  
  if (background.blur) {
    backgroundStyles.backdropFilter = `blur(${background.blur}px)`;
  }
  
  // Star rendering
  const renderStars = () => {
    if (!showStars) return null;
    
    return (
      <div style={{
        display: 'flex',
        gap: '4px',
        justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
      }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={starSize}
            fill={i < currentTestimonial.rating ? starColor : 'transparent'}
            stroke={starColor}
            strokeWidth={2}
          />
        ))}
      </div>
    );
  };
  
  // Avatar rendering
  const renderAvatar = () => {
    if (!showAvatar || !currentTestimonial.avatar) return null;
    
    return (
      <img
        src={currentTestimonial.avatar}
        alt={currentTestimonial.name}
        style={{
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          borderRadius: avatarShape === 'circle' ? '50%' : '8px',
          objectFit: 'cover',
          marginBottom: '16px',
        }}
      />
    );
  };
  
  // Navigation arrows
  const renderArrows = () => {
    if (testimonials.length <= 1) return null;
    
    const arrowContainerStyle: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      zIndex: 10,
    };
    
    const arrowButtonStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: arrowStyle === 'minimal' ? 'transparent' : arrowBackgroundColor,
      color: arrowColor,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    };
    
    if (arrowStyle !== 'minimal') {
      arrowButtonStyle.width = `${arrowSize}px`;
      arrowButtonStyle.height = `${arrowSize}px`;
      arrowButtonStyle.borderRadius = arrowStyle === 'circle' ? '50%' : '8px';
      arrowButtonStyle.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }
    
    return (
      <>
        <div style={{ ...arrowContainerStyle, left: '24px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            style={arrowButtonStyle}
            onMouseEnter={(e) => {
              if (arrowStyle !== 'minimal') {
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (arrowStyle !== 'minimal') {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <ChevronLeft size={arrowStyle === 'minimal' ? 40 : arrowSize * 0.4} />
          </button>
        </div>
        <div style={{ ...arrowContainerStyle, right: '24px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            style={arrowButtonStyle}
            onMouseEnter={(e) => {
              if (arrowStyle !== 'minimal') {
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (arrowStyle !== 'minimal') {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <ChevronRight size={arrowStyle === 'minimal' ? 40 : arrowSize * 0.4} />
          </button>
        </div>
      </>
    );
  };
  
  // Dot indicators
  const renderDots = () => {
    if (testimonials.length <= 1) return null;
    
    return (
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        marginTop: '40px',
      }}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToIndex(index);
            }}
            style={{
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              borderRadius: '50%',
              backgroundColor: index === currentIndex ? activeDotColor : dotColor,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div
      style={{
        position: 'relative',
        ...backgroundStyles,
        paddingTop: `${layout.paddingTop}px`,
        paddingBottom: `${layout.paddingBottom}px`,
        paddingLeft: `${layout.paddingLeft}px`,
        paddingRight: `${layout.paddingRight}px`,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={(e) => {
        e.stopPropagation();
        selectSection(null);
      }}
    >
      {/* Video Background */}
      {background.type === 'video' && background.url && (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src={background.url} type="video/mp4" />
        </video>
      )}
      
      {/* Overlay */}
      {background.overlay?.enabled && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: background.overlay.color,
          opacity: (background.overlay.opacity || 50) / 100,
          zIndex: 1,
        }} />
      )}
      
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: layout.fullWidth ? '100%' : `${layout.maxWidth}px`,
        margin: '0 auto',
      }}>
        {/* Section Header */}
        {(sectionHeading || sectionSubheading) && (
          <div style={{
            textAlign: 'center',
            marginBottom: '48px',
          }}>
            {sectionHeading && (
              <h2 style={{
                fontSize: '48px',
                fontWeight: 700,
                color: sectionHeadingColor,
                marginBottom: '16px',
              }}>
                {sectionHeading}
              </h2>
            )}
            {sectionSubheading && (
              <p style={{
                fontSize: '18px',
                color: sectionSubheadingColor,
              }}>
                {sectionSubheading}
              </p>
            )}
          </div>
        )}
        
        {/* Testimonial Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
          textAlign: textAlign,
          maxWidth: `${quoteMaxWidth}px`,
          margin: '0 auto',
        }}>
          {namePosition === 'above-quote' && (
            <>
              {renderAvatar()}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontSize: `${nameFontSize}px`,
                  fontWeight: nameFontWeight,
                  color: nameColor,
                  marginBottom: '8px',
                }}>
                  {currentTestimonial.name}
                </h3>
                {currentTestimonial.title && (
                  <p style={{
                    fontSize: `${titleFontSize}px`,
                    color: titleColor,
                  }}>
                    {currentTestimonial.title}
                  </p>
                )}
              </div>
              {renderStars()}
            </>
          )}
          
          <p style={{
            fontSize: `${quoteFontSize}px`,
            color: quoteColor,
            lineHeight: quoteLineHeight,
            marginBottom: namePosition === 'below-quote' ? '24px' : 0,
          }}>
            "{currentTestimonial.quote}"
          </p>
          
          {namePosition === 'below-quote' && (
            <>
              {renderStars()}
              <div style={{ marginTop: '16px' }}>
                <h3 style={{
                  fontSize: `${nameFontSize}px`,
                  fontWeight: nameFontWeight,
                  color: nameColor,
                  marginBottom: '8px',
                }}>
                  {currentTestimonial.name}
                </h3>
                {currentTestimonial.title && (
                  <p style={{
                    fontSize: `${titleFontSize}px`,
                    color: titleColor,
                  }}>
                    {currentTestimonial.title}
                  </p>
                )}
              </div>
              {renderAvatar()}
            </>
          )}
        </div>
        
        {/* Dot Indicators */}
        {renderDots()}
        
        {/* Navigation Arrows */}
        {renderArrows()}
      </div>
    </div>
  );
}

function StepsSection({ widget }: { widget: StepsWidget }) {
  const { deviceView } = useBuilderStore();

  // Safeguards for potentially undefined or corrupted data
  const steps = widget.steps || [];
  const layout = widget.imageLayout || 'image-left';
  const imagePosition = widget.imagePosition || 'center';
  const cardBackground = widget.cardBackground || '#ffffff';
  const cardBorderRadius = widget.cardBorderRadius ?? 24;
  const cardPadding = widget.cardPadding ?? 48;
  const cardShadow = widget.cardShadow ?? true;
  
  // Ensure layout config has defaults
  const layoutConfig = widget.layout || {
    fullWidth: true,
    maxWidth: 1200,
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
  };
  
  // Ensure background config has defaults
  const backgroundConfig = widget.background || {
    type: 'color',
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };
  
  const stepLabelBackground = widget.stepLabelBackground || '#d1fae5';
  const stepLabelColor = widget.stepLabelColor || '#065f46';
  const stepLabelFontSize = widget.stepLabelFontSize ?? 12;
  const stepLabelBorderRadius = widget.stepLabelBorderRadius ?? 4;
  const stepLabelPadding = widget.stepLabelPadding ?? 6;
  
  const stepHeadingColor = widget.stepHeadingColor || '#000000';
  const stepHeadingSize = widget.stepHeadingSize ?? 24;
  const stepHeadingFontWeight = widget.stepHeadingFontWeight ?? 600;
  const stepDescriptionColor = widget.stepDescriptionColor || '#6b7280';
  const stepDescriptionSize = widget.stepDescriptionSize ?? 16;
  const stepGap = widget.stepGap ?? 32;
  
  const sectionHeading = widget.sectionHeading || '';
  const sectionHeadingColor = widget.sectionHeadingColor || '#000000';
  const sectionHeadingSize = widget.sectionHeadingSize ?? 48;
  
  const buttonVisible = widget.buttonVisible ?? true;
  const buttonText = widget.buttonText || 'Get in Touch';
  const buttonUrl = widget.buttonUrl || '#';
  const buttonBgColor = widget.buttonStyle?.bgColor || '#10b981';
  const buttonTextColor = widget.buttonStyle?.textColor || '#ffffff';
  const buttonRadius = widget.buttonStyle?.radius ?? 8;

  const getObjectPosition = () => {
    switch (imagePosition) {
      case 'top': return 'top';
      case 'bottom': return 'bottom';
      default: return 'center';
    }
  };

  const getBackgroundStyle = () => {
    const styles: React.CSSProperties = {};
    
    if (backgroundConfig.type === 'color') {
      const opacity = backgroundConfig.opacity ?? 100;
      if (backgroundConfig.color === 'transparent') {
        styles.backgroundColor = 'transparent';
      } else {
        const r = parseInt(backgroundConfig.color.slice(1, 3), 16);
        const g = parseInt(backgroundConfig.color.slice(3, 5), 16);
        const b = parseInt(backgroundConfig.color.slice(5, 7), 16);
        styles.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
      }
    } else if (backgroundConfig.type === 'image' && backgroundConfig.imageUrl) {
      styles.backgroundImage = `url(${backgroundConfig.imageUrl})`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
      styles.backgroundRepeat = 'no-repeat';
    } else if (backgroundConfig.type === 'gradient' && backgroundConfig.gradientColors) {
      const [color1, color2] = backgroundConfig.gradientColors;
      const angle = backgroundConfig.gradientAngle ?? 135;
      styles.backgroundImage = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }
    
    return styles;
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        ...getBackgroundStyle(),
        paddingTop: `${layoutConfig.paddingTop || 80}px`,
        paddingBottom: `${layoutConfig.paddingBottom || 80}px`,
        paddingLeft: `${layoutConfig.paddingLeft || 24}px`,
        paddingRight: `${layoutConfig.paddingRight || 24}px`,
      }}
    >
      <div
        style={{
          maxWidth: layoutConfig.fullWidth ? '100%' : `${layoutConfig.maxWidth || 1200}px`,
          margin: '0 auto',
        }}
      >
        {/* Header with button */}
        <div className={cn(
          "flex items-center justify-between mb-8",
          deviceView === 'mobile' && 'flex-col items-start gap-4'
        )}>
          {sectionHeading && (
            <h2
              style={{
                fontSize: `${sectionHeadingSize}px`,
                fontWeight: 700,
                color: sectionHeadingColor,
              }}
            >
              {sectionHeading}
            </h2>
          )}
          {buttonVisible && buttonText && (
            <a
              href={buttonUrl}
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
                borderRadius: `${buttonRadius}px`,
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {buttonText}
            </a>
          )}
        </div>

        {/* Main content */}
        <div
          className={cn(
            "grid gap-8 items-center",
            deviceView === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'
          )}
        >
          {/* Image */}
          {layout === 'image-left' && (
            <div
              style={{
                borderRadius: `${cardBorderRadius}px`,
                overflow: 'hidden',
                height: '100%',
                minHeight: '500px',
              }}
            >
              <img
                src={widget.imageUrl || 'https://via.placeholder.com/800x600'}
                alt="Steps background"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: getObjectPosition(),
                }}
              />
            </div>
          )}

          {/* Steps Card */}
          <div
            style={{
              backgroundColor: cardBackground,
              borderRadius: `${cardBorderRadius}px`,
              padding: `${cardPadding}px`,
              boxShadow: cardShadow ? '0 10px 40px rgba(0, 0, 0, 0.1)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: `${stepGap}px`,
            }}
          >
            {steps.map((step) => (
              <div key={step.id}>
                {/* Step Label */}
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: stepLabelBackground,
                    color: stepLabelColor,
                    fontSize: `${stepLabelFontSize}px`,
                    fontWeight: 600,
                    padding: `${stepLabelPadding}px ${stepLabelPadding * 2}px`,
                    borderRadius: `${stepLabelBorderRadius}px`,
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {step.label}
                </div>

                {/* Step Heading */}
                <h3
                  style={{
                    fontSize: `${stepHeadingSize}px`,
                    fontWeight: stepHeadingFontWeight,
                    color: stepHeadingColor,
                    marginBottom: '8px',
                  }}
                >
                  {step.heading}
                </h3>

                {/* Step Description */}
                <p
                  style={{
                    fontSize: `${stepDescriptionSize}px`,
                    color: stepDescriptionColor,
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Image Right */}
          {layout === 'image-right' && (
            <div
              style={{
                borderRadius: `${cardBorderRadius}px`,
                overflow: 'hidden',
                height: '100%',
                minHeight: '500px',
              }}
            >
              <img
                src={widget.imageUrl || 'https://via.placeholder.com/800x600'}
                alt="Steps background"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: getObjectPosition(),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageTextColumnsSection({ widget }: { widget: ImageTextColumnsWidget }) {
  const { deviceView } = useBuilderStore();

  const items = widget.items || [];
  const desktopColumns = widget.desktopColumns || 3;
  const tabletColumns = widget.tabletColumns || 2;
  const mobileColumns = widget.mobileColumns || 1;
  const gap = widget.gap || 24;
  const imageAspectRatio = widget.imageAspectRatio || '3:2';
  const imageBorderRadius = widget.imageBorderRadius ?? 12;
  const textAlign = widget.textAlign || 'center';
  const subtitleColor = widget.subtitleColor || '#1f2937';
  const subtitleSize = widget.subtitleSize ?? 20;
  const subtitleFontWeight = widget.subtitleFontWeight ?? 600;
  const descriptionColor = widget.descriptionColor || '#6b7280';
  const descriptionSize = widget.descriptionSize ?? 16;

  const sectionHeading = widget.sectionHeading;
  const sectionHeadingColor = widget.sectionHeadingColor || '#1f2937';
  const sectionHeadingSize = widget.sectionHeadingSize ?? 48;
  const sectionSubheading = widget.sectionSubheading;
  const sectionSubheadingColor = widget.sectionSubheadingColor || '#6b7280';
  const sectionSubheadingSize = widget.sectionSubheadingSize ?? 18;

  const layoutConfig = widget.layout || {
    fullWidth: true,
    maxWidth: 1200,
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
  };

  const backgroundConfig = widget.background || {
    type: 'color',
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };

  const getBackgroundStyle = () => {
    const styles: React.CSSProperties = {};
    
    if (backgroundConfig.type === 'color') {
      const opacity = backgroundConfig.opacity ?? 100;
      if (backgroundConfig.color === 'transparent') {
        styles.backgroundColor = 'transparent';
      } else {
        const r = parseInt(backgroundConfig.color.slice(1, 3), 16);
        const g = parseInt(backgroundConfig.color.slice(3, 5), 16);
        const b = parseInt(backgroundConfig.color.slice(5, 7), 16);
        styles.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
      }
    } else if (backgroundConfig.type === 'image' && backgroundConfig.imageUrl) {
      styles.backgroundImage = `url(${backgroundConfig.imageUrl})`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
      styles.backgroundRepeat = 'no-repeat';
    }
    
    return styles;
  };

  const getAspectRatio = () => {
    switch (imageAspectRatio) {
      case '1:1': return '1';
      case '3:2': return '3/2';
      case '4:3': return '4/3';
      case '16:9': return '16/9';
      default: return '3/2';
    }
  };

  const getTextAlignClass = () => {
    switch (textAlign) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  };

  const getGridColumns = () => {
    if (deviceView === 'mobile') return mobileColumns;
    if (deviceView === 'tablet') return tabletColumns;
    return desktopColumns;
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        ...getBackgroundStyle(),
        paddingTop: `${layoutConfig.paddingTop || 80}px`,
        paddingBottom: `${layoutConfig.paddingBottom || 80}px`,
        paddingLeft: `${layoutConfig.paddingLeft || 24}px`,
        paddingRight: `${layoutConfig.paddingRight || 24}px`,
      }}
    >
      <div
        style={{
          maxWidth: layoutConfig.fullWidth ? '100%' : `${layoutConfig.maxWidth || 1200}px`,
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        {(sectionHeading || sectionSubheading) && (
          <div className={cn("mb-12", getTextAlignClass())}>
            {sectionHeading && (
              <h2
                className="font-bold mb-2"
                style={{
                  fontSize: `${sectionHeadingSize}px`,
                  color: sectionHeadingColor,
                }}
              >
                {sectionHeading}
              </h2>
            )}
            {sectionSubheading && (
              <p
                style={{
                  fontSize: `${sectionSubheadingSize}px`,
                  color: sectionSubheadingColor,
                }}
              >
                {sectionSubheading}
              </p>
            )}
          </div>
        )}

        {/* Columns Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {items.map((item) => (
            <div key={item.id} className={getTextAlignClass()}>
              {/* Image */}
              {item.image && (
                <div
                  style={{
                    aspectRatio: getAspectRatio(),
                    borderRadius: `${imageBorderRadius}px`,
                    overflow: 'hidden',
                    marginBottom: '16px',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.subtitle}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              )}

              {/* Subtitle */}
              <h3
                style={{
                  fontSize: `${subtitleSize}px`,
                  fontWeight: subtitleFontWeight,
                  color: subtitleColor,
                  marginBottom: '8px',
                }}
              >
                {item.subtitle}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: `${descriptionSize}px`,
                  color: descriptionColor,
                  lineHeight: 1.6,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StickyFormSection({ widget }: { widget: StickyFormWidget }) {
  const { deviceView } = useBuilderStore();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formLayout = widget.formLayout || 'form-left';
  const mobileStackOrder = widget.mobileStackOrder || 'form-first';
  const heading = widget.heading || '';
  const headingColor = widget.headingColor || '#1f2937';
  const headingSize = widget.headingSize ?? 36;
  const bodyParagraphs = widget.bodyParagraphs || [];
  const bulletPoints = widget.bulletPoints || [];
  const hyperlinks = widget.hyperlinks || [];
  const textColor = widget.textColor || '#374151';
  const textSize = widget.textSize ?? 16;

  const fields = widget.fields || [];
  const formHeading = widget.formHeading || '';
  const formDescription = widget.formDescription || '';
  const buttonText = widget.buttonText || 'Submit';
  const confirmationMessage = widget.confirmationMessage || 'Thank you!';

  const formBoxed = widget.formBoxed ?? true;
  const formBoxBackground = widget.formBoxBackground || '#ffffff';
  const formBoxBorderRadius = widget.formBoxBorderRadius ?? 12;
  const formBoxPadding = widget.formBoxPadding ?? 32;
  const formBoxShadow = widget.formBoxShadow ?? true;
  const fieldBackgroundColor = widget.fieldBackgroundColor || '#f3f4f6';
  const fieldTextColor = widget.fieldTextColor || '#1f2937';
  const fieldPlaceholderColor = widget.fieldPlaceholderColor || '#9ca3af';
  const fieldBorderRadius = widget.fieldBorderRadius ?? 8;
  const buttonFullWidth = widget.buttonFullWidth ?? false;
  const buttonBgColor = widget.buttonStyle?.bgColor || '#10b981';
  const buttonTextColor = widget.buttonStyle?.textColor || '#ffffff';
  const buttonRadius = widget.buttonStyle?.radius ?? 8;

  const layoutConfig = widget.layout || {
    fullWidth: true,
    maxWidth: 1200,
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
  };

  const backgroundConfig = widget.background || {
    type: 'color',
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };

  const getBackgroundStyle = () => {
    const styles: React.CSSProperties = {};
    
    if (backgroundConfig.type === 'color') {
      const opacity = backgroundConfig.opacity ?? 100;
      if (backgroundConfig.color === 'transparent') {
        styles.backgroundColor = 'transparent';
      } else {
        const r = parseInt(backgroundConfig.color.slice(1, 3), 16);
        const g = parseInt(backgroundConfig.color.slice(3, 5), 16);
        const b = parseInt(backgroundConfig.color.slice(5, 7), 16);
        styles.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
      }
    } else if (backgroundConfig.type === 'image' && backgroundConfig.imageUrl) {
      styles.backgroundImage = `url(${backgroundConfig.imageUrl})`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
      styles.backgroundRepeat = 'no-repeat';
    }
    
    return styles;
  };

  // Parse hyperlinks in text
  const parseTextWithLinks = (text: string) => {
    let parsedText = text;
    const linkMap: Record<string, { text: string; url: string }> = {};
    
    hyperlinks.forEach((link) => {
      linkMap[link.id] = { text: link.text, url: link.url };
    });

    const parts: (string | JSX.Element)[] = [];
    const linkRegex = /\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(parsedText)) !== null) {
      const linkId = match[1];
      if (linkMap[linkId]) {
        parts.push(parsedText.substring(lastIndex, match.index));
        parts.push(
          <a
            key={match.index}
            href={linkMap[linkId].url}
            style={{ color: '#3b82f6', textDecoration: 'underline' }}
          >
            {linkMap[linkId].text}
          </a>
        );
        lastIndex = match.index + match[0].length;
      }
    }
    parts.push(parsedText.substring(lastIndex));

    return parts.length > 1 ? parts : text;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({});
    }, 3000);
  };

  const renderForm = () => (
    <div
      style={{
        backgroundColor: formBoxed ? formBoxBackground : 'transparent',
        borderRadius: formBoxed ? `${formBoxBorderRadius}px` : '0',
        padding: formBoxed ? `${formBoxPadding}px` : '0',
        boxShadow: formBoxed && formBoxShadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none',
        ...(deviceView !== 'mobile' && { 
          position: 'sticky', 
          top: '20px',
          alignSelf: 'start',
          height: 'fit-content',
        }),
      }}
    >
      {formHeading && (
        <h3
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '8px',
          }}
        >
          {formHeading}
        </h3>
      )}
      {formDescription && (
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '24px',
          }}
        >
          {formDescription}
        </p>
      )}

      {isSubmitted ? (
        <div
          style={{
            padding: '24px',
            backgroundColor: '#d1fae5',
            borderRadius: '8px',
            color: '#065f46',
            textAlign: 'center',
          }}
        >
          {confirmationMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {fields.map((field) => (
            <div key={field.id}>
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder || field.label}
                  required={field.required}
                  value={formData[field.label] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.label]: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: fieldBackgroundColor,
                    color: fieldTextColor,
                    borderRadius: `${fieldBorderRadius}px`,
                    border: 'none',
                    fontSize: '16px',
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder || field.label}
                  required={field.required}
                  value={formData[field.label] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.label]: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: fieldBackgroundColor,
                    color: fieldTextColor,
                    borderRadius: `${fieldBorderRadius}px`,
                    border: 'none',
                    fontSize: '16px',
                  }}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: buttonBgColor,
              color: buttonTextColor,
              borderRadius: `${buttonRadius}px`,
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              width: buttonFullWidth ? '100%' : 'auto',
            }}
          >
            {isSubmitting ? 'Submitting...' : buttonText}
          </button>
        </form>
      )}
    </div>
  );

  const renderTextContent = () => (
    <div>
      {heading && (
        <h2
          style={{
            fontSize: `${headingSize}px`,
            fontWeight: 700,
            color: headingColor,
            fontFamily: widget.headingFontFamily || 'Inter',
            marginBottom: '24px',
          }}
        >
          {heading}
        </h2>
      )}

      {widget.richTextContent ? (
        <div
          className="prose prose-sm max-w-none"
          style={{
            fontSize: `${textSize}px`,
            color: textColor,
            fontFamily: widget.textFontFamily || 'Inter',
            lineHeight: 1.6,
          }}
          dangerouslySetInnerHTML={{ __html: widget.richTextContent }}
        />
      ) : (
        <>
          {/* Fallback for old data format */}
          {bodyParagraphs.map((paragraph, index) => (
            <p
              key={index}
              style={{
                fontSize: `${textSize}px`,
                color: textColor,
                fontFamily: widget.textFontFamily || 'Inter',
                lineHeight: 1.6,
                marginBottom: '16px',
              }}
            >
              {parseTextWithLinks(paragraph)}
            </p>
          ))}

          {bulletPoints && bulletPoints.length > 0 && (
            <ul style={{ marginTop: '16px', paddingLeft: '24px' }}>
              {bulletPoints.map((bullet, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: `${textSize}px`,
                    color: textColor,
                    fontFamily: widget.textFontFamily || 'Inter',
                    marginBottom: '8px',
                  }}
                >
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{
        ...getBackgroundStyle(),
        paddingTop: `${layoutConfig.paddingTop || 80}px`,
        paddingBottom: `${layoutConfig.paddingBottom || 80}px`,
        paddingLeft: `${layoutConfig.paddingLeft || 24}px`,
        paddingRight: `${layoutConfig.paddingRight || 24}px`,
      }}
    >
      <div
        style={{
          maxWidth: layoutConfig.fullWidth ? '100%' : `${layoutConfig.maxWidth || 1200}px`,
          margin: '0 auto',
        }}
      >
        <div
          className={cn(
            deviceView === 'mobile' 
              ? `flex ${mobileStackOrder === 'form-first' ? 'flex-col' : 'flex-col-reverse'} gap-12`
              : 'grid grid-cols-2 gap-12 items-start'
          )}
        >
          {(formLayout === 'form-left' && deviceView !== 'mobile') || (mobileStackOrder === 'form-first' && deviceView === 'mobile') ? (
            <>
              {renderForm()}
              {renderTextContent()}
            </>
          ) : (
            <>
              {renderTextContent()}
              {renderForm()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewsSliderSection({ widget }: { widget: ReviewsSliderWidget }) {
  const { deviceView } = useBuilderStore();
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const source = widget.source || 'google';
  const filterStars = widget.filterStars ?? false;
  const scrollStyle = widget.scrollStyle || widget.autoScroll !== undefined ? (widget.autoScroll ? 'timer' : 'manual') : 'timer'; // backward compatibility
  const scrollInterval = (widget.scrollInterval ?? 5) * 1000;
  const desktopCount = widget.desktopCount || 3;
  const tabletCount = widget.tabletCount || 2;
  const mobileCount = widget.mobileCount || 1;
  const enableReadMore = widget.enableReadMore ?? true;
  const readMoreLimit = widget.readMoreLimit ?? 150;
  const starIconStyle = widget.starIconStyle || 'filled';
  const starColor = widget.starColor || '#f59e0b';
  const starSize = widget.starSize ?? 20;
  const showGoogleLogo = widget.showGoogleLogo ?? true;
  const showReviewDate = widget.showReviewDate ?? true;
  const boxBackground = widget.boxBackground || '#ffffff';
  const boxBorderRadius = widget.boxBorderRadius ?? 12;
  const boxBorder = widget.boxBorder ?? false;
  const boxBorderColor = widget.boxBorderColor || '#e5e7eb';
  const boxBorderWidth = widget.boxBorderWidth ?? 1;
  const boxShadow = widget.boxShadow ?? true;
  const boxPadding = widget.boxPadding ?? 24;
  const gap = widget.gap ?? 24;
  const nameColor = widget.nameColor || '#1f2937';
  const nameSize = widget.nameSize ?? 16;
  const nameFontWeight = widget.nameFontWeight ?? 600;
  const textColor = widget.textColor || '#6b7280';
  const textSize = widget.textSize ?? 14;
  const dateColor = widget.dateColor || '#9ca3af';
  const dateSize = widget.dateSize ?? 12;
  const showButton = widget.showButton ?? false;
  const buttonText = widget.buttonText || '';
  const buttonUrl = widget.buttonUrl || '#';
  const buttonBgColor = widget.buttonStyle?.bgColor || '#10b981';
  const buttonTextColor = widget.buttonStyle?.textColor || '#ffffff';
  const buttonRadius = widget.buttonStyle?.radius ?? 8;

  const sectionHeading = widget.sectionHeading;
  const sectionHeadingColor = widget.sectionHeadingColor || '#1f2937';
  const sectionSubheading = widget.sectionSubheading;
  const sectionSubheadingColor = widget.sectionSubheadingColor || '#6b7280';

  const layoutConfig = widget.layout || {
    fullWidth: true,
    maxWidth: 1200,
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
  };

  const backgroundConfig = widget.background || {
    type: 'color',
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };

  // Get reviews (from Google mock data or manual)
  let allReviews = widget.reviews || [];
  if (source === 'google') {
    // Import mock data
    const { mockGoogleReviews } = require('@/lib/mock-data/reviews');
    allReviews = mockGoogleReviews;
  }

  // Filter reviews if needed
  const displayReviews = filterStars 
    ? allReviews.filter(review => review.rating >= 4)
    : allReviews;

  const getReviewsPerRow = () => {
    if (deviceView === 'mobile') return mobileCount;
    if (deviceView === 'tablet') return tabletCount;
    return desktopCount;
  };

  const reviewsPerRow = getReviewsPerRow();
  const maxOffset = Math.max(0, displayReviews.length - reviewsPerRow);

  // Timer-based auto-scroll logic
  useEffect(() => {
    if (scrollStyle !== 'timer' || isHovered || displayReviews.length <= reviewsPerRow) return;

    const timer = setInterval(() => {
      setCurrentOffset((prev) => {
        const next = prev + 1;
        return next > maxOffset ? 0 : next;
      });
    }, scrollInterval);

    return () => clearInterval(timer);
  }, [scrollStyle, scrollInterval, isHovered, displayReviews.length, reviewsPerRow, maxOffset]);

  // Marquee continuous scroll logic
  useEffect(() => {
    if (scrollStyle !== 'marquee' || isHovered) return;

    const timer = setInterval(() => {
      setCurrentOffset((prev) => {
        const next = prev + 0.5; // Smooth scrolling increment
        return next >= displayReviews.length ? 0 : next;
      });
    }, 50); // Fast interval for smooth animation

    return () => clearInterval(timer);
  }, [scrollStyle, isHovered, displayReviews.length]);

  // Navigation handlers
  const handlePrev = () => {
    setCurrentOffset((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentOffset((prev) => Math.min(maxOffset, prev + 1));
  };

  const toggleReadMore = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const getBackgroundStyle = () => {
    const styles: React.CSSProperties = {};
    
    if (backgroundConfig.type === 'color') {
      const opacity = backgroundConfig.opacity ?? 100;
      if (backgroundConfig.color === 'transparent') {
        styles.backgroundColor = 'transparent';
      } else {
        const r = parseInt(backgroundConfig.color.slice(1, 3), 16);
        const g = parseInt(backgroundConfig.color.slice(3, 5), 16);
        const b = parseInt(backgroundConfig.color.slice(5, 7), 16);
        styles.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
      }
    } else if (backgroundConfig.type === 'image' && backgroundConfig.imageUrl) {
      styles.backgroundImage = `url(${backgroundConfig.imageUrl})`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
      styles.backgroundRepeat = 'no-repeat';
    }
    
    return styles;
  };

  // Calculate visible reviews based on scroll style
  const visibleReviews = scrollStyle === 'marquee' 
    ? displayReviews // Show all for marquee
    : displayReviews.slice(Math.floor(currentOffset), Math.floor(currentOffset) + reviewsPerRow);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        ...getBackgroundStyle(),
        paddingTop: `${layoutConfig.paddingTop || 80}px`,
        paddingBottom: `${layoutConfig.paddingBottom || 80}px`,
        paddingLeft: `${layoutConfig.paddingLeft || 24}px`,
        paddingRight: `${layoutConfig.paddingRight || 24}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          maxWidth: layoutConfig.fullWidth ? '100%' : `${layoutConfig.maxWidth || 1200}px`,
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        {(sectionHeading || sectionSubheading) && (
          <div className="text-center mb-12">
            {sectionHeading && (
              <h2
                className="text-4xl font-bold mb-2"
                style={{ color: sectionHeadingColor }}
              >
                {sectionHeading}
              </h2>
            )}
            {sectionSubheading && (
              <p
                className="text-lg"
                style={{ color: sectionSubheadingColor }}
              >
                {sectionSubheading}
              </p>
            )}
          </div>
        )}

        {/* Reviews Grid Container */}
        <div className="relative">
          {scrollStyle === 'marquee' ? (
            // Marquee mode: continuous scroll
            <div className="overflow-hidden">
              <div
                style={{
                  display: 'flex',
                  gap: `${gap}px`,
                  transform: `translateX(-${(currentOffset / displayReviews.length) * 100}%)`,
                  transition: isHovered ? 'none' : 'transform 0.05s linear',
                }}
              >
                {[...displayReviews, ...displayReviews].map((review, index) => {
                  const isExpanded = expandedReviews.has(review.id);
                  const shouldTruncate = enableReadMore && review.text.length > readMoreLimit && !isExpanded;
                  const displayText = shouldTruncate ? review.text.substring(0, readMoreLimit) + '...' : review.text;

                  return (
                    <div
                      key={`${review.id}-${index}`}
                      style={{
                        backgroundColor: boxBackground,
                        borderRadius: `${boxBorderRadius}px`,
                        padding: `${boxPadding}px`,
                        border: boxBorder ? `${boxBorderWidth}px solid ${boxBorderColor}` : 'none',
                        boxShadow: boxShadow ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: `calc((100% - ${gap * (reviewsPerRow - 1)}px) / ${reviewsPerRow})`,
                        flex: '0 0 auto',
                      }}
                    >
                      {/* Review Card Content */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {review.avatar && (
                            <img
                              src={review.avatar}
                              alt={review.name}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          )}
                          <span style={{ fontSize: `${nameSize}px`, fontWeight: nameFontWeight, color: nameColor }}>
                            {review.name}
                          </span>
                        </div>
                        {showGoogleLogo && review.source === 'google' && (
                          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                            <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                          </svg>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={starSize}
                            fill={i < review.rating ? starColor : (starIconStyle === 'filled' ? 'transparent' : 'none')}
                            stroke={starColor}
                            style={{ color: starColor }}
                          />
                        ))}
                      </div>
                      <p style={{ fontSize: `${textSize}px`, color: textColor, lineHeight: 1.6, marginBottom: '12px', flex: 1 }}>
                        {displayText}
                      </p>
                      {enableReadMore && review.text.length > readMoreLimit && (
                        <button
                          onClick={() => toggleReadMore(review.id)}
                          style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', marginBottom: '8px' }}
                        >
                          {isExpanded ? 'Read less' : 'Read more'}
                        </button>
                      )}
                      {showReviewDate && (
                        <p style={{ fontSize: `${dateSize}px`, color: dateColor }}>{review.date}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Timer/Manual mode: discrete pagination
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${reviewsPerRow}, 1fr)`,
                gap: `${gap}px`,
              }}
            >
              {visibleReviews.map((review) => {
                const isExpanded = expandedReviews.has(review.id);
                const shouldTruncate = enableReadMore && review.text.length > readMoreLimit && !isExpanded;
                const displayText = shouldTruncate ? review.text.substring(0, readMoreLimit) + '...' : review.text;

                return (
                  <div
                    key={review.id}
                    style={{
                      backgroundColor: boxBackground,
                      borderRadius: `${boxBorderRadius}px`,
                      padding: `${boxPadding}px`,
                      border: boxBorder ? `${boxBorderWidth}px solid ${boxBorderColor}` : 'none',
                      boxShadow: boxShadow ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    {/* Review Card Content */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {review.avatar && (
                          <img
                            src={review.avatar}
                            alt={review.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        )}
                        <span style={{ fontSize: `${nameSize}px`, fontWeight: nameFontWeight, color: nameColor }}>
                          {review.name}
                        </span>
                      </div>
                      {showGoogleLogo && review.source === 'google' && (
                        <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                          <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                          <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                          <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                          <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={starSize}
                          fill={i < review.rating ? starColor : (starIconStyle === 'filled' ? 'transparent' : 'none')}
                          stroke={starColor}
                          style={{ color: starColor }}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: `${textSize}px`, color: textColor, lineHeight: 1.6, marginBottom: '12px', flex: 1 }}>
                      {displayText}
                    </p>
                    {enableReadMore && review.text.length > readMoreLimit && (
                      <button
                        onClick={() => toggleReadMore(review.id)}
                        style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', marginBottom: '8px' }}
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                    {showReviewDate && (
                      <p style={{ fontSize: `${dateSize}px`, color: dateColor }}>{review.date}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation Buttons for Manual Mode */}
          {scrollStyle === 'manual' && displayReviews.length > reviewsPerRow && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentOffset === 0}
                style={{
                  position: 'absolute',
                  left: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentOffset === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentOffset === 0 ? 0.5 : 1,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: 10,
                }}
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                disabled={currentOffset >= maxOffset}
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentOffset >= maxOffset ? 'not-allowed' : 'pointer',
                  opacity: currentOffset >= maxOffset ? 0.5 : 1,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: 10,
                }}
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* CTA Button */}
        {showButton && buttonText && (
            const isExpanded = expandedReviews.has(review.id);
            const shouldTruncate = enableReadMore && review.text.length > readMoreLimit && !isExpanded;
            const displayText = shouldTruncate ? review.text.substring(0, readMoreLimit) + '...' : review.text;

            return (
              <div
                key={review.id}
                style={{
                  backgroundColor: boxBackground,
                  borderRadius: `${boxBorderRadius}px`,
                  padding: `${boxPadding}px`,
                  border: boxBorder ? `${boxBorderWidth}px solid ${boxBorderColor}` : 'none',
                  boxShadow: boxShadow ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                {/* Header: Name & Google Logo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {review.avatar && (
                      <img
                        src={review.avatar}
                        alt={review.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontSize: `${nameSize}px`,
                        fontWeight: nameFontWeight,
                        color: nameColor,
                      }}
                    >
                      {review.name}
                    </span>
                  </div>
                  {showGoogleLogo && review.source === 'google' && (
                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                      <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                      <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                    </svg>
                  )}
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={starSize}
                      fill={i < review.rating ? starColor : (starIconStyle === 'filled' ? 'transparent' : 'none')}
                      stroke={starColor}
                      style={{ color: starColor }}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p
                  style={{
                    fontSize: `${textSize}px`,
                    color: textColor,
                    lineHeight: 1.6,
                    marginBottom: '12px',
                    flex: 1,
                  }}
                >
                  {displayText}
                </p>

                {/* Read More Button */}
                {enableReadMore && review.text.length > readMoreLimit && (
                  <button
                    onClick={() => toggleReadMore(review.id)}
                    style={{
                      color: '#3b82f6',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      marginBottom: '8px',
                    }}
                  >
                    {isExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}

                {/* Date */}
                {showReviewDate && (
                  <p
                    style={{
                      fontSize: `${dateSize}px`,
                      color: dateColor,
                    }}
                  >
                    {review.date}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        {showButton && buttonText && (
          <div className="flex justify-center mt-8">
            <a
              href={buttonUrl}
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
                borderRadius: `${buttonRadius}px`,
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.3s ease',
              }}
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
