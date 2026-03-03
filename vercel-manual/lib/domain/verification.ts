import { DomainDnsRecord } from '@/lib/types';

export interface DomainVerificationResult {
  success: boolean;
  verifiedAt: Date;
  message?: string;
}

export interface DomainVerificationProvider {
  verifyDomain(domain: string, expectedRecords: DomainDnsRecord[]): Promise<DomainVerificationResult>;
}

export class MockDomainVerificationProvider implements DomainVerificationProvider {
  async verifyDomain(domain: string): Promise<DomainVerificationResult> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const failedKeyword = /(fail|error|invalid)/i;
    const success = !failedKeyword.test(domain);

    return {
      success,
      verifiedAt: new Date(),
      message: success
        ? 'DNS records found. Domain is connected.'
        : 'DNS records not detected yet. Check your DNS entries and retry.',
    };
  }
}
