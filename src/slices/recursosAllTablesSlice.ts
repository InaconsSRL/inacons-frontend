import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCountRecursosInAllTablesService } from '../services/recursosAllTablesService';

interface RecursosCotizacion {
  cantidad: number;
}

interface Cotizacion {
  id: string;
  estado: string;
  recursos_cotizacion: RecursosCotizacion[];
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
  cantidad_solicitud: number;
  cotizaciones: Cotizacion[];
  tabla_proveedores: TablaProveedor[];
  tabla_ordenes_compra: TablaOrdenCompra[];
  tabla_transferencias: TablaTransferencia[];
}

interface RecursosAllTablesState {
  recursosData: RecursosAllTables | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecursosAllTablesState = {
  recursosData: null,
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const getCountRecursosInAllTables = createAsyncThunk(
  'recursosAllTables/getCount',
  async (solicitudCompraId: string, { rejectWithValue }) => {
    try {
      return await getCountRecursosInAllTablesService(solicitudCompraId);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

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
      .addCase(getCountRecursosInAllTables.fulfilled, (state, action: PayloadAction<RecursosAllTables>) => {
        state.loading = false;
        state.recursosData = action.payload;
      })
      .addCase(getCountRecursosInAllTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const recursosAllTablesReducer = recursosAllTablesSlice.reducer;
