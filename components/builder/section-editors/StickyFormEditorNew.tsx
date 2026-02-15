'use client';

import { useState, useEffect } from 'react';
import { StickyFormWidget, TypographyConfig, ButtonStyleConfig } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SectionEditorTabs } from '../SectionEditorTabs';
import { FontSizeInput, type FontSizeValue } from '../FontSizeInput';
import { TypographyControl } from '../controls/TypographyControl';
import { ButtonControl } from '../controls/ButtonControl';
import { useWebsiteStore } from '@/lib/stores/website';
import { GlobalColorInput } from '../controls/GlobalColorInput';

interface StickyFormEditorNewProps {
  widget: StickyFormWidget;
  onChange: (updates: Partial<StickyFormWidget>) => void;
}

export function StickyFormEditorNew({ widget, onChange }: StickyFormEditorNewProps) {
  const { website } = useWebsiteStore();
  const [contentOpen, setContentOpen] = useState(true);
  const [formSettingsOpen, setFormSettingsOpen] = useState(false);
  const [positionOpen, setPositionOpen] = useState(false);
  const [typographyOpen, setTypographyOpen] = useState(false);
  const [buttonStyleOpen, setButtonStyleOpen] = useState(false);
  const [cardStyleOpen, setCardStyleOpen] = useState(false);

  // Migration: Initialize submitButton for existing widgets
  useEffect(() => {
    if (!(widget as any).submitButton) {
      // Read from existing buttonStyle if it exists
      const existingStyle = widget.buttonStyle || {};
      
      const updates: any = {
        submitButton: {
          text: widget.buttonText || 'Submit',
          url: '',
          useGlobalStyle: true,
          globalStyleId: 'button1',
          width: widget.buttonFullWidth ? 'full' : 'auto',
          customWidth: undefined,
          backgroundColor: existingStyle.bgColor || '#10b981',
          textColor: existingStyle.textColor || '#ffffff',
          borderRadius: existingStyle.radius ?? 8,
          borderWidth: 0,
          borderColor: '#000000',
          backgroundOpacity: 100,
          dropShadow: true,
          shadowAmount: 4,
          blurEffect: 0,
          fontFamily: 'Inter',
          fontSize: { value: 16, unit: 'px' as const },
          fontWeight: '500',
          lineHeight: '1.2',
          textTransform: 'none' as const,
          letterSpacing: '0em',
          hover: {
            backgroundColor: undefined,
            textColor: undefined,
            borderColor: undefined,
            backgroundOpacity: undefined,
            scale: 1.02,
          },
        },
      };
      onChange(updates);
    }
  }, []);

  // Helper functions to get typography configs
  const getHeadingTypography = (): TypographyConfig => {
    return (widget as any).headingTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 2.25, unit: 'rem' },
      fontWeight: '700',
      lineHeight: '1.2',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#1f2937',
    };
  };

  const getFormHeadingTypography = (): TypographyConfig => {
    return (widget as any).formHeadingTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 1.25, unit: 'rem' },
      fontWeight: '700',
      lineHeight: '1.2',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#1f2937',
    };
  };

  const getDescriptionTypography = (): TypographyConfig => {
    return (widget as any).descriptionTypography || {
      fontFamily: 'Inter',
      fontSize: { value: 1, unit: 'rem' },
      fontWeight: '400',
      lineHeight: '1.6',
      textTransform: 'none',
      letterSpacing: '0em',
      color: '#374151',
    };
  };

  const getSubmitButton = (): ButtonStyleConfig => {
    if ((widget as any).submitButton) {
      return (widget as any).submitButton;
    }
    
    // Fallback: read from existing buttonStyle if it exists
    const existingStyle = widget.buttonStyle || {};
    return {
      text: widget.buttonText || 'Submit',
      url: '',
      useGlobalStyle: true,
      globalStyleId: 'button1',
      width: widget.buttonFullWidth ? 'full' : 'auto',
      customWidth: undefined,
      backgroundColor: existingStyle.bgColor || '#10b981',
      textColor: existingStyle.textColor || '#ffffff',
      borderRadius: existingStyle.radius ?? 8,
      borderWidth: 0,
      borderColor: '#000000',
      backgroundOpacity: 100,
      dropShadow: true,
      shadowAmount: 4,
      blurEffect: 0,
      fontFamily: 'Inter',
      fontSize: { value: 14, unit: 'px' as const },
      fontWeight: '500',
      lineHeight: '1.2',
      textTransform: 'none' as const,
      letterSpacing: '0em',
      hover: {
        backgroundColor: undefined,
        textColor: undefined,
        borderColor: undefined,
        backgroundOpacity: undefined,
        scale: 1.02,
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

  const contentTab = (
    <div className="space-y-3">
      <CollapsibleSection title="Text Content" open={contentOpen} onToggle={() => setContentOpen(!contentOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Main Heading (Text Side)</Label>
            <Input value={widget.heading || ''} onChange={(e) => onChange({ heading: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea value={widget.description || ''} onChange={(e) => onChange({ description: e.target.value })} rows={2} />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Form Settings" open={formSettingsOpen} onToggle={() => setFormSettingsOpen(!formSettingsOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Form Heading (Form Box)</Label>
            <Input 
              value={(widget as any).formHeading || ''} 
              onChange={(e) => onChange({ formHeading: e.target.value } as any)} 
              placeholder="e.g., Contact Us"
            />
          </div>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input value={widget.buttonText} onChange={(e) => onChange({ buttonText: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Name Field Label</Label>
            <Input value={widget.nameLabel || 'Name'} onChange={(e) => onChange({ nameLabel: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email Field Label</Label>
            <Input value={widget.emailLabel || 'Email'} onChange={(e) => onChange({ emailLabel: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Phone Field Label</Label>
            <Input value={widget.phoneLabel || 'Phone'} onChange={(e) => onChange({ phoneLabel: e.target.value })} />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  const layoutTab = (
    <div className="space-y-2">
      <CollapsibleSection title="Position" open={positionOpen} onToggle={() => setPositionOpen(!positionOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Form Side (Desktop/Tablet)</Label>
            <Select
              value={(widget as any).formLayout || 'form-left'}
              onValueChange={(value: 'form-left' | 'form-right') => onChange({ formLayout: value } as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="form-left">Form on Left</SelectItem>
                <SelectItem value="form-right">Form on Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Mobile Stack Order</Label>
            <Select
              value={(widget as any).mobileStackOrder || 'form-first'}
              onValueChange={(value: 'form-first' | 'text-first') => onChange({ mobileStackOrder: value } as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="form-first">Form First</SelectItem>
                <SelectItem value="text-first">Text First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>
              Sticky Offset (Desktop/Tablet): {((widget as any).stickyOffset ?? (widget as any).offset ?? 20)}px
            </Label>
            <input
              type="range"
              min="0"
              max="160"
              value={((widget as any).stickyOffset ?? (widget as any).offset ?? 20)}
              onChange={(e) => onChange({ stickyOffset: parseInt(e.target.value, 10) } as any)}
              className="w-full"
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  const styleTab = (
    <div className="space-y-2">
      {/* Main Heading Typography (Text Side) */}
      <TypographyControl
        label="Main Heading Typography"
        value={getHeadingTypography()}
        onChange={(updates) => {
          if (Object.keys(updates).length > 0) {
            onChange({
              headingTypography: {
                ...getHeadingTypography(),
                ...updates,
              } as any,
            });
          }
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['h2', 'h3', 'h4']}
      />

      {/* Form Heading Typography (Form Box) */}
      <TypographyControl
        label="Form Heading Typography"
        value={getFormHeadingTypography()}
        onChange={(updates) => {
          if (Object.keys(updates).length > 0) {
            onChange({
              formHeadingTypography: {
                ...getFormHeadingTypography(),
                ...updates,
              } as any,
            });
          }
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['h3', 'h4', 'h5']}
      />

      {/* Description Typography */}
      <TypographyControl
        label="Description Typography"
        value={getDescriptionTypography()}
        onChange={(updates) => {
          if (Object.keys(updates).length > 0) {
            onChange({
              descriptionTypography: {
                ...getDescriptionTypography(),
                ...updates,
              } as any,
            });
          }
        }}
        showGlobalStyleSelector={true}
        globalStyles={website?.globalStyles}
        availableGlobalStyles={['body']}
      />

      {/* Submit Button */}
      <ButtonControl
        headerLabel="Button Styling"
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
        globalStyles={website?.globalStyles}
      />

      <CollapsibleSection title="Card Style" open={cardStyleOpen} onToggle={() => setCardStyleOpen(!cardStyleOpen)}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Background Color</Label>
            <GlobalColorInput
              value={(widget as any).cardBackgroundColor}
              onChange={(nextColor) => onChange({ cardBackgroundColor: nextColor } as any)}
              globalStyles={website?.globalStyles}
              defaultColor="#ffffff"
              placeholder="#ffffff"
            />
          </div>
          <div className="space-y-2">
            <Label>Border Radius: {(widget as any).cardBorderRadius || 12}px</Label>
            <input type="range" min="0" max="30" value={(widget as any).cardBorderRadius || 12} onChange={(e) => onChange({ cardBorderRadius: parseInt(e.target.value) } as any)} className="w-full" />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  return <SectionEditorTabs sectionType="sticky-form" contentTab={contentTab} layoutTab={layoutTab} styleTab={styleTab} />;
}
