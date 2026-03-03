import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadTagProps {
  tag: string;
  onRemove?: () => void;
  className?: string;
}

const tagColors: Record<string, string> = {
  buyer: 'bg-[#DAFF07]/20 text-[#5A6600] border-[#DAFF07]/30',
  seller: 'bg-[#F0EDFF] text-[#5B3DC5] border-[#DDD6FF]',
  investor: 'bg-[#FFF4D6] text-[#8A6200] border-[#F5E6B0]',
  renter: 'bg-[#E4F9EC] text-[#0D7A3E] border-[#B8EDCC]',
  referral: 'bg-[#FFF0F0] text-[#C53030] border-[#FED7D7]',
};

const fallback = 'bg-[#F5F5F3] text-[#888C99] border-[#EBEBEB]';

export function LeadTag({ tag, onRemove, className }: LeadTagProps) {
  const colors = tagColors[tag.toLowerCase()] || fallback;

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium', colors, className)}>
      {tag}
      {onRemove && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="transition-opacity hover:opacity-70">
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  );
}
