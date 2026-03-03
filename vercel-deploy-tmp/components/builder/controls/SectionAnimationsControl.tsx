'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Breakpoint,
  SectionAnimationSettings,
  SectionType,
  Widget,
  SectionAnimationElementSettings,
  TextEntranceAnimationType,
  ImageEntranceAnimationType,
  ImageHoverAnimationType,
} from '@/lib/types';
import {
  getAnimationElementDefinitions,
  getDefaultAnimationElementSettings,
  normalizeSectionAnimationSettings,
} from '@/lib/animations/sectionElementRegistry';
import { GlobalColorInput } from './GlobalColorInput';
import { ResponsiveDevicePicker } from './ResponsiveControlShell';
import { useBuilderStore } from '@/lib/stores/builder';
import { resolveResponsiveValue, updateResponsiveValue } from '@/lib/responsive';

interface SectionAnimationsControlProps {
  sectionType: SectionType;
  widget: Widget | Record<string, any>;
  onChange: (updates: { animationSettings: SectionAnimationSettings }) => void;
  globalStyles?: any;
}

const textEntranceOptions: Array<{ value: TextEntranceAnimationType; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'fadeInUp', label: 'Fade in and up' },
  { value: 'fadeIn', label: 'Fade in' },
];

const imageEntranceOptions: Array<{ value: ImageEntranceAnimationType; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'fadeIn', label: 'Fade in' },
  { value: 'curtainExpandReveal', label: 'Curtain expand reveal' },
  { value: 'fadeInZoomOut', label: 'Fade in and slow zoom out' },
];

const imageHoverOptions: Array<{ value: ImageHoverAnimationType; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'slowZoomIn', label: 'Slow zoom in' },
  { value: 'overlayFadeZoom', label: 'Fade to overlay and slight zoom' },
];

