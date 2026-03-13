'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/stores/auth';
import { useListingsStore } from '@/lib/stores/listings';
import {
  useEmbedConfigsStore,
  DEFAULT_LISTING_DETAIL_CONFIG,
} from '@/lib/stores/embedConfigs';
import { ListingDetailEmbedConfig } from '@/lib/types';
import { EmbedCodeDialog } from '@/components/embeds/EmbedCodeDialog';
import { EmbedListingDetail } from '@/components/embeds/EmbedListingDetail';
import { ArrowLeft, Code2, Eye, Save } from 'lucide-react';

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-2">
      <span className="text-[13px] text-black">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-[#DAFF07]' : 'bg-[#EBEBEB]'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`}
        />
      </button>
    </label>
  );
}

export default function ListingDetailEmbedPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { getListingsForCurrentUser } = useListingsStore();
  const { configs, createConfig, updateConfig, getConfigsForTenant } =
    useEmbedConfigsStore();
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const tenantId = user?.businessId || user?.id;

  const existingDetailConfig = useMemo(() => {
    if (!tenantId) return undefined;
    return getConfigsForTenant(tenantId).find(
      (c) => c.type === 'listing_detail'
    );
  }, [getConfigsForTenant, tenantId, configs]);

  const [config, setConfig] = useState<ListingDetailEmbedConfig>(
    (existingDetailConfig?.config as ListingDetailEmbedConfig) ||
      DEFAULT_LISTING_DETAIL_CONFIG
  );
  const listings = useMemo(
    () => getListingsForCurrentUser(user?.id),
    [getListingsForCurrentUser, user?.id]
  );
  const previewListing = listings[0];

  const mappedPreviewListing = useMemo(() => {
    if (!previewListing) return null;
    return {
      id: previewListing.id,
      slug: previewListing.slug,
      address: previewListing.address,
      description: previewListing.description,
      list_price: previewListing.listPrice,
      neighborhood: previewListing.neighborhood,
      city: previewListing.city,
      listing_status: previewListing.listingStatus,
      bedrooms: previewListing.bedrooms,
      bathrooms: previewListing.bathrooms,
      property_type: previewListing.propertyType,
      year_built: previewListing.yearBuilt,
      living_area_sqft: previewListing.livingAreaSqft,
      lot_area_value: previewListing.lotAreaValue,
      lot_area_unit: previewListing.lotAreaUnit,
      taxes_annual: previewListing.taxesAnnual,
      listing_brokerage: previewListing.listingBrokerage,
      mls_number: previewListing.mlsNumber,
      representation: previewListing.representation,
      gallery: (previewListing.gallery || []).map((image) => ({
        id: image.id,
        url: image.url,
        caption: image.caption,
        order: image.order,
      })),
      thumbnail: previewListing.thumbnail || previewListing.gallery?.[0]?.url,
    };
  }, [previewListing]);

  const update = useCallback(
    (partial: Partial<ListingDetailEmbedConfig>) => {
      setConfig((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  const handleSave = () => {
    if (!tenantId) return;
    if (existingDetailConfig) {
      updateConfig(existingDetailConfig.id, { config });
    } else {
      createConfig(tenantId, 'Listing Detail', 'listing_detail', config);
    }
    toast({
      title: 'Saved',
      description: 'Listing detail embed configuration saved.',
    });
  };

  const handlePreview = useCallback(async () => {
    if (!tenantId || previewing) return;
    const firstListing = listings[0];
    if (!firstListing?.slug) {
      toast({
        title: 'Preview unavailable',
        description: 'Add at least one listing to open listing-detail preview.',
        variant: 'destructive',
      });
      return;
    }

    setPreviewing(true);
    try {
      if (existingDetailConfig) {
        await updateConfig(existingDetailConfig.id, { config });
      } else {
        createConfig(tenantId, 'Listing Detail', 'listing_detail', config);
      }
      window.open(`/embed/listing-detail/${tenantId}/${firstListing.slug}`, '_blank', 'noopener,noreferrer');
    } catch (err) {
      toast({
        title: 'Preview failed',
        description: err instanceof Error ? err.message : 'Could not open preview',
        variant: 'destructive',
      });
    } finally {
      setPreviewing(false);
    }
  }, [tenantId, previewing, listings, toast, existingDetailConfig, updateConfig, config, createConfig]);

  return (
    <div
      className="min-h-screen bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Listing Detail Embed"
          description="Configure the embeddable listing detail page"
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreview}
                disabled={previewing}
                className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-black transition-colors hover:bg-[#F5F5F3] disabled:opacity-60"
              >
                <Eye className="h-3.5 w-3.5 text-[#888C99]" />
                {previewing ? 'Opening...' : 'Preview'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (existingDetailConfig) {
                    setShowEmbedCode(true);
                  } else {
                    handleSave();
                    setTimeout(() => setShowEmbedCode(true), 100);
                  }
                }}
                className="flex h-[30px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-black transition-colors hover:bg-[#F5F5F3]"
              >
                <Code2 className="h-3.5 w-3.5 text-[#888C99]" />
                Get Embed Code
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex h-[30px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] font-normal text-black transition-colors hover:bg-[#C8ED00]"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
          }
        />
      </div>

      <div className="border-b border-[#EBEBEB] bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <Link
            href="/embeds"
            className="rounded-lg border border-[#EBEBEB] bg-white px-3 py-1.5 text-[13px] text-[#888C99] transition-colors hover:bg-[#F5F5F3] hover:text-black"
          >
            Listing Feed Editor
          </Link>
          <span className="rounded-lg bg-black px-3 py-1.5 text-[13px] text-white">
            Listing Detail Appearance
          </span>
        </div>
      </div>

      <div className="flex min-h-0">
        <div className="w-[360px] shrink-0 overflow-y-auto border-r border-[#EBEBEB] bg-white p-5">
          <Link
            href="/embeds"
            className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-[#888C99] hover:text-black"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Embeds
          </Link>

          <div className="rounded-xl border border-[#EBEBEB] bg-white p-4">
            <h3 className="mb-3 text-[13px] font-medium text-black">Visible Sections</h3>
            <div className="divide-y divide-[#EBEBEB]">
              <Toggle label="Photo Gallery" checked={config.showGallery} onChange={(v) => update({ showGallery: v })} />
              <Toggle label="Mortgage Calculator" checked={config.showMortgageCalculator} onChange={(v) => update({ showMortgageCalculator: v })} />
              <Toggle label="Property Details" checked={config.showPropertyDetails} onChange={(v) => update({ showPropertyDetails: v })} />
              <Toggle label="Contact Form" checked={config.showContactForm} onChange={(v) => update({ showContactForm: v })} />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#EBEBEB] bg-white p-4">
            <h3 className="mb-3 text-[13px] font-medium text-black">Agent Contact Info</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#888C99]">Name</label>
                <input
                  value={config.agentName}
                  onChange={(e) => update({ agentName: e.target.value })}
                  placeholder="Jane Doe"
                  className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#888C99]">Email</label>
                <input
                  type="email"
                  value={config.agentEmail}
                  onChange={(e) => update({ agentEmail: e.target.value })}
                  placeholder="jane@example.com"
                  className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#888C99]">Phone</label>
                <input
                  type="tel"
                  value={config.agentPhone}
                  onChange={(e) => update({ agentPhone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#EBEBEB] bg-white p-4">
            <h3 className="mb-3 text-[13px] font-medium text-black">Call to Action</h3>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#888C99]">CTA Button Label</label>
              <input
                value={config.ctaLabel}
                onChange={(e) => update({ ctaLabel: e.target.value })}
                placeholder="Schedule a Tour"
                className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="mb-1 text-[13px] font-medium text-black">Visual Preview</h2>
          <p className="mb-4 text-[12px] text-[#888C99]">Live detail-page preview using your current settings.</p>
          <div className="rounded-xl border border-[#EBEBEB] bg-white p-3">
            {mappedPreviewListing ? (
              <EmbedListingDetail listing={mappedPreviewListing as any} config={config as any} />
            ) : (
              <div className="p-10 text-center text-[13px] text-[#888C99]">
                Add at least one listing to see the detail-page preview.
              </div>
            )}
          </div>
        </div>
      </div>

      {showEmbedCode && tenantId && existingDetailConfig && (
        <EmbedCodeDialog
          embedId={existingDetailConfig.id}
          tenantId={tenantId}
          type="listing_detail"
          open={showEmbedCode}
          onOpenChange={setShowEmbedCode}
        />
      )}
    </div>
  );
}
