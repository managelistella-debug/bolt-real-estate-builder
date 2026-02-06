'use client';

import { useState } from 'react';
import { TextSectionWidget } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, fontSizeToCSS, type FontSizeValue } from '../FontSizeInput';
import { cn } from '@/lib/utils';
import { useDebouncedInput } from '../hooks/useDebouncedInput';

interface TextSectionEditorNewProps {
  widget: TextSectionWidget;
  onChange: (updates: Partial<TextSectionWidget>) => void;
}

export function TextSectionEditorNew({ widget, onChange }: TextSectionEditorNewProps) {
  // Debounced inputs for smooth typing
  const [headingValue, , headingChange, headingBlur] = useDebouncedInput(
    widget.heading,
    (value) => onChange({ heading: value })
  );
  
  const [bodyValue, , bodyChange, bodyBlur] = useDebouncedInput(
    widget.bodyText,
    (value) => onChange({ bodyText: value })
  );

  // Collapsible states
  const [buttonOpen, setButtonOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [layoutTypeOpen, setLayoutTypeOpen] = useState(false);
  const [alignmentOpen, setAlignmentOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [headingStyleOpen, setHeadingStyleOpen] = useState(false);
  const [subheaderStyleOpen, setSubheaderStyleOpen] = useState(false);
  const [bodyStyleOpen, setBodyStyleOpen] = useState(false);
  const [buttonStyleOpen, setButtonStyleOpen] = useState(false);

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

  // Get layout config with defaults
  const defaultLayout = {
    height: { type: 'auto' as const },
    width: 'container' as const,
    padding: { top: 80, right: 20, bottom: 80, left: 20 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  
  const layoutCfg = (widget.layout && typeof widget.layout === 'object' && 'height' in widget.layout)
    ? {
        height: widget.layout.height || defaultLayout.height,
        width: widget.layout.width || defaultLayout.width,
        padding: widget.layout.padding || defaultLayout.padding,
        margin: widget.layout.margin || defaultLayout.margin,
      }
    : defaultLayout;

  const buttonStyle = widget.buttonStyle || {
    backgroundColor: '#10b981',
    backgroundOpacity: 100,
    textColor: '#ffffff',
    borderRadius: 8,
    blur: 0,
    shadow: true,
    borderWidth: 0,
    borderColor: '#000000',
  };

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Heading */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Heading</Label>
          <Select
            value={(widget as any).headingHeaderTag || 'h2'}
            onValueChange={(value: any) => onChange({ headingHeaderTag: value } as any)}
          >
            <SelectTrigger className="w-20 h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h1">H1</SelectItem>
              <SelectItem value="h2">H2</SelectItem>
              <SelectItem value="h3">H3</SelectItem>
              <SelectItem value="h4">H4</SelectItem>
              <SelectItem value="p">P</SelectItem>
              <SelectItem value="div">Div</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          value={headingValue}
          onChange={headingChange}
          onBlur={headingBlur}
          placeholder="Enter your heading..."
          rows={2}
        />
      </div>

      {/* Subheader (Tagline) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Subheader (Optional)</Label>
          <Select
            value={(widget as any).taglineHeaderTag || 'p'}
            onValueChange={(value: any) => onChange({ taglineHeaderTag: value } as any)}
          >
            <SelectTrigger className="w-20 h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">P</SelectItem>
              <SelectItem value="h3">H3</SelectItem>
              <SelectItem value="h4">H4</SelectItem>
              <SelectItem value="div">Div</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          value={widget.tagline || ''}
          onChange={(e) => onChange({ tagline: e.target.value })}
          placeholder="e.g., LOCAL. RELIABLE. PROFESSIONAL."
        />
      </div>

      {/* Body Text */}
      <div className="space-y-2">
        <Label>Body Text</Label>
        <Textarea
          value={bodyValue}
          onChange={bodyChange}
          onBlur={bodyBlur}
          placeholder="Enter your body text..."
          rows={5}
        />
      </div>

      {/* Button Collapsible */}
      <CollapsibleSection title="Button" open={buttonOpen} onToggle={() => setButtonOpen(!buttonOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={widget.buttonText || ''}
              onChange={(e) => onChange({ buttonText: e.target.value })}
              placeholder="e.g., Get in Touch"
            />
            <p className="text-xs text-muted-foreground">Leave empty to hide the button</p>
          </div>
          {widget.buttonText && widget.buttonText.trim() !== '' && (
            <div className="space-y-2">
              <Label>Button URL</Label>
              <Input
                value={widget.buttonUrl || ''}
                onChange={(e) => onChange({ buttonUrl: e.target.value })}
                placeholder="/contact"
              />
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  // Layout Tab
  const layoutTab = (
    <div className="space-y-2">
      {/* Section Height */}
      <CollapsibleSection title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
        <div className="flex gap-2">
          <Select
            value={layoutCfg.height.type || 'auto'}
            onValueChange={(value: 'auto' | 'vh' | 'percentage' | 'pixels') => onChange({
              layout: {
                ...layoutCfg,
                height: { ...layoutCfg.height, type: value }
              } as any
            })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="vh">View Height</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="pixels">Pixels</SelectItem>
            </SelectContent>
          </Select>
          {layoutCfg.height.type !== 'auto' && (
            <Input
              type="number"
              value={layoutCfg.height.value || 100}
              onChange={(e) => onChange({
                layout: {
                  ...layoutCfg,
                  height: { ...layoutCfg.height, value: parseInt(e.target.value) }
                } as any
              })}
              className="w-24"
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Section Width */}
      <CollapsibleSection title="Section Width" open={sectionWidthOpen} onToggle={() => setSectionWidthOpen(!sectionWidthOpen)}>
        <Select
          value={layoutCfg.width || 'container'}
          onValueChange={(value: 'full' | 'container') => onChange({
            layout: { ...layoutCfg, width: value } as any
          })}
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
              value={layoutCfg.padding.top || 80}
              onChange={(e) => onChange({
                layout: {
                  ...layoutCfg,
                  padding: { ...layoutCfg.padding, top: parseInt(e.target.value) }
                } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={layoutCfg.padding.right || 20}
              onChange={(e) => onChange({
                layout: {
                  ...layoutCfg,
                  padding: { ...layoutCfg.padding, right: parseInt(e.target.value) }
                } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={layoutCfg.padding.bottom || 80}
              onChange={(e) => onChange({
                layout: {
                  ...layoutCfg,
                  padding: { ...layoutCfg.padding, bottom: parseInt(e.target.value) }
                } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={layoutCfg.padding.left || 20}
              onChange={(e) => onChange({
                layout: {
                  ...layoutCfg,
                  padding: { ...layoutCfg.padding, left: parseInt(e.target.value) }
                } as any
              })}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Layout Type */}
      <CollapsibleSection title="Layout Type" open={layoutTypeOpen} onToggle={() => setLayoutTypeOpen(!layoutTypeOpen)}>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={widget.layout === 'side-by-side' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ layout: 'side-by-side' })}
            className="flex-col h-auto py-3"
          >
            <div className="font-medium text-xs">Side by Side</div>
            <div className="text-xs opacity-70 mt-1">Heading left, text right</div>
          </Button>
          <Button
            variant={widget.layout === 'stacked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ layout: 'stacked' })}
            className="flex-col h-auto py-3"
          >
            <div className="font-medium text-xs">Stacked</div>
            <div className="text-xs opacity-70 mt-1">Heading above text</div>
          </Button>
        </div>

        {widget.layout === 'side-by-side' && (
          <div className="space-y-3 mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reverse-order"
                checked={widget.reverseOrder || false}
                onCheckedChange={(checked) => onChange({ reverseOrder: !!checked })}
              />
              <Label htmlFor="reverse-order" className="text-sm font-normal">Reverse Order</Label>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Column Gap: {widget.columnGap ?? 60}px</Label>
              <input
                type="range"
                min="0"
                max="80"
                value={widget.columnGap ?? 60}
                onChange={(e) => onChange({ columnGap: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Heading Width: {widget.headingColumnWidth ?? 40}%</Label>
              <input
                type="range"
                min="30"
                max="70"
                value={widget.headingColumnWidth ?? 40}
                onChange={(e) => onChange({ headingColumnWidth: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {widget.layout === 'stacked' && (
          <div className="space-y-2 mt-3">
            <Label className="text-xs">Row Gap: {widget.rowGap ?? 24}px</Label>
            <input
              type="range"
              min="0"
              max="60"
              value={widget.rowGap ?? 24}
              onChange={(e) => onChange({ rowGap: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        )}
      </CollapsibleSection>

      {/* Alignment */}
      <CollapsibleSection title="Alignment" open={alignmentOpen} onToggle={() => setAlignmentOpen(!alignmentOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Heading Alignment</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={widget.headingAlignment === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ headingAlignment: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={widget.headingAlignment === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ headingAlignment: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={widget.headingAlignment === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ headingAlignment: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Body Alignment</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={widget.bodyAlignment === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ bodyAlignment: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={widget.bodyAlignment === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ bodyAlignment: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={widget.bodyAlignment === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ bodyAlignment: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Style Tab
  const styleTab = (
    <div className="space-y-2">
      {/* Typography */}
      <CollapsibleSection title="Typography" open={typographyOpen} onToggle={() => setTypographyOpen(!typographyOpen)}>
        <div className="space-y-3">
          {/* Heading Styles */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setHeadingStyleOpen(!headingStyleOpen)}
            >
              <span className="text-sm font-medium">Heading</span>
              {headingStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {headingStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Family</Label>
                  <Select
                    value={(widget as any).headingFontFamily || 'Inter'}
                    onValueChange={(value) => onChange({ headingFontFamily: value } as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={widget.headingSize ?? 48}
                    onChange={(value: FontSizeValue) => onChange({ headingSize: value.value } as any)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Weight</Label>
                  <Select
                    value={String((widget as any).headingWeight || 700)}
                    onValueChange={(value) => onChange({ headingWeight: parseInt(value) } as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                      <SelectItem value="800">Extra Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Line Height</Label>
                  <Input
                    value={(widget as any).headingLineHeight || '1.2'}
                    onChange={(e) => onChange({ headingLineHeight: e.target.value } as any)}
                    placeholder="1.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Text Transform</Label>
                  <Select
                    value={(widget as any).headingTextTransform || 'none'}
                    onValueChange={(value) => onChange({ headingTextTransform: value } as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Normal</SelectItem>
                      <SelectItem value="uppercase">All Caps</SelectItem>
                      <SelectItem value="capitalize">Capitalize</SelectItem>
                      <SelectItem value="lowercase">Lowercase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.headingColor || '#1f2937'}
                      onChange={(e) => onChange({ headingColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.headingColor || '#1f2937'}
                      onChange={(e) => onChange({ headingColor: e.target.value })}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subheader Styles */}
          {widget.tagline && (
            <div className="border rounded-lg">
              <button
                type="button"
                className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
                onClick={() => setSubheaderStyleOpen(!subheaderStyleOpen)}
              >
                <span className="text-sm font-medium">Subheader</span>
                {subheaderStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
              {subheaderStyleOpen && (
                <div className="p-3 pt-0 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Font Family</Label>
                    <Select
                      value={(widget as any).taglineFontFamily || 'Inter'}
                      onValueChange={(value) => onChange({ taglineFontFamily: value } as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Font Size</Label>
                    <FontSizeInput
                      value={widget.taglineSize ?? 14}
                      onChange={(value: FontSizeValue) => onChange({ taglineSize: value.value } as any)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Font Weight</Label>
                    <Select
                      value={String((widget as any).taglineWeight || 600)}
                      onValueChange={(value) => onChange({ taglineWeight: parseInt(value) } as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="400">Regular</SelectItem>
                        <SelectItem value="500">Medium</SelectItem>
                        <SelectItem value="600">Semibold</SelectItem>
                        <SelectItem value="700">Bold</SelectItem>
                        <SelectItem value="800">Extra Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Line Height</Label>
                    <Input
                      value={(widget as any).taglineLineHeight || '1.4'}
                      onChange={(e) => onChange({ taglineLineHeight: e.target.value } as any)}
                      placeholder="1.4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Text Transform</Label>
                    <Select
                      value={(widget as any).taglineTextTransform || 'uppercase'}
                      onValueChange={(value) => onChange({ taglineTextTransform: value } as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Normal</SelectItem>
                        <SelectItem value="uppercase">All Caps</SelectItem>
                        <SelectItem value="capitalize">Capitalize</SelectItem>
                        <SelectItem value="lowercase">Lowercase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={widget.taglineColor || '#10b981'}
                        onChange={(e) => onChange({ taglineColor: e.target.value })}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <Input
                        value={widget.taglineColor || '#10b981'}
                        onChange={(e) => onChange({ taglineColor: e.target.value })}
                        placeholder="#10b981"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Body Styles */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setBodyStyleOpen(!bodyStyleOpen)}
            >
              <span className="text-sm font-medium">Body Text</span>
              {bodyStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {bodyStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Family</Label>
                  <Select
                    value={(widget as any).bodyFontFamily || 'Inter'}
                    onValueChange={(value) => onChange({ bodyFontFamily: value } as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={widget.bodySize ?? 16}
                    onChange={(value: FontSizeValue) => onChange({ bodySize: value.value } as any)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Weight</Label>
                  <Select
                    value={String((widget as any).bodyWeight || 400)}
                    onValueChange={(value) => onChange({ bodyWeight: parseInt(value) } as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Line Height</Label>
                  <Input
                    value={(widget as any).bodyLineHeight || '1.6'}
                    onChange={(e) => onChange({ bodyLineHeight: e.target.value } as any)}
                    placeholder="1.6"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Text Transform</Label>
                  <Select
                    value={(widget as any).bodyTextTransform || 'none'}
                    onValueChange={(value) => onChange({ bodyTextTransform: value } as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Normal</SelectItem>
                      <SelectItem value="uppercase">All Caps</SelectItem>
                      <SelectItem value="capitalize">Capitalize</SelectItem>
                      <SelectItem value="lowercase">Lowercase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.bodyTextColor || '#6b7280'}
                      onChange={(e) => onChange({ bodyTextColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.bodyTextColor || '#6b7280'}
                      onChange={(e) => onChange({ bodyTextColor: e.target.value })}
                      placeholder="#6b7280"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Background */}
      <CollapsibleSection title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={widget.background?.type || 'color'}
              onValueChange={(value: 'color' | 'image' | 'video' | 'gradient') => onChange({
                background: { ...widget.background, type: value } as any
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

          {widget.background?.type === 'color' && (
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={widget.background?.color || 'transparent'}
                  onChange={(e) => onChange({
                    background: { ...widget.background, color: e.target.value } as any
                  })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={widget.background?.color || 'transparent'}
                  onChange={(e) => onChange({
                    background: { ...widget.background, color: e.target.value } as any
                  })}
                  placeholder="transparent"
                />
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Button Styling */}
      {widget.buttonText && widget.buttonText.trim() !== '' && (
        <CollapsibleSection title="Button" open={buttonStyleOpen} onToggle={() => setButtonStyleOpen(!buttonStyleOpen)}>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Background Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={buttonStyle.backgroundColor}
                  onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, backgroundColor: e.target.value } })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={buttonStyle.backgroundColor}
                  onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, backgroundColor: e.target.value } })}
                  placeholder="#10b981"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Text Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={buttonStyle.textColor}
                  onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, textColor: e.target.value } })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={buttonStyle.textColor}
                  onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, textColor: e.target.value } })}
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Border Radius: {buttonStyle.borderRadius}px</Label>
              <input
                type="range"
                min="0"
                max="50"
                value={buttonStyle.borderRadius}
                onChange={(e) => onChange({ buttonStyle: { ...buttonStyle, borderRadius: parseInt(e.target.value) } })}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="button-shadow"
                checked={buttonStyle.shadow}
                onCheckedChange={(checked) => onChange({ buttonStyle: { ...buttonStyle, shadow: !!checked } })}
              />
              <Label htmlFor="button-shadow" className="text-sm font-normal">Drop Shadow</Label>
            </div>
          </div>
        </CollapsibleSection>
      )}
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="text-section"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
