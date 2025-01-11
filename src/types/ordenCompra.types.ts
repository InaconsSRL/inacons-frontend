export interface Proveedor {
  ruc: string;
  razonSocial: string;
  direccion: string;
  ciudad: string;
  fonos: string;
  contacto: string;
  email: string;
  formaPago: string;
}

export interface DatosBancarios {
  banco: string;
  nroCta: string;
  tipoMoneda: string;
}

export interface DatosFacturacion {
  rSocial: string;
  ruc: string;
  giro: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  fono: string;
  email: string;
}

export interface DatosDespacho {
  obra: string;
  despacho: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  fono: string;
  email: string;
}

export interface OrdenCompraExtendidaType {
  id: string;
  codigo_orden: string;
  descripcion: string;
  fecha_ini: string;
  fecha_fin: string;
  obra: string;
  fechaEmision: string;
  fechaEntrega: string;
  moneda: string;
  cambio: number;
  solicitante: string;
  proveedor: Proveedor;
  datosBancarios: DatosBancarios[];
  datosFacturacion: DatosFacturacion;
  datosDespacho: DatosDespacho;
}

export interface RecursoExtendidoType {
  id: string;
  id_recurso: {
    codigo: string;
    nombre: string;
    unidad_id: string;
  };
  cantidad: number;
  costo_real: number;
  costo_aproximado: number;
  estado: string;
  notas: string;
  precio: number;
  descuento: number;
  subTotal: number;
  sr: string;
}

export interface Unidad {
  id: string;
  nombre: string;
}
