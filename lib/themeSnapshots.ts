import { Template, Website } from '@/lib/types';

function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createWebsiteFromTemplateSnapshot(template: Template, userId: string): Website {
  const now = new Date();
  const websiteId = `website_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const basePages = cloneDeep(template.defaultPages);

  const pages = basePages.map((page, index) => ({
    ...page,
    id: `page_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6)}`,
    websiteId,
    sections: (page.sections || []).map((section, sectionIndex) => ({
      ...section,
      id: `${section.id}_${sectionIndex}_${Date.now()}`,
    })),
    createdAt: now,
    updatedAt: now,
  }));

  return {
    id: websiteId,
    name: `${template.name} Website`,
    userId,
    templateId: template.id,
    published: false,
    globalStyles: cloneDeep(template.defaultGlobalStyles),
    header: cloneDeep(template.defaultHeader),
    footer: cloneDeep(template.defaultFooter),
    pages,
    createdAt: now,
    updatedAt: now,
  };
}

export function createTemplateFromWebsiteSnapshot(website: Website, templateName: string): Template {
  const basePages = cloneDeep(website.pages);
  return {
    id: `template_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: templateName,
    description: `Snapshot from ${website.name}`,
    industry: ['custom'],
    previewImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    defaultGlobalStyles: cloneDeep(website.globalStyles),
    defaultHeader: cloneDeep(website.header),
    defaultFooter: cloneDeep(website.footer),
    defaultPages: basePages.map((page) => ({
      name: page.name,
      slug: page.slug,
      isHomepage: page.isHomepage,
      sections: cloneDeep(page.sections),
      headerSettings: cloneDeep(page.headerSettings),
      seo: cloneDeep(page.seo),
      status: page.status,
    })),
  };
}
