'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface TestimonialRow {
  id: string;
  quote: string;
  author_name: string;
  author_title?: string;
  rating?: number;
  date?: string;
  sort_order: number;
  created_at: string;
}

interface ResponsiveOverrides {
  columns?: number;
}

interface FeedConfig {
  selectionMode: 'all' | 'manual';
  selectedTestimonialIds: string[];
  sortBy: 'newest' | 'oldest' | 'custom_order';

  showRating: boolean;
  showQuote: boolean;
  showDate: boolean;
  showAuthorName: boolean;
  showAuthorTitle: boolean;

  columns: number;
  gap: number;
  cardRadius: number;
  cardPadding: number;
  backgroundColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;

  starColor: string;
  starColorMode: 'solid' | 'gradient';
  starGradientColors: string[];
  starSize: number;

  quoteFont: string;
  quoteFontSize: number;
  quoteColor: string;
  quoteLineHeight: number;

  authorNameFont: string;
  authorNameFontSize: number;
  authorNameColor: string;

  authorTitleFont: string;
  authorTitleFontSize: number;
  authorTitleColor: string;

  dateFont: string;
  dateFontSize: number;
  dateColor: string;
  dateFormat: string;

  showDots: boolean;
  activeDotColor: string;
  inactiveDotColor: string;
  dotSize: number;

  showArrows: boolean;
  arrowColor: string;
  arrowColorMode: 'solid' | 'gradient';
  arrowGradientColors: string[];
  arrowSize: number;
  customLeftArrowSvg: string;
  customRightArrowSvg: string;

  autoplay: boolean;
  autoplayInterval: number;

  responsive: {
    tablet: ResponsiveOverrides;
    mobile: ResponsiveOverrides;
  };
}

function isGrad(v: string) { return v?.startsWith('linear-gradient'); }

function starPath(size: number): string {
  const cx = size / 2, cy = size / 2, outerR = size / 2, innerR = outerR * 0.38;
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const oa = -Math.PI / 2 + (2 * Math.PI * i) / 5;
    const ia = oa + Math.PI / 5;
    pts.push(`${cx + outerR * Math.cos(oa)},${cy + outerR * Math.sin(oa)}`);
    pts.push(`${cx + innerR * Math.cos(ia)},${cy + innerR * Math.sin(ia)}`);
  }
  return `M${pts.join('L')}Z`;
}

function parseGradStops(value: string): { color: string; position: number }[] {
  const m = value.match(/^linear-gradient\(\s*\d+deg\s*,\s*(.+)\)$/);
  if (!m) return [{ color: '#D4AF37', position: 0 }, { color: '#F5E6A3', position: 100 }];
  return m[1].split(',').map((s) => {
    const p = s.trim().split(/\s+/);
    return { color: p[0], position: parseInt(p[1]) || 0 };
  });
}

function StarRow({ rating, size, color, uid }: { rating: number; size: number; color: string; uid: string }) {
  const isGradient = isGrad(color);
  const gid = `sg-${uid}`;
  const w = size * 5 + 8;
  return (
    <svg width={w} height={size} viewBox={`0 0 ${w} ${size}`}>
      {isGradient && (
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
            {parseGradStops(color).map((s, i) => <stop key={i} offset={`${s.position}%`} stopColor={s.color} />)}
          </linearGradient>
        </defs>
      )}
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i} transform={`translate(${i * (size + 2)}, 0)`}>
          <path d={starPath(size)} fill={i < rating ? (isGradient ? `url(#${gid})` : color) : '#E0E0E0'} />
        </g>
      ))}
    </svg>
  );
}

