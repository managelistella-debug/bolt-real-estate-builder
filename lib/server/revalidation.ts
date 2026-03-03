import { revalidatePath, revalidateTag } from 'next/cache';
import { getTenantRecord, upsertTenantRecord } from '@/lib/server/tenantStore';

type ContentType = 'listing' | 'blog' | 'testimonial' | 'globals' | 'media';

function safeRevalidatePath(pathname: string) {
  try {
    revalidatePath(pathname);
  } catch {
    // noop in environments where cache invalidation is unavailable.
  }
}

function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag);
  } catch {
    // noop in environments where cache invalidation is unavailable.
  }
}

export function getRevalidationTargets(input: {
  tenantId: string;
  type: ContentType;
  slug?: string;
}) {
  const { tenantId, type, slug } = input;
  const tags = [`tenant:${tenantId}:all`, `tenant:${tenantId}:${type}`];
  const paths = ['/', '/listings', '/blog'];

  if (type === 'listing' && slug) {
    paths.push(`/listings/${slug}`);
    tags.push(`tenant:${tenantId}:listing:${slug}`);
  }
  if (type === 'blog' && slug) {
    paths.push(`/blog/${slug}`);
    tags.push(`tenant:${tenantId}:blog:${slug}`);
  }

  return { tags, paths };
}

/**
 * Fire-and-forget POST to the tenant's configured revalidation webhook.
 * The external site uses this to clear its own ISR / data cache.
 */
async function dispatchOutboundWebhook(
  tenantId: string,
  type: ContentType,
  slug?: string,
): Promise<{ sent: boolean; url?: string; error?: string }> {
  const tenant = await getTenantRecord(tenantId);
  const url = tenant?.infra?.revalidationWebhookUrl;
  if (!url) return { sent: false };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, type, slug, ts: Date.now() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return { sent: true, url, error: `HTTP ${res.status}` };
    }
    return { sent: true, url };
  } catch (err) {
    return { sent: true, url, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function runTenantRevalidation(input: {
  tenantId: string;
  type: ContentType;
  slug?: string;
}) {
  const targets = getRevalidationTargets(input);
  targets.tags.forEach(safeRevalidateTag);
  targets.paths.forEach(safeRevalidatePath);

  const webhook = await dispatchOutboundWebhook(input.tenantId, input.type, input.slug);

  const webhookFailed = webhook.sent && !!webhook.error;
  await upsertTenantRecord(input.tenantId, (current) => ({
    ...current,
    infra: {
      ...current.infra,
      revalidationStatus: webhookFailed ? 'error' : 'ok',
      updatedAt: new Date().toISOString(),
    },
  }));
  return { ...targets, webhook };
}

export async function markRevalidationError(tenantId: string) {
  await upsertTenantRecord(tenantId, (current) => ({
    ...current,
    infra: {
      ...current.infra,
      revalidationStatus: 'error',
      updatedAt: new Date().toISOString(),
    },
  }));
}
