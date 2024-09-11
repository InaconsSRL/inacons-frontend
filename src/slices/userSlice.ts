import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from '../actions/userActions'; 

interface UserState {
    id: string | null;
    username: string | null;
    token: string | null;
}

const initialState: UserState = {
    id: null,
    username: null,
    token: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUser: (state) => {
            state.id = null;
            state.username = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
            const { usuario, id, token } = action.payload;
            state.id = id;
            state.username = usuario;
            state.token = token;
        });
    },
});

export const { clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
