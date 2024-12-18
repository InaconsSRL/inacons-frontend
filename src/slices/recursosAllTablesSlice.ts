import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCountRecursosInAllTablesService } from '../services/recursosAllTablesService';

// Actualizamos las interfaces existentes para incluir __typename
interface RecursosCotizacion {
  cantidad: number;
  __typename: 'RecursosCotizacion';
}

interface Cotizacion {
  id: string;
  estado: string;
  recursos_cotizacion: RecursosCotizacion;
  __typename: 'Cotization';
}

interface RecursosProveedor {
  cantidad: number;
}

interface TablaProveedor {
  id: string;
  estado: string;
  recursos_proveedor: RecursosProveedor[];
}

interface RecursosOrden {
  cantidad: number;
}

interface TablaOrdenCompra {
  id: string;
  cotizacion_id: string;
  recursos_orden: RecursosOrden[];
}

interface RecursosTransferencia {
  cantidad: number;
}

interface TablaTransferencia {
  referencia_id: string;
  recursos_transferencia: RecursosTransferencia[];
}

export interface RecursosAllTables {
  recurso_id: string;
  cantidad_solicitud: number | null;
  cotizaciones: Cotizacion[];
  tabla_proveedores: TablaProveedor[];
  tabla_ordenes_compra: TablaOrdenCompra[];
  tabla_transferencias: TablaTransferencia[];
  __typename: 'AllRecursosTotal';
}

interface RecursosAllTablesState {
  // Cambiamos el tipo para que nunca sea null
  recursosData: RecursosAllTables[];
  loading: boolean;
  error: string | null;
}

const initialState: RecursosAllTablesState = {
  // Inicializamos como array vacío en lugar de null
  recursosData: [],
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const getCountRecursosInAllTables = createAsyncThunk<
  RecursosAllTables[],
  string,
  { rejectValue: string }
>('recursosAllTables/getCount', async (solicitudCompraId, { rejectWithValue }) => {
  try {
    const data = await getCountRecursosInAllTablesService(solicitudCompraId);
    if (!Array.isArray(data)) {
      throw new Error('Datos recibidos no son un array');
    }
    return data;
  } catch (error) {
    return rejectWithValue(handleError(error));
  }
});

const recursosAllTablesSlice = createSlice({
  name: 'recursosAllTables',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCountRecursosInAllTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCountRecursosInAllTables.fulfilled, (state, action: PayloadAction<RecursosAllTables[]>) => {
        state.loading = false;
        state.recursosData = action.payload;
      })
      .addCase(getCountRecursosInAllTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error desconocido';
      });
  },
});

export const recursosAllTablesReducer = recursosAllTablesSlice.reducer;
