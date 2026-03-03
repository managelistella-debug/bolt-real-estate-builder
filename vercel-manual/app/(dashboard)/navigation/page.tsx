'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NavigationPage() {
  return (
    <div>
      <Header
        title="Navigation Builder Retired"
        description="Navigation is now managed directly in each coded frontend website."
      />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Headless mode active</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Use your frontend framework (Next.js, React, etc.) to define navigation and route structure.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard"><Button variant="outline">Dashboard</Button></Link>
              <Link href="/settings"><Button variant="outline">Domain Settings</Button></Link>
              <Link href="/integrations"><Button>Integrations</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
