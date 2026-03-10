'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { useEmbedConfigsStore, DEFAULT_LISTING_FEED_CONFIG, DEFAULT_TESTIMONIAL_FEED_CONFIG } from '@/lib/stores/embedConfigs';
import { EmbedConfig } from '@/lib/types';
import { Code2, Edit, LayoutGrid, MessageSquareQuote, Plus, Trash2 } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  listing_feed: 'Listing Feed',
  listing_detail: 'Listing Detail',
  testimonial_feed: 'Testimonial Feed',
};

const TYPE_ICONS: Record<string, typeof LayoutGrid> = {
  listing_feed: LayoutGrid,
  listing_detail: Code2,
  testimonial_feed: MessageSquareQuote,
};

export default function EmbedsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const { createConfig, deleteConfig } = useEmbedConfigsStore();
  const [deleting, setDeleting] = useState<string | null>(null);

  const tenantId = user?.businessId || user?.id;

  const configs = useEmbedConfigsStore((state) =>
    state.configs.filter((c) => c.tenantId === tenantId)
  );

  const handleCreateFeed = () => {
    if (!tenantId) return;
    const config = createConfig(
      tenantId,
      'Untitled Listing Feed',
      'listing_feed',
      { ...DEFAULT_LISTING_FEED_CONFIG }
    );
    router.push(`/embeds/listing-feed/${config.id}`);
  };

  const handleCreateTestimonialFeed = () => {
    if (!tenantId) return;
    const config = createConfig(
      tenantId,
      'Untitled Testimonial Feed',
      'testimonial_feed',
      { ...DEFAULT_TESTIMONIAL_FEED_CONFIG }
    );
    router.push(`/embeds/testimonial-feed/${config.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this embed configuration? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteConfig(id);
      toast({ title: 'Embed deleted', description: 'The embed configuration has been removed.' });
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to delete embed', variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));

  return (
    <div
      className="min-h-screen bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Embeds"
          description="Create embeddable listing feeds, testimonial feeds, and detail pages for external websites"
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCreateFeed}
                className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] font-normal text-black transition-colors hover:bg-[#C8ED00]"
              >
                <Plus className="h-3.5 w-3.5" />
                New Listing Feed
              </button>
              <button
                type="button"
                onClick={handleCreateTestimonialFeed}
                className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] font-normal text-black transition-colors hover:bg-[#C8ED00]"
              >
                <Plus className="h-3.5 w-3.5" />
                New Testimonial Feed
              </button>
              <Link
                href="/embeds/listing-detail"
                className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]"
              >
                <Code2 className="h-3.5 w-3.5 text-[#888C99]" />
                Listing Detail Embed
              </Link>
            </div>
          }
        />
      </div>

      <div className="space-y-4 p-6">
        <div className="rounded-xl border border-[#EBEBEB] bg-white">
          {configs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F5F3]">
                <Code2 className="h-5 w-5 text-[#888C99]" />
              </div>
              <p className="text-[15px] text-black">No embeds yet</p>
              <p className="mx-auto mt-1 max-w-sm text-[13px] text-[#888C99]">
                Create a listing feed embed to display your listings on any external website using a simple code snippet.
              </p>
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleCreateFeed}
                  className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Listing Feed
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#EBEBEB]">
              {configs.map((config: EmbedConfig) => {
                const Icon = TYPE_ICONS[config.type] || Code2;
                return (
                  <div
                    key={config.id}
                    className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F3]">
                        <Icon className="h-4 w-4 text-[#888C99]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-medium text-black">
                          {config.name}
                        </h3>
                        <p className="mt-0.5 text-[12px] text-[#888C99]">
                          {TYPE_LABELS[config.type] || config.type}
                          <span className="mx-1.5 text-[#CCCCCC]">&middot;</span>
                          Created {formatDate(config.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Link
                        href={
                          config.type === 'listing_feed'
                            ? `/embeds/listing-feed/${config.id}`
                            : config.type === 'testimonial_feed'
                            ? `/embeds/testimonial-feed/${config.id}`
                            : '/embeds/listing-detail'
                        }
                      >
                        <button
                          type="button"
                          className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(config.id)}
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-[#CCCCCC] transition-colors hover:bg-[#F5F5F3] hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
