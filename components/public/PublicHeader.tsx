'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all ${
        scrolled
          ? 'border-[#e4dfd8] bg-[#141414] shadow-sm'
          : 'border-transparent bg-[#141414]/35 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-[30px] tracking-wide text-white">
          Prestige Realty
        </Link>
        <nav className="flex flex-wrap gap-5 text-[11px] font-medium uppercase tracking-[0.04em] text-white">
          <Link href="/buying">Buying</Link>
          <Link href="/selling">Selling</Link>
          <Link href="/listings/active">Active Listings</Link>
          <Link href="/listings/sold">Sold Listings</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/blog">Blog</Link>
        </nav>
      </div>
    </header>
  );
}
