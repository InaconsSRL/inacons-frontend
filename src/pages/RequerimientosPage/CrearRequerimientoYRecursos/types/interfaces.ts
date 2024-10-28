export interface Recurso {
  id: string;
  codigo: string;
  nombre: string;
  unidad_id: string;
  cantidad: number;
  precio_actual: number;
  requerimiento_id: string;
  imagenes: { file: string }[];
}

export interface RequerimientoRecurso {
  id: string;
  recurso_id: string;
  cantidad: number;
}

export interface Requerimiento {
  id: string;
  codigo?: string;
  usuario_id: string;
  obra_id: string;
  fecha_final: Date;
  sustento: string;
}

export interface RequerimientoFormData {
  usuario_id: string;
  obra_id: string;
  fecha_final: Date;
  sustento: string;
  
}

export interface ProductListProps {
  requerimiento_id: string;
}

export interface SelectedProductsProps {
  requerimiento_id: string;
}

export interface ProductCardProps extends Recurso {
  requerimiento_id: string;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}