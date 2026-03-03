'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useBuilderStore } from '@/lib/stores/builder';

interface SectionEditorTabsProps {
  sectionType: string;
  contentTab: ReactNode;
  layoutTab: ReactNode;
  styleTab: ReactNode;
}

export function SectionEditorTabs({ 
  sectionType, 
  contentTab, 
  layoutTab, 
  styleTab 
}: SectionEditorTabsProps) {
  const { selectSection } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'style'>('content');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectSection(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold capitalize">Edit {sectionType.replace(/-/g, ' ')}</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'content'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'layout'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Layout
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'style'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Style
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'content' && contentTab}
        {activeTab === 'layout' && layoutTab}
        {activeTab === 'style' && styleTab}
      </div>
    </div>
  );
}
