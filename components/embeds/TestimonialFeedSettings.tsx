'use client';

import { useState } from 'react';
import { TestimonialFeedConfig, TestimonialResponsiveOverrides, CmsTestimonial } from '@/lib/types';
import {
  Check,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react';

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

// ── Reusable ────────────────────────────────────────────────────────────────

const SYSTEM_FONTS = ['', 'Inter', 'Geist', 'system-ui', 'Georgia', 'Playfair Display', 'Lora', 'Merriweather', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Raleway'];

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

  const switchToSolid = () => { onChange(localStops[0]?.color || '#000000'); };

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
          <div className="h-6 w-full rounded-md border border-[#EBEBEB]" style={{ background: value }} />
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
          <button type="button" onClick={addStop} className="flex items-center gap-1 text-[10px] text-[#888C99] hover:text-black"><Plus className="h-3 w-3" />Add stop</button>
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-[#888C99]">Angle</label>
            <input type="range" min={0} max={360} value={localAngle} onChange={(e) => changeAngle(Number(e.target.value))} className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[#EBEBEB] accent-black" />
            <span className="w-8 text-right text-[10px] text-[#888C99]">{localAngle}&deg;</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">{label}</label>
      <div className="flex items-center gap-1.5">
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="h-6 w-6 cursor-pointer rounded border border-[#EBEBEB] bg-transparent p-0" />
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" className="h-[28px] w-[80px] rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-2 text-[11px] text-black placeholder:text-[#CCC]" />
      </div>
    </div>
  );
}

function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] text-[#888C99]">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[12px] text-black">
        <option value="">Default</option>
        {SYSTEM_FONTS.filter(Boolean).map((f) => <option key={f} value={f}>{f}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-[12px] text-[#888C99]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-black' : 'bg-[#EBEBEB]'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </button>
    </label>
  );
}

// ── Typography sub-section ──────────────────────────────────────────────────

function TypoSection({
  label,
  font,
  fontSize,
  color,
  lineHeight,
  onFontChange,
  onFontSizeChange,
  onColorChange,
  onLineHeightChange,
}: {
  label: string;
  font: string;
  fontSize: number;
  color: string;
  lineHeight?: number;
  onFontChange: (v: string) => void;
  onFontSizeChange: (v: number) => void;
  onColorChange: (v: string) => void;
  onLineHeightChange?: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-[#EBEBEB] bg-[#FAFAFA] p-2.5">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between">
        <span className="text-[12px] font-medium text-black">{label}</span>
        {open ? <ChevronDown className="h-3 w-3 text-[#888C99]" /> : <ChevronRight className="h-3 w-3 text-[#888C99]" />}
      </button>
      {open && (
        <div className="mt-2.5 space-y-2.5">
          <FontSelect label="Font" value={font} onChange={onFontChange} />
          <div className="flex-1">
            <label className="mb-1 block text-[11px] text-[#888C99]">Size</label>
            <input type="number" min={8} max={48} value={fontSize} onChange={(e) => onFontSizeChange(Number(e.target.value) || 12)} className="h-[28px] w-full rounded-md border border-[#EBEBEB] bg-white px-2 text-[12px] text-black" />
          </div>
          <ColorOrGradientInput label="Color" value={color} onChange={onColorChange} />
          {onLineHeightChange && lineHeight !== undefined && (
            <SliderInput label="Line Height" value={lineHeight} onChange={onLineHeightChange} min={1} max={3} unit="" />
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

interface TestimonialFeedSettingsProps {
  name: string;
  config: TestimonialFeedConfig;
  onNameChange: (name: string) => void;
  onConfigChange: (config: TestimonialFeedConfig) => void;
  testimonials: CmsTestimonial[];
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  onBreakpointChange: (bp: 'desktop' | 'tablet' | 'mobile') => void;
}

export function TestimonialFeedSettings({
  name,
  config,
  onNameChange,
  onConfigChange,
  testimonials,
  breakpoint,
  onBreakpointChange,
}: TestimonialFeedSettingsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    name: true,
    selection: true,
    sorting: false,
    visibility: false,
    stars: false,
    typography: false,
    card: false,
    dots: false,
    arrows: false,
    autoplay: false,
    background: false,
    responsive: false,
  });

  const toggle = (key: string) => setOpenSections((s) => ({ ...s, [key]: !s[key] }));
  const set = (patch: Partial<TestimonialFeedConfig>) => onConfigChange({ ...config, ...patch });

  const setResponsive = (bp: 'tablet' | 'mobile', patch: Partial<TestimonialResponsiveOverrides>) => {
    set({
      responsive: {
        ...config.responsive,
        [bp]: { ...config.responsive[bp], ...patch },
      },
    });
  };

  const [dragIdx, setDragIdx] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      {/* Feed Name */}
      <div>
        <SectionHeader label="Feed Name" open={openSections.name} onToggle={() => toggle('name')} />
        {openSections.name && (
          <div className="mt-2">
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
              placeholder="e.g. Homepage Testimonials"
            />
          </div>
        )}
      </div>

      {/* Selection */}
      <div>
        <SectionHeader label="Testimonial Selection" open={openSections.selection} onToggle={() => toggle('selection')} />
        {openSections.selection && (
          <div className="mt-2 space-y-3">
            <div className="flex gap-1.5 rounded-lg bg-[#F5F5F3] p-1">
              {(['all', 'manual'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set({ selectionMode: m })}
                  className={`flex-1 rounded-md px-3 py-1.5 text-[12px] transition-colors ${config.selectionMode === m ? 'bg-white text-black shadow-sm' : 'text-[#888C99] hover:text-black'}`}
                >
                  {m === 'all' ? 'All Testimonials' : 'Manual Selection'}
                </button>
              ))}
            </div>
            {config.selectionMode === 'manual' && (
              <div className="max-h-64 overflow-y-auto rounded-lg border border-[#EBEBEB]">
                {testimonials.length === 0 ? (
                  <p className="p-3 text-center text-[12px] text-[#888C99]">No testimonials found. Add some in the Testimonials page.</p>
                ) : (
                  <table className="w-full text-left text-[12px]">
                    <thead>
                      <tr className="border-b border-[#EBEBEB] bg-[#FAFAFA]">
                        <th className="w-8 px-2 py-2" />
                        <th className="px-2 py-2 font-medium text-[#888C99]">Author</th>
                        <th className="px-2 py-2 font-medium text-[#888C99]">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.map((t) => {
                        const selected = config.selectedTestimonialIds.includes(t.id);
                        return (
                          <tr
                            key={t.id}
                            className="cursor-pointer border-b border-[#EBEBEB] last:border-0 hover:bg-[#F5F5F3]"
                            onClick={() => {
                              const ids = selected
                                ? config.selectedTestimonialIds.filter((id) => id !== t.id)
                                : [...config.selectedTestimonialIds, t.id];
                              set({ selectedTestimonialIds: ids });
                            }}
                          >
                            <td className="px-2 py-2">
                              <div className={`flex h-4 w-4 items-center justify-center rounded border ${selected ? 'border-black bg-black' : 'border-[#CCCCCC]'}`}>
                                {selected && <Check className="h-3 w-3 text-white" />}
                              </div>
                            </td>
                            <td className="px-2 py-2 text-black">{t.authorName}</td>
                            <td className="px-2 py-2 text-[#888C99]">{t.rating ?? '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sorting */}
      <div>
        <SectionHeader label="Sorting" open={openSections.sorting} onToggle={() => toggle('sorting')} />
        {openSections.sorting && (
          <div className="mt-2 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {([
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'custom_order', label: 'Custom Order' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set({ sortBy: opt.value })}
                  className={`rounded-md border px-3 py-1.5 text-[12px] transition-colors ${config.sortBy === opt.value ? 'border-black bg-black text-white' : 'border-[#EBEBEB] text-[#888C99] hover:text-black'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {config.sortBy === 'custom_order' && (
              <div className="rounded-lg border border-[#EBEBEB]">
                <p className="border-b border-[#EBEBEB] bg-[#FAFAFA] px-3 py-1.5 text-[11px] text-[#888C99]">Drag to reorder</p>
                {testimonials.map((t, idx) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={() => setDragIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIdx === null || dragIdx === idx) return;
                      const ids = config.selectionMode === 'manual' ? [...config.selectedTestimonialIds] : testimonials.map((tt) => tt.id);
                      const [moved] = ids.splice(dragIdx, 1);
                      ids.splice(idx, 0, moved);
                      set({ selectedTestimonialIds: ids });
                      setDragIdx(null);
                    }}
                    className="flex cursor-grab items-center gap-2 border-b border-[#EBEBEB] px-3 py-2 text-[12px] last:border-0 hover:bg-[#F5F5F3]"
                  >
                    <GripVertical className="h-3.5 w-3.5 text-[#CCCCCC]" />
                    <span className="text-black">{t.authorName}</span>
                    <span className="ml-auto text-[#CCCCCC]">{t.rating ?? '—'} stars</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Visibility Toggles */}
      <div>
        <SectionHeader label="Visibility" open={openSections.visibility} onToggle={() => toggle('visibility')} />
        {openSections.visibility && (
          <div className="mt-2 space-y-2.5">
            <Toggle label="Rating (Stars)" checked={config.showRating} onChange={(v) => set({ showRating: v })} />
            <Toggle label="Quote" checked={config.showQuote} onChange={(v) => set({ showQuote: v })} />
            <Toggle label="Date" checked={config.showDate} onChange={(v) => set({ showDate: v })} />
            <Toggle label="Author Name" checked={config.showAuthorName} onChange={(v) => set({ showAuthorName: v })} />
            <Toggle label="Author Title" checked={config.showAuthorTitle} onChange={(v) => set({ showAuthorTitle: v })} />
          </div>
        )}
      </div>

      {/* Stars */}
      <div>
        <SectionHeader label="Stars" open={openSections.stars} onToggle={() => toggle('stars')} />
        {openSections.stars && (
          <div className="mt-2 space-y-3">
            <SliderInput label="Star Size" value={config.starSize} onChange={(v) => set({ starSize: v })} min={12} max={40} />
            <ColorOrGradientInput label="Star Color" value={config.starColor} onChange={(v) => set({ starColor: v })} />
          </div>
        )}
      </div>

      {/* Typography */}
      <div>
        <SectionHeader label="Typography" open={openSections.typography} onToggle={() => toggle('typography')} />
        {openSections.typography && (
          <div className="mt-2 space-y-2">
            <TypoSection
              label="Quote"
              font={config.quoteFont}
              fontSize={config.quoteFontSize}
              color={config.quoteColor}
              lineHeight={config.quoteLineHeight}
              onFontChange={(v) => set({ quoteFont: v })}
              onFontSizeChange={(v) => set({ quoteFontSize: v })}
              onColorChange={(v) => set({ quoteColor: v })}
              onLineHeightChange={(v) => set({ quoteLineHeight: v })}
            />
            <TypoSection
              label="Author Name"
              font={config.authorNameFont}
              fontSize={config.authorNameFontSize}
              color={config.authorNameColor}
              onFontChange={(v) => set({ authorNameFont: v })}
              onFontSizeChange={(v) => set({ authorNameFontSize: v })}
              onColorChange={(v) => set({ authorNameColor: v })}
            />
            <TypoSection
              label="Author Title"
              font={config.authorTitleFont}
              fontSize={config.authorTitleFontSize}
              color={config.authorTitleColor}
              onFontChange={(v) => set({ authorTitleFont: v })}
              onFontSizeChange={(v) => set({ authorTitleFontSize: v })}
              onColorChange={(v) => set({ authorTitleColor: v })}
            />
            <TypoSection
              label="Date"
              font={config.dateFont}
              fontSize={config.dateFontSize}
              color={config.dateColor}
              onFontChange={(v) => set({ dateFont: v })}
              onFontSizeChange={(v) => set({ dateFontSize: v })}
              onColorChange={(v) => set({ dateColor: v })}
            />
          </div>
        )}
      </div>

      {/* Card Appearance */}
      <div>
        <SectionHeader label="Card Appearance" open={openSections.card} onToggle={() => toggle('card')} />
        {openSections.card && (
          <div className="mt-2 space-y-3">
            <SliderInput label="Card Radius" value={config.cardRadius} onChange={(v) => set({ cardRadius: v })} min={0} max={32} />
            <SliderInput label="Card Padding" value={config.cardPadding} onChange={(v) => set({ cardPadding: v })} min={0} max={64} />
            <SliderInput label="Gap" value={config.gap} onChange={(v) => set({ gap: v })} min={0} max={48} />
            <ColorInput label="Card Background" value={config.cardBackgroundColor} onChange={(v) => set({ cardBackgroundColor: v })} />
            <ColorInput label="Card Border" value={config.cardBorderColor} onChange={(v) => set({ cardBorderColor: v })} />
          </div>
        )}
      </div>

      {/* Dots */}
      <div>
        <SectionHeader label="Navigation Dots" open={openSections.dots} onToggle={() => toggle('dots')} />
        {openSections.dots && (
          <div className="mt-2 space-y-3">
            <Toggle label="Show Dots" checked={config.showDots} onChange={(v) => set({ showDots: v })} />
            {config.showDots && (
              <>
                <ColorInput label="Active Dot Color" value={config.activeDotColor} onChange={(v) => set({ activeDotColor: v })} />
                <ColorInput label="Inactive Dot Color" value={config.inactiveDotColor} onChange={(v) => set({ inactiveDotColor: v })} />
                <SliderInput label="Dot Size" value={config.dotSize} onChange={(v) => set({ dotSize: v })} min={4} max={16} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Arrows */}
      <div>
        <SectionHeader label="Navigation Arrows" open={openSections.arrows} onToggle={() => toggle('arrows')} />
        {openSections.arrows && (
          <div className="mt-2 space-y-3">
            <Toggle label="Show Arrows" checked={config.showArrows} onChange={(v) => set({ showArrows: v })} />
            {config.showArrows && (
              <>
                <ColorOrGradientInput label="Arrow Color" value={config.arrowColor} onChange={(v) => set({ arrowColor: v })} />
                <SliderInput label="Arrow Size" value={config.arrowSize} onChange={(v) => set({ arrowSize: v })} min={20} max={56} />
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Custom Left Arrow SVG</label>
                  <textarea
                    value={config.customLeftArrowSvg}
                    onChange={(e) => set({ customLeftArrowSvg: e.target.value })}
                    rows={2}
                    placeholder="Paste SVG markup (optional)"
                    className="w-full rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-2 py-1.5 text-[11px] text-black placeholder:text-[#CCC]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Custom Right Arrow SVG</label>
                  <textarea
                    value={config.customRightArrowSvg}
                    onChange={(e) => set({ customRightArrowSvg: e.target.value })}
                    rows={2}
                    placeholder="Paste SVG markup (optional)"
                    className="w-full rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-2 py-1.5 text-[11px] text-black placeholder:text-[#CCC]"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Autoplay */}
      <div>
        <SectionHeader label="Autoplay" open={openSections.autoplay} onToggle={() => toggle('autoplay')} />
        {openSections.autoplay && (
          <div className="mt-2 space-y-3">
            <Toggle label="Autoplay" checked={config.autoplay} onChange={(v) => set({ autoplay: v })} />
            {config.autoplay && (
              <SliderInput label="Interval" value={config.autoplayInterval} onChange={(v) => set({ autoplayInterval: v })} min={2} max={15} unit="s" />
            )}
          </div>
        )}
      </div>

      {/* Background */}
      <div>
        <SectionHeader label="Background" open={openSections.background} onToggle={() => toggle('background')} />
        {openSections.background && (
          <div className="mt-2 space-y-3">
            <ColorInput label="Container Background" value={config.backgroundColor} onChange={(v) => set({ backgroundColor: v })} />
            <button
              type="button"
              onClick={() => set({ backgroundColor: 'transparent' })}
              className="text-[11px] text-[#888C99] hover:text-black"
            >
              Set transparent
            </button>
          </div>
        )}
      </div>

      {/* Layout & Responsive */}
      <div>
        <SectionHeader label="Layout & Responsive" open={openSections.responsive} onToggle={() => toggle('responsive')} />
        {openSections.responsive && (
          <div className="mt-2 space-y-3">
            <div className="flex gap-1.5 rounded-lg bg-[#F5F5F3] p-1">
              {(['desktop', 'tablet', 'mobile'] as const).map((bp) => (
                <button
                  key={bp}
                  type="button"
                  onClick={() => onBreakpointChange(bp)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-[12px] capitalize transition-colors ${breakpoint === bp ? 'bg-white text-black shadow-sm' : 'text-[#888C99] hover:text-black'}`}
                >
                  {bp}
                </button>
              ))}
            </div>

            {breakpoint === 'desktop' ? (
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Columns</label>
                <div className="flex gap-1.5">
                  {([1, 2, 3] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set({ columns: c })}
                      className={`flex-1 rounded-md border py-1.5 text-[12px] transition-colors ${config.columns === c ? 'border-black bg-black text-white' : 'border-[#EBEBEB] text-[#888C99] hover:text-black'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">Columns ({breakpoint})</label>
                <div className="flex gap-1.5">
                  {([undefined, 1, 2, 3] as const).map((c) => (
                    <button
                      key={String(c)}
                      type="button"
                      onClick={() => setResponsive(breakpoint as 'tablet' | 'mobile', { columns: c })}
                      className={`flex-1 rounded-md border py-1.5 text-[12px] transition-colors ${config.responsive[breakpoint as 'tablet' | 'mobile']?.columns === c ? 'border-black bg-black text-white' : 'border-[#EBEBEB] text-[#888C99] hover:text-black'}`}
                    >
                      {c === undefined ? 'Inherit' : c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
