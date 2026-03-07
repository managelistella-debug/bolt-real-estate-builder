import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BlogPost, BlogSortOption, BlogStatus } from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

function blogToDbRow(b: BlogPost) {
  return {
    id: b.id,
    tenant_id: b.tenantId || b.userId,
    user_id: b.userId,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt || null,
    meta_description: b.metaDescription || null,
    content_html: b.contentHtml,
    featured_image: b.featuredImage || null,
    author_name: b.authorName || null,
    tags: b.tags || [],
    category: b.category || null,
    status: b.status,
    template_id: b.templateId || 'classic',
    custom_order: b.customOrder,
    published_at: b.publishedAt ? new Date(b.publishedAt).toISOString() : null,
  };
}

function syncBlogToDb(blog: BlogPost) {
  fetch('/api/data/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogToDbRow(blog)),
  }).catch(() => {});
}

function deleteBlogFromDb(id: string) {
  fetch(`/api/data/blogs?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
}

interface BlogsFilterConfig {
  statuses?: BlogStatus[];
  sortBy?: BlogSortOption;
  category?: string;
  search?: string;
}

interface BlogsState {
  blogs: BlogPost[];
  loaded: boolean;
  loading: boolean;
  fetchBlogs: (tenantId: string) => Promise<void>;
  createBlog: (payload: Omit<BlogPost, 'id' | 'customOrder' | 'createdAt' | 'updatedAt'>) => BlogPost;
  createSampleBlog: (userId: string) => BlogPost;
  updateBlog: (id: string, updates: Partial<Omit<BlogPost, 'id' | 'userId' | 'createdAt'>>) => void;
  deleteBlog: (id: string) => void;
  duplicateBlog: (id: string) => void;
  getBlogsForCurrentUser: (userId?: string) => BlogPost[];
  getBlogBySlug: (slug: string) => BlogPost | undefined;
  filterAndSortBlogs: (blogs: BlogPost[], config?: BlogsFilterConfig) => BlogPost[];
  syncAllToDb: (overrideTenantId?: string) => void;
}

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const ensureUniqueSlug = (baseSlug: string, blogs: BlogPost[], excludeId?: string): string => {
  const initialSlug = baseSlug || 'blog-post';
  const used = new Set(blogs.filter((p) => (excludeId ? p.id !== excludeId : true)).map((p) => p.slug));
  if (!used.has(initialSlug)) return initialSlug;
  let index = 2;
  while (used.has(`${initialSlug}-${index}`)) index += 1;
  return `${initialSlug}-${index}`;
};

const toDate = (value: Date | string | number | undefined) => new Date(value ?? Date.now());

const normalizeBlog = (post: BlogPost): BlogPost => ({
  ...post,
  createdAt: toDate(post.createdAt),
  updatedAt: toDate(post.updatedAt),
  publishedAt: post.publishedAt ? toDate(post.publishedAt) : undefined,
  tags: Array.isArray(post.tags) ? post.tags : [],
  templateId:
    post.templateId === 'newsletter' ? 'classic'
    : post.templateId === 'insights' ? 'feature'
    : post.templateId || 'classic',
});

export const useBlogsStore = create<BlogsState>()(
  persist(
    (set, get) => ({
      blogs: [],
      loaded: false,
      loading: false,

      fetchBlogs: async () => {
        set({ loaded: true });
      },

      createBlog: (payload) => {
        const blogs = get().blogs;
        const slug = ensureUniqueSlug(slugify(payload.slug || payload.title), blogs);
        const now = new Date();
        const blog: BlogPost = {
          ...payload,
          tenantId: payload.tenantId || payload.userId,
          id: `blog_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          slug,
          customOrder: blogs.length,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ blogs: [...state.blogs, normalizeBlog(blog)] }));
        syncBlogToDb(blog);
        return blog;
      },

      createSampleBlog: (userId) => {
        return get().createBlog({
          userId,
          title: 'How to Prepare Your Home for a Successful Spring Sale',
          slug: 'prepare-home-spring-sale',
          excerpt: 'Use this simple checklist to improve curb appeal, stage key rooms, and attract stronger offers.',
          metaDescription: 'A practical spring home-selling checklist.',
          contentHtml: '<h2>Start With Curb Appeal</h2><p>First impressions happen before buyers walk through the front door.</p>',
          featuredImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
          authorName: 'Hannah Cole',
          tags: ['home selling', 'staging', 'real estate'],
          category: 'Seller Tips',
          status: 'published',
          templateId: 'classic',
          publishedAt: new Date(),
        });
      },

      updateBlog: (id, updates) => {
        set((state) => ({
          blogs: state.blogs.map((post) => {
            if (post.id !== id) return post;
            const nextTitle = updates.title ?? post.title;
            const nextBaseSlug = updates.slug || slugify(nextTitle);
            const nextSlug = ensureUniqueSlug(nextBaseSlug, state.blogs, id);
            const updated = normalizeBlog({
              ...post,
              ...updates,
              slug: nextSlug,
              updatedAt: new Date(),
              tags: updates.tags ?? post.tags,
            });
            syncBlogToDb(updated);
            return updated;
          }),
        }));
      },

      deleteBlog: (id) => {
        set((state) => ({ blogs: state.blogs.filter((p) => p.id !== id) }));
        deleteBlogFromDb(id);
      },

      duplicateBlog: (id) => {
        const existing = get().blogs.find((p) => p.id === id);
        if (!existing) return;
        get().createBlog({
          ...existing,
          title: `${existing.title} Copy`,
          slug: `${existing.slug}-copy`,
          status: 'draft',
          tags: [...existing.tags],
          publishedAt: undefined,
        });
      },

      getBlogsForCurrentUser: (userId) => {
        const normalizedBlogs = get().blogs.map(normalizeBlog);
        const effectiveUserId = userId || useTenantContextStore.getState().effectiveUserId;
        if (!effectiveUserId) return [];
        return normalizedBlogs.filter((p) => p.userId === effectiveUserId);
      },

      getBlogBySlug: (slug) => {
        const effectiveUserId = useTenantContextStore.getState().effectiveUserId;
        if (!effectiveUserId) return undefined;
        const post = get().blogs.find((item) => item.slug === slug && item.userId === effectiveUserId);
        return post ? normalizeBlog(post) : undefined;
      },

      syncAllToDb: (overrideTenantId) => {
        const blogs = get().blogs;
        blogs.forEach((b) => {
          const row = blogToDbRow(overrideTenantId ? { ...b, tenantId: overrideTenantId } : b);
          fetch('/api/data/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(row),
          }).catch(() => {});
        });
      },

      filterAndSortBlogs: (blogs, config) => {
        const statuses = config?.statuses || [];
        const sortBy = config?.sortBy || 'date_desc';
        const categoryFilter = (config?.category || '').trim().toLowerCase();
        const searchFilter = (config?.search || '').trim().toLowerCase();
        const filtered = blogs.filter((post) => {
          const statusMatch = !statuses.length || statuses.includes(post.status);
          const categoryMatch = !categoryFilter || (post.category || '').toLowerCase().includes(categoryFilter);
          const searchMatch =
            !searchFilter ||
            post.title.toLowerCase().includes(searchFilter) ||
            (post.excerpt || '').toLowerCase().includes(searchFilter) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchFilter));
          return statusMatch && categoryMatch && searchMatch;
        });
        const sorted = [...filtered];
        if (sortBy === 'title_asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === 'title_desc') sorted.sort((a, b) => b.title.localeCompare(a.title));
        if (sortBy === 'custom_order') sorted.sort((a, b) => a.customOrder - b.customOrder);
        if (sortBy === 'date_desc') sorted.sort((a, b) => toDate(b.publishedAt || b.createdAt).getTime() - toDate(a.publishedAt || a.createdAt).getTime());
        if (sortBy === 'date_asc') sorted.sort((a, b) => toDate(a.publishedAt || a.createdAt).getTime() - toDate(b.publishedAt || b.createdAt).getTime());
        return sorted.map(normalizeBlog);
      },
    }),
    {
      name: 'blogs-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ blogs: state.blogs }),
    }
  )
);
