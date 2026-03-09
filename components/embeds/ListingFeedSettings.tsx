'use client';

import { useCallback, useState } from 'react';
import {
  ListingFeedConfig,
  ListingStatus,
  CardLayout,
  StatusBadgePosition,
  EmbedTypographyEntry,
  EmbedResponsiveOverrides,
} from '@/lib/types';
import { LISTING_STATUS_LABELS } from '@/lib/listings';
import { Check, ChevronDown, ChevronRight, X } from 'lucide-react';

// ── Reusable Inputs ──────────────────────────────────────────────────────────

function ChipInput({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = options.filter(
    (o) => o.toLowerCase().includes(query.toLowerCase()) && !selected.includes(o)
  );
  const add = (value: string) => { onChange([...selected, value]); setQuery(''); setOpen(false); };
  const remove = (value: string) => { onChange(selected.filter((v) => v !== value)); };

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {selected.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-md bg-[#F5F5F3] px-2 py-1 text-[12px] text-black">
            {v}
            <button type="button" onClick={() => remove(v)} className="text-[#888C99] hover:text-black"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="relative mt-1.5">
        <input value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 200)} placeholder={`Search ${label.toLowerCase()}...`} className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]" />
        {open && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-lg border border-[#EBEBEB] bg-white shadow-lg">
            {filtered.map((opt) => (
              <button key={opt} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(opt)} className="flex w-full items-center px-3 py-2 text-left text-[13px] text-black hover:bg-[#F5F5F3]">{opt}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="flex w-full items-center justify-between py-1">
      <p className="text-[12px] font-medium uppercase tracking-widest text-[#CCCCCC]">{label}</p>
      {open ? <ChevronDown className="h-3.5 w-3.5 text-[#CCCCCC]" /> : <ChevronRight className="h-3.5 w-3.5 text-[#CCCCCC]" />}
    </button>
  );
}

function SliderInput({ label, value, onChange, min = 0, max = 48, unit = 'px' }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; unit?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">{label}</label>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[#EBEBEB] accent-black" />
        <span className="w-14 text-right text-[12px] text-[#888C99]">{value}{unit}</span>
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex-1 text-[12px] font-medium text-[#888C99]">{label}</label>
      <div className="flex items-center gap-1.5">
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="h-6 w-6 cursor-pointer rounded border border-[#EBEBEB] bg-transparent p-0" />
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" className="h-[28px] w-[80px] rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[11px] text-black placeholder:text-[#CCC]" />
      </div>
    </div>
  );
}

const SYSTEM_FONTS = ['', 'Inter', 'Geist', 'system-ui', 'Georgia', 'Playfair Display', 'Lora', 'Merriweather', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Raleway'];

function TypographySection({ label, entry, onChange }: { label: string; entry: EmbedTypographyEntry; onChange: (e: EmbedTypographyEntry) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-[#EBEBEB] bg-[#FAFAFA] p-2.5">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between">
        <span className="text-[12px] font-medium text-black">{label}</span>
        {open ? <ChevronDown className="h-3 w-3 text-[#888C99]" /> : <ChevronRight className="h-3 w-3 text-[#888C99]" />}
      </button>
      {open && (
        <div className="mt-2.5 space-y-2.5">
          <div>
            <label className="mb-1 block text-[11px] text-[#888C99]">Font</label>
            <select value={entry.fontFamily} onChange={(e) => onChange({ ...entry, fontFamily: e.target.value })} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[12px] text-black">
              <option value="">Default</option>
              {SYSTEM_FONTS.filter(Boolean).map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-[#888C99]">Size</label>
              <input type="number" min={8} max={48} value={entry.fontSize} onChange={(e) => onChange({ ...entry, fontSize: Number(e.target.value) || 12 })} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[12px] text-black" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-[#888C99]">Color</label>
              <div className="flex items-center gap-1">
                <input type="color" value={entry.color || '#000000'} onChange={(e) => onChange({ ...entry, color: e.target.value })} className="h-[28px] w-[28px] cursor-pointer rounded border border-[#EBEBEB] bg-transparent p-0" />
                <input value={entry.color} onChange={(e) => onChange({ ...entry, color: e.target.value })} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[11px] text-black" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Settings ────────────────────────────────────────────────────────────

const ALL_STATUSES: ListingStatus[] = ['for_sale', 'pending', 'sold'];
const CARD_LAYOUTS: { value: CardLayout; label: string; desc: string }[] = [
  { value: 'classic', label: 'Classic', desc: 'Image + details box' },
  { value: 'overlay', label: 'Overlay', desc: 'Text on image' },
  { value: 'minimal', label: 'Minimal', desc: 'Centered text' },
  { value: 'split_info', label: 'Split Info', desc: 'Left/right details' },
];
const BADGE_POSITIONS: { value: StatusBadgePosition; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'hidden', label: 'Hidden' },
];

interface ListingFeedSettingsProps {
  name: string;
  config: ListingFeedConfig;
  onNameChange: (name: string) => void;
  onConfigChange: (config: ListingFeedConfig) => void;
  distinctValues: { cities: string[]; neighborhoods: string[]; propertyTypes: string[]; statuses: string[] };
}

export function ListingFeedSettings({ name, config, onNameChange, onConfigChange, distinctValues }: ListingFeedSettingsProps) {
  const update = useCallback((partial: Partial<ListingFeedConfig>) => { onConfigChange({ ...config, ...partial }); }, [config, onConfigChange]);
  const updateFilters = useCallback((partial: Partial<ListingFeedConfig['filters']>) => { onConfigChange({ ...config, filters: { ...config.filters, ...partial } }); }, [config, onConfigChange]);
  const toggleStatus = (status: ListingStatus) => {
    const cur = config.filters.statuses;
    updateFilters({ statuses: cur.includes(status) ? cur.filter((s) => s !== status) : [...cur, status] });
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    style: true, badge: false, image: false, spacing: false, appearance: false, typography: false, responsive: true, filters: true, sort: false, detail: false,
  });
  const toggle = (key: string) => setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const [responsiveTab, setResponsiveTab] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const updateResponsive = (bp: 'tablet' | 'mobile', partial: Partial<EmbedResponsiveOverrides>) => {
    update({ responsive: { ...config.responsive, [bp]: { ...config.responsive[bp], ...partial } } });
  };

  return (
    <div className="space-y-5">
      {/* Name */}
      <div>
        <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Feed Name</label>
        <input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Active Listings" className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]" />
      </div>

      {/* Card Style */}
      <div>
        <SectionHeader label="Card Style" open={openSections.style} onToggle={() => toggle('style')} />
        {openSections.style && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {CARD_LAYOUTS.map((l) => (
              <button key={l.value} type="button" onClick={() => update({ cardLayout: l.value })} className={`rounded-lg border p-2.5 text-left transition-colors ${config.cardLayout === l.value ? 'border-black bg-black/5' : 'border-[#EBEBEB] hover:border-[#CCCCCC]'}`}>
                <p className={`text-[12px] font-medium ${config.cardLayout === l.value ? 'text-black' : 'text-[#555]'}`}>{l.label}</p>
                <p className="mt-0.5 text-[11px] text-[#888C99]">{l.desc}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div>
        <SectionHeader label="Status Badge" open={openSections.badge} onToggle={() => toggle('badge')} />
        {openSections.badge && (
          <div className="mt-2 space-y-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Position</label>
              <div className="flex gap-1.5">
                {BADGE_POSITIONS.map((p) => (
                  <button key={p.value} type="button" onClick={() => update({ statusBadgePosition: p.value })} className={`flex h-[30px] flex-1 items-center justify-center rounded-lg text-[12px] transition-colors ${config.statusBadgePosition === p.value ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>{p.label}</button>
                ))}
              </div>
            </div>
            <ColorInput label="Background" value={config.statusBadge.bg} onChange={(bg) => update({ statusBadge: { ...config.statusBadge, bg } })} />
            <ColorInput label="Text Color" value={config.statusBadge.color} onChange={(color) => update({ statusBadge: { ...config.statusBadge, color } })} />
            <ColorInput label="Border" value={config.statusBadge.borderColor} onChange={(borderColor) => update({ statusBadge: { ...config.statusBadge, borderColor } })} />
            <SliderInput label="Radius" value={config.statusBadge.radius} onChange={(radius) => update({ statusBadge: { ...config.statusBadge, radius } })} min={0} max={999} />
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#888C99]">Font Size</label>
              <input type="number" min={8} max={24} value={config.statusBadge.fontSize} onChange={(e) => update({ statusBadge: { ...config.statusBadge, fontSize: Number(e.target.value) || 11 } })} className="h-[30px] w-20 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black" />
            </div>
          </div>
        )}
      </div>

      {/* Image */}
      <div>
        <SectionHeader label="Image" open={openSections.image} onToggle={() => toggle('image')} />
        {openSections.image && (
          <div className="mt-2 space-y-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Height</label>
              <div className="flex items-center gap-2">
                <input type="number" min={50} max={800} value={config.imageHeight.value} onChange={(e) => update({ imageHeight: { ...config.imageHeight, value: Number(e.target.value) || 200 } })} className="h-[30px] w-20 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black" />
                <div className="flex rounded-lg border border-[#EBEBEB]">
                  {(['px', 'vh'] as const).map((u) => (
                    <button key={u} type="button" onClick={() => update({ imageHeight: { ...config.imageHeight, unit: u } })} className={`h-[30px] px-2.5 text-[12px] transition-colors ${config.imageHeight.unit === u ? 'bg-black text-white' : 'bg-white text-[#888C99] hover:text-black'} ${u === 'px' ? 'rounded-l-lg' : 'rounded-r-lg'}`}>{u}</button>
                  ))}
                </div>
              </div>
            </div>
            <SliderInput label="Image Radius" value={config.imageRadius} onChange={(v) => update({ imageRadius: v })} max={32} />
          </div>
        )}
      </div>

      {/* Spacing */}
      <div>
        <SectionHeader label="Spacing" open={openSections.spacing} onToggle={() => toggle('spacing')} />
        {openSections.spacing && (
          <div className="mt-2">
            <SliderInput label="Column Gap" value={config.gap} onChange={(v) => update({ gap: v })} min={0} max={48} />
          </div>
        )}
      </div>

      {/* Card Appearance */}
      <div>
        <SectionHeader label="Card Appearance" open={openSections.appearance} onToggle={() => toggle('appearance')} />
        {openSections.appearance && (
          <div className="mt-2 space-y-3">
            <SliderInput label="Card Radius" value={config.cardRadius} onChange={(v) => update({ cardRadius: v })} max={32} />
            <SliderInput label="Details Box Radius" value={config.detailsBoxRadius} onChange={(v) => update({ detailsBoxRadius: v })} max={32} />
            <ColorInput label="Details Background" value={config.detailsBoxBg} onChange={(v) => update({ detailsBoxBg: v })} />
            <ColorInput label="Border Color" value={config.detailsBoxBorder} onChange={(v) => update({ detailsBoxBorder: v })} />
            <div className="flex items-center gap-2">
              <label className="flex-1 text-[12px] font-medium text-[#888C99]">Drop Shadow</label>
              <button type="button" onClick={() => update({ dropShadow: !config.dropShadow })} className={`flex h-[26px] w-[26px] items-center justify-center rounded-md border ${config.dropShadow ? 'border-black bg-black text-white' : 'border-[#EBEBEB] bg-white text-transparent'}`}>
                <Check className="h-3 w-3" />
              </button>
            </div>
            {config.cardLayout === 'minimal' && (
              <div className="flex items-center gap-2">
                <label className="flex-1 text-[12px] font-medium text-[#888C99]">Show Representation</label>
                <button type="button" onClick={() => update({ showRepresentation: !config.showRepresentation })} className={`flex h-[26px] w-[26px] items-center justify-center rounded-md border ${config.showRepresentation ? 'border-black bg-black text-white' : 'border-[#EBEBEB] bg-white text-transparent'}`}>
                  <Check className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Typography */}
      <div>
        <SectionHeader label="Typography" open={openSections.typography} onToggle={() => toggle('typography')} />
        {openSections.typography && (
          <div className="mt-2 space-y-2">
            <TypographySection label="Address" entry={config.typography.address} onChange={(address) => update({ typography: { ...config.typography, address } })} />
            <TypographySection label="City" entry={config.typography.city} onChange={(city) => update({ typography: { ...config.typography, city } })} />
            <TypographySection label="Price" entry={config.typography.price} onChange={(price) => update({ typography: { ...config.typography, price } })} />
            <TypographySection label="Specs (Beds/Baths/Sqft)" entry={config.typography.specs} onChange={(specs) => update({ typography: { ...config.typography, specs } })} />
          </div>
        )}
      </div>

      {/* Responsive + Columns */}
      <div>
        <SectionHeader label="Layout & Responsive" open={openSections.responsive} onToggle={() => toggle('responsive')} />
        {openSections.responsive && (
          <div className="mt-2 space-y-3">
            {/* Breakpoint tabs */}
            <div className="flex rounded-lg border border-[#EBEBEB]">
              {(['desktop', 'tablet', 'mobile'] as const).map((bp) => (
                <button key={bp} type="button" onClick={() => setResponsiveTab(bp)} className={`flex-1 py-1.5 text-[12px] capitalize transition-colors ${responsiveTab === bp ? 'bg-black text-white' : 'bg-white text-[#888C99] hover:text-black'} ${bp === 'desktop' ? 'rounded-l-lg' : bp === 'mobile' ? 'rounded-r-lg' : ''}`}>{bp}</button>
              ))}
            </div>

            {/* Columns for current breakpoint */}
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">
                Columns {responsiveTab !== 'desktop' && <span className="text-[#CCC]">(inherit: {responsiveTab === 'tablet' ? config.columns : (config.responsive.tablet.columns || config.columns)})</span>}
              </label>
              <div className="flex gap-1.5">
                {([1, 2, 3] as const).map((col) => {
                  const active = responsiveTab === 'desktop'
                    ? config.columns === col
                    : config.responsive[responsiveTab].columns === col;
                  return (
                    <button key={col} type="button" onClick={() => {
                      if (responsiveTab === 'desktop') update({ columns: col });
                      else updateResponsive(responsiveTab, { columns: col });
                    }} className={`flex h-[30px] flex-1 items-center justify-center rounded-lg text-[12px] transition-colors ${active ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>
                      {col} Col{col > 1 ? 's' : ''}
                    </button>
                  );
                })}
                {responsiveTab !== 'desktop' && config.responsive[responsiveTab].columns && (
                  <button type="button" onClick={() => updateResponsive(responsiveTab, { columns: undefined })} className="flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-2 text-[11px] text-[#888C99] hover:text-black">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Image height override for non-desktop */}
            {responsiveTab !== 'desktop' && (
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Image Height Override</label>
                {config.responsive[responsiveTab].imageHeight ? (
                  <div className="flex items-center gap-2">
                    <input type="number" min={50} max={800} value={config.responsive[responsiveTab].imageHeight!.value} onChange={(e) => updateResponsive(responsiveTab, { imageHeight: { ...config.responsive[responsiveTab].imageHeight!, value: Number(e.target.value) || 200 } })} className="h-[30px] w-20 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black" />
                    <button type="button" onClick={() => updateResponsive(responsiveTab, { imageHeight: undefined })} className="flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-2 text-[11px] text-[#888C99] hover:text-black"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => updateResponsive(responsiveTab, { imageHeight: { value: config.imageHeight.value, unit: config.imageHeight.unit } })} className="text-[12px] text-[#888C99] underline hover:text-black">Customize</button>
                )}
              </div>
            )}

            {/* Items per page (desktop only) */}
            {responsiveTab === 'desktop' && (
              <>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Items Per Page</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} max={100} value={config.itemsPerPage === 'unlimited' ? '' : config.itemsPerPage} disabled={config.itemsPerPage === 'unlimited'} onChange={(e) => update({ itemsPerPage: parseInt(e.target.value, 10) || 9 })} placeholder="9" className="h-[30px] w-20 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black placeholder:text-[#CCC] disabled:opacity-50" />
                    <button type="button" onClick={() => update({ itemsPerPage: config.itemsPerPage === 'unlimited' ? 9 : 'unlimited' })} className={`flex h-[30px] items-center gap-1.5 rounded-lg px-3 text-[12px] transition-colors ${config.itemsPerPage === 'unlimited' ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>
                      {config.itemsPerPage === 'unlimited' && <Check className="h-3 w-3" />}
                      Unlimited
                    </button>
                  </div>
                </div>
                {config.itemsPerPage !== 'unlimited' && (
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Pagination</label>
                    <div className="flex gap-1.5">
                      {([{ value: 'pagination', label: 'Page Numbers' }, { value: 'load_more', label: 'Load More' }, { value: 'none', label: 'None' }] as const).map((opt) => (
                        <button key={opt.value} type="button" onClick={() => update({ paginationType: opt.value })} className={`flex h-[30px] flex-1 items-center justify-center rounded-lg text-[12px] transition-colors ${config.paginationType === opt.value ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>{opt.label}</button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div>
        <SectionHeader label="Filters" open={openSections.filters} onToggle={() => toggle('filters')} />
        {openSections.filters && (
          <div className="mt-2 space-y-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Status</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_STATUSES.map((status) => (
                  <button key={status} type="button" onClick={() => toggleStatus(status)} className={`flex h-[28px] items-center gap-1.5 rounded-lg px-2.5 text-[12px] transition-colors ${config.filters.statuses.includes(status) ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>
                    {config.filters.statuses.includes(status) && <Check className="h-3 w-3" />}
                    {LISTING_STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
              {config.filters.statuses.length === 0 && <p className="mt-1 text-[11px] text-[#CCCCCC]">No filter = show all statuses</p>}
            </div>
            <ChipInput label="City" options={distinctValues.cities} selected={config.filters.cities} onChange={(cities) => updateFilters({ cities })} />
            <ChipInput label="Neighborhood" options={distinctValues.neighborhoods} selected={config.filters.neighborhoods} onChange={(neighborhoods) => updateFilters({ neighborhoods })} />
            <ChipInput label="Property Type" options={distinctValues.propertyTypes} selected={config.filters.propertyTypes} onChange={(propertyTypes) => updateFilters({ propertyTypes })} />
          </div>
        )}
      </div>

      {/* Sort */}
      <div>
        <SectionHeader label="Sort" open={openSections.sort} onToggle={() => toggle('sort')} />
        {openSections.sort && (
          <div className="mt-2">
            <select value={config.sortBy} onChange={(e) => update({ sortBy: e.target.value as ListingFeedConfig['sortBy'] })} className="h-[30px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="custom_order">Custom Order</option>
            </select>
          </div>
        )}
      </div>

      {/* Detail URL */}
      <div>
        <SectionHeader label="Listing Detail URL" open={openSections.detail} onToggle={() => toggle('detail')} />
        {openSections.detail && (
          <div className="mt-2">
            <input value={config.detailPageUrlPattern} onChange={(e) => update({ detailPageUrlPattern: e.target.value })} placeholder="/listings/{slug}" className="h-[30px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black placeholder:text-[#CCC]" />
            <p className="mt-1 text-[11px] text-[#CCCCCC]">Use {'{slug}'} as the placeholder. Example: /listings/{'{slug}'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
