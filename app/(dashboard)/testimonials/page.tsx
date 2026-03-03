'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/lib/stores/auth';
import { useTestimonialsStore } from '@/lib/stores/testimonials';
import { Trash2 } from 'lucide-react';

const darkInput = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

export default function TestimonialsPage() {
  const { user } = useAuthStore();
  const { addTestimonial, getTestimonialsForCurrentUser, deleteTestimonial } = useTestimonialsStore();
  const [quote, setQuote] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');

  const testimonials = user ? getTestimonialsForCurrentUser(user.id) : [];

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Testimonials" description="Manage customer testimonials for your coded websites." />
      </div>
      <div className="grid gap-4 p-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="mb-4 text-[15px] font-normal text-black">Add Testimonial</h2>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Quote</label>
              <input value={quote} onChange={(e) => setQuote(e.target.value)} className={darkInput} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Author Name</label>
              <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className={darkInput} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Author Title</label>
              <input value={authorTitle} onChange={(e) => setAuthorTitle(e.target.value)} className={darkInput} />
            </div>
            <button
              type="button"
              className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]"
              onClick={() => {
                if (!user || !quote || !authorName) return;
                addTestimonial({ userId: user.id, quote, authorName, authorTitle, sortOrder: testimonials.length, source: 'manual' });
                setQuote(''); setAuthorName(''); setAuthorTitle('');
              }}
            >
              Save Testimonial
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="mb-4 text-[15px] font-normal text-black">Saved Testimonials</h2>
          <div className="space-y-2.5">
            {testimonials.length === 0 && (
              <p className="text-[13px] text-[#888C99]">No testimonials yet.</p>
            )}
            {testimonials.map((item) => (
              <div key={item.id} className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3">
                <p className="text-[13px] font-medium text-black">{item.authorName}</p>
                {item.authorTitle && <p className="text-[11px] text-[#888C99]">{item.authorTitle}</p>}
                <p className="mt-1.5 text-[13px] text-[#888C99]">{item.quote}</p>
                <button type="button" className="mt-2 flex h-[26px] items-center gap-1 rounded-lg border border-[#EBEBEB] bg-white px-2 text-[11px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-red-500" onClick={() => deleteTestimonial(item.id)}>
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
