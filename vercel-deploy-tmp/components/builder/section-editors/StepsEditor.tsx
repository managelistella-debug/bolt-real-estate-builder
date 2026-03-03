'use client';

import React, { useState } from 'react';
import { StepsWidget, Step, StepsLayout, LayoutConfig, BackgroundConfig, ButtonStyleConfig } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown, ArrowLeftRight } from 'lucide-react';
import { BackgroundControl } from '../BackgroundControl';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ImageUpload } from '../ImageUpload';

interface StepsEditorProps {
  widget: StepsWidget;
  onChange: (updates: Partial<StepsWidget>) => void;
}

export function StepsEditor({ widget, onChange }: StepsEditorProps) {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  // Ensure layout and background have defaults
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

  const updateLayout = (updates: Partial<LayoutConfig>) => {
    onChange({ layout: { ...layoutConfig, ...updates } });
  };

  const updateBackground = (updates: Partial<BackgroundConfig>) => {
    onChange({ background: { ...backgroundConfig, ...updates } });
  };

  const updateButtonStyle = (updates: Partial<ButtonStyleConfig>) => {
    onChange({ buttonStyle: { ...widget.buttonStyle, ...updates } as ButtonStyleConfig });
  };

  const addStep = () => {
    const newStep: Step = {
      id: `step_${Date.now()}`,
      label: `STEP ${(widget.steps || []).length + 1}`.padStart(8, '0'),
      heading: 'New Step',
      description: 'Describe this step in the process.',
    };
    onChange({ steps: [...(widget.steps || []), newStep] });
  };

  const updateStep = (id: string, updates: Partial<Step>) => {
    onChange({
      steps: (widget.steps || []).map(s =>
        s.id === id ? { ...s, ...updates } : s
      ),
    });
  };

  const removeStep = (id: string) => {
    onChange({
      steps: (widget.steps || []).filter(s => s.id !== id),
    });
    if (expandedStepId === id) {
      setExpandedStepId(null);
    }
  };

  const reorderStep = (id: string, direction: 'up' | 'down') => {
    const items = [...(widget.steps || [])];
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const [removed] = items.splice(index, 1);
    items.splice(newIndex, 0, removed);
    onChange({ steps: items });
  };

  const renderColorPicker = (value: string | undefined, onSelect: (color: string) => void, defaultValue: string = '#000000') => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <div className="w-4 h-4 rounded-full mr-2 border" style={{ backgroundColor: value || defaultValue }} />
          {value || defaultValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={value || defaultValue} onChange={onSelect} />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Section Header */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Section Header</h3>
          <div className="space-y-2">
            <Label htmlFor="sectionHeading">Heading</Label>
            <Input
              id="sectionHeading"
              value={widget.sectionHeading || ''}
              onChange={(e) => onChange({ sectionHeading: e.target.value })}
              placeholder="Get a free estimate"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectionHeadingColor">Heading Color</Label>
            {renderColorPicker(widget.sectionHeadingColor, (color) => onChange({ sectionHeadingColor: color }), '#000000')}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sectionHeadingSize">Heading Size (px)</Label>
            <Input
              id="sectionHeadingSize"
              type="number"
              min={24}
              max={72}
              value={widget.sectionHeadingSize ?? 48}
              onChange={(e) => onChange({ sectionHeadingSize: parseInt(e.target.value) })}
            />
          </div>
        </Card>

        {/* Button */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Call to Action Button</h3>
          <div className="space-y-2">
            <Label htmlFor="buttonVisible">Show Button</Label>
            <Switch
              id="buttonVisible"
              checked={widget.buttonVisible ?? true}
              onCheckedChange={(checked) => onChange({ buttonVisible: checked })}
            />
          </div>
          {widget.buttonVisible && (
            <>
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={widget.buttonText || ''}
                  onChange={(e) => onChange({ buttonText: e.target.value })}
                  placeholder="Get in Touch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonUrl">Button URL</Label>
                <Input
                  id="buttonUrl"
                  value={widget.buttonUrl || ''}
                  onChange={(e) => onChange({ buttonUrl: e.target.value })}
                  placeholder="#contact"
                />
              </div>
              <div className="space-y-2">
                <Label>Button Background Color</Label>
                {renderColorPicker(
                  widget.buttonStyle?.bgColor,
                  (color) => updateButtonStyle({ bgColor: color }),
                  '#10b981'
                )}
              </div>
              <div className="space-y-2">
                <Label>Button Text Color</Label>
                {renderColorPicker(
                  widget.buttonStyle?.textColor,
                  (color) => updateButtonStyle({ textColor: color }),
                  '#ffffff'
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonRadius">Button Border Radius (px)</Label>
                <Input
                  id="buttonRadius"
                  type="number"
                  min={0}
                  max={50}
                  value={widget.buttonStyle?.radius ?? 8}
                  onChange={(e) => updateButtonStyle({ radius: parseInt(e.target.value) })}
                />
              </div>
            </>
          )}
        </Card>

        {/* Layout */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Layout</h3>
          <div className="space-y-2">
            <Label htmlFor="imageLayout">Layout</Label>
            <div className="flex gap-2">
              <Button
                variant={widget.imageLayout === 'image-left' ? 'default' : 'outline'}
                onClick={() => onChange({ imageLayout: 'image-left' })}
                className="flex-1"
              >
                Image Left
              </Button>
              <Button
                variant={widget.imageLayout === 'image-right' ? 'default' : 'outline'}
                onClick={() => onChange({ imageLayout: 'image-right' })}
                className="flex-1"
              >
                Image Right
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Background Image</Label>
            <ImageUpload
              value={widget.imageUrl}
              onChange={(url) => onChange({ imageUrl: url })}
              folder="steps"
              maxSizeMB={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagePosition">Image Position</Label>
            <Select
              value={widget.imagePosition || 'center'}
              onValueChange={(value: 'center' | 'top' | 'bottom') => onChange({ imagePosition: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Steps */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Steps</h3>
          <div className="space-y-3">
            {(widget.steps || []).map((step, index) => (
              <div key={step.id} className="border rounded-md p-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                    <span className="font-medium text-sm truncate">
                      {step.label}: {step.heading || `Step ${index + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => reorderStep(step.id, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => reorderStep(step.id, 'down')}
                      disabled={index === (widget.steps || []).length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpandedStepId(expandedStepId === step.id ? null : step.id)}
                    >
                      {expandedStepId === step.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStep(step.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {expandedStepId === step.id && (
                  <div className="mt-3 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`label-${step.id}`}>Label (e.g., STEP 01)</Label>
                      <Input
                        id={`label-${step.id}`}
                        value={step.label}
                        onChange={(e) => updateStep(step.id, { label: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`heading-${step.id}`}>Heading</Label>
                      <Input
                        id={`heading-${step.id}`}
                        value={step.heading}
                        onChange={(e) => updateStep(step.id, { heading: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${step.id}`}>Description</Label>
                      <Textarea
                        id={`description-${step.id}`}
                        value={step.description}
                        onChange={(e) => updateStep(step.id, { description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button onClick={addStep} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Step
          </Button>
        </Card>

        {/* Card Styling */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Card Styling</h3>
          <div className="space-y-2">
            <Label>Card Background Color</Label>
            {renderColorPicker(widget.cardBackground, (color) => onChange({ cardBackground: color }), '#ffffff')}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardBorderRadius">Card Border Radius (px)</Label>
            <Input
              id="cardBorderRadius"
              type="number"
              min={0}
              max={50}
              value={widget.cardBorderRadius ?? 24}
              onChange={(e) => onChange({ cardBorderRadius: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardPadding">Card Padding (px)</Label>
            <Input
              id="cardPadding"
              type="number"
              min={0}
              max={100}
              value={widget.cardPadding ?? 48}
              onChange={(e) => onChange({ cardPadding: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardShadow">Card Shadow</Label>
            <Switch
              id="cardShadow"
              checked={widget.cardShadow ?? true}
              onCheckedChange={(checked) => onChange({ cardShadow: checked })}
            />
          </div>
        </Card>

        {/* Step Label Styling */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Step Label Styling</h3>
          <div className="space-y-2">
            <Label>Label Background Color</Label>
            {renderColorPicker(widget.stepLabelBackground, (color) => onChange({ stepLabelBackground: color }), '#d1fae5')}
          </div>
          <div className="space-y-2">
            <Label>Label Text Color</Label>
            {renderColorPicker(widget.stepLabelColor, (color) => onChange({ stepLabelColor: color }), '#065f46')}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stepLabelFontSize">Label Font Size (px)</Label>
            <Input
              id="stepLabelFontSize"
              type="number"
              min={10}
              max={20}
              value={widget.stepLabelFontSize ?? 12}
              onChange={(e) => onChange({ stepLabelFontSize: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stepLabelBorderRadius">Label Border Radius (px)</Label>
            <Input
              id="stepLabelBorderRadius"
              type="number"
              min={0}
              max={20}
              value={widget.stepLabelBorderRadius ?? 4}
              onChange={(e) => onChange({ stepLabelBorderRadius: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stepLabelPadding">Label Padding (px)</Label>
            <Input
              id="stepLabelPadding"
              type="number"
              min={0}
              max={20}
              value={widget.stepLabelPadding ?? 6}
              onChange={(e) => onChange({ stepLabelPadding: parseInt(e.target.value) })}
            />
          </div>
        </Card>

        {/* Step Typography */}
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Step Typography</h3>
          <div className="space-y-2">
            <Label>Heading Color</Label>
            {renderColorPicker(widget.stepHeadingColor, (color) => onChange({ stepHeadingColor: color }), '#000000')}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stepHeadingSize">Heading Size (px)</Label>
            <Input
              id="stepHeadingSize"
              type="number"
              min={16}
              max={48}
              value={widget.stepHeadingSize ?? 24}
              onChange={(e) => onChange({ stepHeadingSize: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stepHeadingFontWeight">Heading Font Weight</Label>
            <Select
              value={String(widget.stepHeadingFontWeight ?? 600)}
              onValueChange={(value) => onChange({ stepHeadingFontWeight: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="400">Normal</SelectItem>
                <SelectItem value="500">Medium</SelectItem>
                <SelectItem value="600">Semibold</SelectItem>
                <SelectItem value="700">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description Color</Label>
            {renderColorPicker(widget.stepDescriptionColor, (color) => onChange({ stepDescriptionColor: color }), '#6b7280')}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stepDescriptionSize">Description Size (px)</Label>
            <Input
              id="stepDescriptionSize"
              type="number"
              min={12}
              max={24}
              value={widget.stepDescriptionSize ?? 16}
              onChange={(e) => onChange({ stepDescriptionSize: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stepGap">Gap Between Steps (px)</Label>
            <Input
              id="stepGap"
              type="number"
              min={0}
              max={100}
              value={widget.stepGap ?? 32}
              onChange={(e) => onChange({ stepGap: parseInt(e.target.value) })}
            />
          </div>
        </Card>

        {/* Background & Layout */}
        <BackgroundControl value={backgroundConfig} onChange={updateBackground} />
        
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Section Layout</h3>
          <div className="space-y-2">
            <Label htmlFor="fullWidth">Full Width</Label>
            <Switch
              id="fullWidth"
              checked={layoutConfig.fullWidth ?? true}
              onCheckedChange={(checked) => updateLayout({ fullWidth: checked })}
            />
          </div>
          {!layoutConfig.fullWidth && (
            <div className="space-y-2">
              <Label htmlFor="maxWidth">Max Width (px)</Label>
              <Input
                id="maxWidth"
                type="number"
                min={600}
                max={1400}
                value={layoutConfig.maxWidth ?? 1200}
                onChange={(e) => updateLayout({ maxWidth: parseInt(e.target.value) })}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="paddingTop">Padding Top (px)</Label>
            <Input
              id="paddingTop"
              type="number"
              min={0}
              max={200}
              value={layoutConfig.paddingTop ?? 80}
              onChange={(e) => updateLayout({ paddingTop: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paddingBottom">Padding Bottom (px)</Label>
            <Input
              id="paddingBottom"
              type="number"
              min={0}
              max={200}
              value={layoutConfig.paddingBottom ?? 80}
              onChange={(e) => updateLayout({ paddingBottom: parseInt(e.target.value) })}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
