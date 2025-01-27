import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listClasesService,
  getClaseService,
  addClaseService,
  updateClaseService,
  deleteClaseService
} from '../services/claseService';

interface Clase {
  id_clase: string;
  nombre: string;
}

interface ClaseState {
  clases: Clase[];
  selectedClase: Clase | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClaseState = {
  clases: [],
  selectedClase: null,
  loading: false,
  error: null,
};

export const fetchClases = createAsyncThunk(
  'clase/fetchClases',
  async (_, { rejectWithValue }) => {
    try {
      return await listClasesService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getClase = createAsyncThunk(
  'clase/getClase',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getClaseService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addClase = createAsyncThunk(
  'clase/addClase',
  async (nombre: string, { rejectWithValue }) => {
    try {
      return await addClaseService(nombre);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateClase = createAsyncThunk(
  'clase/updateClase',
  async (data: { idClase: string; nombre?: string }, { rejectWithValue }) => {
    try {
      return await updateClaseService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteClase = createAsyncThunk(
  'clase/deleteClase',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteClaseService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const claseSlice = createSlice({
  name: 'clase',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClases.fulfilled, (state, action: PayloadAction<Clase[]>) => {
        state.loading = false;
        state.clases = action.payload;
      })
      .addCase(fetchClases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getClase.fulfilled, (state, action: PayloadAction<Clase>) => {
        state.loading = false;
        state.selectedClase = action.payload;
      })
      .addCase(addClase.fulfilled, (state, action: PayloadAction<Clase>) => {
        state.loading = false;
        state.clases.push(action.payload);
      })
      .addCase(updateClase.fulfilled, (state, action: PayloadAction<Clase>) => {
        state.loading = false;
        const index = state.clases.findIndex(clase => clase.id_clase === action.payload.id_clase);
        if (index !== -1) {
          state.clases[index] = action.payload;
        }
      })
      .addCase(deleteClase.fulfilled, (state, action: PayloadAction<Clase>) => {
        state.loading = false;
        state.clases = state.clases.filter(clase => clase.id_clase !== action.payload.id_clase);
      });
  },
});

export const { clearErrors } = claseSlice.actions;
export const claseReducer = claseSlice.reducer;
