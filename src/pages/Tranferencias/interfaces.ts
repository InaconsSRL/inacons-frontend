// Interfaces from transferenciaSlice
export interface Movimiento {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

export interface Movilidad {
  id: string;
  denominacion: string;
  descripcion: string;
}

export interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
}

// Interface transferenciaRecursoSlice
export interface Recurso {
  id: string;
  codigo: string;
  nombre: string;
  unidad_id: string;
  precio_actual: number;
  cantidad: number;
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

}

// Interface from guiaTransferenciaSlice
export interface GuiaTransferencia {
  id: string;
  transferencia_id: string;
  cod_guia: string;
  usuario_id: string;
  tipo: string;
  observacion?: string;
  fecha: Date;
}

// Props interface for OrdenTransferencia
export interface OrdenTransferenciaProps {
  onClose: () => void;
  transferenciasId?: string | null;
  recursos: RecursoSeleccionado[];
}

export interface OrdenTransferenciaProps {
  onClose: () => void;
  recursos: RecursoSeleccionado[];
  solicitudData: {
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
  };
}



export interface Movilidad {
  id: string;
  denominacion: string;
  descripcion?: string;
}

export interface TransferenciaData {
  movimiento: 'entrada' | 'salida';
  movilidad_id: string;
  descripcion: string;
  almacenSalida: string;
  almacenDestino: string;
  encargado: string;
  observaciones: string;
  recursos: RecursoSeleccionado[];
  total: number;
}
