'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockTemplates } from '@/lib/mock-data/templates';
import { Template } from '@/lib/types';
import { useWebsiteStore } from '@/lib/stores/website';
import { useAuthStore } from '@/lib/stores/auth';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

export default function TemplatesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addWebsite } = useWebsiteStore();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleCreateWebsite = async () => {
    if (!selectedTemplate || !user) return;

    setIsCreating(true);
    
    // Simulate creating website
    await new Promise(resolve => setTimeout(resolve, 500));

    const newWebsite = {
      id: `website-${Date.now()}`,
      name: `My ${selectedTemplate.name} Site`,
      userId: user.id,
      templateId: selectedTemplate.id,
      published: false,
      globalStyles: selectedTemplate.defaultGlobalStyles,
      header: selectedTemplate.defaultHeader,
      footer: selectedTemplate.defaultFooter,
      pages: selectedTemplate.defaultPages.map((page, index) => ({
        ...page,
        id: `page-${Date.now()}-${index}`,
        websiteId: `website-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    useWebsiteStore.setState((state) => ({
      websites: [...state.websites, newWebsite],
    }));

    toast({
      title: "Website created!",
      description: "Your new website has been created from the template.",
    });

    setSelectedTemplate(null);
    router.push(`/sites/${newWebsite.id}/pages`);
  };

  return (
    <div>
      <Header 
        title="Templates"
        description="Choose a starter template for your website"
      />

      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <Image
                  src={template.previewImage}
                  alt={template.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription className="mt-2">{template.description}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {template.industry.slice(0, 3).map((industry) => (
                    <Badge key={industry} variant="secondary" className="text-xs">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectTemplate(template)}
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Template Preview Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={selectedTemplate.previewImage}
                  alt={selectedTemplate.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h4 className="font-medium mb-2">Industries:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.industry.map((industry) => (
                    <Badge key={industry} variant="secondary">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Included Sections:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {selectedTemplate.defaultPages[0]?.sections.map((section) => (
                    <li key={section.id} className="capitalize">
                      {section.type} Section
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleCreateWebsite}
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Website'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
