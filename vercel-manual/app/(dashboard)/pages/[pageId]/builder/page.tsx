'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PageBuilderPage({ params }: { params: { pageId: string } }) {
  return (
    <div>
      <Header
        title="Builder Disabled"
        description={`Page ${params.pageId} is no longer editable with the visual builder.`}
      />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Headless CMS mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Build pages in your codebase and pull content through the public APIs from this CMS.
            </p>
            <div className="flex gap-2">
              <Link href="/dashboard"><Button>Back to Dashboard</Button></Link>
              <Link href="/blogs"><Button variant="outline">Manage Blogs</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
