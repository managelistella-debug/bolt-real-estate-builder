import { StartingPointTemplate } from './types';
import { countryTemplate } from './sites/country/manifest';

const ALL_STARTING_POINT_TEMPLATES: StartingPointTemplate[] = [
  countryTemplate,
];

export function getAllStartingPointTemplates(): StartingPointTemplate[] {
  return ALL_STARTING_POINT_TEMPLATES;
}

export function getStartingPointTemplateById(id: string): StartingPointTemplate | undefined {
  return ALL_STARTING_POINT_TEMPLATES.find((t) => t.id === id);
}

export function getVisibleStartingPointTemplates(): StartingPointTemplate[] {
  return ALL_STARTING_POINT_TEMPLATES.filter((t) => t.visible);
}

export function getTemplatesForUser(userId: string): StartingPointTemplate[] {
  return ALL_STARTING_POINT_TEMPLATES.filter(
    (t) => t.visible || t.assignedUserIds.includes(userId)
  );
}
