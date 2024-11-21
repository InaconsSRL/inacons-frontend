
export interface ListSolicitudesComprasResponse {
  listSolicitudesCompras: SolicitudCompra[];
}

export interface ListSolicitudCompraRecursosResponse {
  listSolicitudCompraRecursosBySolicitudId: SolicitudCompraRecurso[];
}

export interface SolicitudCompra {
  id: string;
  requerimiento_id: {
    id: string;
    presupuesto_id: string | null;
    fecha_solicitud: string;
    fecha_final: string;
    estado_atencion: string;
    sustento: string;
    obra_id: string;
    codigo: string;
  };
  usuario_id: {
    apellidos: string;
    nombres: string;
    id: string;
  };
  fecha: string;
}

export interface SolicitudCompraRecurso {
  id: string;
  solicitud_compra_id: string;
  cantidad: number;
  costo: number;
  recurso_id: {
    codigo: string;
    nombre: string;
    descripcion: string;
    precio_actual: number;
    vigente: boolean;
    imagenes: { file: string }[];
  };
}