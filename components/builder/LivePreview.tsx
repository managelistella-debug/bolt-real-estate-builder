'use client';

import { Page, Website, HeroWidget, AboutWidget, ServicesWidget, ContactWidget, HeadlineWidget, ImageTextWidget, ImageGalleryWidget, CustomCodeWidget, ImageNavigationWidget, ContactFormWidget } from '@/lib/types';
import { useBuilderStore } from '@/lib/stores/builder';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
          {widget.images.map((image) => (
            <div key={image.id} className="relative overflow-hidden rounded-lg" style={{ aspectRatio: widget.aspectRatio === 'auto' ? 'auto' : widget.aspectRatio.replace(':', '/') }}>
              <Image src={image.url} alt={image.alt || ''} fill className="object-cover" />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
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
