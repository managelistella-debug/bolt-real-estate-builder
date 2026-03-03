const VERCEL_API_BASE = 'https://api.vercel.com';

function authHeaders(): HeadersInit {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) {
    throw new Error('Missing VERCEL_API_TOKEN');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function attachDomainToProject(projectId: string, domain: string, teamId?: string) {
  const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';
  const response = await fetch(`${VERCEL_API_BASE}/v10/projects/${projectId}/domains${query}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name: domain }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Vercel domain attach failed: ${text}`);
  }
  return response.json();
}

export async function removeDomainFromProject(projectId: string, domain: string, teamId?: string) {
  const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';
  const response = await fetch(`${VERCEL_API_BASE}/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}${query}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Vercel domain removal failed: ${text}`);
  }
  return true;
}

export async function verifyProjectDomain(projectId: string, domain: string, teamId?: string) {
  const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';
  const response = await fetch(
    `${VERCEL_API_BASE}/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}/verify${query}`,
    {
      method: 'POST',
      headers: authHeaders(),
    }
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Vercel domain verification failed: ${text}`);
  }
  return response.json();
}
