export interface TransferenciaRecurso {
  _id: string;
  transferencia_detalle_id: {
    id: string;
    referencia_id: string;
    fecha: string;
    tipo: string;
    referencia: string;
  };
  recurso_id: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    fecha: string;
    cantidad: number;
    unidad_id: string;
    precio_actual: number;
    vigente: boolean;
    tipo_recurso_id: string;
    tipo_costo_recurso_id: string;
    clasificacion_recurso_id: string;
  };
  cantidad: number;
  costo: number;
}

export interface TransferenciaCompleta {
  id: string;
  fecha: Date;
  usuario_id: {
    nombres: string;
    apellidos: string;
  };
  movimiento_id: {
    id: string;
    nombre: string;
    descripcion: string;
    tipo: string;
  };
  movilidad_id: {
    id: string;
    denominacion: string;
    descripcion: string;
  };
  detalles: any[];
  recursos: TransferenciaRecurso[];
}

export type TipoFiltro = 'TODOS' | 'COMPRAS' | 'RECEPCIONES' | 'PRESTAMOS' | 'SALIDA';

export interface RecursoSeleccionado {
  id?: string;
  recurso_id: {
    id: string;
    codigo: string;
    nombre: string;
    unidad_id: string;
    precio_actual: number;
  };
  cantidad: number;
  cantidadSeleccionada: number;
  bodega?: string;
}

export interface SolicitudAlmacen {
  id: string;
  almacenOrigen: {
    id: string;
    nombre: string;
  };
  almacenDestino: {
    id: string;
    nombre: string;
  } | null;
  usuario: {
    id: string;
    nombres: string;
    apellidos: string;
  };
}
