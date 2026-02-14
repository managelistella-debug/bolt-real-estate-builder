'use client';

import { useState } from 'react';
import { ImageGalleryWidget, GalleryStyle, GalleryAspectRatio } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid3x3, LayoutGrid, Columns, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { useAuthStore } from '@/lib/stores/auth';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { useWebsiteStore } from '@/lib/stores/website';
import { GlobalColorInput } from '../controls/GlobalColorInput';
import Link from 'next/link';

interface ImageGalleryEditorNewProps {
  widget: ImageGalleryWidget;
  onChange: (updates: Partial<ImageGalleryWidget>) => void;
}

const GALLERY_STYLES: { value: GalleryStyle; label: string; description: string; icon: any }[] = [
  { value: 'grid', label: 'Grid Gallery', description: 'Uniform grid with fixed aspect ratio', icon: Grid3x3 },
  { value: 'mosaic', label: 'Mosaic Gallery', description: 'Dynamic masonry-style layout', icon: LayoutGrid },
  { value: 'set-layout', label: 'Set Layout', description: 'Custom pattern layout', icon: Columns },
];

const ASPECT_RATIOS: { value: GalleryAspectRatio; label: string }[] = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '3:2', label: 'Classic (3:2)' },
  { value: '4:5', label: 'Portrait (4:5)' },
  { value: '4:3', label: 'Standard (4:3)' },
];

