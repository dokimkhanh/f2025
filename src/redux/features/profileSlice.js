import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

// Thunk để thêm địa chỉ mới
export const addUserAddress = createAsyncThunk(
    'profile/addAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            const response = await api.post('/profile/address', {
                address: addressData
            });
            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Thêm địa chỉ thất bại' });
        }
    }
);

// Thunk để cập nhật địa chỉ
export const updateUserAddress = createAsyncThunk(
    'profile/updateAddress',
    async ({ addressId, addressData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/profile/address/${addressId}`, {
                address: addressData
            });
            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Cập nhật địa chỉ thất bại' });
        }
    }
);

// Thunk để đặt địa chỉ mặc định
export const setDefaultAddress = createAsyncThunk(
    'profile/setDefaultAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            const response = await api.put(`/profile/address/${addressId}/default`);
            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Đặt địa chỉ mặc định thất bại' });
        }
    }
);

// Thunk để xóa địa chỉ
export const deleteUserAddress = createAsyncThunk(
    'profile/deleteAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/profile/address/${addressId}`);
            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Xóa địa chỉ thất bại' });
        }
    }
);

// Lấy thông tin user từ localStorage
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
    user: user || null,
    loading: false,
    error: null
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfileError: (state) => {
            state.error = null;
        },
        updateUserState: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Thêm địa chỉ
            .addCase(addUserAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUserAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(addUserAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Thêm địa chỉ thất bại';
            })

            // Cập nhật địa chỉ
            .addCase(updateUserAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUserAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Cập nhật địa chỉ thất bại';
            })

            // Đặt địa chỉ mặc định
            .addCase(setDefaultAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setDefaultAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(setDefaultAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Đặt địa chỉ mặc định thất bại';
            })

            // Xóa địa chỉ
            .addCase(deleteUserAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUserAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(deleteUserAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Xóa địa chỉ thất bại';
            });
    }
});

export const { clearProfileError, updateUserState } = profileSlice.actions;

export const selectProfile = (state) => state.profile;
export const selectProfileUser = (state) => state.profile.user;

export default profileSlice.reducer;