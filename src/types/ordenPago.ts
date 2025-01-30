// ...existing code...
export interface OrdenPagoInput {
  monto_solicitado: number;
  tipo_moneda: string;
  tipo_pago: string;
  estado?: string;
}

// Interface para actualizaciones parciales
export interface OrdenPagoUpdateInput {
  id: string;
  monto_solicitado?: number;
  tipo_moneda?: string;
  tipo_pago?: string;
  estado?: string;
}

// Tipo específico para la acción de actualización
export type UpdateOrdenPagoAction = Partial<OrdenPagoInput> & { id: string };
// ...existing code...