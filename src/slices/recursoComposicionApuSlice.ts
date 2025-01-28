import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listRecursosComposicionApuService,
  getRecursoComposicionApuService,
  addRecursoComposicionApuService,
  updateRecursoComposicionApuService,
  deleteRecursoComposicionApuService
} from '../services/recursoComposicionApuService';
import { RootState } from '../store/store';

interface UnidadPresupuesto {
  id_unidad: string;
  descripcion: string;
  abreviatura_unidad: string;
}

interface RecursoPresupuesto {
  id_recurso: string;
  nombre: string;
}

export interface RecursoComposicionApu {
  id_rec_comp_apu: string;
  id_recurso: string;
  nombre: string;
  especificaciones: string;
  descripcion: string;
  fecha_creacion: string;
  unidad_presupuesto: UnidadPresupuesto;
  recurso_presupuesto?: RecursoPresupuesto;
}

interface RecursoComposicionApuState {
  recursosComposicionApu: RecursoComposicionApu[];
  selectedRecursoComposicionApu: RecursoComposicionApu | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecursoComposicionApuState = {
  recursosComposicionApu: [],
  selectedRecursoComposicionApu: null,
  loading: false,
  error: null,
};

export const fetchRecursosComposicionApu = createAsyncThunk(
  'recursoComposicionApu/fetchRecursosComposicionApu',
  async (_, { rejectWithValue }) => {
    try {
      return await listRecursosComposicionApuService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getRecursoComposicionApu = createAsyncThunk(
  'recursoComposicionApu/getRecursoComposicionApu',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getRecursoComposicionApuService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addRecursoComposicionApu = createAsyncThunk(
  'recursoComposicionApu/addRecursoComposicionApu',
  async (data: {
    idRecurso: string;
    idUnidad: string;
    nombre: string;
    especificaciones?: string;
    descripcion?: string;
  }, { rejectWithValue }) => {
    try {
      return await addRecursoComposicionApuService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateRecursoComposicionApu = createAsyncThunk(
  'recursoComposicionApu/updateRecursoComposicionApu',
  async (data: {
    idRecCompApu: string;
    idRecurso?: string;
    idUnidad?: string;
    nombre?: string;
    especificaciones?: string;
    descripcion?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateRecursoComposicionApuService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteRecursoComposicionApu = createAsyncThunk(
  'recursoComposicionApu/deleteRecursoComposicionApu',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteRecursoComposicionApuService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const recursoComposicionApuSlice = createSlice({
  name: 'recursoComposicionApu',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecursosComposicionApu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecursosComposicionApu.fulfilled, (state, action: PayloadAction<RecursoComposicionApu[]>) => {
        state.loading = false;
        state.recursosComposicionApu = action.payload;
      })
      .addCase(fetchRecursosComposicionApu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getRecursoComposicionApu.fulfilled, (state, action: PayloadAction<RecursoComposicionApu>) => {
        state.loading = false;
        state.selectedRecursoComposicionApu = action.payload;
      })
      .addCase(addRecursoComposicionApu.fulfilled, (state, action: PayloadAction<RecursoComposicionApu>) => {
        state.loading = false;
        state.recursosComposicionApu.push(action.payload);
      })
      .addCase(updateRecursoComposicionApu.fulfilled, (state, action: PayloadAction<RecursoComposicionApu>) => {
        state.loading = false;
        const index = state.recursosComposicionApu.findIndex(
          recurso => recurso.id_rec_comp_apu === action.payload.id_rec_comp_apu
        );
        if (index !== -1) {
          state.recursosComposicionApu[index] = action.payload;
        }
      })
      .addCase(deleteRecursoComposicionApu.fulfilled, (state, action: PayloadAction<{ id_rec_comp_apu: string }>) => {
        state.loading = false;
        state.recursosComposicionApu = state.recursosComposicionApu.filter(
          recurso => recurso.id_rec_comp_apu !== action.payload.id_rec_comp_apu
        );
      });
  },
});

export const { clearErrors } = recursoComposicionApuSlice.actions;

export const selectRecursoComposicionApuWithDetails = (state: RootState) => {
  const recursos = state.recursoComposicionApu.recursosComposicionApu;
  const unidades = state.unidadPresupuesto.unidadesPresupuesto;
  const recursosPresupuesto = state.recursoPresupuesto.recursosPresupuesto;

  return recursos.map(recurso => ({
    ...recurso,
    unidad_presupuesto_completa: unidades.find(u => u.id_unidad === recurso.unidad_presupuesto.id_unidad),
    recurso_presupuesto_completo: recursosPresupuesto.find(rp => rp.id_recurso === recurso.recurso_presupuesto?.id_recurso)
  }));
};

export const recursoComposicionApuReducer = recursoComposicionApuSlice.reducer;
