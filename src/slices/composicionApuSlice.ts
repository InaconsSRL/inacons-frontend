import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getComposicionesApuByTituloService,
  addComposicionApuService,
  updateComposicionApuService,
  deleteComposicionApuService
} from '../services/composicionApuService';

// Interface para el listado con relaciones
interface PrecioRecursoProyecto {
  id_prp: string;
  id_proyecto: string;
  id_rec_comp_apu: string;
  precio: number;
  fecha_creacion: string;
}

interface UnidadPresupuesto {
  id_unidad: string;
  abreviatura_unidad: string;
  descripcion: string;
}

interface RecursoPresupuesto {
  id_recurso: string;
  id_unidad: string;
  id_clase: string;
  id_tipo: string;
  tipo?: ITipo;
  id_recurso_app: string;
  nombre: string;
  precio_referencial: number;
  fecha_actualizacion: string; // Cambiado de Date a string
}

export interface ITipo {
  id_tipo: string;
  descripcion: string;
  codigo: string;
}


interface RecursoComposicionApu {
  id_rec_comp_apu: string;
  nombre: string;
  especificaciones: string;
  descripcion: string;
  fecha_creacion: string;
  recurso_presupuesto: RecursoPresupuesto;
  unidad_presupuesto: UnidadPresupuesto;
  precio_recurso_proyecto: PrecioRecursoProyecto;
}

interface ComposicionApuWithRelations {
  rec_comp_apu: RecursoComposicionApu;
  cuadrilla: number;
  cantidad: number;
  fecha_creacion: string;
  id_composicion_apu: string;
  id_titulo: string;
}

interface ComposicionApuState {
  composicionesApu: ComposicionApuWithRelations[];
  selectedComposicionApu: ComposicionApuWithRelations | null;
  loading: boolean;
  error: string | null;
}

const initialState: ComposicionApuState = {
  composicionesApu: [],
  selectedComposicionApu: null,
  loading: false,
  error: null,
};

export const getComposicionesApuByTitulo = createAsyncThunk(
  'composicionApu/getComposicionesApuByTitulo',
  async ({idTitulo, idProyecto}: {idTitulo: string, idProyecto: string}, { rejectWithValue }) => {
    try {
      return await getComposicionesApuByTituloService(idTitulo, idProyecto);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addComposicionApu = createAsyncThunk(
  'composicionApu/addComposicionApu',
  async (data: {
    idTitulo: string;
    idRecCompApu: string;
    cuadrilla: number;
    cantidad: number;
  }, { rejectWithValue }) => {
    try {
      return await addComposicionApuService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateComposicionApu = createAsyncThunk(
  'composicionApu/updateComposicionApu',
  async (data: {
    idComposicionApu: string;
    idRecCompApu?: string;
    cuadrilla?: number;
    cantidad?: number;
  }, { rejectWithValue }) => {
    try {
      return await updateComposicionApuService(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteComposicionApu = createAsyncThunk(
  'composicionApu/deleteComposicionApu',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteComposicionApuService(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const composicionApuSlice = createSlice({
  name: 'composicionApu',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComposicionesApuByTitulo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComposicionesApuByTitulo.fulfilled, (state, action: PayloadAction<ComposicionApuWithRelations[]>) => {
        state.loading = false;
        state.composicionesApu = action.payload;
      })
      .addCase(getComposicionesApuByTitulo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    //   .addCase(addComposicionApu.fulfilled, (state, action: PayloadAction<ComposicionApuBase>) => {
      .addCase(addComposicionApu.fulfilled, (state) => {
        state.loading = false;
        // Aquí necesitarías convertir ComposicionApuBase a ComposicionApuWithRelations
        // o recargar los datos completos
      })
    //   .addCase(updateComposicionApu.fulfilled, (state, action: PayloadAction<ComposicionApuBase>) => {
      .addCase(updateComposicionApu.fulfilled, (state) => {
        state.loading = false;
        // Similar al add, necesitarías manejar la actualización considerando las relaciones
      })
      .addCase(deleteComposicionApu.fulfilled, (state, action: PayloadAction<{ id_composicion_apu: string }>) => {
        state.loading = false;
        state.composicionesApu = state.composicionesApu.filter(
          comp => comp.id_composicion_apu !== action.payload.id_composicion_apu
        );
      });
  },
});

import { RootState } from '../store/store';

// Selectores
export const selectComposicionesApuWithRecursos = (state: RootState) => {
  const composiciones = state.composicionApu.composicionesApu;
  const recursos = state.recursoComposicionApu.recursosComposicionApu;
  const precios = state.precioRecursoProyecto.preciosRecursoProyecto;
  
  return composiciones.map(composicion => ({
    ...composicion,
    rec_comp_apu: {
      ...composicion.rec_comp_apu,
      recurso_completo: recursos.find(r => r.id_rec_comp_apu === composicion.rec_comp_apu.id_rec_comp_apu),
      precios_historial: precios.filter(p => p.id_rec_comp_apu === composicion.rec_comp_apu.id_rec_comp_apu)
    }
  }));
};

export const { clearErrors } = composicionApuSlice.actions;
export const composicionApuReducer = composicionApuSlice.reducer;
