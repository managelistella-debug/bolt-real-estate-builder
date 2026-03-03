'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <header className="border-b border-[#EBEBEB] bg-white">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-[15px] font-medium text-black">{title}</h1>
            {description && (
              <p className="text-[13px] text-[#888C99]">{description}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
