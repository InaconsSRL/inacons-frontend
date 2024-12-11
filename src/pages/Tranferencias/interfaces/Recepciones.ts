export interface TransferenciaDetalle {
    id: number;
    codigo: string;
    nombre: string;
    unidad: string;
    cantidadTransferida: number;
    fechaLimite: string;
    cantidadRecibida?: number;
    imagen?: string;
}

export interface RecepcionTransferencia {
    ordenTransferencia: string;
    numeroSolicitud: string;
    almacenSalida: string;
    almacenDestino: string;
    estado: string;
    tipoTransporte: string;
    observaciones: string;
    fechaEmision: string;
    detalles: TransferenciaDetalle[];
}
