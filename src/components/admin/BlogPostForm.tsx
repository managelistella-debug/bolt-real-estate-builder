"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { adminJson, uploadImage } from "@/lib/admin/adminFetch";
import { imageUrl } from "@/lib/sanity/image";
import { slugify } from "@/lib/sanity/slugify";
import RichTextEditor from "./RichTextEditor";
import type { BlogCategory, BlogPost, PortableTextContent, SanityImageRef } from "@/lib/sanity/types";

interface BlogPostFormProps {
  post?: BlogPost & { categoryId?: string };
}

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = !!post?._id;
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const authorImageInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug?.current ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [categoryId, setCategoryId] = useState(post?.categoryId ?? "");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [publishedDate, setPublishedDate] = useState(post?.publishedDate ?? new Date().toISOString().slice(0, 10));
  const [authorName, setAuthorName] = useState(post?.authorName ?? "Aspen Muraski");
  const [authorImage, setAuthorImage] = useState<SanityImageRef | undefined>(post?.authorImage);
  const [featuredImage, setFeaturedImage] = useState<SanityImageRef | undefined>(post?.featuredImage);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState<PortableTextContent>(post?.content ?? []);
  const [published, setPublished] = useState(post?.published ?? false);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminJson<{ categories: BlogCategory[] }>("/api/admin/blog-categories").then((res) =>
      setCategories(res.categories)
    );
  }, []);

  function handleTitleChange(next: string) {
    setTitle(next);
    if (!slugTouched) setSlug(slugify(next));
  }

  async function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const { category } = await adminJson<{ category: BlogCategory }>("/api/admin/blog-categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    setCategories((prev) => [...prev, category].sort((a, b) => a.name.localeCompare(b.name)));
    setCategoryId(category._id);
    setNewCategoryName("");
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleFeaturedImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setFeaturedImage(await uploadImage(file));
    } finally {
      setUploading(false);
      if (featuredImageInputRef.current) featuredImageInputRef.current.value = "";
    }
  }

  async function handleAuthorImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setAuthorImage(await uploadImage(file));
    } finally {
      setUploading(false);
      if (authorImageInputRef.current) authorImageInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug: slug || slugify(title),
      categoryId: categoryId || null,
      publishedDate,
      authorName,
      authorImage,
      featuredImage,
      excerpt,
      tags,
      content,
      published,
    };

    try {
      if (isEdit) {
        await adminJson(`/api/admin/blog-posts/${post!._id}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminJson("/api/admin/blog-posts", { method: "POST", body: JSON.stringify(payload) });
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit || !confirm("Delete this post? This can't be undone.")) return;
    await adminJson(`/api/admin/blog-posts/${post!._id}`, { method: "DELETE" });
    router.push("/admin/blog");
    router.refresh();
  }

  const inputClass =
    "w-full bg-[rgba(17,61,53,0.4)] border border-white/15 px-3 py-2 text-white text-[14px] placeholder:text-white/30 outline-none focus:border-[#daaf3a]";
  const labelClass = "block text-white/50 text-[12px] mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-[820px]">
      {error && <p className="text-red-400 text-[13px] mb-4">{error}</p>}

      <div className="mb-4">
        <label className={labelClass}>Title</label>
        <input className={inputClass} value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
      </div>

      <div className="mb-4">
        <label className={labelClass}>Slug</label>
        <input
          className={inputClass}
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>Category</label>
          <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2 mt-2">
            <input
              className={inputClass}
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button type="button" onClick={handleAddCategory} className="shrink-0 px-3 border border-white/20 text-white/70 hover:border-[#daaf3a] text-[13px]">
              Add
            </button>
          </div>
        </div>
        <div>
          <label className={labelClass}>Published Date</label>
          <input className={inputClass} type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Author Name</label>
          <input className={inputClass} value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Author Image</label>
          {authorImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl(authorImage, 100) || ""} alt="" className="w-[48px] h-[48px] rounded-full object-cover mb-2" />
          )}
          <input ref={authorImageInputRef} type="file" accept="image/*" onChange={handleAuthorImageSelect} className="text-white/60 text-[13px]" />
        </div>
      </div>

      <div className="mb-4">
        <label className={labelClass}>Featured Image</label>
        {featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl(featuredImage, 400) || ""} alt="" className="w-[220px] h-[130px] object-cover mb-2" />
        )}
        <input ref={featuredImageInputRef} type="file" accept="image/*" onChange={handleFeaturedImageSelect} className="text-white/60 text-[13px]" />
      </div>

      <div className="mb-4">
        <label className={labelClass}>Excerpt</label>
        <textarea className={`${inputClass} h-[80px] resize-y`} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </div>

      <div className="mb-6">
        <label className={labelClass}>Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 border border-white/20 text-white/70 text-[12px]">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-white/40 hover:text-red-400">
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          className={inputClass}
          placeholder="Type a tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
        />
      </div>

      <div className="mb-8">
        <label className={labelClass}>Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <label className="flex items-center gap-1.5 text-white/80 text-[13px] mb-6">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving || uploading} className="gold-gradient-bg text-[#09312a] font-semibold text-[13px] px-5 py-2.5 disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="border border-red-400/40 text-red-400 hover:border-red-400 text-[13px] px-4 py-2.5">
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
