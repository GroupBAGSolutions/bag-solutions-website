import type { Locale } from "@/i18n/config";
import type { ServiceId } from "./services";

type L<T> = Record<Locale, T>;

export type Post = {
  id: string;
  slug: L<string>;
  title: L<string>;
  description: L<string>;
  published: string;
  updated?: string;
  minutes: L<number>;
  service: ServiceId;
};

/* Metadatos en TS (sin frontmatter): el cuerpo vive en content/blog/{es,en}/{id}.mdx */
export const POSTS: Post[] = [
  {
    id: "crm-a-medida",
    slug: { es: "crm-a-medida-o-crm-generico", en: "custom-crm-vs-off-the-shelf" },
    title: {
      es: "CRM a medida o CRM genérico: cuándo conviene cada uno",
      en: "Custom CRM vs. off-the-shelf CRM: when each one makes sense",
    },
    description: {
      es: "Comparamos costo, adopción y control de un CRM a medida frente a uno genérico con licencias por usuario, y te damos 5 preguntas para decidir.",
      en: "We compare cost, adoption and control of a custom CRM versus a per-user licensed one, plus 5 questions to help you decide.",
    },
    published: "2026-11-09",
    minutes: { es: 5, en: 5 },
    service: "crm",
  },
  {
    id: "senales-erp",
    slug: { es: "senales-de-que-tu-empresa-necesita-un-erp", en: "signs-your-business-needs-an-erp" },
    title: {
      es: "7 señales de que tu empresa necesita un ERP",
      en: "7 signs your business needs an ERP",
    },
    description: {
      es: "Planillas que no cuadran, stock que nadie conoce y cierres de mes eternos: las señales de que llegó el momento de un ERP y cómo empezar sin frenar la operación.",
      en: "Spreadsheets that don’t match, unknown stock levels and endless month-end closes: the signs it’s time for an ERP and how to start without stopping operations.",
    },
    published: "2026-11-09",
    minutes: { es: 6, en: 6 },
    service: "erp",
  },
  {
    id: "automatizar-primero",
    slug: { es: "que-procesos-automatizar-primero", en: "what-processes-to-automate-first" },
    title: {
      es: "Qué procesos automatizar primero en tu empresa",
      en: "Which processes to automate first in your business",
    },
    description: {
      es: "Un método simple para elegir qué automatizar primero: frecuencia, reglas claras y costo del error. Con ejemplos de facturas, aprobaciones y avisos por WhatsApp.",
      en: "A simple method to pick what to automate first: frequency, clear rules and cost of errors. With examples for invoices, approvals and WhatsApp alerts.",
    },
    published: "2026-11-09",
    minutes: { es: 5, en: 5 },
    service: "auto",
  },
];

export const postBySlug = (lang: Locale, slug: string) => POSTS.find((p) => p.slug[lang] === slug);
