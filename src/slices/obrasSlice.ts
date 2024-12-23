import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { listObrasService, addObraService, updateObraService, getObraService } from '../services/obraService';

// Interfaces
interface TipoObra {
  id: string;
  nombre: string;
}

interface ObraBase {
  titulo: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  direccion: string;
  estado: string;
}

interface ObraInput extends ObraBase {
  tipoId: string;
}

interface Obra extends ObraBase {
  id: string;
  tipo_id: TipoObra;
}

interface ObraState {
  obras: Obra[];
  selectedObra: Obra | null;
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: ObraState = {
  obras: [],
  selectedObra: null,
  loading: false,
  error: null,
};

// Función auxiliar para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Thunks
export const fetchObras = createAsyncThunk(
  'obra/fetchObras',
  async (_, { rejectWithValue }) => {
    try {
      return await listObrasService();
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const addObra = createAsyncThunk(
  'obra/addObra',
  async (obraData: ObraInput, { rejectWithValue }) => {
    try {
      return await addObraService(obraData);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateObra = createAsyncThunk(
  'obra/updateObra',
  async (obra: ObraInput & { id: string }, { rejectWithValue }) => {
    try {
      return await updateObraService(obra);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const getObra = createAsyncThunk(
  'obra/getObra',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getObraService(id);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Slice
const obraSlice = createSlice({
  name: 'obra',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchObras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchObras.fulfilled, (state, action: PayloadAction<Obra[]>) => {
        state.loading = false;
        state.obras = action.payload;
      })
      .addCase(fetchObras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addObra.fulfilled, (state, action: PayloadAction<Obra>) => {
        state.obras.push(action.payload);
      })
      .addCase(updateObra.fulfilled, (state, action: PayloadAction<Obra>) => {
        const index = state.obras.findIndex(obra => obra.id === action.payload.id);
        if (index !== -1) {
          state.obras[index] = action.payload;
        }
      })
      .addCase(getObra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getObra.fulfilled, (state, action: PayloadAction<Obra>) => {
        state.loading = false;
        state.selectedObra = action.payload;
      })
      .addCase(getObra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const obraReducer = obraSlice.reducer;