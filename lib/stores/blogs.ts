import { create } from 'zustand';
import { BlogPost, BlogSortOption, BlogStatus } from '@/lib/types';
import { useTenantContextStore } from './tenantContext';

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

function rowToBlog(r: any): BlogPost {
  return normalizeBlog({
    id: r.id,
    userId: r.user_id,
    tenantId: r.tenant_id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt ?? undefined,
    metaDescription: r.meta_description ?? undefined,
    contentHtml: r.content_html,
    featuredImage: r.featured_image ?? undefined,
    authorName: r.author_name ?? undefined,
    tags: r.tags ?? [],
    category: r.category ?? undefined,
    status: r.status,
    templateId: r.template_id,
    customOrder: r.custom_order,
    publishedAt: r.published_at ? new Date(r.published_at) : undefined,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  });
}

function blogToRow(b: BlogPost, tenantId: string) {
  return {
    id: b.id,
    tenant_id: tenantId,
    user_id: b.userId,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt ?? null,
    meta_description: b.metaDescription ?? null,
    content_html: b.contentHtml,
    featured_image: b.featuredImage ?? null,
    author_name: b.authorName ?? null,
    tags: b.tags,
    category: b.category ?? null,
    status: b.status,
    template_id: b.templateId,
    custom_order: b.customOrder,
    published_at: b.publishedAt ? (b.publishedAt instanceof Date ? b.publishedAt.toISOString() : b.publishedAt) : null,
    created_at: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
    updated_at: b.updatedAt instanceof Date ? b.updatedAt.toISOString() : b.updatedAt,
  };
}

function persistToApi(row: ReturnType<typeof blogToRow>) {
  fetch('/api/data/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  }).catch(() => undefined);
}

function deleteFromApi(id: string) {
  fetch(`/api/data/blogs?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => undefined);
}

export const useBlogsStore = create<BlogsState>()(
  (set, get) => ({
    blogs: [],
    loaded: false,
    loading: false,

    fetchBlogs: async (tenantId) => {
      if (get().loading) return;
      set({ loading: true });
      try {
        const res = await fetch(`/api/data/blogs?tenantId=${encodeURIComponent(tenantId)}`);
        if (!res.ok) throw new Error('fetch failed');
        const rows = await res.json();
        set({ blogs: rows.map(rowToBlog), loaded: true });
      } catch {
        set({ loaded: true });
      } finally {
        set({ loading: false });
      }
    },

    createBlog: (payload) => {
      const blogs = get().blogs;
      const slug = ensureUniqueSlug(slugify(payload.slug || payload.title), blogs);
      const now = new Date();
      const tenantId = payload.tenantId || payload.userId;
      const blog: BlogPost = {
        ...payload,
        id: `blog_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        slug,
        customOrder: blogs.length,
        createdAt: now,
        updatedAt: now,
      };
      set((state) => ({ blogs: [...state.blogs, normalizeBlog(blog)] }));
      persistToApi(blogToRow(blog, tenantId));
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
      let updatedPost: BlogPost | undefined;
      set((state) => ({
        blogs: state.blogs.map((post) => {
          if (post.id !== id) return post;
          const nextTitle = updates.title ?? post.title;
          const nextBaseSlug = updates.slug || slugify(nextTitle);
          const nextSlug = ensureUniqueSlug(nextBaseSlug, state.blogs, id);
          updatedPost = normalizeBlog({
            ...post,
            ...updates,
            slug: nextSlug,
            updatedAt: new Date(),
            tags: updates.tags ?? post.tags,
          });
          return updatedPost;
        }),
      }));
      if (updatedPost) {
        const tenantId = updatedPost.tenantId || updatedPost.userId;
        persistToApi(blogToRow(updatedPost, tenantId));
      }
    },

    deleteBlog: (id) => {
      set((state) => ({ blogs: state.blogs.filter((p) => p.id !== id) }));
      deleteFromApi(id);
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
  })
);
