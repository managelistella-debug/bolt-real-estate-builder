'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth';
import { useTemplateCatalogStore } from '@/lib/stores/templateCatalog';
import { useAuditLogStore } from '@/lib/stores/auditLog';

export default function AdminHomePage() {
  const { getAllUsers, isImpersonating } = useAuthStore();
  const { assets } = useTemplateCatalogStore();
  const { events } = useAuditLogStore();

  return (
    <div>
      <Header
        title="Admin"
        description="Manage tenants, impersonation, and template distribution."
      />
      <div className="grid gap-4 p-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{getAllUsers().length}</p>
            <p className="mb-4 text-sm text-muted-foreground">Total users</p>
            <Button asChild variant="outline">
              <Link href="/admin/users">Open users</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Template Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{assets.length}</p>
            <p className="mb-4 text-sm text-muted-foreground">Global + assigned assets</p>
            <Button asChild variant="outline">
              <Link href="/admin/templates">Open templates</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Impersonation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{isImpersonating ? 'Active' : 'Idle'}</p>
            <p className="text-sm text-muted-foreground">Support mode status</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Audit Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{events.length}</p>
            <p className="mb-4 text-sm text-muted-foreground">Recent support actions</p>
            <Button asChild variant="outline">
              <Link href="/admin/audit">Open audit log</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
