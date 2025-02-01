import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getComposicionesApuByTituloService,
  addComposicionApuService,
  updateComposicionApuService,
  deleteComposicionApuService
} from '../services/composicionApuService';
import { updatePrecioRecursoProyecto, addPrecioRecursoProyecto } from '../slices/precioRecursoProyectoSlice';

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
  id_composicion_apu: string;
  id_titulo: string;
  rec_comp_apu: RecursoComposicionApu;
  cuadrilla: number;
  cantidad: number;
  fecha_creacion: string;
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
  async ({id_titulo, id_proyecto}: {id_titulo: string, id_proyecto: string}, { rejectWithValue }) => {
    try {
      const result = await getComposicionesApuByTituloService(id_titulo, id_proyecto);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addComposicionApu = createAsyncThunk(
  'composicionApu/addComposicionApu',
  async (data: {
    id_titulo: string;
    id_rec_comp_apu: string;
    cuadrilla: number;
    cantidad: number;
  }, { rejectWithValue }) => {
    try {
      const result = await addComposicionApuService(data);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateComposicionApu = createAsyncThunk(
  'composicionApu/updateComposicionApu',
  async (data: {
    id_composicion_apu: string;
    id_rec_comp_apu?: string;
    cuadrilla?: number;
    cantidad?: number;
  }, { rejectWithValue }) => {
    try {
      const result = await updateComposicionApuService(data);
      // Después de actualizar la composición, disparar una acción para actualizar los títulos
      return result;
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
      .addCase(addComposicionApu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComposicionApu.fulfilled, (state, action: PayloadAction<ComposicionApuWithRelations>) => {
        state.loading = false;
        const newComposicion = action.payload;
        
        // Asegurarse de que todos los campos necesarios estén presentes
        if (newComposicion.rec_comp_apu) {
          // Mantener la referencia a precio_recurso_proyecto si existe
          if (newComposicion.rec_comp_apu.precio_recurso_proyecto) {
            newComposicion.rec_comp_apu.precio_recurso_proyecto = {
              ...newComposicion.rec_comp_apu.precio_recurso_proyecto
            };
          }
          
          // Mantener la referencia a unidad_presupuesto si existe
          if (newComposicion.rec_comp_apu.unidad_presupuesto) {
            newComposicion.rec_comp_apu.unidad_presupuesto = {
              ...newComposicion.rec_comp_apu.unidad_presupuesto
            };
          }
          
          // Mantener la referencia a recurso_presupuesto si existe
          if (newComposicion.rec_comp_apu.recurso_presupuesto) {
            newComposicion.rec_comp_apu.recurso_presupuesto = {
              ...newComposicion.rec_comp_apu.recurso_presupuesto
            };
          }
        }

        state.composicionesApu.push(newComposicion);
      })
      .addCase(addComposicionApu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateComposicionApu.fulfilled, (state, action: PayloadAction<ComposicionApuWithRelations>) => {
        state.loading = false;
        const updatedItem = action.payload;
        const index = state.composicionesApu.findIndex(
          (comp) => comp.id_composicion_apu === updatedItem.id_composicion_apu
        );
        if (index !== -1) {
          const existing = state.composicionesApu[index];
          // Mezcla la data nueva con la existente
          state.composicionesApu[index] = {
            ...existing,
            ...updatedItem,
            rec_comp_apu: {
              ...existing.rec_comp_apu,
              ...updatedItem.rec_comp_apu,
              recurso_presupuesto: {
                ...existing.rec_comp_apu.recurso_presupuesto,
                ...updatedItem.rec_comp_apu?.recurso_presupuesto,
              },
              unidad_presupuesto: {
                ...existing.rec_comp_apu.unidad_presupuesto,
                ...updatedItem.rec_comp_apu?.unidad_presupuesto,
              },
              precio_recurso_proyecto: {
                ...existing.rec_comp_apu.precio_recurso_proyecto,
                ...updatedItem.rec_comp_apu?.precio_recurso_proyecto,
              },
            },
          };
        }
      })
      .addCase(deleteComposicionApu.fulfilled, (state, action: PayloadAction<{ id_composicion_apu: string }>) => {
        state.loading = false;
        state.composicionesApu = state.composicionesApu.filter(
          comp => comp.id_composicion_apu !== action.payload.id_composicion_apu
        );
      })
      .addCase(updatePrecioRecursoProyecto.fulfilled, (state, action: PayloadAction<PrecioRecursoProyecto>) => {
        const updatedPrice = action.payload;
        const compIndex = state.composicionesApu.findIndex(
          comp => comp.rec_comp_apu.id_rec_comp_apu === updatedPrice.id_rec_comp_apu
        );
        if (compIndex !== -1) {
          state.composicionesApu[compIndex].rec_comp_apu.precio_recurso_proyecto = {
            ...state.composicionesApu[compIndex].rec_comp_apu.precio_recurso_proyecto,
            ...updatedPrice
          };
        }
      })
      .addCase(addPrecioRecursoProyecto.fulfilled, (state, action) => {
        const newPrecio = action.payload;
        state.composicionesApu = state.composicionesApu.map(comp => {
          if (comp.rec_comp_apu.id_rec_comp_apu === newPrecio.id_rec_comp_apu) {
            return {
              ...comp,
              rec_comp_apu: {
                ...comp.rec_comp_apu,
                precio_recurso_proyecto: newPrecio
              }
            };
          }
          return comp;
        });
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
