'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PreviewPage({ params }: { params: { pageId: string } }) {
  return (
    <div>
      <Header
        title="Preview Disabled"
        description={`Builder preview for page ${params.pageId} is retired in headless mode.`}
      />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Use your frontend environment for previews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Run your coded website locally and consume content via the public API routes from this CMS.
            </p>
            <div className="flex gap-2">
              <Link href="/dashboard"><Button>Dashboard</Button></Link>
              <Link href="/settings"><Button variant="outline">API Keys</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
