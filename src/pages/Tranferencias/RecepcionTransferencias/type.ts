export interface ModalProps {
    onClose: () => void;
}

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
        unidad_id: string
        imagenes?: { file: string }[];
    };
    cantidad: number;
    costo: number;
    cantidadModificada?: number;
}

export interface Unidades2 {
    id: string;
    nombre: string;
}

export interface Obra {
    nombre: string;
    _id: string;
}

export interface ObraInfo {
    referencia_id: {
        obra_destino_id: Obra;
        obra_origen_id: Obra;
    }
}