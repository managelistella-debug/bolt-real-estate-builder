/** Named entities common in WordPress / rich-text excerpts */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  ndash: '–',
  mdash: '—',
};

function charFromCodePoint(n: number): string | null {
  if (!Number.isFinite(n) || n < 0 || n > 0x10ffff || (n >= 0xd800 && n <= 0xdfff)) return null;
  return String.fromCodePoint(n);
}

function decodeHtmlEntitiesOnce(input: string): string {
  let out = input
    .replace(/&#(\d{1,7});/g, (full, dec: string) => {
      const n = Number(dec);
      return charFromCodePoint(n) ?? full;
    })
    .replace(/&#x([0-9a-f]{1,6});/gi, (full, hex: string) => {
      const n = parseInt(hex, 16);
      return charFromCodePoint(n) ?? full;
    });
  out = out.replace(/&([a-z][a-z0-9]*);/gi, (full, name: string) => {
    const mapped = NAMED_ENTITIES[name.toLowerCase()];
    return mapped !== undefined ? mapped : full;
  });
  return out;
}

/**
 * Decode HTML entities for plain-text display (e.g. React text children).
 * WordPress excerpts often contain &#8217;, &nbsp;, etc.; those stay literal in JSX unless decoded.
 * Iterates to handle double-escaped sequences like &amp;#8217;.
 */
export function decodeHtmlEntities(input: string): string {
  if (!input) return '';
  let prev = '';
  let s = input;
  for (let i = 0; i < 8 && s !== prev; i++) {
    prev = s;
    s = decodeHtmlEntitiesOnce(s);
  }
  return s;
}
