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
  '/seguimiento-de-infidelidad': '/infidelidad',
  '/galeria': '/nosotros',
  '/cosas-de-interes': '/blog',
  '/productos-servicios': '/servicios',
  '/equipos-gps': '/plataforma-gps',
  '/camaras-de-largo-alcance': '/servicios',
  '/microfonos': '/barrido-electronico',
  '/seguridad': '/servicios',
  '/busqueda': '/blog',
  '/formulario-prueba': '/contacto',
};
