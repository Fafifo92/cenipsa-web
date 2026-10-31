/**
 * Ruta metodológica de contratación en 6 pasos (OBSERVACIONES 4, oct. 2026).
 * Alimenta el gráfico de la home (versión resumida) y la página
 * «Antes de la Contratación» (versión completa con viñetas).
 */
export interface RouteStep {
  n: number;
  title: string;
  /** Resumen de una línea para el gráfico de la home. */
  short: string;
  /** Viñetas completas para la página. */
  bullets: string[];
  /** Paso 6: opcional (nueva contratación jurídica). */
  optional?: boolean;
  intro?: string;
}

export const ROUTE_ES: RouteStep[] = [
  {
    n: 1,
    title: 'Recepción Confidencial del Caso',
    short: 'Recibimos su requerimiento con reserva y evaluamos su viabilidad técnica y legal.',
    bullets: [
      'Recepción del requerimiento bajo estricta reserva y secreto profesional.',
      'Evaluación de viabilidad técnica y legal preliminar del caso.',
      'Verificación de la competencia institucional de CENIPSA S.A.S.',
    ],
  },
  {
    n: 2,
    title: 'Análisis de Caso y Presentación de Propuesta',
    short: 'Abogados, investigadores y peritos definen alcance, metodología, cronograma y propuesta.',
    bullets: [
      'Estudio detallado del requerimiento por el equipo interdisciplinario (abogados, investigadores y peritos).',
      'Definición clara del alcance técnico, metodología operativa y cronograma estimado de entrega.',
      'Estructuración formal y envío de la Propuesta Técnica y Económica al cliente.',
    ],
  },
  {
    n: 3,
    title: 'Contratación y Apertura de Proveedor',
    short: 'Aceptación de la propuesta y firma del contrato con acuerdo NDA y cláusulas de Habeas Data.',
    bullets: [
      'Aceptación formal de la propuesta comercial por parte del cliente o empresa.',
      'Suministro de la documentación institucional y legal de CENIPSA S.A.S. para apertura de proveedor.',
      'Formalización y firma bilateral del contrato de prestación de servicios, incluyendo el acuerdo NDA de confidencialidad y cláusulas de Habeas Data.',
    ],
  },
  {
    n: 4,
    title: 'Desarrollo del Objeto de Contratación',
    short: 'Investigación, análisis forense o peritaje con cadena de custodia y control de calidad.',
    bullets: [
      'Ejecución rigurosa de las labores de investigación, análisis forense digital, auditoría o peritaje.',
      'Aplicación estricta de la cadena de custodia y principios de licitud probatoria conforme a la norma vigente.',
      'Control continuo de avances, supervisión de calidad y seguimiento metodológico.',
    ],
  },
  {
    n: 5,
    title: 'Entrega de Informe General y Toma de Decisiones',
    short: 'Informe con soportes y anexos, y sesión ejecutiva para decidir con claridad.',
    bullets: [
      'Consolidación y entrega formal del Informe General escrito, acompañado de sus respectivos soportes documentales y anexos técnicos.',
      'Aporte de evidencias útiles, conducentes y legalmente sustentadas.',
      'Realización de una sesión de socialización ejecutiva con el cliente para contextualizar los hallazgos y facilitar la toma de decisiones estratégicas.',
    ],
  },
  {
    n: 6,
    title: 'Traslado al Área Jurídica de CENIPSA S.A.S.',
    short: 'Si usted lo decide, nuestros abogados llevan las evidencias a denuncia o demanda.',
    optional: true,
    intro: 'Si el cliente así lo determina, y con base en los hallazgos de la investigación y la toma de decisiones:',
    bullets: [
      'Traslado directo de las evidencias al equipo de abogados penalistas/corporativos de CENIPSA.',
      'Estructuración de hipótesis procesales, adecuación típica y redacción de denuncias penales o demandas.',
      'Formalización de una nueva contratación independiente de representación y patrocinio legal ante autoridades u organismos judiciales.',
    ],
  },
];

export const ROUTE_EN: RouteStep[] = [
  {
    n: 1,
    title: 'Confidential Case Intake',
    short: 'We receive your request in confidence and assess its technical and legal feasibility.',
    bullets: [
      'Request received under strict confidentiality and professional secrecy.',
      'Preliminary technical and legal feasibility assessment.',
      'Verification that the matter falls within CENIPSA S.A.S.’s competence.',
    ],
  },
  {
    n: 2,
    title: 'Case Analysis and Proposal',
    short: 'Lawyers, investigators and experts define scope, methodology, timeline and proposal.',
    bullets: [
      'Detailed study by the interdisciplinary team (lawyers, investigators and experts).',
      'Clear definition of technical scope, operating methodology and estimated timeline.',
      'Formal Technical and Financial Proposal sent to the client.',
    ],
  },
  {
    n: 3,
    title: 'Engagement and Supplier Onboarding',
    short: 'Proposal accepted and contract signed with an NDA and Habeas Data clauses.',
    bullets: [
      'Formal acceptance of the proposal by the client or company.',
      'CENIPSA S.A.S. institutional and legal documents provided for supplier onboarding.',
      'Bilateral service contract signed, including an NDA and Habeas Data clauses.',
    ],
  },
  {
    n: 4,
    title: 'Execution of the Engagement',
    short: 'Investigation, forensic analysis or expert work with chain of custody and quality control.',
    bullets: [
      'Rigorous investigation, digital forensic analysis, audit or expert work.',
      'Strict chain of custody and lawful-evidence principles under current law.',
      'Continuous progress control, quality supervision and methodological follow-up.',
    ],
  },
  {
    n: 5,
    title: 'Final Report and Decision-Making',
    short: 'Report with supporting documents and an executive session to decide clearly.',
    bullets: [
      'Formal delivery of the written General Report with supporting documents and technical annexes.',
      'Useful, relevant and legally supported evidence.',
      'Executive briefing with the client to put findings in context and support strategic decisions.',
    ],
  },
  {
    n: 6,
    title: 'Referral to CENIPSA’s Legal Team',
    short: 'If you decide so, our lawyers take the evidence to a complaint or lawsuit.',
    optional: true,
    intro: 'If the client so decides, based on the findings and decisions made:',
    bullets: [
      'Evidence transferred directly to CENIPSA’s criminal/corporate lawyers.',
      'Procedural hypotheses, legal classification and drafting of criminal complaints or lawsuits.',
      'A new, independent engagement for legal representation before the authorities or courts.',
    ],
  },
];
