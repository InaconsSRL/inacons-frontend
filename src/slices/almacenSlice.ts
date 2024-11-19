import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listAlmacenesService, addAlmacenService, updateAlmacenService, deleteAlmacenService, getAlmacenService } from '../services/almacenService';

// Interfaces
interface Almacen {
  id: string;
  nombre: string;
  ubicacion: string;
  direccion: string;
  estado: boolean;
  obra_id: string;
  tipo_almacen_id: string;
}

interface AlmacenUpdate {
  id: string;
  nombre?: string;
  ubicacion?: string;
  direccion?: string;
  estado?: boolean;
  obra_id?: string;
  tipo_almacen_id?: string;
}

interface AlmacenState {
  almacenes: Almacen[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: AlmacenState = {
  almacenes: [],
  loading: false,
  error: null,
};

// Función auxiliar para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Thunks
export const fetchAlmacenes = createAsyncThunk(
  'almacen/fetchAlmacenes',
  async (_, { rejectWithValue }) => {
    try {
      return await listAlmacenesService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const getAlmacen = createAsyncThunk(
    'almacen/getAlmacen',
    async (id: string, { rejectWithValue }) => {
        try {
        return await getAlmacenService(id);
        } catch (error) {
        return rejectWithValue(handleError(error));
        }
    }
    );

export const addAlmacen = createAsyncThunk(
  'almacen/addAlmacen',
  async (almacenData: { 
    nombre: string; 
    ubicacion: string;
    direccion: string;
    estado: boolean;
    obra_id: string;
    tipo_almacen_id: string;
  }, { rejectWithValue }) => {
    try {
      return await addAlmacenService(almacenData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateAlmacen = createAsyncThunk(
  'almacen/updateAlmacen',
  async (almacen: Required<AlmacenUpdate>, { rejectWithValue }) => {
    try {
      return await updateAlmacenService(almacen);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const deleteAlmacen = createAsyncThunk(
  'almacen/deleteAlmacen',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteAlmacenService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const almacenSlice = createSlice({
  name: 'almacen',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlmacenes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlmacenes.fulfilled, (state, action: PayloadAction<Almacen[]>) => {
        state.loading = false;
        state.almacenes = action.payload;
      })
      .addCase(fetchAlmacenes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAlmacen.fulfilled, (state, action: PayloadAction<Almacen>) => {
        state.almacenes.push(action.payload);
      })
      .addCase(updateAlmacen.fulfilled, (state, action: PayloadAction<Almacen>) => {
        const index = state.almacenes.findIndex(almacen => almacen.id === action.payload.id);
        if (index !== -1) {
          state.almacenes[index] = action.payload;
        }
      })
      .addCase(deleteAlmacen.fulfilled, (state, action: PayloadAction<Almacen>) => {
        state.almacenes = state.almacenes.filter(almacen => almacen.id !== action.payload.id);
      })
      .addCase(getAlmacen.fulfilled, (state, action: PayloadAction<Almacen>) => {
        const index = state.almacenes.findIndex(almacen => almacen.id === action.payload.id);
        if (index !== -1) {
          state.almacenes[index] = action.payload;
        } else {
          state.almacenes.push(action.payload);
        }
      });
  },
});

export const almacenReducer = almacenSlice.reducer;