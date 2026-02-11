'use client';

import { useState } from 'react';
import { ContactFormWidget, FormField, TypographyConfig, ButtonStyleConfig } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, type FontSizeValue } from '../FontSizeInput';
import { TypographyControl } from '../controls/TypographyControl';
import { ButtonControl } from '../controls/ButtonControl';
import { useWebsiteStore } from '@/lib/stores/website';

interface ContactFormEditorNewProps {
  widget: ContactFormWidget;
  onChange: (updates: Partial<ContactFormWidget>) => void;
}

export function ContactFormEditorNew({ widget, onChange }: ContactFormEditorNewProps) {
  const { website } = useWebsiteStore();
  const [formContentOpen, setFormContentOpen] = useState(true);
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [columnContentOpen, setColumnContentOpen] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [buttonStyleOpen, setButtonStyleOpen] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);

  // Helper functions to get typography configs
  const getFormHeadingTypography = (): TypographyConfig => {
    return (widget as any).formHeadingTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 2, unit: 'rem' },
      fontWeight: '700',
      lineHeight: '1.2',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#1f2937',
    };
  };

  const getFormDescriptionTypography = (): TypographyConfig => {
    return (widget as any).formDescriptionTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 1, unit: 'rem' },
      fontWeight: '400',
      lineHeight: '1.6',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#6b7280',
    };
  };

  const getSubmitButton = (): ButtonStyleConfig => {
    return (widget as any).submitButton || {
      text: widget.buttonText || 'Submit',
      url: '',
      width: 'full',
      backgroundColor: '#10b981',
      textColor: '#ffffff',
      borderRadius: 8,
      borderWidth: 0,
      backgroundOpacity: 100,
      dropShadow: true,
      shadowAmount: 4,
      blurEffect: 0,
      fontFamily: 'Inter',
      fontSize: { value: 16, unit: 'px' },
      fontWeight: '500',
      lineHeight: '1.2',
      textTransform: 'none',
      hover: {
        backgroundColor: '#059669',
        textColor: '#ffffff',
        dropShadow: true,
        shadowAmount: 6,
      },
    };
  };

  const CollapsibleSection = ({ title, open, onToggle, children }: any) => (
    <div className="border rounded-lg">
      <button type="button" className="w-full flex items-center justify-between p-3 hover:bg-muted/50" onClick={onToggle}>
        <span className="font-medium text-sm">{title}</span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && <div className="p-4 pt-0 space-y-3">{children}</div>}
    </div>
  );

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false,
      width: 'full',
      order: widget.fields.length,
    };
    onChange({ fields: [...widget.fields, newField] });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange({
      fields: widget.fields.map(f => f.id === id ? { ...f, ...updates } : f),
    });
  };

  const removeField = (id: string) => {
    onChange({ fields: widget.fields.filter(f => f.id !== id) });
  };

  const contentTab = (
    <div className="space-y-3">
      <CollapsibleSection title="Form Content" open={formContentOpen} onToggle={() => setFormContentOpen(!formContentOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Form Heading</Label>
            <Input value={widget.formHeading} onChange={(e) => onChange({ formHeading: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea value={widget.formDescription || ''} onChange={(e) => onChange({ formDescription: e.target.value })} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input value={widget.buttonText} onChange={(e) => onChange({ buttonText: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Confirmation Message</Label>
            <Textarea value={widget.confirmationMessage} onChange={(e) => onChange({ confirmationMessage: e.target.value })} rows={2} />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={`Form Fields (${widget.fields.length})`} open={fieldsOpen} onToggle={() => setFieldsOpen(!fieldsOpen)}>
        <div className="space-y-2">
          {widget.fields.map((field) => (
            <div key={field.id} className="border rounded-lg p-3 bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{field.label}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removeField(field.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} placeholder="Field Label" />
                <Select value={field.type} onValueChange={(value: any) => updateField(field.id, { type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="tel">Phone</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox id={`required-${field.id}`} checked={field.required} onCheckedChange={(checked) => updateField(field.id, { required: !!checked })} />
                  <Label htmlFor={`required-${field.id}`} className="text-xs font-normal">Required</Label>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={addField} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Field
          </Button>
        </div>
      </CollapsibleSection>

      {(widget.style === 'split' || widget.style === 'contact-details') && (
        <CollapsibleSection title="Column Content" open={columnContentOpen} onToggle={() => setColumnContentOpen(!columnContentOpen)}>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Column Heading</Label>
              <Input value={widget.columnHeading || ''} onChange={(e) => onChange({ columnHeading: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Column Description</Label>
              <Textarea value={widget.columnDescription || ''} onChange={(e) => onChange({ columnDescription: e.target.value })} rows={3} />
            </div>
            {widget.style === 'contact-details' && (
              <>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={widget.phone || ''} onChange={(e) => onChange({ phone: e.target.value })} placeholder="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={widget.email || ''} onChange={(e) => onChange({ email: e.target.value })} placeholder="hello@example.com" />
                </div>
              </>
            )}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );

  const layoutTab = (
    <div className="space-y-2">
      <CollapsibleSection title="Form Style" open={styleOpen} onToggle={() => setStyleOpen(!styleOpen)}>
        <Select value={widget.style} onValueChange={(value: any) => onChange({ style: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="split">Split (Form + Content)</SelectItem>
            <SelectItem value="contact-details">With Contact Details</SelectItem>
          </SelectContent>
        </Select>
      </CollapsibleSection>

      <CollapsibleSection title="Layout" open={layoutOpen} onToggle={() => setLayoutOpen(!layoutOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Width</Label>
            <Select value={(widget.layout as any)?.width || 'container'} onValueChange={(value) => onChange({ layout: { ...(widget.layout || {}), width: value } as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="container">Container</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Padding (px)</Label>
            <Input type="number" value={(widget.layout as any)?.padding || 80} onChange={(e) => onChange({ layout: { ...(widget.layout || {}), padding: parseInt(e.target.value) } as any })} />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  const styleTab = (
    <div className="space-y-2">
      {/* Form Heading Typography */}
      <TypographyControl
        label="Form Heading Typography"
        value={getFormHeadingTypography()}
        onChange={(updates) => {
          onChange({
            formHeadingTypography: {
              ...getFormHeadingTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        availableGlobalStyles={['h2', 'h3']}
      />

      {/* Form Description Typography */}
      <TypographyControl
        label="Form Description Typography"
        value={getFormDescriptionTypography()}
        onChange={(updates) => {
          onChange({
            formDescriptionTypography: {
              ...getFormDescriptionTypography(),
              ...updates,
            } as any,
          });
        }}
        showGlobalStyleSelector={true}
        availableGlobalStyles={['body']}
      />

      {/* Submit Button */}
      <ButtonControl
        label="Submit Button"
        value={getSubmitButton()}
        onChange={(updates) => {
          const currentButton = getSubmitButton();
          onChange({
            submitButton: {
              ...currentButton,
              ...updates,
            } as any,
            buttonText: updates.text || currentButton.text,
          });
        }}
        showGlobalStyleSelector={true}
      />

      <CollapsibleSection title="Background" open={backgroundOpen} onToggle={() => setBackgroundOpen(!backgroundOpen)}>
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2">
            <input type="color" value={(widget as any).backgroundColor || 'transparent'} onChange={(e) => onChange({ backgroundColor: e.target.value } as any)} className="h-10 w-16 rounded border cursor-pointer" />
            <Input value={(widget as any).backgroundColor || 'transparent'} onChange={(e) => onChange({ backgroundColor: e.target.value } as any)} placeholder="transparent" />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  return <SectionEditorTabs sectionType="contact-form" contentTab={contentTab} layoutTab={layoutTab} styleTab={styleTab} />;
}
