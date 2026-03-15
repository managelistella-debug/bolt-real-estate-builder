'use client';

import { Header } from '@/components/layout/header';
import TestimonialManager from '@/components/aspen/admin/TestimonialManager';

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header
          title="Testimonials"
          description="Manage customer testimonials"
        />
      </div>
      <TestimonialManager />
    </div>
  );
}
