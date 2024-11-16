import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listCotizacionesService,
  addCotizacionService,
  updateCotizacionService,
  getCotizacionService,
  deleteCotizacionService,
} from '../services/cotizacionService';

// Definir interfaces
interface Proveedor {
  id: string;
  razon_social: string;
  ruc: string;
  direccion: string;
  nombre_comercial: string;
}

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
}

interface Requerimiento {
  id: string;
  presupuesto_id: string;
  fecha_solicitud: string;
  fecha_final: string;
  estado_atencion: string;
  sustento: string;
  obra_id: string;
  codigo: string;
  usuario_id: string;
  usuario: string;
}

interface SolicitudCompra {
  id: string;
  fecha: string;
  requerimiento_id: Requerimiento;
  usuario_id: Usuario;
}

export interface Cotizacion {
  id: string;
  aprobacion: boolean;
  codigo_cotizacion: string;
  proveedor_id: Proveedor;
  solicitud_compra_id: SolicitudCompra;
  usuario_id: Usuario;
}

interface CotizacionState {
  cotizaciones: Cotizacion[];
  selectedCotizacion: Cotizacion | null;
  loading: boolean;
  error: string | null;
}

const initialState: CotizacionState = {
  cotizaciones: [],
  selectedCotizacion: null,
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Thunks
export const fetchCotizaciones = createAsyncThunk(
  'cotizacion/fetchCotizaciones',
  async (_, { rejectWithValue }) => {
    try {
      return await listCotizacionesService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addCotizacion = createAsyncThunk(
  'cotizacion/addCotizacion',
  async (
    cotizacionData: {
      codigo_cotizacion: string;
      proveedor_id: string;
      usuario_id: string;
      solicitud_compra_id: string;
      aprobacion: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      return await addCotizacionService(cotizacionData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateCotizacion = createAsyncThunk(
  'cotizacion/updateCotizacion',
  async (
    cotizacion: {
      id: string;
      codigo_cotizacion: string;
      proveedor_id: string;
      usuario_id: string;
      solicitud_compra_id: string;
      aprobacion: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      return await updateCotizacionService(cotizacion);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const getCotizacion = createAsyncThunk(
  'cotizacion/getCotizacion',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getCotizacionService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteCotizacion = createAsyncThunk(
  'cotizacion/deleteCotizacion',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteCotizacionService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const cotizacionSlice = createSlice({
  name: 'cotizacion',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cotizaciones
      .addCase(fetchCotizaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCotizaciones.fulfilled, (state, action: PayloadAction<Cotizacion[]>) => {
        state.loading = false;
        state.cotizaciones = action.payload;
      })
      .addCase(fetchCotizaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Cotizacion
      .addCase(addCotizacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCotizacion.fulfilled, (state, action: PayloadAction<Cotizacion>) => {
        state.loading = false;
        state.cotizaciones.push(action.payload);
      })
      .addCase(addCotizacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Cotizacion
      .addCase(updateCotizacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCotizacion.fulfilled, (state, action: PayloadAction<Cotizacion>) => {
        state.loading = false;
        const index = state.cotizaciones.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.cotizaciones[index] = action.payload;
        }
      })
      .addCase(updateCotizacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Cotizacion
      .addCase(getCotizacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCotizacion.fulfilled, (state, action: PayloadAction<Cotizacion>) => {
        state.loading = false;
        state.selectedCotizacion = action.payload;
      })
      .addCase(getCotizacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Cotizacion
      .addCase(deleteCotizacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCotizacion.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.cotizaciones = state.cotizaciones.filter((c) => c.id !== action.payload.id);
      })
      .addCase(deleteCotizacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const cotizacionReducer = cotizacionSlice.reducer;