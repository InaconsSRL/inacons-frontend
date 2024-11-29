export interface CostoUnitario {
    id_costounitario: string;
    descripcion_costo: string;
    numeracion_costo: string;
    parcial_costo: number;
    id_presupuesto: string;
    id_costopadre: string | null;
    estado_expandido: string;
    // ... otros campos según necesites
}

export interface CostoUnitarioNode extends CostoUnitario {
    children: CostoUnitarioNode[];
    level: number;
}