/**
 * Arquitectura de servicios en tres pilares (Prevenir · Investigar · Defender),
 * según las recomendaciones de la firma (informe de desarrollo web y reunión con
 * la gerencia). Alimenta la home, /servicios/ y el footer. Los enlaces apuntan a
 * las URLs existentes — los slugs con posicionamiento NO cambian, solo el
 * vocabulario con que se presentan.
 */
import type { NavLink } from './site';

export interface Pillar {
  id: 'prevenir' | 'investigar' | 'defender';
  name: string;
  /** Frase corta bajo el nombre del pilar. */
  tagline: string;
  icon: string;
  items: NavLink[];
}

export const PILLARS_ES: Pillar[] = [
  {
    id: 'prevenir',
    name: 'Prevenir',
    tagline: 'Anticipamos riesgos antes de que se conviertan en pérdidas o litigios.',
    icon: 'shield',
    items: [
      { label: 'Debida diligencia de socios y proveedores', href: '/investigacion-corporativa/' },
      { label: 'Pruebas de confiabilidad laboral y poligrafía', href: '/examen-de-poligrafia/' },
      { label: 'Análisis técnico de instalaciones y barridos electrónicos', href: '/barrido-electronico/' },
      { label: 'Sistemas de monitoreo técnico y trazabilidad de activos', href: '/plataforma-gps/' },
      { label: 'Estudios de seguridad y gestión del riesgo corporativo', href: '/investigacion-corporativa/' },
    ],
  },
  {
    id: 'investigar',
    name: 'Investigar',
    tagline: 'Convertimos hechos complejos en evidencia útil, lícita y verificable.',
    icon: 'fingerprint',
    items: [
      { label: 'Investigación de fraude corporativo', href: '/investigacion-corporativa/' },
      { label: 'Investigación personal, familiar y verificación patrimonial', href: '/investigacion-personal/' },
      { label: 'Auditoría forense financiera y patrimonial', href: '/analisis-ejecutivo-de-informacion-financiera-bienes-raices-y-vehiculos/' },
      { label: 'Búsqueda y localización de personas y activos', href: '/ubicacion-de-personas-para-notificacion-judicial/' },
      { label: 'Criminalística, peritaje y trazabilidad probatoria', href: '/criminalistica/' },
    ],
  },
  {
    id: 'defender',
    name: 'Defender',
    tagline: 'Llevamos la evidencia a decisiones jurídicas claras y a su defensa.',
    icon: 'scale',
    items: [
      { label: 'Asesoría prejurídica y representación en litigios', href: '/asesoria-juridica/' },
      { label: 'Derecho penal y sancionatorio', href: '/derecho-penal/' },
      { label: 'Derecho de familia y sucesiones', href: '/derecho-de-familia/' },
      { label: 'Derecho laboral y seguridad social', href: '/derecho-laboral/' },
      { label: 'Derecho comercial y societario', href: '/derecho-comercial/' },
      { label: 'Valoración probatoria y servicios para abogados', href: '/servicios-especiales/' },
    ],
  },
];

export const PILLARS_EN: Pillar[] = [
  {
    id: 'prevenir',
    name: 'Prevent',
    tagline: 'We anticipate risks before they turn into losses or litigation.',
    icon: 'shield',
    items: [
      { label: 'Partner and supplier due diligence', href: '/en/corporate-investigation/' },
      { label: 'Workplace reliability testing and polygraph', href: '/en/polygraph/' },
      { label: 'Technical site analysis and electronic sweeps', href: '/en/electronic-sweep/' },
      { label: 'Technical monitoring and asset traceability', href: '/en/gps-tracking/' },
    ],
  },
  {
    id: 'investigar',
    name: 'Investigate',
    tagline: 'We turn complex facts into useful, lawful and verifiable evidence.',
    icon: 'fingerprint',
    items: [
      { label: 'Corporate fraud investigation', href: '/en/corporate-investigation/' },
      { label: 'Personal, family and asset verification', href: '/en/personal-investigation/' },
      { label: 'Criminalistics, expert reports and evidence traceability', href: '/en/criminalistics/' },
      { label: 'Locating people and assets', href: '/en/services-for-lawyers/' },
    ],
  },
  {
    id: 'defender',
    name: 'Defend',
    tagline: 'We take the evidence to clear legal decisions and to your defense.',
    icon: 'scale',
    items: [
      { label: 'Pre-litigation advice and legal representation', href: '/en/legal-advice/' },
      { label: 'Evidence assessment and services for lawyers', href: '/en/services-for-lawyers/' },
      { label: 'Online legal services', href: '/en/online-services/' },
    ],
  },
];

