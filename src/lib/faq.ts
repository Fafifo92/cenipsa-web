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
    { id: 'legalidad', label: 'Legalidad, confidencialidad y seguridad' },
    { id: 'personal', label: 'Investigación personal y familiar' },
    { id: 'empresas', label: 'Servicios empresariales, poligrafía y tecnología' },
    { id: 'abogados', label: 'Servicios para abogados, criminalística y peritajes' },
    { id: 'precios', label: 'Precios, tiempos, citas y medios de pago' },
  ],
  en: [
    { id: 'legalidad', label: 'Legality, confidentiality and security' },
    { id: 'personal', label: 'Personal and family investigation' },
    { id: 'empresas', label: 'Business services, polygraph and technology' },
    { id: 'abogados', label: 'Services for lawyers, criminalistics and expert reports' },
    { id: 'precios', label: 'Prices, timelines, appointments and payment' },
  ],
};
