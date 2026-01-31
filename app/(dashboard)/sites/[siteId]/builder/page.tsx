'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useWebsiteStore } from '@/lib/stores/website';
import { useBuilderStore } from '@/lib/stores/builder';
import { BuilderToolbar } from '@/components/builder/BuilderToolbar';
import { SectionsList } from '@/components/builder/SectionsList';
import { SectionEditor } from '@/components/builder/SectionEditor';
import { LivePreview } from '@/components/builder/LivePreview';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function BuilderPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const searchParams = useSearchParams();
  const pageId = searchParams?.get('pageId');
  const { toast } = useToast();
  
  const { websites } = useWebsiteStore();
  const { setCurrentPage, selectedSectionId } = useBuilderStore();
  const [isSaving, setIsSaving] = useState(false);

  const website = websites.find(w => w.id === siteId);
  const currentPage = website?.pages.find(p => p.id === pageId);

  useEffect(() => {
    if (pageId) {
      setCurrentPage(pageId);
    }
  }, [pageId, setCurrentPage]);

  if (!website || !currentPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Page not found</h2>
          <p className="text-muted-foreground mb-4">The page you're looking for doesn't exist.</p>
          <Link href={`/sites/${siteId}/pages`}>
            <Button>Back to Pages</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully.",
    });
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-background">
        <div className="flex items-center gap-3">
          <Link href={`/sites/${siteId}/pages`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold">{currentPage.name}</h1>
            <p className="text-xs text-muted-foreground">{currentPage.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <BuilderToolbar />
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Sections & Editor */}
        <div className="w-80 border-r flex flex-col overflow-hidden">
          {selectedSectionId ? (
            <SectionEditor 
              siteId={siteId}
              pageId={currentPage.id}
              sections={currentPage.sections}
            />
          ) : (
            <SectionsList 
              siteId={siteId}
              pageId={currentPage.id}
              sections={currentPage.sections}
            />
          )}
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-1 overflow-auto bg-muted/30">
          <LivePreview 
            page={currentPage}
            website={website}
          />
        </div>
      </div>
    </div>
  );
}
