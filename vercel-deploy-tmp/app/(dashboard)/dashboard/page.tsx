'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CheckSquare, Plus, Building2, FileText, Images, PlugZap } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { useWebsiteStore } from '@/lib/stores/website';
import { useLeadsStore } from '@/lib/stores/leads';
import { useListingsStore } from '@/lib/stores/listings';
import { useBlogsStore } from '@/lib/stores/blogs';
import { useImageCollectionsStore } from '@/lib/stores/imageCollections';
import { mockWebsites } from '@/lib/mock-data/websites';
import { mockLeads, mockTasks } from '@/lib/mock-data/leads';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { websites } = useWebsiteStore();
  const { leads, tasks } = useLeadsStore();
  const { getListingsForCurrentUser } = useListingsStore();
  const { getBlogsForCurrentUser } = useBlogsStore();
  const { getCollectionsForCurrentUser } = useImageCollectionsStore();

  // Initialize mock data (in real app, this would be fetched from API)
  useEffect(() => {
    if (websites.length === 0) {
      useWebsiteStore.setState({ websites: mockWebsites });
    }
    if (leads.length === 0) {
      useLeadsStore.setState({ leads: mockLeads, tasks: mockTasks });
    }
  }, [leads.length, websites.length]);

  const scopedWebsites = websites.filter((website) => (user?.id ? website.userId === user.id : true));
  const scopedWebsiteIds = new Set(scopedWebsites.map((website) => website.id));
  const scopedLeads = leads.filter((lead) => scopedWebsiteIds.has(lead.websiteId));
  const activeWebsites = scopedWebsites.filter(w => w.published).length;
  const newLeads = scopedLeads.filter(l => l.status === 'new').length;
  const listingCount = user ? getListingsForCurrentUser(user.id).length : getListingsForCurrentUser().length;
  const blogCount = user ? getBlogsForCurrentUser(user.id).length : getBlogsForCurrentUser().length;
  const mediaCount = user ? getCollectionsForCurrentUser(user.id).length : getCollectionsForCurrentUser().length;
  const scopedLeadIds = new Set(scopedLeads.map((lead) => lead.id));
  const scopedTasks = tasks.filter((task) => scopedLeadIds.has(task.leadId));
  const pendingTasks = scopedTasks.filter(t => !t.completed).length;

  return (
    <div>
      <Header 
        title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
        description="Manage your websites content, media, CRM, and integrations from one place."
        action={
          <Link href="/listings">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Listing
            </Button>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Listings</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{listingCount}</div>
              <p className="text-xs text-muted-foreground">
                published + draft
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogCount}</div>
              <p className="text-xs text-muted-foreground">
                across all statuses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Media Collections</CardTitle>
              <Images className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaCount}</div>
              <p className="text-xs text-muted-foreground">
                libraries and galleries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newLeads}</div>
              <p className="text-xs text-muted-foreground">
                {scopedLeads.length} total leads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground">
                {scopedTasks.length} total tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
              <PlugZap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeWebsites}</div>
              <p className="text-xs text-muted-foreground">
                {scopedWebsites.length} configured
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/listings">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="h-4 w-4 mr-2" />
                Manage Listings
              </Button>
            </Link>
            <Link href="/blogs">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Manage Blogs
              </Button>
            </Link>
            <Link href="/collections">
              <Button variant="outline" className="w-full justify-start">
                <Images className="h-4 w-4 mr-2" />
                Open Media Library
              </Button>
            </Link>
            <Link href="/leads">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View CRM
              </Button>
            </Link>
            <Link href="/integrations">
              <Button variant="outline" className="w-full justify-start">
                <PlugZap className="h-4 w-4 mr-2" />
                Configure Integrations
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {scopedLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No leads yet. They will appear here when someone submits a form on your website.
              </p>
            ) : (
              <div className="space-y-4">
                {scopedLeads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                        ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                          lead.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                          lead.status === 'closed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {scopedTasks.filter(t => !t.completed).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending tasks. Great job!
              </p>
            ) : (
              <div className="space-y-3">
                {scopedTasks.filter(t => !t.completed).slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                    <CheckSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
