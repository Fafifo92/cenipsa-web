/**
 * Acompañamiento jurídico por tema. Alimenta el bloque <LegalSupport /> que se
 * muestra en cada página de servicio y landing: qué apoyo legal puede ofrecer
 * CENIPSA sobre ESE tema. Clave = id de la entrada de `paginas` (slug sin barras).
 * Las páginas que ya son jurídicas por sí mismas están en LEGAL_SUPPORT_EXCLUDED.
 */

export interface LegalSupportEntry {
  text: string;
  areas: string[];
}

type Lang = 'es' | 'en';

const ES: Record<string, LegalSupportEntry> = {
  'investigacion-personal': {
    text: 'Cuando la investigación revela hechos con consecuencias legales, nuestros abogados le acompañan para convertir los hallazgos en una actuación jurídica: desde la asesoría inicial hasta la representación ante la autoridad competente.',
    areas: ['Derecho de familia', 'Sucesiones y herencias', 'Derecho civil', 'Derecho penal'],
  },
  infidelidad: {
    text: 'Una investigación de infidelidad suele terminar en decisiones legales. Le orientamos sobre cómo usar lo hallado de forma lícita y le representamos en los procesos de familia que se deriven.',
    areas: ['Divorcio y cesación de efectos civiles', 'Custodia y alimentos', 'Liquidación de sociedad conyugal o patrimonial', 'Unión marital de hecho'],
  },
  'investigacion-corporativa': {
    text: 'Detectar el fraude es la mitad del camino. Nuestros abogados llevan la actuación legal que sigue: denuncia, proceso disciplinario o laboral, y recuperación de activos, con la evidencia obtenida de forma legítima.',
    areas: ['Derecho laboral y procesos disciplinarios', 'Denuncia penal por fraude, abuso de confianza y corrupción', 'Litigios comerciales y societarios', 'Protección de activos'],
  },
  criminalistica: {
    text: 'La prueba técnica solo vale si se presenta bien. Nuestros abogados acompañan a víctimas y a procesados en la estrategia probatoria, la cadena de custodia y la actuación ante fiscalías y juzgados.',
    areas: ['Defensa y representación de víctimas en el proceso penal', 'Estrategia probatoria y peritajes', 'Cadena de custodia', 'Denuncias y querellas'],
  },
  'plataforma-gps': {
    text: 'Le asesoramos para que el rastreo se use dentro de la ley y, si ocurre un hurto o un incumplimiento, para que los datos del dispositivo se conviertan en una denuncia o una reclamación sólida.',
    areas: ['Uso lícito del rastreo y protección de datos personales', 'Denuncia y reclamación por hurto de vehículos', 'Contratos y responsabilidad de conductores', 'Reclamaciones a aseguradoras'],
  },
  'examen-de-poligrafia': {
    text: 'La poligrafía exige consentimiento y un manejo cuidadoso de los resultados. Le orientamos sobre el marco legal de la prueba y sobre las decisiones laborales o disciplinarias que se tomen a partir de ella.',
    areas: ['Consentimiento informado y manejo de resultados', 'Derecho laboral', 'Valor de la prueba dentro del proceso', 'Tratamiento de datos personales'],
  },
  'barrido-electronico': {
    text: 'Si se detecta vigilancia ilegal, hay conductas que pueden denunciarse. Le acompañamos en la actuación penal y en las medidas de protección de su información.',
    areas: ['Delitos informáticos y contra la intimidad', 'Protección de datos personales', 'Denuncia penal', 'Protección de secretos empresariales'],
  },
  'seguimientos-inteligentes': {
    text: 'Los seguimientos documentan hechos; nuestros abogados definen cómo usarlos legalmente y representan al cliente en el proceso que corresponda.',
    areas: ['Derecho de familia', 'Derecho laboral', 'Derecho penal', 'Derecho civil y comercial'],
  },
  'servicios-comunidad-lgtb': {
    text: 'Acompañamos jurídicamente a personas y parejas LGTB con atención respetuosa y confidencial, en la protección de sus derechos y en los procesos que necesiten.',
    areas: ['Protección de derechos fundamentales', 'Derecho de familia', 'Denuncias por discriminación o violencia', 'Sucesiones'],
  },
  'servicios-en-linea': {
    text: 'La asesoría jurídica también es virtual: puede consultar a nuestros abogados desde cualquier lugar del país o del exterior, y agendar su cita según disponibilidad.',
    areas: ['Derecho de familia', 'Derecho penal', 'Derecho laboral', 'Derecho comercial'],
  },
  'servicios-especiales': {
    text: 'Además de la evidencia, ofrecemos a abogados y casas de cobro respaldo jurídico en la estrategia del proceso, incluidas las medidas cautelares y la notificación.',
    areas: ['Procesos ejecutivos y cobro de cartera', 'Medidas cautelares', 'Notificación judicial', 'Estrategia probatoria'],
  },
  'ubicacion-de-personas-para-notificacion-judicial': {
    text: 'Una vez ubicada la persona, nuestros abogados pueden adelantar la notificación y continuar el proceso judicial que corresponda.',
    areas: ['Notificación judicial', 'Procesos ejecutivos y de cobro', 'Derecho de familia', 'Derecho civil'],
  },
  'investigacion-patrimonial-para-medidas-cautelares': {
    text: 'Con la información patrimonial verificada, nuestros abogados solicitan y sustentan las medidas cautelares y llevan el proceso de cobro.',
    areas: ['Medidas cautelares', 'Procesos ejecutivos', 'Recuperación de cartera', 'Litigios comerciales'],
  },
  'analisis-ejecutivo-de-informacion-financiera-bienes-raices-y-vehiculos': {
    text: 'El análisis financiero y patrimonial se traduce en acciones legales concretas: embargos, procesos de cobro y reclamaciones.',
    areas: ['Procesos ejecutivos', 'Medidas cautelares', 'Litigios comerciales', 'Sucesiones y bienes ocultos'],
  },
  'poligrafo-laboral': {
    text: 'Le asesoramos sobre el marco legal del polígrafo laboral, el consentimiento del trabajador y las decisiones disciplinarias que se tomen a partir de los resultados.',
    areas: ['Derecho laboral', 'Procesos disciplinarios', 'Consentimiento y tratamiento de datos personales', 'Denuncia penal por fraude interno'],
  },
  'prueba-de-poligrafo-bogota': {
    text: 'La poligrafía exige consentimiento y un manejo cuidadoso de los resultados. Le orientamos sobre el marco legal de la prueba y sus efectos en el proceso.',
    areas: ['Consentimiento informado', 'Derecho laboral', 'Valor de la prueba dentro del proceso', 'Tratamiento de datos personales'],
  },
  'gps-bogota': {
    text: 'Le asesoramos para que el rastreo se use dentro de la ley y, si ocurre un hurto o un incumplimiento, para que los datos se conviertan en una denuncia o reclamación sólida.',
    areas: ['Uso lícito del rastreo', 'Denuncia por hurto de vehículos', 'Contratos y responsabilidad', 'Protección de datos personales'],
  },
  'gps-para-carros-bogota': {
    text: 'Le asesoramos para que el rastreo se use dentro de la ley y, si ocurre un hurto o un incumplimiento, para que los datos se conviertan en una denuncia o reclamación sólida.',
    areas: ['Uso lícito del rastreo', 'Denuncia por hurto de vehículos', 'Contratos y responsabilidad', 'Protección de datos personales'],
  },
  default: {
    text: 'Cada investigación puede terminar en una actuación legal. Nuestros abogados acompañan su caso desde el primer día: orientan la recolección de evidencia para que sea válida y le representan cuando llega el momento de actuar.',
    areas: ['Derecho penal', 'Derecho de familia', 'Derecho laboral', 'Derecho comercial', 'Sucesiones'],
  },
};

