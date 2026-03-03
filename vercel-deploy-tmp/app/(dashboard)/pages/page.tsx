'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PagesListPage() {
  return (
    <div>
      <Header 
        title="Page Builder Retired"
        description="Visual page editing has been removed for headless CMS mode."
      />

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Use API-driven content instead</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Build pages directly in your codebase and consume content from this CMS via API.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/blogs"><Button variant="outline">Blogs</Button></Link>
              <Link href="/listings"><Button variant="outline">Listings</Button></Link>
              <Link href="/collections"><Button variant="outline">Media</Button></Link>
              <Link href="/integrations"><Button>Open Integrations</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
