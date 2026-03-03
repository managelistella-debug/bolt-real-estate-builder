'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Eye, Link2, Monitor, Plus, Smartphone, Tablet, Trash2 } from 'lucide-react';
import { useBlogTemplatesStore } from '@/lib/stores/blogTemplates';
import { BlogDynamicField, BlogPostTemplateConfig, BlogPostTemplateId, GlobalStyles } from '@/lib/types';
import { useWebsiteStore } from '@/lib/stores/website';
import { useToast } from '@/components/ui/use-toast';
import { useBuilderStore } from '@/lib/stores/builder';
import { useBlogsStore } from '@/lib/stores/blogs';
import { SiteHeader } from '@/components/site-header/SiteHeader';
import { SiteFooter } from '@/components/site-footer/SiteFooter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GlobalColorInput } from '@/components/builder/controls/GlobalColorInput';
import { TypographyControl } from '@/components/builder/controls/TypographyControl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlogTemplateEditorProps {
  templateId: BlogPostTemplateId;
}

const SAMPLE_HTML = `
  <h2>2026 Housing Market Outlook: What Buyers and Sellers Can Expect</h2>
  <p>
    The National Association of REALTORS recently highlighted the 2026 U.S. housing market outlook,
    with early signs suggesting conditions may be stabilizing.
  </p>
  <p>
    Persistent supply shortages and strong homeowner equity mean pricing pressure can remain in key markets,
    while lower rates may bring new buyer activity.
  </p>
  <h3>Local Happenings</h3>
  <p>Use this section for rich text, inline images, and your custom blocks below.</p>
`;

const IMAGE_BIND_OPTIONS: Array<{ value: BlogDynamicField; label: string }> = [
  { value: 'featuredImage', label: 'Featured image' },
];

const TEXT_BIND_OPTIONS: Array<{ value: BlogDynamicField; label: string }> = [
  { value: 'title', label: 'Title' },
  { value: 'excerpt', label: 'Excerpt' },
  { value: 'category', label: 'Category' },
];

const CONTENT_BIND_OPTIONS: Array<{ value: BlogDynamicField; label: string }> = [
  { value: 'contentHtml', label: 'Content (WYSIWYG HTML)' },
  { value: 'excerpt', label: 'Excerpt text' },
];

const DATE_BIND_OPTIONS: Array<{ value: 'publishedAt' | 'createdAt' | 'updatedAt'; label: string }> = [
  { value: 'publishedAt', label: 'Published date' },
  { value: 'createdAt', label: 'Created date' },
  { value: 'updatedAt', label: 'Updated date' },
];

const PREVIEW_RELATED_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop',
];

const DEFAULT_DYNAMIC_BINDINGS: BlogPostTemplateConfig['dynamicBindings'] = {
  heroImageField: 'featuredImage',
  titleField: 'title',
  dateField: 'publishedAt',
  contentField: 'contentHtml',
};

