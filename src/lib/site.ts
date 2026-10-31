/** Datos maestros del sitio — única fuente de verdad para marca y contacto. */

export const SITE = {
  url: 'https://www.inteligenciainvestigativa.com',
  name: 'Inteligencia Investigativa',
  legalName: 'CENIPSA S.A.S.',
  /** Jerarquía de marca: marca CENIPSA · descriptor · eslogan. */
  brand: 'CENIPSA',
  descriptor: 'Inteligencia investigativa y jurídica',
  descriptorEn: 'Investigative and legal intelligence',
  tagline: 'Investigamos la verdad. Defendemos sus derechos.',
  taglineEn: 'We investigate the truth. We defend your rights.',
  nit: '900.603.276-9',
  description:
    'CENIPSA S.A.S. es una firma de inteligencia forense e investigación jurídica en Colombia: convertimos hechos complejos en evidencia útil y decisiones jurídicas claras para empresas y personas.',
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
  /** Mensaje precargado corporativo (botón flotante y CTAs). */
  whatsappHref:
    'https://api.whatsapp.com/send?phone=573174232502&text=Buen%20d%C3%ADa%2C%20quisiera%20solicitar%20una%20valoraci%C3%B3n%20confidencial%20con%20CENIPSA.',
  whatsappHrefEn:
    'https://api.whatsapp.com/send?phone=573174232502&text=Good%20day%2C%20I%20would%20like%20to%20request%20a%20confidential%20assessment%20with%20CENIPSA.',
  /** WhatsApp con mensaje prellenado para consultas jurídicas (acompañamiento legal). */
  whatsappLegalHref:
    'https://api.whatsapp.com/send?phone=573174232502&text=Hola%2C%20quiero%20acompa%C3%B1amiento%20jur%C3%ADdico%20para%20mi%20caso%20con%20CENIPSA',
  whatsappLegalHrefEn:
    'https://api.whatsapp.com/send?phone=573174232502&text=Hello%2C%20I%20need%20legal%20support%20for%20my%20case%20with%20CENIPSA',
  /**
   * PENDIENTE: la firma pidió migrar a correos del dominio CENIPSA. Cuando los
   * buzones estén creados y confirmados, cambiar SOLO estas dos líneas.
   */
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
  /** Clave de sitio de reCAPTCHA v3 (invisible). Vacío ⇒ solo honeypot. */
  recaptchaSiteKey: import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY ?? '',
} as const;

/**
 * Chat en vivo de tawk.to: widget NATIVO de Tawk (su propio botón, abajo a la
 * derecha; WhatsApp queda abajo a la izquierda). Funciona de forma fiable
 * porque el sitio ya no usa navegación SPA (<ClientRouter />), que era lo que
 * destruía el widget en cada cambio de página. `false` = no se carga Tawk.
 * Idioma, colores, horarios y el chatbot se configuran en el panel de Tawk.
 */
export const CHAT_ENABLED = true;

/**
 * Selectores del formulario de valoración confidencial: tipo de requerimiento
 * (B2B / B2C) y fase requerida (los tres pilares). Datos mínimos a propósito.
 */
export const FORM_OPTIONS = {
  es: {
    type: ['Empresarial', 'Personal'],
    phase: ['Prevención', 'Investigación', 'Asesoría legal', 'No estoy seguro'],
  },
  en: {
    type: ['Business', 'Personal'],
    phase: ['Prevention', 'Investigation', 'Legal advice', 'Not sure'],
  },
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
      { label: 'Quiénes Somos', href: '/nosotros/' },
      { label: 'Equipo Interdisciplinar', href: '/equipo-interdisciplinar/' },
      { label: 'Garantías', href: '/garantias/' },
      { label: 'Cómo Trabajamos', href: '/como-trabajamos/' },
    ],
  },
  {
    label: 'Servicios',
    href: '/servicios/',
    children: [
      { label: 'Asesoría Jurídica y Litigio', href: '/asesoria-juridica/' },
      { label: 'Investigación Corporativa y Fraude', href: '/investigacion-corporativa/' },
      { label: 'Investigación Personal, Familiar y Patrimonial', href: '/investigacion-personal/' },
      { label: 'Investigación Técnico-Documental y Ubicación de Partes', href: '/ubicacion-de-personas-para-notificacion-judicial/' },
      { label: 'Criminalística y Ciencias Forenses', href: '/criminalistica/' },
      { label: 'Auditoría Forense Contable y Financiera', href: '/analisis-ejecutivo-de-informacion-financiera-bienes-raices-y-vehiculos/' },
      { label: 'Ciberseguridad e Informática Forense', href: '/ciberseguridad-e-informatica-forense/' },
      { label: 'Barrido Electrónico (TSCM)', href: '/barrido-electronico/' },
      { label: 'Monitoreo Satelital y Control de Activos', href: '/plataforma-gps/' },
      { label: 'Estudios de Seguridad y Confiabilidad', href: '/examen-de-poligrafia/' },
      { label: 'Servicios para Firmas de Abogados y Departamentos Jurídicos', href: '/servicios-especiales/' },
    ],
  },
  { label: 'Blog', href: '/blog/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contáctenos', href: '/contacto/' },
];

