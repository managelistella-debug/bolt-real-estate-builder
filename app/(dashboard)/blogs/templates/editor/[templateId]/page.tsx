'use client';

import { useParams } from 'next/navigation';
import { BlogTemplateEditor } from '@/components/blogs/BlogTemplateEditor';

export default function BlogTemplateEditorPage() {
  const params = useParams<{ templateId: string }>();
  return <BlogTemplateEditor templateId={params.templateId} />;
}