export function SectionAnimationsControl({ sectionType, widget, onChange, globalStyles }: SectionAnimationsControlProps) {
  const { deviceView } = useBuilderStore();
  const activeBreakpoint = deviceView as Breakpoint;
  const definitions = getAnimationElementDefinitions(sectionType, widget);
  const normalized = normalizeSectionAnimationSettings(sectionType, widget);

  if (definitions.length === 0) {
    return <p className="text-sm text-muted-foreground">No animatable elements found for this section.</p>;
  }

  const updateElement = (id: string, updates: Partial<SectionAnimationElementSettings>) => {
    const currentElements = normalized.elements || {};
    const definition = definitions.find((item) => item.id === id);
    if (!definition) return;

    const nextElements = {
      ...currentElements,
      [id]: {
        ...getDefaultAnimationElementSettings(definition.kind),
        ...(currentElements[id] || {}),
        ...updates,
        kind: definition.kind,
      },
    };

    onChange({
      animationSettings: {
        elements: nextElements,
      },
    });
  };

  const updateEntrance = (id: string, value: TextEntranceAnimationType | ImageEntranceAnimationType) => {
    const current = normalized.elements[id];
    if (!current) return;

    updateElement(id, {
      entrance: activeBreakpoint === 'desktop' ? value : current.entrance,
      entranceResponsive: updateResponsiveValue(current.entranceResponsive, activeBreakpoint, value),
    });
  };

  const updateImageHover = (id: string, value: ImageHoverAnimationType) => {
    const current = normalized.elements[id];
    if (!current) return;

    updateElement(id, {
      imageHover: activeBreakpoint === 'desktop' ? value : current.imageHover,
      imageHoverResponsive: updateResponsiveValue(current.imageHoverResponsive, activeBreakpoint, value),
    });
  };

  const updateOverlayColor = (id: string, value: string) => {
    const current = normalized.elements[id];
    if (!current) return;

    updateElement(id, {
      imageHoverOverlayColor: activeBreakpoint === 'desktop' ? value : current.imageHoverOverlayColor,
      imageHoverOverlayColorResponsive: updateResponsiveValue(
        current.imageHoverOverlayColorResponsive,
        activeBreakpoint,
        value,
      ),
    });
  };

  const updateOverlayOpacity = (id: string, value: number) => {
    const current = normalized.elements[id];
    if (!current) return;

    updateElement(id, {
      imageHoverOverlayOpacity: activeBreakpoint === 'desktop' ? value : current.imageHoverOverlayOpacity,
      imageHoverOverlayOpacityResponsive: updateResponsiveValue(
        current.imageHoverOverlayOpacityResponsive,
        activeBreakpoint,
        value,
      ),
    });
  };

  return (
    <div className="space-y-4">
      {definitions.map((definition) => {
        const settings = normalized.elements[definition.id] || getDefaultAnimationElementSettings(definition.kind);
        const isImage = definition.kind === 'image';
        const textEntrance = resolveResponsiveValue<TextEntranceAnimationType>(
          settings.entranceResponsive as any,
          activeBreakpoint,
          (settings.entrance || 'none') as TextEntranceAnimationType,
        );
        const imageEntrance = resolveResponsiveValue<ImageEntranceAnimationType>(
          settings.entranceResponsive as any,
          activeBreakpoint,
          (settings.entrance || 'none') as ImageEntranceAnimationType,
        );
        const imageHover = resolveResponsiveValue<ImageHoverAnimationType>(
          settings.imageHoverResponsive,
          activeBreakpoint,
          (settings.imageHover || 'none') as ImageHoverAnimationType,
        );
        const imageHoverOverlayColor = resolveResponsiveValue<string>(
          settings.imageHoverOverlayColorResponsive,
          activeBreakpoint,
          settings.imageHoverOverlayColor || '#000000',
        );
        const imageHoverOverlayOpacity = resolveResponsiveValue<number>(
          settings.imageHoverOverlayOpacityResponsive,
          activeBreakpoint,
          settings.imageHoverOverlayOpacity ?? 30,
        );
        const hasBreakpointOverride = Boolean(
          settings.entranceResponsive?.tablet ||
            settings.entranceResponsive?.mobile ||
            settings.imageHoverResponsive?.tablet ||
            settings.imageHoverResponsive?.mobile ||
            settings.imageHoverOverlayColorResponsive?.tablet ||
            settings.imageHoverOverlayColorResponsive?.mobile ||
            settings.imageHoverOverlayOpacityResponsive?.tablet ||
            settings.imageHoverOverlayOpacityResponsive?.mobile,
        );

        return (
          <div key={definition.id} className="rounded-md border p-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{definition.label}</p>
              <div title={hasBreakpointOverride ? 'Breakpoint override active' : 'Desktop base'}>
                <ResponsiveDevicePicker className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Entrance animation</Label>
              <Select
                value={isImage ? imageEntrance : textEntrance}
                onValueChange={(value) => updateEntrance(idFor(definition.id), value as SectionAnimationElementSettings['entrance'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entrance animation" />
                </SelectTrigger>
                <SelectContent>
                  {(isImage ? imageEntranceOptions : textEntranceOptions).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isImage && (
              <>
                <div className="space-y-2">
                  <Label>Hover animation</Label>
                  <Select
                    value={imageHover}
                    onValueChange={(value) => updateImageHover(idFor(definition.id), value as ImageHoverAnimationType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hover animation" />
                    </SelectTrigger>
                    <SelectContent>
                      {imageHoverOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {imageHover === 'overlayFadeZoom' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Overlay color</Label>
                      <GlobalColorInput
                        value={imageHoverOverlayColor}
                        onChange={(value) => updateOverlayColor(idFor(definition.id), value)}
                        globalStyles={globalStyles}
                        defaultColor="#000000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Overlay opacity: {imageHoverOverlayOpacity}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={imageHoverOverlayOpacity}
                        onChange={(event) =>
                          updateOverlayOpacity(idFor(definition.id), parseInt(event.target.value, 10))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function idFor(id: string): string {
  return id;
}
