import { getCustomCSS, getHeaderHTML, getFooterHTML, getClientJS } from './shared';
import { homePage } from './pages/home';
import { aboutPage } from './pages/about';
import { buyingPage } from './pages/buying';
import { sellingPage } from './pages/selling';
import { estatesPage, activeListingsPage, soldListingsPage } from './pages/listings';
import { blogPage } from './pages/blog';
import { contactPage } from './pages/contact';
import { privacyPage } from './pages/privacy';
import { getCmsBridgeScript } from '../cms-bridge';

const FONT_PATH = '/templates/country/fonts';

interface PageDef {
  path: string;
  html: string;
}

function getPages(): PageDef[] {
  return [
    { path: '/', html: homePage() },
    { path: '/about', html: aboutPage() },
    { path: '/buying', html: buyingPage() },
    { path: '/selling', html: sellingPage() },
    { path: '/estates', html: estatesPage() },
    { path: '/listings/active', html: activeListingsPage() },
    { path: '/listings/sold', html: soldListingsPage() },
    { path: '/blog', html: blogPage() },
    { path: '/contact', html: contactPage() },
    { path: '/privacy', html: privacyPage() },
  ];
}

export function getFullSiteHtml(initialPath: string, basePath: string, tenantId?: string): string {
  const pages = getPages();

  const pagesSections = pages
    .map((p) => `<div data-page="${p.path}" ${p.path === initialPath ? 'class="active"' : ''}>${p.html}</div>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en" ${tenantId ? `data-tenant-id="${tenantId}"` : ''}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aspen Muraski Real Estate</title>
  <meta name="description" content="Specializing in Sundre and the surrounding Mountain View County region, Aspen Muraski brings deep local expertise to every estate, ranch, and acreage transaction." />
  <link rel="preconnect" href="https://cdn.tailwindcss.com" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'dark-green': '#09312a',
            'darker-green': '#113d35',
            'gold': '#daaf3a',
            'gold-light': '#ffebaf',
            'gold-dark': '#9d7500'
          },
          fontFamily: {
            heading: ["'Reckless Neue'", "'Georgia'", "serif"],
            body: ["'Lato'", "sans-serif"]
          }
        }
      }
    };
  </script>
  <link rel="preload" href="${FONT_PATH}/RecklessNeue-Regular.ttf" as="font" type="font/ttf" crossorigin />
  <link rel="preload" href="${FONT_PATH}/Lato-Regular.ttf" as="font" type="font/ttf" crossorigin />
  <style>${getCustomCSS()}</style>
</head>
<body class="overflow-x-clip">
  ${getHeaderHTML()}
  <main>
    ${pagesSections}
  </main>
  ${getFooterHTML()}
  <script>
    window.__INITIAL_PATH__ = ${JSON.stringify(initialPath)};
    window.__HOSTED_BASE = ${JSON.stringify(basePath)};
  </script>
  <script>${getClientJS()}</script>
  <script>${getCmsBridgeScript()}</script>
</body>
</html>`;
}

export function getPage(requestPath: string, basePath: string, tenantId?: string): string {
  const cleanPath = requestPath.replace(basePath, '') || '/';
  const normalizedPath = cleanPath === '' ? '/' : cleanPath;
  return getFullSiteHtml(normalizedPath, basePath, tenantId);
}

export const ASPEN_COUNTRY_PAGES = [
  '/', '/about', '/buying', '/selling', '/estates',
  '/listings/active', '/listings/sold', '/blog', '/contact', '/privacy',
];
