import { NextRequest, NextResponse } from 'next/server';
import { verifyPublicApiKey } from './cmsData';

export function requirePublicApiKey(
  request: NextRequest,
  tenantId: string,
  scope: 'content:read' | 'forms:write'
): NextResponse | null {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
  }
  if (!verifyPublicApiKey(tenantId, apiKey, scope)) {
    return NextResponse.json({ error: 'Invalid API key or scope' }, { status: 403 });
  }
  return null;
}
