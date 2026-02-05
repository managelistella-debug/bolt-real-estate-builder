'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { StickyFormWidget, FormField, LayoutConfig, BackgroundConfig, ButtonStyleConfig } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { BackgroundControl } from '../BackgroundControl';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface StickyFormEditorProps {
  widget: StickyFormWidget;
  onChange: (updates: Partial<StickyFormWidget>) => void;
}

export function StickyFormEditor({ widget, onChange }: StickyFormEditorProps) {
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

  // ReactQuill modules configuration
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  }), []);

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  // Form field management
  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: 'new_field',
      placeholder: 'New Field',
      required: false,
      order: (widget.fields || []).length,
    };
    onChange({ fields: [...(widget.fields || []), newField] });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange({
      fields: (widget.fields || []).map(field =>
        field.id === id ? { ...field, ...updates } : field
      ),
    });
  };

  const removeField = (id: string) => {
    onChange({ fields: (widget.fields || []).filter(field => field.id !== id) });
  };

  const reorderField = (id: string, direction: 'up' | 'down') => {
    const fields = [...(widget.fields || [])];
    const index = fields.findIndex(f => f.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const [removed] = fields.splice(index, 1);
    fields.splice(newIndex, 0, removed);
    onChange({ fields: fields.map((f, idx) => ({ ...f, order: idx })) });
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
        <Tabs defaultValue="layout" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="text">Text Content</TabsTrigger>
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="space-y-4 mt-4">
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Form Position</h3>
              <div className="space-y-2">
                <Label htmlFor="formLayout">Form Side</Label>
                <Select
                  value={widget.formLayout || 'form-left'}
                  onValueChange={(value: 'form-left' | 'form-right') => onChange({ formLayout: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="form-left">Form on Left</SelectItem>
                    <SelectItem value="form-right">Form on Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileStackOrder">Mobile Stack Order</Label>
                <Select
                  value={widget.mobileStackOrder || 'form-first'}
                  onValueChange={(value: 'form-first' | 'text-first') => onChange({ mobileStackOrder: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="form-first">Form First</SelectItem>
                    <SelectItem value="text-first">Text First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="text" className="space-y-4 mt-4">
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Heading</h3>
              <div className="space-y-2">
                <Label htmlFor="heading">Heading Text</Label>
                <Input
                  id="heading"
                  value={widget.heading || ''}
                  onChange={(e) => onChange({ heading: e.target.value })}
                  placeholder="Enter heading"
                />
              </div>
              <div className="space-y-2">
                <Label>Heading Color</Label>
                {renderColorPicker(widget.headingColor, (color) => onChange({ headingColor: color }), '#1f2937')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="headingSize">Heading Size (px)</Label>
                <Input
                  id="headingSize"
                  type="number"
                  min={24}
                  max={72}
                  value={widget.headingSize ?? 36}
                  onChange={(e) => onChange({ headingSize: parseInt(e.target.value) })}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Body Content</h3>
              <p className="text-sm text-muted-foreground">
                Use the toolbar to format text, add headers, bold/italic, bullet points, and hyperlinks.
              </p>
              <div className="space-y-2">
                <Label>Text Editor</Label>
                <div className="border rounded-md overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={widget.richTextContent || ''}
                    onChange={(content) => onChange({ richTextContent: content })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your content here..."
                    style={{ minHeight: '200px' }}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Typography</h3>
              <div className="space-y-2">
                <Label htmlFor="headingFontFamily">Heading Font</Label>
                <Select
                  value={widget.headingFontFamily || 'Inter'}
                  onValueChange={(value) => onChange({ headingFontFamily: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="textFontFamily">Body Font</Label>
                <Select
                  value={widget.textFontFamily || 'Inter'}
                  onValueChange={(value) => onChange({ textFontFamily: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="form" className="space-y-4 mt-4">
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Form Header</h3>
              <div className="space-y-2">
                <Label htmlFor="formHeading">Form Heading</Label>
                <Input
                  id="formHeading"
                  value={widget.formHeading || ''}
                  onChange={(e) => onChange({ formHeading: e.target.value })}
                  placeholder="Contact Us"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formDescription">Form Description</Label>
                <Textarea
                  id="formDescription"
                  value={widget.formDescription || ''}
                  onChange={(e) => onChange({ formDescription: e.target.value })}
                  placeholder="Optional description"
                  rows={2}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Form Fields</h3>
              <div className="space-y-3">
                {(widget.fields || []).map((field, index) => (
                  <div key={field.id} className="border rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{field.placeholder || field.label}</span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => reorderField(field.id, 'up')} disabled={index === 0}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => reorderField(field.id, 'down')} disabled={index === (widget.fields || []).length - 1}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <Select value={field.type} onValueChange={(value) => updateField(field.id, { type: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} placeholder="Label (backend)" />
                    <Input value={field.placeholder || ''} onChange={(e) => updateField(field.id, { placeholder: e.target.value })} placeholder="Placeholder (display)" />
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={field.required} onCheckedChange={(checked) => updateField(field.id, { required: checked as boolean })} />
                      <label className="text-sm">Required</label>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={addField} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Field
              </Button>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Submit Button</h3>
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={widget.buttonText || 'Submit'}
                  onChange={(e) => onChange({ buttonText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmationMessage">Confirmation Message</Label>
                <Input
                  id="confirmationMessage"
                  value={widget.confirmationMessage || 'Thank you! We\'ll be in touch soon.'}
                  onChange={(e) => onChange({ confirmationMessage: e.target.value })}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="styling" className="space-y-4 mt-4">
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Form Box</h3>
              <div className="space-y-2">
                <Label htmlFor="formBoxed">Show Box</Label>
                <Switch
                  id="formBoxed"
                  checked={widget.formBoxed ?? true}
                  onCheckedChange={(checked) => onChange({ formBoxed: checked })}
                />
              </div>
              {widget.formBoxed && (
                <>
                  <div className="space-y-2">
                    <Label>Box Background</Label>
                    {renderColorPicker(widget.formBoxBackground, (color) => onChange({ formBoxBackground: color }), '#ffffff')}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formBoxBorderRadius">Border Radius (px)</Label>
                    <Input
                      id="formBoxBorderRadius"
                      type="number"
                      min={0}
                      max={50}
                      value={widget.formBoxBorderRadius ?? 12}
                      onChange={(e) => onChange({ formBoxBorderRadius: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formBoxPadding">Padding (px)</Label>
                    <Input
                      id="formBoxPadding"
                      type="number"
                      min={0}
                      max={100}
                      value={widget.formBoxPadding ?? 32}
                      onChange={(e) => onChange({ formBoxPadding: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formBoxShadow">Box Shadow</Label>
                    <Switch
                      id="formBoxShadow"
                      checked={widget.formBoxShadow ?? true}
                      onCheckedChange={(checked) => onChange({ formBoxShadow: checked })}
                    />
                  </div>
                </>
              )}
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Form Fields</h3>
              <div className="space-y-2">
                <Label>Background Color</Label>
                {renderColorPicker(widget.fieldBackgroundColor, (color) => onChange({ fieldBackgroundColor: color }), '#f3f4f6')}
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                {renderColorPicker(widget.fieldTextColor, (color) => onChange({ fieldTextColor: color }), '#1f2937')}
              </div>
              <div className="space-y-2">
                <Label>Placeholder Color</Label>
                {renderColorPicker(widget.fieldPlaceholderColor, (color) => onChange({ fieldPlaceholderColor: color }), '#9ca3af')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldBorderRadius">Border Radius (px)</Label>
                <Input
                  id="fieldBorderRadius"
                  type="number"
                  min={0}
                  max={50}
                  value={widget.fieldBorderRadius ?? 8}
                  onChange={(e) => onChange({ fieldBorderRadius: parseInt(e.target.value) })}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Submit Button Style</h3>
              <div className="space-y-2">
                <Label>Background Color</Label>
                {renderColorPicker(widget.buttonStyle?.bgColor, (color) => updateButtonStyle({ bgColor: color }), '#10b981')}
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                {renderColorPicker(widget.buttonStyle?.textColor, (color) => updateButtonStyle({ textColor: color }), '#ffffff')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonRadius">Border Radius (px)</Label>
                <Input
                  id="buttonRadius"
                  type="number"
                  min={0}
                  max={50}
                  value={widget.buttonStyle?.radius ?? 8}
                  onChange={(e) => updateButtonStyle({ radius: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonFullWidth">Full Width</Label>
                <Switch
                  id="buttonFullWidth"
                  checked={widget.buttonFullWidth ?? false}
                  onCheckedChange={(checked) => onChange({ buttonFullWidth: checked })}
                />
              </div>
            </Card>

            <BackgroundControl value={backgroundConfig} onChange={updateBackground} />
            
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Section Layout</h3>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
