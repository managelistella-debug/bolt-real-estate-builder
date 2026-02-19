'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useBlogTemplatesStore } from '@/lib/stores/blogTemplates';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BlogTemplatesPage() {
  const { templates, createTemplate, activeTemplateId, setActiveTemplate } = useBlogTemplatesStore();
  const [newTemplateName, setNewTemplateName] = useState('');
  const [baseTemplateId, setBaseTemplateId] = useState<'classic' | 'feature'>('classic');
  const visibleTemplates = templates.filter(
    (template) =>
      template.id !== 'sidebar' &&
      !template.id.startsWith('template_legacy_sidebar_') &&
      template.name.toLowerCase() !== 'sidebar layout'
  );

  useEffect(() => {
    if (!visibleTemplates.length) return;
    if (visibleTemplates.some((template) => template.id === activeTemplateId)) return;
    setActiveTemplate(visibleTemplates[0].id);
  }, [activeTemplateId, setActiveTemplate, visibleTemplates]);

  return (
    <div>
      <Header
        title="Blog Templates"
        description="Manage your article layout templates and open the full-screen template editor."
      />

      <div className="space-y-6 p-6">
        <Card className="space-y-3 p-4">
          <p className="text-sm font-semibold">Create New Template</p>
          <div className="space-y-2">
            <Label>Base template</Label>
            <Select value={baseTemplateId} onValueChange={(value: 'classic' | 'feature') => setBaseTemplateId(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic Article</SelectItem>
                <SelectItem value="feature">Feature Header</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Input
              value={newTemplateName}
              onChange={(event) => setNewTemplateName(event.target.value)}
              placeholder="Template name"
            />
            <Button
              onClick={() => {
                const template = createTemplate(newTemplateName, baseTemplateId);
                setNewTemplateName('');
                window.location.href = `/blogs/templates/editor/${template.id}`;
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleTemplates.map((template) => (
            <Card key={template.id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{template.name}</p>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                {template.id === activeTemplateId && <Badge>Active</Badge>}
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Layout: {template.layoutVariant === 'newsletter' ? 'Classic article' : 'Feature header'}</p>
                <p>Sticky contact: {template.showSidebarContact ? 'Enabled' : 'Disabled'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={template.id === activeTemplateId ? 'default' : 'outline'}
                  onClick={() => setActiveTemplate(template.id)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {template.id === activeTemplateId ? 'Active Template' : 'Set Active'}
                </Button>
                <Link href={`/blogs/templates/editor/${template.id}`}>
                  <Button className="w-full">Open Editor</Button>
                </Link>
              </div>
            </Card>
          ))}
          {visibleTemplates.length === 0 && (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">No templates found yet.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
