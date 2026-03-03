import { getTagColor } from '@/lib/utils';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadTagProps {
  tag: string;
  onRemove?: () => void;
  className?: string;
}

export function LeadTag({ tag, onRemove, className }: LeadTagProps) {
  const colors = getTagColor(tag);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
