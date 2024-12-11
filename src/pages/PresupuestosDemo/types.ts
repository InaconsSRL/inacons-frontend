export interface CostoUnitario {
    id_costounitario: string;
    descripcion_costo: string;
    numeracion_costo: string;
    parcial_costo: number;
    id_presupuesto: string;
    id_costopadre: string | null;
    estado_expandido: string;
    id_unidad: string;
    cantidad: number;
    costo_unitario: number;
    
    // ... otros campos según necesites
}

export interface CostoUnitarioNode extends CostoUnitario {
    children: CostoUnitarioNode[];
    level: number;
    nombre_presupuesto: string;
    isPresupuestoRoot?: boolean;
}

export interface DataBase {
    clase: { 
        id_clase: string;
        descripcion_clase: string;
        codigo_clase: string;
    }[];
    subtotal_costounitario: {
        id_subtotal: string;
        id_costounitario: string;
        id_tipocosto: string;
        subtotal: number;
        numeracion_subtotal: null;
        id_composicionpadre: null;
        estado_expandido: string;
        factor_cantidad: number;
    }[];
    composicion_costounitario: Composicion[];
    unidad: Unidad[];
    costo_unitario: CostoUnitario[];
    presupuesto: Presupuesto[];
    unidad_tipocostonew: UnidadTipoCosto[];
    tipo_costo: TipoCosto[];
    // ...resto de propiedades...
}

export interface Composicion {
    id_composicion: string;
    id_subtotal: string;
    cantidad_composicion: number;
    costo_composicion: number;
    parcial_composicion: number;
    descripcion_composicion: string;
    id_unidad: string;
    magnitud_unidadcomposicion?: number;
}

export interface Presupuesto {
    id_presupuesto: string;
    nombre_presupuesto: string;
}

export interface TipoCosto {
    id_tipocosto: string;
    descripcion_tipocosto: string;
}

export interface UnidadTipoCosto {
    id_unidad: string;
    id_tipocosto: string;
}

export interface Unidad {
    id_unidad: string;
    abreviatura_unidad: string;
}