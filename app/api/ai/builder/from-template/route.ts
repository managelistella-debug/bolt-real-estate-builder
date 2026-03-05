import { NextRequest, NextResponse } from 'next/server';
import { renderStartingPointTemplate, TemplateCustomization } from '@/lib/templates/renderTemplate';

interface RequestBody {
  templateId: string;
  siteProfile?: {
    agentName?: string;
    brokerageName?: string;
    teamName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    officeAddress?: string;
    aboutMe?: string;
    targetAreas?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontHeading?: string;
    fontBody?: string;
    social?: Record<string, string>;
  };
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RequestBody;

  if (!body?.templateId) {
    return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
  }

  const customization: TemplateCustomization = {
    agentName: body.siteProfile?.agentName,
    brokerageName: body.siteProfile?.brokerageName,
    teamName: body.siteProfile?.teamName,
    contactName: body.siteProfile?.contactName,
    email: body.siteProfile?.email,
    phone: body.siteProfile?.phone,
    officeAddress: body.siteProfile?.officeAddress,
    aboutMe: body.siteProfile?.aboutMe,
    targetAreas: body.siteProfile?.targetAreas,
    primaryColor: body.siteProfile?.primaryColor,
    secondaryColor: body.siteProfile?.secondaryColor,
    fontHeading: body.siteProfile?.fontHeading,
    fontBody: body.siteProfile?.fontBody,
    social: body.siteProfile?.social,
  };

  const result = renderStartingPointTemplate(body.templateId, customization);

  if (!result) {
    return NextResponse.json({ error: `Template "${body.templateId}" not found or has no renderer.` }, { status: 404 });
  }

  return NextResponse.json({
    provider: 'template',
    reply: `Your site has been built using the Country template with your information applied. You can edit text and images directly in the preview, or ask me to make changes.`,
    blueprint: {
      siteName: result.siteName,
      market: customization.targetAreas || 'Real Estate',
      heroTitle: 'Extraordinary Land. Exceptional Representation',
      heroSubtitle: '',
      ctaText: 'View Estates',
      ctaUrl: '/estates',
      primaryColor: customization.primaryColor || '#09312a',
      accentColor: customization.secondaryColor || '#daaf3a',
      backgroundColor: customization.primaryColor || '#09312a',
      bodyTextColor: '#ffffff',
      fontHeading: customization.fontHeading || 'Reckless Neue',
      fontBody: customization.fontBody || 'Lato',
      borderRadius: '0px',
      navStyle: 'normal',
      heroStyle: 'fullscreen-overlay',
      includeBlog: true,
      footerPhone: customization.phone || '',
      footerEmail: customization.email || '',
      footerAddress: customization.officeAddress || '',
      imageNavigationHeading: 'How Can We Help?',
      aboutHeading: `Meet ${customization.agentName || 'Your Name'}`,
      aboutBody: customization.aboutMe || '',
      listingsHeading: 'Featured Listings',
      featuredSalesHeading: 'Recently Sold',
      blogsHeading: 'Blog',
    },
    previewHtml: result.previewHtml,
    previewCss: result.previewCss,
  });
}
