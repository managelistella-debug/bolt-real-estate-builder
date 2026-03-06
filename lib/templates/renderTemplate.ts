import { getStartingPointTemplateById } from './registry';
import { renderCountrySite } from './sites/country/render';

export interface TemplateCustomization {
  agentName?: string;
  brokerageName?: string;
  teamName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  officeAddress?: string;
  aboutMe?: string;
  targetAreas?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontHeading?: string;
  fontBody?: string;
  social?: Record<string, string>;
  personalLogo?: string;
  brokerageLogo?: string;
}

export interface RenderedTemplate {
  previewHtml: string;
  previewCss: string;
  siteName: string;
}

export function renderStartingPointTemplate(
  templateId: string,
  customization: TemplateCustomization,
): RenderedTemplate | null {
  const template = getStartingPointTemplateById(templateId);
  if (!template) return null;

  if (templateId === 'starting-point-country') {
    return renderCountrySite(template, customization);
  }

  return null;
}
