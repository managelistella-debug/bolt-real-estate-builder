import { DomainDnsRecord } from '@/lib/types';

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

export function buildDnsRecords(domain: string, verificationToken: string): DomainDnsRecord[] {
  const normalizedDomain = normalizeDomainInput(domain);
  const { rootDomain, subdomain } = getRootAndSubdomain(normalizedDomain);

  const records: DomainDnsRecord[] = [];

  if (!subdomain) {
    records.push(
      {
        type: 'A',
        name: '@',
        value: '127.0.0.1',
        ttl: 'Auto',
        required: true,
        notes: `Points ${rootDomain} to localhost.`,
      },
      {
        type: 'CNAME',
        name: 'www',
        value: `${rootDomain}`,
        ttl: 'Auto',
        required: true,
        notes: `Routes www.${rootDomain} to root domain.`,
      }
    );
  } else {
    records.push({
      type: 'CNAME',
      name: subdomain,
      value: rootDomain,
      ttl: 'Auto',
      required: true,
      notes: `Routes ${normalizedDomain} to root domain.`,
    });
  }

  records.push({
    type: 'TXT',
    name: `_builder-domain-verify${subdomain ? `.${subdomain}` : ''}`,
    value: verificationToken,
    ttl: 'Auto',
    required: true,
    notes: 'Ownership verification token.',
  });

  return records;
}
