// src/redux/features/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(
        item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
      );
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      
      state.totalQuantity += newItem.quantity;
      state.totalAmount += newItem.price * newItem.quantity;
    },
    
    removeFromCart(state, action) {
      const { id, size, color } = action.payload;
      const existingItem = state.items.find(
        item => item.id === id && item.size === size && item.color === color
      );
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(
          item => !(item.id === id && item.size === size && item.color === color)
        );
      }
    },
    
    updateCartItemQuantity(state, action) {
      const { id, size, color, quantity } = action.payload;
      const item = state.items.find(
        item => item.id === id && item.size === size && item.color === color
      );
      
      if (item) {
        state.totalQuantity = state.totalQuantity - item.quantity + quantity;
        state.totalAmount = state.totalAmount - (item.price * item.quantity) + (item.price * quantity);
        item.quantity = quantity;
      }
    },
  },
});

// Export the selector function
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;

export const { addToCart, removeFromCart, updateCartItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
