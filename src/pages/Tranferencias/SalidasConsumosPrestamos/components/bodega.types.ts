export interface Recurso {
  id: string;
  nombre: string;
  codigo: string;
  unidad_id: string;
  tipo_recurso_id?: string;
  precio_actual: number;
  imagenes: { recurso_id: string }[]; //modificar esto cuando haya imagenes con "FILE"
}

export interface ObraBodega {
  id: string;
  nombre: string;
  codigo: string;
  estado: string;
}

export interface RecursoObra {
  id: string;
  obra_bodega_id: ObraBodega;
  recurso_id: Recurso;
  cantidad: number;
  costo: number;
  estado: string;
}

export interface SelectedRecurso {
  cantidad: number;
  recurso: RecursoObra;
}

export interface SelectedRecursosProps {
  selectedRecursos: Record<string, SelectedRecurso>;
  onUpdateCantidad: (recursoId: string, cantidad: number) => void;
  onRemoveRecurso: (recursoId: string) => void;
  onProcesar: () => void;
  isProcessing: boolean;
  error: string | null;
}

export interface RecursosListProps {
  recursos: RecursoObra[];
  selectedRecursos: Record<string, SelectedRecurso>;
  onAddRecurso: (recurso: RecursoObra, cantidad: number) => void;
}

export interface RecursoCardProps {
  recurso: RecursoObra;
  isSelected: boolean;
  onAdd: (recurso: RecursoObra, cantidad: number) => void;
}
