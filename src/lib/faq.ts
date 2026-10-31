/**
 * Categorías de las preguntas frecuentes = menú del asistente virtual
 * (estructura de chatbot enviada por la firma, nov. 2026).
 */
export type FaqCategory = 'legalidad' | 'personal' | 'empresas' | 'abogados' | 'precios';

export interface FaqEntry {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  links: { label: string; href: string }[];
  order: number;
}

export const FAQ_CATEGORIES: Record<'es' | 'en', { id: FaqCategory; label: string }[]> = {
  es: [
    { id: 'legalidad', label: 'Legalidad, Confidencialidad y Seguridad' },
    { id: 'personal', label: 'Investigación Personal y Familiar' },
    { id: 'empresas', label: 'Servicios Empresariales, Poligrafía y Tecnología' },
    { id: 'abogados', label: 'Servicios para Firmas de Abogados, Criminalística y Peritajes' },
    { id: 'precios', label: 'Precios, Tiempos, Citas y Medios de Pago' },
  ],
  en: [
    { id: 'legalidad', label: 'Legality, Confidentiality and Security' },
    { id: 'personal', label: 'Personal and Family Investigation' },
    { id: 'empresas', label: 'Business Services, Polygraph and Technology' },
    { id: 'abogados', label: 'Services for Law Firms, Criminalistics and Expert Reports' },
    { id: 'precios', label: 'Prices, Timelines, Appointments and Payment' },
  ],
};
