import { NextRequest, NextResponse } from 'next/server';
import {
  BuilderBlueprint,
  normalizeToRealEstateBlueprint,
  parseBlueprintCandidate,
} from '@/lib/ai/builderBlueprint';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SiteProfilePayload {
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
  selectedPages?: string[];
  selectedFeatures?: string[];
  additionalNotes?: string;
  preferredTemplateId?: string;
  social?: Record<string, string>;
}

interface BuilderRequestBody {
  prompt: string;
  conversation: ConversationMessage[];
  siteProfile?: SiteProfilePayload;
}

interface BuilderResponseBody {
  provider: 'claude';
  reply: string;
  blueprint: BuilderBlueprint;
  previewHtml: string;
  previewCss: string;
}

function extractJsonObject(rawText: string): unknown {
  const start = rawText.indexOf('{');
  const end = rawText.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  const snippet = rawText.slice(start, end + 1);
  try {
    return JSON.parse(snippet);
  } catch {
    return null;
  }
}

function buildSystemPrompt(): string {
  return [
    'You are an AI website builder copilot for a real-estate platform.',
    'Return valid JSON only.',
    'Do not include markdown fences.',
    'The JSON MUST include these top-level keys:',
    '- reply: short assistant response to show in chat',
    '- blueprint: object with the exact shape:',
    '{',
    '  "siteName": string,',
    '  "market": string,',
    '  "heroTitle": string,',
    '  "heroSubtitle": string,',
    '  "ctaText": string,',
    '  "ctaUrl": string,',
    '  "imageNavigationHeading": string,',
    '  "aboutHeading": string,',
    '  "aboutBody": string,',
    '  "listingsHeading": string,',
    '  "featuredSalesHeading": string,',
    '  "blogsHeading": string,',
    '  "includeBlog": boolean,',
    '  "footerPhone": string,',
    '  "footerEmail": string,',
    '  "footerAddress": string,',
    '  "primaryColor": string (hex),',
    '  "accentColor": string (hex),',
    '  "backgroundColor": string (hex, page background),',
    '  "bodyTextColor": string (hex, body copy color),',
    '  "fontHeading": string (Google Font name for headings),',
    '  "fontBody": string (Google Font name for body/nav),',
    '  "borderRadius": string (CSS value, e.g. "0px" for sharp, "8px" for rounded),',
    '  "navStyle": "uppercase-spaced" | "normal",',
    '  "heroStyle": "fullscreen-overlay" | "split" | "centered"',
    '}',
    '',
    'Business rules:',
    '- Build only real-estate websites.',
    '- Never produce output for non-real-estate business types.',
    '- Default structure unless user explicitly requests otherwise:',
    '  hero, image-navigation, exclusive listings (CMS), recently sold (CMS), about, contact form, optional blog section.',
    '- Default visual style reference (use unless user asks otherwise):',
    '  Clean, white-background luxury aesthetic. Dark navy (#002349) for primary/accent.',
    '  "Playfair Display" serif for headings, "DM Sans" clean sans-serif for body/nav.',
    '  Uppercase nav links with letter-spacing. Sharp edges (0px border-radius).',
    '  Full-width hero with dark gradient overlays on background image.',
    '  White section backgrounds. Body text in #666666.',
    '  Buttons: outlined or filled with primary color, uppercase text.',
    '  Listing cards with full image backgrounds and white text overlays.',
    '- If user requests modern/minimal: use "DM Sans" for headings, "Inter" for body, rounded corners, darker palette.',
    '- If user requests warm/classic: use "Cormorant Garamond" headings, copper (#c28563) accent.',
    '- If user requests luxury/premium: use darker navy (#0B0F19), gold accent (#C9A96E).',
    '- Header must be transparent at top and become solid on scroll.',
    '- Footer must include contact information.',
    '- Default pages: buying, selling, active listings, sold listings, about, contact, optional blog.',
    '- There must always be listing details pages for active and sold listings.',
    '- Keep outputs concise and production-ready.',
  ].join('\n');
}

