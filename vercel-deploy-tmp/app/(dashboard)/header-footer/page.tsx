'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HeaderFooterPage() {
  return (
    <div>
      <Header
        title="Header/Footer Builder Retired"
        description="Layout builder tooling is disabled in headless CMS mode."
      />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage coded site structure in your frontend repo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Use this app for content, CRM, integrations, and domains. Headers, navigation, and footers now live in your codebase.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/integrations"><Button>Open Integrations</Button></Link>
              <Link href="/settings"><Button variant="outline">Domain Settings</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
