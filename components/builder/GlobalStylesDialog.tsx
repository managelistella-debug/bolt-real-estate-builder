'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlobalStyles, FontPair, FontSizeValue } from '@/lib/types';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
      color: '#1f2937',
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={globalStyles.colors.primary}
                    onChange={(e) => onUpdate({ colors: { ...globalStyles.colors, primary: e.target.value } })}
                    className="h-10 w-full"
                  />
                  <Input
                    type="text"
                    value={globalStyles.colors.primary}
                    onChange={(e) => onUpdate({ colors: { ...globalStyles.colors, primary: e.target.value } })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <Label>Secondary Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={globalStyles.colors.secondary}
                    onChange={(e) => onUpdate({ colors: { ...globalStyles.colors, secondary: e.target.value } })}
                    className="h-10 w-full"
                  />
                  <Input
                    type="text"
                    value={globalStyles.colors.secondary}
                    onChange={(e) => onUpdate({ colors: { ...globalStyles.colors, secondary: e.target.value } })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <Label>Accent Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={globalStyles.colors.accent}
                    onChange={(e) => onUpdate({ colors: { ...globalStyles.colors, accent: e.target.value } })}
                    className="h-10 w-full"
                  />
                  <Input
                    type="text"
                    value={globalStyles.colors.accent}
                    onChange={(e) => onUpdate({ colors: { ...globalStyles.colors, accent: e.target.value } })}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Color Preview</p>
              <div className="flex gap-2">
                <div className="flex-1 h-20 rounded" style={{ backgroundColor: globalStyles.colors.primary }}></div>
                <div className="flex-1 h-20 rounded" style={{ backgroundColor: globalStyles.colors.secondary }}></div>
                <div className="flex-1 h-20 rounded" style={{ backgroundColor: globalStyles.colors.accent }}></div>
              </div>
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
                  headings: { ...headings, h1: { ...headings.h1, ...updates } }
                })}
                showGlobalStyleSelector={false}
              />

              {/* H2 */}
              <TypographyControl
                label="H2 - Section Headers"
                value={headings.h2}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h2: { ...headings.h2, ...updates } }
                })}
                showGlobalStyleSelector={false}
              />

              {/* H3 */}
              <TypographyControl
                label="H3 - Subheaders"
                value={headings.h3}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h3: { ...headings.h3, ...updates } }
                })}
                showGlobalStyleSelector={false}
              />

              {/* H4 */}
              <TypographyControl
                label="H4 - Small Headers"
                value={headings.h4}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h4: { ...headings.h4, ...updates } }
                })}
                showGlobalStyleSelector={false}
              />

              {/* H5 */}
              <TypographyControl
                label="H5 - Minor Headers"
                value={headings.h5}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h5: { ...headings.h5, ...updates } }
                })}
                showGlobalStyleSelector={false}
              />

              {/* H6 */}
              <TypographyControl
                label="H6 - Smallest Headers"
                value={headings.h6}
                onChange={(updates) => onUpdate({
                  headings: { ...headings, h6: { ...headings.h6, ...updates } }
                })}
                showGlobalStyleSelector={false}
              />

              {/* Body */}
              <TypographyControl
                label="Body Text"
                value={globalStyles.body}
                onChange={(updates) => onUpdate({
                  body: { ...globalStyles.body, ...updates }
                })}
                showGlobalStyleSelector={false}
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
