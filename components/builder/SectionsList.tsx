'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section, SectionType } from '@/lib/types';
import { useBuilderStore } from '@/lib/stores/builder';
import { useWebsiteStore } from '@/lib/stores/website';
import { Plus, GripVertical, Edit, Trash2, Sparkles, Type, Image, Grid3x3, Boxes, AlignLeft, Code, Navigation, Mail, FileText, Wrench } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { SectionPickerDialog } from './SectionPickerDialog';

interface SectionsListProps {
  pageId: string;
  sections: Section[];
}

const sectionIcons: Record<string, any> = {
  hero: Sparkles,
  headline: Type,
  'image-text': Image,
  'image-gallery': Grid3x3,
  'icon-text': Boxes,
  'text-section': AlignLeft,
  'custom-code': Code,
  'image-navigation': Navigation,
  'contact-form': Mail,
  about: FileText,
  services: Wrench,
  contact: Mail,
};

const sectionLabels: Record<string, string> = {
  hero: 'Hero',
  headline: 'Headline',
  'image-text': 'Image + Text',
  'image-gallery': 'Image Gallery',
  'icon-text': 'Icon + Text',
  'text-section': 'Text Section',
  'custom-code': 'Custom Code',
  'image-navigation': 'Image Navigation',
  'contact-form': 'Contact Form',
  about: 'About',
  services: 'Services',
  contact: 'Contact',
};

export function SectionsList({ pageId, sections }: SectionsListProps) {
  const { selectSection } = useBuilderStore();
  const { updatePage } = useWebsiteStore();
  const { toast } = useToast();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const addSection = (type: string) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: type as SectionType,
      order: sections.length,
      widget: createDefaultWidget(type as SectionType),
    };

    const updatedSections = [...sections, newSection];
    
    updatePage(pageId, { sections: updatedSections });
    
    toast({
      title: "Section added",
      description: `${sectionLabels[type] || type} section has been added.`,
    });
  };

  const deleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(s => s.id !== sectionId);
    updatePage(pageId, { sections: updatedSections });
    
    toast({
      title: "Section deleted",
      description: "The section has been removed.",
    });
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Update order
    newSections.forEach((section, idx) => {
      section.order = idx;
    });

    updatePage(pageId, { sections: newSections });
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">Sections</h2>
          <Button
            onClick={() => setIsPickerOpen(true)}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        {sections.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No sections yet. Add a section to get started.
          </div>
        ) : (
          sections.map((section, index) => {
            const Icon = sectionIcons[section.type];
            return (
              <Card key={section.id} className="p-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 font-medium text-sm">
                    {sectionLabels[section.type]}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => selectSection(section.id)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSection(section.id)}
                      className="h-7 w-7 p-0"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                    className="flex-1 h-7 text-xs"
                  >
                    ↑ Up
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === sections.length - 1}
                    className="flex-1 h-7 text-xs"
                  >
                    ↓ Down
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>

      <SectionPickerDialog
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        onSelectSection={addSection}
      />
    </>
  );
}

