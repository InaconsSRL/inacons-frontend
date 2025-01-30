import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    listDivisasService,
    addDivisaService,
    updateDivisaService,
    deleteDivisaService
} from '../services/divisaService';

// Interfaces
export interface Divisa {
    id: string;
    nombre: string;
    abreviatura: string;
    simbolo: string;
    region: string;
}

interface DivisaState {
    divisas: Divisa[];
    loading: boolean;
    error: string | null;
}

// Estado inicial
const initialState: DivisaState = {
    divisas: [],
    loading: false,
    error: null,
};

// Función auxiliar para manejar errores
const handleError = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

// Thunks
export const fetchDivisas = createAsyncThunk(
    'divisa/fetchDivisas',
    async (_, { rejectWithValue }) => {
        try {
            return await listDivisasService();
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const addDivisa = createAsyncThunk(
    'divisa/addDivisa',
    async (divisaData: Omit<Divisa, 'id'>, { rejectWithValue }) => {
        try {
            return await addDivisaService(divisaData);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateDivisa = createAsyncThunk(
    'divisa/updateDivisa',
    async ({ updateDivisaId, ...rest }: { updateDivisaId: string } & Partial<Omit<Divisa, 'id'>>, { rejectWithValue }) => {
        try {
            return await updateDivisaService({ updateDivisaId, ...rest });
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const deleteDivisa = createAsyncThunk(
    'divisa/deleteDivisa',
    async (id: string, { rejectWithValue }) => {
        try {
            return await deleteDivisaService(id);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

// Slice
const divisaSlice = createSlice({
    name: 'divisa',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDivisas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDivisas.fulfilled, (state, action: PayloadAction<Divisa[]>) => {
                state.loading = false;
                state.divisas = action.payload;
            })
            .addCase(fetchDivisas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addDivisa.fulfilled, (state, action: PayloadAction<Divisa>) => {
                state.divisas.push(action.payload);
            })
            .addCase(updateDivisa.fulfilled, (state, action: PayloadAction<Divisa>) => {
                const index = state.divisas.findIndex(divisa => divisa.id === action.payload.id);
                if (index !== -1) {
                    state.divisas[index] = action.payload;
                }
            })
            .addCase(deleteDivisa.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
                state.divisas = state.divisas.filter(divisa => divisa.id !== action.payload.id);
            });
    },
});

export const divisaReducer = divisaSlice.reducer;
