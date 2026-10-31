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
      { label: 'Debida Diligencia de Socios y Proveedores', href: '/investigacion-corporativa/' },
      { label: 'Estudios de Seguridad y Pruebas de Confiabilidad', href: '/examen-de-poligrafia/' },
      { label: 'Barrido Electrónico y Contramedidas (TSCM)', href: '/barrido-electronico/' },
      { label: 'Ciberseguridad y Diagnóstico de Vulnerabilidades', href: '/ciberseguridad-e-informatica-forense/' },
      { label: 'Monitoreo Satelital y Control de Activos', href: '/plataforma-gps/' },
    ],
  },
  {
    id: 'investigar',
    name: 'Investigar',
    tagline: 'Convertimos hechos complejos en evidencia útil, lícita y verificable.',
    icon: 'fingerprint',
    items: [
      { label: 'Investigación Corporativa y Prevención del Fraude', href: '/investigacion-corporativa/' },
      { label: 'Investigación Personal, Familiar y Patrimonial', href: '/investigacion-personal/' },
      { label: 'Auditoría Forense Contable y Financiera', href: '/analisis-ejecutivo-de-informacion-financiera-bienes-raices-y-vehiculos/' },
      { label: 'Informática Forense y Evidencia Digital', href: '/ciberseguridad-e-informatica-forense/' },
      { label: 'Ubicación de Partes Procesales y Herederos', href: '/ubicacion-de-personas-para-notificacion-judicial/' },
      { label: 'Criminalística y Ciencias Forenses', href: '/criminalistica/' },
    ],
  },
  {
    id: 'defender',
    name: 'Defender',
    tagline: 'Llevamos la evidencia a decisiones jurídicas claras y a su defensa.',
    icon: 'scale',
    items: [
      { label: 'Asesoría Prejurídica y Representación en Litigios', href: '/asesoria-juridica/' },
      { label: 'Derecho Penal y Sancionatorio', href: '/derecho-penal/' },
      { label: 'Derecho de Familia y Sucesiones', href: '/derecho-de-familia/' },
      { label: 'Derecho Laboral y Seguridad Social', href: '/derecho-laboral/' },
      { label: 'Derecho Comercial y Societario', href: '/derecho-comercial/' },
      { label: 'Servicios para Firmas de Abogados y Departamentos Jurídicos', href: '/servicios-especiales/' },
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
      { label: 'Partner and Supplier Due Diligence', href: '/en/corporate-investigation/' },
      { label: 'Workplace Reliability Testing and Polygraph', href: '/en/polygraph/' },
      { label: 'Technical Site Analysis and Electronic Sweeps', href: '/en/electronic-sweep/' },
      { label: 'Satellite Monitoring and Asset Control', href: '/en/gps-tracking/' },
      { label: 'Cybersecurity and Vulnerability Assessment', href: '/en/cybersecurity-digital-forensics/' },
    ],
  },
  {
    id: 'investigar',
    name: 'Investigate',
    tagline: 'We turn complex facts into useful, lawful and verifiable evidence.',
    icon: 'fingerprint',
    items: [
      { label: 'Corporate Fraud Investigation', href: '/en/corporate-investigation/' },
      { label: 'Forensic Accounting Audit', href: '/en/forensic-accounting/' },
      { label: 'Personal, Family and Asset Verification', href: '/en/personal-investigation/' },
      { label: 'Criminalistics, Expert Reports and Evidence Traceability', href: '/en/criminalistics/' },
      { label: 'Locating People and Assets', href: '/en/services-for-lawyers/' },
    ],
  },
  {
    id: 'defender',
    name: 'Defend',
    tagline: 'We take the evidence to clear legal decisions and to your defense.',
    icon: 'scale',
    items: [
      { label: 'Pre-Litigation Advice and Legal Representation', href: '/en/legal-advice/' },
      { label: 'Services for Law Firms and Legal Departments', href: '/en/services-for-lawyers/' },
    ],
  },
];

/** Áreas del derecho (pilar Defender) — contenido integrado de abogadosbogotaespecializados.com. */
export const LEGAL_AREAS_ES: (NavLink & { text: string; icon: string })[] = [
  { label: 'Derecho Penal y Sancionatorio', href: '/derecho-penal/', text: 'Defensa técnica, representación de víctimas, procesos disciplinarios.', icon: 'gavel' },
  { label: 'Derecho de Familia', href: '/derecho-de-familia/', text: 'Divorcio, custodia, alimentos, filiación y sucesiones.', icon: 'family' },
  { label: 'Derecho Civil', href: '/derecho-civil/', text: 'Contratos, procesos ejecutivos, responsabilidad civil y cobro.', icon: 'contract' },
  { label: 'Derecho Laboral', href: '/derecho-laboral/', text: 'Empresas y trabajadores: disciplinarios, despidos, acoso, pensiones.', icon: 'hardhat' },
  { label: 'Derecho Comercial y Societario', href: '/derecho-comercial/', text: 'Sociedades, contratos mercantiles, insolvencia y litigios.', icon: 'store' },
  { label: 'Derecho Administrativo', href: '/derecho-administrativo/', text: 'Demandas contra el Estado, sancionatorios, contratación pública.', icon: 'columns' },
  { label: 'Derecho Constitucional', href: '/derecho-constitucional/', text: 'Tutela, petición, hábeas corpus y hábeas data.', icon: 'book' },
  { label: 'Propiedad Intelectual', href: '/derecho-de-propiedad-intelectual/', text: 'Marcas, patentes, derechos de autor y licencias.', icon: 'bulb' },
];

/** Segmentos de cliente (bifurcación B2B / B2C + abogados). */
export const SEGMENTS_ES = [
  {
    id: 'empresas',
    title: 'Empresas',
    text: 'Debida diligencia, fraude interno, confiabilidad del personal, seguridad de la información y defensa jurídica corporativa.',
    links: [
      { label: 'Investigación Corporativa', href: '/investigacion-corporativa/' },
      { label: 'Poligrafía Laboral', href: '/poligrafo-laboral/' },
      { label: 'Barridos Electrónicos', href: '/barrido-electronico/' },
      { label: 'Derecho Comercial y Laboral', href: '/derecho-comercial/' },
    ],
  },
  {
    id: 'personas',
    title: 'Personas y Familias',
    text: 'Verificación de hechos personales y patrimoniales con total reserva, y acompañamiento legal en familia, sucesiones y asuntos penales.',
    links: [
      { label: 'Investigación Personal y Patrimonial', href: '/investigacion-personal/' },
      { label: 'Derecho de Familia', href: '/derecho-de-familia/' },
      { label: 'Derecho Penal', href: '/derecho-penal/' },
      { label: 'Ubicación de Personas y Herederos', href: '/ubicacion-de-personas-para-notificacion-judicial/' },
    ],
  },
  {
    id: 'abogados',
    title: 'Firmas de Abogados y Departamentos Jurídicos',
    text: 'Soporte probatorio para su litigio: ubicación de personas, investigación patrimonial, peritaje y valoración de la prueba.',
    links: [
      { label: 'Servicios para Firmas de Abogados y Departamentos Jurídicos', href: '/servicios-especiales/' },
      { label: 'Notificación Judicial', href: '/ubicacion-de-personas-para-notificacion-judicial/' },
      { label: 'Medidas Cautelares', href: '/investigacion-patrimonial-para-medidas-cautelares/' },
      { label: 'Criminalística y Peritaje', href: '/criminalistica/' },
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