/** Áreas del derecho (pilar Defender) — contenido integrado de abogadosbogotaespecializados.com. */
export const LEGAL_AREAS_ES: (NavLink & { text: string })[] = [
  { label: 'Derecho penal y sancionatorio', href: '/derecho-penal/', text: 'Defensa técnica, representación de víctimas, procesos disciplinarios.' },
  { label: 'Derecho de familia', href: '/derecho-de-familia/', text: 'Divorcio, custodia, alimentos, filiación y sucesiones.' },
  { label: 'Derecho civil', href: '/derecho-civil/', text: 'Contratos, procesos ejecutivos, responsabilidad civil y cobro.' },
  { label: 'Derecho laboral', href: '/derecho-laboral/', text: 'Empresas y trabajadores: disciplinarios, despidos, acoso, pensiones.' },
  { label: 'Derecho comercial y societario', href: '/derecho-comercial/', text: 'Sociedades, contratos mercantiles, insolvencia y litigios.' },
  { label: 'Derecho administrativo', href: '/derecho-administrativo/', text: 'Demandas contra el Estado, sancionatorios, contratación pública.' },
  { label: 'Derecho constitucional', href: '/derecho-constitucional/', text: 'Tutela, petición, hábeas corpus y hábeas data.' },
  { label: 'Propiedad intelectual', href: '/derecho-de-propiedad-intelectual/', text: 'Marcas, patentes, derechos de autor y licencias.' },
];

/** Segmentos de cliente (bifurcación B2B / B2C + abogados). */
export const SEGMENTS_ES = [
  {
    id: 'empresas',
    title: 'Empresas',
    text: 'Debida diligencia, fraude interno, confiabilidad del personal, seguridad de la información y defensa jurídica corporativa.',
    links: [
      { label: 'Investigación corporativa', href: '/investigacion-corporativa/' },
      { label: 'Poligrafía laboral', href: '/poligrafo-laboral/' },
      { label: 'Barridos electrónicos', href: '/barrido-electronico/' },
      { label: 'Derecho comercial y laboral', href: '/derecho-comercial/' },
    ],
  },
  {
    id: 'personas',
    title: 'Personas y familias',
    text: 'Verificación de hechos personales y patrimoniales con total reserva, y acompañamiento legal en familia, sucesiones y asuntos penales.',
    links: [
      { label: 'Investigación personal y patrimonial', href: '/investigacion-personal/' },
      { label: 'Derecho de familia', href: '/derecho-de-familia/' },
      { label: 'Derecho penal', href: '/derecho-penal/' },
      { label: 'Servicios en línea', href: '/servicios-en-linea/' },
    ],
  },
  {
    id: 'abogados',
    title: 'Abogados y firmas',
    text: 'Soporte probatorio para su litigio: ubicación de personas, investigación patrimonial, peritaje y valoración de la prueba.',
    links: [
      { label: 'Servicios para abogados', href: '/servicios-especiales/' },
      { label: 'Notificación judicial', href: '/ubicacion-de-personas-para-notificacion-judicial/' },
      { label: 'Medidas cautelares', href: '/investigacion-patrimonial-para-medidas-cautelares/' },
      { label: 'Criminalística y peritaje', href: '/criminalistica/' },
    ],
  },
];

/** Proceso de atención (4 pasos) — texto acordado con la firma. */
export const PROCESS_ES = [
  { n: '01', title: 'Recibimos su solicitud', text: 'Por un canal confidencial, sin pedirle documentos ni datos sensibles en el primer contacto.' },
  { n: '02', title: 'Verificamos el tipo de caso', text: 'Identificamos si requiere prevención, investigación, asesoría legal o una combinación.' },
  { n: '03', title: 'Valoración inicial', text: 'Un investigador y un abogado analizan los hechos, la viabilidad y los riesgos.' },
  { n: '04', title: 'Propuesta de alcance', text: 'Le proponemos alcance, tiempos y honorarios antes de iniciar cualquier actuación.' },
];

export const PROCESS_EN = [
  { n: '01', title: 'We receive your request', text: 'Through a confidential channel, without asking for documents or sensitive data at first contact.' },
  { n: '02', title: 'We identify the type of case', text: 'Whether it calls for prevention, investigation, legal advice or a combination.' },
  { n: '03', title: 'Initial assessment', text: 'An investigator and a lawyer review the facts, feasibility and risks.' },
  { n: '04', title: 'Scope proposal', text: 'We propose scope, timeline and fees before any action begins.' },
];
