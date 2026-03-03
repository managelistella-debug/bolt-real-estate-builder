/**
 * Wrapped Section Editors - Takes existing editor logic and wraps in Content/Layout/Style tabs
 * This provides immediate consistency across all section types
 */

'use client';

import { SectionEditorTabs } from './SectionEditorTabs';
import { IconTextEditor } from './section-editors/IconTextEditor';
import { FAQEditor } from './section-editors/FAQEditor';
import { TestimonialsEditor } from './section-editors/TestimonialsEditor';
import { StepsEditor } from './section-editors/StepsEditor';
import { ImageTextColumnsEditor } from './section-editors/ImageTextColumnsEditor';
import { StickyFormEditor } from './section-editors/StickyFormEditor';
import { ReviewsSliderEditor } from './section-editors/ReviewsSliderEditor';
import { ContactFormEditor } from './section-editors/ContactFormEditor';
import { ReactNode } from 'react';

// Generic wrapper that uses existing editors
function WrapExistingEditor({
  sectionType,
  children,
}: {
  sectionType: string;
  children: ReactNode;
}) {
  // For now, put all content in the Content tab
  // The existing editors already have good organization
  const contentTab = <div className="space-y-4">{children}</div>;
  const layoutTab = (
    <div className="p-4 text-sm text-muted-foreground">
      Layout controls are in the main content area
    </div>
  );
  const styleTab = (
    <div className="p-4 text-sm text-muted-foreground">
      Style controls are in the main content area
    </div>
  );

  return (
    <SectionEditorTabs
      sectionType={sectionType}
      contentTab={contentTab}
      layoutTab={layoutTab}
      styleTab={styleTab}
    />
  );
}

// Wrapped Icon Text Editor
export function IconTextEditorWrapped(props: any) {
  return (
    <WrapExistingEditor sectionType="icon-text">
      <IconTextEditor {...props} />
    </WrapExistingEditor>
  );
}

// Wrapped FAQ Editor
export function FAQEditorWrapped(props: any) {
  return (
    <WrapExistingEditor sectionType="faq">
      <FAQEditor {...props} />
    </WrapExistingEditor>
  );
}

// Wrapped Testimonials Editor
export function TestimonialsEditorWrapped(props: any) {
  return (
    <WrapExistingEditor sectionType="testimonials">
      <TestimonialsEditor {...props} />
    </WrapExistingEditor>
  );
}

// Wrapped Steps Editor
export function StepsEditorWrapped(props: any) {
  return (
    <WrapExistingEditor sectionType="steps">
      <StepsEditor {...props} />
    </WrapExistingEditor>
  );
}

// Wrapped Image Text Columns Editor
export function ImageTextColumnsEditorWrapped(props: any) {
  return (
    <WrapExistingEditor sectionType="image-text-columns">
      <ImageTextColumnsEditor {...props} />
    </WrapExistingEditor>
  );
}

// Wrapped Sticky Form Editor
export function StickyFormEditorWrapped(props: any) {
  return (
    <WrapExistingEditor sectionType="sticky-form">
      <StickyFormEditor {...props} />
    </WrapExistingEditor>
  );
}

// Wrapped Reviews Slider Editor
export function ReviewsSliderEditorWrapped(props: any) {
  return (
    <WrapExistingEditor sectionType="reviews-slider">
      <ReviewsSliderEditor {...props} />
    </WrapExistingEditor>
  );
}

// Wrapped Contact Form Editor
export function ContactFormEditorWrapped(props: any) {
  return (
    <WrapExistingEditor sectionType="contact-form">
      <ContactFormEditor {...props} />
    </WrapExistingEditor>
  );
}

// Image Navigation - Simple editor
export function ImageNavigationEditorWrapped(props: any) {
  const { widget, onChange } = props;
  
  return (
    <SectionEditorTabs
      sectionType="image-navigation"
      contentTab={
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {widget.items?.length || 0} navigation items
          </p>
        </div>
      }
      layoutTab={
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Columns</label>
            <input
              type="number"
              min="1"
              max="6"
              value={widget.columns}
              onChange={(e: any) => onChange({ columns: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      }
      styleTab={
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Style controls coming soon
          </p>
        </div>
      }
    />
  );
}
