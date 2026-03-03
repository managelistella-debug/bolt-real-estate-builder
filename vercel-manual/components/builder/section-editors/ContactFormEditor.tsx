'use client';

import { useState } from 'react';
import { ContactFormWidget, FormField, FormFieldType, ContactFormStyle, ContactFormLayout } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BackgroundControl } from '@/components/builder/BackgroundControl';
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface ContactFormEditorProps {
  widget: ContactFormWidget;
  onChange: (updates: Partial<ContactFormWidget>) => void;
}

export function ContactFormEditor({ widget, onChange }: ContactFormEditorProps) {
  const [styleExpanded, setStyleExpanded] = useState(true);
  const [formContentExpanded, setFormContentExpanded] = useState(true);
  const [fieldsExpanded, setFieldsExpanded] = useState(true);
  const [expandedFieldIds, setExpandedFieldIds] = useState<Set<string>>(new Set());
  const [columnContentExpanded, setColumnContentExpanded] = useState(false);
  const [contactDetailsExpanded, setContactDetailsExpanded] = useState(false);
  const [formBoxExpanded, setFormBoxExpanded] = useState(false);
  const [fieldStylingExpanded, setFieldStylingExpanded] = useState(false);
  const [buttonStylingExpanded, setButtonStylingExpanded] = useState(false);
  const [typographyExpanded, setTypographyExpanded] = useState(false);
  const [backgroundExpanded, setBackgroundExpanded] = useState(false);
  const [sectionLayoutExpanded, setSectionLayoutExpanded] = useState(false);

  // Ensure defaults
  const style = widget.style || 'simple';
  const layout = widget.layout || 'form-right';
  const fields = widget.fields || [];
  const formHeading = widget.formHeading || 'Get in Touch';
  const buttonText = widget.buttonText || 'Send Message';
  const confirmationMessage = widget.confirmationMessage || 'Thank you! We\'ll be in touch soon.';
  
  const formBoxed = widget.formBoxed ?? true;
  const formBoxBackground = widget.formBoxBackground || '#ffffff';
  const formBoxBorderRadius = widget.formBoxBorderRadius ?? 12;
  const formBoxPadding = widget.formBoxPadding ?? 32;
  const formBoxShadow = widget.formBoxShadow ?? true;
  
  const fieldBackgroundColor = widget.fieldBackgroundColor || '#f3f4f6';
  const fieldTextColor = widget.fieldTextColor || '#1f2937';
  const fieldPlaceholderColor = widget.fieldPlaceholderColor || '#9ca3af';
  const fieldBorderRadius = widget.fieldBorderRadius ?? 8;
  const fieldBorderWidth = widget.fieldBorderWidth ?? 0;
  const fieldBorderColor = widget.fieldBorderColor || '#d1d5db';
  const fieldBorderSides = widget.fieldBorderSides || { top: false, right: false, bottom: true, left: false };
  
  const buttonFullWidth = widget.buttonFullWidth ?? false;
  const buttonAlignment = widget.buttonAlignment || 'left';
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
  
  const headingSize = widget.headingSize ?? 32;
  const headingColor = widget.headingColor || '#1f2937';
  const descriptionSize = widget.descriptionSize ?? 16;
  const descriptionColor = widget.descriptionColor || '#6b7280';
  
  const background = widget.background || { type: 'color', color: 'transparent', opacity: 100, blur: 0 };
  
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

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const toggleFieldExpanded = (fieldId: string) => {
    setExpandedFieldIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  };

  const addField = (type: FormFieldType) => {
    const newField: FormField = {
      id: generateId(),
      type,
      label: type,
      placeholder: type.charAt(0).toUpperCase() + type.slice(1),
      required: false,
      order: fields.length,
    };
    onChange({ fields: [...fields, newField] });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange({
      fields: fields.map(field => field.id === id ? { ...field, ...updates } : field)
    });
  };

  const removeField = (id: string) => {
    onChange({ fields: fields.filter(field => field.id !== id) });
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    // Update order
    newFields.forEach((field, idx) => field.order = idx);
    onChange({ fields: newFields });
  };

  const getAlignmentButtons = (value: string, onChange: (val: 'left' | 'center' | 'right') => void) => (
    <div className="flex gap-1">
      <Button
        type="button"
        variant={value === 'left' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('left')}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={value === 'center' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('center')}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={value === 'right' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('right')}
      >
        <AlignRight className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Style Selection */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setStyleExpanded(!styleExpanded)}
        >
          <span className="font-medium">Form Style</span>
          {styleExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {styleExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div>
              <Label>Style</Label>
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  type="button"
                  variant={style === 'simple' ? 'default' : 'outline'}
                  onClick={() => onChange({ style: 'simple' })}
                  className="w-full justify-start"
                >
                  Simple - Single form column
                </Button>
                <Button
                  type="button"
                  variant={style === 'split' ? 'default' : 'outline'}
                  onClick={() => onChange({ style: 'split' })}
                  className="w-full justify-start"
                >
                  Split - Text + Form layout
                </Button>
                <Button
                  type="button"
                  variant={style === 'contact-details' ? 'default' : 'outline'}
                  onClick={() => onChange({ style: 'contact-details' })}
                  className="w-full justify-start"
                >
                  Contact Details - Info + Form
                </Button>
              </div>
            </div>

            {(style === 'split' || style === 'contact-details') && (
              <div>
                <Label>Form Position</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={layout === 'form-left' ? 'default' : 'outline'}
                    onClick={() => onChange({ layout: 'form-left' })}
                    className="flex-1"
                  >
                    Form Left
                  </Button>
                  <Button
                    type="button"
                    variant={layout === 'form-right' ? 'default' : 'outline'}
                    onClick={() => onChange({ layout: 'form-right' })}
                    className="flex-1"
                  >
                    Form Right
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Content */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setFormContentExpanded(!formContentExpanded)}
        >
          <span className="font-medium">Form Content</span>
          {formContentExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {formContentExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div>
              <Label>Form Heading</Label>
              <Input
                value={formHeading}
                onChange={(e) => onChange({ formHeading: e.target.value })}
              />
            </div>
            <div>
              <Label>Form Description (Optional)</Label>
              <Textarea
                value={widget.formDescription || ''}
                onChange={(e) => onChange({ formDescription: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={buttonText}
                onChange={(e) => onChange({ buttonText: e.target.value })}
              />
            </div>
            <div>
              <Label>Confirmation Message</Label>
              <Textarea
                value={confirmationMessage}
                onChange={(e) => onChange({ confirmationMessage: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setFieldsExpanded(!fieldsExpanded)}
        >
          <span className="font-medium">Form Fields</span>
          {fieldsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {fieldsExpanded && (
          <div className="p-4 space-y-4 border-t">
            {fields.sort((a, b) => a.order - b.order).map((field, index) => {
              const isExpanded = expandedFieldIds.has(field.id);
              return (
                <div key={field.id} className="border rounded-lg">
                  <div 
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 gap-2"
                    onClick={() => toggleFieldExpanded(field.id)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {field.placeholder || field.label} {field.required && <span className="text-red-500">*</span>}
                      </span>
                    </div>
                    <div className="flex gap-1 items-center flex-shrink-0">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(index, 'up');
                          }}
                        >
                          ↑
                        </Button>
                      )}
                      {index < fields.length - 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveField(index, 'down');
                          }}
                        >
                          ↓
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeField(field.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="p-3 space-y-3 border-t">
                      <div>
                        <Label>Field Type</Label>
                        <Select 
                          value={field.type} 
                          onValueChange={(val: FormFieldType) => updateField(field.id, { type: val })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="select">Select/Dropdown</SelectItem>
                            <SelectItem value="radio">Radio Buttons</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Label (Backend)</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          placeholder="e.g., name, email, message"
                        />
                      </div>
                      <div>
                        <Label>Placeholder (Display)</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          placeholder="e.g., Full Name, How can we help?"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required-${field.id}`}
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        />
                        <Label htmlFor={`required-${field.id}`}>Required Field</Label>
                      </div>
                      {(field.type === 'select' || field.type === 'radio') && (
                        <div>
                          <Label>Options (one per line)</Label>
                          <Textarea
                            value={(field.options || []).join('\n')}
                            onChange={(e) => updateField(field.id, { options: e.target.value.split('\n').filter(o => o.trim()) })}
                            rows={4}
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div>
              <Label>Add Field</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => addField('text')} className="text-xs">
                  + Text
                </Button>
                <Button type="button" variant="outline" onClick={() => addField('email')} className="text-xs">
                  + Email
                </Button>
                <Button type="button" variant="outline" onClick={() => addField('phone')} className="text-xs">
                  + Phone
                </Button>
                <Button type="button" variant="outline" onClick={() => addField('textarea')} className="text-xs">
                  + Textarea
                </Button>
                <Button type="button" variant="outline" onClick={() => addField('select')} className="text-xs">
                  + Select
                </Button>
                <Button type="button" variant="outline" onClick={() => addField('radio')} className="text-xs">
                  + Radio
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Column Content (for split & contact-details) */}
      {(style === 'split' || style === 'contact-details') && (
        <div className="border rounded-lg">
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
            onClick={() => setColumnContentExpanded(!columnContentExpanded)}
          >
            <span className="font-medium">Column Content</span>
            {columnContentExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {columnContentExpanded && (
            <div className="p-4 space-y-4 border-t">
              <div>
                <Label>Column Heading</Label>
                <Input
                  value={widget.columnHeading || ''}
                  onChange={(e) => onChange({ columnHeading: e.target.value })}
                  placeholder="Contact"
                />
              </div>
              <div>
                <Label>Column Description</Label>
                <Textarea
                  value={widget.columnDescription || ''}
                  onChange={(e) => onChange({ columnDescription: e.target.value })}
                  rows={3}
                />
              </div>
              {style === 'split' && (
                <>
                  <div>
                    <Label>Button 1 Text (Optional)</Label>
                    <Input
                      value={widget.button1Text || ''}
                      onChange={(e) => onChange({ button1Text: e.target.value })}
                      placeholder="Get in Touch"
                    />
                  </div>
                  {widget.button1Text && (
                    <div>
                      <Label>Button 1 URL</Label>
                      <Input
                        value={widget.button1Url || ''}
                        onChange={(e) => onChange({ button1Url: e.target.value })}
                        placeholder="/contact"
                      />
                    </div>
                  )}
                  <div>
                    <Label>Button 2 Text (Optional)</Label>
                    <Input
                      value={widget.button2Text || ''}
                      onChange={(e) => onChange({ button2Text: e.target.value })}
                      placeholder="Browse Services"
                    />
                  </div>
                  {widget.button2Text && (
                    <div>
                      <Label>Button 2 URL</Label>
                      <Input
                        value={widget.button2Url || ''}
                        onChange={(e) => onChange({ button2Url: e.target.value })}
                        placeholder="/services"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Contact Details (for contact-details style) */}
      {style === 'contact-details' && (
        <div className="border rounded-lg">
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
            onClick={() => setContactDetailsExpanded(!contactDetailsExpanded)}
          >
            <span className="font-medium">Contact Details</span>
            {contactDetailsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {contactDetailsExpanded && (
            <div className="p-4 space-y-4 border-t">
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={widget.phone || ''}
                  onChange={(e) => onChange({ phone: e.target.value })}
                  placeholder="778-235-0996"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={widget.email || ''}
                  onChange={(e) => onChange({ email: e.target.value })}
                  placeholder="info@example.com"
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={widget.website || ''}
                  onChange={(e) => onChange({ website: e.target.value })}
                  placeholder="example.com"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showContactIcons"
                  checked={widget.showContactIcons ?? true}
                  onChange={(e) => onChange({ showContactIcons: e.target.checked })}
                />
                <Label htmlFor="showContactIcons">Show Icons</Label>
              </div>
              <div>
                <Label>Button Text (Optional)</Label>
                <Input
                  value={widget.button1Text || ''}
                  onChange={(e) => onChange({ button1Text: e.target.value })}
                  placeholder="Browse services"
                />
              </div>
              {widget.button1Text && (
                <div>
                  <Label>Button URL</Label>
                  <Input
                    value={widget.button1Url || ''}
                    onChange={(e) => onChange({ button1Url: e.target.value })}
                    placeholder="/services"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Form Box Styling */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setFormBoxExpanded(!formBoxExpanded)}
        >
          <span className="font-medium">Form Box Styling</span>
          {formBoxExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {formBoxExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="formBoxed"
                checked={formBoxed}
                onChange={(e) => onChange({ formBoxed: e.target.checked })}
              />
              <Label htmlFor="formBoxed">Box Form Container</Label>
            </div>
            {formBoxed && (
              <>
                <div>
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={formBoxBackground}
                    onChange={(e) => onChange({ formBoxBackground: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Border Radius: {formBoxBorderRadius}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={formBoxBorderRadius}
                    onChange={(e) => onChange({ formBoxBorderRadius: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Padding: {formBoxPadding}px</Label>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    value={formBoxPadding}
                    onChange={(e) => onChange({ formBoxPadding: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="formBoxShadow"
                    checked={formBoxShadow}
                    onChange={(e) => onChange({ formBoxShadow: e.target.checked })}
                  />
                  <Label htmlFor="formBoxShadow">Shadow</Label>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Field Styling */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setFieldStylingExpanded(!fieldStylingExpanded)}
        >
          <span className="font-medium">Field Styling</span>
          {fieldStylingExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {fieldStylingExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Background</Label>
                <Input
                  type="color"
                  value={fieldBackgroundColor}
                  onChange={(e) => onChange({ fieldBackgroundColor: e.target.value })}
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={fieldTextColor}
                  onChange={(e) => onChange({ fieldTextColor: e.target.value })}
                />
              </div>
              <div>
                <Label>Placeholder</Label>
                <Input
                  type="color"
                  value={fieldPlaceholderColor}
                  onChange={(e) => onChange({ fieldPlaceholderColor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Border Radius: {fieldBorderRadius}px</Label>
              <input
                type="range"
                min="0"
                max="16"
                value={fieldBorderRadius}
                onChange={(e) => onChange({ fieldBorderRadius: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <Label>Border Width: {fieldBorderWidth}px</Label>
              <input
                type="range"
                min="0"
                max="4"
                value={fieldBorderWidth}
                onChange={(e) => onChange({ fieldBorderWidth: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            {fieldBorderWidth > 0 && (
              <>
                <div>
                  <Label>Border Color</Label>
                  <Input
                    type="color"
                    value={fieldBorderColor}
                    onChange={(e) => onChange({ fieldBorderColor: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Border Sides</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="borderTop"
                        checked={fieldBorderSides.top}
                        onChange={(e) => onChange({ 
                          fieldBorderSides: { ...fieldBorderSides, top: e.target.checked }
                        })}
                      />
                      <Label htmlFor="borderTop">Top</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="borderRight"
                        checked={fieldBorderSides.right}
                        onChange={(e) => onChange({ 
                          fieldBorderSides: { ...fieldBorderSides, right: e.target.checked }
                        })}
                      />
                      <Label htmlFor="borderRight">Right</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="borderBottom"
                        checked={fieldBorderSides.bottom}
                        onChange={(e) => onChange({ 
                          fieldBorderSides: { ...fieldBorderSides, bottom: e.target.checked }
                        })}
                      />
                      <Label htmlFor="borderBottom">Bottom</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="borderLeft"
                        checked={fieldBorderSides.left}
                        onChange={(e) => onChange({ 
                          fieldBorderSides: { ...fieldBorderSides, left: e.target.checked }
                        })}
                      />
                      <Label htmlFor="borderLeft">Left</Label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Button Styling */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setButtonStylingExpanded(!buttonStylingExpanded)}
        >
          <span className="font-medium">Button Styling</span>
          {buttonStylingExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {buttonStylingExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="buttonFullWidth"
                checked={buttonFullWidth}
                onChange={(e) => onChange({ buttonFullWidth: e.target.checked })}
              />
              <Label htmlFor="buttonFullWidth">Full Width</Label>
            </div>
            <div>
              <Label>Button Alignment</Label>
              {getAlignmentButtons(buttonAlignment, (val) => onChange({ buttonAlignment: val }))}
            </div>
            <div>
              <Label>Background Color</Label>
              <Input
                type="color"
                value={buttonStyle.backgroundColor}
                onChange={(e) => onChange({ 
                  buttonStyle: { ...buttonStyle, backgroundColor: e.target.value }
                })}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <Input
                type="color"
                value={buttonStyle.textColor}
                onChange={(e) => onChange({ 
                  buttonStyle: { ...buttonStyle, textColor: e.target.value }
                })}
              />
            </div>
            <div>
              <Label>Border Radius: {buttonStyle.borderRadius}px</Label>
              <input
                type="range"
                min="0"
                max="32"
                value={buttonStyle.borderRadius}
                onChange={(e) => onChange({ 
                  buttonStyle: { ...buttonStyle, borderRadius: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="buttonShadow"
                checked={buttonStyle.shadow}
                onChange={(e) => onChange({ 
                  buttonStyle: { ...buttonStyle, shadow: e.target.checked }
                })}
              />
              <Label htmlFor="buttonShadow">Shadow</Label>
            </div>
            <div>
              <Label>Hover Background (Optional)</Label>
              <Input
                type="color"
                value={widget.buttonHoverBackground || buttonStyle.backgroundColor}
                onChange={(e) => onChange({ buttonHoverBackground: e.target.value })}
              />
            </div>
            <div>
              <Label>Hover Text Color (Optional)</Label>
              <Input
                type="color"
                value={widget.buttonHoverColor || buttonStyle.textColor}
                onChange={(e) => onChange({ buttonHoverColor: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Typography */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setTypographyExpanded(!typographyExpanded)}
        >
          <span className="font-medium">Typography</span>
          {typographyExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {typographyExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Heading Size (px)</Label>
                <Input
                  type="number"
                  value={headingSize}
                  onChange={(e) => onChange({ headingSize: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Heading Color</Label>
                <Input
                  type="color"
                  value={headingColor}
                  onChange={(e) => onChange({ headingColor: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Description Size (px)</Label>
                <Input
                  type="number"
                  value={descriptionSize}
                  onChange={(e) => onChange({ descriptionSize: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Description Color</Label>
                <Input
                  type="color"
                  value={descriptionColor}
                  onChange={(e) => onChange({ descriptionColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setBackgroundExpanded(!backgroundExpanded)}
        >
          <span className="font-medium">Background</span>
          {backgroundExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {backgroundExpanded && (
          <div className="p-4 border-t">
            <BackgroundControl
              value={background}
              onChange={(val) => onChange({ background: val })}
            />
          </div>
        )}
      </div>

      {/* Section Layout */}
      <div className="border rounded-lg">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
          onClick={() => setSectionLayoutExpanded(!sectionLayoutExpanded)}
        >
          <span className="font-medium">Section Layout</span>
          {sectionLayoutExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {sectionLayoutExpanded && (
          <div className="p-4 space-y-4 border-t">
            <div>
              <Label>Section Width</Label>
              <Select
                value={layoutCfg.width}
                onValueChange={(val: 'full' | 'container') => onChange({ layout: { ...layoutCfg, width: val } })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="full">Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Padding</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label className="text-xs">Top</Label>
                  <Input
                    type="number"
                    value={layoutCfg.padding.top}
                    onChange={(e) => onChange({
                      layout: {
                        ...layoutCfg,
                        padding: { ...layoutCfg.padding, top: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    type="number"
                    value={layoutCfg.padding.bottom}
                    onChange={(e) => onChange({
                      layout: {
                        ...layoutCfg,
                        padding: { ...layoutCfg.padding, bottom: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Left</Label>
                  <Input
                    type="number"
                    value={layoutCfg.padding.left}
                    onChange={(e) => onChange({
                      layout: {
                        ...layoutCfg,
                        padding: { ...layoutCfg.padding, left: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Right</Label>
                  <Input
                    type="number"
                    value={layoutCfg.padding.right}
                    onChange={(e) => onChange({
                      layout: {
                        ...layoutCfg,
                        padding: { ...layoutCfg.padding, right: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