function DefaultArrow({ dir, size, color }: { dir: 'l' | 'r'; size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polyline points={dir === 'l' ? '15 18 9 12 15 6' : '9 6 15 12 9 18'} stroke={isGrad(color) ? '#000' : color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function fmtDate(d: string): string {
  try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return d; }
}

interface Props {
  configId: string;
  tenantId: string;
  feedConfig: FeedConfig;
}

export function EmbedTestimonialClient({ configId, tenantId, feedConfig: cfg }: Props) {
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/data/testimonials?tenantId=${encodeURIComponent(tenantId)}`)
      .then((r) => r.json())
      .then((rows) => { setTestimonials(rows || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tenantId]);

  const items = useMemo(() => {
    let list = [...testimonials];
    if (cfg.selectionMode === 'manual' && cfg.selectedTestimonialIds?.length > 0) {
      const s = new Set(cfg.selectedTestimonialIds);
      list = list.filter((t) => s.has(t.id));
      if (cfg.sortBy === 'custom_order') {
        const m = new Map(cfg.selectedTestimonialIds.map((id, i) => [id, i]));
        list.sort((a, b) => (m.get(a.id) ?? 0) - (m.get(b.id) ?? 0));
        return list;
      }
    }
    if (cfg.sortBy === 'newest') list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (cfg.sortBy === 'oldest') list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else list.sort((a, b) => a.sort_order - b.sort_order);
    return list;
  }, [testimonials, cfg.selectionMode, cfg.selectedTestimonialIds, cfg.sortBy]);

  const [width, setWidth] = useState(1024);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cols = useMemo(() => {
    if (width <= 640) return cfg.responsive?.mobile?.columns || cfg.responsive?.tablet?.columns || cfg.columns;
    if (width <= 1024) return cfg.responsive?.tablet?.columns || cfg.columns;
    return cfg.columns;
  }, [width, cfg.columns, cfg.responsive]);

  const totalPages = Math.max(1, Math.ceil(items.length / cols));
  const [page, setPage] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    if (!cfg.autoplay || totalPages <= 1) return;
    timerRef.current = setInterval(() => setPage((p) => (p + 1) % totalPages), cfg.autoplayInterval * 1000);
    return () => clearInterval(timerRef.current);
  }, [cfg.autoplay, cfg.autoplayInterval, totalPages]);

  const pageItems = items.slice(page * cols, page * cols + cols);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui', color: '#888' }}>Loading...</div>;
  }

  if (items.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui', color: '#888' }}>No testimonials to display.</div>;
  }

  return (
    <div style={{ background: cfg.backgroundColor === 'transparent' ? undefined : cfg.backgroundColor, padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @media (max-width: 1024px) { .tf-grid { grid-template-columns: repeat(${cfg.responsive?.tablet?.columns || cfg.columns}, 1fr) !important; } }
        @media (max-width: 640px) { .tf-grid { grid-template-columns: repeat(${cfg.responsive?.mobile?.columns || cfg.responsive?.tablet?.columns || 1}, 1fr) !important; } }
      `}</style>

      <div className="tf-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: cfg.gap }}>
        {pageItems.map((t) => (
          <div key={t.id} style={{ background: cfg.cardBackgroundColor, borderRadius: cfg.cardRadius, border: `1px solid ${cfg.cardBorderColor}`, padding: cfg.cardPadding, display: 'flex', flexDirection: 'column' }}>
            {cfg.showRating && t.rating != null && t.rating > 0 && (
              <div style={{ marginBottom: 12 }}>
                <StarRow rating={t.rating} size={cfg.starSize} color={cfg.starColor} uid={t.id} />
              </div>
            )}
            {cfg.showQuote && (
              <p style={{ fontFamily: cfg.quoteFont || undefined, fontSize: cfg.quoteFontSize, color: cfg.quoteColor, lineHeight: cfg.quoteLineHeight, marginBottom: 12 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
            )}
            <div style={{ marginTop: 'auto' }}>
              {cfg.showAuthorName && (
                <p style={{ fontFamily: cfg.authorNameFont || undefined, fontSize: cfg.authorNameFontSize, color: cfg.authorNameColor, fontWeight: 500 }}>
                  {t.author_name}
                </p>
              )}
              {cfg.showAuthorTitle && t.author_title && (
                <p style={{ fontFamily: cfg.authorTitleFont || undefined, fontSize: cfg.authorTitleFontSize, color: cfg.authorTitleColor }}>
                  {t.author_title}
                </p>
              )}
              {cfg.showDate && t.date && (
                <p style={{ fontFamily: cfg.dateFont || undefined, fontSize: cfg.dateFontSize, color: cfg.dateColor, marginTop: 4 }}>
                  {fmtDate(t.date)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
          {cfg.showArrows && (
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={{ cursor: 'pointer', background: 'none', border: 'none', opacity: page === 0 ? 0.3 : 1, width: cfg.arrowSize, height: cfg.arrowSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cfg.customLeftArrowSvg ? <span dangerouslySetInnerHTML={{ __html: cfg.customLeftArrowSvg }} /> : <DefaultArrow dir="l" size={cfg.arrowSize * 0.6} color={cfg.arrowColor} />}
            </button>
          )}
          {cfg.showDots && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i)} style={{ cursor: 'pointer', width: cfg.dotSize, height: cfg.dotSize, borderRadius: '50%', background: i === page ? cfg.activeDotColor : cfg.inactiveDotColor, border: 'none', padding: 0, transition: 'background 0.2s' }} />
              ))}
            </div>
          )}
          {cfg.showArrows && (
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={{ cursor: 'pointer', background: 'none', border: 'none', opacity: page === totalPages - 1 ? 0.3 : 1, width: cfg.arrowSize, height: cfg.arrowSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cfg.customRightArrowSvg ? <span dangerouslySetInnerHTML={{ __html: cfg.customRightArrowSvg }} /> : <DefaultArrow dir="r" size={cfg.arrowSize * 0.6} color={cfg.arrowColor} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
