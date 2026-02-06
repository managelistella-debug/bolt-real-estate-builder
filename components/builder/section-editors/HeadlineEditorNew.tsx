'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { HeadlineWidget } from '@/lib/types';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, fontSizeToCSS, type FontSizeValue } from '../FontSizeInput';
import { cn } from '@/lib/utils';
import { useDebouncedInput } from '../hooks/useDebouncedInput';

interface HeadlineEditorNewProps {
  widget: HeadlineWidget;
  onChange: (updates: Partial<HeadlineWidget>) => void;
}

export function HeadlineEditorNew({ widget, onChange }: HeadlineEditorNewProps) {
  // Debounced inputs for smooth typing
  const [titleValue, , titleChange, titleBlur] = useDebouncedInput(
    widget.title,
    (value) => onChange({ title: value })
  );
  
  const [subtitleValue, , subtitleChange, subtitleBlur] = useDebouncedInput(
    widget.subtitle || '',
    (value) => onChange({ subtitle: value })
  );
  
  const [buttonTextValue, , buttonTextChange, buttonTextBlur] = useDebouncedInput(
    widget.button?.text || '',
    (value) => onChange({ button: { ...widget.button, text: value } as any })
  );
  
  const [buttonUrlValue, , buttonUrlChange, buttonUrlBlur] = useDebouncedInput(
    widget.button?.url || '',
    (value) => onChange({ button: { ...widget.button, url: value } as any })
  );

  // Collapsible states
  const [buttonOpen, setButtonOpen] = useState(false);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [horizontalAlignOpen, setHorizontalAlignOpen] = useState(false);
  const [verticalAlignOpen, setVerticalAlignOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [headerStyleOpen, setHeaderStyleOpen] = useState(false);
  const [subtitleStyleOpen, setSubtitleStyleOpen] = useState(false);
  const [buttonStyleOpen, setButtonStyleOpen] = useState(false);
  const [buttonStateTab, setButtonStateTab] = useState<'default' | 'hover'>('default');

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

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Title with tag selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Title</Label>
          <Select
            value={widget.titleHeaderTag || 'h2'}
            onValueChange={(value: any) => onChange({ titleHeaderTag: value })}
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
        <Input
          value={titleValue}
          onChange={titleChange}
          onBlur={titleBlur}
          placeholder="Section Headline"
        />
      </div>

      {/* Subtitle with tag selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Subtitle</Label>
          <Select
            value={widget.subtitleHeaderTag || 'p'}
            onValueChange={(value: any) => onChange({ subtitleHeaderTag: value })}
          >
            <SelectTrigger className="w-20 h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">P</SelectItem>
              <SelectItem value="h2">H2</SelectItem>
              <SelectItem value="h3">H3</SelectItem>
              <SelectItem value="h4">H4</SelectItem>
              <SelectItem value="div">Div</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          value={subtitleValue}
          onChange={subtitleChange}
          onBlur={subtitleBlur}
          placeholder="Optional subtitle"
        />
      </div>

      {/* Button Collapsible */}
      <CollapsibleSection title="Button" open={buttonOpen} onToggle={() => setButtonOpen(!buttonOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={buttonTextValue}
              onChange={buttonTextChange}
              onBlur={buttonTextBlur}
              placeholder="Click Here"
            />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={buttonUrlValue}
              onChange={buttonUrlChange}
              onBlur={buttonUrlBlur}
              placeholder="https://"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="headline-btn-new-tab"
              checked={widget.button?.openNewTab || false}
              onCheckedChange={(checked) => onChange({
                button: { ...widget.button, text: widget.button?.text || '', url: widget.button?.url || '', openNewTab: !!checked }
              })}
            />
            <Label htmlFor="headline-btn-new-tab" className="text-sm font-normal">Open in new tab</Label>
          </div>
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
            value={widget.height?.type || 'auto'}
            onValueChange={(value: 'auto' | 'vh' | 'percentage' | 'pixels') => onChange({
              height: { ...widget.height, type: value }
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
          {widget.height?.type !== 'auto' && (
            <Input
              type="number"
              value={widget.height?.value || 100}
              onChange={(e) => onChange({
                height: { ...widget.height, value: parseInt(e.target.value) }
              })}
              className="w-24"
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Section Width */}
      <CollapsibleSection title="Section Width" open={sectionWidthOpen} onToggle={() => setSectionWidthOpen(!sectionWidthOpen)}>
        <Select defaultValue="container">
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
              value={widget.padding?.top || 80}
              onChange={(e) => onChange({
                padding: { ...widget.padding, top: parseInt(e.target.value) } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Right</Label>
            <Input
              type="number"
              value={widget.padding?.right || 20}
              onChange={(e) => onChange({
                padding: { ...widget.padding, right: parseInt(e.target.value) } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Bottom</Label>
            <Input
              type="number"
              value={widget.padding?.bottom || 80}
              onChange={(e) => onChange({
                padding: { ...widget.padding, bottom: parseInt(e.target.value) } as any
              })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Left</Label>
            <Input
              type="number"
              value={widget.padding?.left || 20}
              onChange={(e) => onChange({
                padding: { ...widget.padding, left: parseInt(e.target.value) } as any
              })}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Horizontal Alignment */}
      <CollapsibleSection title="Horizontal Alignment" open={horizontalAlignOpen} onToggle={() => setHorizontalAlignOpen(!horizontalAlignOpen)}>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={widget.textAlign === 'left' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ textAlign: 'left' })}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={widget.textAlign === 'center' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ textAlign: 'center' })}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={widget.textAlign === 'right' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange({ textAlign: 'right' })}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </CollapsibleSection>

      {/* Vertical Alignment */}
      <CollapsibleSection title="Vertical Alignment" open={verticalAlignOpen} onToggle={() => setVerticalAlignOpen(!verticalAlignOpen)}>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
          >
            <AlignVerticalJustifyStart className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
          >
            <AlignVerticalJustifyCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <AlignVerticalJustifyEnd className="h-4 w-4" />
          </Button>
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
          {/* Header Styles */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setHeaderStyleOpen(!headerStyleOpen)}
            >
              <span className="text-sm font-medium">Header</span>
              {headerStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {headerStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font</Label>
                  <Select defaultValue="inter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="arial">Arial</SelectItem>
                      <SelectItem value="helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={{ value: 2, unit: 'rem' }}
                    onChange={(value: FontSizeValue) => {
                      // TODO: Wire up to actual widget state
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Line Height</Label>
                  <Input placeholder="1.2" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Transform</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
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
                      defaultValue="#000000"
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input placeholder="#000000" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subtitle Styles */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setSubtitleStyleOpen(!subtitleStyleOpen)}
            >
              <span className="text-sm font-medium">Subtitle</span>
              {subtitleStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {subtitleStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font</Label>
                  <Select defaultValue="inter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="arial">Arial</SelectItem>
                      <SelectItem value="helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={{ value: 1, unit: 'rem' }}
                    onChange={(value: FontSizeValue) => {
                      // TODO: Wire up to actual widget state
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Line Height</Label>
                  <Input placeholder="1.5" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Transform</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
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
                      defaultValue="#666666"
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input placeholder="#666666" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Button */}
      <CollapsibleSection title="Button" open={buttonStyleOpen} onToggle={() => setButtonStyleOpen(!buttonStyleOpen)}>
        <div className="space-y-3">
          {/* State Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              type="button"
              className={cn(
                "flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors",
                buttonStateTab === 'default' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              )}
              onClick={() => setButtonStateTab('default')}
            >
              Default
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors",
                buttonStateTab === 'hover' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
              )}
              onClick={() => setButtonStateTab('hover')}
            >
              Hover
            </button>
          </div>

          {buttonStateTab === 'default' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Width</Label>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                    <SelectItem value="custom">Custom (Pixels)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Font</Label>
                <div className="space-y-2 pl-2 border-l-2">
                  <div>
                    <Label className="text-xs">Font Family</Label>
                    <Select defaultValue="inter">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="arial">Arial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Size</Label>
                    <FontSizeInput
                      value={{ value: 1, unit: 'rem' }}
                      onChange={(value: FontSizeValue) => {
                        // TODO: Wire up to actual widget state
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Line Height</Label>
                    <Input placeholder="1.5" />
                  </div>
                  <div>
                    <Label className="text-xs">Transform</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="uppercase">All Caps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Color</Label>
                    <div className="flex gap-2">
                      <input type="color" defaultValue="#ffffff" className="h-10 w-16 rounded border cursor-pointer" />
                      <Input placeholder="#ffffff" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Button Background</Label>
                <div className="space-y-2 pl-2 border-l-2">
                  <div>
                    <Label className="text-xs">Color</Label>
                    <div className="flex gap-2">
                      <input type="color" defaultValue="#3b82f6" className="h-10 w-16 rounded border cursor-pointer" />
                      <Input placeholder="#3b82f6" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Opacity: 100%</Label>
                    <input type="range" min="0" max="100" defaultValue="100" className="w-full" />
                  </div>
                  <div>
                    <Label className="text-xs">Border Weight: 0px</Label>
                    <input type="range" min="0" max="10" defaultValue="0" className="w-full" />
                  </div>
                  <div>
                    <Label className="text-xs">Padding: 12px</Label>
                    <input type="range" min="4" max="32" defaultValue="12" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Effects</Label>
                <div className="space-y-2 pl-2 border-l-2">
                  <div>
                    <Label className="text-xs">Blur Background: 0px</Label>
                    <input type="range" min="0" max="20" defaultValue="0" className="w-full" />
                  </div>
                  <div>
                    <Label className="text-xs">Drop Shadow: 4px</Label>
                    <input type="range" min="0" max="20" defaultValue="4" className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {buttonStateTab === 'hover' && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Hover state customization coming soon...
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="headline"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