export function ImageGalleryEditorNew({ widget, onChange }: ImageGalleryEditorNewProps) {
  const { user } = useAuthStore();
  const { collections } = useImageCollectionsStore();
  const { currentWebsite } = useWebsiteStore();

  // Collapsible states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);

  const CollapsibleSection = ({ 
    title, 
    open, 
    onToggle, 
    children 
  }: { 
    title: string; 
    open: boolean; 
    onToggle: () => void; 
    children: React.ReactNode;
  }) => (
    <div className="border rounded-lg">
      <button
        type="button"
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <span className="font-medium text-sm">{title}</span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && (
        <div className="p-4 pt-0 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  const userCollections = collections.filter((c) => c.userId === user?.id);
  const lightbox = widget.lightbox || { enabled: true, showCaptions: true };
  const layout = widget.layout || {
    height: { type: 'auto' },
    width: 'container',
    padding: { top: 40, right: 20, bottom: 40, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  const background = widget.background || { type: 'color', color: 'transparent', opacity: 100, blur: 0 };
  const selectedCollection = widget.collectionId ? collections.find((c) => c.id === widget.collectionId) : null;

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Collection Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Image Collection</Label>
          <Link href="/collections" target="_blank">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              Manage
            </Button>
          </Link>
        </div>
        <Select
          value={widget.collectionId || 'none'}
          onValueChange={(value) => onChange({ collectionId: value === 'none' ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a collection..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No collection selected</SelectItem>
            {userCollections.map((collection) => (
              <SelectItem key={collection.id} value={collection.id}>
                {collection.name} ({collection.images.length} images)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!widget.collectionId && (
          <p className="text-xs text-muted-foreground">
            Select an image collection to display in this gallery
          </p>
        )}
        {widget.collectionId && selectedCollection && selectedCollection.images.length === 0 && (
          <p className="text-xs text-amber-600">
            This collection is empty. Add images to see them in the gallery.
          </p>
        )}
      </div>

      {/* Gallery Style */}
      <div className="space-y-2">
        <Label>Gallery Style</Label>
        <div className="grid grid-cols-1 gap-2">
          {GALLERY_STYLES.map((style) => {
            const Icon = style.icon;
            return (
              <button
                key={style.value}
                onClick={() => onChange({ style: style.value })}
                className={`p-3 border rounded-lg text-left transition-all ${
                  widget.style === style.value
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-primary/10 mt-0.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-0.5">{style.label}</div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Images */}
      <div className="space-y-2">
        <Label>Max Images to Display</Label>
        <Input
          type="number"
          min={1}
          max={30}
          value={widget.maxImages || ''}
          placeholder="All images"
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value) : undefined;
            onChange({ maxImages: value });
          }}
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to show all images, or specify a limit (1-30)
        </p>
      </div>

      {/* Lightbox Settings */}
      <CollapsibleSection title="Lightbox" open={lightboxOpen} onToggle={() => setLightboxOpen(!lightboxOpen)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lightbox-enabled"
              checked={lightbox.enabled}
              onCheckedChange={(checked) => onChange({ lightbox: { ...lightbox, enabled: !!checked } })}
            />
            <Label htmlFor="lightbox-enabled" className="text-sm font-normal">Enable Lightbox</Label>
          </div>
          {lightbox.enabled && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lightbox-captions"
                checked={lightbox.showCaptions}
                onCheckedChange={(checked) => onChange({ lightbox: { ...lightbox, showCaptions: !!checked } })}
              />
              <Label htmlFor="lightbox-captions" className="text-sm font-normal">Show Captions</Label>
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  // Layout Tab
  const layoutTab = (
    <div className="space-y-2">
      {/* Columns - for Grid & Mosaic */}
      {(widget.style === 'grid' || widget.style === 'mosaic') && (
        <div className="space-y-2 p-3 border rounded-lg">
          <Label>Columns</Label>
          <Input
            type="number"
            min={1}
            max={6}
            value={widget.columns}
            onChange={(e) => onChange({ columns: parseInt(e.target.value) || 1 })}
          />
          <p className="text-xs text-muted-foreground">Number of columns (1-6)</p>
        </div>
      )}

      {/* Aspect Ratio - for Grid only */}
      {widget.style === 'grid' && (
        <div className="space-y-2 p-3 border rounded-lg">
          <Label>Aspect Ratio</Label>
          <Select
            value={widget.aspectRatio || '3:2'}
            onValueChange={(value) => onChange({ aspectRatio: value as GalleryAspectRatio })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASPECT_RATIOS.map((ratio) => (
                <SelectItem key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Gap */}
      <div className="space-y-2 p-3 border rounded-lg">
        <Label>Gap Between Images: {widget.gap}px</Label>
        <input
          type="range"
          min={0}
          max={40}
          value={widget.gap}
          onChange={(e) => onChange({ gap: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Section Height */}
      <CollapsibleSection title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
        <div className="flex gap-2">
          <Select
            value={layout.height.type || 'auto'}
            onValueChange={(value: 'auto' | 'vh' | 'pixels') => onChange({
              layout: { ...layout, height: { type: value, value: layout.height.value } }
            })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="vh">View Height</SelectItem>
              <SelectItem value="pixels">Pixels</SelectItem>
            </SelectContent>
          </Select>
          {layout.height.type !== 'auto' && (
            <Input
              type="number"
              value={layout.height.value || 100}
              onChange={(e) => onChange({
                layout: { ...layout, height: { ...layout.height, value: parseInt(e.target.value) || 100 } }
              })}
              className="w-24"
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Section Width */}
      <CollapsibleSection title="Section Width" open={sectionWidthOpen} onToggle={() => setSectionWidthOpen(!sectionWidthOpen)}>
        <Select
          value={layout.width || 'container'}
          onValueChange={(value: 'full' | 'container') => onChange({ layout: { ...layout, width: value } })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="container">Container</SelectItem>
            <SelectItem value="full">Full Width</SelectItem>
          </SelectContent>
        </Select>
      </CollapsibleSection>

      {/* Padding */}
      <CollapsibleSection title="Padding" open={paddingOpen} onToggle={() => setPaddingOpen(!paddingOpen)}>
        <div className="grid grid-cols-4 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              value={layout.padding.top || 40}
              onChange={(e) => onChange({
                layout: { ...layout, padding: { ...layout.padding, top: parseInt(e.target.value) || 0 } }
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={layout.padding.right || 20}
              onChange={(e) => onChange({
                layout: { ...layout, padding: { ...layout.padding, right: parseInt(e.target.value) || 0 } }
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={layout.padding.bottom || 40}
              onChange={(e) => onChange({
                layout: { ...layout, padding: { ...layout.padding, bottom: parseInt(e.target.value) || 0 } }
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={layout.padding.left || 20}
              onChange={(e) => onChange({
                layout: { ...layout, padding: { ...layout.padding, left: parseInt(e.target.value) || 0 } }
              })}
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Style Tab
  const styleTab = (
    <div className="space-y-2">
      {/* Background */}
      <CollapsibleSection title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={background.type || 'color'}
              onValueChange={(value: 'color' | 'image' | 'video' | 'gradient') => onChange({
                background: { ...background, type: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {background.type === 'color' && (
            <div className="space-y-2">
              <Label>Color</Label>
              <GlobalColorInput
                value={background.color}
                onChange={(nextColor) => onChange({ background: { ...background, color: nextColor } })}
                globalStyles={currentWebsite?.globalStyles}
                defaultColor="#ffffff"
                placeholder="transparent"
              />
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="image-gallery"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
