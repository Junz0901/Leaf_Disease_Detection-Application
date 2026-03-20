import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    registeredUsers: [{ email: 'admin@leaf.com', password: 'Admin123!', name: 'Admin' }], // Mock database
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        registerUser: (state, action) => {
            const { email, password, name } = action.payload;
            // Add to mock database if not already exists
            const exists = state.registeredUsers.find(u => u.email === email);
            if (!exists) {
                state.registeredUsers.push({ email, password, name });
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, registerUser } = authSlice.actions;
export default authSlice.reducer;
