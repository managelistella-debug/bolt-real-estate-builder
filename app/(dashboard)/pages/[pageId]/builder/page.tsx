'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWebsiteStore } from '@/lib/stores/website';
import { useAuthStore } from '@/lib/stores/auth';
import { useBuilderStore } from '@/lib/stores/builder';
import { BuilderToolbar } from '@/components/builder/BuilderToolbar';
import { SectionsList } from '@/components/builder/SectionsList';
import { SectionEditor } from '@/components/builder/SectionEditor';
import { LivePreview } from '@/components/builder/LivePreview';
import { LayersPanel } from '@/components/builder/LayersPanel';
import { Save, ArrowLeft, Layers, Eye } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function PageBuilderPage({ params }: { params: { pageId: string } }) {
  const { pageId } = params;
  const { toast } = useToast();
  const { user } = useAuthStore();
  
  const { getCurrentUserWebsite, initializeUserWebsite } = useWebsiteStore();
  const { setCurrentPage, selectedSectionId, showLayersPanel, setShowLayersPanel } = useBuilderStore();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      initializeUserWebsite(user.id);
    }
  }, [user, initializeUserWebsite]);

  useEffect(() => {
    if (pageId) {
      setCurrentPage(pageId);
    }
  }, [pageId, setCurrentPage]);

  const website = getCurrentUserWebsite();
  const currentPage = website?.pages.find(p => p.id === pageId);

  if (!website || !currentPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Page not found</h2>
          <p className="text-muted-foreground mb-4">The page you're looking for doesn't exist.</p>
          <Link href="/pages">
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

  const handlePreview = () => {
    // TODO: Open preview in new tab
    toast({
      title: "Preview",
      description: "Preview functionality coming soon",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-background">
        <div className="flex items-center gap-3">
          <Link href="/pages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-semibold text-sm">{currentPage.name}</h1>
            <p className="text-xs text-muted-foreground">{currentPage.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <BuilderToolbar />
          <div className="h-6 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLayersPanel(!showLayersPanel)}
          >
            <Layers className="h-4 w-4 mr-2" />
            Layers
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Sections & Editor */}
        <div className="w-80 border-r flex flex-col overflow-hidden bg-background">
          {selectedSectionId ? (
            <SectionEditor 
              pageId={currentPage.id}
              sections={currentPage.sections}
            />
          ) : (
            <SectionsList 
              pageId={currentPage.id}
              sections={currentPage.sections}
            />
          )}
        </div>

        {/* Center Canvas */}
        <div className="flex-1 overflow-auto bg-muted/30">
          <LivePreview 
            page={currentPage}
            website={website}
          />
        </div>

        {/* Right Sidebar - Layers Panel (optional) */}
        {showLayersPanel && (
          <div className="w-64 border-l flex flex-col overflow-hidden bg-background">
            <LayersPanel
              sections={currentPage.sections}
              pageId={currentPage.id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
