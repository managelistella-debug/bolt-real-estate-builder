import {
  SectionType,
  SectionAnimationElementSettings,
  SectionAnimationSettings,
  Widget,
  TextEntranceAnimationType,
  ImageEntranceAnimationType,
  ImageHoverAnimationType,
} from '@/lib/types';

export interface AnimationElementDefinition {
  id: string;
  label: string;
  kind: SectionAnimationElementSettings['kind'];
}

const DEFAULT_TEXT_ENTRANCE: TextEntranceAnimationType = 'none';
const DEFAULT_IMAGE_ENTRANCE: ImageEntranceAnimationType = 'none';
const DEFAULT_IMAGE_HOVER: ImageHoverAnimationType = 'none';

function textDef(id: string, label: string): AnimationElementDefinition {
  return { id, label, kind: 'text' };
}

function buttonDef(id: string, label: string): AnimationElementDefinition {
  return { id, label, kind: 'button' };
}

function imageDef(id: string, label: string): AnimationElementDefinition {
  return { id, label, kind: 'image' };
}

function formDef(id: string, label: string): AnimationElementDefinition {
  return { id, label, kind: 'form' };
}

function hasText(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasArray(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

export function getAnimationElementDefinitions(
  sectionType: SectionType,
  widget: Widget | Record<string, any>,
): AnimationElementDefinition[] {
  const w = widget as Record<string, any>;
  const defs: AnimationElementDefinition[] = [];

  if (sectionType === 'hero') {
    if (hasText(w.title || w.headline)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.subtitle || w.subheadline)) defs.push(textDef('subheaderText', 'Subheader text'));
    if (hasText(w.button?.text || w.cta?.text)) defs.push(buttonDef('buttons', 'Buttons'));
    if (w.background?.type === 'image' && hasText(w.background?.url)) {
      defs.push(imageDef('heroBackgroundImage', 'Image'));
    }
    return defs;
  }

  if (sectionType === 'headline') {
    if (hasText(w.title)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.subtitle)) defs.push(textDef('subheaderText', 'Subheader text'));
    if (hasText(w.button?.text)) defs.push(buttonDef('buttons', 'Buttons'));
    return defs;
  }

  if (sectionType === 'image-text') {
    if (hasText(w.title)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.content)) defs.push(textDef('bodyText', 'Body text'));
    if (hasText(w.cta?.text || w.button?.text)) defs.push(buttonDef('buttons', 'Buttons'));
    if (hasText(w.image)) defs.push(imageDef('image', 'Image'));
    return defs;
  }

  if (sectionType === 'image-gallery') {
    defs.push(imageDef('image', 'Image'));
    return defs;
  }

  if (sectionType === 'icon-text') {
    if (hasText(w.sectionHeading)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.sectionSubheading)) defs.push(textDef('subheaderText', 'Subheader text'));
    if (hasArray(w.items)) {
      defs.push(imageDef('icon', 'Icon'));
      defs.push(textDef('itemHeaderText', 'Item header text'));
      defs.push(textDef('itemBodyText', 'Item body text'));
    }
    if (hasText(w.viewMoreText)) defs.push(buttonDef('buttons', 'Buttons'));
    return defs;
  }

  if (sectionType === 'text-section') {
    if (hasText(w.heading)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.tagline)) defs.push(textDef('subheaderText', 'Subheader text'));
    if (hasText(w.bodyText)) defs.push(textDef('bodyText', 'Body text'));
    if (hasText(w.buttonText || w.button?.text)) defs.push(buttonDef('buttons', 'Buttons'));
    return defs;
  }

  if (sectionType === 'faq') {
    if (hasText(w.heading)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.subheading)) defs.push(textDef('subheaderText', 'Subheader text'));
    if (hasArray(w.items)) defs.push(textDef('bodyText', 'FAQ items'));
    return defs;
  }

  if (sectionType === 'testimonials') {
    if (hasText(w.sectionHeading)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.sectionSubheading)) defs.push(textDef('subheaderText', 'Subheader text'));
    if (hasArray(w.testimonials)) defs.push(textDef('bodyText', 'Testimonial content'));
    return defs;
  }

  if (sectionType === 'steps') {
    if (hasText(w.sectionHeading)) defs.push(textDef('headerText', 'Header text'));
    if (hasArray(w.steps)) defs.push(textDef('bodyText', 'Step text'));
    if (hasText(w.buttonText || w.buttonStyle?.text)) defs.push(buttonDef('buttons', 'Buttons'));
    if (hasText(w.imageUrl)) defs.push(imageDef('image', 'Image'));
    return defs;
  }

  if (sectionType === 'image-text-columns') {
    if (hasText(w.sectionHeading)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.sectionSubheading)) defs.push(textDef('subheaderText', 'Subheader text'));
    if (hasArray(w.items)) {
      defs.push(imageDef('image', 'Image'));
      defs.push(textDef('bodyText', 'Column text'));
      defs.push(buttonDef('buttons', 'Buttons'));
    }
    return defs;
  }

  if (sectionType === 'sticky-form') {
    if (hasText(w.heading)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.richTextContent)) defs.push(textDef('bodyText', 'Body text'));
    if (hasArray(w.fields)) defs.push(formDef('form', 'Form'));
    if (hasText(w.buttonText || w.buttonStyle?.text)) defs.push(buttonDef('buttons', 'Buttons'));
    return defs;
  }

  if (sectionType === 'reviews-slider') {
    if (hasText(w.sectionHeading)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.sectionSubheading)) defs.push(textDef('subheaderText', 'Subheader text'));
    if (hasArray(w.reviews)) defs.push(textDef('bodyText', 'Review text'));
    if (hasText(w.buttonText) && w.showButton !== false) defs.push(buttonDef('buttons', 'Buttons'));
    return defs;
  }

  if (sectionType === 'image-navigation') {
    if (hasArray(w.items)) {
      defs.push(imageDef('image', 'Image'));
      defs.push(textDef('headerText', 'Card title text'));
    }
    return defs;
  }

  if (sectionType === 'contact-form') {
    if (hasText(w.formHeading)) defs.push(textDef('headerText', 'Header text'));
    if (hasText(w.formDescription)) defs.push(textDef('subheaderText', 'Subheader text'));
    if (hasArray(w.fields)) defs.push(formDef('form', 'Form'));
    if (hasText(w.buttonText || w.submitButton?.text)) defs.push(buttonDef('buttons', 'Buttons'));
    return defs;
  }

  if (sectionType === 'about') {
    if (hasText(w.content)) defs.push(textDef('bodyText', 'Body text'));
    if (hasText(w.image)) defs.push(imageDef('image', 'Image'));
    if (hasText(w.cta?.text)) defs.push(buttonDef('buttons', 'Buttons'));
    return defs;
  }

  if (sectionType === 'services') {
    if (hasText(w.title)) defs.push(textDef('headerText', 'Header text'));
    if (hasArray(w.services)) defs.push(textDef('bodyText', 'Service text'));
    return defs;
  }

  if (sectionType === 'contact') {
    if (hasText(w.buttonText)) defs.push(buttonDef('buttons', 'Buttons'));
    if (hasArray(w.formFields)) defs.push(formDef('form', 'Form'));
    return defs;
  }

  return defs;
}

export function getDefaultAnimationElementSettings(
  kind: SectionAnimationElementSettings['kind'],
): SectionAnimationElementSettings {
  if (kind === 'image') {
    return {
      kind,
      entrance: DEFAULT_IMAGE_ENTRANCE,
      imageHover: DEFAULT_IMAGE_HOVER,
      imageHoverOverlayColor: '#000000',
      imageHoverOverlayOpacity: 30,
    };
  }

  return {
    kind,
    entrance: DEFAULT_TEXT_ENTRANCE,
  };
}

export function normalizeSectionAnimationSettings(
  sectionType: SectionType,
  widget: Widget | Record<string, any>,
): SectionAnimationSettings {
  const definitions = getAnimationElementDefinitions(sectionType, widget);
  const existing = ((widget as any).animationSettings?.elements || {}) as Record<
    string,
    SectionAnimationElementSettings
  >;

  const normalized: Record<string, SectionAnimationElementSettings> = {};
  for (const definition of definitions) {
    const base = getDefaultAnimationElementSettings(definition.kind);
    const current = existing[definition.id];
    normalized[definition.id] = {
      ...base,
      ...current,
      kind: definition.kind,
    };
  }

  return { elements: normalized };
}

