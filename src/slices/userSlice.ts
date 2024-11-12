import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserService } from '../services/userService';

interface UserState {
    id: string | null;
    usuario: string | null;
    token: string | null;
}

// Definimos una interfaz para la carga útil de la acción de login
interface LoginPayload {
    usuario: string;
    id: string;
    token: string;
}

const initialState: UserState = {
    id: null,
    usuario: null,
    token: null,
};

export const loginUser = createAsyncThunk(
    'user/login',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const loginData = await loginUserService(username, password);
            return loginData;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser: (state) => {
            state.id = null;
            state.usuario = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginPayload>) => {
            const { usuario, id, token } = action.payload;
            state.id = id;
            state.usuario = usuario;
            state.token = token;
        });
    },
});

export const { clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;




