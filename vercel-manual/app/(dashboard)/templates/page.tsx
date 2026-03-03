'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TemplatesPage() {
  return (
    <div>
      <Header
        title="Templates Retired"
        description="Site/page template editing is disabled in headless CMS mode."
      />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Use content modules instead</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Manage blogs, listings, media, CRM, integrations, and domains from the main dashboard.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard"><Button variant="outline">Dashboard</Button></Link>
              <Link href="/blogs"><Button variant="outline">Blogs</Button></Link>
              <Link href="/listings"><Button variant="outline">Listings</Button></Link>
              <Link href="/collections"><Button variant="outline">Media Library</Button></Link>
              <Link href="/integrations"><Button>Integrations</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
