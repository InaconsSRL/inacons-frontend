export interface ConsumoRecursoResponse {
  id: string;
  consumo_id: {
    id: string;
  };
  recurso_id: {
    id: string;
    codigo: string;
  };
  cantidad: number;
  costo: number;
  obra_bodega_id: {
    obra_id: {
      nombre: string;
      id: string;
    };
    id: string;
    nombre: string;
  };
  observaciones?: string;
}

export interface AddConsumoRecursoInput {
  consumo_id: string;
  recurso_id: string;
  cantidad: number;
  costo: number;
  obra_bodega_id: string;
  observaciones?: string;
}

export interface UpdateConsumoRecursoInput extends AddConsumoRecursoInput {
  id: string;
}

export interface ConsumoRecursoState {
  consumoRecursos: ConsumoRecursoResponse[];
  loading: boolean;
  error: string | null;
}
