'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BlogPost, BlogPostTemplateId, BlogStatus } from '@/lib/types';
import { BLOG_SEO_LIMITS, blogSchema } from '@/lib/validation/schemas';
import { BLOG_SEO_RECOMMENDATIONS } from '@/lib/blogs';
import { useBlogTemplatesStore } from '@/lib/stores/blogTemplates';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WysiwygEditor } from './WysiwygEditor';
import { ImageUpload } from '@/components/builder/ImageUpload';
import { ExternalLink } from 'lucide-react';

interface BlogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blog?: BlogPost | null;
  onSubmit: (payload: Omit<BlogPost, 'id' | 'customOrder' | 'createdAt' | 'updatedAt'>) => void;
  userId: string;
  livePreviewHref?: string;
}

type BlogDraft = {
  title: string;
  slug: string;
  excerpt: string;
  metaDescription: string;
  contentHtml: string;
  featuredImage: string;
  authorName: string;
  category: string;
  tags: string;
  status: BlogStatus;
  templateId: BlogPostTemplateId;
  publishedAt: string;
};

const createDefaultDraft = (): BlogDraft => ({
  title: '',
  slug: '',
  excerpt: '',
  metaDescription: '',
  contentHtml: '<p></p>',
  featuredImage: '',
  authorName: '',
  category: '',
  tags: '',
  status: 'draft',
  templateId: 'classic',
  publishedAt: '',
});

const mapBlogToDraft = (blog: BlogPost): BlogDraft => ({
  title: blog.title,
  slug: blog.slug,
  excerpt: blog.excerpt || '',
  metaDescription: blog.metaDescription || '',
  contentHtml: blog.contentHtml || '<p></p>',
  featuredImage: blog.featuredImage || '',
  authorName: blog.authorName || '',
  category: blog.category || '',
  tags: blog.tags.join(', '),
  status: blog.status,
  templateId: blog.templateId,
  publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0, 10) : '',
});

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

function LimitLabel({
  label,
  valueLength,
  min,
  max,
  recommendation,
}: {
  label: string;
  valueLength: number;
  min: number;
  max: number;
  recommendation: string;
}) {
  const inRange = valueLength >= min && valueLength <= max;
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <span className={`text-xs ${inRange ? 'text-muted-foreground' : 'text-amber-600'}`}>
        {valueLength} chars - {recommendation}
      </span>
    </div>
  );
}

export function BlogFormDialog({
  open,
  onOpenChange,
  blog,
  onSubmit,
  userId,
  livePreviewHref,
}: BlogFormDialogProps) {
  const { activeTemplateId } = useBlogTemplatesStore();
  const [draft, setDraft] = useState<BlogDraft>(createDefaultDraft());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(blog ? mapBlogToDraft(blog) : createDefaultDraft());
    setError(null);
  }, [blog, open]);

  useEffect(() => {
    if (!open) return;
    setDraft((prev) => ({ ...prev, templateId: activeTemplateId || 'classic' }));
  }, [open, activeTemplateId]);

  const dialogTitle = useMemo(() => (blog ? 'Edit Blog Post' : 'Create Blog Post'), [blog]);

  const handleSubmit = () => {
    setError(null);
    const parsed = blogSchema.safeParse({
      ...draft,
      templateId: activeTemplateId || draft.templateId || 'classic',
      excerpt: draft.excerpt || undefined,
      metaDescription: draft.metaDescription || undefined,
      featuredImage: draft.featuredImage || undefined,
      authorName: draft.authorName || undefined,
      category: draft.category || undefined,
      tags: draft.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      publishedAt: draft.publishedAt ? new Date(draft.publishedAt) : undefined,
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setError(firstIssue?.message || 'Please review the blog fields.');
      return;
    }

    try {
      onSubmit({
        ...parsed.data,
        userId,
      });
      onOpenChange(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save blog post.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>Manage SEO fields and body content for your blog post.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="blog-title">Title</Label>
            <Input
              id="blog-title"
              value={draft.title}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  title: event.target.value,
                  slug: blog ? prev.slug : slugify(event.target.value),
                }))
              }
              placeholder="How to stage your home before listing"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-slug">Slug</Label>
            <Input
              id="blog-slug"
              value={draft.slug}
              onChange={(event) => setDraft((prev) => ({ ...prev, slug: slugify(event.target.value) }))}
              placeholder="how-to-stage-your-home"
            />
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <Input value="Uses active blog template (set in Blogs > Templates)" readOnly />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={draft.status}
              onValueChange={(value: BlogStatus) => setDraft((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-published-at">Publish Date</Label>
            <Input
              id="blog-published-at"
              type="date"
              value={draft.publishedAt}
              onChange={(event) => setDraft((prev) => ({ ...prev, publishedAt: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-author">Author (optional)</Label>
            <Input
              id="blog-author"
              value={draft.authorName}
              onChange={(event) => setDraft((prev) => ({ ...prev, authorName: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blog-category">Category (optional)</Label>
            <Input
              id="blog-category"
              value={draft.category}
              onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="blog-tags">Tags (comma separated)</Label>
            <Input
              id="blog-tags"
              value={draft.tags}
              onChange={(event) => setDraft((prev) => ({ ...prev, tags: event.target.value }))}
              placeholder="selling, staging, pricing"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="blog-featured-image">Featured Image (thumbnail)</Label>
            <ImageUpload
              value={draft.featuredImage}
              onChange={(nextImage) => setDraft((prev) => ({ ...prev, featuredImage: nextImage }))}
              preserveOriginal
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <LimitLabel
              label="Excerpt"
              valueLength={draft.excerpt.length}
              min={BLOG_SEO_LIMITS.excerpt.recommendedMin}
              max={BLOG_SEO_LIMITS.excerpt.recommendedMax}
              recommendation={BLOG_SEO_RECOMMENDATIONS.excerpt}
            />
            <Textarea
              rows={3}
              value={draft.excerpt}
              onChange={(event) => setDraft((prev) => ({ ...prev, excerpt: event.target.value }))}
              placeholder="Short summary shown in feeds and previews."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <LimitLabel
              label="Meta Description"
              valueLength={draft.metaDescription.length}
              min={BLOG_SEO_LIMITS.metaDescription.recommendedMin}
              max={BLOG_SEO_LIMITS.metaDescription.recommendedMax}
              recommendation={BLOG_SEO_RECOMMENDATIONS.metaDescription}
            />
            <Textarea
              rows={3}
              value={draft.metaDescription}
              onChange={(event) => setDraft((prev) => ({ ...prev, metaDescription: event.target.value }))}
              placeholder="Search snippet summary."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <WysiwygEditor
              value={draft.contentHtml}
              onChange={(nextValue) => setDraft((prev) => ({ ...prev, contentHtml: nextValue }))}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter className="flex items-center justify-between gap-2">
          <div className="mr-auto">
            {livePreviewHref && (
              <Link href={livePreviewHref}>
                <Button type="button" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live
                </Button>
              </Link>
            )}
          </div>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {blog ? 'Save Changes' : 'Create Blog Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
