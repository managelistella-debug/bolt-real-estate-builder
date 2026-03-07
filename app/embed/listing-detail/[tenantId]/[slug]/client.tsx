'use client';

import { EmbedListingDetail } from '@/components/embeds/EmbedListingDetail';

interface Props {
  listing: Record<string, unknown>;
  config: Record<string, unknown>;
}

export function EmbedDetailClient({ listing, config }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <EmbedListingDetail listing={listing as any} config={config as any} />;
}
