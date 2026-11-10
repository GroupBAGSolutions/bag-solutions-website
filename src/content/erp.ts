import type { Locale } from "@/i18n/config";

/* Cotizador del ERP (BAG-301). Fuente: Catálogo 2026, página «Arma tu ERP por módulos».
   Sin precios ni plazos: la selección viaja al formulario de contacto. */

type L<T> = Record<Locale, T>;

export const ERP_BASE: { name: L<string>; desc: L<string> }[] = [
  { name: { es: "Panel de inicio", en: "Home dashboard" }, desc: { es: "Ventas del día, caja y alertas de inventario en una vista", en: "Daily sales, cash and inventory alerts in one view" } },
  { name: { es: "Clientes", en: "Customers" }, desc: { es: "Ficha, historial de compras y saldo pendiente", en: "Record, purchase history and outstanding balance" } },
  { name: { es: "Proveedores", en: "Suppliers" }, desc: { es: "Ficha, historial de compras y cuentas por pagar", en: "Record, purchase history and accounts payable" } },
  { name: { es: "Productos y precios", en: "Products and prices" }, desc: { es: "Catálogo con listas de precio en dólares y bolívares", en: "Catalog with price lists in dollars and bolívares" } },
  { name: { es: "Inventario", en: "Inventory" }, desc: { es: "Un almacén, existencias, kardex y alertas de mínimo", en: "One warehouse, stock levels, kardex and minimum alerts" } },
  { name: { es: "Ventas", en: "Sales" }, desc: { es: "Cotizaciones, pedidos y notas de entrega", en: "Quotes, orders and delivery notes" } },
  { name: { es: "Facturación", en: "Invoicing" }, desc: { es: "Facturas y notas de crédito o débito mediante imprenta digital o máquina fiscal", en: "Invoices and credit or debit notes through a digital or fiscal printer" } },
  { name: { es: "Compras y gastos", en: "Purchases and expenses" }, desc: { es: "Órdenes de compra, recepción de mercancía y gastos", en: "Purchase orders, goods receipt and expenses" } },
  { name: { es: "Caja multimoneda", en: "Multi-currency cash" }, desc: { es: "Cobros y pagos en USD y Bs, Zelle, tasa BCV e IGTF", en: "Payments in USD and Bs, Zelle, BCV rate and IGTF" } },
  { name: { es: "Usuarios y reportes", en: "Users and reports" }, desc: { es: "Roles por cargo, libros de compra y venta y reportes básicos", en: "Roles by position, purchase and sales ledgers and basic reports" } },
];

export const ERP_BASE_TERMS: L<string[]> = {
  es: ["1 sede o almacén y hasta 3 usuarios", "Migración de clientes, proveedores y productos desde Excel", "2 sesiones de capacitación y 30 días de acompañamiento"],
  en: ["1 location or warehouse and up to 3 users", "Migration of customers, suppliers and products from Excel", "2 training sessions and 30 days of support"],
};

export type ErpModuleId = "nomina" | "contabilidad" | "sedes" | "produccion" | "logistica" | "retenciones" | "pos" | "automatizaciones" | "cobranza" | "formatos";

export const ERP_MODULES: { id: ErpModuleId; name: L<string>; desc: L<string> }[] = [
  { id: "nomina", name: { es: "Nómina y RR. HH.", en: "Payroll and HR" }, desc: { es: "Fichas de empleados, asistencia y nómina según la LOTTT: IVSS, FAOV, INCES, paro forzoso, pensiones, cestaticket, vacaciones, utilidades y prestaciones.", en: "Employee records, attendance and payroll under the LOTTT: IVSS, FAOV, INCES, unemployment, pensions, cestaticket, vacations, profit sharing and severance." } },
  { id: "contabilidad", name: { es: "Contabilidad", en: "Accounting" }, desc: { es: "Plan de cuentas, asientos automáticos desde ventas y compras, conciliación bancaria y estados financieros en USD y Bs.", en: "Chart of accounts, automatic entries from sales and purchases, bank reconciliation and financial statements in USD and Bs." } },
  { id: "sedes", name: { es: "Gestión de sedes", en: "Multi-location" }, desc: { es: "Varias sucursales y almacenes, transferencias entre ellos, permisos por sede y reportes consolidados.", en: "Several branches and warehouses, transfers between them, permissions by location and consolidated reports." } },
  { id: "produccion", name: { es: "Producción y costeo", en: "Production and costing" }, desc: { es: "Recetas o listas de materiales, órdenes de fabricación y costo real por producto.", en: "Recipes or bills of materials, production orders and real cost per product." } },
  { id: "logistica", name: { es: "Logística y despacho", en: "Logistics and dispatch" }, desc: { es: "Guías de despacho, rutas, choferes y estado de cada entrega.", en: "Dispatch notes, routes, drivers and the status of each delivery." } },
  { id: "retenciones", name: { es: "Retenciones SENIAT", en: "SENIAT withholdings" }, desc: { es: "Retenciones de IVA e ISLR, comprobantes y archivos para declarar, ideal para contribuyentes especiales.", en: "VAT and income tax withholdings, receipts and filing files, ideal for special taxpayers." } },
  { id: "pos", name: { es: "Punto de venta", en: "Point of sale" }, desc: { es: "Caja rápida con código de barras, cierre por turno y conexión con máquina fiscal.", en: "Fast checkout with barcodes, shift closing and fiscal printer connection." } },
  { id: "automatizaciones", name: { es: "Automatizaciones", en: "Automations" }, desc: { es: "Avisos por WhatsApp o correo, reportes programados y aprobaciones de compras y gastos.", en: "WhatsApp or email alerts, scheduled reports and purchase and expense approvals." } },
  { id: "cobranza", name: { es: "Cobranza y crédito", en: "Collections and credit" }, desc: { es: "Límites de crédito, antigüedad de saldos y recordatorios de pago a tus clientes.", en: "Credit limits, aging of balances and payment reminders to your customers." } },
  { id: "formatos", name: { es: "Formatos y etiquetas", en: "Forms and labels" }, desc: { es: "Facturas, cotizaciones y notas con tu marca, y etiquetas con código de barras.", en: "Branded invoices, quotes and notes, and barcode labels." } },
];

export const ERP_PACKAGES: { id: string; name: L<string>; audience: L<string>; modules: ErpModuleId[] }[] = [
  { id: "comercio", name: { es: "Comercio", en: "Retail" }, audience: { es: "Tiendas, bodegones y farmacias", en: "Stores, convenience stores and pharmacies" }, modules: ["pos", "cobranza"] },
  { id: "distribucion", name: { es: "Distribución", en: "Distribution" }, audience: { es: "Distribuidoras y mayoristas", en: "Distributors and wholesalers" }, modules: ["sedes", "logistica", "retenciones"] },
  { id: "regla", name: { es: "Empresa en regla", en: "Fully compliant" }, audience: { es: "Empresas con personal y contabilidad propia", en: "Companies with their own staff and accounting" }, modules: ["contabilidad", "nomina", "retenciones"] },
];

export const isErpModule = (id: string): id is ErpModuleId => ERP_MODULES.some((m) => m.id === id);
