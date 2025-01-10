// src/types/kanban.ts

export interface Requerimiento {
  estado: string;
  aprobacion: Aprobacion[];
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

export interface NewRequerimiento {
  estado: string;
  aprobacion: Aprobacion[];
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
  user: {
    id: string;
    usuario: string;
    token: string
  }
}

export interface Aprobacion {
  cargo: string;
  id_usuario: string;
  gerarquia: number;
  id_aprobacion: string;
  nombres: string;
  apellidos: string;
}

export interface Cotizacion {
  codigo_cotizacion: string;
  estado: string;
  fecha: number;
  id: string;
  solicitud_compra_id: string;
  usuario_id: Usuario;
}

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
}

export interface Column {
  id: string;
  title: string;
  limit?: number;
  color: string;
  requerimiento: Requerimiento[];
  cotizacion?: Cotizacion[];
}

export interface Board {
  columns: Column[];
  showButtons: boolean;
}