import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserService } from '../services/userService';

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