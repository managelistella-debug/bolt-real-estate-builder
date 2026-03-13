import TestimonialManager from "@/components/admin/TestimonialManager";

export default function AdminTestimonialsPage() {
  return (
    <div>
      <h1 className="font-heading text-4xl text-white" style={{ fontWeight: 400 }}>
        Testimonials
      </h1>
      <p className="mt-2 text-white/70">Manage testimonials shown on homepage and about page.</p>
      <div className="mt-6">
        <TestimonialManager />
      </div>
    </div>
  );
}
