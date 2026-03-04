'use client';

import { cn } from '@/lib/utils';

interface BrandLoaderProps {
  className?: string;
  size?: number;
}

const BOLT_PATH =
  'M500.6,219.6c33.5-40,66.8-79.7,100-119.4,1-1.1,2-2.3,3.3-3.1,3.1-2,6.4-1.6,9.4.3,2.9,1.9,3.2,4.7,2.4,7.9-6,23.2-11.9,46.4-17.8,69.6-6.7,26.1-13.4,52.2-20,78.3-2.7,10.7,4,19.3,15.2,19.4,16,.2,32,0,48,0,3,0,6,.3,8.9,1,12,3,16.2,15.3,8.3,24.8-31.6,37.8-63.4,75.5-95,113.3-26,31-51.9,62.1-77.8,93.2-1.4,1.7-3,3.1-5.1,3.8-3.1,1-6,.4-8.4-1.8-2.2-2-2.3-4.4-1.6-7.3,9.7-37.3,19.2-74.7,28.8-112.1,3-11.8,6-23.5,9-35.3,2.8-11-3.7-19.8-15.2-19.9-16.2-.2-32.3,0-48.5,0-3.2,0-6.3-.2-9.4-1.2-11.6-3.9-15-15.2-7.2-24.6,13.4-16.2,26.9-32.2,40.4-48.3,10.7-12.8,21.4-25.5,32.3-38.6Z';

export function BrandLoader({ className, size = 72 }: BrandLoaderProps) {
  const glowId = 'brand-loader-glow';
  const maskId = 'brand-loader-mask';
  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <svg width={size} height={size * 0.55} viewBox="430 70 260 460" aria-label="Loading">
        <defs>
          <mask id={maskId}>
            <path d={BOLT_PATH} fill="white" />
          </mask>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base black bolt */}
        <path d={BOLT_PATH} fill="#0A0A0A" />

        {/* Animated yellow fill rising from bottom */}
        <g mask={`url(#${maskId})`} filter={`url(#${glowId})`}>
          <rect
            x="420"
            y="60"
            width="300"
            height="480"
            fill="#DAFF07"
            className="brand-loader-water"
          />
        </g>
      </svg>
    </div>
  );
}
