// Interfaces para las respuestas del servidor
export interface Recurso {
  id: string;
  codigo: string;
  nombre: string;
  tipo_recurso_id: string;
  unidad_id: string;
}

export interface ObraBodegaRecurso {
  id: string;
  recurso_id: Recurso;
}

export interface Prestamo {
  id: string;
}

export interface PrestamoRecursoResponse {
  id: string;
  cantidad: number;
  observaciones?: string;
  prestamo_id: Prestamo;
  obrabodega_recurso_id: ObraBodegaRecurso;
}

// Interfaces para las mutaciones (envío al servidor)
export interface AddPrestamoRecursoInput {
  cantidad: number;
  prestamoId: string;
  obrabodegaRecursoId: string;
  observaciones?: string;
}

export interface UpdatePrestamoRecursoInput extends AddPrestamoRecursoInput {
  id: string;
}
