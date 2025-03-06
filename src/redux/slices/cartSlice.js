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
        item => item.id === newItem.id && item.size === newItem.size
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
      const { id, size } = action.payload;
      const existingItem = state.items.find(item => item.id === id && item.size === size);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(item => !(item.id === id && item.size === size));
      }
    },
    
    updateCartItemQuantity(state, action) {
      const { id, size, quantity } = action.payload;
      const item = state.items.find(item => item.id === id && item.size === size);
      
      if (item) {
        state.totalQuantity = state.totalQuantity - item.quantity + quantity;
        state.totalAmount = state.totalAmount - (item.price * item.quantity) + (item.price * quantity);
        item.quantity = quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;