import { Metadata } from 'next';
import { getServiceClient } from '@/lib/supabase/server';
import { EmbedBlogFeedClient } from './client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ configId: string }>;
}

async function getEmbedConfig(configId: string) {
  const sb = getServiceClient();
  const { data } = await sb.from('embed_configs').select('*').eq('id', configId).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { configId } = await params;
  const config = await getEmbedConfig(configId);
  return {
    title: config?.name || 'Blog Feed',
    description: 'Blog feed embed',
  };
}

export default async function EmbedBlogFeedPage({ params }: Props) {
  const { configId } = await params;
  const config = await getEmbedConfig(configId);

  if (!config) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ color: '#888' }}>Embed configuration not found.</p>
      </div>
    );
  }

  return (
    <EmbedBlogFeedClient
      configId={configId}
      tenantId={config.tenant_id}
      feedConfig={config.config}
    />
  );
}
