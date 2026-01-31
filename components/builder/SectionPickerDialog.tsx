'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { 
  Sparkles, 
  Type, 
  Image as ImageIcon, 
  Grid3x3, 
  Code, 
  Navigation, 
  Mail 
} from 'lucide-react';

interface SectionOption {
  id: string;
  type: string;
  icon: any;
  title: string;
  description: string;
}

const sectionOptions: SectionOption[] = [
  {
    id: 'hero',
    type: 'hero',
    icon: Sparkles,
    title: 'Hero Section',
    description: 'Full-width banner with title, subtitle, and CTA button',
  },
  {
    id: 'headline',
    type: 'headline',
    icon: Type,
    title: 'Headline',
    description: 'Header and subheader section with optional background linking',
  },
  {
    id: 'image-text',
    type: 'image-text',
    icon: ImageIcon,
    title: 'Image + Text',
    description: 'Side-by-side layout with image and text content',
  },
  {
    id: 'image-gallery',
    type: 'image-gallery',
    icon: Grid3x3,
    title: 'Image Gallery',
    description: 'Grid layout for showcasing multiple images',
  },
  {
    id: 'custom-code',
    type: 'custom-code',
    icon: Code,
    title: 'Custom Code',
    description: 'Add your own HTML, CSS, and JavaScript',
  },
  {
    id: 'image-navigation',
    type: 'image-navigation',
    icon: Navigation,
    title: 'Image Navigation',
    description: 'Multi-column layout with background images and navigation links',
  },
  {
    id: 'contact-form',
    type: 'contact-form',
    icon: Mail,
    title: 'Contact Form',
    description: 'Customizable contact form with multiple field types',
  },
];

interface SectionPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSection: (sectionType: string) => void;
}

export function SectionPickerDialog({ open, onOpenChange, onSelectSection }: SectionPickerDialogProps) {
  const handleSelectSection = (sectionType: string) => {
    onSelectSection(sectionType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
          <DialogDescription>
            Choose a section type to add to your page
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {sectionOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.id}
                className="p-4 cursor-pointer hover:bg-muted/50 hover:border-primary transition-all"
                onClick={() => handleSelectSection(option.type)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">{option.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
