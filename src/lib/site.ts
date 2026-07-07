/** Datos maestros del sitio — única fuente de verdad para marca y contacto. */

export const SITE = {
  url: 'https://www.inteligenciainvestigativa.com',
  name: 'Inteligencia Investigativa',
  legalName: 'CENIPSA S.A.S.',
  brand: 'CENIPSA — Investigadores y Abogados',
  tagline: 'Encontramos la verdad de los hechos investigados',
  description:
    'CENIPSA S.A.S. es una compañía con amplia trayectoria en investigación privada y derecho en Colombia: detectives privados, abogados, poligrafía, criminalística y rastreo satelital GPS en Bogotá.',
  locale: 'es_CO',
  lang: 'es',
} as const;

export const CONTACT = {
  address: {
    street: 'Carrera 62 # 103 – 44, Edificio Torre del Reloj, Oficina 403, Sede Norte',
    city: 'Bogotá',
    region: 'Cundinamarca',
    country: 'CO',
    countryName: 'Colombia',
  },
  pbx: '+57 (601) 6290498',
  pbxHref: 'tel:+576016290498',
  whatsapp: '317 4232502',
  whatsappIntl: '+573174232502',
  whatsappHref:
    'https://api.whatsapp.com/send?phone=573174232502&text=Hola%2C%20quiero%20una%20asesor%C3%ADa%20con%20CENIPSA',
  emailInfo: 'info@inteligenciainvestigativa.com',
  emailGerencia: 'gerencia@inteligenciainvestigativa.com',
  /** Coordenadas aproximadas de la sede (Torre del Reloj, Bogotá) */
  geo: { lat: 4.6907, lng: -74.0774 },
} as const;

export const SOCIAL = {
  facebook: 'https://www.facebook.com/investigadoresyabogados0/',
  instagram: 'https://www.instagram.com/investigadoresyabogados/',
  linkedin: 'https://www.linkedin.com/in/investigadoresyabogados/',
} as const;

export const THIRD_PARTY = {
  /** IDs heredados del sitio WordPress en producción. Vaciar para desactivar. */
  gtmId: import.meta.env.PUBLIC_GTM_ID ?? 'GTM-W8N2BTC',
  tawkId: import.meta.env.PUBLIC_TAWK_ID ?? '5f5fbb92f0e7167d0010402a/default',
  /** Endpoint del formulario de contacto (p. ej. Formspree). Vacío ⇒ fallback mailto. */
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT ?? '',
} as const;

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

/** Navegación principal (ES). Los slugs provienen del sitio original — no cambiar. */
export const NAV_ES: NavLink[] = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Nosotros',
    href: '/nosotros/',
    children: [
      { label: 'Quiénes somos', href: '/nosotros/' },
      { label: 'Equipo interdisciplinar', href: '/equipo-interdisciplinar/' },
      { label: 'Garantías', href: '/garantias/' },
      { label: 'Casos de éxito', href: '/casos-de-exito/' },
    ],
  },
  {
    label: 'Servicios',
    href: '/servicios/',
    children: [
      { label: 'Investigación personal', href: '/investigacion-personal/' },
      { label: 'Investigación corporativa', href: '/investigacion-corporativa/' },
      { label: 'Asesoría y representación jurídica', href: '/asesoria-juridica/' },
      { label: 'Criminalística', href: '/criminalistica/' },
      { label: 'GPS rastreo satelital', href: '/plataforma-gps/' },
      { label: 'Poligrafía', href: '/examen-de-poligrafia/' },
      { label: 'Barrido electrónico', href: '/barrido-electronico/' },
      { label: 'Servicios para abogados', href: '/servicios-especiales/' },
      { label: 'Servicios en línea', href: '/servicios-en-linea/' },
    ],
  },
  { label: 'Blog', href: '/blog/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Pagos en línea', href: '/pagos-en-linea/' },
  { label: 'Contáctenos', href: '/contacto/' },
];

