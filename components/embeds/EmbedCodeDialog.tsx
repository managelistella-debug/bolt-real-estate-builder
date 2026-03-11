'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, Copy } from 'lucide-react';

interface EmbedCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  embedId: string;
  tenantId: string;
  type: 'listing_feed' | 'listing_detail' | 'testimonial_feed' | 'blog_feed';
  slug?: string;
}

export function EmbedCodeDialog({
  open,
  onOpenChange,
  embedId,
  tenantId,
  type,
  slug,
}: EmbedCodeDialogProps) {
  const [tab, setTab] = useState<'script' | 'iframe'>('script');
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com';

  const scriptFeedSnippet = `<div data-bolt-embed="listing-feed"
     data-tenant-id="${tenantId}"
     data-embed-id="${embedId}"></div>
<script src="${origin}/embed/bolt-embed.js" async></script>`;

  const scriptDetailSnippet = `<div data-bolt-embed="listing-detail"
     data-tenant-id="${tenantId}"
     data-slug-from-url="true"
     data-url-pattern="/listings/:slug"></div>
<script src="${origin}/embed/bolt-embed.js" async></script>`;

  const iframeFeedSnippet = `<iframe
  src="${origin}/embed/listing-feed/${embedId}"
  style="width:100%;min-height:600px;border:none;"
  loading="lazy"
  title="Listing Feed"
></iframe>`;

  const iframeDetailSnippet = `<iframe
  src="${origin}/embed/listing-detail/${tenantId}/${slug || '{slug}'}"
  style="width:100%;min-height:800px;border:none;"
  loading="lazy"
  title="Listing Detail"
></iframe>`;

  const scriptTestimonialSnippet = `<div data-bolt-embed="testimonial-feed"
     data-tenant-id="${tenantId}"
     data-embed-id="${embedId}"></div>
<script src="${origin}/embed/bolt-embed.js" async></script>`;

  const iframeTestimonialSnippet = `<iframe
  src="${origin}/embed/testimonial-feed/${embedId}"
  style="width:100%;min-height:400px;border:none;"
  loading="lazy"
  title="Testimonial Feed"
></iframe>`;

  const scriptBlogSnippet = `<div data-bolt-embed="blog-feed"
     data-tenant-id="${tenantId}"
     data-embed-id="${embedId}"></div>
<script src="${origin}/embed/bolt-embed.js" async></script>`;

  const iframeBlogSnippet = `<iframe
  src="${origin}/embed/blog-feed/${embedId}"
  style="width:100%;min-height:700px;border:none;"
  loading="lazy"
  title="Blog Feed"
></iframe>`;

  const scriptSnippet = type === 'testimonial_feed'
    ? scriptTestimonialSnippet
    : type === 'blog_feed'
      ? scriptBlogSnippet
      : type === 'listing_feed'
        ? scriptFeedSnippet
        : scriptDetailSnippet;
  const iframeSnippet = type === 'testimonial_feed'
    ? iframeTestimonialSnippet
    : type === 'blog_feed'
      ? iframeBlogSnippet
      : type === 'listing_feed'
        ? iframeFeedSnippet
        : iframeDetailSnippet;
  const activeCode = tab === 'script' ? scriptSnippet : iframeSnippet;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-medium">
            Embed Code
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-1.5 rounded-lg bg-[#F5F5F3] p-1">
            <button
              type="button"
              onClick={() => { setTab('script'); setCopied(false); }}
              className={`flex-1 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                tab === 'script'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888C99] hover:text-black'
              }`}
            >
              Script Embed
            </button>
            <button
              type="button"
              onClick={() => { setTab('iframe'); setCopied(false); }}
              className={`flex-1 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                tab === 'iframe'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888C99] hover:text-black'
              }`}
            >
              iframe Embed
            </button>
          </div>

          {/* Description */}
          <div className="rounded-lg bg-[#F5F5F3] p-3">
            {tab === 'script' ? (
              <p className="text-[12px] text-[#888C99]">
                <strong className="text-black">Recommended for SEO.</strong>{' '}
                This snippet injects listing content directly into your page&apos;s DOM,
                making it crawlable by search engines. Place the code where you want
                the {type === 'listing_feed' ? 'listing feed' : type === 'testimonial_feed' ? 'testimonial feed' : type === 'blog_feed' ? 'blog feed' : 'listing detail'} to appear.
              </p>
            ) : (
              <p className="text-[12px] text-[#888C99]">
                <strong className="text-black">Style-isolated.</strong>{' '}
                This iframe loads the {type === 'listing_feed' ? 'listing feed' : type === 'testimonial_feed' ? 'testimonial feed' : type === 'blog_feed' ? 'blog feed' : 'listing detail'}{' '}
                in a sandboxed frame. Styles won&apos;t conflict with your site,
                but content is less accessible to search engines.
              </p>
            )}
          </div>

          {/* Code block */}
          <div className="relative">
            <pre className="max-h-60 overflow-auto rounded-lg border border-[#EBEBEB] bg-[#1a1a1a] p-4 text-[12px] leading-5 text-[#e0e0e0]">
              <code>{activeCode}</code>
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-3 top-3 flex h-7 items-center gap-1.5 rounded-md bg-white/10 px-2.5 text-[12px] text-white/70 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Additional instructions for detail embed */}
          {type === 'listing_detail' && tab === 'script' && (
            <div className="rounded-lg border border-[#EBEBEB] bg-white p-3">
              <p className="text-[12px] font-medium text-black">Setup Instructions</p>
              <ol className="mt-1.5 list-inside list-decimal space-y-1 text-[12px] text-[#888C99]">
                <li>Create a page template on your site at the URL pattern (e.g., /listings/[slug])</li>
                <li>Paste this embed code where you want the listing details to appear</li>
                <li>The script reads the slug from the URL and renders the matching listing</li>
                <li>Each listing will have its own unique URL for SEO</li>
              </ol>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
