import { NextRequest, NextResponse } from 'next/server';
import { assertTenantAccess, readSessionTenantContext } from '@/lib/server/tenantGuard';
import { createLeadAndSubmission } from '@/lib/server/cmsData';

export async function POST(request: NextRequest) {
  try {
    const sessionContext = readSessionTenantContext(request);
    if (!sessionContext) {
      return NextResponse.json({ error: 'Missing authenticated tenant context' }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      message,
      customFields,
      sourcePage,
      formKey,
      tenantId,
    } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Parse full name if provided
    let parsedFirstName = firstName;
    let parsedLastName = lastName;
    
    if (!parsedFirstName && body.name) {
      const nameParts = body.name.trim().split(' ');
      parsedFirstName = nameParts[0] || '';
      parsedLastName = nameParts.slice(1).join(' ') || '';
    }

    const effectiveTenantId = String(tenantId || sessionContext.effectiveUserId).trim();
    if (!effectiveTenantId || !assertTenantAccess(sessionContext, effectiveTenantId)) {
      return NextResponse.json({ error: 'Forbidden tenant access' }, { status: 403 });
    }

    const { lead, submission } = createLeadAndSubmission(effectiveTenantId, {
      firstName: parsedFirstName || undefined,
      lastName: parsedLastName || undefined,
      email,
      phone: phone || undefined,
      message: message || undefined,
      sourcePage: sourcePage || 'contact-form',
      formKey: formKey || 'contact-form',
      payload: customFields || {},
    });

    return NextResponse.json({
      success: true,
      lead,
      submission,
      message: 'Lead submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}
