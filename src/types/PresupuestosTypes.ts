// PRY - ID Format: PRY0000000001
export interface IProyecto {
    id_proyecto: string;
    id_usuario: string;
    id_infraestructura: string;
    nombre_proyecto: string;
    id_departamento: string;
    id_provincia: string;
    id_distrito: string;
    id_localidad?: string;
    total_proyecto?: number;
    estado: string;
    fecha_creacion: string;
    cliente: string;
    empresa: string;
    plazo: number;
    ppto_base: number;
    ppto_oferta: number;
    jornada: number;
  }

// PTO - ID Format: PTO0000000001
export interface IPresupuesto {
    id_presupuesto: string;
  id_proyecto: string;
  costo_directo: number;
  fecha_creacion: string;
  monto_igv: number;
  monto_utilidad: number;
  nombre_presupuesto: string;
  numeracion_presupuesto: number;
  parcial_presupuesto: number;
  observaciones: string;
  porcentaje_igv: number;
  porcentaje_utilidad: number;
  plazo: number;
  ppto_base: number;
  ppto_oferta: number;
  total_presupuesto: number;
}

// TIT - ID Format: TIT0000000001
export interface ITitulo {
    id_titulo: string;
    id_presupuesto: string;
    id_titulo_padre: string | null;
    id_titulo_plantilla: string | null;
    id_detalle_partida: string | null; // Nuevo campo
    detallePartida?: IDetallePartida; // Nuevo campo opcional
    item: string;
    descripcion: string;
    parcial: number;
    fecha_creacion: string;
    especialidad_id: string;
    nivel: number;
    orden: number;
    tipo: 'TITULO' | 'PARTIDA';
}

//DTP - ID Format: DPT0000000001
export interface IDetallePartida {
    id_detalle_partida: string;
    id_unidad: string;
    metrado: number;
    precio: number;
    jornada: number;
}

// APU - ID Format: APU0000000001
export interface IComposicionApu {
    id_composicion_apu: string;
    id_titulo: string;
    id_rec_comp_apu: string;
    rec_comp_apu?: IRecursoComposicionApu;
    cuadrilla: number;
    cantidad: number;
}

// RCA - ID Format: RCA0000000001
export interface IRecursoComposicionApu {
    id_rec_comp_apu: string;
    id_recurso: string;
    recurso?: IRecurso;
    id_unidad: string;
    unidad?: IUnidad;
    nombre: string;
    especificaciones?: string;
    descripcion?: string;
    fecha_creacion: string;
    precio_recurso_proyecto?: IPrecioRecursoProyecto;
}

// PRP - ID Format: PRP0000000001
export interface IPrecioRecursoProyecto {
    id_prp: string;
    id_proyecto: string;
    id_rec_comp_apu: string;
    precio: number;
}

// REC - ID Format: REC0000000001
export interface IRecurso {
    id_recurso: string;
    id_unidad: string;
    id_clase: string;
    id_tipo: string;
    tipo?: ITipo;
    id_recurso_app: string;
    nombre: string;
    precio_referencial: number;
    fecha_actualizacion: string; // Cambiado de Date a string
}

// UND - ID Format: UND0000000001
export interface IUnidad {
    id_unidad: string;
    abreviatura_unidad: string;
    descripcion: string;
}

// CLS - ID Format: CLS0000000001
export interface IClase {
    id_clase: string;
    nombre: string;
}

// TIP - ID Format: TIP0000000001
export interface ITipo {
    id_tipo: string;
    descripcion: string;
    codigo: string;
}

// INF - ID Format: INF0000000001
export interface IInfraestructura {
    id_infraestructura: string;
    nombre_infraestructura: string;
    tipo_infraestructura: string;
    descripcion: string;    
}

// DEP - ID Format: DEP0000000001
export interface IDepartamento {
    id_departamento: string;
    nombre_departamento: string;
    ubigeo: string;
}

// PRV - ID Format: PRV0000000001
export interface IProvincia {
    id_provincia: string;
    id_departamento: string;
    nombre_provincia: string;
}

// DST - ID Format: DST0000000001
export interface IDistrito {
    id_distrito: string;
    id_provincia: string;
    nombre_distrito: string;
}

// LCL - ID Format: LCL0000000001
export interface ILocalidad {
    id_localidad?: string;
    id_distrito: string;
    nombre_localidad: string;
}

// ESP - ID Format: ESP0000000001
export interface IEspecialidad {
    especialidad_id: string;
    nombre: string;
    descripcion: string;
}
