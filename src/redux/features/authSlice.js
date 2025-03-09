import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

// Thunk để đăng nhập
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            // Lưu token vào localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Đăng nhập thất bại' });
        }
    }
);

// Thunk để lấy thông tin người dùng từ token
export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/profile');
            const userData = response.data.user;
            localStorage.setItem('user', JSON.stringify(userData));
            
            return userData;
        } catch (error) {
            // Nếu token không hợp lệ hoặc hết hạn
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            return rejectWithValue(error.response?.data || { message: 'Không thể lấy thông tin người dùng' });
        }
    }
);

// Thunk để đăng xuất
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
    }
);

// Khởi tạo state từ localStorage (nếu có)
const token = localStorage.getItem('token');
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
    token: token || null,
    user: user || null,
    isAuthenticated: !!token,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý đăng nhập
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Đăng nhập thất bại';
            })

            // Xử lý lấy thông tin người dùng
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                if (action.payload?.status === 401) {
                    state.token = null;
                    state.user = null;
                    state.isAuthenticated = false;
                }
                state.error = action.payload?.message;
            })

            // Xử lý đăng xuất
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
            });
    }
});

export const { clearError } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;