function buildProfileContext(profile?: SiteProfilePayload): string {
  if (!profile) return '';
  const lines: string[] = ['', 'USER PROFILE DATA (incorporate into the site):'];
  if (profile.agentName) lines.push(`Agent name: ${profile.agentName}`);
  if (profile.brokerageName) lines.push(`Brokerage: ${profile.brokerageName}`);
  if (profile.teamName) lines.push(`Team name: ${profile.teamName}`);
  if (profile.contactName) lines.push(`Contact name: ${profile.contactName}`);
  if (profile.email) lines.push(`Email: ${profile.email}`);
  if (profile.phone) lines.push(`Phone: ${profile.phone}`);
  if (profile.officeAddress) lines.push(`Office address: ${profile.officeAddress}`);
  if (profile.aboutMe) lines.push(`About (for about section): ${profile.aboutMe}`);
  if (profile.targetAreas) lines.push(`Target areas/markets: ${profile.targetAreas}`);
  if (profile.primaryColor) lines.push(`Brand primary color: ${profile.primaryColor}`);
  if (profile.secondaryColor) lines.push(`Brand secondary/accent color: ${profile.secondaryColor}`);
  if (profile.fontHeading) lines.push(`Heading font: ${profile.fontHeading}`);
  if (profile.fontBody) lines.push(`Body font: ${profile.fontBody}`);
  if (profile.selectedPages?.length) lines.push(`Pages to include: ${profile.selectedPages.join(', ')}`);
  if (profile.selectedFeatures?.length) lines.push(`Features to include: ${profile.selectedFeatures.join(', ')}`);
  if (profile.additionalNotes) lines.push(`Additional notes: ${profile.additionalNotes}`);
  if (profile.social) {
    const socials = Object.entries(profile.social).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
    if (socials.length) lines.push(`Social media: ${socials.join(', ')}`);
  }
  return lines.join('\n');
}

function buildUserContext(
  prompt: string,
  conversation: ConversationMessage[],
  siteProfile?: SiteProfilePayload,
): string {
  const compactHistory = conversation
    .slice(-6)
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join('\n');
  return [
    'Conversation history:',
    compactHistory || 'none',
    '',
    `Latest user request: ${prompt}`,
    buildProfileContext(siteProfile),
    '',
    'Remember: this platform only supports real-estate websites.',
    'Build navigation and sections for ALL pages the user requested.',
    'Include all requested features (mortgage calculator, newsletter, etc.).',
  ].join('\n');
}

function isRealEstatePrompt(prompt: string): boolean {
  const text = prompt.toLowerCase();
  const disallowed = [
    'restaurant',
    'dentist',
    'law firm',
    'gym',
    'ecommerce',
    'fashion',
    'automotive shop',
    'saas app',
  ];
  const hasDisallowed = disallowed.some((token) => text.includes(token));
  if (hasDisallowed) return false;
  return true;
}