export function BlogTemplateEditor({ templateId }: BlogTemplateEditorProps) {
  const { getTemplateById, updateTemplate } = useBlogTemplatesStore();
  const blogs = useBlogsStore((state) => state.blogs);
  const { currentWebsite } = useWebsiteStore();
  const { toast } = useToast();
  const [draft, setDraft] = useState<BlogPostTemplateConfig | null>(null);
  const [activeSection, setActiveSection] = useState<'hero' | 'body' | 'related'>('hero');
  const { deviceView, setDeviceView } = useBuilderStore();

  const template = useMemo(() => getTemplateById(templateId), [getTemplateById, templateId]);
  const previewBlogSlug = useMemo(() => {
    const published = blogs.find((blog) => blog.status === 'published');
    return (published || blogs[0])?.slug;
  }, [blogs]);
  const categorySuggestions = useMemo(
    () =>
      Array.from(
        new Set(
          blogs
            .map((blog) => (blog.category || '').trim())
            .filter(Boolean)
        )
      ),
    [blogs]
  );
  const tagSuggestions = useMemo(
    () =>
      Array.from(
        new Set(
          blogs.flatMap((blog) => blog.tags.map((tag) => tag.trim())).filter(Boolean)
        )
      ),
    [blogs]
  );

  useEffect(() => {
    if (!template) return;
    setDraft(
      typeof structuredClone === 'function'
        ? structuredClone(template)
        : {
            ...template,
            style: {
              ...template.style,
              typography: { ...template.style.typography },
            },
            sidebarForm: {
              ...template.sidebarForm,
              fields: template.sidebarForm.fields.map((field) => ({ ...field })),
            },
            dynamicBindings: {
              ...DEFAULT_DYNAMIC_BINDINGS,
              ...(template.dynamicBindings || {}),
            },
          }
    );
  }, [template]);

  if (!template || !draft) {
    return (
      <div className="grid h-screen place-items-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Template not found</p>
          <Link href="/blogs/templates" className="text-sm text-primary hover:underline">
            Return to template library
          </Link>
        </div>
      </div>
    );
  }

  const updateStyle = (updates: Partial<BlogPostTemplateConfig['style']>) => {
    setDraft((prev) => (prev ? { ...prev, style: { ...prev.style, ...updates } } : prev));
  };

  const updateTypographyResponsiveSize = (
    key: keyof BlogPostTemplateConfig['style']['typography'],
    next: any
  ) => {
    const current = draft.style.typography[key];
    updateStyle({
      typography: {
        ...draft.style.typography,
        [key]: {
          ...current,
          fontSizeResponsive: next,
        },
      },
    });
  };

  const save = () => {
    updateTemplate(draft.id, draft);
    toast({ title: 'Template saved', description: `${draft.name} has been updated.` });
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b bg-background">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/blogs/templates">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <p className="text-sm font-semibold">{draft.name}</p>
              <p className="text-xs text-muted-foreground">{draft.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={deviceView === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setDeviceView('desktop')}
              title="Desktop"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceView === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setDeviceView('tablet')}
              title="Tablet"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceView === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setDeviceView('mobile')}
              title="Mobile"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" disabled={!previewBlogSlug}>
              <Link href={previewBlogSlug ? `/blog/${previewBlogSlug}` : '#'} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Preview
              </Link>
            </Button>
            <Button onClick={save}>Save Template</Button>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[440px_minmax(0,1fr)]">
        <aside className="min-h-0 space-y-4 overflow-auto border-r p-4">
          <Card className="space-y-3 p-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Layout</Label>
              <Select
                value={draft.layoutVariant}
                onValueChange={(value: 'newsletter' | 'insights') => setDraft({ ...draft, layoutVariant: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newsletter">Classic article</SelectItem>
                  <SelectItem value="insights">Feature header</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="space-y-2 p-2">
            <div className="flex items-center justify-between px-1 pb-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sections</p>
              <div className="flex gap-1">
                {!draft.showSidebarContact && (
                  <Button size="sm" variant="outline" onClick={() => setDraft({ ...draft, showSidebarContact: true })}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Contact
                  </Button>
                )}
                {!draft.showBottomBlogCards && (
                  <Button size="sm" variant="outline" onClick={() => setDraft({ ...draft, showBottomBlogCards: true })}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Related
                  </Button>
                )}
              </div>
            </div>
            <Button
              variant={activeSection === 'hero' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('hero')}
            >
              Blog Hero Header
            </Button>
            <Button
              variant={activeSection === 'body' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('body')}
            >
              Blog + Contact Form
            </Button>
            <Button
              variant={activeSection === 'related' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection('related')}
            >
              Related Posts
            </Button>
          </Card>

          {activeSection === 'hero' && (
            <SectionTabsCard>
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-3">
                  <CollapsibleBlock title="Dynamic Fields" defaultOpen>
                    <p className="text-xs text-muted-foreground">
                      Dynamically links to:
                    </p>
                    <DynamicBindingRow
                      label="Featured image"
                      value={draft.dynamicBindings?.heroImageField || DEFAULT_DYNAMIC_BINDINGS.heroImageField}
                      options={IMAGE_BIND_OPTIONS}
                      onChange={(value) =>
                        setDraft({
                          ...draft,
                          dynamicBindings: {
                            ...DEFAULT_DYNAMIC_BINDINGS,
                            ...(draft.dynamicBindings || {}),
                            heroImageField: value as BlogDynamicField,
                          },
                        })
                      }
                    />
                    <DynamicBindingRow
                      label="Title"
                      value={draft.dynamicBindings?.titleField || DEFAULT_DYNAMIC_BINDINGS.titleField}
                      options={TEXT_BIND_OPTIONS}
                      onChange={(value) =>
                        setDraft({
                          ...draft,
                          dynamicBindings: {
                            ...DEFAULT_DYNAMIC_BINDINGS,
                            ...(draft.dynamicBindings || {}),
                            titleField: value as BlogDynamicField,
                          },
                        })
                      }
                    />
                    <DynamicBindingRow
                      label="Date"
                      value={draft.dynamicBindings?.dateField || DEFAULT_DYNAMIC_BINDINGS.dateField}
                      options={DATE_BIND_OPTIONS}
                      onChange={(value) =>
                        setDraft({
                          ...draft,
                          dynamicBindings: {
                            ...DEFAULT_DYNAMIC_BINDINGS,
                            ...(draft.dynamicBindings || {}),
                            dateField: value as 'publishedAt' | 'createdAt' | 'updatedAt',
                          },
                        })
                      }
                    />
                  </CollapsibleBlock>
                </TabsContent>
                <TabsContent value="layout" className="space-y-3">
                  <CollapsibleBlock title="Container" defaultOpen>
                    <div className="space-y-2">
                      <Label>Container Width</Label>
                      <Select
                        value={draft.style.containerWidth}
                        onValueChange={(value: 'narrow' | 'wide') => updateStyle({ containerWidth: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="narrow">Narrow</SelectItem>
                          <SelectItem value="wide">Wide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={draft.heroImageFullWidth}
                        onCheckedChange={(checked) => setDraft({ ...draft, heroImageFullWidth: !!checked })}
                      />
                      <Label className="text-sm font-normal">Hero image full width</Label>
                    </div>
                  </CollapsibleBlock>
                </TabsContent>
                <TabsContent value="style" className="space-y-3">
                  <CollapsibleBlock title="Colors" defaultOpen>
                    <ColorRow
                      label="Header background"
                      color={draft.style.headerBackgroundColor}
                      opacity={draft.style.headerBackgroundOpacity}
                      onColorChange={(value) => updateStyle({ headerBackgroundColor: value })}
                      onOpacityChange={(value) => updateStyle({ headerBackgroundOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <ColorRow
                      label="Header image overlay"
                      color={draft.style.headerOverlayColor}
                      opacity={draft.style.headerOverlayOpacity}
                      onColorChange={(value) => updateStyle({ headerOverlayColor: value })}
                      onOpacityChange={(value) => updateStyle({ headerOverlayOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <div className="space-y-2">
                      <Label>Hero image border radius ({draft.style.heroImageBorderRadius}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={48}
                        value={draft.style.heroImageBorderRadius}
                        onChange={(event) => updateStyle({ heroImageBorderRadius: Number(event.target.value) || 0 })}
                      />
                    </div>
                  </CollapsibleBlock>
                  <CollapsibleBlock title="Typography" defaultOpen>
                    <TypographyControl
                      label="Title"
                      value={draft.style.typography.title}
                      onChange={(value) =>
                        updateStyle({
                          typography: { ...draft.style.typography, title: { ...draft.style.typography.title, ...value } },
                        })
                      }
                      globalStyles={currentWebsite?.globalStyles}
                      showGlobalStyleSelector
                      responsiveFontSize={draft.style.typography.title.fontSizeResponsive}
                      onResponsiveFontSizeChange={(next) => updateTypographyResponsiveSize('title', next)}
                      colorOpacity={draft.style.typography.title.colorOpacity}
                      onColorOpacityChange={(value) =>
                        updateStyle({
                          typography: {
                            ...draft.style.typography,
                            title: { ...draft.style.typography.title, colorOpacity: value },
                          },
                        })
                      }
                    />
                    <TypographyControl
                      label="Date + Meta"
                      value={draft.style.typography.date}
                      onChange={(value) =>
                        updateStyle({
                          typography: { ...draft.style.typography, date: { ...draft.style.typography.date, ...value } },
                        })
                      }
                      globalStyles={currentWebsite?.globalStyles}
                      showGlobalStyleSelector
                      responsiveFontSize={draft.style.typography.date.fontSizeResponsive}
                      onResponsiveFontSizeChange={(next) => updateTypographyResponsiveSize('date', next)}
                      colorOpacity={draft.style.typography.date.colorOpacity}
                      onColorOpacityChange={(value) =>
                        updateStyle({
                          typography: {
                            ...draft.style.typography,
                            date: { ...draft.style.typography.date, colorOpacity: value },
                          },
                        })
                      }
                    />
                  </CollapsibleBlock>
                </TabsContent>
              </Tabs>
            </SectionTabsCard>
          )}

          {activeSection === 'body' && (
            <SectionTabsCard>
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-3">
                  <CollapsibleBlock title="Article Content" defaultOpen>
                    <p className="text-xs text-muted-foreground">Dynamically links to:</p>
                    <DynamicBindingRow
                      label="Article content"
                      value={draft.dynamicBindings?.contentField || DEFAULT_DYNAMIC_BINDINGS.contentField}
                      options={CONTENT_BIND_OPTIONS}
                      onChange={(value) =>
                        setDraft({
                          ...draft,
                          dynamicBindings: {
                            ...DEFAULT_DYNAMIC_BINDINGS,
                            ...(draft.dynamicBindings || {}),
                            contentField: value as BlogDynamicField,
                          },
                        })
                      }
                    />
                  </CollapsibleBlock>
                  <CollapsibleBlock title="Meta">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={draft.showTags}
                        onCheckedChange={(checked) => setDraft({ ...draft, showTags: !!checked })}
                      />
                      <Label className="text-sm font-normal">Show tags</Label>
                    </div>
                  </CollapsibleBlock>
                  <CollapsibleBlock title="Contact Form" defaultOpen>
                    <div className="space-y-2">
                      <Label>Form heading</Label>
                      <Input
                        value={draft.sidebarForm.heading}
                        onChange={(event) =>
                          setDraft({ ...draft, sidebarForm: { ...draft.sidebarForm, heading: event.target.value } })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Form description</Label>
                      <Textarea
                        value={draft.sidebarForm.description || ''}
                        onChange={(event) =>
                          setDraft({ ...draft, sidebarForm: { ...draft.sidebarForm, description: event.target.value } })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Button text</Label>
                      <Input
                        value={draft.sidebarForm.buttonText}
                        onChange={(event) =>
                          setDraft({ ...draft, sidebarForm: { ...draft.sidebarForm, buttonText: event.target.value } })
                        }
                      />
                    </div>
                  </CollapsibleBlock>
                  <CollapsibleBlock title="Form Fields">
                    {draft.sidebarForm.fields.map((field, index) => (
                      <div key={field.id} className="mb-2 space-y-2 rounded border p-2">
                        <div className="grid grid-cols-[1fr_auto] gap-2">
                          <Input
                            value={field.label}
                            onChange={(event) => {
                              const fields = [...draft.sidebarForm.fields];
                              fields[index] = { ...fields[index], label: event.target.value };
                              setDraft({ ...draft, sidebarForm: { ...draft.sidebarForm, fields } });
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const fields = draft.sidebarForm.fields.filter((item) => item.id !== field.id);
                              setDraft({ ...draft, sidebarForm: { ...draft.sidebarForm, fields } });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={field.type}
                            onValueChange={(value: 'text' | 'email' | 'phone' | 'textarea') => {
                              const fields = [...draft.sidebarForm.fields];
                              fields[index] = { ...fields[index], type: value };
                              setDraft({ ...draft, sidebarForm: { ...draft.sidebarForm, fields } });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={field.placeholder || ''}
                            onChange={(event) => {
                              const fields = [...draft.sidebarForm.fields];
                              fields[index] = { ...fields[index], placeholder: event.target.value };
                              setDraft({ ...draft, sidebarForm: { ...draft.sidebarForm, fields } });
                            }}
                            placeholder="Placeholder"
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          sidebarForm: {
                            ...draft.sidebarForm,
                            fields: [
                              ...draft.sidebarForm.fields,
                              {
                                id: `field_${Date.now()}`,
                                type: 'text',
                                label: 'New Field',
                                placeholder: '',
                                required: false,
                              },
                            ],
                          },
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Field
                    </Button>
                  </CollapsibleBlock>
                </TabsContent>
                <TabsContent value="layout" className="space-y-3">
                  <CollapsibleBlock title="Section Layout" defaultOpen>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={draft.showSidebarContact}
                        onCheckedChange={(checked) => setDraft({ ...draft, showSidebarContact: !!checked })}
                      />
                      <Label className="text-sm font-normal">Show sticky contact form column</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Sticky top offset</Label>
                      <Input
                        type="number"
                        min={0}
                        value={draft.sidebarStickyOffset}
                        onChange={(event) => setDraft({ ...draft, sidebarStickyOffset: Number(event.target.value) || 0 })}
                      />
                    </div>
                  </CollapsibleBlock>
                </TabsContent>
                <TabsContent value="style" className="space-y-3">
                  <CollapsibleBlock title="Body Colors" defaultOpen>
                    <ColorRow
                      label="Body background"
                      color={draft.style.bodyBackgroundColor}
                      opacity={draft.style.bodyBackgroundOpacity}
                      onColorChange={(value) => updateStyle({ bodyBackgroundColor: value })}
                      onOpacityChange={(value) => updateStyle({ bodyBackgroundOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <ColorRow
                      label="Sidebar background"
                      color={draft.style.sidebarBackgroundColor}
                      opacity={draft.style.sidebarBackgroundOpacity}
                      onColorChange={(value) => updateStyle({ sidebarBackgroundColor: value })}
                      onOpacityChange={(value) => updateStyle({ sidebarBackgroundOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <ColorRow
                      label="Sidebar border"
                      color={draft.style.sidebarBorderColor}
                      opacity={draft.style.sidebarBorderOpacity}
                      onColorChange={(value) => updateStyle({ sidebarBorderColor: value })}
                      onOpacityChange={(value) => updateStyle({ sidebarBorderOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <ColorRow
                      label="Main border"
                      color={draft.style.borderColor}
                      opacity={draft.style.borderColorOpacity}
                      onColorChange={(value) => updateStyle({ borderColor: value })}
                      onOpacityChange={(value) => updateStyle({ borderColorOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <div className="space-y-2">
                      <Label>Form container border radius ({draft.style.sidebarBorderRadius}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={36}
                        value={draft.style.sidebarBorderRadius}
                        onChange={(event) => updateStyle({ sidebarBorderRadius: Number(event.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Form container border width ({draft.style.sidebarBorderWidth}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={8}
                        value={draft.style.sidebarBorderWidth}
                        onChange={(event) => updateStyle({ sidebarBorderWidth: Number(event.target.value) || 0 })}
                      />
                    </div>
                    <ColorRow
                      label="Form field background"
                      color={draft.style.formFieldBackgroundColor}
                      opacity={draft.style.formFieldBackgroundOpacity}
                      onColorChange={(value) => updateStyle({ formFieldBackgroundColor: value })}
                      onOpacityChange={(value) => updateStyle({ formFieldBackgroundOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <ColorRow
                      label="Form field border"
                      color={draft.style.formFieldBorderColor}
                      opacity={draft.style.formFieldBorderOpacity}
                      onColorChange={(value) => updateStyle({ formFieldBorderColor: value })}
                      onOpacityChange={(value) => updateStyle({ formFieldBorderOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <div className="space-y-2">
                      <Label>Form field border width ({draft.style.formFieldBorderWidth}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={8}
                        value={draft.style.formFieldBorderWidth}
                        onChange={(event) => updateStyle({ formFieldBorderWidth: Number(event.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Form field border radius ({draft.style.formFieldBorderRadius}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={24}
                        value={draft.style.formFieldBorderRadius}
                        onChange={(event) => updateStyle({ formFieldBorderRadius: Number(event.target.value) || 0 })}
                      />
                    </div>
                    <ColorRow
                      label="Button background"
                      color={draft.style.formButtonBackgroundColor}
                      opacity={draft.style.formButtonBackgroundOpacity}
                      onColorChange={(value) => updateStyle({ formButtonBackgroundColor: value })}
                      onOpacityChange={(value) => updateStyle({ formButtonBackgroundOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <ColorRow
                      label="Button hover background"
                      color={draft.style.formButtonHoverBackgroundColor}
                      opacity={draft.style.formButtonHoverBackgroundOpacity}
                      onColorChange={(value) => updateStyle({ formButtonHoverBackgroundColor: value })}
                      onOpacityChange={(value) => updateStyle({ formButtonHoverBackgroundOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <ColorRow
                      label="Button hover text"
                      color={draft.style.formButtonHoverTextColor}
                      opacity={draft.style.formButtonHoverTextOpacity}
                      onColorChange={(value) => updateStyle({ formButtonHoverTextColor: value })}
                      onOpacityChange={(value) => updateStyle({ formButtonHoverTextOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <div className="space-y-2">
                      <Label>Button border radius ({draft.style.formButtonBorderRadius}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={24}
                        value={draft.style.formButtonBorderRadius}
                        onChange={(event) => updateStyle({ formButtonBorderRadius: Number(event.target.value) || 0 })}
                      />
                    </div>
                  </CollapsibleBlock>
                  <CollapsibleBlock title="Typography" defaultOpen>
                    <TypographyControl
                      label="Body"
                      value={draft.style.typography.body}
                      onChange={(value) =>
                        updateStyle({
                          typography: { ...draft.style.typography, body: { ...draft.style.typography.body, ...value } },
                        })
                      }
                      globalStyles={currentWebsite?.globalStyles}
                      showGlobalStyleSelector
                      responsiveFontSize={draft.style.typography.body.fontSizeResponsive}
                      onResponsiveFontSizeChange={(next) => updateTypographyResponsiveSize('body', next)}
                      colorOpacity={draft.style.typography.body.colorOpacity}
                      onColorOpacityChange={(value) =>
                        updateStyle({
                          typography: {
                            ...draft.style.typography,
                            body: { ...draft.style.typography.body, colorOpacity: value },
                          },
                        })
                      }
                    />
                    <TypographyControl
                      label="Form heading"
                      value={draft.style.typography.formHeading}
                      onChange={(value) =>
                        updateStyle({
                          typography: {
                            ...draft.style.typography,
                            formHeading: { ...draft.style.typography.formHeading, ...value },
                          },
                        })
                      }
                      globalStyles={currentWebsite?.globalStyles}
                      showGlobalStyleSelector
                      responsiveFontSize={draft.style.typography.formHeading.fontSizeResponsive}
                      onResponsiveFontSizeChange={(next) => updateTypographyResponsiveSize('formHeading', next)}
                      colorOpacity={draft.style.typography.formHeading.colorOpacity}
                      onColorOpacityChange={(value) =>
                        updateStyle({
                          typography: {
                            ...draft.style.typography,
                            formHeading: { ...draft.style.typography.formHeading, colorOpacity: value },
                          },
                        })
                      }
                    />
                  </CollapsibleBlock>
                </TabsContent>
              </Tabs>
            </SectionTabsCard>
          )}

          {activeSection === 'related' && (
            <SectionTabsCard>
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-3">
                  <CollapsibleBlock title="Related Posts Content" defaultOpen>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={draft.showBottomBlogCards}
                        onCheckedChange={(checked) => setDraft({ ...draft, showBottomBlogCards: !!checked })}
                      />
                      <Label className="text-sm font-normal">Show related posts section</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Section heading</Label>
                      <Input
                        value={draft.relatedPostsHeading}
                        onChange={(event) => setDraft({ ...draft, relatedPostsHeading: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Layout</Label>
                      <Select
                        value={draft.relatedPostsLayout}
                        onValueChange={(value: 'grid') => setDraft({ ...draft, relatedPostsLayout: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Modern Grid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Filter posts by</Label>
                      <Select
                        value={draft.relatedPostsFilter}
                        onValueChange={(value: 'latest' | 'same_category' | 'same_tag') =>
                          setDraft({ ...draft, relatedPostsFilter: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">Latest posts</SelectItem>
                          <SelectItem value="same_category">Same category</SelectItem>
                          <SelectItem value="same_tag">Same tag</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {draft.relatedPostsFilter === 'same_tag' && (
                      <div className="space-y-2">
                        <Label>Filter tag (optional)</Label>
                        <Input
                          value={draft.relatedPostsFilterTag || ''}
                          onChange={(event) => setDraft({ ...draft, relatedPostsFilterTag: event.target.value })}
                          list="blog-template-tag-options"
                          placeholder="e.g. market update"
                        />
                        <datalist id="blog-template-tag-options">
                          {tagSuggestions.map((tag) => (
                            <option key={tag} value={tag} />
                          ))}
                        </datalist>
                        {tagSuggestions.length === 0 && (
                          <p className="text-xs text-muted-foreground">No tags found yet.</p>
                        )}
                      </div>
                    )}
                    {draft.relatedPostsFilter === 'same_category' && (
                      <div className="space-y-2">
                        <Label>Filter category (optional)</Label>
                        <Input
                          value={draft.relatedPostsFilterCategory || ''}
                          onChange={(event) => setDraft({ ...draft, relatedPostsFilterCategory: event.target.value })}
                          list="blog-template-category-options"
                          placeholder="Start typing a category..."
                        />
                        <datalist id="blog-template-category-options">
                          {categorySuggestions.map((category) => (
                            <option key={category} value={category} />
                          ))}
                        </datalist>
                        {categorySuggestions.length === 0 && (
                          <p className="text-xs text-muted-foreground">No categories found yet.</p>
                        )}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Cards count</Label>
                      <Input
                        type="number"
                        min={1}
                        max={6}
                        value={draft.bottomBlogCardsCount}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            bottomBlogCardsCount: Math.min(6, Math.max(1, Number(event.target.value) || 1)),
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={draft.showRelatedPostDate}
                        onCheckedChange={(checked) => setDraft({ ...draft, showRelatedPostDate: !!checked })}
                      />
                      <Label className="text-sm font-normal">Show date</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={draft.showRelatedPostExcerpt}
                        onCheckedChange={(checked) => setDraft({ ...draft, showRelatedPostExcerpt: !!checked })}
                      />
                      <Label className="text-sm font-normal">Show excerpt</Label>
                    </div>
                  </CollapsibleBlock>
                </TabsContent>
                <TabsContent value="layout" className="space-y-3">
                  <CollapsibleBlock title="Layout" defaultOpen>
                    <p className="text-sm text-muted-foreground">
                      Related posts use blog card grid layout and inherit site spacing.
                    </p>
                  </CollapsibleBlock>
                </TabsContent>
                <TabsContent value="style" className="space-y-3">
                  <CollapsibleBlock title="Related Heading" defaultOpen>
                    <TypographyControl
                      label="Section heading"
                      value={draft.style.typography.relatedHeading}
                      onChange={(value) =>
                        updateStyle({
                          typography: {
                            ...draft.style.typography,
                            relatedHeading: { ...draft.style.typography.relatedHeading, ...value },
                          },
                        })
                      }
                      globalStyles={currentWebsite?.globalStyles}
                      showGlobalStyleSelector
                      responsiveFontSize={draft.style.typography.relatedHeading.fontSizeResponsive}
                      onResponsiveFontSizeChange={(next) => updateTypographyResponsiveSize('relatedHeading', next)}
                      colorOpacity={draft.style.typography.relatedHeading.colorOpacity}
                      onColorOpacityChange={(value) =>
                        updateStyle({
                          typography: {
                            ...draft.style.typography,
                            relatedHeading: { ...draft.style.typography.relatedHeading, colorOpacity: value },
                          },
                        })
                      }
                    />
                  </CollapsibleBlock>
                  <CollapsibleBlock title="Tag Style">
                    <TypographyControl
                      label="Tags"
                      value={draft.style.typography.tags}
                      onChange={(value) =>
                        updateStyle({
                          typography: { ...draft.style.typography, tags: { ...draft.style.typography.tags, ...value } },
                        })
                      }
                      globalStyles={currentWebsite?.globalStyles}
                      showGlobalStyleSelector
                      responsiveFontSize={draft.style.typography.tags.fontSizeResponsive}
                      onResponsiveFontSizeChange={(next) => updateTypographyResponsiveSize('tags', next)}
                      colorOpacity={draft.style.typography.tags.colorOpacity}
                      onColorOpacityChange={(value) =>
                        updateStyle({
                          typography: {
                            ...draft.style.typography,
                            tags: { ...draft.style.typography.tags, colorOpacity: value },
                          },
                        })
                      }
                    />
                    <ColorRow
                      label="Tag background"
                      color={draft.style.tagBackgroundColor}
                      opacity={draft.style.tagBackgroundOpacity}
                      onColorChange={(value) => updateStyle({ tagBackgroundColor: value })}
                      onOpacityChange={(value) => updateStyle({ tagBackgroundOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <ColorRow
                      label="Tag border"
                      color={draft.style.tagBorderColor}
                      opacity={draft.style.tagBorderOpacity}
                      onColorChange={(value) => updateStyle({ tagBorderColor: value })}
                      onOpacityChange={(value) => updateStyle({ tagBorderOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <div className="space-y-2">
                      <Label>Tag border width ({draft.style.tagBorderWidth}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={6}
                        value={draft.style.tagBorderWidth}
                        onChange={(event) => updateStyle({ tagBorderWidth: Number(event.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tag border radius ({draft.style.tagBorderRadius}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={999}
                        value={draft.style.tagBorderRadius}
                        onChange={(event) => updateStyle({ tagBorderRadius: Number(event.target.value) || 0 })}
                      />
                    </div>
                  </CollapsibleBlock>
                  <CollapsibleBlock title="Card Style">
                    <ColorRow
                      label="Card background"
                      color={draft.style.relatedCardBackgroundColor}
                      opacity={draft.style.relatedCardBackgroundOpacity}
                      onColorChange={(value) => updateStyle({ relatedCardBackgroundColor: value })}
                      onOpacityChange={(value) => updateStyle({ relatedCardBackgroundOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <ColorRow
                      label="Card border"
                      color={draft.style.relatedCardBorderColor}
                      opacity={draft.style.relatedCardBorderOpacity}
                      onColorChange={(value) => updateStyle({ relatedCardBorderColor: value })}
                      onOpacityChange={(value) => updateStyle({ relatedCardBorderOpacity: value })}
                      globalStyles={currentWebsite?.globalStyles}
                    />
                    <div className="space-y-2">
                      <Label>Card border width ({draft.style.relatedCardBorderWidth}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={8}
                        value={draft.style.relatedCardBorderWidth}
                        onChange={(event) => updateStyle({ relatedCardBorderWidth: Number(event.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Card border radius ({draft.style.relatedCardBorderRadius}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={32}
                        value={draft.style.relatedCardBorderRadius}
                        onChange={(event) => updateStyle({ relatedCardBorderRadius: Number(event.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Thumbnail border radius ({draft.style.relatedImageBorderRadius}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={24}
                        value={draft.style.relatedImageBorderRadius}
                        onChange={(event) => updateStyle({ relatedImageBorderRadius: Number(event.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Card content padding ({draft.relatedCardContentPadding}px)</Label>
                      <Input
                        type="range"
                        min={0}
                        max={40}
                        value={draft.relatedCardContentPadding}
                        onChange={(event) =>
                          setDraft({ ...draft, relatedCardContentPadding: Number(event.target.value) || 0 })
                        }
                      />
                    </div>
                  </CollapsibleBlock>
                </TabsContent>
              </Tabs>
            </SectionTabsCard>
          )}
        </aside>

        <main className="min-h-0 overflow-auto p-4">
          <TemplatePreview template={draft} breakpoint={deviceView} website={currentWebsite || undefined} />
        </main>
      </div>
    </div>
  );
}

function SectionTabsCard({ children }: { children: React.ReactNode }) {
  return <Card className="space-y-3 p-4">{children}</Card>;
}

function DynamicBindingRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2 rounded-md border p-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <button
          type="button"
          className="inline-flex items-center rounded px-1.5 py-1 text-primary hover:bg-primary/10"
          title="Dynamically linked"
        >
          <Link2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CollapsibleBlock({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium"
      >
        <span>{title}</span>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {open && <div className="space-y-3 border-t p-3">{children}</div>}
    </div>
  );
}

function ColorRow({
  label,
  color,
  opacity,
  onColorChange,
  onOpacityChange,
  globalStyles,
}: {
  label: string;
  color: string;
  opacity: number;
  onColorChange: (value: string) => void;
  onOpacityChange: (value: number) => void;
  globalStyles?: GlobalStyles;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <GlobalColorInput value={color} onChange={onColorChange} globalStyles={globalStyles} />
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Opacity: {opacity}%</Label>
        <Input type="range" min={0} max={100} value={opacity} onChange={(event) => onOpacityChange(Number(event.target.value) || 0)} />
      </div>
    </div>
  );
}

function TemplatePreview({
  template,
  breakpoint,
  website,
}: {
  template: BlogPostTemplateConfig;
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  website?: any;
}) {
  const containerClass =
    template.layoutVariant === 'newsletter'
      ? 'max-w-6xl'
      : template.style.containerWidth === 'wide'
        ? 'max-w-6xl'
        : 'max-w-3xl';
  const previewFrameClass =
    breakpoint === 'mobile'
      ? 'mx-auto max-w-[390px]'
      : breakpoint === 'tablet'
        ? 'mx-auto max-w-[820px]'
        : 'w-full';
  const previewCardsCount = Math.max(3, template.bottomBlogCardsCount);
  const isMobilePreview = breakpoint === 'mobile';
  const relatedPostsGridClass = isMobilePreview ? 'grid gap-4 grid-cols-1' : 'grid gap-4 grid-cols-3';
  const bodyWithContactClass =
    template.layoutVariant === 'newsletter' && template.showSidebarContact
      ? isMobilePreview
        ? 'flex flex-col gap-8'
        : 'grid gap-8 grid-cols-[minmax(0,1fr)_320px]'
      : '';
  return (
    <div className={previewFrameClass}>
      {website && (
        <SiteHeader
          websiteName={website.name}
          header={website.header}
          globalStyles={website.globalStyles}
          deviceView={breakpoint}
        />
      )}
      <Card className="overflow-hidden">
      <div
        className=""
        style={{
          backgroundColor: colorWithOpacity(template.style.headerBackgroundColor, template.style.headerBackgroundOpacity),
          borderColor: colorWithOpacity(template.style.borderColor, template.style.borderColorOpacity),
        }}
      >
        <div className={`mx-auto ${template.heroImageFullWidth ? 'max-w-none' : containerClass} px-6 py-8`}>
          {template.layoutVariant === 'newsletter' ? (
            <div className="relative overflow-hidden" style={{ borderRadius: `${template.style.heroImageBorderRadius}px` }}>
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop"
                alt="Preview"
                className="h-[300px] w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundColor: colorWithOpacity(template.style.headerOverlayColor, template.style.headerOverlayOpacity) }}
              />
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <p style={typographyStyle(template.style.typography.date, breakpoint)}>Market Update</p>
                  <h2 style={typographyStyle(template.style.typography.title, breakpoint)}>Santa Monica Monthly - February 2026</h2>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 style={typographyStyle(template.style.typography.title, breakpoint)}>Kyle Scott at Better Retreat 2025</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                <span style={typographyStyle(template.style.typography.date, breakpoint)}>October 21, 2025</span>
                {template.showTags && (
                  <span
                    className="border px-2 py-0.5"
                    style={{
                      ...typographyStyle(template.style.typography.tags, breakpoint),
                      borderRadius: `${template.style.tagBorderRadius}px`,
                      borderWidth: `${template.style.tagBorderWidth}px`,
                      borderStyle: 'solid',
                      borderColor: colorWithOpacity(template.style.tagBorderColor, template.style.tagBorderOpacity),
                      backgroundColor: colorWithOpacity(template.style.tagBackgroundColor, template.style.tagBackgroundOpacity),
                    }}
                  >
                  Branding
                  </span>
                )}
                {template.showTags && (
                  <span
                    className="border px-2 py-0.5"
                    style={{
                      ...typographyStyle(template.style.typography.tags, breakpoint),
                      borderRadius: `${template.style.tagBorderRadius}px`,
                      borderWidth: `${template.style.tagBorderWidth}px`,
                      borderStyle: 'solid',
                      borderColor: colorWithOpacity(template.style.tagBorderColor, template.style.tagBorderOpacity),
                      backgroundColor: colorWithOpacity(template.style.tagBackgroundColor, template.style.tagBackgroundOpacity),
                    }}
                  >
                  Conference
                  </span>
                )}
              </div>
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop"
                alt="Preview"
                className="mt-6 w-full object-cover"
                style={{ borderRadius: `${template.style.heroImageBorderRadius}px` }}
              />
            </>
          )}
        </div>
      </div>

      <div
        className={`mx-auto ${containerClass} px-6 py-8`}
        style={{ backgroundColor: colorWithOpacity(template.style.bodyBackgroundColor, template.style.bodyBackgroundOpacity) }}
      >
        <div className={bodyWithContactClass}>
          <div className="prose max-w-none" style={typographyStyle(template.style.typography.body, breakpoint)} dangerouslySetInnerHTML={{ __html: SAMPLE_HTML }} />
          {template.layoutVariant === 'newsletter' && template.showSidebarContact && (
            <aside
              className={isMobilePreview ? 'h-fit border p-4' : 'h-fit border p-4 sticky'}
              style={{
                borderRadius: `${template.style.sidebarBorderRadius}px`,
                borderWidth: `${template.style.sidebarBorderWidth}px`,
                borderStyle: 'solid',
                borderColor: colorWithOpacity(template.style.sidebarBorderColor, template.style.sidebarBorderOpacity),
                backgroundColor: colorWithOpacity(template.style.sidebarBackgroundColor, template.style.sidebarBackgroundOpacity),
                top: isMobilePreview ? undefined : `${template.sidebarStickyOffset}px`,
              }}
            >
              <h3 style={typographyStyle(template.style.typography.formHeading, breakpoint)}>{template.sidebarForm.heading}</h3>
              {template.sidebarForm.description && <p className="mt-2 text-sm text-muted-foreground">{template.sidebarForm.description}</p>}
              <div className="mt-4 space-y-2">
                {template.sidebarForm.fields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <p style={typographyStyle(template.style.typography.formLabel, breakpoint)}>{field.label}</p>
                    <div
                      className="h-9"
                      style={{
                        borderRadius: `${template.style.formFieldBorderRadius}px`,
                        borderWidth: `${template.style.formFieldBorderWidth}px`,
                        borderStyle: 'solid',
                        borderColor: colorWithOpacity(template.style.formFieldBorderColor, template.style.formFieldBorderOpacity),
                        backgroundColor: colorWithOpacity(template.style.formFieldBackgroundColor, template.style.formFieldBackgroundOpacity),
                      }}
                    />
                  </div>
                ))}
                <div
                  className="mt-2 px-3 py-2 text-center"
                  style={{
                    ...typographyStyle(template.style.typography.formButton, breakpoint),
                    borderRadius: `${template.style.formButtonBorderRadius}px`,
                    backgroundColor: colorWithOpacity(template.style.formButtonBackgroundColor, template.style.formButtonBackgroundOpacity),
                  }}
                >
                  {template.sidebarForm.buttonText}
                </div>
              </div>
            </aside>
          )}
        </div>

        {template.showBottomBlogCards && (
          <div className="mt-10">
            <h3 style={typographyStyle(template.style.typography.relatedHeading, breakpoint)} className="mb-4">
              {template.relatedPostsHeading}
            </h3>
            <div className={relatedPostsGridClass}>
              {Array.from({ length: previewCardsCount }).map((_, index) => (
                <div
                  key={index}
                  className="border"
                  style={{
                    borderRadius: `${template.style.relatedCardBorderRadius}px`,
                    borderWidth: `${template.style.relatedCardBorderWidth}px`,
                    borderStyle: 'solid',
                    borderColor: colorWithOpacity(template.style.relatedCardBorderColor, template.style.relatedCardBorderOpacity),
                    backgroundColor: colorWithOpacity(template.style.relatedCardBackgroundColor, template.style.relatedCardBackgroundOpacity),
                  }}
                >
                  <img
                    src={PREVIEW_RELATED_IMAGES[index % PREVIEW_RELATED_IMAGES.length]}
                    alt={`Related ${index + 1}`}
                    className="h-[150px] w-full object-cover"
                    style={{ borderRadius: `${template.style.relatedImageBorderRadius}px` }}
                  />
                  <div style={{ padding: `${template.relatedCardContentPadding}px` }}>
                    {template.showRelatedPostDate && (
                      <p className="text-xs text-muted-foreground">Feb {index + 8}, 2026</p>
                    )}
                    <p className="mt-1 font-semibold">Example post title {index + 1}</p>
                    {template.showRelatedPostExcerpt && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Example excerpt text to preview related article snippet layout.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
    {website && (
      <SiteFooter
        websiteName={website.name}
        footer={website.footer}
        headerNavigation={website.header.navigation}
        globalStyles={website.globalStyles}
        deviceView={breakpoint}
      />
    )}
  </div>
  );
}

function typographyStyle(config: {
  fontFamily: string;
  fontSize: number;
  fontSizeResponsive?: { desktop?: number; tablet?: number; mobile?: number };
  fontWeight: string;
  lineHeight?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: string;
  color: string;
  colorOpacity: number;
}, breakpoint: 'desktop' | 'tablet' | 'mobile') {
  const fontSize = config.fontSizeResponsive?.[breakpoint] ?? config.fontSize;
  return {
    fontFamily: config.fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight: config.fontWeight as any,
    lineHeight: config.lineHeight,
    textTransform: config.textTransform,
    letterSpacing: config.letterSpacing,
    color: colorWithOpacity(config.color, config.colorOpacity),
  };
}

function colorWithOpacity(color: string | undefined, opacityPercent: number): string {
  if (!color) return 'transparent';
  if (color === 'transparent') return 'transparent';
  if (/^#([0-9a-f]{6})$/i.test(color)) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacityPercent / 100})`;
  }
  if (opacityPercent >= 100) return color;
  return `color-mix(in srgb, ${color} ${opacityPercent}%, transparent)`;
}
