/** Constructores de JSON-LD y utilidades SEO. */
import { SITE, CONTACT, SOCIAL } from './site';

const abs = (path: string) => new URL(path, SITE.url).href;

/** Organization + LocalBusiness (ProfessionalService) — global, se emite en todas las páginas. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LegalService'],
    '@id': `${SITE.url}/#organization`,
    name: SITE.legalName,
    alternateName: [SITE.name, 'CENIPSA Investigadores y Abogados'],
    description: SITE.description,
    url: `${SITE.url}/`,
    logo: abs('/images/logo-cenipsa.png'),
    image: abs('/images/og-default.jpg'),
    telephone: '+576016290498',
    email: CONTACT.emailInfo,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      addressRegion: CONTACT.address.region,
      addressCountry: CONTACT.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT.geo.lat,
      longitude: CONTACT.geo.lng,
    },
    areaServed: [
      { '@type': 'City', name: 'Bogotá' },
      { '@type': 'City', name: 'Medellín' },
      { '@type': 'City', name: 'Cali' },
      { '@type': 'Country', name: 'Colombia' },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+576016290498',
        contactType: 'customer service',
        availableLanguage: ['Spanish', 'English'],
        areaServed: 'CO',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+573174232502',
        contactType: 'customer service',
        contactOption: 'TollFree',
        availableLanguage: ['Spanish'],
        areaServed: 'CO',
      },
    ],
    sameAs: [SOCIAL.facebook, SOCIAL.instagram, SOCIAL.linkedin],
    memberOf: {
      '@type': 'Organization',
      name: 'Círculo de Afiliados — Cámara de Comercio de Bogotá',
    },
    priceRange: '$$',
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: `${SITE.url}/`,
    name: SITE.name,
    inLanguage: 'es-CO',
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string; type?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.type ?? opts.name,
    description: opts.description,
    url: abs(opts.path),
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: { '@type': 'Country', name: 'Colombia' },
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: abs(opts.path),
    mainEntityOfPage: abs(opts.path),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    inLanguage: 'es-CO',
    image: opts.image ? abs(opts.image) : abs('/images/og-default.jpg'),
    author: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** Recorta descripciones a longitud segura para meta description. */
export function metaDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}
