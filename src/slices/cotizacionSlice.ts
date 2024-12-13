import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listCotizacionesService,
  getCotizacionService,
  addCotizacionService,
  updateCotizacionService,
  deleteCotizacionService 
} from '../services/cotizacionService';

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
}

interface Requerimiento {
  id: string;
  usuario: string;
  estado_atencion: string;
  codigo: string;
  fecha_final: string;
  fecha_solicitud: string;
  sustento: string;
}

interface SolicitudCompra {
  id: string;
  usuario_id: Usuario;
  requerimiento_id: Requerimiento;
}

interface Cotizacion {
  id: string;
  codigo_cotizacion: string;
  usuario_id: Usuario;
  solicitud_compra_id: SolicitudCompra;
  aprobacion: boolean;
  estado: string;
  fecha: string;
}

export interface CotizacionRecurso {
  id: string;
  cantidad: number;
  atencion: string;
  costo: number;
  total: number;
  cotizacion_id: {
    codigo_cotizacion: string;
    aprobacion: string;
  };
  
  recurso_id: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    fecha: string;
    cantidad: number;
    precio_actual: number;
    vigente: boolean;
    unidad_id: string;
    imagenes: {
      file: string;
    }[];
  };
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

export const fetchCotizaciones = createAsyncThunk(
  'cotizacion/fetchCotizaciones',
  async (_, { rejectWithValue }) => {
    try {
      return await listCotizacionesService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getCotizacion = createAsyncThunk(
  'cotizacion/getCotizacion',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getCotizacionService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);


export const addCotizacion = createAsyncThunk(
  'cotizacion/addCotizacion',
  async (data: { usuario_id: string; codigo_cotizacion?: string; estado?: string; fecha?:string; aprobacion?:boolean }, { rejectWithValue }) => {
    try {
      const completeData = {
        usuario_id: data.usuario_id,
        codigo_cotizacion: data.codigo_cotizacion || '',
        estado: data.estado || 'PENDIENTE',
        fecha: data.fecha || new Date().toISOString(),
        aprobacion: data.aprobacion || false
      };
      return await addCotizacionService(completeData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCotizacion = createAsyncThunk(
  'cotizacion/updateCotizacion',
  async (data: {
    id: string;
    solicitud_compra_id?: string;
    aprobacion?: boolean;
    estado?: string;
    fecha?: Date;
    usuario_id?: string;
    codigo_cotizacion?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateCotizacionService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCotizacion = createAsyncThunk(
  'cotizacion/deleteCotizacion',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteCotizacionService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const cotizacionSlice = createSlice({
  name: 'cotizacion',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(updateCotizacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCotizacion.fulfilled, (state, action: PayloadAction<Cotizacion>) => {
        state.loading = false;
        const index = state.cotizaciones.findIndex(cot => cot.id === action.payload.id);
        if (index !== -1) {
          state.cotizaciones[index] = action.payload;
        }
      })
      .addCase(updateCotizacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCotizacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCotizacion.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.cotizaciones = state.cotizaciones.filter(cot => cot.id !== action.payload.id);
      })
      .addCase(deleteCotizacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = cotizacionSlice.actions;
export const cotizacionReducer = cotizacionSlice.reducer;
