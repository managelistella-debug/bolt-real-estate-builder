"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { adminJson } from "@/lib/admin/adminFetch";
import type { BlogPost } from "@/lib/sanity/types";

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<(BlogPost & { categoryId?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminJson<{ post: BlogPost & { categoryId?: string } }>(`/api/admin/blog-posts/${params.id}`)
      .then((res) => setPost(res.post))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div>
      <h2 className="font-heading text-white text-[24px] mb-6" style={{ fontWeight: 400 }}>
        Edit Blog Post
      </h2>
      {loading ? (
        <p className="text-white/50 text-[14px]">Loading...</p>
      ) : post ? (
        <BlogPostForm post={post} />
      ) : (
        <p className="text-white/50 text-[14px]">Post not found.</p>
      )}
    </div>
  );
}
