'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/stores/auth';
import { useTestimonialsStore } from '@/lib/stores/testimonials';

export default function TestimonialsPage() {
  const { user } = useAuthStore();
  const { addTestimonial, getTestimonialsForCurrentUser, deleteTestimonial } = useTestimonialsStore();
  const [quote, setQuote] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');

  const testimonials = user ? getTestimonialsForCurrentUser(user.id) : [];

  return (
    <div>
      <Header title="Testimonials" description="Manage customer testimonials for your coded websites." />
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Testimonial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="quote">Quote</Label>
              <Input id="quote" value={quote} onChange={(e) => setQuote(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorName">Author Name</Label>
              <Input id="authorName" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorTitle">Author Title</Label>
              <Input id="authorTitle" value={authorTitle} onChange={(e) => setAuthorTitle(e.target.value)} />
            </div>
            <Button
              onClick={() => {
                if (!user || !quote || !authorName) return;
                addTestimonial({
                  userId: user.id,
                  quote,
                  authorName,
                  authorTitle,
                  sortOrder: testimonials.length,
                  source: 'manual',
                });
                setQuote('');
                setAuthorName('');
                setAuthorTitle('');
              }}
            >
              Save Testimonial
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Testimonials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {testimonials.length === 0 && (
              <p className="text-sm text-muted-foreground">No testimonials yet.</p>
            )}
            {testimonials.map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <p className="font-medium">{item.authorName}</p>
                {item.authorTitle && <p className="text-xs text-muted-foreground">{item.authorTitle}</p>}
                <p className="mt-2 text-sm">{item.quote}</p>
                <Button className="mt-2" variant="outline" size="sm" onClick={() => deleteTestimonial(item.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
