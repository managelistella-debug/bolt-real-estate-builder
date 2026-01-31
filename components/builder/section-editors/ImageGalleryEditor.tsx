'use client';

import { useAuthStore } from '@/lib/stores/auth';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { ImageGalleryWidget, GalleryStyle, GalleryAspectRatio } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BackgroundControl } from '@/components/builder/BackgroundControl';
import { ExternalLink, Grid3x3, LayoutGrid, Columns } from 'lucide-react';
import Link from 'next/link';

const GALLERY_STYLES: { value: GalleryStyle; label: string; description: string; icon: any }[] = [
  {
    value: 'grid',
    label: 'Grid Gallery',
    description: 'Uniform grid with fixed aspect ratio',
    icon: Grid3x3,
  },
  {
    value: 'mosaic',
    label: 'Mosaic Gallery',
    description: 'Dynamic masonry-style layout',
    icon: LayoutGrid,
  },
  {
    value: 'set-layout',
    label: 'Set Layout',
    description: 'Custom pattern layout',
    icon: Columns,
  },
];

const ASPECT_RATIOS: { value: GalleryAspectRatio; label: string }[] = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '3:2', label: 'Classic (3:2)' },
  { value: '4:5', label: 'Portrait (4:5)' },
  { value: '4:3', label: 'Standard (4:3)' },
];

interface ImageGalleryEditorProps {
  widget: ImageGalleryWidget;
  onChange: (updates: Partial<ImageGalleryWidget>) => void;
}

export function ImageGalleryEditor({ widget, onChange }: ImageGalleryEditorProps) {
  const { user } = useAuthStore();
  const { collections } = useImageCollectionsStore();

  const userCollections = collections.filter((c) => c.userId === user?.id);
  
  // Ensure lightbox and layout have default values for backward compatibility
  const lightbox = widget.lightbox || { enabled: true, showCaptions: true };
  const layout = widget.layout || {
    height: { type: 'auto' },
    width: 'container',
    padding: { top: 40, right: 20, bottom: 40, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  const background = widget.background || {
    type: 'color',
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };

  const selectedCollection = widget.collectionId
    ? collections.find((c) => c.id === widget.collectionId)
    : null;

  return (
    <div className="space-y-6 p-4">
      {/* Collection Selection */}
      <div className="space-y-3">
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
      <div className="space-y-3">
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

      {/* Layout Settings */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-sm">Layout Settings</h4>

        {/* Columns - for Grid & Mosaic only */}
        {(widget.style === 'grid' || widget.style === 'mosaic') && (
          <div className="space-y-2">
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
          <div className="space-y-2">
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

        {/* Max Images to Display */}
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

        {/* Gap */}
        <div className="space-y-2">
          <Label>Gap Between Images</Label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={40}
              value={widget.gap}
              onChange={(e) => onChange({ gap: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12 text-right">{widget.gap}px</span>
          </div>
        </div>
      </div>

      {/* Lightbox Settings */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-sm">Lightbox Settings</h4>

        <div className="flex items-center justify-between">
          <Label>Enable Lightbox</Label>
          <button
            onClick={() =>
              onChange({
                lightbox: { ...lightbox, enabled: !lightbox.enabled },
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              lightbox.enabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                lightbox.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {lightbox.enabled && (
          <div className="flex items-center justify-between">
            <Label>Show Captions</Label>
            <button
              onClick={() =>
                onChange({
                  lightbox: { ...lightbox, showCaptions: !lightbox.showCaptions },
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                lightbox.showCaptions ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  lightbox.showCaptions ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Background */}
      <div className="pt-4 border-t">
        <BackgroundControl
          value={background}
          onChange={(background) => onChange({ background })}
        />
      </div>

      {/* Section Layout */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-sm">Section Layout</h4>

        {/* Height */}
        <div className="space-y-2">
          <Label>Height</Label>
          <div className="flex gap-2">
            <Select
              value={layout.height.type || 'auto'}
              onValueChange={(value) =>
                onChange({
                  layout: {
                    ...layout,
                    height: {
                      type: value as any,
                      value: layout.height.value,
                    },
                  },
                })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="vh">VH</SelectItem>
                <SelectItem value="pixels">Pixels</SelectItem>
              </SelectContent>
            </Select>
            {layout.height.type !== 'auto' && (
              <Input
                type="number"
                value={layout.height.value || 100}
                onChange={(e) =>
                  onChange({
                    layout: {
                      ...layout,
                      height: {
                        ...layout.height,
                        value: parseInt(e.target.value) || 100,
                      },
                    },
                  })
                }
              />
            )}
          </div>
        </div>

        {/* Width */}
        <div className="space-y-2">
          <Label>Width</Label>
          <Select
            value={layout.width || 'container'}
            onValueChange={(value) =>
              onChange({
                layout: {
                  ...layout,
                  width: value as 'full' | 'container',
                },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width</SelectItem>
              <SelectItem value="container">Container</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Padding */}
        <div className="space-y-2">
          <Label>Padding (px)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Top"
              value={layout.padding.top || 0}
              onChange={(e) =>
                onChange({
                  layout: {
                    ...layout,
                    padding: {
                      ...layout.padding,
                      top: parseInt(e.target.value) || 0,
                    },
                  },
                })
              }
            />
            <Input
              type="number"
              placeholder="Right"
              value={layout.padding.right || 0}
              onChange={(e) =>
                onChange({
                  layout: {
                    ...layout,
                    padding: {
                      ...layout.padding,
                      right: parseInt(e.target.value) || 0,
                    },
                  },
                })
              }
            />
            <Input
              type="number"
              placeholder="Bottom"
              value={layout.padding.bottom || 0}
              onChange={(e) =>
                onChange({
                  layout: {
                    ...layout,
                    padding: {
                      ...layout.padding,
                      bottom: parseInt(e.target.value) || 0,
                    },
                  },
                })
              }
            />
            <Input
              type="number"
              placeholder="Left"
              value={layout.padding.left || 0}
              onChange={(e) =>
                onChange({
                  layout: {
                    ...layout,
                    padding: {
                      ...layout.padding,
                      left: parseInt(e.target.value) || 0,
                    },
                  },
                })
              }
            />
          </div>
        </div>

        {/* Margin */}
        <div className="space-y-2">
          <Label>Margin (px)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Top"
              value={layout.margin.top || 0}
              onChange={(e) =>
                onChange({
                  layout: {
                    ...layout,
                    margin: {
                      ...layout.margin,
                      top: parseInt(e.target.value) || 0,
                    },
                  },
                })
              }
            />
            <Input
              type="number"
              placeholder="Right"
              value={layout.margin.right || 0}
              onChange={(e) =>
                onChange({
                  layout: {
                    ...layout,
                    margin: {
                      ...layout.margin,
                      right: parseInt(e.target.value) || 0,
                    },
                  },
                })
              }
            />
            <Input
              type="number"
              placeholder="Bottom"
              value={layout.margin.bottom || 0}
              onChange={(e) =>
                onChange({
                  layout: {
                    ...layout,
                    margin: {
                      ...layout.margin,
                      bottom: parseInt(e.target.value) || 0,
                    },
                  },
                })
              }
            />
            <Input
              type="number"
              placeholder="Left"
              value={layout.margin.left || 0}
              onChange={(e) =>
                onChange({
                  layout: {
                    ...layout,
                    margin: {
                      ...layout.margin,
                      left: parseInt(e.target.value) || 0,
                    },
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
