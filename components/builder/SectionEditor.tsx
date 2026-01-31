'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Section, HeroWidget, AboutWidget, ServicesWidget, ContactWidget, HeadlineWidget, ImageTextWidget, ImageGalleryWidget, CustomCodeWidget, ImageNavigationWidget, ContactFormWidget } from '@/lib/types';
import { useBuilderStore } from '@/lib/stores/builder';
import { useWebsiteStore } from '@/lib/stores/website';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { HeroSectionEditor } from './HeroSectionEditor';
import { HeadlineEditor } from './section-editors/HeadlineEditor';
import { ImageTextEditor } from './section-editors/ImageTextEditor';

interface SectionEditorProps {
  pageId: string;
  sections: Section[];
}

export function SectionEditor({ pageId, sections }: SectionEditorProps) {
  const { selectedSectionId, selectSection } = useBuilderStore();
  const { updatePage } = useWebsiteStore();

  const section = sections.find(s => s.id === selectedSectionId);

  if (!section) return null;

  const updateSection = (updates: Partial<Section>) => {
    const updatedSections = sections.map(s =>
      s.id === selectedSectionId ? { ...s, ...updates } : s
    );
    updatePage(pageId, { sections: updatedSections });
  };

  const updateWidget = (widgetUpdates: any) => {
    updateSection({
      widget: { ...section.widget, ...widgetUpdates },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => selectSection(null)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold capitalize">Edit {section.type}</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {section.type === 'hero' && (
          <HeroSectionEditor 
            widget={section.widget as HeroWidget}
            onChange={updateWidget}
          />
        )}
        {section.type === 'headline' && (
          <HeadlineEditor 
            widget={section.widget as HeadlineWidget}
            onChange={updateWidget}
          />
        )}
        {section.type === 'image-text' && (
          <ImageTextEditor 
            widget={section.widget as ImageTextWidget}
            onChange={updateWidget}
          />
        )}
        {section.type === 'image-gallery' && (
          <ImageGalleryEditor 
            widget={section.widget as ImageGalleryWidget}
            onChange={updateWidget}
          />
        )}
        {section.type === 'custom-code' && (
          <CustomCodeEditor 
            widget={section.widget as CustomCodeWidget}
            onChange={updateWidget}
          />
        )}
        {section.type === 'image-navigation' && (
          <ImageNavigationEditor 
            widget={section.widget as ImageNavigationWidget}
            onChange={updateWidget}
          />
        )}
        {section.type === 'contact-form' && (
          <ContactFormEditor 
            widget={section.widget as ContactFormWidget}
            onChange={updateWidget}
          />
        )}
        {section.type === 'about' && (
          <AboutEditor 
            widget={section.widget as AboutWidget}
            onChange={updateWidget}
          />
        )}
        {section.type === 'services' && (
          <ServicesEditor 
            widget={section.widget as ServicesWidget}
            onChange={updateWidget}
          />
        )}
        {section.type === 'contact' && (
          <ContactEditor 
            widget={section.widget as ContactWidget}
            onChange={updateWidget}
          />
        )}
      </div>
    </div>
  );
}

// Placeholder editors for new section types (HeadlineEditor and ImageTextEditor are now imported)

