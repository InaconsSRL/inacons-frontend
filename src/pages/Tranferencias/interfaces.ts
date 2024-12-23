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
// Nuevas interfaces
export interface Transferencia {
  id: string; 
  numeroOrden: string; 
  almacenSalida: string; 
  estado: 'En camino' | 'Completado'; 
  observaciones?: string; 
  tipoTransporte?: string; 
}

export interface TransferenciaRecurso {
  id: string;
  transferencia_id: string;
  recurso_id: {
    id: string;
    codigo: string;
    nombre: string;
    unidad_id: string;
    precio_actual: number;
  };
  cantidad: number;
}

export interface TransferenciaCompleta {
  id: string;
  fecha: Date;
  usuario_id: {
    nombres: string;
    apellidos: string;
  };
  movimiento_id: {
    nombre: string;
    tipo: string;
  };
  movilidad_id: {
    denominacion: string;
  };
  detalles: any[];
  recursos: TransferenciaRecurso[];
}

export interface RecepcionTransferenciasProps {
  transferencias: Transferencia[]; 
}

export interface RecepcionOrdenProps {
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