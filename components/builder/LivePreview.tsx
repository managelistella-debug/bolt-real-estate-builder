'use client';

import { useState } from 'react';
import { Page, Website, HeroWidget, AboutWidget, ServicesWidget, ContactWidget, HeadlineWidget, ImageTextWidget, ImageGalleryWidget, IconTextWidget, TextSectionWidget, CustomCodeWidget, ImageNavigationWidget, ContactFormWidget } from '@/lib/types';
import { useBuilderStore } from '@/lib/stores/builder';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Lightbox } from './Lightbox';
import { getIcon } from '@/lib/icons/iconLibrary';

interface LivePreviewProps {
  page: Page;
  website: Website;
}

export function LivePreview({ page, website }: LivePreviewProps) {
  const { deviceView, selectedSectionId } = useBuilderStore();

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
              className={cn(
                'transition-all',
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
          widget.background.url.startsWith('data:') ? (
            <img
              src={widget.background.url}
              alt="Hero background"
              className="w-full h-full object-cover"
              style={{ filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none' }}
            />
          ) : (
            <Image
              src={widget.background.url}
              alt="Hero background"
              fill
              className="object-cover"
              style={{ filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none' }}
            />
          )
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
          <Image
            src={widget.image}
            alt="About"
            fill
            className="object-cover"
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
      {widget.image.startsWith('data:') ? (
        // Use regular img tag for base64 data URLs
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
      ) : (
        // Use Next.js Image for external URLs
        <Image 
          src={widget.image} 
          alt={widget.title || ''} 
          fill 
          style={{
            objectFit: imageObjectFit as any,
            objectPosition: imageObjectPosition,
          }}
        />
      )}
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
            widget.background.url.startsWith('data:') ? (
              <img
                src={widget.background.url}
                alt="Section background"
                className="w-full h-full object-cover"
                style={{ opacity: bgOpacity }}
              />
            ) : (
              <Image
                src={widget.background.url}
                alt="Section background"
                fill
                className="object-cover"
                style={{ opacity: bgOpacity }}
              />
            )
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
            <Image src={image.url} alt={image.caption || `Image ${index + 1}`} fill className="object-cover" />
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
              <Image src={image.url} alt={image.caption || `Image ${index + 1}`} fill className="object-cover" />
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
              <Image src={image.url} alt={image.caption || `Image ${index + 1}`} fill className="object-cover" />
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
              <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
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
            <Image
              src={widget.background.url}
              alt="Section background"
              fill
              className="object-cover"
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

  // Tagline component
  const taglineElement = widget.tagline && (
    <div
      className="font-semibold uppercase tracking-wide mb-4"
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
            <Image
              src={widget.background.url}
              alt="Section background"
              fill
              className="object-cover"
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
                  {taglineElement}
                  {headingElement}
                </div>
              </>
            ) : (
              <>
                {/* Heading Column */}
                <div>
                  {taglineElement}
                  {headingElement}
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
            {taglineElement}
            {headingElement}
            {bodyElement}
            {buttonElement}
          </div>
        )}
      </div>
    </div>
  );
}

function ContactFormSection({ widget }: { widget: ContactFormWidget }) {
  return (
    <div className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
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
            className="w-full py-3 rounded-md font-medium text-white bg-primary"
          >
            {widget.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
