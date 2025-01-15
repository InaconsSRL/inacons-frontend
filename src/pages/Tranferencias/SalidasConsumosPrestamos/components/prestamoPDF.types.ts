// prestamoPDF.types.ts

export interface RecursoPrestamoType {
    id: string;
    recurso_id: {
      id: string;
      nombre: string;
      codigo: string;
      unidad_id: string;
    };
    cantidad: number;
    estado: string;
    observaciones: string[]; // Cambiado de observacion a observaciones[]
  }
  
  export interface PrestamoDocumentType {
    codigo: string;
    fecha_emision: Date;
    fecha_retorno: Date;
    obra: {
      id: string;
      nombre: string;
      ubicacion: string;
    };
    almacenero: {
      id: string;
      nombres: string;
      apellidos: string;
      dni: string;
    };
    empleado: {
      id: string;
      nombres: string;
      apellidos: string;
      dni: string;
    };
    supervisor: {
      id: string;
      nombres: string;
      apellidos: string;
    };
    recursos: RecursoPrestamoType[];
  }
  
  export interface PrestamoPDFGeneratorProps {
    prestamo: PrestamoDocumentType;
  }
  
  export interface PrestamoPDFWrapperProps {
    recursosRetornables: Array<{
      recurso: {
        id: string;
        recurso_id: {
          id: string;
          nombre: string;
          codigo: string;
          unidad_id: string;
        };
      };
      cantidad: number;
      observacion?: string;
    }>;
    almaceneroData: {
      id: string;
      nombres: string;
      apellidos: string;
      dni: string;
    };
    empleadoData: {
      id: string;
      nombres: string;
      apellidos: string;
      dni: string;
    };
    supervisorData: {
      id: string;
      nombres: string;
      apellidos: string;
    };
    obraData: {
      id: string;
      nombre: string;
      ubicacion: string;
    };
    fechaRetorno: Date;
  }