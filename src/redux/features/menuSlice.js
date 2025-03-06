// src/redux/features/menuSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isMenuOpen: false,
};

export const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        toggleMenu: (state) => {
            state.isMenuOpen = !state.isMenuOpen;
        },
        closeMenu: (state) => {
            state.isMenuOpen = false;
        },
        openMenu: (state) => {
            state.isMenuOpen = true;
        },
    },
});

export const { toggleMenu, closeMenu, openMenu } = menuSlice.actions;

export const selectIsMenuOpen = (state) => state.menu.isMenuOpen;

export default menuSlice.reducer;
