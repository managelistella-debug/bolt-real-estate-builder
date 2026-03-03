'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BlogPost, BlogPostTemplateId, BlogStatus } from '@/lib/types';
import { BLOG_SEO_LIMITS, blogSchema } from '@/lib/validation/schemas';
import { BLOG_SEO_RECOMMENDATIONS } from '@/lib/blogs';
import { useBlogTemplatesStore } from '@/lib/stores/blogTemplates';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  title: string; slug: string; excerpt: string; metaDescription: string; contentHtml: string;
  featuredImage: string; authorName: string; category: string; tags: string; status: BlogStatus;
  templateId: BlogPostTemplateId; publishedAt: string;
};

const createDefaultDraft = (): BlogDraft => ({
  title: '', slug: '', excerpt: '', metaDescription: '', contentHtml: '<p></p>',
  featuredImage: '', authorName: '', category: '', tags: '', status: 'draft',
  templateId: 'classic', publishedAt: '',
});

const mapBlogToDraft = (blog: BlogPost): BlogDraft => ({
  title: blog.title, slug: blog.slug, excerpt: blog.excerpt || '', metaDescription: blog.metaDescription || '',
  contentHtml: blog.contentHtml || '<p></p>', featuredImage: blog.featuredImage || '', authorName: blog.authorName || '',
  category: blog.category || '', tags: blog.tags.join(', '), status: blog.status, templateId: blog.templateId,
  publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0, 10) : '',
});

const slugify = (v: string) => v.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const darkInput = 'h-[34px] w-full rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white placeholder:text-white/30 focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const darkTextarea = 'w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const darkLabel = 'text-[13px] text-white/50';
const darkSelectTrigger = 'flex h-[34px] w-full items-center rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white';
const darkSelectContent = 'rounded-lg border border-white/10 bg-[#1e1e1e] text-[13px] text-white';

function LimitLabel({ label, valueLength, min, max, recommendation }: { label: string; valueLength: number; min: number; max: number; recommendation: string }) {
  const inRange = valueLength >= min && valueLength <= max;
  return (
    <div className="flex items-center justify-between">
      <label className={darkLabel}>{label}</label>
      <span className={`text-[11px] ${inRange ? 'text-white/30' : 'text-amber-400'}`}>{valueLength} chars – {recommendation}</span>
    </div>
  );
}

export function BlogFormDialog({ open, onOpenChange, blog, onSubmit, userId, livePreviewHref }: BlogFormDialogProps) {
  const { activeTemplateId } = useBlogTemplatesStore();
  const [draft, setDraft] = useState<BlogDraft>(createDefaultDraft());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!open) return; setDraft(blog ? mapBlogToDraft(blog) : createDefaultDraft()); setError(null); }, [blog, open]);
  useEffect(() => { if (!open) return; setDraft((p) => ({ ...p, templateId: activeTemplateId || 'classic' })); }, [open, activeTemplateId]);

  const dialogTitle = useMemo(() => (blog ? 'Edit Blog Post' : 'Create Blog Post'), [blog]);

  const handleSubmit = () => {
    setError(null);
    const parsed = blogSchema.safeParse({
      ...draft, templateId: activeTemplateId || draft.templateId || 'classic',
      excerpt: draft.excerpt || undefined, metaDescription: draft.metaDescription || undefined,
      featuredImage: draft.featuredImage || undefined, authorName: draft.authorName || undefined,
      category: draft.category || undefined,
      tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean),
      publishedAt: draft.publishedAt ? new Date(draft.publishedAt) : undefined,
    });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || 'Please review the blog fields.'); return; }
    try { onSubmit({ ...parsed.data, userId }); onOpenChange(false); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to save blog post.'); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>Manage SEO fields and body content for your blog post.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <label className={darkLabel}>Title</label>
            <input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value, slug: blog ? p.slug : slugify(e.target.value) }))} placeholder="How to stage your home before listing" className={darkInput} />
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Slug</label>
            <input value={draft.slug} onChange={(e) => setDraft((p) => ({ ...p, slug: slugify(e.target.value) }))} placeholder="how-to-stage-your-home" className={darkInput} />
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Template</label>
            <input value="Uses active blog template (set in Blogs › Templates)" readOnly className={`${darkInput} opacity-60`} />
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Status</label>
            <Select value={draft.status} onValueChange={(v: BlogStatus) => setDraft((p) => ({ ...p, status: v }))}>
              <SelectTrigger className={darkSelectTrigger}><SelectValue /></SelectTrigger>
              <SelectContent className={darkSelectContent}>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Publish Date</label>
            <input type="date" value={draft.publishedAt} onChange={(e) => setDraft((p) => ({ ...p, publishedAt: e.target.value }))} className={darkInput} />
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Author (optional)</label>
            <input value={draft.authorName} onChange={(e) => setDraft((p) => ({ ...p, authorName: e.target.value }))} className={darkInput} />
          </div>

          <div className="space-y-1.5">
            <label className={darkLabel}>Category (optional)</label>
            <input value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))} className={darkInput} />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className={darkLabel}>Tags (comma separated)</label>
            <input value={draft.tags} onChange={(e) => setDraft((p) => ({ ...p, tags: e.target.value }))} placeholder="selling, staging, pricing" className={darkInput} />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className={darkLabel}>Featured Image (thumbnail)</label>
            <ImageUpload value={draft.featuredImage} onChange={(v) => setDraft((p) => ({ ...p, featuredImage: v }))} preserveOriginal />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <LimitLabel label="Excerpt" valueLength={draft.excerpt.length} min={BLOG_SEO_LIMITS.excerpt.recommendedMin} max={BLOG_SEO_LIMITS.excerpt.recommendedMax} recommendation={BLOG_SEO_RECOMMENDATIONS.excerpt} />
            <textarea rows={3} value={draft.excerpt} onChange={(e) => setDraft((p) => ({ ...p, excerpt: e.target.value }))} placeholder="Short summary shown in feeds and previews." className={darkTextarea} />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <LimitLabel label="Meta Description" valueLength={draft.metaDescription.length} min={BLOG_SEO_LIMITS.metaDescription.recommendedMin} max={BLOG_SEO_LIMITS.metaDescription.recommendedMax} recommendation={BLOG_SEO_RECOMMENDATIONS.metaDescription} />
            <textarea rows={3} value={draft.metaDescription} onChange={(e) => setDraft((p) => ({ ...p, metaDescription: e.target.value }))} placeholder="Search snippet summary." className={darkTextarea} />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <WysiwygEditor value={draft.contentHtml} onChange={(v) => setDraft((p) => ({ ...p, contentHtml: v }))} />
          </div>
        </div>

        {error && <p className="text-[13px] text-red-400">{error}</p>}

        <DialogFooter className="flex items-center justify-between gap-2">
          <div className="mr-auto">
            {livePreviewHref && (
              <Link href={livePreviewHref}>
                <button type="button" className="flex h-[30px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/50 hover:bg-white/10 hover:text-white">
                  <ExternalLink className="h-3.5 w-3.5" /> View Live
                </button>
              </Link>
            )}
          </div>
          <button type="button" onClick={() => onOpenChange(false)} className="h-[30px] rounded-lg border border-white/10 bg-white/5 px-3 text-[13px] text-white/50 hover:bg-white/10 hover:text-white">Cancel</button>
          <button type="button" onClick={handleSubmit} className="h-[30px] rounded-lg bg-[#DAFF07] px-4 text-[13px] text-black hover:bg-[#C8ED00]">{blog ? 'Save Changes' : 'Create Blog Post'}</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
