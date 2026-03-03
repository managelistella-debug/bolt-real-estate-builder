import { Website } from '@/lib/types';
import { mockTemplates } from './templates';

export const mockWebsites: Website[] = [
  {
    id: 'website-1',
    name: 'John\'s Plumbing Services',
    userId: '3',
    templateId: 'template-1',
    domain: 'johnsplumbing.com',
    published: true,
    globalStyles: mockTemplates[0].defaultGlobalStyles,
    header: {
      ...mockTemplates[0].defaultHeader,
      logo: 'https://via.placeholder.com/150x50/3b82f6/ffffff?text=John\'s+Plumbing',
      phone: '(555) 123-4567',
      email: 'john@plumbing.com',
    },
    footer: {
      ...mockTemplates[0].defaultFooter,
      phone: '(555) 123-4567',
      email: 'john@plumbing.com',
      address: '123 Main St, Anytown, USA 12345',
      socialLinks: [
        { id: 'social-1', platform: 'facebook', url: 'https://facebook.com/johnsplumbing' },
      ],
    },
    pages: mockTemplates[0].defaultPages.map((page, index) => ({
      ...page,
      id: `page-${index + 1}`,
      websiteId: 'website-1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
    })),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
];
