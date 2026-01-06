import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'ADMIN' | 'USER';
    profilePicture?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        loginFailure: (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
