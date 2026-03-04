'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, CheckCircle2, ChevronDown, ChevronUp, Copy, ExternalLink, Link2, Loader2, PlugZap, XCircle } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConnectionState {
  provisioned: boolean;
  apiKey: string;
  webhookUrl: string;
  webhookStatus: string;
  listingsCount: number;
  blogsCount: number;
  testimonialsCount: number;
}

interface TestResult {
  tenant: boolean;
  apiKey: boolean;
  listings: number;
  blogs: number;
  testimonials: number;
  webhook: boolean;
  webhookUrl: string | null;
  webhookStatus: string;
}

interface Props {
  tenantId: string;
  userName?: string;
  isAdmin?: boolean;
}

// ---------------------------------------------------------------------------
// Shared UI
// ---------------------------------------------------------------------------

const inputClass =
  'h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]';

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#888C99] hover:text-black"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">{label}</p>
      <div className="flex items-center gap-2 rounded-md border border-[#EBEBEB] bg-[#F5F5F3] px-3 py-1.5">
        <code className="flex-1 truncate text-[12px] text-black">{value}</code>
        <CopyBtn value={value} />
      </div>
    </div>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return ok ? (
    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
  ) : (
    <XCircle className="h-4 w-4 shrink-0 text-[#CCCCCC]" />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WebsiteConnectionPanel({ tenantId, userName, isAdmin }: Props) {
  const [conn, setConn] = useState<ConnectionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const [siteUrl, setSiteUrl] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const apiBaseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Fetch current connection state
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tenants/link?tenantId=${encodeURIComponent(tenantId)}`);
      const data = await res.json();
      if (data.provisioned) {
        setConn({
          provisioned: true,
          apiKey: data.connection.apiKey,
          webhookUrl: data.connection.webhookUrl ?? '',
          webhookStatus: data.connection.webhookStatus,
          listingsCount: data.connection.listingsCount,
          blogsCount: data.connection.blogsCount,
          testimonialsCount: data.connection.testimonialsCount ?? 0,
        });
        if (data.connection.webhookUrl) setWebhookUrl(data.connection.webhookUrl);
      } else {
        setConn(null);
      }
    } catch {
      setConn(null);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Link / provision
  const handleLink = async () => {
    setLinking(true);
    try {
      const res = await fetch('/api/tenants/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          websiteUrl: siteUrl || undefined,
          webhookUrl: webhookUrl || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConn({
          provisioned: true,
          apiKey: data.connection.apiKey,
          webhookUrl: data.connection.webhookUrl ?? '',
          webhookStatus: data.connection.webhookStatus,
          listingsCount: data.connection.listingsCount,
          blogsCount: data.connection.blogsCount ?? 0,
          testimonialsCount: data.connection.testimonialsCount ?? 0,
        });
        setShowCredentials(true);
      }
    } finally {
      setLinking(false);
    }
  };

  // Test connection
  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/tenants/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, apiKey: conn?.apiKey }),
      });
      const data = await res.json();
      if (data.checks) setTestResult(data.checks);
    } finally {
      setTesting(false);
    }
  };

  // Save webhook update
  const handleSaveWebhook = async () => {
    setLinking(true);
    try {
      await fetch('/api/tenants/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, webhookUrl }),
      });
      await refresh();
    } finally {
      setLinking(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-[#EBEBEB] bg-white p-5">
        <div className="flex items-center gap-2 text-[13px] text-[#888C99]">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading connection status...
        </div>
      </div>
    );
  }

  const defaultApiKey = conn?.apiKey ?? `demo_public_key_${tenantId}`;
  const listingsEndpoint = `${apiBaseUrl}/api/public/${tenantId}/listings`;
  const blogsEndpoint = `${apiBaseUrl}/api/public/${tenantId}/blogs`;
  const testimonialsEndpoint = `${apiBaseUrl}/api/public/${tenantId}/testimonials`;

  return (
    <div className="rounded-xl border border-[#EBEBEB] bg-white p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-[#888C99]" />
            <h2 className="text-[15px] font-normal text-black">
              {conn?.provisioned ? 'Website Connection' : 'Link a Website'}
            </h2>
          </div>
          <p className="mt-1 text-[13px] text-[#888C99]">
            {isAdmin && userName
              ? `Manage the API connection for ${userName}'s account.`
              : 'Connect an external website to pull listings, blogs, and testimonials from your CMS.'}
          </p>
        </div>
        {conn?.provisioned && (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connected
          </span>
        )}
      </div>

      {/* Not yet provisioned — show link form */}
      {!conn?.provisioned && (
        <div className="space-y-3 rounded-lg border border-dashed border-[#EBEBEB] bg-[#FAFAF9] p-4">
          <p className="text-[13px] text-black">
            Provision this tenant to generate API credentials and enable the listings API.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">External Website URL</label>
              <input
                placeholder="https://agent-website.com"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Revalidation Webhook (optional)</label>
              <input
                placeholder="https://agent-website.com/api/webhooks/cms"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleLink}
            disabled={linking}
            className="inline-flex h-[34px] items-center gap-2 rounded-lg bg-[#DAFF07] px-4 text-[13px] font-medium text-black hover:bg-[#C8ED00] disabled:opacity-50"
          >
            {linking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlugZap className="h-3.5 w-3.5" />}
            {linking ? 'Provisioning...' : 'Provision & Link'}
          </button>
        </div>
      )}

      {/* Provisioned — show connection details */}
      {conn?.provisioned && (
        <>
          {/* Stats row */}
          <div className="grid gap-3 md:grid-cols-5">
            <div className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Listings</p>
              <p className="mt-0.5 text-[18px] font-medium text-black">{conn.listingsCount}</p>
            </div>
            <div className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Blog Posts</p>
              <p className="mt-0.5 text-[18px] font-medium text-black">{conn.blogsCount}</p>
            </div>
            <div className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Testimonials</p>
              <p className="mt-0.5 text-[18px] font-medium text-black">{conn.testimonialsCount}</p>
            </div>
            <div className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Webhook</p>
              <p className="mt-0.5 text-[13px] font-medium text-black">{conn.webhookUrl ? 'Configured' : 'Not set'}</p>
            </div>
            <div className="rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Webhook Status</p>
              <p className={`mt-0.5 text-[13px] font-medium ${conn.webhookStatus === 'ok' ? 'text-emerald-600' : conn.webhookStatus === 'error' ? 'text-red-500' : 'text-[#888C99]'}`}>
                {conn.webhookStatus}
              </p>
            </div>
          </div>

          {/* Webhook config */}
          <div className="space-y-2">
            <label className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Revalidation Webhook URL</label>
            <div className="flex gap-2">
              <input
                placeholder="https://agent-website.com/api/webhooks/cms"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={handleSaveWebhook}
                disabled={linking}
                className="inline-flex h-[34px] items-center rounded-lg border border-[#EBEBEB] bg-white px-3 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black disabled:opacity-50"
              >
                {linking ? 'Saving...' : 'Save'}
              </button>
            </div>
            <p className="text-[11px] text-[#888C99]">
              The CMS will POST to this URL when content changes, so the external site can revalidate its cache.
            </p>
          </div>

          {/* Test connection */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="inline-flex h-[34px] items-center gap-2 rounded-lg bg-black px-4 text-[13px] font-medium text-white hover:bg-black/80 disabled:opacity-50"
            >
              {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlugZap className="h-3.5 w-3.5" />}
              {testing ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="inline-flex h-[34px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-4 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
            >
              {showCredentials ? 'Hide' : 'Show'} Credentials
              {showCredentials ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {siteUrl && (
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[34px] items-center gap-1.5 rounded-lg border border-[#EBEBEB] bg-white px-4 text-[13px] text-[#888C99] hover:bg-[#F5F5F3] hover:text-black"
              >
                Visit Site <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Test results */}
          {testResult && (
            <div className="rounded-lg border border-[#EBEBEB] bg-[#FAFAF9] p-4 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#888C99]">Connection Test Results</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[13px]">
                  <StatusDot ok={testResult.tenant} />
                  <span className="text-black">Tenant provisioned</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <StatusDot ok={testResult.apiKey} />
                  <span className="text-black">API key valid (content:read scope)</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <StatusDot ok={testResult.listings > 0} />
                  <span className="text-black">{testResult.listings} listing{testResult.listings !== 1 ? 's' : ''} available</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <StatusDot ok={testResult.blogs > 0} />
                  <span className="text-black">{testResult.blogs} blog post{testResult.blogs !== 1 ? 's' : ''} available</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <StatusDot ok={testResult.testimonials > 0} />
                  <span className="text-black">
                    {testResult.testimonials} testimonial{testResult.testimonials !== 1 ? 's' : ''} available
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <StatusDot ok={testResult.webhook} />
                  <span className="text-black">
                    Revalidation webhook {testResult.webhook ? 'configured' : 'not configured'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Credentials drawer */}
          {showCredentials && (
            <div className="space-y-3 rounded-lg border border-[#EBEBEB] bg-[#FAFAF9] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#888C99]">API Credentials</p>
              <div className="grid gap-3 md:grid-cols-3">
                <Field label="Tenant ID" value={tenantId} />
                <Field label="API Key" value={defaultApiKey} />
                <Field label="API Base URL" value={apiBaseUrl} />
              </div>
              <Field label="Listings Endpoint" value={listingsEndpoint} />
              <Field label="Blogs Endpoint" value={blogsEndpoint} />
              <Field label="Testimonials Endpoint" value={testimonialsEndpoint} />

              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Environment Variables</p>
                <div className="relative rounded-md border border-[#EBEBEB] bg-white p-3">
                  <pre className="overflow-x-auto text-[12px] leading-5 text-black">{`CMS_BASE_URL=${apiBaseUrl}
CMS_READ_TOKEN=${defaultApiKey}
TENANT_ID=${tenantId}`}</pre>
                  <div className="absolute right-2 top-2">
                    <CopyBtn value={`CMS_BASE_URL=${apiBaseUrl}\nCMS_READ_TOKEN=${defaultApiKey}\nTENANT_ID=${tenantId}`} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#888C99]">Quick Fetch</p>
                <div className="relative rounded-md border border-[#EBEBEB] bg-white p-3">
                  <pre className="overflow-x-auto text-[12px] leading-5 text-black">{`const listingsRes = await fetch(
  '${listingsEndpoint}',
  { headers: { 'x-api-key': '${defaultApiKey}' } }
);
const { items: listings } = await listingsRes.json();

const blogsRes = await fetch(
  '${blogsEndpoint}?status=published',
  { headers: { 'x-api-key': '${defaultApiKey}' } }
);
const { items: blogs } = await blogsRes.json();

const testimonialsRes = await fetch(
  '${testimonialsEndpoint}',
  { headers: { 'x-api-key': '${defaultApiKey}' } }
);
const { items: testimonials } = await testimonialsRes.json();`}</pre>
                  <div className="absolute right-2 top-2">
                    <CopyBtn value={`const listingsRes = await fetch(\n  '${listingsEndpoint}',\n  { headers: { 'x-api-key': '${defaultApiKey}' } }\n);\nconst { items: listings } = await listingsRes.json();\n\nconst blogsRes = await fetch(\n  '${blogsEndpoint}?status=published',\n  { headers: { 'x-api-key': '${defaultApiKey}' } }\n);\nconst { items: blogs } = await blogsRes.json();\n\nconst testimonialsRes = await fetch(\n  '${testimonialsEndpoint}',\n  { headers: { 'x-api-key': '${defaultApiKey}' } }\n);\nconst { items: testimonials } = await testimonialsRes.json();`} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
