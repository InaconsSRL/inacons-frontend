import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listSolicitudAlmacenesService, 
  addSolicitudAlmacenService, 
  updateSolicitudAlmacenService, 
  deleteSolicitudAlmacenService 
} from '../services/solicitudAlmacenService';

// Interfaces para los datos completos
interface AlmacenData {
  id: string;
  nombre: string;
  estado?: string;
  direccion?: string;
}

interface UsuarioData {
  id: string;
  nombres: string;
  apellidos: string;
}

interface RequerimientoData {
  id: string;
  codigo: string;
  estado_atencion: string;
  fecha_final: string;
  fecha_solicitud: string;
  obra_id: string;
  presupuesto_id: string;
  sustento: string;
  usuario_id: string;
}

// Interface para la solicitud con datos completos (usado en queries)
interface SolicitudAlmacenResponse {
  id: string;
  usuario_id: UsuarioData;
  requerimiento_id: RequerimientoData;
  almacen_origen_id: AlmacenData;
  almacen_destino_id: AlmacenData;
  fecha: string;
  estado: string;
}

// Interface para las mutations (cuando enviamos datos)
interface SolicitudAlmacenInput {
  usuario_id: string;
  requerimiento_id: string;
  almacen_origen_id: string;
  fecha: Date;
  estado: string;
}

interface SolicitudAlmacenState {
  solicitudes: SolicitudAlmacenResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: SolicitudAlmacenState = {
  solicitudes: [],
  loading: false,
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchSolicitudAlmacenes = createAsyncThunk(
  'solicitudAlmacen/fetchSolicitudAlmacenes',
  async (_, { rejectWithValue }) => {
    try {
      return await listSolicitudAlmacenesService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addSolicitudAlmacen = createAsyncThunk(
  'solicitudAlmacen/addSolicitudAlmacen',
  async (solicitudData: SolicitudAlmacenInput, { rejectWithValue }) => {
    try {
      return await addSolicitudAlmacenService(solicitudData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateSolicitudAlmacen = createAsyncThunk(
  'solicitudAlmacen/updateSolicitudAlmacen',
  async (solicitudData: SolicitudAlmacenInput & { updateSolicitudAlmacenId: string }, { rejectWithValue }) => {
    try {
      return await updateSolicitudAlmacenService(solicitudData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteSolicitudAlmacen = createAsyncThunk(
  'solicitudAlmacen/deleteSolicitudAlmacen',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteSolicitudAlmacenService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

const solicitudAlmacenSlice = createSlice({
  name: 'solicitudAlmacen',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolicitudAlmacenes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolicitudAlmacenes.fulfilled, (state, action: PayloadAction<SolicitudAlmacenResponse[]>) => {
        state.loading = false;
        state.solicitudes = action.payload;
      })
      .addCase(fetchSolicitudAlmacenes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addSolicitudAlmacen.fulfilled, (state, action: PayloadAction<SolicitudAlmacenResponse>) => {
        state.solicitudes.push(action.payload);
      })
      .addCase(updateSolicitudAlmacen.fulfilled, (state, action: PayloadAction<SolicitudAlmacenResponse>) => {
        const index = state.solicitudes.findIndex(sol => sol.id === action.payload.id);
        if (index !== -1) {
          state.solicitudes[index] = action.payload;
        }
      })
      .addCase(deleteSolicitudAlmacen.fulfilled, (state, action: PayloadAction<string>) => {
        state.solicitudes = state.solicitudes.filter(sol => sol.id !== action.payload);
      });
  },
});

export const solicitudAlmacenReducer = solicitudAlmacenSlice.reducer;
