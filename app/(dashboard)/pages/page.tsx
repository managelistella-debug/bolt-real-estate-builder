'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useWebsiteStore } from '@/lib/stores/website';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Copy, Trash2, Home } from 'lucide-react';
import { Page } from '@/lib/types';

interface PageRowProps {
  page: Page;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSetHomepage: () => void;
}

function PageRow({ page, onEdit, onDuplicate, onDelete, onSetHomepage }: PageRowProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{page.name}</h3>
            {page.isHomepage && (
              <Badge variant="secondary" className="text-xs">
                <Home className="h-3 w-3 mr-1" />
                Homepage
              </Badge>
            )}
            <Badge variant={page.status === 'published' ? 'default' : 'outline'} className="text-xs">
              {page.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{page.slug}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {page.sections.length} section{page.sections.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDuplicate}>
          <Copy className="h-4 w-4" />
        </Button>
        {!page.isHomepage && (
          <>
            <Button variant="ghost" size="sm" onClick={onSetHomepage}>
              <Home className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PagesListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { getCurrentUserWebsite, initializeUserWebsite, addPage, duplicatePage, deletePage, setHomepage } = useWebsiteStore();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  useEffect(() => {
    if (user) {
      initializeUserWebsite(user.id);
    }
  }, [user, initializeUserWebsite]);

  const website = getCurrentUserWebsite();

  const handleCreatePage = () => {
    if (!newPageName || !newPageSlug) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    if (!website) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Website not initialized",
      });
      return;
    }

    const newPage: Page = {
      id: `page-${Date.now()}`,
      websiteId: website.id,
      name: newPageName,
      slug: newPageSlug.startsWith('/') ? newPageSlug : `/${newPageSlug}`,
      isHomepage: false,
      sections: [],
      seo: {
        metaTitle: newPageName,
        metaDescription: '',
      },
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addPage(newPage);

    toast({
      title: "Page created",
      description: "Your new page has been created successfully.",
    });

    setIsCreateDialogOpen(false);
    setNewPageName('');
    setNewPageSlug('');
  };

  const handleDuplicatePage = (pageId: string) => {
    duplicatePage(pageId);
    toast({
      title: "Page duplicated",
      description: "The page has been duplicated successfully.",
    });
  };

  const handleDeletePage = (pageId: string) => {
    deletePage(pageId);
    toast({
      title: "Page deleted",
      description: "The page has been deleted successfully.",
    });
  };

  const handleSetHomepage = (pageId: string) => {
    setHomepage(pageId);
    toast({
      title: "Homepage updated",
      description: "The homepage has been updated successfully.",
    });
  };

  if (!website) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header 
        title="Pages"
        description="Build and manage your website pages"
        action={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
        }
      />

      <div className="p-6">
        <Card>
          <div className="divide-y">
            {website.pages.length === 0 ? (
              <div className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first page to get started
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Page
                </Button>
              </div>
            ) : (
              website.pages.map((page) => (
                <PageRow
                  key={page.id}
                  page={page}
                  onEdit={() => router.push(`/pages/${page.id}/builder`)}
                  onDuplicate={() => handleDuplicatePage(page.id)}
                  onDelete={() => handleDeletePage(page.id)}
                  onSetHomepage={() => handleSetHomepage(page.id)}
                />
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Create Page Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Add a new page to your website.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pageName">Page Title</Label>
              <Input
                id="pageName"
                placeholder="About Us"
                value={newPageName}
                onChange={(e) => {
                  setNewPageName(e.target.value);
                  // Auto-generate slug
                  const slug = e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                  setNewPageSlug(slug);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pageSlug">URL Slug</Label>
              <Input
                id="pageSlug"
                placeholder="about-us"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                https://test.sitebuilder.app/{newPageSlug || 'page-slug'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePage}>Create Page</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
