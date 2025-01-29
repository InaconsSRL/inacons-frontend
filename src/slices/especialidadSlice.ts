import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listEspecialidadesService,
  getEspecialidadService,
  addEspecialidadService,
  updateEspecialidadService,
  deleteEspecialidadService,
} from '../services/especialidadService';

export interface Especialidad {
  id_especialidad: string;
  nombre: string;
  descripcion: string;
}

export interface CreateEspecialidadDto {
  nombre: string;
  descripcion: string;
}

interface EspecialidadState {
  especialidades: Especialidad[];
  selectedEspecialidad: Especialidad | null;
  loading: boolean;
  error: string | null;
}

const initialState: EspecialidadState = {
  especialidades: [],
  selectedEspecialidad: null,
  loading: false,
  error: null,
};

export const fetchEspecialidades = createAsyncThunk(
  'especialidad/fetchEspecialidades',
  async (_, { rejectWithValue }) => {
    try {
      return await listEspecialidadesService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getEspecialidad = createAsyncThunk(
  'especialidad/getEspecialidad',
  async (id_especialidad: string, { rejectWithValue }) => {
    try {
      return await getEspecialidadService(id_especialidad);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addEspecialidad = createAsyncThunk(
  'especialidad/addEspecialidad',
  async (data: CreateEspecialidadDto, { rejectWithValue }) => {
    try {
      return await addEspecialidadService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateEspecialidad = createAsyncThunk(
  'especialidad/updateEspecialidad',
  async (data: {
    id_especialidad: string;
    nombre?: string;
    descripcion?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateEspecialidadService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteEspecialidad = createAsyncThunk(
  'especialidad/deleteEspecialidad',
  async (id_especialidad: string, { rejectWithValue }) => {
    try {
      return await deleteEspecialidadService(id_especialidad);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const especialidadSlice = createSlice({
  name: 'especialidad',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Especialidades
      .addCase(fetchEspecialidades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEspecialidades.fulfilled, (state, action: PayloadAction<Especialidad[]>) => {
        state.loading = false;
        state.especialidades = action.payload;
      })
      .addCase(fetchEspecialidades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Especialidad
      .addCase(getEspecialidad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEspecialidad.fulfilled, (state, action: PayloadAction<Especialidad>) => {
        state.loading = false;
        state.selectedEspecialidad = action.payload;
      })
      .addCase(getEspecialidad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Especialidad
      .addCase(addEspecialidad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEspecialidad.fulfilled, (state, action: PayloadAction<Especialidad>) => {
        state.loading = false;
        state.especialidades.push(action.payload);
      })
      .addCase(addEspecialidad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Especialidad
      .addCase(updateEspecialidad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEspecialidad.fulfilled, (state, action: PayloadAction<Especialidad>) => {
        state.loading = false;
        const index = state.especialidades.findIndex(
          (esp) => esp.id_especialidad === action.payload.id_especialidad
        );
        if (index !== -1) {
          state.especialidades[index] = action.payload;
        }
      })
      .addCase(updateEspecialidad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Especialidad
      .addCase(deleteEspecialidad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEspecialidad.fulfilled, (state, action: PayloadAction<{ id_especialidad: string }>) => {
        state.loading = false;
        state.especialidades = state.especialidades.filter(
          (esp) => esp.id_especialidad !== action.payload.id_especialidad
        );
      })
      .addCase(deleteEspecialidad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = especialidadSlice.actions;
export const especialidadReducer = especialidadSlice.reducer;
