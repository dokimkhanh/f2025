import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ListAllCategories } from '../../services/category';

// Async thunk for fetching all categories
export const GetAllCategories = createAsyncThunk(
  'category/getAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ListAllCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(GetAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;