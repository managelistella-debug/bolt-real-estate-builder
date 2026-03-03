'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  const { createBlog, createSampleBlog, updateBlog, deleteBlog, duplicateBlog, getBlogsForCurrentUser } = useBlogsStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BlogStatus>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

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
      createBlog(payload);
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
    createSampleBlog(user.id);
    toast({
      title: 'Sample blog created',
      description: 'A sample blog post was added so you can preview feed and detail layouts.',
    });
  };

  return (
    <div>
      <Header
        title="Blogs"
        description="Manage your CMS blog posts"
        action={
          <div className="flex items-center gap-2">
            <Link href="/blogs/templates">
              <Button variant="outline">
                <Settings2 className="h-4 w-4 mr-2" />
                Edit Templates
              </Button>
            </Link>
            <Button variant="outline" onClick={handleCreateSample}>
              <Sparkles className="h-4 w-4 mr-2" />
              Add Sample Blog
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-4">
        <Card className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, slug, excerpt, category"
              className="md:max-w-md"
            />
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  variant={statusFilter === item.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          {filteredBlogs.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-lg font-semibold">No blog posts yet</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-5">
                Create your first post to start publishing blog content.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Blog Post
              </Button>
              <Button variant="outline" className="ml-2" onClick={handleCreateSample}>
                <Sparkles className="h-4 w-4 mr-2" />
                Add Sample Blog
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{blog.title}</h3>
                      <Badge variant="outline">{BLOG_STATUS_LABELS[blog.status]}</Badge>
                      {blog.category && <Badge variant="secondary">{blog.category}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">/{blog.slug}</p>
                    <p className="text-sm mt-1 line-clamp-2">{blog.excerpt || 'No excerpt yet.'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {blog.status === 'published' ? 'Published' : 'Created'} {formatBlogDate(getBlogDisplayDate(blog))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/blog/${blog.slug}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => setEditingBlog(blog)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDuplicate(blog.id)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(blog.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
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
