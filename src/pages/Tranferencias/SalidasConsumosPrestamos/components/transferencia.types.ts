import { Recurso } from './bodega.types';

export interface TransferenciaRecurso {
  _id: string;
  transferencia_detalle_id: {
    id: string;
    referencia_id: string;
    fecha: string;
    tipo: string;
    referencia: string;
  };
  recurso_id: Recurso;
  cantidad: number;
  costo: number;
}

export interface TransferenciaRecursoPayload {
  transferencia_detalle_id: string;
  recurso_id: string;
  cantidad: number;
  costo?: number;
  bodega_origen?: string;
  bodega_destino?: string;
}
