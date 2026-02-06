'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/lib/types';
import { useBuilderStore } from '@/lib/stores/builder';
import { useWebsiteStore } from '@/lib/stores/website';
import { 
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
  X,
  GripVertical,
  Boxes,
  AlignLeft,
  HelpCircle,
  Quote,
  ListOrdered,
  Columns,
  StickyNote,
  Star
} from 'lucide-react';

interface FloatingLayersPanelProps {
  sections: Section[];
  pageId: string;
  onClose: () => void;
}

const sectionIcons: Record<string, any> = {
  hero: Sparkles,
  headline: Type,
  'image-text': ImageIcon,
  'image-gallery': Grid3x3,
  'icon-text': Boxes,
  'text-section': AlignLeft,
  'faq': HelpCircle,
  'testimonials': Quote,
  'steps': ListOrdered,
  'image-text-columns': Columns,
  'sticky-form': StickyNote,
  'reviews-slider': Star,
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
  'icon-text': 'Icon + Text',
  'text-section': 'Text Section',
  'faq': 'FAQ',
  'testimonials': 'Testimonials',
  'steps': 'Steps',
  'image-text-columns': 'Multi-Column Image + Text',
  'sticky-form': 'Sticky Form + Text',
  'reviews-slider': 'Reviews Slider',
  'custom-code': 'Custom Code',
  'image-navigation': 'Image Navigation',
  'contact-form': 'Contact Form',
  about: 'About',
  services: 'Services',
  contact: 'Contact',
};

export function FloatingLayersPanel({ sections, pageId, onClose }: FloatingLayersPanelProps) {
  const { selectedSectionId, selectSection, layersPanelPosition, setLayersPanelPosition } = useBuilderStore();
  const { updatePage } = useWebsiteStore();
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Calculate new position relative to viewport
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep panel within viewport bounds
        const maxX = window.innerWidth - (panelRef.current?.offsetWidth || 300);
        const maxY = window.innerHeight - (panelRef.current?.offsetHeight || 400);
        
        setLayersPanelPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, setLayersPanelPosition]);

  return (
    <div
      ref={panelRef}
      className="fixed bg-background border rounded-lg shadow-lg z-50 w-72 max-h-[500px] flex flex-col"
      style={{
        left: `${layersPanelPosition.x}px`,
        top: `${layersPanelPosition.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header with drag handle */}
      <div className="p-3 border-b flex items-center justify-between drag-handle cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Structure</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Sections list */}
      <div className="flex-1 overflow-auto p-2">
        {sections.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-xs text-muted-foreground">
              No sections yet
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {sections.map((section, index) => {
              const Icon = sectionIcons[section.type] || Sparkles;
              const isSelected = selectedSectionId === section.id;
              const isHidden = hiddenSections.has(section.id);

              return (
                <Card 
                  key={section.id}
                  className={`p-2 transition-colors cursor-pointer ${
                    isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  } ${isHidden ? 'opacity-50' : ''}`}
                  onClick={() => selectSection(section.id)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {sectionLabels[section.type] || section.type}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        #{index + 1}
                      </p>
                    </div>

                    <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
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
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
