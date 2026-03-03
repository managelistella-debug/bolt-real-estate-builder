import { NextRequest, NextResponse } from 'next/server';
import { createLeadAndSubmission } from '@/lib/server/cmsData';
import { requirePublicApiKey } from '@/lib/server/publicApi';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;
  const unauthorized = await requirePublicApiKey(request, tenant, 'forms:write');
  if (unauthorized) return unauthorized;

  const body = await request.json();
  if (!body?.email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const result = await createLeadAndSubmission(tenant, {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    message: body.message,
    sourcePage: body.sourcePage,
    formKey: body.formKey || 'contact',
    payload: body.payload || {},
  });

  return NextResponse.json({
    apiVersion: 'v1',
    success: true,
    lead: result.lead,
    submission: result.submission,
  });
}
