import { ReactNode } from 'react';
import { PublicFooter } from './PublicFooter';
import { PublicHeader } from './PublicHeader';

export function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f3ef] text-[#1f1e1e]">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
