'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlobalStyles, FontPair } from '@/lib/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

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
  const [h1Expanded, setH1Expanded] = useState(false);
  const [h2Expanded, setH2Expanded] = useState(false);
  const [h3Expanded, setH3Expanded] = useState(false);
  const [bodyExpanded, setBodyExpanded] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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

            <div className="space-y-2">
              {/* H1 Heading */}
              <div className="border rounded-lg">
                <button
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50"
                  onClick={() => setH1Expanded(!h1Expanded)}
                >
                  <span className="font-medium">H1 - Main Title (Hero)</span>
                  {h1Expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {h1Expanded && (
                  <div className="p-4 border-t space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Font Size</Label>
                        <Input
                          value={globalStyles.headings.h1.fontSize}
                          onChange={(e) => onUpdate({
                            headings: {
                              ...globalStyles.headings,
                              h1: { ...globalStyles.headings.h1, fontSize: e.target.value }
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Font Weight</Label>
                        <Select
                          value={globalStyles.headings.h1.fontWeight}
                          onValueChange={(value) => onUpdate({
                            headings: {
                              ...globalStyles.headings,
                              h1: { ...globalStyles.headings.h1, fontWeight: value }
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="400">Regular (400)</SelectItem>
                            <SelectItem value="500">Medium (500)</SelectItem>
                            <SelectItem value="600">Semibold (600)</SelectItem>
                            <SelectItem value="700">Bold (700)</SelectItem>
                            <SelectItem value="800">Extra Bold (800)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Used for: Hero section main titles
                    </div>
                  </div>
                )}
              </div>

              {/* H2 Heading */}
              <div className="border rounded-lg">
                <button
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50"
                  onClick={() => setH2Expanded(!h2Expanded)}
                >
                  <span className="font-medium">H2 - Section Headers</span>
                  {h2Expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {h2Expanded && (
                  <div className="p-4 border-t space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Font Size</Label>
                        <Input
                          value={globalStyles.headings.h2.fontSize}
                          onChange={(e) => onUpdate({
                            headings: {
                              ...globalStyles.headings,
                              h2: { ...globalStyles.headings.h2, fontSize: e.target.value }
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Font Weight</Label>
                        <Select
                          value={globalStyles.headings.h2.fontWeight}
                          onValueChange={(value) => onUpdate({
                            headings: {
                              ...globalStyles.headings,
                              h2: { ...globalStyles.headings.h2, fontWeight: value }
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="400">Regular (400)</SelectItem>
                            <SelectItem value="500">Medium (500)</SelectItem>
                            <SelectItem value="600">Semibold (600)</SelectItem>
                            <SelectItem value="700">Bold (700)</SelectItem>
                            <SelectItem value="800">Extra Bold (800)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Used for: Main headers in all sections (default)
                    </div>
                  </div>
                )}
              </div>

              {/* H3 Heading */}
              <div className="border rounded-lg">
                <button
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50"
                  onClick={() => setH3Expanded(!h3Expanded)}
                >
                  <span className="font-medium">H3 - Subheaders</span>
                  {h3Expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {h3Expanded && (
                  <div className="p-4 border-t space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Font Size</Label>
                        <Input
                          value={globalStyles.headings.h3.fontSize}
                          onChange={(e) => onUpdate({
                            headings: {
                              ...globalStyles.headings,
                              h3: { ...globalStyles.headings.h3, fontSize: e.target.value }
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Font Weight</Label>
                        <Select
                          value={globalStyles.headings.h3.fontWeight}
                          onValueChange={(value) => onUpdate({
                            headings: {
                              ...globalStyles.headings,
                              h3: { ...globalStyles.headings.h3, fontWeight: value }
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="400">Regular (400)</SelectItem>
                            <SelectItem value="500">Medium (500)</SelectItem>
                            <SelectItem value="600">Semibold (600)</SelectItem>
                            <SelectItem value="700">Bold (700)</SelectItem>
                            <SelectItem value="800">Extra Bold (800)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Used for: Subheaders within sections
                    </div>
                  </div>
                )}
              </div>

              {/* Body Text */}
              <div className="border rounded-lg">
                <button
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50"
                  onClick={() => setBodyExpanded(!bodyExpanded)}
                >
                  <span className="font-medium">Body Text</span>
                  {bodyExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {bodyExpanded && (
                  <div className="p-4 border-t space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Font Size</Label>
                        <Input
                          value={globalStyles.body.fontSize}
                          onChange={(e) => onUpdate({
                            body: { ...globalStyles.body, fontSize: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Font Weight</Label>
                        <Select
                          value={globalStyles.body.fontWeight}
                          onValueChange={(value) => onUpdate({
                            body: { ...globalStyles.body, fontWeight: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="400">Regular (400)</SelectItem>
                            <SelectItem value="500">Medium (500)</SelectItem>
                            <SelectItem value="600">Semibold (600)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Used for: Paragraphs and body content
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="space-y-4 pt-4">
            <div>
              <Label>Button Variant</Label>
              <Select
                value={globalStyles.button.variant}
                onValueChange={(value: 'solid' | 'outline' | 'ghost') => onUpdate({
                  button: { ...globalStyles.button, variant: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Button Roundness</Label>
              <Select
                value={globalStyles.button.rounded}
                onValueChange={(value: 'none' | 'sm' | 'md' | 'lg' | 'full') => onUpdate({
                  button: { ...globalStyles.button, rounded: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Square)</SelectItem>
                  <SelectItem value="sm">Small (4px)</SelectItem>
                  <SelectItem value="md">Medium (8px)</SelectItem>
                  <SelectItem value="lg">Large (12px)</SelectItem>
                  <SelectItem value="full">Full (Pill)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-3">Button Preview</p>
              <div className="flex gap-3 flex-wrap">
                <Button
                  className={`
                    ${globalStyles.button.variant === 'solid' ? 'bg-primary text-white' : ''}
                    ${globalStyles.button.variant === 'outline' ? 'border-2 border-primary bg-transparent text-primary' : ''}
                    ${globalStyles.button.variant === 'ghost' ? 'bg-transparent text-primary' : ''}
                    ${globalStyles.button.rounded === 'none' ? 'rounded-none' : ''}
                    ${globalStyles.button.rounded === 'sm' ? 'rounded-sm' : ''}
                    ${globalStyles.button.rounded === 'md' ? 'rounded-md' : ''}
                    ${globalStyles.button.rounded === 'lg' ? 'rounded-lg' : ''}
                    ${globalStyles.button.rounded === 'full' ? 'rounded-full' : ''}
                  `}
                  style={{ 
                    backgroundColor: globalStyles.button.variant === 'solid' ? globalStyles.colors.primary : 'transparent',
                    borderColor: globalStyles.button.variant !== 'solid' ? globalStyles.colors.primary : undefined,
                    color: globalStyles.button.variant === 'solid' ? '#ffffff' : globalStyles.colors.primary,
                  }}
                >
                  Primary Button
                </Button>
                <Button
                  className={`
                    ${globalStyles.button.variant === 'solid' ? 'bg-secondary text-white' : ''}
                    ${globalStyles.button.variant === 'outline' ? 'border-2 border-secondary bg-transparent text-secondary' : ''}
                    ${globalStyles.button.variant === 'ghost' ? 'bg-transparent text-secondary' : ''}
                    ${globalStyles.button.rounded === 'none' ? 'rounded-none' : ''}
                    ${globalStyles.button.rounded === 'sm' ? 'rounded-sm' : ''}
                    ${globalStyles.button.rounded === 'md' ? 'rounded-md' : ''}
                    ${globalStyles.button.rounded === 'lg' ? 'rounded-lg' : ''}
                    ${globalStyles.button.rounded === 'full' ? 'rounded-full' : ''}
                  `}
                  style={{ 
                    backgroundColor: globalStyles.button.variant === 'solid' ? globalStyles.colors.secondary : 'transparent',
                    borderColor: globalStyles.button.variant !== 'solid' ? globalStyles.colors.secondary : undefined,
                    color: globalStyles.button.variant === 'solid' ? '#ffffff' : globalStyles.colors.secondary,
                  }}
                >
                  Secondary Button
                </Button>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              <strong>Note:</strong> These button styles will be applied by default to all buttons in sections. You can still override them individually in each section's editor.
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
