'use client';

import { useState } from 'react';
import { StepsWidget, Step } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, type FontSizeValue } from '../FontSizeInput';
import { ImageUpload } from '../ImageUpload';

interface StepsEditorNewProps {
  widget: StepsWidget;
  onChange: (updates: Partial<StepsWidget>) => void;
}

export function StepsEditorNew({ widget, onChange }: StepsEditorNewProps) {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  
  // Collapsible states
  const [sectionHeaderOpen, setSectionHeaderOpen] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(true);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [layoutStyleOpen, setLayoutStyleOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [sectionHeaderStyleOpen, setSectionHeaderStyleOpen] = useState(false);
  const [stepLabelStyleOpen, setStepLabelStyleOpen] = useState(false);
  const [stepHeadingStyleOpen, setStepHeadingStyleOpen] = useState(false);
  const [stepDescStyleOpen, setStepDescStyleOpen] = useState(false);
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

  const layoutConfig = widget.layout || {
    fullWidth: true,
    maxWidth: 1200,
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 24,
    paddingRight: 24,
  };

  const backgroundConfig = widget.background || {
    type: 'color',
    color: 'transparent',
    opacity: 100,
    blur: 0,
  };

  const addStep = () => {
    const newStep: Step = {
      id: `step_${Date.now()}`,
      label: `STEP ${(widget.steps || []).length + 1}`,
      heading: 'New Step',
      description: 'Describe this step in the process.',
    };
    onChange({ steps: [...(widget.steps || []), newStep] });
  };

  const updateStep = (id: string, updates: Partial<Step>) => {
    onChange({
      steps: (widget.steps || []).map(s => s.id === id ? { ...s, ...updates } : s),
    });
  };

  const removeStep = (id: string) => {
    onChange({ steps: (widget.steps || []).filter(s => s.id !== id) });
    if (expandedStepId === id) {
      setExpandedStepId(null);
    }
  };

  const reorderStep = (id: string, direction: 'up' | 'down') => {
    const steps = [...(widget.steps || [])];
    const index = steps.findIndex(s => s.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const [removed] = steps.splice(index, 1);
    steps.splice(newIndex, 0, removed);
    onChange({ steps });
  };

  // Content Tab
  const contentTab = (
    <div className="space-y-3">
      {/* Section Header */}
      <CollapsibleSection title="Section Header (Optional)" open={sectionHeaderOpen} onToggle={() => setSectionHeaderOpen(!sectionHeaderOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Heading</Label>
              <Select
                value={(widget as any).sectionHeadingTag || 'h2'}
                onValueChange={(value: any) => onChange({ sectionHeadingTag: value } as any)}
              >
                <SelectTrigger className="w-20 h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                  <SelectItem value="p">P</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              value={widget.sectionHeading || ''}
              onChange={(e) => onChange({ sectionHeading: e.target.value })}
              placeholder="Optional section heading"
            />
          </div>
          <div className="space-y-2">
            <Label>Subheading</Label>
            <Input
              value={widget.sectionSubheading || ''}
              onChange={(e) => onChange({ sectionSubheading: e.target.value })}
              placeholder="Optional subheading"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Steps */}
      <CollapsibleSection title={`Steps (${(widget.steps || []).length})`} open={stepsOpen} onToggle={() => setStepsOpen(!stepsOpen)}>
        <div className="space-y-2">
          {(widget.steps || []).map((step, index) => (
            <div key={step.id} className="border rounded-lg p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-medium text-sm">{step.label}: {step.heading}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => reorderStep(step.id, 'up')}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => reorderStep(step.id, 'down')}
                    disabled={index === (widget.steps || []).length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setExpandedStepId(expandedStepId === step.id ? null : step.id)}
                  >
                    {expandedStepId === step.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => removeStep(step.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedStepId === step.id && (
                <div className="mt-3 space-y-3 pt-3 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={step.label}
                      onChange={(e) => updateStep(step.id, { label: e.target.value })}
                      placeholder="STEP 01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Heading</Label>
                    <Input
                      value={step.heading}
                      onChange={(e) => updateStep(step.id, { heading: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={step.description}
                      onChange={(e) => updateStep(step.id, { description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Image (Optional)</Label>
                    <ImageUpload
                      value={step.image || ''}
                      onChange={(url) => updateStep(step.id, { image: url })}
                      folder="steps"
                      maxSizeMB={1}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button onClick={addStep} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Step
          </Button>
        </div>
      </CollapsibleSection>
    </div>
  );

  // Layout Tab
  const layoutTab = (
    <div className="space-y-2">
      {/* Layout Style */}
      <CollapsibleSection title="Layout Style" open={layoutStyleOpen} onToggle={() => setLayoutStyleOpen(!layoutStyleOpen)}>
        <div className="space-y-2">
          <Label>Style</Label>
          <Select
            value={widget.stepsLayout || 'vertical'}
            onValueChange={(value: 'vertical' | 'horizontal' | 'alternating') => onChange({ stepsLayout: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vertical">Vertical</SelectItem>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="alternating">Alternating</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Step Gap: {widget.stepGap || 40}px</Label>
          <input
            type="range"
            min="20"
            max="80"
            value={widget.stepGap || 40}
            onChange={(e) => onChange({ stepGap: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </CollapsibleSection>

      {/* Section Height */}
      <CollapsibleSection title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
        <Select defaultValue="auto">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="vh">View Height</SelectItem>
            <SelectItem value="pixels">Pixels</SelectItem>
          </SelectContent>
        </Select>
      </CollapsibleSection>

      {/* Section Width */}
      <CollapsibleSection title="Section Width" open={sectionWidthOpen} onToggle={() => setSectionWidthOpen(!sectionWidthOpen)}>
        <Select
          value={layoutConfig.fullWidth ? 'full' : 'container'}
          onValueChange={(value) => onChange({
            layout: { ...layoutConfig, fullWidth: value === 'full' }
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
          {[
            { key: 'paddingTop', label: 'Top' },
            { key: 'paddingRight', label: 'Right' },
            { key: 'paddingBottom', label: 'Bottom' },
            { key: 'paddingLeft', label: 'Left' }
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input
                type="number"
                value={(layoutConfig as any)[key] || 0}
                onChange={(e) => onChange({
                  layout: { ...layoutConfig, [key]: parseInt(e.target.value) || 0 }
                })}
              />
            </div>
          ))}
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
          {/* Section Header Style */}
          {widget.sectionHeading && (
            <div className="border rounded-lg">
              <button
                type="button"
                className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
                onClick={() => setSectionHeaderStyleOpen(!sectionHeaderStyleOpen)}
              >
                <span className="text-sm font-medium">Section Header</span>
                {sectionHeaderStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
              {sectionHeaderStyleOpen && (
                <div className="p-3 pt-0 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Font Size</Label>
                    <FontSizeInput
                      value={(widget as any).sectionHeadingSize || 32}
                      onChange={(value: FontSizeValue) => onChange({ sectionHeadingSize: value.value } as any)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={widget.sectionHeadingColor || '#1f2937'}
                        onChange={(e) => onChange({ sectionHeadingColor: e.target.value })}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <Input
                        value={widget.sectionHeadingColor || '#1f2937'}
                        onChange={(e) => onChange({ sectionHeadingColor: e.target.value })}
                        placeholder="#1f2937"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step Label Style */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setStepLabelStyleOpen(!stepLabelStyleOpen)}
            >
              <span className="text-sm font-medium">Step Label</span>
              {stepLabelStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {stepLabelStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={(widget as any).stepLabelSize || 12}
                    onChange={(value: FontSizeValue) => onChange({ stepLabelSize: value.value } as any)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.stepLabelColor || '#10b981'}
                      onChange={(e) => onChange({ stepLabelColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.stepLabelColor || '#10b981'}
                      onChange={(e) => onChange({ stepLabelColor: e.target.value })}
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step Heading Style */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setStepHeadingStyleOpen(!stepHeadingStyleOpen)}
            >
              <span className="text-sm font-medium">Step Heading</span>
              {stepHeadingStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {stepHeadingStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={(widget as any).stepHeadingSize || 24}
                    onChange={(value: FontSizeValue) => onChange({ stepHeadingSize: value.value } as any)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.stepHeadingColor || '#1f2937'}
                      onChange={(e) => onChange({ stepHeadingColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.stepHeadingColor || '#1f2937'}
                      onChange={(e) => onChange({ stepHeadingColor: e.target.value })}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step Description Style */}
          <div className="border rounded-lg">
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
              onClick={() => setStepDescStyleOpen(!stepDescStyleOpen)}
            >
              <span className="text-sm font-medium">Step Description</span>
              {stepDescStyleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {stepDescStyleOpen && (
              <div className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Font Size</Label>
                  <FontSizeInput
                    value={(widget as any).stepDescSize || 16}
                    onChange={(value: FontSizeValue) => onChange({ stepDescSize: value.value } as any)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={widget.stepDescriptionColor || '#6b7280'}
                      onChange={(e) => onChange({ stepDescriptionColor: e.target.value })}
                      className="h-10 w-16 rounded border cursor-pointer"
                    />
                    <Input
                      value={widget.stepDescriptionColor || '#6b7280'}
                      onChange={(e) => onChange({ stepDescriptionColor: e.target.value })}
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
              value={backgroundConfig.type || 'color'}
              onValueChange={(value: 'color' | 'image' | 'video' | 'gradient') => onChange({
                background: { ...backgroundConfig, type: value }
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
          {backgroundConfig.type === 'color' && (
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundConfig.color || 'transparent'}
                  onChange={(e) => onChange({ background: { ...backgroundConfig, color: e.target.value } })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <Input
                  value={backgroundConfig.color || 'transparent'}
                  onChange={(e) => onChange({ background: { ...backgroundConfig, color: e.target.value } })}
                  placeholder="transparent"
                />
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType="steps"
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}