function ImageGalleryEditor({ widget, onChange }: { widget: ImageGalleryWidget; onChange: (updates: any) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Columns</Label>
        <Input
          type="number"
          min="1"
          max="6"
          value={widget.columns}
          onChange={(e) => onChange({ columns: parseInt(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <Label>Gap (px)</Label>
        <Input
          type="number"
          value={widget.gap}
          onChange={(e) => onChange({ gap: parseInt(e.target.value) })}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Gallery with {widget.images.length} images
      </p>
    </>
  );
}

function CustomCodeEditor({ widget, onChange }: { widget: CustomCodeWidget; onChange: (updates: any) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>HTML</Label>
        <Textarea
          value={widget.html}
          onChange={(e) => onChange({ html: e.target.value })}
          rows={4}
          className="font-mono text-xs"
        />
      </div>
      <div className="space-y-2">
        <Label>CSS</Label>
        <Textarea
          value={widget.css}
          onChange={(e) => onChange({ css: e.target.value })}
          rows={4}
          className="font-mono text-xs"
        />
      </div>
      <div className="space-y-2">
        <Label>JavaScript</Label>
        <Textarea
          value={widget.javascript}
          onChange={(e) => onChange({ javascript: e.target.value })}
          rows={4}
          className="font-mono text-xs"
        />
      </div>
    </>
  );
}

function ImageNavigationEditor({ widget, onChange }: { widget: ImageNavigationWidget; onChange: (updates: any) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Columns</Label>
        <Input
          type="number"
          min="1"
          max="6"
          value={widget.columns}
          onChange={(e) => onChange({ columns: parseInt(e.target.value) })}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {widget.items.length} navigation items
      </p>
    </>
  );
}

function ContactFormEditor({ widget, onChange }: { widget: ContactFormWidget; onChange: (updates: any) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input
          value={widget.buttonText}
          onChange={(e) => onChange({ buttonText: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Confirmation Message</Label>
        <Textarea
          value={widget.confirmationMessage}
          onChange={(e) => onChange({ confirmationMessage: e.target.value })}
          rows={3}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Form has {widget.formFields.length} fields
      </p>
    </>
  );
}

function AboutEditor({ widget, onChange }: { widget: AboutWidget; onChange: (updates: any) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea
          value={widget.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Tell your story..."
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          value={widget.image}
          onChange={(e) => onChange({ image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {widget.cta && (
        <>
          <div className="space-y-2">
            <Label>CTA Button Text (optional)</Label>
            <Input
              value={widget.cta.text}
              onChange={(e) => onChange({ cta: { ...widget.cta, text: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Button URL</Label>
            <Input
              value={widget.cta.url}
              onChange={(e) => onChange({ cta: { ...widget.cta, url: e.target.value } })}
            />
          </div>
        </>
      )}
    </>
  );
}

function ServicesEditor({ widget, onChange }: { widget: ServicesWidget; onChange: (updates: any) => void }) {
  const addService = () => {
    const newService = {
      id: `service-${Date.now()}`,
      title: 'New Service',
      description: 'Service description',
    };
    onChange({ services: [...widget.services, newService] });
  };

  const updateService = (index: number, updates: any) => {
    const updatedServices = [...widget.services];
    updatedServices[index] = { ...updatedServices[index], ...updates };
    onChange({ services: updatedServices });
  };

  const removeService = (index: number) => {
    onChange({ services: widget.services.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={widget.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Services ({widget.services.length})</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={addService}
            disabled={widget.services.length >= 6}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Service
          </Button>
        </div>

        {widget.services.map((service, index) => (
          <Card key={service.id} className="p-3 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Service {index + 1}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeService(index)}
                disabled={widget.services.length <= 2}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <Input
              value={service.title}
              onChange={(e) => updateService(index, { title: e.target.value })}
              placeholder="Service title"
            />
            <Textarea
              value={service.description}
              onChange={(e) => updateService(index, { description: e.target.value })}
              placeholder="Service description"
              rows={3}
            />
          </Card>
        ))}
      </div>
    </>
  );
}

function ContactEditor({ widget, onChange }: { widget: ContactWidget; onChange: (updates: any) => void }) {
  return (
    <>
      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input
          value={widget.buttonText}
          onChange={(e) => onChange({ buttonText: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Confirmation Message</Label>
        <Textarea
          value={widget.confirmationMessage}
          onChange={(e) => onChange({ confirmationMessage: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Form Fields</Label>
        <p className="text-sm text-muted-foreground">
          Form fields: {widget.formFields.map(f => f.label).join(', ')}
        </p>
        <p className="text-xs text-muted-foreground">
          Advanced form builder coming soon
        </p>
      </div>
    </>
  );
}
