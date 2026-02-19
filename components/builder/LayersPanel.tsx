'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/lib/types';
import { useBuilderStore } from '@/lib/stores/builder';
import { useWebsiteStore } from '@/lib/stores/website';
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Trash2,
  Sparkles,
  Type,
  Image as ImageIcon,
  Grid3x3,
  Code,
  Navigation,
  Mail,
  Newspaper
} from 'lucide-react';
import { useState } from 'react';

interface LayersPanelProps {
  sections: Section[];
  pageId: string;
}

const sectionIcons: Record<string, any> = {
  hero: Sparkles,
  headline: Type,
  'image-text': ImageIcon,
  'image-gallery': Grid3x3,
  'blog-feed': Newspaper,
  'custom-code': Code,
  'image-navigation': Navigation,
  'contact-form': Mail,
  about: ImageIcon,
  services: Grid3x3,
  contact: Mail,
};

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section',
  headline: 'Headline',
  'image-text': 'Image + Text',
  'image-gallery': 'Image Gallery',
  'blog-feed': 'Blog Feed',
  'custom-code': 'Custom Code',
  'image-navigation': 'Image Navigation',
  'contact-form': 'Contact Form',
  about: 'About',
  services: 'Services',
  contact: 'Contact',
};

export function LayersPanel({ sections, pageId }: LayersPanelProps) {
  const { selectedSectionId, selectSection } = useBuilderStore();
  const { updatePage } = useWebsiteStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());

  const toggleExpand = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const toggleVisibility = (sectionId: string) => {
    setHiddenSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const deleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(s => s.id !== sectionId);
    updatePage(pageId, { sections: updatedSections });
    if (selectedSectionId === sectionId) {
      selectSection(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm">Layers</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {sections.length} section{sections.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {sections.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-muted-foreground">
              No sections yet. Add a section to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {sections.map((section, index) => {
              const Icon = sectionIcons[section.type] || Sparkles;
              const isSelected = selectedSectionId === section.id;
              const isHidden = hiddenSections.has(section.id);
              const isExpanded = expandedSections.has(section.id);

              return (
                <Card 
                  key={section.id}
                  className={`p-2 transition-colors ${
                    isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  } ${isHidden ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(section.id)}
                      className="p-0.5 hover:bg-muted rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => selectSection(section.id)}
                      className="flex items-center gap-2 flex-1 min-w-0"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-medium truncate">
                          {sectionLabels[section.type] || section.type}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          #{index + 1}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility(section.id)}
                        className="h-6 w-6 p-0"
                      >
                        {isHidden ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSection(section.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="ml-6 mt-2 pl-2 border-l border-muted">
                      <div className="text-[10px] text-muted-foreground space-y-0.5">
                        <div>Type: {section.type}</div>
                        <div>Order: {section.order}</div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
