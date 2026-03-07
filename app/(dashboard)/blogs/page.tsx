'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { useBlogsStore } from '@/lib/stores/blogs';
import { BlogPost, BlogStatus } from '@/lib/types';
import { BlogFormDialog } from '@/components/blogs/BlogFormDialog';
import { BLOG_STATUS_LABELS, formatBlogDate, getBlogDisplayDate } from '@/lib/blogs';
import { Copy, Edit, ExternalLink, Plus, Settings2, Sparkles, Trash2 } from 'lucide-react';

const STATUS_FILTERS: Array<{ label: string; value: 'all' | BlogStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
];

export default function BlogsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { createBlog, createSampleBlog, updateBlog, deleteBlog, duplicateBlog, getBlogsForCurrentUser, syncAllToDb } = useBlogsStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BlogStatus>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (hasSynced.current) return;
    const tenantId = user?.businessId || user?.id;
    if (tenantId) {
      hasSynced.current = true;
      syncAllToDb(tenantId);
    }
  }, [user, syncAllToDb]);

  const userBlogs = useMemo(
    () => getBlogsForCurrentUser(user?.id),
    [getBlogsForCurrentUser, user?.id]
  );

  const filteredBlogs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return userBlogs.filter((blog) => {
      const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;
      return (
        blog.title.toLowerCase().includes(term) ||
        blog.slug.toLowerCase().includes(term) ||
        (blog.excerpt || '').toLowerCase().includes(term) ||
        (blog.category || '').toLowerCase().includes(term)
      );
    });
  }, [search, statusFilter, userBlogs]);

  const handleCreate = (payload: Omit<BlogPost, 'id' | 'customOrder' | 'createdAt' | 'updatedAt'>) => {
    try {
      createBlog({ ...payload, tenantId: user?.businessId || payload.userId });
      toast({
        title: 'Blog post created',
        description: 'Your blog post has been saved.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not create blog post',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
      throw error;
    }
  };

  const handleUpdate = (payload: Omit<BlogPost, 'id' | 'customOrder' | 'createdAt' | 'updatedAt'>) => {
    if (!editingBlog) return;
    try {
      updateBlog(editingBlog.id, payload);
      setEditingBlog(null);
      toast({
        title: 'Blog post updated',
        description: 'Your changes were saved.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not update blog post',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
      throw error;
    }
  };

  const handleDelete = (blogId: string) => {
    if (!confirm('Delete this blog post? This action cannot be undone.')) return;
    deleteBlog(blogId);
    toast({
      title: 'Blog post deleted',
      description: 'The blog post has been removed.',
    });
  };

  const handleDuplicate = (blogId: string) => {
    duplicateBlog(blogId);
    toast({
      title: 'Blog post duplicated',
      description: 'A draft copy has been created.',
    });
  };

  const handleCreateSample = () => {
    if (!user) return;
    createSampleBlog(user.businessId || user.id);
    toast({
      title: 'Sample blog created',
      description: 'A sample blog post was added so you can preview feed and detail layouts.',
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Blogs"
          description="Manage your CMS blog posts"
          action={
            <div className="flex items-center gap-2">
              <Link href="/blogs/templates">
                <button
                  type="button"
                  className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black inline-flex items-center"
                >
                  <Settings2 className="h-4 w-4 mr-2 text-[#888C99]" />
                  Edit Templates
                </button>
              </Link>
              <button
                type="button"
                className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black inline-flex items-center"
                onClick={handleCreateSample}
              >
                <Sparkles className="h-4 w-4 mr-2 text-[#888C99]" />
                Add Sample Blog
              </button>
              <button
                type="button"
                className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] inline-flex items-center"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Blog Post
              </button>
            </div>
          }
        />
      </div>

      <div className="space-y-4 p-6">
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, slug, excerpt, category"
              className="h-[34px] rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07] px-3 md:max-w-md"
            />
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`h-[30px] rounded-lg px-3 text-[13px] inline-flex items-center ${
                    statusFilter === item.value
                      ? 'bg-black text-white'
                      : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                  }`}
                  onClick={() => setStatusFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#EBEBEB] bg-white">
          {filteredBlogs.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-[15px] font-normal text-black">No blog posts yet</h3>
              <p className="text-[13px] text-[#888C99] mt-2 mb-5">
                Create your first post to start publishing blog content.
              </p>
              <button
                type="button"
                className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] inline-flex items-center mx-auto"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Blog Post
              </button>
              <button
                type="button"
                className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black inline-flex items-center ml-2"
                onClick={handleCreateSample}
              >
                <Sparkles className="h-4 w-4 mr-2 text-[#888C99]" />
                Add Sample Blog
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#EBEBEB]">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-black text-[13px]">{blog.title}</h3>
                      <span className="text-[11px] rounded-full px-2 py-0.5 border border-[#EBEBEB] bg-white text-[#888C99]">
                        {BLOG_STATUS_LABELS[blog.status]}
                      </span>
                      {blog.category && (
                        <span className="text-[11px] rounded-full px-2 py-0.5 bg-[#F5F5F3] text-[#888C99]">
                          {blog.category}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#888C99] mt-1">/{blog.slug}</p>
                    <p className="text-[13px] text-black mt-1 line-clamp-2">{blog.excerpt || 'No excerpt yet.'}</p>
                    <p className="text-[13px] text-[#888C99] mt-1">
                      {blog.status === 'published' ? 'Published' : 'Created'} {formatBlogDate(getBlogDisplayDate(blog))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/blog/${blog.slug}`}>
                      <button
                        type="button"
                        className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black inline-flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2 text-[#888C99]" />
                        View Live
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black inline-flex items-center"
                      onClick={() => setEditingBlog(blog)}
                    >
                      <Edit className="h-4 w-4 mr-2 text-[#888C99]" />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black inline-flex items-center"
                      onClick={() => handleDuplicate(blog.id)}
                    >
                      <Copy className="h-4 w-4 text-[#888C99]" />
                    </button>
                    <button
                      type="button"
                      className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black inline-flex items-center"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash2 className="h-4 w-4 text-[#888C99]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {user && (
        <>
          <BlogFormDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            userId={user.id}
            onSubmit={handleCreate}
          />
          <BlogFormDialog
            open={!!editingBlog}
            onOpenChange={(open) => {
              if (!open) setEditingBlog(null);
            }}
            userId={user.id}
            blog={editingBlog}
            onSubmit={handleUpdate}
            livePreviewHref={editingBlog ? `/blog/${editingBlog.slug}` : undefined}
          />
        </>
      )}
    </div>
  );
}
