'use client';

import React, { useState, useEffect } from 'react';
import { StepsWidget, Step, TypographyConfig } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, type FontSizeValue } from '../FontSizeInput';
import { ImageUpload } from '../ImageUpload';
import { TypographyControl } from '../controls/TypographyControl';
import { useWebsiteStore } from '@/lib/stores/website';
import { GlobalColorInput } from '../controls/GlobalColorInput';
import { ResponsiveDevicePicker } from '../controls/ResponsiveControlShell';

interface StepsEditorNewProps {
  widget: StepsWidget;
  onChange: (updates: Partial<StepsWidget>) => void;
}

export function StepsEditorNew({ widget, onChange }: StepsEditorNewProps) {
  const { website } = useWebsiteStore();
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  
  // Collapsible states
  const [sectionHeaderOpen, setSectionHeaderOpen] = useState(true);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [sectionHeightOpen, setSectionHeightOpen] = useState(false);
  const [sectionWidthOpen, setSectionWidthOpen] = useState(false);
  const [paddingOpen, setPaddingOpen] = useState(false);
  const [layoutStyleOpen, setLayoutStyleOpen] = useState(true);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [sectionHeaderStyleOpen, setSectionHeaderStyleOpen] = useState(false);
  const [stepLabelStyleOpen, setStepLabelStyleOpen] = useState(false);
  const [stepHeadingStyleOpen, setStepHeadingStyleOpen] = useState(false);
  const [stepDescStyleOpen, setStepDescStyleOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(true);

  // Helper functions to get typography configs
  const getSectionHeaderTypography = (): TypographyConfig => {
    return (widget as any).sectionHeaderTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 2, unit: 'rem' },
      fontWeight: '700',
      lineHeight: '1.2',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#1f2937',
    };
  };

  const getStepLabelTypography = (): TypographyConfig => {
    return (widget as any).stepLabelTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 0.75, unit: 'rem' },
      fontWeight: '600',
      lineHeight: '1.2',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#10b981',
    };
  };

  const getStepHeadingTypography = (): TypographyConfig => {
    return (widget as any).stepHeadingTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 1.5, unit: 'rem' },
      fontWeight: '700',
      lineHeight: '1.3',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#1f2937',
    };
  };

  const getStepDescriptionTypography = (): TypographyConfig => {
    return (widget as any).stepDescriptionTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 1, unit: 'rem' },
      fontWeight: '400',
      lineHeight: '1.6',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#6b7280',
    };
  };

  const CollapsibleSection = ({ 
    title, 
    open, 
    onToggle, 
    showBreakpointIcon = false,
    children 
  }: { 
    title: string; 
    open: boolean; 
    onToggle: () => void; 
    showBreakpointIcon?: boolean;
    children: React.ReactNode;
  }) => (
    <div className="border rounded-lg">
      <button
        type="button"
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{title}</span>
          {showBreakpointIcon && (
            <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
              <ResponsiveDevicePicker className="h-6 w-6" />
            </div>
          )}
        </div>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && (
        <div className="p-4 pt-0 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  // Migration: Ensure typography configs are in the correct format
  useEffect(() => {
    let needsUpdate = false;
    const updates: any = {};

    // Helper to validate/migrate typography config
    const validateTypography = (typo: any): boolean => {
      if (!typo) return false;
      if (typeof typo.fontSize === 'number') return true; // needs migration
      return false;
    };

    if (validateTypography((widget as any).sectionHeaderTypography)) {
      needsUpdate = true;
    }
    if (validateTypography((widget as any).stepLabelTypography)) {
      needsUpdate = true;
    }
    if (validateTypography((widget as any).stepHeadingTypography)) {
      needsUpdate = true;
    }
    if (validateTypography((widget as any).stepDescriptionTypography)) {
      needsUpdate = true;
    }

    // No actual migration needed as Steps already uses TypographyConfig properly
  }, []); // Only run once on mount

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
      <CollapsibleSection showBreakpointIcon title="Layout Style" open={layoutStyleOpen} onToggle={() => setLayoutStyleOpen(!layoutStyleOpen)}>
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
      <CollapsibleSection showBreakpointIcon title="Section Height" open={sectionHeightOpen} onToggle={() => setSectionHeightOpen(!sectionHeightOpen)}>
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
      <CollapsibleSection showBreakpointIcon title="Section Width" open={sectionWidthOpen} onToggle={() => setSectionWidthOpen(!sectionWidthOpen)}>
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
      <CollapsibleSection showBreakpointIcon title="Padding" open={paddingOpen} onToggle={() => setPaddingOpen(!paddingOpen)}>
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
      {/* Section Header Typography */}
      {widget.sectionHeading && (
        <TypographyControl
          label="Section Header Typography"
          defaultOpen={true}
          value={getSectionHeaderTypography()}
          responsiveFontSize={(getSectionHeaderTypography() as any).fontSizeResponsive}
          onResponsiveFontSizeChange={(next) => onChange({
            sectionHeaderTypography: {
              ...getSectionHeaderTypography(),
              fontSizeResponsive: next,
            } as any,
          })}
          onChange={(updates) => {
            onChange({
              sectionHeaderTypography: {
                ...getSectionHeaderTypography(),
                ...updates,
              } as any,
            });
          }}
          showGlobalStyleSelector={true}
          globalStyles={website?.globalStyles}
          availableGlobalStyles={['h2', 'h3']}
        />
      )}

      {/* Step Label Typography */}
      <TypographyControl
        label="Step Label Typography"
        defaultOpen={false}
        value={getStepLabelTypography()}
        responsiveFontSize={(getStepLabelTypography() as any).fontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({
          stepLabelTypography: {
            ...getStepLabelTypography(),
            fontSizeResponsive: next,
          } as any,
        })}
        onChange={(updates) => {
          onChange({
            stepLabelTypography: {
              ...getStepLabelTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['body']}
      />

      {/* Step Heading Typography */}
      <TypographyControl
        label="Step Heading Typography"
        defaultOpen={false}
        value={getStepHeadingTypography()}
        responsiveFontSize={(getStepHeadingTypography() as any).fontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({
          stepHeadingTypography: {
            ...getStepHeadingTypography(),
            fontSizeResponsive: next,
          } as any,
        })}
        onChange={(updates) => {
          onChange({
            stepHeadingTypography: {
              ...getStepHeadingTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['h3', 'h4']}
      />

      {/* Step Description Typography */}
      <TypographyControl
        label="Step Description Typography"
        defaultOpen={false}
        value={getStepDescriptionTypography()}
        responsiveFontSize={(getStepDescriptionTypography() as any).fontSizeResponsive}
        onResponsiveFontSizeChange={(next) => onChange({
          stepDescriptionTypography: {
            ...getStepDescriptionTypography(),
            fontSizeResponsive: next,
          } as any,
        })}
        onChange={(updates) => {
          onChange({
            stepDescriptionTypography: {
              ...getStepDescriptionTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['body']}
      />

      {/* Background */}
      <CollapsibleSection showBreakpointIcon title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
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
              <GlobalColorInput
                value={backgroundConfig.color}
                onChange={(nextColor) => onChange({ background: { ...backgroundConfig, color: nextColor } })}
                globalStyles={website?.globalStyles}
                defaultColor="#ffffff"
                placeholder="transparent"
              />
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
