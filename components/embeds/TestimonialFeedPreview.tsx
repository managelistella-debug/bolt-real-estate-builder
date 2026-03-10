'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TestimonialFeedConfig, CmsTestimonial } from '@/lib/types';
import { Monitor, Tablet, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';

const BP_ICONS = { desktop: Monitor, tablet: Tablet, mobile: Smartphone } as const;
const BP_WIDTHS = { desktop: '100%', tablet: '768px', mobile: '375px' } as const;

function getColumnsForBreakpoint(
  config: TestimonialFeedConfig,
  bp: 'desktop' | 'tablet' | 'mobile'
): number {
  if (bp === 'desktop') return config.columns;
  const override = config.responsive[bp]?.columns;
  if (override) return override;
  if (bp === 'mobile') return config.responsive.tablet?.columns || config.columns;
  return config.columns;
}

function isGradient(v: string) { return v?.startsWith('linear-gradient'); }

function StarRow({
  rating,
  size,
  color,
  uniqueId,
}: {
  rating: number;
  size: number;
  color: string;
  uniqueId: string;
}) {
  const gradientMode = isGradient(color);
  const gradientId = `star-grad-${uniqueId}`;
  const totalWidth = size * 5 + 4 * 2;

  return (
    <svg
      width={totalWidth}
      height={size}
      viewBox={`0 0 ${totalWidth} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {gradientMode && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {parseGradientStops(color).map((stop, i) => (
              <stop key={i} offset={`${stop.position}%`} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
      )}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = i * (size + 2);
        const fill = i < rating
          ? gradientMode ? `url(#${gradientId})` : color
          : '#E0E0E0';
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            <path
              d={starPath(size)}
              fill={fill}
            />
          </g>
        );
      })}
    </svg>
  );
}

function starPath(size: number): string {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2;
  const innerR = outerR * 0.38;
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI / 2) * -1 + (2 * Math.PI * i) / 5;
    const innerAngle = outerAngle + Math.PI / 5;
    points.push(`${cx + outerR * Math.cos(outerAngle)},${cy + outerR * Math.sin(outerAngle)}`);
    points.push(`${cx + innerR * Math.cos(innerAngle)},${cy + innerR * Math.sin(innerAngle)}`);
  }
  return `M${points.join('L')}Z`;
}

function parseGradientStops(value: string): { color: string; position: number }[] {
  const m = value.match(/^linear-gradient\(\s*\d+deg\s*,\s*(.+)\)$/);
  if (!m) return [{ color: '#D4AF37', position: 0 }, { color: '#F5E6A3', position: 100 }];
  return m[1].split(',').map((s) => {
    const parts = s.trim().split(/\s+/);
    return { color: parts[0], position: parseInt(parts[1]) || 0 };
  });
}