/** Navegación EN — espeja EXACTAMENTE la estructura de NAV_ES (mismo nº de ítems). */
export const NAV_EN: NavLink[] = [
  { label: 'Home', href: '/en/' },
  {
    label: 'About Us',
    href: '/en/about-us/',
    children: [
      { label: 'Who We Are', href: '/en/about-us/' },
      { label: 'Interdisciplinary Team', href: '/en/interdisciplinary-team/' },
      { label: 'Guarantees', href: '/en/guarantees/' },
      { label: 'How We Work', href: '/en/how-we-work/' },
    ],
  },
  {
    label: 'Services',
    href: '/en/services/',
    children: [
      { label: 'Legal Advice & Litigation', href: '/en/legal-advice/' },
      { label: 'Corporate & Fraud Investigation', href: '/en/corporate-investigation/' },
      { label: 'Personal, Family & Asset Investigation', href: '/en/personal-investigation/' },
      { label: 'Locating Parties and Heirs', href: '/en/locating-parties-and-heirs/' },
      { label: 'Criminalistics & Forensic Science', href: '/en/criminalistics/' },
      { label: 'Forensic Accounting Audit', href: '/en/forensic-accounting/' },
      { label: 'Cybersecurity & Digital Forensics', href: '/en/cybersecurity-digital-forensics/' },
      { label: 'Electronic Sweep (TSCM)', href: '/en/electronic-sweep/' },
      { label: 'Satellite Monitoring & Asset Control', href: '/en/gps-tracking/' },
      { label: 'Security & Reliability Studies', href: '/en/polygraph/' },
      { label: 'Services for Law Firms and Legal Departments', href: '/en/services-for-lawyers/' },
    ],
  },
  { label: 'Blog', href: '/en/blog/' },
  { label: 'FAQ', href: '/en/faq/' },
  { label: 'Contact', href: '/en/contact/' },
];

/** Pares hreflang ES ↔ EN (páginas con versión en inglés). */
export const I18N_PAIRS: Record<string, string> = {
  '/': '/en/',
  '/nosotros/': '/en/about-us/',
  '/servicios/': '/en/services/',
  '/contacto/': '/en/contact/',
  '/faq/': '/en/faq/',
  '/blog/': '/en/blog/',
  '/investigacion-personal/': '/en/personal-investigation/',
  '/investigacion-corporativa/': '/en/corporate-investigation/',
  '/asesoria-juridica/': '/en/legal-advice/',
  '/criminalistica/': '/en/criminalistics/',
  '/ubicacion-de-personas-para-notificacion-judicial/': '/en/locating-parties-and-heirs/',
  '/analisis-ejecutivo-de-informacion-financiera-bienes-raices-y-vehiculos/': '/en/forensic-accounting/',
  '/ciberseguridad-e-informatica-forense/': '/en/cybersecurity-digital-forensics/',
  '/plataforma-gps/': '/en/gps-tracking/',
  '/examen-de-poligrafia/': '/en/polygraph/',
  '/barrido-electronico/': '/en/electronic-sweep/',
  '/servicios-especiales/': '/en/services-for-lawyers/',
  '/equipo-interdisciplinar/': '/en/interdisciplinary-team/',
  '/garantias/': '/en/guarantees/',
  '/como-trabajamos/': '/en/how-we-work/',
  '/mapa-del-sitio/': '/en/sitemap/',
};

/** Devuelve el par de idioma de una ruta (en cualquier dirección). */
export function altLocaleFor(path: string): string | undefined {
  if (path in I18N_PAIRS) return I18N_PAIRS[path];
  return Object.entries(I18N_PAIRS).find(([, en]) => en === path)?.[0];
}

/*
 * El antiguo bloque de «enlaces de interés» del footer (15 landings por keyword)
 * se retiró a pedido de la firma: se percibía como granja de enlaces. Las
 * landings siguen publicadas y en el sitemap; se enlazan desde el contenido.
 */
