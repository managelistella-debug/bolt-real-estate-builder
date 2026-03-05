'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/stores/auth';
import { useTemplateCatalogStore, getTemplateFromAsset } from '@/lib/stores/templateCatalog';
import { useWebsiteStore } from '@/lib/stores/website';
import { createTemplateFromWebsiteSnapshot } from '@/lib/themeSnapshots';

const darkInput = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const darkSelectTrigger = 'flex h-[34px] w-full items-center rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black';
const darkSelectContent = 'rounded-lg border border-[#EBEBEB] bg-white text-[13px] text-black';

export default function AdminTemplatesPage() {
  const { user, getAllUsers } = useAuthStore();
  const { currentWebsite, websites } = useWebsiteStore();
  const { assets, createAsset, createAiSiteTemplate, publishAssetGlobal, assignAssetToUser } = useTemplateCatalogStore();

  const [templateName, setTemplateName] = useState('Support Snapshot Theme');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [privateOnly, setPrivateOnly] = useState(true);
  const [aiTemplateName, setAiTemplateName] = useState('');
  const [aiExportSiteId, setAiExportSiteId] = useState('');

  const userOptions = useMemo(() => getAllUsers().filter((entry) => entry.role === 'business_user'), [getAllUsers]);
  const aiSites = useMemo(() => websites.filter((w) => w.templateId === 'ai-builder' && w.aiPreviewHtml), [websites]);

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Admin Templates" description="Publish global themes, assign private templates, and export AI-built sites as starting points." />
      </div>
      <div className="space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Snapshot from current website */}
          <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
            <h3 className="text-[15px] font-normal text-black">Create template from current website</h3>
            <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template name" className={darkInput} />
            <button type="button" disabled={!currentWebsite || !user} onClick={() => { if (!currentWebsite || !user) return; const snapshot = createTemplateFromWebsiteSnapshot(currentWebsite, templateName); createAsset({ name: snapshot.name, description: snapshot.description, kind: 'full_site', payload: snapshot, createdByUserId: user.id }); }} className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] disabled:opacity-40">
              Save template snapshot
            </button>
          </div>

          {/* Assign to user */}
          <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
            <h3 className="text-[15px] font-normal text-black">Assign template to user</h3>
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Template asset</label>
              <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                <SelectTrigger className={darkSelectTrigger}><SelectValue placeholder="Select template asset" /></SelectTrigger>
                <SelectContent className={darkSelectContent}>
                  {assets.filter((e) => e.kind === 'full_site' || e.kind === 'blog_template').map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">Target user</label>
              <Select value={targetUserId} onValueChange={setTargetUserId}>
                <SelectTrigger className={darkSelectTrigger}><SelectValue placeholder="Select business user" /></SelectTrigger>
                <SelectContent className={darkSelectContent}>
                  {userOptions.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name} ({e.email})</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-[13px] text-[#888C99]">
              <input type="checkbox" checked={privateOnly} onChange={(e) => setPrivateOnly(e.target.checked)} className="h-3.5 w-3.5 rounded border-[#CCCCCC] accent-[#DAFF07]" />
              Only visible to this user
            </label>
            <button type="button" disabled={!selectedAssetId || !targetUserId || !user} onClick={() => { if (!selectedAssetId || !targetUserId || !user) return; assignAssetToUser(selectedAssetId, targetUserId, user.id); }} className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] disabled:opacity-40">
              Assign {privateOnly ? 'private' : ''} copy
            </button>
          </div>

          {/* Export AI-built site as template */}
          <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
            <h3 className="text-[15px] font-normal text-black">Export AI site as template</h3>
            <p className="text-[12px] text-[#888C99]">Save an AI-built site as a reusable starting point template.</p>
            <input value={aiTemplateName} onChange={(e) => setAiTemplateName(e.target.value)} placeholder="Template name" className={darkInput} />
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#888C99]">AI-built site</label>
              <Select value={aiExportSiteId} onValueChange={setAiExportSiteId}>
                <SelectTrigger className={darkSelectTrigger}><SelectValue placeholder="Select AI site" /></SelectTrigger>
                <SelectContent className={darkSelectContent}>
                  {aiSites.map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button
              type="button"
              disabled={!aiTemplateName.trim() || !aiExportSiteId || !user}
              onClick={() => {
                const site = aiSites.find((w) => w.id === aiExportSiteId);
                if (!site?.aiPreviewHtml || !user) return;
                createAiSiteTemplate({
                  name: aiTemplateName.trim(),
                  description: `AI-generated template based on "${site.name}"`,
                  previewHtml: site.aiPreviewHtml,
                  previewCss: site.aiPreviewCss || '',
                  createdByUserId: user.id,
                });
                setAiTemplateName('');
                setAiExportSiteId('');
              }}
              className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] disabled:opacity-40"
            >
              Export as template
            </button>
          </div>
        </div>

        {/* Catalog assets list */}
        <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-normal text-black">Catalog assets</h3>
            <div className="flex items-center gap-1.5">
              {['sections', 'sites', 'blog'].map((s) => (
                <Link key={s} href={`/admin/templates/${s}`} className="inline-flex h-[28px] items-center rounded-lg border border-[#EBEBEB] bg-white px-2.5 text-[12px] capitalize text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">{s}</Link>
              ))}
            </div>
          </div>
          <div className="divide-y divide-[#EBEBEB]">
            {assets.map((asset) => {
              const template = getTemplateFromAsset(asset);
              const previewImg = template?.previewImage;
              return (
                <div key={asset.id} className="flex gap-4 py-3">
                  {previewImg && (
                    <img src={previewImg} alt={asset.name} className="h-16 w-24 rounded-lg object-cover border border-[#EBEBEB]" />
                  )}
                  <div className="flex flex-1 flex-col justify-center gap-1 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-black">{asset.name}</p>
                      <p className="text-[13px] text-[#888C99]">{asset.description}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[11px] text-[#888C99]">{asset.kind}</span>
                        <span className="rounded-full bg-[#DAFF07]/20 px-2 py-0.5 text-[11px] text-black">{asset.scope}</span>
                        {asset.ownerUserId && <span className="rounded-full bg-[#F3F0FF] px-2 py-0.5 text-[11px] text-[#7C3AED]">user: {asset.ownerUserId.slice(0, 8)}</span>}
                      </div>
                    </div>
                    {asset.scope !== 'global' && (
                      <button type="button" onClick={() => { if (!user) return; publishAssetGlobal(asset.id, user.id); }} className="h-[30px] shrink-0 rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
                        Publish global
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {assets.length === 0 && <p className="py-6 text-center text-[13px] text-[#888C99]">No catalog assets yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
