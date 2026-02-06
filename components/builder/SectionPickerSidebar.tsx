'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  Type, 
  Image as ImageIcon, 
  Grid3x3,
  Boxes,
  HelpCircle,
  Quote,
  ListOrdered,
  Columns,
  StickyNote,
  Star,
  Code, 
  Navigation, 
  Mail,
  AlignLeft,
  Search
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
    id: 'icon-text',
    type: 'icon-text',
    icon: Boxes,
    title: 'Icon + Text',
    description: 'Display features or services with icons and descriptions',
  },
  {
    id: 'text-section',
    type: 'text-section',
    icon: AlignLeft,
    title: 'Text Section',
    description: 'Flexible text layout with heading, body, and optional button',
  },
  {
    id: 'faq',
    type: 'faq',
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Accordion-style frequently asked questions section',
  },
  {
    id: 'testimonials',
    type: 'testimonials',
    icon: Quote,
    title: 'Testimonials',
    description: 'Showcase customer reviews with a carousel slider',
  },
  {
    id: 'steps',
    type: 'steps',
    icon: ListOrdered,
    title: 'Steps',
    description: 'Process or steps section with image and numbered steps',
  },
  {
    id: 'image-text-columns',
    type: 'image-text-columns',
    icon: Columns,
    title: 'Multi-Column Image + Text',
    description: 'Responsive grid with images, subtitles, and descriptions',
  },
  {
    id: 'sticky-form',
    type: 'sticky-form',
    icon: StickyNote,
    title: 'Sticky Form + Text',
    description: 'Two-column layout with sticky form and rich text content',
  },
  {
    id: 'reviews-slider',
    type: 'reviews-slider',
    icon: Star,
    title: 'Reviews Slider',
    description: 'Display customer reviews in an auto-scrolling grid',
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

interface SectionPickerSidebarProps {
  onSelectSection: (sectionType: string) => void;
}

export function SectionPickerSidebar({ onSelectSection }: SectionPickerSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return sectionOptions;
    }
    
    const query = searchQuery.toLowerCase();
    return sectionOptions.filter(option => 
      option.title.toLowerCase().includes(query) ||
      option.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-3">Sections</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {filteredSections.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-muted-foreground">
              No sections found matching "{searchQuery}"
            </p>
          </div>
        ) : (
          filteredSections.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.id}
                className="p-3 cursor-pointer hover:bg-muted/50 hover:border-primary transition-all"
                onClick={() => onSelectSection(option.type)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
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
          })
        )}
      </div>
    </div>
  );
}
