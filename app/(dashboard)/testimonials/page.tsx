'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/lib/stores/auth';
import { useTestimonialsStore } from '@/lib/stores/testimonials';
import { CmsTestimonial } from '@/lib/types';
import { Star, Trash2, Pencil, X } from 'lucide-react';

const darkInput =
  'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s === value ? 0 : s)}
          className="p-0.5"
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              s <= value ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#CCCCCC]'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const { user } = useAuthStore();
  const { addTestimonial, updateTestimonial, getTestimonialsForCurrentUser, deleteTestimonial } =
    useTestimonialsStore();

  const [quote, setQuote] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [date, setDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const testimonials = user ? getTestimonialsForCurrentUser(user.id) : [];

  const resetForm = () => {
    setQuote('');
    setAuthorName('');
    setAuthorTitle('');
    setRating(5);
    setDate('');
    setEditingId(null);
  };

  const startEdit = (t: CmsTestimonial) => {
    setEditingId(t.id);
    setQuote(t.quote);
    setAuthorName(t.authorName);
    setAuthorTitle(t.authorTitle || '');
    setRating(t.rating ?? 5);
    setDate(t.date || '');
  };

  const handleSave = () => {
    if (!user || !quote || !authorName) return;

    if (editingId) {
      updateTestimonial(editingId, {
        quote,
        authorName,
        authorTitle: authorTitle || undefined,
        rating,
        date: date || undefined,
      });
      resetForm();
    } else {
      addTestimonial({
        userId: user.id,
        tenantId: user.businessId || user.id,
        quote,
        authorName,
        authorTitle: authorTitle || undefined,
        rating,
        date: date || undefined,
        sortOrder: testimonials.length,
        source: 'manual',
      });
      resetForm();
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F5F5F3]"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Testimonials" description="Manage customer testimonials for your embed widgets." />
      </div>
      <div className="grid gap-4 p-6 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-normal text-black">
              {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex h-6 w-6 items-center justify-center rounded text-[#888C99] hover:text-black"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Quote</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-2 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
                placeholder="What did they say?"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Author Name</label>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className={darkInput}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Author Title</label>
              <input
                value={authorTitle}
                onChange={(e) => setAuthorTitle(e.target.value)}
                className={darkInput}
                placeholder="CEO, Acme Corp"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={darkInput}
              />
            </div>
            <button
              type="button"
              className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]"
              onClick={handleSave}
            >
              {editingId ? 'Update Testimonial' : 'Save Testimonial'}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
          <h2 className="mb-4 text-[15px] font-normal text-black">Saved Testimonials</h2>
          <div className="space-y-2.5">
            {testimonials.length === 0 && (
              <p className="text-[13px] text-[#888C99]">No testimonials yet.</p>
            )}
            {testimonials.map((item) => (
              <div key={item.id} className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3">
                {item.rating != null && item.rating > 0 && (
                  <div className="mb-1 flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                )}
                <p className="text-[13px] font-medium text-black">{item.authorName}</p>
                {item.authorTitle && (
                  <p className="text-[11px] text-[#888C99]">{item.authorTitle}</p>
                )}
                <p className="mt-1.5 text-[13px] text-[#888C99]">&ldquo;{item.quote}&rdquo;</p>
                {item.date && (
                  <p className="mt-1 text-[11px] text-[#CCCCCC]">{item.date}</p>
                )}
                <div className="mt-2 flex gap-1.5">
                  <button
                    type="button"
                    className="flex h-[26px] items-center gap-1 rounded-lg border border-[#EBEBEB] bg-white px-2 text-[11px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
                    onClick={() => startEdit(item)}
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    type="button"
                    className="flex h-[26px] items-center gap-1 rounded-lg border border-[#EBEBEB] bg-white px-2 text-[11px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-red-500"
                    onClick={() => deleteTestimonial(item.id)}
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
