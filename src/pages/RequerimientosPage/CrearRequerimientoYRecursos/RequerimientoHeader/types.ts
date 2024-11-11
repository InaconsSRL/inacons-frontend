export interface UsuarioCargo {
  id: string;
  nombres: string;
  apellidos: string;
  dni: number;
  usuario: string;
  rol_id: string | null;
  cargo_id: {
    id: string;
    nombre: string;
    descripcion: string;
    gerarquia: number;
  };
}

export interface Requerimiento {
  id: string;
  usuario_id: string;
  obra_id: string;
  fecha_final: string;
  sustento: string;
  codigo: string;
  usuario: string;
  estado_atencion: string;
}

export interface FormData {
  usuario_id: string;
  obra_id: string;
  fecha_final: string;
  sustento: string;
  codigo: string;
}