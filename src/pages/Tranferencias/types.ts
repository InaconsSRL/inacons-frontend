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

export type EstadoTransferencia = 'PARCIAL' | 'COMPLETO';

export interface TransferenciaCompleta {
  id: string;
  fecha: Date;
  estado?: EstadoTransferencia; // Hacemos el estado opcional
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

export interface FormularioSolicitudProps {
  onClose: () => void;
  transferenciasId?: string;
}

export interface SolicitudAlmacen {
  id: string;
  almacen_origen_id: {
    id: string;
    nombre: string;
  };
  almacen_destino_id: {
    id: string;
    nombre: string;
  } | null;
  usuario_id: {
    id: string;
    nombres: string;
    apellidos: string;
  };
  requerimiento_id: {
    id: string;
    codigo: string;
    obra_id: string;
  };
  fecha: string;
  estado: string;
}

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
  isChecked?: boolean;
}
