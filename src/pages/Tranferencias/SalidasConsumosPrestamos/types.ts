export interface Requerimiento {
  estado: string;
  codigo: string;
  estado_atencion: string;
  fecha_final: string;
  fecha_solicitud: string;
  id: string;
  obra_id: string;
  presupuesto_id: string;
  sustento: string;
  usuario: string;
  usuario_id: string;
}

export interface RequerimientoRecurso {
  id: string;
  codigo: string;
  nombre: string;
  estado: string;
  requerimiento_id: string;
  recurso_id: string; // Aquí es el objeto completo
  cantidad: number;
  cantidad_aprobada: number | null; // Actualizamos para que coincida con el slice
  estado_atencion: string;
  notas?: string; // Cambiamos a opcional para que coincida con el slice
  unidad: string;
}

// Para operaciones de creación/actualización
export interface RequerimientoRecursoInput {
  id?: string;
  requerimiento_id: string;
  recurso_id: string; // Aquí es solo el ID
  cantidad: number;
  cantidad_aprobada: number | null; // Actualizamos para mantener consistencia
  notas?: string;
}
