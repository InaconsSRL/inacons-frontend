export interface AlmacenData {
  id: string;
  nombre: string;
  estado?: string;
  direccion?: string;
}

export interface UsuarioData {
  id: string;
  nombres: string;
  apellidos: string;
}

export interface RecursoData {
  id: string;
  codigo: string;
  nombre: string;
  unidad_id: string;
  precio_actual: number;
}

export interface RecursoSeleccionado {
  recurso_id: RecursoData;
  cantidad: number;
  cantidadSeleccionada: number;
  isChecked: boolean;
}

export interface SolicitudAlmacen {
  id: string;
  usuario_id: UsuarioData;
  almacen_origen_id: AlmacenData;
  almacen_destino_id?: AlmacenData;
  fecha: string;
  requerimiento_id: {
    id: string;
    codigo: string;
    obra_id: string;
  };
}

export interface OrdenTransferenciaProps {
  onClose: () => void;
  transferenciasId?: string | null;
  recursos: RecursoSeleccionado[];
  solicitudData: {
    id: string;
    almacenOrigen: AlmacenData;
    almacenDestino?: AlmacenData;
    usuario: UsuarioData;
  };
}

// recursos de transferencia
export interface TransferenciaRecurso {
  id: string;
  transferencia_id: string; 
  cantidad: number; }
