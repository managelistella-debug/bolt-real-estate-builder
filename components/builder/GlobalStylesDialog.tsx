'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlobalStyles, FontPair, FontSizeValue } from '@/lib/types';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { TypographyControl } from './controls/TypographyControl';
import { ButtonControl } from './controls/ButtonControl';

interface GlobalStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  globalStyles: GlobalStyles;
  onUpdate: (styles: Partial<GlobalStyles>) => void;
}

// Popular font pairings
const FONT_PAIRS: FontPair[] = [
  { id: 'inter-inter', name: 'Inter', heading: 'Inter', body: 'Inter' },
  { id: 'playfair-source', name: 'Playfair Display + Source Sans', heading: 'Playfair Display', body: 'Source Sans Pro' },
  { id: 'montserrat-open', name: 'Montserrat + Open Sans', heading: 'Montserrat', body: 'Open Sans' },
  { id: 'roboto-roboto', name: 'Roboto', heading: 'Roboto', body: 'Roboto' },
  { id: 'lora-lato', name: 'Lora + Lato', heading: 'Lora', body: 'Lato' },
  { id: 'poppins-poppins', name: 'Poppins', heading: 'Poppins', body: 'Poppins' },
  { id: 'merriweather-sans', name: 'Merriweather + Open Sans', heading: 'Merriweather', body: 'Open Sans' },
];

