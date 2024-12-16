import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listPrestamosService,
  addPrestamoService,
  updatePrestamoService,
  deletePrestamoService,
} from '../services/prestamoService';

// Enums
export enum EstadoPrestamo {
  PENDIENTE = 'pendiente',
  EN_USO = 'en_uso',
  RETORNADO = 'retornado',
  VENCIDO = 'vencido'
}

// Interfaces
interface Cargo {
  id: string;
  nombre: string;
}

interface Personal {
  id: string;
  cargo: Cargo;
  nombres: string;
}

interface Movimiento {
  id: string;
  tipo: string;
}

interface Usuario {
  id: string;
  nombres: string;
  rol_id: string;
  cargo_id: {
    id: string;
  };
}

interface Almacen {
  id: string;
  nombre: string;
  tipo_almacen_id: string;
}

export interface Prestamo {
  id: string;
  movimiento_id: Movimiento;
  personal_id: Personal;
  usuario_id: Usuario;
  fecha: string;
  f_retorno: string;
  estado: EstadoPrestamo;
  almacen_id: Almacen;
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
  'prestamos/fetchPrestamos',
  async (_, { rejectWithValue }) => {
    try {
      return await listPrestamosService();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const addPrestamo = createAsyncThunk(
  'prestamos/addPrestamo',
  async (prestamoData: {
    movimiento_id: string;
    personal_id: string;
    usuario_id: string;
    fecha: Date;
    f_retorno: Date;
    estado: EstadoPrestamo;
    almacen_id: string;
  }, { rejectWithValue }) => {
    try {
      return await addPrestamoService(prestamoData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const updatePrestamo = createAsyncThunk(
  'prestamos/updatePrestamo',
  async (prestamoData: {
    id: string;
    movimiento_id?: string;
    personal_id?: string;
    usuario_id?: string;
    fecha?: Date;
    f_retorno?: Date;
    estado?: EstadoPrestamo;
    almacen_id?: string;
  }, { rejectWithValue }) => {
    try {
      return await updatePrestamoService(prestamoData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const deletePrestamo = createAsyncThunk(
  'prestamos/deletePrestamo',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deletePrestamoService(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

// Slice
const prestamoSlice = createSlice({
  name: 'prestamos',
  initialState,
  reducers: {},
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
      .addCase(addPrestamo.fulfilled, (state, action: PayloadAction<Prestamo>) => {
        state.prestamos.push(action.payload);
      })
      // Update prestamo
      .addCase(updatePrestamo.fulfilled, (state, action: PayloadAction<Prestamo>) => {
        const index = state.prestamos.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.prestamos[index] = action.payload;
        }
      })
      // Delete prestamo
      .addCase(deletePrestamo.fulfilled, (state, action: PayloadAction<string>) => {
        state.prestamos = state.prestamos.filter(p => p.id !== action.payload);
      });
  },
});

export default prestamoSlice.reducer;