function fontImportUrl(fontName: string): string {
  const encoded = fontName.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700&display=swap`;
}

function buildDefaultPreview(blueprint: BuilderBlueprint): { previewHtml: string; previewCss: string } {
  const heroImage =
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80';
  const navImages = {
    buying:
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    selling:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    active:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    sold:
      'https://images.unsplash.com/photo-1600585154154-712e664d8f7b?auto=format&fit=crop&w=1200&q=80',
  };

  const isUpperNav = blueprint.navStyle === 'uppercase-spaced';
  const navLinkClass = isUpperNav ? 'nav-link uppercase-spaced' : 'nav-link';

  const blogSection = blueprint.includeBlog
    ? `
  <section class="blogs" data-source="cms-blogs" id="blog">
    <h2>${blueprint.blogsHeading}</h2>
    <p class="tag">Powered by CMS Blogs</p>
    <div class="cards">
      <article class="card blog-card"><img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80" alt="Real estate blog post" /><h3>Spring staging checklist</h3><p>How to prepare listings for stronger offers.</p></article>
      <article class="card blog-card"><img src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80" alt="Luxury home market" /><h3>Market update</h3><p>Mortgage and demand trends for this quarter.</p></article>
      <article class="card blog-card"><img src="https://images.unsplash.com/photo-1600566752227-8f3a4f8e228f?auto=format&fit=crop&w=1200&q=80" alt="Home sale strategy" /><h3>Pricing strategy</h3><p>How to position your home for faster results.</p></article>
    </div>
  </section>`
    : '';

  return {
    previewHtml: `
<main class="site-root">
  <header class="site-header" data-scroll-mode="transparent-to-solid">
    <div class="brand">${blueprint.siteName}</div>
    <nav>
      <a class="${navLinkClass}" href="/buying">Buying</a>
      <a class="${navLinkClass}" href="/selling">Selling</a>
      <a class="${navLinkClass}" href="/listings/active">Active Listings</a>
      <a class="${navLinkClass}" href="/listings/sold">Sold Listings</a>
      <a class="${navLinkClass}" href="/about">About</a>
      <a class="${navLinkClass}" href="/contact">Contact</a>
      ${blueprint.includeBlog ? `<a class="${navLinkClass}" href="/blog">Blog</a>` : ''}
    </nav>
  </header>

  <section class="hero hero-${blueprint.heroStyle}">
    <img class="hero-image" src="${heroImage}" alt="Luxury real estate hero" />
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="eyebrow">${blueprint.market}</p>
      <h1>${blueprint.heroTitle}</h1>
      <p class="subtitle">${blueprint.heroSubtitle}</p>
      <a class="cta-button" href="${blueprint.ctaUrl}">${blueprint.ctaText}</a>
    </div>
  </section>

  <section class="image-navigation">
    <h2>${blueprint.imageNavigationHeading}</h2>
    <div class="nav-grid">
      <a class="nav-card" href="/buying">
        <img src="${navImages.buying}" alt="Buying homes" />
        <div class="nav-card-overlay"></div>
        <div class="nav-card-content"><strong>Buying</strong><p>Find your next home</p></div>
      </a>
      <a class="nav-card" href="/selling">
        <img src="${navImages.selling}" alt="Selling homes" />
        <div class="nav-card-overlay"></div>
        <div class="nav-card-content"><strong>Selling</strong><p>List with confidence</p></div>
      </a>
      <a class="nav-card" href="/listings/active">
        <img src="${navImages.active}" alt="Active listings" />
        <div class="nav-card-overlay"></div>
        <div class="nav-card-content"><strong>Active Listings</strong><p>See current inventory</p></div>
      </a>
      <a class="nav-card" href="/listings/sold">
        <img src="${navImages.sold}" alt="Sold listings" />
        <div class="nav-card-overlay"></div>
        <div class="nav-card-content"><strong>Sold Listings</strong><p>Track recent sales</p></div>
      </a>
    </div>
  </section>

  <section class="listings" data-source="cms-listings">
    <h2>${blueprint.listingsHeading}</h2>
    <p class="tag">Powered by CMS Listings</p>
    <div class="listing-grid">
      <article class="listing-card">
        <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80" alt="Active listing" />
        <div class="listing-overlay"></div>
        <div class="listing-info">
          <span class="listing-price">$675,000</span>
          <span class="listing-address">123 Main St</span>
          <span class="listing-details">3 bed &bull; 2 bath</span>
          <span class="listing-cta">Learn More</span>
        </div>
      </article>
      <article class="listing-card">
        <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80" alt="Active listing" />
        <div class="listing-overlay"></div>
        <div class="listing-info">
          <span class="listing-price">$849,000</span>
          <span class="listing-address">88 Oak Ave</span>
          <span class="listing-details">4 bed &bull; 3 bath</span>
          <span class="listing-cta">Learn More</span>
        </div>
      </article>
      <article class="listing-card">
        <img src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80" alt="Active listing" />
        <div class="listing-overlay"></div>
        <div class="listing-info">
          <span class="listing-price">$539,000</span>
          <span class="listing-address">42 Sunset Dr</span>
          <span class="listing-details">2 bed &bull; 2 bath</span>
          <span class="listing-cta">Learn More</span>
        </div>
      </article>
    </div>
    <p class="tag">Listing details pages: <code>/listings/active/[slug]</code> and <code>/listings/sold/[slug]</code></p>
  </section>

  <section class="featured-sales" data-source="cms-listings" data-listing-status="sold">
    <h2>${blueprint.featuredSalesHeading}</h2>
    <p class="tag">Powered by CMS Listings (Sold)</p>
    <div class="listing-grid">
      <article class="listing-card">
        <img src="https://images.unsplash.com/photo-1600585154154-712e664d8f7b?auto=format&fit=crop&w=1200&q=80" alt="Sold listing" />
        <div class="listing-overlay"></div>
        <div class="listing-info">
          <span class="listing-price">Sold &bull; $710,000</span>
          <span class="listing-address">12 Cedar Ln</span>
          <span class="listing-cta">Learn More</span>
        </div>
      </article>
      <article class="listing-card">
        <img src="https://images.unsplash.com/photo-1600607687126-8a6f450f1b17?auto=format&fit=crop&w=1200&q=80" alt="Sold listing" />
        <div class="listing-overlay"></div>
        <div class="listing-info">
          <span class="listing-price">Sold &bull; $965,000</span>
          <span class="listing-address">304 Ridge Rd</span>
          <span class="listing-cta">Learn More</span>
        </div>
      </article>
      <article class="listing-card">
        <img src="https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?auto=format&fit=crop&w=1200&q=80" alt="Sold listing" />
        <div class="listing-overlay"></div>
        <div class="listing-info">
          <span class="listing-price">Sold &bull; $580,000</span>
          <span class="listing-address">900 Park Pl</span>
          <span class="listing-cta">Learn More</span>
        </div>
      </article>
    </div>
  </section>

  <section class="about">
    <h2>${blueprint.aboutHeading}</h2>
    <p>${blueprint.aboutBody}</p>
  </section>

  ${blogSection}

  <section class="contact-form" id="contact">
    <h2>Contact Us</h2>
    <p>Schedule a tour or request property details.</p>
    <form>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <input type="tel" placeholder="Phone" />
      <textarea placeholder="Tell us what you're looking for"></textarea>
      <button type="button">Submit</button>
    </form>
  </section>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">${blueprint.siteName}</div>
      <div class="footer-contact">
        <p>${blueprint.footerPhone}</p>
        <p>${blueprint.footerEmail}</p>
        <p>${blueprint.footerAddress}</p>
      </div>
    </div>
  </footer>
</main>
`.trim(),
    previewCss: `
@import url('${fontImportUrl(blueprint.fontHeading)}');
@import url('${fontImportUrl(blueprint.fontBody)}');
:root {
  --primary: ${blueprint.primaryColor};
  --accent: ${blueprint.accentColor};
  --bg: ${blueprint.backgroundColor};
  --bodyText: ${blueprint.bodyTextColor};
  --radius: ${blueprint.borderRadius};
  --fontHeading: '${blueprint.fontHeading}', Georgia, serif;
  --fontBody: '${blueprint.fontBody}', system-ui, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--fontBody); background: var(--bg); color: var(--bodyText); -webkit-font-smoothing: antialiased; }
