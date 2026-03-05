import { Template } from '@/lib/types';

export interface StartingPointPage {
  name: string;
  slug: string;
  description: string;
  sections: string[];
}

export interface StartingPointTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  visible: boolean;
  assignedUserIds: string[];
  industry: string[];
  createdAt: Date;
  updatedAt: Date;

  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    headingFile?: string;
    bodyFile?: string;
  };

  pages: StartingPointPage[];

  headerNav: { label: string; href: string }[];
  footerNav: { label: string; href: string }[];

  sampleListingsCount: number;
  sampleBlogPostsCount: number;

  assetsBasePath: string;

  builderTemplate: Template;
}