/** Navegación EN — espeja EXACTAMENTE la estructura de NAV_ES (mismo nº de ítems). */
export const NAV_EN: NavLink[] = [
  { label: 'Home', href: '/en/' },
  {
    label: 'About us',
    href: '/en/about-us/',
    children: [
      { label: 'Who we are', href: '/en/about-us/' },
      { label: 'Interdisciplinary team', href: '/en/interdisciplinary-team/' },
      { label: 'Guarantees', href: '/en/guarantees/' },
      { label: 'Success stories', href: '/en/success-stories/' },
    ],
  },
  {
    label: 'Services',
    href: '/en/services/',
    children: [
      { label: 'Personal investigation', href: '/en/personal-investigation/' },
      { label: 'Corporate investigation', href: '/en/corporate-investigation/' },
      { label: 'Legal advice & representation', href: '/en/legal-advice/' },
      { label: 'Criminalistics', href: '/en/criminalistics/' },
      { label: 'GPS satellite tracking', href: '/en/gps-tracking/' },
      { label: 'Polygraph testing', href: '/en/polygraph/' },
      { label: 'Electronic sweep', href: '/en/electronic-sweep/' },
      { label: 'Services for lawyers', href: '/en/services-for-lawyers/' },
      { label: 'Online services', href: '/en/online-services/' },
    ],
  },
  { label: 'Blog', href: '/en/blog/' },
  { label: 'FAQ', href: '/en/faq/' },
  { label: 'Payments', href: '/en/payments/' },
  { label: 'Contact', href: '/en/contact/' },
];

/** Pares hreflang ES ↔ EN (páginas con versión en inglés). */
export const I18N_PAIRS: Record<string, string> = {
  '/': '/en/',
  '/nosotros/': '/en/about-us/',
  '/servicios/': '/en/services/',
  '/contacto/': '/en/contact/',
  '/faq/': '/en/faq/',
  '/pagos-en-linea/': '/en/payments/',
  '/blog/': '/en/blog/',
  '/investigacion-personal/': '/en/personal-investigation/',
  '/investigacion-corporativa/': '/en/corporate-investigation/',
  '/asesoria-juridica/': '/en/legal-advice/',
  '/criminalistica/': '/en/criminalistics/',
  '/plataforma-gps/': '/en/gps-tracking/',
  '/examen-de-poligrafia/': '/en/polygraph/',
  '/barrido-electronico/': '/en/electronic-sweep/',
  '/servicios-especiales/': '/en/services-for-lawyers/',
  '/servicios-en-linea/': '/en/online-services/',
  '/equipo-interdisciplinar/': '/en/interdisciplinary-team/',
  '/garantias/': '/en/guarantees/',
  '/casos-de-exito/': '/en/success-stories/',
};

/** Devuelve el par de idioma de una ruta (en cualquier dirección). */
export function altLocaleFor(path: string): string | undefined {
  if (path in I18N_PAIRS) return I18N_PAIRS[path];
  return Object.entries(I18N_PAIRS).find(([, en]) => en === path)?.[0];
}

/** Enlaces de interés (landing pages SEO) — footer. Slugs exactos del sitio original. */
export const FOOTER_SEO_LINKS: NavLink[] = [
  { label: 'Detectives privados Bogotá', href: '/detectives-privados-bogota-2/' },
  { label: 'Investigadores privados Bogotá', href: '/investigadores-privados-bogota-2/' },
  { label: 'Detectives privados en Medellín', href: '/detectives-privados-en-medellin/' },
  { label: 'GPS Bogotá', href: '/gps-bogota/' },
  { label: 'Detectives privados en Cali', href: '/detectives-privados-en-cali/' },
  { label: 'GPS para carros Bogotá', href: '/gps-para-carros-bogota/' },
  { label: 'Detectives privados Colombia', href: '/detectives-privados-colombia/' },
  { label: 'Prueba de polígrafo Bogotá', href: '/prueba-de-poligrafo-bogota/' },
  { label: 'Investigador privado Colombia', href: '/investigador-privado-colombia/' },
  { label: 'Detectives privados Bogotá precios', href: '/detectives-privados-bogota-precios/' },
  { label: 'Detectives privados', href: '/detectives-privados/' },
  { label: 'Abogados Bogotá', href: '/abogados-bogota/' },
  { label: 'Investigadores privados', href: '/investigadores-privados-2/' },
  { label: 'Abogados sucesiones Bogotá', href: '/abogados-sucesiones-bogota/' },
  { label: 'Polígrafo laboral', href: '/poligrafo-laboral/' },
];

export const FOOTER_SERVICES: NavLink[] = [
  { label: 'Investigación personal', href: '/investigacion-personal/' },
  { label: 'Investigación corporativa', href: '/investigacion-corporativa/' },
  { label: 'Asesoría y representación jurídica', href: '/asesoria-juridica/' },
  { label: 'Criminalística', href: '/criminalistica/' },
  { label: 'GPS rastreo satelital', href: '/plataforma-gps/' },
  { label: 'Servicios en línea', href: '/servicios-en-linea/' },
  { label: 'Pagos en línea', href: '/pagos-en-linea/' },
  { label: 'Servicios especiales para abogados', href: '/servicios-especiales/' },
  { label: 'Barrido electrónico', href: '/barrido-electronico/' },
];