.site-root { max-width: 100%; overflow-x: hidden; }

/* Header */
.site-header { position: sticky; top: 0; z-index: 50; display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); transition: background 0.3s ease; }
.site-header nav { display: flex; flex-wrap: wrap; gap: 24px; }
.nav-link { text-decoration: none; color: #fff; font-size: 13px; font-weight: 500; transition: opacity 0.2s; }
.nav-link:hover { opacity: 0.7; }
.nav-link.uppercase-spaced { text-transform: uppercase; letter-spacing: 1.5px; font-size: 12px; }
.brand { font-family: var(--fontHeading); font-size: 24px; color: #fff; letter-spacing: 0.5px; }

/* Hero */
.hero { position: relative; width: 100%; min-height: 700px; display: flex; align-items: flex-end; overflow: hidden; }
.hero-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%); }
.hero-content { position: relative; z-index: 1; padding: 60px 50px; color: #fff; max-width: 800px; }
.eyebrow { text-transform: uppercase; letter-spacing: 2px; font-size: 12px; font-weight: 500; opacity: 0.85; margin-bottom: 12px; font-family: var(--fontBody); }
.hero h1 { font-family: var(--fontHeading); font-size: 56px; line-height: 1.1; font-weight: 400; margin-bottom: 16px; }
.subtitle { font-size: 16px; line-height: 1.6; opacity: 0.9; max-width: 600px; }
.cta-button { display: inline-block; margin-top: 28px; padding: 16px 36px; border: 1px solid #fff; color: #fff; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 500; transition: all 0.3s; border-radius: var(--radius); }
.cta-button:hover { background: #fff; color: var(--primary); }

/* Sections */
section { padding: 64px 50px; }
section h2 { font-family: var(--fontHeading); font-size: 36px; font-weight: 400; color: var(--primary); margin-bottom: 16px; }

/* Image Navigation */
.nav-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 24px; }
.nav-card { position: relative; display: block; height: 280px; overflow: hidden; text-decoration: none; color: #fff; border-radius: var(--radius); }
.nav-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.nav-card:hover img { transform: scale(1.05); }
.nav-card-overlay { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%); }
.nav-card-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; z-index: 1; }
.nav-card-content strong { display: block; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.nav-card-content p { font-size: 13px; opacity: 0.8; }

/* Listing Cards */
.listing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }
.listing-card { position: relative; height: 380px; overflow: hidden; border-radius: var(--radius); }
.listing-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.listing-card:hover img { transform: scale(1.05); }
.listing-overlay { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 50%); }
.listing-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 24px; z-index: 1; display: flex; flex-direction: column; gap: 4px; }
.listing-price { color: #fff; font-size: 18px; font-weight: 500; font-family: var(--fontBody); }
.listing-address { color: #fff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; }
.listing-details { color: rgba(255,255,255,0.8); font-size: 13px; }
.listing-cta { color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; opacity: 0.8; }

/* About */
.about { max-width: 800px; margin-left: auto; margin-right: auto; text-align: center; }
.about p { font-size: 16px; line-height: 1.8; color: var(--bodyText); }

/* Blog Cards */
.blog-card { background: #fff; border: 1px solid #e5e5e5; border-radius: var(--radius); overflow: hidden; }
.blog-card img { width: 100%; height: 200px; object-fit: cover; }
.blog-card h3 { padding: 16px 16px 4px; font-family: var(--fontHeading); font-size: 18px; font-weight: 400; color: var(--primary); }
.blog-card p { padding: 0 16px 16px; font-size: 14px; color: var(--bodyText); }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }

/* Contact Form */
.contact-form { max-width: 600px; margin-left: auto; margin-right: auto; text-align: center; }
.contact-form p { color: var(--bodyText); margin-bottom: 24px; }
.contact-form form { display: grid; gap: 12px; text-align: left; }
.contact-form input, .contact-form textarea { width: 100%; border: 1px solid #ddd; border-radius: var(--radius); padding: 14px 16px; font: inherit; font-size: 14px; color: #333; }
.contact-form input::placeholder, .contact-form textarea::placeholder { color: #aaa; }
.contact-form button { background: var(--primary); color: #fff; border: none; border-radius: var(--radius); padding: 14px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 500; cursor: pointer; transition: opacity 0.2s; }
.contact-form button:hover { opacity: 0.85; }

/* Tags */
.tag { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
.tag code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 11px; }

/* Footer */
.site-footer { background: var(--primary); color: #fff; padding: 48px 50px; margin-top: 0; }
.footer-inner { display: flex; justify-content: space-between; align-items: flex-start; max-width: 1200px; margin: 0 auto; }
.footer-brand { font-family: var(--fontHeading); font-size: 22px; }
.footer-contact { text-align: right; }
.footer-contact p { font-size: 14px; opacity: 0.8; line-height: 1.8; }
`.trim(),
  };
}

function sanitizePreviewHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
}

async function generateWithClaude(
  body: BuilderRequestBody,
  apiKey: string,
): Promise<BuilderResponseBody | null> {
  const userText = buildUserContext(
    body.prompt,
    body.conversation || [],
    body.siteProfile,
  );

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-6',
      max_tokens: 2048,
      temperature: 0.3,
      system: buildSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: userText }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const reason = await response.text().catch(() => 'Unknown Claude API error');
    throw new Error(`Claude request failed: ${reason}`);
  }
  const payload = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = payload.content?.find((entry) => entry.type === 'text')?.text || '';
  if (!text) throw new Error('Claude returned empty response');

  const parsed = extractJsonObject(text) as {
    reply?: string;
    blueprint?: unknown;
  } | null;
  const rawBlueprint = parseBlueprintCandidate(parsed?.blueprint);
  if (!parsed || typeof parsed.reply !== 'string') {
    throw new Error('Could not parse Claude response JSON');
  }
  const blueprint = normalizeToRealEstateBlueprint(rawBlueprint || {}, body.prompt);
  const fallbackPreview = buildDefaultPreview(blueprint);
  const previewHtml = sanitizePreviewHtml(fallbackPreview.previewHtml);
  const previewCss = fallbackPreview.previewCss;

  const requiredSectionSignals =
    /data-source=["']cms-listings["']/i.test(previewHtml) &&
    (blueprint.includeBlog ? /data-source=["']cms-blogs["']/i.test(previewHtml) : true);
  if (!requiredSectionSignals) {
    throw new Error('Generated preview did not include required CMS listings sections');
  }

  return {
    provider: 'claude',
    reply: parsed.reply,
    blueprint,
    previewHtml,
    previewCss,
  };
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BuilderRequestBody;
  if (!body?.prompt || !body?.prompt.trim()) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }
  if (!isRealEstatePrompt(body.prompt)) {
    return NextResponse.json(
      {
        error:
          'This builder only supports real-estate websites. Please provide a real-estate-focused request.',
      },
      { status: 400 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'Missing ANTHROPIC_API_KEY. Opus-only mode is enabled, so generation cannot run without Anthropic credentials.',
      },
      { status: 500 },
    );
  }
  const model = process.env.ANTHROPIC_MODEL || '';
  if (!model || !model.toLowerCase().includes('opus')) {
    return NextResponse.json(
      {
        error:
          'Missing or invalid ANTHROPIC_MODEL. Set it to your Claude Opus 4.6 model identifier.',
      },
      { status: 500 },
    );
  }

  try {
    const claudeResult = await generateWithClaude(body, apiKey);
    if (!claudeResult) {
      throw new Error('Claude did not return a valid builder payload');
    }
    return NextResponse.json(claudeResult);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Claude Opus generation failed. Check ANTHROPIC_MODEL and account access.',
      },
      { status: 502 },
    );
  }
}
