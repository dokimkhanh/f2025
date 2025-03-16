import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

// Async thunk for fetching all dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  stats: {
    orderCount: 0,
    revenue: 0,
    productCount: 0,
    userCount: 0,
    loading: false,
    error: null
  },
  recentOrders: {
    data: [],
    loading: false,
    error: null
  },
  topProducts: {
    data: [],
    loading: false,
    error: null
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchDashboardData
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.stats.loading = true;
        state.recentOrders.loading = true;
        state.topProducts.loading = true;
        state.stats.error = null;
        state.recentOrders.error = null;
        state.topProducts.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.recentOrders.loading = false;
        state.topProducts.loading = false;
        
        // Update stats
        state.stats.orderCount = action.payload.orderCount;
        state.stats.revenue = action.payload.revenue;
        state.stats.productCount = action.payload.productCount;
        state.stats.userCount = action.payload.userCount;
        
        // Update recent orders
        state.recentOrders.data = action.payload.recentOrders || [];
        
        // Update top products
        state.topProducts.data = action.payload.topProducts || [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.stats.loading = false;
        state.recentOrders.loading = false;
        state.topProducts.loading = false;
        state.stats.error = action.payload;
        state.recentOrders.error = action.payload;
        state.topProducts.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;