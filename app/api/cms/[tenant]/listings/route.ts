import { NextRequest, NextResponse } from 'next/server';
import { upsertTenantContent } from '@/lib/server/cmsData';
import { runTenantRevalidation } from '@/lib/server/revalidation';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;
  const payload = await request.json();
  if (!payload?.id || !payload?.slug) {
    return NextResponse.json({ error: 'Listing payload must include id and slug' }, { status: 400 });
  }
  await upsertTenantContent({ tenantId: tenant, type: 'listing', payload });
  await runTenantRevalidation({ tenantId: tenant, type: 'listing', slug: payload.slug });
  return NextResponse.json({ success: true });
}
