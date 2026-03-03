'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/stores/auth';
import { useTemplateCatalogStore } from '@/lib/stores/templateCatalog';
import { useWebsiteStore } from '@/lib/stores/website';
import { createTemplateFromWebsiteSnapshot } from '@/lib/themeSnapshots';

const darkInput = 'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';
const darkSelectTrigger = 'flex h-[34px] w-full items-center rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black';
const darkSelectContent = 'rounded-lg border border-[#EBEBEB] bg-white text-[13px] text-black';

export default function AdminTemplatesPage() {
  const { user, getAllUsers } = useAuthStore();
  const { currentWebsite } = useWebsiteStore();
  const { assets, createAsset, publishAssetGlobal, assignAssetToUser } = useTemplateCatalogStore();

  const [templateName, setTemplateName] = useState('Support Snapshot Theme');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [targetUserId, setTargetUserId] = useState<string>('');

  const userOptions = useMemo(() => getAllUsers().filter((entry) => entry.role === 'business_user'), [getAllUsers]);

  return (
    <div className="min-h-screen bg-[#F5F5F3]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="border-b border-[#EBEBEB] bg-white">
        <Header title="Admin Templates" description="Publish global themes and assign private theme snapshots to specific users." />
      </div>
      <div className="space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
            <h3 className="text-[15px] font-normal text-black">Create full-site template from current website</h3>
            <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template name" className={darkInput} />
            <button type="button" disabled={!currentWebsite || !user} onClick={() => { if (!currentWebsite || !user) return; const snapshot = createTemplateFromWebsiteSnapshot(currentWebsite, templateName); createAsset({ name: snapshot.name, description: snapshot.description, kind: 'full_site', payload: snapshot, createdByUserId: user.id }); }} className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] disabled:opacity-40">
              Save template snapshot
            </button>
          </div>

          <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-3">
            <h3 className="text-[15px] font-normal text-black">Assign template to user (copy-on-assign)</h3>
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
            <button type="button" disabled={!selectedAssetId || !targetUserId || !user} onClick={() => { if (!selectedAssetId || !targetUserId || !user) return; assignAssetToUser(selectedAssetId, targetUserId, user.id); }} className="h-[30px] rounded-lg bg-[#DAFF07] px-3 text-[13px] text-black hover:bg-[#C8ED00] disabled:opacity-40">
              Assign private copy
            </button>
          </div>
        </div>

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
            {assets.map((asset) => (
              <div key={asset.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[13px] font-medium text-black">{asset.name}</p>
                  <p className="text-[13px] text-[#888C99]">{asset.description}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="rounded-full bg-[#F5F5F3] px-2 py-0.5 text-[11px] text-[#888C99]">{asset.kind}</span>
                    <span className="rounded-full bg-[#DAFF07]/20 px-2 py-0.5 text-[11px] text-black">{asset.scope}</span>
                  </div>
                </div>
                {asset.scope !== 'global' && (
                  <button type="button" onClick={() => { if (!user) return; publishAssetGlobal(asset.id, user.id); }} className="h-[30px] rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black">
                    Publish global
                  </button>
                )}
              </div>
            ))}
            {assets.length === 0 && <p className="py-6 text-center text-[13px] text-[#888C99]">No catalog assets yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
