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
}

export interface Column {
  id: string;
  title: string;
  limit?: number;
  color: string;
  requerimiento: Requerimiento[];
}

export interface Board {
  columns: Column[];
  showButtons: boolean;
}
