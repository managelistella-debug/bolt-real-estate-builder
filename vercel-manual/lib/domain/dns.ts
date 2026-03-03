import { DomainDnsRecord } from '@/lib/types';

export const VERCEL_APEX_TARGET = '76.76.21.21';
export const VERCEL_CNAME_TARGET = 'cname.vercel-dns.com';

function getRootAndSubdomain(domain: string): { rootDomain: string; subdomain: string | null } {
  const parts = domain.split('.').filter(Boolean);
  if (parts.length <= 2) {
    return { rootDomain: domain, subdomain: null };
  }

  const rootDomain = parts.slice(-2).join('.');
  const subdomain = parts.slice(0, -2).join('.');
  return { rootDomain, subdomain };
}

export function normalizeDomainInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '')
    .replace(/^\.+|\.+$/g, '');
}

export function isValidDomain(input: string): boolean {
  const normalized = normalizeDomainInput(input);
  const pattern = /^(?=.{1,253}$)(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/;
  return pattern.test(normalized);
}

export function buildVercelDnsRecords(domain: string, verificationToken: string): DomainDnsRecord[] {
  const normalizedDomain = normalizeDomainInput(domain);
  const { rootDomain, subdomain } = getRootAndSubdomain(normalizedDomain);

  const records: DomainDnsRecord[] = [];

  if (!subdomain) {
    records.push(
      {
        type: 'A',
        name: '@',
        value: VERCEL_APEX_TARGET,
        ttl: 'Auto',
        required: true,
        notes: `Points ${rootDomain} to Vercel.`,
      },
      {
        type: 'CNAME',
        name: 'www',
        value: VERCEL_CNAME_TARGET,
        ttl: 'Auto',
        required: true,
        notes: `Routes www.${rootDomain} to Vercel.`,
      }
    );
  } else {
    records.push({
      type: 'CNAME',
      name: subdomain,
      value: VERCEL_CNAME_TARGET,
      ttl: 'Auto',
      required: true,
      notes: `Routes ${normalizedDomain} to Vercel.`,
    });
  }

  records.push({
    type: 'TXT',
    name: `_builder-domain-verify${subdomain ? `.${subdomain}` : ''}`,
    value: verificationToken,
    ttl: 'Auto',
    required: true,
    notes: 'Ownership verification token (prototype record for future API verification).',
  });

  return records;
}
