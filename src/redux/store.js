import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './features/menuSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice'
import categoryReducer from './slices/categorySlice'
import authReducer from './features/authSlice';
import profileReducer from './features/profileSlice';
import wishlistReducer from './slices/wishlistSlice';

export const store = configureStore({
    reducer: {
        menu: menuReducer,
        cart: cartReducer,
        product: productReducer,
        category: categoryReducer,
        auth: authReducer,
        profile: profileReducer,
        wishlist: wishlistReducer,
    },
});
