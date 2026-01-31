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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Background Type</Label>
        <Select
          value={value.type || 'none'}
          onValueChange={(type: 'none' | 'color' | 'image' | 'video') => onChange({ ...value, type })}
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

      {value.type === 'color' && (
        <>
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.color || '#ffffff'}
                onChange={(e) => onChange({ ...value, color: e.target.value })}
                className="h-10 w-16 rounded border cursor-pointer"
              />
              <Input
                value={value.color || '#ffffff'}
                onChange={(e) => onChange({ ...value, color: e.target.value })}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Opacity: {value.opacity || 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={value.opacity || 100}
              onChange={(e) => onChange({ ...value, opacity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </>
      )}

      {value.type === 'image' && (
        <>
          <ImageUpload
            label="Background Image"
            value={value.url || ''}
            onChange={(url) => onChange({ ...value, url })}
            maxSizeMB={4}
          />

          <div className="space-y-2">
            <Label>Opacity: {value.opacity || 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={value.opacity || 100}
              onChange={(e) => onChange({ ...value, opacity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </>
      )}

      {value.type === 'video' && (
        <>
          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              value={value.url || ''}
              onChange={(e) => onChange({ ...value, url: e.target.value })}
              placeholder="https://youtube.com/... or https://cdn.com/video.mp4"
            />
            <p className="text-xs text-muted-foreground">
              Videos must be hosted externally (YouTube, CDN like bunny.net, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Opacity: {value.opacity || 100}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={value.opacity || 100}
              onChange={(e) => onChange({ ...value, opacity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
}
