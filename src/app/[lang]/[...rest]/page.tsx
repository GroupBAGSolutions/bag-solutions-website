import { notFound } from "next/navigation";

/* Cualquier ruta desconocida bajo /es o /en muestra el 404 dentro del layout del idioma. */
export default function CatchAll() {
  notFound();
}