const EN: Record<string, LegalSupportEntry> = {
  'en/personal-investigation': {
    text: 'When an investigation uncovers facts with legal consequences, our lawyers help you turn the findings into legal action — from the first consultation to representation before the competent authority.',
    areas: ['Family law', 'Inheritance & estates', 'Civil law', 'Criminal law'],
  },
  'en/corporate-investigation': {
    text: 'Detecting fraud is only half the job. Our lawyers handle the legal action that follows — criminal complaint, labor or disciplinary proceedings and asset recovery — using lawfully obtained evidence.',
    areas: ['Labor law & disciplinary proceedings', 'Criminal complaints for fraud, breach of trust and corruption', 'Commercial & corporate litigation', 'Asset protection'],
  },
  'en/criminalistics': {
    text: 'Technical evidence is only worth what its presentation is worth. Our lawyers support victims and defendants with evidence strategy, chain of custody and proceedings before prosecutors and courts.',
    areas: ['Representation of victims in criminal proceedings', 'Evidence strategy & expert reports', 'Chain of custody', 'Complaints and filings'],
  },
  'en/gps-tracking': {
    text: 'We advise you so that tracking is used within the law and, if a theft or breach occurs, so that device data becomes a solid complaint or claim.',
    areas: ['Lawful use of tracking & personal data protection', 'Theft complaints and claims', 'Contracts & driver liability', 'Insurance claims'],
  },
  'en/polygraph': {
    text: 'Polygraph testing requires consent and careful handling of results. We advise on the legal framework of the test and on any labor or disciplinary decisions taken on its basis.',
    areas: ['Informed consent & handling of results', 'Labor law', 'Weight of the test within proceedings', 'Personal data processing'],
  },
  'en/electronic-sweep': {
    text: 'If unlawful surveillance is detected, some conduct can be reported. We support you with the criminal action and with measures to protect your information.',
    areas: ['Cybercrime & privacy offenses', 'Personal data protection', 'Criminal complaint', 'Protection of trade secrets'],
  },
  'en/services-for-lawyers': {
    text: 'Beyond evidence, we give lawyers and collection firms legal backing on case strategy, including precautionary measures and service of process.',
    areas: ['Enforcement & debt collection', 'Precautionary measures', 'Judicial notification', 'Evidence strategy'],
  },
  'en/online-services': {
    text: 'Legal advice is also available online: consult our lawyers from anywhere in Colombia or abroad and book your appointment according to availability.',
    areas: ['Family law', 'Criminal law', 'Labor law', 'Commercial law'],
  },
  default: {
    text: 'Every investigation can end in legal action. Our lawyers support your case from day one: they guide evidence gathering so it holds up, and represent you when it is time to act.',
    areas: ['Criminal law', 'Family law', 'Labor law', 'Commercial law', 'Inheritance & estates'],
  },
};

/** Páginas que ya son jurídicas: no se les añade el bloque. */
const LEGAL_SUPPORT_EXCLUDED = new Set([
  'asesoria-juridica',
  'abogados-bogota',
  'abogados-sucesiones-bogota',
  'en/legal-advice',
]);

export function legalSupportFor(id: string, lang: Lang): LegalSupportEntry | null {
  if (LEGAL_SUPPORT_EXCLUDED.has(id)) return null;
  const table = lang === 'es' ? ES : EN;
  return table[id] ?? table.default;
}
