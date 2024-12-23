import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  listObraBodegasService, 
  addObraBodegaService, 
  updateObraBodegaService, 
  deleteObraBodegaService 
} from '../services/obraBodegaService';

interface Obra {
  id: string;
  nombre: string;
  titulo?: string;
}

interface ObraBodega {
  id: string;
  obra_id: Obra;
  codigo: string;
  nombre: string;
  descripcion: string;
  estado: string;
}

interface ObraBodegaState {
  obraBodegas: ObraBodega[];
  loading: boolean;
  error: string | null;
}

const initialState: ObraBodegaState = {
  obraBodegas: [],
  loading: false,
  error: null,
};

export const fetchObraBodegas = createAsyncThunk(
  'obraBodega/fetchObraBodegas',
  async (_, { rejectWithValue }) => {
    try {
      return await listObraBodegasService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addObraBodega = createAsyncThunk(
  'obraBodega/addObraBodega',
  async (bodegaData: {
    obraId: string;
    estado: string;
    codigo?: string;
    nombre?: string;
    descripcion?: string;
  }, { rejectWithValue }) => {
    try {
      return await addObraBodegaService(bodegaData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateObraBodega = createAsyncThunk(
  'obraBodega/updateObraBodega',
  async (bodegaData: {
    updateObraBodegaId: string;
    obraId: string;
    estado: string;
    codigo?: string;
    nombre?: string;
    descripcion?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateObraBodegaService(bodegaData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteObraBodega = createAsyncThunk(
  'obraBodega/deleteObraBodega',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteObraBodegaService(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const obraBodegaSlice = createSlice({
  name: 'obraBodega',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchObraBodegas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchObraBodegas.fulfilled, (state, action: PayloadAction<ObraBodega[]>) => {
        state.loading = false;
        state.obraBodegas = action.payload;
        state.error = null;
      })
      .addCase(fetchObraBodegas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add cases
      .addCase(addObraBodega.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addObraBodega.fulfilled, (state, action: PayloadAction<ObraBodega>) => {
        state.loading = false;
        state.obraBodegas.push(action.payload);
        state.error = null;
      })
      .addCase(addObraBodega.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update cases
      .addCase(updateObraBodega.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateObraBodega.fulfilled, (state, action: PayloadAction<ObraBodega>) => {
        state.loading = false;
        const index = state.obraBodegas.findIndex(bodega => bodega.id === action.payload.id);
        if (index !== -1) {
          state.obraBodegas[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateObraBodega.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete cases
      .addCase(deleteObraBodega.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteObraBodega.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.obraBodegas = state.obraBodegas.filter(bodega => bodega.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteObraBodega.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = obraBodegaSlice.actions;
export const obraBodegaReducer = obraBodegaSlice.reducer;
