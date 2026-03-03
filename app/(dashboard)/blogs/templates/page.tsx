'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { useBlogTemplatesStore } from '@/lib/stores/blogTemplates';
import { useAuthStore } from '@/lib/stores/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const darkInput = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const darkSelectTrigger = 'flex h-[34px] w-full items-center rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black';
const darkSelectContent = 'rounded-lg border border-[#EBEBEB] bg-white text-[13px] text-black';

export default function BlogTemplatesPage() {
  const { user, canManageTenants } = useAuthStore();
  const { createTemplate, activeTemplateId, setActiveTemplate, getTemplatesForCurrentUser, publishTemplateGlobally } = useBlogTemplatesStore();
  const [newTemplateName, setNewTemplateName] = useState('');
  const [baseTemplateId, setBaseTemplateId] = useState<'classic' | 'feature'>('classic');
  const templates = getTemplatesForCurrentUser(user?.id);
  const visibleTemplates = templates.filter(
    (t) => t.id !== 'sidebar' && !t.id.startsWith('template_legacy_sidebar_') && t.name.toLowerCase() !== 'sidebar layout'
  );

  useEffect(() => {
    if (!visibleTemplates.length) return;
    if (visibleTemplates.some((t) => t.id === activeTemplateId)) return;
    setActiveTemplate(visibleTemplates[0].id);
  }, [activeTemplateId, setActiveTemplate, visibleTemplates]);

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Blog Templates" description="Manage your article layout templates and open the full-screen template editor." />
      </div>

      <div className="space-y-4 p-6">
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
          <p className="text-[15px] font-normal text-black">Create New Template</p>
          <div className="space-y-1.5">
            <label className="text-[13px] text-[#888C99]">Base template</label>
            <Select value={baseTemplateId} onValueChange={(v: 'classic' | 'feature') => setBaseTemplateId(v)}>
              <SelectTrigger className={darkSelectTrigger}><SelectValue /></SelectTrigger>
              <SelectContent className={darkSelectContent}>
                <SelectItem value="classic">Classic Article</SelectItem>
                <SelectItem value="feature">Feature Header</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <input value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} placeholder="Template name" className={darkInput} />
            <button type="button" onClick={() => { const t = createTemplate(newTemplateName, baseTemplateId); setNewTemplateName(''); window.location.href = `/blogs/templates/editor/${t.id}`; }} className="flex h-[34px] items-center gap-1.5 rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00]">
              <Plus className="h-3.5 w-3.5" /> Create
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleTemplates.map((t) => (
            <div key={t.id} className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13px] font-medium text-black">{t.name}</p>
                  <p className="text-[13px] text-[#888C99]">{t.description}</p>
                </div>
                {t.id === activeTemplateId && <span className="rounded-full bg-[#DAFF07] px-2 py-0.5 text-[11px] text-black">Active</span>}
              </div>
              <div className="text-[11px] text-[#888C99]">
                <p>Layout: {t.layoutVariant === 'newsletter' ? 'Classic article' : 'Feature header'}</p>
                <p>Sticky contact: {t.showSidebarContact ? 'Enabled' : 'Disabled'}</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button type="button" onClick={() => setActiveTemplate(t.id)} className={`flex h-[30px] items-center justify-center gap-1.5 rounded-lg px-3 text-[13px] ${t.id === activeTemplateId ? 'bg-[#DAFF07] text-black' : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> {t.id === activeTemplateId ? 'Active' : 'Set Active'}
                </button>
                <Link href={`/blogs/templates/editor/${t.id}`} className="flex h-[30px] items-center justify-center rounded-lg bg-black text-[13px] text-white hover:bg-black/80">
                  Open Editor
                </Link>
                {canManageTenants() && t.scope !== 'global' && (
                  <button type="button" onClick={() => publishTemplateGlobally(t.id)} className="col-span-2 h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
                    Publish Globally
                  </button>
                )}
              </div>
            </div>
          ))}
          {visibleTemplates.length === 0 && (
            <div className="rounded-xl border border-[#EBEBEB] bg-white p-6">
              <p className="text-[13px] text-[#888C99]">No templates found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
