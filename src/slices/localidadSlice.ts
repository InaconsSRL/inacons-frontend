import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listLocalidadesService,
  getLocalidadService,
  getLocalidadesByDistritoService,
  addLocalidadService,
  updateLocalidadService,
  deleteLocalidadService
} from '../services/localidadService';

export interface Localidad {
  id_localidad: string;
  id_distrito: string;
  nombre_localidad: string;
}

interface LocalidadState {
  localidades: Localidad[];
  selectedLocalidad: Localidad | null;
  loading: boolean;
  error: string | null;
}

const initialState: LocalidadState = {
  localidades: [],
  selectedLocalidad: null,
  loading: false,
  error: null,
};

export const fetchLocalidades = createAsyncThunk(
  'localidad/fetchLocalidades',
  async (_, { rejectWithValue }) => {
    try {
      return await listLocalidadesService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getLocalidadesByDistrito = createAsyncThunk(
  'localidad/getLocalidadesByDistrito',
  async (idDistrito: string, { rejectWithValue }) => {
    try {
      return await getLocalidadesByDistritoService(idDistrito);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getLocalidad = createAsyncThunk(
  'localidad/getLocalidad',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getLocalidadService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addLocalidad = createAsyncThunk(
  'localidad/addLocalidad',
  async (data: { nombreLocalidad: string; idDistrito: string }, { rejectWithValue }) => {
    try {
      return await addLocalidadService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateLocalidad = createAsyncThunk(
  'localidad/updateLocalidad',
  async (data: { idLocalidad: string; nombreLocalidad?: string; idDistrito?: string }, { rejectWithValue }) => {
    try {
      return await updateLocalidadService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteLocalidad = createAsyncThunk(
  'localidad/deleteLocalidad',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteLocalidadService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const localidadSlice = createSlice({
  name: 'localidad',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocalidades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocalidades.fulfilled, (state, action: PayloadAction<Localidad[]>) => {
        state.loading = false;
        state.localidades = action.payload;
      })
      .addCase(fetchLocalidades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getLocalidadesByDistrito.fulfilled, (state, action: PayloadAction<Localidad[]>) => {
        state.loading = false;
        state.localidades = action.payload;
      })
      .addCase(getLocalidad.fulfilled, (state, action: PayloadAction<Localidad>) => {
        state.loading = false;
        state.selectedLocalidad = action.payload;
      })
      .addCase(addLocalidad.fulfilled, (state, action: PayloadAction<Localidad>) => {
        state.loading = false;
        state.localidades.push(action.payload);
      })
      .addCase(updateLocalidad.fulfilled, (state, action: PayloadAction<Localidad>) => {
        state.loading = false;
        const index = state.localidades.findIndex(loc => loc.id_localidad === action.payload.id_localidad);
        if (index !== -1) {
          state.localidades[index] = action.payload;
        }
      })
      .addCase(deleteLocalidad.fulfilled, (state, action: PayloadAction<{ id_localidad: string }>) => {
        state.loading = false;
        state.localidades = state.localidades.filter(loc => loc.id_localidad !== action.payload.id_localidad);
      });
  },
});

export const { clearErrors } = localidadSlice.actions;
export const localidadReducer = localidadSlice.reducer;
