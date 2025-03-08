import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ListAllProduct } from '../../services/product';

// Async thunk for fetching a single product
export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id) => {
    // In a real app, replace this with an actual API call
    // const response = await fetch(`/api/products/${id}`);
    // return response.json();

    // Mock data for demonstration
    return {
      id,
      name: "Premium Cotton T-Shirt",
      price: 350000,
      discountPrice: 299000,
      description: "High-quality cotton t-shirt with modern design, suitable for various styles and occasions.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Navy Blue"],
      images: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
      ],
      rating: 4.5,
      reviews: 120,
    };
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    currentProduct: null,
    loading: false,
    error: null,
    products: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(GetAllProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAllProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(GetAllProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const GetAllProduct = createAsyncThunk('product/getall', async () => {
  const res = await ListAllProduct()
  return res.products
})

export default productSlice.reducer;