export function GlobalStylesDialog({ open, onOpenChange, globalStyles, onUpdate }: GlobalStylesDialogProps) {
  const [activeTab, setActiveTab] = useState('colors');
  const [button1Expanded, setButton1Expanded] = useState(true);
  const [button2Expanded, setButton2Expanded] = useState(false);

  // Ensure buttons structure exists
  const ensureButtons = () => {
    if (!globalStyles.buttons) {
      return {
        button1: createDefaultButton(),
        button2: createDefaultButton('#10b981', '#ffffff'),
      };
    }
    return globalStyles.buttons;
  };

  const createDefaultButton = (bgColor = '#3b82f6', textColor = '#ffffff') => ({
    width: 'standard' as const,
    backgroundColor: bgColor,
    textColor: textColor,
    borderRadius: 42,
    borderWidth: 0,
    backgroundOpacity: 100,
    dropShadow: true,
    shadowAmount: 4,
    blurEffect: 0,
    fontFamily: 'Inter',
    fontSize: { value: 16, unit: 'px' as const } as FontSizeValue,
    fontWeight: '600',
    lineHeight: '1.5',
    textTransform: 'none' as const,
    hover: {
      backgroundOpacity: 90,
    },
  });

  // Ensure all headings exist (H1-H6)
  const ensureHeadings = () => {
    const defaultHeading = (size: number, weight: string) => ({
      fontFamily: globalStyles.fontPair.heading,
      fontSize: { value: size, unit: 'px' as const } as FontSizeValue,
      fontWeight: weight,
      lineHeight: '1.2',
      textTransform: 'none' as const,
    });

    return {
      h1: globalStyles.headings.h1 || defaultHeading(48, '700'),
      h2: globalStyles.headings.h2 || defaultHeading(36, '700'),
      h3: globalStyles.headings.h3 || defaultHeading(30, '600'),
      h4: globalStyles.headings.h4 || defaultHeading(24, '600'),
      h5: globalStyles.headings.h5 || defaultHeading(20, '600'),
      h6: globalStyles.headings.h6 || defaultHeading(18, '600'),
    };
  };

  const buttons = ensureButtons();
  const headings = ensureHeadings();
  const removeTypographyColor = (updates: any) => {
    const { color, ...rest } = updates || {};
    return rest;
  };
  const colorLabels = {
    primary: globalStyles.colorLabels?.primary || 'Primary',
    secondary: globalStyles.colorLabels?.secondary || 'Secondary',
    accent: globalStyles.colorLabels?.accent || 'Accent',
  };
  const customColors = globalStyles.customColors || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Global Styles</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Set default styles that apply across all sections. Can be overridden per section.
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4 pt-4">
            <div className="space-y-3">
              {(['primary', 'secondary', 'accent'] as const).map((colorId) => (
                <div key={colorId} className="grid grid-cols-[1fr_120px_1fr] gap-2 items-center">
                  <Input
                    value={colorLabels[colorId]}
                    onChange={(e) =>
                      onUpdate({
                        colorLabels: {
                          ...globalStyles.colorLabels,
                          [colorId]: e.target.value,
                        },
                      })
                    }
                    placeholder={`${colorId} label`}
                  />
                  <Input
                    type="color"
                    value={globalStyles.colors[colorId]}
                    onChange={(e) =>
                      onUpdate({
                        colors: {
                          ...globalStyles.colors,
                          [colorId]: e.target.value,
                        },
                      })
                    }
                    className="h-10 w-full"
                  />
                  <Input
                    value={globalStyles.colors[colorId]}
                    onChange={(e) =>
                      onUpdate({
                        colors: {
                          ...globalStyles.colors,
                          [colorId]: e.target.value,
                        },
                      })
                    }
                    className="font-mono text-xs"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Custom Global Colors</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const id = `color-${Date.now()}`;
                    onUpdate({
                      customColors: [
                        ...customColors,
                        { id, name: 'New Color', value: '#000000' },
                      ],
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {customColors.map((customColor) => (
                <div key={customColor.id} className="grid grid-cols-[1fr_120px_1fr_auto] gap-2 items-center">
                  <Input
                    value={customColor.name}
                    onChange={(e) =>
                      onUpdate({
                        customColors: customColors.map((c) =>
                          c.id === customColor.id ? { ...c, name: e.target.value } : c
                        ),
                      })
                    }
                    placeholder="Color name"
                  />
                  <Input
                    type="color"
                    value={customColor.value}
                    onChange={(e) =>
                      onUpdate({
                        customColors: customColors.map((c) =>
                          c.id === customColor.id ? { ...c, value: e.target.value } : c
                        ),
                      })
                    }
                    className="h-10 w-full"
                  />
                  <Input
                    value={customColor.value}
                    onChange={(e) =>
                      onUpdate({
                        customColors: customColors.map((c) =>
                          c.id === customColor.id ? { ...c, value: e.target.value } : c
                        ),
                      })
                    }
                    className="font-mono text-xs"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      onUpdate({
                        customColors: customColors.filter((c) => c.id !== customColor.id),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Color Preview</p>
              <div className="flex gap-2">
                <div className="flex-1 h-20 rounded" style={{ backgroundColor: globalStyles.colors.primary }}></div>
                <div className="flex-1 h-20 rounded" style={{ backgroundColor: globalStyles.colors.secondary }}></div>
                <div className="flex-1 h-20 rounded" style={{ backgroundColor: globalStyles.colors.accent }}></div>
              </div>
              {customColors.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {customColors.map((c) => (
                    <div key={c.id} className="h-10 rounded border" style={{ backgroundColor: c.value }} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4 pt-4">
            {/* Font Pair Selection */}
            <div>
              <Label>Font Pair</Label>
              <Select
                value={globalStyles.fontPair.id}
                onValueChange={(value) => {
                  const pair = FONT_PAIRS.find(p => p.id === value);
                  if (pair) onUpdate({ fontPair: pair });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_PAIRS.map((pair) => (
                    <SelectItem key={pair.id} value={pair.id}>
                      {pair.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Heading: {globalStyles.fontPair.heading} • Body: {globalStyles.fontPair.body}
              </p>
            </div>

            <div className="space-y-3">
              {/* H1 */}
              <TypographyControl
                label="H1 - Main Title (Hero)"
                value={headings.h1}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h1: { ...headings.h1, ...removeTypographyColor(updates) } }
                })}
                showGlobalStyleSelector={false}
                showColorControl={false}
              />

              {/* H2 */}
              <TypographyControl
                label="H2 - Section Headers"
                value={headings.h2}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h2: { ...headings.h2, ...removeTypographyColor(updates) } }
                })}
                showGlobalStyleSelector={false}
                showColorControl={false}
              />

              {/* H3 */}
              <TypographyControl
                label="H3 - Subheaders"
                value={headings.h3}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h3: { ...headings.h3, ...removeTypographyColor(updates) } }
                })}
                showGlobalStyleSelector={false}
                showColorControl={false}
              />

              {/* H4 */}
              <TypographyControl
                label="H4 - Small Headers"
                value={headings.h4}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h4: { ...headings.h4, ...removeTypographyColor(updates) } }
                })}
                showGlobalStyleSelector={false}
                showColorControl={false}
              />

              {/* H5 */}
              <TypographyControl
                label="H5 - Minor Headers"
                value={headings.h5}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h5: { ...headings.h5, ...removeTypographyColor(updates) } }
                })}
                showGlobalStyleSelector={false}
                showColorControl={false}
              />

              {/* H6 */}
              <TypographyControl
                label="H6 - Smallest Headers"
                value={headings.h6}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h6: { ...headings.h6, ...removeTypographyColor(updates) } }
                })}
                showGlobalStyleSelector={false}
                showColorControl={false}
              />

              {/* Body */}
              <TypographyControl
                label="Body Text"
                value={globalStyles.body}
                onChange={(updates) => onUpdate({
                  body: { ...globalStyles.body, ...removeTypographyColor(updates) }
                })}
                showGlobalStyleSelector={false}
                showColorControl={false}
              />
            </div>
          </TabsContent>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Create two button presets that can be used across all sections.
            </p>

            {/* Button Style 1 */}
            <div className="border rounded-lg">
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                onClick={() => setButton1Expanded(!button1Expanded)}
              >
                <span className="font-medium">Button Style 1</span>
                {button1Expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {button1Expanded && (
                <div className="p-4 border-t">
                  <ButtonControl
                    value={buttons.button1}
                    onChange={(updates) => onUpdate({
                      buttons: { ...buttons, button1: { ...buttons.button1, ...updates } }
                    })}
                    showGlobalStyleSelector={false}
                  />
                </div>
              )}
            </div>

            {/* Button Style 2 */}
            <div className="border rounded-lg">
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                onClick={() => setButton2Expanded(!button2Expanded)}
              >
                <span className="font-medium">Button Style 2</span>
                {button2Expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {button2Expanded && (
                <div className="p-4 border-t">
                  <ButtonControl
                    value={buttons.button2}
                    onChange={(updates) => onUpdate({
                      buttons: { ...buttons, button2: { ...buttons.button2, ...updates } }
                    })}
                    showGlobalStyleSelector={false}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
