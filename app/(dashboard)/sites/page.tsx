'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Settings, Eye } from 'lucide-react';
import { useWebsiteStore } from '@/lib/stores/website';

export default function SitesPage() {
  const { websites } = useWebsiteStore();

  return (
    <div>
      <Header 
        title="Websites"
        description="Manage your websites"
        action={
          <Link href="/templates">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Website
            </Button>
          </Link>
        }
      />

      <div className="p-6">
        {websites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No websites yet</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                Create your first website by choosing a template
              </p>
              <Link href="/templates">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Website
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {websites.map((website) => (
              <Card key={website.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{website.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {website.domain || 'No domain set'}
                      </CardDescription>
                    </div>
                    <Badge variant={website.published ? "default" : "secondary"}>
                      {website.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {website.pages.length} page{website.pages.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/sites/${website.id}/pages`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </Link>
                      <Link href={`/sites/${website.id}/builder`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
