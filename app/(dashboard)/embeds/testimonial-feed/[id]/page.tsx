'use client';

import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/stores/auth';
import {
  useEmbedConfigsStore,
  DEFAULT_TESTIMONIAL_FEED_CONFIG,
} from '@/lib/stores/embedConfigs';
import { useTestimonialsStore } from '@/lib/stores/testimonials';
import { TestimonialFeedConfig } from '@/lib/types';
import { TestimonialFeedSettings } from '@/components/embeds/TestimonialFeedSettings';
import { TestimonialFeedPreview } from '@/components/embeds/TestimonialFeedPreview';
import { EmbedCodeDialog } from '@/components/embeds/EmbedCodeDialog';
import { ArrowLeft, Code2, Eye, Save } from 'lucide-react';
import Link from 'next/link';

export default function TestimonialFeedEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { getConfigById, updateConfig } = useEmbedConfigsStore();
  const { getTestimonialsForCurrentUser } = useTestimonialsStore();
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);

  const embedConfig = getConfigById(id);
  const feedConfig = embedConfig?.config as TestimonialFeedConfig | undefined;

  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [name, setName] = useState(embedConfig?.name || 'Untitled Testimonial Feed');
  const [config, setConfig] = useState<TestimonialFeedConfig>({
    ...DEFAULT_TESTIMONIAL_FEED_CONFIG,
    ...(feedConfig || {}),
    responsive: {
      ...DEFAULT_TESTIMONIAL_FEED_CONFIG.responsive,
      ...(feedConfig?.responsive || {}),
    },
  });

  const tenantId = user?.businessId || user?.id;

  const testimonials = useMemo(
    () => getTestimonialsForCurrentUser(user?.id),
    [getTestimonialsForCurrentUser, user?.id]
  );

  const handleSave = useCallback(async () => {
    if (!embedConfig || saving) return;
    setSaving(true);
    try {
      await updateConfig(embedConfig.id, { name, config });
      toast({ title: 'Saved', description: 'Testimonial feed configuration has been saved.' });
    } catch (err) {
      toast({ title: 'Save failed', description: err instanceof Error ? err.message : 'Could not sync to database', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }, [embedConfig, name, config, updateConfig, toast, saving]);

  const handlePreview = useCallback(async () => {
    if (!embedConfig || saving || previewing) return;
    setPreviewing(true);
    try {
      await updateConfig(embedConfig.id, { name, config });
      window.open(`/embed/testimonial-feed/${embedConfig.id}`, '_blank', 'noopener,noreferrer');
    } catch (err) {
      toast({ title: 'Preview failed', description: err instanceof Error ? err.message : 'Could not open preview', variant: 'destructive' });
    } finally {
      setPreviewing(false);
    }
  }, [embedConfig, saving, previewing, updateConfig, name, config, toast]);

  if (!embedConfig) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#F5F5F3]"
        style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
      >
        <div className="text-center">
          <p className="text-[15px] text-black">Embed not found</p>
          <Link
            href="/embeds"
            className="mt-2 inline-block text-[13px] text-[#888C99] hover:text-black"
          >
            &larr; Back to Embeds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#EBEBEB] bg-white px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/embeds"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EBEBEB] text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-[14px] font-medium text-black">Testimonial Feed Editor</h1>
            <p className="text-[12px] text-[#888C99]">{name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={saving || previewing}
            className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-black transition-colors hover:bg-[#F5F5F3] disabled:opacity-60"
          >
            <Eye className="h-3.5 w-3.5 text-[#888C99]" />
            {previewing ? 'Opening...' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={() => setShowEmbedCode(true)}
            className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]"
          >
            <Code2 className="h-3.5 w-3.5 text-[#888C99]" />
            Get Embed Code
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] font-normal text-black transition-colors hover:bg-[#C8ED00] disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Split panel */}
      <div className="flex min-h-0 flex-1">
        {/* Left - Settings */}
        <div className="w-[340px] shrink-0 overflow-y-auto border-r border-[#EBEBEB] bg-white p-5">
          <TestimonialFeedSettings
            name={name}
            config={config}
            onNameChange={setName}
            onConfigChange={setConfig}
            testimonials={testimonials}
            breakpoint={breakpoint}
            onBreakpointChange={setBreakpoint}
          />
        </div>

        {/* Right - Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <h2 className="text-[13px] font-medium text-black">Preview</h2>
            <p className="text-[12px] text-[#888C99]">
              Live preview using your CMS testimonials
            </p>
          </div>
          <TestimonialFeedPreview
            config={config}
            testimonials={testimonials}
            breakpoint={breakpoint}
            onBreakpointChange={setBreakpoint}
          />
        </div>
      </div>

      {showEmbedCode && tenantId && (
        <EmbedCodeDialog
          embedId={embedConfig.id}
          tenantId={tenantId}
          type="testimonial_feed"
          open={showEmbedCode}
          onOpenChange={setShowEmbedCode}
        />
      )}
    </div>
  );
}
