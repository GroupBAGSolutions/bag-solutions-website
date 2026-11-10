import type { Locale } from "@/i18n/config";

/* Fuente: Catálogo de servicios 2026 (catalogo-bag-solutions-simplificado.pdf).
   Sin precios ni plazos publicados: el alcance y la inversión se definen en la propuesta. */

export type ServiceId = "web" | "ai" | "crm" | "erp" | "auto" | "dash";
export type PillarId = "digital" | "sales" | "ops";
type L<T> = Record<Locale, T>;

export const PILLARS: Record<PillarId, { code: string; name: L<string> }> = {
  digital: { code: "100", name: { es: "Presencia digital", en: "Digital presence" } },
  sales: { code: "200", name: { es: "Ventas inteligentes", en: "Smart sales" } },
  ops: { code: "300", name: { es: "Operación y datos", en: "Operations and data" } },
};

export type Service = {
  id: ServiceId;
  code: string;
  pillar: PillarId;
  slug: L<string>;
  name: L<string>;
  short: L<string>;
  lead: L<string>;
  seoTitle: L<string>;
  seoDescription: L<string>;
  keywords: L<string[]>;
  demoTitle: L<string>;
  incl: L<string[]>;
  /** Niveles Esencial / Profesional / Empresarial. El ERP usa el cotizador por módulos. */
  tiers: L<[string, string][]> | null;
  faq: L<[string, string][]>;
};

const TIER_NAMES = { es: ["Esencial", "Profesional", "Empresarial"], en: ["Essential", "Professional", "Enterprise"] };
const tiers = (es: string[], en: string[]): L<[string, string][]> => ({
  es: es.map((d, i) => [TIER_NAMES.es[i], d]),
  en: en.map((d, i) => [TIER_NAMES.en[i], d]),
});

