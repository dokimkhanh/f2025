import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './features/menuSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice'

export const store = configureStore({
    reducer: {
        menu: menuReducer,
        cart: cartReducer,
        product: productReducer,
    },
});
