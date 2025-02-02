import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  listProyectosService,
  getProyectoService,
  addProyectoService,
  updateProyectoService,
  deleteProyectoService
} from '../services/proyectoService';

export interface Proyecto {
  id_proyecto: string;
  id_usuario: string;
  id_infraestructura: string;
  nombre_proyecto: string;
  id_departamento: string;
  id_provincia: string;
  id_distrito: string;
  id_localidad?: string;
  total_proyecto?: number;
  estado: string;
  fecha_creacion: string;
  cliente: string;
  empresa: string;
  plazo: number;
  ppto_base: number;
  ppto_oferta: number;
  jornada: number;
}

interface ProyectoState {
  proyectos: Proyecto[];
  selectedProyecto: Proyecto | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProyectoState = {
  proyectos: [],
  selectedProyecto: null,
  loading: false,
  error: null,
};

export const fetchProyectos = createAsyncThunk(
  'proyecto/fetchProyectos',
  async (_, { rejectWithValue }) => {
    try {
      return await listProyectosService();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getProyecto = createAsyncThunk(
  'proyecto/getProyecto',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getProyectoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addProyecto = createAsyncThunk(
  'proyecto/addProyecto',
  async (data: {
    id_usuario: string;
    id_infraestructura: string;
    nombre_proyecto: string;
    id_departamento: string;
    id_provincia: string;
    id_distrito: string;
    estado: string;
    cliente: string;
    empresa: string;
    plazo: number;
    ppto_base: number;
    ppto_oferta: number;
    jornada: number;
    id_localidad?: string;
    total_proyecto?: number;
  }, { rejectWithValue }) => {
    try {
      return await addProyectoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProyecto = createAsyncThunk(
  'proyecto/updateProyecto',
  async (data: {
    id_proyecto: string;
    jornada?: number;
    ppto_oferta?: number;
    ppto_base?: number;
    plazo?: number;
    empresa?: string;
    cliente?: string;
    total_proyecto?: number;
    estado?: string;
    nombre_proyecto?: string;
    id_infraestructura?: string;
    id_usuario?: string;
    id_departamento?: string;
    id_provincia?: string;
    id_distrito?: string;
    id_localidad?: string;
  }, { rejectWithValue }) => {
    try {
      return await updateProyectoService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteProyecto = createAsyncThunk(
  'proyecto/deleteProyecto',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteProyectoService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const proyectoSlice = createSlice({
  name: 'proyecto',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProyectos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProyectos.fulfilled, (state, action: PayloadAction<Proyecto[]>) => {
        state.loading = false;
        state.proyectos = action.payload;
      })
      .addCase(fetchProyectos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getProyecto.fulfilled, (state, action: PayloadAction<Proyecto>) => {
        state.loading = false;
        state.selectedProyecto = action.payload;
      })
      .addCase(addProyecto.fulfilled, (state, action: PayloadAction<Proyecto>) => {
        state.loading = false;
        state.proyectos.push(action.payload);
      })
      .addCase(updateProyecto.fulfilled, (state, action: PayloadAction<Proyecto>) => {
        state.loading = false;
        const index = state.proyectos.findIndex(p => p.id_proyecto === action.payload.id_proyecto);
        if (index !== -1) {
          state.proyectos[index] = action.payload;
        }
      })
      .addCase(deleteProyecto.fulfilled, (state, action: PayloadAction<{ id_proyecto: string }>) => {
        state.loading = false;
        state.proyectos = state.proyectos.filter(p => p.id_proyecto !== action.payload.id_proyecto);
      });
  },
});

export const { clearErrors } = proyectoSlice.actions;
export const proyectoReducer = proyectoSlice.reducer;
