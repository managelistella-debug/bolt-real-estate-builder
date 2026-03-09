'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ListingFeedEditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Listing Feed Editor Error:', error);
  }, [error]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <div className="max-w-md rounded-xl border border-[#EBEBEB] bg-white p-8 text-center">
        <p className="text-[15px] font-medium text-black">Something went wrong</p>
        <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-[#F5F5F3] p-3 text-left text-[12px] text-red-600">
          {error.message}
        </pre>
        {error.stack && (
          <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-[#F5F5F3] p-3 text-left text-[11px] text-[#888C99]">
            {error.stack}
          </pre>
        )}
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={reset}
            className="flex h-[30px] items-center rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]"
          >
            Try again
          </button>
          <Link
            href="/embeds"
            className="flex h-[30px] items-center rounded-lg border border-[#EBEBEB] px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
          >
            Back to Embeds
          </Link>
        </div>
      </div>
    </div>
  );
}