function createDefaultWidget(type: SectionType): any {
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
          padding: { top: 80, right: 40, bottom: 80, left: 40 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
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
      };
    case 'headline':
      return {
        type: 'headline',
        title: 'Section Headline',
        subtitle: 'Optional subtitle text',
        background: {
          color: '#f9fafb',
          hasLink: false,
        },
        textAlign: 'center',
        padding: { top: 40, right: 20, bottom: 40, left: 20 },
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
        padding: {
          top: 60,
          right: 40,
          bottom: 60,
          left: 40,
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      };
    case 'image-gallery':
      return {
        type: 'image-gallery',
        collectionId: undefined,
        style: 'grid',
        columns: 3,
        gap: 16,
        aspectRatio: '3:2',
        lightbox: {
          enabled: true,
          showCaptions: true,
        },
        background: {
          type: 'color',
          color: 'transparent',
          opacity: 100,
          blur: 0,
        },
        layout: {
          height: { type: 'auto' },
          width: 'container',
          padding: { top: 40, right: 20, bottom: 40, left: 20 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      };
    case 'icon-text':
      return {
        type: 'icon-text',
        alignment: 'center',
        items: [
          {
            id: `item_${Date.now()}_1`,
            icon: 'check',
            iconColor: '#10b981',
            iconBgColor: '#d1fae5',
            heading: 'Feature One',
            headingColor: '#1f2937',
            subheading: 'Description of feature one goes here. Add details about this feature.',
            subheadingColor: '#6b7280',
            order: 0,
          },
          {
            id: `item_${Date.now()}_2`,
            icon: 'star',
            iconColor: '#10b981',
            iconBgColor: '#d1fae5',
            heading: 'Feature Two',
            headingColor: '#1f2937',
            subheading: 'Description of feature two goes here. Add details about this feature.',
            subheadingColor: '#6b7280',
            order: 1,
          },
          {
            id: `item_${Date.now()}_3`,
            icon: 'shield',
            iconColor: '#10b981',
            iconBgColor: '#d1fae5',
            heading: 'Feature Three',
            headingColor: '#1f2937',
            subheading: 'Description of feature three goes here. Add details about this feature.',
            subheadingColor: '#6b7280',
            order: 2,
          },
        ],
        columns: 3,
        gap: 24,
        iconSize: 'md',
        showViewMore: false,
        viewMoreText: 'View More',
        itemsBeforeViewMore: 6,
        boxed: false,
        boxBackground: '#ffffff',
        boxBorderRadius: 12,
        boxPadding: 24,
        boxShadow: true,
        boxBorder: false,
        boxBorderColor: '#e5e7eb',
        boxBorderWidth: 1,
        background: {
          type: 'color',
          color: 'transparent',
          opacity: 100,
          blur: 0,
        },
        layout: {
          height: { type: 'auto' },
          width: 'container',
          padding: { top: 60, right: 20, bottom: 60, left: 20 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      };
    case 'text-section':
      return {
        type: 'text-section',
        layout: 'side-by-side',
        tagline: 'LOCAL. RELIABLE. PROFESSIONAL.',
        taglineColor: '#10b981',
        heading: 'About Us',
        headingColor: '#1f2937',
        bodyText: 'Your company description goes here. Add details about your services, mission, and what makes you unique.',
        bodyTextColor: '#6b7280',
        buttonText: 'Get in Touch',
        buttonUrl: '/contact',
        buttonStyle: {
          backgroundColor: '#10b981',
          backgroundOpacity: 100,
          textColor: '#ffffff',
          borderRadius: 8,
          blur: 0,
          shadow: true,
          borderWidth: 0,
          borderColor: '#000000',
        },
        reverseOrder: false,
        headingAlignment: 'left',
        bodyAlignment: 'left',
        headingSize: 48,
        bodySize: 16,
        taglineSize: 14,
        columnGap: 60,
        rowGap: 24,
        headingColumnWidth: 40,
        background: {
          type: 'color',
          color: 'transparent',
          opacity: 100,
          blur: 0,
        },
        layout: {
          height: { type: 'auto' },
          width: 'container',
          padding: { top: 80, right: 20, bottom: 80, left: 20 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      };
    case 'custom-code':
      return {
        type: 'custom-code',
        html: '<div class="custom-section">\n  <h2>Custom Section</h2>\n  <p>Add your custom HTML here</p>\n</div>',
        css: '.custom-section {\n  padding: 2rem;\n  text-align: center;\n}',
        javascript: '// Add your JavaScript here\nconsole.log("Custom section loaded");',
      };
    case 'image-navigation':
      return {
        type: 'image-navigation',
        items: [
          { id: '1', title: 'Services', image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400', url: '/services' },
          { id: '2', title: 'About', image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400', url: '/about' },
          { id: '3', title: 'Contact', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400', url: '/contact' },
        ],
        columns: 3,
        gap: 16,
      };
    case 'contact-form':
      return {
        type: 'contact-form',
        formFields: [
          { id: 'field-1', type: 'text', label: 'First Name', required: true, order: 0 },
          { id: 'field-2', type: 'text', label: 'Last Name', required: true, order: 1 },
          { id: 'field-3', type: 'email', label: 'Email', required: true, order: 2 },
          { id: 'field-4', type: 'phone', label: 'Phone', required: false, order: 3 },
          { id: 'field-5', type: 'textarea', label: 'Message', required: true, order: 4 },
        ],
        buttonText: 'Send Message',
        confirmationMessage: 'Thank you! We\'ll get back to you soon.',
      };
    case 'about':
      return {
        type: 'about',
        content: 'Tell your story here. Share information about your business, your values, and what makes you unique.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600',
      };
    case 'services':
      return {
        type: 'services',
        title: 'Our Services',
        services: [
          { id: `service-${Date.now()}-1`, title: 'Service 1', description: 'Description of service 1' },
          { id: `service-${Date.now()}-2`, title: 'Service 2', description: 'Description of service 2' },
          { id: `service-${Date.now()}-3`, title: 'Service 3', description: 'Description of service 3' },
        ],
      };
    case 'contact':
      return {
        type: 'contact',
        formFields: [
          { id: 'field-1', type: 'text', label: 'First Name', required: true, order: 0 },
          { id: 'field-2', type: 'text', label: 'Last Name', required: true, order: 1 },
          { id: 'field-3', type: 'email', label: 'Email', required: true, order: 2 },
          { id: 'field-4', type: 'phone', label: 'Phone', required: false, order: 3 },
          { id: 'field-5', type: 'textarea', label: 'Message', required: true, order: 4 },
        ],
        buttonText: 'Send Message',
        confirmationMessage: 'Thank you! We\'ll get back to you soon.',
      };
    default:
      return {};
  }
}
