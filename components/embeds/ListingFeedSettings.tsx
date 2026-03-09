'use client';

import { useCallback, useState } from 'react';
import {
  ListingFeedConfig,
  ListingStatus,
  CardLayout,
  StatusBadgePosition,
  EmbedTypographyEntry,
  EmbedResponsiveOverrides,
  EmbedButtonStyle,
} from '@/lib/types';
import { LISTING_STATUS_LABELS } from '@/lib/listings';
import { Check, ChevronDown, ChevronRight, Plus, Trash2, X } from 'lucide-react';

// ── Gradient helpers ────────────────────────────────────────────────────────

interface GradientStop { color: string; position: number; }

function parseGradient(value: string): { angle: number; stops: GradientStop[] } | null {
  const m = value.match(/^linear-gradient\(\s*(\d+)deg\s*,\s*(.+)\)$/);
  if (!m) return null;
  const angle = parseInt(m[1]);
  const stopsRaw = m[2].split(',').map((s) => s.trim());
  const stops: GradientStop[] = stopsRaw.map((s) => {
    const parts = s.split(/\s+/);
    return { color: parts[0], position: parseInt(parts[1]) || 0 };
  });
  return { angle, stops };
}

function buildGradient(angle: number, stops: GradientStop[]): string {
  return `linear-gradient(${angle}deg, ${stops.map((s) => `${s.color} ${s.position}%`).join(', ')})`;
}

function isGradient(v: string) { return v?.startsWith('linear-gradient'); }

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

function ColorOrGradientInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const gradient = isGradient(value) ? parseGradient(value) : null;
  const mode = gradient ? 'gradient' : 'solid';
  const [localStops, setLocalStops] = useState<GradientStop[]>(gradient?.stops || [{ color: '#000000', position: 0 }, { color: '#ffffff', position: 100 }]);
  const [localAngle, setLocalAngle] = useState(gradient?.angle || 135);

  const switchToGradient = () => {
    const stops = [{ color: value || '#000000', position: 0 }, { color: '#ffffff', position: 100 }];
    setLocalStops(stops);
    setLocalAngle(135);
    onChange(buildGradient(135, stops));
  };

  const switchToSolid = () => {
    onChange(localStops[0]?.color || '#000000');
  };

  const updateStop = (idx: number, patch: Partial<GradientStop>) => {
    const next = localStops.map((s, i) => i === idx ? { ...s, ...patch } : s);
    setLocalStops(next);
    onChange(buildGradient(localAngle, next));
  };

  const addStop = () => {
    const next = [...localStops, { color: '#888888', position: 50 }].sort((a, b) => a.position - b.position);
    setLocalStops(next);
    onChange(buildGradient(localAngle, next));
  };

  const removeStop = (idx: number) => {
    if (localStops.length <= 2) return;
    const next = localStops.filter((_, i) => i !== idx);
    setLocalStops(next);
    onChange(buildGradient(localAngle, next));
  };

  const changeAngle = (a: number) => {
    setLocalAngle(a);
    onChange(buildGradient(a, localStops));
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[12px] font-medium text-[#888C99]">{label}</label>
        <div className="flex rounded-md border border-[#EBEBEB]">
          <button type="button" onClick={mode === 'gradient' ? switchToSolid : undefined} className={`px-2 py-0.5 text-[10px] ${mode === 'solid' ? 'bg-black text-white' : 'bg-white text-[#888C99] hover:text-black'} rounded-l-md`}>Solid</button>
          <button type="button" onClick={mode === 'solid' ? switchToGradient : undefined} className={`px-2 py-0.5 text-[10px] ${mode === 'gradient' ? 'bg-black text-white' : 'bg-white text-[#888C99] hover:text-black'} rounded-r-md`}>Gradient</button>
        </div>
      </div>

      {mode === 'solid' ? (
        <div className="flex items-center gap-1.5">
          <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="h-6 w-6 cursor-pointer rounded border border-[#EBEBEB] bg-transparent p-0" />
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" className="h-[28px] w-[80px] rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[11px] text-black placeholder:text-[#CCC]" />
        </div>
      ) : (
        <div className="space-y-2">
          <div
            className="h-6 w-full rounded-md border border-[#EBEBEB]"
            style={{ background: value }}
          />
          {localStops.map((stop, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <input type="color" value={stop.color} onChange={(e) => updateStop(idx, { color: e.target.value })} className="h-5 w-5 cursor-pointer rounded border border-[#EBEBEB] bg-transparent p-0" />
              <input type="number" min={0} max={100} value={stop.position} onChange={(e) => updateStop(idx, { position: Number(e.target.value) || 0 })} className="h-[24px] w-12 rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-1.5 text-[10px] text-black" />
              <span className="text-[10px] text-[#CCC]">%</span>
              {localStops.length > 2 && (
                <button type="button" onClick={() => removeStop(idx)} className="text-[#CCC] hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              )}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <button type="button" onClick={addStop} className="flex items-center gap-1 text-[10px] text-[#888C99] hover:text-black"><Plus className="h-3 w-3" />Add stop</button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-[#888C99]">Angle</label>
            <input type="range" min={0} max={360} value={localAngle} onChange={(e) => changeAngle(Number(e.target.value))} className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[#EBEBEB] accent-black" />
            <span className="w-8 text-right text-[10px] text-[#888C99]">{localAngle}°</span>
          </div>
        </div>
      )}
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
          </div>
          <ColorOrGradientInput label="Color" value={entry.color} onChange={(color) => onChange({ ...entry, color })} />
        </div>
      )}
    </div>
  );
}

function ButtonStyleSection({ label, style, onChange }: { label: string; style: EmbedButtonStyle; onChange: (s: EmbedButtonStyle) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-[#EBEBEB] bg-[#FAFAFA] p-2.5">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between">
        <span className="text-[12px] font-medium text-black">{label}</span>
        {open ? <ChevronDown className="h-3 w-3 text-[#888C99]" /> : <ChevronRight className="h-3 w-3 text-[#888C99]" />}
      </button>
      {open && (
        <div className="mt-2.5 space-y-2.5">
          <ColorOrGradientInput label="Background" value={style.bg} onChange={(bg) => onChange({ ...style, bg })} />
          <ColorOrGradientInput label="Text Color" value={style.color} onChange={(color) => onChange({ ...style, color })} />
          <ColorOrGradientInput label="Border Color" value={style.borderColor} onChange={(borderColor) => onChange({ ...style, borderColor })} />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-[#888C99]">Border Width</label>
              <input type="number" min={0} max={5} value={style.borderWidth} onChange={(e) => onChange({ ...style, borderWidth: Number(e.target.value) || 0 })} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[12px] text-black" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-[#888C99]">Radius</label>
              <input type="number" min={0} max={999} value={style.radius} onChange={(e) => onChange({ ...style, radius: Number(e.target.value) || 0 })} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[12px] text-black" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-[#888C99]">Font</label>
            <select value={style.fontFamily} onChange={(e) => onChange({ ...style, fontFamily: e.target.value })} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[12px] text-black">
              <option value="">Default</option>
              {SYSTEM_FONTS.filter(Boolean).map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-[#888C99]">Font Size</label>
              <input type="number" min={8} max={24} value={style.fontSize} onChange={(e) => onChange({ ...style, fontSize: Number(e.target.value) || 13 })} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[12px] text-black" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-[#888C99]">Padding X</label>
              <input type="number" min={0} max={60} value={style.paddingX} onChange={(e) => onChange({ ...style, paddingX: Number(e.target.value) || 12 })} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[12px] text-black" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-[#888C99]">Padding Y</label>
              <input type="number" min={0} max={30} value={style.paddingY} onChange={(e) => onChange({ ...style, paddingY: Number(e.target.value) || 8 })} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[12px] text-black" />
            </div>
          </div>
          <ColorOrGradientInput label="Hover Background" value={style.hoverBg} onChange={(hoverBg) => onChange({ ...style, hoverBg })} />
          <ColorOrGradientInput label="Hover Text" value={style.hoverColor} onChange={(hoverColor) => onChange({ ...style, hoverColor })} />
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
  { value: 'carousel', label: 'Carousel', desc: 'Horizontal slider' },
];
const BADGE_POSITIONS: { value: StatusBadgePosition; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'hidden', label: 'Hidden' },
];

type Breakpoint = 'desktop' | 'tablet' | 'mobile';

interface ListingFeedSettingsProps {
  name: string;
  config: ListingFeedConfig;
  onNameChange: (name: string) => void;
  onConfigChange: (config: ListingFeedConfig) => void;
  distinctValues: { cities: string[]; neighborhoods: string[]; propertyTypes: string[]; statuses: string[] };
  breakpoint: Breakpoint;
  onBreakpointChange: (bp: Breakpoint) => void;
}

export function ListingFeedSettings({ name, config, onNameChange, onConfigChange, distinctValues, breakpoint, onBreakpointChange }: ListingFeedSettingsProps) {
  const update = useCallback((partial: Partial<ListingFeedConfig>) => { onConfigChange({ ...config, ...partial }); }, [config, onConfigChange]);
  const updateFilters = useCallback((partial: Partial<ListingFeedConfig['filters']>) => { onConfigChange({ ...config, filters: { ...config.filters, ...partial } }); }, [config, onConfigChange]);
  const toggleStatus = (status: ListingStatus) => {
    const cur = config.filters.statuses;
    updateFilters({ statuses: cur.includes(status) ? cur.filter((s) => s !== status) : [...cur, status] });
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    style: true, badge: false, image: false, spacing: false, appearance: false, typography: false, responsive: true, pagination: true, carousel: true, filters: true, sort: false, detail: false,
  });
  const toggle = (key: string) => setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const updateResponsive = (bp: 'tablet' | 'mobile', partial: Partial<EmbedResponsiveOverrides>) => {
    update({ responsive: { ...config.responsive, [bp]: { ...config.responsive[bp], ...partial } } });
  };

  const updateCarousel = useCallback((partial: Partial<ListingFeedConfig['carousel']>) => {
    update({ carousel: { ...config.carousel, ...partial } });
  }, [config.carousel, update]);

  const isCarousel = config.cardLayout === 'carousel';

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

      {/* Carousel Settings */}
      {isCarousel && (
        <div>
          <SectionHeader label="Carousel" open={openSections.carousel} onToggle={() => toggle('carousel')} />
          {openSections.carousel && (
            <div className="mt-2 space-y-3">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Total Listings</label>
                <input type="number" min={1} max={100} value={config.carousel.totalListings} onChange={(e) => updateCarousel({ totalListings: Number(e.target.value) || 10 })} className="h-[30px] w-20 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black" />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Visible at Once</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <button key={n} type="button" onClick={() => updateCarousel({ visibleCount: n })} className={`flex h-[30px] flex-1 items-center justify-center rounded-lg text-[12px] transition-colors ${config.carousel.visibleCount === n ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Arrow Position</label>
                <div className="flex gap-1.5">
                  {(['beside', 'below'] as const).map((pos) => (
                    <button key={pos} type="button" onClick={() => updateCarousel({ arrowPosition: pos })} className={`flex h-[30px] flex-1 items-center justify-center rounded-lg text-[12px] capitalize transition-colors ${config.carousel.arrowPosition === pos ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>{pos}</button>
                  ))}
                </div>
              </div>
              <SliderInput label="Arrow Size" value={config.carousel.arrowSize} onChange={(v) => updateCarousel({ arrowSize: v })} min={20} max={60} />
              <ColorOrGradientInput label="Arrow Color" value={config.carousel.arrowColor} onChange={(v) => updateCarousel({ arrowColor: v })} />
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#888C99]">Custom Left Arrow SVG</label>
                <textarea value={config.carousel.customLeftArrowSvg} onChange={(e) => updateCarousel({ customLeftArrowSvg: e.target.value })} placeholder="<svg>...</svg>" rows={2} className="w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 py-1.5 text-[11px] text-black placeholder:text-[#CCC]" />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#888C99]">Custom Right Arrow SVG</label>
                <textarea value={config.carousel.customRightArrowSvg} onChange={(e) => updateCarousel({ customRightArrowSvg: e.target.value })} placeholder="<svg>...</svg>" rows={2} className="w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 py-1.5 text-[11px] text-black placeholder:text-[#CCC]" />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex-1 text-[12px] font-medium text-[#888C99]">Autoplay</label>
                <button type="button" onClick={() => updateCarousel({ autoplay: !config.carousel.autoplay })} className={`flex h-[26px] w-[26px] items-center justify-center rounded-md border ${config.carousel.autoplay ? 'border-black bg-black text-white' : 'border-[#EBEBEB] bg-white text-transparent'}`}>
                  <Check className="h-3 w-3" />
                </button>
              </div>
              {config.carousel.autoplay && (
                <SliderInput label="Interval (sec)" value={config.carousel.autoplayInterval} onChange={(v) => updateCarousel({ autoplayInterval: v })} min={1} max={15} unit="s" />
              )}
            </div>
          )}
        </div>
      )}

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
            <ColorOrGradientInput label="Background" value={config.statusBadge.bg} onChange={(bg) => update({ statusBadge: { ...config.statusBadge, bg } })} />
            <ColorOrGradientInput label="Text Color" value={config.statusBadge.color} onChange={(color) => update({ statusBadge: { ...config.statusBadge, color } })} />
            <ColorOrGradientInput label="Border" value={config.statusBadge.borderColor} onChange={(borderColor) => update({ statusBadge: { ...config.statusBadge, borderColor } })} />
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
      {!isCarousel && (
        <div>
          <SectionHeader label="Spacing" open={openSections.spacing} onToggle={() => toggle('spacing')} />
          {openSections.spacing && (
            <div className="mt-2">
              <SliderInput label="Column Gap" value={config.gap} onChange={(v) => update({ gap: v })} min={0} max={48} />
            </div>
          )}
        </div>
      )}

      {/* Card Appearance */}
      <div>
        <SectionHeader label="Card Appearance" open={openSections.appearance} onToggle={() => toggle('appearance')} />
        {openSections.appearance && (
          <div className="mt-2 space-y-3">
            <SliderInput label="Card Radius" value={config.cardRadius} onChange={(v) => update({ cardRadius: v })} max={32} />
            {config.cardLayout === 'classic' && (
              <SliderInput label="Details Box Radius" value={config.detailsBoxRadius} onChange={(v) => update({ detailsBoxRadius: v })} max={32} />
            )}
            <ColorOrGradientInput label="Details Background" value={config.detailsBoxBg} onChange={(v) => update({ detailsBoxBg: v })} />
            <ColorOrGradientInput label="Border Color" value={config.detailsBoxBorder} onChange={(v) => update({ detailsBoxBorder: v })} />
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

      {/* Pagination / Items Per Page (always visible, outside responsive) */}
      {!isCarousel && (
        <div>
          <SectionHeader label="Pagination & Display" open={openSections.pagination} onToggle={() => toggle('pagination')} />
          {openSections.pagination && (
            <div className="mt-2 space-y-3">
              {/* Total items displayed */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Total Items Displayed</label>
                <p className="mb-1.5 text-[11px] text-[#CCC]">Max listings shown in this feed (e.g. 10 of 20 listings)</p>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} max={500} value={config.maxListings === 'unlimited' ? '' : (config.maxListings ?? '')} disabled={config.maxListings === 'unlimited'} onChange={(e) => update({ maxListings: parseInt(e.target.value, 10) || 10 })} placeholder="All" className="h-[30px] w-20 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black placeholder:text-[#CCC] disabled:opacity-50" />
                  <button type="button" onClick={() => update({ maxListings: config.maxListings === 'unlimited' ? 10 : 'unlimited' })} className={`flex h-[30px] items-center gap-1.5 rounded-lg px-3 text-[12px] transition-colors ${config.maxListings === 'unlimited' ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>
                    {config.maxListings === 'unlimited' && <Check className="h-3 w-3" />}
                    All
                  </button>
                </div>
              </div>

              {/* Items per page */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">
                  Items Per Page {breakpoint !== 'desktop' && <span className="text-[#CCC]">(override for {breakpoint})</span>}
                </label>
                {breakpoint === 'desktop' ? (
                  <div className="flex items-center gap-2">
                    <input type="number" min={1} max={100} value={config.itemsPerPage === 'unlimited' ? '' : config.itemsPerPage} disabled={config.itemsPerPage === 'unlimited'} onChange={(e) => update({ itemsPerPage: parseInt(e.target.value, 10) || 9 })} placeholder="9" className="h-[30px] w-20 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black placeholder:text-[#CCC] disabled:opacity-50" />
                    <button type="button" onClick={() => update({ itemsPerPage: config.itemsPerPage === 'unlimited' ? 9 : 'unlimited' })} className={`flex h-[30px] items-center gap-1.5 rounded-lg px-3 text-[12px] transition-colors ${config.itemsPerPage === 'unlimited' ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>
                      {config.itemsPerPage === 'unlimited' && <Check className="h-3 w-3" />}
                      Unlimited
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min={1} max={100}
                      value={config.responsive[breakpoint]?.itemsPerPage === 'unlimited' ? '' : (config.responsive[breakpoint]?.itemsPerPage ?? '')}
                      placeholder={`Inherit (${config.itemsPerPage})`}
                      onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                        updateResponsive(breakpoint, { itemsPerPage: val || undefined });
                      }}
                      className="h-[30px] w-20 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black placeholder:text-[#CCC]"
                    />
                    {config.responsive[breakpoint]?.itemsPerPage !== undefined && (
                      <button type="button" onClick={() => updateResponsive(breakpoint, { itemsPerPage: undefined })} className="flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-2 text-[11px] text-[#888C99] hover:text-black">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination type */}
              {((breakpoint === 'desktop' && config.itemsPerPage !== 'unlimited') || (breakpoint !== 'desktop')) && (
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Pagination</label>
                  {breakpoint === 'desktop' ? (
                    <div className="flex gap-1.5">
                      {([{ value: 'pagination', label: 'Page Numbers' }, { value: 'load_more', label: 'Load More' }, { value: 'none', label: 'None' }] as const).map((opt) => (
                        <button key={opt.value} type="button" onClick={() => update({ paginationType: opt.value })} className={`flex h-[30px] flex-1 items-center justify-center rounded-lg text-[12px] transition-colors ${config.paginationType === opt.value ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>{opt.label}</button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {([{ value: 'pagination', label: 'Pages' }, { value: 'load_more', label: 'Load More' }, { value: 'none', label: 'None' }] as const).map((opt) => {
                        const active = config.responsive[breakpoint]?.paginationType === opt.value;
                        return (
                          <button key={opt.value} type="button" onClick={() => updateResponsive(breakpoint, { paginationType: active ? undefined : opt.value })} className={`flex h-[30px] flex-1 items-center justify-center rounded-lg text-[11px] transition-colors ${active ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>{opt.label}</button>
                        );
                      })}
                      {config.responsive[breakpoint]?.paginationType && (
                        <button type="button" onClick={() => updateResponsive(breakpoint, { paginationType: undefined })} className="flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-2 text-[11px] text-[#888C99] hover:text-black">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Button styling */}
              {config.paginationType === 'pagination' && (
                <ButtonStyleSection label="Pagination Button Style" style={config.paginationButton} onChange={(paginationButton) => update({ paginationButton })} />
              )}
              {config.paginationType === 'load_more' && (
                <ButtonStyleSection label="Load More Button Style" style={config.loadMoreButton} onChange={(loadMoreButton) => update({ loadMoreButton })} />
              )}

              {/* Show listing count */}
              <div className="flex items-center gap-2">
                <label className="flex-1 text-[12px] font-medium text-[#888C99]">Show &quot;Showing X of Y&quot;</label>
                <button type="button" onClick={() => update({ showListingCount: !config.showListingCount })} className={`flex h-[26px] w-[26px] items-center justify-center rounded-md border ${config.showListingCount ? 'border-black bg-black text-white' : 'border-[#EBEBEB] bg-white text-transparent'}`}>
                  <Check className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Responsive + Columns */}
      {!isCarousel && (
        <div>
          <SectionHeader label="Layout & Responsive" open={openSections.responsive} onToggle={() => toggle('responsive')} />
          {openSections.responsive && (
            <div className="mt-2 space-y-3">
              {/* Breakpoint tabs */}
              <div className="flex rounded-lg border border-[#EBEBEB]">
                {(['desktop', 'tablet', 'mobile'] as const).map((bp) => (
                  <button key={bp} type="button" onClick={() => onBreakpointChange(bp)} className={`flex-1 py-1.5 text-[12px] capitalize transition-colors ${breakpoint === bp ? 'bg-black text-white' : 'bg-white text-[#888C99] hover:text-black'} ${bp === 'desktop' ? 'rounded-l-lg' : bp === 'mobile' ? 'rounded-r-lg' : ''}`}>{bp}</button>
                ))}
              </div>

              {/* Columns for current breakpoint */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">
                  Columns {breakpoint !== 'desktop' && <span className="text-[#CCC]">(inherit: {breakpoint === 'tablet' ? config.columns : (config.responsive.tablet.columns || config.columns)})</span>}
                </label>
                <div className="flex gap-1.5">
                  {([1, 2, 3] as const).map((col) => {
                    const active = breakpoint === 'desktop'
                      ? config.columns === col
                      : config.responsive[breakpoint].columns === col;
                    return (
                      <button key={col} type="button" onClick={() => {
                        if (breakpoint === 'desktop') update({ columns: col });
                        else updateResponsive(breakpoint, { columns: col });
                      }} className={`flex h-[30px] flex-1 items-center justify-center rounded-lg text-[12px] transition-colors ${active ? 'bg-black text-white' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>
                        {col} Col{col > 1 ? 's' : ''}
                      </button>
                    );
                  })}
                  {breakpoint !== 'desktop' && config.responsive[breakpoint].columns && (
                    <button type="button" onClick={() => updateResponsive(breakpoint, { columns: undefined })} className="flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-2 text-[11px] text-[#888C99] hover:text-black">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Image height override for non-desktop */}
              {breakpoint !== 'desktop' && (
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Image Height Override</label>
                  {config.responsive[breakpoint].imageHeight ? (
                    <div className="flex items-center gap-2">
                      <input type="number" min={50} max={800} value={config.responsive[breakpoint].imageHeight!.value} onChange={(e) => updateResponsive(breakpoint, { imageHeight: { ...config.responsive[breakpoint].imageHeight!, value: Number(e.target.value) || 200 } })} className="h-[30px] w-20 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[12px] text-black" />
                      <button type="button" onClick={() => updateResponsive(breakpoint, { imageHeight: undefined })} className="flex h-[30px] items-center rounded-lg border border-[#EBEBEB] bg-white px-2 text-[11px] text-[#888C99] hover:text-black"><X className="h-3 w-3" /></button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => updateResponsive(breakpoint, { imageHeight: { value: config.imageHeight.value, unit: config.imageHeight.unit } })} className="text-[12px] text-[#888C99] underline hover:text-black">Customize</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
