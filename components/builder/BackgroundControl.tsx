'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from './ImageUpload';

interface BackgroundConfig {
  type?: 'none' | 'color' | 'image' | 'video';
  color?: string;
  url?: string;
  opacity?: number;
}

interface BackgroundControlProps {
  value: BackgroundConfig;
  onChange: (value: BackgroundConfig) => void;
  allowNone?: boolean;
}

export function BackgroundControl({ value, onChange, allowNone = true }: BackgroundControlProps) {
  // Ensure value has defaults
  const bgValue = value || { type: 'none' };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Background Type</Label>
        <Select
          value={bgValue.type || 'none'}
          onValueChange={(type: 'none' | 'color' | 'image' | 'video') => onChange({ ...bgValue, type })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allowNone && <SelectItem value="none">None (Transparent)</SelectItem>}
            <SelectItem value="color">Color</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {bgValue.type === 'color' && (
        <>
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgValue.color || '#ffffff'}
                onChange={(e) => onChange({ ...bgValue, color: e.target.value })}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <Input
                value={bgValue.color || '#ffffff'}
                onChange={(e) => onChange({ ...bgValue, color: e.target.value })}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Opacity: {bgValue.opacity || 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={bgValue.opacity || 100}
              onChange={(e) => onChange({ ...bgValue, opacity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </>
      )}

      {bgValue.type === 'image' && (
        <>
          <ImageUpload
            label="Background Image"
            value={bgValue.url || ''}
            onChange={(url) => onChange({ ...bgValue, url })}
            maxSizeMB={1}
          />

          <div className="space-y-2">
            <Label>Opacity: {bgValue.opacity || 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={bgValue.opacity || 100}
              onChange={(e) => onChange({ ...bgValue, opacity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </>
      )}

      {bgValue.type === 'video' && (
        <>
          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              value={bgValue.url || ''}
              onChange={(e) => onChange({ ...bgValue, url: e.target.value })}
              placeholder="https://youtube.com/... or https://cdn.com/video.mp4"
            />
            <p className="text-xs text-muted-foreground">
              Videos must be hosted externally (YouTube, CDN like bunny.net, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Opacity: {bgValue.opacity || 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={bgValue.opacity || 100}
              onChange={(e) => onChange({ ...bgValue, opacity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
}
