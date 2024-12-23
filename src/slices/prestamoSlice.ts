import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listPrestamosService, 
  addPrestamoService, 
  updatePrestamoService, 
  deletePrestamoService 
} from '../services/prestamoService';

// Interfaces
interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
}

interface ObraBodega {
  id: string;
  nombre: string;
  estado: string;
}

interface TransferenciaDetalle {
  id: string;
  referencia_id?: string;
  fecha?: Date;
  tipo?: string;
  referencia?: string;
}

interface Prestamo {
  id: string;
  fecha: Date;
  usuario_id: Usuario;
  obra_id: ObraBodega;
  f_retorno: Date;
  estado: string;
  transferencia_detalle_id: TransferenciaDetalle;
  personal_id: string;
}

interface PrestamoState {
  prestamos: Prestamo[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PrestamoState = {
  prestamos: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchPrestamos = createAsyncThunk(
  'prestamo/fetchPrestamos',
  async (_, { rejectWithValue }) => {
    try {
      return await listPrestamosService();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const addPrestamo = createAsyncThunk(
  'prestamo/addPrestamo',
  async (prestamoData: {
    fecha: Date;
    usuarioId: string;
    obraId: string;
    fRetorno: Date;
    estado: string;
    transferenciaDetalleId: string;
    personalId: string;
  }, { rejectWithValue }) => {
    try {
      return await addPrestamoService(prestamoData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const updatePrestamo = createAsyncThunk(
  'prestamo/updatePrestamo',
  async (prestamoData: {
    id: string;
    fecha?: Date;
    usuarioId?: string;
    obraId?: string;
    personalId?: string;
    fRetorno?: Date;
    estado?: string;
    transferenciaDetalleId?: string;
  }, { rejectWithValue }) => {
    try {
      return await updatePrestamoService(prestamoData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const deletePrestamo = createAsyncThunk(
  'prestamo/deletePrestamo',
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePrestamoService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

// Slice
const prestamoSlice = createSlice({
  name: 'prestamo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch prestamos
      .addCase(fetchPrestamos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrestamos.fulfilled, (state, action: PayloadAction<Prestamo[]>) => {
        state.loading = false;
        state.prestamos = action.payload;
      })
      .addCase(fetchPrestamos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add prestamo
      .addCase(addPrestamo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPrestamo.fulfilled, (state, action: PayloadAction<Prestamo>) => {
        state.loading = false;
        state.prestamos.push(action.payload);
      })
      .addCase(addPrestamo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update prestamo
      .addCase(updatePrestamo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrestamo.fulfilled, (state, action: PayloadAction<Prestamo>) => {
        state.loading = false;
        const index = state.prestamos.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.prestamos[index] = action.payload;
        }
      })
      .addCase(updatePrestamo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete prestamo
      .addCase(deletePrestamo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePrestamo.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.prestamos = state.prestamos.filter(p => p.id !== action.payload);
      })
      .addCase(deletePrestamo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = prestamoSlice.actions;
export const prestamoReducer = prestamoSlice.reducer;