export const SERVICES: Service[] = [
  {
    id: "web",
    code: "BAG-101",
    pillar: "digital",
    slug: { es: "ecosistemas-web", en: "web-ecosystems" },
    name: { es: "Ecosistemas web", en: "Web ecosystems" },
    short: {
      es: "Sitio, tienda y herramientas trabajando como un solo sistema.",
      en: "Site, store and tools working as one system.",
    },
    lead: {
      es: "Desarrollamos tu sitio web, tienda en línea y portales conectados entre sí: rápidos, seguros y fáciles de administrar.",
      en: "We build your website, online store and portals connected to each other: fast, secure and easy to manage.",
    },
    seoTitle: { es: "Desarrollo web y tiendas en línea a medida", en: "Custom websites and online stores" },
    seoDescription: {
      es: "Sitios web, tiendas en línea y portales conectados entre sí: diseño a la medida, carga rápida, listos para buscadores y fáciles de administrar. Diagnóstico gratuito.",
      en: "Websites, online stores and portals connected to each other: custom design, fast loading, search-ready and easy to manage. Free assessment.",
    },
    keywords: {
      es: ["diseño de páginas web para empresas", "desarrollo de tienda online", "desarrollo web corporativo", "ecommerce a medida"],
      en: ["business website design", "online store development", "corporate web development", "custom ecommerce"],
    },
    demoTitle: { es: "Sitio con tienda · vista previa", en: "Site with store · preview" },
    incl: {
      es: [
        "Mapa de contenidos y prototipo navegable para aprobar antes de construir",
        "Diseño a la medida, adaptable a celular, tableta y computadora",
        "Carga rápida y sitio preparado para aparecer en buscadores",
        "Tienda en línea con catálogo, carrito y pagos en línea",
      ],
      en: [
        "Content map and clickable prototype to approve before building",
        "Custom design that adapts to phone, tablet and computer",
        "Fast loading and a site ready to show up in search engines",
        "Online store with catalog, cart and online payments",
      ],
    },
    tiers: tiers(
      ["Para negocios que necesitan un sitio profesional que genere contactos", "Para empresas que quieren vender en línea o captar prospectos en línea", "Para empresas que necesitan portales y herramientas web conectadas"],
      ["For businesses that need a professional site that generates leads", "For companies that want to sell or capture leads online", "For companies that need connected portals and web tools"],
    ),
    faq: {
      es: [
        ["¿Podré editar el contenido yo mismo?", "Sí. El sitio es fácil de administrar: actualizas textos, imágenes y productos sin escribir código."],
        ["¿El sitio queda listo para Google?", "Sí. Lo preparamos para cargar rápido y aparecer en buscadores desde el primer día."],
        ["¿Puedo vender en línea?", "Sí. La tienda incluye catálogo, carrito y pagos en línea, conectada con el resto de tu sitio."],
      ],
      en: [
        ["Can I edit the content myself?", "Yes. The site is easy to manage: you update text, images and products without writing code."],
        ["Will the site be ready for Google?", "Yes. We build it to load fast and show up in search engines from day one."],
        ["Can I sell online?", "Yes. The store includes catalog, cart and online payments, connected to the rest of your site."],
      ],
    },
  },
  {
    id: "ai",
    code: "BAG-201",
    pillar: "sales",
    slug: { es: "agentes-de-ventas-con-ia", en: "ai-sales-agents" },
    name: { es: "Agentes de comercialización con IA", en: "AI sales agents" },
    short: {
      es: "Cada mensaje atendido, cada prospecto calificado.",
      en: "Every message answered, every lead qualified.",
    },
    lead: {
      es: "Implementamos agentes de IA que atienden, califican y venden por WhatsApp, web e Instagram, y pasan cada prospecto a tu equipo.",
      en: "We deploy AI agents that answer, qualify and sell on WhatsApp, web and Instagram, and hand every lead to your team.",
    },
    seoTitle: { es: "Agentes de ventas con IA para WhatsApp", en: "AI sales agents for WhatsApp and web" },
    seoDescription: {
      es: "Agentes de IA que atienden, califican y venden por WhatsApp, web e Instagram: cotizan, agendan citas y toman pedidos, y pasan cada prospecto a tu equipo.",
      en: "AI agents that answer, qualify and sell on WhatsApp, web and Instagram: they quote, book appointments and take orders, then hand each lead to your team.",
    },
    keywords: {
      es: ["agente de IA para WhatsApp", "chatbot de ventas con IA", "atención automática por WhatsApp", "calificación de prospectos"],
      en: ["AI agent for WhatsApp", "AI sales chatbot", "lead qualification automation"],
    },
    demoTitle: { es: "Agente de ventas · conversación", en: "Sales agent · conversation" },
    incl: {
      es: [
        "Base de conocimiento con productos, precios, políticas y respuestas",
        "Guion de conversación y personalidad del agente con el tono de tu marca",
        "Agente en WhatsApp y en el chat de tu sitio web",
        "Flujos para cotizar, agendar citas o tomar pedidos dentro del chat",
      ],
      en: [
        "Knowledge base with products, prices, policies and answers",
        "Conversation script and agent personality in your brand’s voice",
        "Agent on WhatsApp and on your website chat",
        "Flows to quote, book appointments or take orders inside the chat",
      ],
    },
    tiers: tiers(
      ["Para negocios que quieren responder al instante en un canal principal", "Para empresas que venden por varios canales y quieren calificar prospectos", "Para operaciones con alto volumen, varias líneas de negocio o sucursales"],
      ["For businesses that want to reply instantly on one main channel", "For companies that sell on several channels and want to qualify leads", "For high-volume operations, several business lines or branches"],
    ),
    faq: {
      es: [
        ["¿En qué canales funciona?", "En WhatsApp, en el chat de tu sitio web e Instagram, según el nivel que elijas."],
        ["¿De dónde saca la información el agente?", "De una base de conocimiento con tus productos, precios, políticas y respuestas, que preparamos contigo."],
        ["¿Qué pasa con cada prospecto?", "El agente lo atiende, lo califica y lo pasa a tu equipo para que cierre la venta."],
      ],
      en: [
        ["Which channels does it work on?", "WhatsApp, your website chat and Instagram, depending on the tier you choose."],
        ["Where does the agent get its information?", "From a knowledge base with your products, prices, policies and answers, which we prepare with you."],
        ["What happens to each lead?", "The agent answers, qualifies and hands it to your team to close the sale."],
      ],
    },
  },
  {
    id: "crm",
    code: "BAG-202",
    pillar: "sales",
    slug: { es: "crm-a-medida", en: "custom-crm" },
    name: { es: "CRM", en: "CRM" },
    short: {
      es: "Tu embudo de ventas, ordenado de principio a fin.",
      en: "Your sales pipeline, organized from start to finish.",
    },
    lead: {
      es: "Adaptamos un CRM a tu proceso comercial para organizar prospectos, dar seguimiento y ver el avance de tu equipo.",
      en: "We tailor a CRM to your sales process to organize leads, follow up and see your team’s progress.",
    },
    seoTitle: { es: "CRM a medida para empresas", en: "Custom CRM for businesses" },
    seoDescription: {
      es: "CRM adaptado a tu proceso comercial: etapas de tu embudo, migración de tu base de clientes, captura automática de prospectos y recordatorios por vendedor.",
      en: "A CRM tailored to your sales process: your pipeline stages, customer data migration, automatic lead capture and reminders for every rep.",
    },
    keywords: {
      es: ["CRM a medida", "CRM personalizado", "CRM para pymes", "embudo de ventas"],
      en: ["custom CRM", "bespoke CRM", "CRM for small business", "sales pipeline"],
    },
    demoTitle: { es: "Embudo de ventas", en: "Sales pipeline" },
    incl: {
      es: [
        "CRM configurado con las etapas de tu embudo, campos y usuarios",
        "Migración y limpieza de tu base de clientes actual",
        "Captura automática de prospectos desde web, redes, campañas y chat",
        "Recordatorios, tareas y alertas de seguimiento por vendedor",
      ],
      en: [
        "CRM set up with your pipeline stages, fields and users",
        "Migration and cleanup of your current customer base",
        "Automatic lead capture from web, social media, campaigns and chat",
        "Reminders, tasks and follow-up alerts for each sales rep",
      ],
    },
    tiers: tiers(
      ["Para equipos pequeños que necesitan ordenar sus prospectos y su seguimiento", "Para equipos comerciales que venden por varios canales y necesitan control", "Para empresas con varias sucursales, líneas de negocio o equipos de venta"],
      ["For small teams that need to organize their leads and follow-up", "For sales teams that sell on several channels and need control", "For companies with several branches, business lines or sales teams"],
    ),
    faq: {
      es: [
        ["¿Puedo migrar mis clientes actuales?", "Sí. Migramos y limpiamos tu base de clientes actual antes del lanzamiento."],
        ["¿De dónde llegan los prospectos?", "Se capturan solos desde tu web, redes sociales, campañas y chat."],
        ["¿Cómo evito que se olviden los seguimientos?", "Cada vendedor recibe recordatorios, tareas y alertas de seguimiento."],
      ],
      en: [
        ["Can I migrate my current customers?", "Yes. We migrate and clean up your current customer base before launch."],
        ["Where do leads come from?", "They’re captured automatically from your website, social media, campaigns and chat."],
        ["How do I make sure follow-ups aren’t forgotten?", "Each sales rep gets reminders, tasks and follow-up alerts."],
      ],
    },
  },
  {
    id: "erp",
    code: "BAG-301",
    pillar: "ops",
    slug: { es: "erp-a-medida", en: "custom-erp" },
    name: { es: "ERP", en: "ERP" },
    short: {
      es: "Toda tu operación en un solo sistema, en dólares y bolívares.",
      en: "Your whole operation in one system, in dollars and bolívares.",
    },
    lead: {
      es: "Empiezas con el ERP Base y sus 10 módulos esenciales, sumas solo los módulos que tu operación necesita y, si tus procesos son únicos, cotizamos una personalización total.",
      en: "Start with the ERP Base and its 10 essential modules, add only the modules your operation needs and, if your processes are unique, we quote a fully custom build.",
    },
    seoTitle: { es: "ERP por módulos para empresas en Venezuela", en: "Modular ERP for businesses in Venezuela" },
    seoDescription: {
      es: "ERP por módulos: facturación con imprenta digital o máquina fiscal SENIAT, caja multimoneda USD y Bs con tasa BCV e IGTF, inventario, nómina y contabilidad. Arma tu cotización.",
      en: "Modular ERP: SENIAT-compliant invoicing, multi-currency USD/Bs cash with BCV rate and IGTF, inventory, payroll and accounting. Build your quote.",
    },
    keywords: {
      es: ["ERP Venezuela", "ERP multimoneda", "sistema de facturación SENIAT", "sistema administrativo para pymes", "ERP por módulos"],
      en: ["ERP Venezuela", "multi-currency ERP", "modular ERP", "ERP for small business"],
    },
    demoTitle: { es: "Arma tu ERP por módulos", en: "Build your ERP by modules" },
    incl: {
      es: [
        "Diagnóstico de tu operación y configuración según tu forma de trabajar",
        "Precios y cobros en USD y Bs, con tasa BCV e IGTF",
        "Facturación mediante imprenta digital o máquina fiscal autorizada por el SENIAT",
        "Migración de clientes, proveedores y productos desde Excel",
      ],
      en: [
        "Assessment of your operation and setup based on how you work",
        "Prices and payments in USD and Bs, with BCV rate and IGTF",
        "Invoicing through a digital printer or SENIAT-authorized fiscal printer",
        "Migration of customers, suppliers and products from Excel",
      ],
    },
    tiers: null,
    faq: {
      es: [
        ["¿Maneja dólares y bolívares?", "Sí. Precios y cobros en USD y Bs, con tasa BCV e IGTF, y cobros por Zelle en la caja multimoneda."],
        ["¿Emite facturas fiscales?", "Sí, mediante imprenta digital o máquina fiscal autorizada por el SENIAT. El servicio de la imprenta o de la máquina lo factura su proveedor autorizado."],
        ["¿Puedo empezar pequeño?", "Sí. El ERP Base cubre 1 sede o almacén y hasta 3 usuarios, y sumas módulos cuando tu operación los necesite."],
        ["¿Es un módulo de Odoo o Profit?", "No. Desarrollamos a medida desde cero."],
      ],
      en: [
        ["Does it handle dollars and bolívares?", "Yes. Prices and payments in USD and Bs, with BCV rate and IGTF, plus Zelle payments in the multi-currency cash module."],
        ["Does it issue fiscal invoices?", "Yes, through a digital printer or a SENIAT-authorized fiscal printer. The printer’s service is billed by its authorized provider."],
        ["Can I start small?", "Yes. The ERP Base covers 1 location or warehouse and up to 3 users, and you add modules when your operation needs them."],
        ["Is it an Odoo or Profit module?", "No. We build custom software from scratch."],
      ],
    },
  },
  {
    id: "auto",
    code: "BAG-302",
    pillar: "ops",
    slug: { es: "automatizacion-de-procesos", en: "process-automation" },
    name: { es: "Automatización de procesos internos", en: "Internal process automation" },
    short: {
      es: "Menos tareas repetitivas, más tiempo para crecer.",
      en: "Fewer repetitive tasks, more time to grow.",
    },
    lead: {
      es: "Conectamos tus herramientas y automatizamos aprobaciones, reportes, documentos y avisos que hoy haces a mano.",
      en: "We connect your tools and automate the approvals, reports, documents and alerts you handle manually today.",
    },
    seoTitle: { es: "Automatización de procesos empresariales", en: "Business process automation" },
    seoDescription: {
      es: "Automatizamos aprobaciones de compras y gastos, reportes programados, contratos y documentos desde plantillas, y avisos que hoy haces a mano. Diagnóstico gratuito.",
      en: "We automate purchase and expense approvals, scheduled reports, contracts and documents from templates, and the alerts you handle manually. Free assessment.",
    },
    keywords: {
      es: ["automatización de procesos empresariales", "flujos de aprobación", "reportes automáticos", "automatizar procesos con WhatsApp"],
      en: ["business process automation", "approval workflows", "automated reports"],
    },
    demoTitle: { es: "Flujo · facturas de proveedores", en: "Workflow · supplier invoices" },
    incl: {
      es: [
        "Mapa de procesos manuales priorizados por esfuerzo e impacto",
        "Flujos de aprobación para compras, gastos, vacaciones y permisos",
        "Reportes automáticos enviados por correo o chat en la fecha definida",
        "Generación de contratos, órdenes y documentos internos desde plantillas",
      ],
      en: [
        "Map of manual processes prioritized by effort and impact",
        "Approval workflows for purchases, expenses, vacations and leave",
        "Automated reports sent by email or chat on a set date",
        "Contracts, orders and internal documents generated from templates",
      ],
    },
    tiers: tiers(
      ["Para negocios que quieren automatizar sus primeros procesos repetitivos", "Para empresas que quieren automatizar varias áreas y conectarlas con su ERP o CRM", "Para empresas con procesos críticos que cruzan áreas, sucursales o filiales"],
      ["For businesses that want to automate their first repetitive processes", "For companies that want to automate several areas and connect them to their ERP or CRM", "For companies with critical processes across areas, branches or subsidiaries"],
    ),
    faq: {
      es: [
        ["¿Qué automatizamos primero?", "Lo definimos con un mapa de tus procesos manuales, priorizados por esfuerzo e impacto."],
        ["¿Tengo que cambiar mis sistemas actuales?", "No necesariamente. Conectamos herramientas que ofrezcan una API abierta. No integramos software con accesos limitados o bajo licencia, como A2, Saint o SAP."],
        ["¿Se conecta con mi ERP o CRM?", "Sí. En el nivel Profesional conectamos las automatizaciones con tu ERP o CRM."],
      ],
      en: [
        ["What do we automate first?", "We decide with a map of your manual processes, prioritized by effort and impact."],
        ["Do I have to replace my current systems?", "Not necessarily. We connect tools that offer an open API. We don’t integrate software with restricted access or proprietary licenses, such as A2, Saint or SAP."],
        ["Does it connect to my ERP or CRM?", "Yes. In the Professional tier we connect automations to your ERP or CRM."],
      ],
    },
  },
  {
    id: "dash",
    code: "BAG-303",
    pillar: "ops",
    slug: { es: "dashboards-interactivos", en: "interactive-dashboards" },
    name: { es: "Dashboards interactivos", en: "Interactive dashboards" },
    short: {
      es: "Tus números clave, claros y al día.",
      en: "Your key numbers, clear and up to date.",
    },
    lead: {
      es: "Reunimos los datos de ventas, operación y finanzas en tableros visuales que se actualizan solos.",
      en: "We bring your sales, operations and finance data together in visual dashboards that update themselves.",
    },
    seoTitle: { es: "Dashboards interactivos para empresas", en: "Interactive business dashboards" },
    seoDescription: {
      es: "Tableros con tus indicadores de ventas, operación y finanzas, conectados a tu ERP, CRM, tienda y hojas de cálculo, que se actualizan solos. Diagnóstico gratuito.",
      en: "Dashboards with your sales, operations and finance metrics, connected to your ERP, CRM, store and spreadsheets, updating automatically. Free assessment.",
    },
    keywords: {
      es: ["dashboards para empresas", "tablero de indicadores", "business intelligence pymes", "dashboard de ventas"],
      en: ["business dashboards", "KPI dashboard", "sales dashboard"],
    },
    demoTitle: { es: "Tablero gerencial", en: "Management dashboard" },
    incl: {
      es: [
        "Taller para definir indicadores clave por área y responsable",
        "Conexión automática a ERP, CRM, tienda, hojas y plataformas de anuncios",
        "Datos depurados y reglas de cálculo documentadas para cada indicador",
        "Tablero gerencial con los indicadores del negocio en una vista",
      ],
      en: [
        "Workshop to define key metrics by area and owner",
        "Automatic connection to ERP, CRM, store, spreadsheets and ad platforms",
        "Clean data and documented calculation rules for every metric",
        "Management dashboard with the business metrics in one view",
      ],
    },
    tiers: tiers(
      ["Para negocios que quieren ver sus ventas y finanzas en un solo tablero", "Para empresas que necesitan tableros por área y seguimiento de metas", "Para organizaciones con muchas fuentes de datos y varias unidades de negocio"],
      ["For businesses that want to see sales and finance in one dashboard", "For companies that need dashboards by area and goal tracking", "For organizations with many data sources and several business units"],
    ),
    faq: {
      es: [
        ["¿De dónde salen los datos?", "De tu ERP, CRM, tienda, hojas de cálculo y plataformas de anuncios, conectados de forma automática."],
        ["¿Cómo sé que los números son correctos?", "Depuramos los datos y documentamos la regla de cálculo de cada indicador."],
        ["¿Qué indicadores voy a ver?", "Los definimos en un taller por área y responsable, y los reunimos en un tablero gerencial."],
      ],
      en: [
        ["Where does the data come from?", "From your ERP, CRM, store, spreadsheets and ad platforms, connected automatically."],
        ["How do I know the numbers are right?", "We clean the data and document the calculation rule for every metric."],
        ["Which metrics will I see?", "We define them in a workshop by area and owner, and bring them together in a management dashboard."],
      ],
    },
  },
];

export const serviceById = (id: ServiceId) => SERVICES.find((s) => s.id === id)!;
export const serviceBySlug = (lang: Locale, slug: string) => SERVICES.find((s) => s.slug[lang] === slug);
