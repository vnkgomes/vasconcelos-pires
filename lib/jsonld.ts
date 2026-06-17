import type { Partner } from '@/content/partners';
import type { ParecerEntry } from '@/content/pareceres';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vasconcellospires.com.br';

export function legalServiceLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Vasconcelos & Pires Advogados Associados',
    url: BASE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Brigadeiro Faria Lima, 4221, 19º andar',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      postalCode: '04538-133',
      addressCountry: 'BR',
    },
    telephone: '+55-11-3147-8200',
    foundingDate: '1998',
    areaServed: 'BR',
  };
}

export function personLd(p: Partner) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    jobTitle: p.role,
    knowsAbout: p.practice,
    url: `${BASE}/equipe/${p.slug}`,
    affiliation: { '@type': 'LegalService', name: 'Vasconcelos & Pires Advogados Associados' },
  };
}

export function articleLd(p: ParecerEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    datePublished: p.date,
    author: { '@type': 'Person', name: p.authorName },
    publisher: { '@type': 'LegalService', name: 'Vasconcelos & Pires Advogados Associados' },
    url: `${BASE}/pareceres/${p.slug}`,
  };
}

// Characters that must be escaped when embedding JSON inside an inline <script>:
// <, >, & (HTML-significant) and U+2028 / U+2029 (JS line terminators that JSON
// does not escape but the JS parser treats as line breaks inside strings).
const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);
const SCRIPT_ESCAPE_RE = new RegExp('[<>&' + LS + PS + ']', 'g');
const SCRIPT_ESCAPE: Record<string, string> = {
  '<': '\\u003C',
  '>': '\\u003E',
  '&': '\\u0026',
  [LS]: '\\u2028',
  [PS]: '\\u2029',
};

/**
 * Serialize an object to JSON safe for embedding inside an inline `<script>` tag.
 * Plain `JSON.stringify` does not escape `<`, `>`, `&`, or U+2028/U+2029 — so a
 * payload containing `</script>` (or those JS-only line terminators) would break
 * out of the tag. All five substitutions remain valid JSON.
 */
export function ldScript<T extends object>(data: T) {
  return JSON.stringify(data).replace(SCRIPT_ESCAPE_RE, (c) => SCRIPT_ESCAPE[c]);
}
