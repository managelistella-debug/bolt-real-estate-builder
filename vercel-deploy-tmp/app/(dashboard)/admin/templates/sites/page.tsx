'use client';

import { useMemo, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/stores/auth';
import { useTemplateCatalogStore } from '@/lib/stores/templateCatalog';
import { SectionType } from '@/lib/types';

const TEMPLATE_SECTION_OPTIONS: Array<{ type: SectionType; label: string }> = [
  { type: 'hero', label: 'Hero' },
  { type: 'headline', label: 'Headline' },
  { type: 'services', label: 'Services' },
  { type: 'about', label: 'About' },
  { type: 'contact-form', label: 'Contact Form' },
  { type: 'listings', label: 'Listings Feed' },
  { type: 'blog-feed', label: 'Blog Feed' },
  { type: 'testimonials', label: 'Testimonials' },
];

export default function AdminSiteTemplatesPage() {
  const { user } = useAuthStore();
  const { assets, createSiteTemplate, publishAssetGlobal } = useTemplateCatalogStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [industries, setIndustries] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [baseAssetId, setBaseAssetId] = useState<string>('none');
  const [selectedSections, setSelectedSections] = useState<SectionType[]>(['hero', 'services', 'contact-form']);

  const fullSiteAssets = useMemo(
    () => assets.filter((asset) => asset.kind === 'full_site'),
    [assets]
  );

  const toggleSection = (sectionType: SectionType) => {
    setSelectedSections((current) =>
      current.includes(sectionType)
        ? current.filter((entry) => entry !== sectionType)
        : [...current, sectionType]
    );
  };

  const handleCreateTemplate = () => {
    if (!user) return;
    createSiteTemplate({
      name: name.trim(),
      description: description.trim(),
      industries: industries
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
      previewImage: previewImage.trim(),
      createdByUserId: user.id,
      sectionTypes: selectedSections,
      baseAssetId: baseAssetId === 'none' ? undefined : baseAssetId,
    });
    setName('');
    setDescription('');
    setIndustries('');
    setPreviewImage('');
    setBaseAssetId('none');
    setSelectedSections(['hero', 'services', 'contact-form']);
  };

  return (
    <div>
      <Header title="Site Templates" description="Create new full-site templates and publish them globally." />
      <div className="space-y-4 p-6">
        <Card className="space-y-4 p-4">
          <h3 className="font-semibold">Build New Site Template</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Template name</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Luxury Realtor Base" />
            </div>
            <div className="space-y-2">
              <Label>Preview image URL</Label>
              <Input
                value={previewImage}
                onChange={(event) => setPreviewImage(event.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Who this template is for and the style intent."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Industries (comma separated)</Label>
              <Input
                value={industries}
                onChange={(event) => setIndustries(event.target.value)}
                placeholder="real_estate, mortgage, investment"
              />
            </div>
            <div className="space-y-2">
              <Label>Base template (optional)</Label>
              <Select value={baseAssetId} onValueChange={setBaseAssetId}>
                <SelectTrigger>
                  <SelectValue placeholder="No base template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No base template</SelectItem>
                  {fullSiteAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Homepage sections</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {TEMPLATE_SECTION_OPTIONS.map((option) => (
                <label
                  key={option.type}
                  className="flex items-center gap-2 rounded border px-3 py-2 text-sm"
                >
                  <Checkbox
                    checked={selectedSections.includes(option.type)}
                    onCheckedChange={() => toggleSection(option.type)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          <Button onClick={handleCreateTemplate} disabled={!user || !name.trim()}>
            Create site template
          </Button>
        </Card>

        <Card className="space-y-3 p-4">
          <h3 className="font-semibold">Existing Site Templates</h3>
          <div className="divide-y">
            {fullSiteAssets.map((asset) => (
              <div key={asset.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">{asset.description}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary">full_site</Badge>
                    <Badge>{asset.scope}</Badge>
                  </div>
                </div>
                {asset.scope !== 'global' && user && (
                  <Button variant="outline" onClick={() => publishAssetGlobal(asset.id, user.id)}>
                    Publish global
                  </Button>
                )}
              </div>
            ))}
            {fullSiteAssets.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">No site templates yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
