/**
 * Única fuente de verdad de los redirects 301.
 * Consumido por astro.config.mjs (fallback meta-refresh), por la integración
 * que emite `_redirects` (Netlify/Cloudflare Pages) y por scripts/gen-vercel.mjs.
 *
 * Motivos documentados en ARCHITECTURE.md — consolidación de páginas duplicadas,
 * thin content y slugs de tema antiguo, preservando el equity de URLs con posicionamiento.
 */
export const redirects = {
  '/mision': '/nosotros',
  '/vision': '/nosotros',
  '/preguntas-frecuentes': '/faq',
  '/contacto-3': '/contacto',
  '/asesoria-juridica-2': '/asesoria-juridica',
  '/investigacion-corporativa-2': '/investigacion-corporativa',
  '/servicios-especiales-para-abogados-y-empresas-de-cartera': '/servicios-especiales',
  '/detectives-privados-bogota': '/detectives-privados-bogota-2',
  '/investigadores-privados-bogota': '/investigadores-privados-bogota-2',
  '/investigadores-privados': '/investigadores-privados-2',
  '/investigadores-privados-2-2': '/investigadores-privados-2',
  '/detectives-bogota': '/detectives-privados-bogota-2',
  // redirects ya activos en el WordPress en vivo — se replican tal cual
  '/detectives-privados-precios': '/detectives-privados-bogota-2',
  '/programa-espia': '/detectives-privados',
  '/como-espiar-un-celular': '/detectives-privados',
  // consolidación temática
  '/prueba-de-poligrafo': '/prueba-de-poligrafo-bogota',
  '/poligrafia': '/prueba-de-poligrafo-bogota',
  '/seguimiento-de-infidelidad': '/investigacion-personal',
  '/galeria': '/nosotros',
  '/cosas-de-interes': '/blog',
  '/productos-servicios': '/servicios',
  '/equipos-gps': '/plataforma-gps',
  '/camaras-de-largo-alcance': '/servicios',
  '/microfonos': '/barrido-electronico',
  '/seguridad': '/servicios',
  '/busqueda': '/blog',
  '/formulario-prueba': '/contacto',
  // retiradas a pedido de la firma (oct. 2026): no manejan infidelidad; los
  // contratantes son confidenciales (sin «casos de éxito»); sin servicios en línea
  '/infidelidad': '/investigacion-personal',
  '/casos-de-exito': '/como-trabajamos',
  '/servicios-en-linea': '/contacto',
  '/en/success-stories': '/en/how-we-work',
  '/en/online-services': '/en/contact',
  // pagos en línea retirados por seguridad (nov. 2026): pagos solo por transferencia a CENIPSA S.A.S.
  '/pagos-en-linea': '/contacto',
  '/en/payments': '/en/contact',
};

/**
 * Dominio jurídico antiguo (abogadosbogotaespecializados.com) integrado en este
 * sitio. Redirects 301 URL a URL hacia la sección equivalente — nunca todo a la
 * home. Requiere que el dominio apunte a este mismo hosting como alias (Netlify:
 * Domain management → domain alias); ver README.md § Migración de dominios.
 */
export const LEGAL_DOMAIN = 'abogadosbogotaespecializados.com';

export const legalDomainRedirects = {
  '/': '/asesoria-juridica/',
  '/blog': '/blog/',
  '/abogados-en-bogota': '/abogados-bogota/',
  '/firma-de-abogados-en-colombia': '/abogados-bogota/',
  '/firmas-de-abogados-en-bogota': '/abogados-bogota/',
  '/areas-de-practica': '/asesoria-juridica/',
  '/beneficios': '/garantias/',
  '/contact-us': '/contacto/',
  '/contacto': '/contacto/',
  '/la-firma': '/nosotros/',
  '/nosotros': '/nosotros/',
  '/faq': '/faq/',
  '/pagos-en-linea': '/contacto/',
  '/servicios-en-linea': '/contacto/',
  '/servicios-abogados': '/servicios-especiales/',
  '/servicios-investigativos': '/servicios/',
  '/terminos-y-condiciones': '/terminos-y-condiciones/',
  '/confidencialidad-y-privacidad': '/politica-de-tratamiento-de-datos-y-privacidad/',
  '/derecho-penal': '/derecho-penal/',
  '/abogado-penal-bogota': '/derecho-penal/',
  '/abogados-penalistas-bogota': '/derecho-penal/',
  '/derecho-de-familia': '/derecho-de-familia/',
  '/derecho-familiar': '/derecho-de-familia/',
  '/abogado-de-familia-bogota': '/derecho-de-familia/',
  '/abogados-divorcio-bogota': '/derecho-de-familia/',
  '/derecho-civil': '/derecho-civil/',
  '/abogados-civiles-bogota': '/derecho-civil/',
  '/derecho-laboral': '/derecho-laboral/',
  '/abogado-laboral-bogota': '/derecho-laboral/',
  '/derecho-comercial': '/derecho-comercial/',
  '/derecho-administrativo': '/derecho-administrativo/',
  '/derechoadministrativo': '/derecho-administrativo/',
  '/abogado-administrativo-bogota': '/derecho-administrativo/',
  '/derecho-constitucional': '/derecho-constitucional/',
  '/derechoconstitucional': '/derecho-constitucional/',
  '/derecho-de-propiedad-intelectual': '/derecho-de-propiedad-intelectual/',
  '/derecho-de-autor': '/derecho-de-propiedad-intelectual/',
  // área de clientes / login del WordPress antiguo (sin equivalente público)
  '/customer-area/*': '/contacto/',
  '/login': '/contacto/',
  '/login-2': '/contacto/',
  '/registrarse': '/contacto/',
  '/profile': '/contacto/',
  '/forgot-password': '/contacto/',
  // posts: /AAAA/MM/DD/slug/ → /blog/slug/ (los 44 artículos se migraron con el mismo slug)
  '/:year/:month/:day/:slug': '/blog/:slug/',
};

/** Destino para cualquier otra URL del dominio jurídico antiguo. */
export const LEGAL_DOMAIN_FALLBACK = '/asesoria-juridica/';