function DefaultArrow({ direction, size, color }: { direction: 'left' | 'right'; size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline
        points={direction === 'left' ? '15 18 9 12 15 6' : '9 6 15 12 9 18'}
        stroke={isGradient(color) ? '#000' : color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(dateStr: string, _format: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

interface TestimonialFeedPreviewProps {
  config: TestimonialFeedConfig;
  testimonials: CmsTestimonial[];
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  onBreakpointChange: (bp: 'desktop' | 'tablet' | 'mobile') => void;
}

export function TestimonialFeedPreview({
  config,
  testimonials,
  breakpoint,
  onBreakpointChange,
}: TestimonialFeedPreviewProps) {
  const columns = getColumnsForBreakpoint(config, breakpoint);

  const filteredTestimonials = useMemo(() => {
    let items = [...testimonials];
    if (config.selectionMode === 'manual' && config.selectedTestimonialIds.length > 0) {
      const idSet = new Set(config.selectedTestimonialIds);
      items = items.filter((t) => idSet.has(t.id));
      if (config.sortBy === 'custom_order') {
        const idxMap = new Map(config.selectedTestimonialIds.map((id, i) => [id, i]));
        items.sort((a, b) => (idxMap.get(a.id) ?? 0) - (idxMap.get(b.id) ?? 0));
        return items;
      }
    }
    switch (config.sortBy) {
      case 'newest':
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'custom_order':
        items.sort((a, b) => a.sortOrder - b.sortOrder);
        break;
    }
    return items;
  }, [testimonials, config.selectionMode, config.selectedTestimonialIds, config.sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTestimonials.length / columns));
  const [page, setPage] = useState(0);

  useEffect(() => { setPage(0); }, [columns, filteredTestimonials.length]);

  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    if (!config.autoplay || totalPages <= 1) return;
    intervalRef.current = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, config.autoplayInterval * 1000);
    return () => clearInterval(intervalRef.current);
  }, [config.autoplay, config.autoplayInterval, totalPages]);

  const pageItems = filteredTestimonials.slice(page * columns, page * columns + columns);

  const goLeft = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const goRight = useCallback(() => setPage((p) => Math.min(totalPages - 1, p + 1)), [totalPages]);

  return (
    <div>
      {/* Breakpoint toggle */}
      <div className="mb-4 flex items-center justify-center gap-1.5">
        {(Object.keys(BP_ICONS) as Array<keyof typeof BP_ICONS>).map((bp) => {
          const Icon = BP_ICONS[bp];
          return (
            <button
              key={bp}
              type="button"
              onClick={() => onBreakpointChange(bp)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${breakpoint === bp ? 'border-black bg-black text-white' : 'border-[#EBEBEB] text-[#888C99] hover:text-black'}`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      {/* Preview container */}
      <div
        className="mx-auto rounded-lg border border-[#EBEBEB] transition-all"
        style={{
          maxWidth: BP_WIDTHS[breakpoint],
          background: config.backgroundColor === 'transparent' ? undefined : config.backgroundColor,
          padding: 24,
        }}
      >
        {filteredTestimonials.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-[#888C99]">
            No testimonials to display. Add some in the Testimonials page.
          </div>
        ) : (
          <>
            {/* Cards grid */}
            <div
              className="relative"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: config.gap,
              }}
            >
              {pageItems.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col"
                  style={{
                    background: config.cardBackgroundColor,
                    borderRadius: config.cardRadius,
                    border: `1px solid ${config.cardBorderColor}`,
                    padding: config.cardPadding,
                  }}
                >
                  {/* Stars */}
                  {config.showRating && t.rating != null && t.rating > 0 && (
                    <div className="mb-3">
                      <StarRow
                        rating={t.rating}
                        size={config.starSize}
                        color={config.starColor}
                        uniqueId={t.id}
                      />
                    </div>
                  )}

                  {/* Quote */}
                  {config.showQuote && (
                    <p
                      style={{
                        fontFamily: config.quoteFont || undefined,
                        fontSize: config.quoteFontSize,
                        color: config.quoteColor,
                        lineHeight: config.quoteLineHeight,
                      }}
                      className="mb-3"
                    >
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  )}

                  {/* Author */}
                  <div className="mt-auto">
                    {config.showAuthorName && (
                      <p
                        style={{
                          fontFamily: config.authorNameFont || undefined,
                          fontSize: config.authorNameFontSize,
                          color: config.authorNameColor,
                        }}
                        className="font-medium"
                      >
                        {t.authorName}
                      </p>
                    )}
                    {config.showAuthorTitle && t.authorTitle && (
                      <p
                        style={{
                          fontFamily: config.authorTitleFont || undefined,
                          fontSize: config.authorTitleFontSize,
                          color: config.authorTitleColor,
                        }}
                      >
                        {t.authorTitle}
                      </p>
                    )}
                    {config.showDate && t.date && (
                      <p
                        style={{
                          fontFamily: config.dateFont || undefined,
                          fontSize: config.dateFontSize,
                          color: config.dateColor,
                        }}
                        className="mt-1"
                      >
                        {formatDate(t.date, config.dateFormat)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            {totalPages > 1 && (
              <div className="mt-5 flex items-center justify-center gap-3">
                {config.showArrows && (
                  <button
                    type="button"
                    onClick={goLeft}
                    disabled={page === 0}
                    className="flex items-center justify-center rounded-full transition-opacity disabled:opacity-30"
                    style={{ width: config.arrowSize, height: config.arrowSize }}
                  >
                    {config.customLeftArrowSvg ? (
                      <span dangerouslySetInnerHTML={{ __html: config.customLeftArrowSvg }} />
                    ) : (
                      <DefaultArrow direction="left" size={config.arrowSize * 0.6} color={config.arrowColor} />
                    )}
                  </button>
                )}

                {config.showDots && (
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPage(i)}
                        style={{
                          width: config.dotSize,
                          height: config.dotSize,
                          borderRadius: '50%',
                          background: i === page ? config.activeDotColor : config.inactiveDotColor,
                          transition: 'background 0.2s',
                        }}
                      />
                    ))}
                  </div>
                )}

                {config.showArrows && (
                  <button
                    type="button"
                    onClick={goRight}
                    disabled={page === totalPages - 1}
                    className="flex items-center justify-center rounded-full transition-opacity disabled:opacity-30"
                    style={{ width: config.arrowSize, height: config.arrowSize }}
                  >
                    {config.customRightArrowSvg ? (
                      <span dangerouslySetInnerHTML={{ __html: config.customRightArrowSvg }} />
                    ) : (
                      <DefaultArrow direction="right" size={config.arrowSize * 0.6} color={config.arrowColor} />
                    )}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
