import { z } from "zod";

export const SERVICE_IDS = ["web", "ai", "crm", "erp", "auto", "dash"] as const;

/* Los mensajes se traducen en el cliente: aquí solo viajan claves. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "name").max(120),
  company: z.string().trim().min(1, "company").max(160),
  email: z.string().trim().min(1, "emailEmpty").pipe(z.email("email")).pipe(z.string().max(200)),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  services: z.array(z.enum(SERVICE_IDS)).max(SERVICE_IDS.length),
  message: z.string().trim().min(1, "message").max(4000),
  lang: z.enum(["es", "en"]),
  /* Trampa para bots: debe llegar vacía */
  website: z.string().max(0).optional().or(z.literal("")),
  token: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
