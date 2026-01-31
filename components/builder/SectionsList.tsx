'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section, SectionType } from '@/lib/types';
import { useBuilderStore } from '@/lib/stores/builder';
import { useWebsiteStore } from '@/lib/stores/website';
import { Plus, GripVertical, Edit, Trash2, Image, FileText, Wrench, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SectionsListProps {
  siteId: string;
  pageId: string;
  sections: Section[];
}

const sectionIcons: Record<SectionType, any> = {
  hero: Image,
  about: FileText,
  services: Wrench,
  contact: Mail,
};

const sectionLabels: Record<SectionType, string> = {
  hero: 'Hero',
  about: 'About',
  services: 'Services',
  contact: 'Contact',
};

export function SectionsList({ siteId, pageId, sections }: SectionsListProps) {
  const { selectSection } = useBuilderStore();
  const { updatePage } = useWebsiteStore();
  const { toast } = useToast();

  const addSection = (type: SectionType) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      order: sections.length,
      widget: createDefaultWidget(type),
    };

    const updatedSections = [...sections, newSection];
    
    updatePage(siteId, pageId, { sections: updatedSections });
    
    toast({
      title: "Section added",
      description: `${sectionLabels[type]} section has been added.`,
    });
  };

  const deleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(s => s.id !== sectionId);
    updatePage(siteId, pageId, { sections: updatedSections });
    
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

    updatePage(siteId, pageId, { sections: newSections });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-3">Sections</h2>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSection('hero')}
            className="justify-start"
          >
            <Image className="h-4 w-4 mr-2" />
            Hero
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSection('about')}
            className="justify-start"
          >
            <FileText className="h-4 w-4 mr-2" />
            About
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSection('services')}
            className="justify-start"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Services
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSection('contact')}
            className="justify-start"
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
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
  );
}

function createDefaultWidget(type: SectionType): any {
  switch (type) {
    case 'hero':
      return {
        type: 'hero',
        background: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&h=1080',
        },
        headline: 'Welcome to Our Business',
        subheadline: 'Professional services you can trust',
        cta: {
          text: 'Get Started',
          url: '/contact',
        },
        alignment: 'center',
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
          {
            id: `service-${Date.now()}-1`,
            title: 'Service 1',
            description: 'Description of service 1',
          },
          {
            id: `service-${Date.now()}-2`,
            title: 'Service 2',
            description: 'Description of service 2',
          },
          {
            id: `service-${Date.now()}-3`,
            title: 'Service 3',
            description: 'Description of service 3',
          },
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
  }
}
