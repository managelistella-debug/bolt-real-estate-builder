'use client';

import { Page, Website, HeroWidget, AboutWidget, ServicesWidget, ContactWidget } from '@/lib/types';
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
                selectedSectionId === section.id && 'ring-2 ring-primary ring-offset-4'
              )}
            >
              {section.type === 'hero' && (
                <HeroSection widget={section.widget as HeroWidget} styles={website.globalStyles} />
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
  return (
    <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={widget.background.url}
          alt="Hero background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className={cn(
        'relative z-10 text-white px-6 max-w-4xl',
        widget.alignment === 'center' && 'text-center',
        widget.alignment === 'left' && 'text-left',
        widget.alignment === 'right' && 'text-right'
      )}>
        <h1 className="text-5xl font-bold mb-4" style={{ 
          fontSize: styles.headings.h1.fontSize,
          fontWeight: styles.headings.h1.fontWeight 
        }}>
          {widget.headline}
        </h1>
        <p className="text-xl mb-8 opacity-90">{widget.subheadline}</p>
        <a
          href={widget.cta.url}
          className="inline-block px-8 py-3 rounded-md font-medium transition-colors"
          style={{ 
            backgroundColor: styles.colors.primary,
            color: 'white'
          }}
        >
          {widget.cta.text}
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
